"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { getAvatarById } from "./avatarCatalog";
import { getRelicById } from "./relicCatalog";
import styles from "./AvatarRelicStudio.module.css";

import EditorialIdentityPanel from "./EditorialIdentityPanel";
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

const ADMIN_SESSION_KEY =
  "poema-universal-curator-secret";

const TOTAL_PRESENCES = 60;

function formatNumber(value: number) {
  return String(value).padStart(2, "0");
}

function normalizeVariant(
  value: unknown,
  fallback: number
) {
  const parsed = Number(value);

  if (
    !Number.isInteger(parsed) ||
    parsed < 1 ||
    parsed > TOTAL_PRESENCES
  ) {
    return fallback;
  }

  return parsed;
}

function defaultDesign(
  position: number
): PresenceDesign {
  return {
    avatarVariant: position,
    relicVariant: position,
  };
}

function normalizeDesign(
  position: number,
  design?: Partial<PresenceDesign>
): PresenceDesign {
  const fallback = defaultDesign(position);

  return {
    avatarVariant: normalizeVariant(
      design?.avatarVariant,
      fallback.avatarVariant
    ),
    relicVariant: normalizeVariant(
      design?.relicVariant,
      fallback.relicVariant
    ),
  };
}

async function readRemoteDesigns():
  Promise<DesignMap> {
  const response = await fetch(
    "/api/poema-universal/poets",
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      "No se pudieron cargar las asignaciones."
    );
  }

  const payload = await response.json();

  const remoteDesigns: DesignMap = {};

  for (const poet of payload.poets ?? []) {
    const position = Number(poet.position);

    if (
      !Number.isInteger(position) ||
      position < 1 ||
      position > TOTAL_PRESENCES
    ) {
      continue;
    }

    remoteDesigns[String(position)] =
      normalizeDesign(position, {
        avatarVariant:
          poet.avatarVariant ??
          position,
        relicVariant:
          poet.relicVariant ??
          position,
      });
  }

  return remoteDesigns;
}

function getAdministratorSecret() {
  const stored =
    window.sessionStorage.getItem(
      ADMIN_SESSION_KEY
    );

  if (stored) {
    return stored;
  }

  const entered = window.prompt(
    "Introduce tu clave privada de administración."
  );

  const normalized = entered?.trim();

  if (!normalized) {
    return null;
  }

  window.sessionStorage.setItem(
    ADMIN_SESSION_KEY,
    normalized
  );

  return normalized;
}

async function persistRemoteDesign(
  position: number,
  design: {
    avatarVariant: number | null;
    relicVariant: number | null;
  }
) {
  const secret =
    getAdministratorSecret();

  if (!secret) {
    throw new Error(
      "No se introdujo la clave administrativa."
    );
  }

  const response = await fetch(
    "/api/poema-universal/poets",
    {
      method: "PATCH",
      headers: {
        "Content-Type":
          "application/json",
        "x-admin-secret": secret,
      },
      body: JSON.stringify({
        position,
        avatarVariant:
          design.avatarVariant,
        relicVariant:
          design.relicVariant,
      }),
    }
  );

  const payload = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      window.sessionStorage.removeItem(
        ADMIN_SESSION_KEY
      );
    }

    throw new Error(
      payload.error ??
        "No se pudo guardar la asignación."
    );
  }
}

