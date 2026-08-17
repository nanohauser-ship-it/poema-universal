"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "../../lib/supabaseClient";

type VelaPublica = {
  id: string;
  nombre: string | null;
  para_quien: string;
  mensaje: string | null;
  ciudad: string | null;
  pais: string | null;
  created_at: string;
};

type PosicionCampo = {
  left: string;
  top: string;
  scale: number;
  delay: string;
  opacity: number;
};

const flores = ["✿", "❀", "✾", "✽", "❁", "✣", "✤"];

function numeroDesdeTexto(texto: string) {
  let total = 0;

  for (let i = 0; i < texto.length; i++) {
    total += texto.charCodeAt(i) * (i + 1);
  }

  return total;
}

function ruido(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function posicionVela(id: string, index: number): PosicionCampo {
  const semilla = numeroDesdeTexto(id) + index * 173;

  const left = 9 + ruido(semilla * 1.3) * 82;
  const top = 18 + ruido(semilla * 2.1) * 68;
  const scale = 0.62 + ruido(semilla * 3.7) * 0.42;
  const delay = `${ruido(semilla * 4.9) * 1.4}s`;
  const opacity = 0.88 + ruido(semilla * 5.5) * 0.12;

  return {
    left: `${left}%`,
    top: `${top}%`,
    scale,
    delay,
    opacity,
  };
}

function posicionFlor(index: number): PosicionCampo {
  const semilla = index * 91 + 17;

  const left = 3 + ruido(semilla * 1.7) * 94;
  const top = 12 + ruido(semilla * 2.9) * 82;
  const scale = 0.45 + ruido(semilla * 3.4) * 0.78;
  const delay = `${ruido(semilla * 5.1) * 1.8}s`;
  const opacity = 0.14 + ruido(semilla * 6.7) * 0.22;

  return {
    left: `${left}%`,
    top: `${top}%`,
    scale,
    delay,
    opacity,
  };
}

function fechaBonita(fecha: string) {
  const date = new Date(fecha);

  if (Number.isNaN(date.getTime())) {
    return "Sin fecha";
  }

  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function DueloPage() {
  const [velas, setVelas] = useState<VelaPublica[]>([]);
  const [velaActiva, setVelaActiva] = useState<VelaPublica | null>(null);

  const [nombre, setNombre] = useState("");
  const [paraQuien, setParaQuien] = useState("");
  const [mensajeVela, setMensajeVela] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [pais, setPais] = useState("");

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
    cargarVelas();
  }, []);

  async function cargarVelas() {
    setCargando(true);
    setMensaje("");

    const { data, error } = await supabaseBrowser
      .from("velas_publicas")
      .select("id, nombre, para_quien, mensaje, ciudad, pais, created_at")
      .eq("visible", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Error Supabase al cargar velas:", error);
      setMensaje(
        "No se pudieron cargar las velas. Revisa la tabla velas_publicas en Supabase."
      );
      setCargando(false);
      return;
    }

    setVelas(data || []);
    setCargando(false);
  }

  async function encenderVela(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const paraQuienLimpio = paraQuien.trim();
    const mensajeLimpio = mensajeVela.trim();

    if (!paraQuienLimpio) {
      setMensaje("Escribe para quién quieres encender la vela.");
      return;
    }

    if (mensajeLimpio.length > 360) {
      setMensaje("El mensaje debe tener menos de 360 caracteres.");
      return;
    }

    setGuardando(true);
    setMensaje("");

    const { error } = await supabaseBrowser.from("velas_publicas").insert({
      nombre: nombre.trim() || "Anónimo",
      para_quien: paraQuienLimpio,
      mensaje: mensajeLimpio || null,
      ciudad: ciudad.trim() || null,
      pais: pais.trim() || null,
      visible: true,
    });

    if (error) {
      console.log("Error Supabase al encender vela:", error);
      setMensaje(
        "No se pudo encender la vela. Revisa la tabla velas_publicas en Supabase."
      );
      setGuardando(false);
      return;
    }

    setNombre("");
    setParaQuien("");
    setMensajeVela("");
    setCiudad("");
    setPais("");
    setMensaje("La vela ha quedado encendida en el campo.");

    await cargarVelas();

    setGuardando(false);
  }

  const ultimasVelas = useMemo(() => velas.slice(0, 6), [velas]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6efe7] px-5 py-8 text-stone-950">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 8%, rgba(255,255,255,0.92), transparent 30%), radial-gradient(circle at 50% 46%, rgba(214,186,135,0.22), transparent 42%), linear-gradient(180deg, #fbf4eb 0%, #efe0cf 48%, #f8efe5 100%)",
          }}
        />

        <div className="absolute left-0 top-0 hidden h-full w-[19vw] min-w-[220px] max-w-[340px] overflow-hidden md:block">
          <video
            src="/flores.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover opacity-[0.34]"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, black 0%, black 42%, transparent 100%)",
              maskImage:
                "linear-gradient(to right, black 0%, black 42%, transparent 100%)",
            }}
          />
        </div>

        <div className="absolute right-0 top-0 hidden h-full w-[19vw] min-w-[220px] max-w-[340px] overflow-hidden md:block">
          <video
            src="/flores.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full scale-x-[-1] object-cover opacity-[0.34]"
            style={{
              WebkitMaskImage:
                "linear-gradient(to left, black 0%, black 42%, transparent 100%)",
              maskImage:
                "linear-gradient(to left, black 0%, black 42%, transparent 100%)",
            }}
          />
        </div>

        <div className="absolute left-1/2 top-[18%] h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-white/42 blur-3xl" />
        <div className="absolute bottom-[-180px] left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[#d7b982]/18 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(70,48,29,0.24) 0.55px, transparent 0.75px)",
            backgroundSize: "18px 18px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <nav className="mb-20 flex flex-wrap items-center justify-between gap-4 rounded-full border border-stone-200/80 bg-white/68 px-5 py-3 shadow-sm backdrop-blur-xl">
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

            <Link
              href="/mi-habitacion"
              className="rounded-full border border-stone-300 bg-white/75 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-700 transition hover:bg-stone-950 hover:text-white"
            >
              Mi Habitación
            </Link>
          </div>
        </nav>

        <header className="mx-auto max-w-5xl text-center">
          <p className="mb-8 text-[11px] uppercase tracking-[0.52em] text-stone-400">
            Sala de duelo
          </p>

          <h1 className="font-serif text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl">
            Campo de velas
            <br />
            y flores
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-sm leading-9 text-stone-600">
            Una pradera pública para encender una luz por quienes ya no están,
            por quienes siguen viviendo dentro de nosotros y por todo aquello que
            no queremos dejar caer en el olvido.
          </p>

          <p className="mx-auto mt-8 max-w-2xl font-serif text-3xl leading-[1.45] text-stone-800">
            Cada ausencia deja una luz. Cada luz encuentra una flor.
          </p>

          <div className="mt-10 flex justify-center">
            <a
              href="#encender-vela"
              className="rounded-full bg-stone-950 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-white shadow-[0_18px_45px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-stone-800"
            >
              Encender una vela
            </a>
          </div>
        </header>

        <section className="mt-20 overflow-hidden rounded-[46px] border border-stone-200/80 bg-[#fff8ee]/78 shadow-[0_35px_100px_rgba(70,48,29,0.14)] backdrop-blur-md">
          <div className="flex flex-wrap items-end justify-between gap-5 border-b border-stone-200/80 px-7 py-7">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-stone-400">
                Pradera de memoria
              </p>

              <h2 className="mt-4 font-serif text-4xl">
                {velas.length === 1
                  ? "1 luz encendida"
                  : `${velas.length} luces encendidas`}
              </h2>
            </div>

            <button
              type="button"
              onClick={cargarVelas}
              className="rounded-full border border-stone-300 bg-white/75 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500 transition hover:bg-white hover:text-black"
            >
              Actualizar campo
            </button>
          </div>

          <div className="relative min-h-[660px] overflow-hidden bg-gradient-to-b from-[#fffaf2]/70 via-[#f3dfbf]/45 to-[#c7a96d]/34">
            <div className="absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-[#8f7a47]/24 via-[#b99a5c]/16 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-[22%] bg-[radial-gradient(circle_at_50%_100%,rgba(84,68,37,0.18),transparent_62%)]" />
            <div className="absolute left-1/2 top-[52%] h-[520px] w-[960px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/22 blur-3xl" />

            {montado &&
              Array.from({ length: 54 }).map((_, index) => {
                const posicion = posicionFlor(index);
                const flor = flores[index % flores.length];

                return (
                  <span
                    key={`flor-${index}`}
                    className="absolute select-none font-serif text-2xl text-[#7f673b]"
                    style={{
                      left: posicion.left,
                      top: posicion.top,
                      opacity: posicion.opacity,
                      transform: `translate(-50%, -50%) scale(${
                        posicion.scale
                      }) rotate(${ruido(index * 5.2) * 50 - 25}deg)`,
                    }}
                  >
                    {flor}
                  </span>
                );
              })}

            {montado &&
              Array.from({ length: 34 }).map((_, index) => {
                const left = 2 + ruido(index * 81.1) * 96;
                const height = 26 + ruido(index * 19.4) * 92;
                const opacity = 0.08 + ruido(index * 12.6) * 0.16;

                return (
                  <span
                    key={`hierba-${index}`}
                    className="absolute bottom-0 w-px origin-bottom rounded-full bg-[#6f6038]"
                    style={{
                      left: `${left}%`,
                      height: `${height}px`,
                      opacity,
                      transform: `rotate(${ruido(index * 8.1) * 30 - 15}deg)`,
                    }}
                  />
                );
              })}

            {cargando ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="font-serif text-3xl text-stone-500">
                  Encendiendo la pradera...
                </p>
              </div>
            ) : velas.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                <div className="max-w-md rounded-[34px] border border-dashed border-stone-300 bg-white/58 p-8 shadow-sm">
                  <p className="font-serif text-3xl text-stone-700">
                    Todavía no hay velas.
                  </p>

                  <p className="mt-5 text-sm leading-8 text-stone-500">
                    El campo espera su primera luz.
                  </p>
                </div>
              </div>
            ) : !montado ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="font-serif text-3xl text-stone-500">
                  Preparando el campo...
                </p>
              </div>
            ) : (
              velas.map((vela, index) => {
                const posicion = posicionVela(vela.id, index);
                const activa = velaActiva?.id === vela.id;

                return (
                  <button
                    key={vela.id}
                    type="button"
                    onClick={() => setVelaActiva(vela)}
                    className="absolute flex flex-col items-center outline-none transition duration-300 hover:z-20 hover:scale-110"
                    style={{
                      left: posicion.left,
                      top: posicion.top,
                      opacity: posicion.opacity,
                      transform: `translate(-50%, -50%) scale(${posicion.scale})`,
                    }}
                    aria-label={`Vela para ${vela.para_quien}`}
                  >
                    <span
                      className={`relative mb-[-1px] h-7 w-4 rounded-full blur-[0.4px] ${
                        activa ? "bg-[#ffbd45]" : "bg-[#efb14b]"
                      } animate-pulse`}
                      style={{ animationDelay: posicion.delay }}
                    >
                      <span className="absolute left-1/2 top-1/2 h-5 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fff2ba]" />
                      <span className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f4ba53]/18 blur-xl" />
                    </span>

                    <span className="relative flex h-11 w-7 items-end justify-center rounded-b-full rounded-t-md bg-[#f5dfad] shadow-[0_12px_24px_rgba(92,64,27,0.22)]">
                      <span className="absolute bottom-1.5 h-7 w-4 rounded-t-full bg-white/42" />
                      <span className="absolute bottom-0 h-2 w-6 rounded-full bg-[#b98b45]/24" />
                    </span>

                    <span className="mt-2 max-w-[78px] truncate rounded-full bg-white/46 px-2.5 py-1 text-[9px] text-stone-600 shadow-sm backdrop-blur-sm">
                      {vela.para_quien}
                    </span>
                  </button>
                );
              })
            )}

            {velaActiva && (
              <article className="absolute bottom-6 left-1/2 z-30 w-[calc(100%-3rem)] max-w-xl -translate-x-1/2 rounded-[32px] border border-stone-200 bg-white/90 p-6 shadow-[0_28px_80px_rgba(70,48,29,0.22)] backdrop-blur-xl">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400">
                      Vela encendida para
                    </p>

                    <h3 className="mt-3 font-serif text-3xl text-stone-900">
                      {velaActiva.para_quien}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setVelaActiva(null)}
                    className="rounded-full border border-stone-200 bg-white px-4 py-2 text-xs text-stone-500 transition hover:bg-stone-950 hover:text-white"
                  >
                    Cerrar
                  </button>
                </div>

                {velaActiva.mensaje && (
                  <p className="mt-6 font-serif text-2xl leading-[1.45] text-stone-800">
                    “{velaActiva.mensaje}”
                  </p>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                  <span>{velaActiva.nombre || "Anónimo"}</span>

                  {(velaActiva.ciudad || velaActiva.pais) && (
                    <>
                      <span>·</span>
                      <span>
                        {[velaActiva.ciudad, velaActiva.pais]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </>
                  )}

                  <span>·</span>
                  <span>{fechaBonita(velaActiva.created_at)}</span>
                </div>
              </article>
            )}
          </div>
        </section>

        <section
          id="encender-vela"
          className="mx-auto mt-20 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]"
        >
          <form
            onSubmit={encenderVela}
            className="rounded-[36px] border border-stone-200/90 bg-white/68 p-7 shadow-[0_25px_70px_rgba(70,48,29,0.1)] backdrop-blur-md"
          >
            <p className="text-xs uppercase tracking-[0.34em] text-stone-400">
              Encender una luz
            </p>

            <h2 className="mt-5 font-serif text-3xl">
              Añadir una vela al campo
            </h2>

            <div className="mt-8 space-y-4">
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre o firma"
                className="w-full rounded-2xl border border-stone-200 bg-[#fffaf3] px-5 py-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-stone-400"
              />

              <input
                value={paraQuien}
                onChange={(e) => setParaQuien(e.target.value)}
                placeholder="Para quién es esta vela"
                className="w-full rounded-2xl border border-stone-200 bg-[#fffaf3] px-5 py-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-stone-400"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  placeholder="Ciudad opcional"
                  className="w-full rounded-2xl border border-stone-200 bg-[#fffaf3] px-5 py-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-stone-400"
                />

                <input
                  value={pais}
                  onChange={(e) => setPais(e.target.value)}
                  placeholder="País opcional"
                  className="w-full rounded-2xl border border-stone-200 bg-[#fffaf3] px-5 py-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-stone-400"
                />
              </div>

              <textarea
                value={mensajeVela}
                onChange={(e) => setMensajeVela(e.target.value)}
                placeholder="Escribe una frase, una despedida o un recuerdo..."
                rows={6}
                maxLength={360}
                className="w-full resize-none rounded-3xl border border-stone-200 bg-[#fffaf3] px-5 py-4 text-sm leading-8 outline-none transition placeholder:text-stone-400 focus:border-stone-400"
              />

              <div className="flex items-center justify-between gap-4 text-xs text-stone-400">
                <span>Máximo 360 caracteres</span>
                <span>{mensajeVela.length}/360</span>
              </div>

              <button
                type="submit"
                disabled={guardando}
                className="w-full rounded-full bg-stone-950 px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-white shadow-[0_18px_45px_rgba(0,0,0,0.18)] transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {guardando ? "Encendiendo..." : "Encender vela"}
              </button>

              {mensaje && (
                <p className="rounded-2xl bg-stone-100 px-5 py-4 text-center text-sm leading-7 text-stone-600">
                  {mensaje}
                </p>
              )}
            </div>
          </form>

          <section className="rounded-[36px] border border-stone-200/90 bg-[#fffaf3]/76 p-7 shadow-[0_25px_70px_rgba(70,48,29,0.1)] backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.34em] text-stone-400">
              Últimas luces
            </p>

            <h2 className="mt-5 font-serif text-3xl">
              Las velas recién encendidas
            </h2>

            <div className="mt-8 space-y-5">
              {ultimasVelas.length === 0 ? (
                <div className="rounded-[28px] border border-dashed border-stone-300 bg-white/60 p-8 text-center">
                  <p className="font-serif text-2xl text-stone-700">
                    Todavía no hay luces recientes.
                  </p>

                  <p className="mx-auto mt-5 max-w-md text-sm leading-8 text-stone-500">
                    Cuando alguien encienda una vela, aparecerá aquí.
                  </p>
                </div>
              ) : (
                ultimasVelas.map((vela) => (
                  <button
                    key={vela.id}
                    type="button"
                    onClick={() => setVelaActiva(vela)}
                    className="w-full rounded-[28px] border border-stone-200 bg-white/70 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:bg-white"
                  >
                    <p className="text-[10px] uppercase tracking-[0.28em] text-stone-400">
                      Para {vela.para_quien}
                    </p>

                    {vela.mensaje && (
                      <p className="mt-4 line-clamp-3 font-serif text-2xl leading-[1.45] text-stone-800">
                        “{vela.mensaje}”
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-stone-500">
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
                  </button>
                ))
              )}
            </div>
          </section>
        </section>

        <section className="mx-auto mt-24 max-w-4xl border-y border-stone-300/70 py-16 text-center">
          <p className="font-serif text-3xl leading-[1.45] text-stone-800 sm:text-5xl">
            Una vela no devuelve a nadie,
            <br />
            pero impide que la noche lo ocupe todo.
          </p>

          <p className="mx-auto mt-9 max-w-2xl text-sm leading-9 text-stone-600">
            Este campo no busca cerrar el duelo. Solo ofrece un lugar donde la
            memoria pueda respirar sin esconderse.
          </p>
        </section>

        <footer className="mt-28 pb-10 text-center">
          <p className="text-xs uppercase tracking-[0.42em] text-stone-400">
            Poema Universal · Campo de velas y flores
          </p>

          <Link
            href="/admin"
            className="mt-6 inline-flex text-[10px] uppercase tracking-[0.32em] text-stone-400 transition hover:text-stone-700"
          >
            Administración
          </Link>
        </footer>
      </div>
    </main>
  );
}