import type {
  MindState,
  OrganismMemory,
  SoulExpression,
} from "./types";

const STORAGE_KEY =
  "poema-universal-organism-memory-v1";

export function storeMemory(
  mind: MindState,
  expression: SoulExpression,
) {
  if (
    typeof window === "undefined" ||
    expression.type === "silence"
  ) {
    return;
  }

  const previous = readMemories();

  const memory: OrganismMemory = {
    id: crypto.randomUUID(),
    createdAt:
      new Date().toISOString(),
    emotionalState:
      mind.emotionalState,
    dominantWords:
      mind.dominantWords,
    expression,
  };

  const next = [
    memory,
    ...previous,
  ].slice(0, 100);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(next),
  );
}

export function readMemories():
  OrganismMemory[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    return JSON.parse(
      localStorage.getItem(
        STORAGE_KEY,
      ) ?? "[]",
    );
  } catch {
    return [];
  }
}
