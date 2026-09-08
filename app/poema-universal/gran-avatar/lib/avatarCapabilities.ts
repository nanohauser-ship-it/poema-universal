import type { AvatarBodyMode, AvatarTimelineEvent } from "../types";

export const AVATAR_CAPABILITIES = {
  synchronized: { lipSync: false, gaze: false, hands: false, stillness: true },
  cinematic: { lipSync: false, gaze: false, hands: false, stillness: false },
  organism: { lipSync: false, gaze: false, hands: false, stillness: true },
  live: { lipSync: false, gaze: false, hands: false, stillness: false },
} as const satisfies Record<AvatarBodyMode, object>;

export function canPerform(mode: AvatarBodyMode, event: AvatarTimelineEvent) {
  const capabilities = AVATAR_CAPABILITIES[mode];
  if (event.action === "handGesture") return capabilities.hands;
  if (event.action === "lookAt" || event.action === "lookAtViewer") return capabilities.gaze;
  return true;
}
