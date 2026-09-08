import type { AvatarEmotion } from "../types";

/** Direction parameters, not a claim of anatomical control by a video. */
export const AVATAR_EMOTIONS = {
  neutral: { rate: 0.98, breath: 0.12, head: 0.08, hands: 0.08, gazeHold: [4, 9] },
  contemplative: { rate: 0.93, breath: 0.10, head: 0.05, hands: 0.04, gazeHold: [6, 12] },
  tender: { rate: 0.95, breath: 0.10, head: 0.06, hands: 0.06, gazeHold: [5, 11] },
  intense: { rate: 0.97, breath: 0.10, head: 0.04, hands: 0.08, gazeHold: [7, 13] },
  silence: { rate: 0, breath: 0, head: 0, hands: 0, gazeHold: [8, 15] },
} as const satisfies Record<AvatarEmotion, object>;
