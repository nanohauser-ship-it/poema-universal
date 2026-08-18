"use client";

import { useState } from "react";

import type { SceneMode, SurfaceId } from "../types/audiovisual";
import type {
  ImmersivePresetSummary,
  ImmersiveTextureSettings,
} from "../persistence/ImmersivePresetStore";
import type {
  ThematicJourneyPlan,
  ThematicZoneId,
} from "../scenography/thematicJourney";

const SURFACE_ROWS: readonly { id: SurfaceId; label: string }[] = [
  { id: "LEFT", label: "Pared izquierda" },
  { id: "BACK", label: "Pared frontal" },
  { id: "RIGHT", label: "Pared derecha" },
  { id: "FLOOR", label: "Suelo" },
  { id: "CEILING", label: "Techo" },
];

type ImmersiveMediaControlsProps = {
  mode: SceneMode;
  fileNames: Readonly<Record<SurfaceId, string | null>>;
  textureSettings: Readonly<Record<SurfaceId, ImmersiveTextureSettings>>;
  presets: readonly ImmersivePresetSummary[];
  selectedPresetId: string;
  storageMessage: string;
  theme: string;
  intention: string;
  journey: ThematicJourneyPlan | null;
  activeZoneId: ThematicZoneId | null;
  journeyMessage: string;
  onSelect: (surface: SurfaceId, file: File) => void;
  onSelectPanorama: (file: File) => void;
  onReset: (surface: SurfaceId) => void;
  onResetAll: () => void;
  onTextureChange: (
    surface: SurfaceId,
    settings: ImmersiveTextureSettings
  ) => void;
  onPresetSelectionChange: (id: string) => void;
  onSavePreset: (name: string) => void;
  onLoadPreset: () => void;
  onDeletePreset: () => void;
  onThemeChange: (value: string) => void;
  onIntentionChange: (value: string) => void;
  onGenerateJourney: () => void;
  onZoneChange: (zoneId: ThematicZoneId) => void;
};

type NumericTextureKey =
  | "offsetX"
  | "offsetY"
  | "repeatX"
  | "repeatY"
  | "rotation";

