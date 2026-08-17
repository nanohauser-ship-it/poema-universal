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

const SPEAKING_MASTER_VIDEO =
  "/poema-universal/gran-avatar/v55/avatar-speaking-master-01.mp4";

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

function videoFilterForState(state: AvatarPresenceState) {
  switch (state) {
    case "thinking":
      return "brightness(1.035) contrast(1.025) saturate(0.90)";
    case "paused":
      return "brightness(1.025) contrast(1.025) saturate(0.88)";
    case "listening":
      return "brightness(1.06) contrast(1.025) saturate(0.92)";
    case "reading":
    case "speaking":
      return "brightness(1.085) contrast(1.02) saturate(0.95)";
    default:
      return "brightness(1.07) contrast(1.025) saturate(0.93)";
  }
}

const SynchronizedAvatarBody = forwardRef<
  AvatarBodyHandle,
  SynchronizedAvatarBodyProps
>(function SynchronizedAvatarBody({ media, state, onLifeStateChange }, ref) {
  const [awake, setAwake] = useState(true);
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [shot, setShot] = useState<CameraShot>("bust");
  const [performanceVisible, setPerformanceVisible] = useState(false);

  const masterVideoRef = useRef<HTMLVideoElement>(null);
  const speakingVideoRef = useRef<HTMLVideoElement>(null);
  const stateRef = useRef(state);
  const shotIndexRef = useRef(0);
  const previousLevelRef = useRef(0);
  const initializedRef = useRef(false);
  const performanceVisibleRef = useRef(false);
  const performanceExhaustedRef = useRef(false);
  const quietSinceRef = useRef<number | null>(null);
  const pauseTimerRef = useRef<number | null>(null);

  stateRef.current = state;

  const clearPauseTimer = useCallback(() => {
    if (pauseTimerRef.current !== null) {
      window.clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
  }, []);

  const hidePerformance = useCallback(() => {
    if (!performanceVisibleRef.current) return;
    performanceVisibleRef.current = false;
    setPerformanceVisible(false);

    clearPauseTimer();
    pauseTimerRef.current = window.setTimeout(() => {
      speakingVideoRef.current?.pause();
      pauseTimerRef.current = null;
    }, 1_250);
  }, [clearPauseTimer]);

  const showPerformance = useCallback(() => {
    const video = speakingVideoRef.current;
    if (!video || performanceExhaustedRef.current) return;

    clearPauseTimer();

    if (!Number.isFinite(video.currentTime) || video.currentTime < 0.1) {
      video.currentTime = 0.35;
    }

    performanceVisibleRef.current = true;
    setPerformanceVisible(true);
    void video.play().catch(() => undefined);
  }, [clearPauseTimer]);

  const resetPerformance = useCallback(() => {
    const video = speakingVideoRef.current;
    performanceExhaustedRef.current = false;
    quietSinceRef.current = null;
    performanceVisibleRef.current = false;
    setPerformanceVisible(false);
    clearPauseTimer();

    if (video) {
      video.pause();
      try {
        video.currentTime = 0.35;
      } catch {
        // Safari puede impedir el seek antes de loadedmetadata.
      }
    }
  }, [clearPauseTimer]);

  const wake = useCallback(async () => {
    setAwake(true);
    onLifeStateChange?.("synchronized");

    if (masterVideoRef.current) {
      void masterVideoRef.current.play().catch(() => undefined);
    }

    return true;
  }, [onLifeStateChange]);

  const sleep = useCallback(async () => {
    setAwake(false);
    masterVideoRef.current?.pause();
    speakingVideoRef.current?.pause();
    onLifeStateChange?.("sleeping");
  }, [onLifeStateChange]);

  useImperativeHandle(
    ref,
    () => ({
      interrupt: () => {
        hidePerformance();
      },
      sleep,
      // El audio TTS continúa viviendo en GranAvatarExperience. Esta capa
      // interpreta visualmente la voz real sin sustituirla.
      speak: async () => false,
      wake,
    }),
    [hidePerformance, sleep, wake],
  );

  useEffect(() => {
    onLifeStateChange?.("synchronized");
    return () => onLifeStateChange?.("sleeping");
  }, [onLifeStateChange]);

  useEffect(() => {
    return () => {
      clearPauseTimer();
    };
  }, [clearPauseTimer]);

  useEffect(() => {
    const video = masterVideoRef.current;
    if (!video) return;

    const prepare = () => {
      if (!initializedRef.current && Number.isFinite(video.duration)) {
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
    const video = speakingVideoRef.current;
    if (!video) return;

    const prepare = () => {
      try {
        video.currentTime = 0.35;
      } catch {
        // Se prepara de nuevo en el primer play si el navegador lo bloquea.
      }
      video.pause();
    };

    if (video.readyState >= 1) prepare();
    else video.addEventListener("loadedmetadata", prepare, { once: true });

    return () => video.removeEventListener("loadedmetadata", prepare);
  }, []);

  useEffect(() => {
    const video = masterVideoRef.current;
    if (!video) return;

    if (awake) void video.play().catch(() => undefined);
    else video.pause();
  }, [awake]);

  useEffect(() => {
    if (!isSpeakingState(state)) {
      resetPerformance();
    }
  }, [resetPerformance, state]);

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
    }, state === "reading" ? 11_800 : 10_200);

    return () => window.clearInterval(interval);
  }, [awake, state]);

  useEffect(() => {
    let frame = 0;

    const animate = () => {
      const masterVideo = masterVideoRef.current;
      const speakingVideo = speakingVideoRef.current;
      const currentState = stateRef.current;
      const speakingState = isSpeakingState(currentState);
      const signalActive = speakingState && avatarVoiceSignal.active;
      const level = signalActive ? avatarVoiceSignal.level : 0;
      const now = performance.now();

      if (Math.abs(level - previousLevelRef.current) > 0.035) {
        previousLevelRef.current = level;
        setVoiceLevel(level);
      }

      if (masterVideo && awake) {
        const baseRate = baseRateForState(currentState);
        const voiceNudge = signalActive ? level * 0.09 : 0;
        const targetRate = clamp(baseRate + voiceNudge, 0.54, 1.06);
        masterVideo.playbackRate +=
          (targetRate - masterVideo.playbackRate) * 0.025;

        if (masterVideo.paused) {
          void masterVideo.play().catch(() => undefined);
        }
      }

      if (speakingVideo && awake && speakingState) {
        if (signalActive) {
          quietSinceRef.current = null;

          if (!performanceExhaustedRef.current) {
            showPerformance();

            const targetSpeakingRate = clamp(
              (currentState === "reading" ? 0.94 : 0.98) + level * 0.055,
              0.90,
              1.055,
            );
            speakingVideo.playbackRate +=
              (targetSpeakingRate - speakingVideo.playbackRate) * 0.045;

            // El clip no se repite nunca: al acercarse al final funde de vuelta
            // al máster continuo para evitar un salto visible de loop.
            if (
              Number.isFinite(speakingVideo.duration) &&
              speakingVideo.currentTime >= Math.max(1, speakingVideo.duration - 1.15)
            ) {
              performanceExhaustedRef.current = true;
              hidePerformance();
            }
          }
        } else if (performanceVisibleRef.current) {
          if (quietSinceRef.current === null) quietSinceRef.current = now;

          // Una pausa breve de respiración no provoca ningún corte. Solo si el
          // silencio dura de verdad volvemos suavemente al cuerpo maestro.
          if (now - quietSinceRef.current > 720) {
            hidePerformance();
          }
        }
      }

      frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [awake, hidePerformance, showPerformance]);

  const facialLightOpacity = isSpeakingState(state)
    ? 0.27 + voiceLevel * 0.055
    : state === "listening"
      ? 0.255
      : state === "thinking"
        ? 0.205
        : 0.24;

  return (
    <div
      className={styles.avatarBody}
      data-live={awake ? "synchronized" : "sleeping"}
      data-state={state}
      data-shot={shot}
      data-performance={performanceVisible ? "visible" : "hidden"}
      style={
        {
          "--avatar-voice-level": voiceLevel.toFixed(3),
          "--avatar-light-opacity": (0.31 + voiceLevel * 0.07).toFixed(3),
        } as CSSProperties
      }
    >
      <div className={styles.v5ContinuousLayer}>
        <div className={styles.v5CameraRig}>
          <video
            ref={masterVideoRef}
            className={styles.v5MasterVideo}
            src={MASTER_VIDEO}
            muted
            loop
            playsInline
            preload="auto"
            poster={media.posterUrl}
            aria-label="El Gran Avatar permanece vivo de forma continua"
            style={{
              filter: videoFilterForState(state),
            }}
          />

          <video
            ref={speakingVideoRef}
            className={styles.v5MasterVideo}
            src={SPEAKING_MASTER_VIDEO}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            style={{
              opacity: performanceVisible ? 1 : 0,
              transition: "opacity 1150ms cubic-bezier(0.22, 0.72, 0.2, 1)",
              filter:
                "brightness(1.08) contrast(1.02) saturate(0.96)",
              transform: "translate3d(0, -0.65%, 0) scale(1.008)",
              transformOrigin: "50% 49%",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        </div>
      </div>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          opacity: facialLightOpacity,
          transition: "opacity 1200ms ease",
          background: `
            radial-gradient(
              ellipse 28% 31% at 50% 31%,
              rgba(255, 225, 184, 0.38) 0%,
              rgba(235, 181, 116, 0.22) 34%,
              rgba(208, 142, 76, 0.08) 55%,
              rgba(0, 0, 0, 0) 76%
            ),
            radial-gradient(
              ellipse 37% 41% at 50% 29%,
              rgba(205, 126, 58, 0.11) 0%,
              rgba(0, 0, 0, 0) 72%
            )
          `,
          mixBlendMode: "screen",
        }}
      />

      <div className={styles.v5Light} aria-hidden="true" />
      <div className={styles.v5Vignette} aria-hidden="true" />
    </div>
  );
});

SynchronizedAvatarBody.displayName = "SynchronizedAvatarBody";

export default SynchronizedAvatarBody;
