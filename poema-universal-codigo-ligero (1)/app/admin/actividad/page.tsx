"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { esAdmin } from "../../../lib/adminGuard";
import { supabaseBrowser } from "../../../lib/supabaseClient";

type Registro = Record<string, unknown> & {
  id?: string;
  created_at?: string;
};

type EventoVida = {
  id: string;
  tipo: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  href?: string;
};

function leerTexto(item: Registro, campos: string[], fallback = "Sin texto") {
  for (const campo of campos) {
    const valor = item[campo];

    if (typeof valor === "string" && valor.trim()) {
      return valor.trim();
    }
  }

  return fallback;
}

function leerFecha(item: Registro) {
  if (typeof item.created_at === "string") {
    return item.created_at;
  }

  return new Date(0).toISOString();
}

function formatearFecha(fecha: string) {
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

export default function AdminActividadPage() {
  const router = useRouter();

  const [artistas, setArtistas] = useState<Registro[]>([]);
  const [versos, setVersos] = useState<Registro[]>([]);
  const [velasPublicas, setVelasPublicas] = useState<Registro[]>([]);
  const [poemas, setPoemas] = useState<Registro[]>([]);
  const [cartas, setCartas] = useState<Registro[]>([]);
  const [velasPrivadas, setVelasPrivadas] = useState<Registro[]>([]);
  const [rincon, setRincon] = useState<Registro[]>([]);
  const [recuerdos, setRecuerdos] = useState<Registro[]>([]);

  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");

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

    await cargarActividad();
  }

  async function leerTabla(nombreTabla: string) {
    const { data, error } = await supabaseBrowser
      .from(nombreTabla)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(`Error en ${nombreTabla}:`, error);
      return [];
    }

    return (data || []) as Registro[];
  }

  async function cargarActividad() {
    setMensaje("");

    const [
      artistasData,
      versosData,
      velasPublicasData,
      poemasData,
      cartasData,
      velasPrivadasData,
      rinconData,
      recuerdosData,
    ] = await Promise.all([
      leerTabla("artistas"),
      leerTabla("poema_cadena"),
      leerTabla("velas_publicas"),
      leerTabla("mis_poemas"),
      leerTabla("mis_cartas"),
      leerTabla("mis_velas"),
      leerTabla("mi_rincon"),
      leerTabla("mis_recuerdos"),
    ]);

    setArtistas(artistasData);
    setVersos(versosData);
    setVelasPublicas(velasPublicasData);
    setPoemas(poemasData);
    setCartas(cartasData);
    setVelasPrivadas(velasPrivadasData);
    setRincon(rinconData);
    setRecuerdos(recuerdosData);

    setCargando(false);
  }

  const artistasVisibles = artistas.filter((item) => {
    const visible = item.visible;
    const activo = item.activo;

    return visible !== false && activo !== false;
  });

  const versosVisibles = versos.filter((item) => item.visible !== false);
  const versosOcultos = versos.length - versosVisibles.length;

  const velasPublicasVisibles = velasPublicas.filter(
    (item) => item.visible !== false
  );
  const velasPublicasOcultas =
    velasPublicas.length - velasPublicasVisibles.length;

  const totalPrivado =
    poemas.length +
    cartas.length +
    velasPrivadas.length +
    rincon.length +
    recuerdos.length;

  const totalVivo =
    artistas.length + versos.length + velasPublicas.length + totalPrivado;

  const eventos = useMemo<EventoVida[]>(() => {
    const lista: EventoVida[] = [];

    artistas.slice(0, 8).forEach((item, index) => {
      lista.push({
        id: `artista-${item.id || index}`,
        tipo: "Artista",
        titulo: leerTexto(item, ["nombre"], "Artista sin nombre"),
        descripcion: leerTexto(
          item,
          ["disciplina", "categoria", "biografia", "descripcion"],
          "Nuevo artista añadido al archivo."
        ),
        fecha: leerFecha(item),
        href: "/admin/artistas",
      });
    });

    versos.slice(0, 10).forEach((item, index) => {
      lista.push({
        id: `verso-${item.id || index}`,
        tipo: item.visible === false ? "Verso oculto" : "Verso",
        titulo: leerTexto(item, ["autor"], "Anónimo"),
        descripcion: leerTexto(item, ["verso"], "Verso sin texto"),
        fecha: leerFecha(item),
        href: "/admin/cadena",
      });
    });

    velasPublicas.slice(0, 10).forEach((item, index) => {
      lista.push({
        id: `vela-publica-${item.id || index}`,
        tipo: item.visible === false ? "Vela pública oculta" : "Vela pública",
        titulo: `Para ${leerTexto(item, ["para_quien"], "alguien")}`,
        descripcion: leerTexto(
          item,
          ["mensaje"],
          "Una nueva luz fue encendida en el campo de velas y flores."
        ),
        fecha: leerFecha(item),
        href: "/admin/duelo",
      });
    });

    poemas.slice(0, 6).forEach((item, index) => {
      lista.push({
        id: `poema-${item.id || index}`,
        tipo: "Poema privado",
        titulo: leerTexto(item, ["titulo"], "Poema guardado"),
        descripcion: leerTexto(
          item,
          ["contenido", "poema", "texto"],
          "Poema guardado en Mi Habitación."
        ),
        fecha: leerFecha(item),
        href: "/mi-habitacion/poemas",
      });
    });

    cartas.slice(0, 6).forEach((item, index) => {
      lista.push({
        id: `carta-${item.id || index}`,
        tipo: "Carta privada",
        titulo: leerTexto(
          item,
          ["destinatario", "titulo", "nombre"],
          "Carta guardada"
        ),
        descripcion: leerTexto(
          item,
          ["contenido", "carta", "texto", "mensaje"],
          "Carta guardada en Mi Habitación."
        ),
        fecha: leerFecha(item),
        href: "/mi-habitacion/cartas",
      });
    });

    velasPrivadas.slice(0, 6).forEach((item, index) => {
      lista.push({
        id: `vela-privada-${item.id || index}`,
        tipo: "Vela privada",
        titulo: leerTexto(item, ["nombre", "para_quien"], "Vela encendida"),
        descripcion: leerTexto(
          item,
          ["mensaje", "dedicatoria", "contenido"],
          "Una vela encendida en la habitación privada."
        ),
        fecha: leerFecha(item),
        href: "/mi-habitacion/velas",
      });
    });

    rincon.slice(0, 6).forEach((item, index) => {
      lista.push({
        id: `rincon-${item.id || index}`,
        tipo: "Mi rincón",
        titulo: leerTexto(item, ["titulo", "estado"], "Nota del rincón"),
        descripcion: leerTexto(
          item,
          ["contenido", "nota", "texto", "mensaje"],
          "Entrada guardada en Mi Rincón."
        ),
        fecha: leerFecha(item),
        href: "/mi-habitacion/rincon",
      });
    });

    recuerdos.slice(0, 6).forEach((item, index) => {
      lista.push({
        id: `recuerdo-${item.id || index}`,
        tipo: "Recuerdo",
        titulo: leerTexto(item, ["titulo", "nombre"], "Recuerdo guardado"),
        descripcion: leerTexto(
          item,
          ["contenido", "recuerdo", "descripcion", "texto"],
          "Recuerdo guardado en Mi Habitación."
        ),
        fecha: leerFecha(item),
        href: "/mi-habitacion/recuerdos",
      });
    });

    return lista
      .sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      )
      .slice(0, 28);
  }, [
    artistas,
    versos,
    velasPublicas,
    poemas,
    cartas,
    velasPrivadas,
    rincon,
    recuerdos,
  ]);

  if (cargando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6efe7] px-5 text-stone-950">
        <p className="font-serif text-3xl">Leyendo la vida de la casa...</p>
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
              Cadena
            </Link>

            <Link href="/duelo" className="transition hover:text-black">
              Duelo
            </Link>

            <Link href="/admin/cadena" className="transition hover:text-black">
              Moderar cadena
            </Link>

            <Link href="/admin/duelo" className="transition hover:text-black">
              Moderar duelo
            </Link>

            <Link href="/admin/artistas" className="transition hover:text-black">
              Artistas
            </Link>
          </div>
        </nav>

        <header className="mx-auto max-w-4xl text-center">
          <p className="mb-8 text-[11px] uppercase tracking-[0.48em] text-stone-400">
            Actividad
          </p>

          <h1 className="font-serif text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
            Panel de vida
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-sm leading-8 text-stone-600">
            Una mirada rápida a lo que está pasando en Poema Universal:
            artistas, versos, velas públicas, poemas, cartas, velas privadas,
            rincones y recuerdos.
          </p>
        </header>

        <section className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-[30px] border border-stone-200 bg-white/70 p-7 shadow-sm">
            <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
              Artistas
            </p>

            <p className="mt-5 font-serif text-5xl">{artistas.length}</p>

            <p className="mt-4 text-sm leading-7 text-stone-600">
              {artistasVisibles.length} visibles públicamente.
            </p>
          </article>

          <article className="rounded-[30px] border border-stone-200 bg-white/70 p-7 shadow-sm">
            <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
              Cadena
            </p>

            <p className="mt-5 font-serif text-5xl">{versos.length}</p>

            <p className="mt-4 text-sm leading-7 text-stone-600">
              {versosVisibles.length} visibles · {versosOcultos} ocultos.
            </p>
          </article>

          <article className="rounded-[30px] border border-stone-200 bg-white/70 p-7 shadow-sm">
            <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
              Duelo
            </p>

            <p className="mt-5 font-serif text-5xl">{velasPublicas.length}</p>

            <p className="mt-4 text-sm leading-7 text-stone-600">
              {velasPublicasVisibles.length} visibles ·{" "}
              {velasPublicasOcultas} ocultas.
            </p>
          </article>

          <article className="rounded-[30px] border border-stone-200 bg-stone-950 p-7 text-white shadow-sm">
            <p className="text-xs uppercase tracking-[0.32em] text-stone-400">
              Total vivo
            </p>

            <p className="mt-5 font-serif text-5xl">{totalVivo}</p>

            <p className="mt-4 text-sm leading-7 text-stone-300">
              Huellas guardadas ahora mismo.
            </p>
          </article>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-3 lg:grid-cols-6">
          <article className="rounded-[26px] border border-stone-200 bg-white/60 p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.28em] text-stone-400">
              Poemas
            </p>
            <p className="mt-4 font-serif text-4xl">{poemas.length}</p>
          </article>

          <article className="rounded-[26px] border border-stone-200 bg-white/60 p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.28em] text-stone-400">
              Cartas
            </p>
            <p className="mt-4 font-serif text-4xl">{cartas.length}</p>
          </article>

          <article className="rounded-[26px] border border-stone-200 bg-white/60 p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.28em] text-stone-400">
              Velas privadas
            </p>
            <p className="mt-4 font-serif text-4xl">{velasPrivadas.length}</p>
          </article>

          <article className="rounded-[26px] border border-stone-200 bg-white/60 p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.28em] text-stone-400">
              Velas públicas
            </p>
            <p className="mt-4 font-serif text-4xl">{velasPublicas.length}</p>
          </article>

          <article className="rounded-[26px] border border-stone-200 bg-white/60 p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.28em] text-stone-400">
              Rincón
            </p>
            <p className="mt-4 font-serif text-4xl">{rincon.length}</p>
          </article>

          <article className="rounded-[26px] border border-stone-200 bg-white/60 p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.28em] text-stone-400">
              Recuerdos
            </p>
            <p className="mt-4 font-serif text-4xl">{recuerdos.length}</p>
          </article>
        </section>

        {mensaje && (
          <p className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white/70 px-5 py-4 text-center text-sm leading-7 text-stone-600 shadow-sm">
            {mensaje}
          </p>
        )}

        <section className="mt-14 rounded-[38px] border border-stone-200 bg-white/64 p-7 shadow-[0_25px_70px_rgba(70,48,29,0.1)]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-stone-400">
                Últimos movimientos
              </p>

              <h2 className="mt-5 font-serif text-4xl">
                Lo último que ha pasado en la casa
              </h2>
            </div>

            <button
              type="button"
              onClick={cargarActividad}
              className="rounded-full border border-stone-300 bg-white px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500 transition hover:bg-stone-950 hover:text-white"
            >
              Actualizar
            </button>
          </div>

          <div className="mt-10 space-y-4">
            {eventos.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-stone-300 bg-[#fffaf3]/70 p-10 text-center">
                <p className="font-serif text-3xl text-stone-700">
                  Todavía no hay actividad.
                </p>

                <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-stone-500">
                  Cuando la casa empiece a moverse, aparecerán aquí sus primeras
                  huellas.
                </p>
              </div>
            ) : (
              eventos.map((evento) => (
                <article
                  key={evento.id}
                  className="rounded-[28px] border border-stone-200 bg-[#fffaf3]/78 p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div className="max-w-3xl">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-stone-400">
                        {evento.tipo}
                      </p>

                      <h3 className="mt-4 font-serif text-2xl">
                        {evento.titulo}
                      </h3>

                      <p className="mt-4 line-clamp-3 text-sm leading-8 text-stone-600">
                        {evento.descripcion}
                      </p>

                      <p className="mt-5 text-xs uppercase tracking-[0.22em] text-stone-400">
                        {formatearFecha(evento.fecha)}
                      </p>
                    </div>

                    {evento.href && (
                      <Link
                        href={evento.href}
                        className="rounded-full border border-stone-300 bg-white px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500 transition hover:bg-stone-950 hover:text-white"
                      >
                        Abrir
                      </Link>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <footer className="mt-24 pb-10 text-center">
          <p className="text-xs uppercase tracking-[0.38em] text-stone-400">
            Poema Universal · Panel de vida
          </p>
        </footer>
      </div>
    </main>
  );
}