import Link from "next/link";

export default function ObraPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f2e7d6] px-5 py-8 text-stone-950">
      <style>
        {`
          @keyframes altarGlow {
            0% { opacity: .22; transform: scale(1); }
            50% { opacity: .36; transform: scale(1.04); }
            100% { opacity: .22; transform: scale(1); }
          }

          @keyframes panelBreath {
            0% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0); }
          }

          .triptych-panel {
            border-radius: 999px 999px 34px 34px / 190px 190px 34px 34px;
          }

          .triptych-center {
            border-radius: 999px 999px 38px 38px / 240px 240px 38px 38px;
          }
        `}
      </style>

      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% -10%, rgba(255,255,255,.9), transparent 36%), linear-gradient(180deg, #f8efdf 0%, #ead9bf 48%, #f5ead8 100%)",
          }}
        />

        <div
          className="absolute left-[-250px] top-[6%] h-[720px] w-[720px] rounded-full bg-[#c9a66d]/25 blur-3xl"
          style={{ animation: "altarGlow 18s ease-in-out infinite" }}
        />

        <div
          className="absolute right-[-260px] bottom-[0%] h-[760px] w-[760px] rounded-full bg-white/40 blur-3xl"
          style={{ animation: "altarGlow 22s ease-in-out infinite reverse" }}
        />

        <div
          className="absolute inset-0 opacity-[0.09]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(68,48,27,0.22) 0.6px, transparent 0.85px)",
            backgroundSize: "18px 18px",
          }}
        />

        <div className="absolute inset-0 bg-[#f2e7d6]/30" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <nav className="mb-20 flex flex-wrap items-center justify-between gap-4 rounded-full border border-stone-200/80 bg-white/60 px-5 py-3 shadow-sm backdrop-blur-xl">
          <Link href="/" className="text-sm font-semibold tracking-wide">
            Poema Universal
          </Link>

          <div className="flex flex-wrap items-center gap-5 text-sm text-stone-600">
            <Link href="/" className="transition hover:text-black">
              Inicio
            </Link>

            <Link href="/fundacion" className="transition hover:text-black">
              Fundación
            </Link>

            <Link href="/artistas" className="transition hover:text-black">
              Artistas
            </Link>

            <Link href="/duelo" className="transition hover:text-black">
              Duelo
            </Link>

            <Link href="/rinconcito" className="transition hover:text-black">
              El Rinconcito
            </Link>

            <Link href="/obra" className="font-medium text-black">
              Obra
            </Link>
          </div>
        </nav>

        <header className="mx-auto max-w-4xl text-center">
          <p className="mb-8 text-[11px] uppercase tracking-[0.48em] text-stone-500">
            Obra
          </p>

          <h1 className="font-serif text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
            El tríptico de los que no desaparecen.
          </h1>

          <p className="mx-auto mt-10 max-w-2xl text-[15px] leading-9 text-stone-700">
            Tres obras forman una misma travesía: la raíz, el umbral y la
            ciudad. No son libros separados, sino tres paneles de una misma
            visión.
          </p>
        </header>

        <section className="mx-auto mt-24 max-w-3xl border-y border-stone-400/30 py-14 text-center">
          <p className="font-serif text-3xl leading-[1.5] text-stone-800 sm:text-[2.35rem]">
            La primera abre la herida.
            <br />
            La segunda desciende.
            <br />
            La tercera construye una ciudad.
          </p>
        </section>

        <section className="relative mt-28">
          <div className="mb-16 text-center">
            <p className="text-[10px] uppercase tracking-[0.58em] text-stone-500">
              Una obra · tres mundos
            </p>

            <h2 className="mx-auto mt-7 max-w-5xl font-serif text-4xl leading-[1.08] tracking-[-0.04em] text-stone-950 sm:text-6xl">
              El tríptico de los que
              <br />
              no desaparecen.
            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-sm leading-8 text-stone-700">
              Tres novelas nacidas de una misma pérdida y separadas por
              aquello que hicieron con ella.
            </p>
          </div>

          <div className="relative mx-auto max-w-[1280px]">
            <div
              aria-hidden="true"
              className="absolute -inset-x-8 -inset-y-10 bg-[radial-gradient(circle_at_50%_45%,rgba(90,59,31,0.13),transparent_48%)] blur-2xl"
            />

            <div className="relative grid items-end gap-0 lg:grid-cols-[1fr_1.08fr_1fr]">
              <article
                className="group relative min-h-[730px] overflow-hidden rounded-t-[46%] border-[3px] border-[#8f6f42] bg-[#281f18] shadow-[0_34px_95px_rgba(60,38,19,0.25)]"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-cover bg-center transition duration-[1400ms] group-hover:scale-[1.025]"
                  style={{
                    backgroundImage:
                      "url('/museo/desaparezcamos/maria-bajo-el-arbol-blanco.JPG')",
                  }}
                />

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,16,12,0.02)_0%,rgba(24,18,13,0.07)_46%,rgba(15,11,8,0.86)_100%)]" />

                <div className="absolute inset-[10px] border border-[#d8bc88]/55" />

                <div className="relative z-10 flex min-h-[730px] flex-col justify-end px-8 pb-10 pt-28 sm:px-10">
                  <p className="text-[9px] uppercase tracking-[0.5em] text-[#e2cba3]/76">
                    I · La memoria
                  </p>

                  <h3 className="mt-6 max-w-full font-serif text-[2.25rem] font-semibold leading-[0.96] tracking-[-0.04em] text-white sm:text-[2.85rem]">
                    No dejes que
                    <br />
                    desaparezcamos
                  </h3>

                  <div className="my-7 h-px w-full bg-[#d7bd91]/32" />

                  <p className="max-w-md text-sm leading-7 text-white/68">
                    Alejandro, María y Francisco habitan todavía un mundo
                    reconocible: una casa, una universidad, una amistad y un
                    árbol bajo el que la memoria aprende a resistir.
                  </p>

                  <p className="mt-9 font-serif text-2xl leading-[1.3] text-[#f0dfbf]">
                    El tronco conserva
                    <br />
                    la memoria.
                  </p>
                </div>
              </article>

              <article
                className="group relative z-10 min-h-[810px] overflow-hidden rounded-t-[43%] border-[4px] border-[#9e7338] bg-[#120c08] shadow-[0_48px_140px_rgba(0,0,0,0.46)] lg:-mx-1 lg:-translate-y-5"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-cover bg-center transition duration-[1400ms] group-hover:scale-[1.025]"
                  style={{
                    backgroundImage:
                      "url('/museo/jerarquia/teatro-de-la-jerarquia.JPG')",
                  }}
                />

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,5,4,0.03)_0%,rgba(12,7,5,0.08)_46%,rgba(8,4,3,0.9)_100%)]" />

                <div className="absolute inset-[11px] border border-[#d4a85f]/48" />

                <div className="relative z-10 flex min-h-[810px] flex-col justify-end px-9 pb-12 pt-32 text-center sm:px-11">
                  <p className="text-[9px] uppercase tracking-[0.52em] text-[#d5aa68]/80">
                    II · El hambre
                  </p>

                  <h3 className="mt-7 font-serif text-[3.15rem] font-semibold leading-[0.92] tracking-[-0.05em] text-white sm:text-[4.2rem]">
                    La Jerarquía
                    <br />
                    del Hambre
                  </h3>

                  <div className="mx-auto my-8 h-px w-32 bg-[#d1a052]/48" />

                  <p className="mx-auto max-w-md text-sm leading-7 text-white/62">
                    Karim, Sayonara, Adán y Atlas atraviesan un sistema donde
                    comer, amar y recordar dejan de ser actos privados. El
                    hambre organiza los cuerpos y decide quién puede seguir.
                  </p>

                  <p className="mx-auto mt-10 font-serif text-[2rem] leading-[1.24] text-[#ead3ad]">
                    Las raíces atraviesan
                    <br />
                    el hambre.
                  </p>
                </div>
              </article>

              <article
                className="group relative min-h-[730px] overflow-hidden rounded-t-[46%] border-[3px] border-[#708487] bg-[#172022] shadow-[0_34px_95px_rgba(40,57,60,0.28)]"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-cover bg-center transition duration-[1400ms] group-hover:scale-[1.025]"
                  style={{
                    backgroundImage:
                      "url('/museo/bielka/laberinto.JPG')",
                  }}
                />

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,17,18,0.01)_0%,rgba(13,19,21,0.07)_46%,rgba(7,11,12,0.88)_100%)]" />

                <div className="absolute inset-[10px] border border-[#adc1c1]/48" />

                <div className="relative z-10 flex min-h-[760px] flex-col justify-end px-8 pb-10 pt-28 sm:px-10">
                  <p className="text-[9px] uppercase tracking-[0.5em] text-[#bdd1d2]/72">
                    III · El laberinto
                  </p>

                  <h3 className="mt-6 font-serif text-[2.45rem] font-semibold leading-[0.96] tracking-[-0.04em] text-white sm:text-[3rem]">
                    Memorias
                    <br />
                    de Bielka
                  </h3>

                  <div className="my-7 h-px w-full bg-[#b5cbcc]/30" />

                  <p className="max-w-md text-sm leading-7 text-white/66">
                    Una niña despierta en un carro de paja. Ciudad B conserva
                    los nombres perdidos alrededor de un laberinto que todos
                    deberán aceptar atravesar.
                  </p>

                  <p className="mt-9 font-serif text-2xl leading-[1.3] text-[#d8e1dc]">
                    Las ramas entran
                    <br />
                    en el laberinto.
                  </p>
                </div>
              </article>
            </div>

            <div className="mt-11 flex items-center gap-5">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-stone-600/30" />

              <p className="text-center text-[8px] uppercase tracking-[0.46em] text-stone-500">
                Memoria · hambre · laberinto
              </p>

              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-stone-600/30" />
            </div>
          </div>
        </section>

        <section className="mx-auto mt-32 max-w-3xl border-t border-stone-400/30 pt-20 text-center">
          <p className="font-serif text-[2rem] leading-[1.42] text-stone-900 sm:text-[2.8rem]">
            Toda pérdida busca una ciudad
            <br />
            donde volver a nombrarse.
          </p>

          <p className="mx-auto mt-10 max-w-xl text-sm leading-9 text-stone-700">
            La obra no explica Poema Universal: lo sostiene. Debajo de cada
            vela, cada carta y cada luz pequeña, hay una misma pregunta: qué
            hacemos con aquello que no queremos que desaparezca.
          </p>

          <div className="mt-14 flex flex-wrap justify-center gap-4">
            <Link
              href="/fundacion"
              className="rounded-full bg-stone-950 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-stone-800"
            >
              Leer fundación
            </Link>

            <Link
              href="/"
              className="rounded-full border border-stone-300 bg-white/55 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-700 backdrop-blur transition hover:bg-white hover:text-black"
            >
              Volver al inicio
            </Link>
          </div>
        </section>

        <footer className="mx-auto mt-28 max-w-xl pb-12 text-center">
          <p className="text-[11px] uppercase tracking-[0.42em] text-stone-500">
            Poema Universal · Obra
          </p>
        </footer>
      </div>
    </main>
  );
}