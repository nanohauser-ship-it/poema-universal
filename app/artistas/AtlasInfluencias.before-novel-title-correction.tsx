"use client";

import { useMemo, useState } from "react";
import AccionesArtista from "./AccionesArtista";

export type AtlasArtista = {
  id: string;
  nombre: string;
  categoria: string;
  obra: string | null;
  territorio: string | null;
  descripcion: string;
  foto_url: string | null;
  destacado: boolean;
  instagram_url: string | null;
  web_url: string | null;
  created_at: string;
  corazones: number;
  velas: number;
  relacion_obras: string[];
  tipo_relacion: string | null;
  legado: string | null;
  obras_esenciales: string[];
};

const disciplineOptions = [
  "Todos",
  "Literatura",
  "Cine",
  "Música",
  "Artes visuales",
  "Fotografía humana",
  "Pensamiento",
  "Cocina",
  "Danza",
  "Otros",
];

const novelOptions = [
  "Todas las obras",
  "El Árbol Blanco",
  "La Jerarquía del Hambre",
  "Memorias de Bielka",
  "Tríptico completo",
];

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getDiscipline(category: string) {
  const value = normalize(category);

  if (
    value.includes("literatura") ||
    value.includes("poesia") ||
    value.includes("escrit")
  ) {
    return "Literatura";
  }

  if (value.includes("cine")) {
    return "Cine";
  }

  if (value.includes("musica") || value.includes("sonido")) {
    return "Música";
  }

  if (
    value.includes("fotografia") ||
    value.includes("archivo humano") ||
    value.includes("documental")
  ) {
    return "Fotografía humana";
  }

  if (
    value.includes("pintura") ||
    value.includes("arte") ||
    value.includes("escultura")
  ) {
    return "Artes visuales";
  }

  if (
    value.includes("pensamiento") ||
    value.includes("filosofia")
  ) {
    return "Pensamiento";
  }

  if (value.includes("cocina")) {
    return "Cocina";
  }

  if (
    value.includes("danza") ||
    value.includes("cuerpo")
  ) {
    return "Danza";
  }

  return "Otros";
}

function relationDisplay(value: string | null) {
  if (!value) {
    return "Archivo de influencia";
  }

  const normalized = normalize(value);

  if (normalized.includes("documentada")) {
    return "Influencia documentada";
  }

  if (normalized.includes("declarada")) {
    return "Influencia declarada";
  }

  if (normalized.includes("curatorial")) {
    return "Resonancia curatorial";
  }

  if (normalized.includes("critica")) {
    return "Referencia crítica";
  }

  return value;
}

