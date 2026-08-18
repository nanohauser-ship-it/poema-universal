import * as THREE from "three";

import { CameraDirector } from "./CameraDirector";
import { SurfaceManager } from "./SurfaceManager";
import type {
  BorderlessConfiguration,
  BorderlessStageId,
  ExperienceDefinition,
  MasterFrame,
  MediaContent,
  SurfaceConfiguration,
  SurfaceKey,
} from "../types/audiovisual";

type FadableMaterial =
  | THREE.MeshBasicMaterial
  | THREE.MeshStandardMaterial;

type TrackedMaterial = {
  material: FadableMaterial;
  baseOpacity: number;
  pulse: number;
};

type PortalLeaf = {
  mesh: THREE.Mesh;
  closedX: number;
  openX: number;
};

const PORTAL_SURFACE_IDS = [
  "FREE_SCREEN_PASSAGE_LEFT",
  "FREE_SCREEN_PASSAGE_BACK",
  "FREE_SCREEN_PASSAGE_RIGHT",
  "FREE_SCREEN_PASSAGE_FLOOR",
  "FREE_SCREEN_PASSAGE_CEILING",
] as const;

export class BorderlessDirector {
  readonly root = new THREE.Group();

  private readonly geometries = new Set<THREE.BufferGeometry>();
  private readonly materials = new Set<THREE.Material>();
  private readonly fadedMaterials: TrackedMaterial[] = [];
  private readonly accentMaterials: FadableMaterial[] = [];
  private readonly portalLeaves: PortalLeaf[] = [];
  private readonly surfaceMediaOverrides = new Map<SurfaceKey, MediaContent>();
  private readonly portalLight: THREE.PointLight;

  private configuration: BorderlessConfiguration | null = null;
  private baseRoomBackSurface: SurfaceConfiguration | null = null;
  private roomBackSurface: SurfaceConfiguration | null = null;
  private activeStage: BorderlessStageId = "ROOM";
  private targetArchitectureOpacity = 0;
  private targetOpening = 0;
  private opening = 0;
  private targetLightIntensity = 0;
  private targetArchitectureResponse = 4.2;
  private targetOpeningResponse = 3.15;
  private disposed = false;

  constructor(
    private readonly camera: CameraDirector,
    private readonly surfaces: SurfaceManager
  ) {
    this.root.name = "BORDERLESS_ARCHITECTURE";
    this.root.visible = false;
    this.portalLight = this.createArchitecture();
  }

  setExperience(experience: ExperienceDefinition): void {
    if (this.disposed) {
      return;
    }

    this.hideMediaSurfaces(this.configuration);
    this.configuration = experience.borderless?.enabled
      ? experience.borderless
      : null;
    this.baseRoomBackSurface =
      experience.surfaces.find((surface) => surface.id === "BACK") ?? null;
    this.roomBackSurface = this.baseRoomBackSurface;
    this.surfaceMediaOverrides.clear();
    this.activeStage = "ROOM";
    this.targetArchitectureOpacity = 0;
    this.targetOpening = 0;
    this.targetLightIntensity = 0;
    this.targetArchitectureResponse = 4.2;
    this.targetOpeningResponse = 3.15;

    if (this.configuration?.accent !== undefined) {
      this.setAccent(this.configuration.accent);
    }
  }

  setSurfaceMediaOverrides(
    overrides?: ReadonlyMap<SurfaceKey, MediaContent>
  ): void {
    this.surfaceMediaOverrides.clear();

    if (overrides) {
      for (const [id, content] of overrides) {
        this.surfaceMediaOverrides.set(id, content);
      }
    }

    this.refreshRoomBackSurface();

    if (this.activeStage !== "ROOM") {
      this.applyActiveStageSurfaces();
    }
  }

  setSurfaceMediaOverride(
    id: SurfaceKey,
    content: MediaContent | null
  ): void {
    if (content) {
      this.surfaceMediaOverrides.set(id, content);
    } else {
      this.surfaceMediaOverrides.delete(id);
    }

    if (id === "BACK") {
      this.refreshRoomBackSurface();
    }

    if (this.activeStage === "ROOM" || !this.configuration) {
      return;
    }

    const surface = this.configuration.surfaces.find(
      (configuration) => configuration.id === id
    );

    if (surface) {
      this.configureStageSurface(surface);
    }
  }

