"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ChangeEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import OrganismoEmbryoScene from "./organismo/OrganismoEmbryoScene";
import {
  CICLOS_COMPOSICION,
  HABITATS,
  analizarPoema,
  bpmActual,
  codigoStrudel,
  despertar,
  duracionComposicionMinutos,
  evolucionarHastaHoy,
  incubar,
  injertar,
  mutarAhora,
  urlStrudel,
  type Habitat,
  type Organismo,
} from "./organismo/motor";
import styles from "./organismo-v47.module.css";

const STORAGE = "organismo-electronico-v4";

const POEMA_INICIAL = `No dejes que desaparezcamos.
Todavía queda fuego bajo la tierra.
La ciudad respira el nombre que olvidamos.
Pero el silencio vuelve con otra forma.
Y al final solo queda una luz respirando.`;

const EmbryoScene = OrganismoEmbryoScene as ComponentType<{
  organismo: Organismo;
  progresoMusical?: number;
  faseMusical?: string;
  reproduciendo?: boolean;
  biomasaVerbal?: number;
  pulsoTecla?: number;
  pulsoAbsorcion?: number;
  pulsoBorrado?: number;
  habitatEntrante?: Habitat;
  palabraEntrante?: string;
}>;

const PHASES = [
  {
    id: "incubacion",
    name: "Incubación",
    cycles: 4,
    narrative: "La respiración busca una forma.",
    layers: ["Drone uterino", "Palabra reliquia", "Respiración"],
    intensity: 15,
  },
  {
    id: "germinacion",
    name: "Germinación",
    cycles: 6,
    narrative: "Aparece un latido bajo el poema.",
    layers: ["Primer latido", "Eco espectral", "Membrana armónica"],
    intensity: 31,
  },
  {
    id: "formacion",
    name: "Formación",
    cycles: 8,
    narrative: "El lenguaje construye conexiones.",
    layers: ["Pulso roto", "Secuencia", "Partículas agudas"],
    intensity: 53,
  },
  {
    id: "cuerpo",
    name: "Cuerpo",
    cycles: 10,
    narrative: "La canción adquiere peso y presencia.",
    layers: ["Bombo", "Subgrave", "Máquina", "Percusión orgánica"],
    intensity: 79,
  },
  {
    id: "fractura",
    name: "Fractura",
    cycles: 6,
    narrative: "La forma se rompe para poder recordar.",
    layers: ["Vacío", "Cicatriz rítmica", "Restos espectrales"],
    intensity: 36,
  },
  {
    id: "expansion",
    name: "Expansión",
    cycles: 12,
    narrative: "Todos los órganos sonoros se abren.",
    layers: ["Cuerpo completo", "Apertura armónica", "Máxima energía"],
    intensity: 100,
  },
  {
    id: "memoria",
    name: "Memoria",
    cycles: 10,
    narrative: "El origen regresa transformado.",
    layers: ["Eco del origen", "Reliquia transformada", "Retirada"],
    intensity: 24,
  },
] as const;

const HABITAT_NAMES: Record<Habitat, string> = {
  deriva: "Deriva",
  pulso: "Pulso",
  fractura: "Fractura",
  espectral: "Espectral",
  maquina: "Máquina",
  memoria: "Memoria",
};

const HABITAT_GLYPHS: Record<Habitat, string> = {
  deriva: "◌",
  pulso: "⊙",
  fractura: "⌁",
  espectral: "✣",
  maquina: "⌗",
  memoria: "◉",
};

const PHASE_HABITATS: Array<Record<Habitat, number>> = [
  { deriva: 96, pulso: 4, fractura: 4, espectral: 68, maquina: 3, memoria: 50 },
  { deriva: 80, pulso: 28, fractura: 12, espectral: 62, maquina: 9, memoria: 56 },
  { deriva: 48, pulso: 52, fractura: 78, espectral: 44, maquina: 62, memoria: 34 },
  { deriva: 32, pulso: 100, fractura: 55, espectral: 28, maquina: 82, memoria: 24 },
  { deriva: 24, pulso: 16, fractura: 100, espectral: 78, maquina: 30, memoria: 42 },
  { deriva: 62, pulso: 100, fractura: 72, espectral: 68, maquina: 96, memoria: 56 },
  { deriva: 92, pulso: 12, fractura: 8, espectral: 80, maquina: 6, memoria: 100 },
];


