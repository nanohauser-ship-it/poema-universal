"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { esAdmin } from "../../lib/adminGuard";
import { supabaseBrowser } from "../../lib/supabaseClient";

export default function AdminPage() {
  const router = useRouter();

  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    comprobarAdmin();
  }, []);

  async function comprobarAdmin() {
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

    setCargando(false);
  }

  if (cargando) {
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
        <nav className="mb-20 flex flex-wrap items-center justify-between gap-4 rounded-full border border-stone-200 bg-white/70 px-5 py-3 shadow-sm">
          <Link href="/" className="text-sm font-semibold tracking-wide">
            Poema Universal
          </Link>

          <div className="flex flex-wrap items-center gap-5 text-sm text-stone-600">
            <Link href="/" className="transition hover:text-black">
              Inicio
            </Link>

            <Link href="/fundacion" className="transition hover:text-black">
              Fundación
            </Link>

            <Link href="/obra" className="transition hover:text-black">
              Obra
            </Link>

            <Link href="/artistas" className="transition hover:text-black">
              Artistas
            </Link>

            <Link href="/cadena" className="transition hover:text-black">
              Cadena
            </Link>

            <Link href="/poema-2026" className="transition hover:text-black">
              Poema 2026
            </Link>

            <Link href="/duelo" className="transition hover:text-black">
              Duelo
            </Link>

            <Link href="/mi-habitacion" className="transition hover:text-black">
              Mi Habitación
            </Link>
          </div>
        </nav>

        <header className="mx-auto max-w-4xl text-center">
          <p className="mb-8 text-[11px] uppercase tracking-[0.48em] text-stone-400">
            Administración
          </p>

          <h1 className="font-serif text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
            Cuarto de llaves
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-sm leading-8 text-stone-600">
            Esta es la trastienda privada de Poema Universal: el lugar desde el
            que se cuidan artistas, mensajes, versos, velas, salas públicas,
            poemas anuales y futuras puertas del proyecto.
          </p>
        </header>

        <section className="mx-auto mt-20 max-w-3xl border-y border-stone-300/70 py-14 text-center">
          <p className="font-serif text-3xl leading-[1.45] text-stone-800">
            Una obra también necesita
            <br />
            una habitación para sus llaves.
          </p>

          <p className="mx-auto mt-8 max-w-xl text-sm leading-8 text-stone-600">
            Desde aquí podrás ordenar lo que el visitante ve, lo que se modera y
            lo que todavía permanece en preparación.
          </p>
        </section>

        <section className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/actividad"
            className="rounded-[32px] bg-stone-950 p-8 text-white shadow-[0_24px_70px_rgba(0,0,0,0.18)] transition hover:-translate-y-1 hover:bg-stone-800"
          >
            <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
              Latido general
            </p>

            <h2 className="mt-6 font-serif text-3xl">Panel de vida</h2>

            <p className="mt-5 text-sm leading-8 text-stone-300">
              Mira los últimos movimientos de la casa: artistas, versos, poemas,
              cartas, velas, rincones, recuerdos y salas vivas.
            </p>
          </Link>

          <Link
            href="/admin/poema-anual"
            className="rounded-[32px] border border-[#7a5a35]/30 bg-[#6f4e2f] p-8 text-white shadow-[0_24px_70px_rgba(70,48,29,0.22)] transition hover:-translate-y-1 hover:bg-stone-950"
          >
            <p className="text-xs uppercase tracking-[0.32em] text-stone-300">
              Puerta anual
            </p>

            <h2 className="mt-6 font-serif text-3xl">Poema del año</h2>

            <p className="mt-5 text-sm leading-8 text-stone-200">
              Escribe, guarda y prepara el Gran Poema Universal 2026 antes de su
              presentación oficial el 1 de enero de 2027.
            </p>
          </Link>

          <Link
            href="/poema-2026"
            className="rounded-[32px] border border-stone-200 bg-white/70 p-8 shadow-sm transition hover:-translate-y-1 hover:bg-white"
          >
            <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
              Sala pública
            </p>

            <h2 className="mt-6 font-serif text-3xl">Ver Poema 2026</h2>

            <p className="mt-5 text-sm leading-8 text-stone-600">
              Entra en la puerta anual pública y comprueba la cuenta atrás hasta
              la presentación del gran poema.
            </p>
          </Link>

          <Link
            href="/admin/artistas"
            className="rounded-[32px] border border-stone-200 bg-white/70 p-8 shadow-sm transition hover:-translate-y-1 hover:bg-white"
          >
            <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
              Archivo vivo
            </p>

            <h2 className="mt-6 font-serif text-3xl">Gestionar artistas</h2>

            <p className="mt-5 text-sm leading-8 text-stone-600">
              Añade artistas, biografías, imágenes, enlaces, visibilidad y
              destacados.
            </p>
          </Link>

          <Link
            href="/admin/cadena"
            className="rounded-[32px] border border-stone-200 bg-white/70 p-8 shadow-sm transition hover:-translate-y-1 hover:bg-white"
          >
            <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
              Poema vivo
            </p>

            <h2 className="mt-6 font-serif text-3xl">Moderar cadena</h2>

            <p className="mt-5 text-sm leading-8 text-stone-600">
              Revisa los versos del Poema Universal, oculta entradas y cuida la
              cadena colectiva.
            </p>
          </Link>

          <Link
            href="/admin/duelo"
            className="rounded-[32px] border border-stone-200 bg-white/70 p-8 shadow-sm transition hover:-translate-y-1 hover:bg-white"
          >
            <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
              Campo de memoria
            </p>

            <h2 className="mt-6 font-serif text-3xl">Moderar duelo</h2>

            <p className="mt-5 text-sm leading-8 text-stone-600">
              Revisa las velas públicas, oculta luces si es necesario y cuida el
              campo de flores.
            </p>
          </Link>

          <Link
            href="/admin/artistas/mensajes"
            className="rounded-[32px] border border-stone-200 bg-white/70 p-8 shadow-sm transition hover:-translate-y-1 hover:bg-white"
          >
            <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
              Cartas recibidas
            </p>

            <h2 className="mt-6 font-serif text-3xl">Mensajes de artistas</h2>

            <p className="mt-5 text-sm leading-8 text-stone-600">
              Revisa mensajes, propuestas o presencias que lleguen desde la sala
              de artistas.
            </p>
          </Link>

          <Link
            href="/cadena"
            className="rounded-[32px] border border-stone-200 bg-white/70 p-8 shadow-sm transition hover:-translate-y-1 hover:bg-white"
          >
            <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
              Sala pública
            </p>

            <h2 className="mt-6 font-serif text-3xl">Ver cadena</h2>

            <p className="mt-5 text-sm leading-8 text-stone-600">
              Comprueba cómo aparece públicamente el poema colectivo escrito
              entre todos.
            </p>
          </Link>

          <Link
            href="/duelo"
            className="rounded-[32px] border border-stone-200 bg-white/70 p-8 shadow-sm transition hover:-translate-y-1 hover:bg-white"
          >
            <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
              Sala pública
            </p>

            <h2 className="mt-6 font-serif text-3xl">Ver duelo</h2>

            <p className="mt-5 text-sm leading-8 text-stone-600">
              Entra en el campo público de velas y flores para revisar cómo se
              ve la sala de memoria.
            </p>
          </Link>

          <Link
            href="/artistas"
            className="rounded-[32px] border border-stone-200 bg-white/70 p-8 shadow-sm transition hover:-translate-y-1 hover:bg-white"
          >
            <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
              Sala pública
            </p>

            <h2 className="mt-6 font-serif text-3xl">Ver artistas</h2>

            <p className="mt-5 text-sm leading-8 text-stone-600">
              Comprueba cómo aparece públicamente el archivo de artistas
              fundamentales.
            </p>
          </Link>

          <Link
            href="/mi-habitacion"
            className="rounded-[32px] border border-stone-200 bg-white/70 p-8 shadow-sm transition hover:-translate-y-1 hover:bg-white"
          >
            <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
              Zona privada
            </p>

            <h2 className="mt-6 font-serif text-3xl">Mi Habitación</h2>

            <p className="mt-5 text-sm leading-8 text-stone-600">
              Entra en la zona privada: poemas, cartas, velas, rincón y
              recuerdos.
            </p>
          </Link>

          <Link
            href="/fundacion"
            className="rounded-[32px] border border-stone-200 bg-white/70 p-8 shadow-sm transition hover:-translate-y-1 hover:bg-white"
          >
            <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
              Manifiesto
            </p>

            <h2 className="mt-6 font-serif text-3xl">Fundación</h2>

            <p className="mt-5 text-sm leading-8 text-stone-600">
              Revisa la página que explica el sentido profundo de Poema
              Universal.
            </p>
          </Link>

          <Link
            href="/obra"
            className="rounded-[32px] border border-stone-200 bg-white/70 p-8 shadow-sm transition hover:-translate-y-1 hover:bg-white"
          >
            <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
              Tríptico
            </p>

            <h2 className="mt-6 font-serif text-3xl">Obra</h2>

            <p className="mt-5 text-sm leading-8 text-stone-600">
              Accede a la sala literaria: El Árbol Blanco, La Jerarquía del
              Hambre y Memorias de Bielka.
            </p>
          </Link>
        </section>

        <section className="mt-20 rounded-[36px] bg-stone-950 p-8 text-white shadow-sm">
          <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
            Estado del sistema
          </p>

          <h2 className="mt-6 font-serif text-3xl">
            Poema Universal ya tiene estructura viva
          </h2>

          <div className="mt-8 grid gap-4 text-sm leading-8 text-stone-300 md:grid-cols-2">
            <p>
              Web pública: inicio, fundación, obra, artistas, cadena, duelo y
              puerta anual.
            </p>

            <p>Zona privada: poemas, cartas, velas, rincón y recuerdos.</p>

            <p>
              Base de datos: Supabase conectado, RLS activo y memoria guardada.
            </p>

            <p>
              Administración: actividad, artistas, mensajes, cadena, duelo y
              poema anual.
            </p>
          </div>
        </section>

        <footer className="mt-28 pb-10 text-center">
          <p className="text-xs uppercase tracking-[0.38em] text-stone-400">
            Poema Universal · Admin
          </p>
        </footer>
      </div>
    </main>
  );
}