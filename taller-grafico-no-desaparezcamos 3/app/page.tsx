"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { VISUAL_CANON } from "@/lib/canon";
import type { Direction, GraphicMode, ManuscriptArchitecture, NarrativeUnit, Plate, PlateStatus } from "@/lib/types";

const EMPTY_DIRECTION: Direction = {
  accion: "",
  lugar: "",
  momento: "",
  personajes: [],
  emocion: "",
  elementoDominante: "",
  simbolo: "",
  noRevelar: "",
  plano: "",
  camara: "",
  composicion: "",
  luz: "",
  textura: "",
  color: "",
  textoVisible: "",
  silencio: 70,
  promptImagen: ""
};

const SAMPLE_PARAGRAPHS = [
  "Carga aquí el manuscrito .docx de la novela. Después analiza la obra completa para convertirla en una arquitectura gráfica encadenada.",
  "La herramienta dividirá el texto en unidades narrativas, propondrá una lógica de láminas y te dejará revisar cada tramo sin perder continuidad.",
  "Cada lámina aprobada conservará su fragmento de origen, la unidad a la que pertenece, la dirección gráfica y su lugar en la secuencia general."
];

const SAMPLE_ARCHITECTURE: ManuscriptArchitecture = {
  title: "No dejes que desaparezcamos",
  globalSummary: "Cargando una arquitectura provisional de ejemplo. Importa el manuscrito y pulsa Analizar obra para construir la real.",
  visualLogic: "La obra se organiza por unidades, no por imágenes sueltas.",
  totalSuggestedPlates: 3,
  units: SAMPLE_PARAGRAPHS.map((fragmento, index) => ({
    id: `sample-${index + 1}`,
    index,
    chapter: "Muestra",
    title: `Unidad ${String(index + 1).padStart(2, "0")}`,
    fragmento,
    summary: fragmento,
    visualObjective: "Definir la estructura de trabajo.",
    shouldIllustrate: true,
    suggestedMode: "poetico" as GraphicMode,
    suggestedPlates: 1,
    notes: "Unidad de muestra."
  }))
};

