"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { esAdmin } from "../../../lib/adminGuard";
import { supabaseBrowser } from "../../../lib/supabaseClient";

type VersoCadena = {
  id: string;
  autor: string | null;
  ciudad: string | null;
  pais: string | null;
  verso: string;
  visible: boolean;
  created_at: string;
};

export default function AdminCadenaPage() {
  const router = useRouter();

  const [versos, setVersos] = useState<VersoCadena[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [procesandoId, setProcesandoId] = useState<string | null>(null);

  useEffect(() => {
    comprobarUsuarioYCargar();
  }, []);

  async function comprobarUsuarioYCargar() {
    setCargando(true);

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

    await cargarVersos();
  }

  async function cargarVersos() {
    const { data, error } = await supabaseBrowser
      .from("poema_cadena")
      .select("id, autor, ciudad, pais, verso, visible, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Error Supabase al cargar la cadena:", error);
      setMensaje("No se pudo cargar la cadena.");
      setCargando(false);
      return;
    }

    setVersos(data || []);
    setCargando(false);
  }

  async function cambiarVisibilidad(id: string, visibleActual: boolean) {
    setProcesandoId(id);
    setMensaje("");

    const { error } = await supabaseBrowser
      .from("poema_cadena")
      .update({ visible: !visibleActual })
      .eq("id", id);

    if (error) {
      console.log("Error Supabase al cambiar visibilidad:", error);
      setMensaje("No se pudo cambiar la visibilidad del verso.");
      setProcesandoId(null);
      return;
    }

    setVersos((actuales) =>
      actuales.map((verso) =>
        verso.id === id ? { ...verso, visible: !visibleActual } : verso
      )
    );

    setMensaje(visibleActual ? "Verso ocultado." : "Verso visible de nuevo.");
    setProcesandoId(null);
  }

  async function borrarVerso(id: string) {
    const confirmar = window.confirm(
      "¿Seguro que quieres borrar este verso? Esta acción no se puede deshacer."
    );

    if (!confirmar) return;

    setProcesandoId(id);
    setMensaje("");

    const { error } = await supabaseBrowser
      .from("poema_cadena")
      .delete()
      .eq("id", id);

    if (error) {
      console.log("Error Supabase al borrar verso:", error);
      setMensaje("No se pudo borrar el verso.");
      setProcesandoId(null);
      return;
    }

    setVersos((actuales) => actuales.filter((verso) => verso.id !== id));
    setMensaje("Verso borrado de la cadena.");
    setProcesandoId(null);
  }

  const visibles = versos.filter((verso) => verso.visible).length;
  const ocultos = versos.length - visibles;

  if (cargando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6efe7] px-5 text-stone-950">
        <div className="text-center">
          <p className="mb-5 text-[11px] uppercase tracking-[0.4em] text-stone-400">
            Administración
          </p>

          <p className="font-serif text-3xl">Abriendo la cadena...</p>
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
            <Link href="/" className="transition hover:text-black">
              Inicio
            </Link>

            <Link href="/cadena" className="transition hover:text-black">
              Ver cadena pública
            </Link>

            <Link href="/admin/actividad" className="transition hover:text-black">
              Panel de vida
            </Link>

            <Link href="/admin/duelo" className="transition hover:text-black">
              Duelo
            </Link>

            <Link href="/admin/artistas" className="transition hover:text-black">
              Artistas
            </Link>

            <Link href="/mi-habitacion" className="transition hover:text-black">
              Mi Habitación
            </Link>
          </div>
        </nav>

        <header className="mx-auto max-w-4xl text-center">
          <p className="mb-8 text-[11px] uppercase tracking-[0.48em] text-stone-400">
            Moderación
          </p>

          <h1 className="font-serif text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
            Cadena del
            <br />
            Poema Universal
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-sm leading-8 text-stone-600">
            Desde aquí puedes cuidar el poema vivo: revisar versos, ocultar lo
            que no debe aparecer públicamente y borrar entradas si es necesario.
          </p>
        </header>

        <section className="mt-16 grid gap-5 md:grid-cols-3">
          <article className="rounded-[30px] border border-stone-200 bg-white/70 p-7 shadow-sm">
            <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
              Total
            </p>

            <p className="mt-5 font-serif text-5xl">{versos.length}</p>

            <p className="mt-4 text-sm leading-7 text-stone-600">
              Versos guardados en la cadena.
            </p>
          </article>

          <article className="rounded-[30px] border border-stone-200 bg-white/70 p-7 shadow-sm">
            <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
              Visibles
            </p>

            <p className="mt-5 font-serif text-5xl">{visibles}</p>

            <p className="mt-4 text-sm leading-7 text-stone-600">
              Aparecen ahora mismo en la página pública.
            </p>
          </article>

          <article className="rounded-[30px] border border-stone-200 bg-stone-950 p-7 text-white shadow-sm">
            <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
              Ocultos
            </p>

            <p className="mt-5 font-serif text-5xl">{ocultos}</p>

            <p className="mt-4 text-sm leading-7 text-stone-300">
              Guardados, pero no visibles para el público.
            </p>
          </article>
        </section>

        {mensaje && (
          <p className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white/70 px-5 py-4 text-center text-sm leading-7 text-stone-600 shadow-sm">
            {mensaje}
          </p>
        )}

        <section className="mt-14 space-y-5">
          {versos.length === 0 ? (
            <div className="rounded-[34px] border border-dashed border-stone-300 bg-white/60 p-10 text-center">
              <p className="font-serif text-3xl text-stone-700">
                Todavía no hay versos.
              </p>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-stone-500">
                Cuando alguien escriba en la cadena pública, aparecerá aquí.
              </p>
            </div>
          ) : (
            versos.map((item, index) => (
              <article
                key={item.id}
                className={`rounded-[32px] border p-7 shadow-sm ${
                  item.visible
                    ? "border-stone-200 bg-white/72"
                    : "border-stone-300 bg-stone-200/60"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-stone-400">
                      Verso {versos.length - index}
                    </p>

                    <p className="mt-4 font-serif text-2xl leading-[1.45] text-stone-850">
                      “{item.verso}”
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                      <span>{item.autor || "Anónimo"}</span>

                      {(item.ciudad || item.pais) && (
                        <>
                          <span>·</span>
                          <span>
                            {[item.ciudad, item.pais]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </>
                      )}

                      <span>·</span>

                      <span>
                        {new Date(item.created_at).toLocaleString("es-ES")}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <span
                      className={`rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] ${
                        item.visible
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-stone-300 text-stone-700"
                      }`}
                    >
                      {item.visible ? "Visible" : "Oculto"}
                    </span>

                    <button
                      type="button"
                      disabled={procesandoId === item.id}
                      onClick={() => cambiarVisibilidad(item.id, item.visible)}
                      className="rounded-full border border-stone-300 bg-white px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-600 transition hover:bg-stone-950 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {item.visible ? "Ocultar" : "Mostrar"}
                    </button>

                    <button
                      type="button"
                      disabled={procesandoId === item.id}
                      onClick={() => borrarVerso(item.id)}
                      className="rounded-full border border-red-200 bg-red-50 px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>

        <footer className="mt-24 pb-10 text-center">
          <p className="text-xs uppercase tracking-[0.38em] text-stone-400">
            Poema Universal · Admin Cadena
          </p>
        </footer>
      </div>
    </main>
  );
}