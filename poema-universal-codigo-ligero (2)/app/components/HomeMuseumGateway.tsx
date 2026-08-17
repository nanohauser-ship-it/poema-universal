import Link from "next/link";

const museumRooms = [
  {
    number: "I",
    title: "No dejes que desaparezcamos",
    atmosphere: "Memoria · ceniza · promesa",
  },
  {
    number: "II",
    title: "La Jerarquía del Hambre",
    atmosphere: "Hierro · cuerpo · desigualdad",
  },
  {
    number: "III",
    title: "Memorias de Bielka",
    atmosphere: "Agua · laberinto · recuerdo",
  },
];

export default function HomeMuseumGateway() {
  return (
    <section
      aria-labelledby="home-museum-title"
      className="relative isolate overflow-hidden bg-[#050608] text-[#f0e8dc]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(circle at 18% 30%, rgba(199,164,103,0.12), transparent 28%), radial-gradient(circle at 82% 64%, rgba(153,198,207,0.1), transparent 30%), linear-gradient(180deg, #050608 0%, #090a0c 48%, #050608 100%)",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c7a467]/40 to-transparent"
      />

      <div className="relative mx-auto max-w-[1550px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
        <div className="grid gap-16 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="text-[8px] uppercase tracking-[0.48em] text-[#c7a467]">
              El museo interior
            </p>

            <h2
              id="home-museum-title"
              className="mt-7 max-w-3xl font-serif text-5xl leading-[0.9] tracking-[-0.055em] text-white sm:text-7xl lg:text-[92px]"
            >
              Museo de los
              <span className="block italic text-white/48">
                Tres Mundos
              </span>
            </h2>

            <p className="mt-9 max-w-xl font-serif text-xl leading-9 text-white/46 sm:text-2xl">
              Veinticuatro imágenes formarán la memoria visual
              de las tres novelas. Cada obra será una puerta,
              una herida y una forma de regresar.
            </p>

            <div className="mt-11 flex flex-col items-start gap-4 sm:flex-row">
              <Link
                href="/museo-de-los-tres-mundos/recorrido"
                className="group inline-flex min-h-14 items-center justify-center border border-[#c7a467]/55 px-7 text-[8px] uppercase tracking-[0.32em] text-[#d8bc87] transition duration-500 hover:border-[#d8bc87] hover:bg-[#c7a467]/[0.07]"
              >
                Entrar al recorrido 3D
                <span className="ml-4 transition-transform duration-500 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                href="/museo-de-los-tres-mundos"
                className="inline-flex min-h-14 items-center justify-center border-b border-white/20 px-2 text-[8px] uppercase tracking-[0.32em] text-white/44 transition duration-500 hover:border-white/55 hover:text-white"
              >
                Explorar la colección
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
              {museumRooms.map((room, index) => (
                <article
                  key={room.number}
                  className="group relative min-h-[310px] overflow-hidden bg-[#090a0c] p-7 sm:p-9"
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100"
                    style={{
                      background:
                        index === 0
                          ? "radial-gradient(circle at 50% 76%, rgba(184,140,97,0.2), transparent 42%)"
                          : index === 1
                            ? "radial-gradient(circle at 50% 76%, rgba(143,63,57,0.2), transparent 42%)"
                            : "radial-gradient(circle at 50% 76%, rgba(185,220,226,0.18), transparent 42%)",
                    }}
                  />

                  <div className="relative flex h-full flex-col justify-between">
                    <div className="flex items-center gap-4">
                      <span className="font-serif text-3xl italic text-white/18">
                        {room.number}
                      </span>

                      <span className="h-px flex-1 bg-white/10" />
                    </div>

                    <div className="mt-20">
                      <h3 className="font-serif text-3xl leading-[1.02] tracking-[-0.035em] text-white/72 transition duration-500 group-hover:text-white">
                        {room.title}
                      </h3>

                      <p className="mt-5 text-[7px] uppercase tracking-[0.27em] text-white/26">
                        {room.atmosphere}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between gap-6">
              <p className="text-[7px] uppercase tracking-[0.3em] text-white/22">
                3 mundos · 24 fotografías · 1 memoria
              </p>

              <span className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
    </section>
  );
}
