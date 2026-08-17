"use client";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getPresenceById,
} from "../data/presenceCatalog";

import type {
  TutelaryMode,
  WritingSession,
} from "../types";

import TutelaryScene3D
  from "./TutelaryScene3D";

import styles
  from "./PresenciasTutelaresSimple.module.css";

const STORAGE_KEY =
  "poema-universal.tutelary-session.v1";

const PRESENCE_ORDER = [
  "camus",
  "borges",
  "pizarnik",
] as const;

const VISUALS = {
  camus: {
    surname: "Camus",
    symbol: "☀",
    phrase:
      "La claridad del Mediterráneo, la verdad frente al absurdo.",
  },

  borges: {
    surname: "Borges",
    symbol: "∞",
    phrase:
      "El infinito como biblioteca, el tiempo como enigma.",
  },

  pizarnik: {
    surname: "Pizarnik",
    symbol: "☾",
    phrase:
      "La noche como espejo, la palabra como herida.",
  },
} as const;

const MODE_LABELS:
  Record<TutelaryMode, string> = {
  inspiration: "Inspiración",
  protection: "Protección",
  mirror: "Espejo",
};

const MODE_DESCRIPTIONS:
  Record<TutelaryMode, string> = {
  inspiration:
    "Abre imágenes, preguntas y caminos posibles.",

  protection:
    "Guarda silencio y protege tu concentración.",

  mirror:
    "Observa símbolos, repeticiones y cambios de tono.",
};

function initialSession():
  WritingSession {
  return {
    presenceId: "camus",
    mode: "protection",
    title: "",
    content: "",
    updatedAt:
      new Date().toISOString(),
  };
}

function PresenceArtwork({
  id,
}: {
  id: string;
}) {
  return (
    <div
      className={[
        styles.artwork,
        styles[`art_${id}`],
      ].join(" ")}
      aria-hidden="true"
    >
      <span className={styles.orb} />
      <span className={styles.form} />
      <span className={styles.trace} />
    </div>
  );
}

