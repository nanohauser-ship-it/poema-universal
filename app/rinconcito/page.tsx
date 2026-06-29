"use client";

import { useState } from "react";

export default function RinconcitoPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);
  }

  return (
    <main className="min-h-screen bg-[#f5efe7] text-[#211b16] px-6 py-10">
      <nav className="mx-auto mb-10 flex max-w-6xl items-center justify-between">
        <a href="/" className="text-xl font-bold tracking-[0.25em]">
          POEMA UNIVERSAL
        </a>

        <div className="hidden gap-10 text-sm md:flex">
          <a href="/">Poema del día</a>
          <a href="/cartas">Cartas</a>
          <a href="/rinconcito" className="border-b border-[#211b16] pb-1">
            El Rinconcito
          </a>
          <a href="/archivo">Archivo</a>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d8c7b4]">
          ♡
        </div>
      </nav>

      <section className="mx-auto max-w-6xl overflow-hidden rounded-[36px] border border-[#e2d4c4] bg-[#fffaf3] shadow-sm">
        <div className="px-8 py-14 text-center md:px-16">
          <p className="text-xs uppercase tracking-[0.45em] text-[#9a8065]">
            El Rinconcito
          </p>

          <h1 className="mx-auto mt-6 max-w-3xl font-serif text-5xl leading-tight md:text-7xl">
            Háblale al niño que fuiste
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-xl leading-8 text-[#7a6b5c]">
            Dile algo que necesitaba escuchar. Algo que hoy sí puedes darle.
          </p>

          <div className="mt-8 flex items-center justify-center gap-6 text-[#b29a80]">
            <span className="h-px w-20 bg-[#d9c8b6]" />
            <span className="text-2xl">♡</span>
            <span className="h-px w-20 bg-[#d9c8b6]" />
          </div>
        </div>

        <div className="grid gap-12 px-8 pb-14 md:grid-cols-2 md:px-16">
          <section>
            <h2 className="font-serif text-2xl">
              1. Sube una foto de tu infancia
            </h2>

            <label className="mt-6 flex h-56 cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-[#d3bfa9] bg-[#fff7ed] text-center transition hover:bg-[#f8efe4]">
              <span className="text-5xl text-[#9a8065]">☼</span>
              <span className="mt-4 text-xl font-medium">Añadir foto</span>
              <span className="mt-2 text-[#8f7c69]">
                o arrastra y suelta aquí
              </span>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            <p className="mt-5 text-center text-sm text-[#8f7c69]">
              🔒 Esta imagen es privada. Solo tú la verás.
            </p>

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Foto de infancia"
                className="mt-8 h-80 w-full rounded-[18px] object-cover grayscale shadow-sm"
              />
            )}
          </section>

          <section>
            <h2 className="font-serif text-2xl">
              2. Escríbele una carta a tu niño interior
            </h2>

            <p className="mt-3 text-[#8f7c69]">
              Dile lo que necesitaba escuchar.
            </p>

            <textarea
              className="mt-6 h-96 w-full rounded-[24px] border border-[#dfd1c0] bg-[#fffaf3] p-7 text-xl leading-9 text-[#2b2b2b] outline-none placeholder:text-[#a99480]"
              placeholder={`Querido niño,\n\nHoy quiero decirte...`}
            />

            <button className="mx-auto mt-8 flex rounded-full bg-[#211b16] px-10 py-4 text-lg font-medium text-white shadow-sm transition hover:scale-[1.02]">
              🪶 Guardar en mi rincón
            </button>

            <p className="mx-auto mt-6 max-w-sm text-center text-[#8f7c69]">
              Este mensaje no busca arreglar el pasado. Busca acompañarlo.
            </p>
          </section>
        </div>

        <section className="border-t border-[#e2d4c4] px-8 py-10 md:px-16">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-serif text-3xl">Mensajes guardados</h2>
              <p className="mt-1 text-[#8f7c69]">
                Tus cartas a tu niño interior.
              </p>
            </div>

            <a href="#" className="text-[#8f7c69]">
              Ver todas →
            </a>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <MensajeCard
              fecha="19 junio 2026"
              texto="Hola pequeño José, qué valiente fuiste siempre, aunque no lo supieras..."
            />
            <MensajeCard
              fecha="12 mayo 2026"
              texto="Gracias por aguantar tanto. Hoy entiendo muchas cosas que antes dolían..."
            />
            <MensajeCard
              fecha="3 abril 2026"
              texto="No tenías que ser perfecto para que te quisieran. Eras suficiente..."
            />
          </div>
        </section>
      </section>

      <footer className="mx-auto mt-10 flex max-w-6xl items-center justify-between text-sm text-[#8f7c69]">
        <span>© Poema Universal</span>
        <p className="text-center font-serif text-lg">
          “No se trata de volver al pasado, sino de tomar su mano y decirle: no estás solo.”
        </p>
        <span>Hecho con alma.</span>
      </footer>
    </main>
  );
}

function MensajeCard({ fecha, texto }: { fecha: string; texto: string }) {
  return (
    <article className="rounded-[20px] border border-[#e2d4c4] bg-[#fff7ed] p-6 shadow-sm">
      <p className="text-sm text-[#9a8065]">{fecha}</p>
      <p className="mt-4 leading-7">{texto}</p>
      <p className="mt-6 text-right text-[#9a8065]">🔒</p>
    </article>
  );
}