export default function AtlasInfluencias({
  artistas,
}: {
  artistas: AtlasArtista[];
}) {
  const [query, setQuery] = useState("");
  const [discipline, setDiscipline] = useState("Todos");
  const [novel, setNovel] = useState("Todas las obras");

  const filteredArtists = useMemo(() => {
    const normalizedQuery = normalize(query.trim());

    return artistas
      .filter((artista) => {
        if (discipline === "Todos") {
          return true;
        }

        return getDiscipline(artista.categoria) === discipline;
      })
      .filter((artista) => {
        if (novel === "Todas las obras") {
          return true;
        }

        return artista.relacion_obras.some(
          (obra) => normalize(obra) === normalize(novel)
        );
      })
      .filter((artista) => {
        if (!normalizedQuery) {
          return true;
        }

        const searchable = [
          artista.nombre,
          artista.categoria,
          artista.territorio || "",
          artista.descripcion,
          artista.legado || "",
          artista.obra || "",
          artista.tipo_relacion || "",
          ...artista.obras_esenciales,
          ...artista.relacion_obras,
        ]
          .map(normalize)
          .join(" ");

        return searchable.includes(normalizedQuery);
      })
      .sort((a, b) => {
        if (a.destacado !== b.destacado) {
          return a.destacado ? -1 : 1;
        }

        return a.nombre.localeCompare(b.nombre, "es");
      });
  }, [artistas, discipline, novel, query]);

  const disciplinesRepresented = useMemo(
    () =>
      new Set(
        artistas.map((artista) =>
          getDiscipline(artista.categoria)
        )
      ).size,
    [artistas]
  );

  const territoriesRepresented = useMemo(
    () =>
      new Set(
        artistas
          .map((artista) => artista.territorio)
          .filter(Boolean)
      ).size,
    [artistas]
  );

  return (
    <section
      id="atlas"
      aria-labelledby="atlas-title"
      className="border-t border-stone-900/15"
    >
      <div className="mx-auto max-w-[1380px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
        <div className="grid gap-12 border-b border-stone-900/15 pb-14 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[9px] uppercase tracking-[0.46em] text-[#9a743e]">
              Archivo vivo
            </p>

            <h2
              id="atlas-title"
              className="mt-8 max-w-5xl font-serif text-5xl leading-[0.98] tracking-[-0.05em] sm:text-7xl lg:text-[88px]"
            >
              Atlas de
              <span className="block italic text-stone-500">
                Influencias.
              </span>
            </h2>

            <p className="mt-9 max-w-3xl text-sm leading-8 text-stone-600 sm:text-base">
              Una genealogía navegable de escritores,
              cineastas, músicos, fotógrafos, artistas y
              pensadores que atraviesan las tres obras y el
              universo de Poema Universal.
            </p>
          </div>

          <div className="grid grid-cols-3 border-l border-t border-stone-900/15">
            <div className="min-w-[105px] border-b border-r border-stone-900/15 p-5">
              <strong className="font-serif text-3xl font-normal">
                {artistas.length}
              </strong>

              <span className="mt-2 block text-[7px] uppercase tracking-[0.24em] text-stone-400">
                Presencias
              </span>
            </div>

            <div className="min-w-[105px] border-b border-r border-stone-900/15 p-5">
              <strong className="font-serif text-3xl font-normal">
                {disciplinesRepresented}
              </strong>

              <span className="mt-2 block text-[7px] uppercase tracking-[0.24em] text-stone-400">
                Disciplinas
              </span>
            </div>

            <div className="min-w-[105px] border-b border-r border-stone-900/15 p-5">
              <strong className="font-serif text-3xl font-normal">
                {territoriesRepresented}
              </strong>

              <span className="mt-2 block text-[7px] uppercase tracking-[0.24em] text-stone-400">
                Territorios
              </span>
            </div>
          </div>
        </div>

        {/* BUSCADOR */}

        <div className="mt-12 border border-stone-900/15 bg-white/42 p-5 sm:p-7">
          <label
            htmlFor="atlas-search"
            className="text-[8px] uppercase tracking-[0.34em] text-stone-500"
          >
            Buscar en el Atlas
          </label>

          <div className="mt-5 flex items-center border-b border-stone-900/25">
            <input
              id="atlas-search"
              type="search"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Nombre, país, disciplina, obra o idea..."
              className="w-full bg-transparent py-4 font-serif text-xl text-stone-900 outline-none placeholder:text-stone-400 sm:text-2xl"
            />

            <span
              aria-hidden="true"
              className="ml-4 text-xl text-[#9a743e]"
            >
              ⌕
            </span>
          </div>
        </div>

        {/* FILTROS DE DISCIPLINA */}

        <div className="mt-8">
          <p className="text-[8px] uppercase tracking-[0.34em] text-stone-400">
            Disciplina
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {disciplineOptions.map((option) => {
              const active = discipline === option;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setDiscipline(option)}
                  className="border px-4 py-2.5 text-[7px] uppercase tracking-[0.22em] transition"
                  style={{
                    borderColor: active
                      ? "#171411"
                      : "rgba(23,20,17,0.16)",
                    backgroundColor: active
                      ? "#171411"
                      : "transparent",
                    color: active
                      ? "#f0e8dc"
                      : "rgba(23,20,17,0.62)",
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* FILTROS DE OBRA */}

        <div className="mt-7">
          <p className="text-[8px] uppercase tracking-[0.34em] text-stone-400">
            Relación con las obras
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {novelOptions.map((option) => {
              const active = novel === option;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setNovel(option)}
                  className="border px-4 py-2.5 text-[7px] uppercase tracking-[0.22em] transition"
                  style={{
                    borderColor: active
                      ? "#9a743e"
                      : "rgba(23,20,17,0.16)",
                    backgroundColor: active
                      ? "rgba(154,116,62,0.1)"
                      : "transparent",
                    color: active
                      ? "#795827"
                      : "rgba(23,20,17,0.58)",
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* RESULTADOS */}

        <div className="mt-14 flex items-center justify-between border-b border-stone-900/15 pb-5">
          <p className="text-[8px] uppercase tracking-[0.32em] text-stone-500">
            {filteredArtists.length} resultados
          </p>

          {(query ||
            discipline !== "Todos" ||
            novel !== "Todas las obras") && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setDiscipline("Todos");
                setNovel("Todas las obras");
              }}
              className="text-[8px] uppercase tracking-[0.28em] text-[#8b6737] transition hover:text-stone-950"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {filteredArtists.length === 0 ? (
          <div className="border-b border-stone-900/15 py-24 text-center">
            <p className="font-serif text-3xl text-stone-500">
              Ninguna presencia coincide con esta búsqueda.
            </p>

            <p className="mt-5 text-sm text-stone-400">
              El Atlas continuará creciendo.
            </p>
          </div>
        ) : (
          <ol className="grid border-l border-t border-stone-900/15 md:grid-cols-2 xl:grid-cols-3">
            {filteredArtists.map((artista, index) => (
              <li
                key={artista.id}
                className="group flex flex-col border-b border-r border-stone-900/15 bg-[#f8f2e9]/46"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
                  {artista.foto_url ? (
                    <img
                      src={artista.foto_url}
                      alt={artista.nombre}
                      className="h-full w-full object-cover grayscale-[18%] transition duration-700 group-hover:scale-[1.025] group-hover:grayscale-0"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(145deg, #d8cec1, #9f9487)",
                      }}
                    >
                      <span className="font-serif text-6xl italic text-white/65">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                    <div className="mb-4 flex flex-wrap gap-2">
                      <span className="border border-white/28 bg-black/18 px-3 py-1 text-[7px] uppercase tracking-[0.24em] text-white/80 backdrop-blur">
                        {getDiscipline(artista.categoria)}
                      </span>

                      {artista.territorio && (
                        <span className="border border-white/28 bg-black/18 px-3 py-1 text-[7px] uppercase tracking-[0.24em] text-white/72 backdrop-blur">
                          {artista.territorio}
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-4xl leading-none tracking-[-0.04em] text-white">
                      {artista.nombre}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-6">
                    <p className="text-[7px] uppercase tracking-[0.25em] text-[#9a743e]">
                      {relationDisplay(
                        artista.tipo_relacion
                      )}
                    </p>

                    {artista.destacado && (
                      <span className="text-[7px] uppercase tracking-[0.24em] text-stone-400">
                        Núcleo
                      </span>
                    )}
                  </div>

                  {artista.obra && (
                    <div className="mt-7 border-l border-[#9a743e]/35 pl-4">
                      <p className="text-[7px] uppercase tracking-[0.25em] text-stone-400">
                        Obra esencial
                      </p>

                      <p className="mt-2 font-serif text-lg italic leading-7 text-stone-700">
                        {artista.obra}
                      </p>
                    </div>
                  )}

                  <p className="mt-7 text-sm leading-7 text-stone-600">
                    {artista.legado ||
                      artista.descripcion ||
                      "Su relación con este universo será documentada próximamente."}
                  </p>

                  {artista.relacion_obras.length > 0 ? (
                    <div className="mt-7 flex flex-wrap gap-2">
                      {artista.relacion_obras.map((obra) => (
                        <span
                          key={obra}
                          className="border border-stone-900/15 px-3 py-2 text-[7px] uppercase tracking-[0.2em] text-stone-500"
                        >
                          {obra}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-7 text-[7px] uppercase tracking-[0.23em] text-stone-400">
                      Relación con las obras por documentar
                    </p>
                  )}

                  <div className="mt-8 flex flex-wrap gap-3">
                    {artista.instagram_url && (
                      <a
                        href={artista.instagram_url}
                        target="_blank"
                        rel="noreferrer"
                        className="border border-stone-900/15 px-4 py-2 text-[7px] uppercase tracking-[0.22em] text-stone-500 transition hover:border-stone-950 hover:text-stone-950"
                      >
                        Instagram
                      </a>
                    )}

                    {artista.web_url && (
                      <a
                        href={artista.web_url}
                        target="_blank"
                        rel="noreferrer"
                        className="border border-stone-900/15 px-4 py-2 text-[7px] uppercase tracking-[0.22em] text-stone-500 transition hover:border-stone-950 hover:text-stone-950"
                      >
                        Archivo externo
                      </a>
                    )}
                  </div>

                  {/* SANTUARIO INDIVIDUAL */}

                  <div className="mt-auto pt-9">
                    <div className="border-t border-stone-900/15 pt-6">
                      <p className="text-[7px] uppercase tracking-[0.28em] text-[#9a743e]">
                        Dedicatoria
                      </p>

                      <p className="mt-3 font-serif text-base italic leading-7 text-stone-500">
                        Para quien ayudó a mirar el mundo de
                        otra manera.
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
