"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";

import { analyzeSoul } from "../ojos-de-borges/symbolic-client";
import type {
  BorgesInput,
  SymbolicReading,
} from "../ojos-de-borges/symbolic-contract";

import styles from "./AtlasInterior.module.css";

type AtlasWork = {
  id: string;
  createdAt: string;
  input: BorgesInput;
  reading: SymbolicReading;
};

type SymbolAggregate = {
  name: string;
  count: number;
  intensity: number;
  works: string[];
  functions: string[];
  archetypes: string[];
};

type ArchetypeAggregate = {
  key: string;
  name: string;
  count: number;
  totalIntensity: number;
  functions: string[];
};

const STORAGE_KEY = "poema-universal:atlas-interior:v1";

const INITIAL_INPUT: BorgesInput = {
  title: "",
  author: "",
  language: "Español",
  poem: "",
  translation: "",
  notes: "",
};

function normalize(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}


/* SOUL MAP SYMBOL NORMALIZATION V1.1 */

type SoulMapSymbolEntry = {
  name: string;
  count: number;
  intensity: number;
  works: string[];
  functions: string[];
  archetypes: string[];
};

function canonicalSoulName(rawName: string): string {
  const original = rawName.trim();

  const normalized = original
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const rules: Array<[RegExp, string]> = [
    [/cuadernos?|paginas?/, "Cuaderno"],
    [/arbol blanco|arbol incendiado/, "Árbol Blanco"],
    [/mesa|geometria|numeros?/, "Mesa"],
    [/mano cerrada|puño|gesto/, "Mano cerrada"],
    [/mar|franja de mar/, "Mar"],
    [/balas?|disparos?/, "Disparo"],
    [/lista de nombres?|nombres? escritos?/, "Lista de nombres"],
    [/fuego|incendio|llamas?/, "Fuego"],
    [/casa refugio|hogar integro|casa/, "Casa"],
    [/hojas?|pagina arrancada/, "Hoja"],
    [/perros?|can|doberman/, "Perro"],
    [/laberinto|muros?/, "Laberinto"],
  ];

  for (const [pattern, canonical] of rules) {
    if (pattern.test(normalized)) {
      return canonical;
    }
  }

  const firstMeaningfulPart = original
    .split(/\s*\/\s*|\s*·\s*|\s*→\s*/)
    .map((part) => part.trim())
    .find(Boolean);

  return firstMeaningfulPart || original;
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter(Boolean)),
  );
}

function buildSoulMapSymbols(
  source: SoulMapSymbolEntry[],
): SoulMapSymbolEntry[] {
  const merged = new Map<string, SoulMapSymbolEntry>();

  source.forEach((symbol) => {
    const name = canonicalSoulName(symbol.name);
    const key = name.toLocaleLowerCase("es");

    const current = merged.get(key);

    if (!current) {
      merged.set(key, {
        ...symbol,
        name,
        works: uniqueStrings(symbol.works),
        functions: uniqueStrings(symbol.functions),
        archetypes: uniqueStrings(symbol.archetypes),
      });
      return;
    }

    merged.set(key, {
      name,
      count: current.count + symbol.count,
      intensity: Math.max(current.intensity, symbol.intensity),
      works: uniqueStrings([...current.works, ...symbol.works]),
      functions: uniqueStrings([
        ...current.functions,
        ...symbol.functions,
      ]),
      archetypes: uniqueStrings([
        ...current.archetypes,
        ...symbol.archetypes,
      ]),
    });
  });

  return Array.from(merged.values()).sort(
    (left, right) =>
      right.count - left.count ||
      right.intensity - left.intensity,
  );
}

type SoulMapScope = "author" | "work" | "cycle";


/* SOUL MAP COMPOSITION TYPES V1 */

type SoulMapComposition =
  | "constellation"
  | "tree"
  | "labyrinth"
  | "river";

type SoulSymbolFamily =
  | "cosmos"
  | "element"
  | "plant"
  | "animal"
  | "body"
  | "house"
  | "object"
  | "journey"
  | "rite"
  | "spirit";

function chooseSoulMapComposition(
  family: SoulSymbolFamily | null,
  symbolNames: string[],
): SoulMapComposition {
  const corpus = symbolNames
    .join(" ")
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (
    family === "plant" ||
    /arbol|raiz|bosque|rama|hoja|semilla|jardin/.test(corpus)
  ) {
    return "tree";
  }

  if (
    family === "house" ||
    /laberinto|muro|puerta|casa|habitacion|pasillo|centro/.test(corpus)
  ) {
    return "labyrinth";
  }

  if (
    family === "element" ||
    family === "journey" ||
    /mar|rio|agua|lluvia|barco|estacion|camino|viaje/.test(corpus)
  ) {
    return "river";
  }

  return "constellation";
}

