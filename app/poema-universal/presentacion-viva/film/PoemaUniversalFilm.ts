import * as THREE
  from "three";

import type {
  FilmScene,
} from "./types";

import {
  ThresholdScene,
} from "./scenes/ThresholdScene";

import {
  VoicesScene,
} from "./scenes/VoicesScene";

import {
  BookTreeScene,
} from "./scenes/BookTreeScene";

interface FilmOptions {
  autoplay:
    boolean;

  recordMode:
    boolean;

  duration:
    number;
}

export class PoemaUniversalFilm {
  private readonly mount:
    HTMLDivElement;

  private readonly options:
    FilmOptions;

  private readonly scene =
    new THREE.Scene();

  private readonly camera =
    new THREE.PerspectiveCamera(
      42,
      1,
      0.05,
      300
    );

  private readonly renderer:
    THREE.WebGLRenderer;

  private readonly filmScenes:
    FilmScene[] = [];

  private readonly cameraCurve =
    new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(
          0,
          1.8,
          8.5
        ),

        new THREE.Vector3(
          -0.4,
          1.7,
          -7
        ),

        new THREE.Vector3(
          2.7,
          3.0,
          -22
        ),

        new THREE.Vector3(
          6.7,
          2.4,
          -35
        ),

        new THREE.Vector3(
          1.6,
          2.0,
          -53
        ),

        new THREE.Vector3(
          -1.4,
          2.3,
          -69
        ),

        new THREE.Vector3(
          -3.0,
          2.8,
          -78
        ),

        new THREE.Vector3(
          0,
          3.5,
          -91
        ),

