"use client";

import Link from "next/link";
import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  analyzeSoul,
} from "./symbolic-client";

import type {
  ArchetypeReading,
  BorgesInput,
  SymbolicReading,
  SymbolNode,
} from "./symbolic-contract";

import styles from "./OjosDeBorges.module.css";

type Status =
  | "idle"
  | "reading"
  | "complete"
  | "error";

type Chamber =
  | "matrix"
  | "labyrinth"
  | "mirror"
  | "individuation"
  | "workshop";

const INITIAL: BorgesInput = {
  title: "",
  author: "",
  language: "Español",
  poem: "",
  translation: "",
  notes: "",
};

const PHASES = [
  "Separando la imagen de su nombre",
  "Reconociendo las familias simbólicas",
  "Abriendo el laberinto",
  "Desplegando el espejo",
  "Constelando los arquetipos",
  "Buscando el símbolo ausente",
  "Trazando la individuación",
];

const ARCHETYPE_POSITIONS = {
  "wise-elder": [50, 10],
  shadow: [76, 22],
  persona: [88, 48],
  "anima-animus": [75, 76],
  mother: [50, 88],
  child: [24, 76],
  hero: [12, 48],
  trickster: [24, 22],
  self: [50, 50],
} as const;

function ArchetypeWheel({
  readings,
  dominant,
  compensatory,
}: {
  readings: ArchetypeReading[];
  dominant: string;
  compensatory: string;
}) {
  return (
    <div className={styles.wheel}>
      <div
        className={styles.wheelCore}
      >
        <span>✦</span>
        <small>Sí-mismo</small>
      </div>

      {readings.map(
        (reading) => {
          const position =
            ARCHETYPE_POSITIONS[
              reading.key
            ] ?? [50, 50];

          return (
            <button
              key={reading.key}
              type="button"
              className={[
                styles.archetypeNode,
                reading.key ===
                dominant
                  ? styles.dominantNode
                  : "",
                reading.key ===
                compensatory
                  ? styles.compensatoryNode
                  : "",
              ].join(" ")}
              style={{
                left: `${position[0]}%`,
                top: `${position[1]}%`,
              }}
              title={
                reading.function
              }
            >
              <span>
                {
                  Math.round(
                    reading.intensity
                  )
                }
              </span>
              <strong>
                {reading.name}
              </strong>
            </button>
          );
        }
      )}
    </div>
  );
}

function SymbolMap({
  reading,
  selectedId,
  onSelect,
}: {
  reading: SymbolicReading;
  selectedId: string | null;
  onSelect:
    (node: SymbolNode) => void;
}) {
  const nodeMap = useMemo(
    () =>
      new Map(
        reading.symbols.map(
          (node) => [
            node.id,
            node,
          ]
        )
      ),
    [reading.symbols]
  );

  return (
    <svg
      viewBox="0 0 100 100"
      className={styles.symbolMap}
      role="img"
      aria-label="Cartografía simbólica del poema"
    >
      <circle
        cx="50"
        cy="50"
        r="44"
        className={styles.mapGuide}
      />
      <circle
        cx="50"
        cy="50"
        r="31"
        className={styles.mapGuide}
      />
      <path
        d="M50 6 C34 24 66 34 50 50 C34 66 66 77 50 94"
        className={styles.mapSpine}
      />
      <path
        d="M6 50 C24 34 34 66 50 50 C66 34 77 66 94 50"
        className={styles.mapSpine}
      />

      {reading.edges.map(
        (edge, index) => {
          const source =
            nodeMap.get(
              edge.source
            );

          const target =
            nodeMap.get(
              edge.target
            );

          if (
            !source ||
            !target
          ) {
            return null;
          }

          const middleX =
            (
              source.x +
              target.x
            ) / 2;

          const middleY =
            (
              source.y +
              target.y
            ) / 2;

          const bend =
            edge.relation ===
            "opposition"
              ? -7
              : edge.relation ===
                  "reflection"
                ? 7
                : 3;

          return (
            <path
              key={`${edge.source}-${edge.target}-${index}`}
              d={`M ${source.x} ${source.y} Q ${
                middleX +
                (
                  target.y -
                  source.y
                ) /
                  bend
              } ${
                middleY -
                (
                  target.x -
                  source.x
                ) /
                  bend
              } ${target.x} ${target.y}`}
              className={[
                styles.mapEdge,
                styles[
                  `edge_${edge.relation}`
                ],
              ].join(" ")}
              style={{
                opacity:
                  0.18 +
                  edge.strength /
                    145,
              }}
            />
          );
        }
      )}

      {reading.symbols.map(
        (node) => {
          const radius =
            3.7 +
            (
              node.intensity /
              100
            ) *
              3.8;

          const active =
            selectedId === node.id;

          return (
            <g
              key={node.id}
              className={styles.mapNode}
              role="button"
              tabIndex={0}
              onClick={() =>
                onSelect(node)
              }
              onKeyDown={(
                event
              ) => {
                if (
                  event.key ===
                    "Enter" ||
                  event.key ===
                    " "
                ) {
                  event.preventDefault();
                  onSelect(node);
                }
              }}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={radius + 2}
                className={
                  active
                    ? styles.nodeHaloActive
                    : styles.nodeHalo
                }
              />
              <circle
                cx={node.x}
                cy={node.y}
                r={radius}
                className={
                  active
                    ? styles.nodeCoreActive
                    : styles.nodeCore
                }
              />
              <text
                x={node.x}
                y={
                  node.y +
                  radius +
                  4.4
                }
                textAnchor="middle"
              >
                {node.label}
              </text>
            </g>
          );
        }
      )}

      <text
        x="50"
        y="4"
        textAnchor="middle"
        className={styles.cardinal}
      >
        MEMORIA
      </text>
      <text
        x="50"
        y="98"
        textAnchor="middle"
        className={styles.cardinal}
      >
        MATERIA
      </text>
      <text
        x="3"
        y="50"
        textAnchor="middle"
        transform="rotate(-90 3 50)"
        className={styles.cardinal}
      >
        UMBRAL
      </text>
      <text
        x="97"
        y="50"
        textAnchor="middle"
        transform="rotate(90 97 50)"
        className={styles.cardinal}
      >
        ESPEJO
      </text>
    </svg>
  );
}

