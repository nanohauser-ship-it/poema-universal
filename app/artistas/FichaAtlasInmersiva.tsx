"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import type { AtlasArtista } from "./AtlasInfluencias";
import type { FichaCuratorial } from "./fichas-curatoriales";

type Seccion =
  | "pregunta"
  | "huellas"
  | "obras"
  | "triptico"
  | "constelacion";

type FichaAtlasInmersivaProps = {
  artista: AtlasArtista;
  ficha: FichaCuratorial;
  portadaUrl: string | null;
  onClose: () => void;
  onSelectArtista?: (nombre: string) => void;
};

const SECCIONES: Array<{
  id: Seccion;
  numero: string;
  titulo: string;
}> = [
  {
    id: "pregunta",
    numero: "01",
    titulo: "La pregunta central",
  },
  {
    id: "huellas",
    numero: "02",
    titulo: "Huellas de su conciencia",
  },
  {
    id: "obras",
    numero: "03",
    titulo: "Obras esenciales",
  },
  {
    id: "triptico",
    numero: "04",
    titulo: "Diálogo con el tríptico",
  },
  {
    id: "constelacion",
    numero: "05",
    titulo: "Constelación de influencias",
  },
];

function resumenDeSeccion(
  seccion: Seccion,
  ficha: FichaCuratorial
) {
  if (seccion === "pregunta") {
    return ficha.pregunta;
  }

  if (seccion === "huellas") {
    return ficha.huellas
      .map((huella) => huella.titulo)
      .join(" · ");
  }

  if (seccion === "obras") {
    return ficha.obras
      .slice(0, 4)
      .map((obra) => obra.titulo)
      .join(" · ");
  }

  if (seccion === "triptico") {
    return ficha.triptico
      .map((conexion) => conexion.obra)
      .join(" · ");
  }

  return ficha.constelacion.join(" · ");
}

function reliquiaDe(
  nombre: string,
  disciplina: string
) {
  const reliquiasEspeciales: Record<
    string,
    { simbolo: string; nombre: string }
  > = {
    "Albert Camus": {
      simbolo: "◉",
      nombre: "Piedra blanca de Argelia",
    },
    "Jorge Luis Borges": {
      simbolo: "◎",
      nombre: "Espejo circular",
    },
    "Franz Kafka": {
      simbolo: "⌑",
      nombre: "Llave sin cerradura",
    },
    "Simone Weil": {
      simbolo: "◇",
      nombre: "Fragmento de pan",
    },
    "Samuel Beckett": {
      simbolo: "□",
      nombre: "Silla vacía",
    },
    "Andrei Tarkovski": {
      simbolo: "≈",
      nombre: "Cuenco de agua",
    },
    "Mark Rothko": {
      simbolo: "▭",
      nombre: "Campo de color",
    },
    "Pina Bausch": {
      simbolo: "⌁",
      nombre: "Gesto suspendido",
    },
  };

  if (reliquiasEspeciales[nombre]) {
    return reliquiasEspeciales[nombre];
  }

  const campo = disciplina.toLowerCase();

  if (
    campo.includes("música") ||
    campo.includes("musica")
  ) {
    return {
      simbolo: "◌",
      nombre: "Campana de resonancia",
    };
  }

  if (
    campo.includes("cine") ||
    campo.includes("video")
  ) {
    return {
      simbolo: "▱",
      nombre: "Fotograma de sombra",
    };
  }

  if (
    campo.includes("arquitectura") ||
    campo.includes("espacio")
  ) {
    return {
      simbolo: "∩",
      nombre: "Umbral de materia",
    };
  }

  if (
    campo.includes("pintura") ||
    campo.includes("escultura") ||
    campo.includes("arte")
  ) {
    return {
      simbolo: "◆",
      nombre: "Fragmento de materia",
    };
  }

  return {
    simbolo: "✦",
    nombre: "Página de vigilia",
  };
}

