import type { AvatarBodyMode, AvatarMediaConfig } from "./types";

/**
 * Primera presencia cinematográfica experimental.
 * - reposo: retrato maestro limpio
 * - escucha/recepción: película Pippit experimental
 * - lectura/respuesta: película parlante Pippit experimental
 *
 * El audio continúa siendo el generado por Poema Universal; las películas se
 * reproducen silenciadas para probar presencia, encuadre y transición de estados.
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
 * cinematic es ahora el cuerpo predeterminado para la fase de pruebas.
 * Los dos cuerpos anteriores se mantienen disponibles sin borrar nada:
 * NEXT_PUBLIC_GRAN_AVATAR_BODY_MODE=organism
 * NEXT_PUBLIC_GRAN_AVATAR_BODY_MODE=live
 */
const requestedBodyMode = process.env.NEXT_PUBLIC_GRAN_AVATAR_BODY_MODE;

export const GRAN_AVATAR_BODY_MODE: AvatarBodyMode =
  requestedBodyMode === "live"
    ? "live"
    : requestedBodyMode === "organism"
      ? "organism"
      : "cinematic";

export const GRAN_AVATAR_ORGANISM_PORTRAIT =
  "/poema-universal/gran-avatar/organism-portrait.webp";

export const GRAN_AVATAR_MAX_POEM_CHARS = 5_000;
export const GRAN_AVATAR_MAX_MESSAGE_CHARS = 1_200;
