"use client";

import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Voice = {
  id: string;
  name: string;
  place: string;
  language: string;
  excerpt: string;
  fileName: string;
  mimeType: string;
  size: number;
  createdAt: string;
  audio: Blob;
};

type VoiceDraft = {
  key: string;
  file: File;
  name: string;
  place: string;
  language: string;
  excerpt: string;
  status: "ready" | "uploading" | "done" | "error";
  error?: string;
};

type Point3D = { x: number; y: number; z: number; seed: number };

const MAX_SIZE = 40 * 1024 * 1024;
const ACCEPTED_AUDIO = [
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
  "audio/m4a",
  "audio/x-m4a",
  "audio/mp4",
  "audio/aac",
  "audio/ogg",
  "audio/webm",
];
const ACCEPTED_EXTENSIONS = /\.(mp3|wav|m4a|aac|ogg|webm)$/i;
const AUDIO_ACCEPT = [
  ...ACCEPTED_AUDIO,
  ".mp3",
  ".wav",
  ".m4a",
  ".aac",
  ".ogg",
  ".webm",
].join(",");
const DB_NAME = "poema-universal-coro";
const STORE_NAME = "voices";

type IncomingSelection = {
  id: number;
  files: File[];
};

function isAcceptedAudio(file: File) {
  return (
    ACCEPTED_AUDIO.includes(file.type.toLowerCase()) ||
    ACCEPTED_EXTENSIONS.test(file.name) ||
    (file.type === "" && ACCEPTED_EXTENSIONS.test(file.name))
  );
}

function inferMimeType(file: File) {
  if (file.type) return file.type;
  const extension = file.name.split(".").pop()?.toLowerCase();
  return {
    mp3: "audio/mpeg",
    wav: "audio/wav",
    m4a: "audio/mp4",
    aac: "audio/aac",
    ogg: "audio/ogg",
    webm: "audio/webm",
  }[extension ?? ""] ?? "application/octet-stream";
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readStoredVoices(): Promise<Voice[]> {
  const database = await openDatabase();
  return new Promise<Voice[]>((resolve, reject) => {
    const request = database.transaction(STORE_NAME).objectStore(STORE_NAME).getAll();
    request.onsuccess = () => {
      const stored = request.result as Array<Voice & { fragment?: string; createdAt: string | number }>;
      resolve(stored.map((voice) => ({
        ...voice,
        excerpt: voice.excerpt ?? voice.fragment ?? "",
        createdAt: new Date(voice.createdAt).toISOString(),
        mimeType: voice.mimeType || voice.audio?.type || "application/octet-stream",
        size: voice.size || voice.audio?.size || 0,
      })));
    };
    request.onerror = () => reject(request.error);
  }).finally(() => database.close());
}

async function storeVoice(voice: Voice) {
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(voice);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
  database.close();
}

async function removeStoredVoice(id: string) {
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).delete(id);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
  database.close();
}

