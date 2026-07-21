"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  OrbitControls,
  Sparkles,
  useGLTF,
} from "@react-three/drei";

import type {
  Group,
  Mesh,
  Object3D,
} from "three";

type TutelaryScene3DProps = {
  presenceId: string;
};

type PresenceWorld = {
  light: string;
  secondary: string;
  fog: string;
};

const WORLDS: Record<string, PresenceWorld> = {
  borges: {
    light: "#d6b96d",
    secondary: "#53698f",
    fog: "#080b12",
  },

  pizarnik: {
    light: "#b59acb",
    secondary: "#655078",
    fog: "#0d0912",
  },

  camus: {
    light: "#efc66f",
    secondary: "#af8250",
    fog: "#151007",
  },
};

function BorgesModel() {
  const group = useRef<Group>(null);

  const { scene } = useGLTF(
    "/poema-universal/presencias/borges/borges-tutelar.glb"
  );

  const clonedScene = useMemo<Object3D>(
    () => scene.clone(true),
    [scene]
  );

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (!group.current) {
      return;
    }

    group.current.rotation.y =
      -0.12 + Math.sin(time * 0.2) * 0.085;

    group.current.position.y =
      -1.48 + Math.sin(time * 0.42) * 0.026;

    group.current.rotation.z =
      Math.sin(time * 0.22) * 0.006;

    group.current.rotation.x =
      Math.sin(time * 0.16) * 0.004;
  });

  return (
    <group
      ref={group}
      position={[0, -1.48, 0]}
      rotation={[0, -0.12, 0]}
      scale={2.35}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

function CamusModel() {
  const group = useRef<Group>(null);

  const { scene } = useGLTF(
    "/poema-universal/presencias/camus/camus-tutelar.glb?v=2"
  );

  const clonedScene = useMemo<Object3D>(
    () => scene.clone(true),
    [scene]
  );

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (!group.current) {
      return;
    }

    group.current.rotation.y =
      0.08 + Math.sin(time * 0.16) * 0.065;

    group.current.rotation.x =
      -0.035 + Math.sin(time * 0.13) * 0.008;

    group.current.rotation.z =
      Math.sin(time * 0.2) * 0.005;

    group.current.position.y =
      -1.17 + Math.sin(time * 0.38) * 0.022;
  });

  return (
    <group
      ref={group}
      position={[0, -1.17, 0]}
      rotation={[-0.035, 0.08, 0]}
      scale={6.05}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

function PizarnikModel() {
  const group = useRef<Group>(null);

  const { scene } = useGLTF(
    "/poema-universal/presencias/pizarnik/pizarnik-tutelar.glb"
  );

  const clonedScene = useMemo<Object3D>(
    () => scene.clone(true),
    [scene]
  );

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (!group.current) {
      return;
    }

    group.current.rotation.y =
      1.48 + Math.sin(time * 0.14) * 0.035;

    group.current.rotation.x =
      -0.01 + Math.sin(time * 0.12) * 0.006;

    group.current.rotation.z =
      Math.sin(time * 0.18) * 0.004;

    group.current.position.y =
      -0.12 + Math.sin(time * 0.34) * 0.018;
  });

  return (
    <group
      ref={group}
      position={[-0.02, -0.12, 0]}
      rotation={[-0.01, 1.48, 0]}
      scale={7.2}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

function SymbolicGuardian({
  world,
}: {
  world: PresenceWorld;
}) {
  const group = useRef<Group>(null);
  const core = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (group.current) {
      group.current.rotation.y =
        Math.sin(time * 0.25) * 0.16;

      group.current.position.y =
        Math.sin(time * 0.55) * 0.06;
    }

    if (core.current) {
      const pulse =
        1 + Math.sin(time * 0.8) * 0.035;

      core.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={group}>
      <mesh
        ref={core}
        position={[0, 0.15, 0]}
      >
        <icosahedronGeometry args={[1, 4]} />

        <meshStandardMaterial
          color={world.light}
          emissive={world.secondary}
          emissiveIntensity={0.28}
          roughness={0.48}
          metalness={0.15}
        />
      </mesh>

      <mesh
        position={[0, -1.1, 0]}
        scale={[1.2, 0.16, 1.2]}
      >
        <cylinderGeometry
          args={[0.9, 1.08, 0.28, 64]}
        />

        <meshStandardMaterial
          color="#11131a"
          roughness={0.94}
        />
      </mesh>
    </group>
  );
}

function TutelaryWorld({
  presenceId,
}: {
  presenceId: string;
}) {
  const world =
    WORLDS[presenceId] ?? WORLDS.borges;

  return (
    <>
      <color
        attach="background"
        args={[world.fog]}
      />

      <fog
        attach="fog"
        args={[world.fog, 4.5, 10]}
      />

      <ambientLight intensity={1.35} />

      <hemisphereLight
        intensity={1.65}
        color="#f2dfb0"
        groundColor="#171b2a"
      />

      <directionalLight
        position={[2.4, 4.6, 5.8]}
        intensity={4.8}
        color="#f6dfaa"
      />

      <directionalLight
        position={[-3.8, 2.8, 3.6]}
        intensity={2.3}
        color={world.secondary}
      />

      <spotLight
        position={[0.8, 3.4, 5.4]}
        target-position={[0, 0.2, 0]}
        intensity={5.8}
        angle={0.62}
        penumbra={0.72}
        distance={10}
        color="#f4d89a"
      />

      <pointLight
        position={[0, 2.1, 2.8]}
        intensity={3.4}
        distance={8}
        color={world.light}
      />

      <spotLight
        position={[0, 2.7, 5.9]}
        target-position={[0, 1.05, 0]}
        intensity={5.8}
        angle={0.32}
        penumbra={0.9}
        distance={10}
        color="#f1d7a4"
      />

      <pointLight
        position={[0, 1.45, 4.2]}
        intensity={2.2}
        distance={6}
        color="#d6a86a"
      />

      <spotLight
        position={[0, 2.7, 5.9]}
        target-position={[0, 1.05, 0]}
        intensity={5.8}
        angle={0.32}
        penumbra={0.9}
        distance={10}
        color="#f1d7a4"
      />

      <pointLight
        position={[0, 1.45, 4.2]}
        intensity={2.2}
        distance={6}
        color="#d6a86a"
      />

      <pointLight
        position={[0, -0.4, 2.3]}
        intensity={1.1}
        distance={5}
        color={world.secondary}
      />

      {presenceId === "pizarnik" && (
        <>
          <spotLight
            position={[0, 1.55, 3.1]}
            intensity={3.4}
            angle={0.42}
            penumbra={0.95}
            distance={8}
            color="#f7e7ff"
          />

          <pointLight
            position={[0.1, 1.05, 2.15]}
            intensity={1.8}
            distance={4.8}
            color="#f2dcff"
          />

          <pointLight
            position={[-1.25, 1.15, -1.35]}
            intensity={1.15}
            distance={5.5}
            color="#7d63d8"
          />
        </>
      )}

      <Float
        speed={0.32}
        rotationIntensity={0.025}
        floatIntensity={0.06}
      >
        {presenceId === "borges" ? (
          <BorgesModel />
        ) : presenceId === "camus" ? (
          <CamusModel />
        ) : presenceId === "pizarnik" ? (
          <PizarnikModel />
        ) : (
          <SymbolicGuardian world={world} />
        )}
      </Float>

      <mesh
        position={[0, -1.52, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[2.15, 96]} />

        <meshStandardMaterial
          color="#11131a"
          roughness={0.9}
          metalness={0.08}
        />
      </mesh>

      <mesh
        position={[0, -1.505, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[1.34, 1.42, 96]} />

        <meshBasicMaterial
          color={world.light}
          transparent
          opacity={0.32}
        />
      </mesh>

      <Sparkles
        count={72}
        scale={[4.6, 5.4, 3.8]}
        size={1.7}
        speed={0.28}
        opacity={0.48}
        color={world.light}
      />
    </>
  );
}

export default function TutelaryScene3D({
  presenceId,
}: TutelaryScene3DProps) {
  return (
    <Canvas
      camera={{
        position: [0, 0.38, 5.45],
        fov: 36,
      }}
      dpr={[1, 1.7]}
      gl={{
        antialias: true,
        alpha: false,
      }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.7;
      }}
    >
      <Suspense fallback={null}>
        <TutelaryWorld
          presenceId={presenceId}
        />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.06}
        autoRotate
        autoRotateSpeed={0.32}
        target={[0, 0.15, 0]}
        minPolarAngle={1.25}
        maxPolarAngle={1.72}
      />
    </Canvas>
  );
}

useGLTF.preload(
  "/poema-universal/presencias/borges/borges-tutelar.glb"
);

useGLTF.preload(
  "/poema-universal/presencias/camus/camus-tutelar.glb?v=2"
);

useGLTF.preload(
  "/poema-universal/presencias/pizarnik/pizarnik-tutelar.glb"
);
