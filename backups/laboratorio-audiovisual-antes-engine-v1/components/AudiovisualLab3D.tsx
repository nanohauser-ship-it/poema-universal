"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type SceneMode = "gallery" | "immersive" | "performance";

type ScreenObject = {
  group: THREE.Group;
  screen: THREE.Mesh;
  frame: THREE.Mesh;
};

function createLabelTexture(
  title: string,
  subtitle: string,
  color: string
) {
  const canvas = document.createElement("canvas");

  canvas.width = 1024;
  canvas.height = 576;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  const gradient = ctx.createLinearGradient(
    0,
    0,
    canvas.width,
    canvas.height
  );

  gradient.addColorStop(0, "#0a0b0d");
  gradient.addColorStop(1, "#020304");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = color;
  ctx.lineWidth = 3;

  ctx.strokeRect(
    35,
    35,
    canvas.width - 70,
    canvas.height - 70
  );

  ctx.fillStyle = color;
  ctx.font = "700 34px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(
    title.toUpperCase(),
    canvas.width / 2,
    canvas.height / 2 - 18
  );

  ctx.fillStyle = "rgba(255,255,255,0.48)";
  ctx.font = "18px Arial";

  ctx.fillText(
    subtitle,
    canvas.width / 2,
    canvas.height / 2 + 35
  );

  const texture = new THREE.CanvasTexture(canvas);

  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}

function createVideoTexture(src: string) {
  const video = document.createElement("video");

  video.src = src;
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.autoplay = true;
  video.preload = "auto";

  const texture = new THREE.VideoTexture(video);

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  video.play().catch(() => {});

  return {
    video,
    texture,
  };
}

function createScreen(
  width: number,
  height: number,
  texture: THREE.Texture
): ScreenObject {
  const group = new THREE.Group();

  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(
      width + 0.14,
      height + 0.14,
      0.08
    ),
    new THREE.MeshStandardMaterial({
      color: 0x101214,
      roughness: 0.34,
      metalness: 0.72,
    })
  );

  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({
      map: texture,
      color: 0xffffff,
      toneMapped: false,
    })
  );

  screen.position.z = 0.05;

  group.add(frame, screen);

  return {
    group,
    screen,
    frame,
  };
}