export default function Home() {
  const [sourceText, setSourceText] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [paragraphs, setParagraphs] = useState<string[]>(SAMPLE_PARAGRAPHS);
  const [architecture, setArchitecture] = useState<ManuscriptArchitecture>(SAMPLE_ARCHITECTURE);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mode, setMode] = useState<GraphicMode>("poetico");
  const [direction, setDirection] = useState<Direction>(EMPTY_DIRECTION);
  const [plates, setPlates] = useState<Plate[]>([]);
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>();
  const [busy, setBusy] = useState<"import" | "architecture" | "analyze" | "image" | null>(null);
  const [message, setMessage] = useState("Carga la novela y construye su arquitectura antes de generar láminas.");
  const [showCanon, setShowCanon] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const savedPlates = localStorage.getItem("ndqd-graphic-plates-v3");
      const savedArchitecture = localStorage.getItem("ndqd-graphic-architecture-v3");
      const savedParagraphs = localStorage.getItem("ndqd-graphic-paragraphs-v3");
      const savedSource = localStorage.getItem("ndqd-graphic-source-v3");
      const savedName = localStorage.getItem("ndqd-graphic-source-name-v3");
      if (savedPlates) setPlates(JSON.parse(savedPlates));
      if (savedArchitecture) setArchitecture(JSON.parse(savedArchitecture));
      if (savedParagraphs) setParagraphs(JSON.parse(savedParagraphs));
      if (savedSource) setSourceText(savedSource);
      if (savedName) setSourceName(savedName);
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("ndqd-graphic-plates-v3", JSON.stringify(plates));
  }, [plates]);
  useEffect(() => {
    localStorage.setItem("ndqd-graphic-architecture-v3", JSON.stringify(architecture));
  }, [architecture]);
  useEffect(() => {
    localStorage.setItem("ndqd-graphic-paragraphs-v3", JSON.stringify(paragraphs));
  }, [paragraphs]);
  useEffect(() => {
    localStorage.setItem("ndqd-graphic-source-v3", sourceText);
  }, [sourceText]);
  useEffect(() => {
    localStorage.setItem("ndqd-graphic-source-name-v3", sourceName);
  }, [sourceName]);

  const units = architecture?.units?.length ? architecture.units : SAMPLE_ARCHITECTURE.units;
  const activeUnit = units[activeIndex] || units[0];
  const previousUnit = activeIndex > 0 ? units[activeIndex - 1] : undefined;
  const nextUnit = activeIndex < units.length - 1 ? units[activeIndex + 1] : undefined;
  const fragmento = activeUnit?.fragmento || "";
  const activeUnitPlates = plates.filter((plate) => plate.unitId === activeUnit?.id);
  const previousPlate = useMemo(() => {
    const approved = plates.filter((plate) => plate.status === "aprobada" || plate.status === "maestra");
    return approved[approved.length - 1];
  }, [plates]);
  const masterPlates = useMemo(
    () => plates.filter((plate) => plate.status === "maestra").slice(-3),
    [plates]
  );
  const orderedPlates = useMemo(() => [...plates].sort((a, b) => a.numero - b.numero), [plates]);

  const stats = useMemo(() => {
    const approved = plates.filter((p) => p.status === "aprobada" || p.status === "maestra").length;
    const masters = plates.filter((p) => p.status === "maestra").length;
    const illustratedUnits = units.filter((unit) => plates.some((plate) => plate.unitId === unit.id)).length;
    const readyUnits = units.filter((unit) => getUnitApprovedCount(unit, plates) >= Math.max(1, unit.suggestedPlates)).length;
    return {
      totalPlates: plates.length,
      approved,
      masters,
      totalUnits: units.length,
      illustratedUnits,
      readyUnits,
      totalSuggestedPlates: architecture.totalSuggestedPlates || units.reduce((acc, unit) => acc + unit.suggestedPlates, 0)
    };
  }, [plates, units, architecture.totalSuggestedPlates]);

  async function importFile(file?: File) {
    if (!file) return;
    setBusy("import");
    setMessage("Leyendo el manuscrito…");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/import-docx", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo importar.");
      setSourceText(data.text || "");
      setSourceName(data.filename || file.name);
      setParagraphs(Array.isArray(data.paragraphs) && data.paragraphs.length ? data.paragraphs : [data.text]);
      setArchitecture({
        ...SAMPLE_ARCHITECTURE,
        globalSummary: `Manuscrito cargado (${Array.isArray(data.paragraphs) ? data.paragraphs.length : 0} fragmentos). Pulsa “Analizar obra” para construir la arquitectura real.`,
        units: buildTempUnits(Array.isArray(data.paragraphs) && data.paragraphs.length ? data.paragraphs : [data.text])
      });
      setActiveIndex(0);
      setDirection(EMPTY_DIRECTION);
      setImageDataUrl(undefined);
      setMessage("Manuscrito cargado. Ahora analiza la obra para construir su arquitectura.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error al importar.");
    } finally {
      setBusy(null);
    }
  }

  async function buildArchitecture() {
    if (!sourceText.trim() && paragraphs.length === 0) {
      setMessage("Primero carga la novela.");
      return;
    }
    setBusy("architecture");
    setMessage("Levantando arquitectura narrativa de la obra…");
    try {
      const res = await fetch("/api/architecture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sourceText, paragraphs, title: cleanSourceName(sourceName) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo construir la arquitectura.");
      setArchitecture(data.architecture);
      setActiveIndex(0);
      setDirection(EMPTY_DIRECTION);
      setImageDataUrl(undefined);
      const info = `${data.architecture.units.length} unidades · ${data.architecture.totalSuggestedPlates} láminas sugeridas`;
      setMessage(data.source === "openai" ? `Arquitectura construida con IA. ${info}.` : `Arquitectura provisional construida localmente. ${info}.`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error al construir la arquitectura.");
    } finally {
      setBusy(null);
    }
  }

  async function analyze() {
    if (!activeUnit) return;
    setBusy("analyze");
    setMessage(`Leyendo la unidad ${String(activeIndex + 1).padStart(3, "0")}…`);
    try {
      const continuityHint = previousPlate
        ? `Última lámina aprobada: ${String(previousPlate.numero).padStart(3, "0")} · ${previousPlate.unitTitle}. Conservar línea visual compatible con composición: ${previousPlate.direction.composicion || "no definida"}; luz: ${previousPlate.direction.luz || "no definida"}; color: ${previousPlate.direction.color || "no definido"}.`
        : "No hay lámina previa aprobada todavía.";
      const canonHint = masterPlates.length
        ? `Láminas maestras recientes: ${masterPlates.map((plate) => `${String(plate.numero).padStart(3, "0")} ${plate.unitTitle}`).join(" · ")}.`
        : "Todavía no hay láminas maestras fijadas.";

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fragmento,
          mode,
          contextoAnterior: previousUnit?.fragmento || "",
          contextoPosterior: nextUnit?.fragmento || "",
          resumenUnidad: activeUnit.summary,
          objetivoVisual: activeUnit.visualObjective,
          notasUnidad: `${activeUnit.notes} ${canonHint}`.trim(),
          plateHint: `${continuityHint} Esta unidad lleva ${activeUnitPlates.length} versión(es) y sugiere ${activeUnit.suggestedPlates} lámina(s).`.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo analizar.");
      setDirection(data.direction);
      setImageDataUrl(undefined);
      setMessage(data.source === "openai" ? "Dirección construida con lectura IA." : "Dirección local construida. Añade API key para lectura profunda.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error durante el análisis.");
    } finally {
      setBusy(null);
    }
  }

  async function generateImage() {
    if (!direction.promptImagen) {
      setMessage("Primero construye la dirección gráfica.");
      return;
    }
    setBusy("image");
    setMessage("Generando la lámina desde la dirección aprobada…");
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: direction.promptImagen })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo generar.");
      setImageDataUrl(data.imageDataUrl);
      setMessage("Lámina generada. Ahora toca juzgarla, encadenarla y decidir si forma parte de la obra.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error durante la generación.");
    } finally {
      setBusy(null);
    }
  }

  function savePlate(status: PlateStatus) {
    if (!activeUnit) {
      setMessage("No hay unidad narrativa activa.");
      return;
    }
    if (!direction.accion && !direction.promptImagen) {
      setMessage("Construye primero la dirección gráfica.");
      return;
    }
    const currentUnitVersions = plates.filter((plate) => plate.unitId === activeUnit.id).length;
    const next: Plate = {
      id: crypto.randomUUID(),
      numero: plates.length + 1,
      unitId: activeUnit.id,
      unitIndex: activeUnit.index,
      unitTitle: activeUnit.title,
      orderInUnit: currentUnitVersions + 1,
      fragmento,
      mode,
      status,
      direction,
      imageDataUrl,
      createdAt: new Date().toISOString()
    };
    setPlates((current) => [...current, next]);
    if (status === "maestra") {
      setMessage(`Lámina maestra fijada en la unidad ${String(activeIndex + 1).padStart(3, "0")}. Pasa a sostener la línea visual.`);
    } else if (status === "aprobada") {
      setMessage(`Lámina aprobada en la unidad ${String(activeIndex + 1).padStart(3, "0")}. Ya entra en la secuencia narrativa.`);
    } else {
      setMessage(`Versión guardada para la unidad ${String(activeIndex + 1).padStart(3, "0")}.`);
    }
  }

  function rejectDirection() {
    setDirection((d) => ({
      ...d,
      composicion: `${d.composicion} Replantear desde cero: reducir obviedad, recuperar tensión poética y revisar el fuera de campo.`.trim(),
      promptImagen: `${d.promptImagen}\nREVISIÓN: esta propuesta no está a la altura. Replantea encuadre, distancia, silencio y simbolismo sin añadir hechos.`.trim()
    }));
    setImageDataUrl(undefined);
    setMessage("Marcada para replanteamiento completo, no como simple variación estética.");
  }

  function clearAll() {
    if (!confirm("¿Borrar la secuencia local y la arquitectura guardada?")) return;
    setPlates([]);
    setArchitecture(SAMPLE_ARCHITECTURE);
    setParagraphs(SAMPLE_PARAGRAPHS);
    setSourceText("");
    setSourceName("");
    setDirection(EMPTY_DIRECTION);
    setImageDataUrl(undefined);
    setActiveIndex(0);
    localStorage.removeItem("ndqd-graphic-plates-v3");
    localStorage.removeItem("ndqd-graphic-architecture-v3");
    localStorage.removeItem("ndqd-graphic-paragraphs-v3");
    localStorage.removeItem("ndqd-graphic-source-v3");
    localStorage.removeItem("ndqd-graphic-source-name-v3");
    setMessage("Taller reiniciado.");
  }

  function selectUnit(index: number) {
    setActiveIndex(index);
    setMode(units[index]?.suggestedMode || "poetico");
    setDirection(EMPTY_DIRECTION);
    setImageDataUrl(undefined);
    setMessage(`Trabajando en la unidad ${String(index + 1).padStart(3, "0")}.`);
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">TALLER GRÁFICO · MÁQUINA DE OBRA</p>
          <h1>{architecture.title || "No dejes que desaparezcamos"}</h1>
        </div>
        <div className="top-actions">
          <button className="ghost" onClick={() => setShowCanon((v) => !v)}>ADN visual</button>
          <input ref={fileRef} hidden type="file" accept=".docx,.txt" onChange={(e) => importFile(e.target.files?.[0])} />
          <button className="ghost" onClick={() => fileRef.current?.click()} disabled={!!busy}>
            {busy === "import" ? "Leyendo…" : "Cargar novela"}
          </button>
          <button className="ghost" onClick={buildArchitecture} disabled={busy === "architecture" || (!sourceText && paragraphs === SAMPLE_PARAGRAPHS)}>
            {busy === "architecture" ? "Analizando…" : "Analizar obra"}
          </button>
        </div>
      </header>

      {showCanon && (
        <section className="canon-panel">
          <div><span>Principio</span><strong>{VISUAL_CANON.principio}</strong></div>
          <div><span>Lenguaje</span><p>{VISUAL_CANON.lenguaje.join(" · ")}</p></div>
          <div><span>Materia</span><p>{VISUAL_CANON.materia.join(" · ")}</p></div>
          <div><span>Evitar</span><p>{VISUAL_CANON.evitar.join(" · ")}</p></div>
        </section>
      )}

      <section className="statusline">
        <span>{message}</span>
        <span>{stats.totalUnits} unidades · {stats.totalSuggestedPlates} láminas sugeridas · {stats.totalPlates} versiones guardadas</span>
      </section>

      <section className="overview-grid">
        <article className="overview-card">
          <span className="card-label">Manuscrito</span>
          <strong>{sourceName || "Sin archivo cargado"}</strong>
          <p>{architecture.globalSummary}</p>
        </article>
        <article className="overview-card">
          <span className="card-label">Lógica visual</span>
          <strong>{architecture.visualLogic}</strong>
          <p>{stats.readyUnits} de {stats.totalUnits} unidades tienen ya su tramo gráfico suficientemente fijado.</p>
        </article>
        <article className="overview-card compact-stats">
          <div><span className="card-label">Aprobadas</span><strong>{stats.approved}</strong></div>
          <div><span className="card-label">Maestras</span><strong>{stats.masters}</strong></div>
          <div><span className="card-label">Unidades con trabajo</span><strong>{stats.illustratedUnits}</strong></div>
        </article>
      </section>

      <section className="storyboard-section">
        <div className="timeline-head">
          <div><span className="index">00</span><h2>Arquitectura narrativa</h2></div>
          <span className="small-meta">Selecciona una unidad para trabajarla</span>
        </div>
        <div className="storyboard-grid">
          {units.map((unit, index) => {
            const approvedCount = getUnitApprovedCount(unit, plates);
            const totalCount = getUnitTotalCount(unit, plates);
            const isDone = approvedCount >= Math.max(1, unit.suggestedPlates);
            return (
              <button key={unit.id} className={`storyboard-item ${index === activeIndex ? "active" : ""} ${isDone ? "done" : ""}`} onClick={() => selectUnit(index)}>
                <div className="storyboard-top">
                  <span>{String(index + 1).padStart(3, "0")}</span>
                  <strong>{unit.chapter}</strong>
                </div>
                <h3>{unit.title}</h3>
                <p>{unit.summary}</p>
                <div className="storyboard-meta">
                  <span>{unit.suggestedMode}</span>
                  <span>{approvedCount}/{unit.suggestedPlates} aprobadas</span>
                  <span>{totalCount} versiones</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="workspace">
        <aside className="column novel-column">
          <div className="column-head">
            <div><span className="index">01</span><h2>Unidad narrativa</h2></div>
            <span>{activeIndex + 1}/{units.length}</span>
          </div>

          <div className="unit-card">
            <span className="mini-tag">{activeUnit?.chapter}</span>
            <h3>{activeUnit?.title}</h3>
            <p>{activeUnit?.summary}</p>
            <ul className="unit-meta-list">
              <li><strong>Objetivo:</strong> {activeUnit?.visualObjective}</li>
              <li><strong>Modo sugerido:</strong> {activeUnit?.suggestedMode}</li>
              <li><strong>Láminas sugeridas:</strong> {activeUnit?.suggestedPlates}</li>
              <li><strong>Notas:</strong> {activeUnit?.notes}</li>
            </ul>
          </div>

          <div className="novel-scroll">
            <article className="fragment-block">
              <span className="fragment-label">Fragmento activo</span>
              <p>{fragmento}</p>
            </article>
            {previousUnit && (
              <article className="fragment-block secondary">
                <span className="fragment-label">Contexto anterior</span>
                <p>{previousUnit.summary}</p>
              </article>
            )}
            {nextUnit && (
              <article className="fragment-block secondary">
                <span className="fragment-label">Contexto posterior</span>
                <p>{nextUnit.summary}</p>
              </article>
            )}
          </div>

          <div className="nav-row">
            <button className="ghost" disabled={activeIndex === 0} onClick={() => selectUnit(Math.max(0, activeIndex - 1))}>← anterior</button>
            <button className="ghost" disabled={activeIndex >= units.length - 1} onClick={() => selectUnit(Math.min(units.length - 1, activeIndex + 1))}>siguiente →</button>
          </div>
        </aside>

        <section className="column direction-column">
          <div className="column-head">
            <div><span className="index">02</span><h2>Dirección gráfica</h2></div>
            <span>lectura + puesta en escena</span>
          </div>

          <div className="chain-panel">
            <article>
              <span className="fragment-label">Continuidad previa</span>
              <p>{previousPlate ? `Última lámina aprobada: ${String(previousPlate.numero).padStart(3, "0")} · ${previousPlate.unitTitle}` : "Todavía no hay láminas aprobadas."}</p>
            </article>
            <article>
              <span className="fragment-label">Encadenamiento</span>
              <p>{activeUnitPlates.length > 0 ? `Esta unidad ya tiene ${activeUnitPlates.length} versión(es). Puedes seguir desarrollándola o cerrarla.` : "Esta unidad necesita abrir su primera lámina."}</p>
            </article>
          </div>

          <div className="line-panel">
            <div>
              <span className="fragment-label">Línea visual</span>
              <p>{masterPlates.length ? "La continuidad se apoya en las maestras recientes y en el ADN visual." : "Todavía no hay maestras; cuando fijes una, empezará a sostener la línea."}</p>
            </div>
            <div className="master-chip-row">
              {masterPlates.length === 0 && <span className="master-chip empty">sin maestras</span>}
              {masterPlates.map((plate) => (
                <span key={plate.id} className="master-chip">{String(plate.numero).padStart(3, "0")} · {plate.unitTitle}</span>
              ))}
            </div>
          </div>

          <div className="mode-row" role="group" aria-label="Modo gráfico">
            {(["literal", "poetico", "eliptico"] as GraphicMode[]).map((item) => (
              <button key={item} className={mode === item ? "mode active" : "mode"} onClick={() => setMode(item)}>{item}</button>
            ))}
          </div>

          <button className="primary" onClick={analyze} disabled={busy === "analyze" || !activeUnit}>
            {busy === "analyze" ? "LEYENDO…" : "CONSTRUIR DIRECCIÓN"}
          </button>

          <div className="direction-grid">
            <Field label="Acción" value={direction.accion} onChange={(v) => setDirection({ ...direction, accion: v })} />
            <Field label="Emoción" value={direction.emocion} onChange={(v) => setDirection({ ...direction, emocion: v })} />
            <Field label="Plano" value={direction.plano} onChange={(v) => setDirection({ ...direction, plano: v })} />
            <Field label="Cámara" value={direction.camara} onChange={(v) => setDirection({ ...direction, camara: v })} />
            <Field label="Composición" value={direction.composicion} onChange={(v) => setDirection({ ...direction, composicion: v })} wide />
            <Field label="Luz" value={direction.luz} onChange={(v) => setDirection({ ...direction, luz: v })} />
            <Field label="Color" value={direction.color} onChange={(v) => setDirection({ ...direction, color: v })} />
            <Field label="Símbolo" value={direction.simbolo} onChange={(v) => setDirection({ ...direction, simbolo: v })} />
            <Field label="No revelar" value={direction.noRevelar} onChange={(v) => setDirection({ ...direction, noRevelar: v })} />
          </div>

          <label className="silence-control">
            <span>Silencio visual <strong>{direction.silencio}%</strong></span>
            <input type="range" min="0" max="100" value={direction.silencio} onChange={(e) => setDirection({ ...direction, silencio: Number(e.target.value) })} />
          </label>

          <Field label="Texto visible" value={direction.textoVisible} onChange={(v) => setDirection({ ...direction, textoVisible: v })} wide placeholder="Vacío también es una decisión." />
          <Field label="Prompt maestro" value={direction.promptImagen} onChange={(v) => setDirection({ ...direction, promptImagen: v })} wide tall />
        </section>

        <section className="column plate-column">
          <div className="column-head">
            <div><span className="index">03</span><h2>Lámina</h2></div>
            <span>{String(plates.length + 1).padStart(3, "0")}</span>
          </div>

          <div className={`plate-stage ${imageDataUrl ? "has-image" : ""}`}>
            {imageDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageDataUrl} alt="Lámina generada" />
            ) : (
              <div className="empty-plate">
                <span>VIÑETA PENDIENTE</span>
                <p>La imagen solo aparece después de construir la dirección y generar la lámina.</p>
              </div>
            )}
            {direction.textoVisible && <blockquote>{direction.textoVisible}</blockquote>}
          </div>

          <button className="primary" onClick={generateImage} disabled={busy === "image" || !direction.promptImagen}>
            {busy === "image" ? "GENERANDO…" : "GENERAR LÁMINA"}
          </button>

          <div className="judgement-row">
            <button className="danger" onClick={rejectDirection}>NO ESTÁ A LA ALTURA</button>
            <button className="ghost" onClick={() => savePlate("desarrollo")}>guardar versión</button>
          </div>
          <div className="judgement-row">
            <button className="ghost" onClick={() => savePlate("aprobada")}>APROBAR</button>
            <button className="master" onClick={() => savePlate("maestra")}>◆ HACER MAESTRA</button>
          </div>
        </section>
      </section>

      <section className="timeline-section">
        <div className="timeline-head">
          <div><span className="index">04</span><h2>Secuencia narrativa</h2></div>
          <button className="ghost" onClick={clearAll}>limpiar</button>
        </div>
        <div className="narrative-strip">
          {orderedPlates.length === 0 && <p className="timeline-empty">Todavía no hay láminas fijadas.</p>}
          {orderedPlates.map((plate, index) => (
            <div key={plate.id} className="narrative-segment">
              <button className={`strip-card ${plate.status}`} onClick={() => {
                setActiveIndex(plate.unitIndex);
                setDirection(plate.direction);
                setImageDataUrl(plate.imageDataUrl);
                setMode(plate.mode);
                setMessage(`Revisando lámina ${plate.numero} de la unidad ${String(plate.unitIndex + 1).padStart(3, "0")}.`);
              }}>
                <div className="strip-thumb">
                  {plate.imageDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={plate.imageDataUrl} alt={`Lámina ${plate.numero}`} />
                  ) : (
                    <div className="strip-placeholder">sin imagen</div>
                  )}
                </div>
                <div className="strip-copy">
                  <span>{String(plate.numero).padStart(3, "0")} · U{String(plate.unitIndex + 1).padStart(3, "0")}</span>
                  <strong>{plate.unitTitle}</strong>
                  <small>{statusLabel(plate.status)}</small>
                </div>
              </button>
              {index < orderedPlates.length - 1 && <div className="strip-arrow">→</div>}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Field({ label, value, onChange, wide, tall, placeholder }: { label: string; value: string; onChange: (v: string) => void; wide?: boolean; tall?: boolean; placeholder?: string }) {
  return (
    <label className={`field ${wide ? "wide" : ""}`}>
      <span>{label}</span>
      <textarea rows={tall ? 7 : 3} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function getUnitApprovedCount(unit: NarrativeUnit, plates: Plate[]) {
  return plates.filter((plate) => plate.unitId === unit.id && (plate.status === "aprobada" || plate.status === "maestra")).length;
}

function getUnitTotalCount(unit: NarrativeUnit, plates: Plate[]) {
  return plates.filter((plate) => plate.unitId === unit.id).length;
}

function buildTempUnits(paragraphs: string[]): NarrativeUnit[] {
  return paragraphs.slice(0, 60).map((fragmento, index) => ({
    id: `temp-${index + 1}`,
    index,
    chapter: "Pendiente de análisis",
    title: `Fragmento ${String(index + 1).padStart(3, "0")}`,
    fragmento,
    summary: fragmento.slice(0, 180),
    visualObjective: "Pendiente de construir mediante el análisis global.",
    shouldIllustrate: true,
    suggestedMode: "poetico",
    suggestedPlates: 1,
    notes: "Analiza la obra para convertir estos fragmentos en unidades narrativas reales."
  }));
}

function cleanSourceName(name: string) {
  return name.replace(/\.[^.]+$/, "").trim() || "No dejes que desaparezcamos";
}

function statusLabel(status: PlateStatus) {
  if (status === "maestra") return "maestra";
  if (status === "aprobada") return "aprobada";
  if (status === "desarrollo") return "desarrollo";
  return "pendiente";
}
