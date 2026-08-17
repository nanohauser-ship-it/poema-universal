#!/usr/bin/env bash
set -euo pipefail

cd "${HOME}/poema-universal"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " ORGANISMO V4.6 · LA CANCIÓN ADQUIERE CUERPO"
echo " CÁMARA DE EVOLUCIÓN · PARTITURA POÉTICA VIVA"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [[ ! -f package.json ]]; then
  echo "❌ No encuentro package.json en ~/poema-universal"
  exit 1
fi

if [[ -d app/laboratorio/verso-tecno ]]; then
  TARGET="app/laboratorio/verso-tecno"
elif [[ -d src/app/laboratorio/verso-tecno ]]; then
  TARGET="src/app/laboratorio/verso-tecno"
else
  echo "❌ No encuentro /laboratorio/verso-tecno"
  exit 1
fi

for FILE in \
  "${TARGET}/organismo/motor.ts" \
  "${TARGET}/organismo/OrganismoEmbryoScene.tsx"; do
  if [[ ! -f "$FILE" ]]; then
    echo "❌ Falta $FILE"
    exit 1
  fi
done

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="${TARGET}.before-organismo-v46-${STAMP}"
cp -R "${TARGET}" "${BACKUP}"

echo "✅ Copia de seguridad:"
echo "   ${BACKUP}"

echo "===== ASEGURANDO MADURACIÓN DE 56 CICLOS ====="

python3 - "${TARGET}/organismo/motor.ts" <<'PYMOTOR'
from pathlib import Path
import re
import sys

path = Path(sys.argv[1])
text = path.read_text(encoding="utf-8")

text = text.replace(
    "export const CICLOS_COMPOSICION = 116;",
    "export const CICLOS_COMPOSICION = 56;",
)

old_arrange = re.compile(
    r"""arrange\(\s*
        \[8,\s*incubacion\],\s*
        \[16,\s*germinacion\],\s*
        \[20,\s*formacion\],\s*
        \[24,\s*cuerpo\],\s*
        \[12,\s*fractura\],\s*
        \[20,\s*expansion\],\s*
        \[16,\s*memoria\]\s*
        \)""",
    re.VERBOSE,
)

new_arrange = """arrange(
  [4, incubacion],
  [6, germinacion],
  [8, formacion],
  [10, cuerpo],
  [6, fractura],
  [12, expansion],
  [10, memoria]
)"""

text, count = old_arrange.subn(new_arrange, text, count=1)

if count:
    print("✅ Motor musical reducido a 56 ciclos.")
else:
    print("ℹ️ El motor ya usa otra arquitectura o ya estaba en 56 ciclos.")

path.write_text(text, encoding="utf-8")
PYMOTOR

cat > "${TARGET}/OrganismoV46.tsx" <<'EOF'
"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
} from "react";
import OrganismoEmbryoScene from "./organismo/OrganismoEmbryoScene";
import {
  CICLOS_COMPOSICION,
  HABITATS,
  analizarPoema,
  bpmActual,
  cambiarMetabolismo,
  codigoStrudel,
  despertar,
  duracionComposicionMinutos,
  evolucionarHastaAhora,
  incubar,
  injertar,
  migrarOrganismo,
  mutarAhora,
  urlStrudel,
  type Habitat,
  type Metabolismo,
  type Organismo,
} from "./organismo/motor";
import styles from "./organismo-v46.module.css";

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

