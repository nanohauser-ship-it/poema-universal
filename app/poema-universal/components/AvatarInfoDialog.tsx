"use client";

import { useEffect } from "react";

import {
  getAvatarById,
  type AvatarInfo,
} from "./avatarCatalog";

type AvatarInfoDialogProps = {
  avatarId: number;
  open: boolean;
  onClose: () => void;
};

function formatNumber(value: number) {
  return String(value).padStart(2, "0");
}

export default function AvatarInfoDialog({
  avatarId,
  open,
  onClose,
}: AvatarInfoDialogProps) {
  const avatar: AvatarInfo =
    getAvatarById(avatarId);

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
      aria-labelledby="avatar-dialog-title"
    >
      <button
        type="button"
        aria-label="Cerrar información del avatar"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <article
        role="dialog"
        aria-modal="true"
        className="relative grid w-full max-w-3xl overflow-hidden border border-[#c7a467]/40 bg-[#070a0d] shadow-[0_30px_100px_rgba(0,0,0,0.72)] md:grid-cols-[0.85fr_1.15fr]"
      >
        <div className="relative min-h-[350px] border-b border-white/10 bg-black md:min-h-[560px] md:border-b-0 md:border-r">
          <img
            src={`/avatars/avatar-${formatNumber(
              avatar.id
            )}.webp`}
            alt={avatar.title}
            className="absolute inset-0 h-full w-full object-contain object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

          <span className="absolute bottom-5 left-5 font-serif text-2xl italic text-[#c7a467]">
            {avatar.code}
          </span>
        </div>

        <div className="flex flex-col p-7 sm:p-10">
          <div className="flex items-start justify-between gap-8">
            <p className="text-[8px] uppercase tracking-[0.36em] text-[#c7a467]">
              Archivo de avatares
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
            id="avatar-dialog-title"
            className="mt-8 font-serif text-4xl leading-none tracking-[-0.035em] text-[#f0e8dc] sm:text-5xl"
          >
            {avatar.title}
          </h2>

          <p className="mt-6 font-serif text-xl italic leading-8 text-white/64">
            {avatar.description}
          </p>

          <dl className="mt-10 border-t border-white/12">
            <div className="grid grid-cols-[105px_1fr] border-b border-white/10 py-5">
              <dt className="text-[8px] uppercase tracking-[0.25em] text-white/34">
                Presencia
              </dt>

              <dd className="font-serif text-lg text-white/76">
                {avatar.presence}
              </dd>
            </div>

            <div className="grid grid-cols-[105px_1fr] border-b border-white/10 py-5">
              <dt className="text-[8px] uppercase tracking-[0.25em] text-white/34">
                Gesto
              </dt>

              <dd className="font-serif text-lg text-white/76">
                {avatar.gesture}
              </dd>
            </div>
          </dl>

          <p className="mt-auto pt-10 text-[9px] leading-6 tracking-[0.08em] text-white/32">
            Este texto describe el arquetipo visual.
            La identidad real se incorpora cuando una
            voz ocupa definitivamente la plaza.
          </p>
        </div>
      </article>
    </div>
  );
}
