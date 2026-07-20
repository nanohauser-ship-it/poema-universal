"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type TableObject = {
  label: string;
  target: string;
};

const tableObjects: TableObject[] = [
  {
    label: "Proyecto fundacional",
    target: "proyecto-fundacional",
  },
  {
    label: "Principios",
    target: "principios",
  },
  {
    label: "Ramas de acción",
    target: "ramas",
  },
  {
    label: "Cámara Clara",
    target: "transparencia",
  },
  {
    label: "Poner un lugar",
    target: "participar",
  },
];

function scrollToTarget(target: string) {
  document.getElementById(target)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export default function MesaDelMundo() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeLabel, setActiveLabel] = useState(
    "Acércate a la mesa"
  );

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      36,
      1,
      0.1,
      100
    );

    camera.position.set(0, 4.7, 7.8);
    camera.lookAt(0, 0.45, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type =
      THREE.PCFSoftShadowMap;
    renderer.outputColorSpace =
      THREE.SRGBColorSpace;
    renderer.toneMapping =
      THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "pan-y";

    container.appendChild(renderer.domElement);

    const root = new THREE.Group();
    root.rotation.x = -0.03;
    scene.add(root);

    const interactiveObjects: THREE.Object3D[] = [];

    function makeInteractive(
      object: THREE.Object3D,
      label: string,
      target: string
    ) {
      object.userData.interactive = true;
      object.userData.label = label;
      object.userData.target = target;

      interactiveObjects.push(object);
    }

    const woodMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x604532,
        roughness: 0.88,
        metalness: 0.03,
      });

    const darkWoodMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x35251c,
        roughness: 0.92,
      });

    const paperMaterial =
      new THREE.MeshStandardMaterial({
        color: 0xe7dccb,
        roughness: 0.95,
      });

    const goldMaterial =
      new THREE.MeshStandardMaterial({
        color: 0xc7a467,
        roughness: 0.48,
        metalness: 0.38,
      });

    const ceramicMaterial =
      new THREE.MeshStandardMaterial({
        color: 0xd9d0c2,
        roughness: 0.72,
      });

    const blackMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x111418,
        roughness: 0.77,
      });

    // Mesa

    const tabletop = new THREE.Mesh(
      new THREE.BoxGeometry(6.9, 0.28, 3.9),
      woodMaterial
    );

    tabletop.position.y = 0.1;
    tabletop.castShadow = true;
    tabletop.receiveShadow = true;
    root.add(tabletop);

    const tableEdge = new THREE.Mesh(
      new THREE.BoxGeometry(7.02, 0.13, 4.02),
      darkWoodMaterial
    );

    tableEdge.position.y = -0.07;
    root.add(tableEdge);

    const legGeometry = new THREE.BoxGeometry(
      0.32,
      2.15,
      0.32
    );

    const legPositions = [
      [-2.85, -1.1, -1.35],
      [2.85, -1.1, -1.35],
      [-2.85, -1.1, 1.35],
      [2.85, -1.1, 1.35],
    ];

    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(
        legGeometry,
        darkWoodMaterial
      );

      leg.position.set(x, y, z);
      leg.castShadow = true;
      root.add(leg);
    });

    // Plato: proyecto fundacional

    const plateGroup = new THREE.Group();
    plateGroup.position.set(-1.75, 0.32, 0.35);

    const plate = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.72,
        0.79,
        0.08,
        64
      ),
      ceramicMaterial
    );

    plate.castShadow = true;
    plate.receiveShadow = true;
    plateGroup.add(plate);

    const plateRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.51, 0.025, 12, 64),
      goldMaterial
    );

    plateRing.rotation.x = Math.PI / 2;
    plateRing.position.y = 0.055;
    plateGroup.add(plateRing);

    const plateCenter = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.2,
        0.2,
        0.025,
        40
      ),
      goldMaterial
    );

    plateCenter.position.y = 0.075;
    plateGroup.add(plateCenter);

    makeInteractive(
      plateGroup,
      "Proyecto fundacional · Parálisis cerebral",
      "proyecto-fundacional"
    );

    root.add(plateGroup);

    // Cuchara

    const spoonGroup = new THREE.Group();
    spoonGroup.position.set(-0.75, 0.38, 0.42);
    spoonGroup.rotation.y = -0.12;

    const spoonHandle = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.035,
        0.045,
        1.16,
        20
      ),
      goldMaterial
    );

    spoonHandle.rotation.z = Math.PI / 2;
    spoonGroup.add(spoonHandle);

    const spoonBowl = new THREE.Mesh(
      new THREE.SphereGeometry(
        0.16,
        24,
        16,
        0,
        Math.PI * 2,
        0,
        Math.PI / 2
      ),
      goldMaterial
    );

    spoonBowl.scale.set(1, 0.35, 1.35);
    spoonBowl.rotation.z = -Math.PI / 2;
    spoonBowl.position.x = 0.67;
    spoonGroup.add(spoonBowl);

    root.add(spoonGroup);

    // Vela: principios

    const candleGroup = new THREE.Group();
    candleGroup.position.set(1.55, 0.32, -0.72);

    const candle = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.18,
        0.21,
        0.86,
        30
      ),
      paperMaterial
    );

    candle.position.y = 0.43;
    candle.castShadow = true;
    candleGroup.add(candle);

    const wick = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.012,
        0.012,
        0.14,
        10
      ),
      blackMaterial
    );

    wick.position.y = 0.91;
    candleGroup.add(wick);

    const flameMaterial =
      new THREE.MeshStandardMaterial({
        color: 0xf4c875,
        emissive: 0xf0a847,
        emissiveIntensity: 2.4,
        roughness: 0.2,
      });

    const flame = new THREE.Mesh(
      new THREE.SphereGeometry(0.095, 20, 20),
      flameMaterial
    );

    flame.scale.set(0.7, 1.65, 0.7);
    flame.position.y = 1.08;
    candleGroup.add(flame);

    const flameLight = new THREE.PointLight(
      0xe7ad61,
      2.1,
      3.8
    );

    flameLight.position.set(0, 1.12, 0);
    candleGroup.add(flameLight);

    makeInteractive(
      candleGroup,
      "Principios de la Obra Común",
      "principios"
    );

    root.add(candleGroup);

    // Cuaderno: ramas

    const notebookGroup = new THREE.Group();
    notebookGroup.position.set(0.45, 0.31, 0.95);
    notebookGroup.rotation.y = -0.23;

    const notebook = new THREE.Mesh(
      new THREE.BoxGeometry(1.35, 0.09, 0.92),
      blackMaterial
    );

    notebook.castShadow = true;
    notebookGroup.add(notebook);

    const notebookPage = new THREE.Mesh(
      new THREE.BoxGeometry(1.26, 0.035, 0.83),
      paperMaterial
    );

    notebookPage.position.y = 0.065;
    notebookGroup.add(notebookPage);

    const notebookLine = new THREE.Mesh(
      new THREE.BoxGeometry(0.72, 0.012, 0.025),
      goldMaterial
    );

    notebookLine.position.set(-0.13, 0.092, 0.12);
    notebookGroup.add(notebookLine);

    makeInteractive(
      notebookGroup,
      "Ramas de acción",
      "ramas"
    );

    root.add(notebookGroup);

    // Carta: participación

    const letterGroup = new THREE.Group();
    letterGroup.position.set(2.1, 0.31, 0.85);
    letterGroup.rotation.y = 0.22;

    const letter = new THREE.Mesh(
      new THREE.BoxGeometry(1.16, 0.035, 0.76),
      paperMaterial
    );

    letter.castShadow = true;
    letterGroup.add(letter);

    const seal = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.12,
        0.12,
        0.035,
        32
      ),
      goldMaterial
    );

    seal.position.set(0.2, 0.045, 0.05);
    letterGroup.add(seal);

    makeInteractive(
      letterGroup,
      "Poner un lugar en la mesa",
      "participar"
    );

    root.add(letterGroup);

    // Vaso: transparencia

    const glassMaterial =
      new THREE.MeshPhysicalMaterial({
        color: 0xe8eef2,
        transparent: true,
        opacity: 0.34,
        roughness: 0.08,
        transmission: 0.62,
        thickness: 0.2,
      });

    const glassGroup = new THREE.Group();
    glassGroup.position.set(-0.45, 0.31, -0.9);

    const glass = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.25,
        0.2,
        0.72,
        40,
        1,
        true
      ),
      glassMaterial
    );

    glass.position.y = 0.36;
    glass.castShadow = true;
    glassGroup.add(glass);

    const water = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.205,
        0.175,
        0.38,
        40
      ),
      new THREE.MeshPhysicalMaterial({
        color: 0x9fb8c5,
        transparent: true,
        opacity: 0.34,
        roughness: 0.05,
        transmission: 0.52,
      })
    );

    water.position.y = 0.2;
    glassGroup.add(water);

    makeInteractive(
      glassGroup,
      "La Cámara Clara",
      "transparencia"
    );

    root.add(glassGroup);

    // Semilla

    const seedGroup = new THREE.Group();
    seedGroup.position.set(0.15, 0.29, -0.45);

    const seed = new THREE.Mesh(
      new THREE.SphereGeometry(0.115, 24, 20),
      new THREE.MeshStandardMaterial({
        color: 0x80633e,
        roughness: 0.9,
      })
    );

    seed.scale.set(1.45, 0.65, 0.85);
    seed.rotation.z = 0.42;
    seedGroup.add(seed);

    root.add(seedGroup);

    // Iluminación

    scene.add(
      new THREE.HemisphereLight(
        0xf2e7d5,
        0x10151a,
        1.45
      )
    );

    const keyLight = new THREE.DirectionalLight(
      0xf0dbc1,
      2.5
    );

    keyLight.position.set(-4, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(
      0x8b9ead,
      1.2
    );

    rimLight.position.set(5, 3, -4);
    scene.add(rimLight);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.ShadowMaterial({
        color: 0x000000,
        opacity: 0.32,
      })
    );

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.2;
    floor.receiveShadow = true;
    scene.add(floor);

    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    let hoveredTarget: string | null = null;
    let lastLabel = "";
    let pointerX = 0;
    let pointerY = 0;
    let animationFrame = 0;

    function getInteractiveParent(
      object: THREE.Object3D | null
    ) {
      let current = object;

      while (current) {
        if (current.userData.interactive) {
          return current;
        }

        current = current.parent;
      }

      return null;
    }

    function updatePointer(event: PointerEvent) {
      const rectangle =
        renderer.domElement.getBoundingClientRect();

      pointer.x =
        ((event.clientX - rectangle.left) /
          rectangle.width) *
          2 -
        1;

      pointer.y =
        -(
          (event.clientY - rectangle.top) /
          rectangle.height
        ) *
          2 +
        1;

      pointerX = pointer.x;
      pointerY = pointer.y;

      raycaster.setFromCamera(pointer, camera);

      const intersections =
        raycaster.intersectObjects(
          interactiveObjects,
          true
        );

      const interactive = getInteractiveParent(
        intersections[0]?.object || null
      );

      if (interactive) {
        hoveredTarget =
          interactive.userData.target || null;

        const label =
          interactive.userData.label ||
          "Acércate a la mesa";

        renderer.domElement.style.cursor = "pointer";

        if (label !== lastLabel) {
          lastLabel = label;
          setActiveLabel(label);
        }
      } else {
        hoveredTarget = null;
        renderer.domElement.style.cursor = "default";

        if (lastLabel !== "Acércate a la mesa") {
          lastLabel = "Acércate a la mesa";
          setActiveLabel(lastLabel);
        }
      }
    }

    function handleClick() {
      if (hoveredTarget) {
        scrollToTarget(hoveredTarget);
      }
    }

    function handleLeave() {
      hoveredTarget = null;
      lastLabel = "Acércate a la mesa";
      renderer.domElement.style.cursor = "default";
      setActiveLabel(lastLabel);
    }

    renderer.domElement.addEventListener(
      "pointermove",
      updatePointer
    );

    renderer.domElement.addEventListener(
      "click",
      handleClick
    );

    renderer.domElement.addEventListener(
      "pointerleave",
      handleLeave
    );

    function resize() {
      const width = container.clientWidth;
      const height = container.clientHeight;

      renderer.setSize(width, height, false);

      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const clock = new THREE.Clock();

    function animate() {
      const elapsed = clock.getElapsedTime();

      if (!reduceMotion) {
        root.rotation.y +=
          (pointerX * 0.075 - root.rotation.y) *
          0.035;

        root.rotation.x +=
          (-0.03 + pointerY * 0.025 - root.rotation.x) *
          0.035;

        root.position.y =
          Math.sin(elapsed * 0.45) * 0.035;

        flame.scale.x =
          0.68 + Math.sin(elapsed * 7.1) * 0.06;

        flame.scale.y =
          1.62 + Math.sin(elapsed * 5.7) * 0.1;

        flame.position.x =
          Math.sin(elapsed * 4.5) * 0.018;
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
        "pointermove",
        updatePointer
      );

      renderer.domElement.removeEventListener(
        "click",
        handleClick
      );

      renderer.domElement.removeEventListener(
        "pointerleave",
        handleLeave
      );

      root.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) {
          return;
        }

        object.geometry.dispose();

        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];

        materials.forEach((material) =>
          material.dispose()
        );
      });

      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <section
      id="mesa-del-mundo"
      className="relative overflow-hidden border-y border-white/10 bg-[#070a0d] text-[#f0e8dc]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 34%, rgba(199,164,103,0.12), transparent 35%), radial-gradient(circle at 18% 78%, rgba(70,93,110,0.16), transparent 30%)",
        }}
      />

      <div className="relative mx-auto max-w-[1500px] px-5 py-16 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[8px] uppercase tracking-[0.44em] text-[#c7a467]">
              El corazón de la página
            </p>

            <h2 className="mt-5 font-serif text-4xl tracking-[-0.04em] sm:text-6xl">
              La Mesa del Mundo
            </h2>
          </div>

          <p className="max-w-lg text-sm leading-7 text-white/45">
            Cada objeto representa una forma distinta de
            cuidar. Toca la mesa para recorrer la obra.
          </p>
        </div>

        <div
          ref={containerRef}
          className="relative h-[540px] w-full sm:h-[650px] lg:h-[760px]"
          aria-hidden="true"
        />

        <div className="pointer-events-none absolute inset-x-0 top-1/2 flex justify-center px-5">
          <p className="border border-white/10 bg-black/30 px-5 py-3 text-[8px] uppercase tracking-[0.32em] text-white/60 backdrop-blur-md">
            {activeLabel}
          </p>
        </div>

        <div className="grid border-l border-t border-white/10 sm:grid-cols-5">
          {tableObjects.map((object) => (
            <button
              key={object.target}
              type="button"
              onClick={() =>
                scrollToTarget(object.target)
              }
              className="border-b border-r border-white/10 px-5 py-5 text-left text-[7px] uppercase tracking-[0.24em] text-white/42 transition hover:bg-white/[0.04] hover:text-[#c7a467]"
            >
              {object.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
