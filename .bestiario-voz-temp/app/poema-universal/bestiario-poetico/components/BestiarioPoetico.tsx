"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { demoCreatures } from "@/lib/bestiario-poetico/demo";
import type { CreatureReveal } from "@/lib/bestiario-poetico/types";

import styles from "./bestiario-poetico.module.css";

const ModelStage = dynamic(
  () => import("./ModelStage").then((module) => module.ModelStage),
  { ssr: false, loading: () => <div className={styles.stageLoading}>Abriendo la cámara 3D…</div> }
);

type ViewMode = "plate" | "3d" | "brief";

export function BestiarioPoetico() {
  const [title, setTitle] = useState("");
  const [poem, setPoem] = useState("");
  const [authorContext, setAuthorContext] = useState("");
  const [reveal, setReveal] = useState<CreatureReveal | null>(null);
  const [view, setView] = useState<ViewMode>("plate");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [detectedModelUrl, setDetectedModelUrl] = useState<string | undefined>();
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const count = poem.length;
  const canSubmit = poem.trim().length >= 20 && !loading;

  useEffect(() => {
    let cancelled = false;
    setDetectedModelUrl(undefined);

    if (!reveal) return;
    if (reveal.modelUrl) {
      setDetectedModelUrl(reveal.modelUrl);
      return;
    }

    const candidate = `/models/bestiario/${reveal.slug}.glb`;
    fetch(candidate, { method: "HEAD", cache: "no-store" })
      .then((response) => {
        const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
        const isGlb =
          contentType.includes("model/gltf-binary") ||
          contentType.includes("application/octet-stream");

        if (!cancelled && response.ok && isGlb) {
          setDetectedModelUrl(candidate);
        }
      })
      .catch(() => {
        if (!cancelled) setDetectedModelUrl(undefined);
      });

    return () => {
      cancelled = true;
    };
  }, [reveal]);

  useEffect(() => {
    return () => {
      if (voiceUrl) URL.revokeObjectURL(voiceUrl);
      audioRef.current?.pause();
    };
  }, [voiceUrl]);

  async function playCreatureVoice() {
    if (!reveal || voiceLoading) return;
    setVoiceError("");

    if (audioRef.current && voiceUrl) {
      if (voicePlaying) {
        audioRef.current.pause();
        setVoicePlaying(false);
      } else {
        await audioRef.current.play();
        setVoicePlaying(true);
      }
      return;
    }

    setVoiceLoading(true);
    try {
      const response = await fetch("/api/bestiario-poetico/voz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phrase: reveal.voice.phrase,
          tone: reveal.voice.tone,
          creatureName: reveal.name
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "No se pudo crear la voz.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      setVoiceUrl(url);
      audio.addEventListener("ended", () => setVoicePlaying(false), { once: false });
      audio.addEventListener("pause", () => setVoicePlaying(false), { once: false });
      await audio.play();
      setVoicePlaying(true);
    } catch (cause) {
      setVoiceError(cause instanceof Error ? cause.message : "No fue posible escuchar la voz.");
    } finally {
      setVoiceLoading(false);
    }
  }

  async function revealCreature() {
    if (!canSubmit) return;
    setLoading(true);
    setError("");
    setVoiceError("");
    audioRef.current?.pause();
    audioRef.current = null;
    if (voiceUrl) URL.revokeObjectURL(voiceUrl);
    setVoiceUrl(null);
    setVoicePlaying(false);

    try {
      const response = await fetch("/api/bestiario-poetico/revelar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ poem, title, authorContext })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo revelar la criatura.");
      setReveal(data.reveal);
      setView("plate");
      requestAnimationFrame(() => {
        document.getElementById("revelacion")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Ha ocurrido un error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  function downloadBrief() {
    if (!reveal) return;
    const content = JSON.stringify(reveal, null, 2);
    const url = URL.createObjectURL(new Blob([content], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${reveal.slug}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Matriz Poética · Cámara de la criatura</p>
        <h1>Bestiario Poético</h1>
        <p className={styles.lead}>
          Cada poema contiene una presencia. Aquí no se ilustra el texto: se revela su criatura,
          su reliquia, su oráculo y la anatomía necesaria para existir en tres dimensiones.
        </p>
        <div className={styles.heroRule} aria-hidden="true" />
      </section>

      <section className={styles.workspace}>
        <div className={styles.formPanel}>
          <div className={styles.panelHeading}>
            <span>01</span>
            <div>
              <h2>Entregar el poema</h2>
              <p>El contenido no se guarda automáticamente.</p>
            </div>
          </div>

          <label className={styles.label}>
            Título opcional
            <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={140} />
          </label>

          <label className={styles.label}>
            Poema
            <textarea
              value={poem}
              onChange={(event) => setPoem(event.target.value)}
              maxLength={18_000}
              placeholder="Deposita aquí el poema…"
            />
          </label>

          <div className={styles.counter}>{count.toLocaleString("es-ES")} / 18.000</div>

          <label className={styles.label}>
            Contexto del autor, opcional
            <textarea
              className={styles.contextArea}
              value={authorContext}
              onChange={(event) => setAuthorContext(event.target.value)}
              maxLength={1_200}
              placeholder="Una circunstancia necesaria para leer el texto, no una explicación del poema."
            />
          </label>

          <button className={styles.revealButton} type="button" onClick={revealCreature} disabled={!canSubmit}>
            {loading ? "La criatura está tomando forma…" : "Revelar la criatura"}
          </button>
          {error && <p className={styles.error} role="alert">{error}</p>}
        </div>

        <aside className={styles.lawPanel}>
          <p className={styles.miniLabel}>Ley del Bestiario</p>
          <blockquote>“La criatura no decora el poema. Muestra aquello que el poema todavía no sabe nombrar.”</blockquote>
          <dl>
            <div><dt>Lectura</dt><dd>Herida, deseo, tensión y gesto.</dd></div>
            <div><dt>Revelación</dt><dd>Nombre, linaje, materia y hábitat.</dd></div>
            <div><dt>Consagración</dt><dd>Lámina, reliquia, oráculo y presencia 3D.</dd></div>
          </dl>
        </aside>
      </section>

      {reveal && (
        <section id="revelacion" className={styles.revealSection}>
          <div className={styles.revealHeading}>
            <div>
              <p className={styles.eyebrow}>Criatura revelada</p>
              <h2>{reveal.name}</h2>
              <p>{reveal.lineage} · {reveal.element}</p>
            </div>
            <button type="button" onClick={downloadBrief}>Descargar ficha JSON</button>
          </div>

          <nav className={styles.tabs} aria-label="Vistas de la criatura">
            <button type="button" data-active={view === "plate"} onClick={() => setView("plate")}>Lámina</button>
            <button type="button" data-active={view === "3d"} onClick={() => setView("3d")}>Presencia 3D</button>
            <button type="button" data-active={view === "brief"} onClick={() => setView("brief")}>Brief de modelado</button>
          </nav>

          {view === "plate" && (
            <article className={styles.generatedPlate}>
              <div className={styles.plateHalo} aria-hidden="true" />
              <p className={styles.plateBrand}>Bestiario Poético</p>
              <h3>{reveal.name}</h3>
              <p className={styles.symbolicCore}>{reveal.symbolicCore}</p>
              <div className={styles.creatureSigil} aria-hidden="true">✦</div>
              <dl className={styles.plateData}>
                <div><dt>Linaje</dt><dd>{reveal.lineage}</dd></div>
                <div><dt>Materia</dt><dd>{reveal.matter.join(", ")}</dd></div>
                <div><dt>Hábitat</dt><dd>{reveal.habitat}</dd></div>
                <div><dt>Gesto</dt><dd>{reveal.gesture}</dd></div>
                <div><dt>Reliquia</dt><dd>{reveal.relic}</dd></div>
              </dl>
              <blockquote>{reveal.oracle}</blockquote>

              <section className={styles.voiceChamber} aria-labelledby="voz-criatura">
                <p className={styles.voiceLabel}>Lo que la criatura te diría</p>
                <h4 id="voz-criatura">Su voz</h4>
                <p className={styles.voicePhrase}>“{reveal.voice.phrase}”</p>
                <p className={styles.voiceTone}>{reveal.voice.tone}</p>
                <button
                  type="button"
                  className={styles.voiceButton}
                  onClick={playCreatureVoice}
                  disabled={voiceLoading}
                  aria-pressed={voicePlaying}
                >
                  {voiceLoading ? "La voz está despertando…" : voicePlaying ? "Pausar su voz" : voiceUrl ? "Volver a escuchar" : "Escuchar su voz"}
                </button>
                <p className={styles.aiDisclosure}>Voz generada mediante inteligencia artificial.</p>
                {voiceError && <p className={styles.voiceError} role="alert">{voiceError}</p>}
              </section>
            </article>
          )}

          {view === "3d" && (
            <div className={styles.modelPanel}>
              <ModelStage modelUrl={detectedModelUrl} />
              <div className={styles.modelNote}>
                <p><strong>Ruta esperada:</strong> <code>/public/models/bestiario/{reveal.slug}.glb</code></p>
                <p>Mientras el archivo GLB no exista, la cámara muestra el núcleo provisional de la criatura.</p>
              </div>
            </div>
          )}

          {view === "brief" && (
            <div className={styles.briefGrid}>
              <article><span>Silueta</span><p>{reveal.modelingBrief.silhouette}</p></article>
              <article><span>Superficie</span><p>{reveal.modelingBrief.surface}</p></article>
              <article><span>Escala</span><p>{reveal.modelingBrief.scale}</p></article>
              <article><span>Rig</span><p>{reveal.modelingBrief.rigging}</p></article>
              <article><span>Reposo</span><p>{reveal.modelingBrief.idleAnimation}</p></article>
              <article><span>Aparición</span><p>{reveal.modelingBrief.revealAnimation}</p></article>
              <article className={styles.wideBrief}><span>Entorno</span><p>{reveal.modelingBrief.environment}</p></article>
              <article className={styles.wideBrief}>
                <span>Notas de malla</span>
                <ul>{reveal.modelingBrief.meshNotes.map((note) => <li key={note}>{note}</li>)}</ul>
              </article>
            </div>
          )}
        </section>
      )}

      <section className={styles.archiveSection}>
        <div className={styles.archiveHeading}>
          <p className={styles.eyebrow}>Archivo de presencias</p>
          <h2>Las primeras criaturas</h2>
        </div>
        <div className={styles.gallery}>
          {demoCreatures.map((creature) => (
            <article key={creature.slug} className={styles.demoCard}>
              <div className={styles.imageWrap}>
                <Image src={creature.image} alt={creature.name} fill sizes="(max-width: 760px) 100vw, 25vw" />
              </div>
              <div className={styles.demoText}>
                <p>{creature.lineage}</p>
                <h3>{creature.name}</h3>
                <span>{creature.relic}</span>
                <blockquote>{creature.oracle}</blockquote>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
