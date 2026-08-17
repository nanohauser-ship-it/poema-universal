import type { AvatarBodyMode, AvatarMediaConfig } from "./types";

/**
 * El cuerpo audiovisual permanece desacoplado de la inteligencia y la voz.
 * Cuando existan películas reales, bastará con incorporar sus URLs aquí o
 * sustituir esta fuente por el futuro sistema de administración.
 */
export const GRAN_AVATAR_MEDIA: AvatarMediaConfig = {
  posterUrl: "/poema-universal/gran-avatar/avatar-poster.webp",
};

/**
 * El organismo propio es el cuerpo predeterminado. LiveAvatar se conserva
 * como respaldo y puede reactivarse sin tocar código con:
 * NEXT_PUBLIC_GRAN_AVATAR_BODY_MODE=live
 */
export const GRAN_AVATAR_BODY_MODE: AvatarBodyMode =
  process.env.NEXT_PUBLIC_GRAN_AVATAR_BODY_MODE === "live"
    ? "live"
    : "organism";

export const GRAN_AVATAR_ORGANISM_PORTRAIT =
  "/poema-universal/gran-avatar/organism-portrait.webp";

export const GRAN_AVATAR_MAX_POEM_CHARS = 5_000;
export const GRAN_AVATAR_MAX_MESSAGE_CHARS = 1_200;
