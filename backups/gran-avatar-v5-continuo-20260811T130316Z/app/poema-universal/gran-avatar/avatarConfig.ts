import type { AvatarBodyMode, AvatarMediaConfig } from "./types";

/**
 * V4.1 interpretación por vídeo + sincronización suave.
 * - reposo/escucha/pensamiento/silencio: microvídeos orgánicos del vídeo maestro
 * - lectura/respuesta: interpretación humana por vídeo gobernada por la energía TTS
 * - los visemas ya no sustituyen la cara; solo modulan suavemente el ritmo
 *
 * La V3, V2 cinematográfica y los cuerpos anteriores siguen en el proyecto.
 */
export const GRAN_AVATAR_MEDIA: AvatarMediaConfig = {
  posterUrl: "/poema-universal/gran-avatar/cinematic/avatar-reposo.webp",
  idleVideoUrl: undefined,
  listeningVideoUrl:
    "/poema-universal/gran-avatar/cinematic/avatar-acoge.mp4",
  speakingVideoUrl:
    "/poema-universal/gran-avatar/cinematic/avatar-habla.mp4",
};

/**
 * synchronized sigue siendo el cuerpo predeterminado; ahora ejecuta V4.1.
 * Respaldos disponibles sin borrar nada:
 * NEXT_PUBLIC_GRAN_AVATAR_BODY_MODE=cinematic
 * NEXT_PUBLIC_GRAN_AVATAR_BODY_MODE=organism
 * NEXT_PUBLIC_GRAN_AVATAR_BODY_MODE=live
 */
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
