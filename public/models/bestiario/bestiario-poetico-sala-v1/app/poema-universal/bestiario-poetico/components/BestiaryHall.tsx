"use client";

import { useMemo, useState } from "react";

import {
  chooseGuardian,
  guardians,
  type Guardian
} from "@/lib/bestiario-poetico/guardians";

import { BestiaryScene } from "./BestiaryScene";
import styles from "./bestiary-hall.module.css";

type RitualStage = "idle" | "writing" | "reading" | "revealed";

export function BestiaryHall() {
  const [stage, setStage] = useState<RitualStage>("idle");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [poem, setPoem] = useState("");
  const [guardian, setGuardian] = useState<Guardian>(guardians[0]);

  const canInvoke = poem.trim().length >= 20 && stage !== "reading";

  const status = useMemo(() => {
    if (stage === "reading") {
      return "La cámara está reconociendo la forma secreta de tus palabras.";
    }

    if (stage === "revealed") {
      return `${guardian.name} ha reconocido tu poema.`;
    }

    return "Los guardianes permanecen en silencio.";
  }, [guardian.name, stage]);

  async function invokeGuardian() {
    if (!canInvoke) return;

    setStage("reading");

    await new Promise((resolve) => window.setTimeout(resolve, 2600));

    const chosen = chooseGuardian(`${title}\n${poem}`);
    setGuardian(chosen);
    setStage("revealed");
  }

  function resetRitual() {
    setTitle("");
    setAuthor("");
    setPoem("");
    setGuardian(guardians[0]);
    setStage("idle");
  }

  return (
    <main className={styles.page}>
      <BestiaryScene
        guardians={guardians}
        selectedGuardian={guardian}
        stage={stage}
      />

      <div className={styles.vignette} />

      <header className={styles.topbar}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>✦</span>
          <div>
            <strong>Bestiario Poético</strong>
            <small>Poema Universal</small>
          </div>
        </div>

        <nav aria-label="Navegación del Bestiario">
          <a href="#bestuario">El Bestiario</a>
          <a href="#guardianes">Guardianes</a>
          <button type="button" onClick={() => setStage("writing")}>
            Invocar
          </button>
          <a href="/poema-universal/bestiario-poetico/atlas">Archivo</a>
        </nav>
      </header>

      <aside id="guardianes" className={styles.guardianRail}>
        <p>Los guardianes</p>
        <span>{guardians.length} / 100</span>

        <div className={styles.guardianList}>
          {guardians.map((item, index) => (
            <button
              key={item.slug}
              type="button"
              className={
                guardian.slug === item.slug && stage === "revealed"
                  ? styles.activeGuardian
                  : ""
              }
              onClick={() => {
                setGuardian(item);
                setStage("revealed");
              }}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.shortName}</strong>
            </button>
          ))}
        </div>

        <a href="/poema-universal/bestiario-poetico/atlas">
          Ver atlas
        </a>
      </aside>

      <section id="bestuario" className={styles.hero}>
        <p className={styles.eyebrow}>
          Poema Universal · Cámara de invocación
        </p>

        <h1>
          Bestiario
          <br />
          Poético
        </h1>

        <p className={styles.lead}>
          Cada poema esconde una criatura. Entrégale tus palabras a la
          cámara y descubre quién ha venido a reconocerlas.
        </p>

        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => setStage("writing")}
        >
          Invocar a mi guardián
        </button>

        <div className={styles.ritualState}>
          <span />
          <p>{status}</p>
        </div>
      </section>

      <aside className={styles.manifesto}>
        <p className={styles.eyebrow}>¿Qué es el Bestiario Poético?</p>

        <p>
          Cada poema es un territorio vivo. Aquí, las palabras revelan la
          criatura simbólica que las habita.
        </p>

        <strong>
          No elegimos nosotros.
          <br />
          La criatura te reconoce a ti.
        </strong>

        <span>— ✦ —</span>

        <small>
          No es un juego.
          <br />
          Es un encuentro.
        </small>
      </aside>

      <footer className={styles.footer}>
        <p>«Las criaturas no son inventadas. Son reconocidas.»</p>
        <span>Poema Universal · Edición fundacional</span>
      </footer>

      {(stage === "writing" || stage === "reading") && (
        <section
          className={styles.ritualOverlay}
          aria-modal="true"
          role="dialog"
          aria-labelledby="ritual-title"
        >
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => stage !== "reading" && setStage("idle")}
            aria-label="Cerrar"
          >
            ×
          </button>

          <div className={styles.ritualPanel}>
            <p className={styles.eyebrow}>La mesa del poema</p>
            <h2 id="ritual-title">Entrega tus palabras</h2>

            <p className={styles.ritualIntro}>
              El texto no será juzgado. La cámara buscará su herida, su
              deseo, su memoria y su forma de resistencia.
            </p>

            <label>
              Título
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Opcional"
                disabled={stage === "reading"}
              />
            </label>

            <label>
              Autor
              <input
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                placeholder="Opcional"
                disabled={stage === "reading"}
              />
            </label>

            <label>
              Poema
              <textarea
                value={poem}
                onChange={(event) => setPoem(event.target.value)}
                placeholder="Deposita aquí el poema…"
                maxLength={18000}
                disabled={stage === "reading"}
              />
            </label>

            <div className={styles.ritualActions}>
              <span>{poem.length.toLocaleString("es-ES")} / 18.000</span>

              <button
                type="button"
                onClick={invokeGuardian}
                disabled={!canInvoke}
              >
                {stage === "reading"
                  ? "La cámara está leyendo…"
                  : "Entregar el poema"}
              </button>
            </div>

            {stage === "reading" && (
              <div className={styles.readingPulse}>
                <span />
                <p>
                  Las velas descienden. Los símbolos del suelo están
                  despertando.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {stage === "revealed" && (
        <section className={styles.revelation}>
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => setStage("idle")}
            aria-label="Cerrar revelación"
          >
            ×
          </button>

          <div className={styles.revelationHeader}>
            <p className={styles.eyebrow}>Tu guardián</p>
            <h2>{guardian.name}</h2>
            <span>{guardian.family}</span>
          </div>

          <div className={styles.revelationGrid}>
            <article>
              <p className={styles.label}>Lo que ha reconocido</p>
              <blockquote>{guardian.recognized}</blockquote>
            </article>

            <article>
              <p className={styles.label}>Lo que protege</p>
              <blockquote>{guardian.protects}</blockquote>
            </article>

            <article>
              <p className={styles.label}>Su gesto</p>
              <p>{guardian.gesture}</p>
            </article>

            <article>
              <p className={styles.label}>La reliquia</p>
              <h3>{guardian.relic}</h3>
            </article>

            <article className={styles.voice}>
              <p className={styles.label}>Su voz</p>
              <blockquote>“{guardian.voice}”</blockquote>
            </article>
          </div>

          <div className={styles.revelationActions}>
            <button type="button">Guardar la revelación</button>
            <button type="button">Descargar la lámina</button>
            <button type="button" onClick={resetRitual}>
              Entregar otro poema
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