function readDesigns(): DesignMap {
  try {
    const raw =
      window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return {};
    }

    const stored = JSON.parse(raw) as Record<
      string,
      Partial<PresenceDesign>
    >;

    const normalized: DesignMap = {};

    for (
      let position = 1;
      position <= TOTAL_PRESENCES;
      position += 1
    ) {
      const key = String(position);

      if (stored[key]) {
        normalized[key] = normalizeDesign(
          position,
          stored[key]
        );
      }
    }

    return normalized;
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
    const search =
      new URLSearchParams(
        window.location.search
      );

    setEnabled(
      window.location.hostname ===
        "localhost" ||
        search.get("curator") === "1"
    );

    const localDesigns =
      readDesigns();

    setDesigns(localDesigns);

    void readRemoteDesigns()
      .then((remoteDesigns) => {
        setDesigns({
          ...localDesigns,
          ...remoteDesigns,
        });
      })
      .catch((error) => {
        console.error(
          "No se pudieron cargar las presencias:",
          error
        );
      });
  }, []);

  const positions = useMemo(
    () =>
      Array.from(
        { length: TOTAL_PRESENCES },
        (_, index) => index + 1
      ),
    []
  );

  const currentDesign = useMemo(
    () =>
      normalizeDesign(
        position,
        designs[String(position)]
      ),
    [designs, position]
  );

  const selectedAvatar = getAvatarById(
    currentDesign.avatarVariant
  );

  const selectedRelic = getRelicById(
    currentDesign.relicVariant
  );

  function saveDesign(
    nextDesign: PresenceDesign
  ) {
    const nextDesigns: DesignMap = {
      ...designs,
      [String(position)]: nextDesign,
    };

    setDesigns(nextDesigns);

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(nextDesigns)
    );

    void persistRemoteDesign(
      position,
      nextDesign
    )
      .then(() => {
        window.dispatchEvent(
          new CustomEvent(
            "poema-presence-update"
          )
        );
      })
      .catch((error) => {
        window.alert(
          error instanceof Error
            ? error.message
            : "No se pudo guardar."
        );
      });
  }

  function selectAvatar(
    avatarVariant: number
  ) {
    saveDesign({
      ...currentDesign,
      avatarVariant,
    });
  }

  function selectRelic(
    relicVariant: number
  ) {
    saveDesign({
      ...currentDesign,
      relicVariant,
    });
  }

  function resetPosition() {
    const nextDesigns = {
      ...designs,
    };

    delete nextDesigns[String(position)];

    setDesigns(nextDesigns);

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(nextDesigns)
    );

    void persistRemoteDesign(
      position,
      {
        avatarVariant: null,
        relicVariant: null,
      }
    )
      .then(() => {
        window.dispatchEvent(
          new CustomEvent(
            "poema-presence-update"
          )
        );
      })
      .catch((error) => {
        window.alert(
          error instanceof Error
            ? error.message
            : "No se pudo reiniciar."
        );
      });
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
        Curar presencias
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
            Taller de presencias
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

      {/* COMBINACIÓN SELECCIONADA */}

      <div
        style={{
          display: "grid",
          gap: "12px",
          marginTop: "18px",
        }}
      >
        {/* FICHA DEL AVATAR */}

        <article
          style={{
            display: "grid",
            gridTemplateColumns:
              "105px minmax(0, 1fr)",
            gap: "18px",
            border:
              "1px solid rgba(199,164,103,.28)",
            background:
              "rgba(199,164,103,.055)",
            padding: "13px",
          }}
        >
          <img
            src={`/avatars/avatar-${formatNumber(
              selectedAvatar.id
            )}.webp`}
            alt={selectedAvatar.title}
            style={{
              display: "block",
              width: "105px",
              height: "130px",
              objectFit: "contain",
              objectPosition: "center",
              background: "#050708",
            }}
          />

          <div>
            <p
              style={{
                color: "#c7a467",
                fontSize: "8px",
                letterSpacing: ".24em",
                textTransform: "uppercase",
              }}
            >
              {selectedAvatar.code} ·{" "}
              {selectedAvatar.presence}
            </p>

            <h3
              style={{
                marginTop: "8px",
                fontFamily:
                  'Georgia, "Times New Roman", serif',
                fontSize: "21px",
                lineHeight: "1.1",
                color: "#f0e8dc",
              }}
            >
              {selectedAvatar.title}
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
              {selectedAvatar.description}
            </p>

            <p
              style={{
                marginTop: "9px",
                color:
                  "rgba(240,232,220,.36)",
                fontSize: "8px",
                letterSpacing: ".12em",
                textTransform: "uppercase",
              }}
            >
              Gesto · {selectedAvatar.gesture}
            </p>
          </div>
        </article>

        {/* FICHA DE LA RELIQUIA */}

        <article
          style={{
            display: "grid",
            gridTemplateColumns:
              "105px minmax(0, 1fr)",
            gap: "18px",
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
              display: "block",
              width: "105px",
              height: "105px",
              objectFit: "cover",
              background: "#050708",
            }}
          />

          <div>
            <p
              style={{
                color: "#c7a467",
                fontSize: "8px",
                letterSpacing: ".24em",
                textTransform: "uppercase",
              }}
            >
              {selectedRelic.code} ·{" "}
              {selectedRelic.meaning}
            </p>

            <h3
              style={{
                marginTop: "8px",
                fontFamily:
                  'Georgia, "Times New Roman", serif',
                fontSize: "21px",
                lineHeight: "1.1",
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
                color:
                  "rgba(240,232,220,.36)",
                fontSize: "8px",
                letterSpacing: ".12em",
                textTransform: "uppercase",
              }}
            >
              Materia · {selectedRelic.material}
            </p>
          </div>
        </article>
      </div>


      <EditorialIdentityPanel
        avatarId={selectedAvatar.id}
        relicId={selectedRelic.id}
      />

      {/* GALERÍA DE AVATARES */}

      <div className={styles.section}>
        <p className={styles.label}>
          Elige uno de los 60 avatares
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(5, minmax(0, 1fr))",
            gap: "7px",
          }}
        >
          {positions.map((avatarId) => {
            const avatar =
              getAvatarById(avatarId);

            const selected =
              currentDesign.avatarVariant ===
              avatarId;

            return (
              <button
                key={`avatar-${avatarId}`}
                type="button"
                aria-pressed={selected}
                aria-label={`${avatar.code}: ${avatar.title}`}
                title={avatar.title}
                onClick={() =>
                  selectAvatar(avatarId)
                }
                style={{
                  position: "relative",
                  aspectRatio: "0.8",
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
                  cursor: "pointer",
                }}
              >
                <img
                  src={`/avatars/avatar-${formatNumber(
                    avatarId
                  )}.webp`}
                  alt=""
                  loading="lazy"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    objectPosition: "center",
                    background: "#050708",
                  }}
                />

                <span
                  style={{
                    position: "absolute",
                    right: "3px",
                    bottom: "3px",
                    padding: "2px 4px",
                    background:
                      "rgba(5,8,11,.84)",
                    color: selected
                      ? "#c7a467"
                      : "rgba(240,232,220,.68)",
                    fontSize: "8px",
                  }}
                >
                  {formatNumber(avatarId)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* GALERÍA DE RELIQUIAS */}

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
                key={`relic-${relicId}`}
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
                  cursor: "pointer",
                }}
              >
                <img
                  src={`/relics/relic-${formatNumber(
                    relicId
                  )}.webp`}
                  alt=""
                  loading="lazy"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    background: "#050708",
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

      <div
        style={{
          marginTop: "20px",
          borderTop:
            "1px solid rgba(240,232,220,.12)",
          paddingTop: "17px",
        }}
      >
        <p className={styles.note}>
          El avatar y la reliquia elegidos
          quedan asignados inmediatamente a la
          plaza {formatNumber(position)}.
        </p>

        <button
          type="button"
          onClick={resetPosition}
          style={{
            marginTop: "12px",
            color:
              "rgba(240,232,220,.48)",
            fontSize: "8px",
            letterSpacing: ".22em",
            textTransform: "uppercase",
          }}
        >
          Restaurar combinación original
        </button>
      </div>
    </aside>
  );
}