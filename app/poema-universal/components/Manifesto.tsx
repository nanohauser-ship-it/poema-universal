export default function Manifesto() {
  return (
    <section className="relative mx-auto mt-36 max-w-7xl overflow-hidden rounded-[54px] border border-stone-200 bg-stone-950 px-7 py-20 text-white shadow-[0_35px_100px_rgba(0,0,0,0.2)] sm:px-12 lg:px-16 lg:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-240px] h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.6) 0.6px, transparent 0.8px)",
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <div className="relative z-10">
        <p className="text-center text-[10px] uppercase tracking-[0.58em] text-stone-400">
          Manifiesto universal
        </p>

        <h2 className="mx-auto mt-8 max-w-5xl text-center font-serif text-5xl font-semibold leading-[1.03] tracking-tight sm:text-7xl lg:text-8xl">
          Una obra escrita
          <br />
          por el mundo.
        </h2>

        <p className="mx-auto mt-10 max-w-3xl text-center text-base leading-9 text-stone-300 sm:text-lg">
          Poema Universal nace para reunir voces que no compiten entre sí.
          Voces que aceptan desaparecer dentro de una obra mayor y entregar una
          parte de su mirada a una memoria compartida.
        </p>

        <div className="mx-auto mt-20 grid max-w-6xl gap-10 border-y border-white/15 py-14 lg:grid-cols-2">
          <div className="font-serif text-3xl leading-[1.55] text-stone-100 sm:text-4xl">
            <p>
              No será una colección de poemas.
              <br />
              No será una suma de autores.
            </p>

            <p className="mt-10">
              Será una sola respiración construida lentamente durante todo un
              año.
            </p>
          </div>

          <div className="grid gap-5">
            {[
              {
                numero: "01",
                titulo: "Una única obra",
                texto:
                  "Cada fragmento deberá servir al poema completo, no únicamente a quien lo escribe.",
              },
              {
                numero: "02",
                titulo: "Sesenta voces",
                texto:
                  "Ningún poeta estará por encima de otro. Todos ocuparán el mismo lugar dentro de la edición.",
              },
              {
                numero: "03",
                titulo: "Un año entero",
                texto:
                  "La obra crecerá durante 2026 y permanecerá cerrada hasta su presentación oficial.",
              },
              {
                numero: "04",
                titulo: "Una memoria común",
                texto:
                  "El poema deberá conservar aquello que el año dejó escrito en nosotros.",
              },
            ].map((principio) => (
              <article
                key={principio.numero}
                className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur"
              >
                <div className="flex items-start gap-5">
                  <p className="pt-1 text-[10px] uppercase tracking-[0.3em] text-stone-500">
                    {principio.numero}
                  </p>

                  <div>
                    <h3 className="font-serif text-2xl text-white">
                      {principio.titulo}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-stone-400">
                      {principio.texto}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <blockquote className="mx-auto mt-20 max-w-4xl text-center font-serif text-4xl leading-[1.4] text-white sm:text-5xl">
          “No estamos escribiendo un libro.
          <br />
          Estamos escribiendo un año.”
        </blockquote>
      </div>
    </section>
  );
}