import Link from "next/link";
import PoemaUniversalThreshold from "./components/PoemaUniversalThreshold";
import HomeObraComunGateway from "./components/HomeObraComunGateway";
import HomeThreeWorldsGateway from "./components/HomeThreeWorldsGateway";
import HomeMuseumGateway from "./components/HomeMuseumGateway";
import HomeSupportGateway from "./components/HomeSupportGateway";
import HomeStoreGateway from "./components/HomeStoreGateway";
export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6efe7] px-5 py-8 text-stone-950">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 8%, rgba(255,255,255,0.92), transparent 30%), radial-gradient(circle at 50% 42%, rgba(214,186,135,0.22), transparent 38%), linear-gradient(180deg, #fbf4eb 0%, #efe0cf 48%, #f8efe5 100%)",
          }}
        />

        <div className="absolute left-0 top-0 hidden h-full w-[22vw] min-w-[230px] max-w-[360px] overflow-hidden md:block">
          <video
            src="/flores.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover opacity-[0.58]"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, black 0%, black 48%, transparent 100%)",
              maskImage:
                "linear-gradient(to right, black 0%, black 48%, transparent 100%)",
            }}
          />
          <div className="absolute inset-0 bg-[#f6efe7]/25" />
        </div>

        <div className="absolute right-0 top-0 hidden h-full w-[22vw] min-w-[230px] max-w-[360px] overflow-hidden md:block">
          <video
            src="/flores.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full scale-x-[-1] object-cover opacity-[0.58]"
            style={{
              WebkitMaskImage:
                "linear-gradient(to left, black 0%, black 48%, transparent 100%)",
              maskImage:
                "linear-gradient(to left, black 0%, black 48%, transparent 100%)",
            }}
          />
          <div className="absolute inset-0 bg-[#f6efe7]/25" />
        </div>

        <div className="absolute left-1/2 top-[10%] h-[720px] w-[720px] -translate-x-1/2 rounded-full bg-white/35 blur-3xl" />
        <div className="absolute bottom-[-240px] left-1/2 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-[#d7b982]/18 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(70,48,29,0.24) 0.55px, transparent 0.75px)",
            backgroundSize: "18px 18px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <nav className="mb-16 flex flex-wrap items-center justify-between gap-4 rounded-full border border-stone-200/80 bg-white/68 px-5 py-3 shadow-sm backdrop-blur-xl">
          <Link href="/" className="text-sm font-semibold tracking-wide">
            Poema Universal
          </Link>

          <div className="flex flex-wrap items-center gap-5 text-sm text-stone-600">
            <Link href="/fundacion" className="transition hover:text-black">
              Fundación
            </Link>

            <Link href="/obra" className="transition hover:text-black">
              Obra
            </Link>

            <Link
              href="/poema-universal"
              className="transition hover:text-black"
            >
              Edición 2026
            </Link>

            <Link
              href="/obra-comun"
              className="transition hover:text-black"
            >
              Obra Común
            </Link>

            <Link
              href="/tienda"
              className="transition hover:text-black"
            >
              Tienda
            </Link>

            <Link href="/artistas" className="transition hover:text-black">
              Artistas
            </Link>

            <Link href="/cadena" className="transition hover:text-black">
              Cadena
            </Link>

            <Link href="/duelo" className="transition hover:text-black">
              Duelo
            </Link>

            <Link
              href="/mi-habitacion"
              className="rounded-full border border-stone-300 bg-white/75 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-700 transition hover:bg-stone-950 hover:text-white"
            >
              Mi Habitación
            </Link>
          </div>
        </nav>

        <header className="mx-auto max-w-6xl text-center">
          <p className="mb-7 text-[11px] uppercase tracking-[0.58em] text-stone-400">
            Una casa para lo que merece ser cuidado
          </p>

          <h1 className="font-serif text-[4.3rem] font-semibold leading-[0.9] tracking-tight text-stone-950 sm:text-[7.4rem] md:text-[9.2rem]">
            Poema
            <br />
            Universal
          </h1>

          <section className="relative mx-auto mt-8 max-w-4xl">
            <div className="absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/55 blur-3xl" />
            <div className="absolute left-1/2 top-[54%] h-[380px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c9a66b]/14 blur-3xl" />

            <div className="relative mx-auto flex min-h-[430px] max-w-3xl items-center justify-center rounded-[48px] border border-white/70 bg-white/28 px-6 py-8 shadow-[0_35px_100px_rgba(70,48,29,0.16)] backdrop-blur-[2px]">
              <div className="absolute inset-x-10 bottom-10 h-px bg-gradient-to-r from-transparent via-stone-400/35 to-transparent" />

              <div className="absolute bottom-12 left-1/2 h-28 w-[70%] -translate-x-1/2 rounded-full bg-stone-900/10 blur-3xl" />

              <img
                src="/icaro.png"
                alt="Ícaro, símbolo de Poema Universal"
                className="relative z-10 max-h-[420px] w-auto max-w-full object-contain drop-shadow-[0_38px_42px_rgba(54,36,21,0.28)]"
              />
            </div>

            <p className="mx-auto mt-8 max-w-2xl font-serif text-2xl leading-[1.45] text-stone-800 sm:text-3xl">
              Quien cae también puede dejar una luz en el aire.
            </p>
          </section>

          <p className="mx-auto mt-8 max-w-2xl text-[15px] leading-9 text-stone-600">
            Un lugar para escribir, recordar, despedirse, encender una luz y
            reunir las presencias que nos enseñaron a mirar el mundo de otra
            manera.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              href="/mi-habitacion"
              className="rounded-full bg-stone-950 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-white shadow-[0_18px_45px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-stone-800"
            >
              Entrar en Mi Habitación
            </Link>

            <Link
              href="/cadena"
              className="rounded-full border border-stone-300 bg-white/75 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:text-black"
            >
              Cadena del poema
            </Link>

            <Link
              href="/artistas"
              className="rounded-full border border-stone-300 bg-white/75 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:text-black"
            >
              Ver artistas
            </Link>
          </div>
        </header>

        <PoemaUniversalThreshold />

      <HomeThreeWorldsGateway />

      <HomeMuseumGateway />

        <HomeObraComunGateway />

        <section className="mx-auto mt-28 max-w-4xl border-y border-stone-300/70 py-16 text-center">
          <p className="font-serif text-3xl leading-[1.45] text-stone-800 sm:text-5xl">
            No todo lo que se pierde desaparece.
            <br />
            A veces solo necesita una casa.
          </p>

          <p className="mx-auto mt-9 max-w-2xl text-sm leading-9 text-stone-600">
            Poema Universal nace como una arquitectura emocional: una zona
            abierta para compartir belleza y una zona íntima para guardar lo que
            no debe quedar a la intemperie.
          </p>
        </section>

        <HomeSupportGateway />

        <HomeStoreGateway />

        <section className="mt-24 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/fundacion"
            className="group rounded-[34px] border border-stone-200/90 bg-white/62 p-8 shadow-[0_20px_55px_rgba(70,48,29,0.08)] backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/85"
          >
            <p className="text-xs uppercase tracking-[0.34em] text-stone-400">
              Manifiesto
            </p>

            <h2 className="mt-6 font-serif text-3xl">Fundación</h2>

            <p className="mt-5 text-sm leading-8 text-stone-600">
              El origen, la intención y la promesa profunda de Poema Universal.
            </p>

            <span className="mt-7 inline-flex text-[11px] uppercase tracking-[0.25em] text-stone-400 transition group-hover:text-stone-800">
              Entrar
            </span>
          </Link>

          <Link
            href="/obra"
            className="group rounded-[34px] border border-stone-200/90 bg-white/62 p-8 shadow-[0_20px_55px_rgba(70,48,29,0.08)] backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/85"
          >
            <p className="text-xs uppercase tracking-[0.34em] text-stone-400">
              Tríptico
            </p>

            <h2 className="mt-6 font-serif text-3xl">Obra</h2>

            <p className="mt-5 text-sm leading-8 text-stone-600">
              El Árbol Blanco, La Jerarquía del Hambre y Memorias de Bielka:
              tres puertas de una misma búsqueda.
            </p>

            <span className="mt-7 inline-flex text-[11px] uppercase tracking-[0.25em] text-stone-400 transition group-hover:text-stone-800">
              Entrar
            </span>
          </Link>

          <Link
            href="/artistas"
            className="group rounded-[34px] border border-stone-200/90 bg-white/62 p-8 shadow-[0_20px_55px_rgba(70,48,29,0.08)] backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/85"
          >
            <p className="text-xs uppercase tracking-[0.34em] text-stone-400">
              Influencias
            </p>

            <h2 className="mt-6 font-serif text-3xl">
              Artistas Fundamentales
            </h2>

            <p className="mt-5 text-sm leading-8 text-stone-600">
              Voces, imágenes, músicas y presencias que abrieron una forma de
              mirar.
            </p>

            <span className="mt-7 inline-flex text-[11px] uppercase tracking-[0.25em] text-stone-400 transition group-hover:text-stone-800">
              Entrar
            </span>
          </Link>

          <Link
            href="/cadena"
            className="group rounded-[34px] border border-stone-200/90 bg-white/62 p-8 shadow-[0_20px_55px_rgba(70,48,29,0.08)] backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/85"
          >
            <p className="text-xs uppercase tracking-[0.34em] text-stone-400">
              Poema colectivo
            </p>

            <h2 className="mt-6 font-serif text-3xl">
              Cadena del Poema Universal
            </h2>

            <p className="mt-5 text-sm leading-8 text-stone-600">
              Una línea humana detrás de otra. Un poema escrito entre todos,
              verso a verso.
            </p>

            <span className="mt-7 inline-flex text-[11px] uppercase tracking-[0.25em] text-stone-400 transition group-hover:text-stone-800">
              Entrar
            </span>
          </Link>

          <Link
            href="/cartas"
            className="group rounded-[34px] border border-stone-200/90 bg-white/62 p-8 shadow-[0_20px_55px_rgba(70,48,29,0.08)] backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/85"
          >
            <p className="text-xs uppercase tracking-[0.34em] text-stone-400">
              Cartas públicas
            </p>

            <h2 className="mt-6 font-serif text-3xl">Cartas</h2>

            <p className="mt-5 text-sm leading-8 text-stone-600">
              Un espacio para escribir a quienes todavía permanecen dentro de
              nosotros.
            </p>

            <span className="mt-7 inline-flex text-[11px] uppercase tracking-[0.25em] text-stone-400 transition group-hover:text-stone-800">
              Entrar
            </span>
          </Link>

          <Link
            href="/duelo"
            className="group rounded-[34px] border border-stone-200/90 bg-white/62 p-8 shadow-[0_20px_55px_rgba(70,48,29,0.08)] backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/85"
          >
            <p className="text-xs uppercase tracking-[0.34em] text-stone-400">
              Memoria
            </p>

            <h2 className="mt-6 font-serif text-3xl">Duelo</h2>

            <p className="mt-5 text-sm leading-8 text-stone-600">
              Una sala para acompañar la pérdida sin convertirla en silencio.
            </p>

            <span className="mt-7 inline-flex text-[11px] uppercase tracking-[0.25em] text-stone-400 transition group-hover:text-stone-800">
              Entrar
            </span>
          </Link>

          <Link
            href="/mi-habitacion"
            className="group rounded-[34px] bg-stone-950 p-8 text-white shadow-[0_24px_70px_rgba(0,0,0,0.22)] transition hover:-translate-y-1 hover:bg-stone-800 md:col-span-2 lg:col-span-3"
          >
            <p className="text-xs uppercase tracking-[0.34em] text-stone-400">
              Privado
            </p>

            <h2 className="mt-6 font-serif text-3xl">Mi Habitación</h2>

            <p className="mt-5 max-w-2xl text-sm leading-8 text-stone-300">
              Poemas, cartas, velas, rincón y recuerdos guardados con
              cerradura. La casa íntima dentro de la casa pública.
            </p>

            <span className="mt-7 inline-flex text-[11px] uppercase tracking-[0.25em] text-stone-400 transition group-hover:text-white">
              Entrar
            </span>
          </Link>
        </section>

        <section className="mt-24 overflow-hidden rounded-[42px] border border-stone-200/80 bg-[#fffaf3]/88 shadow-[0_25px_70px_rgba(70,48,29,0.11)]">
          <div className="grid gap-0 lg:grid-cols-[1fr_1.2fr]">
            <div className="border-b border-stone-200/80 p-8 lg:border-b-0 lg:border-r">
              <p className="text-xs uppercase tracking-[0.34em] text-stone-400">
                Estado de la casa
              </p>

              <h2 className="mt-5 font-serif text-4xl font-semibold leading-tight">
                Una obra abierta con una habitación privada.
              </h2>
            </div>

            <div className="grid gap-5 p-8 text-sm leading-8 text-stone-600 md:grid-cols-2">
              <p>
                La parte pública reúne la Fundación, la Obra, los Artistas y las
                salas compartidas del proyecto.
              </p>

              <p>
                La Cadena del Poema Universal permite que distintas personas
                escriban un poema común, verso a verso.
              </p>

              <p>
                La parte privada permite guardar poemas, cartas, velas, estados
                íntimos y recuerdos sin exponerlos al mundo.
              </p>

              <p>
                El cuarto de llaves cuida la casa: modera, ordena y protege lo
                que debe permanecer limpio.
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-28 pb-10 text-center">
          <p className="text-xs uppercase tracking-[0.42em] text-stone-400">
            Poema Universal
          </p>

          <p className="mx-auto mt-4 max-w-xl text-xs leading-7 text-stone-500">
            Una casa para lo que merece ser cuidado.
          </p>

          <Link
            href="/admin"
            className="mt-6 inline-flex text-[10px] uppercase tracking-[0.32em] text-stone-400 transition hover:text-stone-700"
          >
            Administración
          </Link>
        </footer>
      </div>
    </main>
  );
}