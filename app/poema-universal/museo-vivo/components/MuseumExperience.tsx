"use client";

import {
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  Canvas,
  useFrame,
  useThree,
} from "@react-three/fiber";

import * as THREE from "three";

/* =========================================================
   MUSEO VIVO · SALA CERO
   Motor de recorrido cinematográfico
   ========================================================= */

const museumPath =
  new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(0, 1.7, 13),
      new THREE.Vector3(0, 1.7, 8),
      new THREE.Vector3(-2.1, 1.75, 3),
      new THREE.Vector3(-0.4, 1.9, -3),
      new THREE.Vector3(2.8, 1.75, -9),
      new THREE.Vector3(0.8, 1.85, -15),
      new THREE.Vector3(0, 1.9, -22),
      new THREE.Vector3(0, 2.05, -29),
    ],
    false,
    "catmullrom",
    0.4,
  );

const UP =
  new THREE.Vector3(0, 1, 0);

const lookMatrix =
  new THREE.Matrix4();

const pathQuaternion =
  new THREE.Quaternion();

const mouseQuaternion =
  new THREE.Quaternion();

const desiredQuaternion =
  new THREE.Quaternion();

const mouseEuler =
  new THREE.Euler();

function MuseumCamera() {
  const camera = useThree(
    (state) => state.camera,
  );

  const progress = useRef(0);
  const targetProgress = useRef(0);

  const mouse = useRef({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const onWheel = (
      event: WheelEvent,
    ) => {
      targetProgress.current =
        THREE.MathUtils.clamp(
          targetProgress.current +
            event.deltaY * 0.00034,
          0,
          1,
        );
    };

    const onMouseMove = (
      event: MouseEvent,
    ) => {
      mouse.current.x =
        (event.clientX /
          window.innerWidth -
          0.5) *
        2;

      mouse.current.y =
        (event.clientY /
          window.innerHeight -
          0.5) *
        2;
    };

    window.addEventListener(
      "wheel",
      onWheel,
      { passive: true },
    );

    window.addEventListener(
      "mousemove",
      onMouseMove,
    );

    return () => {
      window.removeEventListener(
        "wheel",
        onWheel,
      );

      window.removeEventListener(
        "mousemove",
        onMouseMove,
      );
    };
  }, []);

  useFrame((_, dt) => {
    progress.current =
      THREE.MathUtils.damp(
        progress.current,
        targetProgress.current,
        4.2,
        dt,
      );

    const p =
      THREE.MathUtils.clamp(
        progress.current,
        0,
        1,
      );

    const point =
      museumPath.getPointAt(p);

    const ahead =
      museumPath.getPointAt(
        Math.min(p + 0.018, 1),
      );

    /*
     * Pequeña libertad corporal.
     * El visitante puede "mirar",
     * pero nunca abandonar
     * la coreografía del museo.
     */
    const px =
      point.x +
      mouse.current.x * 0.13;

    const py =
      point.y -
      mouse.current.y * 0.08;

    camera.position.x =
      THREE.MathUtils.damp(
        camera.position.x,
        px,
        7,
        dt,
      );

    camera.position.y =
      THREE.MathUtils.damp(
        camera.position.y,
        py,
        7,
        dt,
      );

    camera.position.z =
      THREE.MathUtils.damp(
        camera.position.z,
        point.z,
        7,
        dt,
      );

    /*
     * Dirección narrativa principal.
     */
    lookMatrix.lookAt(
      point,
      ahead,
      UP,
    );

    pathQuaternion
      .setFromRotationMatrix(
        lookMatrix,
      );

    /*
     * Micro-movimiento de mirada.
     */
    mouseEuler.set(
      -mouse.current.y * 0.035,
      -mouse.current.x * 0.06,
      0,
    );

    mouseQuaternion
      .setFromEuler(mouseEuler);

    desiredQuaternion
      .copy(pathQuaternion)
      .multiply(mouseQuaternion);

    camera.quaternion.slerp(
      desiredQuaternion,
      1 -
        Math.exp(-4.5 * dt),
    );
  });

  return null;
}


/* =========================================================
   OBRA VIVA 01
   La pieza modifica la atmósfera del museo
   según la distancia del visitante.
   ========================================================= */

const LIVING_ARTWORK_POSITION =
  new THREE.Vector3(
    -6.65,
    2.2,
    1.5,
  );

const BASE_BACKGROUND =
  new THREE.Color("#070706");

const ACTIVE_BACKGROUND =
  new THREE.Color("#1b120d");

