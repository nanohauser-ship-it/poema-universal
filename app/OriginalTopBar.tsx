import Link from "next/link";



export default function OriginalTopBar() {
  return (
<nav className="mb-16 flex flex-wrap items-center justify-between gap-4 rounded-full border border-stone-200/80 bg-white/68 px-5 py-3 shadow-sm backdrop-blur-xl">
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

            <Link
              href="/poema-universal"
              className="transition hover:text-black"
            >
              Edición 2026
            </Link>

            <Link
              href="/poema-universal/herramientas-literarias"
              className="transition hover:text-black"
            >
              Herramientas
            </Link>

            <Link
              href="/poema-universal/encadenamiento"
              className="transition hover:text-black"
            >
              La columna
            </Link>

            <Link href="/tienda" className="transition hover:text-black">
              Tienda
            </Link>

            <Link href="/artistas" className="transition hover:text-black">
              Artistas
            </Link>

            <Link
              href="/mi-habitacion"
              className="rounded-full border border-stone-300 bg-white/75 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-700 transition hover:bg-stone-950 hover:text-white"
            >
              Mi Habitación
            </Link>
          </div>
        </nav>
  );
}
