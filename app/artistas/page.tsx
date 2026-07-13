import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

import AtlasInfluencias, {
  type AtlasArtista,
} from "./AtlasInfluencias";

export const dynamic = "force-dynamic";

type ArtistaRaw = {
  id: string;
  nombre: string;

  disciplina?: string | null;
  categoria?: string | null;

  ciudad?: string | null;
  pais?: string | null;
  territorio?: string | null;
  periodo?: string | null;

  obra?: string | null;
  obras_esenciales?: string[] | string | null;
  etiquetas?: string[] | string | null;

  imagen_url?: string | null;
  foto_url?: string | null;

  dedicatoria?: string | null;

  visible?: boolean | null;
  activo?: boolean | null;
  destacado?: boolean | null;

  created_at: string;
};

type Tributo = {
  artista_id: string;
  tipo: "corazon" | "vela";
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function normalizarLista(
  value: string[] | string | null | undefined
) {
  if (Array.isArray(value)) {
    return value
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\n|;|\|/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function estaVisible(artista: ArtistaRaw) {
  if (typeof artista.visible === "boolean") {
    return artista.visible;
  }

  if (typeof artista.activo === "boolean") {
    return artista.activo;
  }

  return true;
}

function obtenerTerritorio(artista: ArtistaRaw) {
  if (artista.territorio) {
    return artista.territorio;
  }

  const lugar = [artista.ciudad, artista.pais]
    .filter(Boolean)
    .join(", ");

  return lugar || null;
}

async function getArtistas(): Promise<AtlasArtista[]> {
  const { data: artistasData, error: artistasError } =
    await supabase
      .from("artistas")
      .select("*")
      .order("nombre", { ascending: true });

  if (artistasError) {
    console.error(
      "Error cargando artistas:",
      artistasError.message
    );

    return [];
  }

  const { data: tributosData, error: tributosError } =
    await supabase
      .from("artistas_tributos")
      .select("artista_id, tipo");

  if (tributosError) {
    console.error(
      "Error cargando tributos:",
      tributosError.message
    );
  }

  const tributos = (tributosData || []) as Tributo[];

  return ((artistasData || []) as ArtistaRaw[])
    .filter(estaVisible)
    .map((artista) => {
      const tributosDelArtista = tributos.filter(
        (tributo) =>
          tributo.artista_id === artista.id
      );

      return {
        id: artista.id,
        nombre: artista.nombre,
        disciplina:
          artista.disciplina ||
          artista.categoria ||
          "Otros",
        territorio: obtenerTerritorio(artista),
        periodo: artista.periodo || null,
        obra: artista.obra || null,
        obras_esenciales: normalizarLista(
          artista.obras_esenciales
        ),
        etiquetas: normalizarLista(
          artista.etiquetas
        ),
        portada_url:
          artista.imagen_url ||
          artista.foto_url ||
          null,
        dedicatoria: artista.dedicatoria || null,
        destacado: Boolean(artista.destacado),
        corazones: tributosDelArtista.filter(
          (tributo) => tributo.tipo === "corazon"
        ).length,
        velas: tributosDelArtista.filter(
          (tributo) => tributo.tipo === "vela"
        ).length,
      };
    });
}

export default async function ArtistasPage() {
  const artistas = await getArtistas();

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f0e8dc] text-[#171411]">
      <header className="sticky top-0 z-50 border-b border-stone-900/10 bg-[#f0e8dc]/94 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="font-serif text-xl tracking-[-0.025em]"
          >
            Poema Universal
          </Link>

          <nav className="hidden items-center gap-8 text-[8px] uppercase tracking-[0.28em] text-stone-500 md:flex">
            <Link
              href="/poema-universal"
              className="transition hover:text-stone-950"
            >
              Edición 2026
            </Link>

            <Link
              href="/tienda"
              className="transition hover:text-stone-950"
            >
              Tienda
            </Link>

            <Link
              href="/artistas"
              className="text-stone-950"
            >
              Artistas
            </Link>
          </nav>

          <Link
            href="/"
            className="border border-stone-900/20 px-5 py-2.5 text-[8px] uppercase tracking-[0.3em] transition hover:bg-stone-950 hover:text-white"
          >
            Volver a la casa
          </Link>
        </div>
      </header>

      {/* PRESENTACIÓN */}

      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 15%, rgba(255,255,255,0.95), transparent 30%), radial-gradient(circle at 85% 72%, rgba(199,164,103,0.17), transparent 34%), linear-gradient(180deg, #f4ede4 0%, #eadfd2 100%)",
          }}
        />

        <div className="relative mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
          <p className="text-[9px] uppercase tracking-[0.5em] text-[#98703b]">
            Archivo cultural independiente
          </p>

          <h1 className="mt-9 max-w-6xl font-serif text-6xl leading-[0.9] tracking-[-0.06em] sm:text-8xl lg:text-[126px]">
            Artistas
            <span className="block italic text-stone-500">
              fundamentales.
            </span>
          </h1>

          <p className="mt-12 max-w-3xl font-serif text-2xl leading-[1.35] text-stone-700 sm:text-3xl">
            Artistas que abrieron caminos y que todavía
            pueden abrirlos para otros.
          </p>

          <p className="mt-7 max-w-2xl text-sm leading-8 text-stone-600">
            Una herramienta plana y navegable para descubrir
            autores, cineastas, músicos, fotógrafos,
            pensadores y creadores de todos los territorios.
          </p>

          <Link
            href="#atlas"
            className="mt-10 inline-flex border-b border-stone-900/25 pb-2 text-[8px] uppercase tracking-[0.32em] text-stone-600 transition hover:border-stone-950 hover:text-stone-950"
          >
            Explorar la lista ↓
          </Link>
        </div>
      </section>

      {/* CORAZÓN, VELA Y DEDICATORIA */}

      <section className="bg-[#090c10] text-[#f0e8dc]">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-12 sm:px-8 md:grid-cols-[auto_auto_1fr] md:items-center lg:px-12">
          <div
            aria-label="Vela"
            className="relative h-16 w-10"
          >
            <span className="absolute left-1/2 top-0 h-6 w-4 -translate-x-1/2 rotate-45 rounded-[70%_30%_70%_30%] bg-[#d9b46d] shadow-[0_0_24px_rgba(217,180,109,0.65)]" />

            <span className="absolute bottom-0 left-1/2 h-11 w-7 -translate-x-1/2 bg-[#eee2ce]" />
          </div>

          <span className="font-serif text-5xl text-[#c7a467]">
            ♡
          </span>

          <div>
            <p className="text-[8px] uppercase tracking-[0.36em] text-[#c7a467]">
              Dedicatoria
            </p>

            <p className="mt-3 max-w-3xl font-serif text-xl italic leading-8 text-white/65">
              Cada nombre conserva su lugar. Cada corazón
              reconoce una influencia. Cada vela agradece que
              esa presencia haya existido.
            </p>
          </div>
        </div>
      </section>

      {artistas.length === 0 ? (
        <section className="border-t border-stone-900/15 px-5 py-28 text-center sm:px-8">
          <p className="text-[8px] uppercase tracking-[0.4em] text-[#98703b]">
            Lista en construcción
          </p>

          <h2 className="mt-8 font-serif text-4xl text-stone-700 sm:text-6xl">
            La herramienta está preparada.
          </h2>

          <p className="mx-auto mt-7 max-w-xl text-sm leading-8 text-stone-500">
            Los artistas aparecerán a medida que construyamos
            el archivo.
          </p>
        </section>
      ) : (
        <AtlasInfluencias artistas={artistas} />
      )}

      <section className="border-t border-stone-900/15 px-5 py-12 sm:px-8 lg:px-12">
        <p className="mx-auto max-w-[1440px] text-xs leading-6 text-stone-400">
          Archivo cultural independiente. La inclusión de
          una figura no implica colaboración, autorización
          ni vinculación oficial con Poema Universal.
        </p>
      </section>

      <footer className="bg-[#090c10] px-5 py-10 text-[#f0e8dc] sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-lg">
            Artistas Fundamentales
          </p>

          <p className="text-[7px] uppercase tracking-[0.32em] text-white/35">
            Poema Universal · archivo vivo
          </p>
        </div>
      </footer>
    </main>
  );
}
