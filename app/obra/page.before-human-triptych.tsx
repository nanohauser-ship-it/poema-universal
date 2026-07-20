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
          <div
            aria-hidden="true"
            className="absolute -inset-x-10 -inset-y-20 rounded-[80px] bg-[radial-gradient(circle_at_50%_42%,rgba(116,78,42,0.18),transparent_36%),linear-gradient(180deg,rgba(48,35,25,0.04),rgba(48,35,25,0.12),rgba(48,35,25,0.03))] blur-[2px]"
          />

          <div className="relative mb-14 text-center">
            <p className="text-[10px] uppercase tracking-[0.58em] text-stone-500">
              Una obra · tres mundos
            </p>

            <p className="mx-auto mt-6 max-w-3xl font-serif text-3xl leading-[1.35] text-stone-800 sm:text-5xl">
              El tronco conserva la memoria.
              <br />
              Las raíces atraviesan el hambre.
              <br />
              Las ramas entran en el laberinto.
            </p>
          </div>

          <div className="relative grid items-end gap-5 lg:grid-cols-[0.94fr_1.12fr_0.94fr]">
            <article className="group relative min-h-[680px] overflow-hidden rounded-t-[110px] border-[3px] border-[#9f7a48] bg-[#eee2cc] p-8 pt-28 shadow-[0_40px_110px_rgba(74,49,25,0.24)] transition duration-700 hover:-translate-y-3 hover:shadow-[0_55px_140px_rgba(74,49,25,0.32)] sm:p-10 sm:pt-32">
              <div className="absolute inset-3 rounded-t-[96px] border border-[#ddc596]/75" />

              <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.95),transparent_65%)]" />

              <div className="absolute inset-x-0 top-32 h-44 bg-[linear-gradient(180deg,rgba(122,163,169,0.34),rgba(218,189,139,0.25),transparent)]" />

              <div className="absolute bottom-0 left-0 right-0 h-72 bg-[radial-gradient(circle_at_28%_68%,rgba(93,113,70,0.25),transparent_34%),radial-gradient(circle_at_82%_62%,rgba(181,137,79,0.24),transparent_34%)]" />

              <span
                aria-hidden="true"
                className="absolute right-8 top-20 font-serif text-[150px] leading-none text-[#8f6b3d]/[0.07]"
              >
                I
              </span>

              <div className="relative z-10 flex min-h-[515px] flex-col">
                <p className="text-[10px] uppercase tracking-[0.48em] text-stone-500">
                  I · La memoria
                </p>

                <h2 className="mt-9 max-w-sm font-serif text-[2.65rem] font-semibold leading-[0.98] tracking-[-0.045em] text-stone-950 sm:text-5xl">
                  No dejes que
                  <br />
                  desaparezcamos
                </h2>

                <p className="mt-8 text-sm italic leading-8 text-stone-600">
                  La vida concreta. La amistad. La herida amorosa. El lugar
                  donde una pérdida comienza a convertirse en memoria.
                </p>

                <div className="my-9 h-px w-full bg-[#987443]/40" />

                <p className="text-sm leading-8 text-stone-700">
                  Alejandro, María y Francisco habitan el mundo anterior al
                  descenso: la casa, la universidad, el Árbol Blanco y todo
                  aquello que todavía puede perderse.
                </p>

                <p className="mt-auto pt-12 font-serif text-2xl leading-[1.38] text-stone-850">
                  El tronco conserva
                  <br />
                  la memoria.
                </p>
              </div>
            </article>

            <article className="group relative z-10 min-h-[790px] overflow-hidden rounded-t-[125px] border-[4px] border-[#a87f45] bg-[#0d0b0a] p-9 pt-36 text-white shadow-[0_55px_150px_rgba(0,0,0,0.46)] transition duration-700 hover:-translate-y-5 hover:shadow-[0_70px_180px_rgba(0,0,0,0.58)] lg:-translate-y-8 sm:p-12 sm:pt-40">
              <div className="absolute inset-3 rounded-t-[108px] border border-[#d0a86a]/50" />

              <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_50%_0%,rgba(225,181,104,0.34),transparent_64%)]" />

              <div className="absolute inset-x-0 top-36 h-52 bg-[linear-gradient(180deg,rgba(46,72,82,0.35),rgba(88,57,36,0.32),transparent)]" />

              <div className="absolute bottom-0 left-0 right-0 h-[380px] bg-[radial-gradient(circle_at_50%_72%,rgba(145,80,48,0.28),transparent_36%),radial-gradient(circle_at_18%_70%,rgba(255,255,255,0.07),transparent_30%)]" />

              <span
                aria-hidden="true"
                className="absolute right-8 top-24 font-serif text-[180px] leading-none text-white/[0.035]"
              >
                II
              </span>

              <div className="relative z-10 flex min-h-[590px] flex-col text-center">
                <p className="text-[10px] uppercase tracking-[0.5em] text-[#c49b66]">
                  II · El hambre
                </p>

                <h2 className="mt-10 font-serif text-5xl font-semibold leading-[0.94] tracking-[-0.05em] sm:text-6xl">
                  La Jerarquía
                  <br />
                  del Hambre
                </h2>

                <p className="mx-auto mt-9 max-w-md text-sm italic leading-8 text-stone-400">
                  El descenso. La antesala. El cuerpo sometido. La memoria
                  atravesada por el hambre y por aquello que todavía ama.
                </p>

                <div className="mx-auto my-10 h-px w-32 bg-[#c79b5d]/60" />

                <p className="mx-auto max-w-md text-sm leading-8 text-stone-300">
                  Aquí la pérdida deja de ser recuerdo y se convierte en
                  sistema, doctrina y distribución desigual de la vida.
                </p>

                <p className="mx-auto mt-auto max-w-sm pt-14 font-serif text-3xl leading-[1.3] text-stone-100">
                  Las raíces atraviesan
                  <br />
                  el hambre.
                </p>
              </div>
            </article>

            <article className="group relative min-h-[680px] overflow-hidden rounded-t-[110px] border-[3px] border-[#799092] bg-[#e7e4d9] p-8 pt-28 shadow-[0_40px_110px_rgba(51,71,73,0.22)] transition duration-700 hover:-translate-y-3 hover:shadow-[0_55px_140px_rgba(51,71,73,0.3)] sm:p-10 sm:pt-32">
              <div className="absolute inset-3 rounded-t-[96px] border border-[#b9cbca]/70" />

              <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.92),transparent_65%)]" />

              <div className="absolute inset-x-0 top-32 h-44 bg-[linear-gradient(180deg,rgba(109,154,158,0.38),rgba(187,205,198,0.22),transparent)]" />

              <div className="absolute bottom-0 left-0 right-0 h-72 bg-[radial-gradient(circle_at_24%_68%,rgba(69,99,98,0.24),transparent_35%),radial-gradient(circle_at_82%_64%,rgba(180,156,108,0.2),transparent_34%)]" />

              <span
                aria-hidden="true"
                className="absolute right-8 top-20 font-serif text-[150px] leading-none text-[#547477]/[0.07]"
              >
                III
              </span>

              <div className="relative z-10 flex min-h-[515px] flex-col">
                <p className="text-[10px] uppercase tracking-[0.48em] text-[#526d70]">
                  III · El laberinto
                </p>

                <h2 className="mt-9 font-serif text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.045em] text-stone-950 sm:text-5xl">
                  Memorias
                  <br />
                  de Bielka
                </h2>

                <p className="mt-8 text-sm italic leading-8 text-stone-600">
                  La ciudad-puerta. La fiebre. El archivo de los heridos. El
                  lugar donde los nombres regresan desde el olvido.
                </p>

                <div className="my-9 h-px w-full bg-[#668184]/40" />

                <p className="text-sm leading-8 text-stone-700">
                  Bielka no se inventa: se encuentra. Es la ciudad levantada
                  alrededor del laberinto, donde toda memoria debe atravesar
                  una última puerta.
                </p>

                <p className="mt-auto pt-12 font-serif text-2xl leading-[1.38] text-stone-850">
                  Las ramas entran
                  <br />
                  en el laberinto.
                </p>
              </div>
            </article>
          </div>

          <div className="relative mx-auto mt-12 flex max-w-5xl items-center gap-5">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-stone-500/35" />
            <p className="text-center text-[9px] uppercase tracking-[0.48em] text-stone-500">
              Memoria · hambre · laberinto
            </p>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-stone-500/35" />
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