import Link from "next/link";

import AtlasInteriorEntrance from "../components/AtlasInteriorEntrance";
import BestiarioEntrance from "../components/BestiarioEntrance";
import BorgesEntrance from "../components/BorgesEntrance";
import MatrizEntrance from "../components/MatrizEntrance";
import ThreePresencesEntrance from "../components/ThreePresencesEntrance";

const tools = [
  {
    number: "07",
    title: "Matriz Poética",
    anchor: "#matriz-poetica",
    description:
      "Revela la arquitectura invisible del poema sin sustituir la voz de quien escribe.",
  },
  {
    number: "02",
    title: "Bestiario Poético",
    anchor: "#bestiario-poetico",
    description:
      "Convierte símbolos, heridas, pulsiones y materias en criaturas literarias.",
  },
  {
    number: "03",
    title: "Sala de las Tres Presencias",
    anchor: "#tres-presencias",
    description:
      "Hace dialogar las tres figuras centrales de la obra dentro de una misma cámara.",
  },
  {
    number: "04",
    title: "Los ojos de Borges",
    anchor: "#ojos-de-borges",
    description:
      "Explora el laberinto, el doble, el espejo, la biblioteca y las formas del infinito.",
  },
  {
    number: "05",
    title: "Atlas Interior",
    anchor: "#atlas-interior",
    description:
      "Cartografía memoria, cuerpo, territorio, obsesiones y lugares de procedencia.",
  },
  {
    number: "06",
    title: "El Rinconcito",
    anchor: "#el-rinconcito",
    description:
      "Un espacio íntimo para conservar palabras, imágenes, recuerdos y aquello que no debería desaparecer.",
  },

  {
    number: "06",
    title: "Verso · Tecno · Embrión",
    description:
      "Laboratorio sonoro donde el verso, el ritmo y el lenguaje se transforman en materia electrónica.",
    anchor: "#verso-tecno-embrion",
  },
];

