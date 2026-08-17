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
} from "../../presencias-tutelares/data/presenceCatalog";

import type {
  TutelaryMode,
  WritingSession,
} from "../../presencias-tutelares/types";

import styles
  from "./SalaTresPresencias.module.css";

import TutelaryScene3D
  from "../../presencias-tutelares/components/TutelaryScene3D";


type PresenceId =
  | "camus"
  | "borges"
  | "pizarnik";

const STORAGE_KEY =
  "poema-universal:"
  + "sala-tres-presencias:v1";

const PRESENCE_IDS:
  readonly PresenceId[] = [
    "camus",
    "borges",
    "pizarnik",
  ];

const COVER_PATHS:
  Record<PresenceId, string> = {
  camus:
    "/poema-universal/presencias/caratulas/camus.png?v=2",
  borges:
    "/poema-universal/presencias/caratulas/borges.png?v=2",
  pizarnik:
    "/poema-universal/presencias/caratulas/pizarnik.png?v=2",
};

const VISUALS:
  Record<
    PresenceId,
    {
      surname: string;
      number: string;
      symbol: string;
      sentence: string;
    }
  > = {
  camus: {
    surname: "Camus",
    number: "01",
    symbol: "☀",
    sentence:
      "La claridad del Mediterráneo, la dignidad frente al absurdo.",
  },

  borges: {
    surname: "Borges",
    number: "02",
    symbol: "∞",
    sentence:
      "El infinito como biblioteca, el tiempo como enigma.",
  },

  pizarnik: {
    surname: "Pizarnik",
    number: "03",
    symbol: "☾",
    sentence:
      "La noche como espejo, la palabra como herida.",
  },
};

const MODE_LABELS:
  Record<TutelaryMode, string> = {
  inspiration: "Inspiración",
  protection: "Protección",
  mirror: "Espejo",
};

const MODE_TEXTS:
  Record<TutelaryMode, string> = {
  inspiration:
    "Abre una imagen, una pregunta o un camino posible.",

  protection:
    "Permanece en silencio y protege tu concentración.",

  mirror:
    "Observa repeticiones, símbolos y cambios de tono.",
};

function createInitialSession():
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

function isPresenceId(
  value: string
): value is PresenceId {
  return (
    value === "camus"
    || value === "borges"
    || value === "pizarnik"
  );
}

function PresenceArtwork({
  presenceId,
}: {
  presenceId: PresenceId;
}) {
  if (presenceId === "camus") {
    return (
      <div
        className={[
          styles.artwork,
          styles.camusArtwork,
        ].join(" ")}
        aria-hidden="true"
      >
        <span className={styles.camusSun} />
        <span className={styles.camusSea} />
        <span className={styles.camusStone} />
      </div>
    );
  }

  if (presenceId === "pizarnik") {
    return (
      <div
        className={[
          styles.artwork,
          styles.pizarnikArtwork,
        ].join(" ")}
        aria-hidden="true"
      >
        <span
          className={styles.pizarnikMoon}
        />

        <span
          className={styles.pizarnikStem}
        />

        <span
          className={styles.pizarnikFlower}
        />

        <span
          className={styles.pizarnikPaper}
        />
      </div>
    );
  }

  return (
    <div
      className={[
        styles.artwork,
        styles.borgesArtwork,
      ].join(" ")}
      aria-hidden="true"
    >
      <span className={styles.borgesArch} />

      <span
        className={styles.borgesMirror}
      />

      <span className={styles.borgesMaze}>
        <i />
        <b />
        <em />
      </span>
    </div>
  );
}

