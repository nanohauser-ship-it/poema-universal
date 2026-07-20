import Link from "next/link";
import PoetAvatar from "../components/PoetAvatar";

const temporaryNames = Array.from(
  { length: 60 },
  (_, index) =>
    index === 0
      ? "José Naveiro"
      : `Voz ${String(index + 1).padStart(2, "0")}`
);

export default function AvatarPreviewPage() {
  return (
    <main className="min-h-screen bg-[#eee5d8] text-[#211913]">
      <header className="border-b border-stone-900/10">
        <div className="mx-auto flex min-h-[72px] max-w-[1400px] items-center justify-between px-6 lg:px-10">
          <div>
            <p className="font-serif text-xl">
              Poema Universal
            </p>
            <p className="mt-1 text-[7px] uppercase tracking-[0.35em] text-stone-500">
              Laboratorio de avatares
            </p>
          </div>

          <Link
            href="/poema-universal#voces"
            className="border border-stone-900/15 px-5 py-3 text-[8px] uppercase tracking-[0.3em] text-stone-600 transition hover:border-stone-900/40 hover:text-stone-950"
          >
            Volver a las voces
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-[8px] uppercase tracking-[0.4em] text-[#936b3c]">
              Sesenta rostros posibles
            </p>

            <h1 className="mt-7 max-w-xl font-serif text-5xl leading-[0.95] tracking-[-0.05em] sm:text-7xl">
              Una comunidad
              <span className="block italic text-stone-500">
                antes de tener nombre.
              </span>
            </h1>

            <p className="mt-8 max-w-lg text-sm leading-8 text-stone-600">
              Cada avatar comparte una misma familia visual,
              pero cambia de rostro, peinado, expresión,
              ropa y pequeño objeto literario.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-px border border-stone-900/10 bg-stone-900/10 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {temporaryNames.map((name, index) => (
              <article
                key={name}
                className="group relative flex min-h-[190px] flex-col items-center justify-center bg-[#f5ede1] px-3 py-5 transition duration-500 hover:z-10 hover:bg-[#fffaf2]"
              >
                <div className="transition duration-500 group-hover:-translate-y-1 group-hover:scale-110">
                  <PoetAvatar
                    index={index}
                    name={name}
                    size={94}
                  />
                </div>

                <p className="mt-4 font-serif text-sm text-stone-700">
                  {name}
                </p>

                <p className="mt-1 text-[6px] uppercase tracking-[0.27em] text-stone-400">
                  Poema Universal 2026
                </p>

                <span className="absolute right-3 top-3 font-serif text-xs italic text-stone-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
