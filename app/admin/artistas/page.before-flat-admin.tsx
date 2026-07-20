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
  biografia: string | null;
  obra: string | null;
  obras_esenciales: string[] | null;
  relacion_obras: string[] | null;
  tipo_relacion: string | null;
  legado: string | null;
  dedicatoria: string | null;
  posicion_mirada: string | null;
  tension_etica: string | null;
  imagen_url: string | null;
  instagram_url: string | null;
  web_url: string | null;
  visible: boolean | null;
  destacado: boolean | null;
  created_at: string;
};

type FormState = {
  nombre: string;
  disciplina: string;
  ciudad: string;
  pais: string;
  periodo: string;
  biografia: string;
  obra: string;
  obras_esenciales: string;
  relacion_obras: string[];
  tipo_relacion: string;
  legado: string;
  dedicatoria: string;
  posicion_mirada: string;
  tension_etica: string;
  imagen_url: string;
  instagram_url: string;
  web_url: string;
  visible: boolean;
  destacado: boolean;
};

const DISCIPLINES = [
  "Literatura",
  "Cine",
  "Música",
  "Artes visuales",
  "Fotografía humana",
  "Pensamiento",
  "Cocina",
  "Danza",
  "Otros",
];

const RELATION_TYPES = [
  "Influencia documentada",
  "Influencia declarada",
  "Resonancia curatorial",
  "Referencia crítica",
];

const LITERARY_WORKS = [
  "No dejes que desaparezcamos",
  "La Jerarquía del Hambre",
  "Memorias de Bielka",
  "Tríptico completo",
];

const EMPTY_FORM: FormState = {
  nombre: "",
  disciplina: "",
  ciudad: "",
  pais: "",
  periodo: "",
  biografia: "",
  obra: "",
  obras_esenciales: "",
  relacion_obras: [],
  tipo_relacion: "",
  legado: "",
  dedicatoria: "",
  posicion_mirada: "",
  tension_etica: "",
  imagen_url: "",
  instagram_url: "",
  web_url: "",
  visible: true,
  destacado: false,
};

const inputClass =
  "w-full rounded-full border border-stone-200 bg-[#fbf6ee] px-6 py-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white";

const textareaClass =
  "w-full resize-none rounded-[28px] border border-stone-200 bg-[#fbf6ee] px-6 py-5 text-sm leading-8 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white";

function clean(value: string) {
  return value.trim() || null;
}

