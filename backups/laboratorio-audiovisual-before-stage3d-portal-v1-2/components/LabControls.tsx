import type { SceneMode } from "../types/audiovisual";

type LabControlsProps = {
  mode: SceneMode;
  onModeChange: (mode: SceneMode) => void;
};

const modes: readonly { id: SceneMode; label: string }[] = [
  { id: "gallery", label: "Galería" },
  { id: "immersive", label: "Inmersión" },
  { id: "performance", label: "Performance" },
];

export function LabControls({ mode, onModeChange }: LabControlsProps) {
  return (
    <nav
      aria-label="Modos de Sala Madre"
      className="pointer-events-auto absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 gap-2 border border-white/10 bg-black/60 p-2 backdrop-blur-xl"
    >
      {modes.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-pressed={mode === item.id}
          onClick={() => onModeChange(item.id)}
          className={`px-4 py-3 text-[7px] uppercase tracking-[0.24em] transition ${
            mode === item.id
              ? "bg-[#d4ad6d] text-black"
              : "text-white/40 hover:text-white"
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}

