"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import WorldGlobeLive from "./components/WorldGlobeLive";

const PRESENTATION_DATE = new Date(
  "2027-01-01T00:00:00+01:00"
).getTime();

const TOTAL_VOICES = 60;
const INCORPORATION_VOICES = 4;

type CountdownTime = {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
};

type VoiceSlot = {
  position: number;
  status: "incorporation" | "available";
};

const voiceSlots: VoiceSlot[] = Array.from(
  { length: TOTAL_VOICES },
  (_, index) => ({
    position: index + 1,
    status:
      index < INCORPORATION_VOICES
        ? "incorporation"
        : "available",
  })
);

const manifestoPrinciples = [
  {
    number: "I",
    title: "Una sola obra",
    text: "Cada fragmento conservará su identidad, pero deberá servir a la arquitectura completa del poema.",
  },
  {
    number: "II",
    title: "Sesenta voces",
    text: "Ninguna voz ocupará una posición superior. Todas compartirán el mismo espacio editorial.",
  },
  {
    number: "III",
    title: "Un año de escritura",
    text: "La obra crecerá durante 2026 y permanecerá cerrada hasta su presentación pública.",
  },
  {
    number: "IV",
    title: "Una memoria común",
    text: "El libro conservará aquello que el mundo haya dejado escrito en las personas que lo habitaron.",
  },
];

const navigationLinks = [
  {
    label: "Manifiesto",
    href: "#manifiesto",
  },
  {
    label: "Las voces",
    href: "#voces",
  },
  {
    label: "El mundo",
    href: "#mundo",
  },
];

function calculateCountdown(): CountdownTime {
  const difference =
    PRESENTATION_DATE - Date.now();

  if (difference <= 0) {
    return {
      dias: 0,
      horas: 0,
      minutos: 0,
      segundos: 0,
    };
  }

  return {
    dias: Math.floor(
      difference / (1000 * 60 * 60 * 24)
    ),
    horas: Math.floor(
      (difference / (1000 * 60 * 60)) % 24
    ),
    minutos: Math.floor(
      (difference / (1000 * 60)) % 60
    ),
    segundos: Math.floor(
      (difference / 1000) % 60
    ),
  };
}