const METABOLISMS: Array<{
  id: Metabolismo;
  label: string;
  caption: string;
}> = [
  { id: "contemplativo", label: "Contemplativo", caption: "1 ciclo / día" },
  { id: "vivo", label: "Vivo", caption: "1 ciclo / 6 h" },
  { id: "intensivo", label: "Intensivo", caption: "1 ciclo / 2 h" },
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

export default function OrganismoV46() {
  const [name, setName] = useState("La luz que permanece");
  const [poem, setPoem] = useState(POEMA_INICIAL);
  const [organism, setOrganism] = useState<Organismo | null>(null);
  const [graft, setGraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [playingVisual, setPlayingVisual] = useState(false);
  const [toast, setToast] = useState("");
  const [engineOpen, setEngineOpen] = useState(true);
  const startRef = useRef(0);
  const pausedAtRef = useRef(0);
  const frameRef = useRef(0);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE);

      if (stored) {
        const migrated = migrarOrganismo(JSON.parse(stored) as Organismo);
        const evolved = evolucionarHastaAhora(migrated);
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
  const tokens = useMemo(
    () => tokenizePoem(organism?.poema ?? poem),
    [organism?.poema, poem],
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

  function feed() {
    if (!organism || !graft.trim()) return;
    persist(injertar(organism, graft));
    setGraft("");
    notify("El verso fue incorporado a su genealogía.");
  }

  function wake() {
    if (!organism) return;
    persist(despertar(organism));
    notify("El organismo ha despertado.");
  }

  function changeMetabolism(value: Metabolismo) {
    if (!organism || organism.metabolismo === value) return;
    persist(cambiarMetabolismo(organism, value));
    notify(`Metabolismo ${value} activado.`);
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
              <h1>ORGANISMO V4.6</h1>
            </div>
          </div>
          <p>La canción adquiere cuerpo</p>
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
            <small>ORGANISMO V4.6</small>
            <h1>La canción adquiere cuerpo</h1>
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
            value={String(organism.ciclosVitales)}
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
            </div>

            <blockquote>“{phase.narrative}”</blockquote>
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
              <span>INTERVENCIÓN VITAL</span>
            </header>

            <div className={styles.metabolismButtons}>
              {METABOLISMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={
                    organism.metabolismo === item.id
                      ? styles.metabolismActive
                      : undefined
                  }
                  onClick={() => changeMetabolism(item.id)}
                >
                  <strong>{item.label}</strong>
                  <small>{item.caption}</small>
                </button>
              ))}
            </div>

            <textarea
              value={graft}
              onChange={(event) =>
                setGraft(event.target.value.slice(0, 500))
              }
              placeholder="Injertar un nuevo verso…"
            />

            <div className={styles.interventionActions}>
              <button type="button" onClick={feed} disabled={!graft.trim()}>
                INJERTAR
              </button>
              <button
                type="button"
                onClick={organism.etapa === "latencia" ? wake : mutate}
              >
                {organism.etapa === "latencia" ? "DESPERTAR" : "MUTAR"}
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
        <span>ORGANISMO V4.6 · LA CANCIÓN ADQUIERE CUERPO</span>
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
EOF

cat > "${TARGET}/organismo-v46.module.css" <<'EOF'
.page,
.birthPage,
.loadingPage {
  --bg: #050706;
  --panel: rgba(8, 11, 9, 0.94);
  --panel-soft: rgba(12, 16, 12, 0.86);
  --line: rgba(222, 224, 183, 0.12);
  --line-strong: rgba(222, 224, 183, 0.24);
  --ink: #ece8d4;
  --muted: #7f8977;
  --acid: #d8f65b;
  --amber: #e2a44f;
  --orange: #d97932;
  --deep-green: #121b0c;
  min-height: 100vh;
  color: var(--ink);
  background:
    radial-gradient(circle at 50% -10%, rgba(224, 164, 79, 0.1), transparent 30%),
    radial-gradient(circle at 88% 42%, rgba(216, 246, 91, 0.04), transparent 22%),
    linear-gradient(180deg, #060806, #030504);
  font-family: Arial, Helvetica, sans-serif;
}

.page,
.birthPage {
  position: relative;
  overflow: hidden;
  padding: 10px;
}

.backgroundGrid,
.birthGrid {
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.14;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.024) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 34px 34px;
  mask-image: radial-gradient(circle at center, black, transparent 96%);
}

.topbar,
.birthHeader {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  min-height: 64px;
  border: 1px solid var(--line);
  border-radius: 22px;
  background:
    linear-gradient(90deg, rgba(226, 164, 79, 0.035), transparent 25%),
    rgba(4, 7, 5, 0.86);
  backdrop-filter: blur(18px);
}

.brand,
.birthHeader > div {
  display: flex;
  align-items: stretch;
}

.brand > span,
.birthHeader > div > span {
  display: grid;
  width: 70px;
  place-items: center;
  border-right: 1px solid var(--line);
  color: var(--amber);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 18px;
  font-style: italic;
}

.brand > div,
.birthHeader > div > div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 20px;
}

.brand small,
.birthHeader small {
  color: var(--muted);
  font-size: 6px;
  font-weight: 800;
  letter-spacing: 0.19em;
}

.brand h1,
.birthHeader h1 {
  margin: 5px 0 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(18px, 2.2vw, 29px);
  font-weight: 400;
  letter-spacing: 0.05em;
}

.topStatus {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
  border-left: 1px solid var(--line);
}

.topStatus span,
.topStatus strong {
  color: var(--muted);
  font-size: 6px;
  letter-spacing: 0.14em;
}

.topStatus i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--acid);
  box-shadow: 0 0 14px var(--acid);
}

.mainGrid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 175px minmax(620px, 1fr) 330px;
  gap: 8px;
  margin-top: 8px;
}

.readingPanel,
.evolutionChamber,
.poemScore,
.channelsPanel,
.layersPanel,
.interventionPanel,
.evolutionLine,
.engine {
  border: 1px solid var(--line);
  border-radius: 17px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.018), transparent 42%),
    var(--panel);
  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.24);
  backdrop-filter: blur(16px);
}

