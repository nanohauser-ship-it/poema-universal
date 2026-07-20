import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

import AtlasInfluencias, {
  type AtlasArtista,
} from "./AtlasInfluencias";

export const dynamic = "force-dynamic";

type ArtistaRaw = {
  id: string;
  nombre: string;

  categoria?: string | null;
  obra?: string | null;
  territorio?: string | null;
  descripcion?: string | null;
  foto_url?: string | null;
  activo?: boolean | null;

  disciplina?: string | null;
  ciudad?: string | null;
  pais?: string | null;
  biografia?: string | null;
  imagen_url?: string | null;
  visible?: boolean | null;
  destacado?: boolean | null;

  instagram_url?: string | null;
  web_url?: string | null;

  relacion_obras?: string[] | string | null;
  tipo_relacion?: string | null;
  legado?: string | null;
  obras_esenciales?: string[] | string | null;

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

function normalizarCategoria(artista: ArtistaRaw) {
  return artista.categoria || artista.disciplina || "Artistas";
}

function normalizarTerritorio(artista: ArtistaRaw) {
  if (artista.territorio) {
    return artista.territorio;
  }

  const lugar = [artista.ciudad, artista.pais]
    .filter(Boolean)
    .join(", ");

  return lugar || null;
}

function normalizarDescripcion(artista: ArtistaRaw) {
  return artista.descripcion || artista.biografia || "";
}

function normalizarFoto(artista: ArtistaRaw) {
  return artista.foto_url || artista.imagen_url || null;
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
      .split(/[|;]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

async function getArtistas(): Promise<AtlasArtista[]> {
  const { data: artistasData, error: artistasError } =
    await supabase
      .from("artistas")
      .select("*")
      .order("created_at", { ascending: false });

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
    .filter((artista) => estaVisible(artista))
    .map((artista) => {
      const tributosDelArtista = tributos.filter(
        (tributo) =>
          tributo.artista_id === artista.id
      );

      const corazones = tributosDelArtista.filter(
        (tributo) => tributo.tipo === "corazon"
      ).length;

      const velas = tributosDelArtista.filter(
        (tributo) => tributo.tipo === "vela"
      ).length;

      return {
        id: artista.id,
        nombre: artista.nombre,
        categoria: normalizarCategoria(artista),
        obra: artista.obra || null,
        territorio: normalizarTerritorio(artista),
        descripcion: normalizarDescripcion(artista),
        foto_url: normalizarFoto(artista),
        destacado: Boolean(artista.destacado),
        instagram_url: artista.instagram_url || null,
        web_url: artista.web_url || null,
        created_at: artista.created_at,
        corazones,
        velas,
        relacion_obras: normalizarLista(
          artista.relacion_obras
        ),
        tipo_relacion: artista.tipo_relacion || null,
        legado: artista.legado || null,
        obras_esenciales: normalizarLista(
          artista.obras_esenciales
        ),
      };
    });
}

export default async function ArtistasPage() {
  const artistas = await getArtistas();

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f0e8dc] text-[#171411]">
      {/* NAVEGACIÓN */}

      <header className="sticky top-0 z-50 border-b border-stone-900/10 bg-[#f0e8dc]/94 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] max-w-[1380px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
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
              href="/lecturas"
              className="transition hover:text-stone-950"
            >
              La Voz
            </Link>

            <Link
              href="/duelo"
              className="transition hover:text-stone-950"
            >
              Duelo
            </Link>
          </nav>

          <Link
            href="/"
            className="border border-stone-900/20 px-5 py-2.5 text-[8px] uppercase tracking-[0.3em] transition hover:bg-[#171411] hover:text-white"
          >
            Volver a la casa
          </Link>
        </div>
      </header>

      {/* ENTRADA */}

      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 24% 18%, rgba(255,255,255,0.94), transparent 30%), radial-gradient(circle at 82% 74%, rgba(199,164,103,0.16), transparent 32%), linear-gradient(180deg, #f4ede4 0%, #eadfd2 100%)",
          }}
        />

        <div className="relative mx-auto grid min-h-[760px] max-w-[1380px] gap-16 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:px-12">
          <div>
            <p className="text-[9px] uppercase tracking-[0.5em] text-[#9a743e]">
              Genealogía de una obra
            </p>

            <h1 className="mt-10 max-w-5xl font-serif text-6xl leading-[0.88] tracking-[-0.06em] sm:text-8xl lg:text-[128px]">
              Atlas de
              <span className="block italic text-stone-500">
                Influencias.
              </span>
            </h1>

            <p className="mt-12 max-w-3xl font-serif text-2xl leading-[1.4] text-stone-700 sm:text-3xl">
              Toda obra tiene antepasados.
            </p>

            <p className="mt-7 max-w-2xl text-sm leading-8 text-stone-600 sm:text-base">
              Este archivo reúne las voces, imágenes,
              músicas y formas de pensamiento que ayudaron
              a construir No dejes que desaparezcamos, La Jerarquía del
              Hambre, Memorias de Bielka y el universo de
              Poema Universal.
            </p>

            <Link
              href="#atlas"
              className="mt-10 inline-flex border-b border-stone-900/25 pb-2 text-[8px] uppercase tracking-[0.32em] text-stone-600 transition hover:border-stone-950 hover:text-stone-950"
            >
              Explorar el Atlas ↓
            </Link>
          </div>

          {/* SANTUARIO */}

          <div className="relative overflow-hidden border border-stone-900/12 bg-[#080b0e] px-8 py-14 text-[#f0e8dc] shadow-[0_38px_100px_rgba(46,29,17,0.2)] sm:px-12 sm:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 50% 24%, rgba(199,164,103,0.18), transparent 32%), linear-gradient(145deg, #080b0e 0%, #0d1217 100%)",
              }}
            />

            <div className="relative flex min-h-[480px] flex-col items-center justify-center text-center">
              {/* VELA */}

              <div
                aria-label="Vela encendida"
                className="relative h-32 w-20"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-0 h-10 w-7 -translate-x-1/2 rotate-45 rounded-[70%_30%_70%_30%] bg-[#d9b46d] shadow-[0_0_34px_rgba(217,180,109,0.72)]"
                />

                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-1/2 h-24 w-12 -translate-x-1/2 border border-white/15 bg-[#eee2ce]/90"
                />

                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-1/2 h-5 w-20 -translate-x-1/2 rounded-full bg-black/40 blur-lg"
                />
              </div>

              {/* CORAZÓN */}

              <span
                aria-label="Corazón"
                className="mt-8 font-serif text-5xl font-light text-[#c7a467]"
              >
                ♡
              </span>

              <p className="mt-8 text-[8px] uppercase tracking-[0.4em] text-[#c7a467]">
                Dedicatoria
              </p>

              <blockquote className="mt-6 max-w-md font-serif text-2xl italic leading-[1.45] text-white/72 sm:text-3xl">
                Para quienes nos enseñaron a mirar el mundo
                de otra manera.
              </blockquote>

              <span
                aria-hidden="true"
                className="mt-9 h-12 w-px"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(199,164,103,0.7), transparent)",
                }}
              />

              <p className="max-w-sm text-xs leading-6 text-white/38">
                Cada nombre conservará su lugar, su
                dedicatoria, su corazón y su vela.
              </p>
            </div>
          </div>
        </div>
      </section>

      {artistas.length === 0 ? (
        <section className="border-t border-stone-900/15 px-5 py-28 text-center sm:px-8">
          <p className="text-[8px] uppercase tracking-[0.4em] text-[#9a743e]">
            Atlas en construcción
          </p>

          <h2 className="mt-8 font-serif text-4xl text-stone-700 sm:text-6xl">
            La arquitectura está preparada.
          </h2>

          <p className="mx-auto mt-7 max-w-xl text-sm leading-8 text-stone-500">
            Los artistas aparecerán cuando comencemos a
            incorporar la constelación fundacional.
          </p>

          <Link
            href="/admin/artistas"
            className="mt-10 inline-flex border border-stone-950 bg-stone-950 px-7 py-4 text-[8px] uppercase tracking-[0.3em] text-white"
          >
            Abrir administración
          </Link>
        </section>
      ) : (
        <AtlasInfluencias artistas={artistas} />
      )}

      <footer className="bg-[#080b0e] px-5 py-10 text-[#f0e8dc] sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1380px] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-lg">
            Atlas de Influencias
          </p>

          <p className="text-[7px] uppercase tracking-[0.32em] text-white/34">
            Poema Universal · archivo vivo
          </p>
        </div>
      </footer>
    </main>
  );
}
