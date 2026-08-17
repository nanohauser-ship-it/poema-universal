"use client";

import Link from "next/link";

import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  analyzeWithMatrix,
  generateMatrixSymbol,
} from "./matrix-client";

import type {
  MatrixAnalysis,
  MatrixInput,
} from "./matrix-contract";

import styles from "./MatrizPoetica.module.css";

type MatrixStatus =
  | "idle"
  | "analyzing"
  | "complete"
  | "error";

type SymbolStatus =
  | "idle"
  | "generating"
  | "complete"
  | "error";

type ResultView =
  | "reading"
  | "world"
  | "workshop";

const INITIAL_FORM: MatrixInput = {
  title: "",
  author: "",
  language: "Español",
  poem: "",
  translation: "",
  notes: "",
};

const ANALYSIS_PHASES = [
  "Escuchando la materia",
  "Localizando la gravedad",
  "Reconociendo el símbolo",
  "Construyendo la reliquia",
  "Elevando el altar",
];

export default function MatrizPoeticaPage() {
  const [form, setForm] =
    useState<MatrixInput>(
      INITIAL_FORM
    );

  const [
    revealSymbol,
    setRevealSymbol,
  ] = useState(false);

  const [
    status,
    setStatus,
  ] = useState<MatrixStatus>(
    "idle"
  );

  const [
    symbolStatus,
    setSymbolStatus,
  ] = useState<SymbolStatus>(
    "idle"
  );

  const [
    activeView,
    setActiveView,
  ] = useState<ResultView>(
    "reading"
  );

  const [
    analysisPhase,
    setAnalysisPhase,
  ] = useState(0);

  const [
    result,
    setResult,
  ] = useState<MatrixAnalysis | null>(
    null
  );

  const [
    symbolImage,
    setSymbolImage,
  ] = useState<string | null>(
    null
  );

  const [
    error,
    setError,
  ] = useState("");

  const [
    symbolError,
    setSymbolError,
  ] = useState("");

  const canSubmit = useMemo(
    () =>
      form.poem.trim().length >= 40 &&
      status !== "analyzing",
    [
      form.poem,
      status,
    ]
  );

  function updateField<
    Key extends keyof MatrixInput
  >(
    key: Key,
    value: MatrixInput[Key]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function materializeSymbol(
    analysis: MatrixAnalysis
  ) {
    setSymbolStatus("generating");
    setSymbolError("");
    setSymbolImage(null);

    try {
      const image =
        await generateMatrixSymbol(
          analysis.symbolPrompt
        );

      setSymbolImage(image);
      setSymbolStatus("complete");
    } catch (caughtError) {
      setSymbolStatus("error");

      setSymbolError(
        caughtError instanceof Error
          ? caughtError.message
          : "El sello no pudo materializarse."
      );
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setStatus("analyzing");
    setAnalysisPhase(0);
    setActiveView("reading");
    setResult(null);
    setError("");
    setSymbolError("");
    setSymbolImage(null);
    setSymbolStatus("idle");

    const phaseTimer =
      window.setInterval(() => {
        setAnalysisPhase(
          (current) =>
            Math.min(
              current + 1,
              ANALYSIS_PHASES.length -
                1
            )
        );
      }, 650);

    try {
      const analysis =
        await analyzeWithMatrix(
          form
        );

      window.clearInterval(
        phaseTimer
      );

      setResult(analysis);
      setStatus("complete");

      if (revealSymbol) {
        void materializeSymbol(
          analysis
        );
      }

      window.requestAnimationFrame(
        () => {
          document
            .getElementById(
              "resultado-matriz"
            )
            ?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
        }
      );
    } catch (caughtError) {
      window.clearInterval(
        phaseTimer
      );

      setStatus("error");

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "La Matriz no pudo escuchar el poema."
      );
    }
  }

  function deleteSession() {
    setForm(INITIAL_FORM);
    setRevealSymbol(false);
    setStatus("idle");
    setSymbolStatus("idle");
    setActiveView("reading");
    setAnalysisPhase(0);
    setResult(null);
    setSymbolImage(null);
    setError("");
    setSymbolError("");
  }

  return (
    <main className={styles.page}>
      <div
        className={
          styles.backgroundGrid
        }
      />

      <header className={styles.topbar}>
        <Link
          href="/poema-universal"
          className={styles.brand}
        >
          <span
            className={
              styles.brandMark
            }
          >
            ✦
          </span>

          POEMA UNIVERSAL
        </Link>

        <nav>
          <Link
            href="/poema-universal"
          >
            Fundación
          </Link>

          <Link
            href="/poema-universal/mundo"
          >
            Obra
          </Link>

          <span>
            Matriz Poética
          </span>
        </nav>
      </header>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>
          Arquitectura invisible
          de la palabra
        </p>

        <h1>Matriz Poética</h1>

        <p className={styles.promise}>
          No escribimos el poema por ti.
          Construimos un altar para que
          puedas verlo.
        </p>

        <p className={styles.intro}>
          Una herramienta pública e
          independiente para revelar el
          núcleo, el símbolo, la reliquia
          y el mundo que viven dentro de
          un poema.
        </p>
      </section>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <form
            className={styles.panel}
            onSubmit={handleSubmit}
          >
            <div
              className={styles.heading}
            >
              <span>✧</span>

              <div>
                <h2>
                  Entrega tu poema
                </h2>

                <p>
                  La obra sigue siendo
                  tuya
                </p>
              </div>
            </div>

            <label>
              <span>Título</span>

              <input
                value={form.title}
                maxLength={180}
                placeholder="Ej. Cartografía del silencio"
                onChange={(event) =>
                  updateField(
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
                value={form.author}
                maxLength={180}
                placeholder="Ej. Ada Salazar"
                onChange={(event) =>
                  updateField(
                    "author",
                    event.target.value
                  )
                }
              />
            </label>

            <label>
              <span>Idioma</span>

              <select
                value={form.language}
                onChange={(event) =>
                  updateField(
                    "language",
                    event.target.value
                  )
                }
              >
                <option>Español</option>
                <option>Galego</option>
                <option>English</option>
                <option>Français</option>
                <option>Português</option>
                <option>日本語</option>
                <option>Otro</option>
              </select>
            </label>

            <label>
              <span>
                Poema original
              </span>

              <textarea
                value={form.poem}
                maxLength={6000}
                placeholder="Escribe o pega aquí tu poema…"
                onChange={(event) =>
                  updateField(
                    "poem",
                    event.target.value
                  )
                }
              />

              <small>
                {form.poem.length}
                {" / 6000"}
              </small>
            </label>

            <label>
              <span>
                Traducción opcional
              </span>

              <textarea
                className={
                  styles.translation
                }
                value={
                  form.translation
                }
                maxLength={6000}
                placeholder="Añade una traducción cuando el poema esté escrito en otra lengua…"
                onChange={(event) =>
                  updateField(
                    "translation",
                    event.target.value
                  )
                }
              />

              <small>
                {
                  form.translation
                    .length
                }
                {" / 6000"}
              </small>
            </label>

            <label>
              <span>
                Notas del poeta
              </span>

              <textarea
                className={
                  styles.notes
                }
                value={form.notes}
                maxLength={1200}
                placeholder="Contexto, pregunta o latido de origen…"
                onChange={(event) =>
                  updateField(
                    "notes",
                    event.target.value
                  )
                }
              />

              <small>
                {form.notes.length}
                {" / 1200"}
              </small>
            </label>

            <label
              className={
                styles.symbolConsent
              }
            >
              <input
                type="checkbox"
                checked={revealSymbol}
                onChange={(event) =>
                  setRevealSymbol(
                    event.target.checked
                  )
                }
              />

              <span>
                <strong>
                  Revelar un sello
                  simbólico
                </strong>

                <small>
                  La Matriz condensará el
                  poema en una imagen
                  esencial, primigenia y
                  metafísica.
                </small>
              </span>
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

              {status === "analyzing"
                ? "Escuchando el poema"
                : "Elevar el poema"}
            </button>
          </form>

          <section
            className={`${styles.panel} ${styles.ethics}`}
          >
            <div
              className={styles.heading}
            >
              <span>◇</span>

              <div>
                <h2>
                  Privacidad por diseño
                </h2>

                <p>
                  Transparencia antes que
                  promesas absolutas
                </p>
              </div>
            </div>

            <article>
              <strong>
                Poema Universal no lo
                guarda
              </strong>

              <p>
                No se incorpora al canon,
                a perfiles ni a sistemas
                internos.
              </p>
            </article>

            <article>
              <strong>
                Procesamiento temporal
              </strong>

              <p>
                El texto se envía a la
                API únicamente para
                generar esta lectura.
              </p>
            </article>

            <article>
              <strong>
                Sin entrenamiento por
                defecto
              </strong>

              <p>
                Los datos de API no se
                utilizan para entrenar
                modelos salvo adhesión
                expresa.
              </p>
            </article>

            <article>
              <strong>
                Registros de seguridad
              </strong>

              <p>
                El proveedor puede
                conservar temporalmente
                registros para prevenir
                abusos.
              </p>
            </article>
          </section>
        </aside>

        <section
          id="resultado-matriz"
          className={styles.results}
        >
          {status === "idle" && (
            <div className={styles.empty}>
              <div
                className={
                  styles.emptySeal
                }
              >
                <span>✦</span>
              </div>

              <p>
                Altar en espera
              </p>

              <h2>
                Aquí aparecerá el mundo
                invisible de tu poema
              </h2>

              <span>
                La Matriz no decidirá qué
                significa tu obra.
                Construirá una lectura
                posible para que puedas
                contemplarla desde otro
                lugar.
              </span>

              <div
                className={
                  styles.emptyOrbit
                }
              >
                <i />
                <i />
                <i />
              </div>
            </div>
          )}

          {status === "analyzing" && (
            <div
              className={
                styles.analyzing
              }
              aria-live="polite"
            >
              <div
                className={
                  styles.matrixCore
                }
              >
                <span>✦</span>

                <div />
                <div />
                <div />
              </div>

              <p>
                Matriz en escucha
              </p>

              <h2>
                {
                  ANALYSIS_PHASES[
                    analysisPhase
                  ]
                }
              </h2>

              <div
                className={
                  styles.analysisProgress
                }
              >
                {ANALYSIS_PHASES.map(
                  (phase, index) => (
                    <span
                      key={phase}
                      className={
                        index <=
                        analysisPhase
                          ? styles.phaseActive
                          : ""
                      }
                    />
                  )
                )}
              </div>

              <small>
                La lectura puede tardar
                unos instantes.
              </small>
            </div>
          )}

          {status === "error" && (
            <div
              className={styles.empty}
            >
              <div
                className={
                  styles.errorSeal
                }
              >
                ×
              </div>

              <p>
                La escucha se interrumpió
              </p>

              <h2>
                La Matriz no pudo abrir
                este poema
              </h2>

              <span>{error}</span>
            </div>
          )}

          {status === "complete" &&
            result && (
              <div
                className={styles.stack}
              >
                <section
                  className={styles.altar}
                >
                  <div
                    className={
                      styles.altarLight
                    }
                  />

                  <p>
                    Altar del poema
                  </p>

                  <h2>
                    {form.title.trim() ||
                      "Poema sin título"}
                  </h2>

                  <span>
                    {form.author.trim() ||
                      "Autor no indicado"}
                    {" · "}
                    {form.language}
                  </span>

                  <blockquote>
                    “{result.gravityLine}”
                  </blockquote>

                  <small>
                    Esto no es lo que tu
                    poema significa. Es
                    una de las formas en
                    que ha decidido
                    aparecer.
                  </small>
                </section>

                <nav
                  className={
                    styles.resultNav
                  }
                  aria-label="Salas de la Matriz"
                >
                  <button
                    type="button"
                    className={
                      activeView ===
                      "reading"
                        ? styles.activeTab
                        : ""
                    }
                    onClick={() =>
                      setActiveView(
                        "reading"
                      )
                    }
                  >
                    Lectura
                  </button>

                  <button
                    type="button"
                    className={
                      activeView ===
                      "world"
                        ? styles.activeTab
                        : ""
                    }
                    onClick={() =>
                      setActiveView(
                        "world"
                      )
                    }
                  >
                    Mundo
                  </button>

                  <button
                    type="button"
                    className={
                      activeView ===
                      "workshop"
                        ? styles.activeTab
                        : ""
                    }
                    onClick={() =>
                      setActiveView(
                        "workshop"
                      )
                    }
                  >
                    Taller de elevación
                  </button>
                </nav>

                {activeView ===
                  "reading" && (
                  <>
                    <div
                      className={
                        styles.grid
                      }
                    >
                      <article>
                        <p>Umbral</p>
                        <span>
                          {
                            result.threshold
                          }
                        </span>
                      </article>

                      <article>
                        <p>Movimiento</p>
                        <span>
                          {
                            result.movement
                          }
                        </span>
                      </article>

                      <article>
                        <p>
                          Pulso del poema
                        </p>
                        <span>
                          {result.pulse}
                        </span>
                      </article>

                      <article>
                        <p>
                          Núcleo invisible
                        </p>
                        <span>
                          {
                            result.invisibleCore
                          }
                        </span>
                      </article>
                    </div>

                    <section
                      className={
                        styles.dna
                      }
                    >
                      <div>
                        <p>
                          ADN poético
                        </p>

                        <h3>
                          Las fuerzas que
                          sostienen esta
                          lectura
                        </h3>
                      </div>

                      <div
                        className={
                          styles.axes
                        }
                      >
                        {result.axes.map(
                          (axis) => (
                            <div
                              key={
                                axis.label
                              }
                              className={
                                styles.axis
                              }
                            >
                              <div>
                                <span>
                                  {
                                    axis.label
                                  }
                                </span>

                                <span>
                                  {
                                    Math.round(
                                      axis.value
                                    )
                                  }
                                  %
                                </span>
                              </div>

                              <i>
                                <b
                                  style={{
                                    width: `${Math.max(
                                      0,
                                      Math.min(
                                        100,
                                        axis.value
                                      )
                                    )}%`,
                                  }}
                                />
                              </i>
                            </div>
                          )
                        )}
                      </div>
                    </section>

                    <div
                      className={
                        styles.grid
                      }
                    >
                      <article>
                        <p>
                          Zona invisible
                        </p>

                        <span>
                          {
                            result.hiddenZone
                          }
                        </span>
                      </article>

                      <article>
                        <p>
                          Imagen persistente
                        </p>

                        <span>
                          {
                            result.imageForce
                          }
                        </span>
                      </article>

                      <article>
                        <p>
                          Resonancia
                        </p>

                        <span>
                          {
                            result.resonance
                          }
                        </span>
                      </article>

                      <article>
                        <p>
                          Línea de gravedad
                        </p>

                        <blockquote>
                          “
                          {
                            result.gravityLine
                          }
                          ”
                        </blockquote>
                      </article>
                    </div>
                  </>
                )}

                {activeView ===
                  "world" && (
                  <>
                    <div
                      className={
                        styles.symbolGrid
                      }
                    >
                      <article
                        className={
                          styles.symbolCard
                        }
                      >
                        <p>
                          Símbolo central
                        </p>

                        <div
                          className={
                            styles.symbolSeal
                          }
                        >
                          ✧
                        </div>

                        <h3>
                          {
                            result
                              .centralSymbol
                              .name
                          }
                        </h3>

                        <span>
                          {
                            result
                              .centralSymbol
                              .description
                          }
                        </span>
                      </article>

                      <article
                        className={
                          styles.relicCard
                        }
                      >
                        <p>Reliquia</p>

                        <div
                          className={
                            styles.relic
                          }
                        >
                          <i />
                          <i />
                          <i />
                        </div>

                        <h3>
                          {
                            result.relic
                              .name
                          }
                        </h3>

                        <small>
                          {
                            result.relic
                              .material
                          }
                        </small>

                        <span>
                          {
                            result.relic
                              .description
                          }
                        </span>
                      </article>
                    </div>

                    <section
                      className={
                        styles.scene
                      }
                    >
                      <div
                        className={
                          styles.sceneVisual
                        }
                      >
                        <div
                          className={
                            styles.sceneLight
                          }
                        />

                        <div
                          className={
                            styles.sceneRing
                          }
                        />

                        <div
                          className={
                            styles.sceneBook
                          }
                        />

                        <div
                          className={
                            styles.sceneDoor
                          }
                        />
                      </div>

                      <div
                        className={
                          styles.sceneCopy
                        }
                      >
                        <p>
                          Escenografía
                        </p>

                        <h3>
                          {
                            result
                              .scenography
                              .title
                          }
                        </h3>

                        <small>
                          {
                            result
                              .scenography
                              .atmosphere
                          }
                        </small>

                        <span>
                          {
                            result
                              .scenography
                              .description
                          }
                        </span>
                      </div>
                    </section>

                    <div
                      className={
                        styles.grid
                      }
                    >
                      <article>
                        <p>
                          Gesto final
                        </p>

                        <span>
                          {
                            result.finalGesture
                          }
                        </span>
                      </article>

                      <article>
                        <p>
                          Altar simbólico
                        </p>

                        <span>
                          {
                            result.symbolicAltar
                          }
                        </span>
                      </article>
                    </div>

                    {revealSymbol && (
                      <section
                        className={
                          styles.generatedSymbol
                        }
                      >
                        <div
                          className={
                            styles.generatedCopy
                          }
                        >
                          <p>
                            Sello del poema
                          </p>

                          <h3>
                            Materia visual
                            primigenia
                          </h3>

                          <span>
                            La imagen no
                            ilustra la
                            narración:
                            condensa el
                            núcleo del
                            poema en un
                            signo.
                          </span>

                          {symbolStatus ===
                            "error" && (
                            <>
                              <p
                                className={
                                  styles.symbolError
                                }
                              >
                                {
                                  symbolError
                                }
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  void materializeSymbol(
                                    result
                                  )
                                }
                              >
                                Intentar de nuevo
                              </button>
                            </>
                          )}

                          <details>
                            <summary>
                              Ver partitura
                              visual
                            </summary>

                            <p>
                              {
                                result.symbolPrompt
                              }
                            </p>
                          </details>
                        </div>

                        <div
                          className={
                            styles.generatedVisual
                          }
                        >
                          {symbolStatus ===
                            "generating" && (
                            <div
                              className={
                                styles.symbolLoader
                              }
                            >
                              <span>✦</span>
                              <p>
                                Materializando
                                el signo
                              </p>
                            </div>
                          )}

                          {symbolImage && (
                            <img
                              src={
                                symbolImage
                              }
                              alt={`Sello simbólico de ${
                                form.title ||
                                "este poema"
                              }`}
                            />
                          )}
                        </div>
                      </section>
                    )}
                  </>
                )}

                {activeView ===
                  "workshop" && (
                  <section
                    className={
                      styles.workshop
                    }
                  >
                    <div
                      className={
                        styles.workshopIntro
                      }
                    >
                      <p>
                        Taller de elevación
                      </p>

                      <h3>
                        Caminos posibles
                        para escuchar mejor
                        el poema
                      </h3>

                      <span>
                        La Matriz no
                        reescribe tu obra.
                        Señala lugares
                        donde podrías
                        detenerte y volver
                        a mirar.
                      </span>
                    </div>

                    <div
                      className={
                        styles.revisionList
                      }
                    >
                      {result
                        .revisionPaths
                        .map(
                          (
                            path,
                            index
                          ) => (
                            <article
                              key={path}
                            >
                              <strong>
                                0
                                {index + 1}
                              </strong>

                              <p>
                                {path}
                              </p>
                            </article>
                          )
                        )}
                    </div>
                  </section>
                )}

                <section
                  className={
                    styles.deleteArea
                  }
                >
                  <div>
                    <strong>
                      Esta lectura solo
                      vive en esta sesión
                    </strong>

                    <p>
                      Poema Universal no
                      guarda ni incorpora
                      el poema o el sello.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={deleteSession}
                  >
                    Eliminar sesión
                  </button>
                </section>
              </div>
            )}
        </section>
      </div>

      <footer className={styles.footer}>
        <span>✦</span>
        La palabra es tuya. El mundo
        que genera, también.
        <span>✦</span>
      </footer>
    </main>
  );
}
