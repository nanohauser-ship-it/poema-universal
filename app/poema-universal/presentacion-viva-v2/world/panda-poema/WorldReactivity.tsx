"use client";

import {
  useRef,
} from "react";

import type {
  MutableRefObject,
} from "react";

import {
  useFrame,
} from "@react-three/fiber";

import * as THREE from "three";

function clamp01(
  value: number,
) {
  return THREE.MathUtils.clamp(
    value,
    0,
    1,
  );
}

function windowEnvelope(
  progress: number,
  start: number,
  peakIn: number,
  peakOut: number,
  end: number,
) {
  if (
    progress <= start ||
    progress >= end
  ) {
    return 0;
  }

  if (
    progress < peakIn
  ) {
    return clamp01(
      (
        progress -
        start
      ) /
        (
          peakIn -
          start
        ),
    );
  }

  if (
    progress <= peakOut
  ) {
    return 1;
  }

  return (
    1 -
    clamp01(
      (
        progress -
        peakOut
      ) /
        (
          end -
          peakOut
        ),
    )
  );
}

function KitchenAwakening({
  progress,
}: {
  progress: MutableRefObject<number>;
}) {
  const light =
    useRef<THREE.PointLight>(
      null,
    );

  const halo =
    useRef<THREE.Mesh>(
      null,
    );

  useFrame(
    ({ clock }) => {
      const p =
        progress.current;

      const amount =
        windowEnvelope(
          p,
          0.07,
          0.11,
          0.20,
          0.27,
        );

      const breath =
        0.92 +
        Math.sin(
          clock.elapsedTime *
            2.2,
        ) *
          0.08;

      if (light.current) {
        light.current.intensity =
          amount *
          2.3 *
          breath;
      }

      if (halo.current) {
        halo.current.visible =
          amount > 0.01;

        const scale =
          0.8 +
          amount *
            0.35 +
          Math.sin(
            clock.elapsedTime *
              2,
          ) *
            0.025;

        halo.current.scale.set(
          scale,
          scale,
          scale,
        );

        const material =
          halo.current
            .material as THREE.MeshBasicMaterial;

        material.opacity =
          amount * 0.16;
      }
    },
  );

  return (
    <group
      position={[
        20.8,
        2.25,
        1.0,
      ]}
    >
      <pointLight
        ref={light}
        color="#e6ad62"
        intensity={0}
        distance={5.5}
      />

      <mesh
        ref={halo}
        rotation={[
          Math.PI / 2,
          0,
          0,
        ]}
      >
        <ringGeometry
          args={[
            0.52,
            0.68,
            32,
          ]}
        />

        <meshBasicMaterial
          color="#e8bb70"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

const PAGE_DATA = [
  {
    x: 44.8,
    y: 1.45,
    z: 0.45,
    phase: 0.1,
  },
  {
    x: 45.8,
    y: 1.72,
    z: 0.15,
    phase: 1.2,
  },
  {
    x: 46.9,
    y: 1.38,
    z: 0.58,
    phase: 2.1,
  },
  {
    x: 48.1,
    y: 1.82,
    z: 0.22,
    phase: 3.0,
  },
  {
    x: 49.0,
    y: 1.52,
    z: 0.48,
    phase: 4.0,
  },
];

function LivingPages({
  progress,
}: {
  progress: MutableRefObject<number>;
}) {
  const refs =
    useRef<
      Array<
        THREE.Group | null
      >
    >([]);

  useFrame(
    ({ clock }) => {
      const p =
        progress.current;

      const amount =
        windowEnvelope(
          p,
          0.285,
          0.33,
          0.44,
          0.515,
        );

      refs.current.forEach(
        (
          group,
          index,
        ) => {
          if (!group) return;

          const data =
            PAGE_DATA[index];

          group.visible =
            amount > 0.005;

          if (
            !group.visible
          ) {
            return;
          }

          const wave =
            Math.sin(
              clock.elapsedTime *
                1.7 +
                data.phase,
            );

          group.position.y =
            data.y +
            wave *
              0.10 *
              amount;

          group.rotation.x =
            0.15 +
            wave *
              0.08 *
              amount;

          group.rotation.z =
            wave *
            0.09 *
            amount;

          group.rotation.y =
            Math.sin(
              clock.elapsedTime *
                1.15 +
                data.phase,
            ) *
            0.08 *
            amount;

          const scale =
            0.72 +
            amount *
              0.28;

          group.scale.setScalar(
            scale,
          );
        },
      );
    },
  );

  return (
    <>
      {PAGE_DATA.map(
        (
          page,
          index,
        ) => (
          <group
            key={index}
            ref={(node) => {
              refs.current[index] =
                node;
            }}
            position={[
              page.x,
              page.y,
              page.z,
            ]}
          >
            <mesh>
              <planeGeometry
                args={[
                  0.56,
                  0.76,
                ]}
              />

              <meshStandardMaterial
                color={
                  index % 2 === 0
                    ? "#ded0b4"
                    : "#e9ddc5"
                }
                roughness={1}
                side={
                  THREE.DoubleSide
                }
              />
            </mesh>

            <mesh
              position={[
                0,
                0,
                0.006,
              ]}
            >
              <planeGeometry
                args={[
                  0.34,
                  0.012,
                ]}
              />

              <meshBasicMaterial
                color="#8d765b"
                transparent
                opacity={0.42}
              />
            </mesh>
          </group>
        ),
      )}
    </>
  );
}

const THREAD_LIGHTS = [
  {
    x: 87.8,
    z: 0.58,
    phase: 0,
  },
  {
    x: 93.5,
    z: 0.50,
    phase: 1.4,
  },
  {
    x: 99.5,
    z: 0.62,
    phase: 2.8,
  },
];

function ThreadPulse({
  progress,
}: {
  progress: MutableRefObject<number>;
}) {
  const refs =
    useRef<
      Array<
        THREE.PointLight | null
      >
    >([]);

  useFrame(
    ({ clock }) => {
      const p =
        progress.current;

      const amount =
        windowEnvelope(
          p,
          0.655,
          0.71,
          0.91,
          0.975,
        );

      refs.current.forEach(
        (
          light,
          index,
        ) => {
          if (!light) return;

          const pulse =
            0.74 +
            Math.sin(
              clock.elapsedTime *
                3.0 +
                THREAD_LIGHTS[
                  index
                ].phase,
            ) *
              0.26;

          light.intensity =
            amount *
            pulse *
            0.85;
        },
      );
    },
  );

  return (
    <>
      {THREAD_LIGHTS.map(
        (
          item,
          index,
        ) => (
          <pointLight
            key={index}
            ref={(node) => {
              refs.current[index] =
                node;
            }}
            position={[
              item.x,
              0.75,
              item.z,
            ]}
            color="#a8443e"
            intensity={0}
            distance={3.2}
          />
        ),
      )}
    </>
  );
}

function TreeBreath({
  progress,
}: {
  progress: MutableRefObject<number>;
}) {
  const warmLight =
    useRef<THREE.PointLight>(
      null,
    );

  const rootLight =
    useRef<THREE.PointLight>(
      null,
    );

  const aura =
    useRef<THREE.Mesh>(
      null,
    );

  useFrame(
    ({ clock }) => {
      const p =
        progress.current;

      const reveal =
        clamp01(
          (
            p -
            0.875
          ) /
            0.095,
        );

      const slowPulse =
        0.86 +
        Math.sin(
          clock.elapsedTime *
            1.65,
        ) *
          0.14;

      if (
        warmLight.current
      ) {
        warmLight.current.intensity =
          reveal *
          (
            2.4 +
            slowPulse *
              1.15
          );
      }

      if (
        rootLight.current
      ) {
        rootLight.current.intensity =
          reveal *
          (
            0.7 +
            slowPulse *
              0.45
          );
      }

      if (aura.current) {
        aura.current.visible =
          reveal > 0.01;

        const scale =
          1 +
          reveal *
            0.16 +
          Math.sin(
            clock.elapsedTime *
              1.65,
          ) *
            0.018;

        aura.current.scale.set(
          scale,
          scale,
          scale,
        );

        const material =
          aura.current
            .material as THREE.MeshBasicMaterial;

        material.opacity =
          reveal *
          (
            0.045 +
            slowPulse *
              0.025
          );
      }
    },
  );

  return (
    <group>
      <pointLight
        ref={warmLight}
        position={[
          105.5,
          4.0,
          1.0,
        ]}
        color="#f2d69a"
        intensity={0}
        distance={8}
      />

      <pointLight
        ref={rootLight}
        position={[
          105.5,
          0.55,
          0.7,
        ]}
        color="#b64f46"
        intensity={0}
        distance={4}
      />

      <mesh
        ref={aura}
        position={[
          105.5,
          3.2,
          -0.45,
        ]}
      >
        <circleGeometry
          args={[
            3.0,
            48,
          ]}
        />

        <meshBasicMaterial
          color="#f3dba8"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export function WorldReactivity({
  progress,
}: {
  progress: MutableRefObject<number>;
}) {
  return (
    <>
      <KitchenAwakening
        progress={progress}
      />

      <LivingPages
        progress={progress}
      />

      <ThreadPulse
        progress={progress}
      />

      <TreeBreath
        progress={progress}
      />
    </>
  );
}
