import Link from "next/link";

import MesaDelMundo from "./components/MesaDelMundo";

const principles = [
  {
    number: "01",
    title: "Escuchar antes de diseñar",
    text: "Ningún proyecto comenzará imponiendo una solución. Primero deberá comprender a las personas, sus contextos, sus capacidades y sus necesidades reales.",
  },
  {
    number: "02",
    title: "Crear con, no para",
    text: "Las personas implicadas no serán receptoras pasivas ni una imagen promocional. Participarán en la definición, el desarrollo y la memoria del proyecto.",
  },
  {
    number: "03",
    title: "Dignidad sin espectáculo",
    text: "No convertiremos la vulnerabilidad, la discapacidad ni el dolor en una herramienta de exhibición. Toda presencia conservará contexto, consentimiento y agencia.",
  },
  {
    number: "04",
    title: "Transparencia radical",
    text: "Cuando existan fondos, alianzas, materiales o resultados, estarán documentados de forma comprensible. También se explicarán los límites, errores y dificultades.",
  },
];

const branches = [
  {
    status: "Proyecto fundacional",
    title: "Discapacidad, autonomía y cultura",
    text: "La primera rama de La Obra Común nacerá junto a personas con parálisis cerebral, sus familias, profesionales y redes de cuidado.",
  },
  {
    status: "Rama futura",
    title: "Alimentación y dignidad",
    text: "Investigación, conocimiento culinario y sistemas capaces de alimentar con respeto en situaciones de emergencia o recursos limitados.",
  },
  {
    status: "Rama futura",
    title: "Memoria que permanece",
    text: "Archivos orales, cartas, testimonios y pequeñas historias que podrían desaparecer si nadie las escucha y las conserva.",
  },
  {
    status: "Rama futura",
    title: "Infancia y creación",
    text: "Espacios donde niños y jóvenes puedan escribir, imaginar, dibujar, expresarse y participar como autores de su propia memoria.",
  },
  {
    status: "Rama futura",
    title: "Cultura en situaciones límite",
    text: "Preservación de archivos, cuadernos, bibliotecas, fotografías, instrumentos y memoria cuando una comunidad atraviesa una crisis.",
  },
];

const participation = [
  "Ofrezco tiempo",
  "Ofrezco conocimiento",
  "Ofrezco un espacio",
  "Ofrezco materiales",
  "Propongo una alianza",
  "Necesito ser escuchado",
];

