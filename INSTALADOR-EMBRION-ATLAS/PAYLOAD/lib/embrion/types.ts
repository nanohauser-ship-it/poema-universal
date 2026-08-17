export type ClaimKind = "documental_fact" | "curatorial_annotation" | "computational_interpretation";
export type EvidenceGrade = "limited" | "suggestive" | "solid_in_corpus";
export type RightsStatus = "public_domain" | "licensed" | "excerpt_only" | "unknown";
export type EvidenceRelation = "supports" | "qualifies" | "contradicts";

export type Period = {
  id: string;
  label: string;
  shortLabel: string;
  startYear: number;
  endYear: number;
  order: number;
  color: string;
  description: string;
  parentId?: string;
  isPilot: boolean;
};

export type Author = {
  id: string;
  name: string;
  birthYear?: number;
  deathYear?: number;
  territory: string;
  language: string;
};

export type Source = {
  id: string;
  institution: string;
  title: string;
  url: string;
  accessedAt: string;
  editionNote: string;
  reliability: "institutional_edition" | "institutional_study" | "catalogue_record";
};

export type Work = {
  id: string;
  title: string;
  authorId: string;
  dateStart: number;
  dateEnd: number;
  dateLabel: string;
  datePrecision: "exact" | "approximate" | "publication" | "composition_range";
  periodId: string;
  movement: string[];
  territory: string;
  language: string;
  sourceId: string;
  rightsStatus: RightsStatus;
  rightsNote: string;
  textStatus: "excerpt_indexed" | "full_text_indexed" | "metadata_only";
  curatorialTags: string[];
};

export type Passage = {
  id: string;
  workId: string;
  excerpt: string;
  locator: string;
  conceptIds: string[];
  legalDisplay: "full_excerpt" | "short_excerpt" | "metadata_only";
};

export type EvidenceDimensions = {
  corpusCoverage: number;
  sourceQuality: number;
  agreement: number;
  temporalCoverage: number;
};

export type Claim = {
  id: string;
  conceptId: string;
  periodId: string;
  kind: ClaimKind;
  title: string;
  statement: string;
  method: string;
  limitations: string[];
  evidenceGrade: EvidenceGrade;
  evidenceDimensions: EvidenceDimensions;
  createdBy: "curator" | "deterministic_analysis" | "language_model_reviewed";
  analysisVersion: string;
};

export type ClaimEvidence = {
  claimId: string;
  passageId: string;
  relation: EvidenceRelation;
  weight: number;
  note: string;
};

export type GenealogyNode = {
  id: string;
  conceptId: string;
  periodId: string;
  label: string;
  description: string;
  claimId: string;
  lane: number;
  intensity: number;
};

export type GenealogyEdge = {
  id: string;
  from: string;
  to: string;
  relation: "persistence" | "transformation" | "rupture" | "reappearance" | "coexistence";
  confidence: number;
  claimId: string;
};

export type GenomeVector = {
  conceptId: string;
  periodId: string;
  presence: number;
  recurrence: number;
  semanticDiversity: number;
  intensity: number;
  dispersion: number;
  persistence: number;
  transformation: number;
  connections: number;
  stability: number;
  evidenceCoverage: number;
  sampleSize: number;
};

export type EvidenceBundle = {
  claim: Claim;
  evidence: Array<{
    relation: EvidenceRelation;
    weight: number;
    note: string;
    passage: Passage;
    work: Work;
    author: Author;
    source: Source;
  }>;
};

export type ComparisonObservation = {
  id: string;
  category: "continuity" | "rupture" | "transformation" | "difference" | "relation";
  label: string;
  statement: string;
  claimIds: string[];
};

export type ComparisonResult = {
  left: Period;
  right: Period;
  observations: ComparisonObservation[];
  limitation: string;
};

export type QuestionAnswer = {
  question: string;
  answer: string;
  claimIds: string[];
  workIds: string[];
  mode: "corpus_template" | "corpus_plus_model";
  limitations: string[];
};

export type BootstrapData = {
  project: {
    title: string;
    subtitle: string;
    conceptId: string;
    conceptLabel: string;
    corpusLabel: string;
    analysisVersion: string;
  };
  periods: Period[];
  authors: Author[];
  works: Work[];
  passages: Passage[];
  sources: Source[];
  claims: Claim[];
  claimEvidence: ClaimEvidence[];
  genealogyNodes: GenealogyNode[];
  genealogyEdges: GenealogyEdge[];
  genomes: GenomeVector[];
};
