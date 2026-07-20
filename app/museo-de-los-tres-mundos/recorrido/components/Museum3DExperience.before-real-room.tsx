"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import {
  museumArtworks,
  type MuseumArtwork,
} from "../../data/artworks";

import {
  museumRoomById,
  museumRooms,
  type MuseumRoomId,
} from "../../data/rooms";

type ArtworkObject = {
  artwork: MuseumArtwork;
  group: THREE.Group;
  frame: THREE.Mesh;
  light: THREE.PointLight;
};

const roomPositions: Record<
  MuseumRoomId,
  THREE.Vector3
> = {
  desaparezcamos: new THREE.Vector3(-15, 0, 0),
  jerarquia: new THREE.Vector3(0, 0, 0),
  bielka: new THREE.Vector3(15, 0, 0),
};

function hexToNumber(value: string) {
  return Number.parseInt(value.replace("#", ""), 16);
}

function createArtworkTexture(
  artwork: MuseumArtwork
) {
  const canvas = document.createElement("canvas");

  canvas.width = 1024;
  canvas.height =
    artwork.aspect === "portrait"
      ? 1280
      : artwork.aspect === "square"
        ? 1024
        : 768;

  const context = canvas.getContext("2d");

  if (!context) {
    return new THREE.CanvasTexture(canvas);
  }

  const gradient = context.createLinearGradient(
    0,
    0,
    canvas.width,
    canvas.height
  );

  gradient.addColorStop(0, "#24282d");
  gradient.addColorStop(0.5, "#101216");
  gradient.addColorStop(1, "#050607");

  context.fillStyle = gradient;

  context.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  const accent = artwork.accent;

  const glow = context.createRadialGradient(
    canvas.width * 0.55,
    canvas.height * 0.42,
    10,
    canvas.width * 0.55,
    canvas.height * 0.42,
    canvas.width * 0.48
  );

  glow.addColorStop(0, `${accent}88`);
  glow.addColorStop(0.42, `${accent}28`);
  glow.addColorStop(1, `${accent}00`);

  context.fillStyle = glow;

  context.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  context.strokeStyle = `${accent}66`;
  context.lineWidth = 2;

  context.strokeRect(
    canvas.width * 0.08,
    canvas.height * 0.07,
    canvas.width * 0.84,
    canvas.height * 0.86
  );

  context.fillStyle = `${accent}48`;
  context.font = `${
    canvas.width * 0.27
  }px Georgia`;

  context.textAlign = "center";
  context.textBaseline = "middle";

  context.fillText(
    artwork.symbol || "·",
    canvas.width / 2,
    canvas.height * 0.44
  );

  context.fillStyle = "#ebe5dc";
  context.font = `${
    canvas.width * 0.042
  }px Georgia`;

  context.fillText(
    artwork.title,
    canvas.width / 2,
    canvas.height * 0.76
  );

  context.fillStyle = "rgba(235,229,220,0.48)";
  context.font = `${
    canvas.width * 0.018
  }px Arial`;

  context.fillText(
    artwork.number,
    canvas.width / 2,
    canvas.height * 0.83
  );

  const texture = new THREE.CanvasTexture(
    canvas
  );

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

function disposeMaterial(
  material:
    | THREE.Material
    | THREE.Material[]
) {
  const materials = Array.isArray(material)
    ? material
    : [material];

  materials.forEach((entry) => {
    if (
      entry instanceof
        THREE.MeshStandardMaterial ||
      entry instanceof
        THREE.MeshBasicMaterial ||
      entry instanceof
        THREE.MeshPhysicalMaterial
    ) {
      entry.map?.dispose();
    }

    if (
      entry instanceof
        THREE.MeshStandardMaterial ||
      entry instanceof
        THREE.MeshPhysicalMaterial
    ) {
      entry.emissiveMap?.dispose();
    }

    entry.dispose();
  });
}

function createArtwork(
  artwork: MuseumArtwork,
  x: number,
  z: number,
  rotationY: number
): ArtworkObject {
  const group = new THREE.Group();

  group.position.set(x, 0, z);
  group.rotation.y = rotationY;

  group.userData.artworkId = artwork.id;
  group.userData.interactiveArtwork = true;

  const width =
    artwork.aspect === "portrait"
      ? 2.45
      : artwork.aspect === "square"
        ? 2.75
        : 3.25;

  const height =
    artwork.aspect === "portrait"
      ? 3.25
      : artwork.aspect === "square"
        ? 2.75
        : 2.45;

  const frameMaterial =
    new THREE.MeshStandardMaterial({
      color: hexToNumber(artwork.accent),
      emissive: hexToNumber(
        artwork.accent
      ),
      emissiveIntensity: 0.16,
      roughness: 0.35,
      metalness: 0.5,
    });

  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(
      width + 0.18,
      height + 0.18,
      0.12
    ),
    frameMaterial
  );

  frame.position.y = height / 2 + 0.72;
  frame.castShadow = true;

  frame.userData.artworkId = artwork.id;
  frame.userData.interactiveArtwork = true;

  const texture = createArtworkTexture(
    artwork
  );

  const image = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshStandardMaterial({
      map: texture,
      emissive: hexToNumber(
        artwork.accent
      ),
      emissiveIntensity: 0.05,
      roughness: 0.42,
      metalness: 0.02,
    })
  );

  image.position.set(
    0,
    height / 2 + 0.72,
    0.071
  );

  image.userData.artworkId = artwork.id;
  image.userData.interactiveArtwork = true;

  const light = new THREE.PointLight(
    hexToNumber(artwork.accent),
    1.1,
    5.5,
    2
  );

  light.position.set(
    0,
    height / 2 + 0.8,
    1.2
  );

  const labelBase = new THREE.Mesh(
    new THREE.BoxGeometry(
      Math.min(width * 0.72, 1.8),
      0.045,
      0.16
    ),
    new THREE.MeshStandardMaterial({
      color: 0xd8d1c6,
      emissive: 0x70685e,
      emissiveIntensity: 0.08,
      roughness: 0.75,
    })
  );

  labelBase.position.set(
    0,
    0.34,
    0.14
  );

  group.add(
    frame,
    image,
    light,
    labelBase
  );

  return {
    artwork,
    group,
    frame,
    light,
  };
}

