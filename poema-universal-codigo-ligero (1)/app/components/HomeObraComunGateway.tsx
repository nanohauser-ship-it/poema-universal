import Link from "next/link";

export default function HomeObraComunGateway() {
  return (
    <section className="relative overflow-hidden bg-[#090c10] text-[#f0e8dc]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 78% 38%, rgba(199,164,103,0.15), transparent 30%), radial-gradient(circle at 16% 80%, rgba(71,91,105,0.16), transparent 32%), linear-gradient(145deg, #070a0d 0%, #0c1116 100%)",
        }}
      />

      <div className="relative mx-auto max-w-[1500px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          {/* TEXTO */}

          <div>
            <p className="text-[8px] uppercase tracking-[0.48em] text-[#c7a467]">
              La obra social de Poema Universal
            </p>

            <h2 className="mt-8 max-w-4xl font-serif text-5xl leading-[0.98] tracking-[-0.055em] sm:text-7xl lg:text-[86px]">
              La Obra
              <span className="block italic text-white/42">
                Común.
              </span>
            </h2>

            <p className="mt-9 max-w-2xl font-serif text-2xl leading-[1.42] text-white/72">
              La cultura no debe limitarse a contemplar el
              mundo. También puede ayudar a sostenerlo.
            </p>

            <p className="mt-7 max-w-xl text-sm leading-8 text-white/45">
              El primer proyecto social nacido dentro de
              Poema Universal comenzará junto a personas con
              parálisis cerebral, sus familias, profesionales
              y redes de cuidado.
            </p>

            <div className="mt-10 border-l border-[#c7a467]/40 pl-5">
              <p className="text-[7px] uppercase tracking-[0.3em] text-[#c7a467]">
                Proyecto fundacional
              </p>

              <p className="mt-3 font-serif text-lg italic leading-7 text-white/52">
                Asociación en gestación · autonomía,
                accesibilidad, creación y comunidad.
              </p>
            </div>

            <Link
              href="/obra-comun"
              className="mt-11 inline-flex border-b border-[#c7a467]/50 pb-2 text-[8px] uppercase tracking-[0.34em] text-[#c7a467] transition hover:border-[#c7a467] hover:text-[#e0c38e]"
            >
              Acercarse a la Mesa del Mundo →
            </Link>
          </div>

          {/* MESA EDITORIAL */}

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px]"
              style={{
                backgroundColor: "rgba(199,164,103,0.12)",
              }}
            />

            <div className="relative border border-white/10 bg-white/[0.025] p-5 shadow-[0_50px_130px_rgba(0,0,0,0.35)] sm:p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <p className="text-[7px] uppercase tracking-[0.32em] text-white/34">
                  La Mesa del Mundo
                </p>

                <span className="font-serif text-sm text-[#c7a467]">
                  01
                </span>
              </div>

              <div className="relative mt-8 aspect-[4/3] overflow-hidden">
                {/* TABLERO */}

                <div
                  aria-hidden="true"
                  className="absolute inset-[8%] rotate-[-2deg] border border-white/10 shadow-[0_35px_80px_rgba(0,0,0,0.45)]"
                  style={{
                    background:
                      "linear-gradient(135deg, #4e382a 0%, #74533c 48%, #3c2b21 100%)",
                  }}
                >
                  <span className="absolute left-[14%] top-0 h-full w-px bg-black/12" />
                  <span className="absolute left-[48%] top-0 h-full w-px bg-black/10" />
                  <span className="absolute left-[78%] top-0 h-full w-px bg-black/12" />

                  {/* PLATO */}

                  <span className="absolute left-[12%] top-[27%] h-[34%] w-[27%] rounded-full border-[9px] border-[#d9d0c2] bg-[#eee5d8] shadow-[0_15px_32px_rgba(0,0,0,0.32)]">
                    <span className="absolute inset-[26%] rounded-full border border-[#c7a467]/70" />
                    <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c7a467]" />
                  </span>

                  {/* CUCHARA */}

                  <span className="absolute left-[39%] top-[40%] h-[5px] w-[18%] rotate-[-5deg] rounded-full bg-[#c7a467] shadow-[0_5px_12px_rgba(0,0,0,0.25)]">
                    <span className="absolute -right-2 -top-[5px] h-4 w-5 rounded-full bg-[#c7a467]" />
                  </span>

                  {/* VELA */}

                  <span className="absolute right-[18%] top-[19%] h-[27%] w-[8%] bg-[#e8ddcc] shadow-[0_14px_25px_rgba(0,0,0,0.3)]">
                    <span className="absolute left-1/2 top-[-22px] h-7 w-4 -translate-x-1/2 rotate-45 rounded-[70%_30%_70%_30%] bg-[#e0b869] shadow-[0_0_25px_rgba(224,184,105,0.8)]" />
                  </span>

                  {/* CUADERNO */}

                  <span className="absolute bottom-[16%] left-[43%] h-[24%] w-[25%] rotate-[5deg] bg-[#111419] shadow-[0_16px_26px_rgba(0,0,0,0.35)]">
                    <span className="absolute inset-[5%] bg-[#ded3c2]" />
                    <span className="absolute left-[20%] top-[32%] h-px w-[45%] bg-[#9a743e]" />
                  </span>

                  {/* CARTA */}

                  <span className="absolute bottom-[14%] right-[8%] h-[20%] w-[22%] rotate-[-7deg] bg-[#e4d8c6] shadow-[0_13px_25px_rgba(0,0,0,0.32)]">
                    <span className="absolute left-[55%] top-[42%] h-5 w-5 rounded-full bg-[#a7814b]" />
                  </span>

                  {/* VASO */}

                  <span className="absolute left-[18%] top-[65%] h-[19%] w-[10%] rounded-b-[30%] border border-white/40 bg-[#bfd0d8]/20 shadow-[0_12px_20px_rgba(0,0,0,0.25)]">
                    <span className="absolute inset-x-[10%] bottom-[7%] h-[45%] bg-[#a9c2ce]/25" />
                  </span>

                  {/* SEMILLA */}

                  <span className="absolute left-[51%] top-[23%] h-4 w-7 rotate-[28deg] rounded-[100%_30%] bg-[#80633e]" />

                  {/* HILO */}

                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-[31%] top-0 w-px"
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent, rgba(199,164,103,0.7), transparent)",
                    }}
                  />
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[7px] uppercase tracking-[0.28em] text-white/34">
                  Plato · vela · cuaderno · carta · agua
                </p>

                <p className="font-serif text-sm italic text-white/42">
                  Cada objeto conserva una forma de cuidar.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PRINCIPIO */}

        <div className="mt-20 grid gap-7 border-t border-white/10 pt-8 sm:grid-cols-[auto_1fr] sm:items-center">
          <span className="font-serif text-4xl text-[#c7a467]">
            ♡
          </span>

          <p className="max-w-4xl font-serif text-xl italic leading-8 text-white/50">
            Crear con las personas, no hablar en su nombre.
            Escuchar antes de diseñar. Cuidar sin convertir
            ninguna vida en espectáculo.
          </p>
        </div>
      </div>
    </section>
  );
}
