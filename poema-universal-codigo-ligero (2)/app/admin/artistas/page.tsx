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
  periodo: string | null;
  obra: string | null;
  obras_esenciales: string[] | null;
  etiquetas: string[] | null;
  dedicatoria: string | null;
  imagen_url: string | null;
  visible: boolean | null;
  destacado: boolean | null;
  created_at: string;
};

type Formulario = {
  nombre: string;
  disciplina: string;
  ciudad: string;
  pais: string;
  periodo: string;
  obra: string;
  obrasEsenciales: string;
  etiquetas: string;
  dedicatoria: string;
  imagenUrl: string;
  visible: boolean;
  destacado: boolean;
};

const DISCIPLINAS = [
  "Literatura",
  "Cine",
  "Música",
  "Fotografía",
  "Artes visuales",
  "Pensamiento",
  "Arquitectura",
  "Danza",
  "Cocina",
  "Teatro",
  "Diseño",
  "Otros",
];

const FORMULARIO_VACIO: Formulario = {
  nombre: "",
  disciplina: "",
  ciudad: "",
  pais: "",
  periodo: "",
  obra: "",
  obrasEsenciales: "",
  etiquetas: "",
  dedicatoria: "",
  imagenUrl: "",
  visible: true,
  destacado: false,
};

const inputClass =
  "w-full rounded-full border border-stone-200 bg-[#fbf6ee] px-6 py-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white";

const textareaClass =
  "w-full resize-none rounded-[28px] border border-stone-200 bg-[#fbf6ee] px-6 py-5 text-sm leading-8 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white";

function limpiar(value: string) {
  return value.trim() || null;
}

