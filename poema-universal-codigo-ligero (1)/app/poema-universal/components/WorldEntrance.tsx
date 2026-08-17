"use client";

import Link from "next/link";
import styles from "./WorldEntrance.module.css";

export default function WorldEntrance() {
  return (
    <section
      className={styles.section}
      aria-labelledby="world-entrance-title"
    >
      <div className={styles.atmosphere} />

      <div className={styles.inner}>
        <div className={styles.number}>
          60
        </div>

        <div className={styles.content}>
          <p className={styles.eyebrow}>
            La obra viva
          </p>

          <h2
            id="world-entrance-title"
            className={styles.title}
          >
            El mundo de las sesenta voces
          </h2>

          <p className={styles.description}>
            Una tierra incompleta recibe sesenta
            poemas. Cada voz entrega una parte de
            sí al Libro Fundacional, hasta que el
            Árbol Blanco recuerda cómo florecer.
          </p>

          <Link
            href="/poema-universal/mundo"
            className={styles.link}
          >
            <span>Entrar en el Mundo Vivo</span>
            <span
              className={styles.arrow}
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        </div>

        <div
          className={styles.symbol}
          aria-hidden="true"
        >
          <span className={styles.trunk} />

          {Array.from({ length: 7 }).map(
            (_, index) => (
              <span
                key={index}
                className={styles.branch}
                style={{
                  transform: `rotate(${
                    -72 + index * 24
                  }deg)`,
                }}
              />
            )
          )}

          <span className={styles.light} />
        </div>
      </div>

      <div className={styles.footer}>
        <span>Libro de las Sesenta Voces</span>
        <span>Edición fundacional 2026</span>
      </div>
    </section>
  );
}
