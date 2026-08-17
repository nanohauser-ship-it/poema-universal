"use client";

import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  CSSProperties,
  FormEvent,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ACESFilmicToneMapping,
  CatmullRomCurve3,
  DoubleSide,
  Group,
  Vector3,
} from "three";

type Contribution = {
  id: string;
  school: string;
  place: string;
  title: string;
  language: string;
  poem: string[];
  empty?: boolean;
  synced?: boolean;
};

type ArchiveVertebra = {
  id: string;
  voice: string;
  territory: string;
  fragment: string;
  synced?: boolean;
};

type ArchiveResponse = {
  vertebrae?: ArchiveVertebra[];
  vertebra?: ArchiveVertebra;
  error?: string;
};

type ArchiveStatus = "loading" | "synced" | "saving" | "pending";

const CLEAN_VERTEBRAE: Contribution[] = Array.from(
  { length: 12 },
  (_, index) => ({
    id: `VE-CLEAN-${String(index + 1).padStart(2, "0")}`,
    school: "",
    place: "",
    title: "",
    language: "",
    poem: [],
    empty: true,
    synced: true,
  })
);

const STORAGE_KEY = "poema-universal:encadenamiento:contributions";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

function useWebGLAvailable() {
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    let context: RenderingContext | null = null;

    try {
      context = canvas.getContext("webgl2", {
        failIfMajorPerformanceCaveat: true,
      });
      context ||= canvas.getContext("webgl", {
        failIfMajorPerformanceCaveat: true,
      });
    } catch {
      context = null;
    }

    const frame = window.requestAnimationFrame(() => {
      setAvailable(Boolean(context));
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return available;
}

function readLocalContributions() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is Contribution =>
        item &&
        typeof item.id === "string" &&
        typeof item.school === "string" &&
        typeof item.place === "string" &&
        typeof item.title === "string" &&
        typeof item.language === "string" &&
        Array.isArray(item.poem)
    );
  } catch {
    return [];
  }
}

function saveLocalContributions(contributions: Contribution[]) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(contributions.filter((item) => !item.empty))
    );
  } catch {
    // La sala sigue funcionando aunque el dispositivo bloquee localStorage.
  }
}

function decodeArchiveVertebra(vertebra: ArchiveVertebra): Contribution | null {
  // Las seis voces beige pertenecen al rediseño descartado y no se muestran
  // dentro de la Habitación del Encadenamiento original.
  if (vertebra.id.startsWith("fundacional-")) return null;

  try {
    const payload = JSON.parse(vertebra.fragment) as {
      title?: unknown;
      language?: unknown;
      poem?: unknown;
    };

    if (!Array.isArray(payload.poem)) return null;

    const poem = payload.poem.filter(
      (line): line is string => typeof line === "string" && Boolean(line.trim())
    );

    if (!poem.length) return null;

    return {
      id: vertebra.id,
      school: vertebra.voice,
      place: vertebra.territory,
      title: typeof payload.title === "string" ? payload.title : "Poema donado",
      language:
        typeof payload.language === "string" ? payload.language : "Lengua original",
      poem,
      empty: false,
      synced: true,
    };
  } catch {
    return {
      id: vertebra.id,
      school: vertebra.voice,
      place: vertebra.territory,
      title: "Poema donado",
      language: "Lengua original",
      poem: [vertebra.fragment],
      empty: false,
      synced: true,
    };
  }
}

function buildColumn(contributions: Contribution[]) {
  const column = CLEAN_VERTEBRAE.map((item) => ({ ...item }));

  contributions.forEach((contribution) => {
    const cleanIndex = column.findIndex((item) => item.empty);
    const filled = { ...contribution, empty: false };

    if (cleanIndex >= 0) column[cleanIndex] = filled;
    else column.push(filled);
  });

  return column;
}

function mergeContributions(remote: Contribution[], local: Contribution[]) {
  const merged = new Map<string, Contribution>();
  remote.forEach((item) => merged.set(item.id, item));
  local.forEach((item) => {
    if (!merged.has(item.id)) merged.set(item.id, item);
  });
  return [...merged.values()];
}

async function persistContribution(contribution: Contribution) {
  const response = await fetch("/api/poema-universal/encadenamiento", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: contribution.id,
      voice: contribution.school,
      territory: contribution.place,
      fragment: JSON.stringify({
        title: contribution.title,
        language: contribution.language,
        poem: contribution.poem,
      }),
      website: "",
    }),
  });

  const data = (await response.json()) as ArchiveResponse;
  if (!response.ok || !data.vertebra) {
    throw new Error(data.error ?? "No se pudo guardar la vértebra.");
  }
}