export default function FichaAtlasInmersiva({
  artista,
  ficha,
  portadaUrl,
  onClose,
  onSelectArtista,
}: FichaAtlasInmersivaProps) {
  const [seccionActiva, setSeccionActiva] =
    useState<Seccion>("pregunta");

  const reliquia = reliquiaDe(
    artista.nombre,
    artista.disciplina
  );

  const nodos = useMemo(() => {
    const nombres = ficha.constelacion.slice(0, 8);
    const total = Math.max(nombres.length, 1);

    return nombres.map((nombre, index) => {
      const angulo =
        -Math.PI / 2 + (index / total) * Math.PI * 2;

      return {
        nombre,
        x: 50 + Math.cos(angulo) * 34,
        y: 50 + Math.sin(angulo) * 34,
      };
    });
  }, [ficha.constelacion]);

  useEffect(() => {
    const overflowAnterior =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function cerrarConEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", cerrarConEscape);

    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener(
        "keydown",
        cerrarConEscape
      );
    };
  }, [onClose]);

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Archivo curatorial de ${artista.nombre}`}
      className="fixed inset-0 isolate z-[99999] min-h-[100dvh] overflow-y-auto overscroll-contain bg-[#030403] text-[#e7dcc7]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 70% 18%, rgba(180,132,65,0.09), transparent 27%), radial-gradient(circle at 18% 80%, rgba(80,60,34,0.08), transparent 31%), linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.009) 1px, transparent 1px)",
          backgroundSize:
            "auto, auto, 48px 48px, 48px 48px",
        }}
      />

      <header className="sticky top-0 z-30 border-b border-[#b88a47]/20 bg-[#030403]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-[1800px] items-center justify-between px-5 sm:px-8">
          <div>
            <p className="font-serif text-lg uppercase tracking-[0.16em] text-[#e8dcc4]">
              Poema Universal
            </p>

            <p className="mt-1 text-[7px] uppercase tracking-[0.35em] text-[#b88a47]">
              Atlas · Artistas fundamentales
            </p>
          </div>

          <nav className="hidden items-center gap-9 text-[8px] uppercase tracking-[0.24em] text-white/42 lg:flex">
            <span className="border-b border-[#c49755] pb-2 text-[#d5b27b]">
              Atlas
            </span>
            <span>Constelación</span>
            <span>Biblioteca invisible</span>
            <span>Voces afines</span>
          </nav>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar la sala"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#b88a47]/35 font-serif text-xl text-[#d3aa6c] transition hover:border-[#d3aa6c] hover:bg-[#d3aa6c]/10"
          >
            ×
          </button>
        </div>
      </header>

      <div className="relative mx-auto grid max-w-[1800px] xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden border-r border-[#b88a47]/18 px-7 py-10 xl:block">
          <p className="font-serif text-2xl uppercase leading-9 tracking-[0.18em] text-[#d8bd91]">
            Artistas
            <br />
            fundamentales
          </p>

          <div className="mt-5 h-px w-10 bg-[#b88a47]" />

          <p className="mt-5 text-xs leading-6 text-[#c0ad8e]/62">
            Un atlas de cien conciencias que
            transformaron la cultura para siempre.
            No es una enciclopedia. Es un mapa vivo
            de pensamiento, creación e influencia.
          </p>

          <div className="mt-9 border-t border-[#b88a47]/20 pt-7">
            <p className="text-[8px] uppercase tracking-[0.28em] text-[#c49755]">
              Principios de la sala
            </p>

            <div className="mt-6 space-y-6">
              {[
                [
                  "✺",
                  "Belleza atemporal",
                  "Oscuridad, materia, archivo y luz.",
                ],
                [
                  "▤",
                  "Revelación progresiva",
                  "La información aparece por capas.",
                ],
                [
                  "⌘",
                  "Conexión significativa",
                  "Cada artista conversa con otros.",
                ],
                [
                  "◇",
                  "Navegación intuitiva",
                  "Recorrer el Atlas debe sentirse como viajar.",
                ],
                [
                  "▣",
                  "Profundidad y silencio",
                  "Espacio suficiente para una lectura lenta.",
                ],
              ].map(([icono, titulo, texto]) => (
                <div
                  key={titulo}
                  className="grid grid-cols-[34px_1fr] gap-3"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#b88a47]/40 text-[#c99d60]">
                    {icono}
                  </span>

                  <div>
                    <p className="font-serif text-sm text-[#ddc39c]">
                      {titulo}
                    </p>
                    <p className="mt-1 text-[10px] leading-5 text-white/32">
                      {texto}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 border border-[#b88a47]/25 bg-[#0a0907] p-5">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-t-full border border-[#c49755]/65 text-2xl text-[#d4a867]">
              ✦
            </div>

            <p className="mt-5 text-center font-serif text-base uppercase tracking-[0.12em] text-[#d6bb8e]">
              La Biblioteca Invisible
            </p>

            <p className="mt-3 text-center text-[10px] leading-5 text-white/38">
              Buscar por preguntas humanas, no por
              nombres propios.
            </p>

            <div className="mt-5 border border-[#c49755]/35 bg-[#c49755]/10 px-4 py-3 text-center text-[8px] uppercase tracking-[0.25em] text-[#d7b378]">
              Próxima sala
            </div>
          </div>
        </aside>

        <main className="min-w-0 p-4 sm:p-7">
          <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.08fr)_minmax(430px,0.92fr)]">
            <section className="overflow-hidden rounded-[2px] border border-[#b88a47]/28 bg-[#080807]">
              <div className="relative grid gap-6 border-b border-[#b88a47]/18 p-5 lg:grid-cols-[minmax(0,1fr)_210px] lg:p-8">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 80% 18%, rgba(196,151,85,0.11), transparent 26%)",
                  }}
                />

                <div className="relative">
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-[7px] uppercase tracking-[0.28em] text-[#c49755] transition hover:text-[#eed3a8]"
                  >
                    ← Volver al Atlas
                  </button>

                  <p className="mt-8 text-sm tracking-[0.16em] text-[#b88a47]">
                    {artista.codigo || "Atlas"}
                  </p>

                  <h2 className="mt-2 break-words font-serif text-4xl leading-none tracking-[-0.04em] text-[#ede2cf] sm:text-6xl">
                    {artista.nombre}
                  </h2>

                  <p className="mt-4 text-xs italic text-[#c9b38e]/65">
                    {[
                      artista.territorio,
                      artista.periodo,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>

                  <p className="mt-2 text-[8px] uppercase tracking-[0.22em] text-[#c49755]">
                    {artista.disciplina}
                  </p>

                  <p className="mt-7 max-w-2xl font-serif text-xl italic leading-8 text-[#d8b478]">
                    «{ficha.pregunta}»
                  </p>
                </div>

                <div className="relative">
                  {portadaUrl ? (
                    <div className="overflow-hidden border border-[#b88a47]/24 bg-black">
                      <img
                        src={portadaUrl}
                        alt={`Portada de ${artista.nombre}`}
                        className="aspect-[4/5] h-full w-full object-cover object-top opacity-90"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[4/5] items-center justify-center border border-[#b88a47]/24 bg-black font-serif italic text-white/30">
                      Presencia
                    </div>
                  )}

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="border border-[#b88a47]/20 p-3">
                      <p className="text-[6px] uppercase tracking-[0.22em] text-white/30">
                        Tríptico
                      </p>
                      <p className="mt-1 font-serif text-xl text-[#d4ad70]">
                        3 mundos
                      </p>
                    </div>

                    <div className="border border-[#b88a47]/20 p-3">
                      <p className="text-[6px] uppercase tracking-[0.22em] text-white/30">
                        Afinidades
                      </p>
                      <p className="mt-1 font-serif text-xl text-[#d4ad70]">
                        {ficha.constelacion.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="border border-[#b88a47]/20">
                  {SECCIONES.map((seccion, index) => {
                    const abierta =
                      seccionActiva === seccion.id;

                    return (
                      <div
                        key={seccion.id}
                        className={
                          index > 0
                            ? "border-t border-[#b88a47]/18"
                            : ""
                        }
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setSeccionActiva(seccion.id)
                          }
                          className="grid w-full grid-cols-[34px_1fr_26px] items-center gap-3 px-4 py-4 text-left transition hover:bg-[#c49755]/[0.035] sm:px-5"
                        >
                          <span className="font-serif text-sm text-[#c49755]">
                            {seccion.numero}
                          </span>

                          <span>
                            <span className="block text-[8px] uppercase tracking-[0.25em] text-[#d5b47d]">
                              {seccion.titulo}
                            </span>

                            <span className="mt-2 block truncate text-[10px] text-white/37">
                              {resumenDeSeccion(
                                seccion.id,
                                ficha
                              )}
                            </span>
                          </span>

                          <span
                            className={`font-serif text-xl text-[#c49755] transition-transform ${
                              abierta ? "rotate-45" : ""
                            }`}
                          >
                            +
                          </span>
                        </button>

                        {abierta && (
                          <div className="border-t border-[#b88a47]/12 bg-black/20 px-5 py-6 sm:px-12">
                            {seccion.id === "pregunta" && (
                              <div>
                                <p className="font-serif text-2xl leading-9 text-[#e6d7bd]">
                                  {ficha.pregunta}
                                </p>

                                <p className="mt-5 max-w-3xl text-xs leading-7 text-white/45">
                                  {ficha.introduccion}
                                </p>
                              </div>
                            )}

                            {seccion.id === "huellas" && (
                              <div className="grid gap-4 lg:grid-cols-3">
                                {ficha.huellas.map(
                                  (huella, huellaIndex) => (
                                    <article
                                      key={huella.titulo}
                                      className="border border-[#b88a47]/18 p-5"
                                    >
                                      <p className="text-[7px] uppercase tracking-[0.23em] text-[#c49755]">
                                        {String(
                                          huellaIndex + 1
                                        ).padStart(2, "0")}{" "}
                                        · {huella.titulo}
                                      </p>

                                      <p className="mt-4 font-serif text-lg leading-7 text-white/58">
                                        {huella.texto}
                                      </p>
                                    </article>
                                  )
                                )}
                              </div>
                            )}

                            {seccion.id === "obras" && (
                              <div className="space-y-5">
                                {ficha.obras.map(
                                  (obra, obraIndex) => (
                                    <article
                                      key={obra.titulo}
                                      className="grid gap-3 border-b border-[#b88a47]/14 pb-5 sm:grid-cols-[28px_180px_1fr]"
                                    >
                                      <span className="font-serif text-[#c49755]">
                                        {String(
                                          obraIndex + 1
                                        ).padStart(2, "0")}
                                      </span>

                                      <h3 className="font-serif text-lg italic text-[#e4d2b4]">
                                        {obra.titulo}
                                      </h3>

                                      <p className="text-xs leading-6 text-white/38">
                                        {obra.razon}
                                      </p>
                                    </article>
                                  )
                                )}
                              </div>
                            )}

                            {seccion.id === "triptico" && (
                              <div className="grid gap-4 lg:grid-cols-3">
                                {ficha.triptico.map(
                                  (conexion, conexionIndex) => (
                                    <article
                                      key={conexion.obra}
                                      className="min-w-0 border border-[#b88a47]/18 bg-[#0c0b09] p-5"
                                    >
                                      <p className="text-[7px] uppercase tracking-[0.22em] text-[#c49755]">
                                        Mundo {conexionIndex + 1}
                                      </p>

                                      <h3 className="mt-4 break-words font-serif text-xl leading-7 text-[#e5d5b9]">
                                        {conexion.obra}
                                      </h3>

                                      <p className="mt-4 text-xs leading-6 text-white/40">
                                        {conexion.relacion}
                                      </p>
                                    </article>
                                  )
                                )}
                              </div>
                            )}

                            {seccion.id ===
                              "constelacion" && (
                              <div>
                                <p className="font-serif text-xl italic text-white/54">
                                  Conciencias que comparten una
                                  pregunta, una herida o una forma
                                  de mirar.
                                </p>

                                <div className="mt-5 flex flex-wrap gap-2">
                                  {ficha.constelacion.map(
                                    (nombre) => (
                                      <button
                                        type="button"
                                        key={nombre}
                                        onClick={() =>
                                          onSelectArtista?.(
                                            nombre
                                          )
                                        }
                                        className="border border-[#b88a47]/24 px-4 py-3 text-[7px] uppercase tracking-[0.22em] text-[#d0b17c] transition hover:border-[#d0b17c] hover:bg-[#d0b17c]/10"
                                      >
                                        {nombre}
                                      </button>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-[1fr_200px]">
                  <blockquote className="border-l border-[#c49755] py-3 pl-5 font-serif text-lg italic leading-8 text-white/46">
                    “
                    {artista.dedicatoria ||
                      ficha.introduccion}
                    ”
                  </blockquote>

                  <div className="border border-[#b88a47]/20 bg-[#0b0a08] p-5 text-center">
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#c49755]/45 font-serif text-2xl text-[#d1a565]">
                      {reliquia.simbolo}
                    </span>

                    <p className="mt-4 text-[7px] uppercase tracking-[0.23em] text-[#c49755]">
                      Reliquia
                    </p>

                    <p className="mt-2 font-serif text-sm italic text-white/52">
                      {reliquia.nombre}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid content-start gap-4">
              <section className="overflow-hidden border border-[#b88a47]/28 bg-[#080807] p-5 sm:p-7">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="font-serif text-xl uppercase tracking-[0.08em] text-[#d9ba88]">
                      Mapa de influencias
                    </p>

                    <p className="mt-2 text-[9px] tracking-[0.12em] text-white/32">
                      Constelación de conciencias
                    </p>
                  </div>

                  <span className="text-[7px] uppercase tracking-[0.22em] text-[#c49755]">
                    {ficha.constelacion.length} vínculos
                  </span>
                </div>

                <div className="relative mx-auto mt-5 aspect-square max-w-[650px] overflow-hidden">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at center, rgba(203,155,84,0.15), transparent 12%), radial-gradient(circle, rgba(203,155,84,0.7) 0 1px, transparent 1.7px)",
                      backgroundSize:
                        "auto, 31px 31px",
                    }}
                  />

                  <svg
                    aria-hidden="true"
                    viewBox="0 0 100 100"
                    className="absolute inset-0 h-full w-full"
                  >
                    {nodos.map((nodo) => (
                      <line
                        key={nodo.nombre}
                        x1="50"
                        y1="50"
                        x2={nodo.x}
                        y2={nodo.y}
                        stroke="rgba(205,159,91,0.55)"
                        strokeWidth="0.22"
                      />
                    ))}

                    {nodos.map((nodo) => (
                      <circle
                        key={`luz-${nodo.nombre}`}
                        cx={nodo.x}
                        cy={nodo.y}
                        r="0.7"
                        fill="rgba(247,211,151,0.95)"
                      />
                    ))}
                  </svg>

                  <div
                    className="absolute z-10 flex h-28 w-28 items-center justify-center rounded-full border border-[#d0a45f]/70 bg-[#080706]/95 text-center shadow-[0_0_35px_rgba(208,164,95,0.25)]"
                    style={{
                      left: "50%",
                      top: "50%",
                      transform:
                        "translate(-50%, -50%)",
                    }}
                  >
                    <span className="px-3 font-serif text-lg uppercase leading-6 text-[#e2c69a]">
                      {artista.nombre}
                    </span>
                  </div>

                  {nodos.map((nodo) => (
                    <button
                      type="button"
                      key={nodo.nombre}
                      onClick={() =>
                        onSelectArtista?.(nodo.nombre)
                      }
                      className="absolute z-20 w-28 -translate-x-1/2 -translate-y-1/2 text-center font-serif text-[10px] uppercase leading-4 tracking-[0.08em] text-[#d6b77f] transition hover:scale-110 hover:text-[#f3d8a8]"
                      style={{
                        left: `${nodo.x}%`,
                        top: `${nodo.y}%`,
                      }}
                    >
                      {nodo.nombre}
                    </button>
                  ))}
                </div>

                <p className="mt-2 text-center font-serif text-[10px] italic text-white/27">
                  Cada línea representa una afinidad de
                  ideas, preguntas o búsquedas.
                </p>
              </section>

              <section className="border border-[#b88a47]/28 bg-[#080807] p-5 sm:p-7">
                <p className="font-serif text-lg uppercase tracking-[0.1em] text-[#d9ba88]">
                  Voces afines
                </p>

                <p className="mt-2 text-[9px] text-white/32">
                  Explora otras conciencias que dialogan
                  con esta presencia.
                </p>

                <div className="mt-5 divide-y divide-[#b88a47]/14 border-y border-[#b88a47]/18">
                  {ficha.constelacion.map(
                    (nombre, index) => (
                      <button
                        type="button"
                        key={nombre}
                        onClick={() =>
                          onSelectArtista?.(nombre)
                        }
                        className="grid w-full grid-cols-[28px_1fr_18px] items-center gap-3 px-2 py-3 text-left transition hover:bg-[#c49755]/[0.045]"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#b88a47]/35 font-serif text-[9px] text-[#d0aa70]">
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <span className="font-serif text-sm uppercase tracking-[0.06em] text-[#d8c19c]">
                          {nombre}
                        </span>

                        <span className="text-[#c49755]">
                          ›
                        </span>
                      </button>
                    )
                  )}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
      </div>
    ),
    document.body
  );
}
