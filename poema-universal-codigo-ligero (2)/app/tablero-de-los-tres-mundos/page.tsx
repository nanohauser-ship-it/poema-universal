import Link from "next/link";

import ThreeWorldsBoard from "./components/ThreeWorldsBoard";

export default function TableroTresMundosPage() {
  return (
    <main className="min-h-screen bg-[#07090c] text-[#f0e8dc]">
      <header className="relative z-50 border-b border-white/10 bg-[#07090c]/92 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] max-w-[1550px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="font-serif text-xl tracking-[-0.025em]"
          >
            Poema Universal
          </Link>

          <p className="hidden text-[8px] uppercase tracking-[0.32em] text-white/34 sm:block">
            Obra visual · los tres mundos
          </p>

          <Link
            href="/"
            className="border border-white/15 px-5 py-2.5 text-[8px] uppercase tracking-[0.3em] text-white/55 transition hover:border-white/35 hover:text-white"
          >
            Volver a la casa
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-white/10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, rgba(174,203,210,0.1), transparent 30%), radial-gradient(circle at 80% 78%, rgba(125,49,37,0.15), transparent 32%)",
          }}
        />

        <div className="relative mx-auto max-w-[1550px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <p className="text-[9px] uppercase tracking-[0.52em] text-[#c7a467]">
            Tríptico visual
          </p>

          <h1 className="mt-9 max-w-6xl font-serif text-6xl leading-[0.88] tracking-[-0.065em] sm:text-8xl lg:text-[126px]">
            El Tablero de los
            <span className="block italic text-white/36">
              Tres Mundos.
            </span>
          </h1>

          <p className="mt-11 max-w-3xl font-serif text-2xl leading-[1.4] text-white/68 sm:text-3xl">
            No existe una partida entre el bien y el mal.
          </p>

          <p className="mt-5 max-w-2xl text-sm leading-8 text-white/42">
            Existen seres intentando no desaparecer. Tres
            universos suspendidos alrededor de una misma
            raíz.
          </p>

          <Link
            href="#tableros"
            className="mt-10 inline-flex border-b border-[#c7a467]/45 pb-2 text-[8px] uppercase tracking-[0.34em] text-[#c7a467]"
          >
            Descender a los tableros ↓
          </Link>
        </div>
      </section>

      <div id="tableros">
        <ThreeWorldsBoard />
      </div>

      <section className="border-t border-white/10 bg-[#0a0d11]">
        <div className="mx-auto grid max-w-[1550px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12">
          <p className="text-[8px] uppercase tracking-[0.42em] text-[#c7a467]">
            Casilla Cero
          </p>

          <p className="max-w-4xl font-serif text-4xl leading-[1.2] tracking-[-0.04em] text-white/70 sm:text-6xl">
            El tronco conserva la memoria.
            <span className="block italic text-white/34">
              Las raíces atraviesan el hambre. Las ramas
              entran en el laberinto.
            </span>
          </p>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#07090c] px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1550px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-lg">
            El Tablero de los Tres Mundos
          </p>

          <p className="text-[7px] uppercase tracking-[0.32em] text-white/28">
            Arquitectura fundacional · fase I
          </p>
        </div>
      </footer>
    </main>
  );
}
