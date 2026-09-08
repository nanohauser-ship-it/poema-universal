"use client";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { MutableRefObject } from "react";
import { joseCurve } from "./curves";

type Props = {
  progress: MutableRefObject<number>;
};

export function JoseActor({ progress }: Props) {
  const root = useRef<THREE.Group>(null);
  const actor = useRef<THREE.Group>(null);

  const chefBody = useRef<THREE.Mesh>(null);
  const writerBody = useRef<THREE.Mesh>(null);
  const hat = useRef<THREE.Group>(null);
  const apron = useRef<THREE.Mesh>(null);

  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);

  const previousProgress = useRef(0);
  const motionEnergy = useRef(0);

  useFrame(({ clock }, dt) => {
    if (!root.current || !actor.current) return;

    const p = THREE.MathUtils.clamp(progress.current, 0, 1);
    const point = joseCurve.getPointAt(p);

    root.current.position.lerp(
      point,
      1 - Math.exp(-9 * dt),
    );

    const movement = Math.abs(
      p - previousProgress.current,
    );

    previousProgress.current = p;

    const targetEnergy = THREE.MathUtils.clamp(
      movement * 500,
      0,
      1,
    );

    motionEnergy.current = THREE.MathUtils.lerp(
      motionEnergy.current,
      targetEnergy,
      1 - Math.exp(-8 * dt),
    );

    const phase = clock.elapsedTime * 8;

    const stride =
      Math.sin(phase) *
      0.38 *
      motionEnergy.current;

    const bob =
      Math.abs(Math.sin(phase)) *
      0.055 *
      motionEnergy.current;

    actor.current.position.y = bob;

    const transitionFocus = Math.exp(
      -Math.pow((p - 0.23) / 0.028, 2),
    );

    actor.current.rotation.y = THREE.MathUtils.lerp(
      actor.current.rotation.y,
      -0.38 * transitionFocus,
      1 - Math.exp(-7 * dt),
    );

    actor.current.rotation.z =
      Math.sin(phase * 0.5) *
      0.018 *
      motionEnergy.current;

    if (leftLeg.current) {
      leftLeg.current.rotation.x = stride;
    }

    if (rightLeg.current) {
      rightLeg.current.rotation.x = -stride;
    }

    if (leftArm.current) {
      leftArm.current.rotation.x =
        -stride * 0.72;
    }

    if (rightArm.current) {
      rightArm.current.rotation.x =
        stride * 0.72;

      rightArm.current.rotation.z =
        -transitionFocus * 0.75;
    }

    const chef = p < 0.23;

    if (chefBody.current) {
      chefBody.current.visible = chef;
    }

    if (writerBody.current) {
      writerBody.current.visible = !chef;
    }

    if (hat.current) {
      hat.current.visible = chef;
    }

    if (apron.current) {
      apron.current.visible = chef;
    }
  });

  return (
    <group ref={root}>
      <group ref={actor}>

        <group position={[0, 1.73, 0]}>
          <mesh
            castShadow
            scale={[1, 1.08, 0.72]}
          >
            <sphereGeometry args={[0.27, 20, 14]} />
            <meshStandardMaterial
              color="#cda27e"
              roughness={1}
            />
          </mesh>

          <mesh
            position={[0, 0.15, -0.17]}
            scale={[0.95, 0.5, 0.62]}
            castShadow
          >
            <sphereGeometry args={[0.25, 16, 10]} />
            <meshStandardMaterial
              color="#58483d"
              roughness={1}
            />
          </mesh>

          <mesh position={[-0.09, 0.03, 0.19]}>
            <sphereGeometry args={[0.018, 8, 6]} />
            <meshBasicMaterial color="#3d342f" />
          </mesh>

          <mesh position={[0.09, 0.03, 0.19]}>
            <sphereGeometry args={[0.018, 8, 6]} />
            <meshBasicMaterial color="#3d342f" />
          </mesh>

          <group ref={hat} position={[0, 0.34, 0]}>
            <mesh castShadow>
              <cylinderGeometry
                args={[0.2, 0.22, 0.17, 16]}
              />
              <meshStandardMaterial
                color="#efe9de"
                roughness={1}
              />
            </mesh>

            <mesh
              position={[-0.12, 0.13, 0]}
              scale={[0.68, 0.75, 0.58]}
            >
              <sphereGeometry args={[0.19, 14, 10]} />
              <meshStandardMaterial
                color="#f2ede3"
                roughness={1}
              />
            </mesh>

            <mesh
              position={[0.09, 0.15, 0]}
              scale={[0.75, 0.85, 0.62]}
            >
              <sphereGeometry args={[0.2, 14, 10]} />
              <meshStandardMaterial
                color="#f2ede3"
                roughness={1}
              />
            </mesh>
          </group>
        </group>

        <mesh
          ref={chefBody}
          position={[0, 1.08, 0]}
          castShadow
        >
          <boxGeometry args={[0.7, 0.9, 0.24]} />
          <meshStandardMaterial
            color="#eee9de"
            roughness={1}
          />
        </mesh>

        <mesh
          ref={writerBody}
          position={[0, 1.08, 0]}
          castShadow
          visible={false}
        >
          <boxGeometry args={[0.66, 0.88, 0.24]} />
          <meshStandardMaterial
            color="#796452"
            roughness={1}
          />
        </mesh>

        <mesh
          ref={apron}
          position={[0, 1.0, 0.135]}
          castShadow
        >
          <planeGeometry args={[0.54, 0.66]} />
          <meshStandardMaterial
            color="#f4f0e8"
            roughness={1}
            side={THREE.DoubleSide}
          />
        </mesh>

        <group
          ref={leftArm}
          position={[-0.43, 1.25, 0]}
        >
          <mesh position={[0, -0.3, 0]} castShadow>
            <capsuleGeometry args={[0.09, 0.48, 6, 10]} />
            <meshStandardMaterial
              color="#cda27e"
              roughness={1}
            />
          </mesh>
        </group>

        <group
          ref={rightArm}
          position={[0.43, 1.25, 0]}
        >
          <mesh position={[0, -0.3, 0]} castShadow>
            <capsuleGeometry args={[0.09, 0.48, 6, 10]} />
            <meshStandardMaterial
              color="#cda27e"
              roughness={1}
            />
          </mesh>
        </group>

        <group
          ref={leftLeg}
          position={[-0.18, 0.68, 0]}
        >
          <mesh position={[0, -0.35, 0]} castShadow>
            <capsuleGeometry args={[0.1, 0.58, 6, 10]} />
            <meshStandardMaterial
              color="#45413e"
              roughness={1}
            />
          </mesh>

          <mesh
            position={[0, -0.72, 0.08]}
            scale={[1.3, 0.7, 1.8]}
            castShadow
          >
            <sphereGeometry args={[0.12, 10, 8]} />
            <meshStandardMaterial
              color="#383431"
              roughness={1}
            />
          </mesh>
        </group>

        <group
          ref={rightLeg}
          position={[0.18, 0.68, 0]}
        >
          <mesh position={[0, -0.35, 0]} castShadow>
            <capsuleGeometry args={[0.1, 0.58, 6, 10]} />
            <meshStandardMaterial
              color="#45413e"
              roughness={1}
            />
          </mesh>

          <mesh
            position={[0, -0.72, 0.08]}
            scale={[1.3, 0.7, 1.8]}
            castShadow
          >
            <sphereGeometry args={[0.12, 10, 8]} />
            <meshStandardMaterial
              color="#383431"
              roughness={1}
            />
          </mesh>
        </group>

      </group>
    </group>
  );
}
