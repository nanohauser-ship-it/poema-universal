"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const CYCLE_DURATION = 32;

function clamp01(value: number) {
  return THREE.MathUtils.clamp(value, 0, 1);
}

function smooth(value: number) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

function getCycleProgress(elapsed: number) {
  return (elapsed % CYCLE_DURATION) / CYCLE_DURATION;
}

/**
 * ACTO II
 * Los poetas levantan físicamente un muro común.
 */
function GrowingWall() {
  const blocks = useRef<Array<THREE.Mesh | null>>([]);

  const blockData = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, index) => {
        const row = Math.floor(index / 8);
        const column = index % 8;

        return {
          position: [
            -4.4 + column * 1.05,
            1.8 + row * 0.72,
            -3.95,
          ] as [number, number, number],
          delay: index / 24,
        };
      }),
    []
  );

  useFrame(({ clock }) => {
    const cycle = getCycleProgress(clock.getElapsedTime());

    blockData.forEach((block, index) => {
      const mesh = blocks.current[index];
      if (!mesh) return;

      const construction = smooth(
        (cycle - 0.12 - block.delay * 0.22) / 0.18
      );

      mesh.position.x = block.position[0];
      mesh.position.z = block.position[2];
      mesh.position.y = THREE.MathUtils.lerp(
        -0.8,
        block.position[1],
        construction
      );

      mesh.rotation.y =
        THREE.MathUtils.lerp(0.35, 0, construction) +
        Math.sin(clock.getElapsedTime() + index) * 0.002;

      mesh.scale.setScalar(
        THREE.MathUtils.lerp(0.72, 1, construction)
      );
    });
  });

  return (
    <group>
      {blockData.map((block, index) => (
        <mesh
          key={index}
          ref={(node) => {
            blocks.current[index] = node;
          }}
          position={[block.position[0], -0.8, block.position[2]]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.94, 0.58, 0.62]} />
          <meshStandardMaterial
            color={index % 3 === 0 ? "#766b5c" : "#62594f"}
            roughness={1}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * ACTO II
 * El agua vuelve lentamente a un canal que estaba vacío.
 */
function LivingWater() {
  const water = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    if (!water.current || !material.current) return;

    const elapsed = clock.getElapsedTime();
    const cycle = getCycleProgress(elapsed);

    const arrival = smooth((cycle - 0.25) / 0.2);
    const disappearance = 1 - smooth((cycle - 0.94) / 0.05);
    const presence = arrival * disappearance;

    water.current.scale.x = Math.max(0.03, presence);
    water.current.position.x = -8.65 + (1 - presence) * -1.9;
    water.current.position.y =
      0.68 + Math.sin(elapsed * 1.7) * 0.018;

    material.current.opacity = 0.14 + presence * 0.68;
    material.current.emissiveIntensity =
      0.08 + presence * 0.34;
  });

  return (
    <group>
      <mesh
        ref={water}
        position={[-8.65, 0.68, -4.8]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[0.03, 1, 1]}
      >
        <planeGeometry args={[4, 4.5, 1, 1]} />
        <meshStandardMaterial
          ref={material}
          color="#35596a"
          emissive="#193c4e"
          emissiveIntensity={0.1}
          transparent
          opacity={0.15}
          roughness={0.2}
          metalness={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {[-5.8, -4.9, -4, -3.1].map((z, index) => (
        <mesh
          key={z}
          position={[-6.58, 0.78, z]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.04, 0.04, 0.9, 8]} />
          <meshStandardMaterial
            color="#7598a4"
            emissive="#315568"
            emissiveIntensity={0.35 + index * 0.04}
          />
        </mesh>
      ))}
    </group>
  );
}

const VOICE_ORIGINS: Array<[number, number, number]> = [
  [-8.2, 1.75, 3.8],
  [-5.6, 1.75, 5.2],
  [-5.4, 2.95, 0.5],
  [-2.4, 2.95, 1.3],
  [1.2, 2.95, 2.1],
  [4.4, 2.95, 2.3],
  [-1.2, 4.3, -2.4],
  [2.2, 4.3, -1.8],
  [5.8, 4.3, -2.4],
  [7.4, 4.3, -4.1],
  [2.5, 5.85, -5.8],
  [5.2, 5.85, -6.1],
];

/**
 * ACTO III
 * Las voces individuales abandonan a los poetas
 * y se reúnen en el Libro Fundacional.
 */
function VoiceOfferings() {
  const lights = useRef<Array<THREE.Mesh | null>>([]);
  const materials = useRef<Array<THREE.MeshStandardMaterial | null>>([]);

  const destination = useMemo(
    () => new THREE.Vector3(3.75, 6.05, -5.55),
    []
  );

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const cycle = getCycleProgress(elapsed);

    VOICE_ORIGINS.forEach((origin, index) => {
      const light = lights.current[index];
      const material = materials.current[index];

      if (!light || !material) return;

      const delay = index * 0.014;
      const journey = smooth(
        (cycle - 0.42 - delay) / 0.19
      );

      const visible =
        smooth((cycle - 0.39 - delay) / 0.05) *
        (1 - smooth((cycle - 0.67) / 0.05));

      const start = new THREE.Vector3(...origin);
      const current = start.clone().lerp(destination, journey);

      current.y +=
        Math.sin(journey * Math.PI) * (1.7 + (index % 3) * 0.2);

      light.position.copy(current);

      const pulse =
        0.8 + Math.sin(elapsed * 4 + index * 0.7) * 0.22;

      light.scale.setScalar(Math.max(0.001, visible * pulse));
      material.opacity = visible;
      material.emissiveIntensity = 1.6 + visible * 2.2;
    });
  });

  return (
    <group>
      {VOICE_ORIGINS.map((_, index) => (
        <mesh
          key={index}
          ref={(node) => {
            lights.current[index] = node;
          }}
          scale={0}
        >
          <sphereGeometry args={[0.1, 14, 14]} />
          <meshStandardMaterial
            ref={(node) => {
              materials.current[index] = node;
            }}
            color="#f0d59a"
            emissive="#d69b43"
            emissiveIntensity={2}
            transparent
            opacity={0}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * ACTO IV
 * El Libro reúne suficiente energía para ascender.
 */
function BookResonance() {
  const rings = useRef<Array<THREE.Mesh | null>>([]);
  const materials = useRef<Array<THREE.MeshBasicMaterial | null>>([]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const cycle = getCycleProgress(elapsed);

    const resonance =
      smooth((cycle - 0.62) / 0.08) *
      (1 - smooth((cycle - 0.84) / 0.05));

    rings.current.forEach((ring, index) => {
      const material = materials.current[index];
      if (!ring || !material) return;

      const expansion =
        resonance *
        (1.1 + index * 0.65) *
        (1 + Math.sin(elapsed * 2 + index) * 0.05);

      ring.scale.setScalar(Math.max(0.001, expansion));
      material.opacity =
        resonance * (0.32 - index * 0.07);
    });
  });

  return (
    <group
      position={[4.05, 6.12, -5.85]}
      rotation={[Math.PI / 2, 0, 0]}
    >
      {[0.4, 0.7, 1].map((radius, index) => (
        <mesh
          key={radius}
          ref={(node) => {
            rings.current[index] = node;
          }}
          scale={0}
        >
          <torusGeometry args={[radius, 0.018, 8, 48]} />
          <meshBasicMaterial
            ref={(node) => {
              materials.current[index] = node;
            }}
            color="#f1d59b"
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

const SPROUTS: Array<[number, number, number, number]> = [
  [1.5, 4.88, -6.6, -0.3],
  [2.1, 4.88, -7.1, 0.3],
  [3.1, 4.88, -7.4, -0.2],
  [4.8, 4.88, -7.3, 0.4],
  [5.8, 4.88, -6.9, -0.4],
  [6.4, 4.88, -5.9, 0.2],
  [1.2, 4.88, -5.4, 0.4],
  [6.2, 4.88, -5.1, -0.25],
  [-1.8, 3.3, -3.8, 0.2],
  [-0.7, 3.3, -4.4, -0.3],
  [6.8, 3.3, -3.7, 0.4],
  [-7.1, 1.3, -3.2, -0.4],
];

/**
 * ACTO V
 * La poesía ya no es solo texto: se convierte en vida.
 */
function ReturningLife() {
  const sprouts = useRef<Array<THREE.Group | null>>([]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const cycle = getCycleProgress(elapsed);

    SPROUTS.forEach((_, index) => {
      const sprout = sprouts.current[index];
      if (!sprout) return;

      const delay = (index % 6) * 0.014;
      const growth = smooth(
        (cycle - 0.84 - delay) / 0.1
      );

      const reset = 1 - smooth((cycle - 0.985) / 0.014);
      const life = growth * reset;

      sprout.scale.set(
        life,
        life * (1 + Math.sin(elapsed * 1.2 + index) * 0.03),
        life
      );

      sprout.rotation.y += 0.001;
    });
  });

  return (
    <group>
      {SPROUTS.map(([x, y, z, rotation], index) => (
        <group
          key={index}
          ref={(node) => {
            sprouts.current[index] = node;
          }}
          position={[x, y, z]}
          rotation={[0, rotation, 0]}
          scale={0}
        >
          <mesh position={[0, 0.22, 0]} rotation={[0, 0, -0.34]}>
            <sphereGeometry args={[0.18, 12, 8]} />
            <meshStandardMaterial
              color="#87916e"
              roughness={0.9}
            />
          </mesh>

          <mesh position={[0.18, 0.35, 0]} rotation={[0, 0, 0.45]}>
            <sphereGeometry args={[0.15, 12, 8]} />
            <meshStandardMaterial
              color="#a4aa82"
              roughness={0.9}
            />
          </mesh>

          <mesh position={[0, 0.18, 0]}>
            <cylinderGeometry args={[0.025, 0.035, 0.42, 8]} />
            <meshStandardMaterial color="#6e785b" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function WorldStory() {
  return (
    <>
      <GrowingWall />
      <LivingWater />
      <VoiceOfferings />
      <BookResonance />
      <ReturningLife />
    </>
  );
}