export default function AudiovisualLab3D() {
  const containerRef =
    useRef<HTMLDivElement | null>(null);

  const modeRef =
    useRef<SceneMode>("gallery");

  const [mode, setMode] =
    useState<SceneMode>("gallery");

  function changeMode(nextMode: SceneMode) {
    modeRef.current = nextMode;
    setMode(nextMode);
  }

  useEffect(() => {
    const mount = containerRef.current;

    if (!mount) {
      return;
    }

    const scene = new THREE.Scene();

    scene.background = new THREE.Color(0x020304);

    scene.fog = new THREE.FogExp2(
      0x020304,
      0.022
    );

    const camera =
      new THREE.PerspectiveCamera(
        44,
        1,
        0.1,
        120
      );

    camera.position.set(0, 2.4, 8.4);

    const renderer =
      new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
      });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type =
      THREE.PCFSoftShadowMap;

    renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    renderer.toneMapping =
      THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure = 1.02;

    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.cursor = "grab";
    renderer.domElement.style.touchAction = "none";

    mount.appendChild(renderer.domElement);

    const room = new THREE.Group();

    scene.add(room);

    const wallMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x090b0d,
        emissive: 0x050607,
        emissiveIntensity: 0.06,
        roughness: 0.86,
        metalness: 0.01,
      });

    const floorMaterial =
      new THREE.MeshPhysicalMaterial({
        color: 0x050607,
        roughness: 0.16,
        metalness: 0.34,
        clearcoat: 0.9,
        clearcoatRoughness: 0.14,
      });

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 16),
      floorMaterial
    );

    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;

    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(16, 7.5, 0.22),
      wallMaterial
    );

    backWall.position.set(0, 3.75, -6);

    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(
        0.22,
        7.5,
        12
      ),
      wallMaterial
    );

    leftWall.position.set(-8, 3.75, 0);

    const rightWall = leftWall.clone();

    rightWall.position.x = 8;

    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 16),
      new THREE.MeshStandardMaterial({
        color: 0x030405,
        roughness: 0.98,
      })
    );

    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 7.5;

    room.add(
      floor,
      backWall,
      leftWall,
      rightWall,
      ceiling
    );

    const videoA =
      createVideoTexture("/flores.mp4");

    const videoB =
      createVideoTexture(
        "/poema-universal/media/poema-universal-opening.mp4"
      );

    const webcamPlaceholder =
      createLabelTexture(
        "Webcam",
        "Human Layer",
        "#d5ad68"
      );

    const imageTexture =
      createLabelTexture(
        "Imagen",
        "Superficie visual",
        "#d7d7d7"
      );

    const screenLeft =
      createScreen(
        4.2,
        2.36,
        webcamPlaceholder
      );

    const screenBackA =
      createScreen(
        4.5,
        2.54,
        videoA.texture
      );

    const screenBackB =
      createScreen(
        4.5,
        2.54,
        videoB.texture
      );

    const screenRight =
      createScreen(
        4.2,
        2.36,
        imageTexture
      );

    screenLeft.group.position.set(
      -6.95,
      3.25,
      -0.4
    );

    screenLeft.group.rotation.y =
      Math.PI / 2;

    screenBackA.group.position.set(
      -2.45,
      3.35,
      -5.85
    );

    screenBackB.group.position.set(
      2.45,
      3.35,
      -5.85
    );

    screenRight.group.position.set(
      6.95,
      3.25,
      -0.4
    );

    screenRight.group.rotation.y =
      -Math.PI / 2;

    room.add(
      screenLeft.group,
      screenBackA.group,
      screenBackB.group,
      screenRight.group
    );

    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(
        1.45,
        1.52,
        0.18,
        96
      ),
      new THREE.MeshPhysicalMaterial({
        color: 0x08090a,
        roughness: 0.24,
        metalness: 0.46,
        clearcoat: 0.85,
        clearcoatRoughness: 0.14,
      })
    );

    platform.position.set(0, 0.1, 0.6);
    platform.receiveShadow = true;

    room.add(platform);

    const lightRing = new THREE.Mesh(
      new THREE.RingGeometry(
        1.55,
        1.59,
        128
      ),
      new THREE.MeshBasicMaterial({
        color: 0xd6ad66,
        transparent: true,
        opacity: 0.24,
        side: THREE.DoubleSide,
      })
    );

    lightRing.rotation.x =
      -Math.PI / 2;

    lightRing.position.set(
      0,
      0.205,
      0.6
    );

    room.add(lightRing);

    const leftStrip = new THREE.Mesh(
      new THREE.BoxGeometry(
        0.035,
        0.025,
        10.5
      ),
      new THREE.MeshBasicMaterial({
        color: 0xc49758,
      })
    );

    leftStrip.position.set(
      -7.85,
      0.05,
      -0.2
    );

    const rightStrip =
      leftStrip.clone();

    rightStrip.position.x = 7.85;

    const backStrip = new THREE.Mesh(
      new THREE.BoxGeometry(
        15.7,
        0.025,
        0.035
      ),
      new THREE.MeshBasicMaterial({
        color: 0xc49758,
      })
    );

    backStrip.position.set(
      0,
      0.05,
      -5.86
    );

    room.add(
      leftStrip,
      rightStrip,
      backStrip
    );

    const hemisphere =
      new THREE.HemisphereLight(
        0x76838d,
        0x020203,
        0.3
      );

    scene.add(hemisphere);

    const centralSpot =
      new THREE.SpotLight(
        0xe8d4af,
        3.2,
        18,
        Math.PI / 5,
        0.58,
        1.5
      );

    centralSpot.position.set(
      0,
      7,
      2.2
    );

    centralSpot.target.position.set(
      0,
      0.4,
      0.5
    );

    scene.add(
      centralSpot,
      centralSpot.target
    );

    const immersiveMaterial =
      new THREE.MeshBasicMaterial({
        map: videoA.texture,
        color: 0xffffff,
        toneMapped: false,
      });

    let dragging = false;
    let pointerId: number | null = null;

    let previousX = 0;
    let previousY = 0;

    let targetYaw = 0;
    let targetPitch = 0;

    let yaw = 0;
    let pitch = 0;

    function onPointerDown(
      event: PointerEvent
    ) {
      dragging = true;
      pointerId = event.pointerId;

      previousX = event.clientX;
      previousY = event.clientY;

      renderer.domElement.setPointerCapture(
        event.pointerId
      );

      renderer.domElement.style.cursor =
        "grabbing";
    }

    function onPointerMove(
      event: PointerEvent
    ) {
      if (
        !dragging ||
        pointerId !== event.pointerId
      ) {
        return;
      }

      const dx =
        event.clientX - previousX;

      const dy =
        event.clientY - previousY;

      targetYaw =
        THREE.MathUtils.clamp(
          targetYaw - dx * 0.003,
          -0.7,
          0.7
        );

      targetPitch =
        THREE.MathUtils.clamp(
          targetPitch + dy * 0.0025,
          -0.25,
          0.25
        );

      previousX = event.clientX;
      previousY = event.clientY;
    }

    function finishPointer(
      event: PointerEvent
    ) {
      if (
        pointerId !== null &&
        renderer.domElement.hasPointerCapture(
          pointerId
        )
      ) {
        renderer.domElement.releasePointerCapture(
          pointerId
        );
      }

      dragging = false;
      pointerId = null;

      renderer.domElement.style.cursor =
        "grab";
    }

    renderer.domElement.addEventListener(
      "pointerdown",
      onPointerDown
    );

    renderer.domElement.addEventListener(
      "pointermove",
      onPointerMove
    );

    renderer.domElement.addEventListener(
      "pointerup",
      finishPointer
    );

    renderer.domElement.addEventListener(
      "pointercancel",
      finishPointer
    );

    function resize() {
      const width = mount.clientWidth;
      const height = mount.clientHeight;

      renderer.setSize(
        width,
        height,
        false
      );

      camera.aspect =
        width / Math.max(height, 1);

      camera.updateProjectionMatrix();
    }

    const resizeObserver =
      new ResizeObserver(resize);

    resizeObserver.observe(mount);

    resize();

    const clock = new THREE.Clock();

    let frame = 0;

    function animate() {
      const elapsed =
        clock.getElapsedTime();

      const currentMode =
        modeRef.current;

      const immersive =
        currentMode === "immersive";

      const performance =
        currentMode === "performance";

      screenLeft.group.visible =
        !immersive;

      screenBackA.group.visible =
        !immersive;

      screenBackB.group.visible =
        !immersive;

      screenRight.group.visible =
        !immersive;

      if (immersive) {
        leftWall.material =
          immersiveMaterial;

        rightWall.material =
          immersiveMaterial;

        backWall.material =
          immersiveMaterial;

        floor.material =
          immersiveMaterial;
      } else {
        leftWall.material =
          wallMaterial;

        rightWall.material =
          wallMaterial;

        backWall.material =
          wallMaterial;

        floor.material =
          floorMaterial;
      }

      lightRing.visible =
        currentMode === "performance";

      platform.visible =
        currentMode !== "immersive";

      centralSpot.intensity =
        performance
          ? 5.2
          : immersive
            ? 0.6
            : 3.2;

      const targetCameraZ =
        immersive
          ? 7.6
          : performance
            ? 8.8
            : 8.4;

      camera.position.z +=
        (targetCameraZ -
          camera.position.z) *
        0.035;

      yaw +=
        (targetYaw - yaw) * 0.055;

      pitch +=
        (targetPitch - pitch) *
        0.055;

      camera.lookAt(
        Math.sin(yaw) * 5.5,
        2.25 - pitch * 5,
        -2.2
      );

      lightRing.material.opacity =
        performance
          ? 0.54 +
            Math.sin(elapsed * 1.4) *
              0.06
          : 0;

      renderer.render(scene, camera);

      frame =
        requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(frame);

      resizeObserver.disconnect();

      videoA.video.pause();
      videoB.video.pause();

      renderer.domElement.removeEventListener(
        "pointerdown",
        onPointerDown
      );

      renderer.domElement.removeEventListener(
        "pointermove",
        onPointerMove
      );

      renderer.domElement.removeEventListener(
        "pointerup",
        finishPointer
      );

      renderer.domElement.removeEventListener(
        "pointercancel",
        finishPointer
      );

      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) {
          return;
        }

        object.geometry.dispose();

        const materials =
          Array.isArray(object.material)
            ? object.material
            : [object.material];

        materials.forEach(
          (material) => {
            material.dispose();
          }
        );
      });

      videoA.texture.dispose();
      videoB.texture.dispose();
      webcamPlaceholder.dispose();
      imageTexture.dispose();

      renderer.dispose();

      renderer.domElement.remove();
    };
  }, []);

  return (
    <section className="relative h-screen min-h-[720px] overflow-hidden bg-black text-white">
      <div
        ref={containerRef}
        className="absolute inset-0"
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-6 sm:p-8">
        <div>
          <p className="text-[8px] uppercase tracking-[0.46em] text-[#d4ad6d]">
            Poema Universal
          </p>

          <h1 className="mt-3 font-serif text-3xl tracking-[-0.04em] sm:text-5xl">
            Sala Madre
          </h1>

          <p className="mt-3 text-[8px] uppercase tracking-[0.26em] text-white/30">
            Arquitectura audiovisual V1
          </p>
        </div>

        <p className="text-[7px] uppercase tracking-[0.24em] text-white/30">
          Arrastra para mirar
        </p>
      </div>

      <div className="pointer-events-auto absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 gap-2 border border-white/10 bg-black/60 p-2 backdrop-blur-xl">
        <button
          type="button"
          onClick={() =>
            changeMode("gallery")
          }
          className={`px-4 py-3 text-[7px] uppercase tracking-[0.24em] transition ${
            mode === "gallery"
              ? "bg-[#d4ad6d] text-black"
              : "text-white/40 hover:text-white"
          }`}
        >
          Galería
        </button>

        <button
          type="button"
          onClick={() =>
            changeMode("immersive")
          }
          className={`px-4 py-3 text-[7px] uppercase tracking-[0.24em] transition ${
            mode === "immersive"
              ? "bg-[#d4ad6d] text-black"
              : "text-white/40 hover:text-white"
          }`}
        >
          Inmersión
        </button>

        <button
          type="button"
          onClick={() =>
            changeMode("performance")
          }
          className={`px-4 py-3 text-[7px] uppercase tracking-[0.24em] transition ${
            mode === "performance"
              ? "bg-[#d4ad6d] text-black"
              : "text-white/40 hover:text-white"
          }`}
        >
          Performance
        </button>
      </div>
    </section>
  );
}
