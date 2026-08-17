"use client";

import { useEffect, useState } from "react";
import type { ComparisonResult, Period } from "@/lib/embrion/types";
import styles from "../embrion.module.css";

type Props = { periods: Period[]; onOpenClaim: (id: string) => void };
const categoryLabels = { continuity: "CONTINUIDAD", rupture: "RUPTURA", transformation: "TRANSFORMACIÓN", difference: "DIFERENCIA", relation: "RELACIÓN" } as const;

export default function Comparator({ periods, onOpenClaim }: Props) {
  const [leftId, setLeftId] = useState("medieval");
  const [rightId, setRightId] = useState("avant_garde_war");
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setError("");
    fetch("/api/embrion/v1/compare", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leftId, rightId }) })
      .then(async (response) => { if (!response.ok) throw new Error((await response.json()).error ?? "No se pudo comparar."); return response.json() as Promise<ComparisonResult>; })
      .then((payload) => { if (active) setResult(payload); })
      .catch((reason: Error) => { if (active) { setResult(null); setError(reason.message); } });
    return () => { active = false; };
  }, [leftId, rightId]);

  return (
    <div className={styles.comparator}>
      <div className={styles.compareSelectors}>
        <label><span>PRIMER MOMENTO</span><select value={leftId} onChange={(event) => setLeftId(event.target.value)}>{periods.map((period) => <option key={period.id} value={period.id} disabled={period.id === rightId}>{period.shortLabel}</option>)}</select></label>
        <span className={styles.compareMark}>↔</span>
        <label><span>SEGUNDO MOMENTO</span><select value={rightId} onChange={(event) => setRightId(event.target.value)}>{periods.map((period) => <option key={period.id} value={period.id} disabled={period.id === leftId}>{period.shortLabel}</option>)}</select></label>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      {result && (
        <div className={styles.comparisonResult}>
          <div className={styles.comparisonTitle}><strong>{result.left.shortLabel}</strong><span>MUERTE</span><strong>{result.right.shortLabel}</strong></div>
          <div className={styles.observations}>
            {result.observations.map((observation) => (
              <article key={observation.id}>
                <p>{categoryLabels[observation.category]}</p><h3>{observation.label}</h3><div>{observation.statement}</div>
                {observation.claimIds[0] && <button type="button" onClick={() => onOpenClaim(observation.claimIds[0])}>ABRIR EVIDENCIA ↗</button>}
              </article>
            ))}
          </div>
          <p className={styles.limitation}>{result.limitation}</p>
        </div>
      )}
    </div>
  );
}