  setStage(stage: BorderlessStageId): boolean {
    if (this.disposed || !this.configuration) {
      return false;
    }

    const stageConfiguration = this.configuration.stages[stage];

    if (!stageConfiguration) {
      return false;
    }

    this.activeStage = stage;
    this.camera.centerView();
    this.camera.setCamera(stageConfiguration.camera);
    this.targetArchitectureOpacity = THREE.MathUtils.clamp(
      stageConfiguration.architecture.opacity,
      0,
      1
    );
    this.targetOpening = THREE.MathUtils.clamp(
      stageConfiguration.architecture.opening,
      0,
      1
    );
    this.targetLightIntensity = Math.max(
      0,
      stageConfiguration.lighting.portalIntensity
    );
    this.targetArchitectureResponse = THREE.MathUtils.clamp(
      stageConfiguration.motion.architectureResponse,
      0.35,
      12
    );
    this.targetOpeningResponse = THREE.MathUtils.clamp(
      stageConfiguration.motion.openingResponse,
      0.35,
      12
    );

    if (stage === "ROOM") {
      if (this.roomBackSurface) {
        this.surfaces.configure(this.roomBackSurface);
      }

      this.hideMediaSurfaces(this.configuration);
      return true;
    }

    if (this.roomBackSurface) {
      this.surfaces.configure({
        id: this.roomBackSurface.id,
        content: { kind: "NONE" },
        visible: false,
        opacity: 0,
        depthWrite: false,
      });
    }

    this.applyActiveStageSurfaces();

    this.root.visible = true;
    return true;
  }

  getStage(): BorderlessStageId {
    return this.activeStage;
  }

  update(frame: MasterFrame): void {
    if (this.disposed) {
      return;
    }

    const alpha =
      1 - Math.exp(-this.targetArchitectureResponse * frame.deltaTime);
    const openingAlpha =
      1 - Math.exp(-this.targetOpeningResponse * frame.deltaTime);
    const pulse = 0.94 + Math.sin(frame.elapsedTime * 1.35) * 0.06;
    let maximumOpacity = 0;

    for (const tracked of this.fadedMaterials) {
      const target =
        tracked.baseOpacity *
        this.targetArchitectureOpacity *
        (tracked.pulse > 0 ? THREE.MathUtils.lerp(1, pulse, tracked.pulse) : 1);

      tracked.material.opacity = THREE.MathUtils.lerp(
        tracked.material.opacity,
        target,
        alpha
      );
      maximumOpacity = Math.max(maximumOpacity, tracked.material.opacity);
    }

    this.portalLight.intensity = THREE.MathUtils.lerp(
      this.portalLight.intensity,
      this.targetLightIntensity,
      alpha
    );

    this.opening = THREE.MathUtils.lerp(
      this.opening,
      this.targetOpening,
      openingAlpha
    );
    const easedOpening = this.opening * this.opening * (3 - 2 * this.opening);

    for (const leaf of this.portalLeaves) {
      leaf.mesh.position.x = THREE.MathUtils.lerp(
        leaf.closedX,
        leaf.openX,
        easedOpening
      );
    }

    if (this.targetArchitectureOpacity === 0 && maximumOpacity < 0.002) {
      this.root.visible = false;
    }
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }

    this.disposed = true;
    this.root.removeFromParent();
    this.root.clear();

    for (const geometry of this.geometries) {
      geometry.dispose();
    }

    for (const material of this.materials) {
      material.dispose();
    }

