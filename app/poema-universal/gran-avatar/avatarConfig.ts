import type { AvatarBodyMode, AvatarMediaConfig } from "./types";

/**
 * V5 · cuerpo continuo.
 *
 * Principio: una única interpretación de vídeo permanece viva durante toda la
 * sesión. Los estados y la voz ya no provocan seeks, congelaciones ni cambios
 * de clip. Solo modifican lentamente velocidad, luz y encuadre.
 *
 * La alineación de voz y los cuerpos V4/V3/V2 continúan en el proyecto como
 * infraestructura y respaldo, pero synchronized ejecuta V5 por defecto.
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
