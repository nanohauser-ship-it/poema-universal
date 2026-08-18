import { validateArchitectureBlueprint } from "../engine/ArchitectureValidator";
import { buildCircularOculus } from "./archetypes/circularOculus";
import { buildDarkGallery } from "./archetypes/darkGallery";
import { buildLongArchive } from "./archetypes/longArchive";
import { buildMediaLabyrinth } from "./archetypes/mediaLabyrinth";
import { buildPanoramicHall } from "./archetypes/panoramicHall";
import { buildWhiteCube } from "./archetypes/whiteCube";
import type { ArchetypeBuilder, ArchetypeRandom } from "./archetypes/shared";
import {
  ARCHITECTURE_ARCHETYPES,
  type ArchitectureArchetype,
  type ArchitectureBlueprint,
  type OutputProfile,
  type ScenographyBrief,
} from "./schema";

const BUILDERS: Readonly<Record<ArchitectureArchetype, ArchetypeBuilder>> = {
  DARK_GALLERY: buildDarkGallery,
  WHITE_CUBE: buildWhiteCube,
  LONG_ARCHIVE: buildLongArchive,
  MEDIA_LABYRINTH: buildMediaLabyrinth,
  PANORAMIC_HALL: buildPanoramicHall,
  CIRCULAR_OCULUS: buildCircularOculus,
};

export const DEFAULT_OUTPUT_PROFILES: readonly OutputProfile[] = [
  { id: "16:9", width: 1920, height: 1080, safeMargin: 0.06 },
  { id: "9:16", width: 1080, height: 1920, safeMargin: 0.09 },
  { id: "4:5", width: 1080, height: 1350, safeMargin: 0.08 },
  { id: "1:1", width: 1080, height: 1080, safeMargin: 0.08 },
  { id: "ULTRAWIDE", width: 2560, height: 1080, safeMargin: 0.05 },
];

function seedHash(seed: string): number {
  let hash = 2166136261;

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  hash += hash << 13;
  hash ^= hash >>> 7;
  hash += hash << 3;
  hash ^= hash >>> 17;
  hash += hash << 5;
  return hash >>> 0;
}

function mulberry32(initial: number): () => number {
  let state = initial >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let result = state;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

export function createSeededRandom(seed: string): ArchetypeRandom {
  const next = mulberry32(seedHash(seed));

  return {
    next,
    range: (minimum, maximum) => minimum + (maximum - minimum) * next(),
    integer: (minimum, maximum) =>
      Math.floor(minimum + next() * (maximum - minimum + 1)),
    pick: <T>(values: readonly T[]): T =>
      values[Math.min(values.length - 1, Math.floor(next() * values.length))],
  };
}

export function createScenographySeed(): string {
  const randomPart =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return `sala-madre-${randomPart}`;
}

export function createExperienceInstanceId(): string {
  const suffix = createScenographySeed().replace(/[^A-Za-z0-9_-]/g, "");
  return `take_${suffix.slice(-52)}`;
}

export function selectArchetype(seed: string): ArchitectureArchetype {
  return ARCHITECTURE_ARCHETYPES[
    seedHash(seed) % ARCHITECTURE_ARCHETYPES.length
  ];
}

export function generateLocalBlueprint(
  brief: ScenographyBrief,
  forcedArchetype?: ArchitectureArchetype
): ArchitectureBlueprint {
  const random = createSeededRandom(brief.seed);
  const archetype = forcedArchetype ?? selectArchetype(brief.seed);
  const candidate = BUILDERS[archetype]({ brief, random });
  const validation = validateArchitectureBlueprint(
    candidate,
    brief.mediaSlots.map((slot) => slot.id)
  );

  if (validation.ok === false) {
    throw new Error(
      `El generador local produjo un blueprint inválido: ${validation.errors.join(
        "; "
      )}`
    );
  }

  return validation.blueprint;
}
