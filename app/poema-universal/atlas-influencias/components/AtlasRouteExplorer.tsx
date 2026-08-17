"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { literaryAtlas } from "@/lib/grafo-literario/atlas-registry";

import type {
  EvidenceLevel,
  LiteraryAuthor,
  LiteraryRelation,
} from "@/lib/grafo-literario/types";

import styles from "./route.module.css";

type Props = {
  selectedAuthorId: string;
  onSelectAuthor: (id: string) => void;
};

type RouteStep = {
  author: LiteraryAuthor;
  relation?: LiteraryRelation;
};

const evidenceLabels: Record<EvidenceLevel, string> = {
  documented: "Documentada",
  declared: "Declarada",
  critical: "Crítica",
  interpretive: "Interpretativa",
};

function getAuthor(id: string) {
  return literaryAtlas.authors.find(
    (author) => author.id === id
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

function lifespan(author: LiteraryAuthor) {
  if (!author.birth && !author.death) {
    return "Cronología abierta";
  }

  return `${author.birth ?? "?"} — ${
    author.death ?? "presente"
  }`;
}

function relationLabel(
  relation: LiteraryRelation
) {
  switch (relation.type) {
    case "influenced":
      return "influencia";

    case "read":
      return "lectura / recepción";

    case "translated":
      return "traducción";

    case "admired":
      return "admiración";

    case "reacted_against":
      return "reacción";

    case "corresponded":
      return "correspondencia";

    case "conceptual_affinity":
      return "afinidad crítica";

    default:
      return "conexión";
  }
}

/* ============================================================
   RUTA DIRIGIDA MÁS CORTA
   source → target
   ============================================================ */

function findRoute(
  sourceId: string,
  targetId: string
): RouteStep[] {
  if (sourceId === targetId) {
    const author = getAuthor(sourceId);

    return author
      ? [{ author }]
      : [];
  }

  const queue: string[] = [sourceId];

  const visited = new Set<string>([
    sourceId,
  ]);

  const previous = new Map<
    string,
    {
      authorId: string;
      relation: LiteraryRelation;
    }
  >();

  while (queue.length) {
    const current = queue.shift()!;

    const outgoing =
      literaryAtlas.relations.filter(
        (relation) =>
          relation.source === current
      );

    for (const relation of outgoing) {
      if (visited.has(relation.target)) {
        continue;
      }

      visited.add(relation.target);

      previous.set(relation.target, {
        authorId: current,
        relation,
      });

      if (relation.target === targetId) {
        queue.length = 0;
        break;
      }

      queue.push(relation.target);
    }
  }

  if (!previous.has(targetId)) {
    return [];
  }

  const ids: string[] = [targetId];
  let cursor = targetId;

  while (cursor !== sourceId) {
    const prev = previous.get(cursor);

    if (!prev) {
      return [];
    }

    cursor = prev.authorId;
    ids.unshift(cursor);
  }

  const result: RouteStep[] = [];

  ids.forEach((id, index) => {
    const author = getAuthor(id);

    if (!author) return;

    if (index === 0) {
      result.push({ author });
      return;
    }

    const relation =
      previous.get(id)?.relation;

    result.push({
      author,
      relation,
    });
  });

  return result;
}

function reachableFrom(sourceId: string) {
  const visited =
    new Set<string>([sourceId]);

  const queue = [sourceId];

  while (queue.length) {
    const current = queue.shift()!;

    for (const relation of literaryAtlas.relations) {
      if (
        relation.source !== current ||
        visited.has(relation.target)
      ) {
        continue;
      }

      visited.add(relation.target);
      queue.push(relation.target);
    }
  }

  visited.delete(sourceId);

  return [...visited];
}

export default function AtlasRouteExplorer({
  selectedAuthorId,
  onSelectAuthor,
}: Props) {
  const initialAuthor =
    getAuthor(selectedAuthorId) ??
    literaryAtlas.authors[0];

  const [sourceId, setSourceId] =
    useState(initialAuthor.id);

  useEffect(() => {
    setSourceId(selectedAuthorId);
  }, [selectedAuthorId]);

  const selected =
    getAuthor(sourceId) ??
    literaryAtlas.authors[0];

  const allAuthors = useMemo(
    () =>
      [...literaryAtlas.authors].sort(
        (a, b) =>
          a.name.localeCompare(
            b.name,
            "es"
          )
      ),
    []
  );

  const reachableIds = useMemo(
    () => reachableFrom(selected.id),
    [selected.id]
  );

  const reachableAuthors = useMemo(
    () =>
      reachableIds
        .map(getAuthor)
        .filter(
          (
            author
          ): author is LiteraryAuthor =>
            Boolean(author)
        )
        .sort((a, b) =>
          a.name.localeCompare(
            b.name,
            "es"
          )
        ),
    [reachableIds]
  );

  const [targetId, setTargetId] =
    useState("");

  useEffect(() => {
    if (
      targetId &&
      targetId !== selected.id
    ) {
      return;
    }

    if (
      selected.id === "homer" &&
      getAuthor("eco")
    ) {
      setTargetId("eco");
      return;
    }

    if (
      selected.id === "borges" &&
      getAuthor("eco")
    ) {
      setTargetId("eco");
      return;
    }

    const fallback =
      allAuthors.find(
        (author) =>
          author.id !== selected.id
      );

    setTargetId(
      fallback?.id ?? ""
    );
  }, [
    selected.id,
    targetId,
    allAuthors,
  ]);

  const route = useMemo(
    () =>
      targetId
        ? findRoute(
            selected.id,
            targetId
          )
        : [],
    [selected.id, targetId]
  );

  function swapEndpoints() {
    if (!targetId) return;

    const previousSource =
      selected.id;

    setSourceId(targetId);
    setTargetId(previousSource);
  }

  const target =
    targetId
      ? getAuthor(targetId)
      : undefined;

  const routeConcepts = Array.from(
    new Set(
      route.flatMap((step) =>
        step.relation?.concepts ?? []
      )
    )
  ).slice(0, 12);

  const routeRelations = route
    .map((step) => step.relation)
    .filter(
      (
        relation
      ): relation is LiteraryRelation =>
        Boolean(relation)
    );

  const evidenceProfile = {
    documented: routeRelations.filter(
      (relation) =>
        relation.evidence === "documented"
    ).length,

    declared: routeRelations.filter(
      (relation) =>
        relation.evidence === "declared"
    ).length,

    critical: routeRelations.filter(
      (relation) =>
        relation.evidence === "critical"
    ).length,

    interpretive: routeRelations.filter(
      (relation) =>
        relation.evidence === "interpretive"
    ).length,
  };

  const datedAuthors = route.filter(
    (step) =>
      typeof step.author.birth === "number"
  );

  const firstBirth =
    datedAuthors[0]?.author.birth;

  const lastBirth =
    datedAuthors[
      datedAuthors.length - 1
    ]?.author.birth;

  const chronologicalSpan =
    typeof firstBirth === "number" &&
    typeof lastBirth === "number"
      ? Math.abs(lastBirth - firstBirth)
      : null;

  return (
    <div className={styles.route}>
      <header className={styles.header}>
        <span>Ruta de transmisión</span>

        <h2>
          De una obra a otra conciencia
        </h2>

        <p>
          El recorrido sigue únicamente
          relaciones dirigidas presentes en
          el corpus documental.
        </p>
      </header>

      <section className={styles.controls}>
        <label className={styles.destination}>
          <span>Origen</span>

          <select
            value={sourceId}
            onChange={(event) =>
              setSourceId(
                event.target.value
              )
            }
          >
            {allAuthors.map((author) => (
              <option
                key={author.id}
                value={author.id}
              >
                {author.name}
              </option>
            ))}
          </select>

          <small>
            {lifespan(selected)} ·{" "}
            {selected.country}
          </small>
        </label>

        <button
          type="button"
          className={styles.swapButton}
          onClick={swapEndpoints}
          title="Intercambiar origen y destino"
        >
          ⇄
        </button>

        <label className={styles.destination}>
          <span>Destino</span>

          <select
            value={targetId}
            onChange={(event) =>
              setTargetId(
                event.target.value
              )
            }
          >
            {allAuthors
              .filter(
                (author) =>
                  author.id !== sourceId
              )
              .map((author) => (
                <option
                  key={author.id}
                  value={author.id}
                >
                  {author.name}
                </option>
              ))}
          </select>

          {target && (
            <small>
              {lifespan(target)} ·{" "}
              {target.country}
            </small>
          )}
        </label>
      </section>

      <section className={styles.routeAvailability}>
        <span>
          {reachableIds.length}
          {" "}
          destinos alcanzables desde{" "}
          {selected.name}
        </span>

        {route.length > 0 ? (
          <strong>
            Ruta encontrada ·{" "}
            {route.length - 1} saltos
          </strong>
        ) : (
          <strong>
            Sin cadena documentada
          </strong>
        )}
      </section>

      {route.length > 0 && (
        <section className={styles.journeyPrelude}>
          <div>
            <span>Ruta encontrada</span>

            <strong>
              {route
                .map((step) => step.author.name)
                .join(" → ")}
            </strong>
          </div>

          <div className={styles.journeyStats}>
            <span>
              <strong>
                {Math.max(0, route.length - 1)}
              </strong>
              saltos
            </span>

            <span>
              <strong>
                {routeConcepts.length}
              </strong>
              conceptos
            </span>

            <span>
              <strong>
                {chronologicalSpan ?? "—"}
              </strong>
              años
            </span>
          </div>
        </section>
      )}

      {route.length > 0 ? (
        <>
          <section className={styles.routeMap}>
            <div className={styles.masterLine} />

            {route.map(
              (step, index) => (
                <div
                  key={step.author.id}
                  className={styles.stage}
                >
                  {index > 0 &&
                    step.relation && (
                      <div
                        className={
                          styles.connector
                        }
                      >
                        <span>
                          {relationLabel(
                            step.relation
                          )}
                        </span>

                        <i
                          className={
                            styles[
                              `evidence_${step.relation.evidence}`
                            ]
                          }
                        />

                        <small>
                          {
                            evidenceLabels[
                              step.relation
                                .evidence
                            ]
                          }
                        </small>
                      </div>
                    )}

                  <button
                    type="button"
                    className={
                      styles.authorNode
                    }
                    onClick={() =>
                      onSelectAuthor(
                        step.author.id
                      )
                    }
                  >
                    <div
                      className={
                        styles.portrait
                      }
                    >
                      {initials(
                        step.author.name
                      )}
                    </div>

                    <strong>
                      {step.author.name}
                    </strong>

                    <span>
                      {step.author.birth ??
                        "?"}
                      {step.author.death
                        ? ` — ${step.author.death}`
                        : ""}
                    </span>

                    <em>
                      {step.author.country}
                    </em>
                  </button>

                  {step.relation && (
                    <article
                      className={
                        styles.transmission
                      }
                    >
                      <span>
                        Lo que atraviesa
                      </span>

                      <p>
                        {step.relation
                          .concepts.length
                          ? step.relation.concepts.join(
                              " · "
                            )
                          : "Transmisión todavía sin conceptos catalogados."}
                      </p>

                      {step.relation
                        .summary && (
                        <blockquote>
                          {
                            step.relation
                              .summary
                          }
                        </blockquote>
                      )}
                    </article>
                  )}
                </div>
              )
            )}
          </section>

          <section className={styles.summary}>
            <div>
              <span>Origen</span>
              <strong>
                {selected.name}
              </strong>
            </div>

            <div>
              <span>Saltos</span>
              <strong>
                {Math.max(
                  0,
                  route.length - 1
                )}
              </strong>
            </div>

            <div>
              <span>Destino</span>
              <strong>
                {target?.name ?? "—"}
              </strong>
            </div>
          </section>

          <section
            className={styles.sequence}
          >
            {route.map(
              (step, index) => (
                <span
                  key={step.author.id}
                >
                  {step.author.name}

                  {index <
                    route.length - 1 &&
                    " → "}
                </span>
              )
            )}
          </section>

          <section className={styles.routeDNA}>
            <div className={styles.routeConcepts}>
              <span>Lo que viaja por la ruta</span>

              <div>
                {routeConcepts.length ? (
                  routeConcepts.map(
                    (concept) => (
                      <i key={concept}>
                        {concept}
                      </i>
                    )
                  )
                ) : (
                  <i>
                    Sin conceptos catalogados
                  </i>
                )}
              </div>
            </div>

            <div className={styles.evidenceProfile}>
              <span>Perfil de evidencia</span>

              <div>
                <p>
                  <i
                    className={
                      styles.evidence_documented
                    }
                  />
                  Documentada
                  <strong>
                    {evidenceProfile.documented}
                  </strong>
                </p>

                <p>
                  <i
                    className={
                      styles.evidence_declared
                    }
                  />
                  Declarada
                  <strong>
                    {evidenceProfile.declared}
                  </strong>
                </p>

                <p>
                  <i
                    className={
                      styles.evidence_critical
                    }
                  />
                  Crítica
                  <strong>
                    {evidenceProfile.critical}
                  </strong>
                </p>

                <p>
                  <i
                    className={
                      styles.evidence_interpretive
                    }
                  />
                  Interpretativa
                  <strong>
                    {evidenceProfile.interpretive}
                  </strong>
                </p>
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className={styles.noRoute}>
          <div>∅</div>

          <h3>
            Todavía no existe una ruta
            documentada.
          </h3>

          <p>
            Esto no significa que no haya
            relación histórica entre ambos
            autores. Significa únicamente
            que el corpus actual aún no
            contiene una cadena verificable.
          </p>
        </section>
      )}

      <footer className={styles.legend}>
        <span>
          <i
            className={
              styles.evidence_documented
            }
          />
          Documentada
        </span>

        <span>
          <i
            className={
              styles.evidence_declared
            }
          />
          Declarada
        </span>

        <span>
          <i
            className={
              styles.evidence_critical
            }
          />
          Crítica
        </span>

        <span>
          <i
            className={
              styles.evidence_interpretive
            }
          />
          Interpretativa
        </span>
      </footer>
    </div>
  );
}
