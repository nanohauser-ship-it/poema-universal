"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";

type MensajeGuardado = {
  id: number;
  mensaje: string;
  foto: string | null;
  created_at: string;
};

export default function RinconcitoPage() {
  const [mensaje, setMensaje] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [mensajes, setMensajes] = useState<MensajeGuardado[]>([]);

  useEffect(() => {
    cargarMensajes();
  }, []);

  async function cargarMensajes() {
    const response = await fetch("/api/rinconcito");
    const data = await response.json();

    if (Array.isArray(data)) {
      setMensajes(data);
    }
  }

  function subirFoto(e: ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    setFoto(archivo);
    setPreview(URL.createObjectURL(archivo));
  }

  function quitarFoto() {
    setFoto(null);
    setPreview(null);
  }

  async function guardar() {
    if (!mensaje.trim()) {
      alert("Escribe algo antes de dejarlo en el Rinconcito.");
      return;
    }

    try {
      setGuardando(true);

      const formData = new FormData();
      formData.append("mensaje", mensaje);

      if (foto) {
        formData.append("foto", foto);
      }

      const response = await fetch("/api/rinconcito", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "No se pudo guardar.");
        return;
      }

      setMensaje("");
      setFoto(null);
      setPreview(null);

      await cargarMensajes();

      alert("🕯️ Tu palabra ha quedado en el Rinconcito.");
    } catch (error) {
      console.error(error);
      alert("Ha ocurrido un error.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#c99a63] px-5 py-8 text-[#2f2118]">
      {/* FONDO DE DIBUJOS */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center opacity-100 contrast-[1.18] saturate-[1.12]"
        style={{
          backgroundImage: "url('/dibujos.png')",
        }}
      />

      {/* VELO CÁLIDO */}
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[linear-gradient(180deg,rgba(82,47,22,0.34),rgba(224,169,96,0.34),rgba(58,32,16,0.38))]" />

      {/* LUZ CENTRAL */}
      <div className="pointer-events-none fixed inset-0 z-[2] bg-[radial-gradient(circle_at_center,rgba(255,226,178,0.42),rgba(190,125,58,0.18)_55%,rgba(45,25,12,0.36)_100%)]" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <nav className="mb-8 flex items-center justify-between rounded-full border border-[#f7dcae]/50 bg-[#2f2118]/55 px-5 py-3 text-[#ffe8c6] shadow-[0_18px_50px_rgba(47,33,24,0.28)] backdrop-blur-md">
          <Link href="/" className="font-serif text-lg">
            Poema Universal
          </Link>

          <div className="flex gap-5 text-sm text-[#f7dcae]/85">
            <Link href="/" className="hover:text-white">
              Inicio
            </Link>

            <Link href="/cartas" className="hover:text-white">
              Cartas
            </Link>

            <Link href="/rinconcito" className="text-white">
              El Rinconcito
            </Link>

            <Link href="/noches-en-paz" className="hover:text-white">
              Noches en Paz
            </Link>
          </div>
        </nav>

        <section className="overflow-hidden rounded-[46px] border border-[#f7dcae]/70 bg-[#f3d8ad]/90 p-8 shadow-[0_32px_90px_rgba(47,33,24,0.32)] backdrop-blur-xl">
          <header className="mx-auto max-w-3xl text-center">
            <p className="mx-auto mb-5 inline-flex rounded-full border border-[#b9854d]/35 bg-[#fff1d4]/70 px-4 py-1.5 text-[11px] uppercase tracking-[0.34em] text-[#7b512b]">
              Poema Universal
            </p>

            <h1 className="font-serif text-6xl leading-tight text-[#2f2118]">
              El Rinconcito
            </h1>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#6f4b2d]">
              Un lugar pequeño para dejar una palabra hermosa. Puedes escribirle
              a tu niño interior y, si quieres, anexar una foto de infancia.
            </p>
          </header>

          <section className="mx-auto mt-10 grid max-w-4xl gap-8 lg:grid-cols-[280px_1fr]">
            {/* FOTO DE NIÑO */}
            <aside className="rounded-[36px] border border-[#d7aa72]/55 bg-[#fff1d4]/70 p-6 shadow-[0_22px_60px_rgba(88,52,24,0.18)]">
              <h2 className="text-center font-serif text-3xl text-[#2f2118]">
                Tu foto de niño
              </h2>

              <p className="mt-3 text-center text-sm leading-6 text-[#7b512b]">
                Opcional. Una imagen para acompañar la palabra que vas a dejar.
              </p>

              <label className="mt-6 block cursor-pointer">
                <div className="aspect-[4/5] overflow-hidden rounded-[30px] border-4 border-[#b9854d]/55 bg-[#e5bd82] shadow-[0_16px_36px_rgba(88,52,24,0.24)]">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Foto de infancia"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center p-6 text-center font-serif text-xl text-[#7b512b]">
                      Anexar fotografía
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={subirFoto}
                  className="hidden"
                />
              </label>

              {preview && (
                <button
                  onClick={quitarFoto}
                  className="mt-4 w-full rounded-full border border-[#b9854d]/50 bg-[#fff8ea]/70 px-4 py-2 text-sm text-[#7b512b] transition hover:bg-[#fff8ea]"
                >
                  Quitar foto
                </button>
              )}
            </aside>

            {/* PALABRA */}
            <section className="rounded-[36px] border border-[#d7aa72]/55 bg-[#fff1d4]/72 p-8 shadow-[0_22px_60px_rgba(88,52,24,0.18)]">
              <h2 className="text-center font-serif text-4xl text-[#2f2118]">
                Déjale una palabra hermosa
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-center leading-7 text-[#7b512b]">
                Escribe algo para esa parte de ti que necesitaba ser cuidada.
                Puede ser una frase pequeña. Puede ser una despedida. Puede ser
                una forma de volver a ti.
              </p>

              <textarea
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Querido niño, hoy quiero decirte algo que quizá necesitabas escuchar..."
                className="mt-8 h-72 w-full resize-none rounded-[30px] border border-[#b9854d]/45 bg-[#fff8ea]/90 p-7 text-lg leading-8 text-[#2f2118] shadow-inner outline-none placeholder:text-[#9b7450] focus:border-[#7b512b]"
              />

              <div className="mt-8 text-center">
                <button
                  onClick={guardar}
                  disabled={guardando}
                  className="rounded-full bg-[#2f2118] px-10 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#ffe8c6] shadow-[0_18px_40px_rgba(47,33,24,0.32)] transition hover:-translate-y-0.5 hover:bg-[#49311f] disabled:opacity-60"
                >
                  {guardando ? "Guardando..." : "🕯️ Dejar en el Rinconcito"}
                </button>

                <p className="mt-5 text-sm leading-7 text-[#7b512b]">
                  Este gesto no tiene que explicarlo todo. Solo tiene que ser
                  verdadero.
                </p>
              </div>
            </section>
          </section>

          <section className="mx-auto mt-10 max-w-4xl rounded-[34px] border border-[#d7aa72]/55 bg-[#fff1d4]/64 p-6 shadow-[0_18px_48px_rgba(88,52,24,0.14)]">
            <h3 className="font-serif text-3xl text-[#2f2118]">
              Mensajes guardados
            </h3>

            <div className="mt-6 space-y-4">
              {mensajes.length === 0 ? (
                <p className="text-[#7b512b]">Todavía no hay mensajes.</p>
              ) : (
                mensajes.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-[26px] border border-[#d5aa76]/60 bg-[#fff8ea]/78 p-5 shadow-sm"
                  >
                    <p className="whitespace-pre-wrap leading-7 text-[#2f2118]">
                      {item.mensaje}
                    </p>

                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[#9a6a3c]">
                      {new Date(item.created_at).toLocaleDateString("es-ES")}
                    </p>
                  </article>
                ))
              )}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}