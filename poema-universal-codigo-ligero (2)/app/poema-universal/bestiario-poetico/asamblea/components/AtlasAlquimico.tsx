"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  SymbolicCartography,
} from "@/lib/asamblea/cartografia";

import {
  ALCHEMICAL_PLATE_TYPES,
} from "@/lib/asamblea/atlas-alquimico";

import type {
  AlchemicalPlateType,
  GeneratedAlchemicalPlate,
} from "@/lib/asamblea/atlas-alquimico";

import styles from "./atlas-alquimico.module.css";

import GuardarLaminaButton
  from "./GuardarLaminaButton";

type Props = {
  poem: string;
  analysis: unknown;
  cartography:
    SymbolicCartography;
};

type PlateStatus =
  | "idle"
  | "loading"
  | "ready"
  | "error";

type PlateMap =
  Record<
    AlchemicalPlateType,
    GeneratedAlchemicalPlate | null
  >;

type StatusMap =
  Record<
    AlchemicalPlateType,
    PlateStatus
  >;

type ErrorMap =
  Record<
    AlchemicalPlateType,
    string
  >;

const PLATE_META:
  Record<
    AlchemicalPlateType,
    {
      number: string;
      title: string;
      description: string;
      symbol: string;
    }
  > = {
  "prima-materia": {
    number: "I",
    title:
      "Materia prima",
    description:
      "Los cuerpos, objetos, animales y sustancias que permanecen en el escrito.",
    symbol: "🜔",
  },

  operation: {
    number: "II",
    title: "Operación",
    description:
      "La transformación que actúa entre sus imágenes y tensiones.",
    symbol: "🜍",
  },

  emblem: {
    number: "III",
    title:
      "Emblema secreto",
    description:
      "La arquitectura irrepetible donde el texto adquiere un solo rostro.",
    symbol: "☉",
  },

  relic: {
    number: "IV",
    title: "Reliquia",
    description:
      "El objeto que permanece cuando el resto del escrito se retira.",
    symbol: "◇",
  },
};

function createEmptyPlates():
  PlateMap {
  return {
    "prima-materia": null,
    operation: null,
    emblem: null,
    relic: null,
  };
}

function createEmptyStatuses():
  StatusMap {
  return {
    "prima-materia":
      "idle",
    operation: "idle",
    emblem: "idle",
    relic: "idle",
  };
}

function createEmptyErrors():
  ErrorMap {
  return {
    "prima-materia": "",
    operation: "",
    emblem: "",
    relic: "",
  };
}

function imageSource(
  plate:
    GeneratedAlchemicalPlate
) {
  return (
    `data:${plate.mimeType};` +
    `base64,${plate.imageBase64}`
  );
}

