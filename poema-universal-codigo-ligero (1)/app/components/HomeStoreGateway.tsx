import Link from "next/link";

const futureCollections = [
  "Los libros",
  "Poema Universal 2026",
  "Obra gráfica",
  "Objetos del archivo",
  "Imagen y sonido",
];

export default function HomeStoreGateway() {
  return (
    <section
      aria-labelledby="home-store-title"
      className="relative mt-24 overflow-hidden rounded-[38px] border border-stone-900/15 bg-[#080b0e] text-[#f0e8dc] shadow-[0_35px_100px_rgba(46,29,17,0.2)] sm:rounded-[52px]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 18% 18%, rgba(199,164,103,0.16), transparent 28%), radial-gradient(circle at 82% 78%, rgba(112,132,148,0.1), transparent 32%), linear-gradient(145deg, #080b0e 0%, #0d1217 52%, #07090b 100%)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.065]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(240,232,220,0.72) 0.5px, transparent 0.7px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative grid lg:grid-cols-[1.04fr_0.96fr]">
        <div className="flex flex-col justify-between border-b border-white/[0.12] p-7 sm:p-11 lg:min-h-[610px] lg:border-b-0 lg:border-r lg:p-16">
          <div>
            <div className="flex items-center gap-5">
              <p
                className="text-[9px] uppercase tracking-[0.48em]"
                style={{ color: "#c7a467" }}
              >
                Tienda
              </p>

              <span
                aria-hidden="true"
                className="h-px w-20"
                style={{
                  background:
                    "linear-gradient(to right, rgba(199,164,103,0.64), transparent)",
                }}
              />
            </div>

            <h2
              id="home-store-title"
              className="mt-10 max-w-3xl font-serif text-5xl leading-[0.96] tracking-[-0.055em] sm:text-7xl lg:text-[84px]"
            >
              La obra
              <span className="block italic text-white/46">
                adquiere cuerpo.
              </span>
            </h2>

            <p className="mt-9 max-w-xl font-serif text-2xl leading-[1.35] text-white/72 sm:text-3xl">
              Libros, imágenes y objetos nacidos de una
              misma memoria.
            </p>

            <p className="mt-8 max-w-xl text-sm leading-8 text-white/44 sm:text-base">
              La tienda está construida. Sus estancias se
              abrirán cuando cada pieza haya sido concebida,
              producida y preparada con honestidad.
            </p>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-4">
              {futureCollections.map((collection) => (
                <span
                  key={collection}
                  className="text-[7px] uppercase tracking-[0.27em] text-white/36"
                >
                  {collection}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-14">
            <Link
              href="/tienda"
              className="group inline-flex items-center justify-center border border-[#c7a467] bg-[#c7a467] px-7 py-4 text-[8px] font-semibold uppercase tracking-[0.3em] text-[#080b0e] transition hover:-translate-y-0.5 hover:bg-[#d8bb86]"
            >
              Entrar en la tienda

              <span
                aria-hidden="true"
                className="ml-5 text-sm transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </div>

        <div className="relative flex min-h-[500px] items-center justify-center p-7 sm:p-12 lg:min-h-[610px]">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-[24%] h-[280px] w-[280px] -translate-x-1/2 rounded-full blur-[100px]"
            style={{
              backgroundColor: "rgba(199,164,103,0.13)",
            }}
          />

          <div className="relative flex flex-col items-center text-center">
            <div className="relative flex h-64 w-48 items-center justify-center border border-white/[0.16] sm:h-80 sm:w-60">
              <span
                aria-hidden="true"
                className="absolute inset-6 border border-white/[0.07]"
              />

              <span
                aria-hidden="true"
                className="absolute left-1/2 top-0 h-16 w-px -translate-x-1/2"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(199,164,103,0.64), transparent)",
                }}
              />

              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: "#c7a467",
                  boxShadow:
                    "0 0 28px rgba(199,164,103,0.7)",
                }}
              />
            </div>

            <span
              aria-hidden="true"
              className="h-14 w-px"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(199,164,103,0.6), transparent)",
              }}
            />

            <p className="text-[8px] uppercase tracking-[0.38em] text-white/34">
              Primera pieza por llegar
            </p>

            <p className="mt-5 max-w-sm font-serif text-xl italic leading-8 text-white/58">
              La estancia espera aquello que merezca
              permanecer en ella.
            </p>
          </div>
        </div>
      </div>

      <div className="relative flex flex-col gap-5 border-t border-white/[0.12] px-7 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-11 lg:px-16">
        <p className="text-[7px] uppercase tracking-[0.3em] text-white/34">
          Libros · láminas · ediciones · objetos · archivo sonoro
        </p>

        <p className="font-serif text-sm italic text-white/42">
          Ninguna compra concede una voz.
        </p>
      </div>
    </section>
  );
}
