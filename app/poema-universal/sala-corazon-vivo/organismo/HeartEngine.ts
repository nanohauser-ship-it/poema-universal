import type {
  EmotionalState,
  OrganismInput,
} from "./types";

export function calculateHeartState(
  input: OrganismInput,
) {
  const voice =
    Math.max(0, Math.min(1, input.voiceLevel));

  const participation =
    Math.min(
      1,
      input.depositedWords.length / 20 +
        input.audienceMessages.length / 20,
    );

  const intensity =
    Math.max(
      0,
      Math.min(
        1,
        voice * 0.55 +
          participation * 0.25 +
          (input.guestActive ? 0.2 : 0),
      ),
    );

  let emotionalState: EmotionalState =
    "escucha";

  if (input.guestActive) {
    emotionalState = "dialogo";
  } else if (intensity > 0.78) {
    emotionalState = "umbral";
  } else if (voice < 0.05) {
    emotionalState = "reposo";
  }

  return {
    intensity,
    emotionalState,
    artisticPulse:
      Math.round(66 + intensity * 30),
  };
}