const BASE_FOG =
  new THREE.Color("#080807");

const ACTIVE_FOG =
  new THREE.Color("#28160f");

const BASE_ART =
  new THREE.Color("#d9d2c3");

const ACTIVE_ART =
  new THREE.Color("#c69a73");

const ACTIVE_EMISSIVE =
  new THREE.Color("#8c4f2f");

function createLivingLabelTexture() {
  const canvas =
    document.createElement("canvas");

  canvas.width = 1024;
  canvas.height = 384;

  const ctx =
    canvas.getContext("2d");

  if (!ctx) {
    return new THREE.CanvasTexture(
      canvas,
    );
  }

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height,
  );

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle =
    "rgba(238,233,223,.58)";

  ctx.font =
    "28px Arial";

  ctx.fillText(
    "SALA CERO · 01",
    512,
    95,
  );

  ctx.fillStyle =
    "rgba(244,239,228,.96)";

  ctx.font =
    "54px Georgia";

  ctx.fillText(
    "LA MATERIA RECUERDA",
    512,
    185,
  );

  ctx.strokeStyle =
    "rgba(238,233,223,.28)";

  ctx.lineWidth = 2;

  ctx.beginPath();

  ctx.moveTo(
    340,
    250,
  );

  ctx.lineTo(
    684,
    250,
  );

  ctx.stroke();

  const texture =
    new THREE.CanvasTexture(
      canvas,
    );

  texture.colorSpace =
    THREE.SRGBColorSpace;

  texture.needsUpdate = true;

  return texture;
}

function LivingArtwork() {
  const group =
    useRef<THREE.Group>(null);

  const material =
    useRef<THREE.MeshStandardMaterial>(
      null,
    );

  const light =
    useRef<THREE.PointLight>(null);

  const labelMaterial =
    useRef<THREE.MeshBasicMaterial>(
      null,
    );

  const {
    camera,
    scene,
  } = useThree();

  const labelTexture =
    useMemo(
      () =>
        createLivingLabelTexture(),
      [],
    );

  useEffect(() => {
    return () => {
      labelTexture.dispose();
    };
  }, [labelTexture]);

  useFrame(
    ({ clock }, dt) => {
      const distance =
        camera.position.distanceTo(
          LIVING_ARTWORK_POSITION,
        );

      /*
       * 0 = fuera de su campo
       * 1 = completamente dentro
       */
      const influence =
        1 -
        THREE.MathUtils.smoothstep(
          distance,
          2.0,
          7.5,
        );

      const pulse =
        (Math.sin(
          clock.elapsedTime * 0.85,
        ) +
          1) *
        0.5;

      /* -------------------------------
         ATMÓSFERA GLOBAL
         ------------------------------- */

      if (
        scene.background instanceof
        THREE.Color
      ) {
        scene.background.lerpColors(
          BASE_BACKGROUND,
          ACTIVE_BACKGROUND,
          influence * 0.92,
        );
      }

      if (
        scene.fog instanceof
        THREE.FogExp2
      ) {
        scene.fog.color.lerpColors(
          BASE_FOG,
          ACTIVE_FOG,
          influence,
        );

        scene.fog.density =
          THREE.MathUtils.damp(
            scene.fog.density,
            0.021 +
              influence * 0.018,
            3.2,
            dt,
          );
      }

      /* -------------------------------
         LA PROPIA OBRA DESPIERTA
         ------------------------------- */

      if (material.current) {
        material.current.color
          .lerpColors(
            BASE_ART,
            ACTIVE_ART,
            influence,
          );

        material.current
          .emissive.copy(
            ACTIVE_EMISSIVE,
          );

        material.current
          .emissiveIntensity =
          THREE.MathUtils.damp(
            material.current
              .emissiveIntensity,
            influence *
              (0.42 +
                pulse * 0.12),
            4,
            dt,
          );
      }

      /* -------------------------------
         LUZ DE PRESENCIA
         ------------------------------- */

      if (light.current) {
        light.current.intensity =
          THREE.MathUtils.damp(
            light.current.intensity,
            2 +
              influence *
                (20 +
                  pulse * 5),
            4,
            dt,
          );
      }

      /* -------------------------------
         INSCRIPCIÓN
         ------------------------------- */

      if (labelMaterial.current) {
        labelMaterial.current.opacity =
          THREE.MathUtils.damp(
            labelMaterial.current
              .opacity,
            Math.max(
              0,
              (influence - 0.28) /
                0.72,
            ),
            4,
            dt,
          );
      }

      /* -------------------------------
         RESPIRACIÓN FÍSICA
         ------------------------------- */

      if (group.current) {
        const breathing =
          1 +
          influence *
            (0.008 +
              pulse * 0.006);

        group.current.scale.setScalar(
          breathing,
        );
      }
    },
  );

  return (
    <group
      ref={group}
      position={[
        -6.65,
        2.2,
        1.5,
      ]}
      rotation={[
        0,
        Math.PI / 2,
        0,
      ]}
    >
      {/* cuerpo de la obra */}
      <mesh
        scale={[
          0.08,
          2.1,
          1.6,
        ]}
      >
        <boxGeometry />

        <meshStandardMaterial
          ref={material}
          color="#d9d2c3"
          emissive="#8c4f2f"
          emissiveIntensity={0}
          roughness={0.76}
          metalness={0}
        />
      </mesh>

      {/* inscripción física */}
      <mesh
        position={[
          0,
          -2.65,
          0.22,
        ]}
      >
        <planeGeometry
          args={[
            3.9,
            1.45,
          ]}
        />

        <meshBasicMaterial
          ref={labelMaterial}
          map={labelTexture}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* halo local */}
      <pointLight
        ref={light}
        position={[
          0,
          1.2,
          1.7,
        ]}
        color="#d69b6d"
        intensity={2}
        distance={8}
        decay={2}
      />
    </group>
  );
}