function VertebraMaterial({
  active,
  hovered,
  filled,
}: {
  active: boolean;
  hovered: boolean;
  filled: boolean;
}) {
  return (
    <meshPhysicalMaterial
      color={
        filled
          ? active
            ? "#fff6dc"
            : hovered
              ? "#f4e8ca"
              : "#d8ccb3"
          : active
            ? "#f4f2eb"
            : hovered
              ? "#e9e7df"
              : "#d9d9d3"
      }
      roughness={0.34}
      metalness={0.04}
      clearcoat={0.38}
      clearcoatRoughness={0.48}
      emissive={
        filled
          ? active
            ? "#c7832d"
            : hovered
              ? "#4e3014"
              : "#160d05"
          : active
            ? "#45515a"
            : "#080a0b"
      }
      emissiveIntensity={
        filled ? (active ? 1.4 : hovered ? 0.6 : 0.16) : active ? 0.35 : 0.05
      }
    />
  );
}

function Vertebra3D({
  index,
  total,
  filled,
  active,
  onSelect,
}: {
  index: number;
  total: number;
  filled: boolean;
  active: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const spacing = total <= 1 ? 0 : Math.min(0.7, 8.2 / (total - 1));
  const vertical = (index - (total - 1) / 2) * spacing;
  const scale = Math.max(0.5, Math.min(1, 18 / total));
  const turn = Math.sin(index * 1.27) * 0.14;
  const tilt = Math.sin(index * 0.73) * 0.032;

  return (
    <group
      position={[0, vertical, 0]}
      rotation={[tilt, turn, Math.sin(index * 0.92) * 0.022]}
      scale={scale}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      onPointerEnter={(event) => {
        event.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerLeave={() => {
        setHovered(false);
        document.body.style.cursor = "default";
      }}
    >
      <mesh castShadow receiveShadow scale={[1.24, 0.5, 0.9]}>
        <sphereGeometry args={[0.42, 40, 24]} />
        <VertebraMaterial active={active} hovered={hovered} filled={filled} />
      </mesh>

      <mesh position={[0, 0, -0.14]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.3, 0.105, 16, 36, Math.PI * 1.55]} />
        <VertebraMaterial active={active} hovered={hovered} filled={filled} />
      </mesh>

      {([-1, 1] as const).map((side) => (
        <group key={side} position={[side * 0.54, 0, -0.04]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <capsuleGeometry args={[0.085, 0.31, 8, 18]} />
            <VertebraMaterial active={active} hovered={hovered} filled={filled} />
          </mesh>
          <mesh position={[side * 0.24, 0, 0]} scale={[1.15, 0.7, 0.9]} castShadow>
            <sphereGeometry args={[0.12, 24, 16]} />
            <VertebraMaterial active={active} hovered={hovered} filled={filled} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, 0, -0.52]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.085, 0.38, 8, 18]} />
        <VertebraMaterial active={active} hovered={hovered} filled={filled} />
      </mesh>

      <mesh position={[0.34, 0.02, 0.36]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.018, 0.18, 0.28]} />
        <meshStandardMaterial
          color={filled ? (active ? "#f7d89d" : "#876941") : "#a3a19a"}
          emissive={filled ? (active ? "#d68c32" : "#241408") : "#111416"}
          emissiveIntensity={filled ? (active ? 2 : 0.35) : active ? 0.3 : 0.05}
          metalness={0.56}
          roughness={0.32}
        />
      </mesh>

      <pointLight
        position={[0, 0.02, 0.15]}
        color={filled ? "#f0a64b" : "#dce8ee"}
        intensity={filled ? (active ? 5 : 1.2) : active ? 0.8 : 0.08}
        distance={2.2}
        decay={2}
      />

      <mesh position={[0.83, 0.01, 0.02]} visible={active}>
        <sphereGeometry args={[0.035, 16, 12]} />
        <meshBasicMaterial color="#ffd590" toneMapped={false} />
      </mesh>
    </group>
  );
}

function EnergyThread() {
  const curve = useMemo(
    () =>
      new CatmullRomCurve3(
        Array.from({ length: 90 }, (_, index) => {
          const progress = index / 89;
          const turn = progress * Math.PI * 6.4;
          const radius = 1.18 + Math.sin(progress * Math.PI * 3) * 0.18;
          return new Vector3(
            Math.cos(turn) * radius,
            -4.1 + progress * 8.2,
            Math.sin(turn) * radius
          );
        })
      ),
    []
  );

  return (
    <mesh>
      <tubeGeometry args={[curve, 180, 0.009, 8, false]} />
      <meshBasicMaterial
        color="#d99a49"
        transparent
        opacity={0.55}
        toneMapped={false}
      />
    </mesh>
  );
}

function FloatingPages() {
  const group = useRef<Group>(null);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.055;
  });

  return (
    <group ref={group}>
      {[-3.05, -0.8, 1.65, 3.25].map((vertical, index) => {
        const turn = index * 1.47 + 0.35;
        return (
          <group
            key={vertical}
            position={[Math.cos(turn) * 1.43, vertical, Math.sin(turn) * 1.43]}
            rotation={[0.12, -turn + Math.PI / 2, index % 2 ? -0.16 : 0.12]}
          >
            <mesh>
              <planeGeometry args={[0.58, 0.36, 8, 8]} />
              <meshPhysicalMaterial
                color="#e9ddc5"
                emissive="#4d2d12"
                emissiveIntensity={0.2}
                roughness={0.7}
                side={DoubleSide}
                transparent
                opacity={0.72}
              />
            </mesh>
            {[0.08, 0, -0.08].map((offset, lineIndex) => (
              <mesh key={offset} position={[0, offset, 0.004]}>
                <planeGeometry args={[lineIndex === 2 ? 0.29 : 0.39, 0.008]} />
                <meshBasicMaterial color="#76644f" transparent opacity={0.58} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

function SpineScene({
  contributions,
  selected,
  onSelect,
  reduceMotion,
}: {
  contributions: Contribution[];
  selected: number;
  onSelect: (index: number) => void;
  reduceMotion: boolean;
}) {
  return (
    <>
      <ambientLight intensity={0.62} color="#b8c7d7" />
      <directionalLight
        position={[-3, 7, 5]}
        intensity={3.4}
        color="#cfdded"
        castShadow
      />
      <spotLight
        position={[2, 5, 4]}
        intensity={12}
        angle={0.32}
        penumbra={0.8}
        color="#e5b16a"
      />
      <group position={[0, 0.08, 0]}>
        {contributions.map((contribution, index) => (
          <Vertebra3D
            key={contribution.id}
            index={index}
            total={contributions.length}
            filled={!contribution.empty}
            active={selected === index}
            onSelect={() => onSelect(index)}
          />
        ))}
        <EnergyThread />
        <FloatingPages />
      </group>
      <Environment files="/encadenamiento-warehouse.hdr" environmentIntensity={0.35} />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        autoRotate={!reduceMotion}
        autoRotateSpeed={0.42}
        minPolarAngle={Math.PI * 0.41}
        maxPolarAngle={Math.PI * 0.59}
        rotateSpeed={0.48}
        dampingFactor={0.055}
        enableDamping
      />
    </>
  );
}

function FallbackSpine({
  contributions,
  selected,
  onSelect,
}: {
  contributions: Contribution[];
  selected: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div
      className="fallback-spine"
      role="group"
      aria-label={`Columna vertebral interactiva formada por ${contributions.length} poemas`}
    >
      <span className="fallback-spine__orbit fallback-spine__orbit--one" aria-hidden="true" />
      <span className="fallback-spine__orbit fallback-spine__orbit--two" aria-hidden="true" />
      <div className="fallback-pages" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div
        className="fallback-spine__body"
        style={
          {
            "--vertebra-height": `${Math.max(
              10,
              Math.min(46, 610 / contributions.length)
            )}px`,
          } as CSSProperties
        }
      >
        {contributions.map((contribution, index) => (
          <button
            key={contribution.id}
            type="button"
            className={`fallback-vertebra${selected === index ? " is-active" : ""}${
              contribution.empty ? " is-clean" : ""
            }`}
            style={
              { "--vertebra-turn": `${index * 19}deg` } as CSSProperties
            }
            aria-label={
              contribution.empty
                ? `Abrir la vértebra limpia ${String(index + 1).padStart(2, "0")}`
                : `Abrir la vértebra de ${contribution.school}`
            }
            onClick={() => onSelect(index)}
          >
            <span className="fallback-vertebra__bone" aria-hidden="true" />
            <span className="fallback-vertebra__plate" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function PoemBook({
  contributions,
  contribution,
  selected,
  onSelect,
  onOpenComposer,
}: {
  contributions: Contribution[];
  contribution: Contribution;
  selected: number;
  onSelect: (index: number) => void;
  onOpenComposer: () => void;
}) {
  const book = useRef<HTMLElement>(null);
  const drag = useRef<{
    pointerId: number;
    pointerX: number;
    pointerY: number;
    rect: DOMRect;
  } | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const reset = () => setPosition({ x: 0, y: 0 });
    window.addEventListener("resize", reset);
    return () => window.removeEventListener("resize", reset);
  }, []);

  const previous = () =>
    onSelect((selected - 1 + contributions.length) % contributions.length);
  const next = () => onSelect((selected + 1) % contributions.length);
  const number = String(selected + 1).padStart(2, "0");

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = book.current?.getBoundingClientRect();
    if (!rect) return;
    drag.current = {
      pointerId: event.pointerId,
      pointerX: event.clientX,
      pointerY: event.clientY,
      rect,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    setPosition((origin) => ({
      x:
        origin.x +
        Math.min(
          window.innerWidth - 12 - current.rect.right,
          Math.max(12 - current.rect.left, event.clientX - current.pointerX)
        ),
      y:
        origin.y +
        Math.min(
          window.innerHeight - 12 - current.rect.bottom,
          Math.max(12 - current.rect.top, event.clientY - current.pointerY)
        ),
    }));
    current.pointerX = event.clientX;
    current.pointerY = event.clientY;
  };

  const stopDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (drag.current?.pointerId === event.pointerId) {
      drag.current = null;
      setDragging(false);
    }
  };

  const style = {
    "--book-drag-x": `${position.x}px`,
    "--book-drag-y": `${position.y}px`,
  } as CSSProperties;

  return (
    <aside
      ref={book}
      className={`poem-book${dragging ? " is-dragging" : ""}`}
      style={style}
      aria-live="polite"
    >
      <div
        className="book-ribbon"
        role="button"
        tabIndex={0}
        aria-label="Mover el Libro del Gran Poema"
        title="Arrastra para mover el libro"
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onLostPointerCapture={() => {
          drag.current = null;
          setDragging(false);
        }}
      >
        <span aria-hidden="true">⠿</span> Libro del Gran Poema
      </div>

      <article className={`book-spread${contribution.empty ? " is-empty" : ""}`}>
        <span className="book-cover-edge" aria-hidden="true" />
        <span className="book-gutter" aria-hidden="true" />

        <section className="book-page book-page--verso">
          <div className="book-page__folio">Vértebra {number}</div>
          <div className="book-seal" aria-hidden="true">
            PU
          </div>
          {contribution.empty ? (
            <div className="book-empty-intro">
              <p>Vértebra restaurada</p>
              <h2>Página limpia</h2>
              <span>Preparada para recibir la voz de un instituto.</span>
            </div>
          ) : (
            <div className="book-attribution">
              <p>Instituto donante</p>
              <h2>{contribution.school}</h2>
              <span>{contribution.place}</span>
            </div>
          )}
          <footer>Poema Universal · Archivo vivo</footer>
        </section>

        <section className="book-page book-page--recto">
          <div className="book-page__folio">
            <span>{contribution.empty ? "Sin inscripción" : contribution.language}</span>
            <span>{number}</span>
          </div>
          {contribution.empty ? (
            <div className="book-blank-page">
              <span className="book-blank-page__mark" aria-hidden="true">
                ✦
              </span>
              <p>Este espacio permanece en blanco.</p>
              <h2>
                Aquí comenzará
                <br />
                un nuevo poema.
              </h2>
              <button type="button" onClick={onOpenComposer}>
                Escribir esta página <span aria-hidden="true">+</span>
              </button>
            </div>
          ) : (
            <div className="book-poem">
              <p>Poema donado</p>
              <h2>{contribution.title}</h2>
              <blockquote lang={contribution.language === "العربية" ? "ar" : undefined}>
                {contribution.poem.map((line, index) => (
                  <span key={`${line}-${index}`}>{line}</span>
                ))}
              </blockquote>
            </div>
          )}
          <footer>El cuerpo crece cuando una voz se entrega</footer>
        </section>
      </article>

      <nav className="book-navigation" aria-label="Recorrer las páginas del Gran Poema">
        <button type="button" onClick={previous} aria-label="Vértebra anterior">
          ←
        </button>
        <p>
          <span>Vértebra</span>
          <b>{number}</b>
          <small>de {String(contributions.length).padStart(2, "0")}</small>
        </p>
        <button type="button" onClick={next} aria-label="Vértebra siguiente">
          →
        </button>
      </nav>
    </aside>
  );
}

function Composer({
  onClose,
  onCreate,
  status,
}: {
  onClose: () => void;
  onCreate: (contribution: Omit<Contribution, "id">) => void;
  status: ArchiveStatus;
}) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const poem = String(data.get("poem") ?? "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (!poem.length) return;

    onCreate({
      school: String(data.get("school") ?? "").trim(),
      place: String(data.get("place") ?? "").trim(),
      language: String(data.get("language") ?? "").trim(),
      title: String(data.get("title") ?? "").trim(),
      poem,
      empty: false,
      synced: false,
    });
  };

  return (
    <div
      className="composer-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="composer-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="composer-title"
      >
        <button
          className="composer-close"
          type="button"
          aria-label="Cerrar la donación"
          onClick={onClose}
        >
          ×
        </button>
        <header className="composer-heading">
          <p>Donación institucional · Sin límite de vértebras</p>
          <h2 id="composer-title">Anexar un nuevo disco</h2>
          <span>
            El poema entrará en la columna como una nueva vértebra y quedará
            enlazado con todas las voces anteriores.
          </span>
        </header>

        <form className="composer-form" onSubmit={submit}>
          <div className="composer-grid">
            <label>
              <span>Nombre del instituto</span>
              <input
                name="school"
                type="text"
                required
                autoFocus
                maxLength={120}
                placeholder="Instituto de las Voces"
              />
            </label>
            <label>
              <span>Lugar · País</span>
              <input
                name="place"
                type="text"
                required
                maxLength={120}
                placeholder="Ciudad · País"
              />
            </label>
            <label>
              <span>Lengua original</span>
              <input
                name="language"
                type="text"
                required
                maxLength={80}
                placeholder="Gallego, español, árabe…"
              />
            </label>
            <label>
              <span>Título del poema</span>
              <input
                name="title"
                type="text"
                required
                maxLength={160}
                placeholder="Título de la donación"
              />
            </label>
          </div>
          <label className="composer-poem-field">
            <span>Poema donado</span>
            <textarea
              name="poem"
              required
              rows={7}
              maxLength={10000}
              placeholder={"Escribe aquí el poema completo.\nCada salto de línea se conservará."}
            />
          </label>
          <div className="composer-actions">
            <p>
              {status === "saving"
                ? "Enlazando la nueva vértebra…"
                : status === "pending"
                  ? "La voz está a salvo en este dispositivo y espera sincronización."
                  : "La nueva vértebra se conservará en el archivo común."}
            </p>
            <button className="composer-cancel" type="button" onClick={onClose}>
              Cancelar
            </button>
            <button className="composer-submit" type="submit">
              Anexar a la columna <span aria-hidden="true">+</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function Encadenamiento() {
  const [contributions, setContributions] = useState<Contribution[]>(
    CLEAN_VERTEBRAE
  );
  const [selected, setSelected] = useState(0);
  const [composerOpen, setComposerOpen] = useState(false);
  const [archiveStatus, setArchiveStatus] = useState<ArchiveStatus>("loading");
  const reduceMotion = useReducedMotion();
  const webGLAvailable = useWebGLAvailable();
  const contribution = contributions[selected] ?? contributions[0];

  useEffect(() => {
    let cancelled = false;

    async function loadArchive() {
      const local = readLocalContributions();
      let all = local;

      try {
        const response = await fetch("/api/poema-universal/encadenamiento", {
          cache: "no-store",
        });
        const data = (await response.json()) as ArchiveResponse;
        if (!response.ok || !data.vertebrae) throw new Error(data.error);

        const remote = data.vertebrae
          .map(decodeArchiveVertebra)
          .filter((item): item is Contribution => Boolean(item));
        all = mergeContributions(remote, local);

        const pending = all.filter((item) => item.synced === false);
        for (const item of pending) {
          try {
            await persistContribution(item);
            item.synced = true;
          } catch {
            // Se reintentará la próxima vez que se abra la sala.
          }
        }

        setArchiveStatus(
          all.some((item) => item.synced === false) ? "pending" : "synced"
        );
      } catch {
        setArchiveStatus("pending");
      }

      if (cancelled) return;
      saveLocalContributions(all);
      setContributions(buildColumn(all));
    }

    loadArchive();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!composerOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setComposerOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", close);
    };
  }, [composerOpen]);

  const createContribution = async (
    input: Omit<Contribution, "id">
  ) => {
    const created: Contribution = {
      ...input,
      id: `voz-${window.crypto.randomUUID()}`,
      empty: false,
      synced: false,
    };

    const filled = contributions.filter((item) => !item.empty);
    const all = [...filled, created];
    const nextColumn = buildColumn(all);
    const nextIndex = nextColumn.findIndex((item) => item.id === created.id);

    setContributions(nextColumn);
    setSelected(Math.max(0, nextIndex));
    setComposerOpen(false);
    setArchiveStatus("saving");
    saveLocalContributions(all);

    try {
      await persistContribution(created);
      created.synced = true;
      setArchiveStatus("synced");
      saveLocalContributions(all);
      setContributions(buildColumn(all));
    } catch {
      setArchiveStatus("pending");
    }
  };

  const filledCount = contributions.filter((item) => !item.empty).length;
  const cleanCount = contributions.length - filledCount;

  return (
    <>
      <link rel="stylesheet" href="/encadenamiento-original.css" />
      <main className="encadenamiento-shell">
        <div className="room-background" aria-hidden="true" />
        <div className="room-vignette" aria-hidden="true" />

        <header className="site-header">
          <a className="wordmark" href="/poema-universal" aria-label="Volver a Poema Universal">
            <span className="wordmark__mark" aria-hidden="true">
              PU
            </span>
            <span>
              <b>Poema Universal</b>
              <small>Archivo de la voz humana</small>
            </span>
          </a>
          <div className="room-index">
            <span>Habitación</span>
            <strong>Encadenamiento</strong>
          </div>
        </header>

        <section className="intro-copy" id="inicio">
          <p className="eyebrow">Una obra en crecimiento</p>
          <h1>
            La columna
            <br />
            de las voces
          </h1>
          <p className="intro-copy__body">
            Cada instituto entrega un poema. Cada poema se convierte en una
            vértebra. Juntos sostienen un cuerpo que pertenece a todos.
          </p>
        </section>

        <div className="spine-stage">
          {webGLAvailable ? (
            <Canvas
              dpr={[1, 1.7]}
              camera={{ position: [0, 0.15, 11.6], fov: 43, near: 0.1, far: 100 }}
              gl={{ alpha: true, antialias: true, toneMapping: ACESFilmicToneMapping }}
              shadows
              aria-label="Columna vertebral tridimensional formada por poemas de institutos"
            >
              <SpineScene
                contributions={contributions}
                selected={selected}
                onSelect={setSelected}
                reduceMotion={reduceMotion}
              />
            </Canvas>
          ) : (
            <FallbackSpine
              contributions={contributions}
              selected={selected}
              onSelect={setSelected}
            />
          )}
        </div>

        <button
          className="add-vertebra"
          type="button"
          aria-haspopup="dialog"
          onClick={() => setComposerOpen(true)}
        >
          <span className="add-vertebra__plus" aria-hidden="true">
            +
          </span>
          <span>
            <b>Anexar un disco</b>
            <small>La columna no tiene final</small>
          </span>
        </button>

        <PoemBook
          contributions={contributions}
          contribution={contribution}
          selected={selected}
          onSelect={setSelected}
          onOpenComposer={() => setComposerOpen(true)}
        />

        <div className="gesture-hint" aria-hidden="true">
          <span className="gesture-hint__orbit" />
          <p>
            <b>Arrastra para girar</b>
            <small>Pulsa una vértebra para abrir su poema</small>
          </p>
        </div>

        <div className="collection-count">
          <strong>{String(filledCount).padStart(2, "0")}</strong>
          <span>
            voces enlazadas
            <br />
            <em>{cleanCount} vértebras limpias</em>
          </span>
        </div>

        <p className="demo-note">
          {archiveStatus === "synced"
            ? "Archivo común enlazado"
            : archiveStatus === "loading"
              ? "Abriendo el archivo común"
              : "La sala conserva las voces pendientes"}
        </p>

        {composerOpen && (
          <Composer
            onClose={() => setComposerOpen(false)}
            onCreate={createContribution}
            status={archiveStatus}
          />
        )}
      </main>
    </>
  );
}
