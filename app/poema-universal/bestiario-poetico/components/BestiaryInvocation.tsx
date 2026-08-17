"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  guardians,
  invokeGuardian,
  type Guardian
} from "@/lib/bestiario-poetico/guardians";
import { InvocationScene } from "./InvocationScene";
import styles from "./invocation.module.css";

type Stage = "waiting" | "listening" | "revealed";

const ritualBeats = [
  "La sala reconoce el peso de tus palabras.",
  "Algo antiguo se mueve detrás de la piedra.",
  "La criatura recuerda tu nombre."
];

export function BestiaryInvocation() {
  const [entered, setEntered] = useState(false);
  const [title, setTitle] = useState("");
  const [poem, setPoem] = useState("");
  const [stage, setStage] = useState<Stage>("waiting");
  const [ritualBeat, setRitualBeat] = useState(0);
  const [guardian, setGuardian] = useState<Guardian>(guardians[0]);
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [saved, setSaved] = useState(false);
  const ritualTimers = useRef<number[]>([]);

  const canInvoke = poem.trim().length >= 20 && stage !== "listening";

  const ritualText = useMemo(() => {
    if (stage === "listening") return ritualBeats[ritualBeat];
    if (stage === "revealed") return "Una presencia ha reconocido su llamada.";
    return "La cámara permanece en silencio.";
  }, [ritualBeat, stage]);

  useEffect(() => {
    return () => {
      ritualTimers.current.forEach(window.clearTimeout);
      window.speechSynthesis?.cancel();
    };
  }, []);

  function invoke() {
    if (!canInvoke) return;

    ritualTimers.current.forEach(window.clearTimeout);
    window.speechSynthesis?.cancel();
    setVoicePlaying(false);
    setSaved(false);
    setRitualBeat(0);
    setStage("listening");

    ritualTimers.current = [
      window.setTimeout(() => setRitualBeat(1), 1100),
      window.setTimeout(() => setRitualBeat(2), 2300),
      window.setTimeout(() => {
        setGuardian(invokeGuardian(`${title}\n${poem}`));
        setStage("revealed");
        window.requestAnimationFrame(() => {
          document
            .getElementById("guardian-reveal")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }, 3600)
    ];
  }

  function speak() {
    if (!("speechSynthesis" in window)) return;

    if (voicePlaying) {
      window.speechSynthesis.cancel();
      setVoicePlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(guardian.voice);
    const spanishVoice = window.speechSynthesis
      .getVoices()
      .find((voice) => voice.lang.toLowerCase().startsWith("es"));

    utterance.lang = "es-ES";
    utterance.rate = 0.78;
    utterance.pitch = 0.82;
    if (spanishVoice) utterance.voice = spanishVoice;
    utterance.onend = () => setVoicePlaying(false);
    utterance.onerror = () => setVoicePlaying(false);

    setVoicePlaying(true);
    window.speechSynthesis.speak(utterance);
  }

  function preserveRelic() {
    const privateTrace = {
      creature: guardian.name,
      family: guardian.family,
      relic: guardian.relic,
      voice: guardian.voice,
      createdAt: new Date().toISOString()
    };

    window.localStorage.setItem(
      "poema-universal:bestiario:ultima-huella",
      JSON.stringify(privateTrace)
    );
    setSaved(true);
  }

  function reset() {
    ritualTimers.current.forEach(window.clearTimeout);
    window.speechSynthesis?.cancel();
    setStage("waiting");
    setPoem("");
    setTitle("");
    setRitualBeat(0);
    setGuardian(guardians[0]);
    setVoicePlaying(false);
    setSaved(false);
    document.getElementById("altar")?.scrollIntoView({ behavior: "smooth" });
  }

  function crossThreshold() {
    setEntered(true);
    window.setTimeout(() => {
      document
        .getElementById("altar")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 1050);
  }

  return (
    <main
      className={`${styles.page} ${styles[`stage_${stage}`]} ${
        entered ? styles.entered : styles.atThreshold
      }`}
    >
      <nav className={styles.navigation} aria-label="Navegación del Bestiario">
        <Link href="/poema-universal">Poema Universal</Link>
        <div>
          <a href="#altar">Invocación</a>
          <Link href="/poema-universal/bestiario-poetico/atlas">Atlas</Link>
        </div>
      </nav>

      <section className={styles.hero} aria-labelledby="bestiario-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Poema Universal · Sala I</p>
          <h1 id="bestiario-title">Bestiario Poético</h1>
          <blockquote className={styles.threshold}>
            “Toda palabra deja un rastro.
            <br />
            Algunas dejan una criatura.”
          </blockquote>
          <p className={styles.thresholdNote}>
            Hay una presencia al otro lado. No se mostrará hasta que decidas
            entrar.
          </p>
          <button
            type="button"
            className={styles.heroButton}
            onClick={crossThreshold}
          >
            Abrir la sala <span aria-hidden="true">＋</span>
          </button>
        </div>

        <div className={styles.heroScene}>
          <InvocationScene guardian={guardian} stage={stage} />
          <div className={styles.sceneVeil} />
          <div className={styles.thresholdDoor} aria-hidden="true">
            <i />
            <i />
          </div>
          <p className={styles.doorInscription}>I · UMBRAL</p>
        </div>

        {stage === "listening" && (
          <div className={styles.ritualVeil} role="status" aria-live="polite">
            <span className={styles.ritualMark} aria-hidden="true">✦</span>
            <p>{ritualText}</p>
            <div className={styles.ritualLine}>
              <i data-lit={ritualBeat >= 0} />
              <i data-lit={ritualBeat >= 1} />
              <i data-lit={ritualBeat >= 2} />
            </div>
          </div>
        )}
      </section>

      <section id="altar" className={styles.altarSection}>
        <div className={styles.roomNumber} aria-hidden="true">II</div>
        <div className={styles.altarIntro}>
          <p className={styles.eyebrow}>La cámara ya está abierta</p>
          <h2>La mesa de<br />invocación</h2>
          <p>
            La sala no analiza. Escucha la materia del escrito, la herida que lo
            atraviesa y la fuerza que aún lo mantiene en pie.
          </p>
        </div>

        <div className={styles.altarGrid}>
          <div className={styles.formPanel}>
            <div className={styles.deskHeader}>
              <span>Manuscrito privado</span>
              <i aria-hidden="true">✦</i>
              <span>Archivo sin registrar</span>
            </div>
            <label>
              <span>Título del escrito</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Si lo tiene"
                maxLength={140}
              />
            </label>

            <label>
              <span>El escrito</span>
              <textarea
                value={poem}
                onChange={(event) => setPoem(event.target.value)}
                placeholder="Escribe o deposita aquí el poema, la carta, el fragmento…"
                maxLength={18000}
              />
            </label>

            <div className={styles.formFooter}>
              <span>{poem.length.toLocaleString("es-ES")} signos</span>
              <button type="button" onClick={invoke} disabled={!canInvoke}>
                Iniciar el ritual
              </button>
            </div>

            <p className={styles.privacy}>
              <span aria-hidden="true">◉</span> Privado por defecto · El poema
              no se publica ni entra en el Atlas.
            </p>
          </div>

          <aside className={styles.lawPanel}>
            <p className={styles.eyebrow}>Ley del Bestiario</p>
            <blockquote>
              “La criatura no explica el poema. Permanece junto a aquello que
              el poema todavía no sabe nombrar.”
            </blockquote>
            <dl>
              <div>
                <dt>I · El poema abre la puerta</dt>
                <dd>La presencia nace de las tensiones y símbolos del escrito.</dd>
              </div>
              <div>
                <dt>II · La criatura protege</dt>
                <dd>Custodia la memoria, la voz, la herida o el umbral.</dd>
              </div>
              <div>
                <dt>III · La huella te pertenece</dt>
                <dd>Nada se comparte sin una decisión expresa.</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      {stage === "revealed" && (
        <section id="guardian-reveal" className={styles.revealSection}>
          <div className={styles.roomNumber} aria-hidden="true">III</div>
          <header className={styles.revealHeader}>
            <p className={styles.eyebrow}>La criatura que esperaba tu escrito</p>
            <h2>{guardian.name}</h2>
            <span>{guardian.family}</span>
          </header>

          <div className={styles.revealMuseum}>
            <div className={styles.revealSculpture}>
              <InvocationScene guardian={guardian} stage="revealed" />
              <p>Arrastra suavemente para contemplar la escultura</p>
            </div>

            <div className={styles.revealText}>
              <article>
                <p className={styles.smallLabel}>Aquello que custodia</p>
                <blockquote>{guardian.protects}</blockquote>
              </article>

              <article className={styles.voiceCard}>
                <p className={styles.smallLabel}>La voz</p>
                <blockquote>“{guardian.voice}”</blockquote>
                <button type="button" onClick={speak}>
                  <span aria-hidden="true">{voicePlaying ? "Ⅱ" : "▶"}</span>
                  {voicePlaying ? "Detener la voz" : "Escuchar a la criatura"}
                </button>
              </article>
            </div>
          </div>

          <div className={styles.relicGallery}>
            <div className={styles.relicObject} aria-hidden="true">
              <i />
              <span>✦</span>
            </div>
            <div className={styles.relicCopy}>
              <p className={styles.eyebrow}>La reliquia</p>
              <h3>{guardian.relic}</h3>
              <p>
                La criatura la deja en tu atlas privado: una huella en este
                dispositivo, nunca una publicación automática.
              </p>
              <button type="button" onClick={preserveRelic}>
                {saved ? "Reliquia conservada en privado" : "Conservar esta huella"}
              </button>
            </div>
          </div>

          <button type="button" className={styles.resetButton} onClick={reset}>
            Depositar otro escrito
          </button>
        </section>
      )}

      <section className={styles.museum}>
        <div className={styles.museumHeader}>
          <div>
            <p className={styles.eyebrow}>Sala IV · Archivo vivo</p>
            <h2>El Atlas no es una galería.<br />Es un museo de presencias.</h2>
          </div>
          <Link href="/poema-universal/bestiario-poetico/atlas">
            Entrar en el Atlas <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className={styles.founderGrid}>
          {guardians.map((item, index) => (
            <article key={item.slug}>
              <span>Presencia {String(index + 1).padStart(2, "0")}</span>
              <div className={styles.founderSeal} aria-hidden="true">✦</div>
              <h3>{item.name}</h3>
              <p>{item.family}</p>
              <small>{item.protects}</small>
            </article>
          ))}
        </div>

        <p className={styles.museumNote}>
          Cada criatura compartida amplía el museo solo con el permiso de quien
          la invocó. Las demás permanecen como memoria privada.
        </p>
      </section>
    </main>
  );
}
