"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { BootstrapData } from "@/lib/embrion/types";
import AskEmbrion from "./components/AskEmbrion";
import Comparator from "./components/Comparator";
import EvidenceDrawer from "./components/EvidenceDrawer";
import GenealogyMap from "./components/GenealogyMap";
import HistoricalGenome from "./components/HistoricalGenome";
import TemporalAtlas from "./components/TemporalAtlas";
import styles from "./embrion.module.css";

type Props = { initialData: BootstrapData };

const upcomingThemes = ["amor", "Dios", "tiempo", "España", "guerra", "cuerpo", "mar", "memoria", "exilio"];

export default function EmbrionExperience({ initialData }: Props) {
  const firstPilot = initialData.periods.find((period) => period.isPilot)?.id ?? initialData.periods[0].id;
  const [periodId, setPeriodId] = useState(firstPilot);
  const [claimId, setClaimId] = useState<string | null>(null);
  const period = initialData.periods.find((item) => item.id === periodId) ?? initialData.periods[0];
  const claim = initialData.claims.find((item) => item.periodId === period.id);
  const genome = initialData.genomes.find((item) => item.periodId === period.id) ?? initialData.genomes[0];
  const periodWorks = useMemo(() => initialData.works.filter((work) => work.periodId === period.id), [initialData.works, period.id]);
  const authorById = useMemo(() => new Map(initialData.authors.map((author) => [author.id, author])), [initialData.authors]);

  return (
    <main className={styles.shell}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.universe}>POEMA UNIVERSAL</Link>
        <nav aria-label="Módulos de Embrión" className={styles.nav}>
          <a href="#atlas">Atlas</a><a href="#temas">Temas</a><a href="#genealogia">Genealogía</a><a href="#comparador">Comparador</a><a href="#pregunta">Pregunta</a>
        </nav>
        <span className={styles.edition}>PILOTO · 01</span>
      </header>

      <section className={styles.hero} aria-labelledby="embrion-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>ATLAS HISTÓRICO DE LA SENSIBILIDAD POÉTICA</p>
          <h1 id="embrion-title">EMBRIÓN</h1>
          <p className={styles.centralQuestion}>¿Cómo cambia una idea<br />cuando atraviesa siglos de poesía?</p>
          <p className={styles.intro}>Una herramienta para observar persistencias, rupturas y desplazamientos. No decide qué poesía es mejor. Cada lectura puede abrirse hasta las obras que la sostienen.</p>
          <a href="#temas" className={styles.enter}>ELIGE UNA PALABRA <span aria-hidden="true">↓</span></a>
        </div>
        <div className={styles.heroIndex} aria-label="Alcance del corpus piloto">
          <div><strong>11</strong><span>obras</span></div>
          <div><strong>06</strong><span>periodos con muestra</span></div>
          <div><strong>01</strong><span>tema piloto</span></div>
        </div>
      </section>

      <section id="temas" className={styles.themes} aria-labelledby="themes-title">
        <p className={styles.sectionNumber}>01 / TEMAS</p>
        <div className={styles.themePrompt}>
          <h2 id="themes-title">ELIGE UNA PALABRA</h2>
          <p>Observa cómo ha cambiado durante más de cinco siglos de la muestra piloto.</p>
        </div>
        <div className={styles.themeField}>
          <button className={styles.activeTheme} type="button">MUERTE</button>
          <div className={styles.upcomingThemes} aria-label="Temas previstos">
            {upcomingThemes.map((theme) => <span key={theme}>{theme}</span>)}
          </div>
          <p className={styles.coming}>Los demás conceptos se activarán al incorporar evidencia suficiente.</p>
        </div>
      </section>

      <section id="atlas" className={styles.atlas} aria-labelledby="atlas-title">
        <div className={styles.sectionHeading}>
          <p className={styles.sectionNumber}>02 / ATLAS TEMPORAL</p>
          <h2 id="atlas-title">MUERTE <span>— {period.shortLabel}</span></h2>
        </div>
        <TemporalAtlas periods={initialData.periods} selectedId={period.id} onSelect={setPeriodId} works={initialData.works} />

        <div className={styles.periodStudy}>
          <HistoricalGenome genome={genome} color={period.color} label={`${initialData.project.conceptLabel} — ${period.shortLabel}`} />
          <div className={styles.periodReading}>
            <p className={styles.readingType}>{claim?.kind === "documental_fact" ? "HECHO DOCUMENTAL" : "INTERPRETACIÓN COMPUTACIONAL"}</p>
            <h3>{claim?.title}</h3>
            <p className={styles.readingStatement}>{claim?.statement}</p>
            {claim && <button className={styles.whyButton} type="button" onClick={() => setClaimId(claim.id)}>¿POR QUÉ EMBRIÓN DICE ESTO? <span>↗</span></button>}
            <p className={styles.corpusCaution}>{claim?.limitations[0]}</p>

            <div className={styles.worksIndex}>
              <p>OBRAS EN ESTE CORTE</p>
              {periodWorks.length ? periodWorks.map((work) => (
                <article key={work.id}>
                  <span>{work.dateLabel}</span>
                  <div><h4>{work.title}</h4><p>{authorById.get(work.authorId)?.name} · {work.textStatus === "metadata_only" ? "solo metadatos" : "fragmento indexado"}</p></div>
                </article>
              )) : <p className={styles.noWorks}>Corpus todavía insuficiente. No se formula una interpretación histórica.</p>}
            </div>
          </div>
        </div>
      </section>

      <section id="genealogia" className={styles.genealogySection} aria-labelledby="genealogy-title">
        <div className={styles.sectionHeading}>
          <p className={styles.sectionNumber}>03 / GENEALOGÍA</p>
          <h2 id="genealogy-title">UNA IDEA NO AVANZA EN LÍNEA RECTA</h2>
          <p>Puede dividirse, persistir, desaparecer del corpus y reaparecer transformada.</p>
        </div>
        <GenealogyMap periods={initialData.periods} nodes={initialData.genealogyNodes} edges={initialData.genealogyEdges} selectedPeriodId={period.id} onSelectPeriod={setPeriodId} onOpenClaim={setClaimId} />
      </section>

      <section id="comparador" className={styles.comparatorSection} aria-labelledby="comparator-title">
        <div className={styles.sectionHeading}>
          <p className={styles.sectionNumber}>04 / COMPARADOR</p>
          <h2 id="comparator-title">DOS MOMENTOS, UNA PREGUNTA</h2>
          <p>Las relaciones mostradas pertenecen a la muestra actual y conservan sus fuentes.</p>
        </div>
        <Comparator periods={initialData.periods} onOpenClaim={setClaimId} />
      </section>

      <section id="pregunta" className={styles.askSection} aria-labelledby="ask-title">
        <div className={styles.sectionHeading}>
          <p className={styles.sectionNumber}>05 / PREGUNTA A EMBRIÓN</p>
          <h2 id="ask-title">PREGUNTA DESDE EL CORPUS</h2>
          <p>La síntesis se limita a las afirmaciones y pasajes incorporados. Si no hay evidencia, debe decirlo.</p>
        </div>
        <AskEmbrion onOpenClaim={setClaimId} />
      </section>

      <footer className={styles.footer}>
        <div><strong>EMBRIÓN</strong><span>Atlas histórico de la sensibilidad poética</span></div>
        <p>{initialData.project.corpusLabel}. Periodización editable. Ninguna ausencia de la muestra se presenta como ausencia histórica.</p>
      </footer>

      <EvidenceDrawer claimId={claimId} onClose={() => setClaimId(null)} />
    </main>
  );
}
