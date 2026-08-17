"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, Sparkles } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type BoneProps = {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
};

function BoneRelic({ position, rotation = [0, 0, 0], scale = 1 }: BoneProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.65, 14]} />
        <meshStandardMaterial color="#eee8dc" roughness={0.82} />
      </mesh>
      {[[-0.12, 0.31, 0], [0.12, 0.31, 0], [-0.12, -0.31, 0], [0.12, -0.31, 0]].map((p, index) => (
        <mesh key={index} castShadow position={p as [number, number, number]}>
          <sphereGeometry args={[0.11, 16, 12]} />
          <meshStandardMaterial color="#eee8dc" roughness={0.82} />
        </mesh>
      ))}
    </group>
  );
}

function Paw({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow scale={[0.28, 0.16, 0.38]}>
        <sphereGeometry args={[0.5, 22, 16]} />
        <meshStandardMaterial color="#ddd6cb" roughness={0.98} />
      </mesh>
      {[-0.13, 0, 0.13].map((x) => (
        <mesh key={x} castShadow position={[x, -0.01, 0.18]} scale={[0.08, 0.05, 0.12]}>
          <sphereGeometry args={[0.5, 12, 10]} />
          <meshStandardMaterial color="#c8c0b5" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function SaltDogModel() {
  const root = useRef<THREE.Group>(null);
  const chest = useRef<THREE.Mesh>(null);
  const head = useRef<THREE.Group>(null);
  const leftEar = useRef<THREE.Mesh>(null);
  const rightEar = useRef<THREE.Mesh>(null);
  const tail = useRef<THREE.Group>(null);

  const cracks = useMemo(
    () => [
      { p: [0.1, 0.42, 0.44], r: [0.2, 0.1, 0.35], s: [0.02, 0.23, 0.02] },
      { p: [-0.36, 0.2, 0.53], r: [0.1, 0.2, -0.5], s: [0.018, 0.18, 0.018] },
      { p: [0.52, 0.15, 0.2], r: [0.1, 0.2, 0.25], s: [0.016, 0.16, 0.016] },
      { p: [-0.55, 0.35, -0.15], r: [0.4, 0.1, -0.1], s: [0.015, 0.19, 0.015] }
    ],
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (root.current) {
      root.current.rotation.y = -0.28 + Math.sin(t * 0.22) * 0.045;
      root.current.position.y = -0.52 + Math.sin(t * 0.65) * 0.018;
    }

    if (chest.current) {
      const breath = 1 + Math.sin(t * 1.15) * 0.018;
      chest.current.scale.set(1.25 * breath, 1.08 * breath, 0.9 * breath);
    }

    if (head.current) {
      head.current.rotation.x = -0.2 + Math.sin(t * 0.38) * 0.018;
      head.current.rotation.z = -0.08 + Math.sin(t * 0.31) * 0.015;
    }

    if (leftEar.current && rightEar.current) {
      leftEar.current.rotation.z = 0.14 + Math.sin(t * 0.9) * 0.025;
      rightEar.current.rotation.z = -0.14 - Math.sin(t * 0.82) * 0.02;
    }

    if (tail.current) {
      tail.current.rotation.z = 0.5 + Math.sin(t * 0.7) * 0.035;
    }
  });

  return (
    <group ref={root} position={[0, -0.52, 0]}>
      {/* torso */}
      <mesh ref={chest} castShadow position={[-0.15, 0.95, 0]} scale={[1.25, 1.08, 0.9]}>
        <sphereGeometry args={[0.86, 64, 48]} />
        <meshPhysicalMaterial
          color="#eee8dd"
          roughness={0.78}
          metalness={0.02}
          clearcoat={0.08}
          clearcoatRoughness={0.9}
        />
      </mesh>

      <mesh castShadow position={[-0.65, 1.05, -0.02]} scale={[0.95, 0.86, 0.75]}>
        <sphereGeometry args={[0.82, 56, 40]} />
        <meshStandardMaterial color="#e1d9cd" roughness={0.93} />
      </mesh>

      {/* neck */}
      <mesh castShadow position={[0.65, 1.25, 0]} rotation={[0, 0, -0.12]} scale={[0.45, 0.9, 0.5]}>
        <capsuleGeometry args={[0.42, 0.72, 12, 24]} />
        <meshStandardMaterial color="#ebe3d8" roughness={0.9} />
      </mesh>

      {/* head */}
      <group ref={head} position={[1.15, 1.62, 0]}>
        <mesh castShadow scale={[0.78, 0.72, 0.68]}>
          <sphereGeometry args={[0.7, 52, 36]} />
          <meshStandardMaterial color="#f0e9df" roughness={0.88} />
        </mesh>

        <mesh castShadow position={[0.58, -0.13, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.42, 0.3, 0.3]}>
          <capsuleGeometry args={[0.3, 0.68, 10, 20]} />
          <meshStandardMaterial color="#ddd4c8" roughness={0.96} />
        </mesh>

        <mesh castShadow position={[0.92, -0.11, 0]} scale={[0.16, 0.12, 0.16]}>
          <sphereGeometry args={[0.5, 20, 16]} />
          <meshStandardMaterial color="#2a2520" roughness={0.7} />
        </mesh>

        <mesh ref={leftEar} castShadow position={[0.08, 0.58, 0.34]} rotation={[0.16, 0, 0.14]}>
          <coneGeometry args={[0.22, 0.58, 18]} />
          <meshStandardMaterial color="#e9e1d6" roughness={0.92} />
        </mesh>
        <mesh ref={rightEar} castShadow position={[0.08, 0.58, -0.34]} rotation={[-0.16, 0, -0.14]}>
          <coneGeometry args={[0.22, 0.58, 18]} />
          <meshStandardMaterial color="#e9e1d6" roughness={0.92} />
        </mesh>

        <mesh position={[0.45, 0.06, 0.22]}>
          <sphereGeometry args={[0.06, 18, 14]} />
          <meshStandardMaterial color="#12100e" emissive="#302820" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0.45, 0.06, -0.22]}>
          <sphereGeometry args={[0.06, 18, 14]} />
          <meshStandardMaterial color="#12100e" emissive="#302820" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* legs */}
      {[
        [-0.75, 0.3, 0.46],
        [-0.75, 0.3, -0.46],
        [0.48, 0.3, 0.43],
        [0.48, 0.3, -0.43]
      ].map((position, index) => (
        <group key={index} position={position as [number, number, number]}>
          <mesh castShadow position={[0, 0.24, 0]} scale={[0.23, 0.7, 0.23]}>
            <capsuleGeometry args={[0.16, 0.8, 10, 18]} />
            <meshStandardMaterial color="#ece5db" roughness={0.93} />
          </mesh>
          <mesh castShadow position={[0.04, -0.37, 0]} rotation={[0.18, 0, 0]} scale={[0.17, 0.5, 0.17]}>
            <capsuleGeometry args={[0.12, 0.56, 10, 16]} />
            <meshStandardMaterial color="#d7cfc4" roughness={0.96} />
          </mesh>
          <Paw position={[0.08, -0.78, 0]} />
        </group>
      ))}

      {/* tail */}
      <group ref={tail} position={[-1.36, 1.15, 0]} rotation={[0, 0, 0.5]}>
        <mesh castShadow scale={[0.18, 0.95, 0.18]}>
          <capsuleGeometry args={[0.13, 1.1, 10, 18]} />
          <meshStandardMaterial color="#ddd5c9" roughness={0.94} />
        </mesh>
      </group>

      {/* relic suspended at chest */}
      <BoneRelic position={[0.32, 0.95, 0.63]} rotation={[0.18, 0, 0.35]} scale={0.85} />

      {/* bandage */}
      <mesh castShadow position={[0.16, 1.22, 0.56]} rotation={[0.2, 0.05, -0.32]}>
        <torusGeometry args={[0.34, 0.055, 12, 64, Math.PI * 1.45]} />
        <meshStandardMaterial color="#b8aa98" roughness={1} />
      </mesh>

      {/* mineral cracks */}
      {cracks.map((crack, index) => (
        <mesh key={index} position={crack.p as [number, number, number]} rotation={crack.r as [number, number, number]} scale={crack.s as [number, number, number]}>
          <cylinderGeometry args={[0.5, 0.5, 1, 8]} />
          <meshStandardMaterial color="#a99c8e" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

export function SaltDogPresence() {
  return (
    <Canvas camera={{ position: [0.25, 1.8, 5.8], fov: 34 }} dpr={[1, 1.7]} shadows>
      <color attach="background" args={["#090806"]} />
      <fog attach="fog" args={["#090806", 5.8, 13]} />

      <ambientLight intensity={0.5} />
      <directionalLight castShadow position={[4.5, 7, 5]} intensity={2.8} color="#f3e8d2" />
      <pointLight position={[-3, 2, 1]} intensity={1.25} color="#9d8973" />
      <pointLight position={[1, 0.6, -3]} intensity={0.7} color="#5f554a" />

      <SaltDogModel />

      <Sparkles
        count={55}
        scale={[4.5, 2.8, 4.5]}
        size={1.35}
        speed={0.18}
        opacity={0.45}
        color="#e9e1d4"
        position={[0, 1.1, 0]}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.32, 0]} receiveShadow>
        <circleGeometry args={[5.2, 96]} />
        <meshStandardMaterial color="#11100d" roughness={1} />
      </mesh>

      <Environment preset="sunset" />
      <OrbitControls
        enablePan={false}
        minDistance={4.2}
        maxDistance={7.1}
        minPolarAngle={0.9}
        maxPolarAngle={1.7}
        target={[0, 0.8, 0]}
        autoRotate
        autoRotateSpeed={0.16}
      />
    </Canvas>
  );
}
