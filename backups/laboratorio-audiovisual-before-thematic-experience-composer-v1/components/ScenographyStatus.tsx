import type { ArchitectureDirectorState } from "../scenography/schema";

interface ScenographyStatusProps {
  state: ArchitectureDirectorState;
  visible: boolean;
  onRegenerate: () => void;
}

const ARCHETYPE_LABELS: Record<
  NonNullable<ArchitectureDirectorState["archetype"]>,
  string
> = {
  DARK_GALLERY: "Galería oscura",
  WHITE_CUBE: "Cubo blanco",
  LONG_ARCHIVE: "Archivo longitudinal",
  MEDIA_LABYRINTH: "Laberinto medial",
  PANORAMIC_HALL: "Sala panorámica",
  CIRCULAR_OCULUS: "Óculo circular",
};

export function ScenographyStatus({
  state,
  visible,
  onRegenerate,
}: ScenographyStatusProps) {
  if (!visible || state.status === "idle") {
    return null;
  }

  const isDevelopment = process.env.NODE_ENV === "development";
  const status =
    state.status === "generating"
      ? "Diseñando espacio"
      : state.status === "error"
        ? "Arquitectura no disponible"
        : state.source === "ai"
          ? "Listo · Dirección IA"
          : "Fallback local · Listo";

  return (
    <aside className="pointer-events-auto absolute right-6 top-24 z-30 w-48 border border-white/10 bg-black/65 p-4 backdrop-blur-md sm:right-8">
      <p className="text-[7px] uppercase tracking-[0.26em] text-[#d4ad6d]">
        {status}
      </p>
      {state.archetype ? (
        <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-white/75">
          {ARCHETYPE_LABELS[state.archetype]}
        </p>
      ) : null}
      {state.seed ? (
        <p className="mt-1 truncate font-mono text-[7px] text-white/30">
          {state.seed}
        </p>
      ) : null}
      {isDevelopment ? (
        <button
          type="button"
          className="mt-3 border border-white/15 px-3 py-2 text-[7px] uppercase tracking-[0.18em] text-white/55 transition hover:border-[#d4ad6d]/50 hover:text-[#d4ad6d] disabled:cursor-wait disabled:opacity-40"
          disabled={state.status === "generating"}
          onClick={onRegenerate}
        >
          Regenerar arquitectura
        </button>
      ) : null}
    </aside>
  );
}
