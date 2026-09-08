"use client";

/* FIRST REPLY DIRECTOR PASS */

import {
  useMemo,
  useRef,
} from "react";

import type {
  MutableRefObject,
} from "react";

import {
  useFrame,
} from "@react-three/fiber";

import * as THREE from "three";

const MAILBOX =
  new THREE.Vector3(
    72.75,
    1.34,
    0.48,
  );

const ARRIVALS = [
  0.700,

  // después de la primera respuesta
  // llegan las otras nueve
  0.750,
  0.757,
  0.764,
  0.771,
  0.778,
  0.785,
  0.792,
  0.799,
  0.806,
];

const STARTS = [
  new THREE.Vector3(
    77.2,
    3.65,
    2.10,
  ),
  new THREE.Vector3(
    77.8,
    2.75,
    1.65,
  ),
  new THREE.Vector3(
    78.5,
    3.95,
    1.25,
  ),
  new THREE.Vector3(
    79.0,
    2.30,
    2.30,
  ),
  new THREE.Vector3(
    79.5,
    3.25,
    1.85,
  ),
  new THREE.Vector3(
    78.0,
    4.20,
    2.55,
  ),
  new THREE.Vector3(
    78.8,
    2.85,
    1.10,
  ),
  new THREE.Vector3(
    79.6,
    3.75,
    2.15,
  ),
  new THREE.Vector3(
    80.0,
    2.45,
    2.65,
  ),
  new THREE.Vector3(
    80.4,
    3.50,
    1.45,
  ),
];

function clamp01(
  value: number,
) {
  return THREE.MathUtils.clamp(
    value,
    0,
    1,
  );
}

function Envelope({
  index,
}: {
  index: number;
}) {
  const warm =
    index % 3 === 0;

  return (
    <group>
      <mesh castShadow>
        <boxGeometry
          args={[
            0.62,
            0.42,
            0.055,
          ]}
        />
        <meshStandardMaterial
          color={
            warm
              ? "#d5b783"
              : "#e1d4bb"
          }
          roughness={0.96}
        />
      </mesh>

      <mesh
        position={[
          0,
          0.11,
          0.035,
        ]}
        rotation={[
          0,
          0,
          Math.PI / 4,
        ]}
      >
        <planeGeometry
          args={[
            0.31,
            0.31,
          ]}
        />
        <meshStandardMaterial
          color="#c8aa78"
          roughness={1}
          side={
            THREE.DoubleSide
          }
        />
      </mesh>
    </group>
  );
}

function Postcard() {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry
          args={[
            0.68,
            0.43,
            0.045,
          ]}
        />
        <meshStandardMaterial
          color="#ded0b3"
          roughness={0.98}
        />
      </mesh>

      <mesh
        position={[
          0.19,
          0.10,
          0.026,
        ]}
      >
        <planeGeometry
          args={[
            0.13,
            0.11,
          ]}
        />
        <meshStandardMaterial
          color="#9d7459"
          roughness={1}
        />
      </mesh>

      <mesh
        position={[
          -0.10,
          -0.03,
          0.027,
        ]}
      >
        <planeGeometry
          args={[
            0.28,
            0.015,
          ]}
        />
        <meshBasicMaterial
          color="#7b6650"
        />
      </mesh>
    </group>
  );
}

function FoldedLetter() {
  return (
    <group
      rotation={[
        0,
        0.16,
        -0.05,
      ]}
    >
      <mesh
        position={[
          -0.18,
          0,
          0,
        ]}
        rotation={[
          0,
          0.17,
          0,
        ]}
      >
        <boxGeometry
          args={[
            0.42,
            0.55,
            0.035,
          ]}
        />
        <meshStandardMaterial
          color="#e5d9bf"
          roughness={0.98}
        />
      </mesh>

      <mesh
        position={[
          0.18,
          0,
          0,
        ]}
        rotation={[
          0,
          -0.17,
          0,
        ]}
      >
        <boxGeometry
          args={[
            0.42,
            0.55,
            0.035,
          ]}
        />
        <meshStandardMaterial
          color="#d9c9aa"
          roughness={0.98}
        />
      </mesh>
    </group>
  );
}

function Aerogram() {
  return (
    <group
      rotation={[
        0,
        0,
        Math.PI / 4,
      ]}
    >
      <mesh castShadow>
        <boxGeometry
          args={[
            0.52,
            0.52,
            0.035,
          ]}
        />
        <meshStandardMaterial
          color="#c9d2ca"
          roughness={0.96}
        />
      </mesh>

      <mesh
        position={[
          0,
          0,
          0.022,
        ]}
      >
        <planeGeometry
          args={[
            0.34,
            0.012,
          ]}
        />
        <meshBasicMaterial
          color="#7f8d84"
        />
      </mesh>
    </group>
  );
}

