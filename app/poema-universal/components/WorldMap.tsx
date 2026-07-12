"use client";

import { useState } from "react";

type Poeta = {
  nombre: string;
  ciudad?: string;
  pais: string;
};

type PaisPoetico = {
  id: string;
  nombre: string;
  codigo: string;
  x: number;
  y: number;
  poetas: Poeta[];
};

const paises: PaisPoetico[] = [
  {
    id: "espana",
    nombre: "España",
    codigo: "ES",
    x: 47.5,
    y: 37,
    poetas: [
      {
        nombre: "José Naveiro",
        ciudad: "Galicia",
        pais: "España",
      },
    ],
  },
  {
    id: "mexico",
    nombre: "México",
    codigo: "MX",
    x: 20.5,
    y: 46,
    poetas: [
      {
        nombre: "Poeta confirmado",
        pais: "México",
      },
      {
        nombre: "Poeta confirmado",
        pais: "México",
      },
    ],
  },
  {
    id: "chile",
    nombre: "Chile",
    codigo: "CL",
    x: 29.5,
    y: 75,
    poetas: [
      {
        nombre: "Poeta confirmado",
        pais: "Chile",
      },
    ],
  },
];

export default function WorldMap() {
  const [paisActivo, setPaisActivo] = useState<PaisPoetico>(paises[0]);

  const totalPoetas = paises.reduce(
    (total, pais) => total + pais.poetas.length,
    0
  );

  return (
    <section className="mx-auto mt-40 max-w-7xl">
      <header className="mx-auto max-w-4xl text-center">
        <p className="text-[10px] uppercase tracking-[0.58em] text-stone-400">
          Cartografía fundacional
        </p>

        <h2 className="mt-8 font-serif text-5xl font-semibold leading-[1.02] tracking-tight text-stone-950 sm:text-7xl">
          Un poema escrito
          <br />
          desde el mundo.
        </h2>

        <p className="mx-auto mt-8 max-w-2xl text-sm leading-8 text-stone-600 sm:text-base">
          Cada país señalado contiene las voces confirmadas que formarán parte
          del Poema Universal 2026.
        </p>
      </header>

      <div className="mt-16 overflow-hidden rounded-[48px] border border-stone-300 bg-[#e6d5b8] shadow-[0_35px_100px_rgba(70,48,29,0.18)]">
        <div className="grid lg:grid-cols-[1.55fr_0.65fr]">
          {/* MAPAMUNDI */}
          <div className="relative min-h-[500px] overflow-hidden border-b border-stone-300 bg-[#d9c8a8] lg:min-h-[680px] lg:border-b-0 lg:border-r">
            <img
              src="/mapamundi-escolar.jpg"
              alt="Mapamundi de los países participantes en Poema Universal"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-[#9b7440]/5" />

            {/* Marco del mapa */}
            <div className="pointer-events-none absolute inset-4 rounded-[20px] border border-[#6d4f2d]/35 shadow-inner" />

            {/* Chinchetas / países */}
            {paises.map((pais) => {
              const seleccionado = paisActivo.id === pais.id;

              return (
                <button
                  key={pais.id}
                  type="button"
                  onClick={() => setPaisActivo(pais)}
                  className="group absolute z-20 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${pais.x}%`,
                    top: `${pais.y}%`,
                  }}
                  aria-label={`Ver integrantes de ${pais.nombre}`}
                >
                  <span className="relative flex h-16 w-16 items-center justify-center">
                    <span
                      className={`absolute rounded-full transition-all duration-300 ${
                        seleccionado
                          ? "h-16 w-16 bg-red-900/20"
                          : "h-10 w-10 bg-red-900/10"
                      }`}
                    />

                    <span
                      className={`relative flex items-center justify-center rounded-full border-2 border-white font-serif text-sm text-white shadow-[0_6px_18px_rgba(0,0,0,0.35)] transition-all duration-300 ${
                        seleccionado
                          ? "h-10 w-10 scale-110 bg-red-900"
                          : "h-8 w-8 bg-red-800 group-hover:scale-110"
                      }`}
                    >
                      {pais.poetas.length}
                    </span>
                  </span>

                  <span
                    className={`absolute left-1/2 top-14 w-max -translate-x-1/2 rounded-full border px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.2em] shadow-lg transition ${
                      seleccionado
                        ? "border-red-900 bg-red-900 text-white"
                        : "border-stone-300 bg-[#fffaf2]/95 text-stone-700"
                    }`}
                  >
                    {pais.nombre}
                  </span>
                </button>
              );
            })}

            <div className="absolute bottom-6 left-6 rounded-full border border-stone-300 bg-[#fffaf2]/90 px-5 py-3 shadow-sm backdrop-blur">
              <p className="text-[9px] uppercase tracking-[0.28em] text-stone-500">
                Pulsa cada país para descubrir sus voces
              </p>
            </div>
          </div>

          {/* PANEL DE INTEGRANTES */}
          <aside className="bg-[#f5ead8] p-7 sm:p-10">
            <div className="border-b border-stone-300 pb-8">
              <p className="text-[10px] uppercase tracking-[0.36em] text-stone-400">
                País seleccionado
              </p>

              <div className="mt-5 flex items-start justify-between gap-5">
                <div>
                  <h3 className="font-serif text-4xl text-stone-950">
                    {paisActivo.nombre}
                  </h3>

                  <p className="mt-3 text-sm text-stone-600">
                    {paisActivo.poetas.length}{" "}
                    {paisActivo.poetas.length === 1 ? "voz" : "voces"} en la
                    edición fundacional.
                  </p>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-stone-400 bg-[#e7d3ae] font-serif text-sm text-stone-700">
                  {paisActivo.codigo}
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {paisActivo.poetas.map((poeta, index) => (
                <article
                  key={`${poeta.nombre}-${index}`}
                  className="rounded-[28px] border border-stone-300 bg-[#fffaf2]/85 p-5 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-950 font-serif text-sm text-white">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div>
                      <p className="text-[9px] uppercase tracking-[0.25em] text-stone-400">
                        Voz confirmada
                      </p>

                      <h4 className="mt-2 font-serif text-2xl text-stone-950">
                        {poeta.nombre}
                      </h4>

                      <p className="mt-2 text-sm text-stone-600">
                        {[poeta.ciudad, poeta.pais]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-10 rounded-[28px] border border-stone-300 bg-[#e9d8ba] p-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">
                Edición 2026
              </p>

              <p className="mt-4 font-serif text-5xl text-stone-950">
                {totalPoetas} / 60
              </p>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-stone-300">
                <div
                  className="h-full rounded-full bg-stone-950"
                  style={{
                    width: `${Math.min((totalPoetas / 60) * 100, 100)}%`,
                  }}
                />
              </div>

              <p className="mt-4 text-xs leading-6 text-stone-600">
                {60 - totalPoetas} lugares permanecen abiertos.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <article className="rounded-[28px] border border-stone-200 bg-white/65 p-7 shadow-sm">
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400">
            Poetas confirmados
          </p>

          <p className="mt-4 font-serif text-5xl">{totalPoetas}</p>
        </article>

        <article className="rounded-[28px] border border-stone-200 bg-white/65 p-7 shadow-sm">
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400">
            Países representados
          </p>

          <p className="mt-4 font-serif text-5xl">{paises.length}</p>
        </article>

        <article className="rounded-[28px] bg-stone-950 p-7 text-white shadow-sm">
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400">
            Lugares abiertos
          </p>

          <p className="mt-4 font-serif text-5xl">{60 - totalPoetas}</p>
        </article>
      </div>
    </section>
  );
}