.readingPanel {
  display: flex;
  min-height: 780px;
  flex-direction: column;
  padding: 16px;
}

.panelTitle,
.channelsPanel > header,
.layersPanel > header,
.interventionPanel > header {
  padding-bottom: 13px;
  border-bottom: 1px solid var(--line);
}

.panelTitle span,
.channelsPanel > header span,
.layersPanel > header span,
.interventionPanel > header span {
  color: var(--muted);
  font-size: 6px;
  font-weight: 800;
  letter-spacing: 0.17em;
}

.metricBlock {
  padding: 20px 0;
  border-bottom: 1px solid var(--line);
}

.metricBlock > span,
.pulseMetric > span {
  display: block;
  color: var(--muted);
  font-size: 6px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.metricBlock > strong {
  display: block;
  margin-top: 9px;
  color: #cfd58f;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 22px;
  font-weight: 400;
}

.metricBlock > small {
  display: block;
  margin-top: 5px;
  color: #687064;
  font-size: 7px;
  line-height: 1.4;
}

.pulseMetric {
  padding: 20px 0;
  border-bottom: 1px solid var(--line);
}

.pulseMetric svg {
  display: block;
  width: 100%;
  height: 38px;
  margin-top: 8px;
}

.pulseMetric path,
.channelsPanel path {
  fill: none;
  stroke: var(--acid);
  stroke-width: 1.1;
  vector-effect: non-scaling-stroke;
}

.pulseMetric > strong {
  display: block;
  color: var(--muted);
  font-size: 7px;
  font-weight: 400;
}

.readingPanel blockquote {
  margin: 28px 0 0;
  color: #a7aa83;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 10px;
  letter-spacing: 0.08em;
  line-height: 2.05;
}

.lyricCore {
  position: relative;
  display: flex;
  min-height: 150px;
  align-items: center;
  flex-direction: column;
  justify-content: flex-end;
  margin-top: auto;
  padding-bottom: 8px;
}

.lyricCore > span,
.poemNucleus > span {
  position: absolute;
  top: 18px;
  width: 68px;
  height: 68px;
  border: 1px solid rgba(216, 246, 91, 0.34);
  border-radius: 50%;
  box-shadow:
    inset 0 0 24px rgba(216, 246, 91, 0.08),
    0 0 22px rgba(216, 246, 91, 0.06);
}

.lyricCore > span::before,
.lyricCore > span::after,
.poemNucleus > span::before,
.poemNucleus > span::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px solid rgba(226, 164, 79, 0.24);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.lyricCore > span::before,
.poemNucleus > span::before {
  width: 42px;
  height: 42px;
}

.lyricCore > span::after,
.poemNucleus > span::after {
  width: 12px;
  height: 12px;
  background: var(--amber);
  box-shadow: 0 0 16px var(--amber);
}

.lyricCore small {
  color: var(--muted);
  font-size: 5px;
  letter-spacing: 0.17em;
}

.lyricCore strong {
  margin-top: 4px;
  color: var(--amber);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 12px;
  font-weight: 400;
  font-style: italic;
}

.centerColumn {
  display: grid;
  gap: 8px;
}

.evolutionChamber {
  overflow: hidden;
}

.evolutionChamber > header,
.poemScore > header {
  display: flex;
  min-height: 48px;
  align-items: center;
  justify-content: space-between;
  padding: 0 17px;
  border-bottom: 1px solid var(--line);
}

.evolutionChamber > header > span,
.poemScore > header > span {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 11px;
  letter-spacing: 0.12em;
}

.evolutionChamber > header > div {
  display: flex;
  align-items: center;
  gap: 12px;
}

.evolutionChamber > header small,
.poemScore > header small {
  color: var(--muted);
  font-size: 6px;
  letter-spacing: 0.13em;
}

.evolutionChamber > header b {
  color: var(--acid);
  font-size: 8px;
}

.chamberVisual {
  position: relative;
  min-height: 520px;
  overflow: hidden;
  background:
    radial-gradient(circle at center, rgba(226, 164, 79, 0.11), transparent 35%),
    radial-gradient(circle at 40% 50%, rgba(216, 246, 91, 0.045), transparent 50%),
    #050806;
}

.chamberVisual > :first-child {
  position: absolute !important;
  inset: 18px 15% 24px !important;
  z-index: 3;
  min-height: auto !important;
  margin: 0 !important;
  border: 0 !important;
  background: transparent !important;
}

.songBody {
  position: absolute;
  inset: 0;
  z-index: 4;
  width: 100%;
  height: 100%;
  pointer-events: none;
  filter: url(#bodyGlow);
}

.songBody path {
  fill: none;
  stroke: url(#bodyStroke);
  stroke-width: 1.15;
  stroke-dasharray: 1;
  transition:
    stroke-dashoffset 180ms linear,
    opacity 280ms ease;
}

.chamberLabels {
  position: absolute;
  inset: 0;
  z-index: 7;
  pointer-events: none;
}

.chamberLabels span {
  position: absolute;
  color: #b4ad79;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 7px;
  line-height: 1.35;
}

.labelMelody {
  top: 13%;
  left: 22%;
}

.labelParticles {
  top: 15%;
  right: 18%;
}

.labelMembrane {
  bottom: 19%;
  left: 19%;
}

.labelFilaments {
  right: 17%;
  bottom: 18%;
}

.fossilRail {
  position: absolute;
  top: 54px;
  bottom: 56px;
  left: 10px;
  z-index: 8;
  display: flex;
  width: 92px;
  flex-direction: column;
  justify-content: space-around;
  pointer-events: none;
}

.fossilRail > div {
  display: flex;
  align-items: center;
  gap: 7px;
  opacity: 0.18;
  transition:
    opacity 260ms ease,
    transform 260ms ease;
}

.fossilRail > div > span,
.phaseLine article > span {
  position: relative;
  display: block;
  width: 30px;
  height: 30px;
  border: 1px solid rgba(216, 246, 91, 0.24);
  border-radius: 50%;
  background:
    radial-gradient(circle at 55% 45%, rgba(226, 164, 79, 0.22), transparent 28%),
    rgba(5, 8, 6, 0.8);
}

.fossilRail > div > span i,
.phaseLine article > span i {
  position: absolute;
  top: 7px;
  left: 9px;
  width: 11px;
  height: 15px;
  border: 1px solid rgba(236, 232, 212, 0.45);
  border-radius: 60% 55% 55% 60%;
  transform: rotate(18deg);
}

.fossilRail > div > span b,
.phaseLine article > span b {
  position: absolute;
  top: 17px;
  left: 14px;
  width: 8px;
  height: 1px;
  background: rgba(236, 232, 212, 0.45);
  transform: rotate(-42deg);
}

.fossilRail small {
  color: var(--muted);
  font-size: 5px;
  letter-spacing: 0.08em;
}

.fossilRail .fossilActive {
  opacity: 1;
  transform: translateX(5px) scale(1.08);
}

.fossilRail .fossilActive > span {
  border-color: var(--amber);
  box-shadow: 0 0 18px rgba(226, 164, 79, 0.25);
}

.fossilRail .fossilPast {
  opacity: 0.42;
}

.evolutionChamber > blockquote {
  margin: 0;
  padding: 10px 18px 12px;
  border-top: 1px solid var(--line);
  color: #b6b290;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 9px;
  font-style: italic;
  text-align: center;
}

.poemScore {
  min-height: 232px;
}

.poemScoreBody {
  display: grid;
  grid-template-columns: 150px minmax(330px, 1fr) minmax(190px, 0.7fr);
  min-height: 180px;
}

.poemNucleus {
  position: relative;
  display: grid;
  place-items: center;
  border-right: 1px solid var(--line);
}

.poemNucleus > i,
.poemNucleus > b {
  position: absolute;
  border: 1px solid rgba(226, 164, 79, 0.17);
  border-radius: 50%;
}

.poemNucleus > i {
  width: 104px;
  height: 104px;
}

.poemNucleus > b {
  width: 130px;
  height: 130px;
  border-style: dashed;
}

.poemNucleus small {
  position: absolute;
  bottom: 14px;
  color: var(--muted);
  font-size: 5px;
  letter-spacing: 0.15em;
}

.poemText {
  align-self: center;
  padding: 22px 24px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(12px, 1.2vw, 17px);
  line-height: 1.9;
}

.poemWord {
  position: relative;
  display: inline-block;
  margin-right: 0.27em;
  border-radius: 3px;
  color: #b9b7a7;
  transition:
    color 180ms ease,
    background 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
}

.poemWordNear {
  color: #d2cfb7;
}

.poemWordActive {
  z-index: 2;
  padding: 0 0.18em;
  color: #fff3cf;
  background: rgba(226, 164, 79, 0.18);
  box-shadow:
    inset 0 0 0 1px rgba(226, 164, 79, 0.54),
    0 0 16px rgba(226, 164, 79, 0.15);
  transform: translateY(-1px);
}

.poemWordActive[data-power="pulso"] {
  background: rgba(216, 246, 91, 0.16);
  box-shadow:
    inset 0 0 0 1px rgba(216, 246, 91, 0.5),
    0 0 16px rgba(216, 246, 91, 0.14);
}

.poemWordActive[data-power="fractura"] {
  background: rgba(217, 121, 50, 0.18);
}

.punctuation {
  margin-right: 0.16em;
  color: #817f70;
}

.notationField {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 18px 20px;
  border-left: 1px solid var(--line);
}

.notationField i {
  display: block;
  min-width: 2px;
  flex: 1;
  max-width: 6px;
  background:
    linear-gradient(to top, var(--amber), var(--acid));
  opacity: 0.65;
  transition: height 120ms linear;
}

.rightColumn {
  display: grid;
  align-content: start;
  gap: 8px;
}

.channelsPanel,
.layersPanel,
.interventionPanel {
  padding: 13px;
}

.channelsPanel article {
  display: grid;
  grid-template-columns: 28px 1fr 24px 12px;
  align-items: center;
  gap: 8px;
  min-height: 58px;
  margin-top: 7px;
  padding: 0 9px;
  border: 1px solid var(--line);
  border-radius: 11px;
  opacity: 0.62;
  background: rgba(5, 8, 6, 0.65);
  transition:
    opacity 220ms ease,
    border-color 220ms ease,
    background 220ms ease;
}

.channelsPanel article > span {
  display: grid;
  width: 24px;
  height: 24px;
  place-items: center;
  border: 1px solid rgba(226, 164, 79, 0.28);
  border-radius: 50%;
  color: var(--amber);
  font-size: 13px;
}

.channelsPanel article > div {
  min-width: 0;
}

.channelsPanel article strong {
  display: block;
  color: #c8c7ae;
  font-size: 7px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.channelsPanel article svg {
  display: block;
  width: 100%;
  height: 25px;
}

.channelsPanel article > b {
  color: var(--acid);
  font-size: 8px;
  font-weight: 500;
}

.channelsPanel article > i {
  width: 8px;
  height: 8px;
  border: 1px solid rgba(216, 246, 91, 0.4);
  border-radius: 50%;
  background: rgba(216, 246, 91, 0.12);
}

.channelsPanel .channelActive {
  border-color: rgba(216, 246, 91, 0.32);
  opacity: 1;
  background:
    linear-gradient(90deg, rgba(216, 246, 91, 0.065), transparent),
    rgba(5, 8, 6, 0.8);
}

.channelsPanel .channelActive > i {
  background: var(--acid);
  box-shadow: 0 0 11px var(--acid);
}

.layersPanel > div {
  margin-top: 8px;
}

.layersPanel article {
  display: grid;
  grid-template-columns: 25px 1fr 80px 9px;
  align-items: center;
  gap: 8px;
  min-height: 39px;
  border-bottom: 1px solid var(--line);
}

.layersPanel article > span {
  color: var(--amber);
  font-size: 6px;
}

.layersPanel article > strong {
  color: #b8b7a2;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 9px;
  font-weight: 400;
}

.layersPanel article > i {
  display: block;
  height: 2px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
}

.layersPanel article > i b {
  display: block;
  height: 100%;
  background:
    linear-gradient(90deg, var(--orange), var(--amber));
}

.layersPanel article > em {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--amber);
  box-shadow: 0 0 10px var(--amber);
}

.metabolismButtons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  margin-top: 10px;
}

.metabolismButtons button {
  min-height: 42px;
  padding: 6px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: transparent;
  color: var(--ink);
  cursor: pointer;
}

.metabolismButtons strong,
.metabolismButtons small {
  display: block;
}

.metabolismButtons strong {
  font-size: 7px;
  font-weight: 500;
}

.metabolismButtons small {
  margin-top: 4px;
  color: var(--muted);
  font-size: 5px;
}

.metabolismButtons .metabolismActive {
  border-color: rgba(216, 246, 91, 0.45);
  color: var(--acid);
  background: rgba(216, 246, 91, 0.07);
}

.interventionPanel textarea {
  width: 100%;
  min-height: 74px;
  box-sizing: border-box;
  margin-top: 9px;
  padding: 10px;
  resize: vertical;
  outline: 0;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: rgba(3, 6, 4, 0.75);
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 10px;
}

.interventionPanel textarea:focus {
  border-color: rgba(216, 246, 91, 0.4);
}

.interventionActions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
  margin-top: 7px;
}

.interventionActions button {
  min-height: 34px;
  border: 1px solid rgba(216, 246, 91, 0.3);
  border-radius: 8px;
  background: transparent;
  color: var(--ink);
  font-size: 6px;
  letter-spacing: 0.12em;
  cursor: pointer;
}

.interventionActions button:first-child {
  background: rgba(216, 246, 91, 0.1);
  color: var(--acid);
}

.interventionActions button:disabled {
  opacity: 0.28;
  cursor: not-allowed;
}

.evolutionLine {
  position: relative;
  z-index: 2;
  margin-top: 8px;
  padding: 13px 18px 12px;
}

.evolutionLine > header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.evolutionLine > header > span {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 10px;
  letter-spacing: 0.12em;
}

.evolutionLine > header > div {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.evolutionLine > header strong {
  color: var(--acid);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 13px;
}

.evolutionLine > header small {
  color: var(--muted);
  font-size: 6px;
  letter-spacing: 0.1em;
}

.phaseLine {
  position: relative;
  height: 104px;
  margin-top: 6px;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.phaseLine::before {
  content: "";
  position: absolute;
  right: 0;
  bottom: 22px;
  left: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
}

.phaseProgress {
  position: absolute;
  bottom: 22px;
  left: 0;
  z-index: 3;
  height: 1px;
  background:
    linear-gradient(90deg, var(--orange), var(--acid));
  box-shadow: 0 0 9px rgba(216, 246, 91, 0.4);
  transition: width 110ms linear;
}

.phaseHead {
  position: absolute;
  bottom: 18px;
  z-index: 4;
  width: 9px;
  height: 9px;
  margin-left: -4px;
  border: 1px solid var(--acid);
  border-radius: 50%;
  background: #0c100b;
  box-shadow:
    0 0 0 4px rgba(216, 246, 91, 0.08),
    0 0 14px var(--acid);
  transition: left 110ms linear;
}

.phaseLine article {
  position: absolute;
  top: 10px;
  display: flex;
  align-items: center;
  flex-direction: column;
  opacity: 0.27;
  transition:
    opacity 220ms ease,
    transform 220ms ease;
}

.phaseLine article > span {
  width: 35px;
  height: 35px;
}

.phaseLine article > strong {
  margin-top: 5px;
  color: #b6b598;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 8px;
  font-weight: 400;
}

.phaseLine article > small {
  margin-top: 3px;
  color: var(--muted);
  font-size: 5px;
}

.phaseLine .phaseActive {
  opacity: 1;
  transform: translateY(-3px) scale(1.06);
}

.phaseLine .phaseActive > span {
  border-color: var(--amber);
  box-shadow: 0 0 18px rgba(226, 164, 79, 0.28);
}

.phaseLine .phaseActive > strong {
  color: var(--amber);
}

.phaseLine .phasePast {
  opacity: 0.48;
}

.transport {
  display: grid;
  grid-template-columns: 42px 30px 1fr auto;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}

.transport button {
  display: grid;
  height: 30px;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: transparent;
  color: var(--ink);
  cursor: pointer;
}

.transport .playButton {
  height: 42px;
  border-color: rgba(216, 246, 91, 0.48);
  color: var(--acid);
  box-shadow:
    inset 0 0 22px rgba(216, 246, 91, 0.06),
    0 0 14px rgba(216, 246, 91, 0.08);
}

.transportWave {
  display: flex;
  height: 25px;
  align-items: center;
  gap: 2px;
  overflow: hidden;
}

.transportWave i {
  display: block;
  min-width: 1px;
  flex: 1;
  background: rgba(216, 246, 91, 0.43);
  transition: height 100ms linear;
}

.transport > strong {
  color: var(--muted);
  font-size: 6px;
  font-weight: 500;
  letter-spacing: 0.08em;
}

.engine {
  position: relative;
  z-index: 2;
  margin-top: 8px;
  overflow: hidden;
}

.engine summary {
  display: flex;
  min-height: 48px;
  align-items: center;
  justify-content: space-between;
  padding: 0 17px;
  list-style: none;
  cursor: pointer;
}

.engine summary::-webkit-details-marker {
  display: none;
}

.engine summary span {
  font-size: 7px;
  letter-spacing: 0.13em;
}

.engine summary b {
  color: var(--acid);
  font-size: 15px;
  font-weight: 400;
}

.engineActions {
  display: flex;
  gap: 5px;
  padding: 8px 12px;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.engineActions button,
.engineActions a {
  display: grid;
  min-height: 30px;
  place-items: center;
  padding: 0 11px;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: transparent;
  color: var(--ink);
  font-size: 6px;
  letter-spacing: 0.1em;
  text-decoration: none;
  cursor: pointer;
}

.engine iframe {
  display: block;
  width: 100%;
  height: 440px;
  border: 0;
  border-bottom: 1px solid var(--line);
  filter: saturate(0.76);
}

.engine pre {
  max-height: 400px;
  overflow: auto;
  margin: 0;
  padding: 16px;
  background: #030504;
  color: #c8cbbd;
  font-size: 9px;
  line-height: 1.55;
  white-space: pre-wrap;
}

.footer {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  padding: 16px 4px 6px;
  color: var(--muted);
  font-size: 6px;
  letter-spacing: 0.12em;
}

.toast {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 100;
  max-width: min(360px, calc(100vw - 40px));
  padding: 12px 15px;
  border: 1px solid rgba(216, 246, 91, 0.42);
  border-radius: 10px;
  background: rgba(5, 8, 6, 0.94);
  color: var(--ink);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
  font-size: 9px;
}

.loadingPage {
  display: grid;
  place-items: center;
  align-content: center;
  gap: 16px;
}

.loadingPage > span {
  width: 44px;
  height: 44px;
  border: 1px solid var(--acid);
  border-radius: 50%;
  box-shadow: 0 0 24px rgba(216, 246, 91, 0.2);
  animation: breathe 1.8s ease-in-out infinite;
}

.loadingPage p {
  margin: 0;
  color: var(--muted);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 12px;
  font-style: italic;
}

.birthHeader {
  max-width: 1400px;
  margin: 0 auto;
}

.birthHeader > p {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0 22px;
  color: #b9b69d;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 11px;
  font-style: italic;
}

.birthLayout {
  position: relative;
  z-index: 2;
  display: grid;
  max-width: 1400px;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 8px;
  margin: 8px auto 0;
}

.birthPanel,
.previewPanel {
  min-height: 680px;
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: var(--panel);
}

.sectionTitle {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--line);
}

.sectionTitle > span {
  color: var(--acid);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 9px;
  font-style: italic;
}

.sectionTitle h2 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 17px;
  font-weight: 400;
}

.sectionTitle small {
  margin-left: auto;
  color: var(--muted);
  font-size: 6px;
  letter-spacing: 0.14em;
}

.birthPanel label {
  display: block;
  margin-top: 20px;
}

.birthPanel label > span {
  color: var(--muted);
  font-size: 7px;
  font-weight: 800;
  letter-spacing: 0.15em;
}

.birthPanel input,
.birthPanel textarea {
  width: 100%;
  box-sizing: border-box;
  margin-top: 8px;
  outline: 0;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: #050806;
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
}

.birthPanel input {
  padding: 12px;
  font-size: 14px;
}

.birthPanel textarea {
  min-height: 330px;
  padding: 15px;
  resize: vertical;
  font-size: 16px;
  line-height: 1.7;
}

.birthPanel input:focus,
.birthPanel textarea:focus {
  border-color: rgba(216, 246, 91, 0.45);
}

.birthPanel blockquote {
  margin: 18px 0 0;
  padding: 16px 0 0;
  border-top: 1px solid var(--line);
  color: #b2b09a;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 11px;
  font-style: italic;
  line-height: 1.6;
}

.birthPanel > button {
  display: flex;
  width: 100%;
  min-height: 50px;
  align-items: center;
  justify-content: space-between;
  margin-top: 17px;
  padding: 0 15px;
  border: 1px solid var(--acid);
  border-radius: 10px;
  background: rgba(216, 246, 91, 0.9);
  color: #050706;
  font-size: 7px;
  font-weight: 800;
  letter-spacing: 0.12em;
  cursor: pointer;
}

.birthPanel > button b {
  font-weight: 500;
}

.previewRelic {
  display: flex;
  min-height: 230px;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin-top: 16px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background:
    radial-gradient(circle, rgba(226, 164, 79, 0.11), transparent 55%),
    #050806;
}

.previewRelic small {
  color: var(--muted);
  font-size: 6px;
  letter-spacing: 0.15em;
}

.previewRelic strong {
  margin-top: 13px;
  color: var(--amber);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(34px, 4vw, 58px);
  font-weight: 400;
  font-style: italic;
}

.previewRelic span {
  margin-top: 12px;
  color: var(--muted);
  font-size: 7px;
}

.previewHabitats {
  margin-top: 18px;
}

.previewHabitats > div {
  display: grid;
  grid-template-columns: 80px 1fr 36px;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  border-bottom: 1px solid var(--line);
}

.previewHabitats span,
.previewHabitats strong {
  font-size: 7px;
}

.previewHabitats span {
  color: #b6b59e;
}

.previewHabitats strong {
  color: var(--acid);
  text-align: right;
}

.previewHabitats i {
  display: block;
  height: 3px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
}

.previewHabitats i b {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--orange), var(--acid));
}

