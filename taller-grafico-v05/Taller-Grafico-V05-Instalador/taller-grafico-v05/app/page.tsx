"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { VISUAL_CANON } from "@/lib/canon";
import { clearProject, loadProject, saveProject } from "@/lib/storage";
import type { Chapter, Direction, GraphicMode, ManuscriptArchitecture, NarrativeUnit, Plate, PlateStatus, ProjectState, StructuredDocument } from "@/lib/types";

const EMPTY_DIRECTION: Direction = {
  accion: "", lugar: "", momento: "", personajes: [], emocion: "", elementoDominante: "", simbolo: "", noRevelar: "",
  plano: "", camara: "", composicion: "", luz: "", textura: "", color: "", textoVisible: "", silencio: 70, promptImagen: ""
};

const EMPTY_PROJECT: ProjectState = { chapterUnits: {}, plates: [] };

type ApiStatus = { hasKey: boolean; textModel: string; imageModel: string };

export default function Home() {
  const [project, setProject] = useState<ProjectState>(EMPTY_PROJECT);
  const [activeChapterId, setActiveChapterId] = useState("");
  const [activeUnitId, setActiveUnitId] = useState("");
  const [mode, setMode] = useState<GraphicMode>("poetico");
  const [direction, setDirection] = useState<Direction>(EMPTY_DIRECTION);
  const [imageDataUrl, setImageDataUrl] = useState<string>();
  const [quality, setQuality] = useState<"low" | "medium" | "high">("medium");
  const [message, setMessage] = useState("Carga la novela. El Taller separará estructura literaria, unidades gráficas y láminas.");
  const [busy, setBusy] = useState<"import" | "architecture" | "chapter" | "direction" | "image" | null>(null);
  const [showCanon, setShowCanon] = useState(false);
  const [ready, setReady] = useState(false);
  const [api, setApi] = useState<ApiStatus>({ hasKey: false, textModel: "", imageModel: "" });
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([
      loadProject().catch(() => null),
      fetch("/api/status").then((r) => r.json()).catch(() => ({ hasKey: false, textModel: "", imageModel: "" }))
    ]).then(([saved, status]) => {
      if (saved) {
        setProject(saved);
        const first = firstNarrativeChapter(saved.document);
        if (first) setActiveChapterId(first.id);
      }
      setApi(status);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(() => {
      saveProject(project).catch(() => setMessage("No se pudo guardar el proyecto en IndexedDB."));
    }, 450);
    return () => window.clearTimeout(timer);
  }, [project, ready]);

  const document = project.document;
  const architecture = project.architecture;
  const chapters = document?.chapters || [];
  const activeChapter = chapters.find((c) => c.id === activeChapterId) || chapters[0];
  const units = activeChapter ? project.chapterUnits[activeChapter.id] || [] : [];
  const activeUnit = units.find((u) => u.id === activeUnitId) || units[0];
  const activeUnitIndex = activeUnit ? units.findIndex((u) => u.id === activeUnit.id) : -1;
  const previousUnit = activeUnitIndex > 0 ? units[activeUnitIndex - 1] : undefined;
  const nextUnit = activeUnitIndex >= 0 && activeUnitIndex < units.length - 1 ? units[activeUnitIndex + 1] : undefined;

  useEffect(() => {
    if (!activeChapter) return;
    const chapterUnits = project.chapterUnits[activeChapter.id] || [];
    if (chapterUnits.length) {
      setActiveUnitId((id) => chapterUnits.some((u) => u.id === id) ? id : chapterUnits[0].id);
      setMode(chapterUnits[0].suggestedMode);
    } else setActiveUnitId("");
    setDirection(EMPTY_DIRECTION);
    setImageDataUrl(undefined);
  }, [activeChapterId]); // eslint-disable-line react-hooks/exhaustive-deps

  const lastApproved = useMemo(() => {
    const filtered = project.plates.filter((p) => p.status === "aprobada" || p.status === "maestra");
    return filtered[filtered.length - 1];
  }, [project.plates]);
  const masters = useMemo(() => project.plates.filter((p) => p.status === "maestra").slice(-4), [project.plates]);
  const chapterPlan = architecture?.chapterPlans.find((p) => p.chapterId === activeChapter?.id);

  async function importNovel(file?: File) {
    if (!file) return;
    setBusy("import"); setMessage("Leyendo estructura del DOCX…");
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/import-docx", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo leer el documento.");
      const doc = data.document as StructuredDocument;
      setProject({ document: doc, architecture: undefined, chapterUnits: {}, plates: [] });
      const first = firstNarrativeChapter(doc) || doc.chapters[0];
      setActiveChapterId(first?.id || "");
      setActiveUnitId(""); setDirection(EMPTY_DIRECTION); setImageDataUrl(undefined);
      setMessage(`Documento leído: ${doc.chapters.length} bloques principales · ${doc.paragraphCount} párrafos. Ahora construye la arquitectura global.`);
    } catch (e) { setMessage(errorText(e)); }
    finally { setBusy(null); }
  }

  async function analyzeWork() {
    if (!document) return;
    setBusy("architecture"); setMessage("Analizando la arquitectura global de la obra…");
    try {
      const res = await fetch("/api/architecture", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ document }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo analizar la obra.");
      setProject((p) => ({ ...p, architecture: data.architecture as ManuscriptArchitecture }));
      setMessage(data.source === "openai" ? "Arquitectura global analizada con IA. Ahora entra en un capítulo y analiza sus escenas." : `Arquitectura provisional creada. ${data.warning || "Comprueba la API para análisis profundo."}`);
    } catch (e) { setMessage(errorText(e)); }
    finally { setBusy(null); }
  }

  async function analyzeChapter() {
    if (!activeChapter) return;
    setBusy("chapter"); setMessage(`Analizando “${activeChapter.title}” por escenas y unidades gráficas…`);
    const index = chapters.findIndex((c) => c.id === activeChapter.id);
    try {
      const res = await fetch("/api/analyze-chapter", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapter: activeChapter, previousTitle: chapters[index - 1]?.title, nextTitle: chapters[index + 1]?.title })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo analizar el capítulo.");
      const nextUnits = data.units as NarrativeUnit[];
      setProject((p) => ({ ...p, chapterUnits: { ...p.chapterUnits, [activeChapter.id]: nextUnits } }));
      setActiveUnitId(nextUnits.find((u) => u.shouldIllustrate)?.id || nextUnits[0]?.id || "");
      const first = nextUnits.find((u) => u.shouldIllustrate) || nextUnits[0];
      if (first) setMode(first.suggestedMode);
      setMessage(data.source === "openai" ? `${nextUnits.length} unidades gráficas construidas con IA.` : `${nextUnits.length} unidades provisionales. ${data.warning || ""}`);
    } catch (e) { setMessage(errorText(e)); }
    finally { setBusy(null); }
  }

  async function buildDirection() {
    if (!activeUnit) return;
    setBusy("direction"); setMessage("Construyendo puesta en escena y continuidad…");
    const continuity = [
      lastApproved ? `Última lámina aprobada ${lastApproved.numero}: ${lastApproved.unitTitle}. Composición: ${lastApproved.direction.composicion}. Luz: ${lastApproved.direction.luz}. Color: ${lastApproved.direction.color}.` : "No existe lámina previa aprobada.",
      masters.length ? `Láminas maestras: ${masters.map((p) => `${p.numero} (${p.unitTitle}; ${p.direction.textura}; ${p.direction.color})`).join(" | ")}.` : "No hay maestras todavía."
    ].join("\n");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fragmento: activeUnit.fragmento, mode, summary: activeUnit.summary, visualObjective: activeUnit.visualObjective, notes: activeUnit.notes, contextoAnterior: previousUnit?.fragmento || "", contextoPosterior: nextUnit?.fragmento || "", continuity })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo construir la dirección.");
      setDirection(data.direction); setImageDataUrl(undefined);
      setMessage(data.source === "openai" ? "Dirección gráfica construida con IA. Ya puedes generar una lámina." : `Dirección provisional. ${data.warning || ""}`);
    } catch (e) { setMessage(errorText(e)); }
    finally { setBusy(null); }
  }

  async function generatePlate() {
    if (!direction.promptImagen) { setMessage("Primero construye la dirección gráfica."); return; }
    setBusy("image"); setMessage(`Generando lámina ${quality === "low" ? "de prueba" : quality === "medium" ? "de trabajo" : "final"}…`);
    try {
      const res = await fetch("/api/generate-image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: direction.promptImagen, quality }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo generar la imagen.");
      setImageDataUrl(data.imageDataUrl);
      setMessage("Lámina generada. Júzgala antes de incorporarla a la secuencia.");
    } catch (e) { setMessage(errorText(e)); }
    finally { setBusy(null); }
  }

  function savePlate(status: PlateStatus) {
    if (!activeUnit || !direction.promptImagen) { setMessage("Construye primero la dirección."); return; }
    if ((status === "aprobada" || status === "maestra") && !imageDataUrl) { setMessage("Genera la imagen antes de aprobarla o hacerla maestra."); return; }
    const plate: Plate = {
      id: crypto.randomUUID(), numero: project.plates.length + 1, chapterId: activeUnit.chapterId, chapterTitle: activeUnit.chapterTitle,
      unitId: activeUnit.id, unitTitle: activeUnit.title, unitIndex: activeUnit.index, mode, status, direction, imageDataUrl, createdAt: new Date().toISOString()
    };
    setProject((p) => ({ ...p, plates: [...p.plates, plate] }));
    setMessage(status === "maestra" ? "Lámina maestra fijada: desde ahora sostiene el canon visual." : status === "aprobada" ? "Lámina incorporada a la secuencia narrativa." : "Versión guardada en desarrollo.");
  }

  function selectUnit(unit: NarrativeUnit) {
    setActiveUnitId(unit.id); setMode(unit.suggestedMode); setDirection(EMPTY_DIRECTION); setImageDataUrl(undefined);
    setMessage(`Unidad activa: ${unit.title}`);
  }

  async function resetProject() {
    if (!confirm("¿Borrar el proyecto local del Taller?")) return;
    await clearProject(); setProject(EMPTY_PROJECT); setActiveChapterId(""); setActiveUnitId(""); setDirection(EMPTY_DIRECTION); setImageDataUrl(undefined);
    setMessage("Proyecto local reiniciado.");
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div><p className="eyebrow">TALLER GRÁFICO · DIRECCIÓN DE OBRA</p><h1>{document?.title || "No dejes que desaparezcamos"}</h1></div>
        <div className="top-actions">
          <span className={`api-pill ${api.hasKey ? "ok" : "bad"}`}>{api.hasKey ? `IA activa · ${api.textModel} · ${api.imageModel}` : "IA sin configurar"}</span>
          <button className="ghost" onClick={() => setShowCanon((v) => !v)}>ADN visual</button>
          <input ref={fileRef} hidden type="file" accept=".docx,.txt" onChange={(e) => importNovel(e.target.files?.[0])} />
          <button className="ghost" onClick={() => fileRef.current?.click()} disabled={!!busy}>{busy === "import" ? "Leyendo…" : "Cargar novela"}</button>
          <button className="ghost strong" onClick={analyzeWork} disabled={!document || !!busy}>{busy === "architecture" ? "Analizando…" : "Analizar obra"}</button>
        </div>
      </header>

      {showCanon && <section className="canon-panel">
        <div><span>Principio</span><strong>{VISUAL_CANON.principio}</strong></div><div><span>Lenguaje</span><p>{VISUAL_CANON.lenguaje.join(" · ")}</p></div>
        <div><span>Materia</span><p>{VISUAL_CANON.materia.join(" · ")}</p></div><div><span>Evitar</span><p>{VISUAL_CANON.evitar.join(" · ")}</p></div>
      </section>}

      <section className="statusline"><span>{message}</span><span>{document ? `${document.chapters.length} bloques · ${document.paragraphCount} párrafos` : "sin manuscrito"} · {project.plates.length} láminas</span></section>

      {!document ? <section className="empty-home"><p>01</p><h2>Carga el manuscrito completo</h2><p>El Taller detectará prólogo, capítulos y epílogo antes de convertir escenas en unidades gráficas. No generará una imagen por párrafo.</p><button className="primary fit" onClick={() => fileRef.current?.click()}>CARGAR DOCX</button></section> : <>
        <section className="architecture-header">
          <div><span className="index">00</span><h2>Arquitectura maestra</h2></div>
          <div className="architecture-copy"><strong>{architecture?.globalSummary || "Todavía no se ha analizado la arquitectura global."}</strong><p>{architecture?.visualLogic || "Pulsa Analizar obra para construir el mapa narrativo antes de generar."}</p></div>
          <div className="architecture-stat"><span>estimación</span><b>{architecture?.estimatedPlates ?? "—"}</b><small>láminas / unidades</small></div>
        </section>

        <section className="chapter-rail">
          {chapters.map((chapter) => {
            const plan = architecture?.chapterPlans.find((p) => p.chapterId === chapter.id);
            const count = project.chapterUnits[chapter.id]?.length || 0;
            const plateCount = project.plates.filter((p) => p.chapterId === chapter.id && (p.status === "aprobada" || p.status === "maestra")).length;
            return <button key={chapter.id} className={`chapter-card ${activeChapter?.id === chapter.id ? "active" : ""} ${chapter.kind === "frontmatter" ? "front" : ""}`} onClick={() => setActiveChapterId(chapter.id)}>
              <span>{String(chapter.index + 1).padStart(2, "0")} · {chapter.kind}</span><strong>{chapter.title}</strong><p>{plan?.role || `${chapter.wordCount} palabras`}</p><small>{count ? `${count} unidades` : "sin analizar"} · {plateCount} láminas</small>
            </button>;
          })}
        </section>

        <section className="chapter-bar"><div><span className="index">01</span><h2>{activeChapter?.title}</h2></div><button className="primary fit" onClick={analyzeChapter} disabled={!activeChapter || !!busy}>{busy === "chapter" ? "ANALIZANDO CAPÍTULO…" : "ANALIZAR CAPÍTULO / ESCENAS"}</button></section>

        <section className="workspace">
          <aside className="column units-column">
            <div className="column-head"><div><span className="index">02</span><h2>Unidades gráficas</h2></div><span>{units.length}</span></div>
            {chapterPlan && <div className="chapter-insight"><span>{chapterPlan.visualDensity} densidad</span><p><b>Tensión:</b> {chapterPlan.tension}</p>{chapterPlan.motifs.length > 0 && <p><b>Motivos:</b> {chapterPlan.motifs.join(" · ")}</p>}</div>}
            <div className="unit-list">
              {units.length === 0 && <div className="notice">Analiza este capítulo. Aquí aparecerán escenas agrupadas por necesidad visual, no por párrafo.</div>}
              {units.map((unit) => <button key={unit.id} className={`unit-item ${activeUnit?.id === unit.id ? "active" : ""} ${!unit.shouldIllustrate ? "skip" : ""}`} onClick={() => selectUnit(unit)}>
                <div><span>U{String(unit.index + 1).padStart(3, "0")}</span><small>{unit.shouldIllustrate ? `${unit.suggestedMode} · ${unit.suggestedPlates} lámina(s)` : "NO ILUSTRAR"}</small></div>
                <strong>{unit.title}</strong><p>{unit.summary}</p>
              </button>)}
            </div>
            {activeUnit && <div className="source-fragment"><span>Fragmento exacto</span><p>{activeUnit.fragmento}</p></div>}
          </aside>

          <section className="column direction-column">
            <div className="column-head"><div><span className="index">03</span><h2>Dirección gráfica</h2></div><span>continuidad + puesta en escena</span></div>
            {activeUnit ? <>
              <div className="unit-brief"><span>{activeUnit.visualObjective}</span><p>{activeUnit.notes}</p></div>
              <div className="continuity-row"><div><span>Anterior</span><p>{lastApproved ? `${lastApproved.numero} · ${lastApproved.unitTitle}` : "inicio de secuencia"}</p></div><div><span>Maestras</span><p>{masters.length ? masters.map((p) => p.numero).join(" · ") : "ninguna todavía"}</p></div></div>
              <div className="mode-row">{(["literal", "poetico", "eliptico"] as GraphicMode[]).map((m) => <button key={m} className={`mode ${mode === m ? "active" : ""}`} onClick={() => setMode(m)}>{m}</button>)}</div>
              <button className="primary" onClick={buildDirection} disabled={!activeUnit.shouldIllustrate || !!busy}>{busy === "direction" ? "CONSTRUYENDO…" : activeUnit.shouldIllustrate ? "CONSTRUIR DIRECCIÓN" : "ESTA UNIDAD NO PIDE IMAGEN"}</button>
              <div className="direction-grid">
                <Field label="Acción" value={direction.accion} onChange={(v) => setDirection({ ...direction, accion: v })}/><Field label="Emoción" value={direction.emocion} onChange={(v) => setDirection({ ...direction, emocion: v })}/>
                <Field label="Plano" value={direction.plano} onChange={(v) => setDirection({ ...direction, plano: v })}/><Field label="Cámara" value={direction.camara} onChange={(v) => setDirection({ ...direction, camara: v })}/>
                <Field label="Composición" value={direction.composicion} onChange={(v) => setDirection({ ...direction, composicion: v })} wide/><Field label="Luz" value={direction.luz} onChange={(v) => setDirection({ ...direction, luz: v })}/><Field label="Color" value={direction.color} onChange={(v) => setDirection({ ...direction, color: v })}/>
                <Field label="Símbolo" value={direction.simbolo} onChange={(v) => setDirection({ ...direction, simbolo: v })}/><Field label="No revelar" value={direction.noRevelar} onChange={(v) => setDirection({ ...direction, noRevelar: v })}/>
              </div>
              <label className="silence-control"><span>Silencio visual <strong>{direction.silencio}%</strong></span><input type="range" min="0" max="100" value={direction.silencio} onChange={(e) => setDirection({ ...direction, silencio: Number(e.target.value) })}/></label>
              <Field label="Texto visible" value={direction.textoVisible} onChange={(v) => setDirection({ ...direction, textoVisible: v })} wide/><Field label="Prompt maestro" value={direction.promptImagen} onChange={(v) => setDirection({ ...direction, promptImagen: v })} wide tall/>
            </> : <div className="notice">Selecciona o analiza una unidad gráfica.</div>}
          </section>

          <section className="column plate-column">
            <div className="column-head"><div><span className="index">04</span><h2>Lámina</h2></div><span>{String(project.plates.length + 1).padStart(3, "0")}</span></div>
            <div className={`plate-stage ${imageDataUrl ? "has-image" : ""}`}>{imageDataUrl ? <img src={imageDataUrl} alt="Lámina generada"/> : <div className="empty-plate"><span>LÁMINA PENDIENTE</span><p>Primero analiza una unidad y construye su dirección.</p></div>}{direction.textoVisible && <blockquote>{direction.textoVisible}</blockquote>}</div>
            <div className="quality-row"><span>Calidad</span><select value={quality} onChange={(e) => setQuality(e.target.value as any)}><option value="low">prueba · rápida</option><option value="medium">trabajo</option><option value="high">final</option></select></div>
            <button className="primary" onClick={generatePlate} disabled={!direction.promptImagen || !!busy || !api.hasKey}>{busy === "image" ? "GENERANDO…" : api.hasKey ? "GENERAR LÁMINA" : "FALTA API KEY"}</button>
            <div className="judgement-row"><button className="ghost" onClick={() => savePlate("desarrollo")}>guardar versión</button><button className="ghost" onClick={() => savePlate("aprobada")}>APROBAR</button></div>
            <button className="master full" onClick={() => savePlate("maestra")}>◆ HACER MAESTRA</button>
          </section>
        </section>

        <section className="sequence-section"><div className="timeline-head"><div><span className="index">05</span><h2>Línea / secuencia narrativa</h2></div><button className="ghost" onClick={resetProject}>reiniciar proyecto</button></div>
          <div className="narrative-strip">{project.plates.length === 0 && <p className="timeline-empty">Cuando apruebes láminas aparecerán aquí encadenadas.</p>}{project.plates.map((plate, i) => <div className="narrative-segment" key={plate.id}><button className={`strip-card ${plate.status}`} onClick={() => { setActiveChapterId(plate.chapterId); setActiveUnitId(plate.unitId); setMode(plate.mode); setDirection(plate.direction); setImageDataUrl(plate.imageDataUrl); }}><div className="strip-thumb">{plate.imageDataUrl ? <img src={plate.imageDataUrl} alt={`Lámina ${plate.numero}`}/> : <span>dirección</span>}</div><div className="strip-copy"><span>{String(plate.numero).padStart(3,"0")}</span><strong>{plate.unitTitle}</strong><small>{plate.status}</small></div></button>{i < project.plates.length - 1 && <div className="strip-arrow">→</div>}</div>)}</div>
        </section>
      </>}
    </main>
  );
}

function Field({ label, value, onChange, wide, tall }: { label: string; value: string; onChange: (value: string) => void; wide?: boolean; tall?: boolean }) {
  return <label className={`field ${wide ? "wide" : ""}`}><span>{label}</span><textarea rows={tall ? 7 : 3} value={value} onChange={(e) => onChange(e.target.value)}/></label>;
}

function firstNarrativeChapter(document?: StructuredDocument) {
  return document?.chapters.find((c) => c.kind !== "frontmatter") || document?.chapters[0];
}
function errorText(error: unknown) { return error instanceof Error ? error.message : "Ha ocurrido un error."; }