function createMuseumRoom(
  roomId: MuseumRoomId
) {
  const room = museumRoomById[roomId];
  const group = new THREE.Group();

  group.position.copy(roomPositions[roomId]);

  const wallMaterial =
    new THREE.MeshStandardMaterial({
      color: hexToNumber(room.wall),
      roughness: 0.92,
      metalness: 0.02,
    });

  const floorMaterial =
    new THREE.MeshPhysicalMaterial({
      color:
        roomId === "jerarquia"
          ? 0x0c0b0d
          : 0x101317,
      roughness: 0.2,
      metalness:
        roomId === "jerarquia"
          ? 0.42
          : 0.24,
      clearcoat: 0.55,
      clearcoatRoughness: 0.22,
    });

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 13),
    floorMaterial
  );

  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;

  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(
      12,
      6,
      0.3
    ),
    wallMaterial
  );

  backWall.position.set(0, 3, -5.2);
  backWall.receiveShadow = true;

  const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(
      0.3,
      6,
      10.5
    ),
    wallMaterial
  );

  leftWall.position.set(-6, 3, 0);
  leftWall.receiveShadow = true;

  const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(
      0.3,
      6,
      10.5
    ),
    wallMaterial
  );

  rightWall.position.set(6, 3, 0);
  rightWall.receiveShadow = true;

  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 13),
    new THREE.MeshStandardMaterial({
      color: 0x07080a,
      roughness: 0.98,
    })
  );

  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = 6;

  const roomLight =
    new THREE.PointLight(
      hexToNumber(room.glow),
      roomId === "jerarquia"
        ? 0.85
        : 1.1,
      14,
      2
    );

  roomLight.position.set(0, 4.7, 1.6);

  group.add(
    floor,
    backWall,
    leftWall,
    rightWall,
    ceiling,
    roomLight
  );

  return group;
}

