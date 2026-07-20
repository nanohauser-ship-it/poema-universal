import Link from "next/link";

const voices = [
  {
    language: "Español",
    text: "Buscamos voces que todavía no hayan encontrado una casa.",
    direction: "ltr",
  },
  {
    language: "English",
    text: "We are looking for voices that have not yet found a home.",
    direction: "ltr",
  },
  {
    language: "Français",
    text: "Nous cherchons des voix qui n’ont pas encore trouvé de maison.",
    direction: "ltr",
  },
  {
    language: "Português",
    text: "Procuramos vozes que ainda não encontraram uma casa.",
    direction: "ltr",
  },
  {
    language: "Italiano",
    text: "Cerchiamo voci che non hanno ancora trovato una casa.",
    direction: "ltr",
  },
  {
    language: "Deutsch",
    text: "Wir suchen Stimmen, die noch kein Zuhause gefunden haben.",
    direction: "ltr",
  },
  {
    language: "العربية",
    text: "نبحث عن أصوات لم تجد بيتًا بعد.",
    direction: "rtl",
  },
  {
    language: "日本語",
    text: "まだ居場所を見つけていない声を探しています。",
    direction: "ltr",
  },
  {
    language: "中文",
    text: "我们寻找尚未找到归宿的声音。",
    direction: "ltr",
  },
  {
    language: "한국어",
    text: "아직 집을 찾지 못한 목소리를 찾고 있습니다.",
    direction: "ltr",
  },
  {
    language: "हिन्दी",
    text: "हम उन आवाज़ों को खोज रहे हैं जिन्हें अभी तक अपना घर नहीं मिला।",
    direction: "ltr",
  },
  {
    language: "Русский",
    text: "Мы ищем голоса, которые ещё не нашли свой дом.",
    direction: "ltr",
  },
];

const principles = [
  {
    number: "01",
    title: "No buscamos prestigio",
    text: "No importan los premios, el currículum, la editorial ni el número de seguidores.",
  },
  {
    number: "02",
    title: "Buscamos una voz",
    text: "Un poema capaz de conservar una experiencia, una imagen o una verdad propia.",
  },
  {
    number: "03",
    title: "Todas las lenguas tienen lugar",
    text: "El poema se conservará en su idioma original y podrá convivir con su traducción.",
  },
  {
    number: "04",
    title: "La primera lectura será anónima",
    text: "El nombre y la biografía no decidirán el valor de una obra.",
  },
];

