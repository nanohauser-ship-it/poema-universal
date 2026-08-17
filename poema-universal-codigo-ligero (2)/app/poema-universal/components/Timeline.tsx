type TimelineStatus =
  | "completed"
  | "current"
  | "upcoming";

type TimelineStage = {
  number: string;
  period: string;
  title: string;
  description: string;
  status: TimelineStatus;
};

const stages: TimelineStage[] = [
  {
    number: "01",
    period: "2026",
    title: "Nacimiento del proyecto",
    description:
      "Poema Universal nace como una obra colectiva internacional: una sola arquitectura literaria construida por sesenta voces.",
    status: "completed",
  },
  {
    number: "02",
    period: "En curso",
    title: "Convocatoria internacional",
    description:
      "Comienza la búsqueda de poetas, territorios y sensibilidades capaces de formar la edición fundacional.",
    status: "current",
  },
  {
    number: "03",
    period: "Hasta completar 60",
    title: "Constitución de las voces",
    description:
      "Cada incorporación ocupará una de las sesenta posiciones del libro y ampliará la cartografía humana del proyecto.",
    status: "upcoming",
  },
  {
    number: "04",
    period: "Edición fundacional",
    title: "Escritura y custodia",
    description:
      "Los textos serán reunidos, ordenados y preservados como partes de una única obra, sin perder la identidad de cada poeta.",
    status: "upcoming",
  },
  {
    number: "05",
    period: "Diciembre de 2026",
    title: "Cierre editorial",
    description:
      "La edición quedará cerrada. El libro dejará de recibir nuevas voces y comenzará su preparación definitiva.",
    status: "upcoming",
  },
  {
    number: "06",
    period: "1 de enero de 2027",
    title: "Presentación universal",
    description:
      "Poema Universal 2026 será abierto y presentado públicamente como la primera obra anual de la institución.",
    status: "upcoming",
  },
];

function getStatusText(status: TimelineStatus) {
  if (status === "completed") {
    return "Fundado";
  }

  if (status === "current") {
    return "Ahora";
  }

  return "Próximamente";
}

function getNodeClasses(status: TimelineStatus) {
  if (status === "completed") {
    return "border-[#d6b66d] bg-[#d6b66d] text-[#071015]";
  }

  if (status === "current") {
    return "border-[#e6c77d] bg-[#071015] text-[#f0d58f] shadow-[0_0_0_8px_rgba(214,182,109,0.08),0_0_35px_rgba(214,182,109,0.35)]";
  }

  return "border-white/15 bg-[#071015] text-white/30";
}

function getCardClasses(status: TimelineStatus) {
  if (status === "current") {
    return "border-[#d6b66d]/40 bg-[#d6b66d]/[0.06] shadow-[0_30px_90px_rgba(0,0,0,0.24)]";
  }

  if (status === "completed") {
    return "border-white/12 bg-white/[0.035]";
  }

  return "border-white/[0.08] bg-white/[0.018]";
}

export default function Timeline() {
  return (
   <section
  id="cronologia"
  style={{
    backgroundColor: "#050b0f",
    color: "#ffffff",
  }}
  className="relative isolate mt-24 overflow-hidden rounded-[56px] border border-black/20 px-6 py-24 shadow-[0_45px_130px_rgba(0,0,0,0.28)] sm:px-10 lg:px-16"
>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-[#c49b52]/[0.08] blur-[130px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.035),transparent_48%)]"
      />

      <div className="relative z-10">
        <header className="mx-auto max-w-4xl text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#d6b66d] sm:text-xs">
            Cronología institucional
          </p>

          <h2 className="mt-8 font-serif text-5xl tracking-[-0.035em] sm:text-6xl lg:text-7xl">
            El camino hacia
            <span className="block italic text-white/55">
              el primer libro
            </span>
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-sm leading-7 text-white/45 sm:text-base sm:leading-8">
            La edición fundacional avanzará desde su nacimiento
            hasta la presentación pública del 1 de enero de 2027.
            Cada etapa permanecerá registrada como parte de la
            memoria de Poema Universal.
          </p>
        </header>

        <div className="mx-auto mt-20 max-w-5xl">
          {stages.map((stage, index) => {
            const isLast = index === stages.length - 1;

            return (
              <article
                key={stage.number}
                aria-current={
                  stage.status === "current"
                    ? "step"
                    : undefined
                }
                className="relative grid gap-6 pb-8 md:grid-cols-[150px_64px_minmax(0,1fr)] md:gap-8 md:pb-10"
              >
                <div className="pt-1 md:text-right">
                  <p className="text-[9px] uppercase tracking-[0.34em] text-[#d6b66d]">
                    {stage.period}
                  </p>

                  <p className="mt-3 text-[9px] uppercase tracking-[0.28em] text-white/25">
                    {getStatusText(stage.status)}
                  </p>
                </div>

                <div className="relative hidden justify-center md:flex">
                  {!isLast && (
                    <div
                      aria-hidden="true"
                      className="absolute left-1/2 top-14 h-[calc(100%+8px)] w-px -translate-x-1/2 bg-gradient-to-b from-[#d6b66d]/35 to-white/[0.06]"
                    />
                  )}

                  <div
                    className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border font-serif text-sm transition ${getNodeClasses(
                      stage.status
                    )}`}
                  >
                    {stage.number}
                  </div>
                </div>

                <div
                  className={`rounded-[32px] border px-6 py-7 transition sm:px-8 sm:py-8 ${getCardClasses(
                    stage.status
                  )}`}
                >
                  <div className="flex items-start gap-4 md:hidden">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-serif text-xs ${getNodeClasses(
                        stage.status
                      )}`}
                    >
                      {stage.number}
                    </div>

                    <div>
                      <p className="text-[9px] uppercase tracking-[0.28em] text-[#d6b66d]">
                        {stage.period}
                      </p>

                      <p className="mt-2 text-[8px] uppercase tracking-[0.25em] text-white/25">
                        {getStatusText(stage.status)}
                      </p>
                    </div>
                  </div>

                  <h3 className="mt-6 font-serif text-3xl tracking-[-0.025em] text-white md:mt-0 md:text-4xl">
                    {stage.title}
                  </h3>

                  <p className="mt-5 max-w-2xl text-sm leading-7 text-white/43 sm:text-base sm:leading-8">
                    {stage.description}
                  </p>

                  {stage.status === "current" && (
                    <div className="mt-7 flex items-center gap-3">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d6b66d] opacity-40" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#d6b66d]" />
                      </span>

                      <span className="text-[9px] uppercase tracking-[0.3em] text-[#d6b66d]">
                        Etapa activa
                      </span>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mx-auto mt-10 max-w-4xl border-t border-white/10 pt-12 text-center">
          <p className="font-serif text-2xl italic leading-10 text-white/62 sm:text-3xl">
            “Una obra universal no aparece de repente.
            Se construye voz a voz, país a país, hasta que el
            mundo puede reconocerse dentro de ella.”
          </p>

          <p className="mt-7 text-[9px] uppercase tracking-[0.38em] text-[#d6b66d]">
            Poema Universal · Edición fundacional
          </p>
        </div>
      </div>
    </section>
  );
}