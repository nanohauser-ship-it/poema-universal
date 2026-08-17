import Link from "next/link";

import Museum3DExperience from "./components/Museum3DExperience";

export default function MuseumTourPage() {
  return (
    <main className="min-h-screen bg-[#050608]">
      <header className="relative z-50 border-b border-white/10 bg-[#050608]/90 text-[#f0e8dc] backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] max-w-[1550px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-12">
          <Link
            href="/museo-de-los-tres-mundos"
            className="font-serif text-xl tracking-[-0.025em]"
          >
            Museo de los Tres Mundos
          </Link>

          <p className="hidden text-[8px] uppercase tracking-[0.3em] text-white/30 md:block">
            Recorrido 3D
          </p>

          <Link
            href="/museo-de-los-tres-mundos"
            className="border border-white/15 px-5 py-2.5 text-[8px] uppercase tracking-[0.28em] text-white/52 transition hover:border-white/35 hover:text-white"
          >
            Ver colección
          </Link>
        </div>
      </header>

      <Museum3DExperience />
    </main>
  );
}
