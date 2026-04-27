"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Nota = {
  id: string;
  contenido: string;
  created_at?: string;
};

export default function CuadernoPage() {
  const [texto, setTexto] = useState("");
  const [notas, setNotas] = useState<Nota[]>([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarNotas();
  }, []);

  const cargarNotas = async () => {
    try {
      const res = await fetch("/api/cuaderno");
      const data = await res.json();
      setNotas(data.poemas || []);
    } catch (error) {
      console.error("Error cargando notas:", error);
    }
  };

  const guardarNota = async () => {
    if (!texto.trim()) {
      setMensaje("Escribe algo primero.");
      return;
    }

    try {
      const res = await fetch("/api/cuaderno", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contenido: texto }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error guardando");
      }

      setTexto("");
      setMensaje("Poema guardado.");
      cargarNotas();

      setTimeout(() => {
        setMensaje("");
      }, 3000);
    } catch (error: any) {
      setMensaje(error.message || "Hubo un problema al guardar.");
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
            <Link href="/" className="transition hover:text-stone-900">
              Poema del día
            </Link>

            <Link href="/cartas" className="transition hover:text-stone-900">
              Cartas
            </Link>

            <Link href="/cuaderno" className="font-medium text-black">
              Cuaderno
            </Link>
          </div>
        </nav>

        <header className="mb-14 text-center">
          <h1 className="text-5xl font-semibold tracking-tight">
            Cuaderno de poemas
          </h1>
          <p className="mt-4 text-stone-600">
            Un lugar para guardar fragmentos, poemas y voces que no quieres perder.
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[34px] bg-[#fdfaf4] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Pega aquí un poema, un fragmento o una nota que quieras conservar..."
              className="min-h-[300px] w-full rounded-[24px] bg-black p-5 text-white outline-none placeholder:text-stone-500"
            />

            <button
              onClick={guardarNota}
              className="mt-5 w-full rounded-[28px] bg-black px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_18px_40px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_60px_rgba(0,0,0,0.35)]"
            >
              Guardar en cuaderno
            </button>

            {mensaje && (
              <p className="mt-4 text-center text-sm font-medium text-stone-600">
                {mensaje}
              </p>
            )}
          </div>

          <div className="rounded-[34px] bg-[#fdfaf4] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
            {notas.length === 0 ? (
              <p className="text-stone-500">
                Aquí aparecerán tus poemas guardados.
              </p>
            ) : (
              <div className="space-y-5">
                {notas.map((nota) => (
                  <article
                    key={nota.id}
                    className="rounded-[24px] border border-stone-200 bg-[#f8f5ef] p-5"
                  >
                    <p className="whitespace-pre-wrap leading-8 text-stone-800">
                      {nota.contenido}
                    </p>

                    {nota.created_at && (
                      <p className="mt-3 text-xs text-stone-400">
                        {new Date(nota.created_at).toLocaleDateString("es-ES")}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}