export default function PoemaUniversalPage() {
  const [time, setTime] =
    useState<CountdownTime>({
      dias: 0,
      horas: 0,
      minutos: 0,
      segundos: 0,
    });

  useEffect(() => {
    setTime(calculateCountdown());

    const interval = window.setInterval(() => {
      setTime(calculateCountdown());
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const countdownItems = [
    {
      value: time.dias,
      label: "Días",
    },
    {
      value: time.horas,
      label: "Horas",
    },
    {
      value: time.minutos,
      label: "Minutos",
    },
    {
      value: time.segundos,
      label: "Segundos",
    },
  ];

  const availableVoices =
    TOTAL_VOICES - INCORPORATION_VOICES;

  return (
    <main
      id="top"
      className="min-h-screen overflow-x-hidden"
      style={{
        backgroundColor: "#f0e8dc",
        color: "#171411",
      }}
    >
      {/* NAVEGACIÓN */}

      <header
        className="sticky top-0 z-50 border-b backdrop-blur-xl"
        style={{
          borderColor: "rgba(23,20,17,0.12)",
          backgroundColor:
            "rgba(240,232,220,0.94)",
        }}
      >
        <div className="mx-auto flex min-h-[70px] max-w-[1380px] items-center justify-between gap-8 px-5 sm:px-8 lg:px-12">
          <Link
            href="/poema-universal"
            className="font-serif text-xl tracking-[-0.025em] transition hover:opacity-55"
          >
            Poema Universal
          </Link>

          <nav
            aria-label="Navegación de Poema Universal"
            className="hidden items-center gap-10 md:flex"
          >
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[9px] uppercase tracking-[0.31em] text-stone-500 transition hover:text-stone-950"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <span className="hidden text-[8px] uppercase tracking-[0.3em] text-stone-400 lg:block">
              Edición fundacional · 2026
            </span>

            <Link
              href="/"
              className="border border-stone-900/20 px-5 py-2.5 text-[8px] uppercase tracking-[0.3em] transition hover:bg-[#171411] hover:text-white"
            >
              Inicio
            </Link>
          </div>
        </div>
      </header>

      {/* 01 · UMBRAL */}

      <section className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[-420px] h-[900px] w-[1100px] -translate-x-1/2 rounded-full blur-[170px]"
          style={{
            backgroundColor:
              "rgba(255,255,255,0.75)",
          }}
        />

        <div className="relative mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between border-b border-stone-900/15 py-6">
            <p className="text-[8px] uppercase tracking-[0.4em] text-stone-500">
              Institución literaria internacional
            </p>

            <p className="text-[8px] uppercase tracking-[0.3em] text-stone-400">
              Presentación · 01.01.2027
            </p>
          </div>

          <div className="flex min-h-[650px] flex-col items-center justify-center py-20 text-center sm:min-h-[720px]">
            <p
              className="text-[9px] uppercase tracking-[0.52em]"
              style={{
                color: "#9a743e",
              }}
            >
              Edición fundacional
            </p>

            <h1 className="mt-9 font-serif text-7xl leading-[0.84] tracking-[-0.065em] sm:text-9xl lg:text-[142px]">
              Poema
              <span className="block italic text-stone-500">
                Universal
              </span>
            </h1>

            <p className="mx-auto mt-12 max-w-3xl font-serif text-2xl italic leading-[1.5] text-stone-600 sm:text-3xl lg:text-[38px]">
              Una única obra escrita durante un año
              por sesenta voces del mundo.
            </p>

            <Link
              href="#manifiesto"
              className="mt-14 border-b border-stone-900/25 pb-2 text-[8px] uppercase tracking-[0.35em] text-stone-500 transition hover:border-stone-950 hover:text-stone-950"
            >
              Leer la declaración fundacional ↓
            </Link>
          </div>

          {/* CUENTA ATRÁS */}

          <div className="border-t border-stone-900/15 pb-16 pt-8">
            <div className="mb-7 flex items-center justify-between">
              <p className="text-[8px] uppercase tracking-[0.36em] text-stone-500">
                Tiempo restante
              </p>

              <p className="text-[8px] uppercase tracking-[0.3em] text-stone-400">
                Apertura del primer libro
              </p>
            </div>

            <div className="grid grid-cols-2 border-l border-t border-stone-900/15 sm:grid-cols-4">
              {countdownItems.map((item) => (
                <div
                  key={item.label}
                  className="border-b border-r border-stone-900/15 px-6 py-7 sm:px-8 sm:py-9"
                >
                  <span className="block font-serif text-5xl tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                    {String(item.value).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <span className="mt-4 block text-[8px] uppercase tracking-[0.32em] text-stone-500">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 02 · MANIFIESTO */}

      <section
        id="manifiesto"
        className="border-t border-stone-900/15"
      >
        <div className="mx-auto max-w-[1380px] px-5 py-28 sm:px-8 sm:py-36 lg:px-12 lg:py-44">
          <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-28">
            <div>
              <p
                className="text-[9px] uppercase tracking-[0.48em]"
                style={{
                  color: "#9a743e",
                }}
              >
                Manifiesto universal
              </p>

              <h2 className="mt-9 max-w-4xl font-serif text-5xl leading-[1.02] tracking-[-0.048em] sm:text-7xl lg:text-[88px]">
                No reunimos poemas.
                <span className="mt-2 block italic text-stone-500">
                  Escribimos un año.
                </span>
              </h2>
            </div>

            <div className="flex flex-col justify-end">
              <p className="font-serif text-2xl italic leading-[1.55] text-stone-700 sm:text-3xl">
                Poema Universal nace para reunir
                sensibilidades distintas dentro de una
                misma construcción literaria.
              </p>

              <p className="mt-8 max-w-xl text-base leading-8 text-stone-600">
                No será una antología ni una colección
                de nombres. Será una única obra,
                construida lentamente durante todo un
                año y custodiada como memoria de su
                tiempo.
              </p>
            </div>
          </div>

          <div className="mt-24 border-t border-stone-900/15">
            {manifestoPrinciples.map(
              (principle) => (
                <article
                  key={principle.number}
                  className="grid gap-5 border-b border-stone-900/15 py-8 md:grid-cols-[80px_250px_1fr] md:items-start"
                >
                  <span
                    className="font-serif text-lg italic"
                    style={{
                      color: "#a37c44",
                    }}
                  >
                    {principle.number}
                  </span>

                  <h3 className="font-serif text-2xl">
                    {principle.title}
                  </h3>

                  <p className="max-w-2xl text-sm leading-7 text-stone-600 sm:text-base sm:leading-8">
                    {principle.text}
                  </p>
                </article>
              )
            )}
          </div>

          <blockquote className="mx-auto mt-24 max-w-5xl text-center">
            <p className="font-serif text-3xl italic leading-[1.5] text-stone-700 sm:text-5xl">
              “Mientras exista una voz que todavía no
              haya encontrado su lugar, el poema no
              estará terminado.”
            </p>

            <footer className="mt-9 text-[8px] uppercase tracking-[0.4em] text-stone-400">
              Declaración fundacional
            </footer>
          </blockquote>
        </div>
      </section>

      {/* NOCHE INSTITUCIONAL */}

      <section
        style={{
          backgroundColor: "#060a0e",
          color: "#f0e8dc",
        }}
      >
        {/* 03 · LAS VOCES */}

        <div
          id="voces"
          className="mx-auto max-w-[1380px] px-5 py-28 sm:px-8 sm:py-36 lg:px-12 lg:py-44"
        >
          <div className="grid gap-14 lg:grid-cols-[1fr_0.8fr] lg:gap-24">
            <div>
              <p
                className="text-[9px] uppercase tracking-[0.46em]"
                style={{
                  color: "#c7a467",
                }}
              >
                Registro de la edición
              </p>

              <h2
                className="mt-8 font-serif text-5xl leading-[0.98] tracking-[-0.05em] sm:text-7xl lg:text-[88px]"
                style={{
                  color: "#f0e8dc",
                }}
              >
                Sesenta voces.
                <span
                  className="block italic"
                  style={{
                    color:
                      "rgba(240,232,220,0.48)",
                  }}
                >
                  Un mismo lugar.
                </span>
              </h2>
            </div>

            <div className="flex flex-col justify-end">
              <p
                className="font-serif text-2xl italic leading-[1.55] sm:text-3xl"
                style={{
                  color:
                    "rgba(240,232,220,0.66)",
                }}
              >
                Las identidades aparecerán cuando su
                participación haya sido confirmada.
              </p>

              <div className="mt-10 flex gap-12">
                <div>
                  <span className="block font-serif text-4xl">
                    {INCORPORATION_VOICES}
                  </span>

                  <span
                    className="mt-2 block text-[8px] uppercase tracking-[0.28em]"
                    style={{
                      color:
                        "rgba(240,232,220,0.34)",
                    }}
                  >
                    En incorporación
                  </span>
                </div>

                <div>
                  <span className="block font-serif text-4xl">
                    {availableVoices}
                  </span>

                  <span
                    className="mt-2 block text-[8px] uppercase tracking-[0.28em]"
                    style={{
                      color:
                        "rgba(240,232,220,0.34)",
                    }}
                  >
                    Disponibles
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RETÍCULA */}

          <ol className="mt-20 grid grid-cols-2 border-l border-t border-white/10 sm:grid-cols-3 lg:grid-cols-6">
            {voiceSlots.map((slot) => {
              const isIncorporation =
                slot.status === "incorporation";

              return (
                <li
                  key={slot.position}
                  className="flex min-h-[128px] flex-col justify-between border-b border-r border-white/10 p-5 sm:min-h-[142px] sm:p-6"
                  style={{
                    background: isIncorporation
                      ? "linear-gradient(145deg, rgba(199,164,103,0.14), rgba(199,164,103,0.02))"
                      : "transparent",
                  }}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className="font-serif text-lg italic"
                      style={{
                        color: isIncorporation
                          ? "#c7a467"
                          : "rgba(240,232,220,0.27)",
                      }}
                    >
                      {String(
                        slot.position
                      ).padStart(2, "0")}
                    </span>

                    <span
                      className={
                        isIncorporation
                          ? "h-2 w-2 rounded-full"
                          : "h-2 w-2 rounded-full border"
                      }
                      style={
                        isIncorporation
                          ? {
                              backgroundColor:
                                "#c7a467",
                              boxShadow:
                                "0 0 16px rgba(199,164,103,0.46)",
                            }
                          : {
                              borderColor:
                                "rgba(240,232,220,0.2)",
                            }
                      }
                    />
                  </div>

                  <p
                    className="font-serif text-base"
                    style={{
                      color: isIncorporation
                        ? "rgba(240,232,220,0.84)"
                        : "rgba(240,232,220,0.34)",
                    }}
                  >
                    {isIncorporation
                      ? "En incorporación"
                      : "Disponible"}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>

        {/* 04 · EL MUNDO */}

        <div className="border-t border-white/10">
          <div className="mx-auto max-w-[1380px] px-5 pt-28 text-center sm:px-8 sm:pt-36 lg:px-12">
            <p
              className="text-[9px] uppercase tracking-[0.46em]"
              style={{
                color: "#c7a467",
              }}
            >
              Cartografía de una voz común
            </p>

            <h2
              className="mx-auto mt-8 max-w-5xl font-serif text-5xl leading-[0.98] tracking-[-0.05em] sm:text-7xl lg:text-[88px]"
              style={{
                color: "#f0e8dc",
              }}
            >
              El mundo comienza
              <span
                className="block italic"
                style={{
                  color:
                    "rgba(240,232,220,0.48)",
                }}
              >
                a escribir junto.
              </span>
            </h2>

            <p
              className="mx-auto mt-9 max-w-2xl text-sm leading-7 sm:text-base sm:leading-8"
              style={{
                color:
                  "rgba(240,232,220,0.4)",
              }}
            >
              Cada territorio iluminado representa una
              presencia que comienza a formar parte de
              la edición fundacional.
            </p>
          </div>

          <WorldGlobeLive />
        </div>

        {/* CIERRE MÍNIMO */}

        <footer className="mx-auto max-w-[1380px] border-t border-white/10 px-5 py-10 sm:px-8 lg:px-12">
          <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
            <p
              className="text-[8px] uppercase tracking-[0.3em]"
              style={{
                color:
                  "rgba(240,232,220,0.25)",
              }}
            >
              © 2026 Poema Universal
            </p>

            <p
              className="text-[8px] uppercase tracking-[0.3em]"
              style={{
                color: "#c7a467",
              }}
            >
              Fundador y poeta · José Naveiro
            </p>

            <Link
              href="#top"
              className="text-[8px] uppercase tracking-[0.3em] transition hover:opacity-60"
              style={{
                color:
                  "rgba(240,232,220,0.34)",
              }}
            >
              Volver al inicio ↑
            </Link>
          </div>
        </footer>
      </section>
    </main>
  );
}