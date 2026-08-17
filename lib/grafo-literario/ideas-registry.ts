import { literaryAtlas } from "./atlas-registry";
import { atlasWorksMaster } from "./atlas-works-master";

export interface AtlasIdea {
  id: string;
  label: string;
  authors: number;
  works: number;
  relatedIdeas: {
    idea: string;
    count: number;
  }[];
}

/* ============================================================
   NORMALIZACIÓN
   ============================================================ */

function normalizeIdea(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/* ============================================================
   AUTORES POR IDEA
   ============================================================ */

export function getAuthorsByIdea(idea: string) {
  const needle = normalizeIdea(idea);

  return literaryAtlas.authors.filter((author) =>
    author.concepts.some(
      (concept) => normalizeIdea(concept) === needle
    )
  );
}

/* ============================================================
   OBRAS POR IDEA
   ============================================================ */

export function getWorksByIdea(idea: string) {
  const needle = normalizeIdea(idea);

  return atlasWorksMaster.filter((work) =>
    (work.themes ?? []).some(
      (theme) => normalizeIdea(theme) === needle
    )
  );
}

/* ============================================================
   COAPARICIÓN DE IDEAS
   ============================================================ */

export function getRelatedIdeas(
  idea: string,
  limit = 12
) {
  const needle = normalizeIdea(idea);

  const authors = getAuthorsByIdea(idea);

  const counts = new Map<string, number>();

  for (const author of authors) {
    for (const concept of author.concepts) {
      const normalized = normalizeIdea(concept);

      if (!normalized || normalized === needle) {
        continue;
      }

      counts.set(
        normalized,
        (counts.get(normalized) ?? 0) + 1
      );
    }
  }

  return [...counts.entries()]
    .map(([relatedIdea, count]) => ({
      idea: relatedIdea,
      count,
    }))
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }

      return a.idea.localeCompare(b.idea);
    })
    .slice(0, limit);
}

/* ============================================================
   TODAS LAS IDEAS
   ============================================================ */

export function getAllIdeas(): AtlasIdea[] {
  const counts = new Map<string, number>();

  for (const author of literaryAtlas.authors) {
    const uniqueConcepts = new Set(
      author.concepts
        .map(normalizeIdea)
        .filter(Boolean)
    );

    for (const concept of uniqueConcepts) {
      counts.set(
        concept,
        (counts.get(concept) ?? 0) + 1
      );
    }
  }

  return [...counts.entries()]
    .map(([idea, authors]) => ({
      id: idea,
      label: idea,
      authors,
      works: getWorksByIdea(idea).length,
      relatedIdeas: getRelatedIdeas(idea),
    }))
    .sort((a, b) => {
      if (b.authors !== a.authors) {
        return b.authors - a.authors;
      }

      return a.label.localeCompare(b.label);
    });
}

/* ============================================================
   IDEA INDIVIDUAL
   ============================================================ */

export function getIdeaStats(idea: string) {
  const authors = getAuthorsByIdea(idea);
  const works = getWorksByIdea(idea);
  const relatedIdeas = getRelatedIdeas(idea);

  const territories = new Map<string, number>();
  const languages = new Map<string, number>();
  const movements = new Map<string, number>();

  for (const author of authors) {
    territories.set(
      author.country,
      (territories.get(author.country) ?? 0) + 1
    );

    for (const language of author.language) {
      languages.set(
        language,
        (languages.get(language) ?? 0) + 1
      );
    }

    for (const movement of author.movement ?? []) {
      movements.set(
        movement,
        (movements.get(movement) ?? 0) + 1
      );
    }
  }

  const sortMap = (map: Map<string, number>) =>
    [...map.entries()]
      .map(([label, count]) => ({
        label,
        count,
      }))
      .sort((a, b) => b.count - a.count);

  return {
    idea: normalizeIdea(idea),

    authors,
    works,

    authorCount: authors.length,
    workCount: works.length,

    relatedIdeas,

    territories: sortMap(territories),
    languages: sortMap(languages),
    movements: sortMap(movements),
  };
}

/* ============================================================
   CRONOLOGÍA DE UNA IDEA
   ============================================================ */

export function getIdeaChronology(idea: string) {
  return getAuthorsByIdea(idea)
    .filter(
      (author) =>
        typeof author.birth === "number"
    )
    .sort(
      (a, b) =>
        (a.birth ?? 99999) -
        (b.birth ?? 99999)
    );
}

/* ============================================================
   IDEAS PRINCIPALES
   ============================================================ */

export const atlasIdeas = getAllIdeas();

export const primaryAtlasIdeas =
  atlasIdeas.slice(0, 80);
