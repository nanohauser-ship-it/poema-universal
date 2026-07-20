"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./BorgesEntrance.module.css";

const readings = [
  ["Árbol blanco", "Sombra vulnerable", "Hogar", "Atravesar acompañado"],
  ["Ventana azul", "Niño exiliado", "Regreso", "Mirar sin poseer"],
  ["Perro de ceniza", "Guardián del umbral", "Nombre", "Recordar sin retener"],
];

export default function BorgesEntrance() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [entering, setEntering] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(
      () => setIndex((value) => (value + 1) % readings.length),
      5200
    );
    return () => window.clearInterval(timer);
  }, []);

  function move(event: React.PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: (event.clientX - rect.left) / rect.width - 0.5,
      y: (event.clientY - rect.top) / rect.height - 0.5,
    });
  }

  function enter() {
    if (entering) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push("/poema-universal/ojos-de-borges");
      return;
    }
    setEntering(true);
    window.setTimeout(
      () => router.push("/poema-universal/ojos-de-borges"),
      900
    );
  }

  const [symbol, archetype, absence, gesture] = readings[index];

  return (
    <section
      className={`${styles.section} ${entering ? styles.entering : ""}`}
      onPointerMove={move}
      onPointerLeave={() => setPointer({ x: 0, y: 0 })}
      aria-labelledby="borges-title"
    >
      <div className={styles.atmosphere} />
      <div
        className={styles.emblem}
        style={{
          "--px": pointer.x,
          "--py": pointer.y,
        } as React.CSSProperties}
        aria-hidden="true"
      >
        <div className={styles.orbit} />
        <div className={`${styles.eye} ${styles.leftEye}`}>
          <div className={styles.labyrinth}><i /><i /><i /></div>
          <span />
        </div>
        <div className={`${styles.eye} ${styles.rightEye}`}>
          <div className={styles.reflection} />
          <span />
        </div>
        <div className={styles.axis}><i /><strong>✦</strong><i /></div>
      </div>

      <div className={styles.content}>
        <p>Herramienta pública · Ingeniería simbólica</p>
        <h2 id="borges-title">Los ojos de Borges</h2>
        <blockquote>
          Toda obra contiene una imagen que gobierna a las demás.
        </blockquote>
        <div className={styles.bridge}>
          <span>La Matriz revela cómo está construida la obra.</span>
          <i />
          <strong>Los ojos revelan qué intenta convertirse en ella.</strong>
        </div>
        <button type="button" onClick={enter} disabled={entering}>
          <b>✦</b>
          {entering ? "Abriendo el umbral" : "Atravesar la obra"}
        </button>
      </div>

      <div className={styles.demo}>
        <p>Lectura simbólica viva</p>
        <div key={index} className={styles.demoGrid}>
          <article><span>Símbolo rector</span><strong>{symbol}</strong></article>
          <article><span>Arquetipo dominante</span><strong>{archetype}</strong></article>
          <article><span>Símbolo ausente</span><strong>{absence}</strong></article>
          <article><span>Gesto de individuación</span><strong>{gesture}</strong></article>
        </div>
        <div className={styles.dots}>
          {readings.map((_, dot) => (
            <button
              key={dot}
              type="button"
              aria-label={`Mostrar ejemplo ${dot + 1}`}
              className={dot === index ? styles.active : ""}
              onClick={() => setIndex(dot)}
            />
          ))}
        </div>
      </div>

      <footer>
        <span>Símbolo rector</span>
        <span>Sombra</span>
        <span>Individuación</span>
        <span>Oráculo</span>
      </footer>

      <div className={styles.veil} aria-hidden="true" />
    </section>
  );
}
