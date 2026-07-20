import Link from "next/link";

const collaborationFields = [
  {
    title: "Traducción",
    text: "Traducción literaria, revisión bilingüe y acompañamiento de lenguas minoritarias.",
  },
  {
    title: "Edición",
    text: "Corrección, lectura editorial, diseño del libro y preparación de originales.",
  },
  {
    title: "Investigación",
    text: "Localización de voces, mediación cultural y contacto con comunidades literarias.",
  },
  {
    title: "Imagen y sonido",
    text: "Fotografía, retrato, lectura audiovisual, archivo sonoro y documentación.",
  },
  {
    title: "Tecnología",
    text: "Desarrollo web, accesibilidad, archivo digital, seguridad e infraestructura.",
  },
  {
    title: "Difusión",
    text: "Bibliotecas, universidades, festivales, asociaciones y medios culturales.",
  },
];

const fundingDestinations = [
  "Traducción literaria",
  "Corrección y edición",
  "Retratos y archivo audiovisual",
  "Infraestructura tecnológica",
  "Diseño e impresión",
  "Accesibilidad",
  "Presentación pública",
  "Envíos internacionales",
];

const ethicalCommitments = [
  "Ningún apoyo concede una plaza entre las sesenta voces.",
  "Ningún colaborador puede imponer un poema, un poeta o un territorio.",
  "No existirán niveles Oro, Plata o Bronce.",
  "Los reconocimientos públicos utilizarán la misma jerarquía visual.",
  "Se publicará el destino general de los recursos recibidos.",
  "Podrá solicitarse reconocimiento público o anonimato.",
  "No se aceptarán condiciones incompatibles con la independencia editorial.",
  "La obra conservará el derecho a rechazar cualquier aportación.",
];

