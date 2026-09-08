"use client";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  MutableRefObject,
  useRef,
} from "react";
import { joseCurve } from "./curves";

type Props = {
  progress: MutableRefObject<number>;
};

function PaperHead() {
  return (
    <group>
      <mesh castShadow scale={[1, 1.08, 0.72]}>
        <sphereGeometry args={[0.27, 20, 14]} />
        <meshStandardMaterial
          color="#cda27e"
          roughness={1}
        />
      </mesh>

      <mesh
        position={[0, 0.14, -0.17]}
        scale={[0.95, 0.48, 0.6]}
        castShadow
      >
        <sphereGeometry args={[0.25, 16, 10]} />
        <meshStandardMaterial
          color="#59483d"
          roughness={1}
        />
      </mesh>

      <mesh position={[-0.09, 0.03, 0.19]}>
        <sphereGeometry args={[0.018, 8, 6]} />
        <meshBasicMaterial color="#3f352f" />
      </mesh>

      <mesh position={[0.09, 0.03, 0.19]}>
        <sphereGeometry args={[0.018, 8, 6]} />
        <meshBasicMaterial color="#3f352f" />
      </mesh>
    </group>
  );
}

function ChefHat({
  visible,
}: {
  visible: boolean;
}) {
  if (!visible) return null;

  return (
    <group position={[0, 0.31, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.19, 0.21, 0.17, 16]} />
        <meshStandardMaterial
          color="#eee8dc"
          roughness={1}
        />
      </mesh>

      <mesh
        position={[-0.12, 0.12, 0]}
        scale={[0.65, 0.7, 0.55]}
      >
        <sphereGeometry args={[0.18, 14, 10]} />
        <meshStandardMaterial
          color="#f1ece2"
          roughness={1}
        />
      </mesh>

      <mesh
        position={[0.08, 0.15, 0]}
        scale={[0.72, 0.82, 0.6]}
      >
        <sphereGeometry args={[0.19, 14, 10]} />
        <meshStandardMaterial
          color="#f1ece2"
          roughness={1}
        />
      </mesh>

      <mesh
        position={[0.2, 0.08, 0]}
        scale={[0.55, 0.6, 0.5]}
      >
        <sphereGeometry args={[0.17, 14, 10]} />
        <meshStandardMaterial
          color="#eee8dc"
          roughness={1}
        />
      </mesh>
    </group>
  );
}

export function Jose({ progress }: Props) {
  const root = useRef<THREE.Group>(null);
  const actor = useRef<THREE.Group>(null);

  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);

  const chefBody = useRef<THREE.Mesh>(null);
  const writerBody = useRef<THREE.Mesh>(null);

  const previousProgress = useRef(0);
  const motionEnergy = useRef(0);

  useFrame(({ clock }, dt) => {
    if (!root.current || !actor.current) return;

    const p = THREE.MathUtils.clamp(
      progress.current,
      0,
      1,
    );

    const point = joseCurve.getPointAt(p);

    root.current.position.lerp(
      point,
      1 - Math.exp(-9 * dt),
    );

    const deltaProgress =
      Math.abs(p - previousProgress.current);

    previousProgress.current = p;

    const targetMotion =
      THREE.MathUtils.clamp(
        deltaProgress * 450,
        0,
        1,
      );

    motionEnergy.current = THREE.MathUtils.lerp(
      motionEnergy.current,
      targetMotion,
      1 - Math.exp(-8 * dt),
    );

    const walk =
      Math.sin(clock.elapsedTime * 8) *
      0.38 *
      motionEnergy.current;

    const bob =
      Math.abs(Math.sin(clock.elapsedTime * 8)) *
      0.055 *
      motionEnergy.current;

    actor.current.position.y = bob;

    actor.current.rotation.z =
      Math.sin(clock.elapsedTime * 4) *
      0.018 *
      motionEnergy.current;

    if (leftLeg.current) {
      leftLeg.current.rotation.x = walk;
    }

    if (rightLeg.current) {
      rightLeg.current.rotation.x = -walk;
    }

    if (leftArm.current) {
      leftArm.current.rotation.x = -walk * 0.75;
    }

    if (rightArm.current) {
      rightArm.current.rotation.x = walk * 0.75;
    }

    const chef = p < 0.23;

    if (chefBody.current) {
      chefBody.current.visible = chef;
    }

    if (writerBody.current) {
      writerBody.current.visible = !chef;
    }
  });

  const chef = progress.current < 0.23;

  return (
    <group ref={root}>
      <group
        ref={actor}
        rotation={[0, 0, 0]}
      >
        <group position={[0, 1.72, 0]}>
          <PaperHead />
          <ChefHat visible={chef} />
        </group>

        <mesh
          ref={chefBody}
          position={[0, 1.08, 0]}
          castShadow
        >
          <boxGeometry args={[0.68, 0.9, 0.24]} />
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
          <boxGeometry args={[0.65, 0.88, 0.24]} />
          <meshStandardMaterial
            color="#826b57"
            roughness={1}
          />
        </mesh>

        <group
          ref={leftArm}
          position={[-0.42, 1.22, 0]}
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
          position={[0.42, 1.22, 0]}
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
              color="#3d3835"
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
              color="#3d3835"
              roughness={1}
            />
          </mesh>
        </group>

        <mesh
          position={[0, 1.08, 0.135]}
        >
          <circleGeometry args={[0.035, 12]} />
          <meshBasicMaterial color="#52473f" />
        </mesh>

        <mesh
          position={[0, 0.94, 0.135]}
        >
          <circleGeometry args={[0.035, 12]} />
          <meshBasicMaterial color="#52473f" />
        </mesh>
      </group>
    </group>
  );
}
