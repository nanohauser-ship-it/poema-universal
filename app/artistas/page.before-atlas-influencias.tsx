import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import AccionesArtista from "./AccionesArtista";

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

  created_at: string;
  corazones?: number;
  velas?: number;
};

type Artista = {
  id: string;
  nombre: string;
  categoria: string;
  obra: string | null;
  territorio: string | null;
  descripcion: string;
  foto_url: string | null;
  destacado: boolean;
  instagram_url: string | null;
  web_url: string | null;
  created_at: string;
  corazones: number;
  velas: number;
};

type Tributo = {
  artista_id: string;
  tipo: "corazon" | "vela";
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ordenCategorias = [
  "Literatura y poesía",
  "Cine y mirada",
  "Fotografía y archivo humano",
  "Música y memoria emocional",
  "Cocina y territorio",
  "Arte y pintura",
  "Pensamiento",
  "Danza y cuerpo",
  "Poesía",
  "Música",
  "Pintura",
  "Fotografía",
  "Danza",
  "Cine",
  "Cocina",
  "Otro",
];

function normalizarCategoria(artista: ArtistaRaw) {
  return artista.categoria || artista.disciplina || "Artistas";
}

function normalizarTerritorio(artista: ArtistaRaw) {
  if (artista.territorio) return artista.territorio;

  const lugar = [artista.ciudad, artista.pais].filter(Boolean).join(", ");

  return lugar || null;
}

function normalizarDescripcion(artista: ArtistaRaw) {
  return artista.descripcion || artista.biografia || "";
}

function normalizarFoto(artista: ArtistaRaw) {
  return artista.foto_url || artista.imagen_url || null;
}

function estaVisible(artista: ArtistaRaw) {
  if (typeof artista.visible === "boolean") return artista.visible;
  if (typeof artista.activo === "boolean") return artista.activo;

  return true;
}

async function getArtistas() {
  const { data: artistasData, error: artistasError } = await supabase
    .from("artistas")
    .select("*")
    .order("created_at", { ascending: false });

  if (artistasError) {
    console.error("Error cargando artistas:", artistasError.message);
    return [];
  }

  const { data: tributosData, error: tributosError } = await supabase
    .from("artistas_tributos")
    .select("artista_id, tipo");

  if (tributosError) {
    console.error("Error cargando tributos:", tributosError.message);
  }

  const tributos = (tributosData || []) as Tributo[];

  const artistasVisibles = ((artistasData || []) as ArtistaRaw[]).filter(
    (artista) => estaVisible(artista)
  );

  const artistasConTributos = artistasVisibles.map((artista) => {
    const tributosDelArtista = tributos.filter(
      (tributo) => tributo.artista_id === artista.id
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
    };
  });

  return artistasConTributos as Artista[];
}

function agruparPorCategoria(artistas: Artista[]) {
  const grupos: Record<string, Artista[]> = {};

  for (const artista of artistas) {
    if (!grupos[artista.categoria]) {
      grupos[artista.categoria] = [];
    }

    grupos[artista.categoria].push(artista);
  }

  return Object.entries(grupos).sort(([a], [b]) => {
    const indexA = ordenCategorias.indexOf(a);
    const indexB = ordenCategorias.indexOf(b);

    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });
}

export default async function ArtistasPage() {
  const artistas = await getArtistas();
  const categorias = agruparPorCategoria(artistas);

  return (
    <main className="min-h-screen bg-[#f4efe6] px-5 py-8 text-stone-950">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-12 flex flex-wrap items-center justify-between gap-4 rounded-full border border-stone-200 bg-white/80 px-5 py-3 shadow-sm backdrop-blur">
          <Link href="/" className="text-sm font-semibold tracking-wide">
            Poema Universal
          </Link>

          <div className="flex flex-wrap items-center gap-4 text-sm text-stone-600">
            <Link href="/" className="transition hover:text-black">
              Inicio
            </Link>

            <Link href="/cartas" className="transition hover:text-black">
              Cartas
            </Link>

            <Link href="/rinconcito" className="transition hover:text-black">
              El Rinconcito
            </Link>

            <Link href="/noches-en-paz" className="transition hover:text-black">
              Noches en Paz
            </Link>

            <Link href="/retratos" className="transition hover:text-black">
              Mascotas
            </Link>

            <Link href="/duelo" className="transition hover:text-black">
              Duelo
            </Link>

            <Link href="/lecturas" className="transition hover:text-black">
              La Voz
            </Link>

            <Link href="/artistas" className="font-medium text-black">
              Artistas
            </Link>
          </div>
        </nav>

        <header className="mx-auto mb-16 max-w-4xl text-center">
          <div className="mx-auto mb-5 inline-flex rounded-full border border-stone-300 bg-white/80 px-4 py-1.5 text-[11px] uppercase tracking-[0.32em] text-stone-500 shadow-sm">
            Archivo de influencias
          </div>

          <h1 className="font-serif text-5xl font-semibold tracking-tight sm:text-7xl">
            Artistas Fundamentales
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-stone-600">
            No son adornos. Son faros. Voces, miradas, músicas, imágenes y
            heridas que ayudan a comprender el espíritu de Poema Universal y el
            mundo que vendrá después.
          </p>
        </header>

        <section className="mb-14 rounded-[40px] border border-white/70 bg-[#fffaf3]/90 p-8 shadow-[0_25px_70px_rgba(70,48,29,0.12)]">
          <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
            Declaración
          </p>

          <h2 className="mt-3 font-serif text-3xl font-semibold">
            Una biblioteca de presencias
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-8 text-stone-600">
            Esta página reúne artistas que han abierto caminos. Poetas,
            cineastas, músicos, fotógrafos, cocineros y creadores capaces de
            mirar la belleza allí donde otros solo vieron ruido, pérdida o
            sombra.
          </p>

          <p className="mt-5 max-w-3xl text-sm italic leading-8 text-stone-500">
            Deja un corazón o enciende una vela para quien te ayudó a mirar el
            mundo de otra manera.
          </p>
        </section>

        {categorias.length === 0 ? (
          <section className="rounded-[36px] border border-stone-200 bg-[#fffaf3]/90 p-8 text-center shadow-[0_18px_45px_rgba(70,48,29,0.08)]">
            <h2 className="font-serif text-3xl font-semibold">
              Todavía no hay artistas guardados
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-stone-600">
              Cuando añadas el primer artista desde el panel privado, aparecerá
              aquí dentro de su categoría.
            </p>

            <Link
              href="/admin/artistas"
              className="mt-6 inline-flex rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-stone-800"
            >
              Añadir primer artista
            </Link>
          </section>
        ) : (
          <div className="space-y-16">
            {categorias.map(([categoria, artistasCategoria]) => (
              <section key={categoria}>
                <div className="mb-7 flex flex-col gap-3 border-b border-stone-300/70 pb-5 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
                      Categoría
                    </p>

                    <h2 className="mt-2 font-serif text-4xl font-semibold tracking-tight">
                      {categoria}
                    </h2>
                  </div>

                  <p className="max-w-xl text-sm leading-7 text-stone-600">
                    Archivo vivo de artistas, obras, presencias, corazones y
                    velas.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {artistasCategoria.map((artista) => (
                    <article
                      key={artista.id}
                      className={`group overflow-hidden rounded-[34px] border bg-[#fffaf3]/95 shadow-[0_18px_45px_rgba(70,48,29,0.09)] transition-all duration-300 hover:-translate-y-1 hover:bg-white ${
                        artista.destacado
                          ? "border-stone-400"
                          : "border-stone-200"
                      }`}
                    >
                      <div className="relative h-72 overflow-hidden bg-stone-200">
                        {artista.foto_url ? (
                          <img
                            src={artista.foto_url}
                            alt={artista.nombre}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-200 to-stone-400">
                            <span className="font-serif text-5xl text-white/80">
                              ✦
                            </span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                        <div className="absolute bottom-5 left-5 right-5">
                          <div className="mb-2 flex flex-wrap gap-2">
                            {artista.destacado && (
                              <p className="inline-flex rounded-full bg-white/90 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-stone-800 shadow-sm">
                                Destacado
                              </p>
                            )}

                            {artista.territorio && (
                              <p className="inline-flex rounded-full bg-white/85 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-stone-700 shadow-sm">
                                {artista.territorio}
                              </p>
                            )}
                          </div>

                          <h3 className="font-serif text-3xl font-semibold text-white drop-shadow">
                            {artista.nombre}
                          </h3>
                        </div>
                      </div>

                      <div className="p-6">
                        {artista.obra && (
                          <>
                            <p className="text-[11px] uppercase tracking-[0.26em] text-stone-400">
                              Obra
                            </p>

                            <p className="mt-2 text-sm italic leading-7 text-stone-600">
                              {artista.obra}
                            </p>

                            <div className="my-5 h-px w-full bg-stone-200" />
                          </>
                        )}

                        {artista.descripcion ? (
                          <p className="text-sm leading-7 text-stone-600">
                            {artista.descripcion}
                          </p>
                        ) : (
                          <p className="text-sm italic leading-7 text-stone-400">
                            Sin biografía todavía.
                          </p>
                        )}

                        <div className="mt-6 flex flex-wrap gap-3">
                          {artista.instagram_url && (
                            <a
                              href={artista.instagram_url}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full border border-stone-200 bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-600 transition hover:text-black"
                            >
                              Instagram
                            </a>
                          )}

                          {artista.web_url && (
                            <a
                              href={artista.web_url}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full border border-stone-200 bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-600 transition hover:text-black"
                            >
                              Web
                            </a>
                          )}
                        </div>

                        <AccionesArtista
                          artistaId={artista.id}
                          corazonesIniciales={artista.corazones}
                          velasIniciales={artista.velas}
                        />
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        <section className="mt-16 rounded-[40px] border border-stone-200 bg-stone-950 p-8 text-white shadow-[0_25px_70px_rgba(0,0,0,0.22)]">
          <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
            Sentido
          </p>

          <h2 className="mt-3 font-serif text-3xl font-semibold">
            Lo que nos enseñan
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-8 text-stone-300">
            Cada artista aquí reunido recuerda algo esencial: que la belleza no
            siempre aparece limpia, que la memoria necesita forma, que el dolor
            puede convertirse en lenguaje y que una obra verdadera debe cuidar
            aquello que el mundo estuvo a punto de borrar.
          </p>
        </section>

        <footer className="mt-10 flex justify-center">
          <Link
            href="/"
            className="rounded-full border border-stone-300 bg-white/80 px-6 py-3 text-sm font-medium text-stone-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:text-black"
          >
            Volver a Poema Universal
          </Link>
        </footer>
      </div>
    </main>
  );
}