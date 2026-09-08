"use client";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { MutableRefObject } from "react";

type Props = {
  progress: MutableRefObject<number>;
};

type V3 = [number, number, number];

const MAILBOX: V3 = [
  72.75,
  1.34,
  0.48,
];

const ARRIVALS = [
  0.625,
  0.632,
  0.638,
  0.644,
  0.650,
  0.656,
  0.662,
  0.668,
  0.674,
  0.680,
];

const STARTS: V3[] = [
  [77.2, 3.65, 2.10],
  [77.8, 2.75, 1.65],
  [78.5, 3.95, 1.25],
  [79.0, 2.30, 2.30],
  [79.5, 3.25, 1.85],

  [78.0, 4.20, 2.55],
  [78.8, 2.85, 1.10],
  [79.6, 3.75, 2.15],
  [80.0, 2.45, 2.65],
  [80.4, 3.50, 1.45],
];

function smooth01(
  value: number,
  start: number,
  end: number,
) {
  return THREE.MathUtils.smoothstep(
    value,
    start,
    end,
  );
}

function ReplyLetter({
  progress,
  index,
  startPosition,
  arrival,
}: {
  progress: MutableRefObject<number>;
  index: number;
  startPosition: V3;
  arrival: number;
}) {
  const root = useRef<THREE.Group>(null);

  const startTime =
    index === 0
      ? arrival - 0.075
      : arrival - 0.050 - (index % 3) * 0.003;

  const curve = useMemo(() => {
    const start = new THREE.Vector3(
      ...startPosition,
    );

    const end = new THREE.Vector3(
      ...MAILBOX,
    );

    const middle1 =
      start.clone().lerp(end, 0.33);

    const middle2 =
      start.clone().lerp(end, 0.69);

    middle1.y +=
      0.65 +
      (index % 3) * 0.13;

    middle1.z +=
      Math.sin(index * 1.7) * 0.55;

    middle2.y +=
      0.28 +
      (index % 2) * 0.15;

    middle2.z +=
      Math.cos(index * 1.31) * 0.32;

    return new THREE.CatmullRomCurve3(
      [
        start,
        middle1,
        middle2,
        end,
      ],
      false,
      "centripetal",
    );
  }, [
    startPosition,
    index,
  ]);

  useFrame(({ clock }) => {
    if (!root.current) return;

    const p = progress.current;

    const local =
      smooth01(
        p,
        startTime,
        arrival,
      );

    const visible =
      p >= startTime - 0.008 &&
      p <= arrival + (index === 0 ? 0.030 : 0.018);

    root.current.visible = visible;

    if (!visible) return;

    const point =
      curve.getPointAt(
        THREE.MathUtils.clamp(
          local,
          0,
          1,
        ),
      );

    root.current.position.copy(point);

    const flutter =
      Math.sin(
        clock.elapsedTime * 12 +
          index * 2.4,
      );

    root.current.rotation.x =
      flutter * 0.12;

    root.current.rotation.y =
      Math.sin(
        clock.elapsedTime * 7 +
          index,
      ) * 0.16;

    root.current.rotation.z =
      flutter * 0.18 +
      index * 0.035;

    const disappear =
      smooth01(
        p,
        arrival + (index === 0 ? 0.010 : 0.004),
        arrival + (index === 0 ? 0.030 : 0.018),
      );

    const baseScale =
      index === 0 ? 1.45 : 1.12;

    const scale =
      THREE.MathUtils.lerp(
        baseScale,
        0.18,
        disappear,
      );

    root.current.scale.setScalar(scale);
  });

  return (
    <group ref={root}>
      <mesh castShadow>
        <boxGeometry
          args={[
            0.62,
            0.44,
            0.03,
          ]}
        />

        <meshStandardMaterial
          color={
            index % 3 === 0
              ? "#e4d1ac"
              : index % 3 === 1
                ? "#d8c09b"
                : "#ead9b8"
          }
          roughness={1}
        />
      </mesh>

      <mesh
        position={[
          0,
          0,
          0.017,
        ]}
        rotation={[
          0,
          0,
          Math.PI / 4,
        ]}
      >
        <planeGeometry
          args={[
            0.29,
            0.29,
          ]}
        />

        <meshStandardMaterial
          color="#c6ad86"
          roughness={1}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh
        position={[
          0.15,
          0.105,
          0.025,
        ]}
      >
        <circleGeometry
          args={[
            0.045,
            12,
          ]}
        />

        <meshStandardMaterial
          color="#9b493c"
          roughness={0.9}
        />
      </mesh>

      <mesh
        position={[
          -0.08,
          -0.03,
          0.026,
        ]}
      >
        <boxGeometry
          args={[
            0.18,
            0.012,
            0.006,
          ]}
        />

        <meshStandardMaterial
          color="#72614d"
          roughness={1}
        />
      </mesh>

      <mesh
        position={[
          -0.04,
          -0.075,
          0.026,
        ]}
      >
        <boxGeometry
          args={[
            0.24,
            0.01,
            0.006,
          ]}
        />

        <meshStandardMaterial
          color="#8a765d"
          roughness={1}
        />
      </mesh>
    </group>
  );
}

