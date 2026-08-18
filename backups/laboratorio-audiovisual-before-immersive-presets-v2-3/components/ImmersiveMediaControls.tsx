"use client";

import { useState } from "react";

import type { SceneMode, SurfaceId } from "../types/audiovisual";

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
  onSelect: (surface: SurfaceId, file: File) => void;
  onReset: (surface: SurfaceId) => void;
  onResetAll: () => void;
};

export function ImmersiveMediaControls({
  mode,
  fileNames,
  onSelect,
  onReset,
  onResetAll,
}: ImmersiveMediaControlsProps) {
  const [open, setOpen] = useState(false);

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
          Cargar experiencia
        </button>
      ) : (
        <div className="w-[min(330px,calc(100vw-40px))] border border-white/15 bg-black/85 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
            <div>
              <p className="text-[7px] uppercase tracking-[0.3em] text-[#d4ad6d]">
                Experiencia local
              </p>
              <p className="mt-2 text-[8px] uppercase tracking-[0.18em] text-white/45">
                Un vídeo por superficie
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
                    <label className="cursor-pointer border border-white/15 px-2 py-2 text-[7px] uppercase tracking-[0.16em] text-white/55 transition hover:border-[#d4ad6d]/50 hover:text-white">
                      {fileName ? "Cambiar" : "Vídeo"}
                      <input
                        type="file"
                        accept="video/*"
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
                        onClick={() => onReset(id)}
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

          <button
            type="button"
            onClick={onResetAll}
            className="mt-3 w-full border border-[#d4ad6d]/25 px-3 py-2 text-[7px] uppercase tracking-[0.2em] text-[#d4ad6d]/70 transition hover:border-[#d4ad6d]/60 hover:text-[#e8c98f]"
          >
            Restaurar paisaje completo
          </button>

          <p className="mt-3 text-[6px] uppercase leading-relaxed tracking-[0.13em] text-white/20">
            Los archivos permanecen en este dispositivo
          </p>
        </div>
      )}
    </aside>
  );
}
