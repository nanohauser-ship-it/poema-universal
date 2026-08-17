type VoiceStatus = "incorporation" | "available";

type VoiceSlot = {
  position: number;
  status: VoiceStatus;
};

const TOTAL_VOICES = 60;
const INCORPORATION_VOICES = 4;

const voiceSlots: VoiceSlot[] = Array.from(
  { length: TOTAL_VOICES },
  (_, index) => ({
    position: index + 1,
    status:
      index < INCORPORATION_VOICES
        ? "incorporation"
        : "available",
  })
);

export default function VoicesWall() {
  const availableVoices =
    TOTAL_VOICES - INCORPORATION_VOICES;

  const progress =
    (INCORPORATION_VOICES / TOTAL_VOICES) * 100;

  return (
    <section
      id="voces"
      aria-labelledby="voices-title"
      className="relative py-28 sm:py-36 lg:py-44"
    >
      {/* ENCABEZADO */}

      <div className="grid gap-14 border-t border-white/10 pt-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-24">
        <div>
          <p
            className="text-[9px] uppercase tracking-[0.46em]"
            style={{ color: "#d0a866" }}
          >
            La asamblea de las voces
          </p>

          <h2
            id="voices-title"
            className="mt-8 max-w-4xl font-serif text-5xl leading-[0.97] tracking-[-0.05em] sm:text-7xl lg:text-[88px]"
            style={{ color: "#f1eadf" }}
          >
            Sesenta lugares.
            <span
              className="block italic"
              style={{
                color: "rgba(241,234,223,0.52)",
              }}
            >
              Una sola obra.
            </span>
          </h2>
        </div>

        <div className="flex flex-col justify-end">
          <p
            className="max-w-2xl font-serif text-2xl italic leading-[1.55] sm:text-3xl"
            style={{
              color: "rgba(241,234,223,0.72)",
            }}
          >
            Cada lugar representa una voz convocada a
            construir la edición fundacional de Poema
            Universal.
          </p>

          <p
            className="mt-8 max-w-xl text-sm leading-7 sm:text-base sm:leading-8"
            style={{
              color: "rgba(241,234,223,0.42)",
            }}
          >
            Las identidades no se publicarán hasta que su
            participación haya sido confirmada oficialmente.
            Ningún nombre provisional ocupará el archivo.
          </p>
        </div>
      </div>

      {/* ESTADO GENERAL */}

      <div className="mt-20 grid border-y border-white/10 sm:grid-cols-3">
        <div className="border-b border-white/10 py-9 sm:border-b-0 sm:border-r sm:px-8">
          <span
            className="block font-serif text-5xl tracking-[-0.05em]"
            style={{ color: "#f1eadf" }}
          >
            {INCORPORATION_VOICES}
          </span>

          <span
            className="mt-3 block text-[8px] uppercase tracking-[0.32em]"
            style={{
              color: "rgba(241,234,223,0.34)",
            }}
          >
            Voces en incorporación
          </span>
        </div>

        <div className="border-b border-white/10 py-9 sm:border-b-0 sm:border-r sm:px-8">
          <span
            className="block font-serif text-5xl tracking-[-0.05em]"
            style={{ color: "#f1eadf" }}
          >
            {availableVoices}
          </span>

          <span
            className="mt-3 block text-[8px] uppercase tracking-[0.32em]"
            style={{
              color: "rgba(241,234,223,0.34)",
            }}
          >
            Plazas disponibles
          </span>
        </div>

        <div className="py-9 sm:px-8">
          <span
            className="block font-serif text-3xl tracking-[-0.04em] sm:text-4xl"
            style={{ color: "#f1eadf" }}
          >
            Chile · México
          </span>

          <span
            className="mt-4 block text-[8px] uppercase tracking-[0.32em]"
            style={{
              color: "rgba(241,234,223,0.34)",
            }}
          >
            Territorios presentes
          </span>
        </div>
      </div>

      {/* REGISTRO DE SESENTA POSICIONES */}

      <div className="mt-24">
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <p
              className="text-[9px] uppercase tracking-[0.4em]"
              style={{ color: "#d0a866" }}
            >
              Registro de la edición
            </p>

            <p
              className="mt-4 font-serif text-2xl italic"
              style={{
                color: "rgba(241,234,223,0.58)",
              }}
            >
              Edición fundacional · 2026
            </p>
          </div>

          <div className="flex flex-wrap gap-7">
            <div className="flex items-center gap-3">
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: "#d0a866",
                  boxShadow:
                    "0 0 16px rgba(208,168,102,0.45)",
                }}
              />

              <span
                className="text-[8px] uppercase tracking-[0.27em]"
                style={{
                  color: "rgba(241,234,223,0.38)",
                }}
              >
                En incorporación
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span
                className="h-2 w-2 rounded-full border"
                style={{
                  borderColor:
                    "rgba(241,234,223,0.25)",
                }}
              />

              <span
                className="text-[8px] uppercase tracking-[0.27em]"
                style={{
                  color: "rgba(241,234,223,0.38)",
                }}
              >
                Disponible
              </span>
            </div>
          </div>
        </div>

        <ol
  className="mt-10 grid border-l border-t border-white/10"
  style={{
    gridTemplateColumns:
      "repeat(auto-fit, minmax(210px, 1fr))",
  }}
