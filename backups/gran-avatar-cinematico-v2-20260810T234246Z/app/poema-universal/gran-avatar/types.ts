export type AvatarPresenceState =
  | "idle"
  | "receiving"
  | "thinking"
  | "listening"
  | "reading"
  | "speaking"
  | "paused"
  | "error";

export type AvatarBodyMode = "organism" | "live";

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
  | "unconfigured"
  | "error";

export type AvatarVoicePurpose = "reading" | "speaking";

export type AvatarBodyHandle = {
  interrupt: () => void;
  sleep: () => Promise<void>;
  speak: (text: string, purpose: AvatarVoicePurpose) => Promise<boolean>;
  wake: () => Promise<boolean>;
};
