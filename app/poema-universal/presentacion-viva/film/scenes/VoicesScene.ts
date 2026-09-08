import * as THREE
  from "three";

import type {
  FilmScene,
  FilmState,
} from "../types";

import {
  createTextPanel,
} from "../utils/createTextPanel";

export class VoicesScene
  implements FilmScene {
  readonly root =
    new THREE.Group();

  private readonly globe =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        4.2,
        42,
        28
      ),
      new THREE.MeshBasicMaterial({
        color:
          0x5e625e,
        wireframe: true,
        transparent: true,
        opacity: 0.22,
      })
    );

  private readonly voices:
    THREE.Points;

  private readonly voicesMaterial =
    new THREE.PointsMaterial({
      color:
        0xf8f2e8,
      size: 0.105,
      sizeAttenuation:
        true,
      transparent:
        true,
      opacity: 0.92,
      depthWrite: false,
    });

  private readonly title =
    createTextPanel({
      text:
        "60 VOCES",
      width: 3.5,
      height: 1.8,
      fontSize: 92,
      paper:
        "#e9e2d7",
    });

  private readonly archive =
    createTextPanel({
      text:
        "UN ARCHIVO HUMANO\nEN CRECIMIENTO",
      width: 4.7,
      height: 2.3,
      fontSize: 58,
      italic: true,
    });

  constructor() {
    this.root.name =
      "PU_FILM_VOICES";

    this.root.position.z =
      -36;

    const positions:
      number[] = [];

    const total =
      60;

    const golden =
      Math.PI *
      (
        3 -
        Math.sqrt(5)
      );

    for (
      let index = 0;
      index < total;
      index += 1
    ) {
      const y =
        1 -
        (
          index /
          (total - 1)
        ) *
          2;

      const radius =
        Math.sqrt(
          Math.max(
            0,
            1 -
              y * y
          )
        );

      const theta =
        golden *
        index;

      const r =
        4.48;

      positions.push(
        Math.cos(theta) *
          radius *
          r,
        y * r,
        Math.sin(theta) *
          radius *
          r
      );
    }

    const geometry =
      new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        positions,
        3
      )
    );

    this.voices =
      new THREE.Points(
        geometry,
        this.voicesMaterial
      );

    this.title.mesh.position.set(
      -5.6,
      3.8,
      0.2
    );

    this.title.mesh.rotation.y =
      0.34;

    this.archive.mesh.position.set(
      5.8,
      -2.8,
      -0.8
    );

    this.archive.mesh.rotation.y =
      -0.38;

    this.root.add(
      this.globe,
      this.voices,
      this.title.mesh,
      this.archive.mesh
    );
  }

  update(
    state:
      FilmState
  ) {
    const entry =
      THREE.MathUtils.smoothstep(
        state.progress,
        0.25,
        0.39
      );

    const exit =
      1 -
      THREE.MathUtils.smoothstep(
        state.progress,
        0.58,
        0.68
      );

    const opacity =
      entry *
      exit;

    (
      this.globe
        .material as
        THREE.MeshBasicMaterial
    ).opacity =
      0.22 *
      opacity;

    this.voicesMaterial.opacity =
      0.92 *
      opacity;

    this.title.material.opacity =
      opacity;

    this.archive.material.opacity =
      opacity;

    this.globe.rotation.y =
      state.elapsed *
      0.055;

    this.globe.rotation.x =
      Math.sin(
        state.elapsed *
          0.11
      ) *
        0.04;

    this.voices.rotation.y =
      -state.elapsed *
      0.035;

    const pulse =
      1 +
      Math.sin(
        state.elapsed *
          0.65
      ) *
        0.012;

    this.voices.scale.setScalar(
      pulse
    );
  }

  dispose() {
    this.globe.geometry.dispose();

    (
      this.globe
        .material as
        THREE.Material
    ).dispose();

    this.voices.geometry.dispose();

    this.voicesMaterial.dispose();

    this.title.dispose();
    this.archive.dispose();

    this.root.clear();
  }
}