export default function
AtlasAlquimico({
  poem,
  analysis,
  cartography,
}: Props) {
  const [
    revealed,
    setRevealed,
  ] = useState(false);

  const [
    plates,
    setPlates,
  ] = useState<PlateMap>(
    createEmptyPlates
  );

  const [
    statuses,
    setStatuses,
  ] = useState<StatusMap>(
    createEmptyStatuses
  );

  const [
    errors,
    setErrors,
  ] = useState<ErrorMap>(
    createEmptyErrors
  );

  const [
    activePlate,
    setActivePlate,
  ] =
    useState<AlchemicalPlateType | null>(
      null
    );

  useEffect(() => {
    setRevealed(false);
    setPlates(
      createEmptyPlates()
    );
    setStatuses(
      createEmptyStatuses()
    );
    setErrors(
      createEmptyErrors()
    );
    setActivePlate(null);
  }, [
    cartography.secretTitle,
  ]);

  const generating =
    useMemo(
      () =>
        Object.values(
          statuses
        ).some(
          (status) =>
            status ===
            "loading"
        ),
      [statuses]
    );

  const completedCount =
    useMemo(
      () =>
        Object.values(
          plates
        ).filter(Boolean)
          .length,
      [plates]
    );

  async function generatePlate(
    plateType:
      AlchemicalPlateType
  ) {
    setStatuses(
      (current) => ({
        ...current,
        [plateType]:
          "loading",
      })
    );

    setErrors(
      (current) => ({
        ...current,
        [plateType]: "",
      })
    );

    try {
      const response =
        await fetch(
          "/api/poema-universal/asamblea/atlas",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify({
                poem,
                analysis,
                cartography,
                plateType,
              }),
          }
        );

      const payload =
        (await response.json()) as {
          plate?:
            GeneratedAlchemicalPlate;
          error?: string;
        };

      if (
        !response.ok ||
        !payload.plate
      ) {
        throw new Error(
          payload.error ??
            "La lámina no pudo ser revelada."
        );
      }

      setPlates(
        (current) => ({
          ...current,
          [plateType]:
            payload.plate ??
            null,
        })
      );

      setStatuses(
        (current) => ({
          ...current,
          [plateType]:
            "ready",
        })
      );

      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "La lámina no pudo ser revelada.";

      setErrors(
        (current) => ({
          ...current,
          [plateType]:
            message,
        })
      );

      setStatuses(
        (current) => ({
          ...current,
          [plateType]:
            "error",
        })
      );

      return false;
    }
  }

  async function revealAtlas() {
    if (generating) {
      return;
    }

    setRevealed(true);

    for (
      const plateType of
      ALCHEMICAL_PLATE_TYPES
    ) {
      if (
        plates[plateType]
      ) {
        continue;
      }

      await generatePlate(
        plateType
      );
    }
  }

  const enlarged =
    activePlate
      ? plates[
          activePlate
        ]
      : null;

  return (
    <section
      className={
        styles.atlas
      }
      aria-labelledby="atlas-alquimico-title"
    >
      <header
        className={
          styles.header
        }
      >
        <div>
          <p
            className={
              styles.eyebrow
            }
          >
            Gabinete visual
          </p>

          <h2
            id="atlas-alquimico-title"
          >
            Atlas alquímico
            del escrito
          </h2>

          <p
            className={
              styles.introduction
            }
          >
            Cuatro láminas
            nacidas de la materia,
            la transformación,
            el emblema y la reliquia
            de este texto.
          </p>
        </div>

        <div
          className={
            styles.headerAction
          }
        >
          <div
            className={
              styles.seal
            }
            aria-hidden="true"
          >
            <span>☉</span>
            <i />
            <b>◇</b>
          </div>

          <button
            type="button"
            className={
              styles.revealButton
            }
            onClick={
              revealAtlas
            }
            disabled={
              generating ||
              completedCount === 4
            }
          >
            {generating
              ? `Revelando ${completedCount + 1} de 4…`
              : completedCount === 4
                ? "Atlas revelado"
                : completedCount > 0
                  ? "Continuar revelación"
                  : "Revelar el atlas"}
          </button>

          <small>
            Las láminas se generan
            una a una.
          </small>
        </div>
      </header>

      {!revealed ? (
        <div
          className={
            styles.closedCabinet
          }
        >
          <div
            className={
              styles.closedSymbol
            }
          >
            <span>🜍</span>
            <i />
            <b>☽</b>
          </div>

          <p>
            El atlas permanece
            cerrado hasta que
            decidas transformar
            el escrito en imagen.
          </p>
        </div>
      ) : (
        <div
          className={
            styles.grid
          }
        >
          {ALCHEMICAL_PLATE_TYPES.map(
            (plateType) => {
              const metadata =
                PLATE_META[
                  plateType
                ];

              const plate =
                plates[
                  plateType
                ];

              const status =
                statuses[
                  plateType
                ];

              const error =
                errors[
                  plateType
                ];

              return (
                <article
                  key={plateType}
                  className={
                    styles.plate
                  }
                >
                  <header
                    className={
                      styles.plateHeader
                    }
                  >
                    <div>
                      <span>
                        Lámina{" "}
                        {
                          metadata.number
                        }
                      </span>

                      <h3>
                        {
                          metadata.title
                        }
                      </h3>
                    </div>

                    <b
                      aria-hidden="true"
                    >
                      {
                        metadata.symbol
                      }
                    </b>
                  </header>

                  <div
                    className={
                      styles.imageFrame
                    }
                  >
                    {plate ? (
                      <>
                      <button
                        type="button"
                        className={
                          styles.imageButton
                        }
                        onClick={() =>
                          setActivePlate(
                            plateType
                          )
                        }
                        aria-label={
                          `Ampliar ${metadata.title}`
                        }
                      >
                        <img
                          src={
                            imageSource(
                              plate
                            )
                          }
                          alt={
                            `${metadata.title}: lámina alquímica de ${cartography.secretTitle}`
                          }
                        />

                        <span>
                          Ampliar lámina
                        </span>
                      </button>

                      <GuardarLaminaButton
                        plate={plate}
                        plateTitle={metadata.title}
                        plateNumber={metadata.number}
                        symbol={metadata.symbol}
                        secretTitle={
                          cartography.secretTitle
                        }
                        poem={poem}
                      />
                      </>
                    ) : status ===
                      "loading" ? (
                      <div
                        className={
                          styles.loading
                        }
                      >
                        <div
                          className={
                            styles.loadingSeal
                          }
                        >
                          <span>
                            {
                              metadata.symbol
                            }
                          </span>
                          <i />
                        </div>

                        <p>
                          La materia
                          está tomando
                          forma…
                        </p>
                      </div>
                    ) : status ===
                      "error" ? (
                      <div
                        className={
                          styles.error
                        }
                        role="alert"
                      >
                        <span>◇</span>

                        <p>
                          {error}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            generatePlate(
                              plateType
                            )
                          }
                          disabled={
                            generating
                          }
                        >
                          Intentar de nuevo
                        </button>
                      </div>
                    ) : (
                      <div
                        className={
                          styles.waiting
                        }
                      >
                        <span>
                          {
                            metadata.symbol
                          }
                        </span>

                        <p>
                          Esperando su
                          turno de
                          revelación.
                        </p>
                      </div>
                    )}
                  </div>

                  <footer
                    className={
                      styles.plateFooter
                    }
                  >
                    <p>
                      {plate
                        ? plate.caption
                        : metadata.description}
                    </p>

                    {plate && (
                      <button
                        type="button"
                        onClick={() =>
                          generatePlate(
                            plateType
                          )
                        }
                        disabled={
                          generating
                        }
                      >
                        Regenerar
                      </button>
                    )}
                  </footer>
                </article>
              );
            }
          )}
        </div>
      )}

      <footer
        className={
          styles.atlasFooter
        }
      >
        <span>🜔</span>

        <p>
          La cartografía explica
          las relaciones. El atlas
          devuelve su aparición.
        </p>

        <span>🜍</span>
      </footer>

      {enlarged &&
        activePlate && (
          <div
            className={
              styles.modal
            }
            role="dialog"
            aria-modal="true"
            aria-label={
              enlarged.title
            }
            onClick={() =>
              setActivePlate(
                null
              )
            }
          >
            <div
              className={
                styles.modalContent
              }
              onClick={(
                event
              ) =>
                event.stopPropagation()
              }
            >
              <button
                type="button"
                className={
                  styles.closeButton
                }
                onClick={() =>
                  setActivePlate(
                    null
                  )
                }
                aria-label="Cerrar lámina"
              >
                ×
              </button>

              <img
                src={
                  imageSource(
                    enlarged
                  )
                }
                alt={
                  enlarged.title
                }
              />

              <div
                className={
                  styles.modalCaption
                }
              >
                <span>
                  {
                    PLATE_META[
                      activePlate
                    ].number
                  }
                </span>

                <div>
                  <h3>
                    {
                      enlarged.title
                    }
                  </h3>

                  <p>
                    {
                      enlarged.caption
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
    </section>
  );
}
