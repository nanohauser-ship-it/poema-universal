"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

type EntradaRincon = {
  id: string;
  estado: string | null;
  titulo: string | null;
  nota: string;
  palabra_refugio: string | null;
  created_at: string;
};

export default function MiRinconPage() {
  const router = useRouter();

  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [entradas, setEntradas] = useState<EntradaRincon[]>([]);

  const [estado, setEstado] = useState("");
  const [titulo, setTitulo] = useState("");
  const [nota, setNota] = useState("");
  const [palabraRefugio, setPalabraRefugio] = useState("");

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
      await cargarEntradas(user.id);
      setCargando(false);
    }

    iniciar();
  }, [router]);

  async function cargarEntradas(userId: string) {
    const { data, error } = await supabaseBrowser
      .from("mi_rincon")
      .select("id, estado, titulo, nota, palabra_refugio, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      setMensaje(error.message);
      return;
    }

    setEntradas(data || []);
  }

  async function guardarEntrada() {
    if (!usuarioId) {
      router.push("/login");
      return;
    }

    const notaLimpia = nota.trim();

    if (!notaLimpia) {
      setMensaje("Escribe una nota antes de guardar.");
      return;
    }

    setGuardando(true);
    setMensaje("");

    const { error } = await supabaseBrowser.from("mi_rincon").insert({
      user_id: usuarioId,
      estado: estado.trim() || null,
      titulo: titulo.trim() || "Entrada sin título",
      nota: notaLimpia,
      palabra_refugio: palabraRefugio.trim() || null,
    });

    if (error) {
      setMensaje(error.message);
      setGuardando(false);
      return;
    }

    setEstado("");
    setTitulo("");
    setNota("");
    setPalabraRefugio("");
    setMensaje("Entrada guardada en tu rincón privado.");
    await cargarEntradas(usuarioId);
    setGuardando(false);
  }

  async function eliminarEntrada(id: string) {
    if (!usuarioId) return;

    const { error } = await supabaseBrowser
      .from("mi_rincon")
      .delete()
      .eq("id", id);

    if (error) {
      setMensaje(error.message);
      return;
    }

    await cargarEntradas(usuarioId);
  }

  function formatearFecha(fecha: string) {
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
        <p className="font-serif text-3xl">Abriendo tu rincón...</p>
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
          </div>
        </nav>

        <header className="mx-auto max-w-4xl text-center">
          <p className="mb-8 text-[11px] uppercase tracking-[0.45em] text-stone-400">
            Refugio privado
          </p>

          <h1 className="font-serif text-5xl font-semibold tracking-tight sm:text-7xl">
            Mi rincón
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-sm leading-8 text-stone-600">
            Un lugar para dejar constancia de cómo estás. No tiene que ser
            bonito, perfecto ni literario. Solo verdadero.
          </p>
        </header>

        <section className="mx-auto mt-20 max-w-3xl rounded-[36px] border border-stone-200 bg-white/70 p-6 shadow-sm sm:p-10">
          <p className="text-[11px] uppercase tracking-[0.38em] text-stone-400">
            Nueva entrada
          </p>

          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="mt-7 w-full rounded-full border border-stone-200 bg-[#fbf6ee] px-6 py-4 text-sm text-stone-800 outline-none transition focus:border-stone-400 focus:bg-white"
          >
            <option value="">¿Cómo estás hoy?</option>
            <option value="En calma">En calma</option>
            <option value="Cansado">Cansado</option>
            <option value="Triste">Triste</option>
            <option value="Ansioso">Ansioso</option>
            <option value="Agradecido">Agradecido</option>
            <option value="Perdido">Perdido</option>
            <option value="Resistiendo">Resistiendo</option>
            <option value="Volviendo a mí">Volviendo a mí</option>
          </select>

          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título de este momento"
            className="mt-5 w-full rounded-full border border-stone-200 bg-[#fbf6ee] px-6 py-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
          />

          <input
            value={palabraRefugio}
            onChange={(e) => setPalabraRefugio(e.target.value)}
            placeholder="Palabra refugio: calma, casa, pan, silencio..."
            className="mt-5 w-full rounded-full border border-stone-200 bg-[#fbf6ee] px-6 py-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
          />

          <textarea
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Escribe aquí lo que necesites dejar en tu rincón..."
            className="mt-5 min-h-[240px] w-full resize-none rounded-[28px] border border-stone-200 bg-[#fbf6ee] px-6 py-5 text-[15px] leading-8 text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
          />

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs leading-6 text-stone-500">
              Esta entrada se guardará solo en tu habitación privada.
            </p>

            <button
              type="button"
              onClick={guardarEntrada}
              disabled={guardando}
              className="rounded-full bg-stone-950 px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {guardando ? "Guardando..." : "Guardar entrada"}
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
              Archivo íntimo
            </p>

            <h2 className="mt-7 font-serif text-4xl font-semibold">
              Entradas guardadas
            </h2>
          </div>

          {entradas.length === 0 ? (
            <div className="mx-auto mt-12 max-w-2xl rounded-[32px] border border-stone-200 bg-white/50 p-8 text-center shadow-sm">
              <p className="font-serif text-2xl text-stone-800">
                Todavía no hay entradas.
              </p>

              <p className="mt-4 text-sm leading-8 text-stone-600">
                La primera puede ser pequeña. Una frase también puede abrir una
                habitación.
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {entradas.map((entrada) => (
                <article
                  key={entrada.id}
                  className="rounded-[32px] border border-stone-200 bg-white/60 p-7 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.32em] text-stone-400">
                        {formatearFecha(entrada.created_at)}
                      </p>

                      {entrada.estado && (
                        <p className="mt-4 text-xs uppercase tracking-[0.24em] text-stone-500">
                          {entrada.estado}
                        </p>
                      )}

                      <h3 className="mt-4 font-serif text-3xl text-stone-950">
                        {entrada.titulo || "Entrada sin título"}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => eliminarEntrada(entrada.id)}
                      className="rounded-full border border-stone-200 bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500 transition hover:text-black"
                    >
                      Borrar
                    </button>
                  </div>

                  {entrada.palabra_refugio && (
                    <p className="mt-6 inline-block rounded-full border border-stone-200 bg-[#fbf6ee] px-4 py-2 text-xs uppercase tracking-[0.2em] text-stone-500">
                      {entrada.palabra_refugio}
                    </p>
                  )}

                  <p className="mt-6 whitespace-pre-line font-serif text-xl leading-[1.55] text-stone-800">
                    {entrada.nota}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-28 pb-10 text-center">
          <p className="text-xs uppercase tracking-[0.38em] text-stone-400">
            Poema Universal · Mi rincón
          </p>
        </footer>
      </div>
    </main>
  );
}