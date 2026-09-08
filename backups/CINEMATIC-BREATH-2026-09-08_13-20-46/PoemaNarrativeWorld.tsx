"use client";

import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { cameraCurve, getCameraRotation } from "./curves";
import { JoseActorActing } from "./JoseActorActing";
import { StoryWorld } from "./StoryWorld";
import { playerStore, PLAYER_DURATION } from "./playerStore";
import { MASTER_DURATION, masterTimeline } from "./MasterTimeline";

type Props = {
  filmMode?: boolean;
};

export function PoemaNarrativeWorld({ filmMode = false }: Props) {
  const { camera } = useThree();

  const progress = useRef(0);
  const targetProgress = useRef(0);
  const autoTime = useRef(0);

  const mouse = useRef(new THREE.Vector2());
  const rotationBuffer = useRef(new THREE.Quaternion());

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = 35;
      camera.near = 0.1;
      camera.far = 300;
      camera.updateProjectionMatrix();
    }

    const onWheel = (event: WheelEvent) => {
      if (filmMode) return;

      const amount = THREE.MathUtils.clamp(
        Math.abs(event.deltaY) / 700,
        0.003,
        0.035,
      );

      targetProgress.current = THREE.MathUtils.clamp(
        targetProgress.current + Math.sign(event.deltaY) * amount,
        0,
        1,
      );
    };

    const onPointerMove = (event: PointerEvent) => {
      mouse.current.x =
        (event.clientX / window.innerWidth) * 2 - 1;

      mouse.current.y =
        (event.clientY / window.innerHeight) * 2 - 1;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "r") {
        progress.current = 0;
        targetProgress.current = 0;
        autoTime.current = 0;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [camera, filmMode]);

  useFrame((_, dt) => {
    if (filmMode) {
      autoTime.current += dt;

      targetProgress.current = THREE.MathUtils.clamp(
        autoTime.current / 105,
        0,
        1,
      );
    }

    progress.current = THREE.MathUtils.lerp(
      progress.current,
      targetProgress.current,
      1 - Math.exp(-6 * dt),
    );

    
    /* MASTER TIMELINE START */
    if (!filmMode) {
      if (
        masterTimeline.restartRequested
      ) {
        masterTimeline.restartRequested =
          false;

        masterTimeline.progress = 0;
        masterTimeline.elapsed = 0;
        masterTimeline.seekRequested = null;
        masterTimeline.playing = true;

        progress.current = 0;
        targetProgress.current = 0;

        window.scrollTo({
          top: 0,
          behavior: "instant",
        });
      }

      if (
        masterTimeline.seekRequested
          !== null
      ) {
        const requested =
          THREE.MathUtils.clamp(
            masterTimeline.seekRequested,
            0,
            1,
          );

        masterTimeline.seekRequested =
          null;

        masterTimeline.progress =
          requested;

        masterTimeline.elapsed =
          requested *
          MASTER_DURATION;

        progress.current =
          requested;

        targetProgress.current =
          requested;
      }

      if (
        masterTimeline.playing
      ) {
        masterTimeline.elapsed +=
          dt *
          masterTimeline.speed;

        const automaticProgress =
          THREE.MathUtils.clamp(
            masterTimeline.elapsed /
              MASTER_DURATION,
            0,
            1,
          );

        masterTimeline.progress =
          automaticProgress;

        progress.current =
          automaticProgress;

        targetProgress.current =
          automaticProgress;

        if (
          automaticProgress >=
            0.999999
        ) {
          masterTimeline.progress = 1;
          masterTimeline.elapsed =
            MASTER_DURATION;

          masterTimeline.playing =
            false;

          progress.current = 1;
          targetProgress.current = 1;
        }
      } else {
        const pausedProgress =
          THREE.MathUtils.clamp(
            masterTimeline.progress,
            0,
            1,
          );

        progress.current =
          pausedProgress;

        targetProgress.current =
          pausedProgress;
      }
    } else {
      masterTimeline.progress =
        THREE.MathUtils.clamp(
          progress.current,
          0,
          1,
        );

      masterTimeline.elapsed =
        masterTimeline.progress *
        MASTER_DURATION;
    }
    /* MASTER TIMELINE END */

    const p = THREE.MathUtils.clamp(progress.current, 0, 1);

    const point = cameraCurve.getPointAt(p);

    const desiredPosition = point.clone();

    desiredPosition.x += mouse.current.x * 0.09;
    desiredPosition.y += -mouse.current.y * 0.06;

    camera.position.lerp(
      desiredPosition,
      1 - Math.exp(-7 * dt),
    );

    const targetRotation = getCameraRotation(p);

    rotationBuffer.current.slerp(
      targetRotation,
      1 - Math.exp(-5 * dt),
    );

    const mouseQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        -mouse.current.y * 0.018,
        -mouse.current.x * 0.025,
        0,
      ),
    );

    camera.quaternion.copy(
      rotationBuffer.current.clone().multiply(mouseQuaternion),
    );
  });

  return (
    <>
      <ambientLight intensity={1.1} />

      <directionalLight
        position={[25, 20, 12]}
        intensity={2.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <hemisphereLight
        intensity={1.0}
        color="#fff3dd"
        groundColor="#6f5c47"
      />

      <StoryWorld progress={progress} />
      <JoseActorActing progress={progress} />
    </>
  );
}
