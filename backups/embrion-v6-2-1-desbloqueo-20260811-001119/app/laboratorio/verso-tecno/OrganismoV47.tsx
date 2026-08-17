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
import AmnioticLetterField from "./organismo/AmnioticLetterField";
import SymbolicImpulseConsole from "./organismo/SymbolicImpulseConsole";
import WordArchive, {
  type ArchivedWord,
} from "./organismo/WordArchive";
import {
  buildControlledSymbolicImpulses,
  buildSymbolicImpulses,
  extractWritingWords,
  type EvidenceFilter,
  type ImpulseFamilyFilter,
  type PoeticOperator,
  type SymbolicDistance,
  type SymbolicImpulse,
  type SymbolicSourceFamily,
} from "@/lib/embrion/symbolic-engine";
import {
  HABITATS,
  analizarPoema,
  bpmActual,
  despertar,
  duracionComposicionMinutos,
  evolucionarHastaHoy,
  incubar,
  injertar,
  mutarAhora,
  type Habitat,
  type Organismo,
} from "./organismo/motor";
import styles from "./organismo-v47.module.css";

const STORAGE = "organismo-electronico-v4";
const SYMBOLIC_NURSERY_STORAGE = "embrion-vivero-simbolico-v1";
const SYMBOLIC_ARCHIVE_STORAGE = "embrion-membrana-palabras-v1";
const SYMBOLIC_CONTROLS_STORAGE = "embrion-consola-simbolica-v6-2";

type KeyGlyph = {
  id: number;
  glyph: string;
  habitat: Habitat;
};

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



const LIQUID_WORD_SLOTS = [
  { left: 10, bottom: 58 },
  { left: 30, bottom: 28 },
  { left: 50, bottom: 62 },
  { left: 70, bottom: 25 },
  { left: 90, bottom: 56 },
  { left: 14, bottom: 16 },
  { left: 35, bottom: 67 },
  { left: 56, bottom: 18 },
  { left: 76, bottom: 65 },
  { left: 88, bottom: 17 },
] as const;




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

