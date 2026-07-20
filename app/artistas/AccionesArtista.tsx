"use client";

import { FormEvent, useState } from "react";

type AccionesArtistaProps = {
  artistaId: string;
  corazonesIniciales: number;
  velasIniciales: number;
};

export default function AccionesArtista({
  artistaId,
  corazonesIniciales,
  velasIniciales,
}: AccionesArtistaProps) {
  const [corazones, setCorazones] = useState(corazonesIniciales);
  const [velas, setVelas] = useState(velasIniciales);
  const [cargando, setCargando] = useState<"corazon" | "vela" | null>(null);

  const [autor, setAutor] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviandoMensaje, setEnviandoMensaje] = useState(false);
  const [respuestaMensaje, setRespuestaMensaje] = useState("");

  async function enviarTributo(tipo: "corazon" | "vela") {
    try {
      setCargando(tipo);

      const res = await fetch("/api/artistas/tributos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          artista_id: artistaId,
          tipo,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo guardar el tributo.");
      }

      setCorazones(data.corazones || 0);
      setVelas(data.velas || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(null);
    }
  }

  async function enviarDedicatoria(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setEnviandoMensaje(true);
      setRespuestaMensaje("");

      const res = await fetch("/api/artistas/mensajes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          artista_id: artistaId,
          autor,
          mensaje,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setRespuestaMensaje(data.error || "No se pudo enviar la dedicatoria.");
        return;
      }

      setAutor("");
      setMensaje("");
      setRespuestaMensaje(
        "Dedicatoria enviada. Quedará pendiente de aprobación."
      );
    } catch (error) {
      console.error(error);
      setRespuestaMensaje("No se pudo enviar la dedicatoria.");
    } finally {
      setEnviandoMensaje(false);
    }
  }

  return (
    <div className="mt-6 rounded-[26px] border border-stone-200 bg-[#f8f5ef]/80 p-4">
      <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-stone-400">
        Dejar una señal
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => enviarTributo("corazon")}
          disabled={cargando !== null}
          className="rounded-full border border-stone-200 bg-white/80 px-4 py-3 text-sm text-stone-700 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-400 hover:bg-white disabled:opacity-60"
        >
          <span className="flex items-center justify-center gap-2">
            <span className="text-base">♡</span>
            <span>
              {cargando === "corazon"
                ? "Enviando..."
                : `Corazón · ${corazones}`}
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => enviarTributo("vela")}
          disabled={cargando !== null}
          className="rounded-full border border-stone-200 bg-white/80 px-4 py-3 text-sm text-stone-700 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-400 hover:bg-white disabled:opacity-60"
        >
          <span className="flex items-center justify-center gap-2">
            <span className="text-base">🕯</span>
            <span>
              {cargando === "vela" ? "Encendiendo..." : `Vela · ${velas}`}
            </span>
          </span>
        </button>
      </div>

      <p className="mt-3 text-xs italic leading-6 text-stone-500">
        Una forma pequeña de agradecer a quien dejó luz en el mundo.
      </p>

      <div className="my-5 h-px w-full bg-stone-200" />

      <form onSubmit={enviarDedicatoria} className="space-y-3">
        <div>
          <label className="mb-1 block text-[10px] uppercase tracking-[0.24em] text-stone-400">
            Tu nombre
          </label>

          <input
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            placeholder="Anónimo"
            className="w-full rounded-2xl border border-stone-200 bg-white/80 px-4 py-3 text-sm text-stone-700 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-[10px] uppercase tracking-[0.24em] text-stone-400">
            Dedicatoria
          </label>

          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            maxLength={500}
            placeholder="Gracias por enseñarme que la belleza también podía doler..."
            className="min-h-28 w-full resize-none rounded-2xl border border-stone-200 bg-white/80 px-4 py-3 text-sm leading-7 text-stone-700 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] text-stone-400">
            {mensaje.length}/500 caracteres
          </p>

          <button
            type="submit"
            disabled={enviandoMensaje || !mensaje.trim()}
            className="rounded-full bg-stone-950 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {enviandoMensaje ? "Enviando..." : "Enviar"}
          </button>
        </div>

        {respuestaMensaje && (
          <p className="rounded-2xl border border-stone-200 bg-white/70 px-4 py-3 text-xs italic leading-6 text-stone-600">
            {respuestaMensaje}
          </p>
        )}
      </form>
    </div>
  );
}