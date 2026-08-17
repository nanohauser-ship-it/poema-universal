"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

type VelaPrivada = {
  id: string;
  nombre: string;
  dedicatoria: string | null;
  fecha_recuerdo: string | null;
  created_at: string;
};

export default function MisVelasPage() {
  const router = useRouter();

  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [velas, setVelas] = useState<VelaPrivada[]>([]);

  const [nombre, setNombre] = useState("");
  const [dedicatoria, setDedicatoria] = useState("");
  const [fechaRecuerdo, setFechaRecuerdo] = useState("");

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
      await cargarVelas(user.id);
      setCargando(false);
    }

    iniciar();
  }, [router]);

  async function cargarVelas(userId: string) {
    const { data, error } = await supabaseBrowser
      .from("mis_velas")
      .select("id, nombre, dedicatoria, fecha_recuerdo, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      setMensaje(error.message);
      return;
    }

    setVelas(data || []);
  }

  async function guardarVela() {
    if (!usuarioId) {
      router.push("/login");
      return;
    }

    const nombreLimpio = nombre.trim();

    if (!nombreLimpio) {
      setMensaje("Escribe el nombre de la persona o recuerdo.");
      return;
    }

    setGuardando(true);
    setMensaje("");

    const { error } = await supabaseBrowser.from("mis_velas").insert({
      user_id: usuarioId,
      nombre: nombreLimpio,
      dedicatoria: dedicatoria.trim() || null,
      fecha_recuerdo: fechaRecuerdo || null,
    });

    if (error) {
      setMensaje(error.message);
      setGuardando(false);
      return;
    }

    setNombre("");
    setDedicatoria("");
    setFechaRecuerdo("");
    setMensaje("Vela guardada en tu habitación.");
    await cargarVelas(usuarioId);
    setGuardando(false);
  }

  async function eliminarVela(id: string) {
    if (!usuarioId) return;

    const { error } = await supabaseBrowser
      .from("mis_velas")
      .delete()
      .eq("id", id);

    if (error) {
      setMensaje(error.message);
      return;
    }

    await cargarVelas(usuarioId);
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
        <p className="font-serif text-3xl">Encendiendo tus velas...</p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6efe7] px-5 py-8 text-stone-950">
      <style>
        {`
          @keyframes pageBreath {
            0% { transform: translate3d(0, 0, 0) scale(1); opacity: .26; }
            50% { transform: translate3d(12px, -14px, 0) scale(1.03); opacity: .44; }
            100% { transform: translate3d(0, 0, 0) scale(1); opacity: .26; }
          }

          @keyframes candleGlow {
            0% { opacity: .28; transform: scale(1); }
            50% { opacity: .48; transform: scale(1.08); }
            100% { opacity: .28; transform: scale(1); }
          }

          @keyframes smallPulse {
            0% { opacity: .12; }
            50% { opacity: .22; }
            100% { opacity: .12; }
          }
        `}
      </style>

      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #faf3ec 0%, #f0e4d8 48%, #f8f1e8 100%)",
          }}
        />

        <div
          className="absolute left-[-240px] top-[8%] h-[680px] w-[680px] rounded-full bg-[#dcc5a2]/25 blur-3xl"
          style={{ animation: "pageBreath 20s ease-in-out infinite" }}
        />

        <div
          className="absolute right-[-260px] bottom-[2%] h-[740px] w-[740px] rounded-full bg-white/45 blur-3xl"
          style={{ animation: "pageBreath 24s ease-in-out infinite reverse" }}
        />

        <div
          className="absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(80,58,35,0.18) 0.55px, transparent 0.75px)",
            backgroundSize: "18px 18px",
            animation: "smallPulse 14s ease-in-out infinite",
          }}
        />

        <div className="absolute inset-0 bg-[#f6efe7]/42" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <nav className="mb-20 flex flex-wrap items-center justify-between gap-4 rounded-full border border-stone-200/80 bg-white/60 px-5 py-3 shadow-sm backdrop-blur-xl">
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

            <Link href="/" className="transition hover:text-black">
              Inicio
            </Link>
          </div>
        </nav>

        <header className="mx-auto max-w-4xl text-center">
          <p className="mb-8 text-[11px] uppercase tracking-[0.48em] text-stone-400">
            Luces privadas
          </p>

          <h1 className="font-serif text-5xl font-semibold leading-[1.06] tracking-tight sm:text-7xl">
            Mis velas
          </h1>

          <p className="mx-auto mt-10 max-w-2xl text-[15px] leading-9 text-stone-600">
            Un lugar íntimo para guardar nombres, fechas, recuerdos y pequeñas
            luces personales. Nadie más verá estas velas.
          </p>
        </header>

        <section className="mx-auto mt-20 max-w-3xl rounded-[44px] border border-stone-200/80 bg-white/58 p-6 shadow-[0_30px_90px_rgba(70,48,29,0.10)] backdrop-blur-xl sm:p-10">
          <p className="text-[11px] uppercase tracking-[0.42em] text-stone-400">
            Nueva vela
          </p>

          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre o recuerdo"
            className="mt-7 w-full rounded-full border border-stone-200 bg-[#fbf6ee] px-6 py-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
          />

          <input
            value={fechaRecuerdo}
            onChange={(e) => setFechaRecuerdo(e.target.value)}
            type="date"
            className="mt-5 w-full rounded-full border border-stone-200 bg-[#fbf6ee] px-6 py-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
          />

          <textarea
            value={dedicatoria}
            onChange={(e) => setDedicatoria(e.target.value)}
            placeholder="Dedicatoria, memoria o pequeña luz..."
            className="mt-5 min-h-[220px] w-full resize-none rounded-[34px] border border-stone-200 bg-[#fbf6ee] px-6 py-5 text-[15px] leading-8 text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
          />

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs leading-6 text-stone-500">
              Se guardará solo en tu habitación privada.
            </p>

            <button
              type="button"
              onClick={guardarVela}
              disabled={guardando}
              className="rounded-full bg-stone-950 px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {guardando ? "Guardando..." : "Guardar vela"}
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
            <p className="text-[11px] uppercase tracking-[0.48em] text-stone-400">
              Archivo privado
            </p>

            <h2 className="mt-7 font-serif text-4xl font-semibold leading-tight">
              Velas guardadas
            </h2>
          </div>

          {velas.length === 0 ? (
            <div className="mx-auto mt-12 max-w-2xl rounded-[34px] border border-stone-200/80 bg-white/45 p-8 text-center shadow-[0_20px_60px_rgba(70,48,29,0.07)] backdrop-blur-md">
              <p className="font-serif text-2xl text-stone-800">
                Todavía no hay velas guardadas.
              </p>

              <p className="mt-4 text-sm leading-8 text-stone-600">
                La primera vela será la primera luz de esta habitación.
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {velas.map((vela) => (
                <article
                  key={vela.id}
                  className="relative overflow-hidden rounded-[34px] border border-stone-200/80 bg-white/48 p-7 shadow-[0_20px_60px_rgba(70,48,29,0.08)] backdrop-blur-md"
                >
                  <div
                    className="pointer-events-none absolute right-8 top-8 h-20 w-20 rounded-full bg-[#e6bf72]/30 blur-2xl"
                    style={{ animation: "candleGlow 4s ease-in-out infinite" }}
                  />

                  <div className="relative z-10 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.34em] text-stone-400">
                        {formatearFecha(vela.created_at)}
                      </p>

                      <h3 className="mt-4 font-serif text-3xl text-stone-950">
                        {vela.nombre}
                      </h3>

                      {vela.fecha_recuerdo && (
                        <p className="mt-3 text-sm italic leading-7 text-stone-500">
                          Fecha recordada: {formatearFecha(vela.fecha_recuerdo)}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => eliminarVela(vela.id)}
                      className="rounded-full border border-stone-200 bg-white/60 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500 transition hover:bg-white hover:text-black"
                    >
                      Borrar
                    </button>
                  </div>

                  <div className="relative z-10 mt-7 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d9bd81]/60 bg-[#fff7e8] shadow-[0_0_30px_rgba(214,169,91,0.28)]">
                      <span className="text-xl">🕯</span>
                    </div>

                    <p className="text-sm uppercase tracking-[0.28em] text-stone-400">
                      Vela privada
                    </p>
                  </div>

                  {vela.dedicatoria && (
                    <p className="relative z-10 mt-6 whitespace-pre-line font-serif text-xl leading-[1.55] text-stone-800">
                      {vela.dedicatoria}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="mx-auto mt-28 max-w-xl pb-12 text-center">
          <p className="text-[11px] uppercase tracking-[0.42em] text-stone-400">
            Poema Universal · Mis velas
          </p>
        </footer>
      </div>
    </main>
  );
}