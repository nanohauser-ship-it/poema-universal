export type BorgesInput = {
  title: string;
  author: string;
  language: string;
  poem: string;
  translation: string;
  notes: string;
};

export type ArchetypeKey =
  | "shadow"
  | "persona"
  | "child"
  | "mother"
  | "hero"
  | "wise-elder"
  | "anima-animus"
  | "trickster"
  | "self";

export type SymbolFamily =
  | "cosmos"
  | "element"
  | "plant"
  | "animal"
  | "body"
  | "house"
  | "object"
  | "journey"
  | "rite"
  | "spirit";

export type SymbolNode = {
  id: string;
  label: string;
  family: SymbolFamily;
  evidence: string;
  literalFunction: string;
  symbolicFunction: string;
  shadowFunction: string;
  transformation: string;
  intensity: number;
  x: number;
  y: number;
};

export type SymbolEdge = {
  source: string;
  target: string;
  relation:
    | "attraction"
    | "opposition"
    | "reflection"
    | "return"
    | "transformation"
    | "concealment";
  explanation: string;
  strength: number;
};

export type ArchetypeReading = {
  key: ArchetypeKey;
  name: string;
  intensity: number;
  evidence: string[];
  function: string;
  shadow: string;
};

export type SoulMovement = {
  initialState: string;
  rupture: string;
  descent: string;
  encounter: string;
  possibleIntegration: string;
  unresolvedRisk: string;
  individuationGesture: string;
};

export type SymbolicReading = {
  poemTitle: string;
  entryVerse: string;
  invisibleCore: string;

  labyrinth: {
    secretForm: string;
    hiddenCenter: string;
    bifurcation: string;
    falseExit: string;
    returnMovement: string;
  };

  mirror: {
    visibleVoice: string;
    reflectedIdentity: string;
    doubleFigure: string;
    activeAbsence: string;
    inversion: string;
    reciprocalGaze: string;
  };

  dominantArchetype: ArchetypeReading;
  compensatoryArchetype: ArchetypeReading;
  secondaryArchetypes: ArchetypeReading[];

  rulingSymbol: {
    name: string;
    description: string;
  };

  absentSymbol: {
    name: string;
    evidenceOfAbsence: string;
    function: string;
  };

  blindSpot: string;
  centralParadox: string;
  projection: string;
  secretLaw: string;

  symbols: SymbolNode[];
  edges: SymbolEdge[];
  soulMovement: SoulMovement;

  revisionPaths: string[];
  archetypalScene: string;
  relic: string;
  oracle: string;
  finalRitual: string;
};

export type SymbolicResponse = {
  reading: SymbolicReading;
};
