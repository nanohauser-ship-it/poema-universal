"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";

type Lectura = {
  id: number;
  titulo: string | null;
  descripcion: string | null;
  video_url: string;
  created_at: string;
};

type Comentario = {
  id: number;
  lectura_id: number;
  nombre: string | null;
  comentario: string;
  created_at: string;
};

type FormularioComentario = {
  nombre: string;
  comentario: string;
};

export default function LecturasPage() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

  const [lecturas, setLecturas] = useState<Lectura[]>([]);
  const [comentarios, setComentarios] = useState<Record<number, Comentario[]>>(
    {},
  );
  const [formularios, setFormularios] = useState<
    Record<number, FormularioComentario>
  >({});

  const [subiendo, setSubiendo] = useState(false);
  const [enviandoComentario, setEnviandoComentario] = useState<number | null>(
    null,
  );
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarLecturas();

    const intervalo = window.setInterval(() => {
      cargarLecturas();
    }, 9000);

    return () => {
      window.clearInterval(intervalo);
    };
  }, []);

  async function cargarLecturas() {
    try {
      const response = await fetch("/api/lecturas");
      const data = await response.json();

      if (!Array.isArray(data)) return;

      setLecturas(data);

      const comentariosPorLectura: Record<number, Comentario[]> = {};

      await Promise.all(
        data.map(async (lectura: Lectura) => {
          const resComentarios = await fetch(
            `/api/comentarios-lecturas?lectura_id=${lectura.id}`,
          );

          const dataComentarios = await resComentarios.json();

          if (Array.isArray(dataComentarios)) {
            comentariosPorLectura[lectura.id] = dataComentarios;
          } else {
            comentariosPorLectura[lectura.id] = [];
          }
        }),
      );

      setComentarios(comentariosPorLectura);
    } catch (error) {
      console.error("Error cargando lecturas:", error);
    }
  }

  function seleccionarVideo(e: ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];

    if (!archivo) return;

    if (!archivo.type.startsWith("video/")) {
      alert("Sube un archivo de vídeo.");
      return;
    }

    setVideo(archivo);
    setPreviewVideo(URL.createObjectURL(archivo));
  }

  function quitarVideo() {
    setVideo(null);
    setPreviewVideo(null);
  }

  async function subirLectura() {
    if (!video) {
      alert("Sube un vídeo antes de guardar la lectura.");
      return;
    }

    try {
      setSubiendo(true);
      setMensaje("");

      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descripcion", descripcion);
      formData.append("video", video);

      const response = await fetch("/api/lecturas", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "No se pudo subir el vídeo.");
        return;
      }

      setTitulo("");
      setDescripcion("");
      setVideo(null);
      setPreviewVideo(null);

      await cargarLecturas();

      setMensaje("🎙️ La lectura ha quedado guardada en La Voz del Poema.");

      setTimeout(() => {
        setMensaje("");
      }, 3500);
    } catch (error) {
      console.error(error);
      alert("Ha ocurrido un error subiendo el vídeo.");
    } finally {
      setSubiendo(false);
    }
  }

  function actualizarFormularioComentario(
    lecturaId: number,
    campo: keyof FormularioComentario,
    valor: string,
  ) {
    setFormularios((actual) => ({
      ...actual,
      [lecturaId]: {
        nombre: actual[lecturaId]?.nombre || "",
        comentario: actual[lecturaId]?.comentario || "",
        [campo]: valor,
      },
    }));
  }

  async function enviarComentario(lecturaId: number) {
    const formulario = formularios[lecturaId] || {
      nombre: "",
      comentario: "",
    };

    if (!formulario.comentario.trim()) {
      alert("Escribe un comentario antes de enviarlo.");
      return;
    }

    try {
      setEnviandoComentario(lecturaId);

      const response = await fetch("/api/comentarios-lecturas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lectura_id: lecturaId,
          nombre: formulario.nombre || "Anónimo",
          comentario: formulario.comentario,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "No se pudo guardar el comentario.");
        return;
      }

      setFormularios((actual) => ({
        ...actual,
        [lecturaId]: {
          nombre: formulario.nombre,
          comentario: "",
        },
      }));

      await cargarLecturas();
    } catch (error) {
      console.error(error);
      alert("Ha ocurrido un error guardando el comentario.");
    } finally {
      setEnviandoComentario(null);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0c0b10] px-5 py-8 text-[#f8ead6]">
      {/* FONDO */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(122,88,52,0.30),transparent_38%),radial-gradient(circle_at_bottom,rgba(65,50,91,0.32),transparent_42%),linear-gradient(180deg,rgba(12,11,16,0.98),rgba(24,17,22,1))]" />

      {/* LUZ CENTRAL */}
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(255,214,153,0.11),transparent_48%)]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <nav className="mb-8 flex items-center justify-between rounded-full border border-[#e8c993]/20 bg-[#161118]/72 px-5 py-3 text-[#f8ead6] shadow-[0_18px_50px_rgba(0,0,0,0.34)] backdrop-blur-md">
          <Link href="/" className="font-serif text-lg">
            Poema Universal
          </Link>

          <div className="flex gap-5 text-sm text-[#e4c49b]/80">
            <Link href="/" className="hover:text-white">
              Inicio
            </Link>

            <Link href="/cartas" className="hover:text-white">
              Cartas
            </Link>

            <Link href="/rinconcito" className="hover:text-white">
              El Rinconcito
            </Link>

            <Link href="/noches-en-paz" className="hover:text-white">
              Noches en Paz
            </Link>

            <Link href="/retratos" className="hover:text-white">
              Mascotas
            </Link>

            <Link href="/duelo" className="hover:text-white">
              Duelo
            </Link>

            <Link href="/lecturas" className="text-white">
              La Voz
            </Link>
          </div>
        </nav>

        <header className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mx-auto mb-5 inline-flex rounded-full border border-[#e8c993]/30 bg-[#1e1720]/70 px-4 py-1.5 text-[11px] uppercase tracking-[0.34em] text-[#d8b27f]">
            Archivo sonoro del poema
          </p>

          <h1 className="font-serif text-6xl leading-tight text-[#fff3df]">
            La Voz del Poema
          </h1>

          <p className="mx-auto mt-5 max-w-2xl font-serif text-2xl leading-10 text-[#f2d8b5]">
            Hay poemas que no solo se leen.
            <br />
            Se escuchan en una voz humana.
          </p>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#c8a77f]">
            Un espacio para subir vídeos leyendo los mejores poemas de Poema
            Universal y dejar comentarios vivos debajo de cada lectura.
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-[42px] border border-[#e8c993]/20 bg-[#171118]/84 p-8 shadow-[0_28px_80px_rgba(0,0,0,0.35)] backdrop-blur-md">
            <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full border border-[#e8c993]/24 bg-[#241a20] text-5xl shadow-[0_0_70px_rgba(236,188,112,0.18)]">
              🎙️
            </div>

            <p className="text-[11px] uppercase tracking-[0.34em] text-[#d8b27f]">
              Nueva lectura
            </p>

            <h2 className="mt-3 font-serif text-4xl text-[#fff3df]">
              Subir vídeo
            </h2>

            <p className="mt-5 leading-8 text-[#c8a77f]">
              Graba un poema con tu móvil o cámara, súbelo aquí y quedará dentro
              del archivo de voces.
            </p>

            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título del poema..."
              className="mt-7 w-full rounded-[24px] border border-[#e8c993]/22 bg-[#0f0b10]/72 px-5 py-4 text-[#fff3df] outline-none placeholder:text-[#8f7050] focus:border-[#e8c993]/60"
            />

            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción breve de la lectura..."
              className="mt-4 h-32 w-full resize-none rounded-[24px] border border-[#e8c993]/22 bg-[#0f0b10]/72 p-5 leading-7 text-[#fff3df] outline-none placeholder:text-[#8f7050] focus:border-[#e8c993]/60"
            />

            <label className="mt-6 block cursor-pointer rounded-[30px] border border-dashed border-[#e8c993]/34 bg-[#0f0b10]/64 p-6 text-center transition hover:bg-[#19121a]">
              <span className="font-serif text-2xl text-[#f2d8b5]">
                {video ? "Cambiar vídeo" : "Seleccionar vídeo"}
              </span>

              <p className="mt-2 text-sm leading-6 text-[#a88a68]">
                Mejor empezar con vídeos cortos en formato MP4.
              </p>

              <input
                type="file"
                accept="video/*"
                onChange={seleccionarVideo}
                className="hidden"
              />
            </label>

            {previewVideo && (
              <div className="mt-6 overflow-hidden rounded-[28px] border border-[#e8c993]/20 bg-black shadow-[0_18px_45px_rgba(0,0,0,0.32)]">
                <video src={previewVideo} controls className="h-auto w-full" />
              </div>
            )}

            {previewVideo && (
              <button
                onClick={quitarVideo}
                className="mt-4 w-full rounded-full border border-[#e8c993]/25 bg-[#211720]/70 px-5 py-3 text-sm text-[#f2d8b5] transition hover:bg-[#2a1d28]"
              >
                Quitar vídeo
              </button>
            )}

            <button
              onClick={subirLectura}
              disabled={subiendo}
              className="mt-6 w-full rounded-full bg-[#e3b56f] px-8 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#160e09] shadow-[0_18px_45px_rgba(227,181,111,0.18)] transition hover:-translate-y-0.5 hover:bg-[#f0c98f] disabled:opacity-60"
            >
              {subiendo ? "Subiendo vídeo..." : "Guardar lectura"}
            </button>

            {mensaje && (
              <div className="mt-6 rounded-[26px] border border-[#e8c993]/22 bg-[#0f0b10]/65 px-6 py-5 text-center text-[#f2d8b5]">
                {mensaje}
              </div>
            )}
          </aside>

          <section className="rounded-[42px] border border-[#e8c993]/20 bg-[#171118]/84 p-8 shadow-[0_28px_80px_rgba(0,0,0,0.35)] backdrop-blur-md">
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#d8b27f]">
              Sala viva
            </p>

            <h2 className="mt-3 font-serif text-4xl text-[#fff3df]">
              Lecturas guardadas
            </h2>

            <p className="mt-5 leading-8 text-[#c8a77f]">
              Aquí aparecerán los vídeos leídos en voz alta. Los comentarios se
              actualizan automáticamente cada pocos segundos.
            </p>

            <div className="mt-8 rounded-[32px] border border-[#e8c993]/18 bg-[#0f0b10]/66 p-6">
              <p className="font-serif text-2xl leading-9 text-[#f2d8b5]">
                “Una voz puede convertir un poema en presencia.”
              </p>
            </div>
          </section>
        </section>

        <section className="mt-10 rounded-[42px] border border-[#e8c993]/20 bg-[#171118]/84 p-8 shadow-[0_28px_80px_rgba(0,0,0,0.35)] backdrop-blur-md">
          <h2 className="font-serif text-4xl text-[#fff3df]">
            Archivo de voces
          </h2>

          <p className="mt-3 leading-7 text-[#c8a77f]">
            Cada lectura queda guardada como una pequeña sala donde otros pueden
            escuchar y responder.
          </p>

          <div className="mt-8 grid gap-8">
            {lecturas.length === 0 ? (
              <p className="rounded-[28px] border border-[#e8c993]/18 bg-[#0f0b10]/66 p-6 text-[#c8a77f]">
                Todavía no hay lecturas guardadas.
              </p>
            ) : (
              lecturas.map((lectura) => {
                const comentariosLectura = comentarios[lectura.id] || [];
                const formulario = formularios[lectura.id] || {
                  nombre: "",
                  comentario: "",
                };

                return (
                  <article
                    key={lectura.id}
                    className="overflow-hidden rounded-[36px] border border-[#e8c993]/20 bg-[#0f0b10]/72 shadow-[0_22px_70px_rgba(0,0,0,0.28)]"
                  >
                    <div className="bg-black">
                      <video
                        src={lectura.video_url}
                        controls
                        className="max-h-[620px] w-full bg-black"
                      />
                    </div>

                    <div className="p-7">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.28em] text-[#9f7a50]">
                            Lectura
                          </p>

                          <h3 className="mt-2 font-serif text-4xl text-[#fff3df]">
                            {lectura.titulo || "Lectura sin título"}
                          </h3>
                        </div>

                        <p className="text-xs uppercase tracking-[0.22em] text-[#9f7a50]">
                          {new Date(lectura.created_at).toLocaleDateString(
                            "es-ES",
                          )}
                        </p>
                      </div>

                      {lectura.descripcion && (
                        <p className="mt-5 whitespace-pre-wrap leading-8 text-[#c8a77f]">
                          {lectura.descripcion}
                        </p>
                      )}

                      <div className="mt-8 rounded-[30px] border border-[#e8c993]/16 bg-[#171118]/76 p-6">
                        <div className="mb-5 flex items-end justify-between gap-4">
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.28em] text-[#9f7a50]">
                              Comentarios
                            </p>

                            <h4 className="mt-2 font-serif text-2xl text-[#f2d8b5]">
                              La gente responde
                            </h4>
                          </div>

                          <p className="text-xs text-[#9f7a50]">
                            {comentariosLectura.length} mensajes
                          </p>
                        </div>

                        <div className="space-y-4">
                          {comentariosLectura.length === 0 ? (
                            <p className="rounded-[22px] border border-[#e8c993]/12 bg-[#0f0b10]/66 p-4 text-sm leading-7 text-[#a88a68]">
                              Todavía no hay comentarios en esta lectura.
                            </p>
                          ) : (
                            comentariosLectura.map((comentario) => (
                              <div
                                key={comentario.id}
                                className="rounded-[22px] border border-[#e8c993]/12 bg-[#0f0b10]/66 p-4"
                              >
                                <div className="mb-2 flex items-center justify-between gap-4">
                                  <p className="font-serif text-xl text-[#f2d8b5]">
                                    {comentario.nombre || "Anónimo"}
                                  </p>

                                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a6848]">
                                    {new Date(
                                      comentario.created_at,
                                    ).toLocaleTimeString("es-ES", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>

                                <p className="whitespace-pre-wrap leading-7 text-[#d8c09b]">
                                  {comentario.comentario}
                                </p>
                              </div>
                            ))
                          )}
                        </div>

                        <div className="mt-6 grid gap-3 sm:grid-cols-[0.35fr_0.65fr]">
                          <input
                            value={formulario.nombre}
                            onChange={(e) =>
                              actualizarFormularioComentario(
                                lectura.id,
                                "nombre",
                                e.target.value,
                              )
                            }
                            placeholder="Tu nombre..."
                            className="rounded-[20px] border border-[#e8c993]/18 bg-[#0f0b10]/72 px-4 py-3 text-[#fff3df] outline-none placeholder:text-[#8f7050] focus:border-[#e8c993]/60"
                          />

                          <input
                            value={formulario.comentario}
                            onChange={(e) =>
                              actualizarFormularioComentario(
                                lectura.id,
                                "comentario",
                                e.target.value,
                              )
                            }
                            placeholder="Escribe un comentario..."
                            className="rounded-[20px] border border-[#e8c993]/18 bg-[#0f0b10]/72 px-4 py-3 text-[#fff3df] outline-none placeholder:text-[#8f7050] focus:border-[#e8c993]/60"
                          />
                        </div>

                        <button
                          onClick={() => enviarComentario(lectura.id)}
                          disabled={enviandoComentario === lectura.id}
                          className="mt-4 rounded-full bg-[#e3b56f] px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#160e09] transition hover:bg-[#f0c98f] disabled:opacity-60"
                        >
                          {enviandoComentario === lectura.id
                            ? "Enviando..."
                            : "Comentar"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>
      </div>
    </main>
  );
}