function ScrollNote() {
  return (
    <group
      rotation={[
        0,
        0,
        -0.16,
      ]}
    >
      <mesh>
        <boxGeometry
          args={[
            0.54,
            0.34,
            0.035,
          ]}
        />
        <meshStandardMaterial
          color="#d6c29b"
          roughness={1}
        />
      </mesh>

      <mesh
        position={[
          -0.29,
          0,
          0,
        ]}
        rotation={[
          Math.PI / 2,
          0,
          0,
        ]}
      >
        <cylinderGeometry
          args={[
            0.055,
            0.055,
            0.34,
            10,
          ]}
        />
        <meshStandardMaterial
          color="#b79b72"
          roughness={1}
        />
      </mesh>

      <mesh
        position={[
          0.29,
          0,
          0,
        ]}
        rotation={[
          Math.PI / 2,
          0,
          0,
        ]}
      >
        <cylinderGeometry
          args={[
            0.055,
            0.055,
            0.34,
            10,
          ]}
        />
        <meshStandardMaterial
          color="#b79b72"
          roughness={1}
        />
      </mesh>
    </group>
  );
}

function LongLetter() {
  return (
    <group
      rotation={[
        0.04,
        0,
        0.08,
      ]}
    >
      <mesh>
        <boxGeometry
          args={[
            0.40,
            0.72,
            0.032,
          ]}
        />
        <meshStandardMaterial
          color="#e2d7bf"
          roughness={1}
        />
      </mesh>

      {[
        0.20,
        0.10,
        0,
        -0.10,
        -0.20,
      ].map(
        (y) => (
          <mesh
            key={y}
            position={[
              0,
              y,
              0.018,
            ]}
          >
            <planeGeometry
              args={[
                0.26,
                0.009,
              ]}
            />
            <meshBasicMaterial
              color="#86725b"
            />
          </mesh>
        ),
      )}
    </group>
  );
}

function SmallCard() {
  return (
    <group>
      <mesh>
        <boxGeometry
          args={[
            0.46,
            0.32,
            0.055,
          ]}
        />
        <meshStandardMaterial
          color="#c7a97d"
          roughness={0.98}
        />
      </mesh>

      <mesh
        position={[
          0,
          0,
          0.032,
        ]}
      >
        <circleGeometry
          args={[
            0.045,
            14,
          ]}
        />
        <meshStandardMaterial
          color="#8c4f40"
          roughness={0.9}
        />
      </mesh>
    </group>
  );
}

function PaperBundle() {
  return (
    <group
      rotation={[
        0.03,
        -0.1,
        -0.03,
      ]}
    >
      {[
        -0.025,
        0,
        0.025,
      ].map(
        (z, index) => (
          <mesh
            key={z}
            position={[
              index *
                0.025 -
                0.025,
              index *
                0.018 -
                0.018,
              z,
            ]}
          >
            <boxGeometry
              args={[
                0.50,
                0.58,
                0.018,
              ]}
            />
            <meshStandardMaterial
              color={
                index === 1
                  ? "#d9c9a9"
                  : "#e4d8c0"
              }
              roughness={1}
            />
          </mesh>
        ),
      )}
    </group>
  );
}

function ReplyShape({
  index,
}: {
  index: number;
}) {
  switch (index) {
    case 0:
      return (
        <Envelope
          index={index}
        />
      );

    case 1:
      return <Postcard />;

    case 2:
      return <FoldedLetter />;

    case 3:
      return <Aerogram />;

    case 4:
      return <ScrollNote />;

    case 5:
      return <LongLetter />;

    case 6:
      return <SmallCard />;

    case 7:
      return <PaperBundle />;

    case 8:
      return (
        <Envelope
          index={index}
        />
      );

    default:
      return <FoldedLetter />;
  }
}

