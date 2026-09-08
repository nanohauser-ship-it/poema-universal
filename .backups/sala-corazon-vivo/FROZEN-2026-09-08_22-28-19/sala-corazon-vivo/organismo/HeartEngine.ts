import type {
  EmotionalState,
  OrganismInput,
} from "./types";

function clamp01(
  value: number,
) {
  return Math.max(
    0,
    Math.min(
      1,
      value,
    ),
  );
}

export function calculateHeartState(
  input: OrganismInput,
) {
  const voice =
    clamp01(
      input.voiceLevel,
    );

  const participation =
    clamp01(
      input.depositedWords.length /
        20 +
        input.audienceMessages.length /
          20,
    );

  const presence =
    clamp01(
      Math.log2(
        Math.max(
          1,
          input.presenceCount,
        ),
      ) / 5,
    );

  const messageImpulse =
    clamp01(
      (input.pulse - 68) /
        31,
    );

  const intensity =
    clamp01(
      voice * 0.48 +
        participation * 0.20 +
        presence * 0.14 +
        messageImpulse * 0.08 +
        (input.guestActive
          ? 0.10
          : 0),
    );

  let emotionalState:
    EmotionalState =
      "escucha";

  if (input.guestActive) {
    emotionalState =
      "dialogo";
  } else if (
    intensity > 0.78
  ) {
    emotionalState =
      "umbral";
  } else if (
    voice < 0.05 &&
    intensity < 0.12
  ) {
    emotionalState =
      "reposo";
  }

  return {
    intensity,
    emotionalState,
    artisticPulse:
      Math.round(
        66 +
          intensity * 30,
      ),
  };
}
