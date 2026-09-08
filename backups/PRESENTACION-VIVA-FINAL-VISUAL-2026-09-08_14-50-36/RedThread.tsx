"use client";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  useMemo,
  useRef,
} from "react";
import type { MutableRefObject } from "react";

type Props = {
  progress: MutableRefObject<number>;
};

type NodeProps = {
  position: [number, number, number];
  delay: number;
  progress: MutableRefObject<number>;
};

function ThreadNode({
  position,
  delay,
  progress,
}: NodeProps) {
  const root = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!root.current) return;

    const p = progress.current;

    const presence = THREE.MathUtils.smoothstep(
      p,
      delay,
      delay + 0.035,
    );

    root.current.visible = presence > 0.001;

    const pulse =
      1 +
      Math.sin(
        clock.elapsedTime * 2.2 +
        delay * 20,
      ) *
        0.12 *
        presence;

    const s =
      THREE.MathUtils.lerp(
        0.15,
        1,
        presence,
      ) * pulse;

    root.current.scale.setScalar(s);
  });

  return (
    <group
      ref={root}
      position={position}
    >
      <mesh>
        <sphereGeometry args={[0.095, 16, 12]} />

        <meshStandardMaterial
          color="#b74335"
          emissive="#8e211d"
          emissiveIntensity={1.1}
          roughness={0.65}
        />
      </mesh>

      <pointLight
        intensity={0.55}
        distance={1.6}
        color="#d35a45"
      />
    </group>
  );
}

function RootBranch({
  points,
  progress,
  start,
}: {
  points: THREE.Vector3[];
  progress: MutableRefObject<number>;
  start: number;
}) {
  const root = useRef<THREE.Group>(null);

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        points,
        false,
        "centripetal",
      ),
    [points],
  );

  useFrame(() => {
    if (!root.current) return;

    const t = THREE.MathUtils.smoothstep(
      progress.current,
      start,
      start + 0.035,
    );

    root.current.visible = t > 0.001;

    root.current.scale.setScalar(
      THREE.MathUtils.lerp(
        0.08,
        1,
        t,
      ),
    );
  });

  return (
    <group ref={root}>
      <mesh>
        <tubeGeometry
          args={[
            curve,
            32,
            0.022,
            5,
            false,
          ]}
        />

        <meshStandardMaterial
          color="#8f382e"
          emissive="#6f201b"
          emissiveIntensity={0.35}
          roughness={0.85}
        />
      </mesh>
    </group>
  );
}

export function RedThread({
  progress,
}: Props) {
  const root = useRef<THREE.Group>(null);
  const tube = useRef<THREE.TubeGeometry>(null);

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(
            87.8,
            1.25,
            0.72,
          ),
          new THREE.Vector3(
            90.3,
            1.12,
            0.68,
          ),
          new THREE.Vector3(
            93.0,
            0.82,
            0.7,
          ),
          new THREE.Vector3(
            96.0,
            0.76,
            0.68,
          ),
          new THREE.Vector3(
            98.8,
            0.42,
            0.62,
          ),
          new THREE.Vector3(
            101.4,
            0.25,
            0.56,
          ),
          new THREE.Vector3(
            103.8,
            0.2,
            0.48,
          ),
          new THREE.Vector3(
            106.2,
            0.16,
            0.34,
          ),
        ],
        false,
        "centripetal",
      ),
    [],
  );

  useFrame(({ clock }) => {
    const p = progress.current;

    const reveal = THREE.MathUtils.smoothstep(
      p,
      0.665,
      0.955,
    );

    if (root.current) {
      root.current.visible = reveal > 0.001;

      root.current.position.y =
        Math.sin(clock.elapsedTime * 0.65) *
        0.012;
    }

    if (tube.current) {
      const total =
        tube.current.index?.count ?? 0;

      const count =
        Math.floor(
          (total * reveal) / 3,
        ) * 3;

      tube.current.setDrawRange(
        0,
        count,
      );
    }
  });

  const roots = useMemo(
    () => [
      [
        new THREE.Vector3(
          106.15,
          0.15,
          0.34,
        ),
        new THREE.Vector3(
          105.7,
          0.08,
          0.62,
        ),
        new THREE.Vector3(
          104.95,
          0.04,
          0.83,
        ),
      ],

      [
        new THREE.Vector3(
          106.15,
          0.15,
          0.34,
        ),
        new THREE.Vector3(
          105.8,
          0.07,
          0.2,
        ),
        new THREE.Vector3(
          105.2,
          0.04,
          0.02,
        ),
      ],

      [
        new THREE.Vector3(
          106.15,
          0.15,
          0.34,
        ),
        new THREE.Vector3(
          106.65,
          0.07,
          0.62,
        ),
        new THREE.Vector3(
          107.35,
          0.04,
          0.82,
        ),
      ],

      [
        new THREE.Vector3(
          106.15,
          0.15,
          0.34,
        ),
        new THREE.Vector3(
          106.75,
          0.07,
          0.18,
        ),
        new THREE.Vector3(
          107.55,
          0.04,
          0.02,
        ),
      ],
    ],
    [],
  );

  return (
    <>
      <group ref={root}>
        <mesh>
          <tubeGeometry
            ref={tube}
            args={[
              curve,
              150,
              0.034,
              6,
              false,
            ]}
          />

          <meshStandardMaterial
            color="#a8382f"
            emissive="#731c19"
            emissiveIntensity={0.55}
            roughness={0.72}
          />
        </mesh>

        <ThreadNode
          progress={progress}
          delay={0.69}
          position={[88.0, 1.25, 0.72]}
        />

        <ThreadNode
          progress={progress}
          delay={0.77}
          position={[96.0, 0.78, 0.68]}
        />

        <ThreadNode
          progress={progress}
          delay={0.84}
          position={[101.4, 0.27, 0.56]}
        />

        <ThreadNode
          progress={progress}
          delay={0.915}
          position={[106.15, 0.17, 0.34]}
        />
      </group>

      {roots.map((points, index) => (
        <RootBranch
          key={index}
          points={points}
          progress={progress}
          start={
            0.92 +
            index * 0.008
          }
        />
      ))}
    </>
  );
}
