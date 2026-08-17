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

const FRAME_BASE = "/poema-universal/gran-avatar/sync";
const VISEME_FRAMES: Record<AvatarViseme, string> = {
  REST: `${FRAME_BASE}/rest.webp`,
  A: `${FRAME_BASE}/a.webp`,
  E: `${FRAME_BASE}/e.webp`,
  I: `${FRAME_BASE}/i.webp`,
  O: `${FRAME_BASE}/o.webp`,
  U: `${FRAME_BASE}/u.webp`,
  MBP: `${FRAME_BASE}/mbp.webp`,
  FV: `${FRAME_BASE}/fv.webp`,
  L: `${FRAME_BASE}/l.webp`,
  BREATH: `${FRAME_BASE}/breath.webp`,
};

function isSpeakingState(state: AvatarPresenceState) {
  return state === "reading" || state === "speaking";
}

const SynchronizedAvatarBody = forwardRef<
  AvatarBodyHandle,
  SynchronizedAvatarBodyProps
>(function SynchronizedAvatarBody({ media, state, onLifeStateChange }, ref) {
  const [awake, setAwake] = useState(true);
  const [viseme, setViseme] = useState<AvatarViseme>("REST");
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [listeningReady, setListeningReady] = useState(false);
  const listeningVideoRef = useRef<HTMLVideoElement>(null);

  const wake = useCallback(async () => {
    setAwake(true);
    onLifeStateChange?.("synchronized");
    return true;
  }, [onLifeStateChange]);

  const sleep = useCallback(async () => {
    setAwake(false);
    listeningVideoRef.current?.pause();
    onLifeStateChange?.("sleeping");
  }, [onLifeStateChange]);

  useImperativeHandle(
    ref,
    () => ({
      interrupt: () => listeningVideoRef.current?.pause(),
      sleep,
      // La voz real la reproduce GranAvatarExperience. Este cuerpo únicamente
      // representa visualmente la señal de voz y por eso no habla por sí solo.
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
    // Precarga las poses para que el cambio de visema no tenga destellos.
    Object.values(VISEME_FRAMES).forEach((url) => {
      const image = new window.Image();
      image.decoding = "async";
      image.src = url;
    });
  }, []);

  useEffect(() => {
    let frame = 0;
    let previousViseme: AvatarViseme = "REST";
    let previousLevel = 0;

    const readSignals = () => {
      const speaking = awake && isSpeakingState(state);
      const nextViseme = speaking && avatarLipSyncSignal.active
        ? avatarLipSyncSignal.viseme
        : "REST";
      const nextLevel = speaking ? avatarVoiceSignal.level : 0;

      if (nextViseme !== previousViseme) {
        previousViseme = nextViseme;
        setViseme(nextViseme);
      }

      if (Math.abs(nextLevel - previousLevel) > 0.055) {
        previousLevel = nextLevel;
        setVoiceLevel(nextLevel);
      }

      frame = window.requestAnimationFrame(readSignals);
    };

    readSignals();
    return () => window.cancelAnimationFrame(frame);
  }, [awake, state]);

  useEffect(() => {
    const video = listeningVideoRef.current;
    setListeningReady(false);

    if (!awake || state !== "listening" || !video || !media.listeningVideoUrl) {
      video?.pause();
      return;
    }

    video.currentTime = 0;
    video.load();
    void video.play().catch(() => undefined);
  }, [awake, media.listeningVideoUrl, state]);

  const speaking = awake && isSpeakingState(state);
  const listening = awake && state === "listening" && Boolean(media.listeningVideoUrl);

  return (
    <div
      className={styles.avatarBody}
      data-live={awake ? "synchronized" : "sleeping"}
      data-state={state}
      data-viseme={viseme}
      style={{
        "--avatar-voice-level": voiceLevel.toFixed(3),
      } as CSSProperties}
    >
      <Image
        className={styles.syncPoster}
        src={media.posterUrl}
        alt="Presencia sincronizada del Gran Avatar de Poema Universal"
        fill
        priority
        sizes="(max-width: 980px) 100vw, 62vw"
      />

      {speaking ? (
        <Image
          className={styles.syncVisemeFrame}
          src={VISEME_FRAMES[viseme]}
          alt=""
          fill
          unoptimized
          sizes="(max-width: 980px) 100vw, 62vw"
          aria-hidden="true"
        />
      ) : null}

      {listening ? (
        <video
          ref={listeningVideoRef}
          className={styles.syncListeningVideo}
          src={media.listeningVideoUrl}
          poster={media.posterUrl}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onCanPlay={() => setListeningReady(true)}
        />
      ) : null}

      <div
        className={styles.syncListeningBlend}
        data-visible={listeningReady && listening ? "true" : "false"}
        aria-hidden="true"
      />
      <div className={styles.syncLight} aria-hidden="true" />
      <div className={styles.syncVignette} aria-hidden="true" />
    </div>
  );
});

SynchronizedAvatarBody.displayName = "SynchronizedAvatarBody";

export default SynchronizedAvatarBody;
