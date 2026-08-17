"use client";

import Image from "next/image";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { avatarLipSyncSignal, type AvatarViseme } from "../lib/avatarLipSync";
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

type StateVideoName = "idle" | "listening" | "thinking" | "paused";

const V41_BASE = "/poema-universal/gran-avatar/v41";
const SPEAKING_VIDEO = `${V41_BASE}/speaking/interpretation-01.mp4`;
const SPEAKING_HOLD = `${V41_BASE}/speaking/hold.webp`;

const STATE_VIDEOS: Record<StateVideoName, string> = {
  idle: `${V41_BASE}/states/idle.mp4`,
  listening: `${V41_BASE}/states/listening.mp4`,
  thinking: `${V41_BASE}/states/thinking.mp4`,
  paused: `${V41_BASE}/states/paused.mp4`,
};

const READING_SHOTS: CameraShot[] = [
  "portrait",
  "intimate",
  "portrait",
  "right",
  "bust",
  "left",
];

const SPEAKING_SHOTS: CameraShot[] = [
  "portrait",
  "right",
  "intimate",
  "portrait",
  "left",
];

const VISEME_RATE_NUDGE: Record<AvatarViseme, number> = {
  REST: -0.08,
  A: 0.06,
  E: 0.04,
  I: 0.02,
  O: 0.05,
  U: 0.03,
  MBP: -0.06,
  FV: -0.01,
  L: 0.02,
  BREATH: -0.04,
};

const QUIET_LEVEL = 0.038;
const RESUME_LEVEL = 0.062;
const QUIET_DELAY_MS = 145;
const CLIP_RESET_FADE_MS = 210;

