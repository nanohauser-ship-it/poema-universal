"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

import {
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  AssemblyDomain,
} from "./AssemblyScene";

import type {
  SymbolicCartography,
} from "@/lib/asamblea/cartografia";

import CartografiaSimbolica from "./CartografiaSimbolica";

import AtlasAlquimico from "./AtlasAlquimico";

import styles from "./asamblea-poema.module.css";

const AssemblyScene = dynamic(
  () => import("./AssemblyScene"),
  {
    ssr: false,
    loading: () => (
      <div
        className={
          styles.sceneLoading
        }
      >
        Preparando la cámara…
      </div>
    ),
  }
);

type Phase =
  | "writing"
  | "consulting"
  | "reading"
  | "revealed";

type DomainReading = {
  title: string;
  reading: string;
  verses: string[];
  discovery: string;
};

type AssemblyAnalysis = {
  secretName: string;
  nucleus: string;
  livingContradiction: string;
  centralSymbol: string;
  relic: string;
  scenography: string;
  finalGesture: string;
  verdict: string;
  dominantDomain:
    AssemblyDomain;
  creatures: Record<
    AssemblyDomain,
    DomainReading
  >;
};

const SAMPLE_POEM = `Bajo la tierra duermen los huesos
de quienes todavía recuerdan el camino.

Por la noche algo vuelve corriendo
desde el fondo del huerto.

No sé si es un perro,
una sombra
o la memoria aprendiendo a respirar.`;

const domainOrder:
  AssemblyDomain[] = [
  "memory",
  "desire",
  "wound",
  "matter",
];

const domainNames:
  Record<AssemblyDomain, string> = {
  memory: "Memoria y ausencia",
  desire: "Deseo y movimiento",
  wound: "Herida y umbral",
  matter: "Materia y cuerpo",
};

const domainShortNames:
  Record<AssemblyDomain, string> = {
  memory: "Memoria",
  desire: "Deseo",
  wound: "Herida",
  matter: "Materia",
};

function fallbackAnalysis(
  poem: string
): AssemblyAnalysis {
  const lines = poem
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const first =
    lines[0] ??
    poem.slice(0, 90);

  const second =
    lines[1] ??
    first;

  const third =
    lines[2] ??
    first;

  const fourth =
    lines[3] ??
    second;

  return {
    secretName:
      "La criatura que todavía conoce el camino",
    nucleus:
      "Algo que parecía perdido continúa actuando desde la ausencia.",
    livingContradiction:
      "El escrito reconoce la desaparición y, al mismo tiempo, imagina un regreso.",
    centralSymbol:
      "Un camino conservado dentro de la materia.",
    relic:
      "Una pequeña campana cubierta de tierra húmeda.",
    scenography:
      "Un huerto nocturno. Bajo el suelo se escucha una carrera breve.",
    finalGesture:
      "Dejar una puerta entreabierta durante una noche.",
    verdict:
      "El escrito no intenta explicar la pérdida: protege la posibilidad de que aquello que amamos conserve una dirección.",
    dominantDomain:
      "memory",
    creatures: {
      memory: {
        title:
          "Lo que continúa regresando",
        reading:
          "La memoria no aparece como archivo inmóvil, sino como una fuerza que todavía conoce el camino.",
        verses: [first],
        discovery:
          "La ausencia conserva movimiento.",
      },
      desire: {
        title:
          "La dirección del escrito",
        reading:
          "La voz avanza hacia una presencia que no puede confirmar, pero tampoco abandonar.",
        verses: [second],
        discovery:
          "El deseo adopta la forma de regreso.",
      },
      wound: {
        title:
          "El lugar de la incertidumbre",
        reading:
          "La herida aparece allí donde la voz duda del nombre de aquello que vuelve.",
        verses: [third],
        discovery:
          "La duda protege una verdad demasiado vulnerable.",
      },
      matter: {
        title:
          "La materia que recuerda",
        reading:
          "La tierra, el cuerpo y el espacio físico sostienen aquello que la conciencia no puede retener sola.",
        verses: [fourth],
        discovery:
          "La materia funciona como memoria.",
      },
    },
  };
}

