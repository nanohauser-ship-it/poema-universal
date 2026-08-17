export type CreatureReveal = {
  slug: string;
  name: string;
  lineage: string;
  species: string;
  symbolicCore: string;
  matter: string[];
  element: string;
  habitat: string;
  gesture: string;
  wound: string;
  desire: string;
  functionInPoem: string;
  relic: string;
  oracle: string;
  voice: {
    phrase: string;
    tone: string;
    addressee: "author" | "reader" | "poem";
    symbolicOrigin: string[];
  };
  visualDescription: string;
  platePrompt: string;
  modelingBrief: {
    silhouette: string;
    surface: string;
    scale: string;
    rigging: string;
    idleAnimation: string;
    revealAnimation: string;
    environment: string;
    meshNotes: string[];
  };
  modelUrl?: string;
};

export type RevealRequest = {
  poem: string;
  title?: string;
  authorContext?: string;
};
