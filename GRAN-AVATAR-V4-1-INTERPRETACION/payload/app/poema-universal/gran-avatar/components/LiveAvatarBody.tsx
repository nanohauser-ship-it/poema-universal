"use client";

import Image from "next/image";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import type { LiveAvatarSession } from "@heygen/liveavatar-web-sdk";

import type {
  AvatarBodyHandle,
  AvatarLifeState,
  AvatarMediaConfig,
  AvatarPresenceState,
  AvatarVoicePurpose,
} from "../types";

import styles from "../gran-avatar.module.css";

type AvatarBodyProps = {
  media: AvatarMediaConfig;
  state: AvatarPresenceState;
  onLifeStateChange?: (state: AvatarLifeState) => void;
};

type LiveAvatarSdk = typeof import("@heygen/liveavatar-web-sdk");

const SPEAK_TIMEOUT_MS = 180_000;

function selectVideo(
  media: AvatarMediaConfig,
  state: AvatarPresenceState,
) {
  if (
    state === "speaking" ||
    state === "reading" ||
    state === "paused"
  ) {
    return media.speakingVideoUrl ?? media.idleVideoUrl;
  }

  if (state === "listening") {
    return media.listeningVideoUrl ?? media.idleVideoUrl;
  }

  return media.idleVideoUrl;
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  const parts: string[] = [];
  const size = 0x8000;

  for (let offset = 0; offset < bytes.length; offset += size) {
    parts.push(
      String.fromCharCode(...bytes.subarray(offset, offset + size)),
    );
  }

  return window.btoa(parts.join(""));
}

