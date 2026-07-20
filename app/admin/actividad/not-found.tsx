import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6efe7] px-5 py-8 text-stone-950">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute left-[8%] top-[18%] h-72 w-72 rounded-full bg-white/60 blur-3xl" />
        <div className="absolute bottom-[12%] right-[8%] h-80 w-80 rounded-full bg-amber-100/50 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-stone-200/70" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col">
        <nav className="mb-16 flex flex-wrap items-center justify-between gap-4 rounded-full border border-stone-200 bg-white/70 px-5 py-3 shadow-sm backdrop-blur">
          <Link href="/" className="text-sm font-semibold tracking-wide">
            Poema Universal
          </Link>

          <div className="flex flex-wrap items-center gap-5 text-sm text-stone-600">
            <Link href="/fundacion" className="transition hover:text-black">
              Fundación
            </Link>

            <Link href="/obra" className="transition hover:text-black">
              Obra
            </Link>

            <Link href="/artistas" className="transition hover:text-black">
              Artistas
            </Link>

            <Link href="/cadena" className="transition hover:text-black">
              Cadena
            </Link>

            <Link href="/duelo" className="transition hover:text-black">
              Duelo
            </Link>
          </div>
        </nav>

        <section className="flex flex-1 items-center justify-center">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-8 text-[11px] uppercase tracking-[0.55em] text-stone-400">
              Puerta perdida
            </p>

            <h1 className="font-serif text-[7rem] font-semibold leading-none tracking-tight text-stone-950 sm:text-[10rem]">
              404
            </h1>

            <h2 className="mt-8 font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Esta habitación todavía
              <br />
              no existe.
            </h2>

            <p className="mx-auto mt-8 max-w-2xl text-sm leading-8 text-stone-600 sm:text-base">
              Has llegado a una puerta sin nombre. Puede que el poema haya
              cambiado de lugar, que esta sala aún no haya sido construida o que
              simplemente hayas entrado en una grieta del mapa.
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Link
                href="/"
                className="rounded-full bg-stone-950 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-white shadow-sm transition hover:bg-stone-800"
              >
                Volver al inicio
              </Link>

              <Link
                href="/mi-habitacion"
                className="rounded-full border border-stone-300 bg-white/70 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-700 shadow-sm transition hover:bg-white hover:text-black"
              >
                Mi habitación
              </Link>
            </div>

            <div className="mx-auto mt-16 max-w-xl rounded-[32px] border border-stone-200 bg-white/60 p-7 shadow-sm backdrop-blur">
              <p className="font-serif text-2xl leading-relaxed text-stone-800">
                “No todo lo que se pierde desaparece.
                <br />
                A veces solo necesita una casa.”
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-16 pb-8 text-center">
          <p className="text-xs uppercase tracking-[0.38em] text-stone-400">
            Poema Universal · Error 404
          </p>
        </footer>
      </div>
    </main>
  );
}