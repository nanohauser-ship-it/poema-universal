import type {
  EvidenceLevel,
  LiteraryAuthor,
  LiteraryGraph,
  LiteraryRelation,
  RelationType,
} from "./types";
import {
  atlasV4AuthorRelations,
} from "./atlas-v4-adapter";


import { literaryPilot } from "./pilot";
import { atlasRelationsMaster } from "./atlas-relations-master";

import { atlasAuthorsMaster } from "./atlas-authors-master";




import {
  atlasAuthors01,
  atlasInfluences01,
  type AtlasEvidence,
  type AtlasRelationType,
} from "./atlas-corpus-01";

/* ============================================================
   CONVERSIÓN DE EVIDENCIAS
   ============================================================ */

function mapEvidence(evidence: AtlasEvidence): EvidenceLevel {
  switch (evidence) {
    case "documentada":
      return "documented";

    case "critica":
      return "critical";

    case "probable":
      return "interpretive";

    case "resonancia":
      return "interpretive";

    default:
      return "interpretive";
  }
}

/* ============================================================
   CONVERSIÓN DE TIPOS DE RELACIÓN
   ============================================================ */

function mapRelationType(
  relation: AtlasRelationType
): RelationType {
  switch (relation) {
    case "influencia":
      return "influenced";

    case "modelo":
      return "influenced";

    case "intertextualidad":
      return "read";

    case "recepcion":
      return "read";

    case "apropiacion":
      return "influenced";

    case "reescritura":
      return "reacted_against";

    case "tradicion":
      return "conceptual_affinity";

    case "dialogo":
      return "conceptual_affinity";

    case "resonancia":
      return "conceptual_affinity";

    default:
      return "conceptual_affinity";
  }
}

/* ============================================================
   AUTORES DEL NUEVO CORPUS
   ============================================================ */

const corpusAuthors: LiteraryAuthor[] =
  [
    ...atlasAuthors01,
    ...atlasAuthorsMaster,
  ].map((author) => ({
    id: author.id,

    name: author.name,

    birth: author.birth,
    death: author.death,

    country: author.territory,

    language: author.language
      ? [author.language]
      : [],

    movement:
      author.movements ??
      (author.period ? [author.period] : []),

    description:
      `${author.name}, figura integrada en el Atlas Universal de las Influencias. ` +
      `Su presencia se documenta mediante relaciones históricas, críticas o intertextuales.`,

    concepts: author.themes ?? [],
  }));

/* ============================================================
   RELACIONES DEL NUEVO CORPUS
   ============================================================ */

const corpusRelations: LiteraryRelation[] =
  atlasInfluences01.map((relation) => ({
    id: relation.id,

    source: relation.from,
    target: relation.to,

    type: mapRelationType(relation.relation),

    evidence: mapEvidence(relation.evidence),

    summary: relation.description,

    concepts: relation.transmitted ?? [],

    sourceNote: [
      relation.sourceLabel,
      relation.sourceWork
        ? `Origen: ${relation.sourceWork}`
        : null,
      relation.targetWork
        ? `Destino: ${relation.targetWork}`
        : null,
    ]
      .filter(Boolean)
      .join(" · "),
  }));

/* ============================================================
   RELACIONES DEL REGISTRO DOCUMENTAL MAESTRO
   ============================================================ */

const masterRelations: LiteraryRelation[] =
  atlasRelationsMaster
    .filter((relation) => relation.verified === true)
    .map((relation) => ({
      id: relation.id,

      source: relation.source,
      target: relation.target,

      type: relation.type,
      evidence: relation.evidence,

      summary: relation.summary,

      concepts: relation.concepts,

      sourceNote:
        relation.sources
          ?.map((source) =>
            [
              source.label,
              source.work,
              source.year,
              source.note,
            ]
              .filter(Boolean)
              .join(" · ")
          )
          .join(" | ") ?? "",
    }));

/* ============================================================
   EVITAR DUPLICADOS
   ============================================================ */

function mergeAuthors(
  original: LiteraryAuthor[],
  incoming: LiteraryAuthor[]
) {
  const map = new Map<string, LiteraryAuthor>();

  for (const author of original) {
    map.set(author.id, author);
  }

  for (const author of incoming) {
    const existing = map.get(author.id);

    if (!existing) {
      map.set(author.id, author);
      continue;
    }

    map.set(author.id, {
      ...author,
      ...existing,

      language: Array.from(
        new Set([
          ...author.language,
          ...existing.language,
        ])
      ),

      movement: Array.from(
        new Set([
          ...(author.movement ?? []),
          ...(existing.movement ?? []),
        ])
      ),

      concepts: Array.from(
        new Set([
          ...author.concepts,
          ...existing.concepts,
        ])
      ),
    });
  }

  return [...map.values()];
}

function mergeRelations(
  original: LiteraryRelation[],
  incoming: LiteraryRelation[]
) {
  const map = new Map<string, LiteraryRelation>();

  for (const relation of original) {
    map.set(relation.id, relation);
  }

  for (const relation of incoming) {
    if (!map.has(relation.id)) {
      map.set(relation.id, relation);
    }
  }

  return [...map.values()];
}

/* ============================================================
   REGISTRO MAESTRO
   ============================================================ */

export const literaryAtlas: LiteraryGraph = {
  authors: mergeAuthors(
    literaryPilot.authors,
    corpusAuthors
  ),

  relations: mergeRelations(
    mergeRelations(
      corpusRelations,
      masterRelations
    ),
    atlasV4AuthorRelations
  ),
};

/* ============================================================
   CONSULTAS
   ============================================================ */

export function getAtlasAuthor(id: string) {
  return literaryAtlas.authors.find(
    (author) => author.id === id
  );
}

export function getIncomingRelations(id: string) {
  return literaryAtlas.relations.filter(
    (relation) => relation.target === id
  );
}

export function getOutgoingRelations(id: string) {
  return literaryAtlas.relations.filter(
    (relation) => relation.source === id
  );
}

export function getConnectedRelations(id: string) {
  return literaryAtlas.relations.filter(
    (relation) =>
      relation.source === id ||
      relation.target === id
  );
}

export function getAtlasStats() {
  return {
    authors: literaryAtlas.authors.length,
    relations: literaryAtlas.relations.length,
    documented: literaryAtlas.relations.filter(
      (relation) =>
        relation.evidence === "documented"
    ).length,
    declared: literaryAtlas.relations.filter(
      (relation) =>
        relation.evidence === "declared"
    ).length,
    critical: literaryAtlas.relations.filter(
      (relation) =>
        relation.evidence === "critical"
    ).length,
    interpretive: literaryAtlas.relations.filter(
      (relation) =>
        relation.evidence === "interpretive"
    ).length,
  };
}
