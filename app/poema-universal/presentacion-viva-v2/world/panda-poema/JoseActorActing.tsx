"use client";

import { useMemo as usePaperMemo } from "react";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  useMemo,
  useRef,
} from "react";
import type { MutableRefObject } from "react";

import { joseCurve } from "./curves";

type Props = {
  progress: MutableRefObject<number>;
};

function envelope(
  p: number,
  start: number,
  peak: number,
  end: number,
) {
  const enter = THREE.MathUtils.smoothstep(
    p,
    start,
    peak,
  );

  const leave =
    1 -
    THREE.MathUtils.smoothstep(
      p,
      peak,
      end,
    );

  return THREE.MathUtils.clamp(
    enter * leave,
    0,
    1,
  );
}

function actedProgress(p: number) {
  const kitchen =
    envelope(p, 0.085, 0.12, 0.17) *
    0.006;

  const leaving =
    envelope(p, 0.19, 0.225, 0.275) *
    0.009;

  const literature =
    envelope(p, 0.30, 0.35, 0.41) *
    0.008;

  const question =
    envelope(p, 0.425, 0.49, 0.56) *
    0.011;

  const voices =
    envelope(p, 0.67, 0.735, 0.81) *
    0.009;

  const tree =
    envelope(p, 0.865, 0.91, 0.985) *
    0.016;

  return THREE.MathUtils.clamp(
    p -
      kitchen -
      leaving -
      literature -
      question -
      voices -
      tree,
    0,
    1,
  );
}

