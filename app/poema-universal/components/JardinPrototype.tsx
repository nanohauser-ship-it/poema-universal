"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { getAvatarById } from "./avatarCatalog";
import { getRelicById } from "./relicCatalog";
import styles from "./JardinPrototype.module.css";

type PresenceDesign = {
  avatarVariant: number;
  relicVariant: number;
};

type DesignMap = Record<
  string,
  PresenceDesign
>;

type SceneNode = {
  slot: number;
  x: number;
  y: number;
  scale: number;
};

const STORAGE_KEY =
  "poema-universal-presence-designs";

const SCENE_NODES: SceneNode[] = [
  { slot: 1, x: 11, y: 18, scale: 1 },
  { slot: 2, x: 30, y: 13, scale: 0.92 },
  { slot: 3, x: 50, y: 19, scale: 1.04 },
  { slot: 4, x: 71, y: 14, scale: 0.94 },

  { slot: 5, x: 17, y: 43, scale: 1.05 },
  { slot: 6, x: 38, y: 39, scale: 0.96 },
  { slot: 7, x: 59, y: 44, scale: 1.02 },
  { slot: 8, x: 79, y: 37, scale: 0.9 },

  { slot: 9, x: 12, y: 70, scale: 0.94 },
  { slot: 10, x: 33, y: 74, scale: 1 },
  { slot: 11, x: 55, y: 69, scale: 0.95 },
  { slot: 12, x: 76, y: 74, scale: 1.02 },
];

function formatNumber(value: number) {
  return String(value).padStart(2, "0");
}

function defaultDesign(
  position: number
): PresenceDesign {
  return {
    avatarVariant: position,
    relicVariant: position,
  };
}

function readDesigns(): DesignMap {
  try {
    const raw =
      window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return {};
    }

    return JSON.parse(raw) as DesignMap;
  } catch {
    return {};
  }
}