function Artwork({
  position,
  rotation,
  scale,
}: {
  position:
    [number, number, number];
  rotation:
    [number, number, number];
  scale:
    [number, number, number];
}) {
  return (
    <group
      position={position}
      rotation={rotation}
    >
      <mesh scale={scale}>
        <boxGeometry />
        <meshStandardMaterial
          color="#d9d2c3"
          roughness={0.8}
          metalness={0}
        />
      </mesh>

      <pointLight
        position={[0, 1.2, 1.4]}
        intensity={7}
        distance={5}
      />
    </group>
  );
}

function Portal({
  z,
  width = 7,
  height = 6,
}: {
  z: number;
  width?: number;
  height?: number;
}) {
  return (
    <group position={[0, 0, z]}>
      <mesh
        position={[
          -width / 2,
          height / 2,
          0,
        ]}
        scale={[
          0.22,
          height,
          0.5,
        ]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#191916"
          roughness={1}
        />
      </mesh>

      <mesh
        position={[
          width / 2,
          height / 2,
          0,
        ]}
        scale={[
          0.22,
          height,
          0.5,
        ]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#191916"
          roughness={1}
        />
      </mesh>

      <mesh
        position={[
          0,
          height,
          0,
        ]}
        scale={[
          width,
          0.22,
          0.5,
        ]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#191916"
          roughness={1}
        />
      </mesh>
    </group>
  );
}

function ResonanceChamber() {
  return (
    <group position={[0, 0, -29]}>
      <mesh
        position={[0, 3, -1]}
        scale={[9, 6, 0.3]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#d9d4c8"
          roughness={0.92}
        />
      </mesh>

      <mesh
        position={[0, 3, 0]}
        scale={[2.5, 2.5, 0.08]}
      >
        <circleGeometry args={[1, 96]} />

        <meshStandardMaterial
          color="#f0ebe0"
          emissive="#817a68"
          emissiveIntensity={0.16}
          roughness={0.65}
        />
      </mesh>

      <pointLight
        position={[0, 4, 2]}
        intensity={26}
        distance={11}
      />
    </group>
  );
}

function MuseumArchitecture() {
  const stone = "#121210";
  const deepStone = "#0c0c0a";
  const paleStone = "#b9b3a7";

  return (
    <group>

      {/* ===================================================
          01 · UMBRAL
          =================================================== */}

      <mesh
        position={[0, -0.2, 15]}
        scale={[8, 0.3, 18]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color={deepStone}
          roughness={1}
        />
      </mesh>

      <mesh
        position={[-4, 3.2, 15]}
        scale={[0.35, 7, 18]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color={stone}
          roughness={1}
        />
      </mesh>

      <mesh
        position={[4, 3.2, 15]}
        scale={[0.35, 7, 18]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color={stone}
          roughness={1}
        />
      </mesh>

      <mesh
        position={[0, 6.5, 15]}
        scale={[8, 0.35, 18]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#10100e"
          roughness={1}
        />
      </mesh>

      <Portal
        z={10}
        width={5.5}
        height={5.5}
      />

      {/* primera rendija de luz */}
      <rectAreaLight
        position={[0, 5.9, 8]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={2}
        height={7}
        intensity={8}
        color="#d9ccb1"
      />

      {/* ===================================================
          02 · GALERÍA DE APERTURA
          =================================================== */}

      <mesh
        position={[-2, -0.2, 0]}
        scale={[20, 0.3, 19]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#0d0d0b"
          roughness={1}
        />
      </mesh>

      <mesh
        position={[-11.5, 4.2, 0]}
        scale={[0.4, 9, 19]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#151512"
          roughness={1}
        />
      </mesh>

      <mesh
        position={[7.5, 4.2, 0]}
        scale={[0.4, 9, 19]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#151512"
          roughness={1}
        />
      </mesh>

      {/* techo roto: deja respirar la sala */}
      <mesh
        position={[-7.5, 8.5, 0]}
        scale={[7, 0.35, 19]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#11110f"
          roughness={1}
        />
      </mesh>

      <mesh
        position={[5, 8.5, 0]}
        scale={[5, 0.35, 19]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#11110f"
          roughness={1}
        />
      </mesh>

      {/* OBRA VIVA ORIGINAL */}
      <LivingArtwork />

      {/* pieza vertical suspendida */}
      <mesh
        position={[6.9, 3.1, -3]}
        scale={[0.09, 4.5, 2.7]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#aaa399"
          roughness={0.82}
        />
      </mesh>

      {/* ===================================================
          03 · PASO DE COMPRESIÓN
          =================================================== */}

      <mesh
        position={[-4, -0.15, -13]}
        scale={[5.5, 0.25, 11]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#090908"
        />
      </mesh>

      <mesh
        position={[-6.9, 3.4, -13]}
        scale={[0.5, 7, 11]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#11110f"
          roughness={1}
        />
      </mesh>

      <mesh
        position={[-1.1, 3.4, -13]}
        scale={[0.5, 7, 11]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#11110f"
          roughness={1}
        />
      </mesh>

      <mesh
        position={[-4, 6.6, -13]}
        scale={[5.5, 0.5, 11]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#0f0f0d"
        />
      </mesh>

      {/* ===================================================
          04 · GRAN SALA
          =================================================== */}

      <mesh
        position={[1.5, -0.25, -29]}
        scale={[25, 0.35, 22]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#0d0d0b"
          roughness={1}
        />
      </mesh>

      <mesh
        position={[-11, 6, -29]}
        scale={[0.45, 13, 22]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#141411"
          roughness={1}
        />
      </mesh>

      <mesh
        position={[14, 6, -29]}
        scale={[0.45, 13, 22]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#141411"
          roughness={1}
        />
      </mesh>

      {/* enorme muro flotante */}
      <mesh
        position={[1.5, 6.5, -28]}
        scale={[12, 8, 0.45]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#191915"
          roughness={1}
        />
      </mesh>

      <Artwork
        position={[
          1.5,
          6.5,
          -27.5,
        ]}
        rotation={[0, 0, 0]}
        scale={[
          5.7,
          3.6,
          0.08,
        ]}
      />

      {/* columnas monumentales */}
      {[-8, -4, 8, 12].map(
        (x) => (
          <mesh
            key={x}
            position={[x, 5, -36]}
            scale={[0.9, 10, 0.9]}
          >
            <boxGeometry />
            <meshStandardMaterial
              color="#181814"
              roughness={1}
            />
          </mesh>
        ),
      )}

      {/* ===================================================
          05 · DESFILADERO / PUENTE
          =================================================== */}

      <mesh
        position={[3, 0.2, -46]}
        scale={[4.2, 0.35, 17]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#151511"
          roughness={0.95}
        />
      </mesh>

      {/* vacío a ambos lados */}
      <mesh
        position={[-8, -5.5, -46]}
        scale={[18, 11, 17]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#030303"
        />
      </mesh>

      <mesh
        position={[14, -5.5, -46]}
        scale={[18, 11, 17]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#030303"
        />
      </mesh>

      {/* muros muy altos al fondo */}
      <mesh
        position={[-10, 7, -46]}
        scale={[0.6, 15, 17]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#0f0f0d"
        />
      </mesh>

      <mesh
        position={[16, 7, -46]}
        scale={[0.6, 15, 17]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#0f0f0d"
        />
      </mesh>

      <pointLight
        position={[3, 12, -46]}
        intensity={45}
        distance={24}
        color="#a79c89"
      />

      {/* ===================================================
          06 · ARCHIVO
          =================================================== */}

      <mesh
        position={[-4, -0.2, -61]}
        scale={[19, 0.3, 18]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#0c0c0a"
          roughness={1}
        />
      </mesh>

      <mesh
        position={[-13.5, 4.5, -61]}
        scale={[0.4, 10, 18]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#171713"
          roughness={1}
        />
      </mesh>

      <mesh
        position={[5.5, 4.5, -61]}
        scale={[0.4, 10, 18]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#171713"
          roughness={1}
        />
      </mesh>

      {/* archivo flotante */}
      {[
        [-9, 2.4, -57],
        [-5, 3.8, -59],
        [0, 2.8, -60],
        [-10, 5.5, -64],
        [-3, 6.2, -66],
        [3, 4.6, -63],
      ].map(
        (pos, index) => (
          <mesh
            key={index}
            position={
              pos as [
                number,
                number,
                number
              ]
            }
            rotation={[
              0,
              index % 2
                ? 0.12
                : -0.08,
              index % 3
                ? 0.04
                : -0.03,
            ]}
            scale={[
              2.2,
              1.6,
              0.08,
            ]}
          >
            <boxGeometry />
            <meshStandardMaterial
              color={
                index % 2
                  ? "#8f887b"
                  : "#c4bbaa"
              }
              roughness={0.82}
            />
          </mesh>
        ),
      )}

      {/* ===================================================
          07 · NAVE MONUMENTAL
          =================================================== */}

      <mesh
        position={[0, -0.25, -80]}
        scale={[30, 0.4, 24]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#0c0c0a"
        />
      </mesh>

      <mesh
        position={[-15, 7, -80]}
        scale={[0.5, 15, 24]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#151511"
          roughness={1}
        />
      </mesh>

      <mesh
        position={[15, 7, -80]}
        scale={[0.5, 15, 24]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#151511"
          roughness={1}
        />
      </mesh>

      {/* grandes costillas */}
      {[-88, -82, -76, -70].map(
        (z) => (
          <group key={z}>
            <mesh
              position={[-9, 8, z]}
              scale={[0.6, 16, 0.6]}
            >
              <boxGeometry />
              <meshStandardMaterial
                color="#20201b"
              />
            </mesh>

            <mesh
              position={[9, 8, z]}
              scale={[0.6, 16, 0.6]}
            >
              <boxGeometry />
              <meshStandardMaterial
                color="#20201b"
              />
            </mesh>

            <mesh
              position={[0, 15.5, z]}
              scale={[18, 0.6, 0.6]}
            >
              <boxGeometry />
              <meshStandardMaterial
                color="#20201b"
              />
            </mesh>
          </group>
        ),
      )}

      {/* ===================================================
          08 · CÁMARA DE RESONANCIA
          =================================================== */}

      <mesh
        position={[0, -0.2, -96]}
        scale={[24, 0.4, 20]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#aaa69c"
          roughness={0.96}
        />
      </mesh>

      <mesh
        position={[0, 7, -103]}
        scale={[24, 15, 0.7]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color={paleStone}
          roughness={0.98}
        />
      </mesh>

      {/* no un círculo plano:
          un aro arquitectónico */}
      <mesh
        position={[0, 6.5, -101.8]}
      >
        <torusGeometry
          args={[
            4.2,
            0.22,
            32,
            128,
          ]}
        />

        <meshStandardMaterial
          color="#eee9df"
          emissive="#938876"
          emissiveIntensity={0.32}
          roughness={0.55}
        />
      </mesh>

      <pointLight
        position={[0, 7, -97]}
        intensity={65}
        distance={22}
        color="#e7ddcb"
      />

      {/* luz general mínima */}
      <pointLight
        position={[-4, 7, -3]}
        intensity={15}
        distance={15}
        color="#b7a58c"
      />

      <pointLight
        position={[4, 9, -30]}
        intensity={20}
        distance={19}
        color="#b9ad98"
      />

    </group>
  );
}

function MuseumWorld() {
  return (
    <>
      <color
        attach="background"
        args={["#070706"]}
      />

      <fogExp2
        attach="fog"
        args={[
          "#080807",
          0.021,
        ]}
      />

      <ambientLight
        intensity={0.12}
      />

      <MuseumCamera />

      <MuseumArchitecture />
    </>
  );
}

export default function MuseumExperience() {
  return (
    <Canvas
      camera={{
        position: [
          0,
          1.7,
          13,
        ],
        fov: 62,
        near: 0.05,
        far: 120,
      }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        powerPreference:
          "high-performance",
      }}
    >
      <MuseumWorld />
    </Canvas>
  );
}
