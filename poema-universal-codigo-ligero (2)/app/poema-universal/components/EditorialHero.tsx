"use client";

import Link from "next/link";
import styles from "./EditorialHero.module.css";

type CountdownTime = {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
};

type EditorialHeroProps = {
  time: CountdownTime;
  legacyItems?: unknown;
};

const pad = (value: number) =>
  String(Math.max(0, value)).padStart(2, "0");

export default function EditorialHero({
  time,
  legacyItems,
}: EditorialHeroProps) {
  void legacyItems;

  const countdown = [
    { value: String(time.dias), label: "Días" },
    { value: pad(time.horas), label: "Horas" },
    { value: pad(time.minutos), label: "Minutos" },
    { value: pad(time.segundos), label: "Segundos" },
  ];

  return (
    <section
      aria-labelledby="poema-universal-title"
      className={styles.hero}
    >
      <div aria-hidden="true" className={styles.paper} />
      <div aria-hidden="true" className={styles.axis} />

      <div
        aria-hidden="true"
        className={styles.constellation}
      >
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className={styles.frame}>
        <div className={styles.meta}>
          <p>Institución literaria internacional</p>
          <p>Presentación · 01.01.2027</p>
        </div>

        <div className={styles.stage}>
          <p className={styles.kicker}>
            Edición fundacional
          </p>

          <div className={styles.titleWrap}>
            <span
              aria-hidden="true"
              className={styles.orbit}
            />

            <h1
              id="poema-universal-title"
              className={styles.title}
            >
              <span className={styles.poema}>
                Poema
              </span>

              <span className={styles.universal}>
                Universal
              </span>
            </h1>
          </div>

          <p className={styles.lead}>
            Una única obra escrita durante un año
            <span>
              por sesenta voces del mundo.
            </span>
          </p>

          <p className={styles.mantra}>
            Sesenta voces · un solo año · una misma
            dignidad
          </p>

          <Link
            href="#manifiesto"
            className={styles.manifestoLink}
          >
            Leer la declaración fundacional
            <span aria-hidden="true">↓</span>
          </Link>
        </div>

        <div className={styles.countdownHeader}>
          <p>Tiempo restante</p>
          <p>Apertura del primer libro</p>
        </div>

        <div
          className={styles.countdown}
          aria-label="Cuenta atrás para la presentación"
        >
          {countdown.map((item) => (
            <div
              key={item.label}
              className={styles.countdownItem}
            >
              <span className={styles.countdownValue}>
                {item.value}
              </span>

              <span className={styles.countdownLabel}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className={styles.footerLine}>
          <span>Poema Universal · 2026</span>
          <span>60 voces · un solo libro</span>
        </div>
      </div>
    </section>
  );
}