@keyframes breathe {
  50% {
    transform: scale(1.07);
    opacity: 0.56;
  }
}

@media (max-width: 1180px) {
  .mainGrid {
    grid-template-columns: 150px minmax(540px, 1fr);
  }

  .rightColumn {
    grid-column: 1 / -1;
    grid-template-columns: 1fr 1fr 1fr;
  }

  .readingPanel {
    min-height: 700px;
  }
}

@media (max-width: 850px) {
  .mainGrid,
  .birthLayout {
    grid-template-columns: 1fr;
  }

  .readingPanel {
    display: grid;
    min-height: auto;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .panelTitle,
  .readingPanel blockquote,
  .lyricCore {
    grid-column: 1 / -1;
  }

  .rightColumn {
    grid-column: auto;
    grid-template-columns: 1fr;
  }

  .poemScoreBody {
    grid-template-columns: 100px 1fr;
  }

  .notationField {
    grid-column: 1 / -1;
    height: 80px;
    border-top: 1px solid var(--line);
    border-left: 0;
  }

  .chamberVisual {
    min-height: 460px;
  }

  .brand h1 {
    font-size: 18px;
  }
}

@media (max-width: 600px) {
  .page,
  .birthPage {
    padding: 5px;
  }

  .topbar,
  .birthHeader {
    border-radius: 14px;
  }

  .topStatus,
  .birthHeader > p {
    display: none;
  }

  .brand > span,
  .birthHeader > div > span {
    width: 52px;
  }

  .brand > div,
  .birthHeader > div > div {
    padding: 0 12px;
  }

  .mainGrid {
    margin-top: 5px;
  }

  .readingPanel {
    grid-template-columns: 1fr 1fr;
  }

  .metricBlock {
    padding: 12px 0;
  }

  .evolutionChamber > header,
  .poemScore > header {
    padding: 0 11px;
  }

  .chamberVisual {
    min-height: 420px;
  }

  .chamberVisual > :first-child {
    inset: 10px 4% 20px !important;
  }

  .chamberLabels,
  .fossilRail {
    display: none;
  }

  .poemScoreBody {
    grid-template-columns: 1fr;
  }

  .poemNucleus {
    display: none;
  }

  .poemText {
    padding: 18px;
    font-size: 13px;
  }

  .phaseLine {
    overflow-x: clip;
  }

  .phaseLine article > strong,
  .phaseLine article > small {
    display: none;
  }

  .phaseLine article > span {
    width: 28px;
    height: 28px;
  }

  .transport {
    grid-template-columns: 38px 28px 1fr;
  }

  .transport > strong {
    display: none;
  }

  .engineActions {
    flex-direction: column;
  }

  .engine iframe {
    height: 520px;
  }

  .footer {
    flex-direction: column;
    gap: 6px;
  }
}
EOF

cat > "${TARGET}/page.tsx" <<'EOF'
import type { Metadata } from "next";
import OrganismoV46 from "./OrganismoV46";

export const metadata: Metadata = {
  title: "Organismo V4.6 · La canción adquiere cuerpo",
  description:
    "Cámara de evolución para organismos de literatura electrónica viva.",
};

export default function OrganismoPage() {
  return <OrganismoV46 />;
}
EOF

cat > "${TARGET}/README-ORGANISMO-V46.md" <<'EOF'
# Organismo V4.6 · La canción adquiere cuerpo

## Nueva arquitectura visual

- Cámara de Evolución central con embrión 3D.
- Cuerpo musical orgánico que crece alrededor del embrión.
- Poema convertido en partitura y palabras activas iluminadas.
- Fósiles visuales de las siete fases.
- Seis canales vivos: deriva, pulso, fractura, espectral, máquina y memoria.
- Capas activas visibles en cada momento.
- Línea de evolución y transporte visual.
- Motor Strudel y código relegados al laboratorio inferior.
- Alimentación, mutación y metabolismo conservados.
- Organismo existente conservado mediante localStorage.

## Sincronización

La evolución visual puede iniciarse con el botón de transporte. También intenta
iniciarse cuando el usuario pulsa dentro del iframe de Strudel. El iframe sigue
siendo un motor externo, por lo que una sincronización de transporte totalmente
exacta requerirá integrar el motor sonoro dentro de Poema Universal.
EOF

rm -rf .next

echo ""
echo "===== VALIDANDO TYPESCRIPT ====="

if npx tsc --noEmit --pretty false; then
  echo "✅ TypeScript correcto."
else
  echo "❌ TypeScript encontró errores."
  echo "   Copia anterior disponible en:"
  echo "   ${BACKUP}"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ORGANISMO V4.6 INSTALADO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Cámara de Evolución"
echo "✅ Cuerpo musical orgánico"
echo "✅ Poema iluminado en tiempo real"
echo "✅ Fósiles de las siete fases"
echo "✅ Seis canales vivos"
echo "✅ Capas activas"
echo "✅ Motor sonoro relegado al laboratorio"
echo "✅ Embrión 3D y organismo conservados"
echo ""
echo "Arranca:"
echo "  npm run dev -- --webpack"
echo ""
echo "Abre:"
echo "  http://localhost:3000/laboratorio/verso-tecno"
