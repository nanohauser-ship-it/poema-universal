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

type VoiceStatus = "incorporation" | "available";

type VoiceSlot = {
  position: number;
  status: VoiceStatus;
};

function calculateCountdown(): CountdownTime {
  const difference = PRESENTATION_DATE - Date.now();

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
    href: "#cartografia",
  },
];

const principles = [
  {
    number: "01",
    title: "Una sola obra",
    text: "Cada fragmento deberá servir al poema completo, no únicamente a quien lo escribe.",
  },
  {
    number: "02",
    title: "Sesenta voces",
    text: "Ninguna voz estará por encima de otra. Todas ocuparán el mismo lugar dentro de la edición.",
  },
  {
    number: "03",
    title: "Un año entero",
    text: "La obra crecerá durante 2026 y permanecerá cerrada hasta su presentación pública.",
  },
  {
    number: "04",
    title: "Una memoria común",
    text: "El poema conservará aquello que el año haya dejado escrito en quienes lo habitaron.",
  },
];

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

export default function PoemaUniversalPage() {
  const [time, setTime] = useState<CountdownTime>({
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
        backgroundColor: "#eee6da",
        color: "#17130f",
      }}
    >
      {/* NAVEGACIÓN INSTITUCIONAL */}

      <header
        className="sticky top-0 z-50 border-b backdrop-blur-xl"
        style={{
          borderColor: "rgba(23,19,15,0.14)",
          backgroundColor: "rgba(238,230,218,0.94)",
        }}
      >
        <div className="mx-auto flex min-h-[72px] max-w-[1540px] items-center justify-between gap-8 px-5 sm:px-8 lg:px-12">
          <Link
            href="/poema-universal"
            className="font-serif text-xl tracking-[-0.025em] transition hover:opacity-55"
          >
            Poema Universal
          </Link>

          <nav
            aria-label="Navegación principal"
            className="hidden items-center gap-10 md:flex"
          >
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[9px] uppercase tracking-[0.32em] text-stone-500 transition hover:text-stone-950"
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
              className="border border-stone-900/25 px-5 py-2.5 text-[8px] uppercase tracking-[0.3em] transition hover:bg-stone-950 hover:text-white"
            >
              Inicio
            </Link>
          </div>
        </div>
      </header>

      {/* 01 · UMBRAL */}

      <section className="relative min-h-[calc(100vh-72px)] overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[-420px] h-[900px] w-[1100px] -translate-x-1/2 rounded-full blur-[170px]"
          style={{
            backgroundColor: "rgba(255,255,255,0.72)",
          }}
        />

        <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-[1540px] flex-col px-5 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between border-b border-stone-900/15 py-6">
            <p className="text-[8px] uppercase tracking-[0.42em] text-stone-500">
              Institución literaria internacional
            </p>

            <p className="text-[8px] uppercase tracking-[0.32em] text-stone-400">
              Presentación · 01.01.2027
            </p>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center py-20 text-center">
            <p
              className="text-[9px] uppercase tracking-[0.5em]"
              style={{ color: "#97713b" }}
            >
              Edición fundacional
            </p>

            <h1 className="mt-9 font-serif text-7xl leading-[0.83] tracking-[-0.065em] sm:text-9xl lg:text-[160px]">
              Poema
              <span className="block italic text-stone-500">
                Universal
              </span>
            </h1>

            <p className="mx-auto mt-12 max-w-3xl font-serif text-2xl italic leading-[1.55] text-stone-600 sm:text-3xl lg:text-4xl">
              Una única obra escrita durante un año por
              sesenta voces del mundo.
            </p>

            <a
              href="#manifiesto"
              className="mt-14 border-b border-stone-900/30 pb-2 text-[8px] uppercase tracking-[0.36em] text-stone-500 transition hover:border-stone-950 hover:text-stone-950"
            >
              Leer la declaración fundacional ↓
            </a>
          </div>

          <div className="border-t border-stone-900/15 pb-10 pt-7">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-[8px] uppercase tracking-[0.35em] text-stone-500">
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
                  className="border-b border-r border-stone-900/15 px-6 py-7 sm:px-8 sm:py-8"
                >
                  <span className="block font-serif text-5xl tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                    {String(item.value).padStart(2, "0")}
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
        <div className="mx-auto max-w-[1540px] px-5 py-28 sm:px-8 sm:py-36 lg:px-12 lg:py-44">
          <div className="grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-28">
            <div>
              <p
                className="text-[9px] uppercase tracking-[0.46em]"
                style={{ color: "#97713b" }}
              >
                Manifiesto universal
              </p>

              <h2 className="mt-9 max-w-4xl font-serif text-5xl leading-[1.02] tracking-[-0.045em] sm:text-7xl lg:text-[92px]">
                No estamos reuniendo poemas.
                <span className="mt-3 block italic text-stone-500">
                  Estamos escribiendo un año.
                </span>
              </h2>
            </div>

            <div className="flex flex-col justify-end">
              <p className="font-serif text-2xl italic leading-[1.55] text-stone-700 sm:text-3xl">
                Poema Universal nace para reunir voces que
                no compiten entre sí y construir con ellas
                una memoria compartida.
              </p>

              <p className="mt-8 max-w-xl text-base leading-8 text-stone-600">
                No será una antología ni una suma de autores.
                Será una sola arquitectura literaria,
                construida lentamente durante todo un año.
              </p>
            </div>
          </div>

          <div className="mt-24 border-t border-stone-900/15">
            {principles.map((principle) => (
              <article
                key={principle.number}
                className="grid gap-5 border-b border-stone-900/15 py-8 md:grid-cols-[80px_260px_1fr] md:items-start"
              >
                <span
                  className="font-serif text-lg italic"
                  style={{ color: "#a27d46" }}
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
            ))}
          </div>

          <blockquote className="mx-auto mt-24 max-w-5xl text-center">
            <p className="font-serif text-3xl italic leading-[1.5] text-stone-700 sm:text-5xl">
              “Mientras exista una voz que todavía no haya
              encontrado su lugar, el poema no estará
              terminado.”
            </p>

            <footer className="mt-9 text-[8px] uppercase tracking-[0.4em] text-stone-400">
              Declaración fundacional · Poema Universal
            </footer>
          </blockquote>
        </div>
      </section>

      {/* TRANSICIÓN A LA NOCHE */}

      <div
        className="h-36"
        style={{
          background:
            "linear-gradient(180deg, #eee6da 0%, #1a2229 55%, #05090d 100%)",
        }}
      />

      {/* 03 · REGISTRO DE VOCES */}

      <section
        id="voces"
        className="relative"
        style={{
          backgroundColor: "#05090d",
          color: "#f2eadf",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[-260px] h-[850px] w-[1200px] -translate-x-1/2 rounded-full blur-[190px]"
          style={{
            backgroundColor: "rgba(179,133,65,0.07)",
          }}
        />

        <div className="relative mx-auto max-w-[1540px] px-5 py-28 sm:px-8 sm:py-36 lg:px-12 lg:py-44">
          <div className="grid gap-14 lg:grid-cols-[1fr_0.8fr] lg:gap-24">
            <div>
              <p
                className="text-[9px] uppercase tracking-[0.46em]"
                style={{ color: "#d0a665" }}
              >
                Registro de la edición
              </p>

              <h2
                className="mt-8 font-serif text-5xl leading-[0.98] tracking-[-0.05em] sm:text-7xl lg:text-[92px]"
                style={{ color: "#f2eadf" }}
              >
                Sesenta voces.
                <span
                  className="block italic"
                  style={{
                    color: "rgba(242,234,223,0.48)",
                  }}
                >
                  El mismo lugar.
                </span>
              </h2>
            </div>

            <div className="flex flex-col justify-end">
              <p
                className="font-serif text-2xl italic leading-[1.55] sm:text-3xl"
                style={{
                  color: "rgba(242,234,223,0.68)",
                }}
              >
                Ninguna identidad ocupará el archivo hasta
                que su participación haya sido confirmada.
              </p>

              <div className="mt-10 flex flex-wrap gap-x-10 gap-y-5">
                <div>
                  <span
                    className="block font-serif text-4xl"
                    style={{ color: "#f2eadf" }}
                  >
                    {INCORPORATION_VOICES}
                  </span>

                  <span
                    className="mt-2 block text-[8px] uppercase tracking-[0.28em]"
                    style={{
                      color: "rgba(242,234,223,0.34)",
                    }}
                  >
                    En incorporación
                  </span>
                </div>

                <div>
                  <span
                    className="block font-serif text-4xl"
                    style={{ color: "#f2eadf" }}
                  >
                    {availableVoices}
                  </span>

                  <span
                    className="mt-2 block text-[8px] uppercase tracking-[0.28em]"
                    style={{
                      color: "rgba(242,234,223,0.34)",
                    }}
                  >
                    Disponibles
                  </span>
                </div>

                <div>
                  <span
                    className="block font-serif text-4xl"
                    style={{ color: "#f2eadf" }}
                  >
                    2
                  </span>

                  <span
                    className="mt-2 block text-[8px] uppercase tracking-[0.28em]"
                    style={{
                      color: "rgba(242,234,223,0.34)",
                    }}
                  >
                    Países presentes
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 flex flex-wrap items-center justify-between gap-7 border-t border-white/10 pt-7">
            <p
              className="font-serif text-xl italic"
              style={{
                color: "rgba(242,234,223,0.52)",
              }}
            >
              Edición fundacional · 2026
            </p>

            <div className="flex flex-wrap gap-7">
              <div className="flex items-center gap-3">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: "#d0a665",
                    boxShadow:
                      "0 0 16px rgba(208,166,101,0.48)",
                  }}
                />

                <span
                  className="text-[8px] uppercase tracking-[0.27em]"
                  style={{
                    color: "rgba(242,234,223,0.38)",
                  }}
                >
                  En incorporación
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className="h-2 w-2 rounded-full border"
                  style={{
                    borderColor:
                      "rgba(242,234,223,0.25)",
                  }}
                />

                <span
                  className="text-[8px] uppercase tracking-[0.27em]"
                  style={{
                    color: "rgba(242,234,223,0.38)",
                  }}
                >
                  Disponible
                </span>
              </div>
            </div>
          </div>

          <ol className="mt-8 grid grid-cols-2 border-l border-t border-white/10 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-10">
            {voiceSlots.map((slot) => {
              const isIncorporation =
                slot.status === "incorporation";

              return (
                <li
                  key={slot.position}
                  className="flex min-h-[132px] flex-col justify-between border-b border-r border-white/10 p-5"
                  style={{
                    background: isIncorporation
                      ? "linear-gradient(145deg, rgba(208,166,101,0.14), rgba(208,166,101,0.025))"
                      : "rgba(255,255,255,0.008)",
                  }}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className="font-serif text-lg italic"
                      style={{
                        color: isIncorporation
                          ? "#d0a665"
                          : "rgba(242,234,223,0.28)",
                      }}
                    >
                      {String(slot.position).padStart(
                        2,
                        "0"
                      )}
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
                              backgroundColor: "#d0a665",
                              boxShadow:
                                "0 0 14px rgba(208,166,101,0.45)",
                            }
                          : {
                              borderColor:
                                "rgba(242,234,223,0.18)",
                            }
                      }
                    />
                  </div>

                  <div>
                    <p
                      className="font-serif text-sm leading-snug"
                      style={{
                        color: isIncorporation
                          ? "rgba(242,234,223,0.84)"
                          : "rgba(242,234,223,0.32)",
                      }}
                    >
                      {isIncorporation
                        ? "En incorporación"
                        : "Disponible"}
                    </p>

                    <p
                      className="mt-2 text-[7px] uppercase tracking-[0.22em]"
                      style={{
                        color: isIncorporation
                          ? "rgba(208,166,101,0.58)"
                          : "rgba(242,234,223,0.13)",
                      }}
                    >
                      Posición editorial
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* 04 · CARTOGRAFÍA */}

      <section
        id="cartografia"
        style={{
          backgroundColor: "#020507",
          color: "#f2eadf",
        }}
      >
        <div className="mx-auto max-w-[1540px] border-t border-white/10 px-5 pt-28 text-center sm:px-8 sm:pt-36 lg:px-12">
          <p
            className="text-[9px] uppercase tracking-[0.46em]"
            style={{ color: "#d0a665" }}
          >
            Cartografía de una voz común
          </p>

          <h2
            className="mx-auto mt-8 max-w-5xl font-serif text-5xl leading-[0.98] tracking-[-0.05em] sm:text-7xl lg:text-[92px]"
            style={{ color: "#f2eadf" }}
          >
            El mundo comienza
            <span
              className="block italic"
              style={{
                color: "rgba(242,234,223,0.5)",
              }}
            >
              a escribir junto.
            </span>
          </h2>

          <p
            className="mx-auto mt-9 max-w-2xl text-sm leading-7 sm:text-base sm:leading-8"
            style={{
              color: "rgba(242,234,223,0.4)",
            }}
          >
            Cada territorio iluminado representa una
            presencia que ha comenzado a formar parte de la
            edición fundacional.
          </p>
        </div>

        <WorldGlobeLive />

        <footer className="mx-auto max-w-[1540px] border-t border-white/10 px-5 py-10 sm:px-8 lg:px-12">
          <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
            <p
              className="text-[8px] uppercase tracking-[0.32em]"
              style={{
                color: "rgba(242,234,223,0.25)",
              }}
            >
              © 2026 Poema Universal
            </p>

            <p
              className="text-[8px] uppercase tracking-[0.32em]"
              style={{ color: "#d0a665" }}
            >
              Fundador y poeta · José Naveiro
            </p>

            <a
              href="#top"
              className="text-[8px] uppercase tracking-[0.32em] transition hover:opacity-60"
              style={{
                color: "rgba(242,234,223,0.34)",
              }}
            >
              Volver al inicio ↑
            </a>
          </div>
        </footer>
      </section>
    </main>
  );
}