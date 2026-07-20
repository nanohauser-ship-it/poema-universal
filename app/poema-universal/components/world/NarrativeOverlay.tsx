"use client";

import { useEffect, useState } from "react";
import styles from "./NarrativeOverlay.module.css";

const CYCLE_DURATION = 32;

type NarrativePhase = {
  start: number;
  end: number;
  number: string;
  title: string;
  text: string;
  verse: string;
};

const PHASES: NarrativePhase[] = [
  {
    start: 0,
    end: 0.2,
    number: "I",
    title: "Antes de la primera palabra",
    text:
      "La tierra estaba entera y, sin embargo, todavía no sabía convertirse en mundo. Sesenta voces llegaron sin estandarte. Cada una protegía algo que el olvido no había conseguido destruir.",
    verse:
      "Lo que no se nombra comienza lentamente a desaparecer.",
  },
  {
    start: 0.2,
    end: 0.46,
    number: "II",
    title: "Las voces entregan su peso",
    text:
      "Una poeta abre las manos. Otra acerca el agua. Alguien sostiene una cuerda para que otro pueda cruzar. Las palabras abandonan el cuerpo y se vuelven piedra, lámpara, puente y semilla.",
    verse:
      "Toda palabra verdadera modifica el lugar donde es pronunciada.",
  },
  {
    start: 0.46,
    end: 0.72,
    number: "III",
    title: "El Libro aprende a respirar",
    text:
      "Las páginas dejan de pertenecer a quienes las escribieron. Al reunirse, forman una memoria que ninguna voz podría sostener sola. El Libro respira por primera vez y el mundo escucha su latido.",
    verse:
      "Lo escrito por uno puede convertirse en refugio para todos.",
  },
  {
    start: 0.72,
    end: 0.9,
    number: "IV",
    title: "La obra asciende",
    text:
      "El Libro no sube porque sea ligero. Asciende porque sesenta vidas sostienen su peso. Los poetas abandonan sus tareas y abren, juntos, el último camino hacia el Árbol Blanco.",
    verse:
      "Nadie alcanza la cima llevando únicamente su propia voz.",
  },
  {
    start: 0.9,
    end: 1,
    number: "V",
    title: "El Árbol recuerda",
    text:
      "Cuando la última voz alcanza las raíces, el Árbol reconoce aquello que el mundo había olvidado. Sus ramas se llenan de sesenta flores y la tierra incompleta aprende, finalmente, a florecer.",
    verse:
      "Ninguna voz salva el mundo por sí sola. Juntas le enseñan a vivir.",
  },
];

export default function NarrativeOverlay() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startedAt = performance.now();

    const interval = window.setInterval(() => {
      const elapsed = (performance.now() - startedAt) / 1000;
      setProgress((elapsed % CYCLE_DURATION) / CYCLE_DURATION);
    }, 100);

    return () => window.clearInterval(interval);
  }, []);

  const phase =
    PHASES.find(
      (candidate) =>
        progress >= candidate.start && progress < candidate.end
    ) ?? PHASES[PHASES.length - 1];

  return (
    <section
      className={styles.overlay}
      aria-live="polite"
      aria-label="Relato de la construcción del poema"
    >
      <div key={phase.number} className={styles.phaseContent}>
        <div className={styles.heading}>
          <span className={styles.number}>{phase.number}</span>

          <div>
            <p className={styles.label}>EL CICLO DEL POEMA</p>
            <h2>{phase.title}</h2>
          </div>
        </div>

        <p className={styles.text}>{phase.text}</p>

        <blockquote className={styles.verse}>
          {phase.verse}
        </blockquote>
      </div>

      <div className={styles.progressTrack} aria-hidden="true">
        <span style={{ width: `${progress * 100}%` }} />
      </div>

      <div className={styles.phases} aria-hidden="true">
        {PHASES.map((item) => (
          <span
            key={item.number}
            className={
              item.number === phase.number
                ? styles.phaseActive
                : styles.phase
            }
          />
        ))}
      </div>

      <p className={styles.thesis}>
        Sesenta voces construyen aquello que ninguna podría levantar sola.
      </p>
    </section>
  );
}
