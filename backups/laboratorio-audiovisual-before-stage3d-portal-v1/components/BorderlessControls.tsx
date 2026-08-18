import type {
  BorderlessStageId,
  SceneMode,
} from "../types/audiovisual";

type BorderlessControlsProps = {
  mode: SceneMode;
  stage: BorderlessStageId;
  onStageChange: (stage: BorderlessStageId) => void;
};

const stageLabel: Readonly<Record<BorderlessStageId, string>> = {
  ROOM: "Sala",
  THRESHOLD: "Umbral",
  PASSAGE: "Pasaje 01",
};

export function BorderlessControls({
  mode,
  stage,
  onStageChange,
}: BorderlessControlsProps) {
  if (mode === "gallery") {
    return null;
  }

  return (
    <aside className="pointer-events-auto absolute right-4 top-1/2 z-30 flex -translate-y-1/2 flex-col items-end gap-2 sm:right-8">
      <div className="border border-white/10 bg-black/65 p-2 backdrop-blur-xl">
        <p className="px-3 pb-2 pt-1 text-right text-[6px] uppercase tracking-[0.26em] text-[#d4ad6d]/70">
          Borderless · {stageLabel[stage]}
        </p>

        <div className="flex flex-col items-stretch gap-1">
          {stage === "ROOM" && (
            <button
              type="button"
              onClick={() => onStageChange("THRESHOLD")}
              className="border border-[#d4ad6d]/30 px-4 py-3 text-[7px] uppercase tracking-[0.22em] text-white/65 transition hover:border-[#d4ad6d]/70 hover:text-white"
            >
              Abrir umbral
            </button>
          )}

          {stage === "THRESHOLD" && (
            <>
              <button
                type="button"
                onClick={() => onStageChange("PASSAGE")}
                className="bg-[#d4ad6d] px-4 py-3 text-[7px] uppercase tracking-[0.22em] text-black transition hover:bg-[#e4c58f]"
              >
                Atravesar
              </button>
              <button
                type="button"
                onClick={() => onStageChange("ROOM")}
                className="px-4 py-2 text-[6px] uppercase tracking-[0.2em] text-white/35 transition hover:text-white"
              >
                Cerrar
              </button>
            </>
          )}

          {stage === "PASSAGE" && (
            <button
              type="button"
              onClick={() => onStageChange("THRESHOLD")}
              className="border border-[#d4ad6d]/30 px-4 py-3 text-[7px] uppercase tracking-[0.22em] text-white/65 transition hover:border-[#d4ad6d]/70 hover:text-white"
            >
              Regresar al umbral
            </button>
          )}
        </div>
      </div>

      <p className="text-right text-[6px] uppercase tracking-[0.18em] text-white/20">
        Navegación arquitectónica interpolada
      </p>
    </aside>
  );
}