function isSpeakingState(state: AvatarPresenceState) {
  return state === "reading" || state === "speaking";
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function setVideoPlaying(video: HTMLVideoElement | null, shouldPlay: boolean) {
  if (!video) return;
  if (shouldPlay) {
    void video.play().catch(() => undefined);
  } else {
    video.pause();
  }
}

const SynchronizedAvatarBody = forwardRef<
  AvatarBodyHandle,
  SynchronizedAvatarBodyProps
>(function SynchronizedAvatarBody({ media, state, onLifeStateChange }, ref) {
  const [awake, setAwake] = useState(true);
  const [viseme, setViseme] = useState<AvatarViseme>("REST");
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [voiceQuiet, setVoiceQuiet] = useState(true);
  const [shot, setShot] = useState<CameraShot>("bust");

  const idleVideoRef = useRef<HTMLVideoElement>(null);
  const listeningVideoRef = useRef<HTMLVideoElement>(null);
  const thinkingVideoRef = useRef<HTMLVideoElement>(null);
  const pausedVideoRef = useRef<HTMLVideoElement>(null);
  const speakingVideoRef = useRef<HTMLVideoElement>(null);

  const shotIndexRef = useRef(0);
  const quietSinceRef = useRef<number | null>(null);
  const voiceQuietRef = useRef(true);
  const cycleUntilRef = useRef(0);
  const stateRef = useRef(state);

  stateRef.current = state;

  const setQuiet = useCallback((nextQuiet: boolean) => {
    if (voiceQuietRef.current === nextQuiet) return;
    voiceQuietRef.current = nextQuiet;
    setVoiceQuiet(nextQuiet);
  }, []);

  const wake = useCallback(async () => {
    setAwake(true);
    onLifeStateChange?.("synchronized");
    return true;
  }, [onLifeStateChange]);

  const sleep = useCallback(async () => {
    setAwake(false);
    onLifeStateChange?.("sleeping");
  }, [onLifeStateChange]);

  useImperativeHandle(
    ref,
    () => ({
      interrupt: () => {
        speakingVideoRef.current?.pause();
        setQuiet(true);
      },
      sleep,
      // GranAvatarExperience reproduce el audio TTS. V4.1 interpreta su
      // energía y cronología sin sustituir el rostro por visemas completos.
      speak: async () => false,
      wake,
    }),
    [setQuiet, sleep, wake],
  );

  useEffect(() => {
    onLifeStateChange?.("synchronized");
    return () => onLifeStateChange?.("sleeping");
  }, [onLifeStateChange]);

  const speaking = awake && isSpeakingState(state);
  const showListening = awake && state === "listening";
  const showThinking = awake && state === "thinking";
  const showPaused = awake && state === "paused";
  const showIdle =
    awake && !speaking && !showListening && !showThinking && !showPaused;

  useEffect(() => {
    const stateVideos: Array<[HTMLVideoElement | null, boolean]> = [
      [idleVideoRef.current, showIdle],
      [listeningVideoRef.current, showListening],
      [thinkingVideoRef.current, showThinking],
      [pausedVideoRef.current, showPaused],
    ];

    stateVideos.forEach(([video, visible]) => {
      setVideoPlaying(video, visible);
    });
  }, [showIdle, showListening, showPaused, showThinking]);

  useEffect(() => {
    const video = speakingVideoRef.current;
    if (!video) return;

    if (!speaking) {
      video.pause();
      setQuiet(true);
      return;
    }

    const seekToStateStart = () => {
      const startAt = state === "reading" ? 3.45 : 0.08;
      if (Number.isFinite(video.duration)) {
        video.currentTime = clamp(startAt, 0, Math.max(0, video.duration - 0.3));
      }
      video.playbackRate = state === "reading" ? 0.92 : 0.98;
      video.pause();
      setQuiet(true);
      quietSinceRef.current = null;
      cycleUntilRef.current = performance.now() + 90;
    };

    if (video.readyState >= 1) seekToStateStart();
    else video.addEventListener("loadedmetadata", seekToStateStart, { once: true });

    return () => {
      video.removeEventListener("loadedmetadata", seekToStateStart);
    };
  }, [setQuiet, speaking, state]);

  useEffect(() => {
    let frame = 0;
    let previousViseme: AvatarViseme = "REST";
    let previousLevel = 0;

    const readSignals = (now: number) => {
      const currentlySpeaking = awake && isSpeakingState(stateRef.current);
      const nextViseme =
        currentlySpeaking && avatarLipSyncSignal.active
          ? avatarLipSyncSignal.viseme
          : "REST";
      const nextLevel = currentlySpeaking ? avatarVoiceSignal.level : 0;

      if (nextViseme !== previousViseme) {
        previousViseme = nextViseme;
        setViseme(nextViseme);
      }

      if (Math.abs(nextLevel - previousLevel) > 0.035) {
        previousLevel = nextLevel;
        setVoiceLevel(nextLevel);
      }

      const video = speakingVideoRef.current;
      if (!currentlySpeaking || !video) {
        if (video && !video.paused) video.pause();
        quietSinceRef.current = null;
        setQuiet(true);
        frame = window.requestAnimationFrame(readSignals);
        return;
      }

      if (now < cycleUntilRef.current) {
        video.pause();
        setQuiet(true);
        frame = window.requestAnimationFrame(readSignals);
        return;
      }

      const hasVoice = avatarVoiceSignal.active;
      const wantsResume = hasVoice && nextLevel >= RESUME_LEVEL;
      const isPotentiallyQuiet = !hasVoice || nextLevel <= QUIET_LEVEL;

      if (wantsResume) {
        quietSinceRef.current = null;
        setQuiet(false);
        if (video.paused) void video.play().catch(() => undefined);
      } else if (isPotentiallyQuiet) {
        quietSinceRef.current ??= now;
        if (now - quietSinceRef.current >= QUIET_DELAY_MS) {
          video.pause();
          setQuiet(true);
        }
      }

      if (!video.paused) {
        const visemeNudge = avatarLipSyncSignal.active
          ? VISEME_RATE_NUDGE[nextViseme]
          : 0;
        const targetRate = clamp(
          0.82 + nextLevel * 0.48 + visemeNudge,
          0.76,
          1.28,
        );
        video.playbackRate += (targetRate - video.playbackRate) * 0.12;

        if (
          Number.isFinite(video.duration) &&
          video.duration > 0 &&
          video.currentTime >= video.duration - 0.18
        ) {
          video.pause();
          setQuiet(true);
          const startAt = stateRef.current === "reading" ? 3.45 : 0.08;
          video.currentTime = clamp(
            startAt,
            0,
            Math.max(0, video.duration - 0.3),
          );
          cycleUntilRef.current = now + CLIP_RESET_FADE_MS;
        }
      }

      frame = window.requestAnimationFrame(readSignals);
    };

    frame = window.requestAnimationFrame(readSignals);
    return () => window.cancelAnimationFrame(frame);
  }, [awake, setQuiet]);

  useEffect(() => {
    if (!awake || !isSpeakingState(state)) {
      shotIndexRef.current = 0;
      setShot("bust");
      return;
    }

    const sequence = state === "reading" ? READING_SHOTS : SPEAKING_SHOTS;
    shotIndexRef.current = 0;
    setShot(sequence[0]);

    const interval = window.setInterval(() => {
      shotIndexRef.current = (shotIndexRef.current + 1) % sequence.length;
      setShot(sequence[shotIndexRef.current]);
    }, state === "reading" ? 5_650 : 4_850);

    return () => window.clearInterval(interval);
  }, [awake, state]);

  return (
    <div
      className={styles.avatarBody}
      data-live={awake ? "synchronized" : "sleeping"}
      data-state={state}
      data-viseme={viseme}
      data-shot={shot}
      data-voice-quiet={voiceQuiet ? "true" : "false"}
      style={
        {
          "--avatar-voice-level": voiceLevel.toFixed(3),
          "--avatar-light-opacity": (0.3 + voiceLevel * 0.13).toFixed(3),
        } as CSSProperties
      }
    >
      <div className={styles.v41StateLayer} data-visible={showIdle ? "true" : "false"}>
        <video
          ref={idleVideoRef}
          className={`${styles.v41StateVideo} ${styles.v41IdleVideo}`}
          src={STATE_VIDEOS.idle}
          muted
          loop
          playsInline
          preload="auto"
          poster={media.posterUrl}
          aria-label="El Gran Avatar permanece en reposo"
        />
      </div>

      <div
        className={styles.v41StateLayer}
        data-visible={showListening ? "true" : "false"}
      >
        <video
          ref={listeningVideoRef}
          className={`${styles.v41StateVideo} ${styles.v41ListeningVideo}`}
          src={STATE_VIDEOS.listening}
          muted
          loop
          playsInline
          preload="auto"
          poster={media.posterUrl}
          aria-label="El Gran Avatar escucha"
        />
      </div>

      <div
        className={styles.v41StateLayer}
        data-visible={showThinking ? "true" : "false"}
      >
        <video
          ref={thinkingVideoRef}
          className={`${styles.v41StateVideo} ${styles.v41ThinkingVideo}`}
          src={STATE_VIDEOS.thinking}
          muted
          loop
          playsInline
          preload="auto"
          poster={media.posterUrl}
          aria-label="El Gran Avatar piensa"
        />
      </div>

      <div
        className={styles.v41StateLayer}
        data-visible={showPaused ? "true" : "false"}
      >
        <video
          ref={pausedVideoRef}
          className={`${styles.v41StateVideo} ${styles.v41PausedVideo}`}
          src={STATE_VIDEOS.paused}
          muted
          loop
          playsInline
          preload="auto"
          poster={media.posterUrl}
          aria-label="El Gran Avatar permanece en silencio"
        />
      </div>

      <div
        className={styles.v41SpeakingLayer}
        data-visible={speaking ? "true" : "false"}
      >
        <div className={styles.v41CameraRig}>
          <Image
            className={styles.v41SpeakingHold}
            data-visible={voiceQuiet ? "true" : "false"}
            src={SPEAKING_HOLD}
            alt="El Gran Avatar guarda una pausa"
            fill
            priority
            unoptimized
            sizes="(max-width: 980px) 100vw, 62vw"
          />
          <video
            ref={speakingVideoRef}
            className={styles.v41SpeakingVideo}
            data-visible={voiceQuiet ? "false" : "true"}
            src={SPEAKING_VIDEO}
            muted
            playsInline
            preload="auto"
            aria-label="El Gran Avatar interpreta la voz"
          />
        </div>
      </div>

      <div className={styles.v41Light} aria-hidden="true" />
      <div className={styles.v41Vignette} aria-hidden="true" />
    </div>
  );
});

SynchronizedAvatarBody.displayName = "SynchronizedAvatarBody";

export default SynchronizedAvatarBody;
