export type GraphicMode = "literal" | "poetico" | "eliptico";
export type PlateStatus = "pendiente" | "desarrollo" | "aprobada" | "maestra";

export type Direction = {
  accion: string;
  lugar: string;
  momento: string;
  personajes: string[];
  emocion: string;
  elementoDominante: string;
  simbolo: string;
  noRevelar: string;
  plano: string;
  camara: string;
  composicion: string;
  luz: string;
  textura: string;
  color: string;
  textoVisible: string;
  silencio: number;
  promptImagen: string;
};

export type Plate = {
  id: string;
  numero: number;
  unitId: string;
  unitIndex: number;
  unitTitle: string;
  orderInUnit: number;
  fragmento: string;
  mode: GraphicMode;
  status: PlateStatus;
  direction: Direction;
  imageDataUrl?: string;
  createdAt: string;
};

export type NarrativeUnit = {
  id: string;
  index: number;
  chapter: string;
  title: string;
  fragmento: string;
  summary: string;
  visualObjective: string;
  shouldIllustrate: boolean;
  suggestedMode: GraphicMode;
  suggestedPlates: number;
  notes: string;
};

export type ManuscriptArchitecture = {
  title: string;
  globalSummary: string;
  visualLogic: string;
  totalSuggestedPlates: number;
  units: NarrativeUnit[];
};
