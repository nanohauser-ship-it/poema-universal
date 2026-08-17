"use client";

import { useEffect, useState } from "react";
import type { EvidenceBundle } from "@/lib/embrion/types";
import styles from "../embrion.module.css";

type Props = { claimId: string | null; onClose: () => void };
const gradeLabel = { limited: "EVIDENCIA LIMITADA", suggestive: "EVIDENCIA SUGESTIVA", solid_in_corpus: "SÓLIDA EN ESTE CORPUS" } as const;
const kindLabel = { documental_fact: "HECHO DOCUMENTAL", curatorial_annotation: "ANOTACIÓN CURATORIAL", computational_interpretation: "INTERPRETACIÓN COMPUTACIONAL" } as const;

export default function EvidenceDrawer({ claimId, onClose }: Props) {
  const [bundle, setBundle] = useState<EvidenceBundle | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!claimId) { setBundle(null); return; }
    setError("");
    fetch(`/api/embrion/v1/evidence/${encodeURIComponent(claimId)}`)
      .then(async (response) => { if (!response.ok) throw new Error("No se pudo abrir la evidencia."); return response.json() as Promise<EvidenceBundle>; })
      .then(setBundle).catch((reason: Error) => setError(reason.message));
  }, [claimId]);
  useEffect(() => {
    if (!claimId) return;
    const handle = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", handle); return () => window.removeEventListener("keydown", handle);
  }, [claimId, onClose]);

  if (!claimId) return null;
  const dimensions = bundle ? Object.entries(bundle.claim.evidenceDimensions) : [];
  const dimensionLabel: Record<string, string> = { corpusCoverage: "cobertura", sourceQuality: "calidad de fuente", agreement: "convergencia", temporalCoverage: "cobertura temporal" };

  return (
    <div className={styles.drawerLayer} role="dialog" aria-modal="true" aria-label="Evidencia de la afirmación">
      <button type="button" className={styles.drawerBackdrop} onClick={onClose} aria-label="Cerrar evidencia" />
      <aside className={styles.drawer}>
        <div className={styles.drawerHeader}><p>¿POR QUÉ EMBRIÓN DICE ESTO?</p><button type="button" onClick={onClose} aria-label="Cerrar">×</button></div>
        {error && <p className={styles.error}>{error}</p>}
        {!bundle && !error && <p className={styles.loadingEvidence}>ABRIENDO ARCHIVO…</p>}
        {bundle && <>
          <div className={styles.claimHeader}><span>{kindLabel[bundle.claim.kind]}</span><h2>{bundle.claim.title}</h2><p>{bundle.claim.statement}</p></div>
          <section className={styles.evidenceGrade}>
            <strong>{gradeLabel[bundle.claim.evidenceGrade]}</strong>
            {dimensions.map(([key, value]) => <div key={key}><span>{dimensionLabel[key]}</span><i><b style={{ width: `${Math.round(value * 100)}%` }} /></i><em>{Math.round(value * 100)}</em></div>)}
          </section>
          <section className={styles.method}><h3>CÓMO SE OBTUVO</h3><p>{bundle.claim.method}</p><small>Versión de análisis: {bundle.claim.analysisVersion} · responsable: {bundle.claim.createdBy}</small></section>
          <section className={styles.evidenceList}><h3>OBRAS Y PASAJES</h3>
            {bundle.evidence.length ? bundle.evidence.map((item) => <article key={item.passage.id}>
              <div className={styles.evidenceWork}><span>{item.work.dateLabel}</span><div><strong>{item.author.name}</strong><p>{item.work.title}</p></div><em>{Math.round(item.weight * 100)}%</em></div>
              {item.passage.legalDisplay !== "metadata_only" ? <blockquote>“{item.passage.excerpt}”<cite>{item.passage.locator}</cite></blockquote> : <p className={styles.metadataOnly}>{item.passage.excerpt}</p>}
              <p className={styles.evidenceNote}>{item.note}</p>
              <a href={item.source.url} target="_blank" rel="noreferrer">{item.source.institution} · abrir fuente ↗</a>
              <small>{item.source.editionNote} · consultada {item.source.accessedAt}</small>
            </article>) : <p className={styles.metadataOnly}>Esta afirmación describe un vacío documental del piloto; no tiene pasajes textuales asociados.</p>}
          </section>
          <section className={styles.limitations}><h3>LÍMITES</h3>{bundle.claim.limitations.map((item) => <p key={item}>{item}</p>)}</section>
        </>}
      </aside>
    </div>
  );
}
