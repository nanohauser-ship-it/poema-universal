"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import styles from "./AvatarRelicStudio.module.css";

type PresenceDesign = {
  avatarVariant: number;
  relicVariant: number;
};

type DesignMap = Record<
  string,
  PresenceDesign
>;

const STORAGE_KEY =
  "poema-universal-presence-designs";

function formatNumber(value: number) {
  return String(value).padStart(2, "0");
}

function defaultDesign(
  position: number
): PresenceDesign {
  return {
    avatarVariant:
      ((position - 1) % 8) + 1,
    relicVariant: position,
  };
}

function readDesigns(): DesignMap {
  try {
    const raw =
      window.localStorage.getItem(STORAGE_KEY);

    return raw
      ? (JSON.parse(raw) as DesignMap)
      : {};
  } catch {
    return {};
  }
}

export default function AvatarRelicStudio() {
  const [enabled, setEnabled] =
    useState(false);

  const [open, setOpen] =
    useState(false);

  const [position, setPosition] =
    useState(1);

  const [designs, setDesigns] =
    useState<DesignMap>({});

  useEffect(() => {
    setEnabled(
      window.location.hostname ===
        "localhost"
    );

    setDesigns(readDesigns());
  }, []);

  const currentDesign = useMemo(
    () =>
      designs[String(position)] ??
      defaultDesign(position),
    [designs, position]
  );

  const positions = Array.from(
    { length: 60 },
    (_, index) => index + 1
  );

  function selectRelic(
    relicVariant: number
  ) {
    const nextDesigns = {
      ...designs,

      [String(position)]: {
        ...currentDesign,
        relicVariant,
      },
    };

    setDesigns(nextDesigns);

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(nextDesigns)
    );

    window.dispatchEvent(
      new CustomEvent(
        "poema-presence-update"
      )
    );
  }

  if (!enabled) {
    return null;
  }

  if (!open) {
    return (
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(true)}
      >
        Curar tesoros
      </button>
    );
  }

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            Poema Universal
          </p>

          <h2 className={styles.title}>
            Taller de tesoros
          </h2>
        </div>

        <button
          type="button"
          className={styles.close}
          aria-label="Cerrar taller"
          onClick={() => setOpen(false)}
        >
          ×
        </button>
      </div>

      <div className={styles.section}>
        <label
          className={styles.label}
          htmlFor="presence-position"
        >
          Plaza seleccionada
        </label>

        <select
          id="presence-position"
          className={styles.select}
          value={position}
          onChange={(event) =>
            setPosition(
              Number(event.target.value)
            )
          }
        >
          {positions.map((slot) => (
            <option
              key={slot}
              value={slot}
            >
              Plaza {formatNumber(slot)}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.section}>
        <p className={styles.label}>
          Elige una de las 60 reliquias
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(5, minmax(0, 1fr))",
            gap: "7px",
          }}
        >
          {positions.map((relic) => {
            const selected =
              currentDesign.relicVariant ===
              relic;

            return (
              <button
                key={relic}
                type="button"
                aria-pressed={selected}
                aria-label={`Tesoro ${formatNumber(
                  relic
                )}`}
                onClick={() =>
                  selectRelic(relic)
                }
                style={{
                  position: "relative",
                  aspectRatio: "1",
                  overflow: "hidden",
                  border: selected
                    ? "1px solid #c7a467"
                    : "1px solid rgba(240,232,220,.12)",
                  background: selected
                    ? "rgba(199,164,103,.12)"
                    : "rgba(240,232,220,.025)",
                  boxShadow: selected
                    ? "0 0 16px rgba(199,164,103,.15)"
                    : "none",
                }}
              >
                <img
                  src={`/relics/relic-${formatNumber(
                    relic
                  )}.webp`}
                  alt=""
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                    objectFit: "cover",
                  }}
                />

                <span
                  style={{
                    position: "absolute",
                    right: "3px",
                    bottom: "3px",
                    padding: "2px 4px",
                    background:
                      "rgba(5,8,11,.8)",
                    color: selected
                      ? "#c7a467"
                      : "rgba(240,232,220,.66)",
                    fontSize: "8px",
                  }}
                >
                  {formatNumber(relic)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p className={styles.note}>
        El tesoro elegido se guarda en este
        navegador y aparece inmediatamente en
        la plaza seleccionada.
      </p>
    </aside>
  );
}
