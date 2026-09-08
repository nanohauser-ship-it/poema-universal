import Link from "next/link";

const collections = [
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
      className="relative mt-6 overflow-hidden rounded-[38px] border border-[#cfc1ad]/70 bg-[#f4ede2] text-[#17130f] shadow-[0_38px_100px_rgba(73,50,28,0.16)] sm:rounded-[52px]"
    >
      {/* ATMÓSFERA DE FONDO */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 12% 12%, rgba(255,255,255,0.85), transparent 34%), radial-gradient(circle at 48% 78%, rgba(187,145,80,0.09), transparent 32%), linear-gradient(145deg, #f8f2e9 0%, #f1e7da 100%)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(92,70,45,0.25) 0.45px, transparent 0.55px)",
          backgroundSize: "18px 18px",
        }}
      />

      <div className="relative grid lg:grid-cols-[1.05fr_0.95fr]">
        {/* =====================================================
            IZQUIERDA · EDITORIAL
        ===================================================== */}
        <div className="flex min-h-[650px] flex-col justify-between border-b border-[#bcae9b]/55 p-8 sm:p-12 lg:border-b-0 lg:border-r lg:p-16 xl:p-20">
          <div>
            <div className="flex items-center gap-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.46em] text-[#9b713d]">
                Tienda · Materia
              </p>

              <span
                aria-hidden="true"
                className="h-px w-20"
                style={{
                  background:
                    "linear-gradient(to right, rgba(155,113,61,0.75), transparent)",
                }}
              />
            </div>

            <div className="mt-10 flex items-center gap-3 text-[8px] uppercase tracking-[0.34em] text-stone-400">
              <span>Poema Universal</span>
              <span className="text-[#b08a55]">✦</span>
              <span>Ediciones</span>
            </div>

            <h2
              id="home-store-title"
              className="mt-10 max-w-3xl font-serif text-[58px] leading-[0.91] tracking-[-0.055em] sm:text-[76px] lg:text-[82px] xl:text-[94px]"
            >
              La obra
              <span className="mt-2 block italic font-normal text-[#a67a42]">
                toma forma.
              </span>
            </h2>

            <p className="mt-9 max-w-xl font-serif text-2xl leading-[1.35] text-[#3e352c] sm:text-[30px]">
              Libros, imágenes y objetos nacidos de una misma memoria.
            </p>

            <div className="my-10 flex max-w-xl items-center">
              <span className="h-px flex-1 bg-[#cdbfae]" />
              <span className="mx-5 text-[12px] text-[#a67a42]">✦</span>
              <span className="h-px flex-1 bg-[#cdbfae]" />
            </div>

            <p className="max-w-xl text-sm leading-8 text-[#6f6458] sm:text-[15px]">
              Cada pieza nace dentro del mismo universo de la obra. No como
              mercancía añadida, sino como una extensión física de aquello que
              merece permanecer: libros, imágenes, sonido y objetos concebidos
              con tiempo, materia y memoria.
            </p>

            <div className="mt-10">
              <Link
                href="/tienda"
                className="group inline-flex items-center justify-center bg-[#17130f] px-8 py-5 text-[9px] font-semibold uppercase tracking-[0.32em] text-[#dfbd83] shadow-[0_14px_35px_rgba(23,19,15,0.18)] transition duration-300 hover:-translate-y-1 hover:bg-[#0c0a08]"
              >
                Entrar en la tienda

                <span
                  aria-hidden="true"
                  className="ml-6 text-base transition-transform duration-300 group-hover:translate-x-1.5"
                >
                  →
                </span>
              </Link>
            </div>
          </div>

          <div className="mt-14">
            <p className="mb-5 text-[7px] uppercase tracking-[0.34em] text-[#998b7a]">
              Colecciones
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-4">
              {collections.map((collection) => (
                <span
                  key={collection}
                  className="text-[7px] uppercase tracking-[0.26em] text-[#71675c]"
                >
                  {collection}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* =====================================================
            DERECHA · VITRINA
        ===================================================== */}
        <div
          className="relative flex min-h-[620px] flex-col overflow-hidden bg-[#090a0a] p-7 text-[#eee4d5] sm:p-10 lg:min-h-[650px] lg:p-12"
          style={{
            background:
              "radial-gradient(circle at 50% 36%, rgba(190,145,76,0.15), transparent 30%), linear-gradient(145deg, #11110f 0%, #070807 55%, #11100d 100%)",
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.16]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
              backgroundSize: "34px 34px",
            }}
          />

          <div className="relative flex items-center justify-between">
            <p className="text-[7px] uppercase tracking-[0.38em] text-white/38">
              Archivo físico
            </p>

            <span
              aria-hidden="true"
              className="text-[11px] text-[#b68b4d]"
            >
              ✦
            </span>
          </div>

          {/* NICHO */}
          <div className="relative mt-8 flex flex-1 items-center justify-center">
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-[42%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px]"
              style={{
                backgroundColor: "rgba(194,148,79,0.17)",
              }}
            />

            <div className="relative flex h-[470px] w-full max-w-[390px] items-end justify-center overflow-hidden rounded-t-[190px] border border-[#a77c42]/30 bg-black/20 px-9 pb-14 shadow-[inset_0_0_90px_rgba(0,0,0,0.55)]">
              <div
                aria-hidden="true"
                className="absolute inset-[18px] rounded-t-[170px] border border-white/[0.055]"
              />

              <div
                aria-hidden="true"
                className="absolute left-1/2 top-0 h-28 w-px -translate-x-1/2"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(191,147,77,0.7), transparent)",
                }}
              />

              <span
                aria-hidden="true"
                className="absolute left-1/2 top-[72px] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#c59a58] shadow-[0_0_25px_rgba(197,154,88,0.8)]"
              />

              {/* LIBRO / RELIQUIA */}
              <div
                className="relative z-10 mb-5 h-[285px] w-[190px] border border-[#c8a56a]/30 bg-[#10100e] shadow-[25px_32px_45px_rgba(0,0,0,0.58)]"
                style={{
                  transform: "perspective(900px) rotateY(-7deg) rotateX(1deg)",
                  background:
                    "linear-gradient(115deg, #151511 0%, #090a09 70%, #181610 100%)",
                }}
              >
                <div className="absolute inset-[12px] border border-[#c8a56a]/16" />

                <div className="relative flex h-full flex-col items-center justify-center px-7 text-center">
                  <span className="mb-7 text-[11px] text-[#ba8d4f]">✦</span>

                  <p className="font-serif text-[27px] leading-[0.95] tracking-[0.04em] text-[#d9b775]">
                    POEMA
                  </p>

                  <p className="mt-1 font-serif text-[27px] leading-[0.95] tracking-[0.04em] text-[#d9b775]">
                    UNIVERSAL
                  </p>

                  <span className="my-7 h-px w-14 bg-[#9e7845]" />

                  <p className="text-[6px] uppercase tracking-[0.36em] text-white/34">
                    Edición fundacional
                  </p>
                </div>
              </div>

              {/* PEANA */}
              <div
                aria-hidden="true"
                className="absolute bottom-0 left-[8%] right-[8%] h-14 border-t border-[#c9b99f]/20"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(177,160,139,0.18), rgba(80,71,60,0.08))",
                }}
              />
            </div>
          </div>

          <div className="relative mt-7 text-center">
            <p className="text-[7px] uppercase tracking-[0.38em] text-[#b68b4d]">
              Primera pieza por llegar
            </p>

            <p className="mx-auto mt-4 max-w-sm font-serif text-lg italic leading-7 text-white/52">
              La estancia espera aquello que merezca permanecer en ella.
            </p>

            <span
              aria-hidden="true"
              className="mx-auto mt-5 block h-px w-16"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(182,139,77,0.65), transparent)",
              }}
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          PIE DE LA ESTANCIA
      ===================================================== */}
      <div className="relative flex flex-col gap-5 border-t border-[#b9aa96]/50 bg-[#eee4d6]/65 px-8 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-12 lg:px-16">
        <p className="text-[7px] uppercase tracking-[0.3em] text-[#75695c]">
          Libros · láminas · ediciones · objetos · archivo sonoro
        </p>

        <p className="font-serif text-sm italic text-[#786c5e]">
          Ninguna compra concede una voz.
        </p>
      </div>
    </section>
  );
}