>
  {voiceSlots.map((slot) => {
    const isIncorporation =
      slot.status === "incorporation";

    return (
      <li
        key={slot.position}
        className="border-b border-r border-white/10 p-6"
        style={{
          minHeight: "172px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: isIncorporation
            ? "linear-gradient(145deg, rgba(208,168,102,0.14), rgba(208,168,102,0.025))"
            : "rgba(255,255,255,0.012)",
        }}
      >
        <div className="flex items-start justify-between">
          <span
            className="font-serif text-xl italic"
            style={{
              color: isIncorporation
                ? "#d0a866"
                : "rgba(241,234,223,0.36)",
            }}
          >
            {String(slot.position).padStart(2, "0")}
          </span>

          <span
            className={
              isIncorporation
                ? "h-2 w-2 rounded-full"
                : "h-2 w-2 rounded-full border"
            }
            style={
              isIncorporation
                ? {
                    backgroundColor: "#d0a866",
                    boxShadow:
                      "0 0 18px rgba(208,168,102,0.5)",
                  }
                : {
                    borderColor:
                      "rgba(241,234,223,0.3)",
                  }
            }
          />
        </div>

        <div>
          <p
            className="font-serif text-lg leading-snug"
            style={{
              color: isIncorporation
                ? "rgba(241,234,223,0.9)"
                : "rgba(241,234,223,0.5)",
            }}
          >
            {isIncorporation
              ? "Voz en incorporación"
              : "Lugar disponible"}
          </p>

          <p
            className="mt-3 text-[8px] uppercase tracking-[0.26em]"
            style={{
              color: isIncorporation
                ? "rgba(208,168,102,0.72)"
                : "rgba(241,234,223,0.26)",
            }}
          >
            {isIncorporation
              ? "Pendiente de confirmación"
              : "Convocatoria abierta"}
          </p>
        </div>
      </li>
    );
  })}
</ol>
      </div>

      {/* PROGRESO */}

      <div className="mt-16">
        <div
          className="h-px"
          style={{
            backgroundColor:
              "rgba(241,234,223,0.1)",
          }}
        >
          <div
            className="h-px transition-all duration-1000"
            style={{
              width: `${progress}%`,
              backgroundColor: "#d0a866",
              boxShadow:
                "0 0 18px rgba(208,168,102,0.34)",
            }}
          />
        </div>

        <div className="mt-7 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <p
            className="max-w-xl text-sm leading-7"
            style={{
              color: "rgba(241,234,223,0.35)",
            }}
          >
            Los nombres se incorporarán cuando cada
            participación haya sido confirmada.
          </p>

          <a
            href="#mundo"
            className="text-[8px] uppercase tracking-[0.32em] transition hover:opacity-60"
            style={{ color: "#d0a866" }}
          >
            Ver los territorios participantes ↓
          </a>
        </div>
      </div>
    </section>
  );
}