function MailboxPulse({
  progress,
}: Props) {
  const light =
    useRef<THREE.PointLight>(null);

  const halo =
    useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const p = progress.current;

    let energy = 0;

    for (const arrival of ARRIVALS) {
      const distance =
        (p - arrival) / 0.008;

      energy +=
        Math.exp(
          -(distance * distance),
        );
    }

    energy =
      THREE.MathUtils.clamp(
        energy,
        0,
        1.5,
      );

    if (light.current) {
      light.current.intensity =
        0.15 +
        energy * 4.2;
    }

    if (halo.current) {
      const pulse =
        1 +
        energy * 1.5 +
        Math.sin(
          clock.elapsedTime * 2,
        ) * 0.02;

      halo.current.scale.setScalar(
        pulse,
      );

      const material =
        halo.current
          .material as THREE.MeshBasicMaterial;

      material.opacity =
        0.02 +
        energy * 0.18;
    }
  });

  return (
    <group
      position={[
        MAILBOX[0],
        MAILBOX[1],
        MAILBOX[2] - 0.08,
      ]}
    >
      <pointLight
        ref={light}
        color="#d78c48"
        intensity={0}
        distance={3.6}
      />

      <mesh ref={halo}>
        <sphereGeometry
          args={[
            0.34,
            16,
            10,
          ]}
        />

        <meshBasicMaterial
          color="#dca25f"
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

const CONSTELLATION: V3[] = [
  [85.0, 2.2, 0.15],
  [85.7, 2.85, 0.05],
  [86.5, 2.35, 0.28],
  [87.25, 3.1, 0.08],
  [88.0, 2.48, 0.22],

  [88.75, 3.18, 0.02],
  [89.45, 2.58, 0.24],
  [90.1, 3.0, 0.10],
  [90.75, 2.38, 0.28],
  [91.35, 2.82, 0.04],
];

function VoiceNode({
  progress,
  index,
}: {
  progress: MutableRefObject<number>;
  index: number;
}) {
  const root =
    useRef<THREE.Group>(null);

  const reveal =
    ARRIVALS[index] + 0.012;

  useFrame(({ clock }) => {
    if (!root.current) return;

    const t =
      smooth01(
        progress.current,
        reveal,
        reveal + 0.025,
      );

    root.current.visible =
      t > 0.001;

    const breathing =
      1 +
      Math.sin(
        clock.elapsedTime * 1.8 +
          index,
      ) *
        0.07 *
        t;

    root.current.scale.setScalar(
      THREE.MathUtils.lerp(
        0.05,
        1,
        t,
      ) * breathing,
    );
  });

  return (
    <group
      ref={root}
      position={CONSTELLATION[index]}
    >
      <mesh>
        <sphereGeometry
          args={[
            0.09,
            12,
            8,
          ]}
        />

        <meshStandardMaterial
          color="#e7ce98"
          emissive="#c67b38"
          emissiveIntensity={2.2}
          roughness={0.7}
        />
      </mesh>

      <pointLight
        intensity={0.26}
        distance={1.6}
        color="#dc9d50"
      />
    </group>
  );
}

function Connection({
  progress,
  a,
  b,
  index,
}: {
  progress: MutableRefObject<number>;
  a: V3;
  b: V3;
  index: number;
}) {
  const root =
    useRef<THREE.Group>(null);

  const data =
    useMemo(() => {
      const start =
        new THREE.Vector3(...a);

      const end =
        new THREE.Vector3(...b);

      const midpoint =
        start
          .clone()
          .add(end)
          .multiplyScalar(0.5);

      const direction =
        end.clone().sub(start);

      const length =
        direction.length();

      const quaternion =
        new THREE.Quaternion();

      quaternion.setFromUnitVectors(
        new THREE.Vector3(
          0,
          1,
          0,
        ),
        direction
          .clone()
          .normalize(),
      );

      return {
        midpoint,
        length,
        quaternion,
      };
    }, [
      a,
      b,
    ]);

  const reveal =
    ARRIVALS[
      Math.min(
        index + 1,
        ARRIVALS.length - 1,
      )
    ] + 0.02;

  useFrame(() => {
    if (!root.current) return;

    const t =
      smooth01(
        progress.current,
        reveal,
        reveal + 0.025,
      );

    root.current.visible =
      t > 0.001;

    root.current.scale.y =
      THREE.MathUtils.lerp(
        0.01,
        1,
        t,
      );
  });

  return (
    <group
      ref={root}
      position={data.midpoint}
      quaternion={data.quaternion}
    >
      <mesh>
        <cylinderGeometry
          args={[
            0.009,
            0.009,
            data.length,
            5,
          ]}
        />

        <meshStandardMaterial
          color="#a64a3b"
          emissive="#6c211d"
          emissiveIntensity={0.5}
          roughness={1}
        />
      </mesh>
    </group>
  );
}

function ReplyConstellation({
  progress,
}: Props) {
  const root =
    useRef<THREE.Group>(null);

  useFrame(() => {
    if (!root.current) return;

    const p =
      progress.current;

    root.current.visible =
      p > 0.60 &&
      p < 0.86;
  });

  return (
    <group ref={root}>
      {CONSTELLATION.map(
        (_, index) => (
          <VoiceNode
            key={index}
            progress={progress}
            index={index}
          />
        ),
      )}

      {CONSTELLATION.slice(
        0,
        -1,
      ).map((point, index) => (
        <Connection
          key={index}
          progress={progress}
          a={point}
          b={
            CONSTELLATION[
              index + 1
            ]
          }
          index={index}
        />
      ))}
    </group>
  );
}

function ReplyCounter({
  progress,
}: Props) {
  const material =
    useRef<THREE.MeshBasicMaterial>(
      null,
    );

  const [
    texture,
    setTexture,
  ] =
    useState<THREE.CanvasTexture | null>(
      null,
    );

  useEffect(() => {
    const canvas =
      document.createElement("canvas");

    canvas.width = 1024;
    canvas.height = 320;

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height,
    );

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle =
      "rgba(71,54,42,0.96)";

    ctx.font =
      '600 132px Georgia, "Times New Roman", serif';

    ctx.fillText(
      "10 / 60",
      512,
      142,
    );

    ctx.fillStyle =
      "rgba(126,78,59,0.72)";

    ctx.font =
      '38px Georgia, "Times New Roman", serif';

    ctx.fillText(
      "VOCES",
      512,
      250,
    );

    const nextTexture =
      new THREE.CanvasTexture(
        canvas,
      );

    nextTexture.colorSpace =
      THREE.SRGBColorSpace;

    nextTexture.needsUpdate = true;

    setTexture(nextTexture);

    return () => {
      nextTexture.dispose();
    };
  }, []);

  useFrame(() => {
    if (!material.current) return;

    const p =
      progress.current;

    const enter =
      smooth01(
        p,
        0.742,
        0.765,
      );

    const leave =
      1 -
      smooth01(
        p,
        0.815,
        0.85,
      );

    material.current.opacity =
      enter * leave;
  });

  if (!texture) return null;

  return (
    <mesh
      position={[
        88.2,
        3.8,
        0.22,
      ]}
    >
      <planeGeometry
        args={[
          2.7,
          0.84,
        ]}
      />

      <meshBasicMaterial
        ref={material}
        map={texture}
        transparent
        opacity={0}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

export function WorldReplies({
  progress,
}: Props) {
  const root =
    useRef<THREE.Group>(null);

  useFrame(() => {
    if (!root.current) return;

    const p =
      progress.current;

    root.current.visible =
      p > 0.535 &&
      p < 0.82;
  });

  return (
    <group ref={root}>
      {STARTS.map(
        (
          startPosition,
          index,
        ) => (
          <ReplyLetter
            key={index}
            progress={progress}
            index={index}
            startPosition={
              startPosition
            }
            arrival={
              ARRIVALS[index]
            }
          />
        ),
      )}

      <MailboxPulse
        progress={progress}
      />

      <ReplyConstellation
        progress={progress}
      />

      <ReplyCounter
        progress={progress}
      />
    </group>
  );
}
