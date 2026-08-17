"use client";

import { useMemo, useState } from "react";
import type {
  EvidenceState,
  ImpulseKind,
  SymbolicHabitat,
  SymbolicImpulse,
} from "@/lib/embrion/symbolic-engine";
import styles from "../organismo-v47.module.css";

export type ArchivedWord = {
  id: string;
  value: string;
  kind: ImpulseKind;
  habitat: SymbolicHabitat;
  nucleus: string;
  nuclei: string[];
  evidence: EvidenceState;
  confidence: number;
  sourceLabels: string[];
  appearances: number;
  firstSeenAt: number;
  lastSeenAt: number;
};

type Props = {
  entries: ArchivedWord[];
  savedImpulses: SymbolicImpulse[];
  onRecall: (entry: ArchivedWord) => void;
  onAssemble: (entries: ArchivedWord[]) => void;
};

const STRATA: Array<{ kind: ImpulseKind; label: string; number: string }> = [
  { kind: "palabra", label: "PALABRAS", number: "01" },
  { kind: "símbolo", label: "SÍMBOLOS", number: "02" },
  { kind: "imagen", label: "IMÁGENES", number: "03" },
  { kind: "materia", label: "MATERIAS", number: "04" },
  { kind: "verbo", label: "VERBOS", number: "05" },
  { kind: "tensión", label: "TENSIONES", number: "06" },
];

function archiveKey(kind: ImpulseKind, value: string): string {
  return `${kind}:${value
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zñ0-9]+/g, "-")}`;
}