        new THREE.Vector3(
          0,
          3.5,
          -100
        ),
      ],
      false,
      "centripetal"
    );

  private readonly targetCurve =
    new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(
          0,
          1.3,
          -2
        ),

        new THREE.Vector3(
          0,
          1.4,
          -13
        ),

        new THREE.Vector3(
          0,
          1.2,
          -34
        ),

        new THREE.Vector3(
          0,
          1.3,
          -37
        ),

        new THREE.Vector3(
          0,
          1.4,
          -61
        ),

        new THREE.Vector3(
          0,
          1.5,
          -75
        ),

        new THREE.Vector3(
          0,
          2.5,
          -80
        ),

        new THREE.Vector3(
          0,
          2.8,
          -87
        ),

        new THREE.Vector3(
          0,
          2.8,
          -104
        ),
      ],
      false,
      "centripetal"
    );

  private readonly cameraPosition =
    new THREE.Vector3();

  private readonly cameraTarget =
    new THREE.Vector3();

  private readonly cameraMatrix =
    new THREE.Matrix4();

  private readonly targetQuaternion =
    new THREE.Quaternion();

  private progress =
    0;

  private scrollTarget =
    0;

  private elapsed =
    0;

  private lastTime =
    performance.now();

  private playing:
    boolean;

  private disposed =
    false;

  private previousOverflow =
    "";

  constructor(
    mount:
      HTMLDivElement,
    options:
      FilmOptions
  ) {
    this.mount =
      mount;

    this.options =
      options;

    this.playing =
      options.autoplay;

    this.renderer =
      new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference:
          "high-performance",
      });

    this.renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    this.renderer.toneMapping =
      THREE.ACESFilmicToneMapping;

    this.renderer.toneMappingExposure =
      1.04;

    this.renderer.shadowMap.enabled =
      true;

    this.renderer.shadowMap.type =
      THREE.PCFSoftShadowMap;

    this.renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        options.recordMode
          ? 2
          : 1.75
      )
    );

    this.mount.appendChild(
      this.renderer.domElement
    );

    this.scene.background =
      new THREE.Color(
        0xe5dfd4
      );

    this.scene.fog =
      new THREE.FogExp2(
        0xe5dfd4,
        0.0125
      );

    this.buildWorld();
    this.resize();

    this.previousOverflow =
      document.body.style
        .overflow;

    if (
      options.recordMode
    ) {
      document.body.style.overflow =
        "hidden";

      window.scrollTo(
        0,
        0
      );
    }

    window.addEventListener(
      "resize",
      this.resize
    );

    window.addEventListener(
      "scroll",
      this.onScroll,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "keydown",
      this.onKeyDown
    );

    this.onScroll();

    this.renderer
      .setAnimationLoop(
        this.animate
      );
  }

  private buildWorld() {
    const hemisphere =
      new THREE.HemisphereLight(
        0xf4efe6,
        0x5c625c,
        2.15
      );

    this.scene.add(
      hemisphere
    );

    const key =
      new THREE.DirectionalLight(
        0xfff4e4,
        3.2
      );

    key.position.set(
      -5,
      10,
      7
    );

    key.castShadow =
      true;

    key.shadow.mapSize.set(
      2048,
      2048
    );

    key.shadow.camera.left =
      -18;

    key.shadow.camera.right =
      18;

    key.shadow.camera.top =
      18;

    key.shadow.camera.bottom =
      -18;

    this.scene.add(
      key
    );

    const floor =
      new THREE.Mesh(
        new THREE.PlaneGeometry(
          160,
          150
        ),
        new THREE.MeshStandardMaterial({
          color:
            0xd8d0c3,
          roughness: 0.98,
          metalness: 0,
        })
      );

    floor.rotation.x =
      -Math.PI / 2;

    floor.position.set(
      0,
      -1.55,
      -45
    );

    floor.receiveShadow =
      true;

    floor.name =
      "PU_FILM_PAPER_GROUND";

    this.scene.add(
      floor
    );

    const threshold =
      new ThresholdScene();

    const voices =
      new VoicesScene();

    const bookTree =
      new BookTreeScene();

    this.filmScenes.push(
      threshold,
      voices,
      bookTree
    );

    this.filmScenes.forEach(
      filmScene => {
        this.scene.add(
          filmScene.root
        );
      }
    );

    this.camera.position.copy(
      this.cameraCurve
        .getPointAt(0)
    );

    this.camera.lookAt(
      this.targetCurve
        .getPointAt(0)
    );
  }

  private readonly resize =
    () => {
      if (
        this.disposed
      ) {
        return;
      }

      const width =
        this.mount.clientWidth ||
        window.innerWidth;

      const height =
        this.mount.clientHeight ||
        window.innerHeight;

      this.camera.aspect =
        width /
        Math.max(
          1,
          height
        );

      this.camera
        .updateProjectionMatrix();

      this.renderer.setSize(
        width,
        height,
        false
      );
    };

  private readonly onScroll =
    () => {
      if (
        this.options
          .recordMode
      ) {
        return;
      }

      const max =
        Math.max(
          1,
          document.documentElement
            .scrollHeight -
            window.innerHeight
        );

      this.scrollTarget =
        THREE.MathUtils.clamp(
          window.scrollY /
            max,
          0,
          1
        );
    };

  private readonly onKeyDown =
    (
      event:
        KeyboardEvent
    ) => {
      if (
        event.code ===
        "Space"
      ) {
        event.preventDefault();

        this.playing =
          !this.playing;

        return;
      }

      if (
        event.code ===
        "KeyR"
      ) {
        this.progress =
          0;

        this.elapsed =
          0;

        this.scrollTarget =
          0;

        window.scrollTo({
          top: 0,
          behavior:
            "instant",
        });

        return;
      }

      if (
        event.code ===
        "Digit1"
      ) {
        this.jumpTo(
          0.06
        );

        return;
      }

      if (
        event.code ===
        "Digit2"
      ) {
        this.jumpTo(
          0.38
        );

        return;
      }

      if (
        event.code ===
        "Digit3"
      ) {
        this.jumpTo(
          0.73
        );

        return;
      }

      if (
        event.code ===
        "KeyH"
      ) {
        const hud =
          document.querySelector(
            "[data-film-hud]"
          ) as
            HTMLElement |
            null;

        if (hud) {
          hud.style.display =
            hud.style.display ===
              "none"
              ? ""
              : "none";
        }

        return;
      }

      if (
        event.code ===
        "KeyF"
      ) {
        if (
          !document
            .fullscreenElement
        ) {
          void document.documentElement
            .requestFullscreen();
        } else {
          void document
            .exitFullscreen();
        }
      }
    };

  private jumpTo(
    progress:
      number
  ) {
    this.progress =
      THREE.MathUtils.clamp(
        progress,
        0,
        1
      );

    this.scrollTarget =
      this.progress;

    if (
      !this.options
        .recordMode
    ) {
      const max =
        Math.max(
          1,
          document.documentElement
            .scrollHeight -
            window.innerHeight
        );

      window.scrollTo(
        0,
        max *
          this.progress
      );
    }
  }

  private readonly animate =
    (
      now:
        number
    ) => {
      if (
        this.disposed
      ) {
        return;
      }

      const dt =
        THREE.MathUtils.clamp(
          (
            now -
            this.lastTime
          ) /
            1000,
          0,
          0.05
        );

      this.lastTime =
        now;

      this.elapsed +=
        dt;

      if (
        this.playing
      ) {
        this.progress +=
          dt /
          this.options.duration;

        if (
          this.progress >=
          1
        ) {
          this.progress =
            1;

          this.playing =
            false;
        }
      } else if (
        !this.options
          .recordMode
      ) {
        const damping =
          1 -
          Math.exp(
            -7 *
              dt
          );

        this.progress =
          THREE.MathUtils.lerp(
            this.progress,
            this.scrollTarget,
            damping
          );
      }

      this.progress =
        THREE.MathUtils.clamp(
          this.progress,
          0,
          1
        );

      this.updateCamera(
        dt
      );

      const state = {
        progress:
          this.progress,
        elapsed:
          this.elapsed,
        dt,
      };

      this.filmScenes.forEach(
        filmScene => {
          filmScene.update(
            state
          );
        }
      );

      this.renderer.render(
        this.scene,
        this.camera
      );
    };

  private updateCamera(
    dt:
      number
  ) {
    this.cameraCurve
      .getPointAt(
        this.progress,
        this.cameraPosition
      );

    this.targetCurve
      .getPointAt(
        this.progress,
        this.cameraTarget
      );

    const positionDamping =
      1 -
      Math.exp(
        -9 *
          dt
      );

    this.camera.position.lerp(
      this.cameraPosition,
      positionDamping
    );

    this.cameraMatrix.lookAt(
      this.camera.position,
      this.cameraTarget,
      this.camera.up
    );

    this.targetQuaternion
      .setFromRotationMatrix(
        this.cameraMatrix
      );

    const rotationDamping =
      1 -
      Math.exp(
        -7 *
          dt
      );

    this.camera.quaternion
      .slerp(
        this.targetQuaternion,
        rotationDamping
      );
  }

  dispose() {
    if (
      this.disposed
    ) {
      return;
    }

    this.disposed =
      true;

    this.renderer
      .setAnimationLoop(
        null
      );

    window.removeEventListener(
      "resize",
      this.resize
    );

    window.removeEventListener(
      "scroll",
      this.onScroll
    );

    window.removeEventListener(
      "keydown",
      this.onKeyDown
    );

    this.filmScenes.forEach(
      filmScene => {
        filmScene.dispose();
      }
    );

    this.filmScenes.length =
      0;

    this.scene.traverse(
      object => {
        if (
          !(object instanceof
            THREE.Mesh)
        ) {
          return;
        }

        object.geometry
          ?.dispose();

        const materials =
          Array.isArray(
            object.material
          )
            ? object.material
            : [object.material];

        materials.forEach(
          material => {
            material.dispose();
          }
        );
      }
    );

    this.renderer.dispose();

    this.renderer.domElement
      .remove();

    document.body.style.overflow =
      this.previousOverflow;
  }
}
