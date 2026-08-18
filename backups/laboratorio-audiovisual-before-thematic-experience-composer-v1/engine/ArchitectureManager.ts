import * as THREE from "three";

import {
  ArchitectureCompiler,
  type CompiledArchitecture,
} from "./ArchitectureCompiler";
import { ArchitectureTransition } from "./ArchitectureTransition";
import type { ArchitectureBlueprint } from "../scenography/schema";

type ArchitectureRecord = {
  compiled: CompiledArchitecture;
  transition: ArchitectureTransition;
};

export class ArchitectureManager {
  readonly root = new THREE.Group();

  private readonly compiler = new ArchitectureCompiler();
  private readonly exiting: ArchitectureRecord[] = [];
  private active: ArchitectureRecord | null = null;
  private targetVisible = false;
  private disposed = false;

  constructor() {
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
    next.transition.setTarget(this.targetVisible);
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
      this.applyTransition(this.active, this.active.transition.update(deltaTime));
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
