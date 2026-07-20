"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import {
  museumRoomById,
  museumRooms,
  type MuseumRoomId,
} from "../data/rooms";

type PortalData = {
  id: MuseumRoomId;
  group: THREE.Group;
  frame: THREE.Mesh;
  light: THREE.PointLight;
};

function disposeMaterial(
  material: THREE.Material | THREE.Material[]
) {
  const materials = Array.isArray(material)
    ? material
    : [material];

  materials.forEach((entry) => entry.dispose());
}

function createPortal(
  roomId: MuseumRoomId,
  x: number,
  z: number,
  rotationY: number
): PortalData {
  const room = museumRoomById[roomId];
  const group = new THREE.Group();

  group.position.set(x, 0, z);
  group.rotation.y = rotationY;
  group.userData.roomId = roomId;
  group.userData.interactivePortal = true;

  const wallMaterial = new THREE.MeshStandardMaterial({
    color: room.wall,
    roughness: 0.88,
    metalness: 0.04,
  });

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: room.accent,
    emissive: room.glow,
    emissiveIntensity: 0.42,
    roughness: 0.34,
    metalness: 0.48,
  });

  const imageMaterial = new THREE.MeshPhysicalMaterial({
    color: room.glow,
    emissive: room.glow,
    emissiveIntensity: 0.23,
    roughness: 0.22,
    transmission: 0.12,
    transparent: true,
    opacity: 0.76,
    clearcoat: 0.65,
    clearcoatRoughness: 0.22,
  });

  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(4.8, 4.5, 0.28),
    wallMaterial
  );

  wall.position.y = 2.25;
  wall.receiveShadow = true;
  group.add(wall);

  const image = new THREE.Mesh(
    new THREE.PlaneGeometry(2.75, 3.25),
    imageMaterial
  );

  image.position.set(0, 2.3, 0.151);
  image.userData.roomId = roomId;
  image.userData.interactivePortal = true;
  group.add(image);

  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(3.02, 3.52, 0.14),
    frameMaterial
  );

  frame.position.set(0, 2.3, 0.09);
  frame.userData.roomId = roomId;
  frame.userData.interactivePortal = true;
  group.add(frame);

  const innerVoid = new THREE.Mesh(
    new THREE.BoxGeometry(2.78, 3.28, 0.18),
    new THREE.MeshBasicMaterial({
      color: 0x0a0b0d,
      transparent: true,
      opacity: 0.93,
    })
  );

  innerVoid.position.set(0, 2.3, 0.18);
  group.add(innerVoid);

  image.position.z = 0.285;

  const pedestal = new THREE.Mesh(
    new THREE.BoxGeometry(3.3, 0.12, 0.55),
    new THREE.MeshStandardMaterial({
      color: 0x141518,
      roughness: 0.72,
      metalness: 0.16,
    })
  );

  pedestal.position.set(0, 0.12, 0.35);
  pedestal.castShadow = true;
  group.add(pedestal);

  const light = new THREE.PointLight(
    room.glow,
    2.4,
    7,
    2
  );

  light.position.set(0, 2.4, 1.2);
  group.add(light);

  return {
    id: roomId,
    group,
    frame,
    light,
  };
}

