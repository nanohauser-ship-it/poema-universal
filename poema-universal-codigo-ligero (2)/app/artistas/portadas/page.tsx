import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";

export const metadata = {
  title: "Las 100 carátulas | Poema Universal",
  description:
    "Archivo visual de los cien artistas fundamentales de Poema Universal.",
};

function nombreDesdeArchivo(filename: string) {
  return filename
    .replace(/^AU-\d{3}-/, "")
    .replace(/\.webp$/i, "")
    .split("-")
    .map((word) =>
      word.length > 0
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word
    )
    .join(" ");
}

function codigoDesdeArchivo(filename: string) {
  return filename.match(/^AU-\d{3}/)?.[0] ?? "AU";
}

export default async function PortadasArtistasPage() {
  const directory = path.join(
    process.cwd(),
    "public",
    "artistas",
    "portadas"
  );

  let filenames: string[] = [];

  try {
    filenames = (await fs.readdir(directory))
      .filter((filename) => /^AU-\d{3}-.*\.webp$/i.test(filename))
      .sort((a, b) => {
        const numeroA = Number(a.slice(3, 6));
        const numeroB = Number(b.slice(3, 6));

        return numeroA - numeroB;
      });
  } catch (error) {
    console.error("No se pudieron leer las portadas:", error);
  }

  return (
    <main className="min-h-screen bg-[#050607] text-[#eee6d8]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050607]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-20 max-w-[1700px] items-center justify-between gap-8 px-5 sm:px-8 lg:px-12">
          <div>
            <p className="text-[8px] uppercase tracking-[0.42em] text-[#c7a467]">
              Poema Universal
            </p>

            <h1 className="mt-1 font-serif text-2xl tracking-[-0.03em]">
              Las 100 carátulas
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <p className="hidden text-[8px] uppercase tracking-[0.3em] text-white/35 sm:block">
              {filenames.length} portadas encontradas
            </p>

            <Link
              href="/artistas"
              className="border border-white/15 px-5 py-3 text-[8px] uppercase tracking-[0.28em] text-white/55 transition hover:border-[#c7a467]/60 hover:text-[#c7a467]"
            >
              Volver al Atlas
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1700px] px-5 py-16 sm:px-8 lg:px-12">
        <div className="mb-16 max-w-4xl">
          <p className="text-[9px] uppercase tracking-[0.5em] text-[#c7a467]">
            Archivo visual fundacional
          </p>

          <h2 className="mt-7 font-serif text-5xl leading-[0.95] tracking-[-0.055em] sm:text-7xl">
            Cien autores.
            <span className="block italic text-white/32">
              Cien universos.
            </span>
          </h2>

          <p className="mt-8 max-w-2xl text-sm leading-8 text-white/42">
            Una sala independiente para revisar, comparar y
            sustituir las carátulas sin alterar las fichas de
            Artistas Fundamentales.
          </p>
        </div>

        {filenames.length > 0 ? (
          <div className="grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filenames.map((filename) => {
              const codigo = codigoDesdeArchivo(filename);
              const nombre = nombreDesdeArchivo(filename);
              const src = `/artistas/portadas/${filename}`;

              return (
                <article key={filename} className="group">
                  <a
                    href={src}
                    target="_blank"
                    rel="noreferrer"
                    className="block"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden border border-white/10 bg-[#0b0c0e]">
                      <img
                        src={src}
                        alt={`Carátula de ${nombre}`}
                        className="h-full w-full object-contain object-center transition duration-700 group-hover:scale-[1.015]"
                        loading="lazy"
                      />
                    </div>

                    <div className="border-b border-white/10 pb-5 pt-5">
                      <div className="flex items-start justify-between gap-5">
                        <div>
                          <p className="text-[7px] uppercase tracking-[0.34em] text-[#c7a467]">
                            {codigo}
                          </p>

                          <h3 className="mt-3 font-serif text-2xl leading-none tracking-[-0.035em] text-[#eee6d8]">
                            {nombre}
                          </h3>
                        </div>

                        <span className="pt-1 text-lg text-[#c7a467]">
                          ↗
                        </span>
                      </div>

                      <p className="mt-4 truncate text-[7px] tracking-[0.12em] text-white/25">
                        {filename}
                      </p>
                    </div>
                  </a>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="border border-white/10 px-8 py-24 text-center">
            <p className="font-serif text-3xl text-white/45">
              No se encontraron carátulas.
            </p>

            <p className="mt-4 text-sm text-white/30">
              Comprueba la carpeta public/artistas/portadas.
            </p>
          </div>
        )}
      </section>

      <footer className="border-t border-white/10 px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1700px] justify-between gap-6">
          <p className="font-serif text-lg">
            Atlas Fundamental
          </p>

          <p className="text-[7px] uppercase tracking-[0.32em] text-white/25">
            Poema Universal
          </p>
        </div>
      </footer>
    </main>
  );
}