function convertirLista(value: string) {
  return value
    .split(/\n|;|\|/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function listaATexto(value: string[] | null) {
  return (value || []).join("\n");
}

export default function AdminArtistasPage() {
  const router = useRouter();

  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [formulario, setFormulario] =
    useState<Formulario>(FORMULARIO_VACIO);

  const [artistaEditando, setArtistaEditando] =
    useState<string | null>(null);

  const [comprobandoAdmin, setComprobandoAdmin] =
    useState(true);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    void comprobarAdmin();
  }, []);

  async function comprobarAdmin() {
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
    setCargando(true);

    const { data, error } = await supabaseBrowser
      .from("artistas")
      .select(
        [
          "id",
          "nombre",
          "disciplina",
          "ciudad",
          "pais",
          "periodo",
          "obra",
          "obras_esenciales",
          "etiquetas",
          "dedicatoria",
          "imagen_url",
          "visible",
          "destacado",
          "created_at",
        ].join(", ")
      )
      .order("nombre", { ascending: true });

    if (error) {
      setMensaje(error.message);
      setCargando(false);
      return;
    }

    setArtistas((data || []) as unknown as Artista[]);
    setCargando(false);
  }

  function actualizarCampo<K extends keyof Formulario>(
    campo: K,
    valor: Formulario[K]
  ) {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor,
    }));
  }

  function limpiarFormulario() {
    setFormulario({
      ...FORMULARIO_VACIO,
    });

    setArtistaEditando(null);
    setMensaje("");
  }

  function editarArtista(artista: Artista) {
    setArtistaEditando(artista.id);

    setFormulario({
      nombre: artista.nombre,
      disciplina: artista.disciplina || "",
      ciudad: artista.ciudad || "",
      pais: artista.pais || "",
      periodo: artista.periodo || "",
      obra: artista.obra || "",
      obrasEsenciales: listaATexto(
        artista.obras_esenciales
      ),
      etiquetas: listaATexto(artista.etiquetas),
      dedicatoria: artista.dedicatoria || "",
      imagenUrl: artista.imagen_url || "",
      visible: artista.visible ?? true,
      destacado: artista.destacado ?? false,
    });

    window.setTimeout(() => {
      document
        .getElementById("editor-artistas")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  }

  async function guardarArtista() {
    const nombre = formulario.nombre.trim();

    if (!nombre) {
      setMensaje("El nombre del artista es obligatorio.");
      return;
    }

    setGuardando(true);
    setMensaje("");

    const datos = {
      nombre,
      disciplina: limpiar(formulario.disciplina),
      ciudad: limpiar(formulario.ciudad),
      pais: limpiar(formulario.pais),
      periodo: limpiar(formulario.periodo),
      obra: limpiar(formulario.obra),
      obras_esenciales: convertirLista(
        formulario.obrasEsenciales
      ),
      etiquetas: convertirLista(
        formulario.etiquetas
      ),
      dedicatoria: limpiar(
        formulario.dedicatoria
      ),
      imagen_url: limpiar(formulario.imagenUrl),
      visible: formulario.visible,
      destacado: formulario.destacado,
    };

    const operacion = artistaEditando
      ? supabaseBrowser
          .from("artistas")
          .update(datos)
          .eq("id", artistaEditando)
      : supabaseBrowser
          .from("artistas")
          .insert(datos);

    const { error } = await operacion;

    if (error) {
      setMensaje(error.message);
      setGuardando(false);
      return;
    }

    setMensaje(
      artistaEditando
        ? "Artista actualizado correctamente."
        : "Artista incorporado correctamente."
    );

    setFormulario({
      ...FORMULARIO_VACIO,
    });

    setArtistaEditando(null);

    await cargarArtistas();
    setGuardando(false);
  }

  async function cambiarVisible(artista: Artista) {
    const { error } = await supabaseBrowser
      .from("artistas")
      .update({
        visible: !artista.visible,
      })
      .eq("id", artista.id);

    if (error) {
      setMensaje(error.message);
      return;
    }

    await cargarArtistas();
  }

  async function cambiarDestacado(
    artista: Artista
  ) {
    const { error } = await supabaseBrowser
      .from("artistas")
      .update({
        destacado: !artista.destacado,
      })
      .eq("id", artista.id);

    if (error) {
      setMensaje(error.message);
      return;
    }

    await cargarArtistas();
  }

  async function eliminarArtista(id: string) {
    const confirmar = window.confirm(
      "¿Seguro que quieres eliminar este artista?"
    );

    if (!confirmar) {
      return;
    }

    const { error } = await supabaseBrowser
      .from("artistas")
      .delete()
      .eq("id", id);

    if (error) {
      setMensaje(error.message);
      return;
    }

    if (artistaEditando === id) {
      limpiarFormulario();
    }

    await cargarArtistas();
  }

  if (comprobandoAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6efe7] px-5 text-stone-950">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400">
            Administración
          </p>

          <p className="mt-6 font-serif text-3xl">
            Comprobando la llave...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6efe7] px-5 py-8 text-stone-950">
      <div className="mx-auto max-w-7xl">
        <nav className="flex flex-wrap items-center justify-between gap-5 border-b border-stone-900/15 pb-6">
          <Link
            href="/admin"
            className="font-serif text-xl"
          >
            Cuarto de llaves
          </Link>

          <div className="flex flex-wrap gap-6 text-[9px] uppercase tracking-[0.24em] text-stone-500">
            <Link
              href="/artistas"
              className="transition hover:text-black"
            >
              Ver artistas
            </Link>

            <Link
              href="/admin/artistas/mensajes"
              className="transition hover:text-black"
            >
              Dedicatorias
            </Link>

            <Link
              href="/"
              className="transition hover:text-black"
            >
              Inicio
            </Link>
          </div>
        </nav>

        <header className="mx-auto max-w-4xl py-20 text-center">
          <p className="text-[9px] uppercase tracking-[0.45em] text-[#98703b]">
            Administración
          </p>

          <h1 className="mt-8 font-serif text-5xl tracking-[-0.04em] sm:text-7xl">
            Artistas Fundamentales
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-sm leading-8 text-stone-600">
            Una herramienta sencilla para incorporar
            artistas, portadas, obras esenciales, etiquetas
            y dedicatorias.
          </p>
        </header>

        <section
          id="editor-artistas"
          className="scroll-mt-24 mx-auto max-w-4xl border border-stone-900/15 bg-white/60 p-6 sm:p-10"
        >
          <div className="flex flex-col gap-4 border-b border-stone-900/15 pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[8px] uppercase tracking-[0.34em] text-[#98703b]">
                {artistaEditando
                  ? "Editar artista"
                  : "Nuevo artista"}
              </p>

              <h2 className="mt-3 font-serif text-3xl">
                {artistaEditando
                  ? formulario.nombre
                  : "Añadir a la lista"}
              </h2>
            </div>

            {artistaEditando && (
              <button
                type="button"
                onClick={limpiarFormulario}
                className="w-fit border-b border-stone-900/25 pb-1 text-[8px] uppercase tracking-[0.25em] text-stone-500"
              >
                Cancelar edición
              </button>
            )}
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <input
              value={formulario.nombre}
              onChange={(event) =>
                actualizarCampo(
                  "nombre",
                  event.target.value
                )
              }
              placeholder="Nombre del artista"
              className={inputClass}
            />

            <select
              value={formulario.disciplina}
              onChange={(event) =>
                actualizarCampo(
                  "disciplina",
                  event.target.value
                )
              }
              className={inputClass}
            >
              <option value="">
                Seleccionar disciplina
              </option>

              {DISCIPLINAS.map((disciplina) => (
                <option
                  key={disciplina}
                  value={disciplina}
                >
                  {disciplina}
                </option>
              ))}
            </select>

            <input
              value={formulario.ciudad}
              onChange={(event) =>
                actualizarCampo(
                  "ciudad",
                  event.target.value
                )
              }
              placeholder="Ciudad o territorio"
              className={inputClass}
            />

            <input
              value={formulario.pais}
              onChange={(event) =>
                actualizarCampo(
                  "pais",
                  event.target.value
                )
              }
              placeholder="País"
              className={inputClass}
            />

            <input
              value={formulario.periodo}
              onChange={(event) =>
                actualizarCampo(
                  "periodo",
                  event.target.value
                )
              }
              placeholder="Periodo: 1913–1960"
              className={`${inputClass} md:col-span-2`}
            />
          </div>

          <div className="mt-10 border-t border-stone-900/15 pt-8">
            <p className="text-[8px] uppercase tracking-[0.32em] text-[#98703b]">
              Obras y conceptos
            </p>

            <input
              value={formulario.obra}
              onChange={(event) =>
                actualizarCampo(
                  "obra",
                  event.target.value
                )
              }
              placeholder="Obra esencial principal"
              className={`${inputClass} mt-5`}
            />

            <textarea
              value={formulario.obrasEsenciales}
              onChange={(event) =>
                actualizarCampo(
                  "obrasEsenciales",
                  event.target.value
                )
              }
              placeholder={"Otras obras esenciales, una por línea"}
              className={`${textareaClass} mt-5 min-h-[150px]`}
            />

            <textarea
              value={formulario.etiquetas}
              onChange={(event) =>
                actualizarCampo(
                  "etiquetas",
                  event.target.value
                )
              }
              placeholder={
                "Etiquetas, una por línea: memoria, exilio, silencio..."
              }
              className={`${textareaClass} mt-5 min-h-[130px]`}
            />
          </div>

          <div className="mt-10 border-t border-stone-900/15 pt-8">
            <p className="text-[8px] uppercase tracking-[0.32em] text-[#98703b]">
              Portada y dedicatoria
            </p>

            <input
              value={formulario.imagenUrl}
              onChange={(event) =>
                actualizarCampo(
                  "imagenUrl",
                  event.target.value
                )
              }
              placeholder="URL o ruta de la portada original"
              className={`${inputClass} mt-5`}
            />

            <p className="mt-3 text-xs leading-6 text-stone-400">
              También puedes usar una ruta local como
              /artistas/albert-camus.webp
            </p>

            <textarea
              value={formulario.dedicatoria}
              onChange={(event) =>
                actualizarCampo(
                  "dedicatoria",
                  event.target.value
                )
              }
              placeholder="Dedicatoria breve para acompañar al corazón y la vela..."
              className={`${textareaClass} mt-5 min-h-[140px]`}
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-4 border-t border-stone-900/15 pt-8">
            <label className="flex items-center gap-3 border border-stone-900/15 bg-white px-5 py-3 text-sm text-stone-600">
              <input
                type="checkbox"
                checked={formulario.visible}
                onChange={(event) =>
                  actualizarCampo(
                    "visible",
                    event.target.checked
                  )
                }
              />

              Visible públicamente
            </label>

            <label className="flex items-center gap-3 border border-stone-900/15 bg-white px-5 py-3 text-sm text-stone-600">
              <input
                type="checkbox"
                checked={formulario.destacado}
                onChange={(event) =>
                  actualizarCampo(
                    "destacado",
                    event.target.checked
                  )
                }
              />

              Artista fundamental
            </label>
          </div>

          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-lg text-xs leading-6 text-stone-500">
              Puedes guardar una ficha como oculta mientras
              terminas su portada o seleccionas sus obras.
            </p>

            <button
              type="button"
              onClick={guardarArtista}
              disabled={guardando}
              className="bg-stone-950 px-8 py-4 text-[9px] uppercase tracking-[0.27em] text-white transition hover:bg-stone-800 disabled:opacity-50"
            >
              {guardando
                ? "Guardando..."
                : artistaEditando
                  ? "Guardar cambios"
                  : "Añadir artista"}
            </button>
          </div>

          {mensaje && (
            <p className="mt-6 text-center text-sm text-stone-600">
              {mensaje}
            </p>
          )}
        </section>

        <section className="mt-24">
          <div className="text-center">
            <p className="text-[8px] uppercase tracking-[0.42em] text-[#98703b]">
              Archivo
            </p>

            <h2 className="mt-6 font-serif text-4xl sm:text-5xl">
              Artistas guardados
            </h2>

            <p className="mt-4 text-sm text-stone-500">
              {artistas.length} presencias
            </p>
          </div>

          {cargando ? (
            <p className="mt-12 text-center text-sm text-stone-500">
              Cargando artistas...
            </p>
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {artistas.map((artista) => (
                <article
                  key={artista.id}
                  className="flex flex-col border border-stone-900/15 bg-white/55 p-6"
                >
                  {artista.imagen_url && (
                    <img
                      src={artista.imagen_url}
                      alt={`Portada de ${artista.nombre}`}
                      className="mb-6 aspect-[3/4] w-full object-cover"
                    />
                  )}

                  <p className="text-[8px] uppercase tracking-[0.26em] text-[#98703b]">
                    {artista.disciplina || "Otros"}
                  </p>

                  <h3 className="mt-4 font-serif text-3xl">
                    {artista.nombre}
                  </h3>

                  {(artista.pais ||
                    artista.periodo) && (
                    <p className="mt-3 text-sm italic text-stone-500">
                      {[artista.pais, artista.periodo]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}

                  {(artista.etiquetas || []).length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {artista.etiquetas
                        ?.slice(0, 5)
                        .map((etiqueta) => (
                          <span
                            key={etiqueta}
                            className="border border-stone-900/12 px-3 py-2 text-[7px] uppercase tracking-[0.18em] text-stone-500"
                          >
                            {etiqueta}
                          </span>
                        ))}
                    </div>
                  )}

                  <div className="mt-auto flex flex-wrap gap-2 pt-7">
                    <button
                      type="button"
                      onClick={() =>
                        editarArtista(artista)
                      }
                      className="bg-stone-950 px-4 py-2 text-[8px] uppercase tracking-[0.2em] text-white"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        cambiarVisible(artista)
                      }
                      className="border border-stone-900/15 bg-white px-4 py-2 text-[8px] uppercase tracking-[0.2em] text-stone-600"
                    >
                      {artista.visible
                        ? "Visible"
                        : "Oculto"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        cambiarDestacado(artista)
                      }
                      className="border border-stone-900/15 bg-white px-4 py-2 text-[8px] uppercase tracking-[0.2em] text-stone-600"
                    >
                      {artista.destacado
                        ? "Fundamental"
                        : "Normal"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        eliminarArtista(artista.id)
                      }
                      className="border border-red-200 bg-red-50 px-4 py-2 text-[8px] uppercase tracking-[0.2em] text-red-700"
                    >
                      Borrar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-28 border-t border-stone-900/15 py-10 text-center">
          <p className="text-[8px] uppercase tracking-[0.34em] text-stone-400">
            Poema Universal · Artistas Fundamentales
          </p>
        </footer>
      </div>
    </main>
  );
}
