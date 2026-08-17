"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Bounds,
  Center,
  ContactShadows,
  Environment,
  Float,
  OrbitControls,
  Sparkles,
  useGLTF
} from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import type { Guardian } from "@/lib/bestiario-poetico/guardians";

type RitualStage = "idle" | "writing" | "reading" | "revealed";

function GuardianModel({
  guardian,
  selected,
  stage
}: {
  guardian: Guardian;
  selected: boolean;
  stage: RitualStage;
}) {
  const { scene } = useGLTF(guardian.modelUrl);
  const group = useRef<THREE.Group>(null);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    clonedScene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      object.castShadow = true;
      object.receiveShadow = true;

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      materials.forEach((material) => {
        material.side = THREE.DoubleSide;
        material.needsUpdate = true;
      });
    });
  }, [clonedScene]);

  useFrame((state) => {
    if (!group.current) return;

    const target = selected && stage === "revealed" ? 1.12 : 1;
    group.current.scale.lerp(
      new THREE.Vector3(target, target, target),
      0.045
    );

    if (selected && stage === "revealed") {
      group.current.rotation.y =
        guardian.rotation[1] + Math.sin(state.clock.elapsedTime * 0.35) * 0.035;
    }
  });

  return (
    <group
      ref={group}
      position={guardian.position}
      rotation={guardian.rotation}
      scale={guardian.scale}
    >
      <Float
        speed={selected ? 0.8 : 0.25}
        rotationIntensity={0}
        floatIntensity={selected ? 0.16 : 0.04}
      >
        <Bounds fit clip margin={0.92}>
          <Center bottom>
            <primitive object={clonedScene} />
          </Center>
        </Bounds>
      </Float>

      <mesh position={[0, -0.12, 0]} receiveShadow>
        <cylinderGeometry args={[1.15, 1.28, 0.28, 48]} />
        <meshStandardMaterial
          color={selected ? "#3a2a17" : "#1a1510"}
          metalness={0.5}
          roughness={0.55}
          emissive={selected ? "#6e4f25" : "#000000"}
          emissiveIntensity={selected ? 0.35 : 0}
        />
      </mesh>

      <mesh position={[0, 1.75, -0.75]}>
        <torusGeometry args={[1.35, 0.025, 16, 96]} />
        <meshStandardMaterial
          color="#8e6f3e"
          emissive={selected ? "#8e6f3e" : "#2a2116"}
          emissiveIntensity={selected ? 1.1 : 0.18}
          metalness={0.8}
          roughness={0.35}
        />
      </mesh>
    </group>
  );
}

function Temple({
  guardians,
  selectedGuardian,
  stage
}: {
  guardians: Guardian[];
  selectedGuardian: Guardian;
  stage: RitualStage;
}) {
  return (
    <>
      <color attach="background" args={["#050403"]} />
      <fog attach="fog" args={["#050403", 10, 24]} />

      <ambientLight intensity={0.42} />

      <directionalLight
        position={[0, 8, 3]}
        intensity={2.5}
        color="#d5b178"
        castShadow
      />

      <spotLight
        position={[0, 8, 4]}
        angle={0.42}
        penumbra={0.92}
        intensity={stage === "reading" ? 7 : 4}
        color="#d7b072"
        castShadow
      />

      <directionalLight
        position={[-7, 4, 2]}
        intensity={1.15}
        color="#806845"
      />

      <directionalLight
        position={[7, 4, 2]}
        intensity={1.15}
        color="#806845"
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.18, 0]}>
        <circleGeometry args={[13, 128]} />
        <meshStandardMaterial
          color="#0b0907"
          roughness={0.8}
          metalness={0.15}
        />
      </mesh>

      {[2.5, 4.1, 5.8].map((radius) => (
        <mesh
          key={radius}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -2.155, 0]}
        >
          <torusGeometry args={[radius, 0.018, 12, 128]} />
          <meshStandardMaterial
            color="#72562f"
            emissive="#3d2a16"
            emissiveIntensity={0.45}
            metalness={0.72}
            roughness={0.42}
          />
        </mesh>
      ))}

      <group position={[0, -1.84, 1.25]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.4, 0.42, 1.8]} />
          <meshStandardMaterial
            color="#21170f"
            metalness={0.45}
            roughness={0.55}
          />
        </mesh>

        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[2.2, 0.08, 1.1]} />
          <meshStandardMaterial
            color="#d6c7a7"
            emissive={stage === "reading" ? "#d6b26a" : "#342b20"}
            emissiveIntensity={stage === "reading" ? 1.2 : 0.12}
            roughness={0.9}
          />
        </mesh>
      </group>

      {guardians.map((guardian) => (
        <GuardianModel
          key={guardian.slug}
          guardian={guardian}
          selected={selectedGuardian.slug === guardian.slug}
          stage={stage}
        />
      ))}

      {stage === "reading" && (
        <Sparkles
          count={130}
          scale={[12, 7, 7]}
          size={1.6}
          speed={0.35}
          opacity={0.5}
          color="#c89d5d"
        />
      )}

      <ContactShadows
        position={[0, -2.13, 0]}
        opacity={0.68}
        scale={18}
        blur={3}
        far={8}
      />

      <Environment preset="warehouse" />

      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={7}
        maxDistance={15}
        minPolarAngle={0.92}
        maxPolarAngle={1.52}
        target={[0, -0.5, 0]}
        autoRotate={false}
      />
    </>
  );
}

export function BestiaryScene({
  guardians,
  selectedGuardian,
  stage
}: {
  guardians: Guardian[];
  selectedGuardian: Guardian;
  stage: RitualStage;
}) {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Canvas
        shadows
        dpr={[1, 1.45]}
        camera={{
          position: [0, 1.1, 12.5],
          fov: 42,
          near: 0.01,
          far: 1000
        }}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.9
        }}
      >
        <Suspense fallback={null}>
          <Temple
            guardians={guardians}
            selectedGuardian={selectedGuardian}
            stage={stage}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
