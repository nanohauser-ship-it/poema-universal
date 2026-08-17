export type GraphicMode = "literal" | "poetico" | "eliptico";
export type PlateStatus = "desarrollo" | "aprobada" | "maestra";
export type ChapterKind = "frontmatter" | "prologue" | "chapter" | "epilogue" | "section";

export type Chapter = {
  id: string;
  index: number;
  title: string;
  kind: ChapterKind;
  paragraphs: string[];
  wordCount: number;
};

export type StructuredDocument = {
  title: string;
  filename: string;
  paragraphCount: number;
  chapters: Chapter[];
};

export type ChapterPlan = {
  chapterId: string;
  role: string;
  tension: string;
  motifs: string[];
  visualDensity: "baja" | "media" | "alta";
  estimatedUnits: number;
};

export type ManuscriptArchitecture = {
  title: string;
  globalSummary: string;
  visualLogic: string;
  estimatedPlates: number;
  chapterPlans: ChapterPlan[];
};

export type NarrativeUnit = {
  id: string;
  chapterId: string;
  chapterTitle: string;
  index: number;
  title: string;
  fragmento: string;
  summary: string;
  visualObjective: string;
  shouldIllustrate: boolean;
  suggestedMode: GraphicMode;
  suggestedPlates: number;
  notes: string;
};

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
  chapterId: string;
  chapterTitle: string;
  unitId: string;
  unitTitle: string;
  unitIndex: number;
  mode: GraphicMode;
  status: PlateStatus;
  direction: Direction;
  imageDataUrl?: string;
  createdAt: string;
};

export type ProjectState = {
  document?: StructuredDocument;
  architecture?: ManuscriptArchitecture;
  chapterUnits: Record<string, NarrativeUnit[]>;
  plates: Plate[];
};
