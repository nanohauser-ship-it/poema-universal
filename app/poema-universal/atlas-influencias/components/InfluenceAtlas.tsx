"use client";

import { useMemo, useState } from "react";
import { literaryAtlas } from "@/lib/grafo-literario/atlas-registry";
import type {
  EvidenceLevel,
  LiteraryAuthor,
  LiteraryRelation,
} from "@/lib/grafo-literario/types";

import AtlasLibraryPanel from "./AtlasLibraryPanel";
import AtlasIdeasExplorer from "./AtlasIdeasExplorer";
import AtlasGenealogyExplorer from "./AtlasGenealogyExplorer";
import AtlasRouteExplorer from "./AtlasRouteExplorer";
import {
  getIdeaStats,
  primaryAtlasIdeas,
} from "@/lib/grafo-literario/ideas-registry";
import styles from "../atlas.module.css";

const evidenceLabels: Record<EvidenceLevel, string> = {
  documented: "Documentada",
  declared: "Declarada",
  critical: "Crítica",
  interpretive: "Interpretativa",
};

function lifespan(author: LiteraryAuthor) {
  if (!author.birth && !author.death) return "Cronología abierta";
  return `${author.birth ?? "?"} — ${author.death ?? "presente"}`;
}

function getAuthor(id: string) {
  return literaryAtlas.authors.find((author) => author.id === id);
}

