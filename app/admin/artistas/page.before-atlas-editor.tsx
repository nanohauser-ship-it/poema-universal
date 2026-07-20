"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { esAdmin } from "@/lib/adminGuard";
import { supabaseBrowser } from "@/lib/supabaseClient";

type Artista = {
  id: string;
  nombre: string;
  disciplina: string | null;
  ciudad: string | null;
  pais: string | null;
  biografia: string | null;
  imagen_url: string | null;
  instagram_url: string | null;
  web_url: string | null;
  visible: boolean | null;
  destacado: boolean | null;
  created_at: string;
};

export default function AdminArtistasPage() {
  const router = useRouter();

  const [artistas, setArtistas] = useState<Artista[]>([]);

  const [nombre, setNombre] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [pais, setPais] = useState("");
  const [biografia, setBiografia] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [webUrl, setWebUrl] = useState("");
  const [visible, setVisible] = useState(true);
  const [destacado, setDestacado] = useState(false);

  const [comprobandoAdmin, setComprobandoAdmin] = useState(true);
  const [cargandoArtistas, setCargandoArtistas] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    comprobarAdminYCargar();
  }, []);

  async function comprobarAdminYCargar() {
    setComprobandoAdmin(true);

    const {
      data: { user },
    } = await supabaseBrowser.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    if (!esAdmin(user)) {
      router.push("/");
      return;
    }

    await cargarArtistas();
    setComprobandoAdmin(false);
  }

  async function cargarArtistas() {
    setCargandoArtistas(true);
    setMensaje("");

    const { data, error } = await supabaseBrowser
      .from("artistas")
      .select(
        "id, nombre, disciplina, ciudad, pais, biografia, imagen_url, instagram_url, web_url, visible, destacado, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      setMensaje(error.message);
      setCargandoArtistas(false);
      return;
    }

    setArtistas(data || []);
    setCargandoArtistas(false);
  }

  async function crearArtista() {
    const nombreLimpio = nombre.trim();

    if (!nombreLimpio) {
      setMensaje("El nombre del artista es obligatorio.");
      return;
    }

    setGuardando(true);
    setMensaje("");

    const { error } = await supabaseBrowser.from("artistas").insert({
      nombre: nombreLimpio,
      disciplina: disciplina.trim() || null,
      ciudad: ciudad.trim() || null,
      pais: pais.trim() || null,
      biografia: biografia.trim() || null,
      imagen_url: imagenUrl.trim() || null,
      instagram_url: instagramUrl.trim() || null,
      web_url: webUrl.trim() || null,
      visible,
      destacado,
    });

    if (error) {
      setMensaje(error.message);
      setGuardando(false);
      return;
    }

    setNombre("");
    setDisciplina("");
    setCiudad("");
    setPais("");
    setBiografia("");
    setImagenUrl("");
    setInstagramUrl("");
    setWebUrl("");
    setVisible(true);
    setDestacado(false);

    setMensaje("Artista guardado correctamente.");
    await cargarArtistas();
    setGuardando(false);
  }

  async function cambiarVisible(artista: Artista) {
    const { error } = await supabaseBrowser
      .from("artistas")
      .update({ visible: !artista.visible })
      .eq("id", artista.id);

    if (error) {
      setMensaje(error.message);
      return;
    }

    await cargarArtistas();
  }

  async function cambiarDestacado(artista: Artista) {
    const { error } = await supabaseBrowser
      .from("artistas")
      .update({ destacado: !artista.destacado })
      .eq("id", artista.id);

    if (error) {
      setMensaje(error.message);
      return;
    }

    await cargarArtistas();
  }

  async function eliminarArtista(id: string) {
    const confirmar = window.confirm("¿Seguro que quieres eliminar este artista?");

    if (!confirmar) return;

    const { error } = await supabaseBrowser
      .from("artistas")
      .delete()
      .eq("id", id);

    if (error) {
      setMensaje(error.message);
      return;
    }

    await cargarArtistas();
  }

  if (comprobandoAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6efe7] px-5 text-stone-950">
        <div className="text-center">
          <p className="mb-5 text-[11px] uppercase tracking-[0.4em] text-stone-400">
            Administración
          </p>

          <p className="font-serif text-3xl">Comprobando la llave...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6efe7] px-5 py-8 text-stone-950">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-16 flex flex-wrap items-center justify-between gap-4 rounded-full border border-stone-200 bg-white/70 px-5 py-3 shadow-sm">
          <Link href="/admin" className="text-sm font-semibold tracking-wide">
            Cuarto de llaves
          </Link>

          <div className="flex flex-wrap items-center gap-5 text-sm text-stone-600">
            <Link href="/admin/actividad" className="transition hover:text-black">
              Panel de vida
            </Link>

            <Link href="/admin/cadena" className="transition hover:text-black">
              Cadena
            </Link>

            <Link href="/admin/duelo" className="transition hover:text-black">
              Duelo
            </Link>

            <Link href="/artistas" className="transition hover:text-black">
              Ver artistas
            </Link>

            <Link href="/" className="transition hover:text-black">
              Inicio
            </Link>
          </div>
        </nav>

        <header className="mx-auto max-w-4xl text-center">
          <p className="mb-8 text-[11px] uppercase tracking-[0.45em] text-stone-400">
            Administración
          </p>

          <h1 className="font-serif text-5xl font-semibold tracking-tight sm:text-7xl">
            Artistas
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-sm leading-8 text-stone-600">
            Desde aquí puedes añadir artistas a Poema Universal, decidir si son
            visibles y marcar cuáles serán destacados.
          </p>
        </header>

        <section className="mx-auto mt-16 max-w-3xl rounded-[36px] border border-stone-200 bg-white/70 p-6 shadow-sm sm:p-10">
          <p className="text-[11px] uppercase tracking-[0.38em] text-stone-400">
            Nuevo artista
          </p>

          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del artista"
            className="mt-7 w-full rounded-full border border-stone-200 bg-[#fbf6ee] px-6 py-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
          />

          <input
            value={disciplina}
            onChange={(e) => setDisciplina(e.target.value)}
            placeholder="Disciplina: música, pintura, poesía, danza..."
            className="mt-5 w-full rounded-full border border-stone-200 bg-[#fbf6ee] px-6 py-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
          />

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <input
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              placeholder="Ciudad"
              className="w-full rounded-full border border-stone-200 bg-[#fbf6ee] px-6 py-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
            />

            <input
              value={pais}
              onChange={(e) => setPais(e.target.value)}
              placeholder="País"
              className="w-full rounded-full border border-stone-200 bg-[#fbf6ee] px-6 py-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
            />
          </div>

          <textarea
            value={biografia}
            onChange={(e) => setBiografia(e.target.value)}
            placeholder="Biografía breve del artista..."
            className="mt-5 min-h-[180px] w-full resize-none rounded-[28px] border border-stone-200 bg-[#fbf6ee] px-6 py-5 text-sm leading-8 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
          />

          <input
            value={imagenUrl}
            onChange={(e) => setImagenUrl(e.target.value)}
            placeholder="URL de imagen"
            className="mt-5 w-full rounded-full border border-stone-200 bg-[#fbf6ee] px-6 py-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
          />

          <input
            value={instagramUrl}
            onChange={(e) => setInstagramUrl(e.target.value)}
            placeholder="URL de Instagram"
            className="mt-5 w-full rounded-full border border-stone-200 bg-[#fbf6ee] px-6 py-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
          />

          <input
            value={webUrl}
            onChange={(e) => setWebUrl(e.target.value)}
            placeholder="URL de web personal"
            className="mt-5 w-full rounded-full border border-stone-200 bg-[#fbf6ee] px-6 py-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
          />

          <div className="mt-6 flex flex-wrap gap-4">
            <label className="flex items-center gap-3 rounded-full border border-stone-200 bg-white px-5 py-3 text-sm text-stone-600">
              <input
                type="checkbox"
                checked={visible}
                onChange={(e) => setVisible(e.target.checked)}
              />
              Visible públicamente
            </label>

            <label className="flex items-center gap-3 rounded-full border border-stone-200 bg-white px-5 py-3 text-sm text-stone-600">
              <input
                type="checkbox"
                checked={destacado}
                onChange={(e) => setDestacado(e.target.checked)}
              />
              Artista destacado
            </label>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs leading-6 text-stone-500">
              Puedes completar solo nombre y biografía. El resto puede quedar
              vacío.
            </p>

            <button
              type="button"
              onClick={crearArtista}
              disabled={guardando}
              className="rounded-full bg-stone-950 px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {guardando ? "Guardando..." : "Guardar artista"}
            </button>
          </div>

          {mensaje && (
            <p className="mt-5 text-center text-sm leading-7 text-stone-600">
              {mensaje}
            </p>
          )}
        </section>

        <section className="mx-auto mt-20 max-w-6xl">
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.45em] text-stone-400">
              Archivo de artistas
            </p>

            <h2 className="mt-7 font-serif text-4xl font-semibold">
              Artistas guardados
            </h2>
          </div>

          {cargandoArtistas ? (
            <p className="mt-12 text-center text-sm text-stone-500">
              Cargando artistas...
            </p>
          ) : artistas.length === 0 ? (
            <div className="mx-auto mt-12 max-w-2xl rounded-[32px] border border-stone-200 bg-white/50 p-8 text-center shadow-sm">
              <p className="font-serif text-2xl text-stone-800">
                Todavía no hay artistas.
              </p>

              <p className="mt-4 text-sm leading-8 text-stone-600">
                El primero abrirá esta sala.
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {artistas.map((artista) => (
                <article
                  key={artista.id}
                  className="rounded-[32px] border border-stone-200 bg-white/60 p-7 shadow-sm"
                >
                  {artista.imagen_url && (
                    <div className="mb-6 overflow-hidden rounded-[26px] border border-stone-200 bg-stone-100">
                      <img
                        src={artista.imagen_url}
                        alt={artista.nombre}
                        className="h-72 w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-stone-400">
                        {artista.disciplina || "Artista"}
                      </p>

                      <h3 className="mt-4 font-serif text-3xl text-stone-950">
                        {artista.nombre}
                      </h3>

                      {(artista.ciudad || artista.pais) && (
                        <p className="mt-3 text-sm italic text-stone-500">
                          {[artista.ciudad, artista.pais]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => eliminarArtista(artista.id)}
                      className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-red-700 transition hover:bg-red-100"
                    >
                      Borrar
                    </button>
                  </div>

                  {artista.biografia && (
                    <p className="mt-6 whitespace-pre-line text-sm leading-8 text-stone-600">
                      {artista.biografia}
                    </p>
                  )}

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => cambiarVisible(artista)}
                      className="rounded-full border border-stone-200 bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-600 transition hover:text-black"
                    >
                      {artista.visible ? "Visible" : "Oculto"}
                    </button>

                    <button
                      type="button"
                      onClick={() => cambiarDestacado(artista)}
                      className="rounded-full border border-stone-200 bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-600 transition hover:text-black"
                    >
                      {artista.destacado ? "Destacado" : "No destacado"}
                    </button>

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
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-28 pb-10 text-center">
          <p className="text-xs uppercase tracking-[0.38em] text-stone-400">
            Poema Universal · Admin artistas
          </p>
        </footer>
      </div>
    </main>
  );
}