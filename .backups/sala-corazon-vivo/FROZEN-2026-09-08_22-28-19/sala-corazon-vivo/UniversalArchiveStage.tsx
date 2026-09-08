"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import styles from "./sala-corazon-vivo.module.css";

type UniversalArchiveStageProps = {
  onLifeEvent?: (
    message: string,
  ) => void;
};

type Topic = {
  id: string;
  name: string;
  meta: string;
  discipline: string;
  introduction: string;
  related: string[];
  curiosities: string[];
};

const topics: Topic[] = [
  {
    id: "kafka",
    name: "Franz Kafka",
    meta: "1883–1924 · Praga",
    discipline:
      "Escritor · Novelista · Ensayista",
    introduction:
      "Una presencia para pensar la extrañeza, la culpa, la transformación, la burocracia y la fragilidad de la condición humana.",
    related: [
      "Existencia",
      "Burocracia",
      "Alienación",
      "Metamorfosis",
      "Culpa",
      "Familia",
      "Identidad",
      "Sentido",
    ],
    curiosities: [
      "Trabajó durante años en el sector de los seguros mientras desarrollaba su obra literaria.",
      "Pidió a Max Brod que destruyera numerosos manuscritos después de su muerte. Brod decidió conservarlos.",
      "La metamorfosis apareció publicada en 1915 y se convirtió en una de sus obras más conocidas.",
      "El adjetivo «kafkiano» terminó incorporándose al lenguaje para describir situaciones absurdas, opresivas o laberínticas.",
    ],
  },
  {
    id: "goya",
    name: "Francisco de Goya",
    meta: "1746–1828 · España",
    discipline:
      "Pintor · Grabador",
    introduction:
      "Una mirada sobre la razón, la violencia, el poder, la enfermedad, la guerra y las zonas oscuras de la experiencia humana.",
    related: [
      "Guerra",
      "Sueño",
      "Razón",
      "Poder",
      "Violencia",
      "Monstruo",
      "Pueblo",
      "Oscuridad",
    ],
    curiosities: [
      "Su obra atravesó desde la pintura cortesana hasta algunas de las imágenes más inquietantes de la modernidad.",
      "La sordera modificó profundamente su relación con el mundo y con su producción artística.",
      "Los Caprichos utilizaron la sátira para cuestionar supersticiones, abusos y comportamientos sociales.",
      "Las llamadas Pinturas negras fueron realizadas en las paredes de su propia casa.",
    ],
  },
  {
    id: "minotauro",
    name: "El Minotauro",
    meta: "Mitología griega",
    discipline:
      "Mito · Símbolo · Laberinto",
    introduction:
      "Una figura universal para hablar del monstruo, el encierro, la identidad, el sacrificio y aquello que una sociedad decide ocultar.",
    related: [
      "Laberinto",
      "Monstruo",
      "Teseo",
      "Ariadna",
      "Sacrificio",
      "Identidad",
      "Bestia",
      "Secreto",
    ],
    curiosities: [
      "El Minotauro habitaba en el centro del laberinto construido por Dédalo.",
      "El hilo de Ariadna permitió a Teseo encontrar el camino de regreso.",
      "La figura ha sido reinterpretada durante siglos por escritores, pintores y filósofos.",
      "El laberinto terminó convirtiéndose en un símbolo cultural independiente del propio mito.",
    ],
  },
];

