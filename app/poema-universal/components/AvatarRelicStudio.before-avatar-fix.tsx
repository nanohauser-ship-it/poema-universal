"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getRelicById,
} from "./relicCatalog";
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

  const selectedRelic = getRelicById(
    currentDesign.relicVariant
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

      <article
        style={{
          display: "grid",
          gridTemplateColumns: "105px 1fr",
          gap: "18px",
          marginTop: "18px",
          border:
            "1px solid rgba(199,164,103,.28)",
          background:
            "rgba(199,164,103,.055)",
          padding: "13px",
        }}
      >
        <img
          src={`/relics/relic-${formatNumber(
            selectedRelic.id
          )}.webp`}
          alt={selectedRelic.name}
          style={{
            width: "105px",
            height: "105px",
            objectFit: "cover",
          }}
        />

        <div>
          <p
            style={{
              color: "#c7a467",
              fontSize: "8px",
              letterSpacing: ".26em",
            }}
          >
            {selectedRelic.code} ·{" "}
            {selectedRelic.meaning.toUpperCase()}
          </p>

          <h3
            style={{
              marginTop: "8px",
              fontFamily:
                'Georgia, "Times New Roman", serif',
              fontSize: "21px",
              color: "#f0e8dc",
            }}
          >
            {selectedRelic.name}
          </h3>

          <p
            style={{
              marginTop: "8px",
              fontFamily:
                'Georgia, "Times New Roman", serif',
              fontStyle: "italic",
              fontSize: "13px",
              lineHeight: "1.55",
              color:
                "rgba(240,232,220,.64)",
            }}
          >
            {selectedRelic.description}
          </p>

          <p
            style={{
              marginTop: "9px",
              fontSize: "8px",
              letterSpacing: ".12em",
              color:
                "rgba(240,232,220,.34)",
            }}
          >
            {selectedRelic.material}
          </p>
        </div>
      </article>

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
          {positions.map((relicId) => {
            const relic =
              getRelicById(relicId);

            const selected =
              currentDesign.relicVariant ===
              relicId;

            return (
              <button
                key={relicId}
                type="button"
                aria-pressed={selected}
                aria-label={`${relic.code}: ${relic.name}`}
                title={relic.name}
                onClick={() =>
                  selectRelic(relicId)
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
                    relicId
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
                      "rgba(5,8,11,.82)",
                    color: selected
                      ? "#c7a467"
                      : "rgba(240,232,220,.66)",
                    fontSize: "8px",
                  }}
                >
                  {formatNumber(relicId)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p className={styles.note}>
        Al seleccionar una reliquia se muestra
        su ficha y queda asignada inmediatamente
        a la voz elegida.
      </p>
    </aside>
  );
}
