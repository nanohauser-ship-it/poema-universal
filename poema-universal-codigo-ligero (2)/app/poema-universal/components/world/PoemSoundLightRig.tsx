"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const AUDIO_EVENT = "poema-universal:bso-level";
const ACTIVE_POEM_EVENT = "poema-universal:active-poem";

type BsoLevelDetail = {
  playing?: boolean;
  ended?: boolean;
  bass?: number;
  mid?: number;
  air?: number;
  overall?: number;
  progress?: number;
  currentTime?: number;
  duration?: number;
};

type ActivePoemDetail = {
  index?: number;
  open?: boolean;
};

type Levels = {
  playing: boolean;
  ended: boolean;
  bass: number;
  mid: number;
  air: number;
  overall: number;
  progress: number;
  currentTime: number;
  duration: number;
};

const ZERO: Levels = {
  playing: false,
  ended: false,
  bass: 0,
  mid: 0,
  air: 0,
  overall: 0,
  progress: 0,
  currentTime: 0,
  duration: 0,
};

const CHOIR_POSITIONS: [number, number, number][] = [
  [-5.0, 1.05, 3.3],
  [-3.4, 1.35, 2.6],
  [-1.8, 1.55, 2.0],
  [-0.2, 1.95, 1.2],
  [1.4, 2.3, 0.6],
  [2.7, 3.15, -1.1],
  [3.6, 4.3, -3.0],
  [4.2, 5.8, -4.7],
];

const TRAVEL_POINTS = [
  new THREE.Vector3(-5.4, 1.0, 3.5),
  new THREE.Vector3(-3.0, 1.45, 2.35),
  new THREE.Vector3(-0.7, 1.9, 1.45),
  new THREE.Vector3(1.4, 2.7, 0.0),
  new THREE.Vector3(2.9, 3.7, -2.0),
  new THREE.Vector3(4.2, 6.7, -5.2),
];

function clamp01(value: number) {
  return THREE.MathUtils.clamp(value, 0, 1);
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const x = clamp01((value - edge0) / Math.max(0.0001, edge1 - edge0));
  return x * x * (3 - 2 * x);
}

function windowEnvelope(
  progress: number,
  start: number,
  fadeInEnd: number,
  fadeOutStart: number,
  end: number
) {
  const incoming = smoothstep(start, fadeInEnd, progress);
  const outgoing = 1 - smoothstep(fadeOutStart, end, progress);
  return clamp01(incoming * outgoing);
}

function dampLight(
  light: THREE.Light | null,
  target: number,
  delta: number,
  speed = 3.2
) {
  if (!light) return;
  light.intensity = THREE.MathUtils.damp(light.intensity, target, speed, delta);
}

