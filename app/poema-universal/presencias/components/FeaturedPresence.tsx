"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { PoeticPresence } from "../../data/poeticPresences";
import styles from "../archive.module.css";

type FeaturedPresenceProps = {
  presences: readonly PoeticPresence[];
  total: number;
};

export default function FeaturedPresence({
  presences,
  total,
}: FeaturedPresenceProps) {
  const [index, setIndex] = useState(0);
  const presence = presences[index];

  if (!presence) {
    return null;
  }

  const number = String(presence.id).padStart(2, "0");
  const destination =
    `/poema-universal/presencias/${presence.slug}`;

  function move(direction: number) {
    setIndex((current) =>
      (current + direction + presences.length) %
      presences.length
    );
  }

  return (
    <section
      className={styles.featured}
      aria-label={`Presencia ${number}: ${presence.name}`}
      aria-live="polite"
    >
      <div className={styles.featuredVisual}>
        <Link
          href={destination}
          className={styles.featuredPortraitLink}
          aria-label={`Entrar en la presencia de ${presence.name}`}
        >
          <figure className={styles.featuredPortrait}>
            {presence.media.portraitUrl ? (
              <Image
                key={presence.slug}
                src={presence.media.portraitUrl}
                alt={`Retrato de ${presence.name}`}
                fill
                priority={index === 0}
                sizes="(max-width: 900px) calc(100vw - 32px), 500px"
                className={styles.featuredImage}
              />
            ) : null}

            <span
              className={styles.featuredVeil}
              aria-hidden="true"
            />

            <figcaption className={styles.featuredCaption}>
              Rostro · voz · territorio
            </figcaption>
          </figure>
        </Link>
      </div>

      <div className={styles.featuredCopy}>
        <p className={styles.featuredIndex}>
          Presencia {number} / {total}
        </p>

        <h1 className={styles.featuredName}>
          {presence.name}
        </h1>

        <p className={styles.featuredTerritory}>
          {presence.territory}
          {presence.country
            ? ` · ${presence.country}`
            : ""}
        </p>

        {presence.poem?.title ? (
          <p className={styles.featuredPoem}>
            «{presence.poem.title}»
          </p>
        ) : (
          <p className={styles.featuredPoem}>
            El poema permanece.
          </p>
        )}

        <p className={styles.featuredText}>
          Una persona recibe por un instante toda la
          atención. Su rostro, su lengua y el territorio
          desde el que escribe.
        </p>

        <Link
          href={destination}
          className={styles.featuredEntry}
        >
          Entrar en su presencia
          <span aria-hidden="true">↗</span>
        </Link>

        <nav
          className={styles.featuredNav}
          aria-label="Recorrer las presencias documentadas"
        >
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Presencia anterior"
          >
            ← Anterior
          </button>

          <span>
            {String(index + 1).padStart(2, "0")}
            {" / "}
            {String(presences.length).padStart(2, "0")}
          </span>

          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Presencia siguiente"
          >
            Siguiente →
          </button>
        </nav>
      </div>
    </section>
  );
}
