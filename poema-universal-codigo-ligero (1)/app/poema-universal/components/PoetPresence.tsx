"use client";

import {
  useEffect,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

import AvatarInfoDialog from "./AvatarInfoDialog";
import { getAvatarById } from "./avatarCatalog";
import RelicInfoDialog from "./RelicInfoDialog";
import PoetBibliographicPanel, { type EditorialIdentity } from "./PoetBibliographicPanel";
import styles from "./PoetPresence.module.css";

export type PoetPresenceState =
  | "public"
  | "incorporation"
  | "open";

type PresenceDesign = {
  avatarVariant: number;
  relicVariant: number;
};

type PoetPresenceProps = {
  position: number;
  state: PoetPresenceState;
  name: string;
  territory: string;
  footer: string;
  onOpen?: () => void;
};

const STORAGE_KEY =
  "poema-universal-presence-designs";

const IDENTITY_STORAGE_KEY =
  "poema-universal.editorial-identities.v1";

function defaultDesign(
  position: number
): PresenceDesign {
  return {
    avatarVariant: position,
    relicVariant: position,
  };
}

function readDesign(
  position: number
): PresenceDesign {
  const fallback = defaultDesign(position);

  try {
    const raw =
      window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return fallback;
    }

    const designs = JSON.parse(raw) as Record<
      string,
      Partial<PresenceDesign>
    >;

    const stored = designs[String(position)];

    if (!stored) {
      return fallback;
    }

    const avatarVariant =
      Number(stored.avatarVariant);

    const relicVariant =
      Number(stored.relicVariant);

    return {
      avatarVariant:
        Number.isInteger(avatarVariant) &&
        avatarVariant >= 1 &&
        avatarVariant <= 60
          ? avatarVariant
          : fallback.avatarVariant,

      relicVariant:
        Number.isInteger(relicVariant) &&
        relicVariant >= 1 &&
        relicVariant <= 60
          ? relicVariant
          : fallback.relicVariant,
    };
  } catch {
    return fallback;
  }
}

