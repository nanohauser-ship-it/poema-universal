import type { AvatarBodyMode, AvatarMediaConfig } from "./types";

/**
 * V3 sincronizada.
 * - reposo: retrato maestro limpio
 * - escucha: película experimental de presencia
 * - lectura/respuesta: poses extraídas de una única toma del personaje y
 *   gobernadas por la línea temporal de la voz
 *
 * La V2 cinematográfica se conserva como respaldo.
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
 * synchronized es el cuerpo predeterminado de V3.
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
