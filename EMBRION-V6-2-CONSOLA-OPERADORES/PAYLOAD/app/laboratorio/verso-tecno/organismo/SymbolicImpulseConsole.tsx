"use client";

import type {
  EvidenceFilter,
  ImpulseFamilyFilter,
  PoeticOperator,
  SymbolicDistance,
  SymbolicImpulse,
  SymbolicSourceFamily,
} from "@/lib/embrion/symbolic-engine";
import {
  extractWritingWords,
  SYMBOLIC_CORPUS_STATS,
} from "@/lib/embrion/symbolic-engine";
import styles from "../organismo-v47.module.css";

type Props = {
  text: string;
  nucleus: string;
  secondaryNucleus: string;
  activeImpulse: SymbolicImpulse | null;
  accelerated: boolean;
  anatomyOpen: boolean;
  savedImpulses: SymbolicImpulse[];
  impulseCount: number;
  archiveCount: number;
  family: ImpulseFamilyFilter;
  distance: SymbolicDistance;
  operator: PoeticOperator;
  sourceFamily: SymbolicSourceFamily;
  evidence: EvidenceFilter;
  onChooseNucleus: (word: string) => void;
  onChooseSecondaryNucleus: (word: string) => void;
  onFamilyChange: (value: ImpulseFamilyFilter) => void;
  onDistanceChange: (value: SymbolicDistance) => void;
  onOperatorChange: (value: PoeticOperator) => void;
  onSourceFamilyChange: (value: SymbolicSourceFamily) => void;
  onEvidenceChange: (value: EvidenceFilter) => void;
  onEmit: () => void;
  onToggleAcceleration: () => void;
  onToggleAnatomy: () => void;
  onKeep: (impulse: SymbolicImpulse) => void;
  onInsert: (impulse: SymbolicImpulse) => void;
  onDiscard: () => void;
  onPromote: (impulse: SymbolicImpulse) => void;
};

const evidenceLabel: Record<SymbolicImpulse["evidence"], string> = {
  documental: "HUELLA DOCUMENTAL",
  curatorial: "RELACIÓN CURATORIAL",
  experimental: "CONEXIÓN EXPERIMENTAL",
};

const FAMILY_OPTIONS: Array<[ImpulseFamilyFilter, string]> = [
  ["todas", "TODAS"], ["palabra", "PALABRA"], ["símbolo", "SÍMBOLO"],
  ["imagen", "IMAGEN"], ["materia", "MATERIA"], ["verbo", "VERBO"], ["tensión", "TENSIÓN"],
];
const DISTANCE_OPTIONS: Array<[SymbolicDistance, string]> = [
  ["cercana", "CERCANA"], ["relacional", "RELACIONAL"], ["remota", "REMOTA"],
];
const OPERATOR_OPTIONS: Array<[PoeticOperator, string]> = [
  ["constelar", "CONSTELAR"], ["materializar", "MATERIALIZAR"], ["verbalizar", "VERBALIZAR"],
  ["invertir", "INVERTIR"], ["fracturar", "FRACTURAR"], ["desplazar", "DESPLAZAR"],
  ["metamorfosear", "METAMORFOSEAR"], ["colisionar", "COLISIONAR"],
];
const SOURCE_OPTIONS: Array<[SymbolicSourceFamily, string]> = [
  ["todas", "TODAS"], ["novelas", "NOVELAS"], ["poema_universal", "POEMA UNIVERSAL"],
  ["diccionarios", "DICCIONARIOS"], ["imaginacion_material", "IMAGINACIÓN MATERIAL"], ["mitologia", "MITOLOGÍA"],
];
const EVIDENCE_OPTIONS: Array<[EvidenceFilter, string]> = [
  ["todas", "TODAS"], ["documental", "DOCUMENTAL"], ["curatorial", "CURATORIAL"], ["experimental", "EXPERIMENTAL"],
];

