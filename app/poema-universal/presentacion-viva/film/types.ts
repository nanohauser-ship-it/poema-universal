import type * as THREE
  from "three";

export interface FilmState {
  progress: number;
  elapsed: number;
  dt: number;
}

export interface FilmScene {
  readonly root:
    THREE.Group;

  update(
    state:
      FilmState
  ): void;

  dispose(): void;
}
