export type AtlasNodeType =
  | "author"
  | "work"
  | "movement"
  | "language"
  | "tradition"
  | "historical_event"
  | "institution"
  | "magazine"
  | "concept"
  | "place"
  | "discipline"
  | "art_form"
  | "community"
  | "religious_tradition"
  | "oral_tradition"
  | "anonymous_tradition";

export type AtlasRelationType =
  | "literary_influence"
  | "formative_reading"
  | "author_declared_influence"
  | "mentorship"
  | "friendship"
  | "correspondence"
  | "mutual_reading"
  | "collaboration"
  | "co_creation"
  | "co_curatorship"
  | "editorial_mediation"
  | "editorial_ecosystem"
  | "institutional_mentorship"
  | "cultural_infrastructure"
  | "movement_membership"
  | "movement_foundation"
  | "critical_response"
  | "counter_narrative"
  | "canonical_rewriting"
  | "parodic_reception"
  | "intertextuality"
  | "mythic_rewriting"
  | "source_adaptation"
  | "translation"
  | "translation_mediated_reception"
  | "transcreation"
  | "language_transformation"
  | "language_shift"
  | "language_reclamation"
  | "language_rejection"
  | "multilingual_formation"
  | "oral_tradition"
  | "family_oral_transmission"
  | "coerced_oral_transmission"
  | "cultural_reconnection"
  | "cultural_preservation"
  | "archival_rescue"
  | "lived_historical_experience"
  | "historical_context"
  | "historical_trauma_transformation"
  | "field_experience"
  | "professional_experience"
  | "disciplinary_influence"
  | "political_action"
  | "political_dissidence"
  | "dissident_network"
  | "curriculum_intervention"
  | "canon_reformation"
  | "canon_revision"
  | "conceptual_creation"
  | "symbolic_filiation"
  | "visual_art_inspiration"
  | "visual_art_response"
  | "literature_to_music"
  | "music_to_literature"
  | "cinema_to_literature"
  | "literature_to_film"
  | "adaptation"
  | "document_to_fiction"
  | "text_to_vocation"
  | "text_as_survival_resource"
  | "biographical_canonization"
  | "shared_oral_tradition"
  | "shared_historical_space"
  | "cultural_conflict_as_generator"
  | "critical_affinity"
  | "authorial_rejection"
  | "authorial_qualification"
  | "ideological_transformation_over_time"
  | "intellectual_transformation_over_time"
  | "formal_reinvention"
  | "formal_inheritance"
  | "metrical_transformation"
  | "genre_tradition"
  | "textual_tradition"
  | "anonymous_transmission"
  | "traditional_authorship_attribution"
  | "composite_textual_tradition"
  | "private_memory_to_public_memory"
  | "land_based_knowledge";

export type AtlasEvidenceBasis =
  | "author_declared"
  | "correspondence"
  | "biographical"
  | "archival"
  | "scholarly_consensus"
  | "scholarly_comparison"
  | "critical_hypothesis"
  | "documented_translation"
  | "annotated_book"
  | "historical_record"
  | "institutional_source"
  | "work_level_intertext"
  | "family_testimony"
  | "oral_history"
  | "unknown";

export type AtlasConfidence =
  | "maximum"
  | "very_high"
  | "high"
  | "medium"
  | "low";

export type AtlasRelationPhase =
  | "discovery"
  | "adoption"
  | "transformation"
  | "rejection"
  | "conflict"
  | "later_reassessment"
  | "continuous"
  | "unknown";

export interface AtlasRelationEvidence {
  basis: AtlasEvidenceBasis;
  note?: string;
  sourceTitle?: string;
  sourceUrl?: string;
}

export interface AtlasRelationNodeRef {
  type: AtlasNodeType;
  id: string;
  label?: string;
}

export interface AtlasMasterRelation {
  id: string;

  source: AtlasRelationNodeRef;
  target: AtlasRelationNodeRef;

  relationType: AtlasRelationType;

  mechanisms?: string[];
  concepts?: string[];

  evidence: AtlasRelationEvidence[];

  confidence: AtlasConfidence;

  phase?: AtlasRelationPhase;

  startYear?: number;
  endYear?: number;

  scholarlyConsensus?: "yes" | "no" | "qualified" | "unknown";
  authorDeclared?: "yes" | "no" | "qualified" | "unknown";

  notes?: string[];

  workSourceId?: string;
  workTargetId?: string;
}