function ChoiceRow<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: Array<[T, string]>;
  onChange: (value: T) => void;
}) {
  return (
    <div className={styles.consoleChoiceRow}>
      {options.map(([option, label]) => (
        <button
          key={option}
          type="button"
          className={value === option ? styles.consoleChoiceActive : undefined}
          onClick={() => onChange(option)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default function SymbolicImpulseConsole(props: Props) {
  const words = extractWritingWords(props.text);
  const secondaryWords = words.filter(
    (word) => word.toLocaleLowerCase("es") !== props.nucleus.toLocaleLowerCase("es"),
  );

  return (
    <section className={styles.symbolicConsole} aria-label="Consola simbólica de Embrión">
      <header>
        <div>
          <span>CONSOLA DE OPERADORES</span>
          <small>
            {SYMBOLIC_CORPUS_STATS.sourceCount} FUENTES · {SYMBOLIC_CORPUS_STATS.relationCount.toLocaleString("es-ES")} RELACIONES · V6.2
          </small>
        </div>
        <b className={props.nucleus ? styles.symbolicAwake : undefined}>
          {props.nucleus ? `${props.impulseCount} RUTAS` : "LATENTE"}
        </b>
      </header>

      <div className={styles.consoleModules}>
        <section className={styles.consoleModule}>
          <header><span>01</span><strong>NÚCLEO DE GRAVEDAD</strong></header>
          <div className={styles.nucleusChooserCompact}>
            {words.length ? words.map((word) => (
              <button
                key={word.toLocaleLowerCase("es")}
                type="button"
                className={word.toLocaleLowerCase("es") === props.nucleus.toLocaleLowerCase("es") ? styles.nucleusActive : undefined}
                onClick={() => props.onChooseNucleus(word)}
              >{word}</button>
            )) : <p>Escribe para activar materia verbal.</p>}
          </div>
        </section>

        <section className={styles.consoleModule}>
          <header><span>02</span><strong>FAMILIA DE IMPULSO</strong></header>
          <ChoiceRow value={props.family} options={FAMILY_OPTIONS} onChange={props.onFamilyChange} />
        </section>

        <section className={styles.consoleModule}>
          <header><span>03</span><strong>DISTANCIA SIMBÓLICA</strong></header>
          <ChoiceRow value={props.distance} options={DISTANCE_OPTIONS} onChange={props.onDistanceChange} />
        </section>

        <section className={styles.consoleModule}>
          <header><span>04</span><strong>OPERADOR POÉTICO</strong></header>
          <ChoiceRow value={props.operator} options={OPERATOR_OPTIONS} onChange={props.onOperatorChange} />
        </section>

        <section className={styles.consoleModule}>
          <header><span>05</span><strong>DOBLE NÚCLEO</strong></header>
          <div className={styles.secondaryNucleusRow}>
            <button
              type="button"
              className={!props.secondaryNucleus ? styles.consoleChoiceActive : undefined}
              onClick={() => props.onChooseSecondaryNucleus("")}
            >UNO</button>
            {secondaryWords.slice(-8).map((word) => (
              <button
                key={word.toLocaleLowerCase("es")}
                type="button"
                className={word.toLocaleLowerCase("es") === props.secondaryNucleus.toLocaleLowerCase("es") ? styles.consoleChoiceActive : undefined}
                onClick={() => props.onChooseSecondaryNucleus(word)}
              >{word}</button>
            ))}
          </div>
          <small className={styles.consoleModuleNote}>
            {props.secondaryNucleus ? `${props.nucleus} ↔ ${props.secondaryNucleus}` : "Activa un segundo centro para buscar puentes y colisiones."}
          </small>
        </section>

        <section className={styles.consoleModule}>
          <header><span>06</span><strong>FUENTES</strong></header>
          <ChoiceRow value={props.sourceFamily} options={SOURCE_OPTIONS} onChange={props.onSourceFamilyChange} />
        </section>

        <section className={styles.consoleModule}>
          <header><span>07</span><strong>GRADO DE EVIDENCIA</strong></header>
          <ChoiceRow value={props.evidence} options={EVIDENCE_OPTIONS} onChange={props.onEvidenceChange} />
        </section>
      </div>

      <article className={styles.impulseSpecimen}>
        {props.activeImpulse ? (
          <>
            <div className={styles.impulseHead}>
              <span>{props.activeImpulse.kind.toUpperCase()} · {props.operator.toUpperCase()}</span>
              <small>{evidenceLabel[props.activeImpulse.evidence]}</small>
            </div>
            <strong>{props.activeImpulse.value}</strong>
            <p>{props.activeImpulse.action}</p>

            <div className={styles.impulseActions}>
              <button type="button" onClick={() => props.onKeep(props.activeImpulse!)}>CONSERVAR</button>
              <button type="button" onClick={() => props.onInsert(props.activeImpulse!)}>LLEVAR AL TEXTO</button>
              <button type="button" onClick={() => props.onPromote(props.activeImpulse!)}>NUEVO NÚCLEO</button>
              <button type="button" onClick={props.onDiscard}>DISOLVER</button>
            </div>

            <button type="button" className={styles.anatomyToggle} onClick={props.onToggleAnatomy} aria-expanded={props.anatomyOpen}>
              <span>¿POR QUÉ EMBRIÓN ENVÍA ESTO?</span><b>{props.anatomyOpen ? "—" : "+"}</b>
            </button>
            {props.anatomyOpen ? (
              <div className={styles.impulseAnatomy}>
                <dl>
                  <div><dt>NÚCLEO</dt><dd>{props.activeImpulse.nucleus}</dd></div>
                  <div><dt>RELACIÓN</dt><dd>{props.activeImpulse.relation}</dd></div>
                  <div><dt>CONSTELACIÓN</dt><dd>{props.activeImpulse.constellation}</dd></div>
                  <div><dt>FUERZA</dt><dd>{Math.round(props.activeImpulse.confidence * 100)}%</dd></div>
                </dl>
                <p>{props.activeImpulse.anatomy}</p>
                <div>{props.activeImpulse.sourceLabels.map((source) => <span key={source}>{source}</span>)}</div>
              </div>
            ) : null}
          </>
        ) : (
          <div className={styles.impulseWaiting}>
            <i />
            <strong>{props.nucleus ? "No hay rutas con estos filtros." : "El líquido todavía no ha elegido una forma."}</strong>
            <p>{props.nucleus ? "Abre la distancia, la evidencia o las fuentes para volver a encontrar materia." : "Selecciona una palabra y la consola comenzará a operar."}</p>
          </div>
        )}
      </article>

      <div className={styles.impulseTransport}>
        <button type="button" onClick={props.onEmit} disabled={!props.nucleus || !props.impulseCount}><span>EMITIR IMPULSO</span><b>◉</b></button>
        <button type="button" className={props.accelerated ? styles.accelerationActive : undefined} onClick={props.onToggleAcceleration} disabled={!props.nucleus || !props.impulseCount}>
          <span>{props.accelerated ? "RALENTIZAR" : "ACELERAR"}</span><b>{props.accelerated ? "×1" : "×3"}</b>
        </button>
      </div>

      <div className={styles.impulseNursery}>
        <span>MEMBRANA INFERIOR · {props.archiveCount} FORMAS</span>
        <p>{props.savedImpulses.length} elegidas expresamente. Todas las demás siguen archivadas aunque cambies de filtro.</p>
      </div>
    </section>
  );
}