function normalizeWord(token: string): string {
  return token
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function archiveId(impulse: Pick<SymbolicImpulse, "kind" | "value">): string {
  return `${impulse.kind}:${normalizeWord(impulse.value).replace(/[^a-zñ0-9]+/g, "-")}`;
}

function archivedFromImpulse(
  impulse: SymbolicImpulse,
  timestamp = Date.now(),
): ArchivedWord {
  return {
    id: archiveId(impulse),
    value: impulse.value,
    kind: impulse.kind,
    habitat: impulse.habitat,
    nucleus: impulse.nucleus,
    nuclei: [impulse.nucleus],
    evidence: impulse.evidence,
    confidence: impulse.confidence,
    sourceLabels: impulse.sourceLabels.slice(0, 6),
    appearances: 1,
    firstSeenAt: timestamp,
    lastSeenAt: timestamp,
  };
}

function strongestEvidence(
  left: ArchivedWord["evidence"],
  right: ArchivedWord["evidence"],
): ArchivedWord["evidence"] {
  const rank: Record<ArchivedWord["evidence"], number> = {
    experimental: 0,
    curatorial: 1,
    documental: 2,
  };
  return rank[right] > rank[left] ? right : left;
}

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
  const [name, setName] = useState("");
  const [poem, setPoem] = useState("");
  const [organism, setOrganism] = useState<Organismo | null>(null);
  const [feedingText, setFeedingText] = useState("");
  const [keystrokePulse, setKeystrokePulse] = useState(0);
  const [absorptionPulse, setAbsorptionPulse] = useState(0);
  const [deletionPulse, setDeletionPulse] = useState(0);
  const [lastWord, setLastWord] = useState("");
  const [feedingHabitat, setFeedingHabitat] = useState<Habitat>("memoria");
  const [keyGlyphs, setKeyGlyphs] = useState<KeyGlyph[]>([]);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [symbolicNucleus, setSymbolicNucleus] = useState("");
  const [activeImpulse, setActiveImpulse] = useState<SymbolicImpulse | null>(null);
  const [savedImpulses, setSavedImpulses] = useState<SymbolicImpulse[]>([]);
  const [wordArchive, setWordArchive] = useState<ArchivedWord[]>([]);
  const [symbolicPulse, setSymbolicPulse] = useState(0);
  const [impulseAccelerated, setImpulseAccelerated] = useState(false);
  const [impulseAnatomyOpen, setImpulseAnatomyOpen] = useState(false);
  const [impulseFamily, setImpulseFamily] = useState<ImpulseFamilyFilter>("todas");
  const [symbolicDistance, setSymbolicDistance] = useState<SymbolicDistance>("relacional");
  const [poeticOperator, setPoeticOperator] = useState<PoeticOperator>("constelar");
  const [secondaryNucleus, setSecondaryNucleus] = useState("");
  const [symbolicSourceFamily, setSymbolicSourceFamily] = useState<SymbolicSourceFamily>("todas");
  const [symbolicEvidence, setSymbolicEvidence] = useState<EvidenceFilter>("todas");
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [playingVisual, setPlayingVisual] = useState(false);
  const [toast, setToast] = useState("");
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const startRef = useRef(0);
  const pausedAtRef = useRef(0);
  const frameRef = useRef(0);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const previousFeedingRef = useRef("");
  const keyGlyphIdRef = useRef(0);
  const symbolicIndexRef = useRef(0);

  useEffect(() => {
    let nurserySeed: SymbolicImpulse[] = [];

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

    try {
      const storedNursery = window.localStorage.getItem(
        SYMBOLIC_NURSERY_STORAGE,
      );
      if (storedNursery) {
        const parsed = JSON.parse(storedNursery) as unknown;
        if (Array.isArray(parsed)) {
          nurserySeed = parsed as SymbolicImpulse[];
          setSavedImpulses(nurserySeed);
        }
      }
    } catch {
      window.localStorage.removeItem(SYMBOLIC_NURSERY_STORAGE);
    }

    try {
      const storedControls = window.localStorage.getItem(
        SYMBOLIC_CONTROLS_STORAGE,
      );
      if (storedControls) {
        const parsed = JSON.parse(storedControls) as Record<string, unknown>;
        const families = ["todas", "palabra", "símbolo", "imagen", "materia", "verbo", "tensión"];
        const distances = ["cercana", "relacional", "remota"];
        const operators = ["constelar", "materializar", "verbalizar", "invertir", "fracturar", "desplazar", "metamorfosear", "colisionar"];
        const sourceFamilies = ["todas", "novelas", "poema_universal", "diccionarios", "imaginacion_material", "mitologia"];
        const evidences = ["todas", "documental", "curatorial", "experimental"];

        if (families.includes(String(parsed.family))) {
          setImpulseFamily(parsed.family as ImpulseFamilyFilter);
        }
        if (distances.includes(String(parsed.distance))) {
          setSymbolicDistance(parsed.distance as SymbolicDistance);
        }
        if (operators.includes(String(parsed.operator))) {
          setPoeticOperator(parsed.operator as PoeticOperator);
        }
        if (sourceFamilies.includes(String(parsed.sourceFamily))) {
          setSymbolicSourceFamily(parsed.sourceFamily as SymbolicSourceFamily);
        }
        if (evidences.includes(String(parsed.evidence))) {
          setSymbolicEvidence(parsed.evidence as EvidenceFilter);
        }
        if (typeof parsed.secondaryNucleus === "string") {
          setSecondaryNucleus(parsed.secondaryNucleus);
        }
      }
    } catch {
      window.localStorage.removeItem(SYMBOLIC_CONTROLS_STORAGE);
    }

    try {
      const storedArchive = window.localStorage.getItem(
        SYMBOLIC_ARCHIVE_STORAGE,
      );
      if (storedArchive) {
        const parsed = JSON.parse(storedArchive) as unknown;
        if (Array.isArray(parsed)) {
          setWordArchive(parsed as ArchivedWord[]);
        }
      } else if (nurserySeed.length) {
        const migrated = Array.from(
          new Map(
            nurserySeed.map((impulse, index) => {
              const archived = archivedFromImpulse(
                impulse,
                Date.now() + index,
              );
              return [archived.id, archived];
            }),
          ).values(),
        );
        setWordArchive(migrated);
        window.localStorage.setItem(
          SYMBOLIC_ARCHIVE_STORAGE,
          JSON.stringify(migrated),
        );
      }
    } catch {
      window.localStorage.removeItem(SYMBOLIC_ARCHIVE_STORAGE);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return;
    try {
      window.localStorage.setItem(
        SYMBOLIC_CONTROLS_STORAGE,
        JSON.stringify({
          family: impulseFamily,
          distance: symbolicDistance,
          operator: poeticOperator,
          secondaryNucleus,
          sourceFamily: symbolicSourceFamily,
          evidence: symbolicEvidence,
        }),
      );
    } catch {
      // La consola sigue funcionando aunque no pueda persistir preferencias.
    }
  }, [
    loading,
    impulseFamily,
    symbolicDistance,
    poeticOperator,
    secondaryNucleus,
    symbolicSourceFamily,
    symbolicEvidence,
  ]);

  const preview = useMemo(() => analizarPoema(poem), [poem]);
  const previewHasMatter = poem.trim().length >= 2;
  const durationMinutes = organism
    ? duracionComposicionMinutos(organism)
    : 0;
  const durationSeconds = Math.max(1, durationMinutes * 60);
  const phaseIndex = phaseIndexFromProgress(progress);
  const phase = PHASES[phaseIndex];
  const intensity = phase.intensity;
  const provisionalWords = useMemo(
    () => wordsOf(feedingText).length,
    [feedingText],
  );
  const selectableSymbolicWords = useMemo(
    () => extractWritingWords(feedingText),
    [feedingText],
  );
  const sedimentWords = useMemo(
    () =>
      extractWritingWords(
        [...(organism?.injertos ?? []), feedingText]
          .filter(Boolean)
          .join(" "),
      ),
    [organism?.injertos, feedingText],
  );
  const symbolicImpulses = useMemo(
    () =>
      buildControlledSymbolicImpulses(symbolicNucleus, feedingText, {
        family: impulseFamily,
        distance: symbolicDistance,
        operator: poeticOperator,
        secondaryNucleus,
        sourceFamily: symbolicSourceFamily,
        evidence: symbolicEvidence,
      }),
    [
      symbolicNucleus,
      feedingText,
      impulseFamily,
      symbolicDistance,
      poeticOperator,
      secondaryNucleus,
      symbolicSourceFamily,
      symbolicEvidence,
    ],
  );
  const committedWords = useMemo(
    () => wordsOf(organism?.injertos.join(" ") ?? "").length,
    [organism?.injertos],
  );
  const biomassRatio = clamp(
    1 - Math.exp(-(committedWords * 1.1 + provisionalWords * 3.2) / 34),
  );

  useEffect(() => {
    if (selectableSymbolicWords.length === 0) {
      setSymbolicNucleus("");
      setActiveImpulse(null);
      setImpulseAnatomyOpen(false);
      return;
    }

    if (!symbolicNucleus) {
      setSymbolicNucleus(
        selectableSymbolicWords[selectableSymbolicWords.length - 1],
      );
    }
  }, [selectableSymbolicWords, symbolicNucleus]);

  useEffect(() => {
    if (!secondaryNucleus) return;
    const secondaryStillExists = selectableSymbolicWords.some(
      (word) => normalizeWord(word) === normalizeWord(secondaryNucleus),
    );
    if (
      !secondaryStillExists ||
      normalizeWord(secondaryNucleus) === normalizeWord(symbolicNucleus)
    ) {
      setSecondaryNucleus("");
    }
  }, [selectableSymbolicWords, secondaryNucleus, symbolicNucleus]);

  useEffect(() => {
    symbolicIndexRef.current = 0;
    setActiveImpulse(null);
    setImpulseAnatomyOpen(false);

    if (!symbolicNucleus || symbolicImpulses.length === 0) return;

    const timer = window.setTimeout(() => {
      const first = symbolicImpulses[0];
      symbolicIndexRef.current = 1;
      revealImpulse(first);
    }, 920);

    return () => window.clearTimeout(timer);
  }, [symbolicNucleus, symbolicImpulses]);

  useEffect(() => {
    if (!symbolicNucleus || symbolicImpulses.length === 0) return;

    const interval = window.setInterval(() => {
      const index = symbolicIndexRef.current % symbolicImpulses.length;
      const next = symbolicImpulses[index];
      symbolicIndexRef.current = index + 1;
      revealImpulse(next);
    }, impulseAccelerated ? 1450 : 5200);

    return () => window.clearInterval(interval);
  }, [symbolicNucleus, symbolicImpulses, impulseAccelerated]);

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

  function revealImpulse(impulse: SymbolicImpulse) {
    setActiveImpulse(impulse);
    setSymbolicPulse((value) => value + 1);
    setLastWord(impulse.value);
    setFeedingHabitat(impulse.habitat as Habitat);
    setAbsorptionPulse((value) => value + 1);
    setImpulseAnatomyOpen(false);
    archiveImpulse(impulse);
  }

  function archiveImpulse(impulse: SymbolicImpulse) {
    const timestamp = Date.now();
    const id = archiveId(impulse);

    setWordArchive((current) => {
      const existing = current.find((entry) => entry.id === id);
      const nextEntry = existing
        ? {
            ...existing,
            value: impulse.value,
            habitat: impulse.habitat,
            nucleus: impulse.nucleus,
            nuclei: Array.from(
              new Set([...existing.nuclei, impulse.nucleus]),
            ).slice(-12),
            evidence: strongestEvidence(existing.evidence, impulse.evidence),
            confidence: Math.max(existing.confidence, impulse.confidence),
            sourceLabels: Array.from(
              new Set([...existing.sourceLabels, ...impulse.sourceLabels]),
            ).slice(0, 8),
            appearances: existing.appearances + 1,
            lastSeenAt: timestamp,
          }
        : archivedFromImpulse(impulse, timestamp);
      const next = [
        ...current.filter((entry) => entry.id !== id),
        nextEntry,
      ];

      try {
        window.localStorage.setItem(
          SYMBOLIC_ARCHIVE_STORAGE,
          JSON.stringify(next),
        );
      } catch {
        // El archivo visible continúa vivo aunque el navegador agote su cuota.
      }

      return next;
    });
  }

  function emitSymbolicImpulse() {
    if (!symbolicImpulses.length) return;
    const index = symbolicIndexRef.current % symbolicImpulses.length;
    symbolicIndexRef.current = index + 1;
    revealImpulse(symbolicImpulses[index]);
  }

  function chooseSymbolicNucleus(word: string) {
    const next = word.trim();
    if (!next) return;
    setSymbolicNucleus(next);
    setLastWord(next);
    setFeedingHabitat(dominantHabitat(next));
    setAbsorptionPulse((value) => value + 2);
  }

  function keepImpulse(impulse: SymbolicImpulse) {
    const next = [
      ...savedImpulses.filter((item) => item.id !== impulse.id),
      impulse,
    ];
    setSavedImpulses(next);
    window.localStorage.setItem(
      SYMBOLIC_NURSERY_STORAGE,
      JSON.stringify(next),
    );
    notify(`«${impulse.value}» permanece en el vivero.`);
  }

  function insertImpulse(impulse: SymbolicImpulse) {
    const separator = feedingText.length && !/[\s\n]$/u.test(feedingText)
      ? " "
      : "";
    const next = `${feedingText}${separator}${impulse.value}`.slice(0, 1200);
    setFeedingText(next);
    previousFeedingRef.current = next;
    setLastWord(impulse.value);
    setFeedingHabitat(impulse.habitat as Habitat);
    setAbsorptionPulse((value) => value + 2);
    notify("El impulso entró en el campo de escritura por decisión tuya.");
  }

  function insertAssembly(entries: ArchivedWord[]) {
    if (!entries.length) return;
    const passage = entries.map((entry) => entry.value).join(" · ");
    const separator = feedingText.trim() ? "\n" : "";
    const next = `${feedingText}${separator}${passage}`.slice(0, 1200);
    setFeedingText(next);
    previousFeedingRef.current = next;
    const last = entries.at(-1);
    if (last) {
      setLastWord(last.value);
      setFeedingHabitat(last.habitat as Habitat);
    }
    setAbsorptionPulse((value) => value + Math.min(5, entries.length));
    notify(`${entries.length} formas han vuelto al campo de escritura como una secuencia.`);
  }

  function promoteImpulse(impulse: SymbolicImpulse) {
    setSymbolicNucleus(impulse.value);
    setLastWord(impulse.value);
    setFeedingHabitat(impulse.habitat as Habitat);
    notify(`«${impulse.value}» es ahora el centro de gravedad.`);
  }

  function recallArchivedWord(entry: ArchivedWord) {
    const recovered = buildSymbolicImpulses(entry.nucleus, feedingText).find(
      (impulse) =>
        impulse.kind === entry.kind &&
        normalizeWord(impulse.value) === normalizeWord(entry.value),
    );

    if (recovered) {
      setSymbolicNucleus(recovered.nucleus);
      revealImpulse(recovered);
      notify(`«${entry.value}» ha regresado desde la membrana.`);
      return;
    }

    setSymbolicNucleus(entry.value);
    setLastWord(entry.value);
    setFeedingHabitat(entry.habitat as Habitat);
    setAbsorptionPulse((value) => value + 2);
    notify(`«${entry.value}» vuelve como un nuevo centro de gravedad.`);
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
    setLastWord(word);
    setFeedingHabitat(habitat);
    setAbsorptionPulse((value) => value + 1);

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

    const glyph =
      event.key === " "
        ? "·"
        : event.key === "Enter"
          ? "↵"
          : event.key === "Backspace" || event.key === "Delete"
            ? "⌫"
            : event.key.length === 1
              ? event.key
              : "";

    if (glyph) {
      const id = keyGlyphIdRef.current + 1;
      keyGlyphIdRef.current = id;
      setKeyGlyphs((current) => [
        ...current.slice(-10),
        { id, glyph, habitat: feedingHabitat },
      ]);
      window.setTimeout(() => {
        setKeyGlyphs((current) =>
          current.filter((item) => item.id !== id),
        );
      }, 980);
    }

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


  function clearOrganismAndOpenIncubator() {
    window.cancelAnimationFrame(frameRef.current);

    // Remove every historical local key used by this laboratory.
    const keysToRemove: string[] = [];
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (
        key &&
        (
          key === STORAGE ||
          key.startsWith("organismo-electronico-") ||
          key.startsWith("verso-tecno-")
        )
      ) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => window.localStorage.removeItem(key));

    previousFeedingRef.current = "";
    pausedAtRef.current = 0;
    startRef.current = 0;

    setPlayingVisual(false);
    setProgress(0);
    setFeedingText("");
    setKeystrokePulse(0);
    setAbsorptionPulse(0);
    setDeletionPulse(0);
    setLastWord("");
    setFeedingHabitat("memoria");
    setKeyGlyphs([]);
    setTotalKeystrokes(0);
    setSymbolicNucleus("");
    setActiveImpulse(null);
    setSymbolicPulse(0);
    setImpulseAccelerated(false);
    setImpulseAnatomyOpen(false);
    symbolicIndexRef.current = 0;
    setToast("");
    setResetDialogOpen(false);
    setName("");
    setPoem("");
    setOrganism(null);
  }

  function release() {
    setPlayingVisual(false);
    setResetDialogOpen(true);
  }

  function confirmNewPoem() {
    clearOrganismAndOpenIncubator();
  }

  function createAnotherPoemDirectly() {
    const accepted = window.confirm(
      "¿Borrar el poema y el organismo actuales para crear uno nuevo? " +
        "Esta acción elimina también sus injertos y su memoria local.",
    );

    if (!accepted) return;
    clearOrganismAndOpenIncubator();
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
              <h1>EMBRIÓN DIRECTOR 1.0</h1>
            </div>
          </div>
          <p>Nuevo ciclo poético</p>
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
                placeholder="Nombre del nuevo organismo"
              />
            </label>

            <label>
              <span>Poema</span>
              <textarea
                value={poem}
                onChange={(event) =>
                  setPoem(event.target.value.slice(0, 5000))
                }
                placeholder="Escribe o pega aquí un poema nuevo…"
              />
            </label>

            <div className={styles.birthUtility}>
              <button
                type="button"
                onClick={() => {
                  setPoem(POEMA_INICIAL);
                  setName("La luz que permanece");
                }}
              >
                CARGAR POEMA DE MUESTRA
              </button>
              <span>{wordsOf(poem).length} PALABRAS</span>
            </div>

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
              <strong>{previewHasMatter ? preview.reliquia : "—"}</strong>
              <span>
                {previewHasMatter
                  ? `${preview.bpmBase} BPM · ${preview.tonalidad}`
                  : "ESPERANDO MATERIA POÉTICA"}
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
                          width: `${
                            previewHasMatter
                              ? preview.habitats[habitat]
                              : 0
                          }%`,
                        }}
                      />
                    </i>
                    <strong>
                      {previewHasMatter
                        ? preview.habitats[habitat]
                        : 0}
                      %
                    </strong>
                  </div>
                ))}
            </div>
          </aside>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.backgroundGrid} />
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <span>O/E</span>
          <div>
            <small>EMBRIÓN DIRECTOR 1.0</small>
            <h1>Alimentación verbal · Rotación anatómica</h1>
          </div>
        </div>

        <button
          type="button"
          className={styles.newPoemButton}
          onClick={release}
        >
          <span>NUEVO POEMA</span>
          <b>＋</b>
        </button>

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

            <div
              className={[
                styles.chamberVisual,
                feedingText ? styles.chamberFeeding : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
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

              <div className={styles.amnioticAlphabet} aria-hidden="true">
                <AmnioticLetterField
                  nucleus={symbolicNucleus}
                  impulse={activeImpulse?.value}
                  pulse={symbolicPulse}
                  active={Boolean(symbolicNucleus)}
                />
              </div>

              <div className={styles.amnioticLiquid} aria-hidden="true">
                <div className={styles.liquidSurface} />
                <div className={styles.liquidCaustics} />

                <div className={styles.liquidBubbles}>
                  {Array.from({ length: 18 }, (_, index) => (
                    <i key={index} style={{ left: `${5 + ((index * 37) % 91)}%`, animationDelay: `${-index * 0.61}s` }} />
                  ))}
                </div>

                <div className={styles.liquidWords}>
                  {sedimentWords.slice(-LIQUID_WORD_SLOTS.length).map((word, index) => {
                    const slot = LIQUID_WORD_SLOTS[index];
                    const isNucleus =
                      normalizeWord(word) === normalizeWord(symbolicNucleus);
                    const visibleWord =
                      word.length > 17 ? `${word.slice(0, 15)}…` : word;

                    return (
                      <span
                        key={`${word}-${index}`}
                        data-nucleus={isNucleus ? "true" : "false"}
                        style={{
                          left: `${slot.left}%`,
                          bottom: `${slot.bottom}%`,
                          animationDelay: `${Math.min(index * 45, 360)}ms`,
                        }}
                      >
                        <i>{visibleWord}</i>
                      </span>
                    );
                  })}
                </div>

                <small>SEDIMENTO VERBAL · {sedimentWords.length} PALABRAS</small>
              </div>

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
                <div
                  className={styles.biomassAura}
                  style={{
                    transform: `translate(-50%, -50%) scale(${0.72 + biomassRatio * 0.72})`,
                    opacity: 0.12 + biomassRatio * 0.46,
                  }}
                />

                {keystrokePulse > 0 ? (
                  <div
                    key={`key-wave-${keystrokePulse}`}
                    className={styles.keystrokeWave}
                  />
                ) : null}

                {absorptionPulse > 0 ? (
                  <div
                    key={`absorption-wave-${absorptionPulse}`}
                    className={styles.absorptionWave}
                  />
                ) : null}

                {feedingText ? (
                  <div className={styles.feedingSignal}>
                    <span />
                    RECIBIENDO MATERIA · {provisionalWords} PALABRAS
                  </div>
                ) : null}

                <div className={styles.biomassReadout}>
                  <span>CRECIMIENTO VERBAL</span>
                  <strong>+{Math.round(biomassRatio * 48)}%</strong>
                </div>

                {keyGlyphs.map((item) => (
                  <span
                    key={item.id}
                    className={styles.keyGlyph}
                    data-habitat={item.habitat}
                  >
                    {item.glyph}
                  </span>
                ))}

                {activeImpulse ? (
                  <div
                    key={`symbolic-${symbolicPulse}-${activeImpulse.id}`}
                    className={styles.symbolicEmission}
                    data-habitat={activeImpulse.habitat}
                  >
                    <span>{activeImpulse.kind}</span>
                    <strong>{activeImpulse.value}</strong>
                    <i />
                  </div>
                ) : null}

                <div className={styles.amnioticLegend}>
                  <span>LETRAS EN LATENCIA</span>
                  <strong>
                    {symbolicNucleus
                      ? `GRAVEDAD · ${symbolicNucleus.toLocaleUpperCase("es")}`
                      : "ARCHIVO DORMIDO"}
                  </strong>
                </div>
              </div>
            </div>

            <blockquote>“{feedingText ? `Recibiendo «${lastWord || "materia"}».` : phase.narrative}”</blockquote>
          </article>

          <WordArchive
            entries={wordArchive}
            savedImpulses={savedImpulses}
            onRecall={recallArchivedWord}
            onAssemble={insertAssembly}
          />
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

            <div className={styles.liveGrowth}>
              <div>
                <span>CRECIMIENTO EN TIEMPO REAL</span>
                <strong>+{Math.round(biomassRatio * 48)}%</strong>
              </div>
              <i>
                <b style={{ width: `${Math.max(2, biomassRatio * 100)}%` }} />
              </i>
            </div>

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

            <button
              type="button"
              className={styles.createAnotherPoem}
              onClick={createAnotherPoemDirectly}
            >
              <span>BORRAR ESTE POEMA</span>
              <b>CREAR UN ORGANISMO NUEVO ＋</b>
            </button>
          </section>

          <SymbolicImpulseConsole
            text={feedingText}
            nucleus={symbolicNucleus}
            secondaryNucleus={secondaryNucleus}
            activeImpulse={activeImpulse}
            accelerated={impulseAccelerated}
            anatomyOpen={impulseAnatomyOpen}
            savedImpulses={savedImpulses}
            impulseCount={symbolicImpulses.length}
            archiveCount={wordArchive.length}
            family={impulseFamily}
            distance={symbolicDistance}
            operator={poeticOperator}
            sourceFamily={symbolicSourceFamily}
            evidence={symbolicEvidence}
            onChooseNucleus={chooseSymbolicNucleus}
            onChooseSecondaryNucleus={setSecondaryNucleus}
            onFamilyChange={setImpulseFamily}
            onDistanceChange={setSymbolicDistance}
            onOperatorChange={setPoeticOperator}
            onSourceFamilyChange={setSymbolicSourceFamily}
            onEvidenceChange={setSymbolicEvidence}
            onEmit={emitSymbolicImpulse}
            onToggleAcceleration={() =>
              setImpulseAccelerated((value) => !value)
            }
            onToggleAnatomy={() =>
              setImpulseAnatomyOpen((value) => !value)
            }
            onKeep={keepImpulse}
            onInsert={insertImpulse}
            onDiscard={() => {
              setActiveImpulse(null);
              window.setTimeout(emitSymbolicImpulse, 180);
            }}
            onPromote={promoteImpulse}
          />

        </aside>
      </section>

      {resetDialogOpen ? (
        <div
          className={styles.resetOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-organism-title"
        >
          <section className={styles.resetDialog}>
            <span className={styles.resetEyebrow}>NUEVO CICLO POÉTICO</span>
            <h2 id="reset-organism-title">
              ¿Borrar este organismo?
            </h2>
            <p>
              Se eliminarán el poema, sus injertos, la evolución,
              la memoria musical y los datos guardados en este navegador.
              Después volverás a una cámara de incubación vacía.
            </p>

            <div className={styles.resetIdentity}>
              <span>{organism.codigo}</span>
              <strong>{organism.nombre}</strong>
              <small>«{organism.reliquia}»</small>
            </div>

            <div className={styles.resetActions}>
              <button
                type="button"
                onClick={() => setResetDialogOpen(false)}
              >
                CONSERVAR ORGANISMO
              </button>
              <button type="button" onClick={confirmNewPoem}>
                BORRAR Y ESCRIBIR OTRO
              </button>
            </div>
          </section>
        </div>
      ) : null}

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