function escapeCsv(value: string | number): string {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export default function WordArchive({ entries, savedImpulses, onRecall, onAssemble }: Props) {
  const [query, setQuery] = useState("");
  const [assemblyIds, setAssemblyIds] = useState<string[]>([]);
  const latest = entries.at(-1) ?? null;
  const kept = new Set(savedImpulses.map((impulse) => archiveKey(impulse.kind, impulse.value)));
  const totalAppearances = entries.reduce((total, entry) => total + entry.appearances, 0);
  const normalizedQuery = query.trim().toLocaleLowerCase("es");

  const filteredEntries = useMemo(() => {
    if (!normalizedQuery) return entries;
    return entries.filter((entry) =>
      [
        entry.value,
        entry.kind,
        entry.habitat,
        entry.evidence,
        entry.nucleus,
        ...entry.nuclei,
        ...entry.sourceLabels,
      ]
        .join(" ")
        .toLocaleLowerCase("es")
        .includes(normalizedQuery),
    );
  }, [entries, normalizedQuery]);

  const assembly = assemblyIds
    .map((id) => entries.find((entry) => entry.id === id))
    .filter((entry): entry is ArchivedWord => Boolean(entry));

  function toggleAssembly(entry: ArchivedWord) {
    setAssemblyIds((current) =>
      current.includes(entry.id)
        ? current.filter((id) => id !== entry.id)
        : [...current, entry.id].slice(-12),
    );
  }

  function moveAssembly(index: number, direction: -1 | 1) {
    setAssemblyIds((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function exportArchive() {
    const rows = [
      ["forma", "tipo", "habitat", "evidencia", "fuerza", "apariciones", "nucleos", "fuentes"],
      ...filteredEntries.map((entry) => [
        entry.value,
        entry.kind,
        entry.habitat,
        entry.evidence,
        Math.round(entry.confidence * 100),
        entry.appearances,
        entry.nuclei.join(" | "),
        entry.sourceLabels.join(" | "),
      ]),
    ];
    const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `embrion-membrana-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <section className={styles.wordArchive} aria-label="Membrana de las palabras">
      <header>
        <div>
          <span>MEMBRANA DE LAS PALABRAS</span>
          <small>ARCHIVO VIVO · CADA FORMA CONSERVA NÚCLEO, EVIDENCIA Y PROCEDENCIA</small>
        </div>
        <div className={styles.archiveCounters}>
          <strong>{entries.length.toLocaleString("es-ES")}</strong><span>FORMAS</span><i />
          <strong>{totalAppearances.toLocaleString("es-ES")}</strong><span>APARICIONES</span>
        </div>
      </header>

      <div className={styles.archiveWorkbenchBar}>
        <label>
          <span>BUSCAR EN LA MEMBRANA</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="palabra, fuente, núcleo, evidencia…" />
        </label>
        <div>
          <strong>{filteredEntries.length}</strong>
          <span>VISIBLES</span>
          <button type="button" onClick={exportArchive} disabled={!filteredEntries.length}>EXPORTAR CSV ↗</button>
        </div>
      </div>

      <div className={styles.archiveThreshold}>
        <div className={styles.archiveOrgan} aria-hidden="true"><i /><i /><i /><span /></div>
        <div>
          <small>ÚLTIMA FORMA DEPOSITADA</small>
          <strong>{latest?.value ?? "La membrana espera una palabra"}</strong>
          <p>
            {latest
              ? `${latest.kind} · gravedad «${latest.nucleus}» · ${latest.appearances} ${latest.appearances === 1 ? "aparición" : "apariciones"}`
              : "Escribe y elige un núcleo. El archivo se formará sin borrar nada de tu texto."}
          </p>
        </div>
        <span className={styles.archivePulse} aria-hidden="true" />
      </div>

      {filteredEntries.length ? (
        <div className={styles.archiveStrata}>
          {STRATA.map((stratum) => {
            const words = filteredEntries.filter((entry) => entry.kind === stratum.kind).slice().reverse();
            return (
              <article key={stratum.kind} data-kind={stratum.kind}>
                <header><span>{stratum.number}</span><strong>{stratum.label}</strong><small>{words.length}</small></header>
                <div>
                  {words.map((entry) => {
                    const isKept = kept.has(archiveKey(entry.kind, entry.value));
                    const isMounted = assemblyIds.includes(entry.id);
                    return (
                      <div className={styles.archiveWordUnit} key={entry.id}>
                        <button
                          type="button"
                          data-habitat={entry.habitat}
                          data-kept={isKept ? "true" : "false"}
                          onClick={() => onRecall(entry)}
                          title={`Recuperar «${entry.value}» · ${entry.sourceLabels.join(" · ")}`}
                        >
                          <i /><span>{entry.value}</span>{entry.appearances > 1 ? <small>×{entry.appearances}</small> : null}
                        </button>
                        <button
                          type="button"
                          className={isMounted ? styles.archiveMountActive : styles.archiveMountButton}
                          onClick={() => toggleAssembly(entry)}
                          aria-label={isMounted ? `Retirar ${entry.value} de la mesa` : `Añadir ${entry.value} a la mesa`}
                        >{isMounted ? "−" : "+"}</button>
                      </div>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className={styles.archiveEmpty}><span /><p>{entries.length ? "No hay formas que coincidan con esta búsqueda." : "Todavía no hay sedimento. La primera palabra que emita el Embrión abrirá este órgano de memoria."}</p></div>
      )}

      <section className={styles.assemblyTable} aria-label="Mesa de montaje">
        <header>
          <div><span>MESA DE MONTAJE</span><small>SELECCIONA SEDIMENTOS Y ORDENA UNA CONSTELACIÓN PROPIA</small></div>
          <strong>{assembly.length} / 12</strong>
        </header>
        {assembly.length ? (
          <div className={styles.assemblyRail}>
            {assembly.map((entry, index) => (
              <article key={entry.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><strong>{entry.value}</strong><small>{entry.kind} · {entry.evidence} · {entry.sourceLabels.slice(0, 2).join(" / ") || "sin fuente"}</small></div>
                <nav>
                  <button type="button" disabled={index === 0} onClick={() => moveAssembly(index, -1)}>←</button>
                  <button type="button" disabled={index === assembly.length - 1} onClick={() => moveAssembly(index, 1)}>→</button>
                  <button type="button" onClick={() => toggleAssembly(entry)}>×</button>
                </nav>
              </article>
            ))}
          </div>
        ) : <p className={styles.assemblyEmpty}>Pulsa ＋ junto a cualquier forma de la membrana. Aquí no se borra nada: preparas una secuencia para la Libreta de Escritura.</p>}
        <footer>
          <button type="button" disabled={!assembly.length} onClick={() => onAssemble(assembly)}>LLEVAR SECUENCIA A LA LIBRETA ↗</button>
          {assembly.length ? <button type="button" onClick={() => setAssemblyIds([])}>VACIAR MESA</button> : null}
        </footer>
      </section>

      <footer>
        <span>ARCHIVO LOCAL · PERMANECE EN ESTE NAVEGADOR</span>
        <strong>{savedImpulses.length} ELEGIDAS POR TI</strong>
        <small>TOCA UNA FORMA PARA DEVOLVERLA A GRAVEDAD · ＋ PARA MONTARLA</small>
      </footer>
    </section>
  );
}
