"use client";

import {
  useEffect,
} from "react";

export type EditorialIdentity = {
  id: string;
  name: string;
  poemTitle: string;
  territory: string;
  avatarId: number;
  relicId: number;
  savedAt: string;
};

type PoetBibliographicPanelProps = {
  position: number;
  identity: EditorialIdentity | null;
  avatarId: number;
  relicId: number;
  open: boolean;
  onClose: () => void;
};

type BibliographicProfile = {
  language: string;
  role: string;
  biography: string;
  poetics: string;
  note?: string;
};

const PROFILES: Record<
  string,
  BibliographicProfile
> = {
  "jose-naveiro": {
    language: "Español",
    role:
      "Fundador y poeta · Edición fundacional",
    biography:
      "José Naveiro es fundador de Poema Universal. Su obra explora la memoria, la pérdida, la dignidad y la supervivencia, uniendo poesía, narrativa y archivo humano. Desde la edición fundacional impulsa una construcción literaria colectiva capaz de reunir voces y territorios distintos en una sola obra.",
    poetics:
      "Su escritura busca conservar aquello que corre el riesgo de desaparecer: los vínculos, los animales, la infancia, los cuerpos y la memoria de quienes estuvieron antes. En «El huerto», la tierra se convierte en archivo, regreso y permanencia.",
  },

  asataka: {
    language: "日本語 · Japonés",
    role:
      "Poeta de Japón · Edición fundacional",
    biography:
      "ASATAKA es una voz poética de Japón incorporada a la edición fundacional de Poema Universal. Escribe en japonés y entrega al proyecto «La luz regresa descalza», una pieza vinculada a la luz, la ausencia, el tránsito y aquello que vuelve sin hacer ruido.",
    poetics:
      "Su presencia dentro de Poema Universal se construirá respetando la lengua original del poema. Esta ficha permanecerá abierta para incorporar una biografía escrita o aprobada por el propio autor.",
    note:
      "Biografía editorial provisional, pendiente de completar con las palabras de ASATAKA.",
  },
};

function formatNumber(value: number) {
  return String(value).padStart(2, "0");
}

export default function PoetBibliographicPanel({
  position,
  identity,
  avatarId,
  relicId,
  open,
  onClose,
}: PoetBibliographicPanelProps) {
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

    document.body.style.overflow =
      "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow = "";

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

  if (!open || !identity) {
    return null;
  }

  const profile =
    PROFILES[identity.id] ?? {
      language: "Lengua original",
      role:
        "Poeta · Edición fundacional",
      biography:
        "Esta voz forma parte de la edición fundacional de Poema Universal. Su ficha bibliográfica está siendo preparada para conservar su trayectoria, su lengua y el contexto de su obra.",
      poetics:
        "La información editorial de esta voz será completada respetando sus propias palabras y su identidad literaria.",
      note:
        "Ficha bibliográfica en construcción.",
    };

  const avatarNumber =
    formatNumber(avatarId);

  const relicNumber =
    formatNumber(relicId);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Ficha bibliográfica de ${identity.name}`}
      className="fixed inset-0 z-[160] bg-black/80 backdrop-blur-[7px]"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[560px] flex-col overflow-y-auto border-l border-[#c7a467]/16 bg-[#050606] px-7 py-7 text-[#f0e8dc] shadow-[-40px_0_120px_rgba(0,0,0,0.58)] sm:px-10 sm:py-9">
        <header className="flex items-start justify-between gap-8 border-b border-white/10 pb-7">
          <div>
            <p className="text-[8px] uppercase tracking-[0.38em] text-[#c7a467]/80">
              Posición{" "}
              {formatNumber(position)}
            </p>

            <p className="mt-3 text-[7px] uppercase tracking-[0.3em] text-white/22">
              Archivo de voces · 2026
            </p>
          </div>

          <button
            type="button"
            aria-label="Cerrar ficha"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center border border-white/12 text-lg text-white/50 transition hover:border-[#c7a467]/45 hover:text-[#e4ca94]"
          >
            ×
          </button>
        </header>

        <div className="mt-8 grid grid-cols-[94px_minmax(0,1fr)] gap-5 border-b border-white/10 pb-8">
          <div className="relative">
            <img
              src={`/avatars/avatar-${avatarNumber}.webp`}
              alt={`Avatar de ${identity.name}`}
              className="h-[118px] w-[94px] border border-[#c7a467]/18 bg-black object-contain"
            />

            <img
              src={`/relics/relic-${relicNumber}.webp`}
              alt={`Tesoro de ${identity.name}`}
              className="absolute -bottom-3 -right-3 h-11 w-11 rounded-full border border-[#c7a467]/50 bg-black object-cover shadow-[0_0_24px_rgba(199,164,103,0.2)]"
            />
          </div>

          <div className="self-center">
            <p className="text-[8px] uppercase tracking-[0.36em] text-[#c7a467]/72">
              Voz confirmada
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-none tracking-[-0.04em] sm:text-5xl">
              {identity.name}
            </h2>

            <p className="mt-4 font-serif text-base italic text-white/42">
              {identity.territory}
            </p>
          </div>
        </div>

        <section className="mt-8">
          <p className="text-[8px] uppercase tracking-[0.34em] text-white/28">
            Obra fundacional
          </p>

          <h3 className="mt-4 font-serif text-3xl leading-tight text-[#f0e8dc]">
            {identity.poemTitle}
          </h3>

          <p className="mt-3 text-[9px] uppercase tracking-[0.26em] text-[#c7a467]/58">
            {profile.language}
          </p>
        </section>

        <div className="my-8 grid grid-cols-2 gap-px border border-white/10 bg-white/10">
          <div className="bg-[#050606] px-5 py-5">
            <p className="text-[7px] uppercase tracking-[0.26em] text-white/25">
              Avatar
            </p>

            <p className="mt-3 font-serif text-2xl text-[#dfc184]">
              A{avatarNumber}
            </p>
          </div>

          <div className="bg-[#050606] px-5 py-5">
            <p className="text-[7px] uppercase tracking-[0.26em] text-white/25">
              Tesoro
            </p>

            <p className="mt-3 font-serif text-2xl text-[#dfc184]">
              T{relicNumber}
            </p>
          </div>
        </div>

        <section className="border-t border-white/10 pt-8">
          <p className="text-[8px] uppercase tracking-[0.34em] text-[#c7a467]/65">
            Biografía literaria
          </p>

          <p className="mt-5 font-serif text-[17px] leading-8 text-white/68">
            {profile.biography}
          </p>
        </section>

        <section className="mt-8 border-t border-white/10 pt-8">
          <p className="text-[8px] uppercase tracking-[0.34em] text-[#c7a467]/65">
            Poética
          </p>

          <p className="mt-5 font-serif text-[16px] italic leading-8 text-white/50">
            {profile.poetics}
          </p>
        </section>

        {profile.note && (
          <div className="mt-8 border border-[#c7a467]/14 bg-[#c7a467]/[0.035] px-5 py-4">
            <p className="text-[9px] leading-6 text-[#d7bd87]/52">
              {profile.note}
            </p>
          </div>
        )}

        <footer className="mt-auto border-t border-white/10 pt-7">
          <p className="text-[8px] uppercase tracking-[0.32em] text-white/24">
            {profile.role}
          </p>

          <p className="mt-3 text-[7px] uppercase tracking-[0.28em] text-white/16">
            Poema Universal · Edición fundacional
          </p>
        </footer>
      </aside>
    </div>
  );
}