function FlyingReply({
  index,
  progress,
}: {
  index: number;
  progress: MutableRefObject<number>;
}) {
  const ref =
    useRef<THREE.Group>(
      null,
    );

  const start =
    STARTS[index];

  const arrival =
    ARRIVALS[index];

  const begin =
    index === 0
      ? arrival - 0.075
      : arrival - 0.050;

  const path =
    useMemo(
      () => {
        const midA =
          start
            .clone()
            .lerp(
              MAILBOX,
              0.34,
            );

        midA.y +=
          index === 0
            ? 1.15
            : 0.55 +
              (index % 3) *
                0.20;

        midA.z +=
          ((index % 2)
            ? -1
            : 1) *
          0.35;

        const midB =
          start
            .clone()
            .lerp(
              MAILBOX,
              0.70,
            );

        midB.y +=
          0.22 +
          (index % 4) *
            0.06;

        return new THREE
          .CatmullRomCurve3(
            [
              start,
              midA,
              midB,
              MAILBOX,
            ],
            false,
            "centripetal",
          );
      },
      [
        index,
        start,
      ],
    );

  useFrame(() => {
    if (!ref.current) return;

    const p =
      progress.current;

    const local =
      clamp01(
        (p - begin) /
          (arrival - begin),
      );

    const visible =
      p >= begin - 0.005 &&
      p <= arrival + 0.028;

    ref.current.visible =
      visible;

    if (!visible) return;

    const eased =
      1 -
      Math.pow(
        1 - local,
        3,
      );

    const point =
      path.getPointAt(
        eased,
      );

    ref.current.position
      .copy(point);

    const tangent =
      path
        .getTangentAt(
          Math.min(
            0.999,
            eased,
          ),
        )
        .normalize();

    ref.current.rotation.y =
      Math.atan2(
        tangent.x,
        tangent.z,
      );

    ref.current.rotation.z =
      Math.sin(
        local *
          Math.PI *
          2 +
          index,
      ) *
      (index === 0
        ? 0.08
        : 0.16);

    ref.current.rotation.x =
      Math.cos(
        local *
          Math.PI +
          index,
      ) *
      0.06;

    const entrance =
      THREE.MathUtils
        .smoothstep(
          local,
          0,
          0.12,
        );

    const exit =
      1 -
      THREE.MathUtils
        .smoothstep(
          local,
          0.93,
          1,
        );

    const baseScale =
      index === 0
        ? 1.45
        : 1.08 +
          (index % 3) *
            0.04;

    const scale =
      Math.max(
        0.001,
        entrance *
          exit *
          baseScale,
      );

    ref.current.scale
      .setScalar(
        scale,
      );
  });

  return (
    <group ref={ref}>
      <ReplyShape
        index={index}
      />
    </group>
  );
}

function MailboxGlow({
  progress,
}: {
  progress: MutableRefObject<number>;
}) {
  const light =
    useRef<THREE.PointLight>(
      null,
    );

  const ring =
    useRef<THREE.Mesh>(
      null,
    );

  useFrame(
    ({ clock }) => {
      const p =
        progress.current;

      const active =
        p > 0.615 &&
        p < 0.825;

      if (light.current) {
        light.current.intensity =
          active
            ? 1.5 +
              Math.sin(
                clock
                  .elapsedTime *
                  6,
              ) *
                0.35
            : 0;
      }

      if (ring.current) {
        ring.current.visible =
          active;

        const pulse =
          1 +
          Math.sin(
            clock
              .elapsedTime *
              5,
          ) *
            0.08;

        ring.current.scale.set(
          pulse,
          pulse,
          pulse,
        );
      }
    },
  );

  return (
    <group
      position={[
        MAILBOX.x,
        MAILBOX.y,
        MAILBOX.z,
      ]}
    >
      <pointLight
        ref={light}
        color="#d8ae66"
        intensity={0}
        distance={4.5}
      />

      <mesh
        ref={ring}
        rotation={[
          Math.PI / 2,
          0,
          0,
        ]}
      >
        <torusGeometry
          args={[
            0.43,
            0.015,
            8,
            40,
          ]}
        />
        <meshBasicMaterial
          color="#d7ad67"
          transparent
          opacity={0.42}
        />
      </mesh>
    </group>
  );
}

const VOICE_POINTS =
  Array.from(
    { length: 10 },
    (_, index) =>
      new THREE.Vector3(
        85 +
          index *
            0.70,
        1.45 +
          (index % 3) *
            0.42,
        0.55 +
          Math.sin(
            index * 1.7,
          ) *
            0.35,
      ),
  );