export default function Museum3DExperience() {
  const containerRef =
    useRef<HTMLDivElement | null>(null);

  const activeRoomRef =
    useRef<MuseumRoomId>(
      "desaparezcamos"
    );

  const [activeRoom, setActiveRoom] =
    useState<MuseumRoomId>(
      "desaparezcamos"
    );

  const [
    selectedArtwork,
    setSelectedArtwork,
  ] = useState<MuseumArtwork | null>(null);

  function selectRoom(roomId: MuseumRoomId) {
    activeRoomRef.current = roomId;
    setActiveRoom(roomId);
    setSelectedArtwork(null);
  }

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const mount = container;

    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    const scene = new THREE.Scene();

    scene.background = new THREE.Color(
      0x050608
    );

    scene.fog = new THREE.FogExp2(
      0x050608,
      0.022
    );

    const camera =
      new THREE.PerspectiveCamera(
        42,
        1,
        0.1,
        120
      );

    camera.position.set(
      roomPositions.desaparezcamos.x,
      2.35,
      8.7
    );

    const renderer =
      new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
      });

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2
      )
    );

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type =
      THREE.PCFSoftShadowMap;

    renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    renderer.toneMapping =
      THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure = 1.04;

    renderer.domElement.style.display =
      "block";

    renderer.domElement.style.width =
      "100%";

    renderer.domElement.style.height =
      "100%";

    renderer.domElement.style.cursor =
      "grab";

    renderer.domElement.style.touchAction =
      "pan-y";

    mount.appendChild(renderer.domElement);

    const museum = new THREE.Group();

    scene.add(museum);

    museumRooms.forEach((room) => {
      museum.add(createMuseumRoom(room.id));
    });

    const artworkObjects: ArtworkObject[] =
      [];

    museumRooms.forEach((room) => {
      const roomRoot = museum.children.find(
        (child) =>
          child.position.x ===
          roomPositions[room.id].x
      );

      if (!roomRoot) {
        return;
      }

      const roomArtworks =
        museumArtworks.filter(
          (artwork) =>
            artwork.room === room.id
        );

      const placements = [
        {
          x: -3.8,
          z: -5,
          rotationY: 0,
        },
        {
          x: 0,
          z: -5,
          rotationY: 0,
        },
        {
          x: 3.8,
          z: -5,
          rotationY: 0,
        },
      ];

      roomArtworks.forEach(
        (artwork, index) => {
          const placement =
            placements[index];

          if (!placement) {
            return;
          }

          const object = createArtwork(
            artwork,
            placement.x,
            placement.z,
            placement.rotationY
          );

          roomRoot.add(object.group);
          artworkObjects.push(object);
        }
      );
    });

    const ambient =
      new THREE.HemisphereLight(
        0x77858d,
        0x050506,
        0.46
      );

    scene.add(ambient);

    const pointer =
      new THREE.Vector2();

    const raycaster =
      new THREE.Raycaster();

    let hoveredArtwork:
      | ArtworkObject
      | null = null;

    let dragging = false;
    let activePointerId:
      | number
      | null = null;

    let previousX = 0;
    let previousY = 0;
    let dragDistance = 0;

    let targetYaw = 0;
    let yaw = 0;
    let targetPitch = 0;
    let pitch = 0;

    let pointerX = 0;
    let pointerY = 0;

    let animationFrame = 0;

    function findArtwork(
      object: THREE.Object3D | null
    ) {
      let current = object;

      while (current) {
        const artworkId =
          current.userData
            .artworkId as
            | string
            | undefined;

        if (artworkId) {
          return (
            artworkObjects.find(
              (entry) =>
                entry.artwork.id ===
                artworkId
            ) || null
          );
        }

        current = current.parent;
      }

      return null;
    }

    function setHoveredArtwork(
      artwork: ArtworkObject | null
    ) {
      if (
        artwork === hoveredArtwork
      ) {
        return;
      }

      hoveredArtwork = artwork;

      renderer.domElement.style.cursor =
        dragging
          ? "grabbing"
          : artwork
            ? "pointer"
            : "grab";
    }

    function updatePointer(
      event: PointerEvent
    ) {
      const rectangle =
        renderer.domElement.getBoundingClientRect();

      pointerX =
        ((event.clientX -
          rectangle.left) /
          rectangle.width) *
          2 -
        1;

      pointerY =
        -(
          (event.clientY -
            rectangle.top) /
          rectangle.height
        ) *
          2 +
        1;

      pointer.set(pointerX, pointerY);

      raycaster.setFromCamera(
        pointer,
        camera
      );

      const intersections =
        raycaster.intersectObjects(
          artworkObjects.map(
            (entry) => entry.group
          ),
          true
        );

      setHoveredArtwork(
        findArtwork(
          intersections[0]?.object ||
            null
        )
      );
    }

    function handlePointerDown(
      event: PointerEvent
    ) {
      dragging = true;
      activePointerId =
        event.pointerId;

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
        activePointerId !==
          event.pointerId
      ) {
        return;
      }

      const deltaX =
        event.clientX - previousX;

      const deltaY =
        event.clientY - previousY;

      dragDistance +=
        Math.abs(deltaX) +
        Math.abs(deltaY);

      targetYaw =
        THREE.MathUtils.clamp(
          targetYaw -
            deltaX * 0.0028,
          -0.32,
          0.32
        );

      targetPitch =
        THREE.MathUtils.clamp(
          targetPitch +
            deltaY * 0.0024,
          -0.18,
          0.18
        );

      previousX = event.clientX;
      previousY = event.clientY;
    }

    function finishPointer(
      event: PointerEvent
    ) {
      if (
        activePointerId !== null &&
        renderer.domElement.hasPointerCapture(
          activePointerId
        )
      ) {
        renderer.domElement.releasePointerCapture(
          activePointerId
        );
      }

      const clickedArtwork =
        dragDistance < 7
          ? hoveredArtwork
          : null;

      dragging = false;
      activePointerId = null;

      if (clickedArtwork) {
        setSelectedArtwork(
          clickedArtwork.artwork
        );
      }

      renderer.domElement.style.cursor =
        hoveredArtwork
          ? "pointer"
          : "grab";
    }

    function handlePointerLeave() {
      pointerX = 0;
      pointerY = 0;

      if (!dragging) {
        setHoveredArtwork(null);
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

    function animate() {
      const elapsed =
        clock.getElapsedTime();

      const roomPosition =
        roomPositions[
          activeRoomRef.current
        ];

      camera.position.x +=
        (roomPosition.x -
          camera.position.x) *
        (reducedMotion ? 0.18 : 0.045);

      camera.position.y +=
        (2.35 -
          camera.position.y) *
        0.05;

      camera.position.z +=
        (8.7 -
          camera.position.z) *
        0.05;

      yaw +=
        (targetYaw - yaw) * 0.055;

      pitch +=
        (targetPitch - pitch) *
        0.055;

      camera.lookAt(
        roomPosition.x +
          Math.sin(yaw) * 3.3,
        2.3 - pitch * 5,
        -4.3
      );

      artworkObjects.forEach(
        (entry, index) => {
          const hovered =
            hoveredArtwork === entry;

          const selected =
            selectedArtwork?.id ===
            entry.artwork.id;

          const pulse =
            Math.sin(
              elapsed * 1.15 +
                index * 0.65
            );

          entry.light.intensity =
            selected
              ? 2.1 + pulse * 0.12
              : hovered
                ? 1.7 + pulse * 0.1
                : 1.05 + pulse * 0.04;

          const targetScale =
            selected
              ? 1.035
              : hovered
                ? 1.018
                : 1;

          entry.group.scale.lerp(
            new THREE.Vector3(
              targetScale,
              targetScale,
              targetScale
            ),
            0.08
          );
        }
      );

      renderer.render(scene, camera);

      animationFrame =
        window.requestAnimationFrame(
          animate
        );
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
          if (
            !(
              object instanceof
              THREE.Mesh
            )
          ) {
            return;
          }

          object.geometry.dispose();

          disposeMaterial(
            object.material
          );
        }
      );

      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [selectedArtwork]);

  const room =
    museumRoomById[activeRoom];

  return (
    <section className="relative min-h-[900px] overflow-hidden bg-[#050608] text-[#f0e8dc]">
      <div
        ref={containerRef}
        className="absolute inset-0"
        aria-hidden="true"
      />

      <div className="pointer-events-none relative z-10 mx-auto flex min-h-[900px] max-w-[1550px] flex-col justify-between px-5 py-8 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[8px] uppercase tracking-[0.48em] text-[#c7a467]">
              Recorrido tridimensional
            </p>

            <h1 className="mt-4 font-serif text-4xl tracking-[-0.045em] sm:text-6xl">
              El museo interior
            </h1>
          </div>

          <p className="max-w-md text-[7px] uppercase tracking-[0.27em] text-white/30">
            Arrastra para mirar · pulsa una obra
          </p>
        </div>

        <div className="max-w-lg">
          <p
            className="text-[8px] uppercase tracking-[0.36em]"
            style={{
              color: room.accent,
            }}
          >
            Sala {room.number}
          </p>

          <h2 className="mt-4 font-serif text-4xl leading-[0.95] tracking-[-0.045em] sm:text-6xl">
            {room.title}
          </h2>

          <p className="mt-6 font-serif text-xl italic leading-8 text-white/48">
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
                onClick={() =>
                  selectRoom(entry.id)
                }
                className="border-b border-r border-white/10 bg-black/25 px-5 py-5 text-left backdrop-blur-md transition hover:bg-white/[0.05]"
              >
                <span
                  className="text-[7px] uppercase tracking-[0.3em]"
                  style={{
                    color: selected
                      ? entry.accent
                      : "rgba(255,255,255,0.28)",
                  }}
                >
                  Sala {entry.number}
                </span>

                <span className="mt-3 block font-serif text-lg text-white/68">
                  {entry.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedArtwork && (
        <article className="pointer-events-auto absolute right-5 top-28 z-30 w-[min(440px,calc(100%-2.5rem))] border border-white/12 bg-black/72 p-6 backdrop-blur-xl sm:right-8 sm:p-8 lg:right-12">
          <div className="flex items-start justify-between gap-8">
            <p
              className="text-[7px] uppercase tracking-[0.34em]"
              style={{
                color:
                  selectedArtwork.accent,
              }}
            >
              Obra {selectedArtwork.number}
            </p>

            <button
              type="button"
              onClick={() =>
                setSelectedArtwork(null)
              }
              className="text-[7px] uppercase tracking-[0.25em] text-white/38 transition hover:text-white"
            >
              Cerrar
            </button>
          </div>

          <h3 className="mt-5 font-serif text-4xl leading-none tracking-[-0.04em] text-white">
            {selectedArtwork.title}
          </h3>

          <p className="mt-5 text-[7px] uppercase tracking-[0.24em] text-white/30">
            {selectedArtwork.subtitle}
          </p>

          <blockquote className="mt-7 border-l border-white/12 pl-5 font-serif text-xl italic leading-8 text-white/58">
            {
              selectedArtwork.curatorialText
            }
          </blockquote>
        </article>
      )}
    </section>
  );
}
