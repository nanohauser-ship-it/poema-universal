import Link from "next/link";

export default function FundacionPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6f0e7] px-5 py-8 text-stone-900">
      <style>
        {`
          @keyframes driftSoft {
            0% { transform: translate3d(0, 0, 0) scale(1); opacity: .42; }
            50% { transform: translate3d(10px, -14px, 0) scale(1.03); opacity: .58; }
            100% { transform: translate3d(0, 0, 0) scale(1); opacity: .42; }
          }

          @keyframes pulseGlow {
            0% { opacity: .12; }
            50% { opacity: .22; }
            100% { opacity: .12; }
          }
        `}
      </style>

      {/* Fondo */}
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #f9f3eb 0%, #f3eadf 48%, #f8f1e8 100%)",
          }}
        />

        <div
          className="absolute left-[-220px] top-[8%] h-[620px] w-[620px] rounded-full bg-[#dbc6a5]/25 blur-3xl"
          style={{ animation: "driftSoft 18s ease-in-out infinite" }}
        />

        <div
          className="absolute right-[-260px] bottom-[2%] h-[720px] w-[720px] rounded-full bg-white/45 blur-3xl"
          style={{ animation: "driftSoft 22s ease-in-out infinite reverse" }}
        />

        <div
          className="absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(90,70,45,0.18) 0.6px, transparent 0.8px)",
            backgroundSize: "18px 18px",
            animation: "pulseGlow 14s ease-in-out infinite",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.42) 16%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.42) 84%, transparent 100%)",
          }}
        />

        <div className="absolute inset-0 bg-[#f6f0e7]/40" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <nav className="mb-24 flex flex-wrap items-center justify-between gap-4 rounded-full border border-stone-200/80 bg-white/60 px-5 py-3 shadow-sm backdrop-blur-xl">
          <Link href="/" className="text-sm font-semibold tracking-wide">
            Poema Universal
          </Link>

          <div className="flex flex-wrap items-center gap-5 text-sm text-stone-600">
            <Link href="/" className="transition hover:text-black">
              Inicio
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

            <Link href="/fundacion" className="font-medium text-black">
              Fundación
            </Link>
          </div>
        </nav>

        <header className="mx-auto max-w-3xl text-center">
          <p className="mb-8 text-[11px] uppercase tracking-[0.48em] text-stone-400">
            Fundación
          </p>

          <h1 className="font-serif text-5xl font-semibold leading-[1.08] tracking-tight text-stone-950 sm:text-6xl">
            Cuidar la palabra es cuidar
            <br />
            a quien la escribe.
          </h1>

          <p className="mx-auto mt-10 max-w-2xl text-[15px] leading-9 text-stone-600">
            Poema Universal nace como una casa emocional para quienes necesitan
            escribir, recordar, despedirse, agradecer o dejar algo de sí en un
            lugar bello, sereno y protegido.
          </p>
        </header>

        <section className="mx-auto mt-24 max-w-2xl border-y border-stone-300/60 py-16 text-center">
          <p className="font-serif text-3xl leading-[1.5] text-stone-800 sm:text-[2.3rem]">
            No queremos producir contenido.
            <br />
            Queremos custodiar gestos humanos.
          </p>

          <p className="mx-auto mt-10 max-w-xl text-sm leading-9 text-stone-600">
            Una vela no es un botón. Una carta no es un formulario. Una
            dedicatoria no es un comentario. Cada acción dentro de Poema
            Universal debe tener sentido, silencio y responsabilidad.
          </p>
        </section>

        <section className="mx-auto mt-20 max-w-2xl text-center">
          <p className="text-[11px] uppercase tracking-[0.42em] text-stone-400">
            Principio
          </p>

          <p className="mt-8 font-serif text-2xl leading-[1.6] text-stone-800 sm:text-3xl">
            Toda palabra vulnerable
            <br />
            merece un lugar seguro.
          </p>

          <p className="mx-auto mt-8 max-w-xl text-sm leading-9 text-stone-600">
            Esta fundación existe para defender eso: que una emoción, una
            memoria o una herida puedan encontrar una forma digna sin ser
            convertidas en ruido.
          </p>
        </section>

        <section className="mx-auto mt-24 max-w-4xl">
          <div className="grid gap-14 md:grid-cols-3">
            <div className="text-center md:text-left">
              <p className="mb-5 text-[11px] uppercase tracking-[0.36em] text-stone-400">
                Escribir
              </p>

              <p className="text-sm leading-8 text-stone-600">
                Para quien necesita dar forma a algo que todavía no sabe decir.
              </p>
            </div>

            <div className="text-center md:text-left">
              <p className="mb-5 text-[11px] uppercase tracking-[0.36em] text-stone-400">
                Recordar
              </p>

              <p className="text-sm leading-8 text-stone-600">
                Para quien no quiere que una presencia, una obra o un nombre
                desaparezcan del todo.
              </p>
            </div>

            <div className="text-center md:text-left">
              <p className="mb-5 text-[11px] uppercase tracking-[0.36em] text-stone-400">
                Refugiarse
              </p>

              <p className="text-sm leading-8 text-stone-600">
                Para quien solo necesita una habitación lenta donde respirar sin
                explicarse demasiado.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-32 max-w-3xl text-center">
          <p className="text-[11px] uppercase tracking-[0.48em] text-stone-400">
            Manifiesto
          </p>

          <div className="mt-12 space-y-7 font-serif text-3xl leading-[1.45] text-stone-900 sm:text-[2.45rem]">
            <p>La web pública será el museo.</p>
            <p>El usuario tendrá su habitación.</p>
            <p>El administrador cuidará la trastienda.</p>
          </div>

          <p className="mx-auto mt-12 max-w-xl text-sm leading-9 text-stone-600">
            Poema Universal no quiere ser grande por ocupar más espacio, sino
            por ofrecer un lugar donde algo humano pueda descansar sin perder
            su dignidad.
          </p>
        </section>

        <section className="mx-auto mt-32 max-w-3xl border-t border-stone-300/60 pt-20 text-center">
          <p className="font-serif text-[2rem] leading-[1.42] text-stone-900 sm:text-[2.7rem]">
            Aquí puede descansar una palabra.
            <br />
            Aquí puede guardarse una memoria.
            <br />
            Aquí puede empezar una forma de paz.
          </p>

          <div className="mt-14 flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="rounded-full bg-stone-950 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-stone-800"
            >
              Volver al inicio
            </Link>

            <Link
              href="/artistas"
              className="rounded-full border border-stone-300 bg-white/55 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-700 backdrop-blur transition hover:bg-white hover:text-black"
            >
              Ver artistas
            </Link>
          </div>
        </section>

        <footer className="mx-auto mt-28 max-w-xl pb-12 text-center">
          <p className="text-[11px] uppercase tracking-[0.42em] text-stone-400">
            Poema Universal · Fundación
          </p>
        </footer>
      </div>
    </main>
  );
}