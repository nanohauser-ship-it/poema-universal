"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { Habitat, Organismo } from "./motor";
import styles from "../verso-tecno.module.css";

type SceneResources = {
  renderer: THREE.WebGLRenderer;
  frame: number;
  resizeObserver: ResizeObserver;
  disposables: Array<THREE.BufferGeometry | THREE.Material | THREE.Texture>;
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
  biomasaVerbal = 0,
  pulsoTecla = 0,
  pulsoAbsorcion = 0,
  pulsoBorrado = 0,
  habitatEntrante = "memoria",
  palabraEntrante = "",
}: {
  organismo: Organismo;
  biomasaVerbal?: number;
  pulsoTecla?: number;
  pulsoAbsorcion?: number;
  pulsoBorrado?: number;
  habitatEntrante?: Habitat;
  palabraEntrante?: string;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const feedingRef = useRef({
    biomasaVerbal,
    pulsoTecla,
    pulsoAbsorcion,
    pulsoBorrado,
    habitatEntrante,
    palabraEntrante,
  });

  feedingRef.current = {
    biomasaVerbal,
    pulsoTecla,
    pulsoAbsorcion,
    pulsoBorrado,
    habitatEntrante,
    palabraEntrante,
  };
  const [estado, setEstado] = useState<"cargando" | "activo" | "error">(
    "cargando",
  );

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;
    const mountElement: HTMLDivElement = currentMount;

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
    renderer.setSize(mountElement.clientWidth, mountElement.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.82;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.className = styles.embryoCanvas;
    mountElement.appendChild(renderer.domElement);

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
      const rect = mountElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      targetRotation.x = pointer.y * 0.055;
      targetRotation.y = pointer.x * 0.12;
    }

    mountElement.addEventListener("pointermove", handlePointerMove);

    resources.resizeObserver = new ResizeObserver(() => {
      const width = Math.max(1, mountElement.clientWidth);
      const height = Math.max(1, mountElement.clientHeight);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resources.resizeObserver.observe(mountElement);

    const timer = new THREE.Timer();
    timer.connect(document);
    const bpm = Math.max(42, organismo.bpmBase);
    const beatFrequency = bpm / 60;

    const habitatColors: Record<Habitat, THREE.Color> = {
      deriva: new THREE.Color(0x83d8c4),
      pulso: new THREE.Color(0xe0b34e),
      fractura: new THREE.Color(0xe06035),
      espectral: new THREE.Color(0x9fcf70),
      maquina: new THREE.Color(0xa7bd43),
      memoria: new THREE.Color(0xe59b55),
    };
    const neutralKeyColor = new THREE.Color(0xffc884);
    const neutralSacredColor = new THREE.Color(0xd9ff59);
    let lastKeyPulse = feedingRef.current.pulsoTecla;
    let lastAbsorptionPulse = feedingRef.current.pulsoAbsorcion;
    let lastDeletionPulse = feedingRef.current.pulsoBorrado;
    let keyShock = 0;
    let absorptionShock = 0;
    let deletionShock = 0;
    const stageFactor =
      organismo.etapa === "embrion"
        ? 0.55
        : organismo.etapa === "germinacion"
          ? 0.7
          : organismo.etapa === "latencia"
            ? 0.35
            : 1;

    function animate(timestamp?: number) {
      timer.update(timestamp);
      const elapsed = timer.getElapsed();
      const pulse =
        Math.sin(elapsed * Math.PI * 2 * beatFrequency) * 0.5 + 0.5;
      const breath = Math.sin(elapsed * 1.12) * 0.5 + 0.5;
      const feeding = feedingRef.current;

      if (feeding.pulsoTecla !== lastKeyPulse) {
        keyShock = 1;
        lastKeyPulse = feeding.pulsoTecla;
      }
      if (feeding.pulsoAbsorcion !== lastAbsorptionPulse) {
        absorptionShock = 1;
        lastAbsorptionPulse = feeding.pulsoAbsorcion;
      }
      if (feeding.pulsoBorrado !== lastDeletionPulse) {
        deletionShock = 1;
        lastDeletionPulse = feeding.pulsoBorrado;
      }

      keyShock *= 0.82;
      absorptionShock *= 0.91;
      deletionShock *= 0.84;

      const targetBodyScale =
        1 +
        feeding.biomasaVerbal * 0.2 +
        keyShock * 0.012 +
        absorptionShock * 0.052 -
        deletionShock * 0.022;
      const smoothBodyScale =
        root.scale.x + (targetBodyScale - root.scale.x) * 0.052;
      root.scale.setScalar(smoothBodyScale);

      const activeColor = habitatColors[feeding.habitatEntrante];
      keyLight.color.lerp(
        feeding.palabraEntrante ? activeColor : neutralKeyColor,
        0.035,
      );
      sacredLight.color.lerp(
        feeding.palabraEntrante ? activeColor : neutralSacredColor,
        0.028,
      );

      root.rotation.x +=
        (targetRotation.x - root.rotation.x) * 0.025;
      root.rotation.y +=
        (targetRotation.y + Math.sin(elapsed * 0.09) * 0.055 -
          root.rotation.y) *
        0.022;

      capsuleGroup.position.y = Math.sin(elapsed * 0.52) * 0.026;
      capsuleGroup.rotation.y = Math.sin(elapsed * 0.16) * 0.025;

      liquidMaterial.opacity =
        0.075 +
        organismo.memoriaVital * 0.0004 +
        breath * 0.026;

      shellMaterial.opacity =
        0.1 +
        organismo.estabilidad * 0.00045 +
        pulse * 0.025 * stageFactor;

      innerMembraneMaterial.opacity =
        0.018 +
        organismo.complejidad * 0.00025 +
        pulse * 0.018;

      shell.scale.setScalar(
        1 +
          pulse * 0.006 * stageFactor +
          keyShock * 0.008 +
          absorptionShock * 0.038 -
          deletionShock * 0.012,
      );
      innerMembrane.rotation.y = elapsed * 0.055;
      innerMembrane.rotation.x = elapsed * -0.032;

      haloGroup.rotation.y = elapsed * 0.052;
      haloGroup.rotation.z = Math.sin(elapsed * 0.14) * 0.09;
      ringGroup.rotation.y = Math.sin(elapsed * 0.13) * 0.025;

      particles.rotation.y = elapsed * 0.025;
      particles.rotation.z = elapsed * -0.012;
      particleMaterial.opacity = Math.min(
        0.94,
        0.22 +
          organismo.complejidad * 0.0015 +
          pulse * 0.09 +
          keyShock * 0.08 +
          absorptionShock * 0.3,
      );

      filamentGroup.rotation.y = elapsed * -0.018;
      filamentGroup.scale.setScalar(
        0.99 +
          breath * 0.018 * stageFactor +
          feeding.biomasaVerbal * 0.075 +
          absorptionShock * 0.05,
      );

      keyLight.intensity =
        1.95 +
        organismo.energia * 0.01 +
        pulse * 0.48 * stageFactor +
        keyShock * 0.7 +
        absorptionShock * 1.65;
      sacredLight.intensity =
        0.95 +
        organismo.memoriaVital * 0.008 +
        breath * 0.34 +
        absorptionShock * 1.1;
      wombLight.intensity =
        0.78 +
        organismo.estabilidad * 0.006 +
        keyShock * 0.45 +
        absorptionShock * 1.25;

      if (embryo) {
        const embryoBreath =
          1 +
          Math.sin(elapsed * 1.2) *
            (0.006 + organismo.energia * 0.00003) *
            stageFactor +
          keyShock * 0.007 +
          absorptionShock * 0.032 -
          deletionShock * 0.012;

        embryo.scale.multiplyScalar(
          embryoBreath /
            (embryo.userData.lastBreathScale ?? 1),
        );
        embryo.userData.lastBreathScale = embryoBreath;
        embryo.position.y =
          -0.08 +
          Math.sin(elapsed * 0.62) * 0.025 * stageFactor +
          absorptionShock * 0.035 -
          deletionShock * 0.018;
        embryo.rotation.y =
          -0.56 + Math.sin(elapsed * 0.21) * 0.028;
      }

      renderer.render(scene, camera);
      resources.frame = window.requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.cancelAnimationFrame(resources.frame);
      resources.resizeObserver.disconnect();
      mountElement.removeEventListener("pointermove", handlePointerMove);

      resources.disposables.forEach((resource) => {
        resource.dispose();
      });

      timer.dispose();
      renderer.dispose();
      renderer.forceContextLoss();

      if (renderer.domElement.parentElement === mountElement) {
        mountElement.removeChild(renderer.domElement);
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

      <div className={styles.embryoWord}>
        <small>NÚCLEO</small>
        <strong>{organismo.reliquia}</strong>
        <span>DÍA {String(organismo.edad).padStart(2, "0")}</span>
      </div>
    </div>
  );
}
