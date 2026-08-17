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

import { avatarPerformanceSignal } from "../lib/avatarPerformanceSignal";
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
type PerformanceKind = "normal" | "intense";

const MASTER_VIDEO =
  "/poema-universal/gran-avatar/v5/avatar-master-continuous.mp4";

const NORMAL_SPEAKING_VIDEO =
  "/poema-universal/gran-avatar/v56/avatar-speaking-normal-01.mp4";

const INTENSE_SPEAKING_VIDEO =
  "/poema-universal/gran-avatar/v56/avatar-speaking-intense-01.mp4";

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
      return 0.9;
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
      return "brightness(1.055) contrast(1.025) saturate(0.90)";
    case "paused":
      return "brightness(1.045) contrast(1.025) saturate(0.89)";
    case "listening":
      return "brightness(1.08) contrast(1.022) saturate(0.94)";
    case "reading":
    case "speaking":
      return "brightness(1.10) contrast(1.02) saturate(0.96)";
    default:
      return "brightness(1.085) contrast(1.022) saturate(0.94)";
  }
}

const SynchronizedAvatarBody = forwardRef<
  AvatarBodyHandle,
  SynchronizedAvatarBodyProps
>(function SynchronizedAvatarBody({ media, state, onLifeStateChange }, ref) {
  const [awake, setAwake] = useState(true);
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [shot, setShot] = useState<CameraShot>("bust");
  const [activePerformance, setActivePerformance] =
    useState<PerformanceKind | null>(null);
  const [performanceVisible, setPerformanceVisible] = useState(false);

  const masterVideoRef = useRef<HTMLVideoElement>(null);
  const normalVideoRef = useRef<HTMLVideoElement>(null);
  const intenseVideoRef = useRef<HTMLVideoElement>(null);
  const stateRef = useRef(state);
  const shotIndexRef = useRef(0);
  const previousLevelRef = useRef(0);
  const initializedRef = useRef(false);
  const activePerformanceRef = useRef<PerformanceKind | null>(null);
  const performanceVisibleRef = useRef(false);
  const performanceVersionRef = useRef(-1);
  const quietSinceRef = useRef<number | null>(null);
  const pauseTimerRef = useRef<number | null>(null);

  stateRef.current = state;

  const videoForKind = useCallback((kind: PerformanceKind | null) => {
    if (kind === "intense") return intenseVideoRef.current;
    if (kind === "normal") return normalVideoRef.current;
    return null;
  }, []);

  const clearPauseTimer = useCallback(() => {
    if (pauseTimerRef.current !== null) {
      window.clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
  }, []);

  const prepareVideo = useCallback(
    (kind: PerformanceKind, forceRestart = false) => {
      const video = videoForKind(kind);
      if (!video) return;

      if (forceRestart || !Number.isFinite(video.currentTime) || video.currentTime < 0.1) {
        try {
          video.currentTime = kind === "intense" ? 0.18 : 0.35;
        } catch {
          // Safari puede bloquear el seek hasta loadedmetadata.
        }
      }

      video.playbackRate = kind === "intense" ? 0.96 : 0.98;
    },
    [videoForKind],
  );

  const pauseInactiveVideoLater = useCallback(
    (kind: PerformanceKind | null) => {
      if (!kind) return;
      const video = videoForKind(kind);
      if (!video) return;

      clearPauseTimer();
      pauseTimerRef.current = window.setTimeout(() => {
        video.pause();
        pauseTimerRef.current = null;
      }, 1_150);
    },
    [clearPauseTimer, videoForKind],
  );

  const selectPerformance = useCallback(
    (kind: PerformanceKind, restart = false) => {
      const current = activePerformanceRef.current;
      const nextVideo = videoForKind(kind);
      if (!nextVideo) return;

      clearPauseTimer();

      if (current !== kind || restart) {
        prepareVideo(kind, true);
      }

      activePerformanceRef.current = kind;
      setActivePerformance(kind);
      performanceVisibleRef.current = true;
      setPerformanceVisible(true);
      void nextVideo.play().catch(() => undefined);

      if (current && current !== kind) {
        pauseInactiveVideoLater(current);
      }
    },
    [clearPauseTimer, pauseInactiveVideoLater, prepareVideo, videoForKind],
  );

  const hidePerformance = useCallback(() => {
    if (!performanceVisibleRef.current) return;

    performanceVisibleRef.current = false;
    setPerformanceVisible(false);
    pauseInactiveVideoLater(activePerformanceRef.current);
  }, [pauseInactiveVideoLater]);

  const resetPerformances = useCallback(() => {
    clearPauseTimer();
    quietSinceRef.current = null;
    performanceVisibleRef.current = false;
    activePerformanceRef.current = null;
    setPerformanceVisible(false);
    setActivePerformance(null);

    for (const [kind, video] of [
      ["normal", normalVideoRef.current],
      ["intense", intenseVideoRef.current],
    ] as const) {
      if (!video) continue;
      video.pause();
      try {
        video.currentTime = kind === "intense" ? 0.18 : 0.35;
      } catch {
        // Se volverá a intentar cuando el vídeo esté preparado.
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
    normalVideoRef.current?.pause();
    intenseVideoRef.current?.pause();
    onLifeStateChange?.("sleeping");
  }, [onLifeStateChange]);

  useImperativeHandle(
    ref,
    () => ({
      interrupt: hidePerformance,
      sleep,
      // La voz sigue siendo TTS de Poema Universal. Esta capa decide la
      // interpretación corporal que acompaña a esa voz.
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
    return () => clearPauseTimer();
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
    const preparePerformanceVideo = (
      video: HTMLVideoElement | null,
      kind: PerformanceKind,
    ) => {
      if (!video) return () => undefined;
      const prepare = () => {
        prepareVideo(kind, true);
        video.pause();
      };

      if (video.readyState >= 1) prepare();
      else video.addEventListener("loadedmetadata", prepare, { once: true });

      return () => video.removeEventListener("loadedmetadata", prepare);
    };

    const cleanNormal = preparePerformanceVideo(normalVideoRef.current, "normal");
    const cleanIntense = preparePerformanceVideo(intenseVideoRef.current, "intense");

    return () => {
      cleanNormal();
      cleanIntense();
    };
  }, [prepareVideo]);

  useEffect(() => {
    const video = masterVideoRef.current;
    if (!video) return;
    if (awake) void video.play().catch(() => undefined);
    else video.pause();
  }, [awake]);

  useEffect(() => {
    if (!isSpeakingState(state)) resetPerformances();
  }, [resetPerformances, state]);

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
        const voiceNudge = signalActive ? level * 0.075 : 0;
        const targetRate = clamp(baseRate + voiceNudge, 0.54, 1.045);
        masterVideo.playbackRate +=
          (targetRate - masterVideo.playbackRate) * 0.025;

        if (masterVideo.paused) {
          void masterVideo.play().catch(() => undefined);
        }
      }

      if (awake && speakingState) {
        if (performanceVersionRef.current !== avatarPerformanceSignal.version) {
          performanceVersionRef.current = avatarPerformanceSignal.version;
          resetPerformances();
        }

        if (signalActive) {
          quietSinceRef.current = null;

          const requestedProfile = avatarPerformanceSignal.profile;
          const requestedKind: PerformanceKind =
            requestedProfile === "intense" ? "intense" : "normal";

          if (!performanceVisibleRef.current) {
            selectPerformance(requestedKind, true);
          }

          const activeKind = activePerformanceRef.current ?? requestedKind;
          const activeVideo = videoForKind(activeKind);

          if (activeVideo) {
            const basePerformanceRate =
              requestedProfile === "recital"
                ? 0.91
                : activeKind === "intense"
                  ? 0.955
                  : 0.985;

            const targetPerformanceRate = clamp(
              basePerformanceRate + level * 0.045,
              requestedProfile === "recital" ? 0.88 : 0.91,
              1.035,
            );

            activeVideo.playbackRate +=
              (targetPerformanceRate - activeVideo.playbackRate) * 0.04;

            // El clip intenso usa solo su tramo más contenido. Si la reflexión
            // continúa, cruza al habla natural en vez de entrar en la parte más
            // gesticulada del vídeo.
            if (
              activeKind === "intense" &&
              Number.isFinite(activeVideo.duration) &&
              activeVideo.currentTime >= Math.max(1, activeVideo.duration - 0.6)
            ) {
              selectPerformance("normal", true);
            } else if (
              activeKind === "normal" &&
              Number.isFinite(activeVideo.duration) &&
              activeVideo.currentTime >= Math.max(1, activeVideo.duration - 1.1)
            ) {
              hidePerformance();
            }
          }
        } else if (performanceVisibleRef.current) {
          if (quietSinceRef.current === null) quietSinceRef.current = now;
          if (now - quietSinceRef.current > 720) hidePerformance();
        }
      }

      frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [
    awake,
    hidePerformance,
    resetPerformances,
    selectPerformance,
    videoForKind,
  ]);

  const facialLightOpacity = isSpeakingState(state)
    ? 0.29 + voiceLevel * 0.055
    : state === "listening"
      ? 0.27
      : state === "thinking"
        ? 0.22
        : state === "paused"
          ? 0.21
          : 0.255;

  const normalVisible =
    performanceVisible && activePerformance === "normal";
  const intenseVisible =
    performanceVisible && activePerformance === "intense";

  return (
    <div
      className={styles.avatarBody}
      data-live={awake ? "synchronized" : "sleeping"}
      data-state={state}
      data-shot={shot}
      data-performance={performanceVisible ? activePerformance ?? "visible" : "hidden"}
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
            style={{ filter: videoFilterForState(state) }}
          />

          <video
            ref={normalVideoRef}
            className={styles.v5MasterVideo}
            src={NORMAL_SPEAKING_VIDEO}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            style={{
              opacity: normalVisible ? 1 : 0,
              transition: "opacity 1100ms cubic-bezier(0.22, 0.72, 0.2, 1)",
              filter: "brightness(1.10) contrast(1.02) saturate(0.96)",
              transform: "translate3d(0, -0.65%, 0) scale(1.008)",
              transformOrigin: "50% 49%",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          <video
            ref={intenseVideoRef}
            className={styles.v5MasterVideo}
            src={INTENSE_SPEAKING_VIDEO}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            style={{
              opacity: intenseVisible ? 1 : 0,
              transition: "opacity 1050ms cubic-bezier(0.22, 0.72, 0.2, 1)",
              filter: "brightness(1.105) contrast(1.02) saturate(0.96)",
              transform: "translate3d(0, -6.2%, 0) scale(0.96)",
              transformOrigin: "50% 49%",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
        </div>
      </div>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          pointerEvents: "none",
          opacity: facialLightOpacity,
          transition: "opacity 1100ms ease",
          background: `
            radial-gradient(
              ellipse 25% 28% at 50% 30%,
              rgba(255, 232, 198, 0.40) 0%,
              rgba(244, 199, 145, 0.25) 28%,
              rgba(217, 154, 91, 0.12) 50%,
              rgba(0, 0, 0, 0) 75%
            ),
            radial-gradient(
              ellipse 34% 37% at 50% 27%,
              rgba(196, 119, 53, 0.12) 0%,
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
