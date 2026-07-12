"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Manifesto from "./components/Manifesto";
import VoicesWall from "./components/VoicesWall";
import WorldGlobeLive from "./components/WorldGlobeLive";

const PRESENTATION_DATE = new Date(
  "2027-01-01T00:00:00"
).getTime();

type CountdownTime = {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
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
    label: "Las 60 voces",
    href: "#voces",
  },
  {
    label: "El mundo",
    href: "#mundo",
  },
];

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

  return (
    <main
      id="top"
      className="min-h-screen overflow-x-hidden"
      style={{
        backgroundColor: "#f3ecdf",
        color: "#17130f",
      }}
    >
      {/* NAVEGACIÓN */}

      <header
        className="sticky top-0 z-50 border-b backdrop-blur-xl"
        style={{
          borderColor: "rgba(23,19,15,0.12)",
          backgroundColor: "rgba(243,236,223,0.94)",
        }}
      >
        <div className="mx-auto flex min-h-[72px] max-w-[1600px] items-center justify-between gap-8 px-5 sm:px-8 lg:px-12">
          <Link
            href="/poema-universal"
            className="font-serif text-xl tracking-[-0.025em]"
          >
            Poema Universal
          </Link>

          <nav
            aria-label="Navegación de Poema Universal"
            className="hidden items-center gap-9 md:flex"
          >
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[9px] uppercase tracking-[0.3em] text-stone-500 transition hover:text-stone-950"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/"
            className="rounded-full border border-stone-900/20 px-5 py-2.5 text-[8px] uppercase tracking-[0.3em] transition hover:bg-stone-950 hover:text-white"
          >
            Inicio
          </Link>
        </div>
      </header>

      {/* 01 · CUENTA ATRÁS */}

      <section className="relative min-h-[calc(100vh-72px)] overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[-360px] h-[900px] w-[1100px] -translate-x-1/2 rounded-full blur-[160px]"
          style={{
            backgroundColor: "rgba(255,255,255,0.8)",
          }}
        />

        <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-[1600px] flex-col justify-between px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <div className="flex items-center justify-between border-b border-stone-900/10 pb-6">
            <p className="text-[9px] uppercase tracking-[0.42em] text-stone-500">
              Edición fundacional · 2026
            </p>

            <p className="text-[9px] uppercase tracking-[0.32em] text-stone-400">
              Presentación · 01.01.2027
            </p>
          </div>

          <div className="py-20 text-center">
            <p className="text-[10px] uppercase tracking-[0.5em] text-[#96713c]">
              Una obra colectiva internacional
            </p>

            <h1 className="mx-auto mt-9 max-w-5xl font-serif text-6xl leading-[0.94] tracking-[-0.06em] sm:text-8xl lg:text-[124px]">
              Poema
              <span className="block italic text-stone-500">
                Universal
              </span>
            </h1>

            <p className="mx-auto mt-10 max-w-2xl font-serif text-2xl italic leading-[1.55] text-stone-600 sm:text-3xl">
              Sesenta voces escribirán una sola obra durante
              todo un año.
            </p>
          </div>

          <div>
            <p className="mb-6 text-center text-[9px] uppercase tracking-[0.4em] text-stone-500">
              Tiempo restante hasta la presentación
            </p>

            <div className="grid grid-cols-2 border-l border-t border-stone-900/15 sm:grid-cols-4">
              {countdownItems.map((item) => (
                <div
                  key={item.label}
                  className="border-b border-r border-stone-900/15 px-6 py-7 sm:py-9"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.32)",
                  }}
                >
                  <span className="block font-serif text-5xl tracking-[-0.05em] sm:text-6xl">
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

      {/* ZONA NOCTURNA */}

      <section
        className="relative"
        style={{
          background:
            "linear-gradient(180deg, #101820 0%, #05090d 16%, #020406 100%)",
          color: "#f2eadf",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[1000px] w-[1300px] -translate-x-1/2 rounded-full blur-[190px]"
          style={{
            backgroundColor: "rgba(182,136,66,0.08)",
          }}
        />

        {/* 02 · MANIFIESTO */}

        <div
          id="manifiesto"
          className="relative mx-auto max-w-[1600px] px-5 pt-16 sm:px-8 lg:px-12"
        >
          <Manifesto />
        </div>

        {/* 03 · SESENTA AUTORES */}

        <div className="relative mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
          <VoicesWall />
        </div>

        {/* 04 · MAPAMUNDI */}

        <div className="relative">
          <WorldGlobeLive />
        </div>

        <div className="relative mx-auto max-w-[1600px] px-5 py-16 text-center sm:px-8 lg:px-12">
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/25">
            Poema Universal · Edición fundacional 2026
          </p>
        </div>
      </section>
    </main>
  );
}