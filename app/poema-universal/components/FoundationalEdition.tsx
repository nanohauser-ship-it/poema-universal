"use client";

import { useEffect, useState } from "react";

const PRESENTATION_DATE = new Date(
  "2027-01-01T00:00:00"
).getTime();

const TOTAL_VOICES = 60;
const OCCUPIED_VOICES = 4;

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

const principles = [
  {
    number: "I",
    title: "Una obra común",
    text: "Cada poeta aporta una voz propia, pero ninguna voz existe por encima del libro.",
  },
  {
    number: "II",
    title: "Una memoria del mundo",
    text: "La edición conserva el temblor, la herida y la belleza del año en que fue escrita.",
  },
  {
    number: "III",
    title: "Una continuidad",
    text: "Cada nuevo año abre un libro distinto y prolonga el archivo de quienes estuvieron aquí.",
  },
];

export default function FoundationalEdition() {
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
    TOTAL_VOICES - OCCUPIED_VOICES;

  const progress =
    (OCCUPIED_VOICES / TOTAL_VOICES) * 100;

  return (
    <section
      id="edicion-fundacional"
      className="relative py-24 sm:py-32 lg:py-40"
    >
      <div className="grid gap-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-28">
        {/* COLUMNA EDITORIAL */}

        <div>
          <p
            className="text-[10px] uppercase tracking-[0.48em]"
            style={{ color: "#95703a" }}
          >
            Edición fundacional · 2026
          </p>

          <h2
            className="mt-8 max-w-4xl font-serif text-5xl leading-[0.96] tracking-[-0.055em] sm:text-7xl lg:text-[92px]"
            style={{ color: "#191512" }}
          >
            Un solo libro.
            <span
              className="block italic"
              style={{ color: "#756b61" }}
            >
              Sesenta voces.
            </span>
          </h2>

          <div className="mt-12 max-w-2xl border-l border-stone-900/15 pl-7 sm:pl-10">
            <p
              className="font-serif text-2xl italic leading-[1.55] sm:text-3xl"
              style={{ color: "#413a34" }}
            >
              Poema Universal nace para reunir aquello
              que el mundo suele dejar separado.
            </p>

            <p className="mt-7 text-base leading-8 text-stone-600 sm:text-lg sm:leading-9">
              Durante 2026, poetas de distintos países
              escribirán una única obra colectiva. Cada
              fragmento conservará su identidad, pero
              formará parte de una arquitectura mayor.
            </p>

            <p className="mt-5 text-base leading-8 text-stone-600 sm:text-lg sm:leading-9">
              El libro permanecerá cerrado durante su
              construcción y será presentado oficialmente
              el 1 de enero de 2027.
            </p>
          </div>

          <div className="mt-16 border-t border-stone-900/10">
            {principles.map((principle) => (
              <article
                key={principle.number}
                className="grid gap-5 border-b border-stone-900/10 py-8 sm:grid-cols-[70px_190px_1fr] sm:items-start"
              >
                <span
                  className="font-serif text-xl italic"
                  style={{ color: "#a8844e" }}
                >
                  {principle.number}
                </span>

                <h3
                  className="font-serif text-xl"
                  style={{ color: "#211b17" }}
                >
                  {principle.title}
                </h3>

                <p className="max-w-xl text-sm leading-7 text-stone-600 sm:text-base sm:leading-8">
                  {principle.text}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-2">
            <span className="text-[9px] uppercase tracking-[0.3em] text-stone-400">
              Fundador y poeta
            </span>

            <span
              className="font-serif text-2xl"
              style={{ color: "#211b17" }}
            >
              José Naveiro
            </span>
          </div>
        </div>

        {/* COLUMNA DEL TIEMPO */}

        <div className="lg:pt-20">
          <div className="border-t border-stone-900/15 pt-8">
            <p className="text-[9px] uppercase tracking-[0.36em] text-stone-500">
              Tiempo restante hasta la apertura
            </p>

            <div className="mt-8 grid grid-cols-2 border-l border-t border-stone-900/10 sm:grid-cols-4">
              {countdownItems.map((item) => (
                <div
                  key={item.label}
                  className="min-h-[150px] border-b border-r border-stone-900/10 px-5 py-7 sm:min-h-[175px] sm:px-6 sm:py-9"
                >
                  <span
                    className="block font-serif text-4xl tracking-[-0.05em] sm:text-5xl lg:text-6xl"
                    style={{ color: "#171310" }}
                  >
                    {String(item.value).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <span className="mt-8 block text-[8px] uppercase tracking-[0.3em] text-stone-500">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 border-y border-stone-900/10 py-10">
            <div className="flex flex-col justify-between gap-10 sm:flex-row sm:items-end">
              <div>
                <p className="text-[9px] uppercase tracking-[0.32em] text-stone-500">
                  Participación actual
                </p>

                <p
                  className="mt-4 font-serif text-7xl tracking-[-0.06em]"
                  style={{ color: "#191512" }}
                >
                  {OCCUPIED_VOICES}
                  <span className="ml-3 text-3xl text-stone-400">
                    / {TOTAL_VOICES}
                  </span>
                </p>
              </div>

              <div className="sm:text-right">
                <p className="text-[9px] uppercase tracking-[0.3em] text-stone-500">
                  Territorios presentes
                </p>

                <p
                  className="mt-4 font-serif text-2xl"
                  style={{ color: "#312923" }}
                >
                  Chile · México
                </p>
              </div>
            </div>

            <div className="mt-10 h-px bg-stone-900/10">
              <div
                className="h-px"
                style={{
                  width: `${progress}%`,
                  backgroundColor: "#9e783f",
                }}
              />
            </div>

            <div className="mt-5 flex flex-col justify-between gap-3 text-[8px] uppercase tracking-[0.26em] text-stone-500 sm:flex-row">
              <span>
                {OCCUPIED_VOICES} voces en incorporación
              </span>

              <span>
                {availableVoices} plazas disponibles
              </span>
            </div>
          </div>

          <blockquote className="mt-16 max-w-xl">
            <p
              className="font-serif text-3xl italic leading-[1.5] sm:text-4xl"
              style={{ color: "#4c433b" }}
            >
              “No buscamos reunir poemas. Buscamos
              construir una memoria que ninguna persona
              podría escribir sola.”
            </p>

            <footer className="mt-8 text-[9px] uppercase tracking-[0.32em] text-stone-400">
              Declaración fundacional
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}