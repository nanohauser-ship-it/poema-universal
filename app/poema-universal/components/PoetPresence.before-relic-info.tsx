"use client";

import {
  useEffect,
  useState,
  type KeyboardEvent,
} from "react";

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
    avatarVariant:
      ((position - 1) % 8) + 1,
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

    const relicVariant =
      Number(stored.relicVariant);

    const avatarVariant =
      Number(stored.avatarVariant);

    return {
      avatarVariant:
        Number.isInteger(avatarVariant) &&
        avatarVariant >= 1 &&
        avatarVariant <= 8
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

  const relicNumber = formatNumber(
    design.relicVariant
  );

  return (
    <li
      role={isInteractive ? "button" : undefined}
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
      onClick={isInteractive ? onOpen : undefined}
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

      <div
        className={styles.stage}
        aria-hidden="true"
      >
        <span className={styles.thread} />

        <div className={styles.avatarFrame}>
          {portraitUrl ? (
            <img
              src={portraitUrl}
              alt=""
              draggable={false}
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "cover",
                objectPosition: "center top",
              }}
            />
          ) : (
            <div className={styles.silhouette}>
              <span className={styles.head} />
              <span className={styles.shoulders} />
            </div>
          )}
        </div>

        <div
          className={styles.relic}
          style={{
            overflow: "hidden",
            padding: 0,
            background: "#050708",
          }}
        >
          <img
            src={`/relics/relic-${relicNumber}.webp`}
            alt=""
            draggable={false}
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        </div>
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
  );
}
