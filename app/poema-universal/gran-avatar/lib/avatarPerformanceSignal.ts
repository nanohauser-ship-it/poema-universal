import type { AvatarEmotion, AvatarVoicePurpose } from "../types";

export type AvatarPerformanceProfile = "normal" | "intense" | "recital";

type AvatarPerformanceSignal = {
  profile: AvatarPerformanceProfile;
  version: number;
  text: string;
  emotion: AvatarEmotion;
  silent: boolean;
  paused: boolean;
};

export const avatarPerformanceSignal: AvatarPerformanceSignal = {
  profile: "normal",
  version: 0,
  text: "",
  emotion: "neutral",
  silent: false,
  paused: false,
};

const STRONG_TERMS = [
  "guerra",
  "muerte",
  "morir",
  "hambre",
  "dolor",
  "miedo",
  "soledad",
  "destruccion",
  "destruir",
  "violencia",
  "injusticia",
  "humanidad",
  "mundo",
  "memoria",
  "olvido",
  "perdida",
  "perder",
  "vacio",
  "absurdo",
  "libertad",
  "conciencia",
  "existencia",
  "sentido",
  "infancia",
  "alma",
  "morimos",
  "desaparecer",
  "desaparecemos",
];

const REFLECTIVE_TERMS = [
  "quiza",
  "quizas",
  "tal vez",
  "pienso",
  "pensamos",
  "creemos",
  "somos",
  "estamos",
  "vivimos",
  "vida",
  "tiempo",
  "amor",
  "silencio",
  "verdad",
  "recordar",
  "olvidar",
  "que significa",
  "por que",
  "para que",
];

function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function chooseAvatarPerformanceProfile(
  text: string,
  purpose: AvatarVoicePurpose,
): AvatarPerformanceProfile {
  if (purpose === "reading") return "recital";

  const normalized = normalizeText(text);
  let score = 0;

  for (const term of STRONG_TERMS) {
    if (normalized.includes(term)) score += 2;
  }

  for (const term of REFLECTIVE_TERMS) {
    if (normalized.includes(term)) score += 1;
  }

  if (text.length > 320) score += 1;
  if ((text.match(/[¿?]/g) ?? []).length >= 2) score += 1;
  if ((text.match(/…|\.\.\./g) ?? []).length >= 1) score += 1;

  return score >= 4 ? "intense" : "normal";
}

export function setAvatarPerformanceProfile(
  text: string,
  purpose: AvatarVoicePurpose,
  emotion: AvatarEmotion = purpose === "reading" ? "contemplative" : "neutral",
) {
  avatarPerformanceSignal.emotion = emotion;
  avatarPerformanceSignal.silent = false;
  avatarPerformanceSignal.paused = false;
  avatarPerformanceSignal.profile = chooseAvatarPerformanceProfile(
    text,
    purpose,
  );
  avatarPerformanceSignal.text = text;
  avatarPerformanceSignal.version += 1;

  return avatarPerformanceSignal.profile;
}
