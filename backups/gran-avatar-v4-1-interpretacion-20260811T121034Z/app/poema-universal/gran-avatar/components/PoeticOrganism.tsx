"use client";

import { useAspect, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { avatarVoiceSignal } from "../lib/avatarVoiceSignal";
import type { AvatarPresenceState } from "../types";
import styles from "../gran-avatar.module.css";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uBreath;
  uniform float uThinking;
  uniform vec2 uGaze;

  float ellipseMask(vec2 point, vec2 center, vec2 radius) {
    vec2 position = (point - center) / radius;
    return 1.0 - smoothstep(0.65, 1.0, dot(position, position));
  }

  void main() {
    vUv = uv;
    vec3 transformed = position;
    float chest = ellipseMask(uv, vec2(0.5, 0.14), vec2(0.31, 0.28));
    float head = ellipseMask(uv, vec2(0.5, 0.57), vec2(0.19, 0.35));
    float slowDrift = sin(uTime * 0.31) * 0.0028;

    transformed.y += chest * uBreath * 0.009;
    transformed.y += head * (slowDrift - uThinking * 0.006);
    transformed.x += head * (uGaze.x * 0.005 + sin(uTime * 0.19) * 0.0018);
    transformed.z += chest * uBreath * 0.012;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uMap;
  uniform float uTime;
  uniform float uBlink;
  uniform float uVoice;
  uniform float uListening;
  uniform float uThinking;
  uniform vec2 uGaze;

  float ellipseMask(vec2 point, vec2 center, vec2 radius) {
    vec2 position = (point - center) / radius;
    return 1.0 - smoothstep(0.66, 1.0, dot(position, position));
  }

  float random(vec2 point) {
    return fract(sin(dot(point, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;
    float head = ellipseMask(uv, vec2(0.5, 0.57), vec2(0.2, 0.36));
    uv += uGaze * head * vec2(0.0022, 0.0014);

    vec2 leftEye = vec2(0.457, 0.652);
    vec2 rightEye = vec2(0.541, 0.652);
    float leftEyeMask = ellipseMask(uv, leftEye, vec2(0.033, 0.022));
    float rightEyeMask = ellipseMask(uv, rightEye, vec2(0.033, 0.022));
    float eyeMask = max(leftEyeMask, rightEyeMask);
    float eyeCenter = mix(leftEye.y, rightEye.y, step(0.5, uv.x));
    float eyelidDirection = sign(uv.y - eyeCenter);
    uv.y = mix(
      uv.y,
      eyeCenter + eyelidDirection * 0.0025,
      eyeMask * uBlink * 0.82
    );

    vec2 mouthCenter = vec2(0.5, 0.505);
    float mouthMask = ellipseMask(uv, mouthCenter, vec2(0.049, 0.035));
    float mouthDirection = sign(uv.y - mouthCenter.y);
    uv.y -= mouthDirection * mouthMask * uVoice * 0.0105;

    vec4 color = texture2D(uMap, clamp(uv, 0.001, 0.999));
    float mouthOpening = ellipseMask(
      vUv,
      mouthCenter,
      vec2(0.031 + uVoice * 0.007, 0.003 + uVoice * 0.009)
    );
    color.rgb *= 1.0 - mouthOpening * uVoice * 0.48;

    float eyeQuiet = eyeMask * uBlink * 0.12;
    color.rgb *= 1.0 - eyeQuiet;

    float vignette = 1.0 - smoothstep(0.22, 0.82, distance(vUv, vec2(0.5)));
    float amber = ellipseMask(vUv, vec2(0.34, 0.57), vec2(0.48, 0.72));
    color.rgb *= mix(0.72, 1.02, vignette);
    color.rgb += vec3(0.032, 0.016, 0.003) * amber * (0.42 + uListening * 0.34);
    color.rgb *= 1.0 - uThinking * 0.07;

    float grain = random(vUv * vec2(1920.0, 1080.0) + uTime * 0.13) - 0.5;
    color.rgb += grain * 0.012;
    gl_FragColor = vec4(color.rgb, 1.0);
  }
`;

type PortraitPlaneProps = {
  portraitUrl: string;
  reducedMotion: boolean;
  state: AvatarPresenceState;
};

function PortraitPlane({
  portraitUrl,
  reducedMotion,
  state,
}: PortraitPlaneProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const sourceTexture = useTexture(portraitUrl);
  const scale = useAspect(1920, 1080, 1.04);
  const nextBlinkAt = useRef(2.6);
  const blinkStartedAt = useRef<number | null>(null);

  const texture = useMemo(() => {
    const preparedTexture = sourceTexture.clone();
    preparedTexture.colorSpace = THREE.SRGBColorSpace;
    preparedTexture.anisotropy = 4;
    preparedTexture.needsUpdate = true;
    return preparedTexture;
  }, [sourceTexture]);

  useEffect(() => {
    return () => texture.dispose();
  }, [texture]);

  const uniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uTime: { value: 0 },
      uBreath: { value: 0 },
      uBlink: { value: 0 },
      uVoice: { value: 0 },
      uListening: { value: 0 },
      uThinking: { value: 0 },
      uGaze: { value: new THREE.Vector2() },
    }),
    [texture],
  );

  useFrame(({ clock, pointer }, delta) => {
    const material = materialRef.current;
    if (!material) return;

    const elapsed = clock.getElapsedTime();
    const speaking = state === "reading" || state === "speaking";
    const listening = state === "listening";
    const thinking = state === "thinking" || state === "receiving";
    let blink = 0;

    if (!reducedMotion && blinkStartedAt.current === null && elapsed > nextBlinkAt.current) {
      blinkStartedAt.current = elapsed;
    }

    if (blinkStartedAt.current !== null) {
      const blinkTime = elapsed - blinkStartedAt.current;
      blink = Math.sin(Math.min(1, blinkTime / 0.19) * Math.PI);

      if (blinkTime >= 0.19) {
        blinkStartedAt.current = null;
        nextBlinkAt.current = elapsed + 2.4 + Math.random() * 4.2;
      }
    }

    const measuredVoice = avatarVoiceSignal.active
      ? avatarVoiceSignal.level
      : 0;
    const fallbackVoice = speaking
      ? Math.max(
          0,
          Math.sin(elapsed * 10.7) * 0.22 +
            Math.sin(elapsed * 17.3) * 0.13 +
            0.2,
        )
      : 0;
    const targetVoice = reducedMotion
      ? 0
      : Math.min(1, measuredVoice * 1.3 + fallbackVoice * 0.42);
    const currentVoice = material.uniforms.uVoice.value as number;
    const gazeTargetX = reducedMotion ? 0 : pointer.x * 0.72;
    const gazeTargetY = reducedMotion
      ? 0
      : thinking
        ? -0.34
        : pointer.y * 0.22;
    const gaze = material.uniforms.uGaze.value as THREE.Vector2;

    material.uniforms.uTime.value = elapsed;
    material.uniforms.uBreath.value = reducedMotion
      ? 0
      : Math.sin(elapsed * 1.16) * 0.5 + 0.5;
    material.uniforms.uBlink.value = reducedMotion ? 0 : blink;
    material.uniforms.uVoice.value = THREE.MathUtils.damp(
      currentVoice,
      targetVoice,
      14,
      delta,
    );
    material.uniforms.uListening.value = THREE.MathUtils.damp(
      material.uniforms.uListening.value as number,
      listening ? 1 : 0,
      4,
      delta,
    );
    material.uniforms.uThinking.value = THREE.MathUtils.damp(
      material.uniforms.uThinking.value as number,
      thinking ? 1 : 0,
      3,
      delta,
    );
    gaze.x = THREE.MathUtils.damp(gaze.x, gazeTargetX, 2.4, delta);
    gaze.y = THREE.MathUtils.damp(gaze.y, gazeTargetY, 2.4, delta);
  });

  return (
    <mesh scale={scale}>
      <planeGeometry args={[1, 1, 48, 32]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={fragmentShader}
        toneMapped={false}
        uniforms={uniforms}
        vertexShader={vertexShader}
      />
    </mesh>
  );
}

type PoeticOrganismProps = {
  portraitUrl: string;
  state: AvatarPresenceState;
};

export default function PoeticOrganism({
  portraitUrl,
  state,
}: PoeticOrganismProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <div
      className={styles.organismCanvas}
      role="img"
      aria-label="El Gran Avatar respira, observa y acompaña la voz"
    >
      <Canvas
        dpr={[1, 1.5]}
        flat
        gl={{
          alpha: false,
          antialias: true,
          powerPreference: "high-performance",
        }}
        orthographic
        camera={{ position: [0, 0, 5], zoom: 100 }}
      >
        <color attach="background" args={["#030302"]} />
        <Suspense fallback={null}>
          <PortraitPlane
            portraitUrl={portraitUrl}
            reducedMotion={reducedMotion}
            state={state}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
