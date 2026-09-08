export type AlchemicalPlateType =
  | "prima-materia"
  | "operation"
  | "emblem"
  | "relic";

export type GeneratedAlchemicalPlate = {
  type: AlchemicalPlateType;
  title: string;
  caption: string;
  imageBase64: string;
  mimeType:
    | "image/webp"
    | "image/svg+xml";
};

export const ALCHEMICAL_PLATE_TYPES:
  AlchemicalPlateType[] = [
    "prima-materia",
    "operation",
    "emblem",
    "relic",
  ];
