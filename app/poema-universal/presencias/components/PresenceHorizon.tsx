"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useRef,
  useState,
  type PointerEvent,
} from "react";

import type { PoeticPresence } from "../../data/poeticPresences";
import styles from "../horizon.module.css";

type PresenceHorizonProps = {
  presences: readonly PoeticPresence[];
  total: number;
  year: number;
};

export default function PresenceHorizon({
  presences,
  total,
  year,
}: PresenceHorizonProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const plateRef = useRef<HTMLAnchorElement>(null);
  const active = presences[activeIndex] ?? presences[0];

  if (!active) {
    return null;
  }

  const number = String(active.id).padStart(2, "0");
  const destination =
    `/poema-universal/presencias/${active.slug}`;

  function move(direction: number) {
    setActiveIndex((current) =>
      (current + direction + presences.length) %
      presences.length
    );
  }

  function movePlate(
    event: PointerEvent<HTMLElement>,
  ) {
    const plate = plateRef.current;

    if (!plate) {
      return;
    }

    const bounds =
      event.currentTarget.getBoundingClientRect();

    const x =
      (event.clientX - bounds.left) /
        bounds.width -
      0.5;

    const y =
      (event.clientY - bounds.top) /
        bounds.height -
      0.5;

    plate.style.transform =
      `perspective(1000px) rotateY(${x * 3}deg) ` +
      `rotateX(${-y * 3}deg)`;
  }

  function resetPlate() {
    if (plateRef.current) {
      plateRef.current.style.transform =
        "perspective(1000px) rotateY(0deg) rotateX(0deg)";
    }
  }

  return (
    <main className={styles.page}>
      <section
        className={styles.stage}
        aria-label="Las sesenta presencias"
        onPointerMove={movePlate}
        onPointerLeave={resetPlate}
      >
        <header className={styles.header}>
          <Link href="/poema-universal">
            Poema Universal
          </Link>

          <span>
            Archivo humano · {year}
          </span>

          <span>
            {number} / {total}
          </span>
        </header>

        <div
          className={styles.giantNumber}
          aria-hidden="true"
        >
          {number}
        </div>

        <span
          className={`${styles.thread} ${styles.threadOne}`}
          aria-hidden="true"
        />
        <span
          className={`${styles.thread} ${styles.threadTwo}`}
          aria-hidden="true"
        />

        <div className={styles.identity}>
          <p className={styles.eyebrow}>
            Una voz está presente
          </p>

          <h1>{active.name}</h1>

          <p className={styles.territory}>
            {active.territory}
            {active.country
              ? ` · ${active.country}`
              : ""}
          </p>

          <p className={styles.poem}>
            {active.poem?.title
              ? `«${active.poem.title}»`
              : "«El poema permanece»"}
          </p>
        </div>

        <Link
          ref={plateRef}
          href={destination}
          className={styles.reliquary}
          aria-label={`Entrar en la presencia de ${active.name}`}
        >
          <figure className={styles.plate}>
            {active.media.portraitUrl ? (
              <Image
                key={active.slug}
                src={active.media.portraitUrl}
                alt={`Retrato de ${active.name}`}
                fill
                priority
                sizes="(max-width: 760px) 72vw, 470px"
                className={styles.portrait}
              />
            ) : null}

            <span
              className={styles.imageVeil}
              aria-hidden="true"
            />

            <span
              className={styles.scan}
              aria-hidden="true"
            />

            <figcaption>
              Rostro · voz · territorio
            </figcaption>
          </figure>

          <span className={styles.enter}>
            Entrar en su presencia
            <span aria-hidden="true">↗</span>
          </span>
        </Link>

        <aside className={styles.manifesto}>
          <div>
            <span>Rostro</span>
            <span>Voz</span>
            <span>Territorio</span>
          </div>

          <p>
            Una persona recibe toda la pantalla.
            Las demás permanecen como luz en el
            horizonte.
          </p>
        </aside>

        <nav
          className={styles.stepNavigation}
          aria-label="Cambiar de presencia"
        >
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Presencia anterior"
          >
            ←
          </button>

          <span>
            {String(activeIndex + 1).padStart(
              2,
              "0"
            )}
            {" / "}
            {String(presences.length).padStart(
              2,
              "0"
            )}
          </span>

          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Presencia siguiente"
          >
            →
          </button>
        </nav>

        <nav
          className={styles.horizon}
          aria-label="Horizonte de las sesenta presencias"
        >
          {Array.from(
            { length: total },
            (_, index) => {
              const presence = presences[index];
              const ready = Boolean(presence);

              return (
                <button
                  key={index}
                  type="button"
                  disabled={!ready}
                  data-ready={ready}
                  aria-pressed={
                    ready
                      ? index === activeIndex
                      : undefined
                  }
                  aria-label={
                    ready
                      ? `Presencia ${String(
                          index + 1
                        ).padStart(2, "0")}: ${
                          presence?.name
                        }`
                      : `Presencia ${String(
                          index + 1
                        ).padStart(2, "0")}, por llegar`
                  }
                  onClick={() => {
                    if (ready) {
                      setActiveIndex(index);
                    }
                  }}
                  onMouseEnter={() => {
                    if (ready) {
                      setActiveIndex(index);
                    }
                  }}
                />
              );
            }
          )}
        </nav>

        <p className={styles.horizonCaption}>
          {String(presences.length).padStart(
            2,
            "0"
          )}{" "}
          voces presentes ·{" "}
          {String(
            total - presences.length
          ).padStart(2, "0")}{" "}
          por llegar
        </p>
      </section>
    </main>
  );
}