export default function CollaboratePage() {
  const contactEmail =
    process.env.NEXT_PUBLIC_POEMA_UNIVERSAL_CONTACT_EMAIL;

  const collaborationHref = contactEmail
    ? `mailto:${contactEmail}?subject=${encodeURIComponent(
        "Propuesta de colaboración con Poema Universal"
      )}`
    : "#contacto";

  const supportHref = contactEmail
    ? `mailto:${contactEmail}?subject=${encodeURIComponent(
        "Apoyo a la edición fundacional de Poema Universal"
      )}`
    : "#contacto";

  return (
    <main className="min-h-screen bg-[#f0e8dc] text-[#171411]">
      <header className="border-b border-stone-900/15">
        <div className="mx-auto flex min-h-[72px] max-w-[1380px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link
            href="/poema-universal"
            className="font-serif text-xl tracking-[-0.025em]"
          >
            Poema Universal
          </Link>

          <Link
            href="/poema-universal#hacer-posible"
            className="text-[8px] uppercase tracking-[0.3em] text-stone-500 transition hover:text-stone-950"
          >
            ← Volver a la obra
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[-420px] h-[900px] w-[1100px] -translate-x-1/2 rounded-full blur-[170px]"
          style={{
            backgroundColor: "rgba(255,255,255,0.78)",
          }}
        />

        <div className="relative mx-auto max-w-[1380px] px-5 pb-28 pt-20 sm:px-8 sm:pb-36 sm:pt-28 lg:px-12 lg:pb-44">
          <p className="text-[9px] uppercase tracking-[0.48em] text-[#9a743e]">
            Colaborar y sostener
          </p>

          <h1 className="mt-10 max-w-6xl font-serif text-6xl leading-[0.9] tracking-[-0.06em] sm:text-8xl lg:text-[126px]">
            No todas las manos
            <span className="block italic text-stone-500">
              escribirán un verso.
            </span>
          </h1>

          <p className="mt-12 max-w-3xl font-serif text-2xl leading-[1.45] text-stone-600 sm:text-3xl">
            Algunas traducirán, corregirán, investigarán,
            diseñarán, cuidarán o sostendrán la obra para
            que sesenta voces puedan cruzar el mundo.
          </p>
        </div>
      </section>

      <section
        id="colaborar"
        className="scroll-mt-24 border-t border-stone-900/15"
      >
        <div className="mx-auto max-w-[1380px] px-5 py-28 sm:px-8 sm:py-36 lg:px-12">
          <div className="grid gap-16 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
            <div>
              <p className="text-[9px] uppercase tracking-[0.44em] text-[#9a743e]">
                01 · Colaborar
              </p>

              <h2 className="mt-8 font-serif text-5xl tracking-[-0.045em] sm:text-7xl">
                Aportar oficio,
                <span className="block italic text-stone-500">
                  tiempo o conocimiento.
                </span>
              </h2>

              <p className="mt-9 max-w-xl text-sm leading-8 text-stone-600">
                Las colaboraciones se estudiarán por su
                utilidad real, su cuidado y su afinidad
                ética con el proyecto.
              </p>

              <a
                href={collaborationHref}
                className="mt-10 inline-flex border border-stone-950 bg-stone-950 px-7 py-4 text-[8px] uppercase tracking-[0.3em] text-white transition hover:bg-stone-800"
              >
                Presentar una propuesta
              </a>
            </div>

            <div className="grid border-l border-t border-stone-900/15 sm:grid-cols-2">
              {collaborationFields.map((field) => (
                <article
                  key={field.title}
                  className="min-h-[230px] border-b border-r border-stone-900/15 p-7 sm:p-8"
                >
                  <h3 className="font-serif text-3xl tracking-[-0.03em]">
                    {field.title}
                  </h3>

                  <p className="mt-6 text-sm leading-7 text-stone-600">
                    {field.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="sostener"
        className="scroll-mt-24 bg-[#080b0e] text-[#f0e8dc]"
      >
        <div className="mx-auto max-w-[1380px] px-5 py-28 sm:px-8 sm:py-36 lg:px-12">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <p className="text-[9px] uppercase tracking-[0.44em] text-[#c7a467]">
                02 · Sostener
              </p>

              <h2 className="mt-8 font-serif text-5xl leading-[1] tracking-[-0.045em] sm:text-7xl">
                Financiar la existencia
                <span className="block italic text-white/48">
                  material de la obra.
                </span>
              </h2>

              <p className="mt-9 max-w-xl text-sm leading-8 text-white/48">
                Las aportaciones se dirigirán a necesidades
                verificables. No concederán visibilidad
                superior ni influencia editorial.
              </p>

              <a
                href={supportHref}
                className="mt-10 inline-flex border border-[#c7a467] px-7 py-4 text-[8px] uppercase tracking-[0.3em] text-[#c7a467] transition hover:bg-[#c7a467] hover:text-[#080b0e]"
              >
                Proponer un apoyo
              </a>
            </div>

            <div className="grid grid-cols-2 border-l border-t border-white/[0.14]">
              {fundingDestinations.map((destination, index) => (
                <div
                  key={destination}
                  className="min-h-[140px] border-b border-r border-white/[0.14] p-6"
                >
                  <span className="font-serif text-lg italic text-[#c7a467]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <p className="mt-6 text-sm leading-6 text-white/58">
                    {destination}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-stone-900/15">
        <div className="mx-auto max-w-[1380px] px-5 py-28 sm:px-8 sm:py-36 lg:px-12">
          <p className="text-[9px] uppercase tracking-[0.44em] text-[#9a743e]">
            Carta ética
          </p>

          <h2 className="mt-8 max-w-5xl font-serif text-5xl leading-[1] tracking-[-0.045em] sm:text-7xl">
            El dinero podrá sostener el libro.
            <span className="block italic text-stone-500">
              Nunca decidir quién lo escribe.
            </span>
          </h2>

          <ol className="mt-16 grid border-l border-t border-stone-900/15 sm:grid-cols-2 lg:grid-cols-4">
            {ethicalCommitments.map((commitment, index) => (
              <li
                key={commitment}
                className="min-h-[220px] border-b border-r border-stone-900/15 p-7"
              >
                <span className="font-serif text-xl italic text-[#9a743e]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <p className="mt-9 text-sm leading-7 text-stone-600">
                  {commitment}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="contacto"
        className="bg-[#e7dccd]"
      >
        <div className="mx-auto max-w-[1380px] px-5 py-24 text-center sm:px-8 sm:py-32 lg:px-12">
          <p className="text-[8px] uppercase tracking-[0.42em] text-[#9a743e]">
            Canal institucional
          </p>

          <h2 className="mx-auto mt-8 max-w-4xl font-serif text-4xl leading-[1.05] tracking-[-0.04em] sm:text-6xl">
            Toda colaboración comenzará
            <span className="block italic text-stone-500">
              con una conversación.
            </span>
          </h2>

          {contactEmail ? (
            <a
              href={`mailto:${contactEmail}`}
              className="mt-10 inline-flex border border-stone-950 bg-stone-950 px-8 py-4 text-[8px] uppercase tracking-[0.3em] text-white"
            >
              Escribir a Poema Universal
            </a>
          ) : (
            <p className="mx-auto mt-10 max-w-xl text-sm leading-7 text-stone-600">
              El canal de contacto verificado se habilitará
              antes de abrir públicamente las colaboraciones
              y los apoyos económicos.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
