"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { esAdmin } from "../../../lib/adminGuard";
import { supabaseBrowser } from "../../../lib/supabaseClient";

type VelaPublica = {
  id: string;
  nombre: string | null;
  para_quien: string;
  mensaje: string | null;
  ciudad: string | null;
  pais: string | null;
  visible: boolean;
  created_at: string;
};

function fechaBonita(fecha: string) {
  const date = new Date(fecha);

  if (Number.isNaN(date.getTime())) {
    return "Sin fecha";
  }

  return date.toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminDueloPage() {
  const router = useRouter();

  const [velas, setVelas] = useState<VelaPublica[]>([]);
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

    await cargarVelas();
  }

  async function cargarVelas() {
    setMensaje("");

    const { data, error } = await supabaseBrowser
      .from("velas_publicas")
      .select("id, nombre, para_quien, mensaje, ciudad, pais, visible, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Error Supabase al cargar velas públicas:", error);
      setMensaje("No se pudieron cargar las velas públicas.");
      setCargando(false);
      return;
    }

    setVelas(data || []);
    setCargando(false);
  }

  async function cambiarVisibilidad(id: string, visibleActual: boolean) {
    setProcesandoId(id);
    setMensaje("");

    const { error } = await supabaseBrowser
      .from("velas_publicas")
      .update({ visible: !visibleActual })
      .eq("id", id);

    if (error) {
      console.log("Error Supabase al cambiar visibilidad:", error);
      setMensaje("No se pudo cambiar la visibilidad de la vela.");
      setProcesandoId(null);
      return;
    }

    setVelas((actuales) =>
      actuales.map((vela) =>
        vela.id === id ? { ...vela, visible: !visibleActual } : vela
      )
    );

    setMensaje(
      visibleActual
        ? "Vela ocultada del campo público."
        : "Vela visible de nuevo en el campo."
    );

    setProcesandoId(null);
  }

  async function borrarVela(id: string) {
    const confirmar = window.confirm(
      "¿Seguro que quieres borrar esta vela? Esta acción no se puede deshacer."
    );

    if (!confirmar) return;

    setProcesandoId(id);
    setMensaje("");

    const { error } = await supabaseBrowser
      .from("velas_publicas")
      .delete()
      .eq("id", id);

    if (error) {
      console.log("Error Supabase al borrar vela:", error);
      setMensaje("No se pudo borrar la vela.");
      setProcesandoId(null);
      return;
    }

    setVelas((actuales) => actuales.filter((vela) => vela.id !== id));
    setMensaje("Vela borrada del campo.");
    setProcesandoId(null);
  }

  const visibles = useMemo(
    () => velas.filter((vela) => vela.visible).length,
    [velas]
  );

  const ocultas = velas.length - visibles;

  if (cargando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6efe7] px-5 text-stone-950">
        <div className="text-center">
          <p className="mb-5 text-[11px] uppercase tracking-[0.4em] text-stone-400">
            Administración
          </p>

          <p className="font-serif text-3xl">Abriendo el campo de velas...</p>
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

            <Link href="/duelo" className="transition hover:text-black">
              Ver campo público
            </Link>

            <Link href="/admin/actividad" className="transition hover:text-black">
              Panel de vida
            </Link>

            <Link href="/admin/cadena" className="transition hover:text-black">
              Cadena
            </Link>

            <Link href="/admin/artistas" className="transition hover:text-black">
              Artistas
            </Link>
          </div>
        </nav>

        <header className="mx-auto max-w-4xl text-center">
          <p className="mb-8 text-[11px] uppercase tracking-[0.48em] text-stone-400">
            Moderación
          </p>

          <h1 className="font-serif text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
            Campo de velas
            <br />
            y flores
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-sm leading-8 text-stone-600">
            Desde aquí puedes cuidar la sala pública de duelo: revisar velas,
            ocultar entradas que no deban aparecer y borrar luces si es
            necesario.
          </p>
        </header>

        <section className="mt-16 grid gap-5 md:grid-cols-3">
          <article className="rounded-[30px] border border-stone-200 bg-white/70 p-7 shadow-sm">
            <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
              Total
            </p>

            <p className="mt-5 font-serif text-5xl">{velas.length}</p>

            <p className="mt-4 text-sm leading-7 text-stone-600">
              Velas guardadas en la sala de duelo.
            </p>
          </article>

          <article className="rounded-[30px] border border-stone-200 bg-white/70 p-7 shadow-sm">
            <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
              Visibles
            </p>

            <p className="mt-5 font-serif text-5xl">{visibles}</p>

            <p className="mt-4 text-sm leading-7 text-stone-600">
              Aparecen ahora mismo en el campo público.
            </p>
          </article>

          <article className="rounded-[30px] border border-stone-200 bg-stone-950 p-7 text-white shadow-sm">
            <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
              Ocultas
            </p>

            <p className="mt-5 font-serif text-5xl">{ocultas}</p>

            <p className="mt-4 text-sm leading-7 text-stone-300">
              Permanecen guardadas, pero no se muestran.
            </p>
          </article>
        </section>

        {mensaje && (
          <p className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white/70 px-5 py-4 text-center text-sm leading-7 text-stone-600 shadow-sm">
            {mensaje}
          </p>
        )}

        <section className="mt-14 space-y-5">
          {velas.length === 0 ? (
            <div className="rounded-[34px] border border-dashed border-stone-300 bg-white/60 p-10 text-center">
              <p className="font-serif text-3xl text-stone-700">
                Todavía no hay velas públicas.
              </p>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-stone-500">
                Cuando alguien encienda una luz en /duelo, aparecerá aquí.
              </p>
            </div>
          ) : (
            velas.map((vela, index) => (
              <article
                key={vela.id}
                className={`rounded-[32px] border p-7 shadow-sm ${
                  vela.visible
                    ? "border-stone-200 bg-white/72"
                    : "border-stone-300 bg-stone-200/60"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div className="max-w-3xl">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-stone-400">
                      Vela {velas.length - index}
                    </p>

                    <h2 className="mt-4 font-serif text-3xl text-stone-900">
                      Para {vela.para_quien}
                    </h2>

                    {vela.mensaje && (
                      <p className="mt-5 font-serif text-2xl leading-[1.45] text-stone-800">
                        “{vela.mensaje}”
                      </p>
                    )}

                    <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                      <span>{vela.nombre || "Anónimo"}</span>

                      {(vela.ciudad || vela.pais) && (
                        <>
                          <span>·</span>
                          <span>
                            {[vela.ciudad, vela.pais]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </>
                      )}

                      <span>·</span>

                      <span>{fechaBonita(vela.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <span
                      className={`rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] ${
                        vela.visible
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-stone-300 text-stone-700"
                      }`}
                    >
                      {vela.visible ? "Visible" : "Oculta"}
                    </span>

                    <button
                      type="button"
                      disabled={procesandoId === vela.id}
                      onClick={() => cambiarVisibilidad(vela.id, vela.visible)}
                      className="rounded-full border border-stone-300 bg-white px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-600 transition hover:bg-stone-950 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {vela.visible ? "Ocultar" : "Mostrar"}
                    </button>

                    <button
                      type="button"
                      disabled={procesandoId === vela.id}
                      onClick={() => borrarVela(vela.id)}
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
            Poema Universal · Admin Duelo
          </p>
        </footer>
      </div>
    </main>
  );
}