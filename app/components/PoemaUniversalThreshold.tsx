"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type PublicPoet = {
  id: string;
  position: number;
  name: string;
  country: string;
};

type PublicPoetsResponse = {
  editionYear: number;
  poets: PublicPoet[];
};

const TOTAL_VOICES = 60;
const FOUNDATION_POSITIONS = 4;

export default function PoemaUniversalThreshold() {
  const [poets, setPoets] = useState<PublicPoet[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadPoets() {
      try {
        const response = await fetch(
          "/api/poema-universal/poets",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          return;
        }

        const data =
          (await response.json()) as PublicPoetsResponse;

        if (!cancelled) {
          setPoets(data.poets);
        }
      } catch {
        // La entrada continúa funcionando aunque la API
        // tarde en responder.
      }
    }

    loadPoets();

    return () => {
      cancelled = true;
    };
  }, []);

  const publicPositions = useMemo(
    () => new Set(poets.map((poet) => poet.position)),
    [poets]
  );

  const territories = useMemo(
    () =>
      new Set(
        poets
          .map((poet) => poet.country)
          .filter(Boolean)
      ).size,
    [poets]
  );

  const revealedVoices = poets.length;
  const voicesToCome = Math.max(
    TOTAL_VOICES - revealedVoices,
    0
  );

  return (
    <section
      aria-labelledby="poema-universal-threshold-title"
      className="relative mt-28 overflow-hidden rounded-[42px] border border-stone-900/15 bg-[#070a0d] text-[#f0e8dc] shadow-[0_45px_120px_rgba(46,29,17,0.24)] sm:rounded-[56px]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 76% 24%, rgba(199,164,103,0.18), transparent 26%), radial-gradient(circle at 12% 82%, rgba(120,137,150,0.11), transparent 30%), linear-gradient(135deg, #070a0d 0%, #0c1116 52%, #06080a 100%)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(240,232,220,0.7) 0.5px, transparent 0.7px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative grid gap-16 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-[1.12fr_0.88fr] lg:px-16 lg:py-24">
        <div>
          <div className="flex flex-wrap items-center gap-4">
            <span
              className="text-[9px] uppercase tracking-[0.44em]"
              style={{ color: "#c7a467" }}
            >
              Edición fundacional · 2026
            </span>

            <span
              aria-hidden="true"
              className="h-px w-16"
              style={{
                background:
                  "rgba(199,164,103,0.48)",
              }}
            />

            <span className="text-[9px] uppercase tracking-[0.32em] text-white/38">
              60 voces · 60 territorios posibles
            </span>
          </div>

          <h2
            id="poema-universal-threshold-title"
            className="mt-10 max-w-4xl font-serif text-5xl leading-[0.92] tracking-[-0.055em] sm:text-7xl lg:text-[88px]"
          >
            Sesenta desconocidos.
            <span
              className="mt-2 block italic"
              style={{
                color: "rgba(240,232,220,0.55)",
              }}
            >
              Una voz común.
            </span>
          </h2>

          <p className="mt-10 max-w-2xl font-serif text-2xl leading-[1.3] text-[#f0e8dc] sm:text-3xl">
            Aquí nadie entra por su nombre.
            <span
              className="block italic"
              style={{
                color: "#c7a467",
              }}
            >
              Entra por su voz.
            </span>
          </p>

          <p className="mt-8 max-w-2xl text-sm leading-8 text-white/52 sm:text-base">
            Una obra colectiva reunirá a sesenta poetas
            de distintos países, lenguas y vidas. Ninguna
            voz ocupará más espacio que otra. La fama no
            será una condición. La verdad del poema, sí.
          </p>

          <div className="mt-11 flex flex-wrap items-center gap-5">
            <Link
              href="/poema-universal#entrada"
              className="group inline-flex items-center justify-center rounded-full border border-[#c7a467] bg-[#c7a467] px-7 py-4 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#080b0e] transition hover:-translate-y-0.5 hover:bg-[#d4b579]"
            >
              <span>Entrar en la sala universal</span>

              <span
                aria-hidden="true"
                className="ml-4 inline-block text-sm transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>

            <span className="text-[8px] uppercase tracking-[0.28em] text-white/35">
              Presentación · 1 enero 2027
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div className="grid grid-cols-10 border-l border-t border-white/[0.12]">
            {Array.from(
              { length: TOTAL_VOICES },
              (_, index) => {
                const position = index + 1;
                const isPublic =
                  publicPositions.has(position);
                const isProtected =
                  position <= FOUNDATION_POSITIONS &&
                  !isPublic;

                return (
                  <span
                    key={position}
                    title={`Voz ${String(
                      position
                    ).padStart(2, "0")}`}
                    className="flex aspect-square items-center justify-center border-b border-r border-white/[0.12]"
                    style={{
                      background: isPublic
                        ? "rgba(199,164,103,0.2)"
                        : isProtected
                          ? "rgba(199,164,103,0.065)"
                          : "transparent",
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        backgroundColor: isPublic
                          ? "#c7a467"
                          : isProtected
                            ? "rgba(199,164,103,0.42)"
                            : "rgba(240,232,220,0.16)",
                        boxShadow: isPublic
                          ? "0 0 14px rgba(199,164,103,0.72)"
                          : "none",
                      }}
                    />
                  </span>
                );
              }
            )}
          </div>

          <div className="mt-10 grid grid-cols-3 border-y border-white/[0.12] py-7">
            <div>
              <strong className="block font-serif text-3xl font-normal sm:text-4xl">
                {revealedVoices}
              </strong>

              <span className="mt-2 block text-[7px] uppercase tracking-[0.25em] text-white/38">
                Voces reveladas
              </span>
            </div>

            <div className="border-l border-white/[0.12] pl-5 sm:pl-7">
              <strong className="block font-serif text-3xl font-normal sm:text-4xl">
                {territories}
              </strong>

              <span className="mt-2 block text-[7px] uppercase tracking-[0.25em] text-white/38">
                Territorios
              </span>
            </div>

            <div className="border-l border-white/[0.12] pl-5 sm:pl-7">
              <strong className="block font-serif text-3xl font-normal sm:text-4xl">
                {voicesToCome}
              </strong>

              <span className="mt-2 block text-[7px] uppercase tracking-[0.25em] text-white/38">
                Voces por llegar
              </span>
            </div>
          </div>

          <p className="mt-7 text-right font-serif text-sm italic text-white/36">
            El mundo todavía está escribiendo.
          </p>
        </div>
      </div>

      <div className="relative border-t border-white/[0.1] px-6 py-7 sm:px-10 lg:px-16">
        <div className="flex items-center justify-center gap-5">
          <span
            aria-hidden="true"
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(199,164,103,0.42))",
            }}
          />

          <span
            className="text-center text-[7px] uppercase tracking-[0.38em]"
            style={{
              color: "rgba(240,232,220,0.42)",
            }}
          >
            De la casa a la sala
          </span>

          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor: "#c7a467",
              boxShadow:
                "0 0 18px rgba(199,164,103,0.55)",
            }}
          />

          <span
            aria-hidden="true"
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(to left, transparent, rgba(199,164,103,0.42))",
            }}
          />
        </div>
      </div>
    </section>
  );
}