export default function
PresenciasTutelaresSimple() {
  const [session, setSession] =
    useState<WritingSession>(
      initialSession
    );

  const [hydrated, setHydrated] =
    useState(false);

  const [savedMessage, setSavedMessage] =
    useState("");

  const editorRef =
    useRef<HTMLTextAreaElement>(
      null
    );

  useEffect(() => {
    try {
      const raw =
        window.localStorage.getItem(
          STORAGE_KEY
        );

      if (raw) {
        const stored =
          JSON.parse(raw) as
            Partial<WritingSession>;

        setSession((current) => ({
          ...current,
          ...stored,
        }));
      }
    } catch {
      window.localStorage.removeItem(
        STORAGE_KEY
      );
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const timeout =
      window.setTimeout(() => {
        const nextSession = {
          ...session,
          updatedAt:
            new Date().toISOString(),
        };

        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(nextSession)
        );

        setSavedMessage(
          "Guardado automáticamente"
        );

        window.setTimeout(
          () => setSavedMessage(""),
          1600
        );
      }, 550);

    return () =>
      window.clearTimeout(timeout);
  }, [hydrated, session]);

  const presences = useMemo(
    () =>
      PRESENCE_ORDER.map(
        (id) =>
          getPresenceById(id)
      ),
    []
  );

  const presence = useMemo(
    () =>
      getPresenceById(
        session.presenceId
      ),
    [session.presenceId]
  );

  const visual =
    VISUALS[
      presence.id as keyof typeof VISUALS
    ] ?? VISUALS.borges;

  const wordCount =
    useMemo(
      () =>
        session.content
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .length,
      [session.content]
    );

  function choosePresence(
    presenceId: string
  ) {
    setSession((current) => ({
      ...current,
      presenceId,
    }));
  }

  function chooseMode(
    mode: TutelaryMode
  ) {
    setSession((current) => ({
      ...current,
      mode,
    }));
  }

  function enterWriting() {
    document
      .getElementById(
        "espacio-de-escritura"
      )
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

    window.setTimeout(
      () => editorRef.current?.focus(),
      650
    );
  }

  function clearSession() {
    window.localStorage.removeItem(
      STORAGE_KEY
    );

    setSession(
      initialSession()
    );

    setSavedMessage(
      "La página vuelve a estar en blanco"
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link
          href="/poema-universal"
          className={styles.brand}
        >
          Poema Universal
        </Link>

        <nav
          className={styles.navigation}
          aria-label="Navegación"
        >
          <span>Escribir</span>
          <span>Archivo privado</span>
        </nav>

        <p className={styles.private}>
          Guardado en este dispositivo
        </p>
      </header>

      <div className={styles.shell}>
        <section className={styles.hero}>
          <span
            className={styles.heroSymbol}
            aria-hidden="true"
          >
            ✦
          </span>

          <p className={styles.eyebrow}>
            Primera constelación
          </p>

          <h1>
            Escribe acompañado
            <br />
            por una presencia
          </h1>

          <p className={styles.heroText}>
            Elige una mirada que
            custodie el lugar desde el
            que vas a escribir. Ninguna
            presencia escribirá por ti.
          </p>
        </section>

        <section
          className={styles.cards}
          aria-label={
            "Selección de presencia"
          }
        >
          {presences.map(
            (item, index) => {
              const itemVisual =
                VISUALS[
                  item.id as keyof
                    typeof VISUALS
                ] ?? VISUALS.borges;

              const selected =
                item.id ===
                session.presenceId;

              return (
                <button
                  type="button"
                  key={item.id}
                  className={[
                    styles.card,
                    styles[
                      `card_${item.id}`
                    ],
                    selected
                      ? styles.selected
                      : "",
                  ].join(" ")}
                  onClick={() =>
                    choosePresence(
                      item.id
                    )
                  }
                  aria-pressed={selected}
                >
                  <div
                    className={
                      styles.cardRegistry
                    }
                  >
                    <span>
                      0{index + 1}
                    </span>

                    <span>
                      {selected
                        ? "Elegida"
                        : ""}
                    </span>
                  </div>

                  <div
                    className={
                      styles.cardHeading
                    }
                  >
                    <small>
                      {item.authorName}
                    </small>

                    <h2>
                      {
                        itemVisual.surname
                      }
                    </h2>

                    <span
                      className={
                        styles.cardSymbol
                      }
                      aria-hidden="true"
                    >
                      {
                        itemVisual.symbol
                      }
                    </span>

                    <p>
                      {
                        itemVisual.phrase
                      }
                    </p>
                  </div>

                  <PresenceArtwork
                    id={item.id}
                  />

                  <footer
                    className={
                      styles.cardFooter
                    }
                  >
                    <span>
                      {item.symbolicName}
                    </span>

                    <strong>
                      {selected
                        ? "Seleccionada"
                        : "Elegir"}
                    </strong>
                  </footer>
                </button>
              );
            }
          )}
        </section>

        <section
          className={styles.modes}
        >
          <header
            className={
              styles.sectionHeading
            }
          >
            <div>
              <p
                className={
                  styles.eyebrow
                }
              >
                Forma de compañía
              </p>

              <h2>
                ¿Cómo debe permanecer
                contigo?
              </h2>
            </div>

            <p>
              Podrás cambiar esta
              elección mientras escribes.
            </p>
          </header>

          <div className={styles.modeGrid}>
            {(
              [
                "inspiration",
                "protection",
                "mirror",
              ] as TutelaryMode[]
            ).map((mode) => (
              <button
                type="button"
                key={mode}
                className={[
                  styles.mode,
                  session.mode === mode
                    ? styles.activeMode
                    : "",
                ].join(" ")}
                onClick={() =>
                  chooseMode(mode)
                }
              >
                <strong>
                  {MODE_LABELS[mode]}
                </strong>

                <span>
                  {
                    MODE_DESCRIPTIONS[
                      mode
                    ]
                  }
                </span>
              </button>
            ))}
          </div>
        </section>

        <section
          id="espacio-de-escritura"
          className={styles.workspace}
        >
          <header
            className={
              styles.workspaceHeader
            }
          >
            <div>
              <p
                className={
                  styles.eyebrow
                }
              >
                Tu espacio de escritura
              </p>

              <h2>
                {visual.surname}
                <em>
                  {" · "}
                  {
                    MODE_LABELS[
                      session.mode
                    ]
                  }
                </em>
              </h2>
            </div>

            <button
              type="button"
              className={
                styles.enterButton
              }
              onClick={enterWriting}
            >
              Escribir con
              {" "}
              {visual.surname}
              <span aria-hidden="true">
                →
              </span>
            </button>
          </header>

          <div
            className={
              styles.workspaceLayout
            }
          >
            <aside
              className={
                styles.presencePanel
              }
            >
              <div
                className={styles.scene}
              >
                <TutelaryScene3D
                  presenceId={
                    presence.id
                  }
                />
              </div>

              <blockquote>
                “
                {
                  presence.openingPhrase
                }
                ”
              </blockquote>

              <p>
                {presence.aura}
              </p>
            </aside>

            <section
              className={styles.editor}
            >
              <div
                className={
                  styles.editorModes
                }
              >
                {(
                  [
                    "inspiration",
                    "protection",
                    "mirror",
                  ] as TutelaryMode[]
                ).map((mode) => (
                  <button
                    type="button"
                    key={mode}
                    className={
                      session.mode === mode
                        ? styles.editorModeActive
                        : styles.editorMode
                    }
                    onClick={() =>
                      chooseMode(mode)
                    }
                  >
                    {MODE_LABELS[mode]}
                  </button>
                ))}
              </div>

              <label
                className={
                  styles.titleField
                }
              >
                <span>
                  Título provisional
                </span>

                <input
                  value={session.title}
                  placeholder={
                    "Poema sin nombre"
                  }
                  onChange={(event) =>
                    setSession(
                      (current) => ({
                        ...current,
                        title:
                          event.target
                            .value,
                      })
                    )
                  }
                />
              </label>

              <label
                className={
                  styles.writingField
                }
              >
                <span>
                  Tu escritura
                </span>

                <textarea
                  ref={editorRef}
                  value={
                    session.content
                  }
                  placeholder={
                    "Empieza a escribir…"
                  }
                  onChange={(event) =>
                    setSession(
                      (current) => ({
                        ...current,
                        content:
                          event.target
                            .value,
                      })
                    )
                  }
                />
              </label>

              <footer
                className={
                  styles.editorFooter
                }
              >
                <div>
                  <span>
                    {wordCount}
                    {" "}
                    palabras
                  </span>

                  <span>
                    {savedMessage}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={clearSession}
                >
                  Limpiar página
                </button>
              </footer>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
