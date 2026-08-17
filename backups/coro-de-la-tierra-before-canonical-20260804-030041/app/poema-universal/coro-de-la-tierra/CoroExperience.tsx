"use client";

import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./CoroExperience.module.css";

type Voice = {
  id: string;
  name: string;
  place: string;
  language: string;
  fragment: string;
  fileName: string;
  audio: Blob;
  createdAt: number;
};

type Draft = Omit<Voice, "id" | "fileName" | "audio" | "createdAt">;

const DB_NAME = "poema-universal-coro";
const STORE = "voices";
const initialDraft: Draft = { name: "", place: "", language: "", fragment: "" };

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) {
        request.result.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readVoices() {
  const db = await openDatabase();
  return new Promise<Voice[]>((resolve, reject) => {
    const request = db.transaction(STORE).objectStore(STORE).getAll();
    request.onsuccess = () => resolve(request.result as Voice[]);
    request.onerror = () => reject(request.error);
  }).finally(() => db.close());
}

async function saveVoice(voice: Voice) {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const request = db.transaction(STORE, "readwrite").objectStore(STORE).put(voice);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  db.close();
}

async function deleteVoice(id: string) {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const request = db.transaction(STORE, "readwrite").objectStore(STORE).delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  db.close();
}

function EarthCanvas({ energy }: { energy: React.MutableRefObject<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotation = useRef({ x: -0.2, y: 0 });
  const drag = useRef({ active: false, x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let frame = 0;

    const draw = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const size = canvas.getBoundingClientRect();
      if (canvas.width !== Math.round(size.width * ratio)) {
        canvas.width = Math.round(size.width * ratio);
        canvas.height = Math.round(size.height * ratio);
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const w = size.width;
      const h = size.height;
      const radius = Math.min(w, h) * 0.37;
      const cx = w / 2;
      const cy = h / 2;
      if (!drag.current.active) rotation.current.y += 0.0022;
      context.clearRect(0, 0, w, h);

      const halo = context.createRadialGradient(cx, cy, radius * 0.15, cx, cy, radius * 1.35);
      halo.addColorStop(0, "rgba(82,181,168,.11)");
      halo.addColorStop(0.7, "rgba(19,83,79,.08)");
      halo.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = halo;
      context.fillRect(0, 0, w, h);

      context.save();
      context.beginPath();
      context.arc(cx, cy, radius, 0, Math.PI * 2);
      context.clip();
      const globe = context.createRadialGradient(cx - radius * .35, cy - radius * .4, radius * .1, cx, cy, radius);
      globe.addColorStop(0, "#183d3c");
      globe.addColorStop(.7, "#071f21");
      globe.addColorStop(1, "#020b0d");
      context.fillStyle = globe;
      context.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      for (let lat = -70; lat <= 70; lat += 20) {
        const y = cy + Math.sin((lat * Math.PI) / 180 + rotation.current.x) * radius;
        const rx = Math.cos((lat * Math.PI) / 180) * radius;
        context.beginPath();
        context.ellipse(cx, y, Math.abs(rx), Math.abs(rx) * .15, 0, 0, Math.PI * 2);
        context.strokeStyle = "rgba(143,205,187,.14)";
        context.stroke();
      }
      for (let lon = 0; lon < 12; lon++) {
        context.beginPath();
        context.ellipse(cx, cy, Math.abs(Math.cos(rotation.current.y + lon * Math.PI / 6)) * radius, radius, 0, 0, Math.PI * 2);
        context.strokeStyle = "rgba(143,205,187,.09)";
        context.stroke();
      }
      context.restore();
      context.beginPath();
      context.arc(cx, cy, radius, 0, Math.PI * 2);
      context.strokeStyle = "rgba(190,225,207,.4)";
      context.lineWidth = 1;
      context.stroke();

      const pulse = Math.max(.08, energy.current);
      for (let index = 0; index < 16; index++) {
        const angle = performance.now() * (0.00008 + index * .000003) + index * 2.399;
        const orbit = radius * (1.02 + (index % 5) * .12);
        const x = cx + Math.cos(angle) * orbit;
        const y = cy + Math.sin(angle * 1.27) * orbit * .48;
        const dot = 1.5 + pulse * 9 * (index % 3 + 1) / 3;
        context.beginPath();
        context.arc(x, y, dot, 0, Math.PI * 2);
        context.fillStyle = index % 3 === 0 ? `rgba(231,177,100,${.25 + pulse * .65})` : `rgba(114,218,197,${.2 + pulse * .55})`;
        context.shadowBlur = 12 + pulse * 34;
        context.shadowColor = context.fillStyle;
        context.fill();
      }
      context.shadowBlur = 0;
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, [energy]);

  const pointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { active: true, x: event.clientX, y: event.clientY };
  };
  const pointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drag.current.active) return;
    rotation.current.y += (event.clientX - drag.current.x) * .009;
    rotation.current.x += (event.clientY - drag.current.y) * .005;
    drag.current.x = event.clientX;
    drag.current.y = event.clientY;
  };

  return <canvas ref={canvasRef} className={styles.earth} aria-label="Esfera terrestre interactiva" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={() => { drag.current.active = false; }} onPointerCancel={() => { drag.current.active = false; }} />;
}

export default function CoroExperience() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [playing, setPlaying] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState("Cargando archivo local…");
  const audioRefs = useRef(new Map<string, HTMLAudioElement>());
  const urls = useRef(new Map<string, string>());
  const audioContext = useRef<AudioContext | null>(null);
  const analysers = useRef(new Map<string, AnalyserNode>());
  const connected = useRef(new Set<string>());
  const energy = useRef(0);

  useEffect(() => {
    const objectUrls = urls.current;
    readVoices().then((items) => {
      setVoices(items.sort((a, b) => b.createdAt - a.createdAt));
      setMessage(items.length ? `${items.length} voces conservadas en este dispositivo.` : "La sala espera sus primeras voces.");
    }).catch(() => setMessage("El archivo local no está disponible en este navegador."));
    return () => { objectUrls.forEach((url) => URL.revokeObjectURL(url)); };
  }, []);

  useEffect(() => {
    let animation = 0;
    const sample = () => {
      let sum = 0;
      let count = 0;
      analysers.current.forEach((analyser, id) => {
        if (!playing.has(id)) return;
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        sum += data.reduce((total, value) => total + value, 0) / data.length / 255;
        count++;
      });
      energy.current += ((count ? sum / count : 0) - energy.current) * .16;
      animation = requestAnimationFrame(sample);
    };
    sample();
    return () => cancelAnimationFrame(animation);
  }, [playing]);

  const audioUrl = useCallback((voice: Voice) => {
    if (!urls.current.has(voice.id)) urls.current.set(voice.id, URL.createObjectURL(voice.audio));
    return urls.current.get(voice.id)!;
  }, []);

  const toggleAudio = async (voice: Voice) => {
    const audio = audioRefs.current.get(voice.id);
    if (!audio) return;
    if (!audioContext.current) audioContext.current = new AudioContext();
    await audioContext.current.resume();
    if (!connected.current.has(voice.id)) {
      const source = audioContext.current.createMediaElementSource(audio);
      const analyser = audioContext.current.createAnalyser();
      analyser.fftSize = 128;
      source.connect(analyser);
      analyser.connect(audioContext.current.destination);
      analysers.current.set(voice.id, analyser);
      connected.current.add(voice.id);
    }
    if (audio.paused) await audio.play(); else audio.pause();
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!files.length || !draft.name || !draft.place || !draft.language || !draft.fragment) return;
    const created = files.map((file, index): Voice => ({
      ...draft,
      id: crypto.randomUUID(),
      name: files.length > 1 ? `${draft.name} · ${index + 1}` : draft.name,
      fileName: file.name,
      audio: file,
      createdAt: Date.now() + index,
    }));
    await Promise.all(created.map(saveVoice));
    setVoices((current) => [...created, ...current]);
    setDraft(initialDraft);
    setFiles([]);
    setMessage(`${created.length} ${created.length === 1 ? "voz incorporada" : "voces incorporadas"} al coro local.`);
    const input = document.getElementById("choir-audios") as HTMLInputElement | null;
    if (input) input.value = "";
  };

  const remove = async (voice: Voice) => {
    audioRefs.current.get(voice.id)?.pause();
    await deleteVoice(voice.id);
    const url = urls.current.get(voice.id);
    if (url) URL.revokeObjectURL(url);
    urls.current.delete(voice.id);
    setVoices((current) => current.filter((item) => item.id !== voice.id));
    setPlaying((current) => { const next = new Set(current); next.delete(voice.id); return next; });
  };

  const setField = (field: keyof Draft) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft((current) => ({ ...current, [field]: event.target.value }));

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/poema-universal" className={styles.back}>← Poema Universal</Link>
        <span className={styles.coordinates}>Archivo terrestre · 2026</span>
      </header>

      <section className={styles.hero} aria-labelledby="choir-title">
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Sala sonora colectiva</p>
          <h1 id="choir-title">El Coro<br /><em>de la Tierra</em></h1>
          <p className={styles.lede}>Voces distantes comparten una órbita. Cada lengua conserva su acento; juntas, ensayan una respiración común.</p>
          <p className={styles.status} aria-live="polite"><span />{message}</p>
        </div>
        <div className={styles.globeWrap}>
          <EarthCanvas energy={energy} />
          <p>Arrastra la esfera · las luces escuchan el sonido</p>
        </div>
      </section>

      <section className={styles.archive}>
        <div className={styles.archiveHeading}>
          <p className={styles.eyebrow}>Archivo vivo</p>
          <h2>{voices.length.toString().padStart(2, "0")} voces en órbita</h2>
        </div>
        <div className={styles.voices}>
          {voices.map((voice, index) => (
            <article className={styles.voice} key={voice.id}>
              <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
              <div className={styles.voiceBody}>
                <h3>{voice.name}</h3>
                <p className={styles.meta}>{voice.place} · {voice.language}</p>
                <blockquote>“{voice.fragment}”</blockquote>
                <small>{voice.fileName}</small>
              </div>
              <div className={styles.actions}>
                <audio ref={(node) => { if (node) audioRefs.current.set(voice.id, node); else audioRefs.current.delete(voice.id); }} src={audioUrl(voice)} onPlay={() => setPlaying((current) => new Set(current).add(voice.id))} onPause={() => setPlaying((current) => { const next = new Set(current); next.delete(voice.id); return next; })} onEnded={() => setPlaying((current) => { const next = new Set(current); next.delete(voice.id); return next; })} />
                <button type="button" onClick={() => toggleAudio(voice)}>{playing.has(voice.id) ? "Pausar" : "Escuchar"}</button>
                <button type="button" className={styles.remove} onClick={() => remove(voice)}>Retirar</button>
              </div>
            </article>
          ))}
          {!voices.length && <p className={styles.empty}>Aún no hay grabaciones. La primera voz encenderá esta constelación.</p>}
        </div>
      </section>

      <section className={styles.contribute} aria-labelledby="contribute-title">
        <div>
          <p className={styles.eyebrow}>Incorporar una presencia</p>
          <h2 id="contribute-title">Entregar una voz</h2>
          <p>Los archivos y sus datos permanecen sólo en IndexedDB, dentro de este navegador local.</p>
        </div>
        <form className={styles.form} onSubmit={submit}>
          <label>Nombre<input required value={draft.name} onChange={setField("name")} /></label>
          <label>Lugar<input required value={draft.place} onChange={setField("place")} placeholder="Ciudad, país" /></label>
          <label>Idioma<input required value={draft.language} onChange={setField("language")} /></label>
          <label className={styles.full}>Fragmento<textarea required value={draft.fragment} onChange={setField("fragment")} rows={3} /></label>
          <label className={`${styles.upload} ${styles.full}`} htmlFor="choir-audios">
            <span>Seleccionar varios audios</span>
            <small>{files.length ? files.map((file) => file.name).join(" · ") : "MP3, WAV, M4A, OGG u otro formato compatible"}</small>
            <input id="choir-audios" required multiple type="file" accept="audio/*" onChange={(event) => setFiles(Array.from(event.target.files ?? []))} />
          </label>
          <button className={`${styles.submit} ${styles.full}`} type="submit">{files.length ? `Sumar ${files.length} ${files.length === 1 ? "voz" : "voces"}` : "Sumar voces"} al coro →</button>
        </form>
      </section>
    </main>
  );
}
