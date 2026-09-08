import * as THREE
  from "three";

import type {
  FilmScene,
  FilmState,
} from "../types";

import {
  createTextPanel,
} from "../utils/createTextPanel";

export class ThresholdScene
  implements FilmScene {
  readonly root =
    new THREE.Group();

  private readonly first =
    createTextPanel({
      text:
        "SESENTA\nDESCONOCIDOS",
      width: 5.6,
      height: 3.2,
      fontSize: 78,
    });

  private readonly second =
    createTextPanel({
      text:
        "UNA VOZ\nCOMÚN",
      width: 5.6,
      height: 3.2,
      fontSize: 82,
      italic: true,
    });

  constructor() {
    this.root.name =
      "PU_FILM_THRESHOLD";

    this.first.mesh.position.set(
      -1.75,
      1.65,
      -2
    );

    this.first.mesh.rotation.y =
      0.12;

    this.first.mesh.rotation.z =
      -0.025;

    this.second.mesh.position.set(
      1.8,
      -0.15,
      -4.4
    );

    this.second.mesh.rotation.y =
      -0.14;

    this.second.mesh.rotation.z =
      0.035;

    this.root.add(
      this.first.mesh,
      this.second.mesh
    );
  }

  update(
    state:
      FilmState
  ) {
    const entry =
      THREE.MathUtils.smoothstep(
        state.progress,
        0.01,
        0.12
      );

    const exit =
      1 -
      THREE.MathUtils.smoothstep(
        state.progress,
        0.23,
        0.34
      );

    const opacity =
      entry *
      exit;

    this.first.material.opacity =
      opacity;

    this.second.material.opacity =
      opacity;

    this.first.mesh.position.y =
      1.65 +
      Math.sin(
        state.elapsed * 0.55
      ) *
        0.045;

    this.second.mesh.position.y =
      -0.15 +
      Math.sin(
        state.elapsed * 0.48 +
          1.7
      ) *
        0.055;

    this.first.mesh.rotation.z =
      -0.025 +
      Math.sin(
        state.elapsed * 0.32
      ) *
        0.008;

    this.second.mesh.rotation.z =
      0.035 +
      Math.sin(
        state.elapsed * 0.27
      ) *
        0.009;
  }

  dispose() {
    this.first.dispose();
    this.second.dispose();
    this.root.clear();
  }
}
