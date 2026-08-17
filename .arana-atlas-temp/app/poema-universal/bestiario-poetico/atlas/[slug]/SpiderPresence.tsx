"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Letter({ position, rotation, scale = 1 }: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow>
        <boxGeometry args={[0.82, 0.53, 0.025]} />
        <meshStandardMaterial color="#d8c7a5" roughness={0.93} />
      </mesh>
      <mesh position={[0, 0.01, 0.016]}>
        <planeGeometry args={[0.7, 0.4]} />
        <meshStandardMaterial color="#8f7350" roughness={1} transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

function Spider() {
  const group = useRef<THREE.Group>(null);
  const abdomen = useRef<THREE.Mesh>(null);

  const legs = useMemo(() => {
    const result: Array<{ side: number; z: number; bend: number }> = [];
    [-1, 1].forEach((side) => {
      [-0.55, -0.18, 0.18, 0.55].forEach((z, index) => {
        result.push({ side, z, bend: (index - 1.5) * 0.1 });
      });
    });
    return result;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = Math.sin(time * 0.22) * 0.09;
      group.current.position.y = Math.sin(time * 0.65) * 0.035;
    }
    if (abdomen.current) {
      const pulse = 1 + Math.sin(time * 1.4) * 0.018;
      abdomen.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group ref={group}>
      <mesh castShadow position={[0, 0.2, 0.48]}>
        <sphereGeometry args={[0.46, 48, 32]} />
        <meshStandardMaterial color="#27221d" roughness={0.75} />
      </mesh>

      <mesh ref={abdomen} castShadow position={[0, 0.25, -0.35]} scale={[1.25, 0.92, 1.4]}>
        <sphereGeometry args={[0.82, 64, 48]} />
        <meshPhysicalMaterial color="#584938" roughness={0.46} transmission={0.08} thickness={0.7} clearcoat={0.18} />
      </mesh>

      <Letter position={[0, 0.27, -1.17]} rotation={[-0.02, 0, 0]} scale={0.55} />

      {legs.map((leg, index) => {
        const x = leg.side * 0.48;
        const outerX = leg.side * 1.38;
        const outerZ = leg.z - 0.15;

        return (
          <group key={index}>
            <mesh
              castShadow
              position={[(x + outerX) / 2, 0.1, (leg.z + outerZ) / 2]}
              rotation={[0, Math.atan2(outerX - x, outerZ - leg.z), Math.PI / 2 + leg.bend]}
            >
              <cylinderGeometry args={[0.065, 0.09, 1.08, 12]} />
              <meshStandardMaterial color="#211c18" roughness={0.86} />
            </mesh>

            <mesh
              castShadow
              position={[outerX + leg.side * 0.35, -0.18, outerZ + 0.15]}
              rotation={[0, Math.atan2(leg.side * 0.7, 0.3), Math.PI / 2 - leg.side * 0.22]}
            >
              <cylinderGeometry args={[0.035, 0.065, 0.9, 10]} />
              <meshStandardMaterial color="#181411" roughness={0.9} />
            </mesh>
          </group>
        );
      })}

      <Letter position={[-1.65, -0.45, 0.6]} rotation={[-0.3, 0.4, -0.55]} scale={0.48} />
      <Letter position={[1.45, -0.55, -0.25]} rotation={[0.16, -0.4, 0.42]} scale={0.4} />
      <Letter position={[0.42, -0.65, 1.25]} rotation={[-0.45, 0.15, 0.12]} scale={0.34} />
    </group>
  );
}

export function SpiderPresence() {
  return (
    <Canvas camera={{ position: [0, 1.25, 5.7], fov: 34 }} dpr={[1, 1.7]} shadows>
      <color attach="background" args={["#090806"]} />
      <fog attach="fog" args={["#090806", 5, 11]} />
      <ambientLight intensity={0.42} />
      <directionalLight castShadow position={[3, 6, 4]} intensity={2.2} color="#e3c99b" />
      <pointLight position={[-3, 1, 2]} intensity={1.1} color="#806b55" />
      <Float speed={0.45} rotationIntensity={0.05} floatIntensity={0.14}>
        <Spider />
      </Float>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 0]} receiveShadow>
        <circleGeometry args={[4.5, 64]} />
        <meshStandardMaterial color="#100e0b" roughness={1} />
      </mesh>
      <Environment preset="warehouse" />
      <OrbitControls
        enablePan={false}
        minDistance={4.1}
        maxDistance={7}
        minPolarAngle={0.85}
        maxPolarAngle={1.75}
        autoRotate
        autoRotateSpeed={0.28}
      />
    </Canvas>
  );
}
