export type AvatarViseme =
  | "REST"
  | "A"
  | "E"
  | "I"
  | "O"
  | "U"
  | "MBP"
  | "FV"
  | "L"
  | "BREATH";

export type AvatarWordTiming = {
  word: string;
  start: number;
  end: number;
};

export type AvatarLipCue = {
  start: number;
  end: number;
  viseme: AvatarViseme;
};

type LipSignal = {
  active: boolean;
  viseme: AvatarViseme;
  cueIndex: number;
};

export const avatarLipSyncSignal: LipSignal = {
  active: false,
  viseme: "REST",
  cueIndex: -1,
};

let activeCleanup: (() => void) | null = null;

const VOWEL_MAP: Record<string, AvatarViseme> = {
  a: "A",
  e: "E",
  i: "I",
  y: "I",
  o: "O",
  u: "U",
  w: "U",
};

function normalizeWord(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zñ]/g, "");
}

function charToViseme(char: string): AvatarViseme | null {
  if (VOWEL_MAP[char]) return VOWEL_MAP[char];
  if (/[mbp]/.test(char)) return "MBP";
  if (/[fv]/.test(char)) return "FV";
  if (char === "l") return "L";
  return null;
}

function visemeWeight(viseme: AvatarViseme) {
  if (["A", "E", "I", "O", "U"].includes(viseme)) return 1.5;
  if (["MBP", "FV", "L"].includes(viseme)) return 0.72;
  return 0.45;
}

function wordToVisemes(word: string) {
  const normalized = normalizeWord(word);
  const result: AvatarViseme[] = [];

  for (const char of normalized) {
    const viseme = charToViseme(char);
    if (!viseme) continue;
    if (result[result.length - 1] !== viseme) result.push(viseme);
  }

  if (result.length === 0) return ["REST" as AvatarViseme];

  // Evita una animación nerviosa en palabras largas. Cinco poses por palabra
  // es suficiente para mantener legibilidad labial sin aspecto de stop-motion.
  if (result.length <= 5) return result;

  const sampled: AvatarViseme[] = [];
  for (let index = 0; index < 5; index += 1) {
    const sourceIndex = Math.round((index / 4) * (result.length - 1));
    const viseme = result[sourceIndex];
    if (sampled[sampled.length - 1] !== viseme) sampled.push(viseme);
  }
  return sampled;
}

export function buildVisemeTimeline(words: AvatarWordTiming[]) {
  const cues: AvatarLipCue[] = [];
  let previousEnd = 0;

  for (const item of words) {
    const start = Number(item.start);
    const end = Number(item.end);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
      continue;
    }

    if (start - previousEnd > 0.07) {
      cues.push({
        start: previousEnd,
        end: start,
        viseme: start - previousEnd > 0.3 ? "BREATH" : "REST",
      });
    }

    const visemes = wordToVisemes(item.word);
    const weights = visemes.map(visemeWeight);
    const totalWeight = weights.reduce((sum, value) => sum + value, 0) || 1;
    const duration = end - start;
    let cursor = start;

    visemes.forEach((viseme, index) => {
      const segmentDuration = duration * (weights[index] / totalWeight);
      const cueEnd = index === visemes.length - 1 ? end : cursor + segmentDuration;
      cues.push({ start: cursor, end: cueEnd, viseme });
      cursor = cueEnd;
    });

    previousEnd = end;
  }

  return mergeTinyCues(cues);
}

export function buildApproximateVisemeTimeline(text: string, duration: number) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0 || !Number.isFinite(duration) || duration <= 0) {
    return [] as AvatarLipCue[];
  }

  const characterWeight = words.reduce(
    (sum, word) => sum + Math.max(1, normalizeWord(word).length),
    0,
  );
  let cursor = 0;
  const timings: AvatarWordTiming[] = words.map((word) => {
    const share = Math.max(1, normalizeWord(word).length) / characterWeight;
    const wordDuration = duration * share;
    const timing = { word, start: cursor, end: cursor + wordDuration };
    cursor += wordDuration;
    return timing;
  });

  return buildVisemeTimeline(timings);
}

function mergeTinyCues(cues: AvatarLipCue[]) {
  const merged: AvatarLipCue[] = [];

  for (const cue of cues) {
    const previous = merged[merged.length - 1];
    if (previous && previous.viseme === cue.viseme) {
      previous.end = cue.end;
      continue;
    }

    if (previous && cue.end - cue.start < 0.055) {
      previous.end = cue.end;
      continue;
    }

    merged.push({ ...cue });
  }

  return merged;
}

export function silenceAvatarLipSync() {
  activeCleanup?.();
  activeCleanup = null;
  avatarLipSyncSignal.active = false;
  avatarLipSyncSignal.viseme = "REST";
  avatarLipSyncSignal.cueIndex = -1;
}

export function attachAvatarLipTimeline(
  audio: HTMLAudioElement,
  cues: AvatarLipCue[],
) {
  silenceAvatarLipSync();

  let animationFrame = 0;
  let closed = false;
  let cueIndex = 0;

  avatarLipSyncSignal.active = true;

  const update = () => {
    if (closed) return;

    const time = audio.currentTime;
    while (cueIndex < cues.length - 1 && time >= cues[cueIndex].end) {
      cueIndex += 1;
    }

    const cue = cues[cueIndex];
    const insideCue = cue && time >= cue.start && time < cue.end;

    avatarLipSyncSignal.active = !audio.paused && !audio.ended;
    avatarLipSyncSignal.viseme = insideCue ? cue.viseme : "REST";
    avatarLipSyncSignal.cueIndex = insideCue ? cueIndex : -1;

    animationFrame = window.requestAnimationFrame(update);
  };

  update();

  const cleanup = () => {
    if (closed) return;
    closed = true;
    window.cancelAnimationFrame(animationFrame);
    avatarLipSyncSignal.active = false;
    avatarLipSyncSignal.viseme = "REST";
    avatarLipSyncSignal.cueIndex = -1;
    if (activeCleanup === cleanup) activeCleanup = null;
  };

  activeCleanup = cleanup;
  return cleanup;
}
