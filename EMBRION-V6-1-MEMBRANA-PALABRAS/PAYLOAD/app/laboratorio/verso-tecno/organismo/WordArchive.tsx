"use client";

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

export default function WordArchive({
  entries,
  savedImpulses,
  onRecall,
}: Props) {
  const latest = entries.at(-1) ?? null;
  const kept = new Set(
    savedImpulses.map((impulse) => archiveKey(impulse.kind, impulse.value)),
  );
  const totalAppearances = entries.reduce(
    (total, entry) => total + entry.appearances,
    0,
  );

  return (
    <section className={styles.wordArchive} aria-label="Membrana de las palabras">
      <header>
        <div>
          <span>MEMBRANA DE LAS PALABRAS</span>
          <small>TODO LO QUE EL EMBRIÓN HACE APARECER DESCIENDE HASTA AQUÍ</small>
        </div>
        <div className={styles.archiveCounters}>
          <strong>{entries.length.toLocaleString("es-ES")}</strong>
          <span>FORMAS</span>
          <i />
          <strong>{totalAppearances.toLocaleString("es-ES")}</strong>
          <span>APARICIONES</span>
        </div>
      </header>

      <div className={styles.archiveThreshold}>
        <div className={styles.archiveOrgan} aria-hidden="true">
          <i />
          <i />
          <i />
          <span />
        </div>
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

      {entries.length ? (
        <div className={styles.archiveStrata}>
          {STRATA.map((stratum) => {
            const words = entries
              .filter((entry) => entry.kind === stratum.kind)
              .slice()
              .reverse();

            return (
              <article key={stratum.kind} data-kind={stratum.kind}>
                <header>
                  <span>{stratum.number}</span>
                  <strong>{stratum.label}</strong>
                  <small>{words.length}</small>
                </header>
                <div>
                  {words.map((entry) => {
                    const isKept = kept.has(archiveKey(entry.kind, entry.value));
                    return (
                      <button
                        key={entry.id}
                        type="button"
                        data-habitat={entry.habitat}
                        data-kept={isKept ? "true" : "false"}
                        onClick={() => onRecall(entry)}
                        title={`Recuperar «${entry.value}» · ${entry.sourceLabels.join(" · ")}`}
                      >
                        <i />
                        <span>{entry.value}</span>
                        {entry.appearances > 1 ? <small>×{entry.appearances}</small> : null}
                      </button>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className={styles.archiveEmpty}>
          <span />
          <p>
            Todavía no hay sedimento. La primera palabra que emita el Embrión abrirá
            este órgano de memoria.
          </p>
        </div>
      )}

      <footer>
        <span>ARCHIVO LOCAL · PERMANECE EN ESTE NAVEGADOR</span>
        <strong>{savedImpulses.length} ELEGIDAS POR TI</strong>
        <small>TOCA CUALQUIER FORMA PARA DEVOLVERLA AL CAMPO DE GRAVEDAD</small>
      </footer>
    </section>
  );
}
