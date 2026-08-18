import * as THREE from "three";

import { MediaManager, type ManagedMediaHandle } from "./MediaManager";
import type {
  MediaContent,
  SurfaceConfiguration,
  SurfaceDefinition,
  SurfaceKey,
  Vector3Tuple,
} from "../types/audiovisual";

type SurfaceRecord = {
  definition: SurfaceDefinition;
  group: THREE.Group;
  geometry: THREE.PlaneGeometry;
  baseMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshPhysicalMaterial>;
  mediaMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  frameGeometry: THREE.BoxGeometry | null;
  frameMaterial: THREE.MeshStandardMaterial | null;
  frameMesh: THREE.Mesh | null;
  mediaHandle: ManagedMediaHandle | null;
  mediaKey: string | null;
  releaseMediaWhenHidden: boolean;
  targetPosition: THREE.Vector3;
  targetRotation: THREE.Vector3;
  targetScale: THREE.Vector3;
  targetBaseOpacity: number;
  targetMediaOpacity: number;
  targetFrameOpacity: number;
};

const DEFAULT_POSITION: Vector3Tuple = [0, 0, 0];
const DEFAULT_ROTATION: Vector3Tuple = [0, 0, 0];
const DEFAULT_SCALE: Vector3Tuple = [1, 1, 1];

export class SurfaceManager {
  readonly root = new THREE.Group();

  private readonly records = new Map<SurfaceKey, SurfaceRecord>();
  private disposed = false;

  constructor(private readonly mediaManager: MediaManager) {
    this.root.name = "SURFACES";
  }

