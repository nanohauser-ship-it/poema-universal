"use client";

import { useEffect } from "react";

export type PoetProfile = {
  position: number;
  name: string;
  country: string;
  city?: string;
  shortBio: string;
  portraitUrl?: string;
  status: "incorporation" | "confirmed" | "published";
};

type PoetProfilePanelProps = {
  poet: PoetProfile | null;
  onClose: () => void;
};

function getStatusLabel(
  status: PoetProfile["status"]
): string {
  if (status === "published") {
    return "Perfil publicado";
  }

  if (status === "confirmed") {
    return "Voz confirmada";
  }

  return "Voz en incorporación";
}

export default function PoetProfilePanel({
  poet,
  onClose,
}: PoetProfilePanelProps) {
  useEffect(() => {
    if (!poet) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [poet, onClose]);

  if (!poet) {
    return null;
  }

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
        onClick={onClose}
        aria-label="Cerrar ficha del poeta"
        className="absolute inset-0 cursor-default"
        style={{
          backgroundColor:
            "rgba(2,5,7,0.76)",
          backdropFilter: "blur(8px)",
        }}
      />

      <aside
        className="relative z-10 flex h-full w-full max-w-[620px] flex-col overflow-y-auto border-l px-7 py-8 sm:px-12 sm:py-10"
        style={{
          borderColor:
            "rgba(240,232,220,0.14)",
          background:
            "linear-gradient(180deg, #10171d 0%, #060a0e 56%, #020507 100%)",
          color: "#f0e8dc",
          boxShadow:
            "-45px 0 120px rgba(0,0,0,0.45)",
        }}
      >
        <div className="flex items-start justify-between gap-8 border-b border-white/10 pb-7">
          <div>
            <p
              className="text-[8px] uppercase tracking-[0.4em]"
              style={{ color: "#c7a467" }}
            >
              Posición{" "}
              {String(poet.position).padStart(
                2,
                "0"
              )}
            </p>

            <p
              className="mt-3 text-[8px] uppercase tracking-[0.3em]"
              style={{
                color:
                  "rgba(240,232,220,0.34)",
              }}
            >
              Edición fundacional · 2026
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-11 w-11 items-center justify-center border text-xl transition hover:border-[#c7a467] hover:text-[#c7a467]"
            style={{
              borderColor:
                "rgba(240,232,220,0.18)",
              backgroundColor: "transparent",
              color:
                "rgba(240,232,220,0.64)",
            }}
          >
            ×
          </button>
        </div>

        <div className="flex flex-1 flex-col py-12">
          {poet.portraitUrl ? (
            <div
              className="mb-10 aspect-[4/3] w-full overflow-hidden border border-white/10"
              style={{
                backgroundColor: "#080d11",
              }}
            >
              <img
                src={poet.portraitUrl}
                alt={`Retrato de ${poet.name}`}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div
              className="mb-10 flex aspect-[4/3] w-full items-center justify-center border border-white/10"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(199,164,103,0.12), transparent 60%), #080d11",
              }}
            >
              <span
                className="font-serif text-8xl italic"
                style={{
                  color:
                    "rgba(199,164,103,0.62)",
                }}
              >
                {poet.name
                  .trim()
                  .charAt(0)
                  .toUpperCase()}
              </span>
            </div>
          )}

          <p
            className="text-[8px] uppercase tracking-[0.36em]"
            style={{ color: "#c7a467" }}
          >
            {getStatusLabel(poet.status)}
          </p>

          <h2
            id="poet-profile-title"
            className="mt-6 font-serif text-5xl leading-[0.98] tracking-[-0.045em] sm:text-6xl"
          >
            {poet.name}
          </h2>

          <p
            className="mt-5 font-serif text-xl italic"
            style={{
              color:
                "rgba(240,232,220,0.52)",
            }}
          >
            {location}
          </p>

          <div
            className="my-10 h-px"
            style={{
              backgroundColor:
                "rgba(240,232,220,0.12)",
            }}
          />

          <p
            className="max-w-lg text-base leading-8"
            style={{
              color:
                "rgba(240,232,220,0.68)",
            }}
          >
            {poet.shortBio}
          </p>
        </div>

        <div className="border-t border-white/10 pt-7">
          <p
            className="text-[8px] uppercase leading-6 tracking-[0.32em]"
            style={{
              color:
                "rgba(240,232,220,0.28)",
            }}
          >
            Poema Universal · Archivo de voces
          </p>
        </div>
      </aside>
    </div>
  );
}