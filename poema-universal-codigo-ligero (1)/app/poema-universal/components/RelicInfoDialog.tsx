"use client";

import { useEffect } from "react";

import {
  getRelicById,
  type RelicInfo,
} from "./relicCatalog";

type RelicInfoDialogProps = {
  relicId: number;
  open: boolean;
  onClose: () => void;
};

function formatNumber(value: number) {
  return String(value).padStart(2, "0");
}

export default function RelicInfoDialog({
  relicId,
  open,
  onClose,
}: RelicInfoDialogProps) {
  const relic: RelicInfo =
    getRelicById(relicId);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-5"
      aria-labelledby="relic-dialog-title"
    >
      <button
        type="button"
        aria-label="Cerrar información del tesoro"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <article
        role="dialog"
        aria-modal="true"
        className="relative grid w-full max-w-3xl overflow-hidden border border-[#c7a467]/40 bg-[#070a0d] shadow-[0_30px_100px_rgba(0,0,0,0.72)] md:grid-cols-[0.85fr_1.15fr]"
      >
        <div className="relative min-h-[310px] border-b border-white/10 bg-black md:min-h-[520px] md:border-b-0 md:border-r">
          <img
            src={`/relics/relic-${formatNumber(
              relic.id
            )}.webp`}
            alt={relic.name}
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

          <span className="absolute bottom-5 left-5 font-serif text-2xl italic text-[#c7a467]">
            {relic.code}
          </span>
        </div>

        <div className="flex flex-col p-7 sm:p-10">
          <div className="flex items-start justify-between gap-8">
            <p className="text-[8px] uppercase tracking-[0.36em] text-[#c7a467]">
              Archivo de reliquias
            </p>

            <button
              type="button"
              aria-label="Cerrar"
              className="-mt-2 text-3xl leading-none text-white/45 transition hover:text-white"
              onClick={onClose}
            >
              ×
            </button>
          </div>

          <h2
            id="relic-dialog-title"
            className="mt-8 font-serif text-4xl leading-none tracking-[-0.035em] text-[#f0e8dc] sm:text-5xl"
          >
            {relic.name}
          </h2>

          <p className="mt-6 font-serif text-xl italic leading-8 text-white/64">
            {relic.description}
          </p>

          <dl className="mt-10 border-t border-white/12">
            <div className="grid grid-cols-[105px_1fr] border-b border-white/10 py-5">
              <dt className="text-[8px] uppercase tracking-[0.25em] text-white/34">
                Materia
              </dt>

              <dd className="font-serif text-lg text-white/76">
                {relic.material}
              </dd>
            </div>

            <div className="grid grid-cols-[105px_1fr] border-b border-white/10 py-5">
              <dt className="text-[8px] uppercase tracking-[0.25em] text-white/34">
                Símbolo
              </dt>

              <dd className="font-serif text-lg text-white/76">
                {relic.meaning}
              </dd>
            </div>
          </dl>

          <p className="mt-auto pt-10 text-[9px] leading-6 tracking-[0.08em] text-white/32">
            Su significado definitivo se completa
            cuando esta reliquia es entregada a una
            de las sesenta voces.
          </p>
        </div>
      </article>
    </div>
  );
}
