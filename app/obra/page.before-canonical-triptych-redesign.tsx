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

        <section className="mt-24">
          <div className="grid items-end gap-4 lg:grid-cols-[0.92fr_1.16fr_0.92fr]">
            <article
              className="triptych-panel relative min-h-[620px] overflow-hidden border-[3px] border-[#b59661] bg-[#f8edda] p-8 pt-28 shadow-[0_28px_80px_rgba(70,48,29,0.18)]"
              style={{ animation: "panelBreath 10s ease-in-out infinite" }}
            >
              <div className="absolute inset-3 triptych-panel border border-[#e7d1a7]/70" />

              <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,.85),transparent_62%)]" />

              <div className="absolute inset-x-0 top-28 h-36 bg-[linear-gradient(180deg,rgba(135,174,180,.36),rgba(226,202,155,.28),transparent)]" />

              <div className="absolute bottom-0 left-0 right-0 h-56 bg-[radial-gradient(circle_at_30%_70%,rgba(104,119,75,.22),transparent_34%),radial-gradient(circle_at_80%_60%,rgba(176,139,85,.22),transparent_32%)]" />

              <div className="relative z-10">
                <p className="text-[11px] uppercase tracking-[0.42em] text-stone-500">
                  I · La raíz
                </p>

                <h2 className="mt-8 font-serif text-4xl font-semibold leading-tight">
                  El cuaderno
                  <br />
                  del árbol blanco
                </h2>

                <p className="mt-6 text-sm italic leading-8 text-stone-600">
                  La primera escritura. La vida concreta. La herida amorosa. La
                  raíz humana antes del descenso.
                </p>

                <div className="my-8 h-px w-full bg-[#b59661]/45" />

                <p className="text-sm leading-8 text-stone-700">
                  Aquí empieza todo: en las páginas donde alguien intenta
                  ordenar una pérdida antes de que la pérdida se convierta en
                  mundo.
                </p>

                <p className="mt-10 font-serif text-xl leading-[1.5] text-stone-800">
                  La realidad todavía conserva
                  <br />
                  la forma de una casa.
                </p>
              </div>
            </article>

            <article
              className="triptych-center relative min-h-[720px] overflow-hidden border-[4px] border-[#a87f45] bg-[#211b16] p-9 pt-36 text-white shadow-[0_35px_95px_rgba(0,0,0,0.28)]"
              style={{ animation: "panelBreath 12s ease-in-out infinite" }}
            >
              <div className="absolute inset-3 triptych-center border border-[#d0a86a]/55" />

              <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_50%_0%,rgba(226,186,111,.32),transparent_62%)]" />

              <div className="absolute inset-x-0 top-32 h-40 bg-[linear-gradient(180deg,rgba(54,82,95,.32),rgba(74,56,38,.3),transparent)]" />

              <div className="absolute bottom-0 left-0 right-0 h-72 bg-[radial-gradient(circle_at_50%_70%,rgba(155,108,51,.22),transparent_35%),radial-gradient(circle_at_18%_64%,rgba(255,255,255,.08),transparent_28%)]" />

              <div className="relative z-10 text-center">
                <p className="text-[11px] uppercase tracking-[0.42em] text-stone-400">
                  II · El umbral
                </p>

                <h2 className="mt-8 font-serif text-5xl font-semibold leading-tight">
                  La Jerarquía
                  <br />
                  del Hambre
                </h2>

                <p className="mx-auto mt-7 max-w-md text-sm italic leading-8 text-stone-400">
                  El descenso. La antesala. El cuerpo del dolor. La memoria
                  herida atravesada por amor.
                </p>

                <div className="mx-auto my-9 h-px w-28 bg-[#c79b5d]/60" />

                <p className="mx-auto max-w-md text-sm leading-8 text-stone-300">
                  Es el lugar donde la pérdida se vuelve hambre, donde el amor
                  baja a buscar lo que todavía puede salvarse.
                </p>

                <p className="mx-auto mt-12 max-w-sm font-serif text-2xl leading-[1.45] text-stone-100">
                  Toda travesía necesita
                  <br />
                  un corazón oscuro
                  <br />
                  que la atraviese.
                </p>
              </div>
            </article>

            <article
              className="triptych-panel relative min-h-[620px] overflow-hidden border-[3px] border-[#b59661] bg-[#f8edda] p-8 pt-28 shadow-[0_28px_80px_rgba(70,48,29,0.18)]"
              style={{ animation: "panelBreath 11s ease-in-out infinite" }}
            >
              <div className="absolute inset-3 triptych-panel border border-[#e7d1a7]/70" />

              <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,.85),transparent_62%)]" />

              <div className="absolute inset-x-0 top-28 h-36 bg-[linear-gradient(180deg,rgba(139,180,178,.32),rgba(231,203,156,.28),transparent)]" />

              <div className="absolute bottom-0 left-0 right-0 h-56 bg-[radial-gradient(circle_at_28%_65%,rgba(105,125,88,.2),transparent_34%),radial-gradient(circle_at_82%_62%,rgba(194,154,92,.2),transparent_32%)]" />

              <div className="relative z-10">
                <p className="text-[11px] uppercase tracking-[0.42em] text-stone-500">
                  III · La ciudad
                </p>

                <h2 className="mt-8 font-serif text-4xl font-semibold leading-tight">
                  Memorias
                  <br />
                  de Bielka
                </h2>

                <p className="mt-6 text-sm italic leading-8 text-stone-600">
                  La ciudad-puerta. La reparación. El archivo de los heridos.
                  El lugar donde nadie desaparece del todo.
                </p>

                <div className="my-8 h-px w-full bg-[#b59661]/45" />

                <p className="text-sm leading-8 text-stone-700">
                  Bielka no se inventa: se encuentra. Es la ciudad donde las
                  cosas perdidas reciben nombre, tribu, memoria y una última
                  forma de dignidad.
                </p>

                <p className="mt-10 font-serif text-xl leading-[1.5] text-stone-800">
                  La memoria se vuelve
                  <br />
                  arquitectura.
                </p>
              </div>
            </article>
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