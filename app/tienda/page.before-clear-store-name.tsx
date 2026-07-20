import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tienda | Poema Universal",
  description:
    "Libros, imágenes y objetos nacidos del universo de Poema Universal.",
};

const futureRooms = [
  {
    number: "01",
    title: "Los libros",
    description:
      "Las obras de José Naveiro y las futuras ediciones que nazcan dentro de este universo.",
  },
  {
    number: "02",
    title: "Poema Universal",
    description:
      "La edición fundacional de 2026 y los archivos materiales de cada año de escritura.",
  },
  {
    number: "03",
    title: "Obra gráfica",
    description:
      "Láminas, cartografías, símbolos, retratos y escenas nacidas de las obras.",
  },
  {
    number: "04",
    title: "Objetos del archivo",
    description:
      "Cuadernos, postales, marcapáginas, estuches y piezas concebidas para conservar memoria.",
  },
  {
    number: "05",
    title: "Imagen y sonido",
    description:
      "Lecturas, archivos sonoros, piezas audiovisuales y futuras ediciones digitales.",
  },
];

export default function StorePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f0e8dc] text-[#171411]">
      {/* NAVEGACIÓN */}

      <header className="sticky top-0 z-50 border-b border-stone-900/10 bg-[#f0e8dc]/94 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] max-w-[1380px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="font-serif text-xl tracking-[-0.025em] transition hover:opacity-55"
          >
            Poema Universal
          </Link>

          <p className="hidden text-[8px] uppercase tracking-[0.38em] text-stone-400 sm:block">
            Archivo material
          </p>

          <Link
            href="/"
            className="border border-stone-900/20 px-5 py-2.5 text-[8px] uppercase tracking-[0.3em] transition hover:bg-[#171411] hover:text-white"
          >
            Volver a la casa
          </Link>
        </div>
      </header>

      {/* VESTÍBULO */}

      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 18%, rgba(255,255,255,0.96), transparent 32%), radial-gradient(circle at 14% 78%, rgba(199,164,103,0.15), transparent 30%), linear-gradient(180deg, #f5eee5 0%, #eadfD1 100%)",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.065]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(70,48,29,0.58) 0.5px, transparent 0.7px)",
            backgroundSize: "19px 19px",
          }}
        />

        <div className="relative mx-auto max-w-[1380px] px-5 pb-24 pt-20 sm:px-8 sm:pb-32 sm:pt-28 lg:px-12 lg:pb-40">
          <div className="flex items-center gap-5">
            <span className="text-[9px] uppercase tracking-[0.48em] text-[#9a743e]">
              La habitación de los objetos
            </span>

            <span
              aria-hidden="true"
              className="h-px w-20"
              style={{
                background:
                  "linear-gradient(to right, rgba(154,116,62,0.62), transparent)",
              }}
            />
          </div>

          <h1 className="mt-12 max-w-6xl font-serif text-[4.7rem] leading-[0.84] tracking-[-0.065em] sm:text-[7.8rem] lg:text-[156px]">
            La obra
            <span className="block italic text-stone-500">
              adquiere cuerpo.
            </span>
          </h1>

          <div className="mt-14 grid gap-10 border-t border-stone-900/15 pt-10 md:grid-cols-[1fr_0.7fr] md:items-end">
            <p className="max-w-3xl font-serif text-2xl leading-[1.45] text-stone-700 sm:text-3xl">
              Libros, imágenes y objetos nacidos de una
              misma memoria.
            </p>

            <p className="max-w-md text-sm leading-8 text-stone-500 md:justify-self-end">
              La habitación está construida. Cada pieza
              aparecerá cuando haya sido concebida,
              producida y preparada con honestidad.
            </p>
          </div>
        </div>
      </section>

      {/* GRAN SALA VACÍA */}

      <section className="relative overflow-hidden bg-[#080b0e] text-[#f0e8dc]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 30%, rgba(199,164,103,0.14), transparent 25%), radial-gradient(circle at 12% 82%, rgba(100,122,139,0.1), transparent 32%), linear-gradient(145deg, #070a0d 0%, #0d1217 52%, #07090b 100%)",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(240,232,220,0.75) 0.5px, transparent 0.7px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative mx-auto max-w-[1380px] px-5 py-28 sm:px-8 sm:py-36 lg:px-12 lg:py-44">
          <div className="grid gap-16 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
            <div>
              <p className="text-[9px] uppercase tracking-[0.46em] text-[#c7a467]">
                Sala principal
              </p>

              <h2 className="mt-9 font-serif text-5xl leading-[0.98] tracking-[-0.05em] sm:text-7xl lg:text-[82px]">
                Todo está
                <span className="block italic text-white/42">
                  todavía por llegar.
                </span>
              </h2>

              <p className="mt-9 max-w-xl text-sm leading-8 text-white/46 sm:text-base">
                No mostraremos productos provisionales ni
                promesas vacías. Esta sala se irá ocupando
                únicamente con objetos reales vinculados a
                la obra.
              </p>
            </div>

            <div className="relative flex min-h-[520px] items-center justify-center border border-white/[0.13] px-7 py-16 sm:min-h-[620px]">
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-[22%] h-[250px] w-[250px] -translate-x-1/2 rounded-full blur-[90px]"
                style={{
                  backgroundColor:
                    "rgba(199,164,103,0.12)",
                }}
              />

              <div className="relative flex flex-col items-center text-center">
                <div className="relative flex h-52 w-40 items-center justify-center border border-white/[0.15] sm:h-64 sm:w-48">
                  <span
                    aria-hidden="true"
                    className="absolute inset-5 border border-white/[0.07]"
                  />

                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full bg-[#c7a467]"
                    style={{
                      boxShadow:
                        "0 0 26px rgba(199,164,103,0.66)",
                    }}
                  />
                </div>

                <span
                  aria-hidden="true"
                  className="h-16 w-px"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(199,164,103,0.64), transparent)",
                  }}
                />

                <p className="text-[8px] uppercase tracking-[0.38em] text-white/38">
                  Primera pieza pendiente
                </p>

                <p className="mt-5 max-w-sm font-serif text-xl italic leading-8 text-white/62">
                  La habitación espera aquello que merezca
                  permanecer en ella.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FUTURAS ESTANCIAS */}

      <section className="border-b border-stone-900/15">
        <div className="mx-auto max-w-[1380px] px-5 py-28 sm:px-8 sm:py-36 lg:px-12 lg:py-44">
          <div className="flex flex-col gap-8 border-b border-stone-900/15 pb-12 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[0.46em] text-[#9a743e]">
                Colecciones futuras
              </p>

              <h2 className="mt-8 max-w-4xl font-serif text-5xl leading-[1] tracking-[-0.05em] sm:text-7xl">
                Cinco estancias.
                <span className="block italic text-stone-500">
                  Una misma arquitectura.
                </span>
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-7 text-stone-500">
              Las colecciones se abrirán progresivamente.
              Ninguna necesita ser llenada antes de estar
              preparada.
            </p>
          </div>

          <ol className="grid border-l border-t border-stone-900/15 md:grid-cols-2 xl:grid-cols-5">
            {futureRooms.map((room) => (
              <li
                key={room.number}
                className="flex min-h-[340px] flex-col justify-between border-b border-r border-stone-900/15 p-7 sm:p-8"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="font-serif text-xl italic text-[#9a743e]">
                      {room.number}
                    </span>

                    <span className="h-2 w-2 rounded-full border border-stone-900/20" />
                  </div>

                  <h3 className="mt-12 font-serif text-3xl leading-tight tracking-[-0.035em]">
                    {room.title}
                  </h3>

                  <p className="mt-7 text-sm leading-7 text-stone-500">
                    {room.description}
                  </p>
                </div>

                <p className="mt-12 text-[7px] uppercase tracking-[0.3em] text-stone-400">
                  Estancia por abrir
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PRINCIPIO ÉTICO */}

      <section className="bg-[#e7dccd]">
        <div className="mx-auto max-w-[1380px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <div className="grid gap-12 border-y border-stone-900/15 py-14 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-[8px] uppercase tracking-[0.42em] text-[#9a743e]">
                Principio de la tienda
              </p>

              <p className="mt-8 max-w-4xl font-serif text-4xl leading-[1.12] tracking-[-0.04em] text-stone-800 sm:text-6xl">
                Cada objeto deberá pertenecer
                <span className="block italic text-stone-500">
                  verdaderamente a la obra.
                </span>
              </p>
            </div>

            <div className="max-w-md lg:text-right">
              <p className="text-sm leading-7 text-stone-600">
                Ninguna compra concederá una voz, una plaza
                o una decisión editorial dentro de Poema
                Universal.
              </p>

              <Link
                href="/poema-universal"
                className="mt-8 inline-flex border-b border-stone-900/25 pb-2 text-[8px] uppercase tracking-[0.3em] text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
              >
                Volver a la sala universal →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#080b0e] px-5 py-10 text-[#f0e8dc] sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1380px] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-lg">
            Tienda de Poema Universal
          </p>

          <p className="text-[7px] uppercase tracking-[0.32em] text-white/34">
            La habitación está preparada
          </p>
        </div>
      </footer>
    </main>
  );
}
