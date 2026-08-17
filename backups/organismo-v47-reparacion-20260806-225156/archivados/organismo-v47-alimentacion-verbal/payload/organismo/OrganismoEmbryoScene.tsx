"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { Habitat, Organismo } from "./motor";
import styles from "../verso-tecno.module.css";
import feedingStyles from "../organismo-v47.module.css";

type SceneResources = {
  renderer: THREE.WebGLRenderer;
  frame: number;
  resizeObserver: ResizeObserver;
  disposables: Array<THREE.BufferGeometry | THREE.Material | THREE.Texture>;
};
type FeedingInteraction = {
  progresoMusical: number;
  faseMusical: string;
  reproduciendo: boolean;
  feedPulse: number;
  erasePulse: number;
  sentencePulse: number;
  provisionalBiomass: number;
  activeHabitat: Habitat;
  incomingWord: string;
};

const HABITAT_COLORS: Record<Habitat, number> = {
  deriva: 0x8dc7b5,
  pulso: 0xe7a04b,
  fractura: 0xef7145,
  espectral: 0xc2b7ff,
  maquina: 0xd9ff59,
  memoria: 0xe7c478,
};


function disposeMaterial(
  material: THREE.Material,
  disposables: SceneResources["disposables"],
) {
  disposables.push(material);

  const possibleTextures = material as THREE.Material & {
    map?: THREE.Texture | null;
    normalMap?: THREE.Texture | null;
    roughnessMap?: THREE.Texture | null;
    metalnessMap?: THREE.Texture | null;
    emissiveMap?: THREE.Texture | null;
    alphaMap?: THREE.Texture | null;
  };

  [
    possibleTextures.map,
    possibleTextures.normalMap,
    possibleTextures.roughnessMap,
    possibleTextures.metalnessMap,
    possibleTextures.emissiveMap,
    possibleTextures.alphaMap,
  ].forEach((texture) => {
    if (texture) disposables.push(texture);
  });
}

