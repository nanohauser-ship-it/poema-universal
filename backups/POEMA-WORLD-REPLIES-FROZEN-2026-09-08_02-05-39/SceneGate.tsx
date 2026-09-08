"use client";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type {
  MutableRefObject,
  ReactNode,
} from "react";

type Props = {
  progress: MutableRefObject<number>;
  start: number;
  end: number;
  children: ReactNode;
};

export function SceneGate({
  progress,
  start,
  end,
  children,
}: Props) {
  const root = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    if (!root.current) return;

    const p = progress.current;
    const fade = 0.025;

    const enter = THREE.MathUtils.smoothstep(
      p,
      start,
      start + fade,
    );

    const leave =
      1 -
      THREE.MathUtils.smoothstep(
        p,
        end - fade,
        end,
      );

    const presence = THREE.MathUtils.clamp(
      enter * leave,
      0,
      1,
    );

    root.current.visible =
      presence > 0.002;

    root.current.position.z =
      THREE.MathUtils.lerp(
        root.current.position.z,
        THREE.MathUtils.lerp(
          -0.22,
          0,
          presence,
        ),
        1 - Math.exp(-8 * dt),
      );
  });

  return (
    <group ref={root}>
      {children}
    </group>
  );
}
