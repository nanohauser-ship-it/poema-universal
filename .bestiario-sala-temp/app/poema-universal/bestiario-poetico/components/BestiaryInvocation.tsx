"use client";

import { useMemo, useState } from "react";
import { guardians, invokeGuardian, type Guardian } from "@/lib/bestiario-poetico/guardians";
import { InvocationScene } from "./InvocationScene";
import styles from "./invocation.module.css";

type Stage = "waiting" | "listening" | "revealed";

export function BestiaryInvocation() {
  const [title, setTitle] = useState("");
  const [poem, setPoem] = useState("");
  const [stage, setStage] = useState<Stage>("waiting");
  const [guardian, setGuardian] = useState<Guardian>(guardians[0]);

  const canInvoke = poem.trim().length >= 20 && stage !== "listening";

  const ritualText = useMemo(() => {
    if (stage === "listening") return "Algo está escuchando detrás de tus palabras…";
    if (stage === "revealed") return "Una presencia ha reconocido su llamada.";
    return "La cámara permanece en silencio.";
  }, [stage]);

  async function invoke() {
    if (!canInvoke) return;
    setStage("listening");
    await new Promise((resolve) => window.setTimeout(resolve, 1700));
    setGuardian(invokeGuardian(`${title}\n${poem}`));
    setStage("revealed");
    window.requestAnimationFrame(() => {
      document.getElementById("guardian-reveal")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function reset() {
    setStage("waiting");
    setPoem("");
    setTitle("");
    setGuardian(guardians[0]);
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Poema Universal · Cámara de invocación</p>
          <h1>Bestiario Poético</h1>
          <p className={styles.lead}>
            Todo poema guarda un animal en su interior. Entrégale tus palabras a la cámara y descubre la criatura que ha venido a proteger aquello que tu alma no pudo decir de otra forma.
          </p>
          <button type="button" className={styles.heroButton} onClick={() => document.getElementById("altar")?.scrollIntoView({ behavior: "smooth", block: "center" })}>
            Invocar a mi guardián
          </button>
        </div>

        <div className={styles.heroScene}>
          <InvocationScene guardian={guardian} stage={stage} />
          <div className={styles.sceneVeil} />
          <div className={styles.sceneCaption}><span>{ritualText}</span></div>
        </div>
      </section>

      <section id="altar" className={styles.altarSection}>
        <div className={styles.altarIntro}>
          <p className={styles.eyebrow}>El altar de las palabras</p>
          <h2>Deposita tu poema</h2>
          <p>La criatura no juzgará tu escrito ni sustituirá tu voz. Reconocerá su herida, su deseo y la fuerza que todavía lo mantiene vivo.</p>
        </div>

        <div className={styles.altarGrid}>
          <div className={styles.formPanel}>
            <label>
              Título del escrito
              <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Opcional" maxLength={140} />
            </label>

            <label>
              Tus palabras
              <textarea value={poem} onChange={(event) => setPoem(event.target.value)} placeholder="Deposita aquí el poema, la carta o el fragmento…" maxLength={18000} />
            </label>

            <div className={styles.formFooter}>
              <span>{poem.length.toLocaleString("es-ES")} / 18.000</span>
              <button type="button" onClick={invoke} disabled={!canInvoke}>
                {stage === "listening" ? "La cámara está escuchando…" : "Abrir la cámara de invocación"}
              </button>
            </div>

            <p className={styles.privacy}>Tu contenido es privado por defecto. Esta prueba no guarda el poema.</p>
          </div>

          <aside className={styles.lawPanel}>
            <p className={styles.eyebrow}>Ley del Bestiario</p>
            <blockquote>“La criatura no explica el poema. Permanece junto a aquello que el poema todavía no sabe nombrar.”</blockquote>
            <dl>
              <div><dt>El poema abre la puerta</dt><dd>La presencia procede de las tensiones y símbolos del escrito.</dd></div>
              <div><dt>La criatura protege</dt><dd>Custodia la memoria, la voz, la herida o el umbral revelado.</dd></div>
              <div><dt>La invocación te pertenece</dt><dd>Nada entra en el Atlas público sin permiso expreso.</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      {stage === "revealed" && (
        <section id="guardian-reveal" className={styles.revealSection}>
          <div className={styles.revealHeader}>
            <p className={styles.eyebrow}>Criatura protectora invocada</p>
            <h2>{guardian.name}</h2>
            <span>{guardian.family}</span>
          </div>

          <div className={styles.revealGrid}>
            <article><p className={styles.smallLabel}>Aquello que ha venido a proteger</p><blockquote>{guardian.protects}</blockquote></article>
            <article><p className={styles.smallLabel}>La reliquia que deja contigo</p><h3>{guardian.relic}</h3></article>
            <article className={styles.voiceCard}><p className={styles.smallLabel}>Lo que tu guardián te diría</p><blockquote>“{guardian.voice}”</blockquote></article>
          </div>

          <button type="button" className={styles.resetButton} onClick={reset}>Depositar otro poema</button>
        </section>
      )}

      <section className={styles.founders}>
        <p className={styles.eyebrow}>Guardianes fundadores</p>
        <div className={styles.founderGrid}>
          {guardians.map((item) => (
            <article key={item.slug}>
              <span>{item.family}</span>
              <h3>{item.name}</h3>
              <p>{item.protects}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
