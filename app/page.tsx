"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type PoemaItem = {
  id: string;
  contenido: string;
  fecha?: string;
};

export default function HomePage() {
  const [frase, setFrase] = useState("");
  const [poema, setPoema] = useState("");
  const [historial, setHistorial] = useState<PoemaItem[]>([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const fechaHoy = useMemo(() => {
    return new Date().toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resPoema = await fetch("/api/poema-dia");
        const dataPoema = await resPoema.json();

        if (dataPoema.poema?.contenido) {
          setPoema(dataPoema.poema.contenido);
        }

        const resHistorial = await fetch("/api/poemas");
        const dataHistorial = await resHistorial.json();

        setHistorial(dataHistorial.poemas || []);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    cargarDatos();
  }, []);

  const generarPoema = async () => {
    try {
      setCargando(true);
      setMensaje("");

      if (!frase.trim()) {
        setMensaje("Escribe una frase antes de añadirla a la cadena.");
        return;
      }

      const res = await fetch("/api/generar-poema", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ frase: frase.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo generar el poema.");
      }

      setPoema(data.poema || "");
      setFrase("");
      setMensaje("Tu voz ya forma parte de algo más grande.");

      const resHistorial = await fetch("/api/poemas");
      const dataHistorial = await resHistorial.json();
      setHistorial(dataHistorial.poemas || []);

      setTimeout(() => setMensaje(""), 3500);
    } catch (error: any) {
      setMensaje(error.message || "Hubo un problema al generar el poema.");
    } finally {
      setCargando(false);
    }
  };

  const compartirPoema = async () => {
    if (!poema) return;

    if (navigator.share) {
      await navigator.share({
        title: "Poema Universal",
        text: poema,
      });
      return;
    }

    await navigator.clipboard.writeText(poema);
    alert("Poema copiado");
  };

  return (
    <main className="min-h-screen bg-[#f7f3eb] text-stone-900">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <nav className="mb-12 flex items-center justify-between rounded-full border border-stone-200 bg-white/80 px-5 py-3 shadow-sm backdrop-blur">
          <Link href="/" className="text-sm font-semibold tracking-wide">
            Poema Universal
          </Link>

          <div className="flex items-center gap-5 text-sm text-stone-600">
            <Link href="/" className="font-medium text-black">
              Poema del día
            </Link>
            <Link href="/cartas" className="transition hover:text-black">
              Cartas
            </Link>
            <Link href="/cuaderno" className="transition hover:text-black">
              Cuaderno
            </Link>
          </div>
        </nav>

        <header className="mx-auto mb-14 max-w-4xl text-center">
          <div className="mx-auto mb-5 inline-flex rounded-full border border-stone-300 bg-white/80 px-4 py-1.5 text-[11px] uppercase tracking-[0.32em] text-stone-500 shadow-sm">
            Poema Universal
          </div>

          <p className="text-sm italic leading-7 text-stone-500">
            “Lo que alguien dejó caer en el mundo puede volver convertido en canto.”
          </p>

          <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-7xl">
            El poema del día
          </h1>

          <p className="mt-4 text-xs uppercase tracking-[0.34em] text-stone-500">
            {fechaHoy}
          </p>

          <div className="mx-auto mt-10 max-w-md overflow-hidden rounded-[34px] border border-stone-200 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.14)]">
            <Image
              src="/poema-dia.png"
              alt="Poema del día"
              width={900}
              height={1100}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[34px] bg-[#fdfaf4] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
            <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
              Participa
            </p>

            <h2 className="mt-2 text-3xl font-semibold">
              Deja un fragmento
            </h2>

            <p className="mt-3 text-sm leading-7 text-stone-600">
              Una frase basta. Algo que viste, algo que perdiste, algo que no
              supiste decir a tiempo.
            </p>

            <textarea
              value={frase}
              onChange={(e) => setFrase(e.target.value)}
              placeholder="Escribe aquí una frase para el poema universal..."
              className="mt-6 min-h-[220px] w-full rounded-[26px] bg-black p-5 text-white outline-none placeholder:text-stone-500"
            />

            <p className="mt-6 mb-3 text-[11px] uppercase tracking-[0.35em] text-stone-400">
              Acción
            </p>

            <button
              onClick={generarPoema}
              disabled={cargando}
              className="group w-full rounded-[30px] bg-black px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white shadow-[0_22px_50px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_32px_70px_rgba(0,0,0,0.4)] disabled:opacity-50"
            >
              <span className="flex items-center justify-center gap-2">
                {cargando ? "Tejiendo memoria..." : "Añadir a la cadena"}
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </button>

            <p className="mt-4 text-sm leading-6 text-stone-500">
              Tu fragmento se unirá a la memoria anterior y generará una nueva
              pieza del Poema Universal.
            </p>
          </div>

          <div className="rounded-[34px] bg-[#fdfaf4] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
            <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
              Hoy
            </p>

            <h2 className="mt-2 text-3xl font-semibold">
              Poema vivo
            </h2>

            <p className="mt-3 text-sm leading-7 text-stone-600">
              La pieza del día no se inventa desde cero. Se levanta desde lo que
              alguien dejó aquí.
            </p>

            <div className="mt-6 rounded-[30px] border border-stone-200 bg-[#f8f5ef] p-6 shadow-inner">
              {poema ? (
                <>
                  <p className="mb-4 text-xs uppercase tracking-[0.28em] text-stone-500">
                    Generado con fragmentos humanos reales
                  </p>

                  <div className="whitespace-pre-wrap text-[1.06rem] leading-9 text-stone-800">
                    {poema}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => navigator.clipboard.writeText(poema)}
                      className="rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm"
                    >
                      Copiar poema
                    </button>

                    <button
                      onClick={compartirPoema}
                      className="rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm"
                    >
                      Compartir
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-sm leading-7 text-stone-500">
                  Aquí aparecerá la pieza del día cuando escribas un fragmento y
                  lo añadas a la cadena.
                </p>
              )}
            </div>
          </div>
        </section>

        {historial.length > 0 && (
          <section className="mt-12 rounded-[34px] bg-[#fdfaf4] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
                  Memoria
                </p>
                <h2 className="mt-2 text-3xl font-semibold">
                  Archivo de poemas
                </h2>
              </div>

              <p className="text-xs uppercase tracking-[0.24em] text-stone-400">
                {historial.length} guardados
              </p>
            </div>

            <div className="grid gap-5">
              {historial.map((item, index) => (
                <article
                  key={item.id}
                  className="rounded-[26px] border border-stone-200 bg-[#f8f5ef] p-5"
                >
                  <div className="mb-4 flex justify-between">
                    <p className="text-xs uppercase tracking-[0.26em] text-stone-500">
                      {index === 0 ? "Más reciente" : `Poema ${historial.length - index}`}
                    </p>

                    {item.fecha && (
                      <p className="text-xs text-stone-400">{item.fecha}</p>
                    )}
                  </div>

                  <div className="whitespace-pre-wrap text-sm leading-8 text-stone-700">
                    {item.contenido}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {mensaje && (
          <div className="mt-8 rounded-[24px] border border-stone-200 bg-white/90 px-5 py-4 text-center text-sm font-medium text-stone-700 shadow-sm">
            {mensaje}
          </div>
        )}
      </div>
    </main>
  );
}