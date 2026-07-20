"use client";

import {
  useEffect,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

import RelicInfoDialog from "./RelicInfoDialog";
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
  portraitUrl?: string | null;
  onOpen?: () => void;
};

const STORAGE_KEY =
  "poema-universal-presence-designs";

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

function formatNumber(value: number) {
  return String(value).padStart(2, "0");
}

export default function PoetPresence({
  position,
  state,
  name,
  territory,
  footer,
  portraitUrl,
  onOpen,
}: PoetPresenceProps) {
  const [design, setDesign] =
    useState<PresenceDesign>(() =>
      defaultDesign(position)
    );

  const [relicDialogOpen, setRelicDialogOpen] =
    useState(false);

  const isInteractive =
    state === "public" &&
    typeof onOpen === "function";

  useEffect(() => {
    function synchronize() {
      setDesign(readDesign(position));
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
    onOpen();
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

  return (
    <>
      <li
        role={
          isInteractive ? "button" : undefined
        }
        tabIndex={isInteractive ? 0 : -1}
        aria-label={
          isInteractive
            ? `Abrir ficha de ${name}`
            : undefined
        }
        className={[
          styles.item,
          styles[state],
        ].join(" ")}
        onClick={
          isInteractive ? onOpen : undefined
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

          <div
            className={styles.avatarFrame}
            aria-hidden="true"
            style={{
              overflow: "hidden",
              padding: 0,
              background: "#050708",
            }}
          >
            <img
              src={`/avatars/avatar-${avatarNumber}.webp`}
              alt=""
              draggable={false}
              className="block h-full w-full object-contain object-center"
              style={{
                opacity:
                  state === "public"
                    ? 1
                    : state === "incorporation"
                      ? 0.72
                      : 0.36,
                filter:
                  state === "public"
                    ? "saturate(.84) contrast(1.04)"
                    : "grayscale(.55) saturate(.45) brightness(.68)",
              }}
            />
          </div>

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
          <p className={styles.name}>{name}</p>

          <p className={styles.territory}>
            {territory}
          </p>

          <div className={styles.footer}>
            <span>{footer}</span>

            <span className={styles.relicLabel}>
              T{relicNumber}
            </span>
          </div>
        </div>
      </li>

      <RelicInfoDialog
        relicId={design.relicVariant}
        open={relicDialogOpen}
        onClose={() =>
          setRelicDialogOpen(false)
        }
      />
    </>
  );
}