export default function HerramientasLiterariasPage() {
  return (
    <main className="min-h-screen bg-[#05080b] text-[#f0e8dc]">
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-[1380px] px-5 py-8 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <Link
              href="/poema-universal"
              className="text-[8px] uppercase tracking-[0.34em] text-white/42 transition hover:text-[#c7a467]"
            >
              ← Volver a Poema Universal
            </Link>

            <p className="text-[8px] uppercase tracking-[0.34em] text-[#c7a467]">
              Sala de trabajo literario
            </p>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-white/10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 76% 24%, rgba(183,140,76,0.13), transparent 32%), radial-gradient(circle at 18% 78%, rgba(107,120,133,0.08), transparent 36%)",
          }}
        />

        <div className="relative mx-auto grid min-h-[650px] max-w-[1380px] gap-16 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.08fr_0.92fr] lg:px-12 lg:py-28">
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[0.48em] text-[#c7a467]">
                Cámara independiente · Poema Universal
              </p>

              <h1 className="mt-10 max-w-4xl font-serif text-6xl leading-[0.94] tracking-[-0.055em] sm:text-8xl lg:text-[108px]">
                Herramientas
                <span className="block italic text-white/48">
                  literarias.
                </span>
              </h1>
            </div>

            <blockquote className="mt-16 max-w-3xl border-l border-[#c7a467]/45 pl-7">
              <p className="font-serif text-2xl italic leading-[1.45] text-white/72 sm:text-3xl">
                Aquí el poema deja de ser únicamente
                texto. Se convierte en arquitectura,
                criatura, espejo, presencia y territorio.
              </p>
            </blockquote>
          </div>

          <div className="flex flex-col justify-end">
            <p className="max-w-xl text-sm leading-8 text-white/48 sm:text-base">
              Esta sala reúne los instrumentos de lectura,
              transformación y diseño de Poema Universal.
              No forman parte del recorrido institucional de
              la edición: constituyen un taller independiente
              para entrar en la materia de la escritura.
            </p>

            <div className="mt-12 border-y border-white/10">
              {tools.map((tool) => (
                <Link
                  key={tool.anchor}
                  href={tool.anchor}
                  className="group grid gap-4 border-b border-white/10 py-6 last:border-b-0 sm:grid-cols-[54px_1fr_28px] sm:items-center"
                >
                  <span className="font-serif text-lg italic text-[#c7a467]">
                    {tool.number}
                  </span>

                  <span>
                    <span className="block font-serif text-2xl text-white/86 transition group-hover:text-white">
                      {tool.title}
                    </span>

                    <span className="mt-2 block max-w-lg text-xs leading-6 text-white/34">
                      {tool.description}
                    </span>
                  </span>

                  <span className="text-right text-lg text-white/24 transition group-hover:translate-x-1 group-hover:text-[#c7a467]">
                    ↓
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <nav
        aria-label="Índice de herramientas"
        className="sticky top-0 z-40 border-b border-white/10 bg-[#05080b]/90 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-[1380px] gap-7 overflow-x-auto px-5 py-5 sm:px-8 lg:px-12">
          {tools.map((tool) => (
            <Link
              key={tool.anchor}
              href={tool.anchor}
              className="shrink-0 text-[8px] uppercase tracking-[0.3em] text-white/36 transition hover:text-[#c7a467]"
            >
              {tool.number} · {tool.title}
            </Link>
          ))}
        </div>
      </nav>

      <div className="divide-y divide-white/10">
        <section id="matriz-poetica" className="scroll-mt-20">
          <MatrizEntrance />
        </section>

        <section id="bestiario-poetico" className="scroll-mt-20">
          <BestiarioEntrance />
        </section>

        <section id="tres-presencias" className="scroll-mt-20">
          <ThreePresencesEntrance />
        </section>

        <section id="ojos-de-borges" className="scroll-mt-20">
          <BorgesEntrance />
        </section>

        <section id="atlas-interior" className="scroll-mt-20">
          <AtlasInteriorEntrance />
        </section>
        <section
          id="verso-tecno-embrion"
          className="relative scroll-mt-20 overflow-hidden bg-[#07090b] px-5 py-28 sm:px-8 lg:px-12 lg:py-36"
        >
          <div className="mx-auto max-w-[1380px]">
            <div className="grid gap-12 border-t border-white/10 pt-10 lg:grid-cols-[220px_1fr] lg:gap-20">
              <div>
                <span className="text-[9px] uppercase tracking-[0.34em] text-[#c7a467]">
                  07 · Laboratorio sonoro
                </span>
              </div>

              <div className="max-w-4xl">
                <p className="mb-5 text-[9px] uppercase tracking-[0.38em] text-white/35">
                  Poema Universal · Herramientas
                </p>

                <h2 className="font-serif text-4xl font-light tracking-[-0.03em] text-[#f2eadc] sm:text-5xl lg:text-7xl">
                  Verso · Tecno · Embrión
                </h2>

                <p className="mt-8 max-w-2xl font-serif text-lg leading-relaxed text-white/55 sm:text-xl">
                  Un organismo experimental que convierte palabra,
                  ritmo y sensibilidad poética en materia electrónica.
                  El poema deja de ser solamente texto y comienza a
                  comportarse como pulso, estructura y sonido.
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-6">
                  <Link
                    href="/laboratorio/verso-tecno"
                    className="inline-flex items-center gap-4 border-b border-[#c7a467]/45 pb-2 text-[10px] uppercase tracking-[0.3em] text-[#c7a467] transition hover:border-[#c7a467] hover:text-[#ead3a6]"
                  >
                    Entrar al laboratorio
                    <span aria-hidden="true">↗</span>
                  </Link>

                  <span className="text-[8px] uppercase tracking-[0.28em] text-white/22">
                    Verso → ritmo → materia electrónica
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1380px] flex-wrap items-center justify-between gap-5 px-5 py-9 sm:px-8 lg:px-12">
          <p className="text-[8px] uppercase tracking-[0.3em] text-white/24">
            Poema Universal · Sala de Herramientas Literarias
          </p>

          <Link
            href="/poema-universal"
            className="text-[8px] uppercase tracking-[0.3em] text-[#c7a467] transition hover:text-white"
          >
            Regresar a la edición →
          </Link>
        </div>
      </footer>
    
      <section
        id="el-rinconcito"
        className="relative overflow-hidden bg-[#080706] px-5 py-28 sm:px-8 lg:px-12 lg:py-36"
      >
        <div className="mx-auto max-w-[1380px]">
          <div className="grid gap-12 border-t border-white/10 pt-10 lg:grid-cols-[220px_1fr] lg:gap-20">

            <div>
              <span className="text-[9px] uppercase tracking-[0.34em] text-[#c7a467]">
                05 · Memoria íntima
              </span>
            </div>

            <div className="max-w-4xl">
              <p className="mb-5 text-[9px] uppercase tracking-[0.38em] text-white/35">
                Poema Universal · Herramientas
              </p>

              <h2 className="font-serif text-4xl font-light tracking-[-0.03em] text-[#f2eadc] sm:text-5xl lg:text-7xl">
                El Rinconcito
              </h2>

              <p className="mt-8 max-w-2xl font-serif text-lg leading-relaxed text-white/55 sm:text-xl">
                Un lugar pequeño dentro de Poema Universal para conservar
                palabras, imágenes, recuerdos y aquello que no debería desaparecer.
              </p>

              <Link
                href="/rinconcito"
                className="mt-10 inline-flex items-center gap-4 border-b border-[#c7a467]/45 pb-2 text-[10px] uppercase tracking-[0.3em] text-[#c7a467] transition hover:border-[#c7a467] hover:text-[#ead3a6]"
              >
                Entrar al Rinconcito
                <span aria-hidden="true">↗</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

</main>
  );
}
