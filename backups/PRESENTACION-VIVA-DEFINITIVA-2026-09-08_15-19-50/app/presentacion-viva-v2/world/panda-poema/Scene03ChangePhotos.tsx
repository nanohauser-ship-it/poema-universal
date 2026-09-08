"use client";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { MutableRefObject } from "react";
import { PaperObject } from "./PaperObject";

const BASE =
  "/poema-universal/presentacion-viva/assets/story-selected";

type Props = {
  progress: MutableRefObject<number>;
};

function FlyingPages() {
  const root = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!root.current) return;

    root.current.rotation.z =
      Math.sin(clock.elapsedTime * 0.45) * 0.04;

    root.current.position.y =
      Math.sin(clock.elapsedTime * 0.7) * 0.12;
  });

  return (
    <group ref={root}>
      {[
        [30.5, 2.5, 0.25],
        [32.0, 3.1, 0.05],
        [34.4, 2.65, 0.4],
        [36.1, 3.2, 0.15],
        [38.0, 2.55, 0.35],
      ].map((p, i) => (
        <mesh
          key={i}
          position={p as [number, number, number]}
          rotation={[
            0,
            (i - 2) * 0.08,
            (i - 2) * 0.12,
          ]}
        >
          <planeGeometry args={[0.48, 0.68]} />
          <meshStandardMaterial
            color={i % 2 ? "#e8dcc7" : "#f0e7d7"}
            roughness={1}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

export function Scene03ChangePhotos({
  progress,
}: Props) {
  const plane = useRef<THREE.Group>(null);
  const bike = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    const p = THREE.MathUtils.clamp(
      progress.current,
      0,
      1,
    );

    const bikeT = THREE.MathUtils.smoothstep(
      p,
      0.235,
      0.305,
    );

    if (bike.current) {
      bike.current.position.x = THREE.MathUtils.lerp(
        bike.current.position.x,
        THREE.MathUtils.lerp(28.0, 31.8, bikeT),
        1 - Math.exp(-7 * dt),
      );
    }

    const planeT = THREE.MathUtils.smoothstep(
      p,
      0.27,
      0.38,
    );

    if (plane.current) {
      plane.current.position.x = THREE.MathUtils.lerp(
        31.5,
        39.0,
        planeT,
      );

      plane.current.position.y =
        2.0 +
        Math.sin(planeT * Math.PI) * 2.1;

      plane.current.rotation.z =
        -0.18 + planeT * 0.35;
    }
  });

  return (
    <group>
      <group ref={bike}>
        <PaperObject
          src={`${BASE}/03-bike.png`}
          position={[0, 1.0, 0.35]}
          rotation={[0, 0.02, 0]}
          width={3.4}
        />
      </group>

      <PaperObject
        src={`${BASE}/03-suitcase.png`}
        position={[33.6, 0.9, 0.45]}
        rotation={[0, -0.02, -0.04]}
        width={2.0}
      />

      <PaperObject
        src={`${BASE}/03-trunk.png`}
        position={[37.3, 0.95, 0.15]}
        rotation={[0, 0.03, 0.025]}
        width={2.5}
      />

      <group ref={plane}>
        <PaperObject
          src={`${BASE}/03-plane.png`}
          position={[0, 0, 0.55]}
          rotation={[0, 0, -0.08]}
          width={1.9}
        />
      </group>

      <FlyingPages />
    </group>
  );
}
