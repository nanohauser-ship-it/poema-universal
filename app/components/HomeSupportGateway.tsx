import Link from "next/link";

const supportPaths = [
  {
    number: "01",
    title: "Colaborar",
    text: "Aportar traducción, edición, investigación, diseño, tecnología, imagen, sonido o mediación cultural.",
    href: "/colaborar#colaborar",
    action: "Ofrecer una colaboración",
  },
  {
    number: "02",
    title: "Sostener",
    text: "Ayudar a financiar la existencia material de la edición: traducción, impresión, archivo y presentación.",
    href: "/colaborar#sostener",
    action: "Sostener la edición",
  },
];

export default function HomeSupportGateway() {
  return (
    <section
      aria-labelledby="home-support-title"
      className="relative mt-24 overflow-hidden rounded-[36px] border border-stone-900/10 bg-white/48 shadow-[0_24px_70px_rgba(70,48,29,0.08)] backdrop-blur-md sm:rounded-[48px]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 12% 24%, rgba(199,164,103,0.17), transparent 28%), radial-gradient(circle at 88% 78%, rgba(255,255,255,0.7), transparent 34%)",
        }}
      />

      <div className="relative grid lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col justify-between border-b border-stone-900/10 p-7 sm:p-10 lg:border-b-0 lg:border-r lg:p-14">
          <div>
            <p className="text-[8px] uppercase tracking-[0.42em] text-[#9a743e]">
              Quienes hacen posible la obra
            </p>

            <h2
              id="home-support-title"
              className="mt-8 max-w-2xl font-serif text-4xl leading-[1.02] tracking-[-0.045em] sm:text-6xl"
            >
              No todas las manos
              <span className="block italic text-stone-500">
                escribirán un verso.
              </span>
            </h2>

            <p className="mt-8 max-w-xl text-sm leading-8 text-stone-600">
              Algunas traducirán, corregirán, investigarán,
              diseñarán o sostendrán la obra para que sesenta
              voces puedan cruzar el mundo.
            </p>
          </div>

          <div className="mt-12 border-l border-[#9a743e]/35 pl-5">
            <p className="font-serif text-xl italic leading-8 text-stone-700">
              El apoyo podrá sostener el libro.
              <span className="block">
                Nunca decidir quién lo escribe.
              </span>
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2">
          {supportPaths.map((path) => (
            <article
              key={path.number}
              className="group flex min-h-[330px] flex-col justify-between border-b border-stone-900/10 p-7 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 sm:p-9"
            >
              <div>
                <span className="font-serif text-xl italic text-[#9a743e]">
                  {path.number}
                </span>

                <h3 className="mt-10 font-serif text-3xl tracking-[-0.03em] text-stone-900">
                  {path.title}
                </h3>

                <p className="mt-6 text-sm leading-7 text-stone-600">
                  {path.text}
                </p>
              </div>

              <Link
                href={path.href}
                className="mt-12 inline-flex items-center gap-4 text-[8px] font-semibold uppercase tracking-[0.28em] text-[#8b6737] transition group-hover:text-stone-950"
              >
                {path.action}

                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>

      <div className="relative flex flex-col gap-6 border-t border-stone-900/10 px-7 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-14">
        <p className="text-[8px] uppercase tracking-[0.28em] text-stone-500">
          Independencia editorial · transparencia · derecho al anonimato
        </p>

        <Link
          href="/colaborar"
          className="w-fit border-b border-stone-900/25 pb-1 text-[8px] uppercase tracking-[0.3em] text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
        >
          Leer la carta ética completa
        </Link>
      </div>
    </section>
  );
}
