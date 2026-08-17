export type SymbolicAxis =
  | "memory"
  | "desire"
  | "wound"
  | "matter";

export type CartographyNode = {
  id: string;
  label: string;
  axis: SymbolicAxis;
  meaning: string;
  evidence: string[];
  intensity: number;
  x: number;
  y: number;
  glyph: string;
};

export type CartographyLink = {
  id: string;
  from: string;
  to: string;
  relation: string;
  strength: number;
};

export type CartographyZone = {
  id: string;
  name: string;
  meaning: string;
  shape:
    | "circle"
    | "ring"
    | "fortress"
    | "triangle";
  x: number;
  y: number;
  radius: number;
};

export type SymbolicCartography = {
  secretTitle: string;
  centralSymbol: string;
  nucleus: string;
  oraclePhrase: string;
  relic: string;
  finalGesture: string;
  dominantAxis: SymbolicAxis;
  nodes: CartographyNode[];
  links: CartographyLink[];
  zones: CartographyZone[];
};
