"use client";

import Image from "next/image";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { GRAN_AVATAR_DIRECTION } from "../avatarConfig";
import { AVATAR_EMOTIONS } from "../lib/avatarEmotion";
import { avatarPerformanceSignal } from "../lib/avatarPerformanceSignal";
import { avatarVoiceSignal } from "../lib/avatarVoiceSignal";
import type { AvatarBodyHandle, AvatarEmotion, AvatarLifeState, AvatarMediaConfig, AvatarPresenceState } from "../types";
import styles from "../gran-avatar.module.css";

type Props = { media: AvatarMediaConfig; state: AvatarPresenceState; onLifeStateChange?: (state: AvatarLifeState) => void };

/** Existing video adapter: no procedural anatomy or claimed phoneme synchronization. */
const SynchronizedAvatarBody = forwardRef<AvatarBodyHandle, Props>(function SynchronizedAvatarBody({ media, state, onLifeStateChange }, ref) {
  const [awake, setAwake] = useState(true);
  const [visible, setVisible] = useState(false);
  const [emotion, setEmotion] = useState<AvatarEmotion>("neutral");
  const videoRef = useRef<HTMLVideoElement>(null);
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  const interrupt = useCallback(() => {
    videoRef.current?.pause();
    setVisible(false);
  }, []);
  const wake = useCallback(async () => { setAwake(true); onLifeStateChange?.("synchronized"); return true; }, [onLifeStateChange]);
  const sleep = useCallback(async () => { interrupt(); setAwake(false); onLifeStateChange?.("sleeping"); }, [interrupt, onLifeStateChange]);
  useImperativeHandle(ref, () => ({ interrupt, wake, sleep, speak: async () => false }), [interrupt, wake, sleep]);
  useEffect(() => { onLifeStateChange?.("synchronized"); }, [onLifeStateChange]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !awake) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let version = -1;
    let exhausted = false;
    let playing = false;
    let disposed = false;
    let lastEmotion: AvatarEmotion | null = null;
    let lastVisible = false;
    const show = (next: boolean) => {
      if (lastVisible !== next) { lastVisible = next; setVisible(next); }
    };
    const ended = () => { exhausted = true; playing = false; show(false); };
    const failed = () => { exhausted = true; playing = false; show(false); };
    video.addEventListener("ended", ended);
    video.addEventListener("error", failed);
    const update = () => {
      const direction = avatarPerformanceSignal;
      const nextEmotion = direction.silent ? "silence" : direction.emotion;
      if (nextEmotion !== lastEmotion) { lastEmotion = nextEmotion; setEmotion(nextEmotion); }
      if (version !== direction.version) {
        version = direction.version;
        video.pause();
        playing = false;
        exhausted = false;
        show(false);
        // At most one natural interpretation per recitation. Never loop gestures.
        const source = direction.emotion === "intense" ? GRAN_AVATAR_DIRECTION.intenseVideo : GRAN_AVATAR_DIRECTION.normalVideo;
        if (video.getAttribute("src") !== source) video.src = source;
        else video.currentTime = 0;
      }
      const isSpeaking = stateRef.current === "reading" || stateRef.current === "speaking";
      const userPaused = stateRef.current === "paused" || direction.paused;
      const canMove = isSpeaking && !userPaused && nextEmotion !== "silence" &&
        avatarVoiceSignal.audible && !motion.matches && !document.hidden && !exhausted;
      if (!canMove) {
        video.pause();
        playing = false;
        // User pause holds the frame; designed silence returns to closed-mouth rest.
        if (!userPaused) show(false);
        if (motion.matches || document.hidden) show(false);
        return;
      }
      video.playbackRate = AVATAR_EMOTIONS[nextEmotion].rate;
      if (!playing) {
        playing = true;
        const attemptVersion = version;
        void video.play().then(() => {
          if (!disposed && playing && version === attemptVersion) show(true);
          else video.pause();
        }).catch(() => { if (!disposed) failed(); });
      }
    };
    const interval = window.setInterval(update, 100);
    motion.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      disposed = true;
      window.clearInterval(interval);
      video.pause();
      video.removeEventListener("ended", ended);
      video.removeEventListener("error", failed);
      motion.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, [awake]);

  return (
    <div className={`${styles.avatarBody} ${styles.poeticPresence}`} data-live={awake ? "synchronized" : "sleeping"} data-state={state} data-emotion={emotion}>
      <div className={styles.presenceFrame}>
        <Image src={media.posterUrl} alt="El Gran Avatar, en silencio" fill priority sizes="(max-width: 720px) 85vw, 440px" className={styles.presencePortrait} />
        <video ref={videoRef} className={styles.presenceFilm} data-visible={visible ? "true" : "false"} muted playsInline preload="none" aria-hidden="true" />
      </div>
    </div>
  );
});
SynchronizedAvatarBody.displayName = "SynchronizedAvatarBody";
export default SynchronizedAvatarBody;
