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
  fragmento: string;
  mode: GraphicMode;
  status: PlateStatus;
  direction: Direction;
  imageDataUrl?: string;
  createdAt: string;
};
