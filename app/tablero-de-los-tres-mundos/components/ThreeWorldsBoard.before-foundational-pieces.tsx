"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import {
  type WorldConfig,
  type WorldId,
  worldById,
  worlds,
} from "../data/worlds";

function createBranch(
  start: THREE.Vector3,
  end: THREE.Vector3,
  radius: number,
  material: THREE.Material
) {
  const direction = new THREE.Vector3().subVectors(
    end,
    start
  );

  const length = direction.length();

  const branch = new THREE.Mesh(
    new THREE.CylinderGeometry(
      radius * 0.72,
      radius,
      length,
      12
    ),
    material
  );

  branch.position.copy(start).add(end).multiplyScalar(0.5);

  branch.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.clone().normalize()
  );

  return branch;
}

function createBoard(world: WorldConfig) {
  const group = new THREE.Group();
  group.position.y = world.height;

  const squareGeometry = new THREE.BoxGeometry(
    0.86,
    0.12,
    0.86
  );

  const lightMaterial = new THREE.MeshStandardMaterial({
    color: world.lightSquare,
    roughness: world.id === "bielka" ? 0.35 : 0.82,
    metalness: world.id === "jerarquia" ? 0.2 : 0.02,
    transparent: world.id === "bielka",
    opacity: world.id === "bielka" ? 0.82 : 1,
  });

  const darkMaterial = new THREE.MeshStandardMaterial({
    color: world.darkSquare,
    roughness: world.id === "bielka" ? 0.42 : 0.9,
    metalness: world.id === "jerarquia" ? 0.3 : 0.04,
    transparent: world.id === "bielka",
    opacity: world.id === "bielka" ? 0.8 : 1,
  });

  const offset = 3.5 * 0.91;

  for (let row = 0; row < 8; row += 1) {
    for (let column = 0; column < 8; column += 1) {
      const centralVoid =
        (row === 3 || row === 4) &&
        (column === 3 || column === 4);

      if (centralVoid) {
        continue;
      }

      const square = new THREE.Mesh(
        squareGeometry,
        (row + column) % 2 === 0
          ? lightMaterial
          : darkMaterial
      );

      square.position.set(
        column * 0.91 - offset,
        0,
        row * 0.91 - offset
      );

      square.castShadow = true;
      square.receiveShadow = true;

      group.add(square);
    }
  }

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: world.frame,
    roughness: 0.78,
    metalness: world.id === "jerarquia" ? 0.32 : 0.05,
  });

  const frameGeometryHorizontal = new THREE.BoxGeometry(
    7.55,
    0.22,
    0.18
  );

  const frameGeometryVertical = new THREE.BoxGeometry(
    0.18,
    0.22,
    7.55
  );

  const framePositions = [
    {
      geometry: frameGeometryHorizontal,
      position: [0, -0.03, -3.72],
    },
    {
      geometry: frameGeometryHorizontal,
      position: [0, -0.03, 3.72],
    },
    {
      geometry: frameGeometryVertical,
      position: [-3.72, -0.03, 0],
    },
    {
      geometry: frameGeometryVertical,
      position: [3.72, -0.03, 0],
    },
  ] as const;

  framePositions.forEach(({ geometry, position }) => {
    const frame = new THREE.Mesh(
      geometry,
      frameMaterial
    );

    frame.position.set(...position);
    frame.castShadow = true;
    group.add(frame);
  });

  const centralRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.78, 0.045, 12, 72),
    new THREE.MeshStandardMaterial({
      color: world.accent,
      emissive: world.accent,
      emissiveIntensity: 0.22,
      roughness: 0.45,
      metalness: 0.28,
    })
  );

  centralRing.rotation.x = Math.PI / 2;
  centralRing.position.y = 0.12;
  group.add(centralRing);

  return group;
}