export default function UniversalArchiveStage({
  onLifeEvent,
}: UniversalArchiveStageProps) {
  const [opened, setOpened] =
    useState(false);

  const [topicIndex, setTopicIndex] =
    useState(0);

  const topic =
    topics[topicIndex] ?? topics[0];

  useEffect(() => {
    function openArchive() {
      setOpened(true);

      setTopicIndex(
        (current) =>
          (current + 1) %
          topics.length,
      );

      onLifeEvent?.(
        "El Archivo Universal ha abierto una presencia.",
      );
    }

    window.addEventListener(
      "open-universal-archive",
      openArchive,
    );

    return () => {
      window.removeEventListener(
        "open-universal-archive",
        openArchive,
      );
    };
  }, [onLifeEvent]);

  const initials = useMemo(
    () =>
      topic.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    [topic.name],
  );

  function nextTopic() {
    setOpened(true);

    setTopicIndex(
      (current) =>
        (current + 1) %
        topics.length,
    );

    onLifeEvent?.(
      "El Archivo Universal ha cambiado de presencia.",
    );
  }

  return (
    <section
      className={
        styles.archiveUniverse
      }
    >
      <header
        className={
          styles.archiveUniverseHeader
        }
      >
        <div>
          <span
            className={
              styles.sectionEyebrow
            }
          >
            NÚCLEO UNIVERSAL
          </span>

          <h2>
            Archivo Universal
          </h2>
        </div>

        <span
          className={
            styles.archiveReady
          }
        >
          ● PREPARADO
        </span>
      </header>

      {!opened ? (
        <div
          className={
            styles.archiveSleeping
          }
        >
          <div
            className={
              styles.archiveSleepingMark
            }
          >
            ◉
          </div>

          <strong>
            El Archivo espera.
          </strong>

          <p>
            Toca el corazón del Organismo
            para despertar una presencia.
          </p>
        </div>
      ) : (
        <>
          <div
            className={
              styles.archiveHeroGrid
            }
          >
            {/* LÁMINA */}
            <section
              className={
                styles.archivePortrait
              }
            >
              <span
                className={
                  styles.archiveCardLabel
                }
              >
                LÁMINA
              </span>

              <div
                className={
                  styles.archivePortraitStage
                }
              >
                <span>
                  {initials}
                </span>

                <small>
                  RETRATO / OBRA / DOCUMENTO
                </small>
              </div>

              <button
                type="button"
              >
                VER LÁMINA COMPLETA
              </button>
            </section>


            {/* FICHA CENTRAL */}
            <section
              className={
                styles.archiveBiography
              }
            >
              <span
                className={
                  styles.archiveCardLabel
                }
              >
                TEMA UNIVERSAL
              </span>

              <h3>
                {topic.name}
              </h3>

              <p
                className={
                  styles.archiveMeta
                }
              >
                {topic.meta}
              </p>

              <strong
                className={
                  styles.archiveDiscipline
                }
              >
                {topic.discipline}
              </strong>

              <p
                className={
                  styles.archiveIntro
                }
              >
                {topic.introduction}
              </p>

              <div
                className={
                  styles.archiveRelated
                }
              >
                <span>
                  TEMAS RELACIONADOS
                </span>

                <div>
                  {topic.related.map(
                    (item) => (
                      <button
                        type="button"
                        key={item}
                      >
                        {item}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </section>


            {/* CURIOSIDADES */}
            <section
              className={
                styles.archiveCuriosities
              }
            >
              <span
                className={
                  styles.archiveCardLabel
                }
              >
                DATOS CURIOSOS
              </span>

              <div
                className={
                  styles.archiveCuriosityList
                }
              >
                {topic.curiosities.map(
                  (curiosity, index) => (
                    <article
                      key={`${topic.id}-${index}`}
                    >
                      <span>
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      <p>
                        {curiosity}
                      </p>
                    </article>
                  ),
                )}
              </div>

              <button
                type="button"
                className={
                  styles.archiveNextTopic
                }
                onClick={nextTopic}
              >
                ELEGIR OTRO TEMA
              </button>
            </section>
          </div>

          <footer
            className={
              styles.archiveFooter
            }
          >
            <span>
              ARCHIVO UNIVERSAL ·
              POEMA UNIVERSAL
            </span>

            <span>
              FUTURO CORPUS · 500+
              PRESENCIAS
            </span>
          </footer>
        </>
      )}
    </section>
  );
}