export default function ConvocatoriaPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#efe4d2] text-[#21170f]">
      <style>{`
        @keyframes babelFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -12px, 0);
          }
        }

        @keyframes babelBreath {
          0%, 100% {
            opacity: .42;
            transform: scale(1);
          }
          50% {
            opacity: .74;
            transform: scale(1.045);
          }
        }

        @keyframes babelLine {
          0% {
            transform: scaleX(.12);
            opacity: .18;
          }
          50% {
            transform: scaleX(1);
            opacity: .7;
          }
          100% {
            transform: scaleX(.12);
            opacity: .18;
          }
        }

        .babel-voice:nth-child(3n + 1) {
          animation-delay: -2s;
        }

        .babel-voice:nth-child(3n + 2) {
          animation-delay: -5s;
        }

        .babel-voice:nth-child(3n) {
          animation-delay: -8s;
        }
      `}</style>

      <header className="relative z-50 border-b border-[#4b3420]/10 bg-[#efe4d2]/88 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[74px] max-w-[1500px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="font-serif text-xl tracking-[-0.025em]"
          >
            Poema Universal
          </Link>

          <p className="hidden text-[8px] uppercase tracking-[0.38em] text-[#5d4631]/45 sm:block">
            Convocatoria fundacional · 2026
          </p>

          <Link
            href="/poema-universal"
            className="border border-[#4b3420]/18 px-5 py-2.5 text-[8px] uppercase tracking-[0.3em] text-[#4b3420]/68 transition hover:border-[#4b3420]/42 hover:text-[#21170f]"
          >
            Volver a la sala
          </Link>
        </div>
      </header>

      <section className="relative min-h-[920px] overflow-hidden border-b border-[#4b3420]/12">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 26%, rgba(255,255,255,0.86), transparent 28%), radial-gradient(circle at 48% 72%, rgba(164,112,57,0.17), transparent 34%), linear-gradient(180deg, #f6ecdc 0%, #e8d6bc 62%, #d7bea0 100%)",
          }}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.09]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(65,42,22,0.34) 0.55px, transparent 0.8px)",
            backgroundSize: "17px 17px",
          }}
        />

        <div className="relative mx-auto grid min-h-[920px] max-w-[1500px] items-center gap-16 px-5 py-24 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:px-12">
          <div className="relative z-20">
            <p className="text-[9px] uppercase tracking-[0.55em] text-[#8a6239]">
              Sesenta voces · todo el mundo
            </p>

            <h1 className="mt-8 font-serif text-6xl leading-[0.88] tracking-[-0.06em] sm:text-8xl lg:text-[116px]">
              La Torre
              <span className="block italic text-[#6f4d2d]/52">
                de Babel
              </span>
            </h1>

            <p className="mt-10 max-w-xl font-serif text-2xl leading-[1.42] text-[#2f2117]/72 sm:text-3xl">
              No buscamos a los poetas más conocidos.
              Buscamos sesenta voces que todavía no hayan
              encontrado una casa.
            </p>

            <p className="mt-8 max-w-xl text-sm leading-8 text-[#3c2a1d]/62">
              Personas que escriben desde su vida, su herida,
              su memoria, su barrio, su lengua y su silencio.
              No importa la fama. Importa la verdad del poema.
            </p>

            <Link
              href="#participar"
              className="mt-10 inline-flex border border-[#8a6239]/46 px-7 py-4 text-[8px] uppercase tracking-[0.34em] text-[#674523] transition hover:border-[#674523] hover:bg-[#674523]/[0.05]"
            >
              Enviar un poema ↓
            </Link>
          </div>

          <div className="relative min-h-[720px]">
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-[5%] h-[660px] w-[660px] -translate-x-1/2 rounded-full bg-white/40 blur-3xl"
              style={{
                animation: "babelBreath 12s ease-in-out infinite",
              }}
            />

            <div className="absolute inset-x-0 bottom-0 top-0 flex items-end justify-center">
              <div className="relative h-[700px] w-full max-w-[700px]">
                <div className="absolute bottom-0 left-1/2 h-[620px] w-[82%] -translate-x-1/2">
                  {Array.from({ length: 15 }).map((_, index) => {
                    const width = 94 - index * 4.5;
                    const bottom = index * 37;
                    const rotate =
                      index % 2 === 0
                        ? -1.4 + index * 0.08
                        : 1.2 - index * 0.06;

                    return (
                      <div
                        key={index}
                        aria-hidden="true"
                        className="absolute left-1/2 h-[54px] -translate-x-1/2 border border-[#80603e]/30 bg-[#e8d2b0]/76 shadow-[0_12px_30px_rgba(57,35,18,0.12)] backdrop-blur-[2px]"
                        style={{
                          width: `${width}%`,
                          bottom,
                          transform: `translateX(-50%) rotate(${rotate}deg)`,
                        }}
                      >
                        <div className="absolute inset-x-4 top-3 h-px bg-[#6a4b2e]/16" />
                        <div className="absolute inset-x-7 top-6 h-px bg-[#6a4b2e]/10" />
                        <div className="absolute inset-x-5 top-9 h-px bg-[#6a4b2e]/13" />
                      </div>
                    );
                  })}

                  <div className="absolute bottom-[554px] left-1/2 h-24 w-20 -translate-x-1/2 border border-[#80603e]/28 bg-[#e7cfaa]/78 shadow-[0_12px_40px_rgba(57,35,18,0.14)]" />
                </div>

                {voices.map((voice, index) => {
                  const isLeft = index % 2 === 0;
                  const top = 5 + index * 7.4;

                  return (
                    <div
                      key={voice.language}
                      className={`babel-voice absolute z-20 max-w-[250px] ${
                        isLeft
                          ? "left-0 text-right"
                          : "right-0 text-left"
                      }`}
                      style={{
                        top: `${top}%`,
                        animation:
                          "babelFloat 10s ease-in-out infinite",
                      }}
                    >
                      <p
                        dir={voice.direction}
                        className="font-serif text-base italic leading-6 text-[#332116]/74"
                      >
                        {voice.text}
                      </p>

                      <p className="mt-2 text-[7px] uppercase tracking-[0.3em] text-[#6b4a2b]/44">
                        {voice.language}
                      </p>

                      <span
                        aria-hidden="true"
                        className={`absolute top-1/2 h-px w-16 origin-center bg-[#7d5833]/28 ${
                          isLeft
                            ? "-right-20"
                            : "-left-20"
                        }`}
                        style={{
                          animation:
                            "babelLine 8s ease-in-out infinite",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#4b3420]/12 bg-[#21170f] text-[#f1e5d1]">
        <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-[8px] uppercase tracking-[0.48em] text-[#c7a467]">
                Lo que buscamos
              </p>

              <h2 className="mt-7 max-w-xl font-serif text-5xl leading-[0.98] tracking-[-0.045em] sm:text-7xl">
                Una voz,
                <span className="block italic text-white/38">
                  no un currículum.
                </span>
              </h2>
            </div>

            <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-2">
              {principles.map((principle) => (
                <article
                  key={principle.number}
                  className="min-h-[260px] bg-[#21170f] p-8 sm:p-10"
                >
                  <p className="font-serif text-4xl italic text-white/12">
                    {principle.number}
                  </p>

                  <h3 className="mt-12 font-serif text-2xl text-white/76">
                    {principle.title}
                  </h3>

                  <p className="mt-5 text-sm leading-7 text-white/38">
                    {principle.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="participar"
        className="relative border-b border-[#4b3420]/12 bg-[#f4eadb]"
      >
        <div className="mx-auto max-w-[1100px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="text-center">
            <p className="text-[8px] uppercase tracking-[0.48em] text-[#8a6239]">
              Convocatoria fundacional
            </p>

            <h2 className="mt-7 font-serif text-5xl leading-[0.98] tracking-[-0.05em] sm:text-7xl">
              Sesenta voces.
              <span className="block italic text-[#694929]/52">
                Una sola casa.
              </span>
            </h2>

            <p className="mx-auto mt-8 max-w-2xl text-sm leading-8 text-[#3d2a1c]/58">
              Podrás enviar un poema en cualquier idioma,
              con tu nombre, un seudónimo o de manera anónima.
            </p>
          </div>

          <div className="mt-16 border border-[#6e4c2c]/18 bg-white/38 p-7 shadow-[0_35px_90px_rgba(83,53,27,0.1)] backdrop-blur-xl sm:p-10 lg:p-14">
            <div className="grid gap-8 md:grid-cols-2">
              <label className="block">
                <span className="text-[8px] uppercase tracking-[0.32em] text-[#5c4026]/58">
                  Nombre o seudónimo
                </span>
                <input
                  type="text"
                  className="mt-3 w-full border-b border-[#5d4027]/22 bg-transparent py-3 text-base outline-none transition focus:border-[#5d4027]/60"
                />
              </label>

              <label className="block">
                <span className="text-[8px] uppercase tracking-[0.32em] text-[#5c4026]/58">
                  Correo electrónico
                </span>
                <input
                  type="email"
                  className="mt-3 w-full border-b border-[#5d4027]/22 bg-transparent py-3 text-base outline-none transition focus:border-[#5d4027]/60"
                />
              </label>

              <label className="block">
                <span className="text-[8px] uppercase tracking-[0.32em] text-[#5c4026]/58">
                  País o territorio
                </span>
                <input
                  type="text"
                  className="mt-3 w-full border-b border-[#5d4027]/22 bg-transparent py-3 text-base outline-none transition focus:border-[#5d4027]/60"
                />
              </label>

              <label className="block">
                <span className="text-[8px] uppercase tracking-[0.32em] text-[#5c4026]/58">
                  Idioma del poema
                </span>
                <input
                  type="text"
                  className="mt-3 w-full border-b border-[#5d4027]/22 bg-transparent py-3 text-base outline-none transition focus:border-[#5d4027]/60"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="text-[8px] uppercase tracking-[0.32em] text-[#5c4026]/58">
                  Título
                </span>
                <input
                  type="text"
                  className="mt-3 w-full border-b border-[#5d4027]/22 bg-transparent py-3 text-base outline-none transition focus:border-[#5d4027]/60"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="text-[8px] uppercase tracking-[0.32em] text-[#5c4026]/58">
                  Poema original
                </span>
                <textarea
                  rows={14}
                  className="mt-4 w-full resize-y border border-[#5d4027]/16 bg-[#f9f1e5]/60 p-5 font-serif text-lg leading-8 outline-none transition focus:border-[#5d4027]/45"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="text-[8px] uppercase tracking-[0.32em] text-[#5c4026]/58">
                  Traducción opcional
                </span>
                <textarea
                  rows={8}
                  className="mt-4 w-full resize-y border border-[#5d4027]/16 bg-[#f9f1e5]/60 p-5 font-serif text-lg leading-8 outline-none transition focus:border-[#5d4027]/45"
                />
              </label>
            </div>

            <div className="mt-10 flex flex-col items-start justify-between gap-7 border-t border-[#5d4027]/14 pt-8 sm:flex-row sm:items-center">
              <p className="max-w-xl text-xs leading-6 text-[#4a321f]/48">
                El formulario visual ya está preparado. La
                conexión definitiva con Supabase se realizará
                en el siguiente paso.
              </p>

              <button
                type="button"
                disabled
                className="border border-[#684725]/24 px-7 py-4 text-[8px] uppercase tracking-[0.34em] text-[#684725]/38"
              >
                Envío en preparación
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#21170f] px-5 py-12 text-[#f1e5d1] sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-xl">
            Poema Universal
          </p>

          <p className="text-[8px] uppercase tracking-[0.38em] text-white/28">
            Sesenta voces · sesenta lugares · una sola casa
          </p>
        </div>
      </footer>
    </main>
  );
}