export default function PoemSoundLightRig() {
  const lowerRef = useRef<THREE.PointLight | null>(null);
  const humanRef = useRef<THREE.PointLight | null>(null);
  const crownRef = useRef<THREE.PointLight | null>(null);
  const memoryRef = useRef<THREE.PointLight | null>(null);
  const treeRef = useRef<THREE.PointLight | null>(null);
  const travellerRef = useRef<THREE.PointLight | null>(null);
  const voiceRef = useRef<THREE.PointLight | null>(null);
  const choirRefs = useRef<Array<THREE.PointLight | null>>([]);

  const levelsRef = useRef<Levels>({ ...ZERO });
  const afterglowRef = useRef(0);
  const memoryAccumRef = useRef(0);
  const singularPulseRef = useRef(0);
  const voicePulseRef = useRef(0);
  const activeVoiceRef = useRef(0);
  const finalVoiceRef = useRef(0);
  const previousTimeRef = useRef(0);

  const travelCurve = useMemo(
    () => new THREE.CatmullRomCurve3(TRAVEL_POINTS, false, "catmullrom", 0.36),
    []
  );

  useEffect(() => {
    const onLevel: EventListener = (event) => {
      const detail = (event as CustomEvent<BsoLevelDetail>).detail ?? {};
      levelsRef.current = {
        playing: Boolean(detail.playing),
        ended: Boolean(detail.ended),
        bass: clamp01(detail.bass ?? 0),
        mid: clamp01(detail.mid ?? 0),
        air: clamp01(detail.air ?? 0),
        overall: clamp01(detail.overall ?? 0),
        progress: clamp01(detail.progress ?? 0),
        currentTime: Math.max(0, detail.currentTime ?? 0),
        duration: Math.max(0, detail.duration ?? 0),
      };
    };

    const onActivePoem: EventListener = (event) => {
      const detail = (event as CustomEvent<ActivePoemDetail>).detail ?? {};
      if (detail.open === false) return;
      const index = Math.max(0, Math.floor(detail.index ?? 0));
      activeVoiceRef.current = index;
      voicePulseRef.current = 1;
      if (index >= 59) finalVoiceRef.current = 1;
    };

    window.addEventListener(AUDIO_EVENT, onLevel);
    window.addEventListener(ACTIVE_POEM_EVENT, onActivePoem);

    return () => {
      window.removeEventListener(AUDIO_EVENT, onLevel);
      window.removeEventListener(ACTIVE_POEM_EVENT, onActivePoem);
    };
  }, []);

  useFrame(({ clock }, delta) => {
    const level = levelsRef.current;
    const t = clock.elapsedTime;
    const p = level.progress;

    if (level.playing && level.currentTime < 1.25 && p < 0.01) {
      memoryAccumRef.current = 0;
      finalVoiceRef.current = 0;
    }

    if (level.playing) {
      afterglowRef.current = Math.max(
        afterglowRef.current * Math.exp(-delta * 0.8),
        level.overall * 0.92
      );
      memoryAccumRef.current = clamp01(
        memoryAccumRef.current +
          delta * (0.00125 + level.overall * 0.0038) * (0.55 + p * 0.9)
      );
    } else {
      afterglowRef.current = Math.max(0, afterglowRef.current - delta * 0.055);
    }

    const previousTime = previousTimeRef.current;
    if (level.playing) {
      const singularTimes = [113.0, 193.5];
      for (const moment of singularTimes) {
        if (previousTime < moment && level.currentTime >= moment) {
          singularPulseRef.current = 1;
        }
      }
      previousTimeRef.current = level.currentTime;
    } else if (level.currentTime < previousTime - 2) {
      previousTimeRef.current = level.currentTime;
    }

    singularPulseRef.current = Math.max(
      0,
      singularPulseRef.current - delta * 0.38
    );
    voicePulseRef.current = Math.max(0, voicePulseRef.current - delta * 0.34);
    finalVoiceRef.current = Math.max(0, finalVoiceRef.current - delta * 0.018);

    const opening = 1 - smoothstep(0.08, 0.2, p);
    const gathering = windowEnvelope(p, 0.08, 0.18, 0.48, 0.62);
    const body = windowEnvelope(p, 0.22, 0.34, 0.57, 0.69);
    const suspension = windowEnvelope(p, 0.53, 0.61, 0.7, 0.76);
    const convergence = smoothstep(0.7, 0.86, p);
    const finalReturn = smoothstep(0.88, 0.98, p);

    const life = level.playing ? 1 : afterglowRef.current;
    const lowTarget = level.playing
      ? 0.08 + level.bass * (1.2 + body * 1.55)
      : afterglowRef.current * 0.28;

    const humanBreath = 0.5 + Math.sin(t * 0.62) * 0.5;
    const humanTarget = level.playing
      ? 0.06 +
        level.mid * (0.62 + gathering * 1.1) +
        humanBreath * level.overall * 0.22
      : afterglowRef.current * 0.32;

    const crownTarget = level.playing
      ? 0.04 +
        level.air * (0.46 + convergence * 1.48) +
        singularPulseRef.current * 0.42
      : afterglowRef.current * 0.38;

    const memoryTarget =
      afterglowRef.current * 0.34 +
      life * memoryAccumRef.current * (0.25 + p * 0.72) +
      singularPulseRef.current * 0.6;

    const treeTarget =
      afterglowRef.current * 0.52 +
      life * memoryAccumRef.current * (0.38 + convergence * 1.12) +
      convergence * level.air * 0.9 +
      finalReturn * level.overall * 0.62 +
      finalVoiceRef.current * 1.35;

    dampLight(lowerRef.current, lowTarget, delta, 3.2);
    dampLight(humanRef.current, humanTarget, delta, 2.7);
    dampLight(crownRef.current, crownTarget, delta, 2.35);
    dampLight(memoryRef.current, memoryTarget, delta, 1.55);
    dampLight(treeRef.current, treeTarget, delta, 1.25);

    // Coro de luz: ocho zonas representan grupos de voces. Nunca parpadean a la vez.
    choirRefs.current.forEach((light, index) => {
      if (!light) return;
      const travellingWave =
        0.5 +
        0.5 * Math.sin(t * 0.56 - index * 0.82 - p * Math.PI * 7.5);
      const phaseGate = gathering * 0.72 + convergence * 0.88 + finalReturn * 0.28;
      const target = level.playing
        ? level.mid * phaseGate * (0.12 + travellingWave * 0.56)
        : afterglowRef.current * 0.08;
      dampLight(light, target, delta, 2.15);
    });

    // Luz que atraviesa las terrazas y termina en el Árbol.
    const travelProgress = clamp01(p * 0.98);
    if (travellerRef.current) {
      const position = travelCurve.getPointAt(travelProgress);
      travellerRef.current.position.copy(position);
      const travellerTarget = level.playing
        ? level.overall * (gathering * 0.5 + convergence * 0.82) +
          singularPulseRef.current * 1.65
        : 0;
      dampLight(travellerRef.current, travellerTarget, delta, 3.0);
    }

    // Cada cambio de poema deja una entrega breve de luz en la escena.
    if (voiceRef.current) {
      const position = CHOIR_POSITIONS[activeVoiceRef.current % CHOIR_POSITIONS.length];
      if (position) {
        voiceRef.current.position.set(position[0], position[1] + 0.42, position[2]);
      }
      const target = voicePulseRef.current * (level.playing ? 1.6 : 0.85);
      dampLight(voiceRef.current, target, delta, 4.0);
    }

    // Durante la suspensión, el mundo se contiene: se atenúan los estratos bajos,
    // pero la memoria y el Árbol permanecen. No se altera ninguna luz original.
    if (suspension > 0.02) {
      if (lowerRef.current) lowerRef.current.intensity *= 1 - suspension * 0.28;
      if (humanRef.current) humanRef.current.intensity *= 1 - suspension * 0.17;
    }

    if (opening > 0.4 && level.playing && memoryRef.current) {
      memoryRef.current.intensity *= 0.72 + opening * 0.12;
    }
  });

  return (
    <group name="poema-sound-light-rig-v2">
      <pointLight
        ref={lowerRef}
        position={[-1.1, 1.15, 3.1]}
        color="#b96f28"
        intensity={0}
        distance={9}
        decay={2}
      />

      <pointLight
        ref={humanRef}
        position={[1.4, 2.9, 0.7]}
        color="#d99a51"
        intensity={0}
        distance={10}
        decay={2}
      />

      <pointLight
        ref={crownRef}
        position={[4.0, 7.5, -5.2]}
        color="#ffe1ad"
        intensity={0}
        distance={9.5}
        decay={2}
      />

      <pointLight
        ref={memoryRef}
        position={[-4.0, 4.2, -1.9]}
        color="#d39b57"
        intensity={0}
        distance={13}
        decay={2}
      />

      <pointLight
        ref={treeRef}
        position={[4.25, 7.1, -5.35]}
        color="#fff0c7"
        intensity={0}
        distance={8.5}
        decay={2}
      />

      <pointLight
        ref={travellerRef}
        position={TRAVEL_POINTS[0]}
        color="#e1aa61"
        intensity={0}
        distance={4.4}
        decay={2}
      />

      <pointLight
        ref={voiceRef}
        position={CHOIR_POSITIONS[0]}
        color="#efbb70"
        intensity={0}
        distance={3.4}
        decay={2}
      />

      {CHOIR_POSITIONS.map((position, index) => (
        <pointLight
          key={index}
          ref={(light) => {
            choirRefs.current[index] = light;
          }}
          position={position}
          color={index > 5 ? "#ffe0aa" : "#d99b55"}
          intensity={0}
          distance={3.6}
          decay={2}
        />
      ))}
    </group>
  );
}