async function readRemoteDesign(
  position: number
): Promise<PresenceDesign | null> {
  const response = await fetch(
    "/api/poema-universal/poets",
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();

  const poet = (payload.poets ?? []).find(
    (item: {
      position?: unknown;
    }) =>
      Number(item.position) === position
  );

  if (!poet) {
    return null;
  }

  const fallback =
    defaultDesign(position);

  const avatarVariant =
    Number(poet.avatarVariant);

  const relicVariant =
    Number(poet.relicVariant);

  return {
    avatarVariant:
      Number.isInteger(avatarVariant) &&
      avatarVariant >= 1 &&
      avatarVariant <= 60
        ? avatarVariant
        : fallback.avatarVariant,

    relicVariant:
      Number.isInteger(relicVariant) &&
      relicVariant >= 1 &&
      relicVariant <= 60
        ? relicVariant
        : fallback.relicVariant,
  };
}

function readEditorialIdentities():
  EditorialIdentity[] {
  try {
    const raw =
      window.localStorage.getItem(
        IDENTITY_STORAGE_KEY
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


function formatNumber(value: number) {
  return String(value).padStart(2, "0");
}

export default function PoetPresence({
  position,
  state,
  name,
  territory,
  footer,
  onOpen,
}: PoetPresenceProps) {
  const [design, setDesign] =
    useState<PresenceDesign>(() =>
      defaultDesign(position)
    );

  const [avatarDialogOpen, setAvatarDialogOpen] =
    useState(false);

  const [relicDialogOpen, setRelicDialogOpen] =
    useState(false);

  const [
    bibliographicOpen,
    setBibliographicOpen,
  ] = useState(false);

  const [
    editorialIdentities,
    setEditorialIdentities,
  ] = useState<EditorialIdentity[]>([]);

  const identity =
    editorialIdentities.find(
      (item) =>
        item.avatarId ===
          design.avatarVariant &&
        item.relicId ===
          design.relicVariant
    ) ?? null;

  const displayState =
    identity ? "public" : state;

  const displayName =
    identity?.name ?? name;

  const displayTerritory =
    identity?.territory ?? territory;

  const displayFooter =
    identity
      ? "Abrir ficha bibliográfica"
      : footer;

  const isInteractive =
    Boolean(identity) ||
    (
      state === "public" &&
      typeof onOpen === "function"
    );

  useEffect(() => {
    function synchronize() {
      setDesign(readDesign(position));

      void readRemoteDesign(position)
        .then((remoteDesign) => {
          if (remoteDesign) {
            setDesign(remoteDesign);
          }
        })
        .catch((error) => {
          console.error(
            "No se pudo cargar la presencia:",
            error
          );
        });
    }

    synchronize();

    window.addEventListener(
      "poema-presence-update",
      synchronize
    );

    window.addEventListener(
      "storage",
      synchronize
    );

    return () => {
      window.removeEventListener(
        "poema-presence-update",
        synchronize
      );

      window.removeEventListener(
        "storage",
        synchronize
      );
    };
  }, [position]);

  useEffect(() => {
    function synchronizeIdentities() {
      setEditorialIdentities(
        readEditorialIdentities()
      );
    }

    synchronizeIdentities();

    window.addEventListener(
      "poema-universal:identity-saved",
      synchronizeIdentities
    );

    window.addEventListener(
      "storage",
      synchronizeIdentities
    );

    return () => {
      window.removeEventListener(
        "poema-universal:identity-saved",
        synchronizeIdentities
      );

      window.removeEventListener(
        "storage",
        synchronizeIdentities
      );
    };
  }, []);

  function openBibliographicProfile() {
    if (identity) {
      setBibliographicOpen(true);
      return;
    }

    onOpen?.();
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLLIElement>
  ) {
    if (
      !isInteractive ||
      (event.key !== "Enter" &&
        event.key !== " ")
    ) {
      return;
    }

    event.preventDefault();
    openBibliographicProfile();
  }

  function openAvatar(
    event: MouseEvent<HTMLButtonElement>
  ) {
    event.stopPropagation();
    setAvatarDialogOpen(true);
  }

  function openRelic(
    event: MouseEvent<HTMLButtonElement>
  ) {
    event.stopPropagation();
    setRelicDialogOpen(true);
  }

  const avatarNumber = formatNumber(
    design.avatarVariant
  );

  const relicNumber = formatNumber(
    design.relicVariant
  );

  const avatarInfo = getAvatarById(
    design.avatarVariant
  );

  return (
    <>
      <li
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive ? 0 : -1}
        aria-label={
          isInteractive
            ? `Abrir ficha de ${displayName}`
            : undefined
        }
        className={[
          styles.item,
          styles[displayState],
        ].join(" ")}
        onClick={
          isInteractive
            ? openBibliographicProfile
            : undefined
        }
        onKeyDown={handleKeyDown}
      >
        <div className={styles.header}>
          <span className={styles.number}>
            {formatNumber(position)}
          </span>

          <span
            aria-hidden="true"
            className={styles.statusDot}
          />
        </div>

        <div className={styles.stage}>
          <span
            aria-hidden="true"
            className={styles.thread}
          />

          <button
            type="button"
            className={styles.avatarFrame}
            aria-label={`Conocer el avatar ${avatarInfo.title}`}
            title={avatarInfo.title}
            onClick={openAvatar}
            style={{
              overflow: "hidden",
              padding: 0,
              background: "#050708",
              cursor: "pointer",
            }}
          >
            <img
              src={`/avatars/avatar-${avatarNumber}.webp`}
              alt=""
              draggable={false}
              className="block h-full w-full object-contain object-center transition duration-500 hover:scale-[1.035]"
              style={{
                opacity:
                  displayState === "public"
                    ? 1
                    : displayState === "incorporation"
                      ? 0.72
                      : 0.4,
                filter:
                  displayState === "public"
                    ? "saturate(.84) contrast(1.04)"
                    : "grayscale(.48) saturate(.48) brightness(.72)",
              }}
            />
          </button>

          <button
            type="button"
            className={styles.relic}
            aria-label={`Conocer el tesoro T${relicNumber}`}
            title="Conocer este tesoro"
            onClick={openRelic}
            style={{
              overflow: "hidden",
              padding: 0,
              background: "#050708",
              cursor: "pointer",
            }}
          >
            <img
              src={`/relics/relic-${relicNumber}.webp`}
              alt=""
              draggable={false}
              className="block h-full w-full rounded-full object-cover transition duration-300 hover:scale-110"
            />
          </button>
        </div>

        <div className={styles.copy}>
          <p className={styles.name}>
            {displayName}
          </p>

          <p className={styles.territory}>
            {displayTerritory}
          </p>

          <div className={styles.footer}>
            <span>{displayFooter}</span>

            <span className={styles.relicLabel}>
              A{avatarNumber} · T{relicNumber}
            </span>
          </div>
        </div>
      </li>

      <AvatarInfoDialog
        avatarId={design.avatarVariant}
        open={avatarDialogOpen}
        onClose={() =>
          setAvatarDialogOpen(false)
        }
      />

      <RelicInfoDialog
        relicId={design.relicVariant}
        open={relicDialogOpen}
        onClose={() =>
          setRelicDialogOpen(false)
        }
      />

      <PoetBibliographicPanel
        position={position}
        identity={identity}
        avatarId={design.avatarVariant}
        relicId={design.relicVariant}
        open={bibliographicOpen}
        onClose={() =>
          setBibliographicOpen(false)
        }
      />
    </>
  );
}