export default function MuseumVestibule() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [activeRoom, setActiveRoom] =
    useState<MuseumRoomId>("desaparezcamos");

  const activeRoomRef =
    useRef<MuseumRoomId>("desaparezcamos");

  useEffect(() => {
    activeRoomRef.current = activeRoom;
  }, [activeRoom]);

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
    scene.background = new THREE.Color(0x07080a);
    scene.fog = new THREE.FogExp2(0x07080a, 0.035);

    const camera = new THREE.PerspectiveCamera(
      42,
      1,
      0.1,
      100
    );

    camera.position.set(0, 2.4, 11.5);

    const renderer = new THREE.WebGLRenderer({
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

    renderer.toneMappingExposure = 1.08;

    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.cursor = "grab";
    renderer.domElement.style.touchAction = "pan-y";

    mount.appendChild(renderer.domElement);

    const room = new THREE.Group();
    scene.add(room);

    const floorMaterial =
      new THREE.MeshPhysicalMaterial({
        color: 0x0d0f12,
        roughness: 0.18,
        metalness: 0.28,
        clearcoat: 0.68,
        clearcoatRoughness: 0.2,
      });

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(26, 26),
      floorMaterial
    );

    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    room.add(floor);

    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(26, 26),
      new THREE.MeshStandardMaterial({
        color: 0x08090b,
        roughness: 0.98,
      })
    );

    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 6;
    room.add(ceiling);

    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(20, 6, 0.34),
      new THREE.MeshStandardMaterial({
        color: 0x0d0f12,
        roughness: 0.9,
      })
    );

    backWall.position.set(0, 3, -5.4);
    backWall.receiveShadow = true;
    room.add(backWall);

    const portals: PortalData[] = [
      createPortal(
        "desaparezcamos",
        -5.25,
        -4.9,
        0
      ),
      createPortal(
        "jerarquia",
        0,
        -5.05,
        0
      ),
      createPortal(
        "bielka",
        5.25,
        -4.9,
        0
      ),
    ];

    portals.forEach((portal) => {
      room.add(portal.group);
    });

    const bench = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 0.38, 0.78),
      new THREE.MeshStandardMaterial({
        color: 0x18191c,
        roughness: 0.65,
        metalness: 0.14,
      })
    );

    bench.position.set(0, 0.52, 3.45);
    bench.castShadow = true;
    bench.receiveShadow = true;
    room.add(bench);

    const benchBase = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.42, 0.38),
      new THREE.MeshStandardMaterial({
        color: 0x0a0b0d,
        roughness: 0.8,
        metalness: 0.25,
      })
    );

    benchBase.position.set(0, 0.23, 3.45);
    benchBase.castShadow = true;
    room.add(benchBase);

    const ambient = new THREE.HemisphereLight(
      0x8ca1a8,
      0x08090a,
      0.56
    );

    scene.add(ambient);

    const topLight = new THREE.DirectionalLight(
      0xd9d1c3,
      1.35
    );

    topLight.position.set(-2, 7, 5);
    topLight.castShadow = true;
    topLight.shadow.mapSize.set(1024, 1024);
    scene.add(topLight);

    const particlesCount = 600;
    const particlePositions = new Float32Array(
      particlesCount * 3
    );

    for (
      let index = 0;
      index < particlesCount;
      index += 1
    ) {
      particlePositions[index * 3] =
        (Math.random() - 0.5) * 19;

      particlePositions[index * 3 + 1] =
        Math.random() * 5.8;

      particlePositions[index * 3 + 2] =
        (Math.random() - 0.5) * 14;
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
        color: 0xc8c0b4,
        size: 0.025,
        transparent: true,
        opacity: 0.24,
        depthWrite: false,
      })
    );

    scene.add(particles);

    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    let pointerX = 0;
    let pointerY = 0;
    let dragging = false;
    let pointerId: number | null = null;
    let previousX = 0;
    let previousY = 0;
    let dragDistance = 0;
    let yaw = 0;
    let targetYaw = 0;
    let hoveredPortal: PortalData | null = null;
    let animationFrame = 0;

    function findPortal(
      object: THREE.Object3D | null
    ) {
      let current = object;

      while (current) {
        const roomId =
          current.userData.roomId as
            | MuseumRoomId
            | undefined;

        if (roomId) {
          return (
            portals.find(
              (portal) => portal.id === roomId
            ) || null
          );
        }

        current = current.parent;
      }

      return null;
    }

    function setHoveredPortal(
      portal: PortalData | null
    ) {
      hoveredPortal = portal;

      renderer.domElement.style.cursor =
        portal && !dragging
          ? "pointer"
          : dragging
            ? "grabbing"
            : "grab";
    }

    function updatePointer(
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

      pointer.set(pointerX, pointerY);
      raycaster.setFromCamera(pointer, camera);

      const intersections =
        raycaster.intersectObjects(
          portals.map((portal) => portal.group),
          true
        );

      setHoveredPortal(
        findPortal(
          intersections[0]?.object || null
        )
      );
    }

    function handlePointerDown(
      event: PointerEvent
    ) {
      dragging = true;
      pointerId = event.pointerId;
      previousX = event.clientX;
      previousY = event.clientY;
      dragDistance = 0;

      renderer.domElement.setPointerCapture(
        event.pointerId
      );

      renderer.domElement.style.cursor =
        "grabbing";
    }

    function handlePointerMove(
      event: PointerEvent
    ) {
      updatePointer(event);

      if (
        !dragging ||
        pointerId !== event.pointerId
      ) {
        return;
      }

      const deltaX =
        event.clientX - previousX;

      const deltaY =
        event.clientY - previousY;

      dragDistance +=
        Math.abs(deltaX) + Math.abs(deltaY);

      targetYaw = THREE.MathUtils.clamp(
        targetYaw + deltaX * 0.0026,
        -0.23,
        0.23
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

      const clickedPortal =
        dragDistance < 7
          ? hoveredPortal
          : null;

      dragging = false;
      pointerId = null;

      if (clickedPortal) {
        setActiveRoom(clickedPortal.id);

        const target =
          museumRoomById[clickedPortal.id];

        document
          .querySelector(target.href)
          ?.scrollIntoView({
            behavior: reducedMotion
              ? "auto"
              : "smooth",
            block: "start",
          });
      }

      renderer.domElement.style.cursor =
        hoveredPortal ? "pointer" : "grab";
    }

    function handlePointerLeave() {
      pointerX = 0;
      pointerY = 0;

      if (!dragging) {
        setHoveredPortal(null);
      }
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
      finishPointer
    );

    renderer.domElement.addEventListener(
      "pointercancel",
      finishPointer
    );

    renderer.domElement.addEventListener(
      "pointerleave",
      handlePointerLeave
    );

    function resize() {
      const width = mount.clientWidth;
      const height = mount.clientHeight;

      renderer.setSize(width, height, false);

      camera.aspect =
        width / Math.max(height, 1);

      camera.updateProjectionMatrix();
    }

    const resizeObserver =
      new ResizeObserver(resize);

    resizeObserver.observe(mount);
    resize();

    const clock = new THREE.Clock();

    function animate() {
      const elapsed = clock.getElapsedTime();

      yaw += (targetYaw - yaw) * 0.04;

      camera.position.x =
        Math.sin(yaw) * 4.2 +
        pointerX * 0.12;

      camera.position.y =
        2.4 + pointerY * 0.08;

      camera.lookAt(0, 2.2, -4.3);

      portals.forEach((portal, index) => {
        const selected =
          activeRoomRef.current === portal.id;

        const hovered =
          hoveredPortal?.id === portal.id;

        const pulse =
          Math.sin(
            elapsed * 1.2 + index * 0.85
          );

        portal.light.intensity =
          selected
            ? 3.2 + pulse * 0.2
            : hovered
              ? 2.9 + pulse * 0.16
              : 2.15 + pulse * 0.08;

        const targetScale =
          selected
            ? 1.035
            : hovered
              ? 1.02
              : 1;

        portal.group.scale.lerp(
          new THREE.Vector3(
            targetScale,
            targetScale,
            targetScale
          ),
          0.08
        );
      });

      if (!reducedMotion) {
        particles.rotation.y =
          elapsed * 0.004;

        particles.position.y =
          Math.sin(elapsed * 0.16) * 0.03;
      }

      renderer.render(scene, camera);

      animationFrame =
        window.requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.cancelAnimationFrame(
        animationFrame
      );

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
        finishPointer
      );

      renderer.domElement.removeEventListener(
        "pointercancel",
        finishPointer
      );

      renderer.domElement.removeEventListener(
        "pointerleave",
        handlePointerLeave
      );

      scene.traverse(
        (object: THREE.Object3D) => {
          if (!(object instanceof THREE.Mesh)) {
            return;
          }

          object.geometry.dispose();
          disposeMaterial(object.material);
        }
      );

      particleGeometry.dispose();
      disposeMaterial(particles.material);

      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  const room = museumRoomById[activeRoom];

  return (
    <section className="relative min-h-[900px] overflow-hidden border-y border-white/10 bg-[#07080a] text-[#f0e8dc]">
      <div
        ref={containerRef}
        className="absolute inset-0"
        aria-hidden="true"
      />

      <div className="pointer-events-none relative z-10 mx-auto flex min-h-[900px] max-w-[1550px] flex-col justify-between px-5 py-10 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[8px] uppercase tracking-[0.48em] text-[#c7a467]">
              Vestíbulo
            </p>

            <h2 className="mt-5 font-serif text-4xl tracking-[-0.045em] sm:text-6xl">
              Las tres salas
            </h2>
          </div>

          <div className="max-w-xl">
            <p className="text-sm leading-7 text-white/42">
              Entra por una obra. El museo conservará
              aquello que las novelas no pueden mostrar
              con palabras.
            </p>

            <p className="mt-3 text-[7px] uppercase tracking-[0.28em] text-[#c7a467]/65">
              Arrastra para contemplar · pulsa una sala
            </p>
          </div>
        </div>

        <div className="max-w-xl">
          <p
            className="text-[8px] uppercase tracking-[0.36em]"
            style={{ color: room.accent }}
          >
            Sala {room.number}
          </p>

          <h3 className="mt-4 font-serif text-4xl leading-[0.98] tracking-[-0.045em] sm:text-6xl">
            {room.title}
          </h3>

          <p className="mt-5 text-[8px] uppercase tracking-[0.27em] text-white/34">
            {room.subtitle}
          </p>

          <p className="mt-7 font-serif text-2xl italic leading-9 text-white/54">
            {room.sentence}
          </p>
        </div>

        <div className="pointer-events-auto grid border-l border-t border-white/10 sm:grid-cols-3">
          {museumRooms.map((entry) => {
            const selected =
              entry.id === activeRoom;

            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => {
                  setActiveRoom(entry.id);

                  document
                    .querySelector(entry.href)
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                }}
                className="group border-b border-r border-white/10 px-5 py-5 text-left transition hover:bg-white/[0.035]"
                style={{
                  backgroundColor: selected
                    ? "rgba(255,255,255,0.055)"
                    : "transparent",
                }}
              >
                <span
                  className="text-[7px] uppercase tracking-[0.3em]"
                  style={{
                    color: selected
                      ? entry.accent
                      : "rgba(255,255,255,0.3)",
                  }}
                >
                  Sala {entry.number}
                </span>

                <span className="mt-3 block font-serif text-lg text-white/68 transition group-hover:text-white">
                  {entry.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
EOF+cat > app/museo-de-los-tres-mundos/page.tsx <<'EOF'
import Link from "next/link";

import MuseumVestibule from "./components/MuseumVestibule";
import { museumRooms } from "./data/rooms";

export default function MuseumPage() {
  return (
    <main className="min-h-screen bg-[#07080a] text-[#f0e8dc]">
      <header className="relative z-50 border-b border-white/10 bg-[#07080a]/92 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] max-w-[1550px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="font-serif text-xl tracking-[-0.025em]"
          >
            Poema Universal
          </Link>

          <p className="hidden text-[8px] uppercase tracking-[0.33em] text-white/32 sm:block">
            Museo interior · tres mundos
          </p>

          <Link
            href="/"
            className="border border-white/15 px-5 py-2.5 text-[8px] uppercase tracking-[0.3em] text-white/55 transition hover:border-white/35 hover:text-white"
          >
            Volver a la casa
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-white/10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 70% 22%, rgba(185,220,226,0.09), transparent 29%), radial-gradient(circle at 22% 78%, rgba(139,61,48,0.12), transparent 34%)",
          }}
        />

        <div className="relative mx-auto max-w-[1550px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <p className="text-[9px] uppercase tracking-[0.52em] text-[#c7a467]">
            Archivo visual del tríptico
          </p>

          <h1 className="mt-9 max-w-6xl font-serif text-6xl leading-[0.88] tracking-[-0.065em] sm:text-8xl lg:text-[126px]">
            Museo de los
            <span className="block italic text-white/34">
              Tres Mundos.
            </span>
          </h1>

          <p className="mt-12 max-w-3xl font-serif text-2xl leading-[1.42] text-white/66 sm:text-3xl">
            Hay imágenes que no ilustran una historia.
            La recuerdan antes de que haya sucedido.
          </p>

          <p className="mt-6 max-w-2xl text-sm leading-8 text-white/4૦">
            Este museo conservará las escenas, reliquias,
            rostros y lugares nacidos alrededor de las tres
            novelas.
          </p>

          <Link
            href="#vestibulo"
            className="mt-11 inline-flex border-b border-[#c7a467]/45 pb-2 text-[8px] uppercase tracking-[0.34em] text-[#c7a467]"
          >
            Entrar en el museo ↓
          </Link>
        </div>
      </section>

      <div id="vestibulo">
        <MuseumVestibule />
      </div>

      {museumRooms.map((room) => (
        <section
          key={room.id}
          id={`sala-${room.id}`}
          className="scroll-mt-20 border-t border-white/10"
          style={{
            background: `radial-gradient(circle at 75% 30%, ${room.glow}12, transparent 30%), #090b0e`,
          }}
        >
          <div className="mx-auto grid min-h-[620px] max-w-[1550px] items-center gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:px-12">
            <div>
              <p
                className="text-[8px] uppercase tracking-[0.42em]"
                style={{ color: room.accent }}
              >
                Sala {room.number}
              </p>

              <h2 className="mt-7 font-serif text-5xl leading-[0.95] tracking-[-0.055em] sm:text-7xl">
                {room.title}
              </h2>

              <p className="mt-7 text-[8px] uppercase tracking-[0.27em] text-white/32">
                {room.subtitle}
              </p>

              <p className="mt-10 max-w-lg font-serif text-2xl italic leading-9 text-white/52">
                {room.sentence}
              </p>
            </div>

            <div className="relative min-h-[410px] border border-white/10 bg-black/20 p-5 sm:p-8">
              <div
                className="flex min-h-[350px] items-center justify-center border"
                style={{
                  borderColor: `${room.accent}45`,
                  background: `radial-gradient(circle at 50% 42%, ${room.glow}22, transparent 34%), linear-gradient(145deg, ${room.wall}, #08090b)`,
                  boxShadow: `0 0 80px ${room.glow}0f`,
                }}
              >
                <div className="max-w-md px-8 text-center">
                  <p
                    className="font-serif text-4xl italic"
                    style={{ color: room.accent }}
                  >
                    La primera obra espera.
                  </p>

                  <p className="mt-6 text-[8px] uppercase tracking-[0.3em] text-white/28">
                    Espacio reservado para la exposición
                    fotográfica
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="border-t border-white/10 bg-[#07080a]">
        <div className="mx-auto grid max-w-[1550px] gap-10 px-5 py-24 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:px-12">
          <p className="text-[8px] uppercase tracking-[0.42em] text-[#c7a467]">
            La Cámara Clara
          </p>

          <div>
            <p className="max-w-4xl font-serif text-4xl leading-[1.2] tracking-[-0.04em] text-white/68 sm:text-6xl">
              Una imagen ocupará toda la habitación.
            </p>

            <p className="mt-7 max-w-2xl text-sm leading-8 text-white/38">
              El resto del museo desaparecerá para que cada
              obra tenga tiempo, silencio y una distancia
              propia de contemplación.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1550px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-lg">
            Museo de los Tres Mundos
          </p>

          <p className="text-[7px] uppercase tracking-[0.32em] text-white/26">
            Vestíbulo fundacional · fase I
          </p>
        </div>
      </footer>
    </main>
  );
}
