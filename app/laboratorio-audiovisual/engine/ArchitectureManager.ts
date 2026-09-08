import * as THREE from "three";

import {
  ArchitectureCompiler,
  type CompiledArchitecture,
} from "./ArchitectureCompiler";
import { ArchitectureTransition } from "./ArchitectureTransition";
import { MediaManager } from "./MediaManager";
import type { ArchitectureBlueprint } from "../scenography/schema";
import type { MediaContent } from "../types/audiovisual";

type ArchitectureRecord = {
  compiled: CompiledArchitecture;
  transition: ArchitectureTransition;
};

export class ArchitectureManager {
  readonly root = new THREE.Group();

  private readonly compiler: ArchitectureCompiler;
  private readonly mediaSlots = new Map<string, MediaContent>();
  private readonly exiting: ArchitectureRecord[] = [];
  private active: ArchitectureRecord | null = null;
  private targetVisible = false;
  private disposed = false;

  constructor(mediaManager: MediaManager) {
    this.compiler = new ArchitectureCompiler(mediaManager);
    this.root.name = "ARCHITECTURE_GROUP";
  }

  applyBlueprint(blueprint: ArchitectureBlueprint): void {
    if (this.disposed) {
      return;
    }

    const compiled = this.compiler.compile(blueprint);
    const next: ArchitectureRecord = {
      compiled,
      transition: new ArchitectureTransition(blueprint.transition),
    };

    if (this.active) {
      this.active.transition.setTarget(false);
      this.exiting.push(this.active);
    }

    this.active = next;
    this.root.add(compiled.group);

    // DEBUG ARQUITECTURA
    const debugGeometry = new THREE.BoxGeometry(1.8, 1.8, 1.8);
    const debugMaterial = new THREE.MeshBasicMaterial({
      color: 0x3366ff,
    });

    const debugCube = new THREE.Mesh(
      debugGeometry,
      debugMaterial
    );

    debugCube.position.set(0, 2.2, -4);
    debugCube.name = "ARCHITECTURE_DEBUG_BLUE";

    compiled.group.add(debugCube);

    compiled.setMediaSlots(this.mediaSlots);
    next.transition.setTarget(this.targetVisible);

    // =====================================================
    // DEBUG SALA MADRE V2
    // Forzamos el blueprint recién compilado a ser visible.
    // =====================================================

    compiled.group.visible = true;

    for (const material of compiled.materials) {
      const baseOpacity =
        Number(material.userData.baseOpacity) || 1;

      material.transparent = false;
      material.opacity = Math.max(baseOpacity, 0.92);
      material.needsUpdate = true;
    }

    for (const light of compiled.lights) {
      const baseIntensity =
        Number(light.userData.baseIntensity) || 1;

      light.intensity = Math.max(baseIntensity, 2.5);
    }

    console.log(
      "[SALA MADRE V2] blueprint visible",
      {
        archetype: blueprint.archetype,
        modules: blueprint.modules.length,
        surfaces: blueprint.surfaces.length,
        lights: blueprint.lights.length,
        children: compiled.group.children.length,
      }
    );
  }

  setMediaSlot(slotId: string, content: MediaContent | null): void {
    if (this.disposed) {
      return;
    }

    if (content) {
      this.mediaSlots.set(slotId, content);
    } else {
      this.mediaSlots.delete(slotId);
    }

    this.active?.compiled.setMediaSlots(this.mediaSlots);
  }

  setVisible(visible: boolean): void {
    this.targetVisible = visible;
    this.active?.transition.setTarget(visible);
  }

  update(deltaTime: number): void {
    if (this.disposed) {
      return;
    }

    if (this.active) {
      // DEBUG V2: mantenemos la arquitectura completamente visible.
      this.applyTransition(this.active, 1);
    }

    for (let index = this.exiting.length - 1; index >= 0; index -= 1) {
      const record = this.exiting[index];
      const opacity = record.transition.update(deltaTime);
      this.applyTransition(record, opacity);

      if (record.transition.isHidden()) {
        record.compiled.dispose();
        this.exiting.splice(index, 1);
      }
    }
  }

  getBlueprint(): ArchitectureBlueprint | null {
    return this.active?.compiled.blueprint ?? null;
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }

    this.disposed = true;
    this.active?.compiled.dispose();
    this.active = null;

    for (const record of this.exiting) {
      record.compiled.dispose();
    }

    this.exiting.length = 0;
    this.mediaSlots.clear();
    this.compiler.dispose();
    this.root.removeFromParent();
    this.root.clear();
  }

  private applyTransition(record: ArchitectureRecord, opacity: number): void {
    const { compiled } = record;
    const { entryOffset } = compiled.blueprint.transition;

    compiled.group.visible = opacity > 0.001;
    compiled.group.position.set(
      entryOffset[0] * (1 - opacity),
      entryOffset[1] * (1 - opacity),
      entryOffset[2] * (1 - opacity)
    );
    const scale = 0.985 + opacity * 0.015;
    compiled.group.scale.set(scale, scale, scale);

    for (const material of compiled.materials) {
      material.opacity =
        (Number(material.userData.baseOpacity) || 1) * opacity;
    }

    for (const light of compiled.lights) {
      light.intensity =
        (Number(light.userData.baseIntensity) || 0) * opacity;
    }
  }
}
