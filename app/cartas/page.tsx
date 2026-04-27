"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const opcionesCarta = [
  {
    id: "decir",
    titulo: "Decir lo que no pude decir",
    subtitulo: "Permitir que salgan las palabras que se quedaron dentro.",
    tono: "despedida",
    destinatario: "alguien que amé",
    placeholder: "Empieza por la frase que nunca salió...",
  },
  {
    id: "cerrar",
    titulo: "Cerrar una herida",
    subtitulo: "Cerrar aquello que se rompió y ya no tiene arreglo.",
    tono: "cierre",
    destinatario: "alguien que me hirió",
    placeholder: "Escribe lo que todavía no encontró cierre...",
  },
  {
    id: "gracias",
    titulo: "Dar las gracias",
    subtitulo: "Agradecer a alguien que te hizo bien.",
    tono: "agradecimiento",
    destinatario: "alguien que amé",
    placeholder: "Recuerda aquello que alguien te dio...",
  },
  {
    id: "despedida",
    titulo: "Despedirme sin enviar",
    subtitulo: "Un último adiós que no llegó a ser pronunciado.",
    tono: "despedida",
    destinatario: "alguien que perdí",
    placeholder: "Di adiós sin tener que enviarlo...",
  },
];

export default function CartasPage() {
  const [tono, setTono] = useState("despedida");
  const [destinatario, setDestinatario] = useState("alguien que amé");
  const [opcionActiva, setOpcionActiva] = useState("decir");
  const [texto, setTexto] = useState("");
  const [resultado, setResultado] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const opcionSeleccionada = useMemo(() => {
    return opcionesCarta.find((o) => o.id === opcionActiva) || opcionesCarta[0];
  }, [opcionActiva]);

  const elegirOpcion = (opcion: (typeof opcionesCarta)[number]) => {
    setOpcionActiva(opcion.id);
    setTono(opcion.tono);
    setDestinatario(opcion.destinatario);
  };

  const generarCarta = async () => {
    try {
      setCargando(true);
      setMensaje("");
      setResultado("");

      if (!texto.trim()) {
        setMensaje("Escribe algo antes de generar la carta.");
        return;
      }

      const res = await fetch("/api/generar-carta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          texto,
          tono,
          destinatario,
          modo: opcionActiva,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo generar la carta");
      }

      setResultado(data.carta || "");
      setMensaje("Tu carta ya tiene forma.");

      setTimeout(() => setMensaje(""), 3500);
    } catch (error: any) {
      setMensaje(error.message || "Hubo un problema al generar la carta.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f3eb] text-stone-900">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <nav className="mb-10 flex items-center justify-between rounded-full border border-stone-200 bg-white/80 px-5 py-3 shadow-sm backdrop-blur">
          <Link href="/" className="text-sm font-semibold tracking-wide text-stone-800">
            Poema Universal
          </Link>

          <div className="flex items-center gap-5 text-sm text-stone-600">
            <Link href="/" className="transition hover:text-black">
              Poema del día
            </Link>
            <Link href="/cartas" className="font-medium text-black">
              Cartas
            </Link>
            <Link href="/cuaderno" className="transition hover:text-black">
              Cuaderno
            </Link>
          </div>
        </nav>

        <header className="mb-14 text-center">
          <h1 className="text-5xl font-semibold tracking-tight">
            Escribe lo que quedó dentro
          </h1>
          <p className="mt-4 text-stone-600">
            Un lugar para decir lo que no encontró salida.
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[34px] bg-[#fdfaf4] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              {opcionesCarta.map((opcion) => (
                <button
                  type="button"
                  key={opcion.id}
                  onClick={() => elegirOpcion(opcion)}
                  className={`rounded-[28px] border p-4 text-left transition-all duration-300 ${
                    opcionActiva === opcion.id
                      ? "border-black bg-black text-white shadow-[0_14px_34px_rgba(0,0,0,0.22)]"
                      : "border-stone-300 bg-white text-stone-900 hover:-translate-y-0.5 hover:bg-[#f4efe6]"
                  }`}
                >
                  <p className="font-semibold leading-snug">{opcion.titulo}</p>
                  <p className="mt-1 text-sm opacity-90">{opcion.subtitulo}</p>
                </button>
              ))}
            </div>

            <p className="mb-4 text-sm italic text-stone-500">
              Has elegido: {opcionSeleccionada.titulo}
            </p>

            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder={opcionSeleccionada.placeholder}
              className="min-h-[260px] w-full rounded-[24px] bg-black p-5 text-white outline-none placeholder:text-stone-500 focus:ring-2 focus:ring-stone-400"
            />

            <button
              onClick={generarCarta}
              disabled={cargando}
              className="group mt-5 w-full rounded-[28px] bg-black px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_18px_40px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_60px_rgba(0,0,0,0.35)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="flex items-center justify-center gap-2">
                {cargando ? "Escribiendo..." : "Escribir mi carta"}
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </button>
          </div>

          <div className="relative min-h-[520px] overflow-hidden rounded-[34px] bg-[#fdfaf4] p-8 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
            <img
              src="/flor.png"
              alt="flor"
              className="pointer-events-none absolute right-7 top-7 w-24 opacity-40 animate-[breathe_6s_ease-in-out_infinite]"
            />

            <div className="relative z-10">
              <p className="mb-6 text-xs uppercase tracking-[0.28em] text-stone-500">
                {resultado ? "Tu carta" : "Aquí aparecerá tu carta"}
              </p>

              <div
                className={`whitespace-pre-wrap pr-20 text-[15px] leading-8 text-stone-800 ${
                  resultado ? "animate-[fadeUp_0.7s_ease-out]" : "italic text-stone-500"
                }`}
              >
                {resultado
                  ? resultado
                  : `Aquí aparecerán las palabras que necesitabas decir.

Las que dolían,
las que te pesaban,
las que merecían ser escuchadas.

Este es tu espacio.
Tu carta, tu verdad, tu libertad.`}
              </div>
            </div>
          </div>
        </section>

        {mensaje && (
          <div className="mt-6 animate-[fadeUp_0.6s_ease-out] text-center text-sm font-medium text-stone-600">
            {mensaje}
          </div>
        )}
      </div>
    </main>
  );
}