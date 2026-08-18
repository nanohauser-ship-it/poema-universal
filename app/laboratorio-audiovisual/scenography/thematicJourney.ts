import {
  createExperienceInstanceId,
  createScenographySeed,
  createSeededRandom,
} from "./seededGenerator";
import type {
  ArchitectureArchetype,
  CameraAnchorBlueprint,
} from "./schema";

export type ThematicZoneId = "THRESHOLD" | "IMMERSION" | "PRESENCE";

export interface ThematicJourneyZone {
  id: ThematicZoneId;
  label: string;
  narrativeRole: string;
  spatialIntent: string;
  rhythm: string;
  seed: string;
  archetype: ArchitectureArchetype;
  cameraAnchor: CameraAnchorBlueprint["id"];
}

export interface ThematicJourneyPlan {
  id: string;
  theme: string;
  intention: string;
  createdAt: number;
  performerRequired: boolean;
  zones: readonly ThematicJourneyZone[];
}

export interface ThematicJourneyInput {
  theme: string;
  intention: string;
  performerRequired?: boolean;
  seed?: string;
}

const THRESHOLD_ARCHETYPES: readonly ArchitectureArchetype[] = [
  "LONG_ARCHIVE",
  "MEDIA_LABYRINTH",
  "WHITE_CUBE",
];

const IMMERSION_ARCHETYPES: readonly ArchitectureArchetype[] = [
  "PANORAMIC_HALL",
  "CIRCULAR_OCULUS",
  "MEDIA_LABYRINTH",
];

const PRESENCE_ARCHETYPES: readonly ArchitectureArchetype[] = [
  "DARK_GALLERY",
  "CIRCULAR_OCULUS",
  "WHITE_CUBE",
];

function safeText(value: string, maximumLength: number): string {
  return value.trim().replace(/\s+/g, " ").slice(0, maximumLength);
}

function chooseDistinctArchetype(
  candidates: readonly ArchitectureArchetype[],
  random: ReturnType<typeof createSeededRandom>,
  used: ReadonlySet<ArchitectureArchetype>
): ArchitectureArchetype {
  const available = candidates.filter((candidate) => !used.has(candidate));
  return random.pick(available.length > 0 ? available : candidates);
}

export function createThematicJourney(
  input: ThematicJourneyInput
): ThematicJourneyPlan {
  const theme = safeText(input.theme, 96) || "Materia y memoria";
  const intention =
    safeText(input.intention, 280) ||
    "Transformar el tema en una experiencia espacial, contemplativa y humana";
  const baseSeed = input.seed ?? createScenographySeed();
  const random = createSeededRandom(`${baseSeed}:${theme}:${intention}`);
  const used = new Set<ArchitectureArchetype>();
  const thresholdArchetype = chooseDistinctArchetype(
    THRESHOLD_ARCHETYPES,
    random,
    used
  );
  used.add(thresholdArchetype);
  const immersionArchetype = chooseDistinctArchetype(
    IMMERSION_ARCHETYPES,
    random,
    used
  );
  used.add(immersionArchetype);
  const presenceArchetype = chooseDistinctArchetype(
    PRESENCE_ARCHETYPES,
    random,
    used
  );

  return {
    id: createExperienceInstanceId(),
    theme,
    intention,
    createdAt: Date.now(),
    performerRequired: input.performerRequired ?? true,
    zones: [
      {
        id: "THRESHOLD",
        label: "Umbral",
        narrativeRole: "Introducir el tema y preparar la mirada",
        spatialIntent: `Un acceso gradual a ${theme}, con profundidad, pausa y una dirección clara de recorrido`,
        rhythm: "lento, revelador y respirado",
        seed: `${baseSeed}-threshold`,
        archetype: thresholdArchetype,
        cameraAnchor: "PORTAL",
      },
      {
        id: "IMMERSION",
        label: "Inmersión",
        narrativeRole: "Habitar el núcleo visual de la experiencia",
        spatialIntent: `Una arquitectura envolvente donde ${theme} continúe entre paredes, suelo, techo y profundidad`,
        rhythm: "panorámico, continuo y contemplativo",
        seed: `${baseSeed}-immersion`,
        archetype: immersionArchetype,
        cameraAnchor: "MASTER",
      },
      {
        id: "PRESENCE",
        label: "Presencia",
        narrativeRole: "Reservar un espacio legible para la performance",
        spatialIntent: `Una cámara escénica para relacionar al performer con ${theme} sin perder separación ni escala humana`,
        rhythm: "íntimo, frontal y sostenido",
        seed: `${baseSeed}-presence`,
        archetype: presenceArchetype,
        cameraAnchor: "FRONT",
      },
    ],
  };
}
