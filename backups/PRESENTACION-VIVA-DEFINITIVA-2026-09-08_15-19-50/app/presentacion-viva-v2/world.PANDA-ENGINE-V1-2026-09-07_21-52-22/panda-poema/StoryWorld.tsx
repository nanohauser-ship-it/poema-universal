"use client";

import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

function Ground() {
  return (
    <mesh
      position={[55, -0.35, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[125, 12]} />
      <meshStandardMaterial color="#c8b38f" roughness={1} />
    </mesh>
  );
}

function PaperHill({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <mesh
      position={position}
      rotation={[0, 0, -0.04]}
      scale={[scale, scale, scale]}
      castShadow
    >
      <sphereGeometry args={[2.8, 16, 8, 0, Math.PI]} />
      <meshStandardMaterial color="#a9906f" roughness={1} />
    </mesh>
  );
}

function Storm() {
  const lightning = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!lightning.current) return;
    const pulse = Math.max(0, Math.sin(clock.elapsedTime * 1.9));
    lightning.current.intensity = pulse > 0.92 ? 4 : 0.25;
  });

  return (
    <group position={[0, 0, 0]}>
      <PaperHill position={[-1.2, 0.1, -2]} scale={1.4} />
      <PaperHill position={[2.2, 0.3, -2.5]} scale={1.1} />

      {[-2.4, -1.1, 0.2, 1.5, 2.8].map((x, i) => (
        <mesh key={i} position={[x, 3.5 + (i % 2) * 0.25, -1]}>
          <sphereGeometry args={[1.05, 14, 10]} />
          <meshStandardMaterial
            color={i % 2 ? "#69635b" : "#5c5955"}
            roughness={1}
          />
        </mesh>
      ))}

      <mesh position={[0.4, 2.1, -0.8]} rotation={[0, 0, -0.18]}>
        <boxGeometry args={[0.12, 2.4, 0.08]} />
        <meshStandardMaterial
          color="#ead28c"
          emissive="#8c7441"
          emissiveIntensity={1.2}
        />
      </mesh>

      <pointLight
        ref={lightning}
        position={[0.4, 2.2, 1]}
        color="#ffe3a0"
        distance={7}
        intensity={0.3}
      />
    </group>
  );
}

function Kitchen() {
  return (
    <group position={[14, 0, 0]}>
      <mesh position={[0, 1.7, -2.2]} receiveShadow>
        <boxGeometry args={[8, 4.5, 0.3]} />
        <meshStandardMaterial color="#d4bd98" roughness={1} />
      </mesh>

      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[5.4, 0.3, 2]} />
        <meshStandardMaterial color="#755139" roughness={1} />
      </mesh>

      <mesh position={[-1.7, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.55, 0.4, 20]} />
        <meshStandardMaterial color="#494641" roughness={0.6} />
      </mesh>

      <Text
        position={[0, 3.2, -1.9]}
        color="#554033"
        fontSize={0.34}
        anchorX="center"
      >
        COCINA
      </Text>
    </group>
  );
}

function Leaving() {
  return (
    <group position={[28, 0, 0]}>
      <mesh position={[0, 1.45, -1.5]} castShadow>
        <boxGeometry args={[2.5, 3.4, 0.32]} />
        <meshStandardMaterial color="#7b5b45" roughness={1} />
      </mesh>

      <mesh position={[-2.1, 1.4, -0.2]} rotation={[0, 0, 0.16]}>
        <planeGeometry args={[1.4, 1.9]} />
        <meshStandardMaterial
          color="#eee5d6"
          side={THREE.DoubleSide}
          roughness={1}
        />
      </mesh>
    </group>
  );
}

function Literature() {
  return (
    <group position={[42, 0, 0]}>
      {[-2.1, -0.7, 0.7, 2.1].map((x, i) => (
        <group key={i} position={[x, 0.3 + i * 0.12, 0]}>
          {[0, 1, 2, 3].map((j) => (
            <mesh key={j} position={[0, j * 0.28, 0]}>
              <boxGeometry args={[1.25, 0.22, 0.8]} />
              <meshStandardMaterial
                color={j % 2 ? "#715646" : "#9d7d61"}
                roughness={1}
              />
            </mesh>
          ))}
        </group>
      ))}

      <Text
        position={[0, 3.1, -1]}
        color="#554033"
        fontSize={0.34}
        anchorX="center"
      >
        LITERATURA
      </Text>
    </group>
  );
}