export default function OjosDeBorgesPage() {
  const [input, setInput] =
    useState<BorgesInput>(
      INITIAL
    );

  const [status, setStatus] =
    useState<Status>("idle");

  const [phase, setPhase] =
    useState(0);

  const [reading, setReading] =
    useState<SymbolicReading | null>(
      null
    );

  const [chamber, setChamber] =
    useState<Chamber>("matrix");

  const [selectedNode, setSelectedNode] =
    useState<SymbolNode | null>(
      null
    );

  const [error, setError] =
    useState("");

  const canSubmit =
    input.poem.trim().length >=
      40 &&
    status !== "reading";

  function update<
    Key extends keyof BorgesInput
  >(
    key: Key,
    value: BorgesInput[Key]
  ) {
    setInput((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function submit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setStatus("reading");
    setPhase(0);
    setReading(null);
    setSelectedNode(null);
    setChamber("matrix");
    setError("");

    const timer =
      window.setInterval(() => {
        setPhase((current) =>
          Math.min(
            current + 1,
            PHASES.length - 1
          )
        );
      }, 820);

    try {
      const result =
        await analyzeSoul(input);

      window.clearInterval(timer);

      const strongest =
        [...result.symbols].sort(
          (left, right) =>
            right.intensity -
            left.intensity
        )[0];

      setReading(result);
      setSelectedNode(
        strongest ?? null
      );
      setStatus("complete");
    } catch (caught) {
      window.clearInterval(timer);
      setStatus("error");
      setError(
        caught instanceof Error
          ? caught.message
          : "La cámara se interrumpió."
      );
    }
  }

  const allArchetypes =
    reading
      ? [
          reading.dominantArchetype,
          reading
            .compensatoryArchetype,
          ...reading
            .secondaryArchetypes,
        ].filter(
          (
            item,
            index,
            array
          ) =>
            array.findIndex(
              (candidate) =>
                candidate.key ===
                item.key
            ) === index
        )
      : [];

  return (
    <main className={styles.page}>
      <div
        className={styles.texture}
      />

      <header className={styles.topbar}>
        <Link
          href="/poema-universal"
          className={styles.brand}
        >
          <span>✦</span>
          POEMA UNIVERSAL
        </Link>

        <nav>
          <Link
            href="/poema-universal"
          >
            Fundación
          </Link>
          <Link
            href="/poema-universal/matriz-poetica"
          >
            Matriz Poética
          </Link>
          <strong>
            Los ojos de Borges
          </strong>
        </nav>
      </header>

      <section className={styles.hero}>
        <p>
          Ingeniería simbólica del alma
        </p>
        <h1>
          Los ojos de Borges
        </h1>
        <blockquote>
          Los símbolos revelan el
          mundo. Los arquetipos
          reconocen su drama.
        </blockquote>
        <span>
          Una cámara literaria para
          observar la obra, sus fuerzas
          profundas y el movimiento que
          intenta realizar.
        </span>
      </section>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <form
            className={styles.form}
            onSubmit={submit}
          >
            <header>
              <span>◉</span>
              <div>
                <h2>
                  Entregar la obra
                </h2>
                <p>
                  Lectura literaria, no
                  diagnóstico psicológico
                </p>
              </div>
            </header>

            <label>
              <span>Título</span>
              <input
                value={input.title}
                onChange={(event) =>
                  update(
                    "title",
                    event.target.value
                  )
                }
              />
            </label>

            <label>
              <span>
                Autor o seudónimo
              </span>
              <input
                value={input.author}
                onChange={(event) =>
                  update(
                    "author",
                    event.target.value
                  )
                }
              />
            </label>

            <label>
              <span>Idioma</span>
              <select
                value={input.language}
                onChange={(event) =>
                  update(
                    "language",
                    event.target.value
                  )
                }
              >
                <option>
                  Español
                </option>
                <option>
                  Galego
                </option>
                <option>
                  English
                </option>
                <option>
                  Français
                </option>
                <option>
                  Português
                </option>
                <option>
                  日本語
                </option>
                <option>
                  Otro
                </option>
              </select>
            </label>

            <label>
              <span>Poema</span>
              <textarea
                value={input.poem}
                maxLength={8000}
                placeholder="Deja aquí el poema…"
                onChange={(event) =>
                  update(
                    "poem",
                    event.target.value
                  )
                }
              />
              <small>
                {input.poem.length}
                {" / 8000"}
              </small>
            </label>

            <label>
              <span>
                Traducción opcional
              </span>
              <textarea
                className={styles.compact}
                value={
                  input.translation
                }
                onChange={(event) =>
                  update(
                    "translation",
                    event.target.value
                  )
                }
              />
            </label>

            <label>
              <span>
                Nota del escritor
              </span>
              <textarea
                className={styles.compact}
                value={input.notes}
                onChange={(event) =>
                  update(
                    "notes",
                    event.target.value
                  )
                }
              />
            </label>

            {error && (
              <p
                className={styles.error}
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
            >
              <span>✦</span>
              {status === "reading"
                ? "Constelando la obra"
                : "Abrir la Matriz del Alma"}
            </button>
          </form>

          <section
            className={styles.ethics}
          >
            <p>
              Principio ético
            </p>
            <blockquote>
              El arquetipo pertenece a la
              lectura de la obra, no a un
              diagnóstico del autor.
            </blockquote>
            <span>
              Toda devolución se formula
              como hipótesis literaria y
              permanece abierta.
            </span>
          </section>
        </aside>

        <section
          className={styles.chamber}
        >
          {status === "idle" && (
            <div
              className={styles.dormant}
            >
              <div
                className={
                  styles.dormantWheel
                }
              >
                <span>✦</span>
                <i />
                <i />
                <i />
              </div>
              <p>
                Cámara en espera
              </p>
              <h2>
                El poema todavía no ha
                construido su mandala
              </h2>
              <span>
                Cuando entregues la obra,
                cada imagen buscará su
                materia, su sombra y su
                lugar dentro del drama.
              </span>
            </div>
          )}

          {status === "reading" && (
            <div
              className={styles.reading}
            >
              <div
                className={
                  styles.readingMandala
                }
              >
                <span>✦</span>
                <i />
                <i />
                <i />
                <i />
              </div>
              <p>
                Ingeniería en curso
              </p>
              <h2>
                {PHASES[phase]}
              </h2>
              <div
                className={styles.phases}
              >
                {PHASES.map(
                  (item, index) => (
                    <span
                      key={item}
                      className={
                        index <= phase
                          ? styles.phaseActive
                          : ""
                      }
                    />
                  )
                )}
              </div>
            </div>
          )}

          {status === "error" && (
            <div
              className={styles.dormant}
            >
              <div
                className={styles.failure}
              >
                ×
              </div>
              <p>
                La cámara se cerró
              </p>
              <h2>
                No fue posible constelar
                la obra
              </h2>
              <span>{error}</span>
            </div>
          )}

          {status === "complete" &&
            reading && (
              <div
                className={styles.results}
              >
                <section
                  className={
                    styles.revelation
                  }
                >
                  <div>
                    <p>
                      Matriz del Alma
                      Poética
                    </p>
                    <h2>
                      {
                        reading.poemTitle
                      }
                    </h2>
                    <span>
                      {input.author ||
                        "Autor no indicado"}
                    </span>
                  </div>
                  <blockquote>
                    “
                    {
                      reading.entryVerse
                    }
                    ”
                  </blockquote>
                </section>

                <nav
                  className={
                    styles.chamberNav
                  }
                >
                  {[
                    ["matrix", "Matriz"],
                    [
                      "labyrinth",
                      "Laberinto",
                    ],
                    [
                      "mirror",
                      "Espejo",
                    ],
                    [
                      "individuation",
                      "Individuación",
                    ],
                    [
                      "workshop",
                      "Taller",
                    ],
                  ].map(
                    ([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        className={
                          chamber === key
                            ? styles.activeTab
                            : ""
                        }
                        onClick={() =>
                          setChamber(
                            key as Chamber
                          )
                        }
                      >
                        {label}
                      </button>
                    )
                  )}
                </nav>

                {chamber ===
                  "matrix" && (
                  <>
                    <section
                      className={
                        styles.mandalaSection
                      }
                    >
                      <div>
                        <p>
                          Mandala
                          arquetípico
                        </p>
                        <h3>
                          La constelación
                          profunda de la
                          obra
                        </h3>
                        <ArchetypeWheel
                          readings={
                            allArchetypes
                          }
                          dominant={
                            reading
                              .dominantArchetype
                              .key
                          }
                          compensatory={
                            reading
                              .compensatoryArchetype
                              .key
                          }
                        />
                      </div>

                      <aside
                        className={
                          styles.archetypeSummary
                        }
                      >
                        <article>
                          <p>
                            Arquetipo
                            dominante
                          </p>
                          <h4>
                            {
                              reading
                                .dominantArchetype
                                .name
                            }
                          </h4>
                          <span>
                            {
                              reading
                                .dominantArchetype
                                .function
                            }
                          </span>
                        </article>

                        <article>
                          <p>
                            Arquetipo
                            compensatorio
                          </p>
                          <h4>
                            {
                              reading
                                .compensatoryArchetype
                                .name
                            }
                          </h4>
                          <span>
                            {
                              reading
                                .compensatoryArchetype
                                .function
                            }
                          </span>
                        </article>
                      </aside>
                    </section>

                    <section
                      className={
                        styles.symbolicCore
                      }
                    >
                      <article>
                        <p>
                          Símbolo rector
                        </p>
                        <h3>
                          {
                            reading
                              .rulingSymbol
                              .name
                          }
                        </h3>
                        <span>
                          {
                            reading
                              .rulingSymbol
                              .description
                          }
                        </span>
                      </article>
                      <div
                        className={
                          styles.coreSeal
                        }
                      >
                        ✦
                      </div>
                      <article>
                        <p>
                          Símbolo ausente
                        </p>
                        <h3>
                          {
                            reading
                              .absentSymbol
                              .name
                          }
                        </h3>
                        <span>
                          {
                            reading
                              .absentSymbol
                              .function
                          }
                        </span>
                      </article>
                    </section>

                    <section
                      className={
                        styles.mapSection
                      }
                    >
                      <header>
                        <div>
                          <p>
                            Cartografía
                            simbólica
                          </p>
                          <h3>
                            El cosmos de la
                            obra
                          </h3>
                        </div>
                        <span>
                          Abre un nodo para
                          leer su función.
                        </span>
                      </header>

                      <div
                        className={
                          styles.mapLayout
                        }
                      >
                        <div
                          className={
                            styles.mapStage
                          }
                        >
                          <SymbolMap
                            reading={reading}
                            selectedId={
                              selectedNode?.id ??
                              null
                            }
                            onSelect={
                              setSelectedNode
                            }
                          />
                        </div>

                        <aside
                          className={
                            styles.inspector
                          }
                        >
                          {selectedNode && (
                            <>
                              <p>
                                Símbolo
                                abierto
                              </p>
                              <small>
                                {
                                  selectedNode.family
                                }
                              </small>
                              <h4>
                                {
                                  selectedNode.label
                                }
                              </h4>
                              <blockquote>
                                “
                                {
                                  selectedNode.evidence
                                }
                                ”
                              </blockquote>
                              <dl>
                                <div>
                                  <dt>
                                    Función
                                    literal
                                  </dt>
                                  <dd>
                                    {
                                      selectedNode.literalFunction
                                    }
                                  </dd>
                                </div>
                                <div>
                                  <dt>
                                    Función
                                    simbólica
                                  </dt>
                                  <dd>
                                    {
                                      selectedNode.symbolicFunction
                                    }
                                  </dd>
                                </div>
                                <div>
                                  <dt>
                                    Sombra
                                  </dt>
                                  <dd>
                                    {
                                      selectedNode.shadowFunction
                                    }
                                  </dd>
                                </div>
                                <div>
                                  <dt>
                                    Transformación
                                  </dt>
                                  <dd>
                                    {
                                      selectedNode.transformation
                                    }
                                  </dd>
                                </div>
                              </dl>
                            </>
                          )}
                        </aside>
                      </div>
                    </section>

                    <section
                      className={
                        styles.revelationGrid
                      }
                    >
                      <article>
                        <p>
                          Punto ciego
                        </p>
                        <span>
                          {
                            reading.blindSpot
                          }
                        </span>
                      </article>
                      <article>
                        <p>
                          Paradoja central
                        </p>
                        <span>
                          {
                            reading
                              .centralParadox
                          }
                        </span>
                      </article>
                      <article>
                        <p>
                          Proyección
                        </p>
                        <span>
                          {
                            reading.projection
                          }
                        </span>
                      </article>
                      <article>
                        <p>
                          Ley secreta
                        </p>
                        <span>
                          {
                            reading.secretLaw
                          }
                        </span>
                      </article>
                    </section>
                  </>
                )}

                {chamber ===
                  "labyrinth" && (
                  <section
                    className={
                      styles.readingPanel
                    }
                  >
                    <header>
                      <p>
                        Ojo del laberinto
                      </p>
                      <h3>
                        La arquitectura
                        secreta de la obra
                      </h3>
                    </header>
                    <dl>
                      {Object.entries(
                        reading.labyrinth
                      ).map(
                        ([
                          key,
                          value,
                        ]) => (
                          <div key={key}>
                            <dt>
                              {key}
                            </dt>
                            <dd>
                              {value}
                            </dd>
                          </div>
                        )
                      )}
                    </dl>
                  </section>
                )}

                {chamber ===
                  "mirror" && (
                  <section
                    className={
                      styles.readingPanel
                    }
                  >
                    <header>
                      <p>
                        Ojo del espejo
                      </p>
                      <h3>
                        La identidad que
                        la obra devuelve
                      </h3>
                    </header>
                    <dl>
                      {Object.entries(
                        reading.mirror
                      ).map(
                        ([
                          key,
                          value,
                        ]) => (
                          <div key={key}>
                            <dt>
                              {key}
                            </dt>
                            <dd>
                              {value}
                            </dd>
                          </div>
                        )
                      )}
                    </dl>
                  </section>
                )}

                {chamber ===
                  "individuation" && (
                  <section
                    className={
                      styles.individuation
                    }
                  >
                    <header>
                      <p>
                        Movimiento de
                        individuación
                      </p>
                      <h3>
                        El trayecto que la
                        obra intenta
                        realizar
                      </h3>
                    </header>
                    <div>
                      {Object.entries(
                        reading.soulMovement
                      ).map(
                        ([
                          key,
                          value,
                        ], index) => (
                          <article
                            key={key}
                          >
                            <strong>
                              0{index + 1}
                            </strong>
                            <div>
                              <p>
                                {key}
                              </p>
                              <span>
                                {value}
                              </span>
                            </div>
                          </article>
                        )
                      )}
                    </div>
                  </section>
                )}

                {chamber ===
                  "workshop" && (
                  <section
                    className={
                      styles.workshop
                    }
                  >
                    <div>
                      <p>
                        Taller de revisión
                      </p>
                      <h3>
                        Tres lugares donde
                        volver a escuchar
                        la obra
                      </h3>
                    </div>
                    <ol>
                      {reading.revisionPaths.map(
                        (path) => (
                          <li key={path}>
                            {path}
                          </li>
                        )
                      )}
                    </ol>
                  </section>
                )}

                <section
                  className={styles.finalTriptych}
                >
                  <article>
                    <p>
                      Escena arquetípica
                    </p>
                    <span>
                      {
                        reading.archetypalScene
                      }
                    </span>
                  </article>
                  <article>
                    <p>Reliquia</p>
                    <span>
                      {reading.relic}
                    </span>
                  </article>
                  <article>
                    <p>
                      Núcleo invisible
                    </p>
                    <span>
                      {
                        reading.invisibleCore
                      }
                    </span>
                  </article>
                </section>

                <section
                  className={styles.oracle}
                >
                  <p>
                    Oráculo de los dos
                    ojos
                  </p>
                  <blockquote>
                    {reading.oracle}
                  </blockquote>
                  <span>
                    {
                      reading.finalRitual
                    }
                  </span>
                </section>
              </div>
            )}
        </section>
      </div>

      <footer className={styles.footer}>
        La obra conserva su misterio ·
        El escritor conserva su voz
      </footer>
    </main>
  );
}
