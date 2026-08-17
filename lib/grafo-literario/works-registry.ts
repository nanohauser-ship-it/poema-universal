import { atlasWorksMaster } from "./atlas-works-master";
import type { AtlasWork } from "./works-types";

import {
  literaryAtlas,
  getAtlasAuthor,
} from "./atlas-registry";

/**
 * ============================================================
 * ÍNDICES
 * ============================================================
 */

export const atlasWorkMap = new Map<string, AtlasWork>(
  atlasWorksMaster.map((work) => [
    work.id,
    work,
  ])
);

/**
 * ============================================================
 * CONSULTAS
 * ============================================================
 */

export function getWork(workId: string) {
  return atlasWorkMap.get(workId);
}

export function getWorksByAuthor(authorId: string) {
  return atlasWorksMaster.filter(
    (work) => work.authorId === authorId
  );
}

export function getAuthorForWork(workId: string) {
  const work = getWork(workId);

  if (!work) {
    return undefined;
  }

  return getAtlasAuthor(work.authorId);
}

export function getWorksByType(type: AtlasWork["type"]) {
  return atlasWorksMaster.filter(
    (work) => work.type === type
  );
}

export function getWorksByTheme(theme: string) {
  const needle = normalizeText(theme);

  return atlasWorksMaster.filter((work) =>
    (work.themes ?? []).some((item) =>
      normalizeText(item).includes(needle)
    )
  );
}

/**
 * ============================================================
 * BÚSQUEDA
 * ============================================================
 */

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function searchWorks(query: string) {
  const needle = normalizeText(query);

  if (!needle) {
    return atlasWorksMaster;
  }

  return atlasWorksMaster.filter((work) => {
    const author = getAtlasAuthor(work.authorId);

    const haystack = normalizeText(
      [
        work.title,
        work.originalTitle ?? "",
        author?.name ?? "",
        work.language ?? "",
        work.yearLabel ?? "",
        ...(work.themes ?? []),
      ].join(" ")
    );

    return haystack.includes(needle);
  });
}

/**
 * ============================================================
 * COBERTURA
 * ============================================================
 */

export function authorsWithoutWorks() {
  const authorIdsWithWorks = new Set(
    atlasWorksMaster.map(
      (work) => work.authorId
    )
  );

  return literaryAtlas.authors.filter(
    (author) =>
      !authorIdsWithWorks.has(author.id)
  );
}

export function authorsWithWorks() {
  const authorIdsWithWorks = new Set(
    atlasWorksMaster.map(
      (work) => work.authorId
    )
  );

  return literaryAtlas.authors.filter(
    (author) =>
      authorIdsWithWorks.has(author.id)
  );
}

/**
 * ============================================================
 * INTEGRIDAD
 * ============================================================
 */

export function orphanWorks() {
  return atlasWorksMaster.filter(
    (work) =>
      !literaryAtlas.authors.some(
        (author) =>
          author.id === work.authorId
      )
  );
}

/**
 * ============================================================
 * ESTADÍSTICAS
 * ============================================================
 */

export function getWorksStats() {
  const coveredAuthors =
    new Set(
      atlasWorksMaster.map(
        (work) => work.authorId
      )
    );

  return {
    works: atlasWorksMaster.length,

    totalAuthors:
      literaryAtlas.authors.length,

    authorsWithWorks:
      coveredAuthors.size,

    authorsWithoutWorks:
      literaryAtlas.authors.length -
      coveredAuthors.size,

    coverage:
      literaryAtlas.authors.length > 0
        ? Math.round(
            (
              coveredAuthors.size /
              literaryAtlas.authors.length
            ) *
              1000
          ) / 10
        : 0,

    orphanWorks:
      orphanWorks().length,
  };
}