export function JoseActorActing({
  progress,
}: Props) {

  /* PAPER AVATAR TEXTURE START */
  const paperTexture = usePaperMemo(() => {
    const size = 96;

    const data =
      new Uint8Array(
        size * size * 4,
      );

    for (
      let y = 0;
      y < size;
      y += 1
    ) {
      for (
        let x = 0;
        x < size;
        x += 1
      ) {
        const i =
          (y * size + x) * 4;

        const grain =
          (
            (
              x * 17 +
              y * 29 +
              (x * y) % 23
            ) %
            19
          ) - 9;

        const fibre =
          Math.sin(
            x * 0.47 +
            Math.sin(
              y * 0.19,
            ) * 2.1,
          ) * 3;

        const verticalFibre =
          Math.sin(
            y * 0.61 +
            Math.cos(
              x * 0.13,
            ),
          ) * 2;

        const creaseA =
          Math.abs(
            (
              x * 2 +
              y * 3
            ) % 67 -
            33,
          ) < 1.2
            ? -12
            : 0;

        const creaseB =
          Math.abs(
            (
              x * 5 -
              y * 2 +
              200
            ) % 83 -
            41,
          ) < 0.8
            ? -8
            : 0;

        const value =
          Math.max(
            215,
            Math.min(
              255,
              Math.round(
                247 +
                grain * 0.45 +
                fibre +
                verticalFibre +
                creaseA +
                creaseB,
              ),
            ),
          );

        data[i] = value;
        data[i + 1] =
          Math.max(
            0,
            value - 2,
          );

        data[i + 2] =
          Math.max(
            0,
            value - 5,
          );

        data[i + 3] = 255;
      }
    }

    const texture =
      new THREE.DataTexture(
        data,
        size,
        size,
        THREE.RGBAFormat,
      );

    texture.wrapS =
      THREE.RepeatWrapping;

    texture.wrapT =
      THREE.RepeatWrapping;

    texture.repeat.set(
      2.6,
      4.2,
    );

    texture.minFilter =
      THREE.LinearFilter;

    texture.magFilter =
      THREE.LinearFilter;

    texture.colorSpace =
      THREE.SRGBColorSpace;

    texture.needsUpdate =
      true;

    return texture;
  }, []);
  /* PAPER AVATAR TEXTURE END */


  const root = useRef<THREE.Group>(null);

  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);

  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);

  const forearmL = useRef<THREE.Group>(null);
  const forearmR = useRef<THREE.Group>(null);

  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);

  const chefHat = useRef<THREE.Group>(null);
  const apron = useRef<THREE.Mesh>(null);

  const torsoMaterial =
    useRef<THREE.MeshStandardMaterial>(null);

  const lastActorP = useRef(0);
  const movement = useRef(0);

  const targetPosition =
    useMemo(
      () => new THREE.Vector3(),
      [],
    );

  useFrame(({ clock }, dt) => {
    if (!root.current) return;

    const masterP =
      THREE.MathUtils.clamp(
        progress.current,
        0,
        1,
      );

    const p =
      actedProgress(masterP);

    const point =
      joseCurve.getPointAt(p);

    targetPosition.copy(point);

    root.current.position.lerp(
      targetPosition,
      1 - Math.exp(-16 * dt),
    );

    const tangent =
      joseCurve
        .getTangentAt(
          THREE.MathUtils.clamp(
            p,
            0.001,
            0.999,
          ),
        )
        .normalize();

    const targetYaw =
      Math.atan2(
        tangent.x,
        tangent.z,
      );

    root.current.rotation.y =
      THREE.MathUtils.lerp(
        root.current.rotation.y,
        targetYaw,
        1 - Math.exp(-12 * dt),
      );

    const delta =
      Math.abs(
        p - lastActorP.current,
      );

    lastActorP.current = p;

    const targetMovement =
      THREE.MathUtils.clamp(
        delta / Math.max(dt, 0.001) * 7.5,
        0,
        1,
      );

    movement.current =
      THREE.MathUtils.lerp(
        movement.current,
        targetMovement,
        1 - Math.exp(-14 * dt),
      );

    const walk =
      Math.sin(
        clock.elapsedTime * 8.5,
      ) *
      0.6 *
      movement.current;

    const breath =
      Math.sin(
        clock.elapsedTime * 1.45,
      ) * 0.012;

    if (body.current) {
      body.current.position.y =
        1.02 + breath;

      body.current.rotation.x =
        THREE.MathUtils.lerp(
          body.current.rotation.x,
          0,
          1 - Math.exp(-7 * dt),
        );

      body.current.rotation.z =
        THREE.MathUtils.lerp(
          body.current.rotation.z,
          0,
          1 - Math.exp(-7 * dt),
        );
    }

    if (legL.current) {
      legL.current.rotation.x =
        walk;
    }

    if (legR.current) {
      legR.current.rotation.x =
        -walk;
    }

    if (armL.current) {
      armL.current.rotation.x =
        -walk * 0.65;

      armL.current.rotation.z = 0;
    }

    if (armR.current) {
      armR.current.rotation.x =
        walk * 0.65;

      armR.current.rotation.z = 0;
    }

    if (forearmL.current) {
      forearmL.current.rotation.x = 0;
    }

    if (forearmR.current) {
      forearmR.current.rotation.x = 0;
    }

    if (head.current) {
      head.current.rotation.x =
        THREE.MathUtils.lerp(
          head.current.rotation.x,
          0,
          1 - Math.exp(-12 * dt),
        );

      head.current.rotation.y =
        THREE.MathUtils.lerp(
          head.current.rotation.y,
          0,
          1 - Math.exp(-12 * dt),
        );

      head.current.rotation.z =
        THREE.MathUtils.lerp(
          head.current.rotation.z,
          0,
          1 - Math.exp(-12 * dt),
        );
    }

    /*
     * 01–02
     * Cocina.
     * Mira el espacio del que viene.
     */
    const kitchen =
      envelope(
        masterP,
        0.075,
        0.125,
        0.185,
      );

    if (head.current) {
      head.current.rotation.y +=
        -0.32 * kitchen;

      head.current.rotation.x +=
        0.07 * kitchen;
    }

    /*
     * 03
     * Dejar la cocina.
     * Cabeza baja + mano al pecho.
     */
    const leaving =
      envelope(
        masterP,
        0.19,
        0.23,
        0.285,
      );

    if (head.current) {
      head.current.rotation.x +=
        0.22 * leaving;
    }

    if (armR.current) {
      armR.current.rotation.x +=
        -0.78 * leaving;

      armR.current.rotation.z +=
        -0.24 * leaving;
    }

    if (forearmR.current) {
      forearmR.current.rotation.x +=
        -0.85 * leaving;
    }

    /*
     * 04
     * Literatura.
     * Se acerca mentalmente al texto.
     */
    const literature =
      envelope(
        masterP,
        0.29,
        0.355,
        0.425,
      );

    if (head.current) {
      head.current.rotation.y +=
        0.28 * literature;

      head.current.rotation.x +=
        0.06 * literature;
    }

    if (armR.current) {
      armR.current.rotation.x +=
        -0.55 * literature;
    }

    /*
     * 05
     * La pregunta.
     * Casi inmóvil y mira hacia arriba.
     */
    const question =
      envelope(
        masterP,
        0.42,
        0.495,
        0.575,
      );

    if (head.current) {
      head.current.rotation.x +=
        -0.20 * question;
    }

    if (body.current) {
      body.current.rotation.x +=
        -0.025 * question;
    }

    /*
     * 06–07
     * Nace Poema Universal.
     * Gesto de ofrecer / lanzar.
     */
    const launch =
      envelope(
        masterP,
        0.535,
        0.625,
        0.715,
      );

    if (armR.current) {
      armR.current.rotation.x +=
        -1.05 * launch;

      armR.current.rotation.z +=
        -0.14 * launch;
    }

    if (forearmR.current) {
      forearmR.current.rotation.x +=
        -0.45 * launch;
    }

    if (head.current) {
      head.current.rotation.y +=
        0.20 * launch;
    }

    /*
     * FIRST REPLY ACTING · FINAL PASS
     *
     * Antes de que aparezcan muchas voces,
     * José percibe una sola respuesta.
     *
     * No es celebración todavía.
     * Es reconocimiento.
     */
    const firstReply =
      envelope(
        masterP,
        0.682,
        0.705,
        0.744,
      );

    if (head.current) {
      head.current.rotation.y +=
        0.38 * firstReply;

      head.current.rotation.x +=
        -0.075 * firstReply;
    }

    if (body.current) {
      body.current.rotation.z +=
        -0.018 * firstReply;
    }

    if (armR.current) {
      armR.current.rotation.x +=
        -0.10 * firstReply;
    }

    /*
     * 08
     * Primeras voces.
     * La cabeza sigue algo que se multiplica.
     */
    const voices =
      envelope(
        masterP,
        0.742,
        0.79,
        0.855,
      );

    if (head.current) {
      head.current.rotation.y +=
        Math.sin(
          clock.elapsedTime * 1.1,
        ) *
        0.32 *
        voices;

      head.current.rotation.x +=
        -0.05 * voices;
    }

    /*
     * 09–10
     * Diez voces / cincuenta brotes.
     * Brazos ligeramente abiertos.
     */
    const growing =
      envelope(
        masterP,
        0.77,
        0.85,
        0.915,
      );

    if (armL.current) {
      armL.current.rotation.z +=
        0.26 * growing;
    }

    if (armR.current) {
      armR.current.rotation.z +=
        -0.26 * growing;
    }

    /*
     * 11
     * Árbol Blanco.
     * José deja de "hacer".
     * Mira.
     */
    const tree =
      THREE.MathUtils.smoothstep(
        masterP,
        0.875,
        0.94,
      );

    if (head.current) {
      head.current.rotation.x +=
        -0.30 * tree;
    }

    if (armL.current) {
      armL.current.rotation.z +=
        0.12 * tree;
    }

    if (armR.current) {
      armR.current.rotation.z +=
        -0.12 * tree;
    }

    /*
     * Transición cocinero → escritor.
     */
    const writer =
      THREE.MathUtils.smoothstep(
        masterP,
        0.205,
        0.255,
      );

    if (chefHat.current) {
      const s =
        Math.max(
          0.001,
          1 - writer,
        );

      chefHat.current.scale.setScalar(s);

      chefHat.current.visible =
        s > 0.02;
    }

    if (apron.current) {
      apron.current.scale.y =
        Math.max(
          0.001,
          1 - writer,
        );

      apron.current.visible =
        writer < 0.98;
    }

    if (torsoMaterial.current) {
      torsoMaterial.current.color.lerpColors(
        new THREE.Color("#e7dfd0"),
        new THREE.Color("#b79f7e"),
        writer,
      );
    }
  });

  return (
    <group ref={root}>
      <group ref={body}>
        {/* torso */}
        <mesh
          position={[0, 0, 0]}
          castShadow
        >
          <boxGeometry
            args={[
              0.58,
              0.72,
              0.28,
            ]}
          />

          <meshStandardMaterial
        map={paperTexture}
        bumpMap={paperTexture}
        bumpScale={0.018}
            ref={torsoMaterial}
            color="#e7dfd0"
            roughness={0.95}
          />
        </mesh>

        {/* delantal de cocinero */}
        <mesh
          ref={apron}
          position={[
            0,
            -0.04,
            0.155,
          ]}
          castShadow
        >
          <boxGeometry
            args={[
              0.42,
              0.54,
              0.025,
            ]}
          />

          <meshStandardMaterial
        map={paperTexture}
        bumpMap={paperTexture}
        bumpScale={0.018}
            color="#d4c7b1"
            roughness={1}
          />
        </mesh>

        {/* cuello */}
        <mesh
          position={[0, 0.49, 0]}
          castShadow
        >
          <cylinderGeometry
            args={[
              0.11,
              0.12,
              0.2,
              6,
            ]}
          />

          <meshStandardMaterial
        map={paperTexture}
        bumpMap={paperTexture}
        bumpScale={0.018}
            color="#c99571"
            roughness={1}
          />
        </mesh>

        {/* cabeza */}
        <group
          ref={head}
          position={[
            0,
            0.80,
            0,
          ]}
        >
          <mesh castShadow>
            <boxGeometry
              args={[
                0.38,
                0.42,
                0.36,
              ]}
            />

            <meshStandardMaterial
        map={paperTexture}
        bumpMap={paperTexture}
        bumpScale={0.018}
              color="#c99571"
              roughness={1}
            />
          </mesh>

          {/* cabello */}
          <mesh
            position={[
              0,
              0.205,
              -0.025,
            ]}
            castShadow
          >
            <boxGeometry
              args={[
                0.39,
                0.10,
                0.34,
              ]}
            />

            <meshStandardMaterial
        map={paperTexture}
        bumpMap={paperTexture}
        bumpScale={0.018}
              color="#342d29"
              roughness={1}
            />
          </mesh>

          {/* nariz mínima */}
          <mesh
            position={[
              0,
              -0.015,
              0.195,
            ]}
            castShadow
          >
            <boxGeometry
              args={[
                0.055,
                0.075,
                0.07,
              ]}
            />

            <meshStandardMaterial
        map={paperTexture}
        bumpMap={paperTexture}
        bumpScale={0.018}
              color="#b88464"
              roughness={1}
            />
          </mesh>

          {/* gorro */}
          <group
            ref={chefHat}
            position={[
              0,
              0.31,
              0,
            ]}
          >
            <mesh castShadow>
              <cylinderGeometry
                args={[
                  0.20,
                  0.18,
                  0.18,
                  8,
                ]}
              />

              <meshStandardMaterial
        map={paperTexture}
        bumpMap={paperTexture}
        bumpScale={0.018}
                color="#e8dfcf"
                roughness={1}
              />
            </mesh>

            <mesh
              position={[
                0,
                0.12,
                0,
              ]}
              castShadow
            >
              <sphereGeometry
                args={[
                  0.22,
                  8,
                  5,
                ]}
              />

              <meshStandardMaterial
        map={paperTexture}
        bumpMap={paperTexture}
        bumpScale={0.018}
                color="#ede4d5"
                roughness={1}
              />
            </mesh>
          </group>
        </group>

        {/* brazo izquierdo */}
        <group
          ref={armL}
          position={[
            -0.39,
            0.20,
            0,
          ]}
        >
          <mesh
            position={[
              0,
              -0.25,
              0,
            ]}
            castShadow
          >
            <boxGeometry
              args={[
                0.15,
                0.52,
                0.16,
              ]}
            />

            <meshStandardMaterial
        map={paperTexture}
        bumpMap={paperTexture}
        bumpScale={0.018}
              color="#b9a387"
              roughness={1}
            />
          </mesh>

          <group
            ref={forearmL}
            position={[
              0,
              -0.51,
              0,
            ]}
          >
            <mesh
              position={[
                0,
                -0.18,
                0,
              ]}
              castShadow
            >
              <boxGeometry
                args={[
                  0.13,
                  0.38,
                  0.14,
                ]}
              />

              <meshStandardMaterial
        map={paperTexture}
        bumpMap={paperTexture}
        bumpScale={0.018}
                color="#c99571"
                roughness={1}
              />
            </mesh>
          </group>
        </group>

        {/* brazo derecho */}
        <group
          ref={armR}
          position={[
            0.39,
            0.20,
            0,
          ]}
        >
          <mesh
            position={[
              0,
              -0.25,
              0,
            ]}
            castShadow
          >
            <boxGeometry
              args={[
                0.15,
                0.52,
                0.16,
              ]}
            />

            <meshStandardMaterial
        map={paperTexture}
        bumpMap={paperTexture}
        bumpScale={0.018}
              color="#b9a387"
              roughness={1}
            />
          </mesh>

          <group
            ref={forearmR}
            position={[
              0,
              -0.51,
              0,
            ]}
          >
            <mesh
              position={[
                0,
                -0.18,
                0,
              ]}
              castShadow
            >
              <boxGeometry
                args={[
                  0.13,
                  0.38,
                  0.14,
                ]}
              />

              <meshStandardMaterial
        map={paperTexture}
        bumpMap={paperTexture}
        bumpScale={0.018}
                color="#c99571"
                roughness={1}
              />
            </mesh>
          </group>
        </group>
      </group>

      {/* pierna izquierda */}
      <group
        ref={legL}
        position={[
          -0.16,
          0.58,
          0,
        ]}
      >
        <mesh
          position={[
            0,
            -0.29,
            0,
          ]}
          castShadow
        >
          <boxGeometry
            args={[
              0.20,
              0.60,
              0.22,
            ]}
          />

          <meshStandardMaterial
        map={paperTexture}
        bumpMap={paperTexture}
        bumpScale={0.018}
            color="#544a40"
            roughness={1}
          />
        </mesh>

        <mesh
          position={[
            0,
            -0.61,
            0.08,
          ]}
          castShadow
        >
          <boxGeometry
            args={[
              0.22,
              0.12,
              0.38,
            ]}
          />

          <meshStandardMaterial
        map={paperTexture}
        bumpMap={paperTexture}
        bumpScale={0.018}
            color="#372f2a"
            roughness={1}
          />
        </mesh>
      </group>

      {/* pierna derecha */}
      <group
        ref={legR}
        position={[
          0.16,
          0.58,
          0,
        ]}
      >
        <mesh
          position={[
            0,
            -0.29,
            0,
          ]}
          castShadow
        >
          <boxGeometry
            args={[
              0.20,
              0.60,
              0.22,
            ]}
          />

          <meshStandardMaterial
        map={paperTexture}
        bumpMap={paperTexture}
        bumpScale={0.018}
            color="#544a40"
            roughness={1}
          />
        </mesh>

        <mesh
          position={[
            0,
            -0.61,
            0.08,
          ]}
          castShadow
        >
          <boxGeometry
            args={[
              0.22,
              0.12,
              0.38,
            ]}
          />

          <meshStandardMaterial
        map={paperTexture}
        bumpMap={paperTexture}
        bumpScale={0.018}
            color="#372f2a"
            roughness={1}
          />
        </mesh>
      </group>
    </group>
  );
}
