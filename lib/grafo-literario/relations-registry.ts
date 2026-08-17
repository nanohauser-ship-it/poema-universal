import {
  literaryAtlas,
} from "./atlas-registry";

import {
  atlasRelationsMaster,
} from "./atlas-relations-master";

import type {
  AtlasDocumentedRelation,
} from "./relations-types";

/* ============================================================
   CONSULTAS
   ============================================================ */

export function getDocumentedRelation(
  id: string
) {
  return atlasRelationsMaster.find(
    (relation) =>
      relation.id === id
  );
}

export function getDocumentedIncoming(
  authorId: string
) {
  return atlasRelationsMaster.filter(
    (relation) =>
      relation.target === authorId
  );
}

export function getDocumentedOutgoing(
  authorId: string
) {
  return atlasRelationsMaster.filter(
    (relation) =>
      relation.source === authorId
  );
}

export function getDocumentedConnected(
  authorId: string
) {
  return atlasRelationsMaster.filter(
    (relation) =>
      relation.source === authorId ||
      relation.target === authorId
  );
}

/* ============================================================
   ESTADO DOCUMENTAL
   ============================================================ */

export function getVerifiedRelations() {
  return atlasRelationsMaster.filter(
    (relation) =>
      relation.verified === true
  );
}

export function getPendingRelations() {
  return atlasRelationsMaster.filter(
    (relation) =>
      relation.verified !== true
  );
}

/* ============================================================
   INTEGRIDAD
   ============================================================ */

export function orphanRelations() {
  const authorIds = new Set(
    literaryAtlas.authors.map(
      (author) => author.id
    )
  );

  return atlasRelationsMaster.filter(
    (relation) =>
      !authorIds.has(relation.source) ||
      !authorIds.has(relation.target)
  );
}

export function duplicateRelations() {
  const groups = new Map<
    string,
    AtlasDocumentedRelation[]
  >();

  for (const relation of atlasRelationsMaster) {
    const key = [
      relation.source,
      relation.target,
      relation.type,
    ].join("::");

    const current =
      groups.get(key) ?? [];

    current.push(relation);

    groups.set(key, current);
  }

  return [...groups.entries()]
    .filter(
      ([, relations]) =>
        relations.length > 1
    )
    .map(([key, relations]) => ({
      key,
      relations,
    }));
}

/* ============================================================
   ESTADÍSTICAS
   ============================================================ */

export function relationStats() {
  return {
    relations:
      atlasRelationsMaster.length,

    verified:
      getVerifiedRelations().length,

    pending:
      getPendingRelations().length,

    orphans:
      orphanRelations().length,

    duplicates:
      duplicateRelations().length,
  };
}
