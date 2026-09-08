export type AvatarPresenceState =
  | "idle"
  | "receiving"
  | "thinking"
  | "listening"
  | "reading"
  | "speaking"
  | "paused"
  | "error";

export type AvatarBodyMode = "synchronized" | "cinematic" | "organism" | "live";

export type AvatarConversationRole = "user" | "assistant";

export type AvatarConversationMessage = {
  id: string;
  role: AvatarConversationRole;
  content: string;
  createdAt: string;
};

export type AvatarPoemRecord = {
  id: string;
  title: string;
  text: string;
  language: string;
  sourceName?: string;
  createdAt: string;
  updatedAt: string;
  /** Optional score in seconds of the generated audio, excluding inserted holds. */
  score?: AvatarTimelineEvent[];
};

export type AvatarMediaConfig = {
  posterUrl: string;
  idleVideoUrl?: string;
  listeningVideoUrl?: string;
  speakingVideoUrl?: string;
};

export type AvatarLifeState =
  | "sleeping"
  | "connecting"
  | "alive"
  | "organism"
  | "cinematic"
  | "synchronized"
  | "unconfigured"
  | "error";

export type AvatarVoicePurpose = "reading" | "speaking";

export type AvatarBodyHandle = {
  interrupt: () => void;
  sleep: () => Promise<void>;
  speak: (text: string, purpose: AvatarVoicePurpose) => Promise<boolean>;
  wake: () => Promise<boolean>;
};

export type AvatarEmotion = "neutral" | "contemplative" | "tender" | "intense" | "silence";
export type AvatarGaze = "poem" | "viewer" | "floor" | "horizon";
export type AvatarTimelineEvent = {
  id: string;
  time: number;
  duration?: number;
} & (
  | { action: "emotion"; emotion: AvatarEmotion }
  | { action: "silence"; duration: number }
  | { action: "lookAtViewer" }
  | { action: "lookAt"; target: AvatarGaze }
  | { action: "handGesture"; gesture: string; intensity?: number }
);
