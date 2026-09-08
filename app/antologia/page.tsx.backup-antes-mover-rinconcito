"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type PoemaAntologia = {
  id: number;
  titulo: string | null;
  poema: string;
  autor: string | null;
  created_at: string;
};

export default function AntologiaPage() {
  const [poemas, setPoemas] = useState<PoemaAntologia[]>([]);

  useEffect(() => {
    cargarAntologia();
  }, []);

  async function cargarAntologia() {
    const response = await fetch("/api/antologia");
    const data = await response.json();
    setPoemas(data);
  }

  return (
    <main
      className="min-h-screen px-6 py-10 text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(4,10,10,.10), rgba(4,10,10,.42)), url('/antologia/campo.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="mx-auto max-w-6xl">
        <nav className="mx-auto flex max-w-5xl items-center justify-between rounded-full border border-white/15 bg-black/20 px-6 py-4 shadow-2xl backdrop-blur-xl">
          <Link href="/" className="font-serif text-xl">
            Poema Universal
          </Link>

          <div className="flex gap-5 text-sm text-slate-100">
            <Link href="/" className="hover:text-white">
              Poema
            </Link>
            <Link href="/cartas" className="hover:text-white">
              Cartas
            </Link>
            <Link href="/rinconcito" className="hover:text-white">
              El Rinconcito
            </Link>
            <Link href="/noches-en-paz" className="hover:text-white">
              Noches en Paz
            </Link>
            <Link href="/antologia" className="text-white">
              Antología
            </Link>
          </div>
        </nav>

        <section className="pt-36 text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-[#f1d89b] drop-shadow">
            Archivo Mayor
          </p>

          <h1 className="mt-8 font-serif text-8xl leading-none md:text-9xl drop-shadow-2xl">
            Antología
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-white drop-shadow-lg">
            Un lugar para guardar los poemas que merecen permanecer.
            <br />
            Los poemas que, de alguna manera, han encontrado algo verdadero.
          </p>
        </section>

        <section className="mx-auto mt-24 grid max-w-4xl gap-10 pb-24">
          {poemas.length === 0 ? (
            <div className="text-center">
              <h2 className="font-serif text-4xl drop-shadow-lg">
                Todavía no hay poemas publicados
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-100">
                Algún día este campo se llenará de poemas que alguien decidió no
                olvidar.
              </p>
            </div>
          ) : (
            poemas.map((item) => (
              <article
                key={item.id}
                className="relative overflow-hidden rounded-[46px] border border-white/15 bg-[#09140f]/45 p-10 shadow-[0_40px_120px_rgba(0,0,0,.45)] backdrop-blur-xl"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                <p className="text-xs uppercase tracking-[0.45em] text-[#f1d89b]">
                  {item.titulo || "Poema seleccionado"}
                </p>

                <div className="mt-8 whitespace-pre-wrap font-serif text-3xl leading-[1.65] text-white drop-shadow-md">
                  {item.poema}
                </div>

                <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6 text-sm text-slate-200">
                  <p>{item.autor || "Poema Universal"}</p>
                  <p>{new Date(item.created_at).toLocaleDateString("es-ES")}</p>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}