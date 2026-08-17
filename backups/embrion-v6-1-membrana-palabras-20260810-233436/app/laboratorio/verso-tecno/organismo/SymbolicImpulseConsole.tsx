"use client";

import type { SymbolicImpulse } from "@/lib/embrion/symbolic-engine";
import {
  extractWritingWords,
  SYMBOLIC_CORPUS_STATS,
} from "@/lib/embrion/symbolic-engine";
import styles from "../organismo-v47.module.css";

type Props = {
  text: string;
  nucleus: string;
  activeImpulse: SymbolicImpulse | null;
  accelerated: boolean;
  anatomyOpen: boolean;
  savedImpulses: SymbolicImpulse[];
  impulseCount: number;
  onChooseNucleus: (word: string) => void;
  onEmit: () => void;
  onToggleAcceleration: () => void;
  onToggleAnatomy: () => void;
  onKeep: (impulse: SymbolicImpulse) => void;
  onInsert: (impulse: SymbolicImpulse) => void;
  onDiscard: () => void;
  onPromote: (impulse: SymbolicImpulse) => void;
  onRecall: (impulse: SymbolicImpulse) => void;
};

const evidenceLabel: Record<SymbolicImpulse["evidence"], string> = {
  documental: "HUELLA DOCUMENTAL",
  curatorial: "RELACIÓN CURATORIAL",
  experimental: "CONEXIÓN EXPERIMENTAL",
};

export default function SymbolicImpulseConsole({
  text,
  nucleus,
  activeImpulse,
  accelerated,
  anatomyOpen,
  savedImpulses,
  impulseCount,
  onChooseNucleus,
  onEmit,
  onToggleAcceleration,
  onToggleAnatomy,
  onKeep,
  onInsert,
  onDiscard,
  onPromote,
  onRecall,
}: Props) {
  const words = extractWritingWords(text);

  return (
    <section className={styles.symbolicConsole} aria-label="Campo de gravedad simbólica">
      <header>
        <div>
          <span>CAMPO DE GRAVEDAD</span>
          <small>
            ARCHIVO VIVO · {SYMBOLIC_CORPUS_STATS.sourceCount} FUENTES ·{" "}
            {SYMBOLIC_CORPUS_STATS.relationCount.toLocaleString("es-ES")} RELACIONES
          </small>
        </div>
        <b className={nucleus ? styles.symbolicAwake : undefined}>
          {nucleus ? "DESPIERTO" : "LATENTE"}
        </b>
      </header>

      <div className={styles.nucleusChooser}>
        <span>
          ELIGE QUÉ PALABRA EJERCE GRAVEDAD
          {nucleus && impulseCount ? ` · ${impulseCount} RUTAS ENCENDIDAS` : ""}
        </span>
        {words.length ? (
          <div>
            {words.map((word) => (
              <button
                key={word.toLocaleLowerCase("es")}
                type="button"
                className={
                  word.toLocaleLowerCase("es") === nucleus.toLocaleLowerCase("es")
                    ? styles.nucleusActive
                    : undefined
                }
                onClick={() => onChooseNucleus(word)}
              >
                {word}
              </button>
            ))}
          </div>
        ) : (
          <p>Escribe dos o más letras. Cada palabra podrá convertirse en núcleo.</p>
        )}
      </div>

      <article className={styles.impulseSpecimen}>
        {activeImpulse ? (
          <>
            <div className={styles.impulseHead}>
              <span>{activeImpulse.kind.toUpperCase()}</span>
              <small>{evidenceLabel[activeImpulse.evidence]}</small>
            </div>
            <strong>{activeImpulse.value}</strong>
            <p>{activeImpulse.action}</p>

            <div className={styles.impulseActions}>
              <button type="button" onClick={() => onKeep(activeImpulse)}>
                CONSERVAR
              </button>
              <button type="button" onClick={() => onInsert(activeImpulse)}>
                LLEVAR AL TEXTO
              </button>
              <button type="button" onClick={() => onPromote(activeImpulse)}>
                NUEVO NÚCLEO
              </button>
              <button type="button" onClick={onDiscard}>
                DISOLVER
              </button>
            </div>

            <button
              type="button"
              className={styles.anatomyToggle}
              onClick={onToggleAnatomy}
              aria-expanded={anatomyOpen}
            >
              <span>¿POR QUÉ EMBRIÓN ENVÍA ESTO?</span>
              <b>{anatomyOpen ? "—" : "+"}</b>
            </button>

            {anatomyOpen ? (
              <div className={styles.impulseAnatomy}>
                <dl>
                  <div><dt>NÚCLEO</dt><dd>{activeImpulse.nucleus}</dd></div>
                  <div><dt>RELACIÓN</dt><dd>{activeImpulse.relation}</dd></div>
                  <div><dt>CONSTELACIÓN</dt><dd>{activeImpulse.constellation}</dd></div>
                  <div><dt>FUERZA</dt><dd>{Math.round(activeImpulse.confidence * 100)}%</dd></div>
                </dl>
                <p>{activeImpulse.anatomy}</p>
                <div>
                  {activeImpulse.sourceLabels.map((source) => (
                    <span key={source}>{source}</span>
                  ))}
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <div className={styles.impulseWaiting}>
            <i />
            <strong>El líquido todavía no ha elegido una forma.</strong>
            <p>Selecciona una palabra. Las letras relacionadas comenzarán a encenderse alrededor del organismo.</p>
          </div>
        )}
      </article>

      <div className={styles.impulseTransport}>
        <button type="button" onClick={onEmit} disabled={!nucleus}>
          <span>EMITIR IMPULSO</span>
          <b>◉</b>
        </button>
        <button
          type="button"
          className={accelerated ? styles.accelerationActive : undefined}
          onClick={onToggleAcceleration}
          disabled={!nucleus}
        >
          <span>{accelerated ? "RALENTIZAR" : "ACELERAR"}</span>
          <b>{accelerated ? "×1" : "×3"}</b>
        </button>
      </div>

      <div className={styles.impulseNursery}>
        <span>VIVERO · {savedImpulses.length} IMPULSOS CONSERVADOS</span>
        {savedImpulses.length ? (
          <div>
            {savedImpulses.slice(-6).reverse().map((impulse) => (
              <button key={impulse.id} type="button" onClick={() => onRecall(impulse)}>
                <small>{impulse.kind}</small>
                <strong>{impulse.value}</strong>
              </button>
            ))}
          </div>
        ) : (
          <p>Ninguna aparición ha sido conservada todavía.</p>
        )}
      </div>
    </section>
  );
}
