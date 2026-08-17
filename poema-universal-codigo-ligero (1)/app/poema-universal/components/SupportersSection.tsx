import Link from "next/link";

const collaborationAreas = [
  "Traducción",
  "Corrección",
  "Investigación",
  "Diseño",
  "Tecnología",
  "Producción audiovisual",
];

const ethicalPrinciples = [
  {
    number: "I",
    title: "Independencia editorial",
    text: "Ninguna aportación concede influencia sobre la selección de poetas, poemas, territorios o decisiones editoriales.",
  },
  {
    number: "II",
    title: "Una misma dignidad",
    text: "No existirán categorías comerciales de prestigio. Los apoyos públicos serán reconocidos sin jerarquías económicas.",
  },
  {
    number: "III",
    title: "Transparencia",
    text: "La edición explicará qué recursos recibe y a qué necesidades concretas de la obra han sido destinados.",
  },
  {
    number: "IV",
    title: "Derecho al anonimato",
    text: "Toda persona podrá colaborar públicamente o permanecer en silencio, siempre que el origen del apoyo sea legítimo y verificable.",
  },
];

export default function SupportersSection() {
  return (
    <section
      id="hacer-posible"
      aria-labelledby="supporters-title"
      className="relative overflow-hidden border-t border-white/[0.12] bg-[#080b0e] text-[#f0e8dc]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 18% 22%, rgba(199,164,103,0.13), transparent 28%), radial-gradient(circle at 88% 76%, rgba(104,126,143,0.1), transparent 32%), linear-gradient(145deg, #080b0e 0%, #0d1217 52%, #07090b 100%)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.065]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(240,232,220,0.74) 0.5px, transparent 0.7px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative mx-auto max-w-[1380px] px-5 py-28 sm:px-8 sm:py-36 lg:px-12 lg:py-44">
        <div className="grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24">
          <div>
            <p
              className="text-[9px] uppercase tracking-[0.48em]"
              style={{ color: "#c7a467" }}
            >
              05 · Quienes hacen posible la obra
            </p>

            <h2
              id="supporters-title"
              className="mt-9 max-w-3xl font-serif text-5xl leading-[0.98] tracking-[-0.05em] sm:text-7xl lg:text-[82px]"
            >
              Sesenta poetas
              <span
                className="block italic"
                style={{
                  color: "rgba(240,232,220,0.52)",
                }}
              >
                escribirán el libro.
              </span>
            </h2>

            <p className="mt-10 max-w-xl font-serif text-2xl leading-[1.35] text-white/76 sm:text-3xl">
              Otras manos harán posible que esos versos
              crucen el mundo.
            </p>

            <p className="mt-8 max-w-xl text-sm leading-8 text-white/48 sm:text-base">
              Poema Universal necesitará traducción,
              edición, investigación, tecnología,
              producción, impresión y cuidado. No todas
              las personas que formen parte de la obra
              escribirán un verso.
            </p>
          </div>

          <div className="grid border-l border-t border-white/[0.14] md:grid-cols-2">
            <article className="flex min-h-[390px] flex-col justify-between border-b border-r border-white/[0.14] p-7 sm:p-9">
              <div>
                <span
                  className="font-serif text-2xl italic"
                  style={{ color: "#c7a467" }}
                >
                  01
                </span>

                <h3 className="mt-10 font-serif text-4xl tracking-[-0.035em]">
                  Colaborar
                </h3>

                <p className="mt-6 text-sm leading-7 text-white/48">
                  Personas que aporten conocimiento,
                  oficio, tiempo o vínculos culturales a
                  la edición fundacional.
                </p>

                <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3">
                  {collaborationAreas.map((area) => (
                    <span
                      key={area}
                      className="text-[7px] uppercase tracking-[0.25em] text-white/42"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href="/colaborar#colaborar"
                className="mt-12 inline-flex items-center gap-4 text-[8px] uppercase tracking-[0.3em] text-[#c7a467] transition hover:text-[#dfc28e]"
              >
                Ofrecer una colaboración
                <span aria-hidden="true">→</span>
              </Link>
            </article>

            <article className="flex min-h-[390px] flex-col justify-between border-b border-r border-white/[0.14] p-7 sm:p-9">
              <div>
                <span
                  className="font-serif text-2xl italic"
                  style={{ color: "#c7a467" }}
                >
                  02
                </span>

                <h3 className="mt-10 font-serif text-4xl tracking-[-0.035em]">
                  Sostener
                </h3>

                <p className="mt-6 text-sm leading-7 text-white/48">
                  Personas e instituciones que ayuden a
                  financiar traducciones, edición,
                  infraestructura, impresión y
                  presentación pública.
                </p>

                <p className="mt-8 font-serif text-xl italic leading-8 text-white/68">
                  El apoyo sostiene la obra.
                  <span className="block">
                    Nunca compra una voz.
                  </span>
                </p>
              </div>

              <Link
                href="/colaborar#sostener"
                className="mt-12 inline-flex items-center gap-4 text-[8px] uppercase tracking-[0.3em] text-[#c7a467] transition hover:text-[#dfc28e]"
              >
                Sostener la edición
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          </div>
        </div>

        <div className="mt-24 border-t border-white/[0.12] pt-14 sm:mt-32 sm:pt-20">
          <div className="flex flex-col gap-7 border-b border-white/[0.12] pb-12 md:flex-row md:items-end md:justify-between">
            <div>
              <p
                className="text-[8px] uppercase tracking-[0.4em]"
                style={{ color: "#c7a467" }}
              >
                Carta de independencia
              </p>

              <h3 className="mt-7 max-w-3xl font-serif text-4xl leading-[1.05] tracking-[-0.04em] sm:text-6xl">
                La obra podrá recibir apoyo.
                <span className="block italic text-white/46">
                  Su criterio no estará en venta.
                </span>
              </h3>
            </div>

            <p className="max-w-sm text-sm leading-7 text-white/42">
              Esta norma protegerá la selección de las
              sesenta voces durante toda la vida de la
              edición fundacional.
            </p>
          </div>

          <ol className="grid border-l border-t border-white/[0.12] md:grid-cols-2 xl:grid-cols-4">
            {ethicalPrinciples.map((principle) => (
              <li
                key={principle.number}
                className="min-h-[280px] border-b border-r border-white/[0.12] p-7 sm:p-8"
              >
                <span
                  className="font-serif text-xl italic"
                  style={{ color: "#c7a467" }}
                >
                  {principle.number}
                </span>

                <h4 className="mt-10 font-serif text-2xl leading-tight">
                  {principle.title}
                </h4>

                <p className="mt-6 text-sm leading-7 text-white/42">
                  {principle.text}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-14 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl font-serif text-xl italic leading-8 text-white/58 sm:text-2xl">
              Ninguna persona ocupará más espacio por
              haber aportado más dinero.
            </p>

            <Link
              href="/colaborar"
              className="inline-flex w-fit items-center justify-center border border-[#c7a467] px-7 py-4 text-[8px] uppercase tracking-[0.3em] text-[#c7a467] transition hover:bg-[#c7a467] hover:text-[#080b0e]"
            >
              Conocer la carta completa
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
