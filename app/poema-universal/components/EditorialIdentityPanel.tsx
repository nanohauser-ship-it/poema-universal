"use client";

import {
  useEffect,
  useState,
} from "react";

type EditorialIdentityPanelProps = {
  avatarId: number;
  relicId: number;
};

type PoetDefinition = {
  id: string;
  name: string;
  poemTitle: string;
  territory: string;
};

type SavedIdentity = PoetDefinition & {
  avatarId: number;
  relicId: number;
  savedAt: string;
};

const STORAGE_KEY =
  "poema-universal.editorial-identities.v1";

const POETS: PoetDefinition[] = [
  {
    id: "jose-naveiro",
    name: "José Naveiro",
    poemTitle: "El huerto",
    territory: "Galicia · España",
  },
  {
    id: "asataka",
    name: "ASATAKA",
    poemTitle: "La luz regresa descalza",
    territory: "Japón · 日本",
  },
];

function formatNumber(value: number) {
  return String(value).padStart(2, "0");
}

function readIdentities(): SavedIdentity[] {
  try {
    const raw =
      window.localStorage.getItem(
        STORAGE_KEY
      );

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
}

export default function EditorialIdentityPanel({
  avatarId,
  relicId,
}: EditorialIdentityPanelProps) {
  const [poetId, setPoetId] =
    useState(POETS[0].id);

  const [confirmed, setConfirmed] =
    useState(false);

  const [identities, setIdentities] =
    useState<SavedIdentity[]>([]);

  const [message, setMessage] =
    useState("");

  const [status, setStatus] =
    useState<
      "idle" | "success" | "error"
    >("idle");

  useEffect(() => {
    setIdentities(
      readIdentities()
    );
  }, []);

  const selectedPoet =
    POETS.find(
      (poet) => poet.id === poetId
    ) ?? POETS[0];

  const savedIdentity =
    identities.find(
      (identity) =>
        identity.id === poetId
    );

  function saveIdentity() {
    setMessage("");
    setStatus("idle");

    if (!confirmed) {
      setMessage(
        "Marca la casilla para confirmar la unión."
      );
      setStatus("error");
      return;
    }

    const conflict =
      identities.find(
        (identity) =>
          identity.id !== poetId &&
          (
            identity.avatarId ===
              avatarId ||
            identity.relicId ===
              relicId
          )
      );

    if (conflict) {
      const piece =
        conflict.avatarId === avatarId
          ? `A${formatNumber(avatarId)}`
          : `T${formatNumber(relicId)}`;

      setMessage(
        `${piece} ya pertenece a ${conflict.name}.`
      );

      setStatus("error");
      return;
    }

    const identity: SavedIdentity = {
      ...selectedPoet,
      avatarId,
      relicId,
      savedAt:
        new Date().toISOString(),
    };

    const nextIdentities = [
      ...identities.filter(
        (item) =>
          item.id !== poetId
      ),
      identity,
    ];

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(nextIdentities)
    );

    setIdentities(
      nextIdentities
    );

    setConfirmed(false);

    setMessage(
      `${identity.name}: A${formatNumber(
        avatarId
      )} · T${formatNumber(relicId)} guardados.`
    );

    setStatus("success");

    window.dispatchEvent(
      new CustomEvent(
        "poema-universal:identity-saved",
        {
          detail: identity,
        }
      )
    );
  }

  function releaseIdentity() {
    const nextIdentities =
      identities.filter(
        (identity) =>
          identity.id !== poetId
      );

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(nextIdentities)
    );

    setIdentities(
      nextIdentities
    );

    setConfirmed(false);

    setMessage(
      "La identidad ha sido liberada."
    );

    setStatus("success");
  }

  return (
    <section
      style={{
        marginTop: "18px",
        border:
          "1px solid rgba(199,164,103,.28)",
        background:
          "rgba(199,164,103,.055)",
        padding: "16px",
      }}
    >
      <p
        style={{
          color: "#c7a467",
          fontSize: "8px",
          letterSpacing: ".28em",
          textTransform: "uppercase",
        }}
      >
        Identidad editorial
      </p>

      <h3
        style={{
          marginTop: "8px",
          fontFamily:
            'Georgia, "Times New Roman", serif',
          fontSize: "22px",
          lineHeight: "1.1",
          color: "#f0e8dc",
        }}
      >
        Entregar avatar y tesoro
      </h3>

      <p
        style={{
          marginTop: "8px",
          color:
            "rgba(240,232,220,.46)",
          fontSize: "11px",
          lineHeight: "1.6",
        }}
      >
        Selecciona las dos piezas en las
        galerías, elige la voz y confirma
        su identidad definitiva.
      </p>

      <label
        style={{
          display: "block",
          marginTop: "16px",
        }}
      >
        <span
          style={{
            display: "block",
            marginBottom: "7px",
            color:
              "rgba(240,232,220,.4)",
            fontSize: "8px",
            letterSpacing: ".2em",
            textTransform: "uppercase",
          }}
        >
          Poeta
        </span>

        <select
          value={poetId}
          onChange={(event) => {
            setPoetId(
              event.target.value
            );

            setConfirmed(false);
            setMessage("");
            setStatus("idle");
          }}
          style={{
            width: "100%",
            border:
              "1px solid rgba(255,255,255,.13)",
            background: "#17130f",
            padding: "12px",
            color: "#f0e8dc",
            fontFamily:
              'Georgia, "Times New Roman", serif',
            fontSize: "15px",
            outline: "none",
          }}
        >
          {POETS.map((poet) => (
            <option
              key={poet.id}
              value={poet.id}
            >
              {poet.name}
            </option>
          ))}
        </select>
      </label>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "8px",
          marginTop: "12px",
        }}
      >
        <div
          style={{
            border:
              "1px solid rgba(255,255,255,.09)",
            background:
              "rgba(0,0,0,.16)",
            padding: "11px",
          }}
        >
          <p
            style={{
              color:
                "rgba(240,232,220,.34)",
              fontSize: "7px",
              letterSpacing: ".18em",
              textTransform: "uppercase",
            }}
          >
            Avatar
          </p>

          <p
            style={{
              marginTop: "5px",
              color: "#e3c78e",
              fontFamily:
                'Georgia, "Times New Roman", serif',
              fontSize: "21px",
            }}
          >
            A{formatNumber(avatarId)}
          </p>
        </div>

        <div
          style={{
            border:
              "1px solid rgba(255,255,255,.09)",
            background:
              "rgba(0,0,0,.16)",
            padding: "11px",
          }}
        >
          <p
            style={{
              color:
                "rgba(240,232,220,.34)",
              fontSize: "7px",
              letterSpacing: ".18em",
              textTransform: "uppercase",
            }}
          >
            Tesoro
          </p>

          <p
            style={{
              marginTop: "5px",
              color: "#e3c78e",
              fontFamily:
                'Georgia, "Times New Roman", serif',
              fontSize: "21px",
            }}
          >
            T{formatNumber(relicId)}
          </p>
        </div>
      </div>

      <div
        style={{
          marginTop: "13px",
          border:
            "1px solid rgba(255,255,255,.08)",
          padding: "12px",
        }}
      >
        <p
          style={{
            color: "#f0e8dc",
            fontFamily:
              'Georgia, "Times New Roman", serif',
            fontSize: "16px",
          }}
        >
          {selectedPoet.name}
        </p>

        <p
          style={{
            marginTop: "4px",
            color:
              "rgba(240,232,220,.4)",
            fontSize: "8px",
            letterSpacing: ".16em",
            textTransform: "uppercase",
          }}
        >
          {selectedPoet.poemTitle}
        </p>

        <p
          style={{
            marginTop: "4px",
            color:
              "rgba(240,232,220,.28)",
            fontSize: "8px",
          }}
        >
          {selectedPoet.territory}
        </p>
      </div>

      <label
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
          marginTop: "14px",
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(event) =>
            setConfirmed(
              event.target.checked
            )
          }
          style={{
            marginTop: "2px",
            accentColor: "#c7a467",
          }}
        />

        <span
          style={{
            color:
              "rgba(240,232,220,.55)",
            fontSize: "10px",
            lineHeight: "1.55",
          }}
        >
          Confirmo que A
          {formatNumber(avatarId)} y T
          {formatNumber(relicId)}
          pertenecen a{" "}
          {selectedPoet.name}.
        </span>
      </label>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginTop: "15px",
        }}
      >
        <button
          type="button"
          onClick={saveIdentity}
          style={{
            flex: "1 1 150px",
            border:
              "1px solid rgba(199,164,103,.5)",
            background:
              "rgba(199,164,103,.09)",
            padding: "12px",
            color: "#e3c78e",
            fontSize: "8px",
            letterSpacing: ".24em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Guardar identidad
        </button>

        {savedIdentity && (
          <button
            type="button"
            onClick={releaseIdentity}
            style={{
              border:
                "1px solid rgba(255,255,255,.12)",
              background:
                "transparent",
              padding: "12px",
              color:
                "rgba(240,232,220,.46)",
              fontSize: "8px",
              letterSpacing: ".18em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Liberar
          </button>
        )}
      </div>

      <p
        aria-live="polite"
        style={{
          minHeight: "18px",
          marginTop: "11px",
          color:
            status === "success"
              ? "#b8d6aa"
              : status === "error"
                ? "#e7a39a"
                : "rgba(240,232,220,.3)",
          fontSize: "10px",
          lineHeight: "1.5",
        }}
      >
        {message ||
          (
            savedIdentity
              ? `${savedIdentity.name}: A${formatNumber(
                  savedIdentity.avatarId
                )} · T${formatNumber(
                  savedIdentity.relicId
                )}`
              : "Esta voz todavía no tiene una identidad guardada."
          )}
      </p>

      {identities.length > 0 && (
        <div
          style={{
            marginTop: "12px",
            borderTop:
              "1px solid rgba(255,255,255,.08)",
            paddingTop: "11px",
          }}
        >
          <p
            style={{
              color:
                "rgba(240,232,220,.3)",
              fontSize: "7px",
              letterSpacing: ".2em",
              textTransform: "uppercase",
            }}
          >
            Voces guardadas
          </p>

          {identities.map(
            (identity) => (
              <div
                key={identity.id}
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: "12px",
                  marginTop: "8px",
                  color:
                    "rgba(240,232,220,.58)",
                  fontSize: "10px",
                }}
              >
                <span>
                  {identity.name}
                </span>

                <span
                  style={{
                    color: "#c7a467",
                  }}
                >
                  A
                  {formatNumber(
                    identity.avatarId
                  )}
                  {" · "}
                  T
                  {formatNumber(
                    identity.relicId
                  )}
                </span>
              </div>
            )
          )}
        </div>
      )}
    </section>
  );
}
