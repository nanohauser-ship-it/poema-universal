import Link from "next/link";

const worlds = [
  {
    number: "III",
    title: "Memorias de Bielka",
    tone: "rgba(183, 218, 225, 0.72)",
    light: "rgba(220, 233, 235, 0.72)",
    dark: "rgba(82, 112, 123, 0.76)",
  },
  {
    number: "I",
    title: "No dejes que desaparezcamos",
    tone: "rgba(215, 180, 119, 0.74)",
    light: "rgba(216, 200, 178, 0.72)",
    dark: "rgba(106, 79, 62, 0.78)",
  },
  {
    number: "II",
    title: "La Jerarquía del Hambre",
    tone: "rgba(155, 85, 67, 0.78)",
    light: "rgba(88, 74, 67, 0.8)",
    dark: "rgba(20, 19, 22, 0.94)",
  },
] as const;

const squares = Array.from(
  { length: 64 },
  (_, index) => index
);

export default function HomeThreeWorldsGateway() {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-[#07090c] text-[#f0e8dc]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 72% 25%, rgba(177,211,219,0.11), transparent 28%), radial-gradient(circle at 28% 78%, rgba(127,47,37,0.16), transparent 32%), linear-gradient(115deg, rgba(255,255,255,0.025), transparent 42%)",
        }}
      />

      <div className="relative mx-auto grid min-h-[760px] max-w-[1550px] items-center gap-16 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[0.82fr_1.18fr] lg:px-12">
        <div className="relative z-20 max-w-2xl">
          <p className="text-[8px] uppercase tracking-[0.5em] text-[#c7a467]">
            Obra visual interactiva
          </p>

          <h2 className="mt-8 font-serif text-6xl leading-[0.9] tracking-[-0.065em] sm:text-7xl lg:text-[94px]">
            El Tablero
            <span className="block italic text-white/36">
              de los Tres Mundos.
            </span>
          </h2>

          <p className="mt-10 max-w-xl font-serif text-2xl leading-[1.45] text-white/65">
            Tres obras suspendidas alrededor de una misma
            raíz.
          </p>

          <p className="mt-6 max-w-xl text-sm leading-8 text-white/40">
            Recorre las reliquias de{" "}
            <span className="text-white/62">
              No dejes que desaparezcamos
            </span>
            ,{" "}
            <span className="text-white/62">
              La Jerarquía del Hambre
            </span>{" "}
            y{" "}
            <span className="text-white/62">
              Memorias de Bielka
            </span>
            .
          </p>

          <blockquote className="mt-10 border-l border-[#c7a467]/35 pl-6 font-serif text-xl italic leading-8 text-white/46">
            El tronco conserva la memoria.
            <br />
            Las raíces atraviesan el hambre.
            <br />
            Las ramas entran en el laberinto.
          </blockquote>

          <Link
            href="/tablero-de-los-tres-mundos"
            className="group mt-12 inline-flex items-center gap-5 border-b border-[#c7a467]/45 pb-3 text-[8px] uppercase tracking-[0.36em] text-[#c7a467] transition hover:border-[#c7a467]"
          >
            Entrar en el tablero

            <span
              aria-hidden="true"
              className="transition-transform duration-500 group-hover:translate-x-2"
            >
              →
            </span>
          </Link>
        </div>

        <div className="relative min-h-[520px] lg:min-h-[650px]">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[490px] w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-[#dce9eb]/10 via-[#eee5d6]/90 to-[#8f5143]/15 shadow-[0_0_38px_rgba(236,225,207,0.26)]"
          />

          <div
            aria-hidden="true"
            className="absolute left-1/2 top-[16%] h-28 w-28 -translate-x-1/2 rounded-full border border-white/10 bg-[#e9e4d9]/[0.035] blur-[1px]"
          />

          <div
            aria-hidden="true"
            className="absolute bottom-[12%] left-1/2 h-32 w-52 -translate-x-1/2 rounded-[50%] bg-[#723124]/10 blur-3xl"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 [perspective:1100px]">
            {worlds.map((world, worldIndex) => {
              const order =
                world.number === "I"
                  ? "Primera obra"
                  : world.number === "II"
                    ? "Segunda obra"
                    : "Tercera obra";

              return (
                <div
                  key={world.title}
                  className="relative h-[146px] w-full max-w-[510px]"
                  style={{
                    zIndex: 30 - worldIndex,
                    transform:
                      worldIndex === 0
                        ? "translateY(20px)"
                        : worldIndex === 1
                          ? "translateY(0)"
                          : "translateY(-20px)",
                  }}
                >
                  <div
                    className="absolute left-1/2 top-1/2 grid h-[235px] w-[235px] -translate-x-1/2 -translate-y-1/2 grid-cols-8 border shadow-2xl sm:h-[275px] sm:w-[275px]"
                    style={{
                      transform:
                        "translate(-50%, -50%) rotateX(62deg) rotateZ(-45deg)",
                      borderColor: `${world.tone}66`,
                      boxShadow: `0 30px 70px rgba(0,0,0,0.48), 0 0 28px ${world.tone}22`,
                    }}
                  >
                    {squares.map((square) => {
                      const row = Math.floor(square / 8);
                      const column = square % 8;
                      const light =
                        (row + column) % 2 === 0;

                      return (
                        <span
                          key={square}
                          style={{
                            backgroundColor: light
                              ? world.light
                              : world.dark,
                          }}
                        />
                      );
                    })}
                  </div>

                  <div
                    className="absolute left-0 top-1/2 hidden -translate-y-1/2 xl:block"
                    style={{
                      color: world.tone,
                    }}
                  >
                    <p className="text-[7px] uppercase tracking-[0.3em] opacity-60">
                      {order}
                    </p>

                    <p className="mt-2 font-serif text-lg text-white/55">
                      {world.title}
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="absolute right-0 top-1/2 hidden -translate-y-1/2 font-serif text-6xl opacity-[0.09] xl:block"
                    style={{
                      color: world.tone,
                    }}
                  >
                    {world.number}
                  </span>
                </div>
              );
            })}
          </div>

          <div
            aria-hidden="true"
            className="absolute left-1/2 top-[17%] h-4 w-4 -translate-x-1/2 rounded-full border border-[#e5ded2]/50 bg-[#e5ded2]/30 shadow-[0_0_24px_rgba(229,222,210,0.45)]"
          />

          <div
            aria-hidden="true"
            className="absolute bottom-[16%] left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border border-[#9b5543]/40 bg-[#9b5543]/20"
          />
        </div>
      </div>

      <div className="border-t border-white/[0.07]">
        <div className="mx-auto flex max-w-[1550px] flex-col gap-4 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <p className="text-[7px] uppercase tracking-[0.3em] text-white/25">
            Doce reliquias · tres niveles · un Árbol Blanco
          </p>

          <p className="text-[7px] uppercase tracking-[0.3em] text-white/25">
            Arrastra · gira · descubre
          </p>
        </div>
      </div>
    </section>
  );
}