function Connection({
  from,
  to,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
}) {
  const midpoint =
    from
      .clone()
      .add(to)
      .multiplyScalar(
        0.5,
      );

  const distance =
    from.distanceTo(to);

  const direction =
    to
      .clone()
      .sub(from)
      .normalize();

  const quaternion =
    new THREE.Quaternion()
      .setFromUnitVectors(
        new THREE.Vector3(
          0,
          1,
          0,
        ),
        direction,
      );

  return (
    <mesh
      position={[
        midpoint.x,
        midpoint.y,
        midpoint.z,
      ]}
      quaternion={
        quaternion
      }
    >
      <cylinderGeometry
        args={[
          0.009,
          0.009,
          distance,
          6,
        ]}
      />
      <meshBasicMaterial
        color="#a64b43"
        transparent
        opacity={0.42}
      />
    </mesh>
  );
}

function VoicesConstellation({
  progress,
}: {
  progress: MutableRefObject<number>;
}) {
  const root =
    useRef<THREE.Group>(
      null,
    );

  useFrame(() => {
    if (!root.current) return;

    const p =
      progress.current;

    root.current.visible =
      p > 0.730 &&
      p < 0.850;

    if (
      !root.current.visible
    ) {
      return;
    }

    const reveal =
      clamp01(
        (p - 0.730) /
          0.060,
      );

    root.current.scale.set(
      reveal,
      reveal,
      reveal,
    );
  });

  return (
    <group ref={root}>
      {VOICE_POINTS.map(
        (point, index) => (
          <mesh
            key={index}
            position={[
              point.x,
              point.y,
              point.z,
            ]}
          >
            <sphereGeometry
              args={[
                index === 0
                  ? 0.105
                  : 0.075,
                12,
                10,
              ]}
            />

            <meshStandardMaterial
              color={
                index === 0
                  ? "#f3dfaa"
                  : "#ead9b7"
              }
              emissive="#d9a75e"
              emissiveIntensity={
                index === 0
                  ? 2
                  : 1.25
              }
              roughness={0.8}
            />
          </mesh>
        ),
      )}

      {VOICE_POINTS
        .slice(0, -1)
        .map(
          (
            point,
            index,
          ) => (
            <Connection
              key={index}
              from={point}
              to={
                VOICE_POINTS[
                  index + 1
                ]
              }
            />
          ),
        )}
    </group>
  );
}

function Counter({
  progress,
}: {
  progress: MutableRefObject<number>;
}) {
  const mesh =
    useRef<THREE.Mesh>(
      null,
    );

  const texture =
    useMemo(
      () => {
        const canvas =
          document.createElement(
            "canvas",
          );

        canvas.width = 512;
        canvas.height = 256;

        const ctx =
          canvas.getContext(
            "2d",
          );

        if (ctx) {
          ctx.clearRect(
            0,
            0,
            512,
            256,
          );

          ctx.fillStyle =
            "#d8c5a2";

          ctx.font =
            "700 88px Georgia";

          ctx.textAlign =
            "center";

          ctx.fillText(
            "10 / 60",
            256,
            116,
          );

          ctx.fillStyle =
            "#9e8061";

          ctx.font =
            "28px Arial";

          ctx.letterSpacing =
            "8px";

          ctx.fillText(
            "VOCES",
            256,
            172,
          );
        }

        const map =
          new THREE.CanvasTexture(
            canvas,
          );

        map.colorSpace =
          THREE.SRGBColorSpace;

        return map;
      },
      [],
    );

  useFrame(() => {
    if (!mesh.current) return;

    const p =
      progress.current;

    const reveal =
      clamp01(
        (p - 0.805) /
          0.025,
      );

    mesh.current.visible =
      p > 0.797 &&
      p < 0.865;

    mesh.current.scale.set(
      2.4 * reveal,
      1.2 * reveal,
      1,
    );
  });

  return (
    <mesh
      ref={mesh}
      position={[
        90.4,
        3.45,
        -0.25,
      ]}
    >
      <planeGeometry
        args={[
          1,
          0.5,
        ]}
      />

      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export function WorldReplies({
  progress,
}: {
  progress: MutableRefObject<number>;
}) {
  const root =
    useRef<THREE.Group>(
      null,
    );

  useFrame(() => {
    if (!root.current) return;

    const p =
      progress.current;

    root.current.visible =
      p > 0.535 &&
      p < 0.84;
  });

  return (
    <group ref={root}>
      {ARRIVALS.map(
        (_, index) => (
          <FlyingReply
            key={index}
            index={index}
            progress={progress}
          />
        ),
      )}

      <MailboxGlow
        progress={progress}
      />

      <VoicesConstellation
        progress={progress}
      />

      <Counter
        progress={progress}
      />
    </group>
  );
}
