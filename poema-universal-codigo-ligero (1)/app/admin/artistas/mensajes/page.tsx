"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { esAdmin } from "@/lib/adminGuard";
import { supabaseBrowser } from "@/lib/supabaseClient";

type MensajePendiente = {
  id: string;
  artista_id: string;
  autor: string | null;
  mensaje: string;
  aprobado: boolean;
  created_at: string;
  artistas?: {
    nombre?: string;
  } | null;
};

export default function AdminMensajesArtistasPage() {
  const router = useRouter();

  const [clave, setClave] = useState("");
  const [mensajes, setMensajes] = useState<MensajePendiente[]>([]);
  const [comprobandoAdmin, setComprobandoAdmin] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [mensajeSistema, setMensajeSistema] = useState("");

  useEffect(() => {
    comprobarAdmin();
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

    setComprobandoAdmin(false);
  }

  async function cargarMensajes(e?: FormEvent<HTMLFormElement>) {
    e?.preventDefault();

    try {
      setCargando(true);
      setMensajeSistema("");

      const res = await fetch("/api/admin/artistas/mensajes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clave,
          accion: "listar",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensajeSistema(data.error || "No se pudieron cargar los mensajes.");
        setMensajes([]);
        return;
      }

      setMensajes(data || []);

      if (!data || data.length === 0) {
        setMensajeSistema("No hay dedicatorias pendientes.");
      }
    } catch (error) {
      console.log("Error al cargar mensajes:", error);
      setMensajeSistema("No se pudieron cargar los mensajes.");
    } finally {
      setCargando(false);
    }
  }

  async function gestionarMensaje(id: string, accion: "aprobar" | "eliminar") {
    try {
      setCargando(true);
      setMensajeSistema("");

      const res = await fetch("/api/admin/artistas/mensajes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clave,
          accion,
          id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensajeSistema(data.error || "No se pudo gestionar el mensaje.");
        return;
      }

      setMensajes((actuales) =>
        actuales.filter((mensaje) => mensaje.id !== id)
      );

      setMensajeSistema(
        accion === "aprobar"
          ? "Dedicatoria aprobada correctamente."
          : "Dedicatoria eliminada correctamente."
      );
    } catch (error) {
      console.log("Error al gestionar mensaje:", error);
      setMensajeSistema("No se pudo gestionar el mensaje.");
    } finally {
      setCargando(false);
    }
  }

  if (comprobandoAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4efe6] px-5 text-stone-950">
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
    <main className="min-h-screen bg-[#f4efe6] px-5 py-8 text-stone-950">
      <div className="mx-auto max-w-5xl">
        <nav className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-full border border-stone-200 bg-white/80 px-5 py-3 shadow-sm backdrop-blur">
          <Link href="/admin" className="text-sm font-semibold tracking-wide">
            Cuarto de llaves
          </Link>

          <div className="flex flex-wrap items-center gap-4 text-sm text-stone-600">
            <Link href="/admin/actividad" className="transition hover:text-black">
              Panel de vida
            </Link>

            <Link href="/admin/artistas" className="transition hover:text-black">
              Artistas
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

        <header className="mb-10 text-center">
          <div className="mx-auto mb-5 inline-flex rounded-full border border-stone-300 bg-white/80 px-4 py-1.5 text-[11px] uppercase tracking-[0.32em] text-stone-500 shadow-sm">
            Panel privado
          </div>

          <h1 className="font-serif text-5xl font-semibold tracking-tight">
            Dedicatorias pendientes
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-stone-600">
            Aquí puedes aprobar las dedicatorias hermosas y eliminar las que no
            deban formar parte del archivo.
          </p>
        </header>

        <section className="mb-8 rounded-[34px] border border-stone-200 bg-[#fffaf3]/95 p-6 shadow-[0_18px_45px_rgba(70,48,29,0.08)]">
          <form
            onSubmit={cargarMensajes}
            className="grid gap-4 md:grid-cols-[1fr_auto]"
          >
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-stone-400">
                Clave privada
              </label>

              <input
                type="password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                placeholder="Introduce tu clave de administrador"
                className="w-full rounded-2xl border border-stone-200 bg-white/80 px-4 py-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={cargando || !clave.trim()}
              className="self-end rounded-full bg-stone-950 px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cargando ? "Cargando..." : "Cargar"}
            </button>
          </form>

          {mensajeSistema && (
            <p className="mt-5 rounded-2xl border border-stone-200 bg-white/70 px-4 py-3 text-sm italic leading-7 text-stone-600">
              {mensajeSistema}
            </p>
          )}
        </section>

        <section className="space-y-5">
          {mensajes.map((item) => (
            <article
              key={item.id}
              className="rounded-[30px] border border-stone-200 bg-[#fffaf3]/95 p-6 shadow-[0_18px_45px_rgba(70,48,29,0.08)]"
            >
              <div className="mb-4 flex flex-col gap-2 border-b border-stone-200 pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.26em] text-stone-400">
                    Artista
                  </p>

                  <h2 className="mt-1 font-serif text-2xl font-semibold">
                    {item.artistas?.nombre || "Artista sin nombre"}
                  </h2>
                </div>

                <p className="text-xs text-stone-400">
                  {new Date(item.created_at).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <blockquote className="text-lg italic leading-9 text-stone-700">
                “{item.mensaje}”
              </blockquote>

              <p className="mt-4 text-sm text-stone-500">
                — {item.autor || "Anónimo"}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => gestionarMensaje(item.id, "aprobar")}
                  disabled={cargando}
                  className="rounded-full bg-stone-950 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-stone-800 disabled:opacity-50"
                >
                  Aprobar
                </button>

                <button
                  type="button"
                  onClick={() => gestionarMensaje(item.id, "eliminar")}
                  disabled={cargando}
                  className="rounded-full border border-stone-300 bg-white/80 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-stone-700 transition hover:bg-white hover:text-black disabled:opacity-50"
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </section>

        <footer className="mt-20 pb-10 text-center">
          <p className="text-xs uppercase tracking-[0.38em] text-stone-400">
            Poema Universal · Admin mensajes de artistas
          </p>
        </footer>
      </div>
    </main>
  );
}