export default function
SalaTresPresencias() {
  const [session, setSession] =
    useState<WritingSession>(
      createInitialSession
    );

  const [hydrated, setHydrated] =
    useState(false);

  const [savedMessage, setSavedMessage] =
    useState("");

  const textareaRef =
    useRef<HTMLTextAreaElement>(
      null
    );

  useEffect(() => {
    try {
      const raw =
        window.localStorage.getItem(
          STORAGE_KEY
        );

      if (!raw) {
        return;
      }

      const stored =
        JSON.parse(raw) as
          Partial<WritingSession>;

      setSession((current) => ({
        ...current,
        ...stored,

        presenceId:
          stored.presenceId
          && isPresenceId(
            stored.presenceId
          )
            ? stored.presenceId
            : current.presenceId,
      }));
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
          1700
        );
      }, 600);

    return () =>
      window.clearTimeout(timeout);
  }, [hydrated, session]);

  const presences =
    useMemo(
      () =>
        PRESENCE_IDS.map(
          (presenceId) =>
            getPresenceById(
              presenceId
            )
        ),
      []
    );

  const activePresence =
    useMemo(
      () =>
        getPresenceById(
          session.presenceId
        ),
      [session.presenceId]
    );

  const activePresenceId:
    PresenceId =
      isPresenceId(
        activePresence.id
      )
        ? activePresence.id
        : "camus";

  const activeVisual =
    VISUALS[activePresenceId];

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
    presenceId: PresenceId
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

  function beginWriting() {
    document
      .getElementById(
        "mesa-de-escritura"
      )
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

    window.setTimeout(
      () =>
        textareaRef.current?.focus(),
      650
    );
  }

  function clearWriting() {
    const emptySession =
      createInitialSession();

    emptySession.presenceId =
      session.presenceId;

    emptySession.mode =
      session.mode;

    window.localStorage.removeItem(
      STORAGE_KEY
    );

    setSession(emptySession);

    setSavedMessage(
      "La página vuelve a estar vacía"
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
          aria-label={
            "Navegación de la sala"
          }
        >
          <a href="#presencias">
            Presencias
          </a>

          <a href="#mesa-de-escritura">
            Escribir
          </a>
        </nav>

        <p className={styles.privacy}>
          Borrador privado
        </p>
      </header>

      <div className={styles.shell}>
        <section className={styles.hero}>
          <span
            className={styles.heroMark}
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
            Elige una mirada que cuide
            el lugar desde el que vas
            a escribir. Ninguna voz
            escribirá por ti.
          </p>
        </section>

        <section
          id="presencias"
          className={styles.presenceGrid}
          aria-label={
            "Camus, Borges y Pizarnik"
          }
        >
          {presences.map((presence) => {
            const presenceId =
              isPresenceId(
                presence.id
              )
                ? presence.id
                : "camus";

            const visual =
              VISUALS[presenceId];

            const selected =
              presenceId
              === session.presenceId;

            return (
              <button
                type="button"
                key={presenceId}
                className={[
                  styles.presenceCard,
                  styles[
                    `card_${presenceId}`
                  ],
                  selected
                    ? styles.selectedCard
                    : "",
                ].join(" ")}
                onClick={() =>
                  choosePresence(
                    presenceId
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
                    {visual.number}
                  </span>

                  <span>
                    {selected
                      ? "Elegida"
                      : ""}
                  </span>
                </div>

                <header
                  className={
                    styles.cardHeader
                  }
                >
                  <small>
                    {presence.authorName}
                  </small>

                  <h2>
                    {visual.surname}
                  </h2>

                  <span
                    className={
                      styles.cardSymbol
                    }
                    aria-hidden="true"
                  >
                    {visual.symbol}
                  </span>

                  <p>
                    {visual.sentence}
                  </p>
                </header>

                <div
                  className={
                    styles.coverArtwork
                  }
                >
                  <img
                    src={
                      COVER_PATHS[
                        presenceId
                      ]
                    }
                    alt={
                      `Carátula de ${
                        presence.authorName
                      }`
                    }
                  />
                </div>

                <footer
                  className={
                    styles.cardFooter
                  }
                >
                  <span>
                    {
                      presence.symbolicName
                    }
                  </span>

                  <strong>
                    {selected
                      ? "Seleccionada"
                      : "Elegir"}
                  </strong>
                </footer>
              </button>
            );
          })}
        </section>

        <section className={styles.threeDSection}>
          <header className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>
                Presencias en figura
              </p>

              <h2>
                Las tres figuras en 3D
              </h2>
            </div>

            <p>
              Cada presencia conserva su propia forma
              y puede contemplarse antes de entrar
              en la escritura.
            </p>
          </header>

          <div className={styles.threeDGrid}>
            {presences.map((presence) => {
              const presenceId =
                isPresenceId(
                  presence.id
                )
                  ? presence.id
                  : "camus";

              const visual =
                VISUALS[presenceId];

              return (
                <article
                  key={`scene-${presenceId}`}
                  className={styles.sceneCard}
                >
                  <header className={styles.sceneCardHeader}>
                    <small>{presence.authorName}</small>
                    <h3>{visual.surname}</h3>
                  </header>

                  <div className={styles.sceneStage}>
                    <TutelaryScene3D
                      presenceId={presenceId}
                    />
                  </div>

                  <footer className={styles.sceneCardFooter}>
                    <span>{presence.symbolicName}</span>
                    <b>{visual.symbol}</b>
                  </footer>
                </article>
              );
            })}
          </div>
        </section>


        <section className={styles.modes}>
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
              La forma de acompañamiento
              puede cambiar durante la
              escritura.
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
                  styles.modeButton,
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
                  {MODE_TEXTS[mode]}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section
          id="mesa-de-escritura"
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
                {activeVisual.surname}

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
                styles.focusButton
              }
              onClick={beginWriting}
            >
              Comenzar a escribir
              <span aria-hidden="true">
                →
              </span>
            </button>
          </header>

          <div
            className={
              styles.workspaceBody
            }
          >
            <aside
              className={
                styles.presenceNote
              }
            >
              <div className={styles.activeScene}>
                <TutelaryScene3D
                  presenceId={activePresenceId}
                />
              </div>

              <span
                className={
                  styles.activeSymbol
                }
                aria-hidden="true"
              >
                {activeVisual.symbol}
              </span>

              <p
                className={
                  styles.activeName
                }
              >
                {
                  activePresence
                    .symbolicName
                }
              </p>

              <blockquote>
                “
                {
                  activePresence
                    .openingPhrase
                }
                ”
              </blockquote>

              <p className={styles.aura}>
                {activePresence.aura}
              </p>

              <div
                className={
                  styles.symbolList
                }
              >
                {
                  activePresence
                    .symbols
                    .map((symbol) => (
                      <span key={symbol}>
                        {symbol}
                      </span>
                    ))
                }
              </div>
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
                  ref={textareaRef}
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
                  onClick={clearWriting}
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
