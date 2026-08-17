"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { VISUAL_CANON } from "@/lib/canon";
import type { Direction, GraphicMode, Plate, PlateStatus } from "@/lib/types";

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
  "Carga aquí el manuscrito .docx de la novela. Esta zona se convertirá en la columna vertebral textual de la obra gráfica.",
  "Selecciona un párrafo o una escena. El taller analizará qué debe verse, qué debe permanecer fuera de campo y qué información no puede anticiparse.",
  "Cada lámina aprobada conservará su fragmento de origen, dirección gráfica, prompt, imagen y estado para que la continuidad pueda revisarse después."
];

export default function Home() {
  const [paragraphs, setParagraphs] = useState<string[]>(SAMPLE_PARAGRAPHS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mode, setMode] = useState<GraphicMode>("poetico");
  const [direction, setDirection] = useState<Direction>(EMPTY_DIRECTION);
  const [plates, setPlates] = useState<Plate[]>([]);
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>();
  const [busy, setBusy] = useState<"import" | "analyze" | "image" | null>(null);
  const [message, setMessage] = useState("El manuscrito es la autoridad narrativa.");
  const [showCanon, setShowCanon] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("ndqd-graphic-plates-v1");
    if (saved) {
      try { setPlates(JSON.parse(saved)); } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ndqd-graphic-plates-v1", JSON.stringify(plates));
  }, [plates]);

  const fragmento = paragraphs[activeIndex] || "";
  const stats = useMemo(() => ({
    total: plates.length,
    aprobadas: plates.filter((p) => p.status === "aprobada" || p.status === "maestra").length,
    maestras: plates.filter((p) => p.status === "maestra").length
  }), [plates]);

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
      setParagraphs(data.paragraphs.length ? data.paragraphs : [data.text]);
      setActiveIndex(0);
      setDirection(EMPTY_DIRECTION);
      setImageDataUrl(undefined);
      setMessage(`${data.paragraphs.length} fragmentos disponibles para trabajar.`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error al importar.");
    } finally {
      setBusy(null);
    }
  }

  async function analyze() {
    setBusy("analyze");
    setMessage("Leyendo literariamente el fragmento…");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fragmento,
          mode,
          contextoAnterior: paragraphs[activeIndex - 1] || "",
          contextoPosterior: paragraphs[activeIndex + 1] || ""
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
      setMessage("Lámina generada. Ahora toca juzgarla, no aceptarla por defecto.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error durante la generación.");
    } finally {
      setBusy(null);
    }
  }

  function savePlate(status: PlateStatus) {
    if (!direction.accion && !direction.promptImagen) {
      setMessage("Construye primero la dirección gráfica.");
      return;
    }
    const next: Plate = {
      id: crypto.randomUUID(),
      numero: plates.length + 1,
      fragmento,
      mode,
      status,
      direction,
      imageDataUrl,
      createdAt: new Date().toISOString()
    };
    setPlates((current) => [...current, next]);
    setMessage(status === "maestra" ? "Lámina incorporada al canon maestro." : "Lámina guardada en la secuencia.");
  }

  function rejectDirection() {
    setDirection((d) => ({
      ...d,
      composicion: `${d.composicion} Replantear desde cero: reducir obviedad, recuperar tensión poética y revisar el fuera de campo.`,
      promptImagen: `${d.promptImagen}\nREVISIÓN: esta propuesta no está a la altura. Replantea encuadre, distancia, silencio y simbolismo sin añadir hechos.`
    }));
    setImageDataUrl(undefined);
    setMessage("Marcada para replanteamiento completo, no como simple variación estética.");
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">TALLER GRÁFICO · OBRA EN CONSTRUCCIÓN</p>
          <h1>No dejes que desaparezcamos</h1>
        </div>
        <div className="top-actions">
          <button className="ghost" onClick={() => setShowCanon((v) => !v)}>ADN visual</button>
          <input ref={fileRef} hidden type="file" accept=".docx,.txt" onChange={(e) => importFile(e.target.files?.[0])} />
          <button className="ghost" onClick={() => fileRef.current?.click()} disabled={!!busy}>
            {busy === "import" ? "Leyendo…" : "Cargar novela"}
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
        <span>{stats.total} láminas · {stats.aprobadas} aprobadas · {stats.maestras} maestras</span>
      </section>

      <section className="workspace">
        <aside className="column novel-column">
          <div className="column-head">
            <div><span className="index">01</span><h2>Novela</h2></div>
            <span>{activeIndex + 1}/{paragraphs.length}</span>
          </div>
          <div className="novel-scroll">
            {paragraphs.map((p, i) => (
              <button key={`${i}-${p.slice(0, 12)}`} className={`paragraph ${i === activeIndex ? "active" : ""}`} onClick={() => { setActiveIndex(i); setDirection(EMPTY_DIRECTION); setImageDataUrl(undefined); }}>
                <span>{String(i + 1).padStart(3, "0")}</span>
                <p>{p}</p>
              </button>
            ))}
          </div>
          <div className="nav-row">
            <button className="ghost" disabled={activeIndex === 0} onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}>← anterior</button>
            <button className="ghost" disabled={activeIndex >= paragraphs.length - 1} onClick={() => setActiveIndex((i) => Math.min(paragraphs.length - 1, i + 1))}>siguiente →</button>
          </div>
        </aside>

        <section className="column direction-column">
          <div className="column-head">
            <div><span className="index">02</span><h2>Dirección gráfica</h2></div>
            <span>lectura + puesta en escena</span>
          </div>

          <div className="mode-row" role="group" aria-label="Modo gráfico">
            {(["literal", "poetico", "eliptico"] as GraphicMode[]).map((item) => (
              <button key={item} className={mode === item ? "mode active" : "mode"} onClick={() => setMode(item)}>{item}</button>
            ))}
          </div>

          <button className="primary" onClick={analyze} disabled={busy === "analyze"}>
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
                <p>La imagen solo aparece después de construir la dirección.</p>
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
          <div><span className="index">04</span><h2>Secuencia</h2></div>
          <button className="ghost" onClick={() => { if (confirm("¿Borrar la secuencia local?")) setPlates([]); }}>limpiar</button>
        </div>
        <div className="timeline">
          {plates.length === 0 && <p className="timeline-empty">Todavía no hay láminas fijadas.</p>}
          {plates.map((plate) => (
            <button key={plate.id} className={`timeline-item ${plate.status}`} onClick={() => { setDirection(plate.direction); setImageDataUrl(plate.imageDataUrl); setMode(plate.mode); setMessage(`Revisando lámina ${plate.numero}.`); }}>
              <span>{String(plate.numero).padStart(3, "0")}</span>
              <StatusMark status={plate.status} />
            </button>
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

function StatusMark({ status }: { status: PlateStatus }) {
  if (status === "maestra") return <b>◆</b>;
  if (status === "aprobada") return <b>●</b>;
  if (status === "desarrollo") return <b>◐</b>;
  return <b>○</b>;
}
