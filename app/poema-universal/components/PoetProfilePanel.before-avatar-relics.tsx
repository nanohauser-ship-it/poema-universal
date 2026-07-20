"use client";

import { useEffect } from "react";

export type PoetProfile = {
  position: number;
  name: string;
  country: string;
  city?: string;
  shortBio: string;
  status: "incorporation" | "confirmed" | "published";
};

type PoetProfilePanelProps = {
  poet: PoetProfile | null;
  onClose: () => void;
};

export default function PoetProfilePanel({
  poet,
  onClose,
}: PoetProfilePanelProps) {
  useEffect(() => {
    if (!poet) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [poet, onClose]);

  if (!poet) return null;

  const location = poet.city
    ? `${poet.city} · ${poet.country}`
    : poet.country;

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="poet-profile-title"
    >
      <button
        type="button"
        aria-label="Cerrar ficha"
        onClick={onClose}
        className="absolute inset-0"
        style={{
          backgroundColor: "rgba(2,5,7,0.78)",
          backdropFilter: "blur(8px)",
        }}
      />

      <aside
        className="relative z-10 flex h-full w-full max-w-[590px] flex-col overflow-y-auto border-l px-7 py-8 sm:px-12 sm:py-10"
        style={{
          borderColor: "rgba(240,232,220,0.14)",
          background:
            "linear-gradient(180deg, #111920 0%, #070b0f 58%, #020507 100%)",
          color: "#f0e8dc",
          boxShadow: "-40px 0 120px rgba(0,0,0,0.48)",
        }}
      >
        <header className="flex items-start justify-between gap-8 border-b border-white/10 pb-7">
          <div>
            <p
              className="text-[8px] uppercase tracking-[0.4em]"
              style={{ color: "#c7a467" }}
            >
              Posición {String(poet.position).padStart(2, "0")}
            </p>

            <p
              className="mt-3 text-[8px] uppercase tracking-[0.3em]"
              style={{ color: "rgba(240,232,220,0.34)" }}
            >
              Archivo de voces · 2026
            </p>
          </div>

          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center border text-xl transition hover:border-[#c7a467] hover:text-[#c7a467]"
            style={{
              borderColor: "rgba(240,232,220,0.18)",
              backgroundColor: "transparent",
              color: "rgba(240,232,220,0.65)",
            }}
          >
            ×
          </button>
        </header>

        <div className="flex flex-1 flex-col justify-center py-14">
          <p
            className="text-[8px] uppercase tracking-[0.36em]"
            style={{ color: "#c7a467" }}
          >
            {poet.status === "published"
              ? "Perfil publicado"
              : poet.status === "confirmed"
                ? "Voz confirmada"
                : "Voz en incorporación"}
          </p>

          <h2
            id="poet-profile-title"
            className="mt-7 font-serif text-5xl leading-[0.98] tracking-[-0.045em] sm:text-6xl"
          >
            {poet.name}
          </h2>

          <p
            className="mt-5 font-serif text-xl italic"
            style={{ color: "rgba(240,232,220,0.52)" }}
          >
            {location}
          </p>

          <div className="my-10 h-px bg-white/10" />

          <p
            className="max-w-lg text-base leading-8"
            style={{ color: "rgba(240,232,220,0.72)" }}
          >
            {poet.shortBio}
          </p>
        </div>

        <footer className="border-t border-white/10 pt-7">
          <p
            className="text-[8px] uppercase tracking-[0.32em]"
            style={{ color: "rgba(240,232,220,0.28)" }}
          >
            Poema Universal · Edición fundacional
          </p>
        </footer>
      </aside>
    </div>
  );
}
