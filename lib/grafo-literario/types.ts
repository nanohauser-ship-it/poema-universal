export type EvidenceLevel =
  | "documented"
  | "declared"
  | "critical"
  | "interpretive";

export type RelationType =
  | "influenced"
  | "read"
  | "translated"
  | "admired"
  | "reacted_against"
  | "corresponded"
  | "conceptual_affinity";

export interface LiteraryAuthor {
  id: string;
  name: string;
  birth?: number;
  death?: number;
  country: string;
  language: string[];
  movement?: string[];
  description: string;
  concepts: string[];
  nobelYear?: number;
}

export interface LiteraryRelation {
  id: string;
  source: string;
  target: string;
  type: RelationType;
  evidence: EvidenceLevel;
  summary: string;
  concepts: string[];
  sourceNote?: string;
}

export interface LiteraryGraph {
  authors: LiteraryAuthor[];
  relations: LiteraryRelation[];
}
