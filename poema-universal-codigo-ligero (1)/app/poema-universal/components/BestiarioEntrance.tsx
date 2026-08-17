"use client";

import Link from "next/link";

export default function BestiarioEntrance() {
  return (
    <section
      className="relative overflow-hidden border-t border-white/10 px-5 py-28 sm:px-8 sm:py-36 lg:px-12"
      style={{
        background:
          "radial-gradient(circle at 50% 20%, rgba(122,84,38,0.20), transparent 34rem), #080604",
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-0 h-[520px] w-px -translate-x-1/2"
          style={{
            background:
              "linear-gradient(to bottom, rgba(199,164,103,0.50), transparent)",
          }}
        />

        <div
          className="absolute left-1/2 top-24 h-[420px] w-[420px] -translate-x-1/2 rounded-full border"
          style={{
            borderColor: "rgba(199,164,103,0.14)",
          }}
        />

        <div
          className="absolute left-1/2 top-36 h-[300px] w-[300px] -translate-x-1/2 rounded-full border"
          style={{
            borderColor: "rgba(199,164,103,0.10)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1380px]">
        <div className="mx-auto max-w-4xl text-center">
          <p
            className="text-[9px] uppercase tracking-[0.48em]"
            style={{ color: "#c7a467" }}
          >
            Cámara de invocación
          </p>

          <h2
            className="mt-8 font-serif text-5xl leading-[0.92] tracking-[-0.055em] sm:text-7xl lg:text-[104px]"
            style={{ color: "#f0e8dc" }}
          >
            Bestiario
            <span
              className="block italic"
              style={{ color: "rgba(240,232,220,0.56)" }}
            >
              Poético
            </span>
          </h2>

          <p
            className="mx-auto mt-10 max-w-2xl font-serif text-lg leading-8 sm:text-xl sm:leading-9"
            style={{ color: "rgba(240,232,220,0.60)" }}
          >
            Entrega un poema y descubre la criatura simbólica que habita
            en sus palabras.
          </p>

          <p
            className="mx-auto mt-5 max-w-xl text-sm leading-7"
            style={{ color: "rgba(240,232,220,0.38)" }}
          >
            La cámara reconocerá su memoria, su herida, su deseo y su
            forma de resistencia. Un guardián responderá.
          </p>

          <Link
            href="/poema-universal/bestiario-poetico/asamblea"
            className="mt-12 inline-flex border px-8 py-4 text-[9px] uppercase tracking-[0.32em] transition duration-500 hover:bg-white/5"
            style={{
              borderColor: "rgba(199,164,103,0.55)",
              color: "#d3b477",
            }}
          >
            Entrar en el Bestiario
          </Link>

          <p
            className="mt-8 font-serif text-sm italic"
            style={{ color: "rgba(240,232,220,0.28)" }}
          >
            «Las criaturas no son inventadas. Son reconocidas.»
          </p>
        </div>
      </div>
    </section>
  );
}