  register(definition: SurfaceDefinition, parent: THREE.Object3D = this.root): void {
    if (this.disposed || this.records.has(definition.id)) {
      return;
    }

    const geometry = new THREE.PlaneGeometry(definition.width, definition.height);
    const materialProfile = definition.material ?? {};
    const baseMaterial = new THREE.MeshPhysicalMaterial({
      color: materialProfile.color ?? 0x090b0d,
      roughness: materialProfile.roughness ?? 0.82,
      metalness: materialProfile.metalness ?? 0.02,
      clearcoat: materialProfile.clearcoat ?? 0,
      clearcoatRoughness: materialProfile.clearcoatRoughness ?? 0.2,
      emissive: 0x000000,
      emissiveIntensity: 0,
      transparent: true,
      opacity: 0,
      side: THREE.FrontSide,
    });

    const mediaMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      toneMapped: false,
      depthWrite: false,
      side: THREE.FrontSide,
    });

    const group = new THREE.Group();
    group.name = definition.id;

    const baseMesh = new THREE.Mesh(geometry, baseMaterial);
    const mediaMesh = new THREE.Mesh(geometry, mediaMaterial);
    const frameDepth = definition.frame?.depth ?? 0.08;
    const planeOffset = definition.frame?.enabled ? frameDepth * 0.51 : 0;

    baseMesh.position.z = planeOffset;
    mediaMesh.position.z = planeOffset + 0.004;
    baseMesh.renderOrder = definition.renderOrder ?? 0;
    mediaMesh.renderOrder = (definition.renderOrder ?? 0) + 1;

    group.add(baseMesh, mediaMesh);

    let frameGeometry: THREE.BoxGeometry | null = null;
    let frameMaterial: THREE.MeshStandardMaterial | null = null;
    let frameMesh: THREE.Mesh | null = null;

    if (definition.frame?.enabled) {
      const border = definition.frame.border ?? 0.14;
      frameGeometry = new THREE.BoxGeometry(
        definition.width + border,
        definition.height + border,
        frameDepth
      );
      frameMaterial = new THREE.MeshStandardMaterial({
        color: definition.frame.color ?? 0x101214,
        roughness: 0.36,
        metalness: 0.7,
        transparent: true,
        opacity: 0,
      });
      frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
      frameMesh.position.z = 0;
      frameMesh.renderOrder = (definition.renderOrder ?? 0) - 1;
      group.add(frameMesh);
    }

    const position = definition.position ?? DEFAULT_POSITION;
    const rotation = definition.rotation ?? DEFAULT_ROTATION;
    const scale = definition.scale ?? DEFAULT_SCALE;

    group.position.set(position[0], position[1], position[2]);
    group.rotation.set(rotation[0], rotation[1], rotation[2]);
    group.scale.set(scale[0], scale[1], scale[2]);
    group.visible = false;

    const record: SurfaceRecord = {
      definition,
      group,
      geometry,
      baseMesh,
      mediaMesh,
      frameGeometry,
      frameMaterial,
      frameMesh,
      mediaHandle: null,
      mediaKey: null,
      releaseMediaWhenHidden: false,
      targetPosition: new THREE.Vector3(position[0], position[1], position[2]),
      targetRotation: new THREE.Vector3(rotation[0], rotation[1], rotation[2]),
      targetScale: new THREE.Vector3(scale[0], scale[1], scale[2]),
      targetBaseOpacity: 0,
      targetMediaOpacity: 0,
      targetFrameOpacity: 0,
    };

    this.records.set(definition.id, record);
    parent.add(group);
  }

  configure(configuration: SurfaceConfiguration): void {
    const record = this.records.get(configuration.id);

    if (!record || this.disposed) {
      return;
    }

    this.setTransformTargets(record, configuration);

    const visible = configuration.visible ?? true;
    const opacity = THREE.MathUtils.clamp(configuration.opacity ?? 1, 0, 1);
    const content = configuration.content;

    record.baseMesh.material.emissive.set(configuration.emissive ?? 0x000000);
    record.baseMesh.material.emissiveIntensity = configuration.intensity ?? 0;

    if (!visible || content.kind === "NONE") {
      record.targetBaseOpacity = 0;
      record.targetMediaOpacity = 0;
      record.targetFrameOpacity = 0;
      record.releaseMediaWhenHidden = true;
      return;
    }

    record.group.visible = true;
    record.targetFrameOpacity = record.frameMaterial ? opacity : 0;

    if (content.kind === "COLOR") {
      record.baseMesh.material.color.set(content.color);
      record.targetBaseOpacity = opacity;
      record.targetMediaOpacity = 0;
      record.releaseMediaWhenHidden = true;
      return;
    }

    const nextMediaKey = this.createMediaKey(content);

    if (record.mediaKey !== nextMediaKey) {
      this.releaseMedia(record);
      record.mediaHandle = this.mediaManager.create(content);
      record.mediaKey = record.mediaHandle ? nextMediaKey : null;
      record.mediaMesh.material.map = record.mediaHandle?.texture ?? null;
      record.mediaMesh.material.needsUpdate = true;
    }

    record.releaseMediaWhenHidden = false;
    record.targetBaseOpacity = record.definition.baseVisible === false ? 0 : 1;
    record.targetMediaOpacity = record.mediaHandle ? opacity : 0;
  }

  configureMany(configurations: readonly SurfaceConfiguration[]): void {
    for (const configuration of configurations) {
      this.configure(configuration);
    }
  }

  update(deltaTime: number): void {
    if (this.disposed) {
      return;
    }

    const transformAlpha = 1 - Math.exp(-5.4 * deltaTime);
    const opacityAlpha = 1 - Math.exp(-6.2 * deltaTime);

    for (const record of this.records.values()) {
      record.group.position.lerp(record.targetPosition, transformAlpha);
      record.group.scale.lerp(record.targetScale, transformAlpha);
      record.group.rotation.x = THREE.MathUtils.lerp(
        record.group.rotation.x,
        record.targetRotation.x,
        transformAlpha
      );
      record.group.rotation.y = THREE.MathUtils.lerp(
        record.group.rotation.y,
        record.targetRotation.y,
        transformAlpha
      );
      record.group.rotation.z = THREE.MathUtils.lerp(
        record.group.rotation.z,
        record.targetRotation.z,
        transformAlpha
      );

      record.baseMesh.material.opacity = THREE.MathUtils.lerp(
        record.baseMesh.material.opacity,
        record.targetBaseOpacity,
        opacityAlpha
      );
      record.mediaMesh.material.opacity = THREE.MathUtils.lerp(
        record.mediaMesh.material.opacity,
        record.targetMediaOpacity,
        opacityAlpha
      );

      if (record.frameMaterial) {
        record.frameMaterial.opacity = THREE.MathUtils.lerp(
          record.frameMaterial.opacity,
          record.targetFrameOpacity,
          opacityAlpha
        );
      }

      if (
        record.releaseMediaWhenHidden &&
        record.mediaMesh.material.opacity < 0.01 &&
        record.targetMediaOpacity === 0
      ) {
        this.releaseMedia(record);
        record.releaseMediaWhenHidden = false;
      }

      const frameOpacity = record.frameMaterial?.opacity ?? 0;
      const maximumOpacity = Math.max(
        record.baseMesh.material.opacity,
        record.mediaMesh.material.opacity,
        frameOpacity,
        record.targetBaseOpacity,
        record.targetMediaOpacity,
        record.targetFrameOpacity
      );

      record.group.visible = maximumOpacity > 0.002;
    }
  }

  getObject(id: SurfaceKey): THREE.Group | null {
    return this.records.get(id)?.group ?? null;
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }

    this.disposed = true;

    for (const record of this.records.values()) {
      this.releaseMedia(record);
      record.geometry.dispose();
      record.baseMesh.material.dispose();
      record.mediaMesh.material.dispose();
      record.frameGeometry?.dispose();
      record.frameMaterial?.dispose();
      record.group.removeFromParent();
    }

    this.records.clear();
    this.root.removeFromParent();
    this.root.clear();
  }

  private setTransformTargets(
    record: SurfaceRecord,
    configuration: SurfaceConfiguration
  ): void {
    if (configuration.position) {
      record.targetPosition.set(
        configuration.position[0],
        configuration.position[1],
        configuration.position[2]
      );
    }

    if (configuration.rotation) {
      record.targetRotation.set(
        configuration.rotation[0],
        configuration.rotation[1],
        configuration.rotation[2]
      );
    }

    if (configuration.scale) {
      record.targetScale.set(
        configuration.scale[0],
        configuration.scale[1],
        configuration.scale[2]
      );
    }
  }

  private releaseMedia(record: SurfaceRecord): void {
    record.mediaHandle?.release();
    record.mediaHandle = null;
    record.mediaKey = null;
    record.mediaMesh.material.map = null;
    record.mediaMesh.material.needsUpdate = true;
  }

  private createMediaKey(content: MediaContent): string {
    if (content.kind === "WEBCAM") {
      return `WEBCAM:${content.element ? "connected" : "prepared"}:${JSON.stringify(
        content.texture ?? {}
      )}`;
    }

    return JSON.stringify(content);
  }
}