export default function ObraComunPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#efe6da] text-[#171411]">
      <header className="sticky top-0 z-50 border-b border-stone-900/10 bg-[#efe6da]/94 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] max-w-[1500px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="font-serif text-xl tracking-[-0.025em]"
          >
            Poema Universal
          </Link>

          <nav className="hidden items-center gap-8 text-[8px] uppercase tracking-[0.28em] text-stone-500 md:flex">
            <Link
              href="/poema-universal"
              className="transition hover:text-stone-950"
            >
              Edición 2026
            </Link>

            <Link
              href="/artistas"
              className="transition hover:text-stone-950"
            >
              Artistas
            </Link>

            <Link
              href="/colaborar"
              className="transition hover:text-stone-950"
            >
              Colaborar
            </Link>

            <span className="text-stone-950">
              Obra Común
            </span>
          </nav>

          <Link
            href="/"
            className="border border-stone-900/20 px-5 py-2.5 text-[8px] uppercase tracking-[0.3em] transition hover:bg-stone-950 hover:text-white"
          >
            Volver a la casa
          </Link>
        </div>
      </header>

      {/* UMBRAL */}

      <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-[#efe6da]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 18% 18%, rgba(255,255,255,0.95), transparent 31%), radial-gradient(circle at 82% 78%, rgba(199,164,103,0.17), transparent 34%), linear-gradient(180deg, #f4ede4 0%, #e8dccd 100%)",
          }}
        />

        <div className="relative mx-auto grid w-full max-w-[1500px] gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:px-12">
          <div>
            <p className="text-[9px] uppercase tracking-[0.52em] text-[#96703c]">
              Poema Universal · obra social
            </p>

            <h1 className="mt-10 max-w-6xl font-serif text-6xl leading-[0.87] tracking-[-0.065em] sm:text-8xl lg:text-[132px]">
              La Obra
              <span className="block italic text-stone-500">
                Común.
              </span>
            </h1>
          </div>

          <div className="border-l border-stone-900/15 pl-7 sm:pl-10">
            <p className="font-serif text-2xl leading-[1.45] text-stone-700 sm:text-3xl">
              No todo lo que hacemos debe convertirse en
              un libro.
            </p>

            <p className="mt-7 max-w-xl text-sm leading-8 text-stone-600">
              Algunas obras deben convertirse en tiempo,
              autonomía, memoria, alimento, accesibilidad,
              compañía y oportunidades compartidas.
            </p>

            <Link
              href="#mesa-del-mundo"
              className="mt-10 inline-flex border-b border-stone-900/25 pb-2 text-[8px] uppercase tracking-[0.32em] text-stone-600 transition hover:border-stone-950 hover:text-stone-950"
            >
              Acércate a la mesa ↓
            </Link>
          </div>
        </div>

        <span
          aria-hidden="true"
          className="absolute bottom-0 left-1/2 h-24 w-px -translate-x-1/2"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(151,112,60,0.8))",
          }}
        />
      </section>

      <MesaDelMundo />

      {/* PROYECTO FUNDACIONAL */}

      <section
        id="proyecto-fundacional"
        className="scroll-mt-20 bg-[#efe6da]"
      >
        <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
          <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="text-[8px] uppercase tracking-[0.46em] text-[#96703c]">
                Proyecto fundacional
              </p>

              <p className="mt-6 font-serif text-xl italic text-stone-500">
                Asociación en gestación
              </p>
            </div>

            <div>
              <h2 className="max-w-5xl font-serif text-5xl leading-[1.02] tracking-[-0.05em] sm:text-7xl lg:text-[88px]">
                Crear junto a personas con
                <span className="block italic text-stone-500">
                  parálisis cerebral.
                </span>
              </h2>

              <p className="mt-10 max-w-3xl text-base leading-9 text-stone-650">
                El primer proyecto social nacido dentro de
                Poema Universal será una asociación
                construida desde la escucha, la accesibilidad
                y la creación compartida.
              </p>

              <p className="mt-7 max-w-3xl text-sm leading-8 text-stone-600">
                Su nombre definitivo, su forma jurídica, su
                equipo, sus alianzas y sus primeros programas
                todavía deberán definirse con rigor. Esta
                página no presenta una institución ya
                constituida: conserva públicamente el momento
                en que comienza a nacer.
              </p>

              <div className="mt-12 grid border-l border-t border-stone-900/15 sm:grid-cols-2">
                {[
                  [
                    "Escucha",
                    "Conocer primero a las personas, familias, profesionales y asociaciones que ya poseen experiencia real.",
                  ],
                  [
                    "Accesibilidad",
                    "Diseñar comunicación, encuentros, herramientas y espacios accesibles desde el inicio.",
                  ],
                  [
                    "Creación",
                    "Abrir lugares donde cada persona pueda expresarse, participar y ser reconocida como autora.",
                  ],
                  [
                    "Comunidad",
                    "Construir una red que una cultura, cuidados, conocimiento y colaboración continuada.",
                  ],
                ].map(([title, text]) => (
                  <div
                    key={title}
                    className="border-b border-r border-stone-900/15 p-7 sm:p-9"
                  >
                    <h3 className="font-serif text-2xl">
                      {title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-stone-600">
                      {text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-10 border-l-2 border-[#96703c]/45 pl-6">
                <p className="text-[8px] uppercase tracking-[0.34em] text-[#96703c]">
                  Estado actual
                </p>

                <p className="mt-4 max-w-2xl font-serif text-xl italic leading-8 text-stone-600">
                  La intención fundacional existe. La escucha,
                  la constitución y el primer programa están
                  todavía por comenzar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRINCIPIOS */}

      <section
        id="principios"
        className="scroll-mt-20 bg-[#0a0d11] text-[#f0e8dc]"
      >
        <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <div className="grid gap-12 border-b border-white/10 pb-14 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-[8px] uppercase tracking-[0.46em] text-[#c7a467]">
                Principios
              </p>

              <h2 className="mt-7 max-w-5xl font-serif text-5xl leading-none tracking-[-0.05em] sm:text-7xl">
                La dignidad antes
                <span className="block italic text-white/42">
                  que la imagen.
                </span>
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-white/42">
              Ningún resultado justificará borrar la voz,
              la voluntad o la complejidad de las personas.
            </p>
          </div>

          <ol className="grid border-l border-t border-white/10 md:grid-cols-2">
            {principles.map((principle) => (
              <li
                key={principle.number}
                className="border-b border-r border-white/10 p-7 sm:p-10"
              >
                <span className="font-serif text-lg text-[#c7a467]">
                  {principle.number}
                </span>

                <h3 className="mt-8 font-serif text-3xl">
                  {principle.title}
                </h3>

                <p className="mt-5 max-w-xl text-sm leading-8 text-white/48">
                  {principle.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* RAMAS */}

      <section
        id="ramas"
        className="scroll-mt-20 bg-[#e6dacb]"
      >
        <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <p className="text-[8px] uppercase tracking-[0.46em] text-[#96703c]">
            Arquitectura futura
          </p>

          <h2 className="mt-7 max-w-5xl font-serif text-5xl leading-none tracking-[-0.05em] sm:text-7xl">
            Una raíz.
            <span className="block italic text-stone-500">
              Muchas formas de cuidar.
            </span>
          </h2>

          <ol className="mt-16 border-t border-stone-900/15">
            {branches.map((branch, index) => (
              <li
                key={branch.title}
                className="grid gap-6 border-b border-stone-900/15 py-9 md:grid-cols-[90px_1fr_1fr] md:items-start"
              >
                <span className="font-serif text-2xl text-[#96703c]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <p className="text-[7px] uppercase tracking-[0.3em] text-stone-400">
                    {branch.status}
                  </p>

                  <h3 className="mt-4 font-serif text-3xl">
                    {branch.title}
                  </h3>
                </div>

                <p className="max-w-xl text-sm leading-8 text-stone-600">
                  {branch.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* TRANSPARENCIA */}

      <section
        id="transparencia"
        className="scroll-mt-20 bg-[#f2ebe2]"
      >
        <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-[8px] uppercase tracking-[0.46em] text-[#96703c]">
                La Cámara Clara
              </p>

              <h2 className="mt-7 font-serif text-5xl leading-none tracking-[-0.05em] sm:text-7xl">
                Todo lo que entra.
                <span className="block italic text-stone-500">
                  Todo lo que sale.
                </span>
              </h2>
            </div>

            <div className="border-l border-stone-900/15 pl-7 sm:pl-10">
              <p className="text-base leading-9 text-stone-650">
                La transparencia comenzará cuando exista
                actividad real. No mostraremos cifras
                imaginadas, impacto supuesto ni alianzas que
                todavía no hayan ocurrido.
              </p>

              <div className="mt-10 border-t border-stone-900/15">
                {[
                  "Forma jurídica",
                  "Equipo responsable",
                  "Alianzas",
                  "Fondos recibidos",
                  "Gastos",
                  "Proyectos y resultados",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between gap-6 border-b border-stone-900/15 py-5"
                  >
                    <span className="text-sm text-stone-600">
                      {item}
                    </span>

                    <span className="text-[7px] uppercase tracking-[0.25em] text-stone-400">
                      Todavía no iniciado
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-8 font-serif text-lg italic leading-8 text-stone-500">
                La ausencia de datos también debe decir la
                verdad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PARTICIPACIÓN */}

      <section
        id="participar"
        className="scroll-mt-20 bg-[#090c10] text-[#f0e8dc]"
      >
        <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <div className="grid gap-14 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="text-[8px] uppercase tracking-[0.46em] text-[#c7a467]">
                Poner un lugar en la mesa
              </p>

              <h2 className="mt-7 max-w-4xl font-serif text-5xl leading-none tracking-[-0.05em] sm:text-7xl">
                No toda ayuda
                <span className="block italic text-white/42">
                  tiene forma de dinero.
                </span>
              </h2>
            </div>

            <div>
              <p className="max-w-xl text-sm leading-8 text-white/48">
                Una institución cultural también puede
                sostenerse mediante tiempo, conocimiento,
                espacios, materiales, escucha y alianzas
                responsables.
              </p>

              <div className="mt-9 grid border-l border-t border-white/10 sm:grid-cols-2">
                {participation.map((item) => (
                  <div
                    key={item}
                    className="border-b border-r border-white/10 px-5 py-5 text-[8px] uppercase tracking-[0.25em] text-white/48"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <Link
                href="/colaborar"
                className="mt-10 inline-flex border-b border-[#c7a467]/50 pb-2 text-[8px] uppercase tracking-[0.32em] text-[#c7a467] transition hover:border-[#c7a467]"
              >
                Entrar en la red de colaboración →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CIERRE */}

      <section className="bg-[#efe6da]">
        <div className="mx-auto max-w-[1500px] px-5 py-28 text-center sm:px-8 sm:py-40 lg:px-12">
          <span
            aria-hidden="true"
            className="mx-auto block h-20 w-px"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(151,112,60,0.75), transparent)",
            }}
          />

          <p className="mx-auto mt-10 max-w-5xl font-serif text-4xl leading-[1.18] tracking-[-0.04em] text-stone-700 sm:text-6xl">
            Una obra no está terminada cuando alguien la
            contempla.
            <span className="mt-4 block italic text-stone-500">
              Está terminada cuando consigue sostener algo
              que estaba a punto de caer.
            </span>
          </p>

          <p className="mt-12 text-[8px] uppercase tracking-[0.42em] text-[#96703c]">
            La Obra Común · Poema Universal
          </p>
        </div>
      </section>

      <footer className="bg-[#090c10] px-5 py-10 text-[#f0e8dc] sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-lg">
            La Obra Común
          </p>

          <p className="text-[7px] uppercase tracking-[0.32em] text-white/34">
            Cultura · dignidad · acción
          </p>
        </div>
      </footer>
    </main>
  );
}