export function ImmersiveMediaControls({
  mode,
  fileNames,
  textureSettings,
  presets,
  selectedPresetId,
  storageMessage,
  theme,
  intention,
  journey,
  activeZoneId,
  journeyMessage,
  onSelect,
  onSelectPanorama,
  onReset,
  onResetAll,
  onTextureChange,
  onPresetSelectionChange,
  onSavePreset,
  onLoadPreset,
  onDeletePreset,
  onThemeChange,
  onIntentionChange,
  onGenerateJourney,
  onZoneChange,
}: ImmersiveMediaControlsProps) {
  const [open, setOpen] = useState(false);
  const [editingSurface, setEditingSurface] = useState<SurfaceId | null>(null);
  const [draft, setDraft] = useState<ImmersiveTextureSettings | null>(null);
  const [presetName, setPresetName] = useState("");

  const updateDraftNumber = (
    key: NumericTextureKey,
    value: string
  ): void => {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return;
    }

    setDraft((current) =>
      current ? { ...current, [key]: numericValue } : current
    );
  };

  if (mode !== "immersive") {
    return null;
  }

  return (
    <aside className="absolute bottom-24 left-5 z-30 sm:bottom-28 sm:left-8">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="border border-white/15 bg-black/75 px-4 py-3 text-[8px] uppercase tracking-[0.24em] text-white/70 backdrop-blur-md transition hover:border-[#d4ad6d]/60 hover:text-white"
        >
          Componer experiencia
        </button>
      ) : (
        <div className="max-h-[calc(100vh-190px)] w-[min(350px,calc(100vw-40px))] overflow-y-auto border border-white/15 bg-black/85 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
            <div>
              <p className="text-[7px] uppercase tracking-[0.3em] text-[#d4ad6d]">
                Compositor temático
              </p>
              <p className="mt-2 text-[8px] uppercase tracking-[0.18em] text-white/45">
                Dirección · recorrido · medios
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar cargador de superficies"
              className="px-2 py-1 text-xs text-white/45 transition hover:text-white"
            >
              ×
            </button>
          </div>

          <div className="mt-3 border-b border-white/10 pb-3">
            <label className="block text-[7px] uppercase tracking-[0.18em] text-white/45">
              Tema
              <input
                type="text"
                value={theme}
                maxLength={96}
                onChange={(event) => onThemeChange(event.target.value)}
                placeholder="Ej. memoria, océano, exilio…"
                className="mt-2 w-full border border-white/15 bg-black/40 px-3 py-2 text-[8px] normal-case tracking-normal text-white/75 outline-none placeholder:text-white/20 focus:border-[#d4ad6d]/50"
              />
            </label>

            <label className="mt-3 block text-[7px] uppercase tracking-[0.18em] text-white/45">
              Intención
              <textarea
                value={intention}
                maxLength={280}
                rows={2}
                onChange={(event) => onIntentionChange(event.target.value)}
                placeholder="¿Qué debe sentir y comprender el visitante?"
                className="mt-2 w-full resize-none border border-white/15 bg-black/40 px-3 py-2 text-[8px] normal-case leading-relaxed tracking-normal text-white/75 outline-none placeholder:text-white/20 focus:border-[#d4ad6d]/50"
              />
            </label>

            <button
              type="button"
              disabled={!theme.trim()}
              onClick={onGenerateJourney}
              className="mt-3 w-full border border-[#d4ad6d]/40 px-3 py-2 text-[7px] uppercase tracking-[0.2em] text-[#d4ad6d] transition hover:border-[#d4ad6d] disabled:cursor-not-allowed disabled:opacity-25"
            >
              Crear recorrido con IA
            </button>

            {journey ? (
              <div className="mt-3 grid grid-cols-3 gap-1">
                {journey.zones.map((zone) => (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => onZoneChange(zone.id)}
                    className={`border px-2 py-2 text-[6px] uppercase tracking-[0.12em] transition ${
                      activeZoneId === zone.id
                        ? "border-[#d4ad6d]/70 bg-[#d4ad6d]/10 text-[#e8c98f]"
                        : "border-white/10 text-white/35 hover:border-white/25 hover:text-white/60"
                    }`}
                  >
                    {zone.label}
                  </button>
                ))}
              </div>
            ) : null}

            {journeyMessage ? (
              <p className="mt-2 text-[6px] uppercase leading-relaxed tracking-[0.12em] text-[#d4ad6d]/65">
                {journeyMessage}
              </p>
            ) : null}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-[7px] uppercase tracking-[0.2em] text-white/45">
                Proyección envolvente
              </p>
              <p className="mt-1 text-[6px] text-white/25">
                Un medio continuo en tres paredes
              </p>
            </div>
            <label className="cursor-pointer border border-[#d4ad6d]/30 px-3 py-2 text-[6px] uppercase tracking-[0.14em] text-[#d4ad6d]/80 transition hover:border-[#d4ad6d]">
              Panorama
              <input
                type="file"
                accept="video/*,image/*"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (file) {
                    onSelectPanorama(file);
                  }

                  event.target.value = "";
                }}
              />
            </label>
          </div>

          <div className="mt-3 space-y-2">
            {SURFACE_ROWS.map(({ id, label }) => {
              const fileName = fileNames[id];

              return (
                <div
                  key={id}
                  className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-white/[0.07] pb-2"
                >
                  <div className="min-w-0">
                    <p className="text-[8px] uppercase tracking-[0.16em] text-white/65">
                      {label}
                    </p>
                    <p className="mt-1 truncate text-[7px] text-white/30">
                      {fileName ?? "Paisaje original"}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    {fileName ? (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSurface(id);
                          setDraft({ ...textureSettings[id] });
                        }}
                        className="border border-white/10 px-2 py-2 text-[6px] uppercase tracking-[0.14em] text-white/40 transition hover:border-[#d4ad6d]/50 hover:text-white"
                      >
                        UV
                      </button>
                    ) : null}
                    <label className="cursor-pointer border border-white/15 px-2 py-2 text-[7px] uppercase tracking-[0.16em] text-white/55 transition hover:border-[#d4ad6d]/50 hover:text-white">
                      {fileName ? "Cambiar" : "Medio"}
                      <input
                        type="file"
                        accept="video/*,image/*"
                        className="sr-only"
                        onChange={(event) => {
                          const file = event.target.files?.[0];

                          if (file) {
                            onSelect(id, file);
                          }

                          event.target.value = "";
                        }}
                      />
                    </label>
                    {fileName ? (
                      <button
                        type="button"
                        onClick={() => {
                          onReset(id);

                          if (editingSurface === id) {
                            setEditingSurface(null);
                            setDraft(null);
                          }
                        }}
                        aria-label={`Restaurar ${label}`}
                        className="px-2 py-2 text-[9px] text-white/35 transition hover:text-white"
                      >
                        ×
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          {editingSurface && draft && fileNames[editingSurface] ? (
            <div className="mt-3 border border-[#d4ad6d]/20 bg-[#d4ad6d]/[0.04] p-3">
              <div className="flex items-center justify-between">
                <p className="text-[7px] uppercase tracking-[0.2em] text-[#d4ad6d]/80">
                  Encuadre · {SURFACE_ROWS.find(({ id }) => id === editingSurface)?.label}
                </p>
                <button
                  type="button"
                  onClick={() => setEditingSurface(null)}
                  className="px-1 text-[9px] text-white/35 hover:text-white"
                  aria-label="Cerrar ajustes UV"
                >
                  ×
                </button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
                {(
                  [
                    ["offsetX", "Posición X", -1, 1, 0.01],
                    ["offsetY", "Posición Y", -1, 1, 0.01],
                    ["repeatX", "Escala X", 0.2, 2.5, 0.01],
                    ["repeatY", "Escala Y", 0.2, 2.5, 0.01],
                    ["rotation", "Rotación", -180, 180, 1],
                  ] as const
                ).map(([key, label, minimum, maximum, step]) => (
                  <label key={key} className="text-[6px] uppercase tracking-[0.12em] text-white/35">
                    <span className="flex justify-between gap-2">
                      {label}
                      <span className="text-white/60">{draft[key].toFixed(key === "rotation" ? 0 : 2)}</span>
                    </span>
                    <input
                      type="range"
                      min={minimum}
                      max={maximum}
                      step={step}
                      value={draft[key]}
                      onChange={(event) => updateDraftNumber(key, event.target.value)}
                      className="mt-1 w-full accent-[#d4ad6d]"
                    />
                  </label>
                ))}
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setDraft((current) => current ? { ...current, mirrorX: !current.mirrorX } : current)}
                  className={`flex-1 border px-2 py-2 text-[6px] uppercase tracking-[0.15em] ${draft.mirrorX ? "border-[#d4ad6d]/60 text-[#d4ad6d]" : "border-white/10 text-white/35"}`}
                >
                  Espejo X
                </button>
                <button
                  type="button"
                  onClick={() => setDraft((current) => current ? { ...current, mirrorY: !current.mirrorY } : current)}
                  className={`flex-1 border px-2 py-2 text-[6px] uppercase tracking-[0.15em] ${draft.mirrorY ? "border-[#d4ad6d]/60 text-[#d4ad6d]" : "border-white/10 text-white/35"}`}
                >
                  Espejo Y
                </button>
                <button
                  type="button"
                  onClick={() => onTextureChange(editingSurface, draft)}
                  className="flex-1 border border-[#d4ad6d]/40 px-2 py-2 text-[6px] uppercase tracking-[0.15em] text-[#d4ad6d] hover:border-[#d4ad6d]"
                >
                  Aplicar
                </button>
              </div>
            </div>
          ) : null}

          <div className="mt-3 border-t border-white/10 pt-3">
            <p className="text-[7px] uppercase tracking-[0.2em] text-white/45">
              Experiencias guardadas
            </p>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={presetName}
                maxLength={48}
                onChange={(event) => setPresetName(event.target.value)}
                placeholder="Nombre de la experiencia"
                className="min-w-0 flex-1 border border-white/15 bg-black/40 px-2 py-2 text-[7px] text-white/70 outline-none placeholder:text-white/20 focus:border-[#d4ad6d]/50"
              />
              <button
                type="button"
                disabled={!presetName.trim()}
                onClick={() => {
                  onSavePreset(presetName.trim());
                  setPresetName("");
                }}
                className="border border-[#d4ad6d]/30 px-3 text-[6px] uppercase tracking-[0.15em] text-[#d4ad6d]/80 disabled:cursor-not-allowed disabled:opacity-25"
              >
                Guardar
              </button>
            </div>

            <div className="mt-2 flex gap-2">
              <select
                value={selectedPresetId}
                onChange={(event) => onPresetSelectionChange(event.target.value)}
                className="min-w-0 flex-1 border border-white/15 bg-black px-2 py-2 text-[7px] text-white/60 outline-none"
              >
                <option value="">Selecciona una experiencia</option>
                {presets.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={!selectedPresetId}
                onClick={onLoadPreset}
                className="border border-white/15 px-2 text-[6px] uppercase tracking-[0.12em] text-white/50 disabled:opacity-20"
              >
                Cargar
              </button>
              <button
                type="button"
                disabled={!selectedPresetId}
                onClick={onDeletePreset}
                className="border border-white/10 px-2 text-[6px] uppercase tracking-[0.12em] text-white/30 disabled:opacity-20"
              >
                Borrar
              </button>
            </div>

            {storageMessage ? (
              <p className="mt-2 text-[6px] uppercase tracking-[0.12em] text-[#d4ad6d]/60">
                {storageMessage}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => {
              onResetAll();
              setEditingSurface(null);
              setDraft(null);
            }}
            className="mt-3 w-full border border-[#d4ad6d]/25 px-3 py-2 text-[7px] uppercase tracking-[0.2em] text-[#d4ad6d]/70 transition hover:border-[#d4ad6d]/60 hover:text-[#e8c98f]"
          >
            Restaurar paisaje completo
          </button>

          <p className="mt-3 text-[6px] uppercase leading-relaxed tracking-[0.13em] text-white/20">
            Vídeos e imágenes permanecen en este dispositivo
          </p>
        </div>
      )}
    </aside>
  );
}
