"use client";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { MutableRefObject, useRef } from "react";
import { joseCurve } from "./curves";

type Props = {
  progress: MutableRefObject<number>;
};

export function Jose({ progress }: Props) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Mesh>(null);
  const rightLeg = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!root.current) return;

    const p = THREE.MathUtils.clamp(progress.current, 0, 1);
    const point = joseCurve.getPointAt(p);

    root.current.position.lerp(point, 0.1);

    const walkSpeed = 7.5;
    const stride = Math.sin(clock.elapsedTime * walkSpeed) * 0.28;
    const bob = Math.abs(Math.sin(clock.elapsedTime * walkSpeed)) * 0.045;

    if (body.current) {
      body.current.position.y = bob;
      body.current.rotation.z =
        Math.sin(clock.elapsedTime * walkSpeed * 0.5) * 0.018;
    }

    if (leftLeg.current) leftLeg.current.rotation.x = stride;
    if (rightLeg.current) rightLeg.current.rotation.x = -stride;
  });

  return (
    <group ref={root}>
      <group ref={body}>
        <mesh position={[0, 1.38, 0]} castShadow>
          <sphereGeometry args={[0.22, 16, 12]} />
          <meshStandardMaterial color="#cfa67e" roughness={1} />
        </mesh>

        <mesh position={[0, 0.88, 0]} castShadow>
          <boxGeometry args={[0.58, 0.8, 0.22]} />
          <meshStandardMaterial color="#eee5d4" roughness={1} />
        </mesh>

        <mesh position={[-0.38, 0.92, 0]} rotation={[0, 0, -0.1]} castShadow>
          <boxGeometry args={[0.14, 0.72, 0.13]} />
          <meshStandardMaterial color="#cfa67e" roughness={1} />
        </mesh>

        <mesh position={[0.38, 0.92, 0]} rotation={[0, 0, 0.1]} castShadow>
          <boxGeometry args={[0.14, 0.72, 0.13]} />
          <meshStandardMaterial color="#cfa67e" roughness={1} />
        </mesh>

        <mesh
          ref={leftLeg}
          position={[-0.16, 0.25, 0]}
          castShadow
        >
          <boxGeometry args={[0.16, 0.75, 0.16]} />
          <meshStandardMaterial color="#49433e" roughness={1} />
        </mesh>

        <mesh
          ref={rightLeg}
          position={[0.16, 0.25, 0]}
          castShadow
        >
          <boxGeometry args={[0.16, 0.75, 0.16]} />
          <meshStandardMaterial color="#49433e" roughness={1} />
        </mesh>
      </group>
    </group>
  );
}
