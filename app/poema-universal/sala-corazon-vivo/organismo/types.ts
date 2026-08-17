export type EmotionalState =
  | "reposo"
  | "escucha"
  | "ternura"
  | "melancolia"
  | "tension"
  | "duelo"
  | "esperanza"
  | "asombro"
  | "indignacion"
  | "memoria"
  | "dialogo"
  | "umbral";

export type ExpressionType =
  | "word"
  | "reflection"
  | "question"
  | "quote"
  | "silence";

export type OrganismInput = {
  voiceLevel: number;
  voiceActive: boolean;
  pulse: number;
  sceneTitle: string;
  depositedWords: string[];
  audienceMessages: string[];
  guestActive: boolean;
};

export type MindState = {
  dominantWords: string[];
  themes: string[];
  emotionalState: EmotionalState;
  intensity: number;
  silenceRecommended: boolean;
};

export type SoulExpression = {
  type: ExpressionType;
  text: string;
  author?: string;
  work?: string;
  source?: string;
};

export type OrganismMemory = {
  id: string;
  createdAt: string;
  emotionalState: EmotionalState;
  dominantWords: string[];
  expression: SoulExpression;
};