export default function InfluenceAtlas() {
  const [selectedId, setSelectedId] = useState("borges");
  const [query, setQuery] = useState("");
  const [concept, setConcept] = useState<string | null>(null);
  const [mode, setMode] = useState<
    "constellation" | "genealogy" | "route" | "ideas"
  >("constellation");

  const [selectedIdea, setSelectedIdea] =
    useState("memoria");

  const selected =
    literaryAtlas.authors.find((author) => author.id === selectedId) ??
    literaryAtlas.authors[0];

  const incomingRelations = literaryAtlas.relations.filter(
    (relation) => relation.target === selected.id
  );

  const outgoingRelations = literaryAtlas.relations.filter(
    (relation) => relation.source === selected.id
  );

  const connectedRelations = [
    ...incomingRelations,
    ...outgoingRelations,
  ];

  const visibleAuthors = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return literaryAtlas.authors.filter((author) => {
      const matchesQuery =
        !normalized ||
        author.name.toLowerCase().includes(normalized) ||
        author.country.toLowerCase().includes(normalized) ||
        author.language.some((language) =>
          language.toLowerCase().includes(normalized)
        ) ||
        author.concepts.some((item) =>
          item.toLowerCase().includes(normalized)
        );

      const matchesConcept =
        !concept || author.concepts.includes(concept);

      return matchesQuery && matchesConcept;
    });
  }, [query, concept]);

  const allConcepts = Array.from(
    new Set(literaryAtlas.authors.flatMap((author) => author.concepts))
  ).sort();

  const receivedConcepts = Array.from(
    new Set(incomingRelations.flatMap((relation) => relation.concepts))
  );

  const transmittedConcepts = Array.from(
    new Set(outgoingRelations.flatMap((relation) => relation.concepts))
  );

  const transformedConcepts = Array.from(
    new Set([
      ...receivedConcepts,
      ...transmittedConcepts,
      ...selected.concepts,
    ])
  ).slice(0, 5);

  const ideaStats = getIdeaStats(selectedIdea);

  const ideaAuthors = ideaStats.authors.slice(0, 10);

  const ideaRelated =
    ideaStats.relatedIdeas.slice(0, 8);

  return (
    <main className={styles.atlas}>
      <div className={styles.videoBackground} aria-hidden="true">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source
            src="/videos/atlas/atlas-universal.mp4"
            type="video/mp4"
          />
        </video>

        <div className={styles.videoVeil} />
      </div>

      <header className={styles.topbar}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>✦</div>

          <div>
            <p>Poema Universal</p>
            <h1>Atlas Universal de las Influencias</h1>
            <span>
              La cosmología de la literatura y la poesía universal
            </span>
          </div>
        </div>

        <nav className={styles.primaryNav}>
          <button
            className={
              mode === "constellation" ? styles.navActive : ""
            }
            onClick={() => setMode("constellation")}
          >
            Constelación
          </button>

          <button
            className={
              mode === "genealogy" ? styles.navActive : ""
            }
            onClick={() => setMode("genealogy")}
          >
            Genealogía
          </button>

          <button
            className={mode === "route" ? styles.navActive : ""}
            onClick={() => setMode("route")}
          >
            Ruta
          </button>

          <button
            className={
              mode === "ideas" ? styles.navActive : ""
            }
            onClick={() => {
              setMode("ideas");
              setConcept(null);
            }}
          >
            Ideas
          </button>
        </nav>

        <a href="/poema-universal" className={styles.homeLink}>
          Poema Universal ↗
        </a>
      </header>

      <section className={styles.layout}>
        <AtlasLibraryPanel
          selectedAuthorId={selected.id}
          onSelectAuthor={(id) => {
            setSelectedId(id);
          }}
        />

        <section className={styles.cosmos}>
          <div className={styles.cosmosToolbar}>
            <button
              className={
                mode === "constellation"
                  ? styles.modeActive
                  : ""
              }
              onClick={() => setMode("constellation")}
            >
              ✦ Constelación
            </button>

            <button
              className={
                mode === "genealogy" ? styles.modeActive : ""
              }
              onClick={() => setMode("genealogy")}
            >
              ♧ Genealogía
            </button>

            <button
              className={
                mode === "route" ? styles.modeActive : ""
              }
              onClick={() => setMode("route")}
            >
              ⟶ Ruta
            </button>

            <button
              className={
                mode === "ideas" ? styles.modeActive : ""
              }
              onClick={() => setMode("ideas")}
            >
              ◉ Ideas
            </button>
          </div>

          <div
            className={`${styles.cosmosCanvas} ${
              mode === "ideas"
                ? styles.cosmosCanvasIdeas
                : mode === "genealogy"
                ? styles.cosmosCanvasGenealogy
                : mode === "route"
                ? styles.cosmosCanvasRoute
                : ""
            }`}
          >
            <div className={styles.nebula} />

            {mode === "ideas" ? (
              <AtlasIdeasExplorer
                selectedIdea={selectedIdea}
                onSelectIdea={(idea) => {
                  setSelectedIdea(idea);
                  setConcept(idea);
                }}
                onSelectAuthor={(authorId) => {
                  setSelectedId(authorId);
                  setMode("constellation");
                }}
              />
            ) : mode === "genealogy" ? (
              <AtlasGenealogyExplorer
                selectedAuthorId={selected.id}
                onSelectAuthor={(authorId) => {
                  setSelectedId(authorId);
                }}
              />
            ) : mode === "route" ? (
              <AtlasRouteExplorer
                selectedAuthorId={selected.id}
                onSelectAuthor={(authorId) => {
                  setSelectedId(authorId);
                }}
              />
            ) : (
              <>
                <section className={styles.influenceSide}>
                  <h2>¿Quién lo influyó?</h2>

                  <div className={styles.influenceStack}>
                    {incomingRelations.length === 0 ? (
                      <div className={styles.noRelations}>
                        Aún no hay influencias recibidas verificadas
                        en este corpus.
                      </div>
                    ) : (
                      incomingRelations.map((relation, index) => {
                        const author = getAuthor(relation.source);

                        if (!author) return null;

                        return (
                          <RelationNode
                            key={relation.id}
                            author={author}
                            relation={relation}
                            side="left"
                            index={index}
                            onSelect={setSelectedId}
                          />
                        );
                      })
                    )}
                  </div>
                </section>

                <section className={styles.centralAuthor}>
                  <div className={styles.orbitOuter} />
                  <div className={styles.orbitMiddle} />

                  <div className={styles.centralPortrait}>
                    <span>
                      {selected.name
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                  </div>

                  <div className={styles.centralName}>
                    <strong>{selected.name}</strong>
                    <span>{lifespan(selected)}</span>
                    <em>{selected.country}</em>
                  </div>

                  <div className={styles.transformationCard}>
                    <span>Lo que transformó</span>

                    <p>
                      {transformedConcepts.length
                        ? transformedConcepts.join(" · ")
                        : "La cartografía de esta transformación está todavía en construcción."}
                    </p>
                  </div>
                </section>

                <section className={styles.influenceSide}>
                  <h2>¿A quién influyó?</h2>

                  <div className={styles.influenceStack}>
                    {outgoingRelations.length === 0 ? (
                      <div className={styles.noRelations}>
                        Aún no hay influencias ejercidas verificadas
                        en este corpus.
                      </div>
                    ) : (
                      outgoingRelations.map((relation, index) => {
                        const author = getAuthor(relation.target);

                        if (!author) return null;

                        return (
                          <RelationNode
                            key={relation.id}
                            author={author}
                            relation={relation}
                            side="right"
                            index={index}
                            onSelect={setSelectedId}
                          />
                        );
                      })
                    )}
                  </div>
                </section>
              </>
            )}
          </div>

          <div className={styles.bookHorizon}>
            <div />
            <span />
            <div />
          </div>

          <div className={styles.cosmosFooter}>
            {mode === "ideas" ? (
              <>
                <div>
                  <span>Autores</span>
                  <strong>{ideaStats.authorCount}</strong>
                </div>

                <div>
                  <span>Idea central</span>
                  <strong>
                    {selectedIdea.charAt(0).toUpperCase() +
                      selectedIdea.slice(1)}
                  </strong>
                </div>

                <div>
                  <span>Obras</span>
                  <strong>{ideaStats.workCount}</strong>
                </div>
              </>
            ) : (
              <>
                <div>
                  <span>Influencias recibidas</span>
                  <strong>{incomingRelations.length}</strong>
                </div>

                <div>
                  <span>Presencia central</span>
                  <strong>{selected.name}</strong>
                </div>

                <div>
                  <span>Influencias ejercidas</span>
                  <strong>{outgoingRelations.length}</strong>
                </div>
              </>
            )}
          </div>
        </section>

        <aside className={styles.detailPanel}>
          <p className={styles.detailEyebrow}>Autor</p>

          <h2>{selected.name}</h2>

          <p className={styles.detailLife}>
            {lifespan(selected)} · {selected.country}
          </p>

          <p className={styles.detailDescription}>
            {selected.description}
          </p>

          <section className={styles.detailBlock}>
            <h3>Influencias recibidas</h3>

            <div className={styles.pills}>
              {incomingRelations.length ? (
                incomingRelations.map((relation) => {
                  const author = getAuthor(relation.source);

                  return author ? (
                    <button
                      key={relation.id}
                      onClick={() => setSelectedId(author.id)}
                    >
                      {author.name}
                    </button>
                  ) : null;
                })
              ) : (
                <span className={styles.emptyLabel}>
                  Pendiente de documentación
                </span>
              )}
            </div>
          </section>

          <section className={styles.detailBlock}>
            <h3>Influencias ejercidas</h3>

            <div className={styles.pills}>
              {outgoingRelations.length ? (
                outgoingRelations.map((relation) => {
                  const author = getAuthor(relation.target);

                  return author ? (
                    <button
                      key={relation.id}
                      onClick={() => setSelectedId(author.id)}
                    >
                      {author.name}
                    </button>
                  ) : null;
                })
              ) : (
                <span className={styles.emptyLabel}>
                  Pendiente de documentación
                </span>
              )}
            </div>
          </section>

          <section className={styles.detailBlock}>
            <h3>Temas y territorios</h3>

            <div className={styles.pills}>
              {selected.concepts.map((item) => (
                <button
                  key={item}
                  onClick={() =>
                    setConcept((current) =>
                      current === item ? null : item
                    )
                  }
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.detailBlock}>
            <h3>Nivel de evidencia</h3>

            <div className={styles.evidenceList}>
              {connectedRelations.map((relation) => (
                <div key={relation.id}>
                  <span
                    className={`${styles.evidenceDot} ${
                      styles[`evidence_${relation.evidence}`]
                    }`}
                  />

                  <span>
                    {evidenceLabels[relation.evidence]}
                  </span>
                </div>
              ))}

              {!connectedRelations.length && (
                <span className={styles.emptyLabel}>
                  Sin relaciones todavía
                </span>
              )}
            </div>
          </section>

          <section className={styles.documentation}>
            <button>▣ Obras</button>
            <button>❞ Fuentes</button>
            <button>⌘ Estudios</button>
          </section>
        </aside>
      </section>

      {mode !== "ideas" && (
      <section className={styles.timeline}>
        <div className={styles.ideaTitle}>
          <span>Viaje de una idea</span>

          <strong>
            {concept
              ? concept.charAt(0).toUpperCase() +
                concept.slice(1)
              : "Explorar"}
          </strong>
        </div>

        <div className={styles.timelineTrack}>
          <span>Antigüedad</span>
          <i />
          <span>Edad Media</span>
          <i />
          <span>Modernidad</span>
          <i />
          <span>Vanguardias</span>
          <i />
          <span>Contemporáneo</span>
        </div>

        <div className={styles.connectionLegend}>
          <p>Tipos de conexión</p>

          <span>
            <i className={styles.lineDocumented} />
            Documentada
          </span>

          <span>
            <i className={styles.lineDeclared} />
            Declarada
          </span>

          <span>
            <i className={styles.lineCritical} />
            Crítica
          </span>

          <span>
            <i className={styles.lineInterpretive} />
            Interpretativa
          </span>
        </div>
      </section>
      )}

      {mode !== "ideas" && (
        <section className={styles.ideaArchive}>
          {allConcepts.map((item) => (
            <button
              key={item}
              className={
                concept === item
                  ? styles.ideaSelected
                  : ""
              }
              onClick={() =>
                setConcept((current) =>
                  current === item
                    ? null
                    : item
                )
              }
            >
              {item}
            </button>
          ))}
        </section>
      )}
    </main>
  );
}

function RelationNode({
  author,
  relation,
  side,
  index,
  onSelect,
}: {
  author: LiteraryAuthor;
  relation: LiteraryRelation;
  side: "left" | "right";
  index: number;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      className={`${styles.relationNode} ${
        styles[`relation_${relation.evidence}`]
      } ${side === "left" ? styles.nodeLeft : styles.nodeRight}`}
      style={{
        transform: `translateY(${index % 2 === 0 ? 0 : 16}px)`,
      }}
      onClick={() => onSelect(author.id)}
    >
      <span className={styles.nodePortrait}>
        {author.name
          .split(" ")
          .map((part) => part[0])
          .slice(0, 2)
          .join("")}
      </span>

      <strong>{author.name}</strong>

      <small>{lifespan(author)}</small>

      <em>{relation.concepts.slice(0, 2).join(" · ")}</em>

      <i className={styles.connectionLine} />
    </button>
  );
}
