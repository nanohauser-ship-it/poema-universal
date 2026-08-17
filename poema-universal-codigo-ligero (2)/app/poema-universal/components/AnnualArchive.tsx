import Link from "next/link";

type ArchiveEdition = {
  year: string;
  status: "active" | "future";
  title: string;
  description: string;
  publication: string;
};

const editions: ArchiveEdition[] = [
  {
    year: "2026",
    status: "active",
    title: "Edición fundacional",
    description:
      "La primera construcción anual de Poema Universal: sesenta voces reunidas en una única obra internacional.",
    publication: "Presentación oficial · 1 de enero de 2027",
  },
  {
    year: "2027",
    status: "future",
    title: "Segunda edición",
    description:
      "Una nueva generación de voces continuará el archivo vivo iniciado por la edición fundacional.",
    publication: "Próxima apertura",
  },
  {
    year: "2028",
    status: "future",
    title: "Archivo futuro",
    description:
      "Cada año añadirá un nuevo volumen a la memoria literaria internacional de Poema Universal.",
    publication: "Edición futura",
  },
];

export default function AnnualArchive() {
  return (
    <section
      id="archivo-anual"
      className="relative mt-24 overflow-hidden rounded-[56px] border border-stone-200 bg-[#fffdf9] px-6 py-24 shadow-[0_40px_120px_rgba(62,45,29,0.08)] sm:px-10 lg:px-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[580px] w-[900px] -translate-x-1/2 rounded-full bg-[#d9bd8b]/20 blur-[140px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent_52%)]"
      />

      <div className="relative z-10">
        <header className="mx-auto max-w-4xl text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#9a7d4d] sm:text-xs">
            Biblioteca universal
          </p>

          <h2 className="mt-8 font-serif text-5xl tracking-[-0.04em] text-stone-950 sm:text-6xl lg:text-7xl">
            El archivo de
            <span className="block italic text-stone-500">
              todos los años
            </span>
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base sm:leading-8">
            Cada edición de Poema Universal permanecerá custodiada
            como un volumen independiente dentro de una biblioteca
            literaria en crecimiento.
          </p>
        </header>

        <div className="mt-20 grid gap-6 lg:grid-cols-[1.25fr_0.875fr_0.875fr]">
          {editions.map((edition) => {
            const isActive = edition.status === "active";

            return (
              <article
                key={edition.year}
                className={
                  isActive
                    ? "relative overflow-hidden rounded-[38px] border border-stone-900 bg-stone-950 p-8 text-white shadow-[0_30px_90px_rgba(0,0,0,0.18)] sm:p-10"
                    : "relative overflow-hidden rounded-[38px] border border-dashed border-stone-300 bg-white/55 p-8 text-stone-950 sm:p-10"
                }
              >
                {isActive && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute right-[-90px] top-[-100px] h-72 w-72 rounded-full bg-[#c7a968]/20 blur-[70px]"
                  />
                )}

                <div className="relative z-10 flex min-h-[360px] flex-col">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p
                        className={
                          isActive
                            ? "text-[9px] uppercase tracking-[0.34em] text-[#d7b66f]"
                            : "text-[9px] uppercase tracking-[0.34em] text-stone-400"
                        }
                      >
                        {isActive
                          ? "Volumen en construcción"
                          : "Volumen reservado"}
                      </p>

                      <p
                        className={
                          isActive
                            ? "mt-5 font-serif text-7xl tracking-[-0.05em] text-white"
                            : "mt-5 font-serif text-6xl tracking-[-0.05em] text-stone-300"
                        }
                      >
                        {edition.year}
                      </p>
                    </div>

                    <span
                      className={
                        isActive
                          ? "flex h-3 w-3 rounded-full bg-[#d7b66f] shadow-[0_0_22px_rgba(215,182,111,0.85)]"
                          : "flex h-3 w-3 rounded-full border border-stone-300"
                      }
                    />
                  </div>

                  <div className="mt-12">
                    <h3
                      className={
                        isActive
                          ? "font-serif text-3xl tracking-[-0.03em] text-white sm:text-4xl"
                          : "font-serif text-3xl tracking-[-0.03em] text-stone-500"
                      }
                    >
                      {edition.title}
                    </h3>

                    <p
                      className={
                        isActive
                          ? "mt-6 text-sm leading-7 text-white/50 sm:text-base sm:leading-8"
                          : "mt-6 text-sm leading-7 text-stone-400 sm:text-base sm:leading-8"
                      }
                    >
                      {edition.description}
                    </p>
                  </div>

                  <div className="mt-auto pt-12">
                    <div
                      className={
                        isActive
                          ? "border-t border-white/10 pt-6"
                          : "border-t border-stone-200 pt-6"
                      }
                    >
                      <p
                        className={
                          isActive
                            ? "text-[9px] uppercase leading-6 tracking-[0.28em] text-[#d7b66f]"
                            : "text-[9px] uppercase leading-6 tracking-[0.28em] text-stone-400"
                        }
                      >
                        {edition.publication}
                      </p>
                    </div>

                    {isActive ? (
                      <Link
                        href="#cronologia"
                        className="mt-7 inline-flex items-center gap-3 rounded-full border border-white/15 px-6 py-3 text-[9px] uppercase tracking-[0.3em] text-white/70 transition hover:border-[#d7b66f]/60 hover:text-[#d7b66f]"
                      >
                        Seguir el proceso
                        <span aria-hidden="true">→</span>
                      </Link>
                    ) : (
                      <span className="mt-7 inline-flex rounded-full border border-stone-200 px-6 py-3 text-[9px] uppercase tracking-[0.3em] text-stone-300">
                        Próximamente
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 grid gap-px overflow-hidden rounded-[32px] border border-stone-200 bg-stone-200 md:grid-cols-3">
          <div className="bg-white/75 px-7 py-7 text-center">
            <span className="block font-serif text-3xl text-stone-950">
              60
            </span>

            <span className="mt-3 block text-[9px] uppercase tracking-[0.3em] text-stone-400">
              Voces por edición
            </span>
          </div>

          <div className="bg-white/75 px-7 py-7 text-center">
            <span className="block font-serif text-3xl text-stone-950">
              1
            </span>

            <span className="mt-3 block text-[9px] uppercase tracking-[0.3em] text-stone-400">
              Obra colectiva anual
            </span>
          </div>

          <div className="bg-white/75 px-7 py-7 text-center">
            <span className="block font-serif text-3xl text-[#9a7d4d]">
              ∞
            </span>

            <span className="mt-3 block text-[9px] uppercase tracking-[0.3em] text-stone-400">
              Memoria futura
            </span>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-4xl border-t border-stone-200 pt-12 text-center">
          <p className="font-serif text-2xl italic leading-10 text-stone-600 sm:text-3xl">
            “El libro de un año no sustituirá al anterior.
            Se colocará a su lado para que el tiempo también pueda
            escribir.”
          </p>

          <p className="mt-7 text-[9px] uppercase tracking-[0.38em] text-[#9a7d4d]">
            Poema Universal · Archivo anual
          </p>
        </div>
      </div>
    </section>
  );
}