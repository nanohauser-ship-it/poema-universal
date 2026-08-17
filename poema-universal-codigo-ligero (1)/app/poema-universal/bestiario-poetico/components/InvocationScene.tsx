"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  PresentationControls,
  Sparkles,
  useGLTF
} from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Guardian } from "@/lib/bestiario-poetico/guardians";

type Stage = "waiting" | "listening" | "revealed";

type PreparedModel = {
  object: THREE.Object3D;
  normalizationScale: number;
  offset: [number, number, number];
};

function prepareModel(scene: THREE.Group): PreparedModel {
  const object = scene.clone(true);

  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    child.castShadow = true;
    child.receiveShadow = true;
    child.frustumCulled = false;

    if (Array.isArray(child.material)) {
      child.material = child.material.map((material) =>
        material.clone()
      );
    } else if (child.material) {
      child.material = child.material.clone();
    }
  });

  object.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();

  box.getSize(size);
  box.getCenter(center);

  const largestDimension = Math.max(
    size.x,
    size.y,
    size.z,
    0.0001
  );

  /*
   * Normalizamos todos los GLB para que su dimensión principal
   * mida aproximadamente 3.4 unidades dentro de la cámara.
   */
  const normalizationScale = 3.4 / largestDimension;

  return {
    object,
    normalizationScale,
    offset: [
      -center.x,
      -box.min.y,
      -center.z
    ]
  };
}

function LoadingPresence() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!mesh.current) return;

    mesh.current.rotation.y += delta * 0.25;

    const pulse =
      1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.04;

    mesh.current.scale.setScalar(pulse);
  });

  return (
    <mesh ref={mesh} position={[0, -0.15, 0]}>
      <icosahedronGeometry args={[0.8, 2]} />
      <meshStandardMaterial
        color="#755b36"
        emissive="#3b2915"
        emissiveIntensity={0.55}
        wireframe
        transparent
        opacity={0.55}
      />
    </mesh>
  );
}

function GuardianModel({
  guardian,
  stage
}: {
  guardian: Guardian;
  stage: Stage;
}) {
  const root = useRef<THREE.Group>(null);
  const { scene } = useGLTF(guardian.modelUrl);

  const prepared = useMemo(
    () => prepareModel(scene),
    [scene]
  );

  const stageScale =
    stage === "revealed"
      ? 1
      : stage === "listening"
        ? 0.94
        : 0.88;

  const finalScale =
    prepared.normalizationScale *
    guardian.scale *
    stageScale;

  useFrame((state, delta) => {
    if (!root.current) return;

    const targetRotation =
      guardian.rotation[1] +
      Math.sin(state.clock.elapsedTime * 0.22) * 0.06;

    root.current.rotation.y = THREE.MathUtils.damp(
      root.current.rotation.y,
      targetRotation,
      3,
      delta
    );

    root.current.position.y =
      guardian.position[1] +
      Math.sin(state.clock.elapsedTime * 0.7) * 0.025;
  });

  return (
    <group
      ref={root}
      position={guardian.position}
      rotation={[
        guardian.rotation[0],
        guardian.rotation[1],
        guardian.rotation[2]
      ]}
    >
      <group scale={finalScale}>
        <primitive
          object={prepared.object}
          position={prepared.offset}
        />
      </group>
    </group>
  );
}

function RitualArchitecture({
  stage
}: {
  stage: Stage;
}) {
  return (
    <>
      <color attach="background" args={["#050403"]} />
      <fog attach="fog" args={["#050403", 9, 19]} />

      <ambientLight intensity={1.1} />

      <hemisphereLight
        intensity={1.25}
        color="#e8d3ae"
        groundColor="#20170e"
      />

      <directionalLight
        castShadow
        position={[4, 7, 5]}
        intensity={2.7}
        color="#f0d9ab"
      />

      <pointLight
        position={[-4, 1.5, 3]}
        intensity={1.8}
        color="#9c7444"
      />

      <pointLight
        position={[4, 1.5, 3]}
        intensity={1.8}
        color="#9c7444"
      />

      <spotLight
        position={[0, 7, 3]}
        angle={0.42}
        penumbra={0.85}
        intensity={stage === "revealed" ? 6 : 3.5}
        color="#f5ddb0"
        castShadow
      />

      <mesh position={[0, 1.25, -2.1]}>
        <torusGeometry args={[2.25, 0.035, 16, 128]} />
        <meshStandardMaterial
          color="#a7834c"
          emissive="#6d4d25"
          emissiveIntensity={
            stage === "revealed" ? 1.5 : 0.45
          }
          metalness={0.8}
          roughness={0.35}
        />
      </mesh>

      <mesh position={[0, -1.75, 0]} receiveShadow>
        <cylinderGeometry args={[2.35, 2.65, 0.36, 64]} />
        <meshStandardMaterial
          color="#17120d"
          roughness={0.72}
          metalness={0.18}
        />
      </mesh>

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.95, 0]}
        receiveShadow
      >
        <circleGeometry args={[8, 96]} />
        <meshStandardMaterial
          color="#0b0907"
          roughness={1}
        />
      </mesh>

      {stage === "listening" && (
        <Sparkles
          count={85}
          scale={[7, 5, 5]}
          size={1.7}
          speed={0.38}
          opacity={0.55}
          color="#d8b575"
        />
      )}

      <ContactShadows
        position={[0, -1.91, 0]}
        opacity={0.62}
        scale={7}
        blur={2.6}
        far={4}
      />

      <Environment preset="warehouse" />
    </>
  );
}

export function InvocationScene({
  guardian,
  stage
}: {
  guardian: Guardian;
  stage: Stage;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      camera={{
        position: [0, 0.25, 7.6],
        fov: 40,
        near: 0.1,
        far: 100
      }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance"
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.25;
      }}
    >
      <RitualArchitecture stage={stage} />

      <PresentationControls
        global
        cursor
        polar={[-0.1, 0.16]}
        azimuth={[-0.22, 0.22]}
        snap
      >
        <Suspense fallback={<LoadingPresence />}>
          <GuardianModel
            guardian={guardian}
            stage={stage}
          />
        </Suspense>
      </PresentationControls>
    </Canvas>
  );
}

useGLTF.preload("/models/bestiario/elegiamon.glb");
useGLTF.preload("/models/bestiario/cordero-llama-fria.glb");
useGLTF.preload("/models/bestiario/guardiana-alas-cuerda.glb");
useGLTF.preload("/models/bestiario/esfinge-del-umbral.glb");
