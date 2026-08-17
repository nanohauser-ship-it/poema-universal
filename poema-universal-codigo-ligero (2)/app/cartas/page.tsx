"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Intencion = {
  id: string;
  titulo: string;
  descripcion: string;
  apertura: string;
};

const intenciones: Intencion[] = [
  {
    id: "no-pude-decir",
    titulo: "Lo que no pude decir",
    descripcion: "Para las palabras que se quedaron dentro.",
    apertura: "Hay algo que no pude decir cuando todavía importaba.",
  },
  {
    id: "cerrar-herida",
    titulo: "Cerrar una herida",
    descripcion: "Para dejar descansar lo que siguió doliendo.",
    apertura:
      "Escribo esta carta para cerrar una herida que todavía tenía nombre.",
  },
  {
    id: "dar-gracias",
    titulo: "Dar las gracias",
    descripcion: "Para reconocer a quien dejó luz.",
    apertura: "Esta carta nace desde la gratitud.",
  },
  {
    id: "despedida",
    titulo: "Despedirme sin enviar",
    descripcion: "Para decir adiós sin tener que volver.",
    apertura:
      "No sé si esta carta llegará a alguna parte, pero necesito escribirla.",
  },
];

export default function CartasPage() {
  const [intencionActiva, setIntencionActiva] = useState<Intencion>(
    intenciones[0],
  );
  const [texto, setTexto] = useState("");
  const [cartaGenerada, setCartaGenerada] = useState("");
  const [mensaje, setMensaje] = useState("");

  const fechaHoy = useMemo(() => {
    return new Date().toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  const cartaPreview = useMemo(() => {
    if (cartaGenerada) return cartaGenerada;

    return `Aquí aparecerá tu carta.

No tiene que ser perfecta.
No tiene que ser enviada.
No tiene que explicarlo todo.

Solo necesita ser verdadera.

Empieza donde puedas.
Con una frase.
Con una imagen.
Con algo que todavía pesa.`;
  }, [cartaGenerada]);

  function escribirCarta() {
    const limpio = texto.trim();
    setMensaje("");

    if (!limpio) {
      setCartaGenerada(
        `Todavía no has escrito nada.

A veces la primera frase tarda en llegar.

Puedes empezar así:

“Hoy necesito decir...”

“Me quedé con...”

“Nunca pude explicarte...”

“No supe cómo despedirme...”`,
      );
      return;
    }

    const carta = `${intencionActiva.apertura}

${limpio}

No escribo esto para volver atrás.
Lo escribo para darle un lugar a lo que quedó suspendido.

Durante un tiempo pensé que callarlo era una forma de protegerme.
Pero algunas cosas no desaparecen cuando se esconden.
Solo esperan una habitación más tranquila para poder ser nombradas.

Hoy dejo estas palabras aquí.

No como una deuda.
No como una herida abierta.
No como una petición.

Sino como una pequeña forma de verdad.

Que lo escrito encuentre descanso.
Que lo que dolía encuentre aire.
Que lo que no pudo salir, al fin, tenga forma.`;

    setCartaGenerada(carta);
  }

  async function copiarCarta() {
    if (!cartaPreview) return;

    await navigator.clipboard.writeText(cartaPreview);
    setMensaje("Carta copiada.");

    setTimeout(() => {
      setMensaje("");
    }, 2200);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4eee4] text-stone-950">
      {/* CARTAS LATERAL IZQUIERDO */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-0 hidden w-[32vw] bg-cover bg-center opacity-90 lg:block"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(244,238,228,0.02), rgba(244,238,228,0.58)), url('/cartas.jpg')",
        }}
      />

      {/* CARTAS LATERAL DERECHO */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[32vw] bg-cover bg-center opacity-90 lg:block"
        style={{
          backgroundImage:
            "linear-gradient(to left, rgba(244,238,228,0.02), rgba(244,238,228,0.58)), url('/cartas.jpg')",
        }}
      />

      {/* FUNDIDOS HACIA EL CENTRO */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] hidden w-[44vw] bg-gradient-to-r from-transparent via-[#f4eee4]/55 to-[#f4eee4] lg:block" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] hidden w-[44vw] bg-gradient-to-l from-transparent via-[#f4eee4]/55 to-[#f4eee4] lg:block" />

      {/* VELO CÁLIDO GENERAL */}
      <div className="pointer-events-none fixed inset-0 z-[2] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.78),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.28),rgba(120,85,50,0.06))]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8">
        <nav className="mb-10 flex items-center justify-between rounded-full border border-stone-200/80 bg-[#fffaf2]/85 px-5 py-3 shadow-[0_10px_30px_rgba(80,55,30,0.12)] backdrop-blur-md">
          <Link href="/" className="text-sm font-semibold tracking-wide">
            Poema Universal
          </Link>

          <div className="flex items-center gap-5 text-sm text-stone-600">
            <Link href="/" className="transition hover:text-black">
              Inicio
            </Link>

            <Link href="/cartas" className="font-medium text-black">
              Cartas
            </Link>

            <Link href="/rinconcito" className="transition hover:text-black">
              El Rinconcito
            </Link>

            <Link href="/noches-en-paz" className="transition hover:text-black">
              Noches en Paz
            </Link>

            <Link href="/antologia" className="transition hover:text-black">
              Antología
            </Link>

            <Link href="/cuaderno" className="transition hover:text-black">
              Cuaderno
            </Link>
          </div>
        </nav>

        <header className="mx-auto mb-14 max-w-4xl pt-4 text-center">
          <p className="mx-auto mb-5 inline-flex rounded-full border border-stone-300/80 bg-[#fffaf2]/85 px-4 py-1.5 text-[11px] uppercase tracking-[0.34em] text-stone-500 shadow-sm backdrop-blur">
            Cartas
          </p>

          <h1 className="font-serif text-5xl font-medium leading-[0.96] tracking-tight text-stone-950 sm:text-7xl">
            Cartas para lo que quedó dentro
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-stone-600">
            Un lugar para decir lo que no encontró salida. No hace falta
            enviarlo. A veces basta con escribirlo para que deje de pesar igual.
          </p>
        </header>

        <section className="grid gap-10 lg:grid-cols-[0.76fr_1.24fr]">
          <aside className="rounded-[30px] border border-white/80 bg-[#fffaf2]/85 p-7 shadow-[0_22px_60px_rgba(80,55,30,0.13)] backdrop-blur-md">
            <div>
              <p className="text-[11px] uppercase tracking-[0.34em] text-stone-500">
                Intención
              </p>

              <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight">
                Antes de escribir
              </h2>

              <p className="mt-3 text-sm leading-7 text-stone-600">
                Elige desde dónde nace la carta. No es una categoría: es una
                puerta.
              </p>
            </div>

            <div className="mt-8 divide-y divide-stone-200/80 border-y border-stone-200/80">
              {intenciones.map((intencion) => {
                const activa = intencion.id === intencionActiva.id;

                return (
                  <button
                    key={intencion.id}
                    onClick={() => setIntencionActiva(intencion)}
                    className="group w-full py-4 text-left"
                  >
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <p
                          className={`font-serif text-xl transition ${
                            activa ? "text-stone-950" : "text-stone-500"
                          }`}
                        >
                          {intencion.titulo}
                        </p>

                        <p
                          className={`mt-1 text-sm leading-6 transition ${
                            activa ? "text-stone-600" : "text-stone-400"
                          }`}
                        >
                          {intencion.descripcion}
                        </p>
                      </div>

                      <span
                        className={`mt-2 h-2 w-2 rounded-full transition ${
                          activa
                            ? "bg-stone-950"
                            : "bg-stone-300 group-hover:bg-stone-500"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8">
              <p className="mb-3 text-[11px] uppercase tracking-[0.34em] text-stone-500">
                Tu fragmento
              </p>

              <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Empieza por la frase que nunca salió..."
                className="min-h-[260px] w-full resize-none rounded-[24px] border border-stone-200/90 bg-[#fffaf2]/90 p-6 font-serif text-[1.08rem] leading-8 text-stone-900 shadow-inner outline-none placeholder:text-stone-400 focus:border-stone-500"
              />
            </div>

            <button
              onClick={escribirCarta}
              className="mt-5 w-full rounded-full bg-stone-950 px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-white shadow-[0_18px_42px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-stone-800"
            >
              Escribir mi carta →
            </button>

            <p className="mt-5 text-sm leading-7 text-stone-500">
              No se enviará a nadie. Es una carta para ordenar lo que necesitaba
              voz.
            </p>
          </aside>

          <article className="relative min-h-[700px] overflow-hidden rounded-[34px] border border-white/90 bg-[#fffdf8]/95 p-8 shadow-[0_26px_70px_rgba(80,55,30,0.15)] backdrop-blur-sm">
            <div className="pointer-events-none absolute right-10 top-10 h-36 w-24 opacity-20">
              <div className="absolute left-11 top-0 h-28 w-px rotate-12 bg-stone-400" />
              <div className="absolute left-7 top-9 h-16 w-px -rotate-45 bg-stone-300" />
              <div className="absolute left-14 top-12 h-16 w-px rotate-45 bg-stone-300" />
              <div className="absolute bottom-0 left-8 h-3 w-3 rounded-full border border-stone-400" />
            </div>

            <div className="relative z-10">
              <div className="mb-12 flex items-start justify-between gap-8">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.36em] text-stone-500">
                    Tu carta
                  </p>

                  <h2 className="mt-4 max-w-md font-serif text-5xl font-medium leading-[0.95] tracking-tight">
                    Lo que necesitaba forma
                  </h2>
                </div>

                <p className="whitespace-nowrap pt-1 text-[11px] uppercase tracking-[0.26em] text-stone-400">
                  {fechaHoy}
                </p>
              </div>

              <div className="min-h-[470px] rounded-[28px] border border-stone-200/90 bg-[#fbf6ed] p-9 shadow-inner">
                <p className="mb-8 text-[11px] uppercase tracking-[0.3em] text-stone-500">
                  {intencionActiva.titulo}
                </p>

                <div className="whitespace-pre-wrap font-serif text-[1.15rem] italic leading-9 text-stone-800">
                  {cartaPreview}
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm italic text-stone-500">
                  Esta carta puede quedarse aquí. No todo necesita destino.
                </p>

                <button
                  onClick={copiarCarta}
                  className="rounded-full border border-stone-300 bg-white/80 px-5 py-2.5 text-sm transition hover:border-stone-500 hover:bg-white"
                >
                  Copiar carta
                </button>
              </div>

              {mensaje && (
                <p className="mt-4 text-right text-sm text-stone-500">
                  {mensaje}
                </p>
              )}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}