const LiveAvatarBody = forwardRef<AvatarBodyHandle, AvatarBodyProps>(
function LiveAvatarBody(
  { media, state, onLifeStateChange },
  ref,
) {
  const selectedVideo = selectVideo(media, state);
  const [lifeState, setLifeState] =
    useState<AvatarLifeState>("sleeping");
  const liveVideoRef = useRef<HTMLVideoElement>(null);
  const sessionRef = useRef<LiveAvatarSession | null>(null);
  const sdkRef = useRef<LiveAvatarSdk | null>(null);
  const connectionRef = useRef<Promise<boolean> | null>(null);

  const publishLifeState = useCallback(
    (nextState: AvatarLifeState) => {
      setLifeState(nextState);
      onLifeStateChange?.(nextState);
    },
    [onLifeStateChange],
  );

  const sleep = useCallback(async () => {
    const session = sessionRef.current;
    sessionRef.current = null;
    connectionRef.current = null;

    if (session) {
      try {
        await session.stop();
      } catch (error) {
        console.warn("No fue posible cerrar la presencia viva.", error);
      }
    }

    if (liveVideoRef.current) {
      liveVideoRef.current.srcObject = null;
      liveVideoRef.current.removeAttribute("src");
    }

    publishLifeState("sleeping");
  }, [publishLifeState]);

  const wake = useCallback(async () => {
    if (sessionRef.current) return true;
    if (connectionRef.current) return connectionRef.current;

    const connection = (async () => {
      publishLifeState("connecting");

      try {
        const response = await fetch(
          "/api/poema-universal/gran-avatar/live/session",
          { method: "POST" },
        );
        const payload = (await response.json().catch(() => null)) as
          | {
              configured?: boolean;
              error?: string;
              sessionToken?: string;
            }
          | null;

        if (!response.ok || !payload?.sessionToken) {
          publishLifeState(
            payload?.configured === false ? "unconfigured" : "error",
          );
          return false;
        }

        const sdk = await import("@heygen/liveavatar-web-sdk");
        sdkRef.current = sdk;
        const session = new sdk.LiveAvatarSession(payload.sessionToken, {
          voiceChat: false,
        });

        session.on(sdk.SessionEvent.SESSION_DISCONNECTED, () => {
          sessionRef.current = null;
          publishLifeState("sleeping");
        });
        session.on(sdk.SessionEvent.SESSION_STREAM_READY, () => {
          const element = liveVideoRef.current;
          if (!element) return;
          session.attach(element);
          void element.play().catch(() => undefined);
        });

        sessionRef.current = session;
        await session.start();

        const element = liveVideoRef.current;
        if (element) {
          session.attach(element);
          await element.play().catch(() => undefined);
        }

        publishLifeState("alive");
        return true;
      } catch (error) {
        console.error("Gran Avatar live session error:", error);
        sessionRef.current = null;
        publishLifeState("error");
        return false;
      } finally {
        connectionRef.current = null;
      }
    })();

    connectionRef.current = connection;
    return connection;
  }, [publishLifeState]);

  const speak = useCallback(
    async (text: string, purpose: AvatarVoicePurpose) => {
      const cleanText = text.trim();
      if (!cleanText || !(await wake())) return false;

      const session = sessionRef.current;
      const sdk = sdkRef.current;
      if (!session || !sdk) return false;

      try {
        const response = await fetch(
          "/api/poema-universal/gran-avatar/voice",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              format: "pcm",
              purpose,
              text: cleanText,
            }),
          },
        );

        if (!response.ok) return false;
        const audio = arrayBufferToBase64(await response.arrayBuffer());

        await new Promise<void>((resolve, reject) => {
          let commandId = "";
          const timeout = window.setTimeout(() => {
            session.off(
              sdk.AgentEventsEnum.AVATAR_SPEAK_ENDED,
              handleEnded,
            );
            reject(new Error("La presencia tardó demasiado en hablar."));
          }, SPEAK_TIMEOUT_MS);
          const handleEnded = (event: { source_event_id?: string }) => {
            if (
              event.source_event_id &&
              commandId &&
              event.source_event_id !== commandId
            ) {
              return;
            }

            window.clearTimeout(timeout);
            session.off(
              sdk.AgentEventsEnum.AVATAR_SPEAK_ENDED,
              handleEnded,
            );
            resolve();
          };

          session.on(
            sdk.AgentEventsEnum.AVATAR_SPEAK_ENDED,
            handleEnded,
          );
          commandId = session.repeatAudio(audio);
        });

        return true;
      } catch (error) {
        console.error("Gran Avatar live voice error:", error);
        return false;
      }
    },
    [wake],
  );

  const interrupt = useCallback(() => {
    sessionRef.current?.interrupt();
  }, []);

  useImperativeHandle(
    ref,
    () => ({ interrupt, sleep, speak, wake }),
    [interrupt, sleep, speak, wake],
  );

  useEffect(() => {
    return () => {
      const session = sessionRef.current;
      sessionRef.current = null;
      if (session) void session.stop().catch(() => undefined);
    };
  }, []);

  return (
    <div
      className={styles.avatarBody}
      data-live={lifeState}
      data-state={state}
    >
      {selectedVideo ? (
        <video
          key={selectedVideo}
          className={styles.avatarMedia}
          poster={media.posterUrl}
          src={selectedVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-label="Cuerpo audiovisual del Gran Avatar"
        />
      ) : (
        <Image
          className={styles.avatarMedia}
          src={media.posterUrl}
          alt="Presencia humana del Gran Avatar sentada ante un cuaderno"
          fill
          priority
          sizes="(max-width: 980px) 100vw, 62vw"
        />
      )}

      <video
        ref={liveVideoRef}
        className={`${styles.avatarMedia} ${styles.liveAvatarMedia}`}
        autoPlay
        playsInline
        aria-label="Presencia viva del Gran Avatar"
      />

      {lifeState !== "alive" ? (
        <button
          type="button"
          className={styles.wakePresence}
          disabled={lifeState === "connecting"}
          onClick={() => void wake()}
        >
          {lifeState === "connecting"
            ? "La presencia aparece…"
            : lifeState === "unconfigured"
              ? "Vida en preparación"
              : lifeState === "error"
                ? "Volver a despertar"
                : "Despertar la presencia"}
        </button>
      ) : (
        <button
          type="button"
          className={styles.sleepPresence}
          onClick={() => void sleep()}
        >
          Volver al silencio
        </button>
      )}

      <div className={styles.avatarVignette} aria-hidden="true" />
    </div>
  );
});

LiveAvatarBody.displayName = "LiveAvatarBody";

export default LiveAvatarBody;
