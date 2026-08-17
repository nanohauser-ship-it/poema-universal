import Link from "next/link";
import PoemaUniversalThreshold from "./components/PoemaUniversalThreshold";
import HomeObraComunGateway from "./components/HomeObraComunGateway";
import HomeSupportGateway from "./components/HomeSupportGateway";
import HomeStoreGateway from "./components/HomeStoreGateway";

const salasAbiertas = [
  {
    eyebrow: "Influencias",
    title: "Artistas Fundamentales",
    description:
      "Voces, imágenes, músicas y presencias que abrieron una forma de mirar.",
    href: "/artistas",
  },
  {
    eyebrow: "Poema colectivo",
    title: "Cadena del Poema Universal",
    description:
      "Una línea humana detrás de otra. Un poema escrito entre todos, verso a verso.",
    href: "/cadena",
  },
  {
    eyebrow: "Cartas públicas",
    title: "Cartas",
    description:
      "Un espacio para escribir a quienes todavía permanecen dentro de nosotros.",
    href: "/cartas",
  },
  {
    eyebrow: "Memoria",
    title: "Duelo",
    description:
      "Una sala para acompañar la pérdida sin convertirla en silencio.",
    href: "/duelo",
  },
  {
    eyebrow: "Archivo sonoro",
    title: "Coro de la Tierra",
    description:
      "Voces, lenguas y respiraciones reunidas en una constelación audible.",
    href: "/poema-universal/coro-de-la-tierra",
  },
  {
    eyebrow: "Arquitectura colectiva",
    title: "Encadenamiento",
    description:
      "La columna de las voces: poetas, institutos y libros enlazados.",
    href: "/poema-universal/encadenamiento",
  },
  {
    eyebrow: "Taller literario",
    title: "Herramientas Literarias",
    description:
      "Matriz Poética, Bestiario, Tres Presencias, Ojos de Borges y Atlas Interior.",
    href: "/poema-universal/herramientas-literarias",
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6efe7] px-5 py-8 text-stone-950">
      {/* =========================================================
          FONDO GENERAL
      ========================================================= */}

      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 8%, rgba(255,255,255,0.92), transparent 30%), radial-gradient(circle at 50% 42%, rgba(214,186,135,0.22), transparent 38%), linear-gradient(180deg, #fbf4eb 0%, #efe0cf 48%, #f8efe5 100%)",
          }}
        />

        {/* FLORES IZQUIERDA */}

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

        {/* FLORES DERECHA */}

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

        {/* LUZ CENTRAL SUPERIOR */}

        <div className="absolute left-1/2 top-[8%] h-[760px] w-[760px] -translate-x-1/2 rounded-full bg-white/35 blur-3xl" />

        {/* LUZ INFERIOR */}

        <div className="absolute bottom-[-240px] left-1/2 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-[#d7b982]/18 blur-3xl" />

        {/* TEXTURA */}

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
        {/* =========================================================
            NAVEGACIÓN
        ========================================================= */}

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
              href="/poema-universal/herramientas-literarias"
              className="transition hover:text-black"
            >
              Herramientas
            </Link>

            <Link
              href="/poema-universal/encadenamiento"
              className="transition hover:text-black"
            >
              La columna
            </Link>

            <Link href="/tienda" className="transition hover:text-black">
              Tienda
            </Link>

            <Link href="/artistas" className="transition hover:text-black">
              Artistas
            </Link>

            <Link
              href="/mi-habitacion"
              className="rounded-full border border-stone-300 bg-white/75 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-700 transition hover:bg-stone-950 hover:text-white"
            >
              Mi Habitación
            </Link>
          </div>
        </nav>

        {/* =========================================================
            HERO
        ========================================================= */}

        <header className="relative mx-auto max-w-6xl text-center">
          <p className="relative z-20 mb-7 text-[11px] uppercase tracking-[0.58em] text-stone-400">
            Una casa para lo que merece ser cuidado
          </p>

          <h1 className="relative z-20 font-serif text-[4.3rem] font-semibold leading-[0.9] tracking-tight text-stone-950 sm:text-[7.4rem] md:text-[9.2rem]">
            Poema
            <br />
            Universal
          </h1>

          {/* =======================================================
              ÍCARO · ELIPSE CINEMATOGRÁFICA
          ======================================================= */}

          <section className="relative mx-auto mt-9 max-w-5xl">
            {/* HALO PRINCIPAL */}

            <div
              className="pointer-events-none absolute left-1/2 top-[43%] -translate-x-1/2 -translate-y-1/2"
              style={{
                width: "760px",
                height: "430px",
                borderRadius: "50%",
                background:
                  "radial-gradient(ellipse, rgba(255,255,255,0.62) 0%, rgba(255,248,238,0.30) 36%, rgba(205,171,119,0.09) 60%, transparent 78%)",
                filter: "blur(30px)",
              }}
            />

            {/* HALO CÁLIDO */}

            <div
              className="pointer-events-none absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2"
              style={{
                width: "620px",
                height: "290px",
                borderRadius: "50%",
                background:
                  "radial-gradient(ellipse, rgba(179,133,72,0.10), transparent 68%)",
                filter: "blur(26px)",
              }}
            />

            {/* PIEZA CENTRAL */}

            <div className="relative mx-auto flex justify-center py-3">
              {/* SOMBRA INFERIOR */}

              <div
                className="pointer-events-none absolute bottom-[-14px] left-1/2 -translate-x-1/2"
                style={{
                  width: "500px",
                  height: "66px",
                  borderRadius: "50%",
                  background: "rgba(72,48,27,0.11)",
                  filter: "blur(34px)",
                }}
              />

              {/* ELIPSE EXTERIOR DE LUZ */}

              <div
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  width: "730px",
                  maxWidth: "90vw",
                  height: "355px",
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.26)",
                  boxShadow:
                    "0 0 60px rgba(255,255,255,0.16), inset 0 0 42px rgba(255,255,255,0.05)",
                }}
              />

              {/* MARCO ELÍPTICO */}

              <div
                className="relative z-10 w-full max-w-[700px]"
                style={{
                  padding: "4px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(145deg, rgba(255,253,248,0.92), rgba(232,220,204,0.72))",
                  boxShadow:
                    "0 28px 70px rgba(71,47,28,0.14), 0 8px 18px rgba(71,47,28,0.06), inset 0 1px 0 rgba(255,255,255,0.72)",
                }}
              >
                {/* REFLEJO SUPERIOR */}

                <div
                  className="pointer-events-none absolute inset-x-24 top-0 z-30 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.82), transparent)",
                  }}
                />

                {/* VÍDEO */}

                <div
                  className="relative w-full overflow-hidden"
                  style={{
                    height: "315px",
                    borderRadius: "50%",
                    background: "#d4c4b1",
                  }}
                >
                  <video
                    src="/icaro.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    aria-label="Ícaro, presencia de Poema Universal"
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{
                      objectPosition: "center 44%",
                    }}
                  />

                  {/* CRISTAL */}

                  <div
                    className="pointer-events-none absolute inset-0 z-10"
                    style={{
                      borderRadius: "50%",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.24), inset 0 0 38px rgba(255,255,255,0.018), inset 0 -26px 48px rgba(41,28,18,0.05)",
                    }}
                  />

                  {/* VELO CINEMATOGRÁFICO */}

                  <div
                    className="pointer-events-none absolute inset-0 z-10"
                    style={{
                      borderRadius: "50%",
                      background:
                        "linear-gradient(180deg, rgba(255,247,235,0.01) 0%, transparent 46%, rgba(39,26,17,0.03) 100%)",
                    }}
                  />

                  {/* BRILLO SUPERIOR */}

                  <div
                    className="pointer-events-none absolute left-[18%] top-[5%] z-20"
                    style={{
                      width: "30%",
                      height: "20%",
                      borderRadius: "50%",
                      background:
                        "radial-gradient(ellipse, rgba(255,255,255,0.07), transparent 70%)",
                      filter: "blur(8px)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* DETALLE EDITORIAL */}

            <div className="mx-auto mt-7 flex items-center justify-center gap-4">
              <span
                style={{
                  width: "54px",
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(130,100,65,0.34))",
                }}
              />

              <span className="text-[9px] uppercase tracking-[0.38em] text-stone-400">
                Ícaro · Edición fundacional · 2026
              </span>

              <span
                style={{
                  width: "54px",
                  height: "1px",
                  background:
                    "linear-gradient(90deg, rgba(130,100,65,0.34), transparent)",
                }}
              />
            </div>

            {/* FRASE */}

            <p className="mx-auto mt-7 max-w-2xl font-serif text-2xl leading-[1.45] text-stone-800 sm:text-3xl">
              Quien cae también puede dejar una luz en el aire.
            </p>
          </section>

          <p className="mx-auto mt-7 max-w-2xl text-[15px] leading-9 text-stone-600">
            Un lugar para escribir, recordar, despedirse, encender una luz y
            reunir las presencias que nos enseñaron a mirar el mundo de otra
            manera.
          </p>

          <div className="mt-11 flex flex-wrap justify-center gap-4">
            <Link
              href="/poema-universal"
              className="rounded-full bg-stone-950 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-white shadow-[0_18px_45px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-stone-800"
            >
              Entrar en la edición
            </Link>

            <Link
              href="#tres-puertas"
              className="rounded-full border border-stone-300 bg-white/75 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:text-black"
            >
              Recorrer la casa
            </Link>
          </div>
        </header>

        {/* =========================================================
            MANIFIESTO
        ========================================================= */}

        <section className="mx-auto mt-28 max-w-4xl border-y border-stone-300/70 py-20 text-center">
          <p className="font-serif text-3xl leading-[1.45] text-stone-800 sm:text-5xl">
            No todo lo que se pierde desaparece.
            <br />

            <span className="italic text-stone-500">
              A veces solo necesita una casa.
            </span>
          </p>

          <p className="mx-auto mt-9 max-w-2xl text-sm leading-9 text-stone-600">
            Poema Universal nace como una arquitectura emocional: una zona
            abierta para compartir belleza y una zona íntima para guardar lo que
            no debe quedar a la intemperie.
          </p>
        </section>

        {/* =========================================================
            TRES PUERTAS
        ========================================================= */}

        <section id="tres-puertas" className="mt-28">
          <div className="mb-10 flex flex-col justify-between gap-5 border-b border-stone-300/70 pb-7 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[0.42em] text-[#a77d3f]">
                I · La casa pública
              </p>

              <h2 className="mt-4 font-serif text-5xl tracking-[-0.04em] sm:text-7xl">
                Tres puertas.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-stone-500">
              El origen, la obra y las voces forman la estructura principal de
              Poema Universal.
            </p>
          </div>

          <div className="mb-7 grid gap-6 md:grid-cols-2">
            <Link
              href="/fundacion"
              className="group min-h-[330px] border border-stone-200/90 bg-white/62 p-9 shadow-[0_20px_55px_rgba(70,48,29,0.08)] backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/85"
            >
              <p className="text-xs uppercase tracking-[0.34em] text-[#a77d3f]">
                Puerta 01 · Manifiesto
              </p>

              <h3 className="mt-8 font-serif text-5xl">Fundación</h3>

              <p className="mt-6 max-w-xl text-sm leading-8 text-stone-600">
                El origen, la intención, la ética y la promesa profunda de Poema
                Universal.
              </p>

              <span className="mt-12 inline-flex text-[11px] uppercase tracking-[0.25em] text-stone-400 transition group-hover:text-stone-800">
                Atravesar la puerta →
              </span>
            </Link>

            <Link
              href="/obra"
              className="group min-h-[330px] border border-stone-200/90 bg-white/62 p-9 shadow-[0_20px_55px_rgba(70,48,29,0.08)] backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/85"
            >
              <p className="text-xs uppercase tracking-[0.34em] text-[#a77d3f]">
                Puerta 02 · Tríptico
              </p>

              <h3 className="mt-8 font-serif text-5xl">La Obra</h3>

              <p className="mt-6 max-w-xl text-sm leading-8 text-stone-600">
                No dejes que desaparezcamos, La Jerarquía del Hambre y Memorias
                de Bielka: tres puertas de una misma búsqueda.
              </p>

              <span className="mt-12 inline-flex text-[11px] uppercase tracking-[0.25em] text-stone-400 transition group-hover:text-stone-800">
                Atravesar la puerta →
              </span>
            </Link>
          </div>

          <PoemaUniversalThreshold />
        </section>

        {/* =========================================================
            SALAS ABIERTAS
        ========================================================= */}

        <section className="mt-28">
          <div className="mb-10 flex flex-col justify-between gap-5 border-b border-stone-300/70 pb-7 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[0.42em] text-[#a77d3f]">
                II · Estancias compartidas
              </p>

              <h2 className="mt-4 font-serif text-5xl tracking-[-0.04em] sm:text-7xl">
                Salas abiertas.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-stone-500">
              Lugares públicos para leer, escribir, escuchar, recordar y
              trabajar la materia literaria.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden border border-stone-200/90 bg-stone-200/80 md:grid-cols-2 lg:grid-cols-3">
            {salasAbiertas.map((sala) => (
              <Link
                key={sala.href}
                href={sala.href}
                className="group flex min-h-[275px] flex-col justify-between bg-white/70 p-8 backdrop-blur-md transition hover:bg-white"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.34em] text-stone-400">
                    {sala.eyebrow}
                  </p>

                  <h3 className="mt-6 font-serif text-3xl">
                    {sala.title}
                  </h3>

                  <p className="mt-5 text-sm leading-8 text-stone-600">
                    {sala.description}
                  </p>
                </div>

                <span className="mt-8 text-[11px] uppercase tracking-[0.25em] text-stone-400 transition group-hover:text-[#a77d3f]">
                  Entrar →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* =========================================================
            ZONA ÍNTIMA
        ========================================================= */}

        <section className="mt-28">
          <div className="mb-10 border-b border-stone-300/70 pb-7">
            <p className="text-[10px] uppercase tracking-[0.42em] text-[#a77d3f]">
              III · La zona íntima
            </p>

            <h2 className="mt-4 max-w-5xl font-serif text-5xl leading-[1.05] tracking-[-0.04em] sm:text-7xl">
              La casa también guarda aquello que no debe exponerse.
            </h2>
          </div>

          <Link
            href="/mi-habitacion"
            className="group block bg-stone-950 p-10 text-white shadow-[0_24px_70px_rgba(0,0,0,0.22)] transition hover:bg-stone-900 sm:p-14"
          >
            <p className="text-xs uppercase tracking-[0.34em] text-[#c7a467]">
              Privado
            </p>

            <h3 className="mt-7 font-serif text-5xl sm:text-7xl">
              Mi Habitación
            </h3>

            <p className="mt-7 max-w-3xl text-sm leading-8 text-stone-300">
              Poemas, cartas, velas, rincón y recuerdos guardados con cerradura.
              La casa íntima dentro de la casa pública.
            </p>

            <span className="mt-10 inline-flex text-[11px] uppercase tracking-[0.25em] text-stone-400 transition group-hover:text-white">
              Abrir la habitación →
            </span>
          </Link>

          <section className="mt-10 overflow-hidden rounded-[42px] border border-stone-200/80 bg-[#fffaf3]/88 shadow-[0_25px_70px_rgba(70,48,29,0.11)]">
            <div className="grid gap-0 lg:grid-cols-[1fr_1.2fr]">
              <div className="border-b border-stone-200/80 p-8 lg:border-b-0 lg:border-r">
                <p className="text-xs uppercase tracking-[0.34em] text-stone-400">
                  Estado de la casa
                </p>

                <h3 className="mt-5 font-serif text-4xl font-semibold leading-tight">
                  Una obra abierta con una habitación privada.
                </h3>
              </div>

              <div className="grid gap-5 p-8 text-sm leading-8 text-stone-600 md:grid-cols-2">
                <p>
                  La parte pública reúne la Fundación, la Obra, los Artistas y
                  las salas compartidas del proyecto.
                </p>

                <p>
                  La Cadena del Poema Universal permite que distintas personas
                  escriban un poema común, verso a verso.
                </p>

                <p>
                  La parte privada permite guardar poemas, cartas, velas,
                  estados íntimos y recuerdos sin exponerlos al mundo.
                </p>

                <p>
                  El cuarto de llaves cuida la casa: modera, ordena y protege lo
                  que debe permanecer limpio.
                </p>
              </div>
            </div>
          </section>
        </section>

        {/* =========================================================
            PARTICIPAR
        ========================================================= */}

        <section className="mt-28">
          <div className="mb-10 border-b border-stone-300/70 pb-7">
            <p className="text-[10px] uppercase tracking-[0.42em] text-[#a77d3f]">
              IV · Participar
            </p>

            <h2 className="mt-4 font-serif text-5xl tracking-[-0.04em] sm:text-7xl">
              No todas las manos escribirán un verso.
            </h2>
          </div>

          <HomeSupportGateway />
        </section>

        {/* =========================================================
            MATERIA
        ========================================================= */}

        <section className="mt-28">
          <div className="mb-10 border-b border-stone-300/70 pb-7">
            <p className="text-[10px] uppercase tracking-[0.42em] text-[#a77d3f]">
              V · Materia
            </p>

            <h2 className="mt-4 font-serif text-5xl tracking-[-0.04em] sm:text-7xl">
              La obra adquiere cuerpo.
            </h2>
          </div>

          <HomeStoreGateway />
        </section>

        {/* =========================================================
            CONSECUENCIA
        ========================================================= */}

        <section className="mt-28">
          <div className="mb-10 border-b border-stone-300/70 pb-7">
            <p className="text-[10px] uppercase tracking-[0.42em] text-[#a77d3f]">
              VI · Consecuencia
            </p>

            <h2 className="mt-4 max-w-5xl font-serif text-5xl leading-[1.05] tracking-[-0.04em] sm:text-7xl">
              La cultura también puede sostener el mundo.
            </h2>
          </div>

          <HomeObraComunGateway />
        </section>

        {/* =========================================================
            FOOTER
        ========================================================= */}

        <footer className="mt-28 pb-10 text-center">
          <p className="text-xs uppercase tracking-[0.42em] text-stone-400">
            Poema Universal
          </p>

          <p className="mx-auto mt-4 max-w-xl text-xs leading-7 text-stone-500">
            Primero descubres la obra. Después entras en sus salas. Luego
            encuentras tu habitación. Finalmente decides participar, sostenerla
            o llevar una parte contigo.
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