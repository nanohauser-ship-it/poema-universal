"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function SaltDogModel() {
  const group = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (group.current) {
      group.current.position.y = Math.sin(t * 0.9) * 0.03;
      group.current.rotation.y = Math.sin(t * 0.25) * 0.08 - 0.18;
    }

    if (head.current) {
      head.current.rotation.z = Math.sin(t * 0.55) * 0.045 - 0.08;
      head.current.rotation.x = Math.sin(t * 0.45) * 0.02 - 0.12;
    }

    if (tail.current) {
      tail.current.rotation.z = Math.sin(t * 1.1) * 0.08 + 0.5;
    }
  });

  return (
    <group ref={group} position={[0, -0.4, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.45, 0]} scale={[1.65, 0.9, 0.72]}>
        <capsuleGeometry args={[0.72, 1.9, 12, 24]} />
        <meshStandardMaterial color="#efe9df" roughness={0.92} metalness={0.03} />
      </mesh>

      <mesh castShadow position={[0.1, 0.58, -0.15]} scale={[1.05, 0.85, 0.65]}>
        <capsuleGeometry args={[0.55, 1.2, 10, 20]} />
        <meshStandardMaterial color="#e7e0d4" roughness={0.88} />
      </mesh>

      <group ref={head} position={[1.4, 0.72, 0]}>
        <mesh castShadow scale={[0.78, 0.72, 0.68]}>
          <sphereGeometry args={[0.72, 32, 24]} />
          <meshStandardMaterial color="#f5efe5" roughness={0.86} />
        </mesh>

        <mesh castShadow position={[0.55, -0.1, 0]} scale={[0.55, 0.32, 0.28]}>
          <capsuleGeometry args={[0.25, 0.75, 8, 16]} />
          <meshStandardMaterial color="#ddd5c8" roughness={0.9} />
        </mesh>

        <mesh castShadow position={[0.1, 0.58, 0.28]} rotation={[0.2, 0, 0.18]}>
          <coneGeometry args={[0.18, 0.42, 12]} />
          <meshStandardMaterial color="#ece5d8" roughness={0.88} />
        </mesh>
        <mesh castShadow position={[0.1, 0.58, -0.28]} rotation={[-0.2, 0, 0.18]}>
          <coneGeometry args={[0.18, 0.42, 12]} />
          <meshStandardMaterial color="#ece5d8" roughness={0.88} />
        </mesh>

        <mesh position={[0.42, 0.03, 0.13]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#231f1b" />
        </mesh>
        <mesh position={[0.42, 0.03, -0.13]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#231f1b" />
        </mesh>
      </group>

      {[[-0.85, 0.0, 0.34], [-0.85, 0.0, -0.34], [0.65, 0.0, 0.34], [0.65, 0.0, -0.34]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh castShadow position={[0, 0.15, 0]} scale={[0.2, 0.65, 0.2]}>
            <capsuleGeometry args={[0.14, 0.75, 8, 14]} />
            <meshStandardMaterial color="#f2ece2" roughness={0.92} />
          </mesh>
          <mesh castShadow position={[0.03, -0.36, 0]} scale={[0.16, 0.55, 0.16]} rotation={[0.18, 0, 0]}>
            <capsuleGeometry args={[0.1, 0.6, 8, 12]} />
            <meshStandardMaterial color="#dbd4ca" roughness={0.92} />
          </mesh>
        </group>
      ))}

      <mesh ref={tail} castShadow position={[-1.55, 0.78, 0]} rotation={[0, 0, 0.48]} scale={[0.12, 0.72, 0.12]}>
        <capsuleGeometry args={[0.1, 0.95, 8, 12]} />
        <meshStandardMaterial color="#e5ddd0" roughness={0.9} />
      </mesh>

      <mesh castShadow position={[0.25, 0.18, 0.1]} rotation={[0.2, 0.1, -0.2]}>
        <cylinderGeometry args={[0.08, 0.11, 0.85, 10]} />
        <meshStandardMaterial color="#f7f3ed" roughness={0.86} />
      </mesh>

      {[[0.3, 0.98, 0.25], [0.95, 0.6, -0.45], [-0.4, 0.7, 0.4], [-1.1, 0.35, -0.2]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.028, 10, 10]} />
          <meshStandardMaterial color="#ffffff" emissive="#f5f2e8" emissiveIntensity={0.12} />
        </mesh>
      ))}
    </group>
  );
}

export function SaltDogPresence() {
  return (
    <Canvas camera={{ position: [0, 1.25, 5.9], fov: 34 }} dpr={[1, 1.7]} shadows>
      <color attach="background" args={["#0a0907"]} />
      <fog attach="fog" args={["#0a0907", 5, 12]} />
      <ambientLight intensity={0.48} />
      <directionalLight castShadow position={[4, 6, 5]} intensity={2.5} color="#efe4cf" />
      <pointLight position={[-2, 1.3, -1]} intensity={1.2} color="#a08b73" />
      <Float speed={0.4} rotationIntensity={0.03} floatIntensity={0.08}>
        <SaltDogModel />
      </Float>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.72, 0]} receiveShadow>
        <circleGeometry args={[4.8, 64]} />
        <meshStandardMaterial color="#14110d" roughness={1} />
      </mesh>
      <Environment preset="sunset" />
      <OrbitControls enablePan={false} minDistance={4.3} maxDistance={7.2} minPolarAngle={0.9} maxPolarAngle={1.7} autoRotate autoRotateSpeed={0.22} />
    </Canvas>
  );
}