export default function
AsambleaPoema() {
  const [poem, setPoem] =
    useState(SAMPLE_POEM);

  const [phase, setPhase] =
    useState<Phase>("writing");

  const [
    activeDomain,
    setActiveDomain,
  ] =
    useState<AssemblyDomain | null>(
      null
    );

  const [analysis, setAnalysis] =
    useState<AssemblyAnalysis | null>(
      null
    );

  const [error, setError] =
    useState("");

  const [
    cartography,
    setCartography,
  ] =
    useState<SymbolicCartography | null>(
      null
    );

  const [
    cartographyLoading,
    setCartographyLoading,
  ] =
    useState(false);

  const [
    cartographyError,
    setCartographyError,
  ] =
    useState("");

  const timers =
    useRef<number[]>([]);

  const readings = useMemo(
    () =>
      domainOrder.map(
        (domain) => ({
          id: domain,
          label:
            domainNames[domain],
          shortLabel:
            domainShortNames[
              domain
            ],
          result:
            analysis?.creatures[
              domain
            ] ?? null,
        })
      ),
    [analysis]
  );

  function clearTimers() {
    timers.current.forEach(
      (timer) =>
        window.clearTimeout(timer)
    );

    timers.current = [];
  }

  function beginDeliberation(
    result: AssemblyAnalysis
  ) {
    setPhase("reading");
    setActiveDomain("memory");

    const sequence:
      AssemblyDomain[] = [
      "desire",
      "wound",
      "matter",
    ];

    sequence.forEach(
      (domain, index) => {
        const timer =
          window.setTimeout(() => {
            setActiveDomain(domain);
          }, 1250 * (index + 1));

        timers.current.push(timer);
      }
    );

    const finalTimer =
      window.setTimeout(() => {
        setActiveDomain(
          result.dominantDomain
        );

        setPhase("revealed");
      }, 5000);

    timers.current.push(
      finalTimer
    );
  }

  async function generateCartography(
    sourcePoem: string
  ) {
    setCartographyLoading(true);
    setCartographyError("");
    setCartography(null);

    try {
      const response =
        await fetch(
          "/api/poema-universal/asamblea/cartografia",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              poem: sourcePoem,
            }),
          }
        );

      const payload =
        (await response.json()) as {
          cartography?:
            SymbolicCartography;
          error?: string;
        };

      if (
        !response.ok ||
        !payload.cartography
      ) {
        throw new Error(
          payload.error ??
            "La cartografía no pudo ser trazada."
        );
      }

      setCartography(
        payload.cartography
      );
    } catch (caughtError) {
      setCartographyError(
        caughtError instanceof Error
          ? caughtError.message
          : "La cartografía no pudo ser trazada."
      );
    } finally {
      setCartographyLoading(false);
    }
  }

  async function invokeAssembly() {
    if (
      poem.trim().length < 40 ||
      phase === "consulting" ||
      phase === "reading"
    ) {
      return;
    }

    clearTimers();
    setError("");
    setAnalysis(null);
    setActiveDomain(null);
    setPhase("consulting");

    try {
      const response =
        await fetch(
          "/api/poema-universal/asamblea",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              poem,
            }),
          }
        );

      const payload =
        (await response.json()) as {
          analysis?:
            AssemblyAnalysis;
          error?: string;
        };

      if (
        !response.ok ||
        !payload.analysis
      ) {
        throw new Error(
          payload.error ??
            "La Asamblea no pudo completar la lectura."
        );
      }

      setAnalysis(
        payload.analysis
      );

      void generateCartography(
        poem
      );

      beginDeliberation(
        payload.analysis
      );
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "La Asamblea no pudo completar la lectura.";

      setError(
        `${message} Se mostrará una lectura local provisional.`
      );

      const fallback =
        fallbackAnalysis(poem);

      setAnalysis(fallback);
      beginDeliberation(fallback);
    }
  }

  function resetAssembly() {
    clearTimers();
    setPhase("writing");
    setActiveDomain(null);
    setAnalysis(null);
    setError("");
    setCartography(null);
    setCartographyLoading(false);
    setCartographyError("");
  }

  const ritualActive =
    phase !== "writing";

  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link
          href="/poema-universal"
        >
          ← Poema Universal
        </Link>

        <span>
          La Asamblea del Poema
        </span>

        <Link
          href="/poema-universal"
        >
          Volver a la obra
        </Link>
      </nav>

      <header
        className={styles.hero}
      >
        <p className={styles.eyebrow}>
          Cuatro formas de atención
        </p>

        <h1>
          Deposita tu escrito
          <br />
          en el centro.
        </h1>

        <p>
          Las criaturas leerán su
          memoria, su deseo, su herida
          y su materia para revelar la
          arquitectura invisible que ya
          vive dentro de él.
        </p>
      </header>

      <section
        className={styles.workspace}
      >
        <aside
          className={styles.writerPanel}
        >
          <div
            className={
              styles.panelHeading
            }
          >
            <div>
              <small>
                Manuscrito
              </small>

              <h2>
                El escrito
              </h2>
            </div>

            <span>
              {poem.length} caracteres
            </span>
          </div>

          <textarea
            value={poem}
            onChange={(event) => {
              setPoem(
                event.target.value
              );

              if (
                phase !== "writing"
              ) {
                resetAssembly();
              }
            }}
            placeholder="Escribe o pega aquí tu poema, carta, recuerdo o fragmento…"
            aria-label="Escrito para la Asamblea"
          />

          <p
            className={
              styles.privacy
            }
          >
            Tu escrito se utiliza
            únicamente para esta
            lectura y no se publica.
          </p>

          {error && (
            <p
              className={
                styles.assemblyError
              }
              role="alert"
            >
              {error}
            </p>
          )}

          <div
            className={
              styles.writerActions
            }
          >
            <button
              type="button"
              className={
                styles.secondaryButton
              }
              onClick={() => {
                resetAssembly();
                setPoem("");
              }}
            >
              Limpiar
            </button>

            <button
              type="button"
              className={
                styles.invokeButton
              }
              onClick={
                phase === "revealed"
                  ? resetAssembly
                  : invokeAssembly
              }
              disabled={
                poem.trim().length <
                  40 ||
                phase ===
                  "consulting" ||
                phase === "reading"
              }
            >
              {phase ===
              "consulting"
                ? "Las criaturas escuchan…"
                : phase === "reading"
                  ? "La Asamblea delibera…"
                  : phase ===
                      "revealed"
                    ? "Realizar otra lectura"
                    : "Depositar ante la Asamblea"}
            </button>
          </div>
        </aside>

        <section
          className={
            styles.chamberPanel
          }
        >
          <div
            className={
              styles.chamberStatus
            }
          >
            <span>
              Cámara de deliberación
            </span>

            <strong>
              {phase === "writing"
                ? "En espera"
                : phase ===
                    "consulting"
                  ? "Escuchando"
                  : phase ===
                      "reading"
                    ? "Deliberación"
                    : "Mapa revelado"}
            </strong>
          </div>

          <div
            className={
              styles.sceneFrame
            }
          >
            <AssemblyScene
              activeDomain={
                activeDomain
              }
              ritualActive={
                ritualActive
              }
            />

            <div
              className={
                styles.sceneLegend
              }
            >
              {readings.map(
                (reading) => (
                  <button
                    type="button"
                    key={reading.id}
                    className={[
                      styles.legendItem,
                      activeDomain ===
                      reading.id
                        ? styles.legendActive
                        : "",
                    ].join(" ")}
                    onClick={() =>
                      analysis &&
                      setActiveDomain(
                        reading.id
                      )
                    }
                  >
                    <span />
                    {
                      reading.shortLabel
                    }
                  </button>
                )
              )}
            </div>
          </div>
        </section>

        <aside
          className={styles.mapPanel}
        >
          <div
            className={
              styles.panelHeading
            }
          >
            <div>
              <small>
                Descifrador
              </small>

              <h2>
                Mapa simbólico
              </h2>
            </div>
          </div>

          {!analysis ? (
            <div
              className={
                styles.mapWaiting
              }
            >
              <div
                className={
                  styles.waitingSigil
                }
              >
                {phase ===
                "consulting"
                  ? "⋯"
                  : "✦"}
              </div>

              <p>
                {phase ===
                "consulting"
                  ? "Las cuatro criaturas están reconociendo los territorios del escrito."
                  : "El mapa aparecerá cuando la Asamblea haya leído el escrito."}
              </p>
            </div>
          ) : (
            <>
              <div
                className={
                  styles.symbolicMap
                }
              >
                {readings.map(
                  (reading) => (
                    <button
                      type="button"
                      key={reading.id}
                      className={[
                        styles.mapNode,
                        styles[
                          `node${reading.id
                            .charAt(0)
                            .toUpperCase()}${reading.id.slice(
                            1
                          )}`
                        ],
                        activeDomain ===
                        reading.id
                          ? styles.mapNodeActive
                          : "",
                      ].join(" ")}
                      onClick={() =>
                        setActiveDomain(
                          reading.id
                        )
                      }
                    >
                      {
                        reading.shortLabel
                      }
                    </button>
                  )
                )}

                <div
                  className={
                    styles.mapCore
                  }
                >
                  <small>
                    Núcleo
                  </small>

                  <strong>
                    {
                      analysis.secretName
                    }
                  </strong>
                </div>

                <span
                  className={
                    styles.mapLineOne
                  }
                />

                <span
                  className={
                    styles.mapLineTwo
                  }
                />
              </div>

              <div
                className={
                  styles.readingList
                }
              >
                {readings.map(
                  (reading) => (
                    <button
                      type="button"
                      key={reading.id}
                      className={[
                        styles.readingCard,
                        activeDomain ===
                        reading.id
                          ? styles.readingActive
                          : "",
                      ].join(" ")}
                      onClick={() =>
                        setActiveDomain(
                          reading.id
                        )
                      }
                    >
                      <strong>
                        {
                          reading.result
                            ?.title ??
                          reading.label
                        }
                      </strong>

                      <span>
                        {
                          reading.result
                            ?.reading
                        }
                      </span>

                      {reading.result
                        ?.verses.map(
                          (verse) => (
                            <q
                              key={verse}
                              className={
                                styles.recognizedVerse
                              }
                            >
                              {verse}
                            </q>
                          )
                        )}

                      <em>
                        {
                          reading.result
                            ?.discovery
                        }
                      </em>
                    </button>
                  )
                )}
              </div>
            </>
          )}
        </aside>
      </section>

      {phase === "revealed" &&
        analysis && (
          <section
            className={
              styles.verdict
            }
          >
            <p
              className={
                styles.eyebrow
              }
            >
              Dictamen de la Asamblea
            </p>

            <h2
              className={
                styles.secretName
              }
            >
              {analysis.secretName}
            </h2>

            <blockquote
              className={
                styles.collectiveVerdict
              }
            >
              {analysis.verdict}
            </blockquote>

            <div
              className={
                styles.revelationGrid
              }
            >
              <article>
                <small>Núcleo</small>
                <p>
                  {analysis.nucleus}
                </p>
              </article>

              <article>
                <small>
                  Contradicción viva
                </small>
                <p>
                  {
                    analysis.livingContradiction
                  }
                </p>
              </article>

              <article>
                <small>
                  Símbolo rector
                </small>
                <p>
                  {
                    analysis.centralSymbol
                  }
                </p>
              </article>

              <article>
                <small>
                  Reliquia
                </small>
                <p>
                  {analysis.relic}
                </p>
              </article>

              <article>
                <small>
                  Escenografía
                </small>
                <p>
                  {
                    analysis.scenography
                  }
                </p>
              </article>

              <article>
                <small>
                  Gesto final
                </small>
                <p>
                  {
                    analysis.finalGesture
                  }
                </p>
              </article>
            </div>

            <p
              className={
                styles.verdictNote
              }
            >
              La Asamblea no corrige
              el escrito. Señala los
              lugares donde continúa
              respirando después de ser
              leído.
            </p>
          </section>
        )}

      {phase === "revealed" && (
        <section
          className={
            styles.cartographySection
          }
        >
          {cartographyLoading && (
            <div
              className={
                styles.cartographyLoading
              }
            >
              <span>✦</span>
              <p>
                La Asamblea está
                trazando la geografía
                secreta del escrito…
              </p>
            </div>
          )}

          {cartographyError && (
            <div
              className={
                styles.cartographyError
              }
              role="alert"
            >
              {cartographyError}
            </div>
          )}

          {cartography && (
            <CartografiaSimbolica
              map={cartography}
              activeAxis={
                activeDomain
              }
              onAxisChange={
                setActiveDomain
              }
            />
          )}
        </section>
      )}

      {phase === "revealed" &&
        analysis &&
        cartography && (
          <AtlasAlquimico
            poem={poem}
            analysis={analysis}
            cartography={cartography}
          />
        )}

    </main>
  );
}
