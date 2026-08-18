import type {
  HumanCutoutStatus,
  HumanPresencePreset,
  SceneMode,
  WebcamStatus,
} from "../types/audiovisual";

type PerformanceControlsProps = {
  mode: SceneMode;
  webcamStatus: WebcamStatus;
  cutoutStatus: HumanCutoutStatus;
  humanPreset: HumanPresencePreset;
  onEnableWebcam: () => void;
  onDisableWebcam: () => void;
  onEnableSemanticCutout: () => void;
  onDisableCutout: () => void;
  onHumanPresetChange: (preset: HumanPresencePreset) => void;
};

const presets: readonly { id: HumanPresencePreset; label: string }[] = [
  { id: "PRESENCE", label: "Presencia" },
  { id: "GIANT", label: "Gigante" },
  { id: "GHOST", label: "Fantasma" },
  { id: "ECHOES", label: "Ecos" },
];

const statusMessage: Partial<Record<WebcamStatus, string>> = {
  denied: "Permiso de cámara denegado",
  unsupported: "Cámara no disponible en este navegador",
  error: "No se pudo iniciar la cámara",
};

export function PerformanceControls({
  mode,
  webcamStatus,
  cutoutStatus,
  humanPreset,
  onEnableWebcam,
  onDisableWebcam,
  onEnableSemanticCutout,
  onDisableCutout,
  onHumanPresetChange,
}: PerformanceControlsProps) {
  if (mode !== "performance") {
    return null;
  }

  const active = webcamStatus === "active";
  const requesting = webcamStatus === "requesting";
  const loadingCutout = cutoutStatus === "loading";
  const cutoutActive = cutoutStatus === "active";

  return (
    <aside className="pointer-events-auto absolute bottom-24 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2">
      <div className="flex flex-col items-center gap-1 border border-white/10 bg-black/70 p-2 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 rounded-full ${
              active ? "bg-emerald-400" : "bg-white/20"
            }`}
          />

          <button
            type="button"
            disabled={requesting}
            onClick={active ? onDisableWebcam : onEnableWebcam}
            className="px-3 py-2 text-[7px] uppercase tracking-[0.22em] text-white/70 transition hover:text-white disabled:cursor-wait disabled:text-white/30"
          >
            {requesting
              ? "Solicitando permiso"
              : active
                ? "Detener cámara"
                : "Activar cámara"}
          </button>

          {active && <span className="h-4 w-px bg-white/10" />}

          {active && (
            <button
              type="button"
              disabled={loadingCutout}
              onClick={cutoutActive ? onDisableCutout : onEnableSemanticCutout}
              className="px-3 py-2 text-[7px] uppercase tracking-[0.2em] text-white/55 transition hover:text-white disabled:cursor-wait disabled:text-[#d4ad6d]"
            >
              {loadingCutout
                ? "Cargando recorte IA"
                : cutoutActive
                  ? "Restaurar fondo"
                  : "Recorte IA"}
            </button>
          )}
        </div>

        {active && (
          <div className="flex items-center gap-1 border-t border-white/10 pt-1">
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                aria-pressed={humanPreset === preset.id}
                onClick={() => onHumanPresetChange(preset.id)}
                className={`px-3 py-2 text-[7px] uppercase tracking-[0.2em] transition ${
                  humanPreset === preset.id
                    ? "bg-[#d4ad6d] text-black"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-[6px] uppercase tracking-[0.2em] text-white/25">
        {loadingCutout
          ? "Preparando segmentación local de persona"
          : cutoutActive
            ? "Segmentación IA local activa · ningún vídeo sale del navegador"
            : cutoutStatus === "error"
              ? "No se pudo cargar el modelo · comprueba tu conexión"
              : statusMessage[webcamStatus] ??
                (active
                  ? "Captura local activa"
                  : "La cámara solo se activa con tu permiso")}
      </p>
    </aside>
  );
}
