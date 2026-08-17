"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import styles from "../archive.module.css";

type PresencePortraitProps = {
  name: string | null;
  number: number;
  portraitUrl: string | null;
  previewVideoUrl?: string;
  priority?: boolean;
};

export default function PresencePortrait({
  name,
  number,
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

  const canShowPortrait =
    Boolean(portraitUrl) && !imageFailed;

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
    if (!previewVideoUrl) {
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

      {previewVideoUrl && videoRequested ? (
        <video
          ref={videoRef}
          className={`${styles.previewVideo} ${
            active && videoReady
              ? styles.previewVideoVisible
              : ""
          }`}
          src={previewVideoUrl}
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
