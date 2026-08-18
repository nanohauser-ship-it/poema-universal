import type { ArchitectureTransitionBlueprint } from "../scenography/schema";

export class ArchitectureTransition {
  private value = 0;
  private target = 0;

  constructor(private readonly configuration: ArchitectureTransitionBlueprint) {}

  setTarget(visible: boolean): void {
    this.target = visible ? 1 : 0;
  }

  update(deltaTime: number): number {
    if (this.value === this.target) {
      return this.easedValue();
    }

    const duration = Math.max(0.001, this.configuration.duration);
    const direction = this.target > this.value ? 1 : -1;
    this.value = Math.min(
      1,
      Math.max(0, this.value + (deltaTime / duration) * direction)
    );
    return this.easedValue();
  }

  isHidden(): boolean {
    return this.target === 0 && this.value <= 0.001;
  }

  private easedValue(): number {
    const smooth = this.value * this.value * (3 - 2 * this.value);

    if (this.configuration.easing === "SMOOTHSTEP") {
      return smooth;
    }

    return smooth * smooth * (3 - 2 * smooth);
  }
}