export default function JardinPrototype() {
  const [designs, setDesigns] =
    useState<DesignMap>({});

  const [selectedSlot, setSelectedSlot] =
    useState(1);

  useEffect(() => {
    setDesigns(readDesigns());
  }, []);

  const presences = useMemo(
    () =>
      SCENE_NODES.map((node) => {
        const design =
          designs[String(node.slot)] ??
          defaultDesign(node.slot);

        return {
          ...node,
          design,
          avatar: getAvatarById(
            design.avatarVariant
          ),
          relic: getRelicById(
            design.relicVariant
          ),
        };
      }),
    [designs]
  );

  const selectedPresence =
    presences.find(
      (presence) =>
        presence.slot === selectedSlot
    ) ?? presences[0];

  return (
    <main className={styles.page}>
      <div
        aria-hidden="true"
        className={styles.atmosphere}
      />

      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            Poema Universal · Prototipo
          </p>

          <h1 className={styles.title}>
            Jardín de las Voces
          </h1>

          <p className={styles.subtitle}>
            Doce presencias comienzan a habitar
            un pequeño mundo literario.
          </p>
        </div>

        <nav className={styles.navigation}>
          <Link
            href="/poema-universal#voces"
            className={styles.navigationLink}
          >
            Las voces
          </Link>

          <Link
            href="/poema-universal"
            className={styles.navigationLink}
          >
            Volver
          </Link>
        </nav>
      </header>

      <div className={styles.layout}>
        <section
          className={styles.scene}
          aria-label="Jardín animado de las voces"
        >
          <div
            aria-hidden="true"
            className={styles.centralHalo}
          />

          {presences.map(
            (presence, index) => {
              const selected =
                selectedSlot ===
                presence.slot;

              return (
                <button
                  key={presence.slot}
                  type="button"
                  aria-pressed={selected}
                  aria-label={
                    presence.avatar.title
                  }
                  className={[
                    styles.node,
                    selected
                      ? styles.selectedNode
                      : "",
                  ].join(" ")}
                  style={{
                    left: `${presence.x}%`,
                    top: `${presence.y}%`,
                    transform: `translate(-50%, -50%) scale(${presence.scale})`,
                  }}
                  onMouseEnter={() =>
                    setSelectedSlot(
                      presence.slot
                    )
                  }
                  onFocus={() =>
                    setSelectedSlot(
                      presence.slot
                    )
                  }
                  onClick={() =>
                    setSelectedSlot(
                      presence.slot
                    )
                  }
                >
                  <span
                    className={styles.floatLayer}
                    style={{
                      animationDelay: `${index * -0.37}s`,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className={styles.nodeAura}
                    />

                    <span
                      className={
                        styles.avatarFrame
                      }
                    >
                      <img
                        src={`/avatars/avatar-${formatNumber(
                          presence.design
                            .avatarVariant
                        )}.webp`}
                        alt=""
                        draggable={false}
                        className={
                          styles.avatarImage
                        }
                      />
                    </span>

                    <span
                      className={
                        styles.relicOrbit
                      }
                    >
                      <img
                        src={`/relics/relic-${formatNumber(
                          presence.design
                            .relicVariant
                        )}.webp`}
                        alt=""
                        draggable={false}
                        className={
                          styles.relicImage
                        }
                      />
                    </span>

                    <span
                      className={styles.nodeCopy}
                    >
                      <span
                        className={
                          styles.nodeCode
                        }
                      >
                        A
                        {formatNumber(
                          presence.design
                            .avatarVariant
                        )}{" "}
                        · T
                        {formatNumber(
                          presence.design
                            .relicVariant
                        )}
                      </span>

                      <span
                        className={
                          styles.nodeTitle
                        }
                      >
                        {
                          presence.avatar
                            .title
                        }
                      </span>
                    </span>
                  </span>
                </button>
              );
            }
          )}
        </section>

        <aside className={styles.panel}>
          <p className={styles.panelEyebrow}>
            Presencia seleccionada
          </p>

          <h2 className={styles.panelTitle}>
            {selectedPresence.avatar.title}
          </h2>

          <p className={styles.panelDescription}>
            {
              selectedPresence.avatar
                .description
            }
          </p>

          <article className={styles.card}>
            <img
              src={`/avatars/avatar-${formatNumber(
                selectedPresence.design
                  .avatarVariant
              )}.webp`}
              alt={
                selectedPresence.avatar.title
              }
              className={styles.cardAvatar}
            />

            <div>
              <p className={styles.cardCode}>
                {
                  selectedPresence.avatar
                    .code
                }
              </p>

              <h3 className={styles.cardTitle}>
                {
                  selectedPresence.avatar
                    .presence
                }
              </h3>

              <p className={styles.cardMeta}>
                Gesto ·{" "}
                {
                  selectedPresence.avatar
                    .gesture
                }
              </p>
            </div>
          </article>

          <article className={styles.card}>
            <img
              src={`/relics/relic-${formatNumber(
                selectedPresence.design
                  .relicVariant
              )}.webp`}
              alt={selectedPresence.relic.name}
              className={styles.cardRelic}
            />

            <div>
              <p className={styles.cardCode}>
                {
                  selectedPresence.relic
                    .code
                }
              </p>

              <h3 className={styles.cardTitle}>
                {selectedPresence.relic.name}
              </h3>

              <p className={styles.cardMeta}>
                {
                  selectedPresence.relic
                    .meaning
                }
              </p>
            </div>
          </article>

          <div className={styles.relationship}>
            <p className={styles.relationshipTitle}>
              Relación simbólica
            </p>

            <p>
              {selectedPresence.avatar.title}{" "}
              custodia{" "}
              {selectedPresence.relic.name.toLowerCase()}
              , una reliquia vinculada a{" "}
              {selectedPresence.relic.meaning.toLowerCase()}
              .
            </p>
          </div>

          <p className={styles.slot}>
            Plaza{" "}
            {formatNumber(
              selectedPresence.slot
            )}
          </p>
        </aside>
      </div>
    </main>
  );
}
