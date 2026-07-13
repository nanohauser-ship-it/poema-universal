"use client";

import { useMemo, useState } from "react";
import AccionesArtista from "./AccionesArtista";

export type AtlasArtista = {
  id: string;
  nombre: string;
  disciplina: string;
  territorio: string | null;
  periodo: string | null;
  obra: string | null;
  obras_esenciales: string[];
  etiquetas: string[];
  portada_url: string | null;
  dedicatoria: string | null;
  destacado: boolean;
  corazones: number;
  velas: number;
};

function normalizar(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function AtlasInfluencias({
  artistas,
}: {
  artistas: AtlasArtista[];
}) {
  const [busqueda, setBusqueda] = useState("");
  const [disciplina, setDisciplina] = useState("Todos");

  const disciplinas = useMemo(() => {
    const valores = Array.from(
      new Set(
        artistas
          .map((artista) => artista.disciplina)
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b, "es"));

    return ["Todos", ...valores];
  }, [artistas]);

  const artistasFiltrados = useMemo(() => {
    const consulta = normalizar(busqueda.trim());

    return artistas
      .filter((artista) => {
        if (disciplina === "Todos") {
          return true;
        }

        return artista.disciplina === disciplina;
      })
      .filter((artista) => {
        if (!consulta) {
          return true;
        }

        const contenido = [
          artista.nombre,
          artista.disciplina,
          artista.territorio || "",
          artista.periodo || "",
          artista.obra || "",
          ...artista.obras_esenciales,
          ...artista.etiquetas,
        ]
          .map(normalizar)
          .join(" ");

        return contenido.includes(consulta);
      })
      .sort((a, b) => {
        if (a.destacado !== b.destacado) {
          return a.destacado ? -1 : 1;
        }

        return a.nombre.localeCompare(b.nombre, "es");
      });
  }, [artistas, busqueda, disciplina]);

  return (
    <section
      id="atlas"
      aria-labelledby="atlas-title"
      className="border-t border-stone-900/15"
    >
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="flex flex-col gap-8 border-b border-stone-900/15 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[8px] uppercase tracking-[0.42em] text-[#98703b]">
              Herramienta de exploración
            </p>

            <h2
              id="atlas-title"
              className="mt-6 font-serif text-5xl leading-none tracking-[-0.05em] sm:text-7xl"
            >
              Lista de artistas.
            </h2>

            <p className="mt-6 max-w-2xl text-sm leading-8 text-stone-600">
              Una biblioteca visual para descubrir nombres,
              disciplinas, obras y caminos capaces de influir
              en otros creadores.
            </p>
          </div>

          <div className="flex items-end gap-3">
            <strong className="font-serif text-5xl font-normal">
              {artistasFiltrados.length}
            </strong>

            <span className="pb-1 text-[8px] uppercase tracking-[0.28em] text-stone-400">
              artistas
            </span>
          </div>
        </div>

        {/* BUSCADOR */}

        <div className="mt-10 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <label
              htmlFor="buscar-artista"
              className="text-[8px] uppercase tracking-[0.34em] text-stone-400"
            >
              Buscar
            </label>

            <input
              id="buscar-artista"
              type="search"
              value={busqueda}
              onChange={(event) =>
                setBusqueda(event.target.value)
              }
              placeholder="Nombre, país, disciplina, obra o concepto..."
              className="mt-3 w-full border-b border-stone-900/25 bg-transparent py-4 font-serif text-xl outline-none placeholder:text-stone-400 sm:text-2xl"
            />
          </div>

          {(busqueda || disciplina !== "Todos") && (
            <button
              type="button"
              onClick={() => {
                setBusqueda("");
                setDisciplina("Todos");
              }}
              className="w-fit border-b border-stone-900/20 pb-2 text-[8px] uppercase tracking-[0.28em] text-stone-500 transition hover:border-stone-950 hover:text-stone-950"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* DISCIPLINAS */}

        <div className="mt-8 flex flex-wrap gap-2">
          {disciplinas.map((opcion) => {
            const activa = disciplina === opcion;

            return (
              <button
                key={opcion}
                type="button"
                onClick={() => setDisciplina(opcion)}
                className={`border px-4 py-2.5 text-[7px] uppercase tracking-[0.22em] transition ${
                  activa
                    ? "border-stone-950 bg-stone-950 text-[#f0e8dc]"
                    : "border-stone-900/15 text-stone-500 hover:border-stone-900/40 hover:text-stone-950"
                }`}
              >
                {opcion}
              </button>
            );
          })}
        </div>

        {/* RETÍCULA */}

        {artistasFiltrados.length === 0 ? (
          <div className="mt-14 border-y border-stone-900/15 py-24 text-center">
            <p className="font-serif text-3xl text-stone-500">
              No hay artistas que coincidan con la búsqueda.
            </p>
          </div>
        ) : (
          <ol className="mt-14 grid border-l border-t border-stone-900/15 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {artistasFiltrados.map((artista, index) => (
              <li
                key={artista.id}
                className="group flex flex-col border-b border-r border-stone-900/15 bg-[#f5eee4]"
              >
                {/* PORTADA */}

                <div className="relative aspect-[3/4] overflow-hidden bg-[#0b0e12]">
                  {artista.portada_url ? (
                    <img
                      src={artista.portada_url}
                      alt={`Portada de ${artista.nombre}`}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
                    />
                  ) : (
                    <div
                      className="flex h-full flex-col justify-between p-7 text-[#f0e8dc]"
                      style={{
                        background:
                          "radial-gradient(circle at 75% 20%, rgba(199,164,103,0.25), transparent 30%), linear-gradient(145deg, #0a0d11, #20242a)",
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-[7px] uppercase tracking-[0.3em] text-white/45">
                          Atlas de Influencias
                        </span>

                        <span className="font-serif text-sm text-[#c7a467]">
                          {String(index + 1).padStart(3, "0")}
                        </span>
                      </div>

                      <div>
                        <span
                          aria-hidden="true"
                          className="mb-8 block h-12 w-px bg-[#c7a467]/70"
                        />

                        <p className="text-[8px] uppercase tracking-[0.32em] text-[#c7a467]">
                          {artista.disciplina}
                        </p>

                        <h3 className="mt-5 font-serif text-4xl leading-[0.96] tracking-[-0.04em]">
                          {artista.nombre}
                        </h3>
                      </div>

                      <p className="text-[7px] uppercase tracking-[0.28em] text-white/35">
                        Poema Universal
                      </p>
                    </div>
                  )}

                  {artista.destacado && (
                    <span className="absolute right-4 top-4 border border-white/30 bg-black/25 px-3 py-1.5 text-[7px] uppercase tracking-[0.22em] text-white backdrop-blur">
                      Fundamental
                    </span>
                  )}
                </div>

                {/* INFORMACIÓN */}

                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[7px] uppercase tracking-[0.27em] text-[#98703b]">
                    {artista.disciplina}
                  </p>

                  <h3 className="mt-4 font-serif text-3xl leading-none tracking-[-0.035em]">
                    {artista.nombre}
                  </h3>

                  {(artista.territorio || artista.periodo) && (
                    <p className="mt-4 text-xs italic leading-6 text-stone-500">
                      {[artista.territorio, artista.periodo]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}

                  {(artista.obra ||
                    artista.obras_esenciales.length > 0) && (
                    <div className="mt-7 border-t border-stone-900/12 pt-5">
                      <p className="text-[7px] uppercase tracking-[0.24em] text-stone-400">
                        Obras esenciales
                      </p>

                      <ul className="mt-3 space-y-2 font-serif text-base italic leading-6 text-stone-650">
                        {[
                          artista.obra,
                          ...artista.obras_esenciales,
                        ]
                          .filter(
                            (obra, posicion, lista) =>
                              Boolean(obra) &&
                              lista.indexOf(obra) === posicion
                          )
                          .slice(0, 4)
                          .map((obra) => (
                            <li key={obra}>— {obra}</li>
                          ))}
                      </ul>
                    </div>
                  )}

                  {artista.etiquetas.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {artista.etiquetas
                        .slice(0, 6)
                        .map((etiqueta) => (
                          <span
                            key={etiqueta}
                            className="border border-stone-900/12 px-3 py-2 text-[7px] uppercase tracking-[0.18em] text-stone-500"
                          >
                            {etiqueta}
                          </span>
                        ))}
                    </div>
                  )}

                  {/* SANTUARIO */}

                  <div className="mt-auto pt-8">
                    <div className="border-t border-stone-900/15 pt-5">
                      <p className="text-[7px] uppercase tracking-[0.25em] text-[#98703b]">
                        Dedicatoria
                      </p>

                      <p className="mt-3 font-serif text-sm italic leading-6 text-stone-500">
                        {artista.dedicatoria ||
                          "Para quien abrió un camino y permitió que otros pudieran atravesarlo."}
                      </p>
                    </div>

                    <AccionesArtista
                      artistaId={artista.id}
                      corazonesIniciales={
                        artista.corazones
                      }
                      velasIniciales={artista.velas}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
