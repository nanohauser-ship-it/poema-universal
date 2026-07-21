"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getPresenceById,
  tutelaryPresences,
} from "../data/presenceCatalog";

import type {
  TutelaryMode,
  WritingSession,
} from "../types";

import styles from "../PresenciasTutelares.module.css";
import TutelaryScene3D from "./TutelaryScene3D";

const STORAGE_KEY =
  "poema-universal.tutelary-session.v1";

type Stage =
  | "threshold"
  | "selection"
  | "writing";

const modeLabels:
  Record<TutelaryMode, string> = {
  inspiration: "Inspiración",
  protection: "Protección",
  mirror: "Espejo",
};

const modeDescriptions:
  Record<TutelaryMode, string> = {
  inspiration:
    "Recibe preguntas breves, imágenes y aperturas simbólicas.",
  protection:
    "La presencia guarda silencio y protege tu concentración.",
  mirror:
    "Observa símbolos, repeticiones y cambios de tono.",
};

function createInitialSession():
  WritingSession {
  return {
    presenceId: "borges",
    mode: "protection",
    title: "",
    content: "",
    updatedAt:
      new Date().toISOString(),
  };
}

export default function
PresenciasTutelaresExperience() {
  const [stage, setStage] =
    useState<Stage>("threshold");

  const [session, setSession] =
    useState<WritingSession>(
      createInitialSession
    );

  const [savedMessage, setSavedMessage] =
    useState("");

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
      }));
    } catch {
      window.localStorage.removeItem(
        STORAGE_KEY
      );
    }
  }, []);

  useEffect(() => {
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
          "Borrador protegido en este dispositivo"
        );

        window.setTimeout(
          () => setSavedMessage(""),
          1800
        );
      }, 600);

    return () =>
      window.clearTimeout(timeout);
  }, [session]);

  const presence = useMemo(
    () =>
      getPresenceById(
        session.presenceId
      ),
    [session.presenceId]
  );

  function selectPresence(
    presenceId: string
  ) {
    setSession((current) => ({
      ...current,
      presenceId,
    }));
  }

  function selectMode(
    mode: TutelaryMode
  ) {
    setSession((current) => ({
      ...current,
      mode,
    }));
  }

  if (stage === "threshold") {
    return (
      <main className={styles.page}>
        <section
          className={styles.threshold}
        >
          <div
            className={
              styles.thresholdArchitecture
            }
            aria-hidden="true"
          >
            <span />
            <span />
            <span />
          </div>

          <div
            className={
              styles.thresholdMeta
            }
          >
            <span>Sala I</span>
            <span>Primera constelación</span>
            <span>Archivo vivo</span>
          </div>

          <div
            className={
              styles.thresholdTitleBlock
            }
          >
            <p className={styles.eyebrow}>
              Poema Universal
            </p>

            <h1>
              <span>Presencias</span>
              <span>Tutelares</span>
            </h1>

            <p className={styles.subtitle}>
              Elige quién vela tu escritura.
            </p>
          </div>

          <div
            className={
              styles.thresholdInvocation
            }
          >
            <span
              className={
                styles.invocationMark
              }
              aria-hidden="true"
            >
              ✦
            </span>

            <blockquote>
              Ningún escritor entra solo
              en la noche de su obra.
            </blockquote>

            <span
              className={
                styles.invocationMark
              }
              aria-hidden="true"
            >
              ✦
            </span>
          </div>

          <div
            className={
              styles.thresholdEntrance
            }
          >
            <button
              type="button"
              className={
                styles.primaryButton
              }
              onClick={() =>
                setStage("selection")
              }
            >
              Entrar en la sala
            </button>

            <p className={styles.privacy}>
              Tu borrador permanece privado
              en este dispositivo.
            </p>
          </div>

          <div
            className={
              styles.thresholdCoordinates
            }
            aria-hidden="true"
          >
            <span>PU / PT / 01</span>
            <span>La escritura como umbral</span>
          </div>
        </section>
      </main>
    );
  }

  if (stage === "selection") {
    return (
      <main className={styles.page}>
        <section
          className={styles.selection}
        >
          <header
            className={
              styles.selectionHeader
            }
          >
            <div
              className={
                styles.selectionTopline
              }
            >
              <button
                type="button"
                className={
                  styles.backButton
                }
                onClick={() =>
                  setStage("threshold")
                }
              >
                Volver al umbral
              </button>

              <div
                className={
                  styles.selectionRegistry
                }
                aria-label="Registro de la sala"
              >
                <span>Constelación 01</span>
                <span>Tres presencias</span>
                <span>Un espacio privado</span>
              </div>
            </div>

            <div
              className={
                styles.selectionHeading
              }
            >
              <div>
                <p
                  className={
                    styles.eyebrow
                  }
                >
                  Primera constelación
                </p>

                <h1>
                  Elige una presencia
                </h1>
              </div>

              <p
                className={
                  styles.selectionLead
                }
              >
                No eliges una voz que
                escriba por ti. Eliges una
                conciencia simbólica que
                custodie el lugar desde el
                que vas a escribir.
              </p>
            </div>

            <div
              className={
                styles.constellationRule
              }
              aria-hidden="true"
            >
              <span />
              <span>✦</span>
              <span />
            </div>
          </header>

          <div
            className={styles.presenceGrid}
          >
            {tutelaryPresences.map(
              (item) => {
                const selected =
                  item.id ===
                  session.presenceId;

                return (
                  <button
                    type="button"
                    key={item.id}
                    className={[
                      styles.presenceCard,
                      selected
                        ? styles.selectedCard
                        : "",
                    ].join(" ")}
                    onClick={() =>
                      selectPresence(
                        item.id
                      )
                    }
                  >
                    <span
                      className={
                        styles.sculpture
                      }
                      aria-hidden="true"
                    >
                      <span />
                    </span>

                    <small>
                      {item.authorName}
                    </small>

                    <h2>
                      {item.symbolicName}
                    </h2>

                    <p>
                      {item.description}
                    </p>

                    <div
                      className={
                        styles.symbols
                      }
                    >
                      {item.symbols.map(
                        (symbol) => (
                          <span
                            key={symbol}
                          >
                            {symbol}
                          </span>
                        )
                      )}
                    </div>
                  </button>
                );
              }
            )}
          </div>

          <section
            className={styles.modeSection}
          >
            <h2>
              ¿Cómo debe acompañarte?
            </h2>

            <div
              className={styles.modeGrid}
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
                  className={[
                    styles.modeCard,
                    session.mode === mode
                      ? styles.selectedMode
                      : "",
                  ].join(" ")}
                  onClick={() =>
                    selectMode(mode)
                  }
                >
                  <strong>
                    {modeLabels[mode]}
                  </strong>

                  <span>
                    {
                      modeDescriptions[
                        mode
                      ]
                    }
                  </span>
                </button>
              ))}
            </div>
          </section>

          <div
            className={
              styles.activationDock
            }
          >
            <div>
              <p
                className={
                  styles.activationLabel
                }
              >
                Presencia elegida
              </p>

              <strong>
                {presence.symbolicName}
              </strong>

              <span>
                {modeLabels[session.mode]}
              </span>
            </div>

            <button
              type="button"
              className={
                styles.primaryButton
              }
              onClick={() =>
                setStage("writing")
              }
            >
              Activar presencia
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main
      className={[
        styles.page,
        styles[
          `world_${presence.id}`
        ],
      ].join(" ")}
    >
      <section
        className={styles.sanctuary}
      >
        <header
          className={styles.sanctuaryHeader}
        >
          <button
            type="button"
            className={styles.backButton}
            onClick={() =>
              setStage("selection")
            }
          >
            Cambiar presencia
          </button>

          <div>
            <p className={styles.eyebrow}>
              Presencia activa
            </p>

            <h1>
              {presence.symbolicName}
            </h1>

            <p>
              {modeLabels[session.mode]}
            </p>
          </div>
        </header>

        <div
          className={styles.writingLayout}
        >
          <aside
            className={styles.guardianStage}
          >
            <div
              className={
                styles.guardianHalo
              }
            />

            <div
              className={
                styles.guardianCanvas
              }
            >
              <TutelaryScene3D
                presenceId={
                  presence.id
                }
              />
            </div>

            <p
              className={
                styles.openingPhrase
              }
            >
              “{presence.openingPhrase}”
            </p>

            <div
              className={styles.aura}
            >
              {presence.aura}
            </div>
          </aside>

          <section
            className={styles.editor}
          >
            <label>
              <span>
                Título provisional
              </span>

              <input
                value={session.title}
                placeholder="Poema sin nombre"
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

            <label>
              <span>
                Tu escritura
              </span>

              <textarea
                value={session.content}
                placeholder="Escribe aquí. La presencia guardará silencio hasta que la invoques."
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
              className={styles.editorFooter}
            >
              <span>
                {
                  session.content
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean)
                    .length
                }{" "}
                palabras
              </span>

              <span>
                {savedMessage}
              </span>
            </footer>

            <div
              className={styles.actions}
            >
              <button
                type="button"
                disabled={
                  session.mode ===
                  "protection"
                }
              >
                Invocar presencia
              </button>

              <button
                type="button"
                onClick={() => {
                  window.localStorage
                    .removeItem(
                      STORAGE_KEY
                    );

                  setSession(
                    createInitialSession()
                  );
                }}
              >
                Limpiar sesión
              </button>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
