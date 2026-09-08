"use client";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { MutableRefObject } from "react";

type Props = {
  progress: MutableRefObject<number>;
};

export function LeavingMoment({ progress }: Props) {
  const jacket = useRef<THREE.Group>(null);
  const hat = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);

  useFrame((_, dt) => {
    const p = progress.current;

    const reveal = THREE.MathUtils.smoothstep(
      p,
      0.215,
      0.245,
    );

    if (jacket.current) {
      const s = THREE.MathUtils.lerp(
        jacket.current.scale.x,
        reveal,
        1 - Math.exp(-9 * dt),
      );

      jacket.current.scale.setScalar(s);

      jacket.current.rotation.z =
        THREE.MathUtils.lerp(
          jacket.current.rotation.z,
          -0.08 * reveal,
          1 - Math.exp(-7 * dt),
        );
    }

    if (hat.current) {
      const s = THREE.MathUtils.lerp(
        hat.current.scale.x,
        reveal,
        1 - Math.exp(-9 * dt),
      );

      hat.current.scale.setScalar(s);
    }

    if (light.current) {
      light.current.intensity =
        reveal * 1.8;
    }
  });

  return (
    <group position={[28, 0, 0.35]}>

      <group position={[0.8, 0, 0]}>
        <mesh
          position={[0, 1.35, 0]}
          castShadow
        >
          <cylinderGeometry
            args={[0.06, 0.075, 2.7, 10]}
          />
          <meshStandardMaterial
            color="#66503e"
            roughness={1}
          />
        </mesh>

        <mesh
          position={[0, 2.62, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry
            args={[0.045, 0.045, 1.25, 10]}
          />
          <meshStandardMaterial
            color="#66503e"
            roughness={1}
          />
        </mesh>

        <mesh
          position={[-0.4, 2.38, 0]}
          rotation={[0, 0, -0.65]}
        >
          <cylinderGeometry
            args={[0.035, 0.035, 0.55, 8]}
          />
          <meshStandardMaterial
            color="#66503e"
            roughness={1}
          />
        </mesh>

        <mesh
          position={[0.4, 2.38, 0]}
          rotation={[0, 0, 0.65]}
        >
          <cylinderGeometry
            args={[0.035, 0.035, 0.55, 8]}
          />
          <meshStandardMaterial
            color="#66503e"
            roughness={1}
          />
        </mesh>
      </group>

      <group
        ref={jacket}
        position={[0.33, 1.72, 0.08]}
        scale={0}
      >
        <mesh castShadow>
          <boxGeometry args={[0.85, 1.15, 0.18]} />
          <meshStandardMaterial
            color="#f0ebe2"
            roughness={1}
          />
        </mesh>

        <mesh
          position={[-0.55, 0.03, 0]}
          rotation={[0, 0, -0.18]}
          castShadow
        >
          <boxGeometry args={[0.3, 0.95, 0.16]} />
          <meshStandardMaterial
            color="#eee8de"
            roughness={1}
          />
        </mesh>

        <mesh
          position={[0.55, 0.03, 0]}
          rotation={[0, 0, 0.18]}
          castShadow
        >
          <boxGeometry args={[0.3, 0.95, 0.16]} />
          <meshStandardMaterial
            color="#eee8de"
            roughness={1}
          />
        </mesh>

        <mesh position={[0, 0.15, 0.11]}>
          <planeGeometry args={[0.55, 0.68]} />
          <meshStandardMaterial
            color="#f7f3eb"
            roughness={1}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      <group
        ref={hat}
        position={[-0.4, 2.55, 0.1]}
        scale={0}
      >
        <mesh>
          <cylinderGeometry
            args={[0.18, 0.2, 0.14, 14]}
          />
          <meshStandardMaterial
            color="#efeadf"
            roughness={1}
          />
        </mesh>

        <mesh
          position={[0, 0.12, 0]}
          scale={[1.15, 0.8, 0.8]}
        >
          <sphereGeometry args={[0.2, 12, 8]} />
          <meshStandardMaterial
            color="#f3eee5"
            roughness={1}
          />
        </mesh>
      </group>

      <pointLight
        ref={light}
        position={[0, 2.0, 2]}
        color="#e7b76f"
        distance={5}
        intensity={0}
      />

    </group>
  );
}
