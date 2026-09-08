import type { AvatarBodyMode, AvatarMediaConfig } from "./types";

/** Local video presence. Anatomical motion remains baked into the media.
 * Alternate bodies and the existing API contracts remain available.
 */
export const GRAN_AVATAR_MEDIA: AvatarMediaConfig = {
  posterUrl: "/poema-universal/gran-avatar/cinematic/avatar-reposo.webp",
  idleVideoUrl: undefined,
  listeningVideoUrl:
    "/poema-universal/gran-avatar/cinematic/avatar-acoge.mp4",
  speakingVideoUrl:
    "/poema-universal/gran-avatar/cinematic/avatar-habla.mp4",
};

const requestedBodyMode = process.env.NEXT_PUBLIC_GRAN_AVATAR_BODY_MODE;

export const GRAN_AVATAR_BODY_MODE: AvatarBodyMode =
  requestedBodyMode === "live"
    ? "live"
    : requestedBodyMode === "organism"
      ? "organism"
      : requestedBodyMode === "cinematic"
        ? "cinematic"
        : "synchronized";

export const GRAN_AVATAR_ORGANISM_PORTRAIT =
  "/poema-universal/gran-avatar/organism-portrait.webp";

export const GRAN_AVATAR_MAX_POEM_CHARS = 5_000;
export const GRAN_AVATAR_MAX_MESSAGE_CHARS = 1_200;

export const GRAN_AVATAR_DIRECTION = {
  normalVideo: "/poema-universal/gran-avatar/v56/avatar-speaking-normal-01.mp4",
  intenseVideo: "/poema-universal/gran-avatar/v56/avatar-speaking-intense-01.mp4",
  closingSilence: 2.4,
  voiceThreshold: 0.018,
  quietHoldMs: 440,
  maxAudioCacheBytes: 8 * 1024 * 1024,
} as const;
