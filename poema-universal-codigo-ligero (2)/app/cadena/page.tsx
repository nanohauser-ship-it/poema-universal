"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "../../lib/supabaseClient";

type VersoCadena = {
  id: string;
  autor: string | null;
  ciudad: string | null;
  pais: string | null;
  verso: string;
  created_at: string;
};

export default function CadenaPage() {
  const [versos, setVersos] = useState<VersoCadena[]>([]);
  const [autor, setAutor] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [pais, setPais] = useState("");
  const [verso, setVerso] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarVersos();
  }, []);

  async function cargarVersos() {
    setCargando(true);

    const { data, error } = await supabaseBrowser
      .from("poema_cadena")
      .select("id, autor, ciudad, pais, verso, created_at")
      .eq("visible", true)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      setMensaje("No se pudo cargar la cadena.");
      setCargando(false);
      return;
    }

    setVersos(data || []);
    setCargando(false);
  }

  async function guardarVerso(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const versoLimpio = verso.trim();

    if (!versoLimpio) {
      setMensaje("Escribe un verso antes de unirlo a la cadena.");
      return;
    }

    if (versoLimpio.length > 280) {
      setMensaje("El verso debe tener menos de 280 caracteres.");
      return;
    }

    setGuardando(true);
    setMensaje("");

    const { error } = await supabaseBrowser.from("poema_cadena").insert({
      autor: autor.trim() || "Anónimo",
      ciudad: ciudad.trim() || null,
      pais: pais.trim() || null,
      verso: versoLimpio,
      visible: true,
    });

    if (error) {
      console.error(error);
      setMensaje("No se pudo guardar el verso.");
      setGuardando(false);
      return;
    }

    setAutor("");
    setCiudad("");
    setPais("");
    setVerso("");
    setMensaje("Tu verso ya forma parte del Poema Universal.");

    await cargarVersos();

    setGuardando(false);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6efe7] px-5 py-8 text-stone-950">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 8%, rgba(255,255,255,0.92), transparent 30%), radial-gradient(circle at 50% 42%, rgba(214,186,135,0.22), transparent 38%), linear-gradient(180deg, #fbf4eb 0%, #efe0cf 48%, #f8efe5 100%)",
          }}
        />

        <div className="absolute left-0 top-0 hidden h-full w-[18vw] min-w-[210px] max-w-[320px] overflow-hidden md:block">
          <video
            src="/flores.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover opacity-[0.42]"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, black 0%, black 44%, transparent 100%)",
              maskImage:
                "linear-gradient(to right, black 0%, black 44%, transparent 100%)",
            }}
          />
        </div>

        <div className="absolute right-0 top-0 hidden h-full w-[18vw] min-w-[210px] max-w-[320px] overflow-hidden md:block">
          <video
            src="/flores.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full scale-x-[-1] object-cover opacity-[0.42]"
            style={{
              WebkitMaskImage:
                "linear-gradient(to left, black 0%, black 44%, transparent 100%)",
              maskImage:
                "linear-gradient(to left, black 0%, black 44%, transparent 100%)",
            }}
          />
        </div>

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

            <Link
              href="/mi-habitacion"
              className="rounded-full border border-stone-300 bg-white/75 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-700 transition hover:bg-stone-950 hover:text-white"
            >
              Mi Habitación
            </Link>
          </div>
        </nav>

        <header className="mx-auto max-w-4xl text-center">
          <p className="mb-8 text-[11px] uppercase tracking-[0.52em] text-stone-400">
            Poema colectivo
          </p>

          <h1 className="font-serif text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl">
            Cadena del
            <br />
            Poema Universal
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-sm leading-9 text-stone-600">
            Una persona escribe un verso. Otra continúa. Otra deja una línea
            desde otro lugar. Y entre todos nace un poema que no pertenece a
            nadie porque nos pertenece a todos.
          </p>

          <p className="mx-auto mt-8 max-w-2xl font-serif text-3xl leading-[1.45] text-stone-800">
            El poema no termina porque todavía falta alguien.
          </p>
        </header>

        <section className="mx-auto mt-20 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <form
            onSubmit={guardarVerso}
            className="rounded-[36px] border border-stone-200/90 bg-white/68 p-7 shadow-[0_25px_70px_rgba(70,48,29,0.1)] backdrop-blur-md"
          >
            <p className="text-xs uppercase tracking-[0.34em] text-stone-400">
              Añadir verso
            </p>

            <h2 className="mt-5 font-serif text-3xl">
              Deja una línea en la cadena
            </h2>

            <div className="mt-8 space-y-4">
              <input
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
                placeholder="Tu nombre o firma"
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
                value={verso}
                onChange={(e) => setVerso(e.target.value)}
                placeholder="Escribe aquí tu verso..."
                rows={6}
                maxLength={280}
                className="w-full resize-none rounded-3xl border border-stone-200 bg-[#fffaf3] px-5 py-4 text-sm leading-8 outline-none transition placeholder:text-stone-400 focus:border-stone-400"
              />

              <div className="flex items-center justify-between gap-4 text-xs text-stone-400">
                <span>Máximo 280 caracteres</span>
                <span>{verso.length}/280</span>
              </div>

              <button
                type="submit"
                disabled={guardando}
                className="w-full rounded-full bg-stone-950 px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-white shadow-[0_18px_45px_rgba(0,0,0,0.18)] transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {guardando ? "Uniendo verso..." : "Unir mi verso"}
              </button>

              {mensaje && (
                <p className="rounded-2xl bg-stone-100 px-5 py-4 text-center text-sm leading-7 text-stone-600">
                  {mensaje}
                </p>
              )}
            </div>
          </form>

          <section className="rounded-[36px] border border-stone-200/90 bg-[#fffaf3]/76 p-7 shadow-[0_25px_70px_rgba(70,48,29,0.1)] backdrop-blur-md">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.34em] text-stone-400">
                  Poema vivo
                </p>

                <h2 className="mt-5 font-serif text-3xl">
                  {versos.length === 1
                    ? "1 verso unido"
                    : `${versos.length} versos unidos`}
                </h2>
              </div>

              <button
                type="button"
                onClick={cargarVersos}
                className="rounded-full border border-stone-300 bg-white/70 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500 transition hover:bg-white hover:text-black"
              >
                Actualizar
              </button>
            </div>

            <div className="mt-8 max-h-[720px] space-y-5 overflow-y-auto pr-2">
              {cargando ? (
                <p className="py-16 text-center font-serif text-2xl text-stone-500">
                  Cargando la cadena...
                </p>
              ) : versos.length === 0 ? (
                <div className="rounded-[28px] border border-dashed border-stone-300 bg-white/60 p-8 text-center">
                  <p className="font-serif text-2xl text-stone-700">
                    Todavía no hay versos.
                  </p>

                  <p className="mx-auto mt-5 max-w-md text-sm leading-8 text-stone-500">
                    La cadena está esperando su primera línea.
                  </p>
                </div>
              ) : (
                versos.map((item, index) => (
                  <article
                    key={item.id}
                    className="rounded-[28px] border border-stone-200 bg-white/68 p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[10px] uppercase tracking-[0.28em] text-stone-400">
                        Verso {index + 1}
                      </span>

                      <span className="text-[10px] uppercase tracking-[0.22em] text-stone-300">
                        {new Date(item.created_at).toLocaleDateString("es-ES")}
                      </span>
                    </div>

                    <p className="mt-5 font-serif text-2xl leading-[1.45] text-stone-850">
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
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </section>

        <footer className="mt-28 pb-10 text-center">
          <p className="text-xs uppercase tracking-[0.42em] text-stone-400">
            Cadena del Poema Universal
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