function hashText(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

function seededValue(seed: number, index: number) {
  const value = Math.sin(seed * 0.0001 + index * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function makeDraftKey(file: File) {
  return `${file.name}-${file.lastModified}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function formatTime(value: number) {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function buildSpherePoints(total: number): Point3D[] {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: total }, (_, index) => {
    const y = 1 - (index / (total - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = goldenAngle * index;
    return {
      x: Math.cos(theta) * radius,
      y,
      z: Math.sin(theta) * radius,
      seed: seededValue(total, index),
    };
  });
}

function VoiceSphere({
  voices,
  selectedId,
  onSelect,
  energyRef,
}: {
  voices: Voice[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  energyRef: React.MutableRefObject<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const points = useMemo(() => buildSpherePoints(1380), []);
  const rotationRef = useRef({ x: -0.12, y: 0.22 });
  const velocityRef = useRef({ x: 0, y: 0.0018 });
  const dragRef = useRef({ active: false, x: 0, y: 0, moved: 0 });
  const projectedVoicesRef = useRef<Array<{ id: string; x: number; y: number; radius: number; depth: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const rotate = (point: Point3D) => {
      const cosY = Math.cos(rotationRef.current.y);
      const sinY = Math.sin(rotationRef.current.y);
      const x1 = point.x * cosY - point.z * sinY;
      const z1 = point.x * sinY + point.z * cosY;
      const cosX = Math.cos(rotationRef.current.x);
      const sinX = Math.sin(rotationRef.current.x);
      return {
        x: x1,
        y: point.y * cosX - z1 * sinX,
        z: point.y * sinX + z1 * cosX,
      };
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2 + Math.min(24, height * 0.025);
      const sphereRadius = Math.min(width, height) * 0.385;
      const energy = energyRef.current;
      const baseGlow = 0.08 + energy * 0.28;

      if (!dragRef.current.active) {
        rotationRef.current.y += velocityRef.current.y + 0.0011;
        rotationRef.current.x += velocityRef.current.x;
        velocityRef.current.x *= 0.965;
        velocityRef.current.y *= 0.965;
      }

      const halo = context.createRadialGradient(cx, cy, sphereRadius * 0.22, cx, cy, sphereRadius * 1.32);
      halo.addColorStop(0, `rgba(255, 230, 174, ${0.12 + energy * 0.15})`);
      halo.addColorStop(0.58, `rgba(213, 168, 88, ${0.05 + energy * 0.08})`);
      halo.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = halo;
      context.beginPath();
      context.arc(cx, cy, sphereRadius * 1.35, 0, Math.PI * 2);
      context.fill();

      const core = context.createRadialGradient(
        cx - sphereRadius * 0.24,
        cy - sphereRadius * 0.3,
        sphereRadius * 0.04,
        cx,
        cy,
        sphereRadius * 0.98,
      );
      core.addColorStop(0, `rgba(255,239,198,${0.13 + energy * 0.18})`);
      core.addColorStop(0.36, "rgba(129,91,42,.055)");
      core.addColorStop(0.78, "rgba(10,10,9,.4)");
      core.addColorStop(1, "rgba(0,0,0,.9)");
      context.fillStyle = core;
      context.beginPath();
      context.arc(cx, cy, sphereRadius * 0.965, 0, Math.PI * 2);
      context.fill();

      context.save();
      context.globalCompositeOperation = "screen";
      for (let orbit = 0; orbit < 4; orbit += 1) {
        const angle = -0.32 + orbit * 0.31 + Math.sin(time * 0.00008 + orbit) * 0.055;
        const radiusX = sphereRadius * (1.08 + orbit * 0.085);
        const radiusY = sphereRadius * (0.27 + orbit * 0.035);
        context.save();
        context.translate(cx, cy);
        context.rotate(angle);
        context.beginPath();
        context.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
        context.strokeStyle = `rgba(233,194,125,${0.08 + orbit * 0.025 + energy * 0.14})`;
        context.lineWidth = 0.65 + energy * 0.7;
        context.stroke();

        const lightAngle = time * (0.00018 + orbit * 0.000025) + orbit * 1.71;
        const lightX = Math.cos(lightAngle) * radiusX;
        const lightY = Math.sin(lightAngle) * radiusY;
        const orbitalGlow = context.createRadialGradient(lightX, lightY, 0, lightX, lightY, 18 + energy * 26);
        orbitalGlow.addColorStop(0, `rgba(255,244,209,${0.82 + energy * 0.15})`);
        orbitalGlow.addColorStop(0.2, "rgba(230,178,88,.34)");
        orbitalGlow.addColorStop(1, "rgba(230,178,88,0)");
        context.fillStyle = orbitalGlow;
        context.beginPath();
        context.arc(lightX, lightY, 20 + energy * 26, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
      context.restore();

      const sortedPoints = points
        .map((point) => ({ ...rotate(point), seed: point.seed }))
        .sort((a, b) => a.z - b.z);

      for (const point of sortedPoints) {
        const perspective = 0.83 + (point.z + 1) * 0.105;
        const px = cx + point.x * sphereRadius * perspective;
        const py = cy + point.y * sphereRadius * perspective;
        const front = (point.z + 1) / 2;
        const pulse = Math.max(0, Math.sin(time * 0.0014 + point.seed * 22));
        const orbitLight = Math.max(0, Math.sin(time * 0.00055 + point.seed * 45 + point.y * 6));
        const alpha = 0.12 + front * 0.64 + pulse * baseGlow + orbitLight * 0.11;
        const size = 0.35 + front * 1.18 + (pulse + energy) * 0.5;

        context.fillStyle = `rgba(255, ${Math.round(219 + front * 24)}, ${Math.round(152 + front * 70)}, ${Math.min(1, alpha)})`;
        context.beginPath();
        context.arc(px, py, size, 0, Math.PI * 2);
        context.fill();
      }

      context.save();
      context.globalCompositeOperation = "screen";
      for (let ribbon = 0; ribbon < 7; ribbon += 1) {
        context.beginPath();
        const phase = time * (0.00016 + ribbon * 0.000008) + ribbon * 0.82;
        for (let step = 0; step <= 180; step += 1) {
          const longitude = (step / 180) * Math.PI * 2 + phase;
          const latitude = Math.sin(longitude * (1.3 + ribbon * 0.07) + ribbon) * (0.18 + ribbon * 0.022);
          const local: Point3D = {
            x: Math.cos(longitude) * Math.cos(latitude),
            y: Math.sin(latitude),
            z: Math.sin(longitude) * Math.cos(latitude),
            seed: 0,
          };
          const point = rotate(local);
          if (point.z < -0.48) continue;
          const perspective = 0.83 + (point.z + 1) * 0.105;
          const px = cx + point.x * sphereRadius * perspective;
          const py = cy + point.y * sphereRadius * perspective;
          if (step === 0) context.moveTo(px, py);
          else context.lineTo(px, py);
        }
        context.strokeStyle = `rgba(255, 226, 174, ${0.12 + ribbon * 0.018 + energy * 0.17})`;
        context.lineWidth = 0.55 + energy * 0.85;
        context.stroke();
      }
      context.restore();

      const projectedVoices: Array<{ id: string; x: number; y: number; radius: number; depth: number }> = [];
      voices.forEach((voice, index) => {
        const seed = hashText(voice.id);
        const sphereIndex = seed % points.length;
        const point = rotate(points[sphereIndex]);
        const perspective = 0.83 + (point.z + 1) * 0.105;
        const px = cx + point.x * sphereRadius * perspective;
        const py = cy + point.y * sphereRadius * perspective;
        const isSelected = voice.id === selectedId;
        const glow = 5.5 + ((Math.sin(time * 0.003 + index) + 1) / 2) * 4 + energy * 9;
        const opacity = 0.32 + ((point.z + 1) / 2) * 0.68;

        context.shadowColor = isSelected ? "rgba(255,245,208,.98)" : "rgba(224,174,90,.88)";
        context.shadowBlur = glow;
        context.fillStyle = isSelected ? "#fff6dc" : `rgba(239,193,110,${opacity})`;
        context.beginPath();
        context.arc(px, py, isSelected ? 5.2 : 3.2, 0, Math.PI * 2);
        context.fill();
        context.shadowBlur = 0;
        projectedVoices.push({ id: voice.id, x: px, y: py, radius: isSelected ? 14 : 11, depth: point.z });
      });
      projectedVoicesRef.current = projectedVoices.sort((a, b) => b.depth - a.depth);

      if (projectedVoices.length > 1) {
        const constellation = [...projectedVoices].sort((a, b) => a.x - b.x);
        context.save();
        context.globalCompositeOperation = "destination-over";
        context.beginPath();
        constellation.forEach((voice, index) => {
          if (index === 0) {
            context.moveTo(voice.x, voice.y);
            return;
          }
          const previous = constellation[index - 1];
          const bend = (previous.depth + voice.depth) * sphereRadius * 0.1;
          context.quadraticCurveTo(
            (previous.x + voice.x) / 2 + bend,
            (previous.y + voice.y) / 2 - bend * 0.45,
            voice.x,
            voice.y,
          );
        });
        context.strokeStyle = `rgba(241,204,139,${0.12 + energy * 0.3})`;
        context.lineWidth = 0.7 + energy * 1.15;
        context.shadowColor = "rgba(231,181,95,.55)";
        context.shadowBlur = 8 + energy * 18;
        context.stroke();
        context.restore();
      }

      const selectedVoice = projectedVoices.find((voice) => voice.id === selectedId);
      if (selectedVoice) {
        context.save();
        context.globalCompositeOperation = "screen";
        for (let echo = 0; echo < 3; echo += 1) {
          const phase = (time * 0.00045 + echo / 3) % 1;
          context.beginPath();
          context.arc(selectedVoice.x, selectedVoice.y, 10 + phase * (34 + energy * 42), 0, Math.PI * 2);
          context.strokeStyle = `rgba(255,224,163,${(1 - phase) * (0.26 + energy * 0.38)})`;
          context.lineWidth = 0.7;
          context.stroke();
        }
        context.restore();
      }

      const sweepAngle = time * 0.00028;
      const sweepX = cx + Math.cos(sweepAngle) * sphereRadius * 0.88;
      const sweepY = cy + Math.sin(sweepAngle * 1.36) * sphereRadius * 0.42;
      const sweep = context.createRadialGradient(sweepX, sweepY, 0, sweepX, sweepY, 34 + energy * 28);
      sweep.addColorStop(0, `rgba(255,245,206,${0.75 + energy * 0.2})`);
      sweep.addColorStop(0.18, `rgba(244,190,91,${0.32 + energy * 0.22})`);
      sweep.addColorStop(1, "rgba(244,190,91,0)");
      context.fillStyle = sweep;
      context.beginPath();
      context.arc(sweepX, sweepY, 36 + energy * 28, 0, Math.PI * 2);
      context.fill();

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [energyRef, onSelect, points, selectedId, voices]);

  const onPointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { active: true, x: event.clientX, y: event.clientY, moved: 0 };
    velocityRef.current = { x: 0, y: 0 };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!dragRef.current.active) return;
    const dx = event.clientX - dragRef.current.x;
    const dy = event.clientY - dragRef.current.y;
    dragRef.current.x = event.clientX;
    dragRef.current.y = event.clientY;
    dragRef.current.moved += Math.abs(dx) + Math.abs(dy);
    rotationRef.current.y += dx * 0.006;
    rotationRef.current.x = Math.max(-1.15, Math.min(1.15, rotationRef.current.x + dy * 0.004));
    velocityRef.current = { x: dy * 0.00024, y: dx * 0.00032 };
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (dragRef.current.moved < 8) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const hit = projectedVoicesRef.current.find((voice) => Math.hypot(voice.x - x, voice.y - y) <= voice.radius);
      if (hit) onSelect(hit.id);
    }
    dragRef.current.active = false;
  };

  return (
    <canvas
      ref={canvasRef}
      className="voice-sphere"
      aria-label="Escultura coral planetaria. Arrastra para girarla y pulsa una luz para seleccionar una voz."
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => { dragRef.current.active = false; }}
    />
  );
}

function Waveform({ seed, active }: { seed: string; active: boolean }) {
  const bars = useMemo(() => {
    const hash = hashText(seed || "voice");
    return Array.from({ length: 42 }, (_, index) => 12 + seededValue(hash, index) * 62);
  }, [seed]);

  return (
    <div className={`waveform ${active ? "is-active" : ""}`} aria-hidden="true">
      {bars.map((height, index) => (
        <span key={index} style={{ height: `${height}%`, animationDelay: `${index * -34}ms` }} />
      ))}
    </div>
  );
}

function UploadStudio({
  open,
  onClose,
  onUploaded,
  onStoreVoice,
  incomingSelection,
}: {
  open: boolean;
  onClose: () => void;
  onUploaded: () => Promise<void>;
  onStoreVoice: (voice: Voice) => Promise<void>;
  incomingSelection: IncomingSelection | null;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [drafts, setDrafts] = useState<VoiceDraft[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const consumedSelectionRef = useRef<number | null>(null);

  const addFiles = useCallback((incoming: File[]) => {
    const next = incoming.map((file) => {
      const validFormat = isAcceptedAudio(file);
      const validSize = file.size > 0 && file.size <= MAX_SIZE;
      return {
        key: makeDraftKey(file),
        file,
        name: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
        place: "",
        language: "",
        excerpt: "",
        status: validFormat && validSize ? "ready" as const : "error" as const,
        error: !validFormat
          ? "Formato no válido. Usa MP3, WAV, M4A, AAC, OGG o WebM."
          : file.size <= 0
            ? "El archivo está vacío."
            : file.size > MAX_SIZE
              ? "El archivo supera los 40 MB."
              : undefined,
      };
    });
    setDrafts((current) => [...current, ...next]);
  }, []);

  useEffect(() => {
    if (
      open &&
      incomingSelection?.files.length &&
      consumedSelectionRef.current !== incomingSelection.id
    ) {
      consumedSelectionRef.current = incomingSelection.id;
      addFiles(incomingSelection.files);
    }
  }, [addFiles, incomingSelection, open]);

  const onFiles = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  };

  const updateDraft = (key: string, field: "name" | "place" | "language" | "excerpt", value: string) => {
    setDrafts((current) => current.map((draft) => draft.key === key ? { ...draft, [field]: value } : draft));
  };

  const upload = async (event: FormEvent) => {
    event.preventDefault();
    const pending = drafts.filter((draft) => draft.status === "ready");
    if (!pending.length) return;
    setIsUploading(true);

    for (const draft of pending) {
      setDrafts((current) => current.map((item) => item.key === draft.key ? { ...item, status: "uploading" } : item));
      try {
        await onStoreVoice({
          id: crypto.randomUUID(),
          name: draft.name.trim() || "Voz sin nombre",
          place: draft.place.trim(),
          language: draft.language.trim(),
          excerpt: draft.excerpt.trim(),
          fileName: draft.file.name,
          mimeType: inferMimeType(draft.file),
          size: draft.file.size,
          createdAt: new Date().toISOString(),
          audio: draft.file.slice(0, draft.file.size, inferMimeType(draft.file)),
        });
        setDrafts((current) => current.map((item) => item.key === draft.key ? { ...item, status: "done" } : item));
      } catch (error) {
        setDrafts((current) => current.map((item) => item.key === draft.key ? {
          ...item,
          status: "error",
          error: error instanceof Error ? error.message : "Error al guardar",
        } : item));
      }
    }

    await onUploaded();
    setIsUploading(false);
  };

  if (!open) return null;

  const remaining = drafts.some((draft) => draft.status === "ready");

  return (
    <div className="studio-backdrop" role="dialog" aria-modal="true" aria-labelledby="studio-title">
      <section className="upload-studio">
        <header className="studio-header">
          <div>
            <p className="eyebrow">ARCHIVO SONORO</p>
            <h2 id="studio-title">Añadir voces a la Tierra</h2>
            <p>Selecciona varias grabaciones y completa la identidad de cada voz.</p>
          </div>
          <button type="button" className="close-button" onClick={onClose} aria-label="Cerrar">×</button>
        </header>

        <form onSubmit={upload}>
          <div
            className={`drop-zone ${isDragging ? "is-dragging" : ""}`}
            onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              addFiles(Array.from(event.dataTransfer.files));
            }}
          >
            <input ref={inputRef} type="file" multiple accept={AUDIO_ACCEPT} onChange={onFiles} hidden />
            <span className="drop-icon" aria-hidden="true">＋</span>
            <strong>Arrastra aquí tus audios</strong>
            <span>o selecciona varios archivos MP3, WAV, M4A, AAC, OGG o WebM</span>
            <button type="button" className="secondary-button" onClick={() => inputRef.current?.click()}>Elegir audios</button>
          </div>

          <div className="draft-list">
            {drafts.map((draft, index) => (
              <article className={`draft-card status-${draft.status}`} key={draft.key}>
                <div className="draft-number">{String(index + 1).padStart(2, "0")}</div>
                <div className="draft-fields">
                  <div className="file-line">
                    <strong>{draft.file.name}</strong>
                    <span>{formatSize(draft.file.size)}</span>
                  </div>
                  <div className="field-grid">
                    <label>Nombre de la voz<input value={draft.name} onChange={(event) => updateDraft(draft.key, "name", event.target.value)} /></label>
                    <label>Lugar<input value={draft.place} onChange={(event) => updateDraft(draft.key, "place", event.target.value)} placeholder="Dakar, Senegal" /></label>
                    <label>Idioma<input value={draft.language} onChange={(event) => updateDraft(draft.key, "language", event.target.value)} placeholder="Wolof" /></label>
                    <label className="excerpt-field">Verso o fragmento<textarea value={draft.excerpt} onChange={(event) => updateDraft(draft.key, "excerpt", event.target.value)} placeholder="La frase que acompañará a esta voz…" rows={2} /></label>
                  </div>
                  {draft.status === "uploading" && <p className="status-line">Guardando la voz…</p>}
                  {draft.status === "done" && <p className="status-line success">Voz incorporada a la esfera</p>}
                  {draft.error && <p className="status-line error">{draft.error}</p>}
                </div>
                <button type="button" className="remove-draft" onClick={() => setDrafts((current) => current.filter((item) => item.key !== draft.key))} aria-label={`Quitar ${draft.file.name}`}>×</button>
              </article>
            ))}
          </div>

          <footer className="studio-footer">
            <p>{drafts.length ? `${drafts.length} ${drafts.length === 1 ? "grabación preparada" : "grabaciones preparadas"}` : "Puedes incorporar tantas voces como necesites"}</p>
            <button className="primary-button" type="submit" disabled={!remaining || isUploading}>
              {isUploading ? "INCORPORANDO VOCES…" : "INCORPORAR A LA ESFERA"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default function CoroExperience() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [studioOpen, setStudioOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({ current: 0, duration: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const energyRef = useRef(0);
  const animationRef = useRef(0);
  const audioUrlsRef = useRef(new Map<string, string>());
  const currentAudioIdRef = useRef<string | null>(null);
  const chooserRef = useRef<HTMLInputElement | null>(null);
  const [incomingSelection, setIncomingSelection] = useState<IncomingSelection | null>(null);

  const selected = voices.find((voice) => voice.id === selectedId) ?? voices[0] ?? null;

  const chooseVoiceFiles = () => chooserRef.current?.click();

  const receiveVoiceFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!selectedFiles.length) return;
    setIncomingSelection({ id: Date.now(), files: selectedFiles });
    setStudioOpen(true);
  };

  const loadVoices = useCallback(async () => {
    try {
      const nextVoices = (await readStoredVoices()).sort(
        (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
      );
      setVoices(nextVoices);
      setSelectedId((current) => current && nextVoices.some((voice) => voice.id === current) ? current : nextVoices[0]?.id ?? null);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No se pudo abrir el archivo sonoro");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadVoices();
  }, [loadVoices]);

  useEffect(() => {
    const audio = new Audio();
    const audioUrls = audioUrlsRef.current;
    audio.preload = "metadata";
    audioRef.current = audio;

    const updateProgress = () => setProgress({ current: audio.currentTime || 0, duration: audio.duration || 0 });
    const onEnded = () => {
      setPlayingId(null);
      energyRef.current = 0;
      setProgress((current) => ({ ...current, current: 0 }));
    };
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);
    audio.addEventListener("ended", onEnded);

    const updateEnergy = () => {
      if (analyserRef.current) {
        const data = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(data);
        const sampleCount = Math.max(1, Math.min(48, data.length));
        let sum = 0;
        for (let index = 0; index < sampleCount; index += 1) sum += data[index];
        const target = sum / sampleCount / 255;
        energyRef.current += (target - energyRef.current) * 0.18;
      } else {
        energyRef.current *= 0.9;
      }
      animationRef.current = requestAnimationFrame(updateEnergy);
    };
    animationRef.current = requestAnimationFrame(updateEnergy);

    return () => {
      cancelAnimationFrame(animationRef.current);
      audio.pause();
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateProgress);
      audio.removeEventListener("ended", onEnded);
      void audioContextRef.current?.close();
      audioUrls.forEach((url) => URL.revokeObjectURL(url));
      audioUrls.clear();
    };
  }, []);

  const getAudioUrl = useCallback((voice: Voice) => {
    const stored = audioUrlsRef.current.get(voice.id);
    if (stored) return stored;
    const url = URL.createObjectURL(voice.audio);
    audioUrlsRef.current.set(voice.id, url);
    return url;
  }, []);

  const ensureAnalyser = () => {
    const audio = audioRef.current;
    if (!audio || sourceRef.current) return;
    const AudioContextConstructor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextConstructor) return;
    const context = new AudioContextConstructor();
    const analyser = context.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    const source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);
    audioContextRef.current = context;
    analyserRef.current = analyser;
    sourceRef.current = source;
  };

  const toggleVoice = async (voice: Voice) => {
    const audio = audioRef.current;
    if (!audio) return;
    setSelectedId(voice.id);
    ensureAnalyser();
    if (audioContextRef.current?.state === "suspended") await audioContextRef.current.resume();

    if (playingId === voice.id && !audio.paused) {
      audio.pause();
      setPlayingId(null);
      return;
    }

    if (currentAudioIdRef.current !== voice.id) {
      audio.src = getAudioUrl(voice);
      currentAudioIdRef.current = voice.id;
      setProgress({ current: 0, duration: 0 });
    }
    try {
      await audio.play();
      setPlayingId(voice.id);
    } catch {
      setError("El navegador no pudo reproducir esta grabación.");
    }
  };

  const playHumanity = async () => {
    if (!voices.length) {
      setStudioOpen(true);
      return;
    }
    const currentIndex = selected ? voices.findIndex((voice) => voice.id === selected.id) : -1;
    const next = playingId ? voices[(currentIndex + 1) % voices.length] : selected ?? voices[0];
    await toggleVoice(next);
  };

  const seek = (event: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Number(event.target.value);
    setProgress((current) => ({ ...current, current: audio.currentTime }));
  };

  const deleteVoice = async (voice: Voice) => {
    if (!window.confirm(`¿Retirar la voz de ${voice.name} del archivo?`)) return;
    if (playingId === voice.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    }
    try {
      await removeStoredVoice(voice.id);
      const url = audioUrlsRef.current.get(voice.id);
      if (url) URL.revokeObjectURL(url);
      audioUrlsRef.current.delete(voice.id);
      currentAudioIdRef.current = null;
      await loadVoices();
    } catch {
      setError("No se pudo retirar la voz");
    }
  };

  return (
    <main className="coro-room">
      <input
        ref={chooserRef}
        type="file"
        multiple
        accept={AUDIO_ACCEPT}
        onChange={receiveVoiceFiles}
        hidden
        aria-label="Seleccionar voces para el Coro de la Tierra"
      />
      <div className="architectural-light" aria-hidden="true" />
      <div className="ceiling-rings" aria-hidden="true" />
      <div className="distant-archive left" aria-hidden="true" />
      <div className="distant-archive right" aria-hidden="true" />
      <div className="floor-reflection" aria-hidden="true" />

      <header className="topbar">
        <Link href="/poema-universal" className="brand">POEMA UNIVERSAL</Link>
        <div className="room-label"><span />ESCULTURA CORAL PLANETARIA<span /></div>
        <button className="add-top" type="button" onClick={chooseVoiceFiles}>＋ AÑADIR VOCES</button>
      </header>

      <section className="title-block">
        <p>MONUMENTO SONORO UNIVERSAL</p>
        <h1>EL CORO DE LA TIERRA</h1>
        <span>Cada voz talla una luz en el planeta</span>
      </section>

      <div className="sphere-stage">
        <VoiceSphere voices={voices} selectedId={selected?.id ?? null} onSelect={setSelectedId} energyRef={energyRef} />
        <div className="sphere-shadow" aria-hidden="true" />
        <div className="drag-hint" aria-hidden="true"><span>↔</span> ARRASTRA PARA GIRAR</div>
      </div>

      <aside className={`voice-card ${selected ? "has-voice" : "is-empty"}`}>
        {loading ? (
          <div className="empty-voice"><span className="voice-index">ABRIENDO ARCHIVO</span><p>Escuchando el silencio de la sala…</p></div>
        ) : selected ? (
          <>
            <div className="voice-card-head">
              <span className="voice-index">VOZ {String(voices.findIndex((voice) => voice.id === selected.id) + 1).padStart(3, "0")}</span>
              <button className="play-button" type="button" onClick={() => void toggleVoice(selected)} aria-label={playingId === selected.id ? "Pausar voz" : "Escuchar voz"}>
                {playingId === selected.id ? <span className="pause-icon" /> : <span className="play-icon" />}
              </button>
            </div>
            <div className="gold-rule" />
            <h2>{selected.name}</h2>
            <p className="origin">{[selected.place, selected.language].filter(Boolean).join(" · ") || "Procedencia por registrar"}</p>
            <Waveform seed={selected.id} active={playingId === selected.id} />
            <div className="audio-progress">
              <span>{formatTime(progress.current)}</span>
              <input type="range" min="0" max={progress.duration || 1} step="0.01" value={Math.min(progress.current, progress.duration || 1)} onChange={seek} aria-label="Posición del audio" />
              <span>{formatTime(progress.duration)}</span>
            </div>
            {selected.excerpt && <blockquote>“{selected.excerpt}”</blockquote>}
            <div className="card-actions">
              <button type="button" onClick={chooseVoiceFiles}>＋ Añadir más</button>
              <button type="button" className="remove-voice" onClick={() => void deleteVoice(selected)}>Retirar</button>
            </div>
          </>
        ) : (
          <div className="empty-voice">
            <span className="voice-index">LA PRIMERA VOZ</span>
            <h2>La Tierra está esperando</h2>
            <p>Incorpora una o varias grabaciones para que la esfera comience a guardar la memoria humana.</p>
            <button type="button" className="secondary-button" onClick={chooseVoiceFiles}>＋ AÑADIR VOCES</button>
          </div>
        )}
      </aside>

      <div className="voice-count"><strong>{voices.length}</strong><span>{voices.length === 1 ? "VOZ CONSERVADA" : "VOCES CONSERVADAS"}</span></div>

      <button type="button" className="humanity-button" onClick={() => void playHumanity()}>
        <span className="button-light" />
        {voices.length ? "ESCUCHAR A LA HUMANIDAD" : "DARLE UNA VOZ A LA TIERRA"}
      </button>

      {error && <div className="error-toast" role="alert">{error}<button onClick={() => setError(null)} aria-label="Cerrar aviso">×</button></div>}

      <UploadStudio
        open={studioOpen}
        onClose={() => setStudioOpen(false)}
        onUploaded={loadVoices}
        onStoreVoice={storeVoice}
        incomingSelection={incomingSelection}
      />
    </main>
  );
}
