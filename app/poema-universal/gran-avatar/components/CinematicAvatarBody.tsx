"use client";

import Image from "next/image";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  AvatarBodyHandle,
  AvatarLifeState,
  AvatarMediaConfig,
  AvatarPresenceState,
} from "../types";
import styles from "../gran-avatar.module.css";

type CinematicAvatarBodyProps = {
  media: AvatarMediaConfig;
  state: AvatarPresenceState;
  onLifeStateChange?: (state: AvatarLifeState) => void;
};

type VideoKind = "listening" | "speaking" | null;

function chooseVideo(
  state: AvatarPresenceState,
  media: AvatarMediaConfig,
): { url?: string; kind: VideoKind } {
  if (state === "reading" || state === "speaking") {
    return { url: media.speakingVideoUrl, kind: "speaking" };
  }

  if (state === "listening") {
    return { url: media.listeningVideoUrl, kind: "listening" };
  }

  return { url: undefined, kind: null };
}

const CinematicAvatarBody = forwardRef<
  AvatarBodyHandle,
  CinematicAvatarBodyProps
>(function CinematicAvatarBody({ media, state, onLifeStateChange }, ref) {
  const [awake, setAwake] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const selection = useMemo(() => chooseVideo(state, media), [media, state]);

  const wake = useCallback(async () => {
    setAwake(true);
    onLifeStateChange?.("cinematic");
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
        videoRef.current?.pause();
      },
      sleep,
      // El audio real sigue llegando desde la API de voz. La película es
      // únicamente el cuerpo visual experimental, por eso devolvemos false.
      speak: async () => false,
      wake,
    }),
    [sleep, wake],
  );

  useEffect(() => {
    onLifeStateChange?.("cinematic");
    return () => onLifeStateChange?.("sleeping");
  }, [onLifeStateChange]);

  useEffect(() => {
    const video = videoRef.current;


    if (!awake || !video || !selection.url) return;

    video.currentTime = 0;
    video.load();
    void video.play().catch(() => {
      // El retrato permanece visible si el navegador bloquea autoplay.
    });
  }, [awake, selection.url]);

  return (
    <div
      className={styles.avatarBody}
      data-live={awake ? "cinematic" : "sleeping"}
      data-state={state}
      data-video-kind={selection.kind ?? "none"}
    >
      <Image
        className={styles.cinematicPoster}
        src={media.posterUrl}
        alt="Presencia del Gran Avatar de Poema Universal"
        fill
        priority
        sizes="(max-width: 980px) 100vw, 62vw"
      />

      {awake && selection.url ? (
        <video
          key={`${selection.kind}-${selection.url}`}
          ref={videoRef}
          className={styles.cinematicVideo}
          data-kind={selection.kind ?? undefined}
          src={selection.url}
          poster={media.posterUrl}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onLoadStart={() => setVideoReady(false)}
          onCanPlay={() => setVideoReady(true)}
        />
      ) : null}

      <div
        className={styles.cinematicVideoBlend}
        data-visible={videoReady && Boolean(selection.url) ? "true" : "false"}
        aria-hidden="true"
      />
      <div className={styles.cinematicLight} aria-hidden="true" />
      <div className={styles.cinematicVignette} aria-hidden="true" />
    </div>
  );
});

CinematicAvatarBody.displayName = "CinematicAvatarBody";

export default CinematicAvatarBody;
