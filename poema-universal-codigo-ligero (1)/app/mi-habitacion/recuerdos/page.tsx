"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

type RecuerdoPrivado = {
  id: string;
  titulo: string | null;
  tipo: string | null;
  nombre_relacionado: string | null;
  lugar: string | null;
  fecha_recuerdo: string | null;
  recuerdo: string;
  created_at: string;
};

export default function MisRecuerdosPage() {
  const router = useRouter();

  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [recuerdos, setRecuerdos] = useState<RecuerdoPrivado[]>([]);

  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("");
  const [nombreRelacionado, setNombreRelacionado] = useState("");
  const [lugar, setLugar] = useState("");
  const [fechaRecuerdo, setFechaRecuerdo] = useState("");
  const [recuerdo, setRecuerdo] = useState("");

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    async function iniciar() {
      const {
        data: { user },
      } = await supabaseBrowser.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUsuarioId(user.id);
      await cargarRecuerdos(user.id);
      setCargando(false);
    }

    iniciar();
  }, [router]);

  async function cargarRecuerdos(userId: string) {
    const { data, error } = await supabaseBrowser
      .from("mis_recuerdos")
      .select(
        "id, titulo, tipo, nombre_relacionado, lugar, fecha_recuerdo, recuerdo, created_at"
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      setMensaje(error.message);
      return;
    }

    setRecuerdos(data || []);
  }

  async function guardarRecuerdo() {
    if (!usuarioId) {
      router.push("/login");
      return;
    }

    const recuerdoLimpio = recuerdo.trim();

    if (!recuerdoLimpio) {
      setMensaje("Escribe un recuerdo antes de guardar.");
      return;
    }

    setGuardando(true);
    setMensaje("");

    const { error } = await supabaseBrowser.from("mis_recuerdos").insert({
      user_id: usuarioId,
      titulo: titulo.trim() || "Recuerdo sin título",
      tipo: tipo.trim() || null,
      nombre_relacionado: nombreRelacionado.trim() || null,
      lugar: lugar.trim() || null,
      fecha_recuerdo: fechaRecuerdo || null,
      recuerdo: recuerdoLimpio,
    });

    if (error) {
      setMensaje(error.message);
      setGuardando(false);
      return;
    }

    setTitulo("");
    setTipo("");
    setNombreRelacionado("");
    setLugar("");
    setFechaRecuerdo("");
    setRecuerdo("");
    setMensaje("Recuerdo guardado en tu archivo privado.");
    await cargarRecuerdos(usuarioId);
    setGuardando(false);
  }

  async function eliminarRecuerdo(id: string) {
    if (!usuarioId) return;

    const { error } = await supabaseBrowser
      .from("mis_recuerdos")
      .delete()
      .eq("id", id);

    if (error) {
      setMensaje(error.message);
      return;
    }

    await cargarRecuerdos(usuarioId);
  }

  function formatearFecha(fecha: string | null) {
    if (!fecha) return "";

    try {
      return new Date(fecha).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "";
    }
  }

  if (cargando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6efe7] px-5 text-stone-900">
        <p className="font-serif text-3xl">Abriendo tus recuerdos...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6efe7] px-5 py-8 text-stone-950">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-20 flex flex-wrap items-center justify-between gap-4 rounded-full border border-stone-200 bg-white/70 px-5 py-3 shadow-sm">
          <Link href="/" className="text-sm font-semibold tracking-wide">
            Poema Universal
          </Link>

          <div className="flex flex-wrap items-center gap-5 text-sm text-stone-600">
            <Link href="/mi-habitacion" className="transition hover:text-black">
              Mi Habitación
            </Link>

            <Link
              href="/mi-habitacion/poemas"
              className="transition hover:text-black"
            >
              Mis poemas
            </Link>

            <Link
              href="/mi-habitacion/cartas"
              className="transition hover:text-black"
            >
              Mis cartas
            </Link>

            <Link
              href="/mi-habitacion/velas"
              className="transition hover:text-black"
            >
              Mis velas
            </Link>

            <Link
              href="/mi-habitacion/rincon"
              className="transition hover:text-black"
            >
              Mi rincón
            </Link>
          </div>
        </nav>

        <header className="mx-auto max-w-4xl text-center">
          <p className="mb-8 text-[11px] uppercase tracking-[0.45em] text-stone-400">
            Archivo privado
          </p>

          <h1 className="font-serif text-5xl font-semibold tracking-tight sm:text-7xl">
            Mis recuerdos
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-sm leading-8 text-stone-600">
            Un archivo íntimo para guardar escenas, personas, lugares, fechas y
            pequeñas reliquias de tu vida.
          </p>
        </header>

        <section className="mx-auto mt-20 max-w-3xl rounded-[36px] border border-stone-200 bg-white/70 p-6 shadow-sm sm:p-10">
          <p className="text-[11px] uppercase tracking-[0.38em] text-stone-400">
            Nuevo recuerdo
          </p>

          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título del recuerdo"
            className="mt-7 w-full rounded-full border border-stone-200 bg-[#fbf6ee] px-6 py-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
          />

          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="mt-5 w-full rounded-full border border-stone-200 bg-[#fbf6ee] px-6 py-4 text-sm text-stone-800 outline-none transition focus:border-stone-400 focus:bg-white"
          >
            <option value="">Tipo de recuerdo</option>
            <option value="Infancia">Infancia</option>
            <option value="Familia">Familia</option>
            <option value="Amor">Amor</option>
            <option value="Duelo">Duelo</option>
            <option value="Viaje">Viaje</option>
            <option value="Casa">Casa</option>
            <option value="Trabajo">Trabajo</option>
            <option value="Sueño">Sueño</option>
            <option value="Herida">Herida</option>
            <option value="Victoria">Victoria</option>
            <option value="Otro">Otro</option>
          </select>

          <input
            value={nombreRelacionado}
            onChange={(e) => setNombreRelacionado(e.target.value)}
            placeholder="Persona, nombre o vínculo relacionado"
            className="mt-5 w-full rounded-full border border-stone-200 bg-[#fbf6ee] px-6 py-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
          />

          <input
            value={lugar}
            onChange={(e) => setLugar(e.target.value)}
            placeholder="Lugar del recuerdo"
            className="mt-5 w-full rounded-full border border-stone-200 bg-[#fbf6ee] px-6 py-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
          />

          <input
            value={fechaRecuerdo}
            onChange={(e) => setFechaRecuerdo(e.target.value)}
            type="date"
            className="mt-5 w-full rounded-full border border-stone-200 bg-[#fbf6ee] px-6 py-4 text-sm text-stone-800 outline-none transition focus:border-stone-400 focus:bg-white"
          />

          <textarea
            value={recuerdo}
            onChange={(e) => setRecuerdo(e.target.value)}
            placeholder="Escribe aquí el recuerdo..."
            className="mt-5 min-h-[260px] w-full resize-none rounded-[28px] border border-stone-200 bg-[#fbf6ee] px-6 py-5 text-[15px] leading-8 text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
          />

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs leading-6 text-stone-500">
              Este recuerdo se guardará solo en tu habitación privada.
            </p>

            <button
              type="button"
              onClick={guardarRecuerdo}
              disabled={guardando}
              className="rounded-full bg-stone-950 px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {guardando ? "Guardando..." : "Guardar recuerdo"}
            </button>
          </div>

          {mensaje && (
            <p className="mt-5 text-center text-sm leading-7 text-stone-600">
              {mensaje}
            </p>
          )}
        </section>

        <section className="mx-auto mt-24 max-w-5xl">
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.45em] text-stone-400">
              Reliquias privadas
            </p>

            <h2 className="mt-7 font-serif text-4xl font-semibold">
              Recuerdos guardados
            </h2>
          </div>

          {recuerdos.length === 0 ? (
            <div className="mx-auto mt-12 max-w-2xl rounded-[32px] border border-stone-200 bg-white/50 p-8 text-center shadow-sm">
              <p className="font-serif text-2xl text-stone-800">
                Todavía no hay recuerdos guardados.
              </p>

              <p className="mt-4 text-sm leading-8 text-stone-600">
                El primero puede ser una escena pequeña: una cocina, una voz, un
                lugar o una tarde que no quieres perder.
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {recuerdos.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[32px] border border-stone-200 bg-white/60 p-7 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.32em] text-stone-400">
                        Guardado el {formatearFecha(item.created_at)}
                      </p>

                      {item.tipo && (
                        <p className="mt-4 text-xs uppercase tracking-[0.24em] text-stone-500">
                          {item.tipo}
                        </p>
                      )}

                      <h3 className="mt-4 font-serif text-3xl text-stone-950">
                        {item.titulo || "Recuerdo sin título"}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => eliminarRecuerdo(item.id)}
                      className="rounded-full border border-stone-200 bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500 transition hover:text-black"
                    >
                      Borrar
                    </button>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {item.nombre_relacionado && (
                      <span className="rounded-full border border-stone-200 bg-[#fbf6ee] px-4 py-2 text-xs uppercase tracking-[0.18em] text-stone-500">
                        {item.nombre_relacionado}
                      </span>
                    )}

                    {item.lugar && (
                      <span className="rounded-full border border-stone-200 bg-[#fbf6ee] px-4 py-2 text-xs uppercase tracking-[0.18em] text-stone-500">
                        {item.lugar}
                      </span>
                    )}

                    {item.fecha_recuerdo && (
                      <span className="rounded-full border border-stone-200 bg-[#fbf6ee] px-4 py-2 text-xs uppercase tracking-[0.18em] text-stone-500">
                        {formatearFecha(item.fecha_recuerdo)}
                      </span>
                    )}
                  </div>

                  <p className="mt-6 whitespace-pre-line font-serif text-xl leading-[1.55] text-stone-800">
                    {item.recuerdo}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-28 pb-10 text-center">
          <p className="text-xs uppercase tracking-[0.38em] text-stone-400">
            Poema Universal · Mis recuerdos
          </p>
        </footer>
      </div>
    </main>
  );
}