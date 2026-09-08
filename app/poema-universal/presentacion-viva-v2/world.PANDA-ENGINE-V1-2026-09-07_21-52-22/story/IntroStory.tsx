"use client";

import * as THREE from "three";
import { Line } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";

function PaperCloud({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      {[
        [-0.85, 0, 0],
        [-0.25, 0.25, 0.03],
        [0.35, 0.12, 0],
        [0.9, -0.02, 0.02],
      ].map((p, i) => (
        <mesh
          key={i}
          position={p as [number, number, number]}
          scale={[
            1.05 + i * 0.08,
            0.5 + (i % 2) * 0.1,
            0.16,
          ]}
        >
          <sphereGeometry args={[0.75, 18, 12]} />
          <meshStandardMaterial
            color={i % 2 ? "#68625d" : "#585653"}
            roughness={1}
          />
        </mesh>
      ))}
    </group>
  );
}

function Rain() {
  const root = useRef<THREE.Group>(null);

  const drops = useMemo(
    () =>
      Array.from({ length: 56 }, (_, i) => ({
        x: ((i * 37) % 100) / 10 - 5,
        y: ((i * 61) % 90) / 13 - 1.5,
        z: ((i * 23) % 75) / 12 - 3,
        size: 0.16 + ((i * 7) % 10) / 80,
      })),
    [],
  );

  useFrame(({ clock }) => {
    if (!root.current) return;

    root.current.position.y =
      -((clock.elapsedTime * 0.8) % 1.25);
  });

  return (
    <group ref={root}>
      {drops.map((d, i) => (
        <mesh
          key={i}
          position={[d.x, d.y, d.z]}
          rotation={[0, 0, -0.18]}
        >
          <planeGeometry args={[0.018, d.size]} />
          <meshBasicMaterial
            color="#cbc6ba"
            transparent
            opacity={0.28}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function Jose() {
  const root = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Mesh>(null);
  const rightLeg = useRef<THREE.Mesh>(null);

  const { camera } = useThree();

  useFrame(({ clock }) => {
    if (!root.current) return;

    const t = THREE.MathUtils.clamp(
      (15.5 - camera.position.z) / 13,
      0,
      1,
    );

    root.current.position.z =
      THREE.MathUtils.lerp(1.65, -5.05, t);

    root.current.position.x =
      THREE.MathUtils.lerp(-1.15, 0, t) +
      Math.sin(t * Math.PI) * 0.26;

    root.current.position.y =
      -0.31 +
      Math.abs(Math.sin(clock.elapsedTime * 6.2)) * 0.035;

    const walk =
      Math.sin(clock.elapsedTime * 6.2) * 0.3;

    if (leftLeg.current) {
      leftLeg.current.rotation.x = walk;
    }

    if (rightLeg.current) {
      rightLeg.current.rotation.x = -walk;
    }
  });

  return (
    <group ref={root}>
      <mesh position={[0, 1.48, 0]}>
        <sphereGeometry args={[0.2, 16, 12]} />
        <meshStandardMaterial
          color="#d0aa82"
          roughness={1}
        />
      </mesh>

      <mesh position={[0, 0.93, 0]}>
        <boxGeometry args={[0.56, 0.88, 0.16]} />
        <meshStandardMaterial
          color="#ece4d4"
          roughness={1}
        />
      </mesh>

      <mesh
        ref={leftLeg}
        position={[-0.15, 0.27, 0]}
      >
        <boxGeometry args={[0.15, 0.75, 0.13]} />
        <meshStandardMaterial
          color="#4b443e"
          roughness={1}
        />
      </mesh>

      <mesh
        ref={rightLeg}
        position={[0.15, 0.27, 0]}
      >
        <boxGeometry args={[0.15, 0.75, 0.13]} />
        <meshStandardMaterial
          color="#4b443e"
          roughness={1}
        />
      </mesh>
    </group>
  );
}

function GuidingPage() {
  const root = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  useFrame(({ clock }) => {
    if (!root.current) return;

    const t = THREE.MathUtils.clamp(
      (15.5 - camera.position.z) / 13,
      0,
      1,
    );

    root.current.position.z =
      THREE.MathUtils.lerp(0.55, -5.65, t);

    root.current.position.x =
      THREE.MathUtils.lerp(-0.8, 0.15, t) +
      Math.sin(clock.elapsedTime * 1.8) * 0.12;

    root.current.position.y =
      1.25 +
      Math.sin(clock.elapsedTime * 2.2) * 0.12;

    root.current.rotation.z =
      -0.12 +
      Math.sin(clock.elapsedTime * 1.5) * 0.14;

    root.current.rotation.y =
      Math.sin(clock.elapsedTime * 1.1) * 0.18;
  });

  return (
    <mesh ref={root}>
      <planeGeometry args={[0.5, 0.7]} />
      <meshStandardMaterial
        color="#f0e6d5"
        roughness={0.98}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Doorway() {
  const light = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (light.current) {
      light.current.intensity =
        2.5 + Math.sin(clock.elapsedTime * 1.2) * 0.35;
    }
  });

  return (
    <group position={[0, -0.02, -5.85]}>
      <mesh position={[-0.78, 0.95, 0]}>
        <boxGeometry args={[0.18, 2.7, 0.24]} />
        <meshStandardMaterial
          color="#6d4c35"
          roughness={1}
        />
      </mesh>

      <mesh position={[0.78, 0.95, 0]}>
        <boxGeometry args={[0.18, 2.7, 0.24]} />
        <meshStandardMaterial
          color="#6d4c35"
          roughness={1}
        />
      </mesh>

      <mesh position={[0, 2.25, 0]}>
        <boxGeometry args={[1.72, 0.18, 0.24]} />
        <meshStandardMaterial
          color="#6d4c35"
          roughness={1}
        />
      </mesh>

      <mesh position={[0, 1.02, -0.1]}>
        <planeGeometry args={[1.48, 2.36]} />
        <meshBasicMaterial
          color="#e9b96d"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      <pointLight
        ref={light}
        position={[0, 1.15, 0.9]}
        color="#f4c477"
        distance={5}
        decay={2}
        intensity={2.5}
      />
    </group>
  );
}

export function IntroStory() {
  return (
    <group position={[0, 0, 7]}>
      <mesh
        position={[0, -0.73, -1.8]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[3.1, 8.8]} />
        <meshStandardMaterial
          color="#8d785e"
          roughness={1}
        />
      </mesh>

      <PaperCloud position={[-2.6, 3.25, 0]} scale={1.1} />
      <PaperCloud position={[1.0, 3.6, -0.8]} scale={1.35} />
      <PaperCloud position={[3.3, 3.0, -2.2]} scale={0.9} />

      <Line
        points={[
          [1.15, 3.2, -0.55],
          [0.72, 2.55, -0.51],
          [1.02, 2.18, -0.47],
          [0.55, 1.52, -0.44],
        ]}
        color="#e7d4a4"
        lineWidth={2}
      />

      <Rain />

      <Jose />

      <GuidingPage />

      <Doorway />
    </group>
  );
}