function clamp(value: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, value));
}

function phaseIndexFromProgress(progress: number): number {
  const cycle = progress * 56;
  let accumulated = 0;

  for (let index = 0; index < PHASES.length; index += 1) {
    accumulated += PHASES[index].cycles;
    if (cycle < accumulated) return index;
  }

  return PHASES.length - 1;
}

function formatTime(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
}

function tokenizePoem(poem: string): string[] {
  return poem.match(/\n|[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+|[^\sA-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g) ?? [];
}

function isWord(token: string): boolean {
  return /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(token);
}

function normalizeWord(token: string): string {
  return token
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function semanticPower(word: string): Habitat {
  const value = normalizeWord(word);

  if (/agua|mar|rio|lluvia|aire|viento|nube|noche|niebla/.test(value)) {
    return "deriva";
  }
  if (/cuerpo|piel|sangre|corazon|latido|hambre|carne|mano|pie/.test(value)) {
    return "pulso";
  }
  if (/roto|corte|caer|herida|ruina|nunca|partir|vacio/.test(value)) {
    return "fractura";
  }
  if (/sombra|muerte|silencio|ausencia|nadie|olvido|eco|voz|alma/.test(value)) {
    return "espectral";
  }
  if (/maquina|motor|hierro|metal|codigo|ciudad|reloj|ruido/.test(value)) {
    return "maquina";
  }
  return "memoria";
}

type FloatingWord = {
  id: number;
  word: string;
  habitat: Habitat;
};

function wordsOf(text: string): string[] {
  return (
    text.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:['’-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*/g) ??
    []
  );
}

function dominantHabitat(text: string): Habitat {
  if (!text.trim()) return "memoria";
  const analysis = analizarPoema(text);
  return HABITATS.reduce((best, habitat) =>
    analysis.habitats[habitat] > analysis.habitats[best]
      ? habitat
      : best,
  "memoria" as Habitat);
}

function lastCompletedWord(text: string): string {
  const withoutDelimiter = text.replace(/[\s,.;:!?…—-]+$/u, "");
  return wordsOf(withoutDelimiter).at(-1) ?? "";
}

function verbalConsequence(habitat: Habitat): string {
  const messages: Record<Habitat, string> = {
    deriva: "La membrana se volvió más líquida.",
    pulso: "El corazón electrónico ganó densidad.",
    fractura: "Una cicatriz apareció en la métrica.",
    espectral: "La palabra dejó una sombra alrededor del cuerpo.",
    maquina: "Nació una estructura rítmica de precisión.",
    memoria: "El organismo guardó un nuevo resto del poema.",
  };
  return messages[habitat];
}

function wavePath(seed: number, strength: number): string {
  const points = Array.from({ length: 42 }, (_, index) => {
    const x = (index / 41) * 220;
    const base =
      Math.sin(index * 0.58 + seed * 0.7) * 0.58 +
      Math.sin(index * 0.17 - seed * 0.31) * 0.29 +
      Math.cos(index * 0.91 + seed) * 0.13;
    const y = 22 - base * (4 + strength * 0.12);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return `M ${points.join(" L ")}`;
}

export default function OrganismoV47() {
  const [name, setName] = useState("La luz que permanece");
  const [poem, setPoem] = useState(POEMA_INICIAL);
  const [organism, setOrganism] = useState<Organismo | null>(null);
  const [feedingText, setFeedingText] = useState("");
  const [keystrokePulse, setKeystrokePulse] = useState(0);
  const [absorptionPulse, setAbsorptionPulse] = useState(0);
  const [deletionPulse, setDeletionPulse] = useState(0);
  const [lastWord, setLastWord] = useState("");
  const [feedingHabitat, setFeedingHabitat] = useState<Habitat>("memoria");
  const [floatingWords, setFloatingWords] = useState<FloatingWord[]>([]);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [playingVisual, setPlayingVisual] = useState(false);
  const [toast, setToast] = useState("");
  const [engineOpen, setEngineOpen] = useState(true);
  const startRef = useRef(0);
  const pausedAtRef = useRef(0);
  const frameRef = useRef(0);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const previousFeedingRef = useRef("");
  const floatingWordIdRef = useRef(0);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE);

      if (stored) {
        const restored = JSON.parse(stored) as Organismo;
        const evolved = evolucionarHastaHoy(restored);
        setOrganism(evolved.organismo);
        window.localStorage.setItem(
          STORAGE,
          JSON.stringify(evolved.organismo),
        );
      }
    } catch {
      window.localStorage.removeItem(STORAGE);
    }

    setLoading(false);
  }, []);

  const preview = useMemo(() => analizarPoema(poem), [poem]);
  const code = useMemo(
    () => (organism ? codigoStrudel(organism) : ""),
    [organism],
  );
  const strudelUrl = useMemo(
    () => (code ? urlStrudel(code) : ""),
    [code],
  );
  const durationMinutes = organism
    ? duracionComposicionMinutos(organism)
    : 0;
  const durationSeconds = Math.max(1, durationMinutes * 60);
  const phaseIndex = phaseIndexFromProgress(progress);
  const phase = PHASES[phaseIndex];
  const currentCycle = Math.min(56, Math.ceil(progress * 56));
  const elapsedSeconds = progress * durationSeconds;
  const habitatActivation = PHASE_HABITATS[phaseIndex];
  const intensity = phase.intensity;
  const livingPoem = useMemo(
    () =>
      organism
        ? [organism.poema, ...organism.injertos].filter(Boolean).join("\n")
        : poem,
    [organism, poem],
  );
  const tokens = useMemo(
    () => tokenizePoem(livingPoem),
    [livingPoem],
  );
  const provisionalWords = useMemo(
    () => wordsOf(feedingText).length,
    [feedingText],
  );
  const committedWords = useMemo(
    () => wordsOf(organism?.injertos.join(" ") ?? "").length,
    [organism?.injertos],
  );
  const biomassRatio = clamp(
    1 - Math.exp(-(committedWords + provisionalWords * 0.72) / 78),
  );
  const wordTokens = useMemo(
    () => tokens.filter(isWord),
    [tokens],
  );
  const activeWordIndex = Math.min(
    Math.max(0, wordTokens.length - 1),
    Math.floor(progress * Math.max(1, wordTokens.length)),
  );

  useEffect(() => {
    if (!playingVisual) return;

    const tick = (timestamp: number) => {
      const elapsed = timestamp - startRef.current;
      const nextProgress = clamp(elapsed / (durationSeconds * 1000));
      setProgress(nextProgress);

      if (nextProgress >= 1) {
        setPlayingVisual(false);
        pausedAtRef.current = 0;
        return;
      }

      frameRef.current = window.requestAnimationFrame(tick);
    };

    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameRef.current);
    };
  }, [playingVisual, durationSeconds]);

  useEffect(() => {
    const detectIframePlay = () => {
      window.setTimeout(() => {
        if (document.activeElement === iframeRef.current && !playingVisual) {
          startEvolution();
        }
      }, 0);
    };

    window.addEventListener("blur", detectIframePlay);
    return () => window.removeEventListener("blur", detectIframePlay);
  }, [playingVisual, progress, durationSeconds]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function persist(next: Organismo) {
    setOrganism(next);
    window.localStorage.setItem(STORAGE, JSON.stringify(next));
  }

  function startEvolution() {
    const offset = progress * durationSeconds * 1000;
    startRef.current = performance.now() - offset;
    setPlayingVisual(true);
  }

  function pauseEvolution() {
    pausedAtRef.current = progress;
    setPlayingVisual(false);
  }

  function resetEvolution() {
    pausedAtRef.current = 0;
    setProgress(0);
    setPlayingVisual(false);
    notify("La canción regresó a su incubación.");
  }

  function incubate() {
    if (poem.trim().length < 12) {
      notify("El organismo necesita más materia literaria.");
      return;
    }

    const next = incubar(name, poem);
    persist(next);
    setProgress(0);
    setPlayingVisual(false);
    notify(`${next.codigo} ha nacido alrededor de «${next.reliquia}».`);
  }

  function mutate() {
    if (!organism) return;
    persist(mutarAhora(organism));
    notify("Una mutación recorrió su cuerpo sonoro.");
  }

  function absorbWord(word: string, sourceText: string) {
    if (!word) return;

    const habitat = dominantHabitat(word);
    const id = floatingWordIdRef.current + 1;
    floatingWordIdRef.current = id;

    setLastWord(word);
    setFeedingHabitat(habitat);
    setAbsorptionPulse((value) => value + 1);
    setFloatingWords((current) => [
      ...current.slice(-4),
      { id, word, habitat },
    ]);

    window.setTimeout(() => {
      setFloatingWords((current) =>
        current.filter((item) => item.id !== id),
      );
    }, 1500);

    if (sourceText.trim()) {
      setFeedingHabitat(dominantHabitat(sourceText));
    }
  }

  function handleFeedingChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const next = event.target.value.slice(0, 1200);
    const previous = previousFeedingRef.current;
    const grew = next.length > previous.length;
    const finalCharacter = next.at(-1) ?? "";
    const previousFinal = previous.at(-1) ?? "";
    const closesWord = /[\s,.;:!?…—-]/u.test(finalCharacter);
    const alreadyClosed = /[\s,.;:!?…—-]/u.test(previousFinal);

    setFeedingText(next);
    previousFeedingRef.current = next;
    setFeedingHabitat(dominantHabitat(next));

    if (grew && closesWord && !alreadyClosed) {
      absorbWord(lastCompletedWord(next), next);
    }
  }

  function handleFeedingKey(
    event: ReactKeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    setTotalKeystrokes((value) => value + 1);
    setKeystrokePulse((value) => value + 1);

    if (event.key === "Backspace" || event.key === "Delete") {
      setDeletionPulse((value) => value + 1);
    }

    if (event.key === "Enter") {
      setAbsorptionPulse((value) => value + 1);
    }
  }

  function feed() {
    const matter = feedingText.trim();
    if (!organism || !matter) return;

    const analysis = analizarPoema(matter);
    const habitat = dominantHabitat(matter);
    const wordMatter = wordsOf(matter).length;
    const base = injertar(organism, matter);
    const habitats = {} as Record<Habitat, number>;

    HABITATS.forEach((item) => {
      const blended =
        base.habitats[item] * 0.84 +
        analysis.habitats[item] * 0.16 +
        (item === habitat ? Math.min(8, wordMatter * 0.22) : 0);
      habitats[item] = Math.max(5, Math.min(100, Math.round(blended)));
    });

    const next: Organismo = {
      ...base,
      habitats,
      bpmBase: Math.round(base.bpmBase * 0.86 + analysis.bpmBase * 0.14),
      notas: [...new Set([...base.notas, ...analysis.notas])].slice(0, 7),
      energia: Math.min(100, base.energia + Math.min(7, wordMatter * 0.18)),
      complejidad: Math.min(
        100,
        base.complejidad + Math.min(9, wordMatter * 0.24),
      ),
      memoriaVital: Math.min(
        100,
        base.memoriaVital + Math.min(6, wordMatter * 0.16),
      ),
    };

    persist(next);
    setLastWord(analysis.reliquia);
    setFeedingHabitat(habitat);
    setAbsorptionPulse((value) => value + 4);
    setFeedingText("");
    previousFeedingRef.current = "";
    notify(
      `${wordMatter} palabras integradas. ${verbalConsequence(habitat)}`,
    );
  }

  function wake() {
    if (!organism) return;
    persist(despertar(organism));
    notify("El organismo ha despertado.");
  }


  function release() {
    if (!window.confirm("¿Eliminar este organismo y su memoria local?")) {
      return;
    }

    window.localStorage.removeItem(STORAGE);
    setOrganism(null);
    setProgress(0);
    setPlayingVisual(false);
    setPoem(POEMA_INICIAL);
    setName("La luz que permanece");
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      notify("Código del organismo copiado.");
    } catch {
      notify("No se pudo copiar automáticamente.");
    }
  }

  if (loading) {
    return (
      <main className={styles.loadingPage}>
        <span />
        <p>Buscando vida sonora…</p>
      </main>
    );
  }

  if (!organism) {
    return (
      <main className={styles.birthPage}>
        <div className={styles.birthGrid} />
        <header className={styles.birthHeader}>
          <div>
            <span>O/E</span>
            <div>
              <small>POEMA UNIVERSAL · LABORATORIO 02</small>
              <h1>ORGANISMO V4.7</h1>
            </div>
          </div>
          <p>Alimentación verbal</p>
        </header>

        <section className={styles.birthLayout}>
          <article className={styles.birthPanel}>
            <div className={styles.sectionTitle}>
              <span>01</span>
              <h2>Cámara de incubación</h2>
              <small>ADN FUNDACIONAL</small>
            </div>

            <label>
              <span>Nombre provisional</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={80}
              />
            </label>

            <label>
              <span>Poema</span>
              <textarea
                value={poem}
                onChange={(event) =>
                  setPoem(event.target.value.slice(0, 5000))
                }
              />
            </label>

            <blockquote>
              El poema no producirá una pista cerrada. Engendrará una forma
              electrónica capaz de crecer, romperse y recordar.
            </blockquote>

            <button type="button" onClick={incubate}>
              INCUBAR POEMA <b>ENGENDRAR PRESENCIA ↗</b>
            </button>
          </article>

          <aside className={styles.previewPanel}>
            <div className={styles.sectionTitle}>
              <span>02</span>
              <h2>Lectura genética</h2>
              <small>PREVISIÓN</small>
            </div>

            <div className={styles.previewRelic}>
              <small>PALABRA RELIQUIA</small>
              <strong>{preview.reliquia}</strong>
              <span>
                {preview.bpmBase} BPM · {preview.tonalidad}
              </span>
            </div>

            <div className={styles.previewHabitats}>
              {HABITATS.slice()
                .sort(
                  (a, b) =>
                    preview.habitats[b] - preview.habitats[a],
                )
                .map((habitat) => (
                  <div key={habitat}>
                    <span>{HABITAT_NAMES[habitat]}</span>
                    <i>
                      <b
                        style={{
                          width: `${preview.habitats[habitat]}%`,
                        }}
                      />
                    </i>
                    <strong>{preview.habitats[habitat]}%</strong>
                  </div>
                ))}
            </div>
          </aside>
        </section>
      </main>
    );
  }

  let currentWord = -1;

  return (
    <main className={styles.page}>
      <div className={styles.backgroundGrid} />
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <span>O/E</span>
          <div>
            <small>ORGANISMO V4.7</small>
            <h1>Alimentación verbal</h1>
          </div>
        </div>

        <div className={styles.topStatus}>
          <span>{organism.codigo}</span>
          <i />
          <strong>{playingVisual ? "EVOLUCIONANDO" : "EN SUSPENSIÓN"}</strong>
        </div>
      </header>

      <section className={styles.mainGrid}>
        <aside className={styles.readingPanel}>
          <div className={styles.panelTitle}>
            <span>LECTURA DEL ORGANISMO</span>
          </div>

          <MetricBlock
            label="Ciclos"
            value={String(organism.edad)}
            caption="desde el origen"
          />
          <MetricBlock
            label="Fase actual"
            value={phase.name}
            caption={phase.narrative}
          />
          <MetricBlock
            label="Intensidad"
            value={`${intensity}%`}
            caption="campo armónico"
          />

          <div className={styles.pulseMetric}>
            <span>PULSO CENTRAL</span>
            <svg viewBox="0 0 160 42" aria-hidden="true">
              <path d={wavePath(phaseIndex + 1, intensity)} />
            </svg>
            <strong>{bpmActual(organism)} BPM</strong>
          </div>

          <blockquote>
            EL POEMA
            <br />
            ES EL ADN
            <br />
            LA MÚSICA
            <br />
            SU METABOLISMO
          </blockquote>

          <div className={styles.lyricCore}>
            <span />
            <small>NÚCLEO LÍRICO</small>
            <strong>{organism.reliquia}</strong>
          </div>
        </aside>

        <section className={styles.centerColumn}>
          <article className={styles.evolutionChamber}>
            <header>
              <span>CÁMARA DE EVOLUCIÓN</span>
              <div>
                <small>{phase.name}</small>
                <b>{Math.round(progress * 100)}%</b>
              </div>
            </header>

            <div className={styles.chamberVisual}>
              <EmbryoScene
                organismo={organism}
                progresoMusical={progress}
                faseMusical={phase.name}
                reproduciendo={playingVisual}
                biomasaVerbal={biomassRatio}
                pulsoTecla={keystrokePulse}
                pulsoAbsorcion={absorptionPulse}
                pulsoBorrado={deletionPulse}
                habitatEntrante={feedingHabitat}
                palabraEntrante={lastWord}
              />

              <svg
                className={styles.songBody}
                viewBox="0 0 1000 520"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="bodyStroke" x1="0" x2="1">
                    <stop offset="0" stopColor="#7d8c28" stopOpacity="0.05" />
                    <stop offset="0.5" stopColor="#f2aa52" stopOpacity="0.9" />
                    <stop offset="1" stopColor="#d9ff59" stopOpacity="0.16" />
                  </linearGradient>
                  <filter id="bodyGlow">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {Array.from({ length: 12 }, (_, index) => {
                  const y = 70 + index * 33;
                  const amplitude =
                    22 + intensity * 0.42 + (index % 3) * 12;
                  const progressOffset = progress * 280 + index * 17;
                  const path = `M 20 ${y}
                    C 180 ${y - amplitude},
                      300 ${y + amplitude * 0.65},
                      455 ${y - amplitude * 0.28}
                    S 730 ${y + amplitude * 0.55},
                      980 ${y - amplitude * 0.18}`;

                  return (
                    <path
                      key={index}
                      d={path}
                      pathLength="1"
                      style={{
                        strokeDashoffset:
                          1 -
                          clamp(
                            progress * 1.34 -
                              index * 0.018 +
                              progressOffset * 0.00001,
                          ),
                        opacity:
                          0.14 +
                          (index % 4) * 0.06 +
                          intensity / 550,
                      }}
                    />
                  );
                })}
              </svg>

              <div className={styles.chamberLabels}>
                <span className={styles.labelMelody}>
                  rastros melódicos
                  <br />
                  en órbita
                </span>
                <span className={styles.labelParticles}>
                  partículas
                  <br />
                  espectrales
                </span>
                <span className={styles.labelMembrane}>
                  membranas
                  <br />
                  armónicas
                </span>
                <span className={styles.labelFilaments}>
                  filamentos
                  <br />
                  de sentido
                </span>
              </div>

              <div className={styles.fossilRail}>
                {PHASES.map((item, index) => (
                  <div
                    key={item.id}
                    className={[
                      index === phaseIndex ? styles.fossilActive : "",
                      index < phaseIndex ? styles.fossilPast : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <span>
                      <i />
                      <b />
                    </span>
                    <small>{item.name}</small>
                  </div>
                ))}
              </div>

              <div className={styles.feedingOverlay} aria-live="polite">
                {feedingText ? (
                  <div className={styles.feedingSignal}>
                    <span />
                    RECIBIENDO MATERIA · {provisionalWords} PALABRAS
                  </div>
                ) : null}

                {floatingWords.map((item) => (
                  <span
                    key={item.id}
                    className={styles.floatingWord}
                    data-habitat={item.habitat}
                  >
                    {item.word}
                  </span>
                ))}
              </div>
            </div>

            <blockquote>“{feedingText ? `Recibiendo «${lastWord || "materia"}».` : phase.narrative}”</blockquote>
          </article>

          <article className={styles.poemScore}>
            <header>
              <span>POEMA / PARTITURA VIVA</span>
              <small>
                La palabra activa modifica el cuerpo musical
              </small>
            </header>

            <div className={styles.poemScoreBody}>
              <div className={styles.poemNucleus}>
                <span />
                <i />
                <b />
                <small>NÚCLEO LÍRICO</small>
              </div>

              <div className={styles.poemText}>
                {tokens.map((token, index) => {
                  if (token === "\n") {
                    return <br key={`break-${index}`} />;
                  }

                  if (!isWord(token)) {
                    return (
                      <span
                        key={`${token}-${index}`}
                        className={styles.punctuation}
                      >
                        {token}
                      </span>
                    );
                  }

                  currentWord += 1;
                  const wordIndex = currentWord;
                  const power = semanticPower(token);
                  const active =
                    wordIndex === activeWordIndex ||
                    wordIndex === activeWordIndex + 1;
                  const near =
                    Math.abs(wordIndex - activeWordIndex) <= 3;

                  return (
                    <span
                      key={`${token}-${index}`}
                      className={[
                        styles.poemWord,
                        active ? styles.poemWordActive : "",
                        near ? styles.poemWordNear : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      data-power={power}
                    >
                      {token}
                    </span>
                  );
                })}
              </div>

              <div className={styles.notationField}>
                {Array.from({ length: 24 }, (_, index) => (
                  <i
                    key={index}
                    style={{
                      height: `${
                        10 +
                        Math.abs(
                          Math.sin(
                            index * 0.72 +
                              progress * Math.PI * 14 +
                              phaseIndex,
                          ),
                        ) *
                          (22 + intensity * 0.5)
                      }%`,
                    }}
                  />
                ))}
              </div>
            </div>
          </article>
        </section>

        <aside className={styles.rightColumn}>
          <section className={styles.feedingPanel}>
            <header>
              <span>ALIMENTACIÓN VERBAL · EN DIRECTO</span>
              <b className={feedingText ? styles.feedingLive : undefined}>
                {feedingText ? "RECIBIENDO" : "EN ESPERA"}
              </b>
            </header>

            <textarea
              value={feedingText}
              onChange={handleFeedingChange}
              onKeyDown={handleFeedingKey}
              placeholder="Escribe palabras para alimentar al organismo…"
              aria-label="Materia verbal para el organismo"
            />

            <div className={styles.feedingMetrics}>
              <article>
                <span>PALABRAS</span>
                <strong>{provisionalWords}</strong>
              </article>
              <article>
                <span>BIOMASA</span>
                <strong>+{Math.round(biomassRatio * 22)}%</strong>
              </article>
              <article>
                <span>HÁBITAT</span>
                <strong>{HABITAT_NAMES[feedingHabitat]}</strong>
              </article>
              <article>
                <span>TECLAS</span>
                <strong>{totalKeystrokes}</strong>
              </article>
            </div>

            <div className={styles.digestingWord}>
              <span>PALABRA EN DIGESTIÓN</span>
              <strong>{lastWord || "—"}</strong>
              <small>{verbalConsequence(feedingHabitat)}</small>
            </div>

            <button
              type="button"
              className={styles.deliverMatter}
              onClick={feed}
              disabled={!feedingText.trim()}
            >
              <span>ENTREGAR MATERIA</span>
              <b>INTEGRAR EN SU CUERPO ↗</b>
            </button>
          </section>

          <section className={styles.channelsPanel}>
            <header>
              <span>HÁBITATS / 6 CANALES</span>
            </header>

            {HABITATS.map((habitat, index) => {
              const activation = Math.round(
                (habitatActivation[habitat] *
                  organism.habitats[habitat]) /
                  100,
              );

              return (
                <article
                  key={habitat}
                  className={
                    habitatActivation[habitat] >= 75
                      ? styles.channelActive
                      : undefined
                  }
                >
                  <span>{HABITAT_GLYPHS[habitat]}</span>
                  <div>
                    <strong>{HABITAT_NAMES[habitat]}</strong>
                    <svg viewBox="0 0 220 44" aria-hidden="true">
                      <path
                        d={wavePath(index + phaseIndex, activation)}
                      />
                    </svg>
                  </div>
                  <b>{activation}</b>
                  <i />
                </article>
              );
            })}
          </section>

          <section className={styles.layersPanel}>
            <header>
              <span>CAPAS ACTIVAS · {phase.name.toUpperCase()}</span>
            </header>

            <div>
              {phase.layers.map((layer, index) => (
                <article key={layer}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{layer}</strong>
                  <i>
                    <b
                      style={{
                        width: `${
                          28 +
                          intensity * 0.55 -
                          index * 7
                        }%`,
                      }}
                    />
                  </i>
                  <em />
                </article>
              ))}
            </div>
          </section>

          <section className={styles.interventionPanel}>
            <header>
              <span>MUTACIÓN Y VIGILIA</span>
            </header>

            <div className={styles.metabolismButtons}>
              <button type="button" className={styles.metabolismActive}>
                <strong>{organism.etapa.toUpperCase()}</strong>
                <small>Día vital {organism.edad}</small>
              </button>
              <button type="button">
                <strong>{Math.round(organism.energia)}% energía</strong>
                <small>Respuesta corporal</small>
              </button>
              <button type="button">
                <strong>{Math.round(organism.complejidad)}% complejidad</strong>
                <small>Anatomía adquirida</small>
              </button>
            </div>

            <div className={styles.interventionActions}>
              <button
                type="button"
                onClick={organism.etapa === "latencia" ? wake : mutate}
              >
                {organism.etapa === "latencia" ? "DESPERTAR" : "PROVOCAR MUTACIÓN"}
              </button>
              <button type="button" onClick={resetEvolution}>
                REINICIAR CICLO
              </button>
            </div>
          </section>
        </aside>
      </section>

      <section className={styles.evolutionLine}>
        <header>
          <span>LÍNEA DE EVOLUCIÓN</span>
          <div>
            <strong>{formatTime(elapsedSeconds)}</strong>
            <small>
              {formatTime(durationSeconds)} · CICLO{" "}
              {String(currentCycle).padStart(2, "0")} / 56
            </small>
          </div>
        </header>

        <div className={styles.phaseLine}>
          <i
            className={styles.phaseProgress}
            style={{ width: `${progress * 100}%` }}
          />
          <b
            className={styles.phaseHead}
            style={{ left: `${progress * 100}%` }}
          />

          {PHASES.map((item, index) => {
            const startCycles = PHASES.slice(0, index).reduce(
              (total, value) => total + value.cycles,
              0,
            );

            return (
              <article
                key={item.id}
                style={{
                  left: `${(startCycles / 56) * 100}%`,
                  width: `${(item.cycles / 56) * 100}%`,
                }}
                className={[
                  index === phaseIndex ? styles.phaseActive : "",
                  index < phaseIndex ? styles.phasePast : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span>
                  <i />
                  <b />
                </span>
                <strong>{item.name}</strong>
                <small>{item.cycles} C</small>
              </article>
            );
          })}
        </div>

        <div className={styles.transport}>
          <button
            type="button"
            className={styles.playButton}
            onClick={playingVisual ? pauseEvolution : startEvolution}
          >
            {playingVisual ? "Ⅱ" : "▶"}
          </button>
          <button type="button" onClick={resetEvolution}>
            ↶
          </button>

          <div className={styles.transportWave}>
            {Array.from({ length: 80 }, (_, index) => (
              <i
                key={index}
                style={{
                  height: `${
                    4 +
                    Math.abs(
                      Math.sin(
                        index * 0.43 +
                          progress * Math.PI * 20,
                      ),
                    ) *
                      (8 + intensity * 0.16)
                  }px`,
                }}
              />
            ))}
          </div>

          <strong>
            {Math.round(progress * 100)}% · {phase.name}
          </strong>
        </div>
      </section>

      <details
        className={styles.engine}
        open={engineOpen}
        onToggle={(event) =>
          setEngineOpen((event.currentTarget as HTMLDetailsElement).open)
        }
      >
        <summary>
          <span>VER MOTOR SONORO / CÓDIGO DEL ORGANISMO</span>
          <b>{engineOpen ? "—" : "+"}</b>
        </summary>

        <div className={styles.engineActions}>
          <button type="button" onClick={copyCode}>
            COPIAR CÓDIGO
          </button>
          <a href={strudelUrl} target="_blank" rel="noreferrer">
            ABRIR EN STRUDEL ↗
          </a>
          <button type="button" onClick={release}>
            LIBERAR ORGANISMO
          </button>
        </div>

        <iframe
          ref={iframeRef}
          key={strudelUrl}
          src={strudelUrl}
          title={`Organismo ${organism.nombre}`}
          allow="autoplay; microphone; midi"
        />

        <pre>{code}</pre>
      </details>

      <footer className={styles.footer}>
        <span>ORGANISMO V4.7 · LA CANCIÓN ADQUIERE CUERPO</span>
        <span>
          {CICLOS_COMPOSICION} ciclos · {durationMinutes} minutos estimados
        </span>
      </footer>

      {toast ? <div className={styles.toast}>{toast}</div> : null}
    </main>
  );
}

function MetricBlock({
  label,
  value,
  caption,
}: {
  label: string;
  value: string;
  caption: string;
}) {
  return (
    <div className={styles.metricBlock}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{caption}</small>
    </div>
  );
}
