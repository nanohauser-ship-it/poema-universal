"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const AUDIO_EVENT = "poema-universal:bso-level";

type BsoLevelDetail = {
  playing?: boolean;
  bass?: number;
  mid?: number;
  air?: number;
  overall?: number;
};

type Levels = {
  playing: boolean;
  bass: number;
  mid: number;
  air: number;
  overall: number;
};

const ZERO: Levels = {
  playing: false,
  bass: 0,
  mid: 0,
  air: 0,
  overall: 0,
};

function dampLight(
  light: THREE.Light | null,
  target: number,
  delta: number,
  speed = 4.2
) {
  if (!light) return;
  light.intensity = THREE.MathUtils.damp(
    light.intensity,
    target,
    speed,
    delta
  );
}

export default function PoemSoundLightRig() {
  const lowerRef = useRef<THREE.PointLight | null>(null);
  const humanRef = useRef<THREE.PointLight | null>(null);
  const crownRef = useRef<THREE.PointLight | null>(null);
  const memoryRef = useRef<THREE.PointLight | null>(null);
  const levelsRef = useRef<Levels>({ ...ZERO });

  useEffect(() => {
    const onLevel: EventListener = (event) => {
      const detail = (event as CustomEvent<BsoLevelDetail>).detail ?? {};
      levelsRef.current = {
        playing: Boolean(detail.playing),
        bass: THREE.MathUtils.clamp(detail.bass ?? 0, 0, 1),
        mid: THREE.MathUtils.clamp(detail.mid ?? 0, 0, 1),
        air: THREE.MathUtils.clamp(detail.air ?? 0, 0, 1),
        overall: THREE.MathUtils.clamp(detail.overall ?? 0, 0, 1),
      };
    };

    window.addEventListener(AUDIO_EVENT, onLevel);
    return () => window.removeEventListener(AUDIO_EVENT, onLevel);
  }, []);

  useFrame(({ clock }, delta) => {
    const level = levelsRef.current;
    const t = clock.elapsedTime;

    if (!level.playing) {
      dampLight(lowerRef.current, 0, delta);
      dampLight(humanRef.current, 0, delta);
      dampLight(crownRef.current, 0, delta);
      dampLight(memoryRef.current, 0, delta);
      return;
    }

    // El grave ilumina la materia baja; no hace parpadear la escena.
    const lowTarget = 0.28 + level.bass * 3.15;

    // La zona humana responde a medios y respiración, con una deriva muy lenta.
    const humanBreath = 0.5 + Math.sin(t * 0.72) * 0.5;
    const humanTarget =
      0.12 + level.mid * 2.0 + humanBreath * level.overall * 0.34;

    // Los agudos abren la estructura superior con mucha contención.
    const crownTarget = 0.08 + level.air * 1.7 + level.overall * 0.38;

    // Una luz de memoria cruza toda la escena y tarda más en reaccionar.
    const memoryTarget = 0.05 + level.overall * 1.25;

    dampLight(lowerRef.current, lowTarget, delta, 3.8);
    dampLight(humanRef.current, humanTarget, delta, 3.1);
    dampLight(crownRef.current, crownTarget, delta, 2.7);
    dampLight(memoryRef.current, memoryTarget, delta, 1.8);
  });

  return (
    <group name="poema-sound-light-rig">
      <pointLight
        ref={lowerRef}
        position={[-1.1, 1.15, 3.1]}
        color="#c57c2d"
        intensity={0}
        distance={9}
        decay={2}
      />

      <pointLight
        ref={humanRef}
        position={[1.8, 3.1, 0.8]}
        color="#e0a55b"
        intensity={0}
        distance={10}
        decay={2}
      />

      <pointLight
        ref={crownRef}
        position={[4.0, 7.5, -5.2]}
        color="#ffe1aa"
        intensity={0}
        distance={9}
        decay={2}
      />

      <pointLight
        ref={memoryRef}
        position={[-4.5, 4.6, -2.8]}
        color="#d8a35f"
        intensity={0}
        distance={12}
        decay={2}
      />
    </group>
  );
}
