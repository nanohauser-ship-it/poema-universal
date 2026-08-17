"use client";

import Image from "next/image";

import type {
  AvatarMediaConfig,
  AvatarPresenceState,
} from "../types";

import styles from "../gran-avatar.module.css";

type AvatarBodyProps = {
  media: AvatarMediaConfig;
  state: AvatarPresenceState;
};

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

export default function AvatarBody({
  media,
  state,
}: AvatarBodyProps) {
  const selectedVideo = selectVideo(media, state);

  return (
    <div className={styles.avatarBody} data-state={state}>
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

      <div className={styles.avatarVignette} aria-hidden="true" />
    </div>
  );
}
