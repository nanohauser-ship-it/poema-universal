"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

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

  gradient.addColorStop(0, "#090a0c");
  gradient.addColorStop(1, "#020304");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.strokeRect(35, 35, canvas.width - 70, canvas.height - 70);

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
  texture.needsUpdate = true;

  return texture;
}

function createMediaScreen(
  width: number,
  height: number,
  texture: THREE.Texture,
  emissiveColor: number
) {
  const group = new THREE.Group();

  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(
      width + 0.18,
      height + 0.18,
      0.12
    ),
    new THREE.MeshStandardMaterial({
      color: 0x16191d,
      roughness: 0.34,
      metalness: 0.72,
    })
  );

  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshStandardMaterial({
      map: texture,
      emissive: emissiveColor,
      emissiveIntensity: 0.2,
      roughness: 0.38,
      metalness: 0.02,
    })
  );

  screen.position.z = 0.071;

  const light = new THREE.PointLight(
    emissiveColor,
    1.25,
    6,
    2
  );

  light.position.set(0, 0, 1.25);

  group.add(frame, screen, light);

  return group;
}

export default function AudiovisualLab3D() {
  const containerRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = containerRef.current;

    if (!mount) {
      return;
    }

    const scene = new THREE.Scene();

    scene.background = new THREE.Color(0x030405);

    scene.fog = new THREE.FogExp2(
      0x030405,
      0.028
    );

    const camera =
      new THREE.PerspectiveCamera(
        44,
        1,
        0.1,
        100
      );

    camera.position.set(0, 2.15, 7.2);

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

    renderer.toneMappingExposure = 1.06;

    renderer.domElement.style.display =
      "block";

    renderer.domElement.style.width =
      "100%";

    renderer.domElement.style.height =
      "100%";

    renderer.domElement.style.cursor =
      "grab";

    renderer.domElement.style.touchAction =
      "none";

    mount.appendChild(renderer.domElement);

    const room = new THREE.Group();

    scene.add(room);

    const wallMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x101317,
        emissive: 0x08090b,
        emissiveIntensity: 0.08,
        roughness: 0.82,
        metalness: 0.02,
      });

    const floorMaterial =
      new THREE.MeshPhysicalMaterial({
        color: 0x080a0c,
        roughness: 0.2,
        metalness: 0.26,
        clearcoat: 0.78,
        clearcoatRoughness: 0.18,
      });

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 14),
      floorMaterial
    );

    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;

    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(14, 7, 0.28),
      wallMaterial
    );

    backWall.position.set(0, 3.5, -5.5);
    backWall.receiveShadow = true;

    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(
        0.28,
        7,
        11
      ),
      wallMaterial
    );

    leftWall.position.set(-7, 3.5, 0);

    const rightWall = leftWall.clone();

    rightWall.position.x = 7;

    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 14),
      new THREE.MeshStandardMaterial({
        color: 0x050607,
        roughness: 0.96,
      })
    );

    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 7;

    room.add(
      floor,
      backWall,
      leftWall,
      rightWall,
      ceiling
    );

    const webcamTexture =
      createLabelTexture(
        "Webcam",
        "Entrada en directo",
        "#d9b36c"
      );

    const videoATexture =
      createLabelTexture(
        "Video A",
        "Superficie audiovisual",
        "#c35a55"
      );

    const videoBTexture =
      createLabelTexture(
        "Video B",
        "Superficie audiovisual",
        "#5a8fb8"
      );

    const imageTexture =
      createLabelTexture(
        "Imagen",
        "Superficie fija",
        "#7da57a"
      );

    const webcamScreen =
      createMediaScreen(
        4.4,
        2.5,
        webcamTexture,
        0xd9b36c
      );

    webcamScreen.position.set(
      -6.82,
      3.3,
      -0.3
    );

    webcamScreen.rotation.y =
      Math.PI / 2;

    const videoAScreen =
      createMediaScreen(
        4.8,
        2.7,
        videoATexture,
        0xc35a55
      );

    videoAScreen.position.set(
      0,
      3.45,
      -5.32
    );

    const videoBScreen =
      createMediaScreen(
        4.4,
        2.5,
        videoBTexture,
        0x5a8fb8
      );

    videoBScreen.position.set(
      6.82,
      3.3,
      -0.3
    );

    videoBScreen.rotation.y =
      -Math.PI / 2;

    const imageScreen =
      createMediaScreen(
        3.8,
        2.2,
        imageTexture,
        0x7da57a
      );

    imageScreen.position.set(
      0,
      2.35,
      2.6
    );

    imageScreen.rotation.y =
      Math.PI;

    room.add(
      webcamScreen,
      videoAScreen,
      videoBScreen,
      imageScreen
    );

    const hemisphere =
      new THREE.HemisphereLight(
        0x8395a3,
        0x030304,
        0.48
      );

    scene.add(hemisphere);

    const centralLight =
      new THREE.PointLight(
        0xd7c29a,
        1.4,
        18,
        2
      );

    centralLight.position.set(
      0,
      5.8,
      1.8
    );

    scene.add(centralLight);

    const centerRing = new THREE.Mesh(
      new THREE.RingGeometry(
        1.15,
        1.19,
        96
      ),
      new THREE.MeshBasicMaterial({
        color: 0xd4ad6d,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
      })
    );

    centerRing.rotation.x =
      -Math.PI / 2;

    centerRing.position.y = 0.012;

    scene.add(centerRing);

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
          -0.72,
          0.72
        );

      targetPitch =
        THREE.MathUtils.clamp(
          targetPitch + dy * 0.0025,
          -0.28,
          0.28
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

      yaw +=
        (targetYaw - yaw) * 0.06;

      pitch +=
        (targetPitch - pitch) * 0.06;

      camera.lookAt(
        Math.sin(yaw) * 5.3,
        2.3 - pitch * 5,
        -2.2
      );

      centerRing.material.opacity =
        0.32 +
        Math.sin(elapsed * 1.3) * 0.08;

      renderer.render(scene, camera);

      frame =
        requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(frame);

      resizeObserver.disconnect();

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

        materials.forEach((material) => {
          if (
            material instanceof
            THREE.MeshStandardMaterial ||
            material instanceof
            THREE.MeshPhysicalMaterial ||
            material instanceof
            THREE.MeshBasicMaterial
          ) {
            material.map?.dispose();
          }

          material.dispose();
        });
      });

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
            Laboratorio audiovisual
          </h1>

          <p className="mt-3 max-w-md text-[9px] uppercase tracking-[0.24em] text-white/35">
            Sala experimental 00 · cuatro superficies
          </p>
        </div>

        <p className="text-[7px] uppercase tracking-[0.24em] text-white/30">
          Arrastra para mirar
        </p>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center p-6">
        <div className="border border-white/10 bg-black/45 px-5 py-3 backdrop-blur-md">
          <p className="text-[7px] uppercase tracking-[0.28em] text-white/40">
            Próximo paso · conectar una imagen real
          </p>
        </div>
      </div>
    </section>
  );
}
