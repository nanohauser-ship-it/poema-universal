import Link from "next/link";

type FooterLink = {
  label: string;
  href: string;
};

const institutionalLinks: FooterLink[] = [
  {
    label: "Inicio",
    href: "/",
  },
  {
    label: "Obra",
    href: "/obra",
  },
  {
    label: "Artistas",
    href: "/artistas",
  },
  {
    label: "Antología",
    href: "/antologia",
  },
];

const projectLinks: FooterLink[] = [
  {
    label: "Manifiesto",
    href: "#manifiesto",
  },
  {
    label: "Muro de las Voces",
    href: "#voces",
  },
  {
    label: "Mapa mundial",
    href: "#mundo",
  },
  {
    label: "Cronología",
    href: "#cronologia",
  },
  {
    label: "Archivo anual",
    href: "#archivo-anual",
  },
];

export default function InstitutionalFooter() {
  return (
    <footer
      className="relative overflow-hidden border-t border-white/10 px-6 pb-10 pt-20 shadow-[0_-35px_120px_rgba(0,0,0,0.18)] sm:px-10 lg:px-16"
      style={{
        background:
          "linear-gradient(180deg, #121b24 0%, #071016 52%, #020506 100%)",
        color: "#f7f1e8",
      }}
      aria-label="Pie institucional de Poema Universal"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-280px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[#c6a157]/[0.11] blur-[150px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.035),transparent_48%)]"
      />

      <div className="relative z-10">
        <div className="grid gap-16 border-b border-white/10 pb-16 lg:grid-cols-[1.45fr_0.7fr_0.7fr]">
          <div className="max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.5em] text-[#d7b66f]">
              Institución literaria internacional
            </p>

            <h2 className="mt-8 font-serif text-5xl tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
              Poema Universal
            </h2>

            <p className="mt-7 font-serif text-2xl italic leading-10 text-white/58 sm:text-3xl">
              Una obra anual escrita por muchas voces y custodiada
              como memoria del mundo.
            </p>

            <p className="mt-8 max-w-xl text-sm leading-7 text-white/38 sm:text-base sm:leading-8">
              La edición fundacional de 2026 reunirá sesenta poetas
              en una única construcción literaria. Su presentación
              oficial tendrá lugar el 1 de enero de 2027.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <span className="rounded-full border border-[#d7b66f]/30 bg-[#d7b66f]/[0.06] px-5 py-3 text-[9px] uppercase tracking-[0.3em] text-[#d7b66f]">
                Edición fundacional 2026
              </span>

              <span className="rounded-full border border-white/10 px-5 py-3 text-[9px] uppercase tracking-[0.3em] text-white/42">
                60 voces
              </span>

              <span className="rounded-full border border-white/10 px-5 py-3 text-[9px] uppercase tracking-[0.3em] text-white/42">
                Presentación 01.01.2027
              </span>
            </div>
          </div>

          <nav aria-label="Navegación institucional">
            <p className="text-[9px] uppercase tracking-[0.35em] text-[#d7b66f]">
              Institución
            </p>

            <ul className="mt-7 space-y-4">
              {institutionalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-serif text-xl text-white/55 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Navegación de Poema Universal">
            <p className="text-[9px] uppercase tracking-[0.35em] text-[#d7b66f]">
              Edición 2026
            </p>

            <ul className="mt-7 space-y-4">
              {projectLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/42 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="grid gap-10 border-b border-white/10 py-12 md:grid-cols-3">
          <div>
            <p className="text-[9px] uppercase tracking-[0.32em] text-white/28">
              Fundador y poeta
            </p>

            <p className="mt-4 font-serif text-2xl text-white">
              José Naveiro
            </p>
          </div>

          <div>
            <p className="text-[9px] uppercase tracking-[0.32em] text-white/28">
              Primera presentación
            </p>

            <p className="mt-4 font-serif text-2xl text-white">
              1 de enero de 2027
            </p>
          </div>

          <div>
            <p className="text-[9px] uppercase tracking-[0.32em] text-white/28">
              Naturaleza
            </p>

            <p className="mt-4 font-serif text-2xl text-white">
              Archivo literario vivo
            </p>
          </div>
        </div>

        <div className="py-14 text-center">
          <p className="mx-auto max-w-4xl font-serif text-3xl italic leading-[1.55] text-white/66 sm:text-4xl lg:text-5xl">
            “Mientras exista una voz que todavía no haya encontrado
            su lugar, el poema no estará terminado.”
          </p>

          <div className="mx-auto mt-10 h-px w-24 bg-gradient-to-r from-transparent via-[#d7b66f] to-transparent" />

          <p className="mt-8 text-[9px] uppercase tracking-[0.42em] text-[#d7b66f]">
            Poema Universal
          </p>
        </div>

        <div className="flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-[9px] uppercase tracking-[0.28em] text-white/25">
            © 2026 Poema Universal · Todos los derechos reservados
          </p>

          <Link
            href="#top"
            className="text-[9px] uppercase tracking-[0.3em] text-white/35 transition hover:text-[#d7b66f]"
          >
            Volver al inicio ↑
          </Link>
        </div>
      </div>
    </footer>
  );
}