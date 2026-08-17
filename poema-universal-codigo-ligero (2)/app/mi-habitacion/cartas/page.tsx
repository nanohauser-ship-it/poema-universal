"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

type UsuarioHabitacion = {
  id: string;
  email?: string;
};

export default function MiHabitacionPage() {
  const router = useRouter();

  const [usuario, setUsuario] = useState<UsuarioHabitacion | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function comprobarUsuario() {
      const {
        data: { user },
      } = await supabaseBrowser.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUsuario({
        id: user.id,
        email: user.email || "",
      });

      setCargando(false);
    }

    comprobarUsuario();
  }, [router]);

  async function salir() {
    await supabaseBrowser.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (cargando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6efe7] text-stone-900">
        <p className="font-serif text-3xl">Abriendo tu habitación...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6efe7] px-6 py-8 text-stone-950">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-20 flex flex-wrap items-center justify-between gap-4 rounded-full border border-stone-200 bg-white/70 px-5 py-3 shadow-sm">
          <Link href="/" className="text-sm font-semibold">
            Poema Universal
          </Link>

          <div className="flex flex-wrap items-center gap-5 text-sm text-stone-600">
            <Link href="/" className="hover:text-black">
              Inicio
            </Link>

            <Link href="/fundacion" className="hover:text-black">
              Fundación
            </Link>

            <Link href="/obra" className="hover:text-black">
              Obra
            </Link>

            <button
              type="button"
              onClick={salir}
              className="rounded-full border border-stone-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-600 hover:text-black"
            >
              Salir
            </button>
          </div>
        </nav>

        <header className="mx-auto max-w-4xl text-center">
          <p className="mb-8 text-xs uppercase tracking-[0.45em] text-stone-400">
            Espacio privado
          </p>

          <h1 className="font-serif text-5xl font-semibold tracking-tight sm:text-7xl">
            Mi Habitación TEST VELAS
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-sm leading-8 text-stone-600">
            Has entrado con{" "}
            <span className="font-medium text-stone-950">{usuario?.email}</span>
            . Esta es tu habitación privada dentro de Poema Universal.
          </p>
        </header>

        <section className="mx-auto mt-20 max-w-3xl border-y border-stone-300/70 py-14 text-center">
          <p className="font-serif text-3xl leading-[1.45] text-stone-800">
            Nadie debe entrar en una habitación
            <br />
            que no le pertenece.
          </p>

          <p className="mx-auto mt-8 max-w-xl text-sm leading-8 text-stone-600">
            Aquí se guardan tus poemas, tus cartas y tus velas privadas.
          </p>
        </section>

        <section className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/mi-habitacion/poemas"
            className="rounded-[32px] border border-stone-200 bg-white/70 p-8 shadow-sm transition hover:-translate-y-1 hover:bg-white"
          >
            <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
              Cuaderno
            </p>

            <h2 className="mt-6 font-serif text-3xl">Mis poemas</h2>

            <p className="mt-5 text-sm leading-8 text-stone-600">
              Los poemas creados, escritos o guardados por ti.
            </p>
          </Link>

          <Link
            href="/mi-habitacion/cartas"
            className="rounded-[32px] border border-stone-200 bg-white/70 p-8 shadow-sm transition hover:-translate-y-1 hover:bg-white"
          >
            <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
              Cartas
            </p>

            <h2 className="mt-6 font-serif text-3xl">Mis cartas</h2>

            <p className="mt-5 text-sm leading-8 text-stone-600">
              Cartas privadas, borradores, despedidas y palabras no enviadas.
            </p>
          </Link>

          <a
            href="/mi-habitacion/velas"
            className="block rounded-[32px] border-2 border-amber-500 bg-white p-8 text-left shadow-sm transition hover:-translate-y-1 hover:bg-white"
          >
            <p className="text-xs uppercase tracking-[0.32em] text-amber-600">
              Luces
            </p>

            <h2 className="mt-6 font-serif text-3xl">Mis velas</h2>

            <p className="mt-5 text-sm leading-8 text-stone-600">
              Las velas encendidas, los nombres recordados y los gestos de
              memoria.
            </p>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
              Entrar en Mis velas
            </p>
          </a>

          <article className="rounded-[32px] border border-stone-200 bg-white/50 p-8 shadow-sm opacity-70">
            <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
              Refugio
            </p>

            <h2 className="mt-6 font-serif text-3xl">Mi rincón</h2>

            <p className="mt-5 text-sm leading-8 text-stone-600">
              Próxima habitación privada.
            </p>
          </article>

          <article className="rounded-[32px] border border-stone-200 bg-white/50 p-8 shadow-sm opacity-70">
            <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
              Archivo
            </p>

            <h2 className="mt-6 font-serif text-3xl">Mis recuerdos</h2>

            <p className="mt-5 text-sm leading-8 text-stone-600">
              Próximo archivo personal.
            </p>
          </article>

          <article className="rounded-[32px] bg-stone-950 p-8 text-white shadow-sm">
            <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
              Cerradura
            </p>

            <h2 className="mt-6 font-serif text-3xl">
              Acceso privado activo
            </h2>

            <p className="mt-5 text-sm leading-8 text-stone-300">
              Tu sesión está abierta. Esta habitación ya tiene cerradura.
            </p>
          </article>
        </section>

        <footer className="mt-28 pb-10 text-center">
          <p className="text-xs uppercase tracking-[0.38em] text-stone-400">
            Poema Universal · Mi Habitación
          </p>
        </footer>
      </div>
    </main>
  );
}