    this.geometries.clear();
    this.materials.clear();
    this.fadedMaterials.length = 0;
    this.accentMaterials.length = 0;
    this.portalLeaves.length = 0;
  }

  private createArchitecture(): THREE.PointLight {
    const shellMaterial = this.trackFadableMaterial(
      new THREE.MeshStandardMaterial({
        color: 0x030706,
        roughness: 0.82,
        metalness: 0.12,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      }),
      0.96
    );
    const lineMaterial = this.trackFadableMaterial(
      new THREE.MeshBasicMaterial({
        color: 0xd4ad6d,
        transparent: true,
        opacity: 0,
        toneMapped: false,
      }),
      0.72,
      1
    );
    const veilMaterial = this.trackFadableMaterial(
      new THREE.MeshBasicMaterial({
        color: 0x315f52,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      }),
      0.045,
      0.45
    );

    this.accentMaterials.push(lineMaterial, veilMaterial);

    const portalShellMaterial = this.trackFadableMaterial(
      new THREE.MeshStandardMaterial({
        color: 0x050706,
        roughness: 0.91,
        metalness: 0.08,
        transparent: true,
        opacity: 0,
      }),
      1
    );

    const floorGeometry = this.trackGeometry(
      new THREE.BoxGeometry(7.4, 0.08, 12.7)
    );
    const sideGeometry = this.trackGeometry(
      new THREE.BoxGeometry(0.08, 5.7, 12.7)
    );
    const ceilingGeometry = this.trackGeometry(
      new THREE.BoxGeometry(7.4, 0.08, 12.7)
    );

    const floor = new THREE.Mesh(floorGeometry, shellMaterial);
    floor.position.set(0, -0.01, -12.2);
    const ceiling = new THREE.Mesh(ceilingGeometry, shellMaterial);
    ceiling.position.set(0, 5.68, -12.2);
    const leftWall = new THREE.Mesh(sideGeometry, shellMaterial);
    leftWall.position.set(-3.7, 2.83, -12.2);
    const rightWall = new THREE.Mesh(sideGeometry, shellMaterial);
    rightWall.position.set(3.7, 2.83, -12.2);
    this.root.add(floor, ceiling, leftWall, rightWall);

    const thresholdBridgeGeometry = this.trackGeometry(
      new THREE.BoxGeometry(5.38, 0.06, 1.16)
    );
    const thresholdBridge = new THREE.Mesh(
      thresholdBridgeGeometry,
      shellMaterial
    );
    thresholdBridge.position.set(0, -0.018, -6.28);
    this.root.add(thresholdBridge);

    const jambGeometry = this.trackGeometry(
      new THREE.BoxGeometry(0.34, 5.72, 0.92)
    );
    const lintelGeometry = this.trackGeometry(
      new THREE.BoxGeometry(5.72, 0.34, 0.92)
    );
    const revealSideGeometry = this.trackGeometry(
      new THREE.BoxGeometry(0.16, 5.38, 1.34)
    );
    const revealTopGeometry = this.trackGeometry(
      new THREE.BoxGeometry(5.52, 0.16, 1.34)
    );
    const leftJamb = new THREE.Mesh(jambGeometry, portalShellMaterial);
    const rightJamb = new THREE.Mesh(jambGeometry, portalShellMaterial);
    const lintel = new THREE.Mesh(lintelGeometry, portalShellMaterial);
    const leftReveal = new THREE.Mesh(
      revealSideGeometry,
      portalShellMaterial
    );
    const rightReveal = new THREE.Mesh(
      revealSideGeometry,
      portalShellMaterial
    );
    const topReveal = new THREE.Mesh(revealTopGeometry, portalShellMaterial);
    leftJamb.position.set(-2.85, 2.86, -5.96);
    rightJamb.position.set(2.85, 2.86, -5.96);
    lintel.position.set(0, 5.55, -5.96);
    leftReveal.position.set(-2.68, 2.69, -6.38);
    rightReveal.position.set(2.68, 2.69, -6.38);
    topReveal.position.set(0, 5.38, -6.38);
    this.root.add(
      leftJamb,
      rightJamb,
      lintel,
      leftReveal,
      rightReveal,
      topReveal
    );

    const leafGeometry = this.trackGeometry(
      new THREE.BoxGeometry(2.68, 5.38, 0.16)
    );
    const leftLeaf = new THREE.Mesh(leafGeometry, portalShellMaterial);
    const rightLeaf = new THREE.Mesh(leafGeometry, portalShellMaterial);
    leftLeaf.position.set(-1.34, 2.69, -5.89);
    rightLeaf.position.set(1.34, 2.69, -5.89);
    this.portalLeaves.push(
      { mesh: leftLeaf, closedX: -1.34, openX: -4.12 },
      { mesh: rightLeaf, closedX: 1.34, openX: 4.12 }
    );
    this.root.add(leftLeaf, rightLeaf);

    const pillarGeometry = this.trackGeometry(
      new THREE.BoxGeometry(0.055, 5.7, 0.11)
    );
    const beamGeometry = this.trackGeometry(
      new THREE.BoxGeometry(7.42, 0.055, 0.11)
    );

    for (let index = 0; index < 7; index += 1) {
      const z = -6.05 - index * 2.05;
      const leftPillar = new THREE.Mesh(pillarGeometry, lineMaterial);
      const rightPillar = new THREE.Mesh(pillarGeometry, lineMaterial);
      const beam = new THREE.Mesh(beamGeometry, lineMaterial);

      leftPillar.position.set(-3.66, 2.84, z);
      rightPillar.position.set(3.66, 2.84, z);
      beam.position.set(0, 5.66, z);
      this.root.add(leftPillar, rightPillar, beam);
    }

    const floorGuideGeometry = this.trackGeometry(
      new THREE.BoxGeometry(0.045, 0.025, 12.55)
    );
    const leftFloorGuide = new THREE.Mesh(floorGuideGeometry, lineMaterial);
    const rightFloorGuide = new THREE.Mesh(floorGuideGeometry, lineMaterial);
    leftFloorGuide.position.set(-3.64, 0.072, -12.18);
    rightFloorGuide.position.set(3.64, 0.072, -12.18);
    this.root.add(leftFloorGuide, rightFloorGuide);

    const thresholdPillarGeometry = this.trackGeometry(
      new THREE.BoxGeometry(0.075, 5.55, 0.16)
    );
    const thresholdBeamGeometry = this.trackGeometry(
      new THREE.BoxGeometry(5.45, 0.075, 0.16)
    );
    const thresholdLeft = new THREE.Mesh(
      thresholdPillarGeometry,
      lineMaterial
    );
    const thresholdRight = new THREE.Mesh(
      thresholdPillarGeometry,
      lineMaterial
    );
    const thresholdTop = new THREE.Mesh(thresholdBeamGeometry, lineMaterial);
    thresholdLeft.position.set(-2.68, 2.76, -5.86);
    thresholdRight.position.set(2.68, 2.76, -5.86);
    thresholdTop.position.set(0, 5.5, -5.86);
    this.root.add(thresholdLeft, thresholdRight, thresholdTop);

    const veilGeometry = this.trackGeometry(new THREE.PlaneGeometry(7.2, 5.45));

    for (const z of [-8.1, -12.2, -16.3]) {
      const veil = new THREE.Mesh(veilGeometry, veilMaterial);
      veil.position.set(0, 2.75, z);
      this.root.add(veil);
    }

    const portalLight = new THREE.PointLight(0xd4ad6d, 0, 19, 2);
    portalLight.position.set(0, 3.05, -8.2);
    this.root.add(portalLight);
    return portalLight;
  }

  private hideMediaSurfaces(
    configuration: BorderlessConfiguration | null
  ): void {
    const configuredIds = configuration?.surfaces.map((surface) => surface.id);
    const ids = configuredIds?.length ? configuredIds : PORTAL_SURFACE_IDS;

    for (const id of ids) {
      this.surfaces.configure({
        id,
        content: { kind: "NONE" },
        visible: false,
        opacity: 0,
      });
    }
  }

  private applyActiveStageSurfaces(): void {
    if (!this.configuration || this.activeStage === "ROOM") {
      return;
    }

    for (const surface of this.configuration.surfaces) {
      this.configureStageSurface(surface);
    }
  }

  private configureStageSurface(surface: SurfaceConfiguration): void {
    if (!this.configuration) {
      return;
    }

    const stageConfiguration = this.configuration.stages[this.activeStage];
    const content = this.surfaceMediaOverrides.get(surface.id);

    this.surfaces.configure({
      ...surface,
      content: content ?? surface.content,
      visible: true,
      opacity:
        (surface.opacity ?? 1) * stageConfiguration.surfaces.opacity,
    });
  }

  private refreshRoomBackSurface(): void {
    const base = this.baseRoomBackSurface;

    if (!base) {
      this.roomBackSurface = null;
      return;
    }

    const content = this.surfaceMediaOverrides.get("BACK");
    this.roomBackSurface = content ? { ...base, content } : base;
  }

  private setAccent(accent: number): void {
    for (const material of this.accentMaterials) {
      material.color.set(accent);
    }

    this.portalLight.color.set(accent);
  }

  private trackGeometry<T extends THREE.BufferGeometry>(geometry: T): T {
    this.geometries.add(geometry);
    return geometry;
  }

  private trackFadableMaterial<T extends FadableMaterial>(
    material: T,
    baseOpacity: number,
    pulse = 0
  ): T {
    this.materials.add(material);
    this.fadedMaterials.push({ material, baseOpacity, pulse });
    return material;
  }
}
