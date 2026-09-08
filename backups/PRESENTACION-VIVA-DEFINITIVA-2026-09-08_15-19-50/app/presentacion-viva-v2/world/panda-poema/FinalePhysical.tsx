"use client";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { MutableRefObject } from "react";

function Lantern({
  position,
  seed,
}: {
  position: [number, number, number];
  seed: number;
}) {
  const flower = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!flower.current) return;

    flower.current.rotation.z =
      Math.sin(
        clock.elapsedTime * 0.7 +
          seed * 0.8,
      ) * 0.035;
  });

  return (
    <group
      ref={flower}
      position={position}
    >
      <mesh
        position={[0, 0.35, 0]}
        castShadow
      >
        <cylinderGeometry
          args={[
            0.025,
            0.035,
            0.7,
            6,
          ]}
        />

        <meshStandardMaterial
          color="#72563b"
          roughness={1}
        />
      </mesh>

      <group position={[0, 0.78, 0]}>
        {Array.from({ length: 6 }).map(
          (_, i) => {
            const a =
              (i / 6) *
              Math.PI *
              2;

            return (
              <mesh
                key={i}
                position={[
                  Math.cos(a) * 0.13,
                  Math.sin(a) * 0.06,
                  Math.sin(a) * 0.035,
                ]}
                rotation={[
                  0,
                  0,
                  a,
                ]}
                scale={[
                  1.4,
                  0.65,
                  0.65,
                ]}
                castShadow
              >
                <sphereGeometry
                  args={[
                    0.12,
                    7,
                    5,
                  ]}
                />

                <meshStandardMaterial
                  color="#e7d4ac"
                  emissive="#b8762e"
                  emissiveIntensity={0.28}
                  roughness={1}
                />
              </mesh>
            );
          },
        )}

        <mesh castShadow>
          <sphereGeometry
            args={[0.11, 12, 8]}
          />

          <meshStandardMaterial
            color="#f4d391"
            emissive="#e59635"
            emissiveIntensity={3}
            roughness={0.65}
          />
        </mesh>

        <pointLight
          intensity={0.4}
          distance={1.8}
          color="#e7a14b"
        />
      </group>

      <mesh
        position={[0.08, 0.43, 0]}
        rotation={[0, 0, -0.55]}
        scale={[1.4, 0.65, 0.6]}
      >
        <sphereGeometry
          args={[0.08, 6, 4]}
        />

        <meshStandardMaterial
          color="#8e8965"
          roughness={1}
        />
      </mesh>
    </group>
  );
}

export function Scene09Physical() {
  const positions:
    [number, number, number][] = [
      [93.0, 0.02, 0.4],
      [94.2, 0.02, 0.48],
      [95.4, 0.02, 0.38],
      [96.6, 0.02, 0.5],
      [97.8, 0.02, 0.4],

      [93.6, 0.02, 1.0],
      [94.8, 0.02, 1.08],
      [96.0, 0.02, 0.98],
      [97.2, 0.02, 1.08],
      [98.4, 0.02, 0.98],
    ];

  return (
    <group>
      <mesh
        position={[95.7, 0.015, 0.7]}
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
        receiveShadow
      >
        <circleGeometry args={[3.7, 40]} />

        <meshStandardMaterial
          color="#cbb995"
          roughness={1}
        />
      </mesh>

      {positions.map(
        (position, i) => (
          <Lantern
            key={i}
            position={position}
            seed={i}
          />
        ),
      )}

      <pointLight
        position={[95.7, 3.0, 2]}
        intensity={2}
        distance={7}
        color="#ddb163"
      />
    </group>
  );
}

function Sprout({
  position,
  height,
  seed,
}: {
  position: [number, number, number];
  height: number;
  seed: number;
}) {
  const root = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!root.current) return;

    root.current.rotation.z =
      Math.sin(
        clock.elapsedTime * 0.55 +
          seed,
      ) * 0.035;
  });

  return (
    <group
      ref={root}
      position={position}
    >
      <mesh
        position={[0, height / 2, 0]}
        castShadow
      >
        <cylinderGeometry
          args={[
            0.014,
            0.021,
            height,
            5,
          ]}
        />

        <meshStandardMaterial
          color="#78694e"
          roughness={1}
        />
      </mesh>

      <mesh
        position={[
          0.06,
          height * 0.82,
          0,
        ]}
        rotation={[0, 0, -0.55]}
        scale={[1.5, 0.7, 0.8]}
        castShadow
      >
        <sphereGeometry
          args={[0.055, 6, 4]}
        />

        <meshStandardMaterial
          color="#aaa07a"
          roughness={1}
        />
      </mesh>

      <mesh
        position={[
          -0.055,
          height * 0.68,
          0,
        ]}
        rotation={[0, 0, 0.55]}
        scale={[1.35, 0.65, 0.8]}
        castShadow
      >
        <sphereGeometry
          args={[0.05, 6, 4]}
        />

        <meshStandardMaterial
          color="#c0b287"
          roughness={1}
        />
      </mesh>
    </group>
  );
}

export function Scene10Physical({
  progress,
}: {
  progress: MutableRefObject<number>;
}) {
  const sprouts = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    if (!sprouts.current) return;

    const growth =
      THREE.MathUtils.smoothstep(
        progress.current,
        0.83,
        0.91,
      );

    const target =
      0.05 +
      growth * 0.95;

    sprouts.current.scale.y =
      THREE.MathUtils.lerp(
        sprouts.current.scale.y,
        target,
        1 - Math.exp(-7 * dt),
      );
  });

  return (
    <group>
      <mesh
        position={[
          101.4,
          0.012,
          0.62,
        ]}
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
        receiveShadow
      >
        <planeGeometry args={[6.4, 2.8]} />

        <meshStandardMaterial
          color="#cfbd9b"
          roughness={1}
        />
      </mesh>

      <group
        ref={sprouts}
        position={[0, 0.02, 0]}
      >
        {Array.from({
          length: 50,
        }).map((_, i) => {
          const col = i % 10;
          const row =
            Math.floor(i / 10);

          const x =
            98.9 +
            col * 0.56;

          const z =
            0.12 +
            row * 0.3;

          const height =
            0.22 +
            ((i * 13) % 8) *
              0.028;

          return (
            <Sprout
              key={i}
              position={[x, 0, z]}
              height={height}
              seed={i}
            />
          );
        })}
      </group>

      <pointLight
        position={[
          101.5,
          2.5,
          2,
        ]}
        intensity={1.5}
        distance={6}
        color="#dbc08a"
      />
    </group>
  );
}
