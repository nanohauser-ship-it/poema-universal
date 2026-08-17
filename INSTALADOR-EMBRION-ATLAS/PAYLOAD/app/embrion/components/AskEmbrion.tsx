"use client";

import { FormEvent, useState } from "react";
import type { QuestionAnswer } from "@/lib/embrion/types";
import styles from "../embrion.module.css";

type Props = { onOpenClaim: (id: string) => void };
const examples = ["¿Cómo cambia la muerte desde Jorge Manrique hasta Lorca?", "¿Qué ocurre con el cuerpo en el Barroco y en los años treinta?", "¿Dónde es todavía insuficiente el corpus?"];

export default function AskEmbrion({ onOpenClaim }: Props) {
  const [question, setQuestion] = useState(examples[0]);
  const [answer, setAnswer] = useState<QuestionAnswer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event?: FormEvent) => {
    event?.preventDefault(); setLoading(true); setError("");
    try {
      const response = await fetch("/api/embrion/v1/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "No se pudo responder.");
      setAnswer(payload as QuestionAnswer);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "No se pudo responder."); }
    finally { setLoading(false); }
  };

  return (
    <div className={styles.ask}>
      <form onSubmit={submit}>
        <label htmlFor="embrion-question">PREGUNTA SOBRE MUERTE</label>
        <div className={styles.askInput}><textarea id="embrion-question" value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={600} rows={3} /><button type="submit" disabled={loading}>{loading ? "LEYENDO…" : "PREGUNTAR →"}</button></div>
        <div className={styles.questionExamples}>{examples.map((example) => <button key={example} type="button" onClick={() => setQuestion(example)}>{example}</button>)}</div>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      {answer && (
        <article className={styles.answer}>
          <div className={styles.answerMeta}><span>RESPUESTA BASADA EN CORPUS</span><span>{answer.mode === "corpus_plus_model" ? "síntesis asistida" : "síntesis determinista"}</span></div>
          <p>{answer.answer}</p>
          <div className={styles.answerClaims}>
            {answer.claimIds.map((id, index) => <button key={id} type="button" onClick={() => onOpenClaim(id)}>EVIDENCIA {String(index + 1).padStart(2, "0")} ↗</button>)}
          </div>
          <details><summary>LÍMITES DE ESTA RESPUESTA</summary>{answer.limitations.map((item) => <p key={item}>{item}</p>)}</details>
        </article>
      )}
    </div>
  );
}
