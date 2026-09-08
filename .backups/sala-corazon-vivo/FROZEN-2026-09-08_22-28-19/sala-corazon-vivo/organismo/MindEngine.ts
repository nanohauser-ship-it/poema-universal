import {
  essentialWords,
} from "./library";

import type {
  EmotionalState,
  MindState,
  OrganismInput,
} from "./types";

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function interpretRoom(
  input: OrganismInput,
  heartState: {
    intensity: number;
    emotionalState: EmotionalState;
  },
): MindState {
  const corpus = [
    ...input.depositedWords,
    ...input.audienceMessages,
    input.sceneTitle,
  ]
    .join(" ")
    .toLowerCase();

  const normalized = normalize(corpus);

  const counts = essentialWords
    .map((word) => ({
      word,
      count:
        normalized.split(
          normalize(word),
        ).length - 1,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);

  const dominantWords = counts
    .slice(0, 3)
    .map((item) => item.word);

  const themes: string[] = [];

  if (
    dominantWords.includes("memoria") ||
    dominantWords.includes("regreso") ||
    dominantWords.includes("ausencia")
  ) {
    themes.push("memoria");
  }

  if (
    dominantWords.includes("madre") ||
    dominantWords.includes("casa") ||
    dominantWords.includes("ternura")
  ) {
    themes.push("vinculo");
  }

  if (
    dominantWords.includes("dignidad") ||
    dominantWords.includes("otro") ||
    dominantWords.includes("fraternidad")
  ) {
    themes.push("humanidad");
  }

  if (
    dominantWords.includes("esperanza") ||
    dominantWords.includes("luz")
  ) {
    themes.push("esperanza");
  }

  const silenceRecommended =
    input.voiceLevel < 0.035 &&
    heartState.intensity < 0.25;

  return {
    dominantWords,
    themes,
    emotionalState:
      heartState.emotionalState,
    intensity:
      heartState.intensity,
    silenceRecommended,
  };
}
