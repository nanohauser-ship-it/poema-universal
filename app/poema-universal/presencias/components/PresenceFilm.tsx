"use client";

import Image from "next/image";
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { PresenceCaption } from "../../data/poeticPresences";
import {
  deletePresenceVideo,
  getPresenceVideo,
  MAX_LOCAL_VIDEO_BYTES,
  savePresenceVideo,
  subscribeToPresenceVideo,
  type StoredPresenceVideo,
} from "../lib/presenceVideoStore";
import styles from "../presence.module.css";

type PresenceFilmProps = {
  presenceSlug: string;
  name: string;
  portraitUrl: string | null;
  filmUrl?: string;
  captions?: PresenceCaption[];
  format?: "landscape" | "vertical";
};

function formatTime(value: number) {
  if (!Number.isFinite(value)) {
    return "00:00";
  }

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);

  return `${String(minutes).padStart(2, "0")}:${String(
    seconds,
  ).padStart(2, "0")}`;
}

export default function PresenceFilm({
  presenceSlug,
  name,
  portraitUrl,
  filmUrl,
  captions = [],
  format = "landscape",
}: PresenceFilmProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hideTimerRef = useRef<number | undefined>(
    undefined,
  );
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsVisible, setControlsVisible] =
    useState(true);
  const [isFullscreen, setIsFullscreen] =
    useState(false);
  const [localVideo, setLocalVideo] =
    useState<StoredPresenceVideo | null>(null);
  const [localFilmUrl, setLocalFilmUrl] =
    useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [archiveMessage, setArchiveMessage] =
    useState("");

  const effectiveFilmUrl = localFilmUrl ?? filmUrl;

  useEffect(() => {
    let cancelled = false;

    async function loadLocalVideo() {
      try {
        const stored = await getPresenceVideo(presenceSlug);

        if (!cancelled) {
          setLocalVideo(stored);
        }
      } catch {
        if (!cancelled) {
          setArchiveMessage(
            "El archivo audiovisual local no está disponible.",
          );
        }
      }
    }

    void loadLocalVideo();
    const unsubscribe = subscribeToPresenceVideo(
      presenceSlug,
      () => void loadLocalVideo(),
    );

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [presenceSlug]);

  useEffect(() => {
    if (!localVideo) {
      setLocalFilmUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(localVideo.blob);
    setLocalFilmUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [localVideo]);

  useEffect(() => {
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setControlsVisible(true);
  }, [effectiveFilmUrl]);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current !== undefined) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = undefined;
    }
  }, []);

  const revealControls = useCallback(() => {
    clearHideTimer();
    setControlsVisible(true);

    if (playing) {
      hideTimerRef.current = window.setTimeout(() => {
        setControlsVisible(false);
      }, 2800);
    }
  }, [clearHideTimer, playing]);

  useEffect(() => {
    revealControls();

    return clearHideTimer;
  }, [clearHideTimer, revealControls]);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(
        document.fullscreenElement === frameRef.current,
      );
    }

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange,
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange,
      );
    };
  }, []);

  async function togglePlayback() {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.paused) {
      try {
        await video.play();
      } catch {
        setPlaying(false);
      }
    } else {
      video.pause();
    }
  }

  function seek(value: number) {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.currentTime = value;
    setCurrentTime(value);
  }

  function toggleSound() {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = !video.muted;
    setMuted(video.muted);
  }

  async function toggleFullscreen() {
    if (!frameRef.current) {
      return;
    }

    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        setIsFullscreen(false);
      }
    } else {
      try {
        await frameRef.current.requestFullscreen();
      } catch {
        setIsFullscreen(false);
      }
    }
  }

  async function attachVideo(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith("video/") &&
      !/\.(mp4|webm|mov|m4v)$/i.test(file.name)
    ) {
      setArchiveMessage(
        "Selecciona un archivo de vídeo MP4, WebM, MOV o M4V.",
      );
      return;
    }

    if (file.size > MAX_LOCAL_VIDEO_BYTES) {
      setArchiveMessage(
        "La película supera el límite local de 500 MB.",
      );
      return;
    }

    setSaving(true);
    setArchiveMessage("Incorporando película al archivo…");

    try {
      await savePresenceVideo(presenceSlug, file);
      setArchiveMessage(
        "Película incorporada en este dispositivo.",
      );
    } catch (error) {
      const quotaExceeded =
        error instanceof DOMException &&
        error.name === "QuotaExceededError";

      setArchiveMessage(
        quotaExceeded
          ? "El navegador no dispone de espacio suficiente para esta película."
          : "No se pudo incorporar la película.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeLocalVideo() {
    if (
      !window.confirm(
        `¿Retirar la película local de ${name}?`,
      )
    ) {
      return;
    }

    setSaving(true);

    try {
      await deletePresenceVideo(presenceSlug);
      setArchiveMessage(
        "La película local ha sido retirada.",
      );
    } catch {
      setArchiveMessage(
        "No se pudo retirar la película local.",
      );
    } finally {
      setSaving(false);
    }
  }

  const archiveControls = (
    <div className={styles.filmArchiveControls}>
      <label
        className={styles.filmAttach}
        aria-disabled={saving}
      >
        <input
          type="file"
          accept="video/mp4,video/webm,video/quicktime,video/x-m4v,.mp4,.webm,.mov,.m4v"
          onChange={(event) => void attachVideo(event)}
          disabled={saving}
        />
        <span aria-hidden="true">＋</span>
        {effectiveFilmUrl
          ? "Sustituir película"
          : "Anexar película"}
      </label>

      {localVideo ? (
        <button
          type="button"
          onClick={() => void removeLocalVideo()}
          disabled={saving}
        >
          Retirar archivo local
        </button>
      ) : null}

      <p className={styles.filmArchiveNote} aria-live="polite">
        {archiveMessage ||
          (localVideo
            ? `${localVideo.fileName} · guardado en este dispositivo`
            : "MP4 · WebM · MOV · máximo 500 MB")}
      </p>
    </div>
  );

  if (!effectiveFilmUrl) {
    return (
      <>
        <div
          className={`${styles.filmFrame} ${
            format === "vertical"
              ? styles.filmFrameVertical
              : ""
          }`}
          aria-label={`Película de ${name}, en preparación`}
        >
          {portraitUrl ? (
            <Image
              src={portraitUrl}
              alt={`Retrato de ${name}`}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 66vw"
              className={styles.filmPoster}
            />
          ) : null}

          <span className={styles.filmShade} />
          <div className={styles.filmPending}>
            <span aria-hidden="true">○</span>
            <p>Película en preparación</p>
          </div>
        </div>
        {archiveControls}
      </>
    );
  }

  return (
    <>
      <div
        ref={frameRef}
        className={`${styles.filmFrame} ${
          format === "vertical"
            ? styles.filmFrameVertical
            : ""
        }`}
        onPointerMove={revealControls}
        onPointerLeave={() => {
          if (playing) {
            setControlsVisible(false);
          }
        }}
        onFocusCapture={revealControls}
      >
        <video
          key={effectiveFilmUrl}
          ref={videoRef}
          className={styles.filmVideo}
          src={effectiveFilmUrl}
          poster={portraitUrl ?? undefined}
          preload="metadata"
          playsInline
          onClick={() => void togglePlayback()}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(event) =>
            setCurrentTime(event.currentTarget.currentTime)
          }
          onLoadedMetadata={(event) => {
            const nextDuration = event.currentTarget.duration;
            setDuration(
              Number.isFinite(nextDuration)
                ? nextDuration
                : 0,
            );
            setMuted(event.currentTarget.muted);
          }}
          aria-label={`Película poética de ${name}`}
        >
          {captions.map((caption) => (
            <track
              key={`${caption.languageCode}-${caption.src}`}
              kind="captions"
              src={caption.src}
              srcLang={caption.languageCode}
              label={caption.label}
              default={caption.default}
            />
          ))}
        </video>

        {!playing ? (
          <button
            type="button"
            className={styles.filmPlay}
            onClick={() => void togglePlayback()}
            aria-label={`Reproducir presencia de ${name}`}
          >
            <span aria-hidden="true">▶</span>
            Reproducir presencia
          </button>
        ) : null}

        <div
          className={`${styles.filmControls} ${
            controlsVisible
              ? ""
              : styles.filmControlsHidden
          }`}
        >
          <button
            type="button"
            onClick={() => void togglePlayback()}
            aria-label={playing ? "Pausar" : "Reproducir"}
          >
            <span aria-hidden="true">
              {playing ? "Ⅱ" : "▶"}
            </span>
          </button>

          <label className={styles.filmProgress}>
            <span className={styles.srOnly}>
              Progreso de la película
            </span>
            <input
              type="range"
              min={0}
              max={Math.max(duration, 0.01)}
              step={0.01}
              value={Math.min(currentTime, duration || 0)}
              onChange={(event) =>
                seek(Number(event.target.value))
              }
            />
          </label>

          <time>
            {formatTime(currentTime)} / {formatTime(duration)}
          </time>

          <button
            type="button"
            onClick={toggleSound}
            aria-label={muted ? "Activar sonido" : "Silenciar"}
          >
            <span aria-hidden="true">
              {muted ? "×" : "◖"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => void toggleFullscreen()}
            aria-label={
              isFullscreen
                ? "Salir de pantalla completa"
                : "Ver en pantalla completa"
            }
          >
            <span aria-hidden="true">
              {isFullscreen ? "⊡" : "□"}
            </span>
          </button>
        </div>
      </div>
      {archiveControls}
    </>
  );
}
