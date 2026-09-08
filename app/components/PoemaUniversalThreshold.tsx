import Image from "next/image";
import Link from "next/link";

export default function PoemaUniversalThreshold() {
  return (
    <section
      aria-labelledby="poema-universal-threshold-title"
      className="relative mt-28 overflow-hidden rounded-[40px] border border-[#c9baa5]/65 bg-[#f3eadf] text-[#191510] shadow-[0_32px_90px_rgba(66,45,27,0.13)] sm:rounded-[52px]"
    >
      {/* LUZ DE PAPEL */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 12% 8%, rgba(255,255,255,0.94), transparent 34%), linear-gradient(145deg, #f8f2ea 0%, #eadfce 100%)",
        }}
      />

      <div className="relative mx-auto grid max-w-[1320px] gap-10 px-8 py-12 sm:px-12 sm:py-16 lg:grid-cols-[1.4fr_0.6fr] lg:items-center lg:gap-16 lg:px-16 lg:py-20">

        {/* =====================================================
            CARTA
        ===================================================== */}
        <article className="max-w-[760px]">
          <div className="flex items-center gap-4">
            <p className="text-[8px] font-semibold uppercase tracking-[0.46em] text-[#98703d]">
              Edición fundacional · 2026
            </p>

            <span className="h-px w-14 bg-[#98703d]/40" />
          </div>

          <p className="mt-8 text-[9px] uppercase tracking-[0.38em] text-stone-400">
            Carta a la humanidad
          </p>

          <h2
            id="poema-universal-threshold-title"
            className="mt-5 max-w-3xl font-serif text-5xl leading-[0.98] tracking-[-0.05em] sm:text-6xl lg:text-[72px]"
          >
            Sesenta poetas.
            <span className="mt-2 block italic font-normal text-[#9b8068]">
              Una misma página.
            </span>
          </h2>

          <div className="mt-9 max-w-2xl space-y-5 font-serif text-[18px] leading-[1.75] text-[#554a40] sm:text-[20px]">
            <p>
              No sabemos desde qué lugar, lengua o historia llegará
              cada poema.
            </p>

            <p>
              Sabemos solamente que sesenta voces distintas formarán
              la primera antología de Poema Universal.
            </p>

            <p>
              No queremos reunirlas para que se parezcan. Queremos
              conservar aquello que las hace irrepetibles y permitir
              que, por una vez, muchas maneras de mirar el mundo
              puedan permanecer juntas sin borrarse unas a otras.
            </p>

            <p>
              Quizá un libro pueda ser también eso: un lugar donde
              nadie tenga que abandonar su voz para pertenecer.
            </p>
          </div>

          <div className="mt-9 border-l border-[#98703d]/45 pl-6">
            <p className="max-w-xl font-serif text-xl italic leading-8 text-[#796958]">
              A quienes escriben, a quienes leen y a quienes todavía
              buscan palabras para permanecer: esta obra también será
              vuestra.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link
              href="/poema-universal#entrada"
              className="group inline-flex items-center bg-[#191510] px-7 py-4 text-[8px] font-semibold uppercase tracking-[0.3em] text-[#d9b576] transition duration-300 hover:-translate-y-0.5 hover:bg-black"
            >
              Entrar en Poema Universal

              <span
                aria-hidden="true"
                className="ml-5 text-sm transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>

            <p className="text-[7px] uppercase tracking-[0.3em] text-stone-400">
              Poema Universal · Antología 2026
            </p>
          </div>
        </article>

        {/* =====================================================
            IMAGEN / DOCUMENTO
        ===================================================== */}
        <figure className="mx-auto w-full max-w-[280px] lg:justify-self-end">
          <div className="relative aspect-[3/4] overflow-hidden bg-[#15130f] shadow-[0_22px_55px_rgba(43,31,20,0.18)]">
            <Image
              src="/images/poema-universal/taller-60-poetas.png"
              alt="Representación simbólica de un grupo de escritores trabajando alrededor de una mesa común."
              fill
              sizes="(max-width: 1024px) 68vw, 280px"
              className="object-cover"
            />

            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(8,7,6,0.46), transparent 45%)",
              }}
            />

            <div className="absolute bottom-5 left-5 right-5">
              <p className="font-serif text-base italic leading-6 text-white/80">
                Muchas manos.
                <span className="block">
                  Ninguna voz sustituye a otra.
                </span>
              </p>
            </div>
          </div>

          <figcaption className="mt-4 flex items-center gap-3">
            <span className="h-px w-8 bg-[#98703d]/45" />

            <p className="text-[6px] uppercase tracking-[0.3em] text-stone-400">
              Representación simbólica · 2026
            </p>
          </figcaption>
        </figure>
      </div>

      {/* FIRMA */}
      <div className="relative border-t border-stone-900/10 px-8 py-5 sm:px-12 lg:px-16">
        <div className="flex items-center justify-between gap-8">
          <p className="font-serif text-sm italic text-stone-500">
            El mundo todavía está escribiendo.
          </p>

          <p className="text-[7px] uppercase tracking-[0.36em] text-[#98703d]">
            Poema Universal
          </p>
        </div>
      </div>
    </section>
  );
}