function parseList(value: string) {
  return value
    .split(/\n|;|\|/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function listToText(value: string[] | null) {
  return (value || []).join("\n");
}

export default function AdminArtistasPage() {
  const router = useRouter();

  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(
    null
  );

  const [comprobandoAdmin, setComprobandoAdmin] =
    useState(true);
  const [cargandoArtistas, setCargandoArtistas] =
    useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    void comprobarAdminYCargar();
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
        [
          "id",
          "nombre",
          "disciplina",
          "ciudad",
          "pais",
          "periodo",
          "biografia",
          "obra",
          "obras_esenciales",
          "relacion_obras",
          "tipo_relacion",
          "legado",
          "dedicatoria",
          "posicion_mirada",
          "tension_etica",
          "imagen_url",
          "instagram_url",
          "web_url",
          "visible",
          "destacado",
          "created_at",
        ].join(", ")
      )
      .order("nombre", { ascending: true });

    if (error) {
      setMensaje(error.message);
      setCargandoArtistas(false);
      return;
    }

    setArtistas((data || []) as Artista[]);
    setCargandoArtistas(false);
  }

  function updateForm<K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function toggleLiteraryWork(work: string) {
    setForm((current) => {
      const selected = current.relacion_obras.includes(work);

      return {
        ...current,
        relacion_obras: selected
          ? current.relacion_obras.filter(
              (item) => item !== work
            )
          : [...current.relacion_obras, work],
      };
    });
  }

  function resetEditor() {
    setForm({
      ...EMPTY_FORM,
      relacion_obras: [],
    });
    setEditingId(null);
    setMensaje("");
  }

  function editarArtista(artista: Artista) {
    setEditingId(artista.id);

    setForm({
      nombre: artista.nombre,
      disciplina: artista.disciplina || "",
      ciudad: artista.ciudad || "",
      pais: artista.pais || "",
      periodo: artista.periodo || "",
      biografia: artista.biografia || "",
      obra: artista.obra || "",
      obras_esenciales: listToText(
        artista.obras_esenciales
      ),
      relacion_obras: artista.relacion_obras || [],
      tipo_relacion: artista.tipo_relacion || "",
      legado: artista.legado || "",
      dedicatoria: artista.dedicatoria || "",
      posicion_mirada: artista.posicion_mirada || "",
      tension_etica: artista.tension_etica || "",
      imagen_url: artista.imagen_url || "",
      instagram_url: artista.instagram_url || "",
      web_url: artista.web_url || "",
      visible: artista.visible ?? true,
      destacado: artista.destacado ?? false,
    });

    window.setTimeout(() => {
      document
        .getElementById("editor-atlas")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  }

  async function guardarArtista() {
    const nombreLimpio = form.nombre.trim();

    if (!nombreLimpio) {
      setMensaje("El nombre del artista es obligatorio.");
      return;
    }

    setGuardando(true);
    setMensaje("");

    const payload = {
      nombre: nombreLimpio,
      disciplina: clean(form.disciplina),
      ciudad: clean(form.ciudad),
      pais: clean(form.pais),
      periodo: clean(form.periodo),
      biografia: clean(form.biografia),
      obra: clean(form.obra),
      obras_esenciales: parseList(
        form.obras_esenciales
      ),
      relacion_obras: form.relacion_obras,
      tipo_relacion: clean(form.tipo_relacion),
      legado: clean(form.legado),
      dedicatoria: clean(form.dedicatoria),
      posicion_mirada: clean(form.posicion_mirada),
      tension_etica: clean(form.tension_etica),
      imagen_url: clean(form.imagen_url),
      instagram_url: clean(form.instagram_url),
      web_url: clean(form.web_url),
      visible: form.visible,
      destacado: form.destacado,
    };

    const operation = editingId
      ? supabaseBrowser
          .from("artistas")
          .update(payload)
          .eq("id", editingId)
      : supabaseBrowser
          .from("artistas")
          .insert(payload);

    const { error } = await operation;

    if (error) {
      setMensaje(error.message);
      setGuardando(false);
      return;
    }

    setMensaje(
      editingId
        ? "Influencia actualizada correctamente."
        : "Influencia incorporada al Atlas."
    );

    setForm({
      ...EMPTY_FORM,
      relacion_obras: [],
    });
    setEditingId(null);

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
      "¿Seguro que quieres eliminar esta influencia y su ficha?"
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

    if (editingId === id) {
      resetEditor();
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

          <p className="font-serif text-3xl">
            Comprobando la llave...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6efe7] px-5 py-8 text-stone-950">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-16 flex flex-wrap items-center justify-between gap-4 rounded-full border border-stone-200 bg-white/70 px-5 py-3 shadow-sm">
          <Link
            href="/admin"
            className="text-sm font-semibold tracking-wide"
          >
            Cuarto de llaves
          </Link>

          <div className="flex flex-wrap items-center gap-5 text-sm text-stone-600">
            <Link
              href="/artistas"
              className="transition hover:text-black"
            >
              Ver Atlas
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

        <header className="mx-auto max-w-5xl text-center">
          <p className="mb-8 text-[11px] uppercase tracking-[0.45em] text-stone-400">
            Administración
          </p>

          <h1 className="font-serif text-5xl font-semibold tracking-tight sm:text-7xl">
            Atlas de Influencias
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-sm leading-8 text-stone-600">
            Desde aquí se construye la genealogía de las
            tres novelas: nombres, obras, relaciones,
            dedicatorias, corazones, velas y tensiones
            éticas.
          </p>
        </header>

        <section
          id="editor-atlas"
          className="scroll-mt-24 mx-auto mt-16 max-w-5xl rounded-[38px] border border-stone-200 bg-white/72 p-6 shadow-sm sm:p-10"
        >
          <div className="flex flex-col gap-4 border-b border-stone-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.38em] text-stone-400">
                {editingId
                  ? "Editar presencia"
                  : "Nueva presencia"}
              </p>

              <h2 className="mt-3 font-serif text-3xl">
                {editingId
                  ? form.nombre || "Influencia"
                  : "Incorporar al Atlas"}
              </h2>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetEditor}
                className="w-fit border-b border-stone-900/25 pb-1 text-[9px] uppercase tracking-[0.25em] text-stone-500"
              >
                Cancelar edición
              </button>
            )}
          </div>

          {/* IDENTIDAD */}

          <div className="mt-9">
            <p className="text-[9px] uppercase tracking-[0.34em] text-[#9a743e]">
              01 · Identidad
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <input
                value={form.nombre}
                onChange={(event) =>
                  updateForm(
                    "nombre",
                    event.target.value
                  )
                }
                placeholder="Nombre del artista"
                className={inputClass}
              />

              <select
                value={form.disciplina}
                onChange={(event) =>
                  updateForm(
                    "disciplina",
                    event.target.value
                  )
                }
                className={inputClass}
              >
                <option value="">
                  Seleccionar disciplina
                </option>

                {DISCIPLINES.map((discipline) => (
                  <option
                    key={discipline}
                    value={discipline}
                  >
                    {discipline}
                  </option>
                ))}
              </select>

              <input
                value={form.ciudad}
                onChange={(event) =>
                  updateForm(
                    "ciudad",
                    event.target.value
                  )
                }
                placeholder="Ciudad"
                className={inputClass}
              />

              <input
                value={form.pais}
                onChange={(event) =>
                  updateForm(
                    "pais",
                    event.target.value
                  )
                }
                placeholder="País"
                className={inputClass}
              />

              <input
                value={form.periodo}
                onChange={(event) =>
                  updateForm(
                    "periodo",
                    event.target.value
                  )
                }
                placeholder="Periodo: 1907–1954"
                className={`${inputClass} md:col-span-2`}
              />
            </div>
          </div>

          {/* RELACIÓN */}

          <div className="mt-12 border-t border-stone-200 pt-9">
            <p className="text-[9px] uppercase tracking-[0.34em] text-[#9a743e]">
              02 · Relación con las obras
            </p>

            <select
              value={form.tipo_relacion}
              onChange={(event) =>
                updateForm(
                  "tipo_relacion",
                  event.target.value
                )
              }
              className={`${inputClass} mt-5`}
            >
              <option value="">
                Seleccionar grado de relación
              </option>

              {RELATION_TYPES.map((relation) => (
                <option
                  key={relation}
                  value={relation}
                >
                  {relation}
                </option>
              ))}
            </select>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {LITERARY_WORKS.map((work) => (
                <label
                  key={work}
                  className="flex items-center gap-3 rounded-[22px] border border-stone-200 bg-[#fbf6ee] px-5 py-4 text-sm text-stone-600"
                >
                  <input
                    type="checkbox"
                    checked={form.relacion_obras.includes(
                      work
                    )}
                    onChange={() =>
                      toggleLiteraryWork(work)
                    }
                  />

                  {work}
                </label>
              ))}
            </div>

            <input
              value={form.obra}
              onChange={(event) =>
                updateForm(
                  "obra",
                  event.target.value
                )
              }
              placeholder="Obra esencial principal"
              className={`${inputClass} mt-5`}
            />

            <textarea
              value={form.obras_esenciales}
              onChange={(event) =>
                updateForm(
                  "obras_esenciales",
                  event.target.value
                )
              }
              placeholder={
                "Otras obras esenciales, una por línea"
              }
              className={`${textareaClass} mt-5 min-h-[140px]`}
            />
          </div>

          {/* CONTENIDO */}

          <div className="mt-12 border-t border-stone-200 pt-9">
            <p className="text-[9px] uppercase tracking-[0.34em] text-[#9a743e]">
              03 · Archivo crítico
            </p>

            <textarea
              value={form.biografia}
              onChange={(event) =>
                updateForm(
                  "biografia",
                  event.target.value
                )
              }
              placeholder="Biografía breve y contextual..."
              className={`${textareaClass} mt-5 min-h-[170px]`}
            />

            <textarea
              value={form.legado}
              onChange={(event) =>
                updateForm(
                  "legado",
                  event.target.value
                )
              }
              placeholder="¿Qué lenguaje, herida, idea o mirada aporta a las novelas?"
              className={`${textareaClass} mt-5 min-h-[170px]`}
            />

            <textarea
              value={form.dedicatoria}
              onChange={(event) =>
                updateForm(
                  "dedicatoria",
                  event.target.value
                )
              }
              placeholder="Dedicatoria personal que acompañará al corazón y la vela..."
              className={`${textareaClass} mt-5 min-h-[130px]`}
            />
          </div>

          {/* FOTOGRAFÍA */}

          <div className="mt-12 border-t border-stone-200 pt-9">
            <p className="text-[9px] uppercase tracking-[0.34em] text-[#9a743e]">
              04 · Fotografía y mirada ética
            </p>

            <p className="mt-4 text-xs leading-6 text-stone-500">
              Estos campos pueden quedar vacíos en
              literatura, cine, música u otras disciplinas.
            </p>

            <textarea
              value={form.posicion_mirada}
              onChange={(event) =>
                updateForm(
                  "posicion_mirada",
                  event.target.value
                )
              }
              placeholder="¿Desde dónde fotografía y qué relación mantiene con las personas retratadas?"
              className={`${textareaClass} mt-5 min-h-[140px]`}
            />

            <textarea
              value={form.tension_etica}
              onChange={(event) =>
                updateForm(
                  "tension_etica",
                  event.target.value
                )
              }
              placeholder="Consentimiento, representación, contexto, poder, dignidad o apropiación..."
              className={`${textareaClass} mt-5 min-h-[140px]`}
            />
          </div>

          {/* ARCHIVO EXTERNO */}

          <div className="mt-12 border-t border-stone-200 pt-9">
            <p className="text-[9px] uppercase tracking-[0.34em] text-[#9a743e]">
              05 · Imagen y enlaces
            </p>

            <input
              value={form.imagen_url}
              onChange={(event) =>
                updateForm(
                  "imagen_url",
                  event.target.value
                )
              }
              placeholder="URL de imagen"
              className={`${inputClass} mt-5`}
            />

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <input
                value={form.instagram_url}
                onChange={(event) =>
                  updateForm(
                    "instagram_url",
                    event.target.value
                  )
                }
                placeholder="URL de Instagram"
                className={inputClass}
              />

              <input
                value={form.web_url}
                onChange={(event) =>
                  updateForm(
                    "web_url",
                    event.target.value
                  )
                }
                placeholder="Web o archivo externo"
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-9 flex flex-wrap gap-4 border-t border-stone-200 pt-8">
            <label className="flex items-center gap-3 rounded-full border border-stone-200 bg-white px-5 py-3 text-sm text-stone-600">
              <input
                type="checkbox"
                checked={form.visible}
                onChange={(event) =>
                  updateForm(
                    "visible",
                    event.target.checked
                  )
                }
              />

              Visible públicamente
            </label>

            <label className="flex items-center gap-3 rounded-full border border-stone-200 bg-white px-5 py-3 text-sm text-stone-600">
              <input
                type="checkbox"
                checked={form.destacado}
                onChange={(event) =>
                  updateForm(
                    "destacado",
                    event.target.checked
                  )
                }
              />

              Influencia nuclear
            </label>
          </div>

          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-xs leading-6 text-stone-500">
              Puedes guardar una ficha incompleta como
              privada y terminarla antes de hacerla visible.
            </p>

            <button
              type="button"
              onClick={guardarArtista}
              disabled={guardando}
              className="rounded-full bg-stone-950 px-8 py-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {guardando
                ? "Guardando..."
                : editingId
                  ? "Guardar cambios"
                  : "Incorporar al Atlas"}
            </button>
          </div>

          {mensaje && (
            <p className="mt-6 text-center text-sm leading-7 text-stone-600">
              {mensaje}
            </p>
          )}
        </section>

        {/* ARCHIVO */}

        <section className="mx-auto mt-24 max-w-7xl">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.45em] text-stone-400">
              Archivo
            </p>

            <h2 className="mt-7 font-serif text-4xl font-semibold sm:text-5xl">
              Presencias guardadas
            </h2>

            <p className="mt-4 text-sm text-stone-500">
              {artistas.length} influencias en el Atlas
            </p>
          </div>

          {cargandoArtistas ? (
            <p className="mt-12 text-center text-sm text-stone-500">
              Cargando influencias...
            </p>
          ) : artistas.length === 0 ? (
            <div className="mx-auto mt-12 max-w-2xl rounded-[32px] border border-stone-200 bg-white/50 p-8 text-center">
              <p className="font-serif text-2xl text-stone-800">
                El Atlas todavía está vacío.
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {artistas.map((artista) => (
                <article
                  key={artista.id}
                  className="flex flex-col rounded-[32px] border border-stone-200 bg-white/62 p-7 shadow-sm"
                >
                  {artista.imagen_url && (
                    <div className="mb-6 overflow-hidden rounded-[24px] border border-stone-200 bg-stone-100">
                      <img
                        src={artista.imagen_url}
                        alt={artista.nombre}
                        className="h-64 w-full object-cover"
                      />
                    </div>
                  )}

                  <p className="text-[9px] uppercase tracking-[0.28em] text-[#9a743e]">
                    {artista.disciplina || "Sin disciplina"}
                  </p>

                  <h3 className="mt-4 font-serif text-3xl">
                    {artista.nombre}
                  </h3>

                  {(artista.pais ||
                    artista.periodo) && (
                    <p className="mt-3 text-sm italic text-stone-500">
                      {[
                        artista.pais,
                        artista.periodo,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}

                  {artista.tipo_relacion && (
                    <p className="mt-5 text-[8px] uppercase tracking-[0.24em] text-stone-400">
                      {artista.tipo_relacion}
                    </p>
                  )}

                  {(artista.relacion_obras || [])
                    .length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {artista.relacion_obras?.map(
                        (work) => (
                          <span
                            key={work}
                            className="border border-stone-900/12 px-3 py-2 text-[7px] uppercase tracking-[0.18em] text-stone-500"
                          >
                            {work}
                          </span>
                        )
                      )}
                    </div>
                  )}

                  {artista.legado && (
                    <p className="mt-6 line-clamp-5 text-sm leading-7 text-stone-600">
                      {artista.legado}
                    </p>
                  )}

                  <div className="mt-auto flex flex-wrap gap-2 pt-8">
                    <button
                      type="button"
                      onClick={() =>
                        editarArtista(artista)
                      }
                      className="rounded-full bg-stone-950 px-4 py-2 text-[9px] uppercase tracking-[0.18em] text-white"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        cambiarVisible(artista)
                      }
                      className="rounded-full border border-stone-200 bg-white px-4 py-2 text-[9px] uppercase tracking-[0.18em] text-stone-600"
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
                      className="rounded-full border border-stone-200 bg-white px-4 py-2 text-[9px] uppercase tracking-[0.18em] text-stone-600"
                    >
                      {artista.destacado
                        ? "Nuclear"
                        : "No nuclear"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        eliminarArtista(artista.id)
                      }
                      className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-[9px] uppercase tracking-[0.18em] text-red-700"
                    >
                      Borrar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-28 pb-10 text-center">
          <p className="text-xs uppercase tracking-[0.38em] text-stone-400">
            Poema Universal · Atlas de Influencias
          </p>
        </footer>
      </div>
    </main>
  );
}