function Birth() {
  return (
    <group position={[56, 0, 0]}>
      <mesh position={[0, 1.5, 0]} rotation={[0, 0, -0.08]}>
        <planeGeometry args={[4.2, 3]} />
        <meshStandardMaterial
          color="#efe6d5"
          side={THREE.DoubleSide}
          roughness={1}
        />
      </mesh>

      <Text
        position={[0, 1.55, 0.05]}
        color="#564238"
        fontSize={0.32}
        anchorX="center"
      >
        POEMA UNIVERSAL
      </Text>
    </group>
  );
}

function Call() {
  const plane = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!plane.current) return;
    plane.current.position.y =
      2.2 + Math.sin(clock.elapsedTime * 1.6) * 0.18;
    plane.current.rotation.z =
      -0.25 + Math.sin(clock.elapsedTime * 1.2) * 0.12;
  });

  return (
    <group position={[70, 0, 0]}>
      <group ref={plane} position={[0, 2.2, 0]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <planeGeometry args={[1.4, 1.4]} />
          <meshStandardMaterial
            color="#eee4d3"
            side={THREE.DoubleSide}
            roughness={1}
          />
        </mesh>
      </group>

      <Text
        position={[0, 3.8, -1]}
        color="#554033"
        fontSize={0.3}
        anchorX="center"
      >
        LA LLAMADA
      </Text>
    </group>
  );
}

function Voices() {
  return (
    <group position={[84, 0, 0]}>
      {Array.from({ length: 10 }, (_, i) => {
        const angle = (i / 10) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 2.4,
              1.7 + Math.sin(angle) * 0.9,
              Math.sin(angle) * 0.8,
            ]}
          >
            <sphereGeometry args={[0.22, 12, 10]} />
            <meshStandardMaterial color="#e4d2b4" roughness={1} />
          </mesh>
        );
      })}

      <Text
        position={[0, 3.7, -1]}
        color="#554033"
        fontSize={0.36}
        anchorX="center"
      >
        10 / 60
      </Text>
    </group>
  );
}

function EmptyVoices() {
  return (
    <group position={[96, 0, 0]}>
      {Array.from({ length: 20 }, (_, i) => {
        const col = i % 5;
        const row = Math.floor(i / 5);

        return (
          <mesh
            key={i}
            position={[
              (col - 2) * 1.05,
              0.7 + row * 0.7,
              0,
            ]}
          >
            <planeGeometry args={[0.5, 0.7]} />
            <meshStandardMaterial
              color="#d8c8ae"
              transparent
              opacity={0.32}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}

      <Text
        position={[0, 4.0, -1]}
        color="#554033"
        fontSize={0.28}
        anchorX="center"
      >
        FALTAN CINCUENTA
      </Text>
    </group>
  );
}

function WhiteTree() {
  return (
    <group position={[108, 0, 0]}>
      <mesh position={[0, 1.7, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.55, 4.2, 10]} />
        <meshStandardMaterial color="#eee9df" roughness={1} />
      </mesh>

      {[
        [-1.5, 3.3, 0],
        [-0.7, 4.0, 0],
        [0.2, 4.3, 0],
        [1.1, 3.8, 0],
        [1.8, 3.1, 0],
      ].map((p, i) => (
        <mesh
          key={i}
          position={p as [number, number, number]}
          scale={[1.5, 0.9, 0.5]}
        >
          <sphereGeometry args={[1.2, 14, 10]} />
          <meshStandardMaterial color="#f1ede5" roughness={1} />
        </mesh>
      ))}

      <Text
        position={[0, 5.8, -1]}
        color="#514037"
        fontSize={0.4}
        anchorX="center"
      >
        ÁRBOL BLANCO
      </Text>
    </group>
  );
}

export function StoryWorld() {
  return (
    <>
      <Ground />

      <Storm />
      <Kitchen />
      <Leaving />
      <Literature />
      <Birth />
      <Call />
      <Voices />
      <EmptyVoices />
      <WhiteTree />

      <PaperHill position={[7, 0, -3.4]} scale={1.1} />
      <PaperHill position={[35, 0, -3.7]} scale={1.2} />
      <PaperHill position={[63, 0, -3.2]} scale={0.9} />
      <PaperHill position={[91, 0, -3.6]} scale={1.15} />
    </>
  );
}