export default function ThreeWorldsBoard() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectedWorldRef =
    useRef<WorldId>("desaparezcamos");

  const [selectedWorld, setSelectedWorld] =
    useState<WorldId>("desaparezcamos");

  function selectWorld(worldId: WorldId) {
    selectedWorldRef.current = worldId;
    setSelectedWorld(worldId);
  }

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const mount = container;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090c, 0.026);

    const camera = new THREE.PerspectiveCamera(
      38,
      1,
      0.1,
      100
    );

    camera.position.set(8.2, 4.8, 10.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    renderer.setClearColor(0x07090c, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type =
      THREE.PCFSoftShadowMap;

    renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    renderer.toneMapping =
      THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure = 1.08;

    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.touchAction = "pan-y";

    mount.appendChild(renderer.domElement);

    const root = new THREE.Group();
    root.rotation.y = -0.16;
    scene.add(root);

    worlds.forEach((world) => {
      const board = createBoard(world);

      if (world.id === "bielka") {
        board.rotation.y = 0.035;
      }

      if (world.id === "jerarquia") {
        board.rotation.y = -0.045;
      }

      root.add(board);
    });

    /*
     * Árbol Blanco:
     * todavía es una escultura geométrica fundacional.
     * En una fase posterior será sustituido por un modelo.
     */

    const treeMaterial =
      new THREE.MeshStandardMaterial({
        color: 0xe7e2d8,
        emissive: 0xbfae92,
        emissiveIntensity: 0.2,
        roughness: 0.78,
      });

    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.2,
        0.42,
        8.4,
        18
      ),
      treeMaterial
    );

    trunk.position.y = 0.3;
    trunk.castShadow = true;
    root.add(trunk);

    const upperBranches = [
      [0, 3.55, 0, 1.4, 4.6, 0.45],
      [0, 3.6, 0, -1.3, 4.7, 0.65],
      [0, 3.4, 0, 0.75, 4.9, -1.15],
      [0, 3.35, 0, -0.55, 4.75, -1.35],
      [0, 3.1, 0, 1.65, 4.25, -0.5],
      [0, 3.1, 0, -1.7, 4.15, -0.35],
    ];

    upperBranches.forEach(
      ([sx, sy, sz, ex, ey, ez], index) => {
        const branch = createBranch(
          new THREE.Vector3(sx, sy, sz),
          new THREE.Vector3(ex, ey, ez),
          index < 2 ? 0.13 : 0.095,
          treeMaterial
        );

        branch.castShadow = true;
        root.add(branch);
      }
    );

    const roots = [
      [0, -3.45, 0, 1.65, -4.2, 0.55],
      [0, -3.45, 0, -1.6, -4.15, 0.7],
      [0, -3.4, 0, 0.8, -4.3, -1.5],
      [0, -3.4, 0, -0.85, -4.25, -1.55],
      [0, -3.25, 0, 1.8, -3.9, -0.8],
      [0, -3.25, 0, -1.75, -3.9, -0.75],
    ];

    roots.forEach(
      ([sx, sy, sz, ex, ey, ez], index) => {
        const rootBranch = createBranch(
          new THREE.Vector3(sx, sy, sz),
          new THREE.Vector3(ex, ey, ez),
          index < 2 ? 0.15 : 0.1,
          treeMaterial
        );

        rootBranch.castShadow = true;
        root.add(rootBranch);
      }
    );

    const treeLight = new THREE.PointLight(
      0xe8d8b9,
      2.1,
      11
    );

    treeLight.position.set(0, 1.2, 0);
    root.add(treeLight);

    /*
     * Partículas: polvo, agua, ceniza y memoria.
     */

    const particleCount = 950;
    const particlePositions = new Float32Array(
      particleCount * 3
    );

    for (let index = 0; index < particleCount; index += 1) {
      particlePositions[index * 3] =
        (Math.random() - 0.5) * 18;

      particlePositions[index * 3 + 1] =
        (Math.random() - 0.5) * 13;

      particlePositions[index * 3 + 2] =
        (Math.random() - 0.5) * 18;
    }

    const particleGeometry =
      new THREE.BufferGeometry();

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        particlePositions,
        3
      )
    );

    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0xc9c1b2,
        size: 0.032,
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
      })
    );

    scene.add(particles);

    scene.add(
      new THREE.HemisphereLight(
        0xdbe7e8,
        0x171015,
        1.4
      )
    );

    const mainLight = new THREE.DirectionalLight(
      0xf0dfc4,
      2.35
    );

    mainLight.position.set(-5, 9, 6);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.set(1024, 1024);
    scene.add(mainLight);

    const bielkaLight = new THREE.PointLight(
      0xa9d4df,
      2.2,
      10
    );

    bielkaLight.position.set(1.8, 4.4, -1);
    scene.add(bielkaLight);

    const humanLight = new THREE.PointLight(
      0xd3a56d,
      1.8,
      9
    );

    humanLight.position.set(-2, 1, 2);
    scene.add(humanLight);

    const hungerLight = new THREE.PointLight(
      0x8d3025,
      1.55,
      8
    );

    hungerLight.position.set(1, -3.8, 1);
    scene.add(hungerLight);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.ShadowMaterial({
        color: 0x000000,
        opacity: 0.28,
      })
    );

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -4.65;
    floor.receiveShadow = true;
    scene.add(floor);

    let pointerX = 0;
    let pointerY = 0;

    let targetRotationY = -0.16;
    let targetRotationX = 0;

    let dragging = false;
    let activePointerId: number | null = null;
    let previousPointerX = 0;
    let previousPointerY = 0;

    let animationFrame = 0;

    renderer.domElement.style.cursor = "grab";

    function updatePointerPosition(
      event: PointerEvent
    ) {
      const rectangle =
        renderer.domElement.getBoundingClientRect();

      pointerX =
        ((event.clientX - rectangle.left) /
          rectangle.width) *
          2 -
        1;

      pointerY =
        -(
          (event.clientY - rectangle.top) /
          rectangle.height
        ) *
          2 +
        1;
    }

    function handlePointerDown(
      event: PointerEvent
    ) {
      dragging = true;
      activePointerId = event.pointerId;

      previousPointerX = event.clientX;
      previousPointerY = event.clientY;

      renderer.domElement.setPointerCapture(
        event.pointerId
      );

      renderer.domElement.style.cursor =
        "grabbing";
    }

    function handlePointerMove(
      event: PointerEvent
    ) {
      updatePointerPosition(event);

      if (
        !dragging ||
        activePointerId !== event.pointerId
      ) {
        return;
      }

      const deltaX =
        event.clientX - previousPointerX;

      const deltaY =
        event.clientY - previousPointerY;

      /*
       * En pantallas táctiles dejamos el gesto
       * vertical para el scroll y usamos
       * principalmente el desplazamiento horizontal.
       */
      if (
        event.pointerType !== "touch" ||
        Math.abs(deltaX) >= Math.abs(deltaY)
      ) {
        targetRotationY += deltaX * 0.008;
      }

      if (event.pointerType !== "touch") {
        targetRotationX = THREE.MathUtils.clamp(
          targetRotationX + deltaY * 0.0045,
          -0.34,
          0.34
        );
      }

      previousPointerX = event.clientX;
      previousPointerY = event.clientY;
    }

    function finishDragging(
      event?: PointerEvent
    ) {
      if (
        event &&
        activePointerId !== null &&
        renderer.domElement.hasPointerCapture(
          activePointerId
        )
      ) {
        renderer.domElement.releasePointerCapture(
          activePointerId
        );
      }

      dragging = false;
      activePointerId = null;

      renderer.domElement.style.cursor = "grab";
    }

    function handlePointerUp(
      event: PointerEvent
    ) {
      finishDragging(event);
    }

    function handlePointerCancel(
      event: PointerEvent
    ) {
      finishDragging(event);
    }

    function handlePointerLeave() {
      pointerX = 0;
      pointerY = 0;

      if (!dragging) {
        renderer.domElement.style.cursor = "grab";
      }
    }

    function resetRotation() {
      targetRotationY = -0.16;
      targetRotationX = 0;
    }

    renderer.domElement.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    renderer.domElement.addEventListener(
      "pointermove",
      handlePointerMove
    );

    renderer.domElement.addEventListener(
      "pointerup",
      handlePointerUp
    );

    renderer.domElement.addEventListener(
      "pointercancel",
      handlePointerCancel
    );

    renderer.domElement.addEventListener(
      "pointerleave",
      handlePointerLeave
    );

    renderer.domElement.addEventListener(
      "dblclick",
      resetRotation
    );

    function resize() {
      const width = mount.clientWidth;
      const height = mount.clientHeight;

      renderer.setSize(width, height, false);

      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    const clock = new THREE.Clock();
    const lookTarget = new THREE.Vector3();

    function animate() {
      const elapsed = clock.getElapsedTime();
      const activeWorld =
        worldById[selectedWorldRef.current];

      const desiredCameraY =
        activeWorld.height + 4.65;

      camera.position.y +=
        (desiredCameraY - camera.position.y) *
        0.035;

      const desiredX = 8.2 + pointerX * 0.55;
      const desiredZ = 10.2 + pointerY * 0.28;

      camera.position.x +=
        (desiredX - camera.position.x) * 0.03;

      camera.position.z +=
        (desiredZ - camera.position.z) * 0.03;

      lookTarget.set(
        0,
        activeWorld.height,
        0
      );

      camera.lookAt(lookTarget);

      if (!reducedMotion) {
        const hoverRotationY = dragging
          ? 0
          : pointerX * 0.022;

        const hoverRotationX = dragging
          ? 0
          : pointerY * 0.009;

        root.rotation.y +=
          (
            targetRotationY +
            hoverRotationY -
            root.rotation.y
          ) * 0.075;

        root.rotation.x +=
          (
            targetRotationX +
            hoverRotationX -
            root.rotation.x
          ) * 0.075;

        particles.rotation.y =
          elapsed * 0.006;

        particles.position.y =
          Math.sin(elapsed * 0.18) * 0.08;

        treeLight.intensity =
          2.05 + Math.sin(elapsed * 1.1) * 0.12;
      }

      renderer.render(scene, camera);

      animationFrame =
        window.requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();

      renderer.domElement.removeEventListener(
        "pointerdown",
        handlePointerDown
      );

      renderer.domElement.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      renderer.domElement.removeEventListener(
        "pointerup",
        handlePointerUp
      );

      renderer.domElement.removeEventListener(
        "pointercancel",
        handlePointerCancel
      );

      renderer.domElement.removeEventListener(
        "pointerleave",
        handlePointerLeave
      );

      renderer.domElement.removeEventListener(
        "dblclick",
        resetRotation
      );

      scene.traverse((object: THREE.Object3D) => {
        if (!(object instanceof THREE.Mesh)) {
          return;
        }

        object.geometry.dispose();

        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];

        materials.forEach(
          (material: THREE.Material) =>
            material.dispose()
        );
      });

      particleGeometry.dispose();

      const particleMaterial =
        particles.material;

      if (particleMaterial instanceof THREE.Material) {
        particleMaterial.dispose();
      }

      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  const activeWorld = worldById[selectedWorld];

  return (
    <section className="relative min-h-[900px] overflow-hidden bg-[#07090c] text-[#f0e8dc]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(226,213,187,0.1), transparent 28%), radial-gradient(circle at 20% 15%, rgba(130,176,188,0.1), transparent 26%), radial-gradient(circle at 78% 82%, rgba(115,40,31,0.16), transparent 30%)",
        }}
      />

      <div
        ref={containerRef}
        className="absolute inset-0"
        aria-hidden="true"
      />

      <div className="pointer-events-none relative z-10 mx-auto flex min-h-[900px] max-w-[1550px] flex-col justify-between px-5 py-10 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[8px] uppercase tracking-[0.45em] text-[#c7a467]">
              Obra visual interactiva
            </p>

            <h2 className="mt-5 font-serif text-4xl tracking-[-0.04em] sm:text-6xl">
              Los tres mundos
            </h2>
          </div>

          <div className="max-w-lg">
            <p className="text-sm leading-7 text-white/42">
              Tres tableros, una raíz y una memoria que
              atraviesa todos los niveles.
            </p>

            <p className="mt-3 text-[7px] uppercase tracking-[0.28em] text-[#c7a467]/70">
              Arrastra para rotar · doble clic para centrar
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-8">
          <div className="max-w-md">
            <p
              className="text-[8px] uppercase tracking-[0.36em]"
              style={{
                color: activeWorld.accent,
              }}
            >
              {activeWorld.material}
            </p>

            <p className="mt-4 font-serif text-4xl leading-none tracking-[-0.04em] sm:text-5xl">
              {activeWorld.title}
            </p>

            <p className="mt-5 text-xs uppercase tracking-[0.25em] text-white/36">
              {activeWorld.subtitle}
            </p>
          </div>

          <span
            className="hidden font-serif text-[92px] leading-none text-white/[0.06] sm:block"
            aria-hidden="true"
          >
            {activeWorld.number}
          </span>
        </div>

        <div className="pointer-events-auto grid border-l border-t border-white/10 sm:grid-cols-3">
          {worlds.map((world) => {
            const active = selectedWorld === world.id;

            return (
              <button
                key={world.id}
                type="button"
                onClick={() => selectWorld(world.id)}
                className="group border-b border-r border-white/10 px-5 py-5 text-left transition hover:bg-white/[0.035]"
                style={{
                  backgroundColor: active
                    ? "rgba(255,255,255,0.055)"
                    : "transparent",
                }}
              >
                <span
                  className="text-[7px] uppercase tracking-[0.3em]"
                  style={{
                    color: active
                      ? world.accent
                      : "rgba(255,255,255,0.32)",
                  }}
                >
                  Mundo {world.number}
                </span>

                <span className="mt-3 block font-serif text-lg text-white/70 transition group-hover:text-white">
                  {world.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
