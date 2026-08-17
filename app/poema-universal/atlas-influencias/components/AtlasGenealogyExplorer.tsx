"use client";

import { useMemo } from "react";

import { literaryAtlas } from "@/lib/grafo-literario/atlas-registry";

import type {
  EvidenceLevel,
  LiteraryAuthor,
  LiteraryRelation,
} from "@/lib/grafo-literario/types";

import styles from "./genealogy.module.css";

type Props = {
  selectedAuthorId: string;
  onSelectAuthor: (id: string) => void;
};

const evidenceLabels: Record<EvidenceLevel, string> = {
  documented: "Documentada",
  declared: "Declarada",
  critical: "Crítica",
  interpretive: "Interpretativa",
};

function lifespan(author: LiteraryAuthor) {
  if (!author.birth && !author.death) {
    return "Cronología abierta";
  }

  return `${author.birth ?? "?"} — ${
    author.death ?? "presente"
  }`;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

function getAuthor(id: string) {
  return literaryAtlas.authors.find(
    (author) => author.id === id
  );
}

function relationDirectionLabel(
  relation: LiteraryRelation
) {
  switch (relation.type) {
    case "influenced":
      return "Influencia";

    case "read":
      return "Lectura / recepción";

    case "translated":
      return "Traducción";

    case "admired":
      return "Admiración";

    case "reacted_against":
      return "Reacción / reescritura";

    case "corresponded":
      return "Correspondencia";

    case "conceptual_affinity":
      return "Afinidad crítica";

    default:
      return "Relación";
  }
}

export default function AtlasGenealogyExplorer({
  selectedAuthorId,
  onSelectAuthor,
}: Props) {
  const selected =
    getAuthor(selectedAuthorId) ??
    literaryAtlas.authors[0];

  const incoming = useMemo(
    () =>
      literaryAtlas.relations.filter(
        (relation) =>
          relation.target === selected.id
      ),
    [selected.id]
  );

  const outgoing = useMemo(
    () =>
      literaryAtlas.relations.filter(
        (relation) =>
          relation.source === selected.id
      ),
    [selected.id]
  );

  const generationsBefore = useMemo(() => {
    const ids = new Set<string>();

    for (const relation of incoming) {
      const parentRelations =
        literaryAtlas.relations.filter(
          (candidate) =>
            candidate.target === relation.source
        );

      for (const parent of parentRelations) {
        ids.add(parent.source);
      }
    }

    return [...ids]
      .map(getAuthor)
      .filter(
        (author): author is LiteraryAuthor =>
          Boolean(author)
      )
      .slice(0, 8);
  }, [incoming]);

  const generationsAfter = useMemo(() => {
    const ids = new Set<string>();

    for (const relation of outgoing) {
      const childRelations =
        literaryAtlas.relations.filter(
          (candidate) =>
            candidate.source === relation.target
        );

      for (const child of childRelations) {
        ids.add(child.target);
      }
    }

    return [...ids]
      .map(getAuthor)
      .filter(
        (author): author is LiteraryAuthor =>
          Boolean(author)
      )
      .slice(0, 8);
  }, [outgoing]);

  return (
    <div className={styles.genealogy}>
      <header className={styles.header}>
        <span>Genealogía literaria</span>

        <strong>
          Transmisiones, recepciones y descendencias
        </strong>

        <p>
          Solo se representan relaciones presentes
          actualmente en el corpus documental.
        </p>
      </header>

      {/* GENERACIÓN REMOTA ANTERIOR */}

      {generationsBefore.length > 0 && (
        <section className={styles.remoteGeneration}>
          <span className={styles.generationLabel}>
            Generaciones anteriores
          </span>

          <div className={styles.remoteNodes}>
            {generationsBefore.map((author) => (
              <button
                type="button"
                key={author.id}
                onClick={() =>
                  onSelectAuthor(author.id)
                }
              >
                <i>{initials(author.name)}</i>
                <strong>{author.name}</strong>
                <small>{lifespan(author)}</small>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ÁRBOL PRINCIPAL */}

      <section className={styles.tree}>
        <div className={styles.ancestors}>
          <span className={styles.generationLabel}>
            Influencias recibidas
          </span>

          {incoming.length === 0 ? (
            <div className={styles.empty}>
              Aún no existen antecedentes
              documentados en este corpus.
            </div>
          ) : (
            incoming.map((relation) => {
              const author =
                getAuthor(relation.source);

              if (!author) return null;

              return (
                <RelationCard
                  key={relation.id}
                  author={author}
                  relation={relation}
                  side="before"
                  onSelect={onSelectAuthor}
                />
              );
            })
          )}
        </div>

        <div className={styles.center}>
          <div className={styles.verticalLine} />

          <div className={styles.centralHalo}>
            <div className={styles.centralPortrait}>
              {initials(selected.name)}
            </div>
          </div>

          <span className={styles.centralEyebrow}>
            Presencia central
          </span>

          <h2>{selected.name}</h2>

          <p>{lifespan(selected)}</p>

          <em>{selected.country}</em>

          <div className={styles.centralConcepts}>
            {selected.concepts
              .slice(0, 6)
              .map((concept) => (
                <span key={concept}>
                  {concept}
                </span>
              ))}
          </div>

          <div className={styles.balance}>
            <div>
              <strong>{incoming.length}</strong>
              <span>recibidas</span>
            </div>

            <i />

            <div>
              <strong>{outgoing.length}</strong>
              <span>ejercidas</span>
            </div>
          </div>
        </div>

        <div className={styles.descendants}>
          <span className={styles.generationLabel}>
            Influencias ejercidas
          </span>

          {outgoing.length === 0 ? (
            <div className={styles.empty}>
              Aún no existen descendencias
              documentadas en este corpus.
            </div>
          ) : (
            outgoing.map((relation) => {
              const author =
                getAuthor(relation.target);

              if (!author) return null;

              return (
                <RelationCard
                  key={relation.id}
                  author={author}
                  relation={relation}
                  side="after"
                  onSelect={onSelectAuthor}
                />
              );
            })
          )}
        </div>
      </section>

      {/* GENERACIÓN REMOTA POSTERIOR */}

      {generationsAfter.length > 0 && (
        <section className={styles.remoteGeneration}>
          <span className={styles.generationLabel}>
            Generaciones posteriores
          </span>

          <div className={styles.remoteNodes}>
            {generationsAfter.map((author) => (
              <button
                type="button"
                key={author.id}
                onClick={() =>
                  onSelectAuthor(author.id)
                }
              >
                <i>{initials(author.name)}</i>
                <strong>{author.name}</strong>
                <small>{lifespan(author)}</small>
              </button>
            ))}
          </div>
        </section>
      )}

      <footer className={styles.legend}>
        <span>
          <i className={styles.documented} />
          Documentada
        </span>

        <span>
          <i className={styles.declared} />
          Declarada
        </span>

        <span>
          <i className={styles.critical} />
          Crítica
        </span>

        <span>
          <i className={styles.interpretive} />
          Interpretativa
        </span>
      </footer>
    </div>
  );
}

function RelationCard({
  author,
  relation,
  side,
  onSelect,
}: {
  author: LiteraryAuthor;
  relation: LiteraryRelation;
  side: "before" | "after";
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.relationCard} ${
        styles[`evidence_${relation.evidence}`]
      }`}
      onClick={() =>
        onSelect(author.id)
      }
    >
      <span className={styles.branch}>
        <i />
      </span>

      <div className={styles.nodePortrait}>
        {initials(author.name)}
      </div>

      <div className={styles.nodeBody}>
        <span className={styles.nodeDirection}>
          {side === "before"
            ? "← antecedente"
            : "descendencia →"}
        </span>

        <strong>{author.name}</strong>

        <small>
          {lifespan(author)} · {author.country}
        </small>

        <div className={styles.relationType}>
          {relationDirectionLabel(relation)}
        </div>

        {relation.concepts.length > 0 && (
          <p>
            {relation.concepts
              .slice(0, 4)
              .join(" · ")}
          </p>
        )}

        <div className={styles.evidence}>
          <i />
          {evidenceLabels[relation.evidence]}
        </div>

        {relation.summary && (
          <blockquote>
            {relation.summary}
          </blockquote>
        )}
      </div>
    </button>
  );
}