export default function AtlasInteriorPage() {
  const [works, setWorks] = useState<AtlasWork[]>([]);
  const [input, setInput] = useState<BorgesInput>(INITIAL_INPUT);
  const [status, setStatus] = useState<"idle" | "reading" | "error">("idle");
  const [error, setError] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [activeRoom, setActiveRoom] = useState<
    | "soulmap"
    | "constellation"
    | "symbols"
    | "archetypes"
    | "relics"
    | "movement"
    | "archive"
  >("soulmap");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as AtlasWork[];
      if (Array.isArray(parsed)) setWorks(parsed);
    } catch {
      setError("No fue posible abrir la memoria local del Atlas.");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(works));
  }, [works]);

  const symbols = useMemo<SymbolAggregate[]>(() => {
    const map = new Map<string, SymbolAggregate>();

    for (const work of works) {
      for (const symbol of work.reading.symbols) {
        const key = normalize(symbol.label);
        const current = map.get(key) ?? {
          name: symbol.label,
          count: 0,
          intensity: 0,
          works: [],
          functions: [],
          archetypes: [],
        };

        current.count += 1;
        current.intensity += symbol.intensity;
        current.works.push(work.reading.poemTitle);
        current.functions.push(symbol.symbolicFunction);
        current.archetypes.push(work.reading.dominantArchetype.name);

        map.set(key, current);
      }
    }

    return [...map.values()]
      .map((item) => ({
        ...item,
        works: unique(item.works),
        functions: unique(item.functions),
        archetypes: unique(item.archetypes),
        intensity: Math.round(item.intensity / item.count),
      }))
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return b.intensity - a.intensity;
      });
  }, [works]);

  const archetypes = useMemo<ArchetypeAggregate[]>(() => {
    const map = new Map<string, ArchetypeAggregate>();

    for (const work of works) {
      const readings = [
        work.reading.dominantArchetype,
        work.reading.compensatoryArchetype,
        ...work.reading.secondaryArchetypes,
      ];

      for (const reading of readings) {
        const current = map.get(reading.key) ?? {
          key: reading.key,
          name: reading.name,
          count: 0,
          totalIntensity: 0,
          functions: [],
        };

        current.count += 1;
        current.totalIntensity += reading.intensity;
        current.functions.push(reading.function);
        map.set(reading.key, current);
      }
    }

    return [...map.values()]
      .map((item) => ({
        ...item,
        functions: unique(item.functions),
      }))
      .sort((a, b) => b.totalIntensity - a.totalIntensity);
  }, [works]);

  const selected = symbols.find(
    (symbol) => normalize(symbol.name) === normalize(selectedSymbol ?? "")
  ) ?? symbols[0] ?? null;

  const absences = useMemo(
    () =>
      unique(
        works.map((work) => work.reading.absentSymbol.name)
      ),
    [works]
  );

  const relics = useMemo(
    () =>
      unique(
        works.map((work) => work.reading.relic)
      ),
    [works]
  );

  const gestures = useMemo(
    () =>
      unique(
        works.map((work) => work.reading.soulMovement.individuationGesture)
      ),
    [works]
  );

  const emerging = symbols.filter(
    (symbol) => symbol.count === 1 && symbol.intensity >= 70
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (input.poem.trim().length < 40) return;

    setStatus("reading");
    setError("");

    try {
      const reading = await analyzeSoul(input);

      const work: AtlasWork = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        input,
        reading,
      };

      setWorks((current) => [work, ...current]);
      setInput(INITIAL_INPUT);
      setStatus("idle");
      setActiveRoom("constellation");
    } catch (caught) {
      setStatus("error");
      setError(
        caught instanceof Error
          ? caught.message
          : "El Atlas no pudo incorporar la obra."
      );
    }
  }

  function removeWork(id: string) {
    setWorks((current) => current.filter((work) => work.id !== id));
  }

  function clearAtlas() {
    const accepted = window.confirm(
      "¿Borrar todas las obras y la memoria local del Atlas Interior?"
    );

    if (!accepted) return;

    setWorks([]);
    setSelectedSymbol(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }



  /* SOUL MAP SCOPE SELECTOR V1 */
  const [soulMapScope, setSoulMapScope] =
    useState<SoulMapScope>("author");

  const [soulMapWorkId, setSoulMapWorkId] =
    useState<string>("");

  const [soulMapCycleIds, setSoulMapCycleIds] =
    useState<string[]>([]);

  const effectiveSoulMapWorkId =
    soulMapWorkId || works[0]?.id || "";

  const soulMapWorks = useMemo(() => {
    if (soulMapScope === "work") {
      const selectedWork = works.find(
        (work) => work.id === effectiveSoulMapWorkId,
      );

      return selectedWork ? [selectedWork] : [];
    }

    if (soulMapScope === "cycle") {
      return works.filter((work) =>
        soulMapCycleIds.includes(work.id),
      );
    }

    return works;
  }, [
    works,
    soulMapScope,
    effectiveSoulMapWorkId,
    soulMapCycleIds,
  ]);

  function toggleSoulMapCycleWork(id: string) {
    setSoulMapCycleIds((current) =>
      current.includes(id)
        ? current.filter((workId) => workId !== id)
        : [...current, id],
    );
  }


  /* SOUL MAP DERIVED DATA V1.2 */
  const scopedSoulMapSymbols = useMemo(
    () =>
      buildSoulMapSymbols(
        soulMapWorks.flatMap((work) =>
          work.reading.symbols.map((symbol) => ({
            name: symbol.label,
            count: 1,
            intensity: symbol.intensity,
            works: [work.reading.poemTitle],
            functions: [symbol.symbolicFunction],
            archetypes: [
              work.reading.dominantArchetype.name,
            ],
          })),
        ),
      ),
    [soulMapWorks],
  );

  const scopedSoulMapArchetypes = useMemo(() => {
    const map = new Map<
      string,
      {
        key: string;
        name: string;
        count: number;
        totalIntensity: number;
        functions: string[];
      }
    >();

    soulMapWorks.forEach((work) => {
      const readings = [
        work.reading.dominantArchetype,
        work.reading.compensatoryArchetype,
        ...work.reading.secondaryArchetypes,
      ];

      readings.forEach((reading) => {
        const current = map.get(reading.key) ?? {
          key: reading.key,
          name: reading.name,
          count: 0,
          totalIntensity: 0,
          functions: [],
        };

        current.count += 1;
        current.totalIntensity += reading.intensity;
        current.functions = unique([
          ...current.functions,
          reading.function,
        ]);

        map.set(reading.key, current);
      });
    });

    return Array.from(map.values()).sort(
      (left, right) =>
        right.totalIntensity - left.totalIntensity,
    );
  }, [soulMapWorks]);

  const scopedSoulMapAbsences = useMemo(
    () =>
      unique(
        soulMapWorks.map(
          (work) => work.reading.absentSymbol.name,
        ),
      ),
    [soulMapWorks],
  );

  const scopedSoulMapRelics = useMemo(
    () =>
      unique(
        soulMapWorks.map((work) => work.reading.relic),
      ),
    [soulMapWorks],
  );

  const scopedSoulMapGestures = useMemo(
    () =>
      unique(
        soulMapWorks.map(
          (work) =>
            work.reading.soulMovement.individuationGesture,
        ),
      ),
    [soulMapWorks],
  );

  const scopedSoulMapEmerging =
    scopedSoulMapSymbols.filter(
      (symbol) =>
        symbol.count === 1 &&
        symbol.intensity >= 70,
    );

  const soulMapSymbols = scopedSoulMapSymbols;
  const soulCore = soulMapSymbols[0];

  const soulOrbit = soulMapSymbols
    .filter(
      (symbol) => symbol.name !== soulCore?.name,
    )
    .slice(0, 8);

  const soulEmerging = buildSoulMapSymbols(
    scopedSoulMapEmerging,
  ).find(
    (symbol) => symbol.name !== soulCore?.name,
  );



  /* SOUL MAP COMPOSITION ENGINE V1 */

  const soulFamilyScores = useMemo(() => {
    const scores = new Map<SoulSymbolFamily, number>();

    soulMapWorks.forEach((work) => {
      work.reading.symbols.forEach((symbol) => {
        const family = symbol.family as SoulSymbolFamily;
        const current = scores.get(family) ?? 0;

        scores.set(
          family,
          current + Math.max(1, symbol.intensity),
        );
      });
    });

    return Array.from(scores.entries()).sort(
      (left, right) => right[1] - left[1],
    );
  }, [soulMapWorks]);

  const dominantSoulFamily =
    soulFamilyScores[0]?.[0] ?? null;

  const soulMapComposition = chooseSoulMapComposition(
    dominantSoulFamily,
    soulMapSymbols.map((symbol) => symbol.name),
  );

  const soulMapCompositionLabel: Record<
    SoulMapComposition,
    string
  > = {
    constellation: "Constelación",
    tree: "Árbol",
    labyrinth: "Laberinto",
    river: "Río",
  };

  const soulMapCompositionClass =
    soulMapComposition === "tree"
      ? styles.compositionTree
      : soulMapComposition === "labyrinth"
        ? styles.compositionLabyrinth
        : soulMapComposition === "river"
          ? styles.compositionRiver
          : styles.compositionConstellation;

  const soulMapNodePositions: Record<
    SoulMapComposition,
    Array<[number, number]>
  > = {
    constellation: [
      [500, 110],
      [714, 170],
      [842, 335],
      [755, 535],
      [500, 630],
      [252, 538],
      [160, 332],
      [282, 170],
    ],

    tree: [
      [500, 108],
      [365, 185],
      [635, 185],
      [275, 305],
      [725, 305],
      [335, 505],
      [665, 505],
      [500, 635],
    ],

    labyrinth: [
      [500, 148],
      [688, 215],
      [790, 365],
      [684, 535],
      [500, 596],
      [316, 535],
      [210, 365],
      [312, 215],
    ],

    river: [
      [150, 245],
      [270, 330],
      [390, 420],
      [510, 475],
      [630, 430],
      [745, 350],
      [850, 270],
      [690, 585],
    ],
  };


  /* CARTOGRAPHY ARCHIVE DATA FIX V1 */

  const archiveEntries = useMemo(
    () =>
      works.map((work) => {
        const familyScores = new Map<string, number>();

        work.reading.symbols.forEach((symbol) => {
          familyScores.set(
            symbol.family,
            (familyScores.get(symbol.family) ?? 0) +
              Math.max(1, symbol.intensity),
          );
        });

        const dominantFamily =
          Array.from(familyScores.entries()).sort(
            (left, right) => right[1] - left[1],
          )[0]?.[0] ?? "cosmos";

        const symbolCorpus = work.reading.symbols
          .map((symbol) => symbol.label)
          .join(" ")
          .toLocaleLowerCase("es")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

        const composition =
          dominantFamily === "plant" ||
          /arbol|raiz|rama|hoja|bosque|semilla/.test(
            symbolCorpus,
          )
            ? "tree"
            : dominantFamily === "house" ||
                /laberinto|muro|puerta|casa|habitacion/.test(
                  symbolCorpus,
                )
              ? "labyrinth"
              : dominantFamily === "element" ||
                  dominantFamily === "journey" ||
                  /mar|rio|agua|lluvia|barco|camino|estacion/.test(
                    symbolCorpus,
                  )
                ? "river"
                : "constellation";

        const compositionLabel =
          composition === "tree"
            ? "Árbol"
            : composition === "labyrinth"
              ? "Laberinto"
              : composition === "river"
                ? "Río"
                : "Constelación";

        return {
          id: work.id,
          title:
            work.reading.poemTitle?.trim() ||
            work.input.title?.trim() ||
            "Obra sin título",

          author:
            work.input.author?.trim() ||
            "Autor sin nombre",

          createdAt: work.createdAt,
          composition,
          compositionLabel,

          symbol:
            work.reading.rulingSymbol?.name ||
            work.reading.symbols[0]?.label ||
            "Símbolo no revelado",

          archetype:
            work.reading.dominantArchetype?.name ||
            "Arquetipo no revelado",

          relic:
            work.reading.relic ||
            "Reliquia no revelada",

          verse:
            work.reading.entryVerse?.trim() ||
            work.input.poem
              .trim()
              .split("\n")[0]
              .slice(0, 180),
        };
      }),
    [works],
  );


  return (
    <main className={styles.page}>
      <div className={styles.stars} />

      <header className={styles.topbar}>
        <Link href="/poema-universal" className={styles.brand}>
          ✦ POEMA UNIVERSAL
        </Link>

        <nav>
          <Link href="/poema-universal/matriz-poetica">Matriz Poética</Link>
          <Link href="/poema-universal/ojos-de-borges">Los ojos de Borges</Link>
          <strong>Atlas Interior</strong>
        </nav>
      </header>

      <section className={styles.hero}>
        <p>La memoria simbólica de tu escritura</p>
        <h1>Atlas Interior</h1>
        <blockquote>
          El Atlas no dice quién eres. Conserva la memoria de las formas
          con las que tu obra intenta conocerse.
        </blockquote>
        <span>
          Cada obra incorporada amplía una constelación privada de símbolos,
          arquetipos, reliquias, ausencias y transformaciones.
        </span>
      </section>

      <section className={styles.metrics}>
        <article><strong>{works.length}</strong><span>Obras</span></article>
        <article><strong>{symbols.length}</strong><span>Símbolos vivos</span></article>
        <article><strong>{archetypes.length}</strong><span>Arquetipos</span></article>
        <article><strong>{emerging.length}</strong><span>Símbolos nacientes</span></article>
      </section>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <form onSubmit={submit} className={styles.form}>
            <header>
              <p>Incorporar una obra</p>
              <span>
                Se analizará mediante Los ojos de Borges y se guardará
                únicamente en este navegador.
              </span>
            </header>

            <label>
              <span>Título</span>
              <input
                value={input.title}
                onChange={(event) =>
                  setInput((current) => ({ ...current, title: event.target.value }))
                }
              />
            </label>

            <label>
              <span>Autor o seudónimo</span>
              <input
                value={input.author}
                onChange={(event) =>
                  setInput((current) => ({ ...current, author: event.target.value }))
                }
              />
            </label>

            <label>
              <span>Obra</span>
              <textarea
                value={input.poem}
                placeholder="Poema, relato o fragmento…"
                onChange={(event) =>
                  setInput((current) => ({ ...current, poem: event.target.value }))
                }
              />
              <small>{input.poem.length} / 8000</small>
            </label>

            <label>
              <span>Nota opcional</span>
              <textarea
                className={styles.compact}
                value={input.notes}
                onChange={(event) =>
                  setInput((current) => ({ ...current, notes: event.target.value }))
                }
              />
            </label>

            {error && <p className={styles.error}>{error}</p>}

            <button
              type="submit"
              disabled={status === "reading" || input.poem.trim().length < 40}
            >
              {status === "reading"
                ? "Constelando la obra"
                : "Incorporar al Atlas"}
            </button>
          </form>

          <section className={styles.library}>
            <header>
              <p>Biblioteca privada</p>
              {works.length > 0 && (
                <button type="button" onClick={clearAtlas}>
                  Borrar Atlas
                </button>
              )}
            </header>

            {works.length === 0 ? (
              <span>Aún no has incorporado ninguna obra.</span>
            ) : (
              <div>
                {works.map((work) => (
                  <article key={work.id}>
                    <div>
                      <strong>{work.reading.poemTitle}</strong>
                      <span>
                        {new Date(work.createdAt).toLocaleDateString("es-ES")}
                      </span>
                    </div>
                    <button type="button" onClick={() => removeWork(work.id)}>
                      Eliminar
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </aside>

        <section className={styles.atlas}>
          <nav className={styles.rooms}>
            {[
              ["soulmap", "Mapa del Alma"],
              ["constellation", "Constelación"],
              ["symbols", "Biografía simbólica"],
              ["archetypes", "Mandala arquetípico"],
              ["relics", "Reliquias y ausencias"],
              ["movement", "Movimiento"],
              ["archive", "Archivo de Cartografías"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={activeRoom === key ? styles.activeRoom : ""}
                onClick={() => setActiveRoom(key as typeof activeRoom)}
              >
                {label}
              </button>
            ))}
          </nav>

          {works.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyConstellation}>
                <i /><i /><i /><i /><strong>✦</strong>
              </div>
              <p>Constelación en espera</p>
              <h2>Tu universo todavía no ha dejado huellas aquí</h2>
              <span>
                Incorpora una primera obra para que el Atlas reconozca sus
                símbolos, sus fuerzas y su movimiento.
              </span>
            </div>
          ) : (
            <>
              {activeRoom === "soulmap" && (
                <section className={styles.soulMapRoom}>
                  <header className={styles.soulMapHeader}>
                    <div>
                      <p>Cartografía simbólica del escritor</p>
                      <h2>Mapa del Alma</h2>
                      <span>
                        Una representación pictórica de las fuerzas, criaturas,
                        reliquias y ausencias que organizan tu universo.
                      </span>
                    </div>

                    <button
                      type="button"
                      className={styles.soulMapPrint}
                      onClick={() => window.print()}
                    >
                      Guardar lámina
                    </button>
                  </header>


                  {/* SOUL MAP SCOPE CONTROLS V1 */}
                  <section className={styles.soulMapScopePanel}>
                    <div className={styles.soulScopeTabs}>
                      {[
                        ["author", "Universo del autor"],
                        ["work", "Una obra"],
                        ["cycle", "Ciclo"],
                      ].map(([scope, label]) => (
                        <button
                          key={scope}
                          type="button"
                          className={
                            soulMapScope === scope
                              ? styles.activeSoulScope
                              : ""
                          }
                          onClick={() =>
                            setSoulMapScope(
                              scope as SoulMapScope,
                            )
                          }
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    {soulMapScope === "work" && (
                      <label className={styles.soulWorkSelector}>
                        <span>Obra cartografiada</span>

                        <select
                          value={effectiveSoulMapWorkId}
                          onChange={(event) =>
                            setSoulMapWorkId(
                              event.target.value,
                            )
                          }
                        >
                          {works.map((work) => (
                            <option
                              key={work.id}
                              value={work.id}
                            >
                              {work.reading.poemTitle}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}

                    {soulMapScope === "cycle" && (
                      <div className={styles.soulCycleSelector}>
                        <span>Obras del ciclo</span>

                        <div>
                          {works.map((work) => (
                            <label key={work.id}>
                              <input
                                type="checkbox"
                                checked={soulMapCycleIds.includes(
                                  work.id,
                                )}
                                onChange={() =>
                                  toggleSoulMapCycleWork(
                                    work.id,
                                  )
                                }
                              />

                              <span>
                                {work.reading.poemTitle}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className={styles.soulCurrentScope}>
                      <span>Mapa actual</span>

                      <strong>
                        {soulMapScope === "author"
                          ? "Universo del autor"
                          : soulMapScope === "work"
                            ? soulMapWorks[0]?.reading
                                .poemTitle ??
                              "Selecciona una obra"
                            : soulMapWorks.length > 0
                              ? `Ciclo de ${soulMapWorks.length} obras`
                              : "Selecciona las obras del ciclo"}
                      </strong>
                    </div>
                  </section>

                  <div
                    className={`${styles.soulMapCanvas} ${soulMapCompositionClass}`}
                    data-composition={soulMapComposition}
                  >
                    <div className={styles.compositionSeal}>
                      <span>Arquitectura pictórica</span>
                      <strong>
                        {soulMapCompositionLabel[soulMapComposition]}
                      </strong>
                      <small>
                        {dominantSoulFamily
                          ? `Familia dominante: ${dominantSoulFamily}`
                          : "Familia todavía indeterminada"}
                      </small>
                    </div>
                    {/* SOUL MAP PICTORIAL LAYER V1 */}

                    <div
                      className={styles.pictorialWorld}
                      aria-hidden="true"
                    >
                      <div className={styles.paintCloudOne} />
                      <div className={styles.paintCloudTwo} />
                      <div className={styles.paintCloudThree} />

                      <div className={styles.soulMoon}>
                        <span />
                      </div>

                      <div className={styles.flyingBird}>
                        <i />
                        <b />
                      </div>

                      <div className={styles.floatingVillage}>
                        <span className={styles.houseOne} />
                        <span className={styles.houseTwo} />
                        <span className={styles.houseThree} />
                        <span className={styles.villageTower} />
                      </div>

                      <div className={styles.floatingLovers}>
                        <span className={styles.loverOne} />
                        <span className={styles.loverTwo} />
                      </div>

                      <div className={styles.whiteTree}>
                        <span className={styles.treeTrunk} />
                        <span className={styles.treeBranchOne} />
                        <span className={styles.treeBranchTwo} />
                        <span className={styles.treeBranchThree} />
                        <span className={styles.treeCrown} />
                      </div>

                      <div className={styles.ladder}>
                        <span />
                        <span />
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                      </div>

                      <div className={styles.readerFigure}>
                        <span className={styles.readerHead} />
                        <span className={styles.readerBody} />
                        <span className={styles.readerBook} />
                      </div>

                      <div className={styles.painterFigure}>
                        <span className={styles.painterHead} />
                        <span className={styles.painterBody} />
                        <span className={styles.painterPalette} />
                        <span className={styles.painterBrush} />
                      </div>

                      <div className={styles.pictorialStars}>
                        {Array.from({ length: 34 }).map((_, index) => (
                          <span
                            key={index}
                            style={{
                              left: `${(index * 37) % 96}%`,
                              top: `${(index * 53) % 88}%`,
                              animationDelay: `${(index % 8) * 0.4}s`,
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className={styles.upperRealm}>
                      <span>ASPIRACIÓN · CONCIENCIA · REVELACIÓN</span>
                    </div>

                    <div className={styles.lowerRealm}>
                      <span>SOMBRA · MEMORIA ENTERRADA · AUSENCIA</span>
                    </div>


                    {/* SOUL MAP SYMBOLIC WORLD LAYER V2.1 */}
                    <div
                      className={styles.symbolicWorldLayer}
                      data-symbolic-world={soulMapComposition}
                    >
                      {soulMapComposition === "tree" && (
                        <>
                          <div className={styles.treeArchetypeCrown}>
                            <span>Fuerza de la copa</span>
                            <strong>
                              {scopedSoulMapArchetypes[0]?.name ??
                                "Arquetipo sin revelar"}
                            </strong>
                          </div>

                          <div className={styles.treeRelicFruit}>
                            <i />
                            <span>Reliquia entre las ramas</span>
                            <strong>
                              {scopedSoulMapRelics[0] ??
                                "La memoria todavía no ha elegido objeto"}
                            </strong>
                          </div>

                          <div className={styles.treeAbsenceRoot}>
                            <span>Ausencia enterrada</span>
                            <strong>
                              {scopedSoulMapAbsences[0] ??
                                "La raíz permanece en silencio"}
                            </strong>
                          </div>
                        </>
                      )}

                      {soulMapComposition === "labyrinth" && (
                        <>
                          <div className={styles.labyrinthArchetypeGuardian}>
                            <span>Guardián del perímetro</span>
                            <strong>
                              {scopedSoulMapArchetypes[0]?.name ??
                                "Arquetipo sin revelar"}
                            </strong>
                          </div>

                          <div className={styles.labyrinthRelicGate}>
                            <i />
                            <span>Objeto del umbral</span>
                            <strong>
                              {scopedSoulMapRelics[0] ??
                                "Ninguna reliquia ha llegado a la puerta"}
                            </strong>
                          </div>

                          <div className={styles.labyrinthHiddenAbsence}>
                            <span>Centro oculto</span>
                            <strong>
                              {scopedSoulMapAbsences[0] ??
                                "El centro todavía no tiene nombre"}
                            </strong>
                          </div>
                        </>
                      )}

                      {soulMapComposition === "river" && (
                        <>
                          <div className={styles.riverArchetypeMouth}>
                            <span>Fuerza de la desembocadura</span>
                            <strong>
                              {scopedSoulMapArchetypes[0]?.name ??
                                "Arquetipo sin revelar"}
                            </strong>
                          </div>

                          <div className={styles.riverRelicDrift}>
                            <i />
                            <span>Reliquia arrastrada</span>
                            <strong>
                              {scopedSoulMapRelics[0] ??
                                "La corriente todavía no transporta objeto"}
                            </strong>
                          </div>

                          <div className={styles.riverAbsenceWhirlpool}>
                            <span>Remolino de ausencia</span>
                            <strong>
                              {scopedSoulMapAbsences[0] ??
                                "El agua todavía no ha nombrado su pérdida"}
                            </strong>
                          </div>
                        </>
                      )}

                      {soulMapComposition === "constellation" && (
                        <>
                          <div className={styles.constellationArchetype}>
                            <span>Figura celeste</span>
                            <strong>
                              {scopedSoulMapArchetypes[0]?.name ??
                                "Arquetipo sin revelar"}
                            </strong>
                          </div>

                          <div className={styles.constellationRelic}>
                            <i />
                            <span>Astro-reliquia</span>
                            <strong>
                              {scopedSoulMapRelics[0] ??
                                "Ninguna reliquia ha ascendido todavía"}
                            </strong>
                          </div>

                          <div className={styles.constellationAbsence}>
                            <span>Estrella oscura</span>
                            <strong>
                              {scopedSoulMapAbsences[0] ??
                                "El vacío todavía no tiene nombre"}
                            </strong>
                          </div>
                        </>
                      )}
                    </div>

                    <svg
                      className={styles.soulMapSvg}
                      viewBox="0 0 1000 760"
                      role="img"
                      aria-label="Mapa pictórico del alma del escritor"
                    >
                      <defs>
                        <radialGradient id="soulCore" cx="50%" cy="45%" r="60%">
                          <stop offset="0%" stopColor="rgba(246,225,176,0.98)" />
                          <stop offset="34%" stopColor="rgba(170,126,70,0.78)" />
                          <stop offset="100%" stopColor="rgba(32,24,23,0.08)" />
                        </radialGradient>

                        <radialGradient id="soulVoid" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="rgba(5,5,8,0.96)" />
                          <stop offset="100%" stopColor="rgba(35,31,43,0.06)" />
                        </radialGradient>

                        <filter id="softGlow">
                          <feGaussianBlur stdDeviation="7" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>

                        <filter id="deepShadow">
                          <feDropShadow
                            dx="0"
                            dy="8"
                            stdDeviation="12"
                            floodOpacity="0.65"
                          />
                        </filter>
                      </defs>

                      <path
                        className={styles.soulRiver}
                        d="M64 568 C220 482 282 626 438 535 C585 450 667 535 936 408"
                      />

                      <path
                        className={styles.individuationPath}
                        d="M94 652 C212 624 204 520 340 524 C458 528 455 393 500 355 C550 311 585 224 706 194 C801 171 860 105 923 82"
                      />

                      {scopedSoulMapGestures.slice(0, 6).map((gesture, index) => {
                        const points = [
                          [94, 652],
                          [250, 555],
                          [390, 500],
                          [500, 355],
                          [665, 213],
                          [923, 82],
                        ];
                        const point = points[index];

                        return (
                          <g key={`${gesture}-${index}`}>
                            <circle
                              cx={point[0]}
                              cy={point[1]}
                              r="6"
                              className={styles.pathMarker}
                            />
                            <text
                              x={point[0]}
                              y={point[1] + 22}
                              className={styles.pathLabel}
                              textAnchor="middle"
                            >
                              {String(index + 1).padStart(2, "0")}
                            </text>

                            <text
                              x={point[0]}
                              y={point[1] + 38}
                              className={styles.pathGesture}
                              textAnchor="middle"
                            >
                              {gesture.length > 24
                                ? `${gesture.slice(0, 24)}…`
                                : gesture}
                            </text>
                          </g>
                        );
                      })}

                      <g
                        className={styles.centralSoul}
                        transform="translate(500 360)"
                        filter="url(#softGlow)"
                      >
                        <circle r="116" className={styles.centralHalo} />
                        <circle r="82" fill="url(#soulCore)" />
                        <circle r="58" className={styles.centralRing} />
                        <text y="-12" textAnchor="middle">
                          SÍMBOLO RECTOR
                        </text>
                        <text
                          y="20"
                          textAnchor="middle"
                          className={styles.centralSymbolName}
                        >
                          {soulCore?.name ?? "Sin revelar"}
                        </text>
                        <text y="48" textAnchor="middle">
                          {soulCore?.count ?? 0} apariciones
                        </text>
                      </g>

                      {(() => {
                        const positions =
                          soulMapNodePositions[soulMapComposition];

                        return soulOrbit.map((symbol, index) => {
                          const [x, y] = positions[index];
                          const radius = Math.min(34, 18 + symbol.count * 3);

                          return (
                            <g
                              key={`${symbol.name}-${index}`}
                              className={styles.soulSymbolNode}
                              transform={`translate(${x} ${y})`}
                              role="button"
                              tabIndex={0}
                              onClick={() => {
                                setSelectedSymbol(symbol.name);
                                setActiveRoom("symbols");
                              }}
                            >
                              <line
                                x1={500 - x}
                                y1={360 - y}
                                x2="0"
                                y2="0"
                                className={styles.symbolThread}
                              />
                              <circle r={radius + 12} className={styles.symbolAura} />
                              <circle r={radius} className={styles.symbolBody} />
                              <text y={radius + 25} textAnchor="middle">
                                {symbol.name}
                              </text>
                              <text
                                y={radius + 42}
                                textAnchor="middle"
                                className={styles.symbolCount}
                              >
                                {symbol.count} huellas
                              </text>
                            </g>
                          );
                        });
                      })()}

                      <g
                        className={styles.archetypeForce}
                        transform="translate(128 116)"
                      >
                        <circle r="78" className={styles.archetypeMist} />
                        <text textAnchor="middle" y="-12">
                          ARQUETIPO DOMINANTE
                        </text>
                        <text
                          textAnchor="middle"
                          y="18"
                          className={styles.archetypeName}
                        >
                          {scopedSoulMapArchetypes[0]?.name ?? "Sin revelar"}
                        </text>
                        <text textAnchor="middle" y="42">
                          fuerza profunda
                        </text>
                      </g>

                      <g
                        className={styles.emergingForce}
                        transform="translate(865 642)"
                      >
                        <circle r="72" className={styles.emergingMist} />
                        <text textAnchor="middle" y="-10">
                          SÍMBOLO NACIENTE
                        </text>
                        <text
                          textAnchor="middle"
                          y="20"
                          className={styles.emergingName}
                        >
                          {soulEmerging?.name ?? "Todavía en silencio"}
                        </text>
                      </g>

                      <g
                        className={styles.relicIsland}
                        transform="translate(160 610)"
                        filter="url(#deepShadow)"
                      >
                        <path d="M-92 30 Q-65-56 0-65 Q67-55 92 30 Q36 70-44 61Z" />
                        <text textAnchor="middle" y="-14">
                          RELIQUIA CENTRAL
                        </text>
                        <text
                          textAnchor="middle"
                          y="18"
                          className={styles.relicName}
                        >
                          {scopedSoulMapRelics[0] ?? "Ninguna todavía"}
                        </text>
                      </g>

                      <g
                        className={styles.absenceWell}
                        transform="translate(846 118)"
                      >
                        <circle r="70" fill="url(#soulVoid)" />
                        <circle r="53" className={styles.absenceRing} />
                        <text textAnchor="middle" y="-10">
                          AUSENCIA
                        </text>
                        <text
                          textAnchor="middle"
                          y="20"
                          className={styles.absenceName}
                        >
                          {scopedSoulMapAbsences[0] ?? "Sin nombre"}
                        </text>
                      </g>
                    </svg>

                    <div className={styles.soulMapLegend}>
                      <span>
                        <i className={styles.legendCore} />
                        Núcleo
                      </span>
                      <span>
                        <i className={styles.legendSymbol} />
                        Símbolos
                      </span>
                      <span>
                        <i className={styles.legendShadow} />
                        Ausencia
                      </span>
                      <span>
                        <i className={styles.legendPath} />
                        Individuación
                      </span>
                    </div>
                  </div>

                  <div className={styles.soulMapReading}>
                    <article className={styles.soulOracle}>
                      <p>Mensaje pictórico</p>
                      <blockquote>
                        {soulMapSymbols.length > 0
                          ? `Tu universo se organiza alrededor de «${
                              soulCore?.name
                            }». ${
                              scopedSoulMapArchetypes[0]?.name
                                ? `La fuerza de ${scopedSoulMapArchetypes[0].name} atraviesa su centro`
                                : "Una fuerza todavía sin nombre atraviesa su centro"
                            }${
                              scopedSoulMapAbsences[0]
                                ? `, mientras la ausencia de ${scopedSoulMapAbsences[0]} abre una región oscura que continúa ordenando la obra`
                                : ""
                            }. ${
                              scopedSoulMapRelics[0]
                                ? `La reliquia «${scopedSoulMapRelics[0]}» conserva aquello que el relato se niega a perder.`
                                : "Las reliquias aún no han revelado qué memoria desean conservar."
                            }`
                          : "El mapa permanece en silencio hasta que varias obras hayan depositado sus símbolos en el Atlas."}
                      </blockquote>
                    </article>

                    <div className={styles.soulMapKeys}>
                      <article>
                        <span>Símbolo rector</span>
                        <strong>{soulCore?.name ?? "—"}</strong>
                      </article>

                      <article>
                        <span>Arquetipo dominante</span>
                        <strong>{scopedSoulMapArchetypes[0]?.name ?? "—"}</strong>
                      </article>

                      <article>
                        <span>Reliquia</span>
                        <strong>{scopedSoulMapRelics[0] ?? "—"}</strong>
                      </article>

                      <article>
                        <span>Ausencia</span>
                        <strong>{scopedSoulMapAbsences[0] ?? "—"}</strong>
                      </article>

                      <article>
                        <span>Movimiento</span>
                        <strong>{scopedSoulMapGestures[0] ?? "Todavía inmóvil"}</strong>
                      </article>

                      <article>
                        <span>Obras cartografiadas</span>
                        <strong>{works.length}</strong>
                      </article>
                    </div>
                  </div>

                  <section className={styles.soulEvidence}>
                    <header>
                      <p>Pruebas del mapa</p>
                      <h3>La cartografía nace de tus propias obras</h3>
                    </header>

                    <div>
                      {soulMapSymbols.slice(0, 4).map((symbol) => (
                        <article key={symbol.name}>
                          <strong>{symbol.name}</strong>
                          <span>
                            {symbol.count} apariciones · {symbol.works.length} obras
                          </span>
                          <blockquote>
                            {symbol.functions[0] ??
                              "Su función simbólica todavía está emergiendo."}
                          </blockquote>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSymbol(symbol.name);
                              setActiveRoom("symbols");
                            }}
                          >
                            Abrir biografía
                          </button>
                        </article>
                      ))}
                    </div>
                  </section>
                </section>
              )}

              {activeRoom === "constellation" && (
                <section className={styles.constellationRoom}>
                  <header>
                    <div>
                      <p>Mi constelación</p>
                      <h2>El cosmos acumulado de la obra</h2>
                    </div>
                    <span>
                      El tamaño responde a la recurrencia y a la intensidad.
                    </span>
                  </header>

                  <div className={styles.constellation}>
                    <svg viewBox="0 0 100 100" aria-label="Constelación personal">
                      <circle cx="50" cy="50" r="41" />
                      <circle cx="50" cy="50" r="28" />
                      {symbols.slice(0, 16).map((symbol, index) => {
                        const angle = (index / Math.max(symbols.slice(0, 16).length, 1)) * Math.PI * 2;
                        const radius = 18 + (index % 3) * 10;
                        const x = 50 + Math.cos(angle) * radius;
                        const y = 50 + Math.sin(angle) * radius;
                        const size = 3.2 + Math.min(symbol.count, 5) * 1.25;

                        return (
                          <g
                            key={symbol.name}
                            tabIndex={0}
                            role="button"
                            onClick={() => {
                              setSelectedSymbol(symbol.name);
                              setActiveRoom("symbols");
                            }}
                          >
                            <circle cx={x} cy={y} r={size + 2} className={styles.halo} />
                            <circle cx={x} cy={y} r={size} className={styles.starNode} />
                            <text x={x} y={y + size + 4} textAnchor="middle">
                              {symbol.name}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  <div className={styles.constellationSummary}>
                    <article>
                      <p>Símbolo rector provisional</p>
                      <strong>{symbols[0]?.name ?? "—"}</strong>
                      <span>
                        Aparece en {symbols[0]?.count ?? 0} lecturas y concentra
                        la mayor recurrencia del Atlas.
                      </span>
                    </article>
                    <article>
                      <p>Arquetipo dominante</p>
                      <strong>{archetypes[0]?.name ?? "—"}</strong>
                      <span>
                        Es la fuerza arquetípica con mayor intensidad acumulada.
                      </span>
                    </article>
                    <article>
                      <p>Ausencia recurrente</p>
                      <strong>{absences[0] ?? "—"}</strong>
                      <span>
                        Su falta comienza a organizar una zona vacía del universo.
                      </span>
                    </article>
                  </div>
                </section>
              )}

              {activeRoom === "symbols" && (
                <section className={styles.symbolRoom}>
                  <aside>
                    <p>Biografía de los símbolos</p>
                    <div>
                      {symbols.map((symbol) => (
                        <button
                          key={symbol.name}
                          type="button"
                          className={
                            selected?.name === symbol.name ? styles.selectedSymbol : ""
                          }
                          onClick={() => setSelectedSymbol(symbol.name)}
                        >
                          <strong>{symbol.name}</strong>
                          <span>{symbol.count} apariciones</span>
                        </button>
                      ))}
                    </div>
                  </aside>

                  {selected && (
                    <article className={styles.symbolBiography}>
                      <p>Símbolo vivo</p>
                      <h2>{selected.name}</h2>
                      <div className={styles.symbolStats}>
                        <span>{selected.count} apariciones</span>
                        <span>Intensidad {selected.intensity}</span>
                      </div>

                      <section>
                        <h3>Obras donde vive</h3>
                        <div className={styles.tags}>
                          {selected.works.map((work) => <span key={work}>{work}</span>)}
                        </div>
                      </section>

                      <section>
                        <h3>Funciones reconocidas</h3>
                        {selected.functions.map((item) => <blockquote key={item}>{item}</blockquote>)}
                      </section>

                      <section>
                        <h3>Arquetipos asociados</h3>
                        <div className={styles.tags}>
                          {selected.archetypes.map((item) => <span key={item}>{item}</span>)}
                        </div>
                      </section>
                    </article>
                  )}
                </section>
              )}

              {activeRoom === "archetypes" && (
                <section className={styles.archetypeRoom}>
                  <header>
                    <p>Mandala arquetípico</p>
                    <h2>Las fuerzas que atraviesan el corpus</h2>
                  </header>
                  <div className={styles.archetypeGrid}>
                    {archetypes.map((archetype) => (
                      <article key={archetype.key}>
                        <span>{archetype.count} obras</span>
                        <h3>{archetype.name}</h3>
                        <strong>
                          {Math.round(archetype.totalIntensity / archetype.count)}
                        </strong>
                        <p>{archetype.functions[0]}</p>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {activeRoom === "relics" && (
                <section className={styles.relicRoom}>
                  <article>
                    <p>Museo de reliquias</p>
                    <h2>Objetos que transportan memoria</h2>
                    <div>
                      {relics.map((relic) => <blockquote key={relic}>{relic}</blockquote>)}
                    </div>
                  </article>
                  <article>
                    <p>Galería de ausencias</p>
                    <h2>Lo que falta y, aun así, organiza la obra</h2>
                    <div className={styles.tags}>
                      {absences.map((absence) => <span key={absence}>{absence}</span>)}
                    </div>
                  </article>
                </section>
              )}


              {/* CARTOGRAPHY ARCHIVE ROOM V1 */}
              {activeRoom === "archive" && (
                <section className={styles.archiveRoom}>
                  <header className={styles.archiveHeader}>
                    <div>
                      <p>Archivo de Cartografías</p>
                      <h2>La memoria visible de tus lecturas</h2>
                      <span>
                        Cada obra incorporada deja una lámina propia
                        dentro del Atlas Interior.
                      </span>
                    </div>
                  </header>

                  {archiveEntries.length === 0 ? (
                    <div className={styles.archiveEmpty}>
                      <strong>Aún no hay cartografías conservadas</strong>
                      <span>
                        Incorpora una obra para que el Atlas guarde su
                        primera lámina.
                      </span>
                    </div>
                  ) : (
                    <div className={styles.archiveGrid}>
                      {archiveEntries.map((entry, index) => (
                        <article
                          key={entry.id}
                          className={styles.archiveCard}
                          data-composition={entry.composition}
                        >
                          <div className={styles.archiveMiniature}>
                            <div className={styles.archiveMiniatureSky} />
                            <div className={styles.archiveMiniatureAura} />
                            <div className={styles.archiveMiniatureCore} />
                            <div className={styles.archiveMiniatureAccent} />
                          </div>

                          <div className={styles.archiveMeta}>
                            <span>
                              Cartografía{" "}
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <strong>{entry.compositionLabel}</strong>
                          </div>

                          <h3>{entry.title}</h3>

                          <div className={styles.archiveAuthorLine}>
                            <span>{entry.author}</span>
                            <span>
                              {new Date(entry.createdAt).toLocaleDateString("es-ES")}
                            </span>
                          </div>

                          <blockquote className={styles.archiveVerse}>
                            “{entry.verse}”
                          </blockquote>

                          <dl className={styles.archiveFacts}>
                            <div>
                              <dt>Símbolo rector</dt>
                              <dd>{entry.symbol}</dd>
                            </div>

                            <div>
                              <dt>Arquetipo dominante</dt>
                              <dd>{entry.archetype}</dd>
                            </div>

                            <div>
                              <dt>Reliquia</dt>
                              <dd>{entry.relic}</dd>
                            </div>
                          </dl>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              )}


              {activeRoom === "movement" && (
                <section className={styles.movementRoom}>
                  <header>
                    <p>Movimiento del universo</p>
                    <h2>Gestos de individuación acumulados</h2>
                  </header>
                  <div>
                    {gestures.map((gesture, index) => (
                      <article key={gesture}>
                        <strong>{String(index + 1).padStart(2, "0")}</strong>
                        <span>{gesture}</span>
                      </article>
                    ))}
                  </div>

                  <aside>
                    <p>Símbolos nacientes</p>
                    <div className={styles.tags}>
                      {emerging.length > 0
                        ? emerging.map((symbol) => (
                            <span key={symbol.name}>{symbol.name}</span>
                          ))
                        : <span>Ninguno todavía</span>}
                    </div>
                  </aside>
                </section>
              )}
            </>
          )}
        </section>
      </div>

      <footer className={styles.footer}>
        Privado por defecto · El escritor gobierna su propia mitología
      </footer>
    </main>
  );
}
