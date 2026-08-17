export type TutelaryMode =
  | "inspiration"
  | "protection"
  | "mirror";

export type TutelaryPresence = {
  id: string;
  authorName: string;
  symbolicName: string;
  description: string;
  aura: string;
  symbols: string[];
  openingPhrase: string;
  closingPhrase: string;
};

export type WritingSession = {
  presenceId: string;
  mode: TutelaryMode;
  title: string;
  content: string;
  updatedAt: string;
};
