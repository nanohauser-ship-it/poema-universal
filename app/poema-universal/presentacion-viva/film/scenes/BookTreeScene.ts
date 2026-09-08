import * as THREE
  from "three";

import type {
  FilmScene,
  FilmState,
} from "../types";

import {
  createTextPanel,
} from "../utils/createTextPanel";

interface Branch {
  mesh:
    THREE.Mesh<
      THREE.CylinderGeometry,
      THREE.MeshStandardMaterial
    >;

  material:
    THREE.MeshStandardMaterial;

  delay: number;
}

export class BookTreeScene
  implements FilmScene {
  readonly root =
    new THREE.Group();

  private readonly book =
    new THREE.Group();

  private readonly leftPivot =
    new THREE.Group();

  private readonly rightPivot =
    new THREE.Group();

  private readonly paperMaterial =
    new THREE.MeshStandardMaterial({
      color:
        0xe8e0d3,
      roughness: 0.96,
      metalness: 0,
      transparent: true,
      opacity: 1,
      side:
        THREE.DoubleSide,
    });

  private readonly leftPage =
    new THREE.Mesh(
      new THREE.PlaneGeometry(
        3.1,
        4.3
      ),
      this.paperMaterial
    );

  private readonly rightPage =
    new THREE.Mesh(
      new THREE.PlaneGeometry(
        3.1,
        4.3
      ),
      this.paperMaterial
    );

  private readonly tree =
    new THREE.Group();

  private readonly branches:
    Branch[] = [];

  private readonly leafMaterial =
    new THREE.PointsMaterial({
      color:
        0xf4efe7,
      size: 0.13,
      transparent:
        true,
      opacity: 0,
      depthWrite: false,
    });

  private readonly leaves:
    THREE.Points;

  private readonly finalText =
    createTextPanel({
      text:
        "UNA OBRA COMÚN\nQUE TODAVÍA NO EXISTE\nDEL TODO",
      width: 5.7,
      height: 3.1,
      fontSize: 62,
      italic: true,
    });

  constructor() {
    this.root.name =
      "PU_FILM_BOOK_TREE";

    this.root.position.z =
      -76;

    this.book.position.set(
      0,
      1.3,
      1
    );

    this.leftPivot.position.x =
      0;

    this.rightPivot.position.x =
      0;

    this.leftPage.position.x =
      -1.55;

    this.rightPage.position.x =
      1.55;

    this.leftPivot.add(
      this.leftPage
    );

    this.rightPivot.add(
      this.rightPage
    );

    this.book.add(
      this.leftPivot,
      this.rightPivot
    );

    this.tree.position.set(
      0,
      -1.5,
      -2.1
    );

    this.createTree();

    const leafPositions:
      number[] = [];

    for (
      let index = 0;
      index < 60;
      index += 1
    ) {
      const angle =
        index *
        2.399963;

      const height =
        2.1 +
        (
          index % 11
        ) *
          0.42;

      const radius =
        0.6 +
        (
          index % 9
        ) *
          0.24;

      leafPositions.push(
        Math.cos(angle) *
          radius,
        height +
          Math.sin(
            index * 1.77
          ) *
            0.28,
        Math.sin(angle) *
          radius *
          0.38
      );
    }

    const leafGeometry =
      new THREE.BufferGeometry();

    leafGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        leafPositions,
        3
      )
    );

    this.leaves =
      new THREE.Points(
        leafGeometry,
        this.leafMaterial
      );

    this.tree.add(
      this.leaves
    );

    this.finalText.mesh.position.set(
      0,
      -3.6,
      -6.2
    );

    this.root.add(
      this.book,
      this.tree,
      this.finalText.mesh
    );
  }

  private createTree() {
    this.addBranch(
      new THREE.Vector3(
        0,
        0,
        0
      ),
      new THREE.Vector3(
        0,
        4.5,
        0
      ),
      0.24,
      0
    );

    const total =
      22;

    for (
      let index = 0;
      index < total;
      index += 1
    ) {
      const side =
        index % 2 === 0
          ? -1
          : 1;

      const level =
        1.2 +
        index *
          0.14;

      const length =
        1.15 +
        (
          index % 5
        ) *
          0.25;

      const start =
        new THREE.Vector3(
          0,
          level,
          0
        );

      const end =
        new THREE.Vector3(
          side *
            length,
          level +
            0.9 +
            (
              index % 4
            ) *
              0.2,
          Math.sin(
            index * 1.3
          ) *
            0.34
        );

      this.addBranch(
        start,
        end,
        0.09 +
          (
            index %
            3
          ) *
            0.012,
        index /
          total
      );
    }
  }

  private addBranch(
    start:
      THREE.Vector3,
    end:
      THREE.Vector3,
    radius:
      number,
    delay:
      number
  ) {
    const direction =
      new THREE.Vector3()
        .subVectors(
          end,
          start
        );

    const length =
      direction.length();

    const material =
      new THREE.MeshStandardMaterial({
        color:
          0xe8e4dd,
        roughness: 0.95,
        metalness: 0,
        transparent: true,
        opacity: 0,
      });

    const mesh =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          radius * 0.72,
          radius,
          length,
          7
        ),
        material
      );

    mesh.position
      .copy(start)
      .add(end)
      .multiplyScalar(
        0.5
      );

    mesh.quaternion
      .setFromUnitVectors(
        new THREE.Vector3(
          0,
          1,
          0
        ),
        direction.normalize()
      );

    mesh.scale.y =
      0.01;

    mesh.castShadow =
      true;

    this.tree.add(
      mesh
    );

    this.branches.push({
      mesh,
      material,
      delay,
    });
  }

  update(
    state:
      FilmState
  ) {
    const entry =
      THREE.MathUtils.smoothstep(
        state.progress,
        0.60,
        0.72
      );

    const transform =
      THREE.MathUtils.smoothstep(
        state.progress,
        0.72,
        0.91
      );

    const final =
      THREE.MathUtils.smoothstep(
        state.progress,
        0.88,
        0.98
      );

    this.book.visible =
      entry > 0.001 &&
      transform < 0.995;

    this.paperMaterial.opacity =
      entry *
      (
        1 -
        transform
      );

    this.leftPivot.rotation.y =
      THREE.MathUtils.lerp(
        -1.18,
        -0.12,
        entry
      );

    this.rightPivot.rotation.y =
      THREE.MathUtils.lerp(
        1.18,
        0.12,
        entry
      );

    this.book.rotation.z =
      Math.sin(
        state.elapsed *
          0.34
      ) *
        0.012;

    for (
      const branch
      of this.branches
    ) {
      const growth =
        THREE.MathUtils.smoothstep(
          transform,
          branch.delay *
            0.62,
          Math.min(
            1,
            branch.delay *
              0.62 +
              0.28
          )
        );

      branch.mesh.scale.y =
        Math.max(
          0.01,
          growth
        );

      branch.material.opacity =
        growth;
    }

    this.leafMaterial.opacity =
      THREE.MathUtils.smoothstep(
        transform,
        0.38,
        0.86
      ) *
      0.96;

    this.leaves.rotation.y =
      Math.sin(
        state.elapsed *
          0.16
      ) *
        0.08;

    this.finalText.material.opacity =
      final;

    this.finalText.mesh.position.y =
      -3.6 +
      (
        1 -
        final
      ) *
        0.25;
  }

  dispose() {
    this.leftPage.geometry.dispose();

    this.rightPage.geometry.dispose();

    this.paperMaterial.dispose();

    for (
      const branch
      of this.branches
    ) {
      branch.mesh.geometry.dispose();
      branch.material.dispose();
    }

    this.leaves.geometry.dispose();

    this.leafMaterial.dispose();

    this.finalText.dispose();

    this.root.clear();
  }
}
