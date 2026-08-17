"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { avatarVoiceSignal } from "../lib/avatarVoiceSignal";
import type {
  AvatarBodyHandle,
  AvatarLifeState,
  AvatarMediaConfig,
  AvatarPresenceState,
} from "../types";
import styles from "../gran-avatar.module.css";

type SynchronizedAvatarBodyProps = {
  media: AvatarMediaConfig;
  state: AvatarPresenceState;
  onLifeStateChange?: (state: AvatarLifeState) => void;
};

type CameraShot = "bust" | "portrait" | "intimate" | "left" | "right";

const MASTER_VIDEO =
  "/poema-universal/gran-avatar/v5/avatar-master-continuous.mp4";

const READING_SHOTS: CameraShot[] = [
  "bust",
  "portrait",
  "right",
  "portrait",
  "intimate",
  "left",
];

const SPEAKING_SHOTS: CameraShot[] = [
  "portrait",
  "right",
  "portrait",
  "left",
  "intimate",
];

function isSpeakingState(state: AvatarPresenceState) {
  return state === "reading" || state === "speaking";
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function baseRateForState(state: AvatarPresenceState) {
  switch (state) {
    case "reading":
      return 0.91;
    case "speaking":
      return 0.94;
    case "listening":
      return 0.79;
    case "thinking":
      return 0.67;
    case "paused":
      return 0.58;
    case "receiving":
      return 0.73;
    case "error":
      return 0.54;
    default:
      return 0.76;
  }
}

function staticShotForState(state: AvatarPresenceState): CameraShot {
  switch (state) {
    case "listening":
      return "left";
    case "thinking":
      return "right";
    case "paused":
      return "portrait";
    case "receiving":
      return "portrait";
    default:
      return "bust";
  }
}

const SynchronizedAvatarBody = forwardRef<
  AvatarBodyHandle,
  SynchronizedAvatarBodyProps
>(function SynchronizedAvatarBody({ media, state, onLifeStateChange }, ref) {
  const [awake, setAwake] = useState(true);
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [shot, setShot] = useState<CameraShot>("bust");

  const videoRef = useRef<HTMLVideoElement>(null);
  const stateRef = useRef(state);
  const shotIndexRef = useRef(0);
  const previousLevelRef = useRef(0);
  const initializedRef = useRef(false);

  stateRef.current = state;

  const wake = useCallback(async () => {
    setAwake(true);
    onLifeStateChange?.("synchronized");
    const video = videoRef.current;
    if (video) {
      void video.play().catch(() => undefined);
    }
    return true;
  }, [onLifeStateChange]);

  const sleep = useCallback(async () => {
    setAwake(false);
    videoRef.current?.pause();
    onLifeStateChange?.("sleeping");
  }, [onLifeStateChange]);

  useImperativeHandle(
    ref,
    () => ({
      interrupt: () => {
        // V5 no corta ni rebobina el cuerpo visual. La interrupción afecta a la
        // voz desde GranAvatarExperience, mientras la presencia sigue viva.
      },
      sleep,
      // El audio TTS sigue reproduciéndose en GranAvatarExperience. El cuerpo
      // continuo reacciona a su energía sin reconstruir la cara ni saltar clips.
      speak: async () => false,
      wake,
    }),
    [sleep, wake],
  );

  useEffect(() => {
    onLifeStateChange?.("synchronized");
    return () => onLifeStateChange?.("sleeping");
  }, [onLifeStateChange]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prepare = () => {
      if (!initializedRef.current && Number.isFinite(video.duration)) {
        // Empieza en una zona tranquila del máster. Este seek solo ocurre al
        // cargar la página, nunca al cambiar de estado.
        video.currentTime = clamp(12.2, 0, Math.max(0, video.duration - 1));
        initializedRef.current = true;
      }
      video.playbackRate = baseRateForState(stateRef.current);
      if (awake) void video.play().catch(() => undefined);
    };

    if (video.readyState >= 1) prepare();
    else video.addEventListener("loadedmetadata", prepare, { once: true });

    return () => video.removeEventListener("loadedmetadata", prepare);
  }, [awake]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (awake) void video.play().catch(() => undefined);
    else video.pause();
  }, [awake]);

  useEffect(() => {
    if (!awake) return;

    if (!isSpeakingState(state)) {
      shotIndexRef.current = 0;
      setShot(staticShotForState(state));
      return;
    }

    const sequence = state === "reading" ? READING_SHOTS : SPEAKING_SHOTS;
    shotIndexRef.current = 0;
    setShot(sequence[0]);

    const interval = window.setInterval(() => {
      shotIndexRef.current = (shotIndexRef.current + 1) % sequence.length;
      setShot(sequence[shotIndexRef.current]);
    }, state === "reading" ? 10_800 : 9_100);

    return () => window.clearInterval(interval);
  }, [awake, state]);

  useEffect(() => {
    let frame = 0;

    const animate = () => {
      const video = videoRef.current;
      const currentState = stateRef.current;
      const speaking = isSpeakingState(currentState);
      const level = speaking && avatarVoiceSignal.active ? avatarVoiceSignal.level : 0;

      if (Math.abs(level - previousLevelRef.current) > 0.04) {
        previousLevelRef.current = level;
        setVoiceLevel(level);
      }

      if (video && awake) {
        // El cuerpo nunca se detiene ni busca otro fragmento. Solo variamos la
        // velocidad muy lentamente para que la voz influya sin crear saltos.
        const baseRate = baseRateForState(currentState);
        const voiceNudge = speaking ? level * 0.12 : 0;
        const targetRate = clamp(baseRate + voiceNudge, 0.54, 1.08);
        video.playbackRate += (targetRate - video.playbackRate) * 0.025;

        if (video.paused) void video.play().catch(() => undefined);
      }

      frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [awake]);

  return (
    <div
      className={styles.avatarBody}
      data-live={awake ? "synchronized" : "sleeping"}
      data-state={state}
      data-shot={shot}
      style={
        {
          "--avatar-voice-level": voiceLevel.toFixed(3),
          "--avatar-light-opacity": (0.26 + voiceLevel * 0.09).toFixed(3),
        } as CSSProperties
      }
    >
      <div className={styles.v5ContinuousLayer}>
        <div className={styles.v5CameraRig}>
          <video
            ref={videoRef}
            className={styles.v5MasterVideo}
            src={MASTER_VIDEO}
            muted
            loop
            playsInline
            preload="auto"
            poster={media.posterUrl}
            aria-label="El Gran Avatar permanece vivo de forma continua"
          />
        </div>
      </div>

      <div className={styles.v5Light} aria-hidden="true" />
      <div className={styles.v5Vignette} aria-hidden="true" />
    </div>
  );
});

SynchronizedAvatarBody.displayName = "SynchronizedAvatarBody";

export default SynchronizedAvatarBody;
