"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getPresenceVideo,
  subscribeToPresenceVideo,
} from "../lib/presenceVideoStore";
import styles from "../archive.module.css";

type PresencePortraitProps = {
  name: string | null;
  number: number;
  presenceSlug?: string;
  portraitUrl: string | null;
  previewVideoUrl?: string;
  priority?: boolean;
};

export default function PresencePortrait({
  name,
  number,
  presenceSlug,
  portraitUrl,
  previewVideoUrl,
  priority = false,
}: PresencePortraitProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [imageFailed, setImageFailed] =
    useState(false);
  const [videoRequested, setVideoRequested] =
    useState(false);
  const [videoReady, setVideoReady] =
    useState(false);
  const [active, setActive] = useState(false);
  const [localPreviewUrl, setLocalPreviewUrl] =
    useState<string | null>(null);

  const previewSource =
    previewVideoUrl ?? localPreviewUrl ?? undefined;

  const canShowPortrait =
    Boolean(portraitUrl) && !imageFailed;

  useEffect(() => {
    if (!presenceSlug || previewVideoUrl) {
      setLocalPreviewUrl(null);
      return;
    }

    let cancelled = false;
    let activeObjectUrl: string | null = null;

    async function loadLocalPreview() {
      try {
        const stored = await getPresenceVideo(presenceSlug!);

        if (cancelled) {
          return;
        }

        if (activeObjectUrl) {
          URL.revokeObjectURL(activeObjectUrl);
          activeObjectUrl = null;
        }

        if (stored) {
          activeObjectUrl = URL.createObjectURL(stored.blob);
        }

        setLocalPreviewUrl(activeObjectUrl);
      } catch {
        setLocalPreviewUrl(null);
      }
    }

    void loadLocalPreview();
    const unsubscribe = subscribeToPresenceVideo(
      presenceSlug,
      () => void loadLocalPreview(),
    );

    return () => {
      cancelled = true;
      unsubscribe();

      if (activeObjectUrl) {
        URL.revokeObjectURL(activeObjectUrl);
      }
    };
  }, [presenceSlug, previewVideoUrl]);

  useEffect(() => {
    setVideoRequested(false);
    setVideoReady(false);
    setActive(false);
  }, [previewSource]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !videoReady) {
      return;
    }

    if (active) {
      void video.play().catch(() => {
        setVideoReady(false);
      });
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [active, videoReady]);

  function activatePreview() {
    if (!previewSource) {
      return;
    }

    setVideoRequested(true);
    setActive(true);
  }

  function deactivatePreview() {
    setActive(false);
  }

  return (
    <figure
      className={styles.portraitFrame}
      onPointerEnter={activatePreview}
      onPointerLeave={deactivatePreview}
      onFocus={activatePreview}
      onBlur={deactivatePreview}
    >
      {canShowPortrait && portraitUrl ? (
        <Image
          src={portraitUrl}
          alt={name ? `Retrato de ${name}` : ""}
          fill
          priority={priority}
          sizes="(max-width: 700px) 48vw, (max-width: 1100px) 31vw, 18vw"
          className={`${styles.portraitImage} ${
            active && videoReady
              ? styles.portraitImageHidden
              : ""
          }`}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div
          className={styles.portraitSilence}
          aria-hidden="true"
        >
          <span>
            {String(number).padStart(2, "0")}
          </span>
          <i />
        </div>
      )}

      {previewSource && videoRequested ? (
        <video
          ref={videoRef}
          className={`${styles.previewVideo} ${
            active && videoReady
              ? styles.previewVideoVisible
              : ""
          }`}
          src={previewSource}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          onCanPlay={() => setVideoReady(true)}
          onError={() => {
            setVideoReady(false);
            setActive(false);
          }}
        />
      ) : null}

      <span
        aria-hidden="true"
        className={styles.portraitVeil}
      />
    </figure>
  );
}
