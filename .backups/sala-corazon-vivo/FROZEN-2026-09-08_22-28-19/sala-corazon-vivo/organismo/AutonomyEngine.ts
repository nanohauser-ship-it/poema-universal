import type {
  MindState,
} from "./types";

export type AutonomyDecision = {
  speak: boolean;
  beatsUntilNextDecision: number;
  reason:
    | "silence"
    | "listening"
    | "intensity"
    | "theme"
    | "presence"
    | "chance";
};

function randomBetween(
  min: number,
  max: number,
) {
  return (
    Math.floor(
      Math.random() *
        (max - min + 1),
    ) + min
  );
}

export function decideAutonomy(
  mind: MindState,
  options?: {
    voiceActive?: boolean;
    guestActive?: boolean;
  },
): AutonomyDecision {
  const voiceActive =
    options?.voiceActive ?? false;

  const guestActive =
    options?.guestActive ?? false;

  /*
   * Si alguien está hablando,
   * el organismo tiende a escuchar.
   */
  if (
    voiceActive &&
    Math.random() < 0.78
  ) {
    return {
      speak: false,
      beatsUntilNextDecision:
        randomBetween(7, 15),
      reason: "listening",
    };
  }

  /*
   * El silencio sugerido por Mente
   * debe tener peso real.
   */
  if (
    mind.silenceRecommended &&
    Math.random() < 0.68
  ) {
    return {
      speak: false,
      beatsUntilNextDecision:
        randomBetween(10, 22),
      reason: "silence",
    };
  }

  /*
   * Con invitado:
   * menos protagonismo del organismo.
   */
  if (
    guestActive &&
    Math.random() < 0.52
  ) {
    return {
      speak: false,
      beatsUntilNextDecision:
        randomBetween(8, 17),
      reason: "presence",
    };
  }

  /*
   * Un tema claro aumenta
   * la posibilidad de expresión.
   */
  if (
    mind.themes.length > 0 &&
    Math.random() < 0.58
  ) {
    return {
      speak: true,
      beatsUntilNextDecision:
        randomBetween(8, 17),
      reason: "theme",
    };
  }

  /*
   * Intensidad alta:
   * mayor probabilidad de intervenir.
   */
  if (
    mind.intensity > 0.62 &&
    Math.random() < 0.66
  ) {
    return {
      speak: true,
      beatsUntilNextDecision:
        randomBetween(6, 13),
      reason: "intensity",
    };
  }

  /*
   * Estado normal:
   * azar controlado.
   */
  const speak =
    Math.random() < 0.42;

  return {
    speak,
    beatsUntilNextDecision:
      speak
        ? randomBetween(8, 18)
        : randomBetween(8, 20),
    reason: "chance",
  };
}
