"use client";

import { useMemo, useState } from "react";

import {
  getIdeaStats,
  getIdeaChronology,
  primaryAtlasIdeas,
} from "@/lib/grafo-literario/ideas-registry";

import styles from "./ideas-v2.module.css";

type Props = {
  selectedIdea: string;
  onSelectIdea: (idea: string) => void;
  onSelectAuthor: (authorId: string) => void;
};

function title(value: string) {
  if (!value) return value;

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}

export default function AtlasIdeasExplorer({
  selectedIdea,
  onSelectIdea,
  onSelectAuthor,
}: Props) {
  const [ideaQuery, setIdeaQuery] = useState("");

  const stats = useMemo(
    () => getIdeaStats(selectedIdea),
    [selectedIdea]
  );

  const chronology = useMemo(
    () => getIdeaChronology(selectedIdea),
    [selectedIdea]
  );

  const visibleIdeas = useMemo(() => {
    const q = ideaQuery
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (!q) {
      return primaryAtlasIdeas;
    }

    return primaryAtlasIdeas.filter((idea) =>
      idea.label
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(q)
    );
  }, [ideaQuery]);

  const related = stats.relatedIdeas.slice(0, 10);
  const authors = stats.authors.slice(0, 12);
  const works = stats.works.slice(0, 8);

  return (
    <div className={styles.explorer}>
      {/* ============================================
          ÍNDICE DE IDEAS
          ============================================ */}

      <aside className={styles.ideaIndex}>
        <div className={styles.indexHeader}>
          <span>Archivo conceptual</span>
          <strong>80 ideas principales</strong>
        </div>

        <div className={styles.search}>
          <span>⌕</span>

          <input
            value={ideaQuery}
            onChange={(event) =>
              setIdeaQuery(event.target.value)
            }
            placeholder="Buscar una idea…"
          />
        </div>

        <div className={styles.ideaList}>
          {visibleIdeas.map((idea, index) => (
            <button
              key={idea.id}
              type="button"
              className={
                selectedIdea === idea.id
                  ? styles.ideaActive
                  : ""
              }
              onClick={() =>
                onSelectIdea(idea.id)
              }
            >
              <span className={styles.ideaRank}>
                {String(index + 1).padStart(2, "0")}
              </span>

              <strong>{title(idea.label)}</strong>

              <em>{idea.authors}</em>
            </button>
          ))}
        </div>
      </aside>

      {/* ============================================
          COSMOLOGÍA DE LA IDEA
          ============================================ */}

      <section className={styles.ideaCosmos}>
        <div className={styles.eyebrow}>
          Idea central
        </div>

        <div className={styles.orbitLarge} />
        <div className={styles.orbitSmall} />

        <div className={styles.ideaCore}>
          <span>◉</span>

          <h2>{title(selectedIdea)}</h2>

          <p>
            {stats.authorCount} autores ·{" "}
            {stats.workCount} obras registradas
          </p>
        </div>

        <div className={styles.relatedCloud}>
          {related.map((item, index) => {
            const max =
              related[0]?.count || 1;

            const strength =
              Math.max(
                0.45,
                item.count / max
              );

            return (
              <button
                key={item.idea}
                type="button"
                style={
                  {
                    "--strength": strength,
                    "--slot": index,
                  } as React.CSSProperties
                }
                onClick={() =>
                  onSelectIdea(item.idea)
                }
              >
                <strong>
                  {title(item.idea)}
                </strong>

                <small>
                  {item.count} cruces
                </small>
              </button>
            );
          })}
        </div>

        <div className={styles.ideaMetrics}>
          <div>
            <span>Territorios</span>
            <strong>
              {stats.territories.length}
            </strong>
          </div>

          <div>
            <span>Lenguas</span>
            <strong>
              {stats.languages.length}
            </strong>
          </div>

          <div>
            <span>Movimientos</span>
            <strong>
              {stats.movements.length}
            </strong>
          </div>
        </div>
      </section>

      {/* ============================================
          AUTORES + OBRAS
          ============================================ */}

      <aside className={styles.ideaPeople}>
        <div className={styles.peopleHeader}>
          <span>Presencias</span>
          <strong>
            Autores de {title(selectedIdea)}
          </strong>
        </div>

        <div className={styles.authorList}>
          {authors.map((author, index) => (
            <button
              key={author.id}
              type="button"
              onClick={() =>
                onSelectAuthor(author.id)
              }
            >
              <span className={styles.number}>
                {String(index + 1).padStart(2, "0")}
              </span>

              <span>
                <strong>{author.name}</strong>

                <small>
                  {author.birth ?? "?"}
                  {author.death
                    ? `–${author.death}`
                    : ""}{" "}
                  · {author.country}
                </small>
              </span>
            </button>
          ))}
        </div>

        <div className={styles.works}>
          <span>Obras vinculadas</span>

          {works.length ? (
            <div>
              {works.map((work) => (
                <span key={work.id}>
                  {work.title}
                </span>
              ))}
            </div>
          ) : (
            <p>
              La bibliografía de esta idea
              todavía está creciendo.
            </p>
          )}
        </div>
      </aside>

      {/* ============================================
          VIAJE HISTÓRICO
          ============================================ */}

      <section className={styles.chronology}>
        <div className={styles.chronologyTitle}>
          <span>Viaje histórico de una idea</span>

          <strong>{title(selectedIdea)}</strong>
        </div>

        <div className={styles.chronologyRail}>
          <div className={styles.line} />

          {chronology
            .slice(0, 18)
            .map((author, index) => (
              <button
                key={author.id}
                type="button"
                style={{
                  left:
                    chronology.length <= 1
                      ? "50%"
                      : `${
                          4 +
                          (index /
                            Math.max(
                              1,
                              Math.min(
                                chronology.length,
                                18
                              ) - 1
                            )) *
                            92
                        }%`,
                }}
                onClick={() =>
                  onSelectAuthor(author.id)
                }
              >
                <i />

                <span>
                  {author.birth ?? "?"}
                </span>

                <strong>
                  {author.name}
                </strong>
              </button>
            ))}
        </div>

        <div className={styles.eras}>
          <span>Antigüedad</span>
          <span>Edad Media</span>
          <span>Modernidad</span>
          <span>Vanguardias</span>
          <span>Contemporáneo</span>
        </div>
      </section>

      {/* ============================================
          TERRITORIOS
          ============================================ */}

      <section className={styles.territories}>
        <div>
          <span>Territorios principales</span>

          <strong>
            {stats.territories
              .slice(0, 8)
              .map((item) => item.label)
              .join(" · ") ||
              "Cartografía abierta"}
          </strong>
        </div>

        <div>
          <span>Lenguas principales</span>

          <strong>
            {stats.languages
              .slice(0, 8)
              .map((item) => item.label)
              .join(" · ") ||
              "Cartografía abierta"}
          </strong>
        </div>

        <div>
          <span>Movimientos</span>

          <strong>
            {stats.movements
              .slice(0, 8)
              .map((item) => item.label)
              .join(" · ") ||
              "Cartografía abierta"}
          </strong>
        </div>
      </section>
    </div>
  );
}
