import type { FichaCuratorial } from "./fichas-curatoriales";

type FichaCuratorialArtistaProps = {
  codigo: string | null;
  nombre: string;
  ficha: FichaCuratorial;
};

export default function FichaCuratorialArtista({
  codigo,
  nombre,
  ficha,
}: FichaCuratorialArtistaProps) {
  return (
    <section className="mb-12 overflow-hidden border border-white/[0.11] bg-[#090a0c]">
      <div className="relative border-b border-white/10 px-6 py-10 sm:px-9 sm:py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 82% 12%, rgba(199,164,103,0.13), transparent 30%), radial-gradient(circle at 8% 95%, rgba(66,105,120,0.14), transparent 34%)",
          }}
        />

        <div className="relative">
          <p className="text-[7px] uppercase tracking-[0.4em] text-[#c7a467]">
            {codigo || "Atlas"} · Archivo curatorial
          </p>

          <p className="mt-7 max-w-3xl font-serif text-3xl leading-[1.15] tracking-[-0.035em] text-[#eee6d8] sm:text-5xl">
            {ficha.pregunta}
          </p>

          <p className="mt-8 max-w-3xl text-sm leading-8 text-white/48">
            {ficha.introduccion}
          </p>
        </div>
      </div>

      <div className="grid border-b border-white/10">
        {ficha.huellas.map((huella, index) => (
          <article
            key={huella.titulo}
            className={`px-6 py-9 sm:px-8 ${
              index > 0 ? "border-t border-white/10" : ""
            }`}
          >
            <p className="text-[7px] uppercase tracking-[0.32em] text-[#c7a467]">
              {String(index + 1).padStart(2, "0")} ·{" "}
              {huella.titulo}
            </p>

            <p className="mt-5 font-serif text-xl leading-8 text-white/65">
              {huella.texto}
            </p>
          </article>
        ))}
      </div>

      <div className="grid">
        <section className="border-b border-white/10 px-6 py-10 sm:px-9">
          <p className="text-[7px] uppercase tracking-[0.36em] text-[#c7a467]">
            Obras esenciales
          </p>

          <div className="mt-7 space-y-7">
            {ficha.obras.map((obra) => (
              <article key={obra.titulo}>
                <h4 className="font-serif text-2xl italic text-[#eee6d8]">
                  {obra.titulo}
                </h4>

                <p className="mt-2 text-xs leading-6 text-white/40">
                  {obra.razon}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-b border-white/10 px-6 py-10 sm:px-9">
          <p className="text-[7px] uppercase tracking-[0.36em] text-[#c7a467]">
            Lo que puede aprender un creador
          </p>

          <ol className="mt-7 space-y-5">
            {ficha.aprendizajes.map((aprendizaje, index) => (
              <li
                key={aprendizaje}
                className="grid grid-cols-[34px_minmax(0,1fr)] gap-4"
              >
                <span className="font-serif text-lg text-[#c7a467]/75">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <p className="text-sm leading-7 text-white/50">
                  {aprendizaje}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className="border-b border-white/10 px-6 py-10 sm:px-9">
        <p className="text-[7px] uppercase tracking-[0.36em] text-[#c7a467]">
          Diálogo con el tríptico
        </p>

        <div className="mt-8 grid grid-cols-1 gap-5">
          {ficha.triptico.map((conexion, index) => (
            <article
              key={conexion.obra}
              className="min-w-0 border border-white/10 bg-white/[0.018] p-6"
            >
              <p className="text-[7px] uppercase tracking-[0.3em] text-white/28">
                Mundo {index + 1}
              </p>

              <h4 className="mt-4 break-words font-serif text-xl leading-7 text-white/72">
                {conexion.obra}
              </h4>

              <p className="mt-5 break-words text-xs leading-6 text-white/40">
                {conexion.relacion}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 py-9 sm:px-9">
        <p className="text-[7px] uppercase tracking-[0.36em] text-[#c7a467]">
          Constelación
        </p>

        <p className="mt-3 max-w-xl font-serif text-xl italic leading-8 text-white/48">
          Artistas que comparten con {nombre} una pregunta,
          una herida o una forma de mirar.
        </p>

        <div className="mt-7 flex flex-wrap gap-2">
          {ficha.constelacion.map((artistaRelacionado) => (
            <span
              key={artistaRelacionado}
              className="border border-white/12 px-4 py-2 text-[7px] uppercase tracking-[0.22em] text-white/45"
            >
              {artistaRelacionado}
            </span>
          ))}
        </div>
      </section>
    </section>
  );
}
