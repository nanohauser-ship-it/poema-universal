"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[60px] border border-stone-200 bg-gradient-to-b from-[#fffdf8] via-[#f7eee3] to-[#efe2cf] py-28">

      {/* Luces */}

      <div className="absolute left-1/2 top-[-250px] h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-white/80 blur-3xl" />

      <div className="absolute bottom-[-250px] left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[#d8b980]/20 blur-3xl" />

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,.25) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-8">

        <p className="text-center text-xs uppercase tracking-[0.65em] text-[#a88c57]">
          EDICIÓN FUNDACIONAL
        </p>

        <h1 className="mt-8 text-center font-serif text-[5rem] font-semibold leading-[0.9] tracking-tight md:text-[9rem]">
          Poema
          <br />
          Universal
        </h1>

        <p className="mx-auto mt-10 max-w-3xl text-center text-xl leading-10 text-stone-600">
          Una única obra.
          <br />
          Escrita durante un año.
          <br />
          Firmada por el mundo.
        </p>

        {/* LIBRO */}

        <div className="relative mt-24 flex justify-center">

          <div className="absolute bottom-0 h-20 w-[430px] rounded-full bg-black/15 blur-3xl" />

          <div className="relative h-[470px] w-[320px] rounded-[20px] bg-gradient-to-br from-[#faf6ef] via-[#ecd6ad] to-[#c59b56] shadow-[0_45px_120px_rgba(0,0,0,.28)]">

            <div className="absolute left-5 top-0 h-full w-[8px] rounded-full bg-[#a67b36]" />

            <div className="flex h-full flex-col items-center justify-center px-10">

              <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                Edición Fundacional
              </p>

              <h2 className="mt-8 font-serif text-6xl">
                2026
              </h2>

              <div className="my-10 h-px w-24 bg-stone-400" />

              <p className="text-center font-serif text-3xl leading-relaxed">
                Poema
                <br />
                Universal
              </p>

            </div>

          </div>

        </div>

        <div className="mt-20 flex justify-center">

          <Link
            href="/poema-universal/2026"
            className="rounded-full bg-stone-950 px-10 py-5 text-xs font-semibold uppercase tracking-[0.35em] text-white transition duration-300 hover:scale-105 hover:bg-stone-800"
          >
            Entrar en la Edición 2026
          </Link>

        </div>

      </div>

    </section>
  );
}