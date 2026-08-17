/**
 * ============================================================
 * ATLAS UNIVERSAL DE LAS INFLUENCIAS
 * Sistema bibliográfico
 * ============================================================
 */

export type LiteraryWorkType =
  | "poesia"
  | "poemario"
  | "poema"
  | "novela"
  | "cuento"
  | "relato"
  | "teatro"
  | "epica"
  | "ensayo"
  | "memorias"
  | "cartas"
  | "tratado"
  | "cronica"
  | "antologia"
  | "obra-hibrida"
  | "otro";

export interface AtlasWork {
  id: string;

  title: string;

  authorId: string;

  /** Año aproximado o conocido de composición/publicación */
  year?: number;

  /** Cuando la datación es aproximada */
  yearLabel?: string;

  type: LiteraryWorkType;

  language?: string;

  originalTitle?: string;

  themes?: string[];

  /**
   * Solo para datos documentales.
   * No contiene todavía relaciones de influencia.
   */
  notes?: string;
}
