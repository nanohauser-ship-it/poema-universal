import type {
  EvidenceLevel,
  RelationType,
} from "./types";

export interface AtlasRelationSource {
  label: string;
  url?: string;
  work?: string;
  year?: number | string;
  note?: string;
}

export interface AtlasDocumentedRelation {
  id: string;

  source: string;
  target: string;

  type: RelationType;
  evidence: EvidenceLevel;

  summary: string;
  concepts: string[];

  sources?: AtlasRelationSource[];

  /**
   * false / undefined:
   * pendiente de revisión documental
   *
   * true:
   * apta para el grafo público
   */
  verified?: boolean;
}