export default function OrganismoEmbryoScene({
  organismo,
  progresoMusical = 0,
  faseMusical = "Incubación",
  reproduciendo = false,
  feedPulse = 0,
  erasePulse = 0,
  sentencePulse = 0,
  provisionalBiomass = 0,
  activeHabitat = "memoria",
  incomingWord = "",
}: {
  organismo: Organismo;
  progresoMusical?: number;
  faseMusical?: string;
  reproduciendo?: boolean;
  feedPulse?: number;
  erasePulse?: number;
  sentencePulse?: number;
  provisionalBiomass?: number;
  activeHabitat?: Habitat;
  incomingWord?: string;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const interactionRef = useRef<FeedingInteraction>({
    progresoMusical,
    faseMusical,
    reproduciendo,
    feedPulse,
    erasePulse,
    sentencePulse,
    provisionalBiomass,
    activeHabitat,
    incomingWord,
  });
  const [estado, setEstado] = useState<"cargando" | "activo" | "error">(
    "cargando",
  );

  useEffect(() => {
    interactionRef.current = {
      progresoMusical,
      faseMusical,
      reproduciendo,
      feedPulse,
      erasePulse,
      sentencePulse,
      provisionalBiomass,
      activeHabitat,
      incomingWord,
    };
  }, [
    progresoMusical,
    faseMusical,
    reproduciendo,
    feedPulse,
    erasePulse,
    sentencePulse,
    provisionalBiomass,
    activeHabitat,
    incomingWord,
  ]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    setEstado("cargando");

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050706, 0.13);

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.03, 4.65);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.82;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.className = styles.embryoCanvas;
    mount.appendChild(renderer.domElement);

    const resources: SceneResources = {
      renderer,
      frame: 0,
      resizeObserver: new ResizeObserver(() => undefined),
      disposables: [],
    };

    const root = new THREE.Group();
    root.rotation.x = -0.04;
    scene.add(root);

    const capsuleGroup = new THREE.Group();
    root.add(capsuleGroup);

    const liquidGeometry = new THREE.SphereGeometry(1.34, 64, 64);
    liquidGeometry.scale(0.82, 1.19, 0.78);
    resources.disposables.push(liquidGeometry);

    const liquidMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x7e8e18,
      transparent: true,
      opacity: 0.105,
      roughness: 0.08,
      metalness: 0,
      transmission: 0.62,
      thickness: 0.62,
      ior: 1.31,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    resources.disposables.push(liquidMaterial);

    const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
    liquid.renderOrder = 1;
    capsuleGroup.add(liquid);

    const shellGeometry = new THREE.SphereGeometry(1.42, 72, 72);
    shellGeometry.scale(0.84, 1.22, 0.8);
    resources.disposables.push(shellGeometry);

    const shellMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xb5c66d,
      transparent: true,
      opacity: 0.14,
      transmission: 0.92,
      roughness: 0.03,
      metalness: 0.02,
      thickness: 0.18,
      ior: 1.47,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    resources.disposables.push(shellMaterial);

    const shell = new THREE.Mesh(shellGeometry, shellMaterial);
    shell.renderOrder = 4;
    capsuleGroup.add(shell);

    const innerMembraneGeometry = new THREE.SphereGeometry(1.23, 48, 48);
    innerMembraneGeometry.scale(0.78, 1.12, 0.73);
    resources.disposables.push(innerMembraneGeometry);

    const innerMembraneMaterial = new THREE.MeshBasicMaterial({
      color: 0xd9ff59,
      transparent: true,
      opacity: 0.009,
      wireframe: true,
      depthWrite: false,
    });
    resources.disposables.push(innerMembraneMaterial);

    const innerMembrane = new THREE.Mesh(
      innerMembraneGeometry,
      innerMembraneMaterial,
    );
    capsuleGroup.add(innerMembrane);

    const ringGroup = new THREE.Group();
    root.add(ringGroup);

    [-1.46, -1.2, 1.2, 1.46].forEach((y, index) => {
      const radius = index === 0 || index === 3 ? 1.08 : 1.18;
      const ringGeometry = new THREE.TorusGeometry(
        radius,
        index === 0 || index === 3 ? 0.055 : 0.025,
        18,
        120,
      );
      resources.disposables.push(ringGeometry);

      const ringMaterial = new THREE.MeshStandardMaterial({
        color: index % 2 === 0 ? 0x1d211d : 0x313a20,
        metalness: 0.92,
        roughness: 0.24,
        emissive: new THREE.Color(index % 2 === 0 ? 0x302400 : 0x172400),
        emissiveIntensity: 0.35,
      });
      resources.disposables.push(ringMaterial);

      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = y;
      ring.scale.x = 0.84;
      ring.scale.z = 0.8;
      ring.castShadow = true;
      ringGroup.add(ring);
    });

    const haloGroup = new THREE.Group();
    root.add(haloGroup);

    [1.68, 1.92, 2.2].forEach((radius, index) => {
      const haloGeometry = new THREE.TorusGeometry(
        radius,
        index === 1 ? 0.012 : 0.007,
        10,
        160,
      );
      resources.disposables.push(haloGeometry);

      const haloMaterial = new THREE.MeshBasicMaterial({
        color: index === 1 ? 0xef7145 : 0xd9ff59,
        transparent: true,
        opacity: 0.16 - index * 0.025,
        depthWrite: false,
      });
      resources.disposables.push(haloMaterial);

      const halo = new THREE.Mesh(haloGeometry, haloMaterial);
      halo.rotation.x = Math.PI / 2 + (index - 1) * 0.16;
      halo.rotation.y = (index - 1) * 0.2;
      haloGroup.add(halo);
    });

    const particleCount = Math.min(
      950,
      340 + organismo.complejidad * 7 + organismo.memoriaVital * 2,
    );
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let index = 0; index < particleCount; index += 1) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 0.32 + Math.pow(Math.random(), 0.72) * 1.5;

      positions[index * 3] =
        Math.sin(phi) * Math.cos(theta) * radius * 0.78;
      positions[index * 3 + 1] =
        Math.cos(phi) * radius * 1.12;
      positions[index * 3 + 2] =
        Math.sin(phi) * Math.sin(theta) * radius * 0.74;
      sizes[index] = 0.5 + Math.random();
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    particleGeometry.setAttribute(
      "size",
      new THREE.BufferAttribute(sizes, 1),
    );
    resources.disposables.push(particleGeometry);

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xd9ff59,
      size: 0.012,
      transparent: true,
      opacity: 0.53,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    resources.disposables.push(particleMaterial);

    const particles = new THREE.Points(
      particleGeometry,
      particleMaterial,
    );
    root.add(particles);

    const filamentGroup = new THREE.Group();
    root.add(filamentGroup);

    const filamentCount = Math.min(
      24,
      8 + Math.round(organismo.complejidad / 7),
    );

    for (let index = 0; index < filamentCount; index += 1) {
      const angle = (Math.PI * 2 * index) / filamentCount;
      const reach = 1.34 + Math.random() * 0.48;

      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(
          Math.cos(angle) * 0.34,
          Math.sin(angle * 1.8) * 0.26,
          Math.sin(angle) * 0.23,
        ),
        new THREE.Vector3(
          Math.cos(angle + 0.32) * 0.73,
          Math.sin(angle * 1.3) * 0.72,
          Math.sin(angle + 0.32) * 0.49,
        ),
        new THREE.Vector3(
          Math.cos(angle) * reach * 0.78,
          Math.sin(angle * 0.8) * reach,
          Math.sin(angle) * reach * 0.65,
        ),
      ]);

      const filamentGeometry = new THREE.TubeGeometry(
        curve,
        36,
        0.004 + (index % 4) * 0.0013,
        6,
        false,
      );
      resources.disposables.push(filamentGeometry);

      const filamentMaterial = new THREE.MeshBasicMaterial({
        color: index % 5 === 0 ? 0xef7145 : 0xd9ff59,
        transparent: true,
        opacity: 0.12 + (index % 3) * 0.04,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      resources.disposables.push(filamentMaterial);

      filamentGroup.add(
        new THREE.Mesh(filamentGeometry, filamentMaterial),
      );
    }

    const ambient = new THREE.AmbientLight(0x313520, 0.34);
    scene.add(ambient);

    const hemisphere = new THREE.HemisphereLight(
      0xffddb8,
      0x10200d,
      0.82,
    );
    scene.add(hemisphere);

    const keyLight = new THREE.PointLight(
      0xffc884,
      2.55 + organismo.energia * 0.011,
      9,
      1.7,
    );
    keyLight.position.set(1.2, 0.75, 2.7);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const sacredLight = new THREE.PointLight(
      0xd9ff59,
      1.35 + organismo.memoriaVital * 0.009,
      8,
      1.8,
    );
    sacredLight.position.set(-1.15, -0.18, 1.4);
    scene.add(sacredLight);

    const fillLight = new THREE.PointLight(
      0xffe2bd,
      1.45 + organismo.energia * 0.006,
      8,
      1.55,
    );
    fillLight.position.set(0, 0.15, 2.6);
    scene.add(fillLight);

    const wombLight = new THREE.PointLight(
      0xe77932,
      0.78 + organismo.estabilidad * 0.006,
      5.5,
      1.9,
    );
    wombLight.position.set(0.0, -0.15, 0.65);
    scene.add(wombLight);

    const rimLight = new THREE.DirectionalLight(0x8ca4b8, 0.72);
    rimLight.position.set(-3.2, 2.2, -2.8);
    scene.add(rimLight);

    const lowerLight = new THREE.PointLight(0xef7145, 0.62, 5.5);
    lowerLight.position.set(0.2, -2.1, 0.8);
    scene.add(lowerLight);

    let embryo: THREE.Group | null = null;
    let embryoBaseScale = 1;
    const embryoMaterials: THREE.MeshStandardMaterial[] = [];
    const loader = new GLTFLoader();

    loader.load(
      "/models/organismo/embrion-organismo.glb",
      (gltf) => {
        embryo = gltf.scene;

        const box = new THREE.Box3().setFromObject(embryo);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const largest = Math.max(size.x, size.y, size.z);
        const scale = 1.86 / Math.max(0.001, largest);
        embryoBaseScale = scale;

        embryo.position.sub(center);
        embryo.scale.setScalar(scale);
        embryo.rotation.set(0.12, -0.56, -0.06);
        embryo.position.y = -0.08;
        embryo.renderOrder = 2;

        embryo.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) return;

          object.castShadow = true;
          object.receiveShadow = true;

          const originals = Array.isArray(object.material)
            ? object.material
            : [object.material];

          const materials = originals.map((original) => {
            const cloned = original.clone();

            if (cloned instanceof THREE.MeshStandardMaterial) {
              cloned.color = new THREE.Color(0xc7ab86);
              cloned.roughness = 0.74;
              cloned.metalness = 0.0;
              cloned.emissive = new THREE.Color(0x160904);
              cloned.emissiveIntensity =
                0.055 + organismo.energia * 0.0007;
              cloned.envMapIntensity = 0.58;
              cloned.side = THREE.DoubleSide;
              cloned.transparent = false;
              cloned.opacity = 1;
              if (cloned.map) {
                cloned.map.colorSpace = THREE.SRGBColorSpace;
              }
              cloned.needsUpdate = true;
            }

            if (cloned instanceof THREE.MeshPhysicalMaterial) {
              cloned.color = new THREE.Color(0xc7ab86);
              cloned.roughness = 0.7;
              cloned.metalness = 0.0;
              cloned.emissive = new THREE.Color(0x160904);
              cloned.emissiveIntensity =
                0.06 + organismo.energia * 0.00075;
              cloned.transmission = 0.0;
              cloned.thickness = 0.08;
              cloned.clearcoat = 0.12;
              cloned.clearcoatRoughness = 0.34;
              cloned.envMapIntensity = 0.58;
              cloned.side = THREE.DoubleSide;
              cloned.transparent = false;
              cloned.opacity = 1;
              if (cloned.map) {
                cloned.map.colorSpace = THREE.SRGBColorSpace;
              }
              cloned.needsUpdate = true;
            }

            if (cloned instanceof THREE.MeshStandardMaterial) {
              embryoMaterials.push(cloned);
            }

            disposeMaterial(cloned, resources.disposables);
            return cloned;
          });

          object.material = Array.isArray(object.material)
            ? materials
            : materials[0];
        });

        root.add(embryo);
        setEstado("activo");
      },
      undefined,
      (error) => {
        console.error("No se pudo cargar el embrión 3D:", error);
        setEstado("error");
      },
    );

    const pointer = new THREE.Vector2();
    const targetRotation = new THREE.Vector2();

    function handlePointerMove(event: PointerEvent) {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      targetRotation.x = pointer.y * 0.055;
      targetRotation.y = pointer.x * 0.12;
    }

    mount.addEventListener("pointermove", handlePointerMove);

    resources.resizeObserver = new ResizeObserver(() => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resources.resizeObserver.observe(mount);

    const timer = new THREE.Timer();
    timer.connect(document);
    const bpm = Math.max(42, organismo.bpmBase);
    const beatFrequency = bpm / 60;
    const stageFactor =
      organismo.etapa === "embrion"
        ? 0.55
        : organismo.etapa === "germinacion"
          ? 0.7
          : organismo.etapa === "latencia"
            ? 0.35
            : 1;

    let lastFeedPulse = interactionRef.current.feedPulse;
    let lastErasePulse = interactionRef.current.erasePulse;
    let lastSentencePulse = interactionRef.current.sentencePulse;
    let feedingImpact = 0;
    let erasingImpact = 0;
    let sentenceImpact = 0;
    let currentGrowth = 1;
    const targetHabitatColor = new THREE.Color(
      HABITAT_COLORS[interactionRef.current.activeHabitat],
    );

    function animate(timestamp?: number) {
      timer.update(timestamp);
      const elapsed = timer.getElapsed();
      const interaction = interactionRef.current;

      if (interaction.feedPulse !== lastFeedPulse) {
        feedingImpact = Math.min(
          1.5,
          feedingImpact + 0.48 + Math.min(0.42, interaction.feedPulse * 0.002),
        );
        lastFeedPulse = interaction.feedPulse;
      }

      if (interaction.erasePulse !== lastErasePulse) {
        erasingImpact = Math.min(1.3, erasingImpact + 0.78);
        lastErasePulse = interaction.erasePulse;
      }

      if (interaction.sentencePulse !== lastSentencePulse) {
        sentenceImpact = Math.min(1.5, sentenceImpact + 1.15);
        lastSentencePulse = interaction.sentencePulse;
      }

      feedingImpact *= 0.915;
      erasingImpact *= 0.9;
      sentenceImpact *= 0.94;

      const pulse =
        Math.sin(elapsed * Math.PI * 2 * beatFrequency) * 0.5 + 0.5;
      const breath = Math.sin(elapsed * 1.12) * 0.5 + 0.5;
      const musicDrive = interaction.reproduciendo
        ? 0.22 + interaction.progresoMusical * 0.34
        : 0;
      const permanentWords = Math.max(
        0,
        organismo.biomasaVerbal ?? organismo.palabrasIntegradas ?? 0,
      );
      const totalWords = permanentWords + interaction.provisionalBiomass;
      const biomassGrowth =
        0.88 + 0.26 * (1 - Math.exp(-Math.max(0, totalWords) / 54));
      const provisionalLift = Math.min(
        0.075,
        interaction.provisionalBiomass * 0.0016,
      );
      const targetGrowth =
        biomassGrowth +
        provisionalLift +
        feedingImpact * 0.018 +
        sentenceImpact * 0.026 -
        erasingImpact * 0.018;

      currentGrowth = THREE.MathUtils.lerp(
        currentGrowth,
        targetGrowth,
        0.032,
      );

      root.rotation.x +=
        (targetRotation.x - root.rotation.x) * 0.025;
      root.rotation.y +=
        (targetRotation.y +
          Math.sin(elapsed * 0.09) * 0.055 +
          feedingImpact * 0.015 -
          erasingImpact * 0.02 -
          root.rotation.y) *
        0.022;

      root.position.y =
        Math.sin(elapsed * 0.48) * 0.012 + sentenceImpact * 0.025;
      capsuleGroup.position.y =
        Math.sin(elapsed * 0.52) * 0.026 + feedingImpact * 0.026;
      capsuleGroup.rotation.y =
        Math.sin(elapsed * 0.16) * 0.025 + erasingImpact * 0.035;

      liquidMaterial.opacity =
        0.075 +
        organismo.memoriaVital * 0.0004 +
        breath * 0.026 +
        feedingImpact * 0.04 +
        interaction.provisionalBiomass * 0.00034;

      shellMaterial.opacity =
        0.1 +
        organismo.estabilidad * 0.00045 +
        pulse * 0.025 * stageFactor +
        feedingImpact * 0.045 +
        sentenceImpact * 0.035;

      innerMembraneMaterial.opacity =
        0.018 +
        organismo.complejidad * 0.00025 +
        pulse * 0.018 +
        feedingImpact * 0.055;

      shell.scale.setScalar(
        1 +
          (currentGrowth - 1) * 0.32 +
          pulse * 0.006 * stageFactor +
          feedingImpact * 0.018 +
          sentenceImpact * 0.026,
      );
      liquid.scale.setScalar(
        1 + (currentGrowth - 1) * 0.26 + feedingImpact * 0.012,
      );
      innerMembrane.scale.setScalar(
        1 +
          (currentGrowth - 1) * 0.44 +
          feedingImpact * 0.045 -
          erasingImpact * 0.025,
      );
      innerMembrane.rotation.y =
        elapsed * (0.055 + musicDrive * 0.08) + feedingImpact * 0.06;
      innerMembrane.rotation.x =
        elapsed * -0.032 - erasingImpact * 0.04;

      haloGroup.rotation.y =
        elapsed * (0.052 + musicDrive * 0.1) + feedingImpact * 0.09;
      haloGroup.rotation.z =
        Math.sin(elapsed * 0.14) * 0.09 + sentenceImpact * 0.05;
      haloGroup.scale.setScalar(
        1 + (currentGrowth - 1) * 0.52 + sentenceImpact * 0.08,
      );
      ringGroup.rotation.y =
        Math.sin(elapsed * 0.13) * 0.025 - erasingImpact * 0.06;
      ringGroup.scale.setScalar(
        1 + (currentGrowth - 1) * 0.18 + feedingImpact * 0.015,
      );

      particles.rotation.y = elapsed * (0.025 + musicDrive * 0.08);
      particles.rotation.z = elapsed * -0.012 + erasingImpact * 0.03;
      particles.scale.setScalar(
        1 + (currentGrowth - 1) * 0.7 + feedingImpact * 0.065,
      );
      particleMaterial.opacity = Math.min(
        0.96,
        0.22 +
          organismo.complejidad * 0.0015 +
          pulse * 0.09 +
          feedingImpact * 0.3 +
          sentenceImpact * 0.15,
      );
      particleMaterial.size =
        0.0115 + feedingImpact * 0.013 + sentenceImpact * 0.006;

      filamentGroup.rotation.y =
        elapsed * -0.018 - erasingImpact * 0.05;
      filamentGroup.scale.setScalar(
        0.99 +
          breath * 0.018 * stageFactor +
          (currentGrowth - 1) * 0.72 +
          feedingImpact * 0.05,
      );

      targetHabitatColor.setHex(HABITAT_COLORS[interaction.activeHabitat]);
      particleMaterial.color.lerp(targetHabitatColor, 0.045);
      innerMembraneMaterial.color.lerp(targetHabitatColor, 0.036);
      sacredLight.color.lerp(targetHabitatColor, 0.04);
      wombLight.color.lerp(targetHabitatColor, 0.026);

      keyLight.intensity =
        1.95 +
        organismo.energia * 0.01 +
        pulse * 0.48 * stageFactor +
        feedingImpact * 1.65 +
        sentenceImpact * 0.9;
      sacredLight.intensity =
        0.95 +
        organismo.memoriaVital * 0.008 +
        breath * 0.34 +
        feedingImpact * 1.2;
      wombLight.intensity =
        0.78 +
        organismo.estabilidad * 0.006 +
        feedingImpact * 1.5 +
        erasingImpact * 0.35;

      embryoMaterials.forEach((material) => {
        material.emissive.lerp(targetHabitatColor, 0.012 + feedingImpact * 0.02);
        material.emissiveIntensity =
          0.055 +
          organismo.energia * 0.0007 +
          feedingImpact * 0.16 +
          sentenceImpact * 0.1;
      });

      if (embryo) {
        const embryoBreath =
          1 +
          Math.sin(elapsed * (1.2 + musicDrive * 0.7)) *
            (0.006 + organismo.energia * 0.00003) *
            stageFactor;
        const desiredScale =
          embryoBaseScale *
          currentGrowth *
          embryoBreath *
          (1 + feedingImpact * 0.035 + sentenceImpact * 0.045);
        const nextScale = THREE.MathUtils.lerp(
          embryo.scale.x,
          desiredScale,
          0.09,
        );

        embryo.scale.setScalar(nextScale);
        embryo.position.y =
          -0.08 +
          Math.sin(elapsed * 0.62) * 0.025 * stageFactor +
          feedingImpact * 0.045 -
          erasingImpact * 0.025;
        embryo.position.x =
          Math.sin(elapsed * 0.31) * feedingImpact * 0.018;
        embryo.rotation.y =
          -0.56 +
          Math.sin(elapsed * 0.21) * 0.028 +
          feedingImpact * 0.035 -
          erasingImpact * 0.03;
        embryo.rotation.z =
          -0.06 + sentenceImpact * 0.025 - erasingImpact * 0.02;
      }

      renderer.render(scene, camera);
      resources.frame = window.requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.cancelAnimationFrame(resources.frame);
      resources.resizeObserver.disconnect();
      mount.removeEventListener("pointermove", handlePointerMove);

      resources.disposables.forEach((resource) => {
        resource.dispose();
      });

      timer.dispose();
      renderer.dispose();
      renderer.forceContextLoss();

      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [
    organismo.codigo,
    organismo.edad,
    organismo.etapa,
    organismo.energia,
    organismo.estabilidad,
    organismo.memoriaVital,
    organismo.complejidad,
    organismo.bpmBase,
    organismo.biomasaVerbal,
    organismo.palabrasIntegradas,
  ]);

  return (
    <div className={styles.embryoScene} ref={mountRef}>
      <div className={styles.embryoVignette} aria-hidden="true" />
      <div className={styles.embryoScan} aria-hidden="true" />

      <div className={styles.embryoTelemetry}>
        <span>{organismo.codigo}</span>
        <span>{organismo.etapa.toUpperCase()}</span>
      </div>

      <div className={styles.embryoStatus}>
        {estado === "cargando" ? "FORMANDO CUERPO 3D…" : null}
        {estado === "error" ? "EL MODELO NO PUDO MANIFESTARSE" : null}
      </div>

      <div
        className={feedingStyles.embryoFeedingStatus}
        data-active={incomingWord ? "true" : "false"}
        data-habitat={activeHabitat}
      >
        <small>{incomingWord ? "RECIBIENDO" : "ESCUCHANDO EL TECLADO"}</small>
        <strong>{incomingWord ? `«${incomingWord}»` : "materia verbal"}</strong>
        <span>
          +{provisionalBiomass} PALABRAS EN PREPARACIÓN · {activeHabitat.toUpperCase()}
        </span>
      </div>

      <div className={styles.embryoWord}>
        <small>NÚCLEO</small>
        <strong>{organismo.reliquia}</strong>
        <span>DÍA {String(organismo.edad).padStart(2, "0")}</span>
      </div>
    </div>
  );
}
