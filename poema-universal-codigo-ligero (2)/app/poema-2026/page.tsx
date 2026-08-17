"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

type TiempoRestante = {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
  terminado: boolean;
};

type PoemaAnualPublico = {
  id: string;
  anio: number;
  titulo: string;
  subtitulo: string | null;
  contenido: string | null;
  estado: "borrador" | "publicado";
  visible: boolean;
  fecha_presentacion: string;
};

function calcularTiempoRestante(): TiempoRestante {
  const objetivo = new Date("2027-01-01T00:00:00+01:00").getTime();
  const ahora = new Date().getTime();
  const diferencia = objetivo - ahora;

  if (diferencia <= 0) {
    return {
      dias: 0,
      horas: 0,
      minutos: 0,
      segundos: 0,
      terminado: true,
    };
  }

  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
  const segundos = Math.floor((diferencia / 1000) % 60);

  return {
    dias,
    horas,
    minutos,
    segundos,
    terminado: false,
  };
}

function NumeroCuenta({
  valor,
  etiqueta,
}: {
  valor: number;
  etiqueta: string;
}) {
  return (
    <div className="rounded-[28px] border border-stone-200 bg-white/70 px-5 py-6 text-center shadow-sm backdrop-blur">
      <p className="font-serif text-5xl font-semibold leading-none text-stone-950 sm:text-6xl">
        {String(valor).padStart(2, "0")}
      </p>

      <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-stone-400">
        {etiqueta}
      </p>
    </div>
  );
}

