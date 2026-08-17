import { atlasRelationsV4 } from "./atlas-relations-v4";

import type {
  AtlasMasterRelation,
  AtlasEvidenceBasis,
} from "./relation-ontology";

import type {
  LiteraryRelation,
  RelationType,
  EvidenceLevel,
} from "./types";

/**
 * Adaptador provisional:
 *
 * Atlas V4
 *    ↓
 * interfaz LiteraryGraph histórica
 *
 * Solo convierte relaciones AUTHOR → AUTHOR.
 *
 * Los nodos movement, historical_event, tradition,
 * place, concept, community, etc. permanecerán en V4
 * y posteriormente tendrán visualización nativa.
 */

function mapEvidence(
  basis: AtlasEvidenceBasis
): EvidenceLevel {
  switch (basis) {
    case "author_declared":
    case "correspondence":
    case "biographical":
    case "archival":
    case "documented_translation":
    case "annotated_book":
    case "historical_record":
    case "institutional_source":
    case "work_level_intertext":
      return "documented";

    case "family_testimony":
    case "oral_history":
      return "declared";

    case "scholarly_consensus":
    case "scholarly_comparison":
      return "critical";

    case "critical_hypothesis":
    case "unknown":
    default:
      return "interpretive";
  }
}

function mapRelationType(
  relation: AtlasMasterRelation
): RelationType {
  switch (relation.relationType) {

    case "formative_reading":
    case "text_to_vocation":
    case "text_as_survival_resource":
      return "read";

    case "translation":
    case "translation_mediated_reception":
    case "transcreation":
      return "translated";

    case "correspondence":
      return "corresponded";

    case "authorial_rejection":
    case "counter_narrative":
    case "parodic_reception":
      return "reacted_against";

    case "friendship":
    case "mutual_reading":
    case "collaboration":
    case "co_creation":
    case "mentorship":
      return "admired";

    case "critical_affinity":
    case "shared_historical_space":
    case "symbolic_filiation":
      return "conceptual_affinity";

    default:
      return "influenced";
  }
}

function evidenceSummary(
  relation: AtlasMasterRelation
): string {
  const notes = relation.evidence
    .map((item) => item.note)
    .filter(
      (value): value is string =>
        Boolean(value)
    );

  if (notes.length > 0) {
    return notes.join(" ");
  }

  return relation.notes?.join(" ") ??
    relation.relationType;
}

function sourceNote(
  relation: AtlasMasterRelation
): string | undefined {
  const sources = relation.evidence
    .map((item) => {
      const title = item.sourceTitle?.trim();
      const url = item.sourceUrl?.trim();

      if (title && url) {
        return `${title} — ${url}`;
      }

      return title || url || "";
    })
    .filter(Boolean);

  return sources.length > 0
    ? sources.join(" | ")
    : undefined;
}

export const atlasV4AuthorRelations:
  LiteraryRelation[] =
  atlasRelationsV4
    .filter(
      (relation) =>
        relation.source.type === "author" &&
        relation.target.type === "author"
    )
    .map((relation) => ({
      id: relation.id,

      source: relation.source.id,

      target: relation.target.id,

      type: mapRelationType(relation),

      evidence: mapEvidence(
        relation.evidence[0]?.basis ??
          "unknown"
      ),

      summary: evidenceSummary(relation),

      concepts: Array.from(
        new Set([
          ...(relation.concepts ?? []),
          ...(relation.mechanisms ?? []),
          relation.relationType,
        ])
      ),

      sourceNote: sourceNote(relation),
    }));

export const atlasV4Stats = {
  totalRelations: atlasRelationsV4.length,

  authorToAuthor:
    atlasV4AuthorRelations.length,

  structuralRelations:
    atlasRelationsV4.filter(
      (relation) =>
        relation.source.type !== "author" ||
        relation.target.type !== "author"
    ).length,
};