export default function PoemaUniversal2026Page() {
  const [montado, setMontado] = useState(false);
  const [tiempo, setTiempo] = useState<TiempoRestante | null>(null);
  const [poemaOficial, setPoemaOficial] = useState<PoemaAnualPublico | null>(
    null
  );
  const [cargandoPoema, setCargandoPoema] = useState(false);

  const fechaPresentacion = "1 de enero de 2027";

  useEffect(() => {
    setMontado(true);
    setTiempo(calcularTiempoRestante());

    const intervalo = window.setInterval(() => {
      setTiempo(calcularTiempoRestante());
    }, 1000);

    return () => window.clearInterval(intervalo);
  }, []);

  useEffect(() => {
    if (montado && tiempo?.terminado) {
      cargarPoemaOficial();
    }
  }, [montado, tiempo?.terminado]);

  async function cargarPoemaOficial() {
    setCargandoPoema(true);

    const { data, error } = await supabaseBrowser
      .from("poemas_anuales")
      .select(
        "id, anio, titulo, subtitulo, contenido, estado, visible, fecha_presentacion"
      )
      .eq("anio", 2026)
      .eq("estado", "publicado")
      .eq("visible", true)
      .maybeSingle();

    if (error) {
      console.log("Error al cargar el poema anual público:", error);
      setCargandoPoema(false);
      return;
    }

    setPoemaOficial(data || null);
    setCargandoPoema(false);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6efe7] px-5 py-8 text-stone-950">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 8%, rgba(255,255,255,0.95), transparent 30%), radial-gradient(circle at 50% 45%, rgba(214,186,135,0.24), transparent 40%), linear-gradient(180deg, #fbf4eb 0%, #efe0cf 48%, #f8efe5 100%)",
          }}
        />

        <div className="absolute left-0 top-0 hidden h-full w-[22vw] min-w-[230px] max-w-[360px] overflow-hidden md:block">
          <video
            src="/flores.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover opacity-[0.5]"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, black 0%, black 46%, transparent 100%)",
              maskImage:
                "linear-gradient(to right, black 0%, black 46%, transparent 100%)",
            }}
          />

          <div className="absolute inset-0 bg-[#f6efe7]/25" />
        </div>

        <div className="absolute right-0 top-0 hidden h-full w-[22vw] min-w-[230px] max-w-[360px] overflow-hidden md:block">
          <video
            src="/flores.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full scale-x-[-1] object-cover opacity-[0.5]"
            style={{
              WebkitMaskImage:
                "linear-gradient(to left, black 0%, black 46%, transparent 100%)",
              maskImage:
                "linear-gradient(to left, black 0%, black 46%, transparent 100%)",
            }}
          />

          <div className="absolute inset-0 bg-[#f6efe7]/25" />
        </div>

        <div className="absolute left-1/2 top-[16%] h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-white/40 blur-3xl" />
        <div className="absolute bottom-[-220px] left-1/2 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-[#d7b982]/20 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(70,48,29,0.24) 0.55px, transparent 0.75px)",
            backgroundSize: "18px 18px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <nav className="mb-16 flex flex-wrap items-center justify-between gap-4 rounded-full border border-stone-200/80 bg-white/68 px-5 py-3 shadow-sm backdrop-blur-xl">
          <Link href="/" className="text-sm font-semibold tracking-wide">
            Poema Universal
          </Link>

          <div className="flex flex-wrap items-center gap-5 text-sm text-stone-600">
            <Link href="/cadena" className="transition hover:text-black">
              Cadena
            </Link>

            <Link href="/duelo" className="transition hover:text-black">
              Duelo
            </Link>

            <Link href="/obra" className="transition hover:text-black">
              Obra
            </Link>

            <Link
              href="/mi-habitacion"
              className="rounded-full border border-stone-300 bg-white/75 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-700 transition hover:bg-stone-950 hover:text-white"
            >
              Mi Habitación
            </Link>
          </div>
        </nav>

        <header className="mx-auto max-w-5xl text-center">
          <p className="mb-8 text-[11px] uppercase tracking-[0.55em] text-stone-400">
            Puerta anual
          </p>

          <h1 className="font-serif text-[4.2rem] font-semibold leading-[0.92] tracking-tight text-stone-950 sm:text-[7rem] md:text-[8.6rem]">
            Poema
            <br />
            Universal
            <br />
            2026
          </h1>

          <p className="mx-auto mt-8 max-w-2xl font-serif text-2xl leading-[1.45] text-stone-800 sm:text-3xl">
            El poema que el año dejó escrito en nosotros.
          </p>

          <p className="mx-auto mt-8 max-w-2xl text-sm leading-9 text-stone-600">
            Durante 2026, cada verso, cada pérdida, cada luz, cada carta y cada
            presencia formarán parte de una misma respiración. El gran Poema
            Universal de 2026 será presentado el día {fechaPresentacion}.
          </p>
        </header>

        <section className="mx-auto mt-16 max-w-4xl rounded-[42px] border border-stone-200/80 bg-white/55 p-6 shadow-[0_30px_90px_rgba(70,48,29,0.12)] backdrop-blur-md sm:p-10">
          {!montado || !tiempo ? (
            <div className="text-center">
              <p className="text-[11px] uppercase tracking-[0.45em] text-stone-400">
                Preparando la cuenta atrás
              </p>

              <p className="mx-auto mt-7 max-w-2xl text-sm leading-8 text-stone-600">
                La puerta anual está calculando el tiempo que falta para
                abrirse.
              </p>
            </div>
          ) : tiempo.terminado ? (
            <div className="text-center">
              <p className="text-[11px] uppercase tracking-[0.45em] text-stone-400">
                El poema ha sido abierto
              </p>

              <h2 className="mt-7 font-serif text-4xl font-semibold leading-tight sm:text-6xl">
                Poema Universal 2026
              </h2>

              {cargandoPoema ? (
                <p className="mx-auto mt-7 max-w-2xl text-sm leading-8 text-stone-600">
                  La casa está abriendo el poema oficial.
                </p>
              ) : poemaOficial?.contenido ? (
                <div className="mx-auto mt-10 max-w-3xl rounded-[34px] border border-stone-200 bg-[#fffaf3]/90 p-7 text-left shadow-sm sm:p-10">
                  {poemaOficial.subtitulo && (
                    <p className="mb-8 text-center font-serif text-2xl leading-[1.45] text-stone-800">
                      {poemaOficial.subtitulo}
                    </p>
                  )}

                  <div className="whitespace-pre-line font-serif text-2xl leading-[1.75] text-stone-900 sm:text-3xl">
                    {poemaOficial.contenido}
                  </div>
                </div>
              ) : (
                <p className="mx-auto mt-7 max-w-2xl text-sm leading-8 text-stone-600">
                  La fecha ha llegado, pero el poema oficial todavía no ha sido
                  publicado por la casa. Esta puerta permanece abierta,
                  esperando su voz definitiva.
                </p>
              )}
            </div>
          ) : (
            <>
              <p className="text-center text-[11px] uppercase tracking-[0.45em] text-stone-400">
                Cuenta atrás hasta la presentación
              </p>

              <div className="mt-9 grid grid-cols-2 gap-4 md:grid-cols-4">
                <NumeroCuenta valor={tiempo.dias} etiqueta="Días" />
                <NumeroCuenta valor={tiempo.horas} etiqueta="Horas" />
                <NumeroCuenta valor={tiempo.minutos} etiqueta="Minutos" />
                <NumeroCuenta valor={tiempo.segundos} etiqueta="Segundos" />
              </div>

              <p className="mx-auto mt-9 max-w-2xl text-center text-sm leading-8 text-stone-600">
                El 1 de enero de 2027 se abrirá esta puerta. Hasta entonces, el
                poema se está escribiendo en silencio, verso a verso, dentro de
                la casa.
              </p>
            </>
          )}
        </section>

        <section className="mx-auto mt-20 max-w-4xl border-y border-stone-300/70 py-14 text-center">
          <p className="font-serif text-3xl leading-[1.45] text-stone-800 sm:text-5xl">
            Un año no termina.
            <br />
            Se convierte en poema.
          </p>

          <p className="mx-auto mt-8 max-w-2xl text-sm leading-9 text-stone-600">
            Cada año, Poema Universal reunirá su gran poema anual y lo
            presentará el primer día del año siguiente. No como resumen, sino
            como memoria viva.
          </p>
        </section>

        <section className="mt-20 grid gap-6 md:grid-cols-3">
          <Link
            href="/cadena"
            className="group rounded-[34px] border border-stone-200/90 bg-white/62 p-8 shadow-[0_20px_55px_rgba(70,48,29,0.08)] backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/85"
          >
            <p className="text-xs uppercase tracking-[0.34em] text-stone-400">
              Escribir
            </p>

            <h2 className="mt-6 font-serif text-3xl">Añadir un verso</h2>

            <p className="mt-5 text-sm leading-8 text-stone-600">
              Entra en la cadena y deja una línea para el poema común.
            </p>

            <span className="mt-7 inline-flex text-[11px] uppercase tracking-[0.25em] text-stone-400 transition group-hover:text-stone-800">
              Entrar
            </span>
          </Link>

          <Link
            href="/duelo"
            className="group rounded-[34px] border border-stone-200/90 bg-white/62 p-8 shadow-[0_20px_55px_rgba(70,48,29,0.08)] backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/85"
          >
            <p className="text-xs uppercase tracking-[0.34em] text-stone-400">
              Recordar
            </p>

            <h2 className="mt-6 font-serif text-3xl">Encender una luz</h2>

            <p className="mt-5 text-sm leading-8 text-stone-600">
              Deja una vela para quien sigue viviendo en la memoria.
            </p>

            <span className="mt-7 inline-flex text-[11px] uppercase tracking-[0.25em] text-stone-400 transition group-hover:text-stone-800">
              Entrar
            </span>
          </Link>

          <Link
            href="/mi-habitacion"
            className="group rounded-[34px] bg-stone-950 p-8 text-white shadow-[0_24px_70px_rgba(0,0,0,0.22)] transition hover:-translate-y-1 hover:bg-stone-800"
          >
            <p className="text-xs uppercase tracking-[0.34em] text-stone-400">
              Guardar
            </p>

            <h2 className="mt-6 font-serif text-3xl">Mi Habitación</h2>

            <p className="mt-5 text-sm leading-8 text-stone-300">
              Escribe y conserva lo que todavía no debe ser público.
            </p>

            <span className="mt-7 inline-flex text-[11px] uppercase tracking-[0.25em] text-stone-400 transition group-hover:text-white">
              Entrar
            </span>
          </Link>
        </section>

        <footer className="mt-28 pb-10 text-center">
          <p className="text-xs uppercase tracking-[0.42em] text-stone-400">
            Poema Universal 2026
          </p>

          <p className="mx-auto mt-4 max-w-xl text-xs leading-7 text-stone-500">
            Presentación oficial · 1 de enero de 2027
          </p>
        </footer>
      </div>
    </main>
  );
}