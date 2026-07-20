"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type NocheGuardada = {
  id: number;
  pesa: string | null;
  agradeces: string | null;
  manana: string | null;
  created_at: string;
};

const frasesDeCierre = [
  "La noche ha recibido lo que no podías cargar.",
  "Por hoy, tu alma ya ha hecho suficiente.",
  "Lo que queda pendiente puede esperar al amanecer.",
  "Has dejado una parte del peso fuera de ti.",
  "La paz no siempre resuelve: a veces solo acompaña.",
  "Mañana volverás con otra luz.",
];

export default function NochesEnPazPage() {
  const [pesa, setPesa] = useState("");
  const [agradeces, setAgradeces] = useState("");
  const [manana, setManana] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [noches, setNoches] = useState<NocheGuardada[]>([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarNoches();
  }, []);

  async function cargarNoches() {
    const response = await fetch("/api/noches-en-paz");
    const data = await response.json();
    setNoches(data);
  }

  async function guardarNoche() {
    if (!pesa.trim() && !agradeces.trim() && !manana.trim()) {
      alert("Escribe algo antes de guardar la noche.");
      return;
    }

    try {
      setGuardando(true);
      setMensaje("");

      const response = await fetch("/api/noches-en-paz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pesa, agradeces, manana }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "No se pudo guardar.");
        return;
      }

      setPesa("");
      setAgradeces("");
      setManana("");

      await cargarNoches();

      const frase =
        frasesDeCierre[Math.floor(Math.random() * frasesDeCierre.length)];

      setMensaje(frase);
    } catch (error) {
      console.error(error);
      alert("Ha ocurrido un error.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <main
      className="relative min-h-screen overflow-hidden px-6 py-10 text-white"
      style={{
        background: "#020617",
      }}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-0 hidden w-[31vw] bg-cover bg-center opacity-80 lg:block"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(2,6,23,0.02), rgba(2,6,23,0.48)), url('/universo.jpg')",
        }}
      />

      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[31vw] bg-cover bg-center opacity-80 lg:block"
        style={{
          backgroundImage:
            "linear-gradient(to left, rgba(2,6,23,0.02), rgba(2,6,23,0.48)), url('/universo.jpg')",
        }}
      />

      <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] hidden w-[43vw] bg-gradient-to-r from-transparent via-[#020617]/45 to-[#020617] lg:block" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] hidden w-[43vw] bg-gradient-to-l from-transparent via-[#020617]/45 to-[#020617] lg:block" />

      <div className="pointer-events-none absolute inset-0 z-[2] bg-[#020617]/25" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <nav className="mb-10 mt-1 flex items-center justify-between rounded-full border border-white/10 bg-[#030712]/70 px-6 py-4 shadow-2xl backdrop-blur-md">
          <Link href="/" className="font-serif text-xl">
            Poema Universal
          </Link>

          <div className="flex gap-5 text-sm text-slate-300">
            <Link href="/" className="hover:text-white">
              Poema
            </Link>

            <Link href="/cartas" className="hover:text-white">
              Cartas
            </Link>

            <Link href="/rinconcito" className="hover:text-white">
              El Rinconcito
            </Link>

            <Link href="/noches-en-paz" className="text-white">
              Noches en Paz
            </Link>
          </div>
        </nav>

        <section className="grid gap-8 lg:grid-cols-[420px_1fr]">
          <div
            className="relative min-h-[760px] overflow-hidden rounded-[42px] border border-white/10 shadow-2xl"
            style={{
              backgroundImage:
                "linear-gradient(rgba(2,6,23,.12), rgba(2,6,23,.74)), url('/noches/luna.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />

            <div className="relative flex min-h-[760px] flex-col justify-start p-8 pt-24">
              <p className="text-xs uppercase tracking-[0.45em] text-[#e8d3a8]">
                Noches en Paz
              </p>

              <h1 className="mt-3 font-serif text-6xl leading-tight">
                Cierra el día
                <br />
                con suavidad
              </h1>

              <div className="mt-6 h-[2px] w-16 bg-[#e8d3a8]" />

              <p className="mt-24 text-lg leading-8 text-slate-200">
                La noche no exige soluciones.
                <br />
                Solo un lugar donde dejar lo que ya no puedes sostener por hoy.
              </p>

              <div className="mt-auto rounded-[30px] border border-white/10 bg-black/30 p-6 backdrop-blur-md">
                <p className="font-serif text-3xl text-[#f1ddb4]">
                  Por hoy es suficiente.
                </p>

                <p className="mt-4 leading-7 text-slate-300">
                  Respira. Suelta un poco.
                  <br />
                  Mañana seguirás desde otro lugar.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[42px] border border-white/10 bg-[#030712]/82 p-8 shadow-2xl backdrop-blur-md">
            <CampoNoche
              titulo="🌧️ ¿Qué te pesa hoy?"
              valor={pesa}
              setValor={setPesa}
              placeholder="Déjalo aquí. No tienes que resolverlo ahora..."
            />

            <CampoNoche
              titulo="🤍 ¿Qué agradeces?"
              valor={agradeces}
              setValor={setAgradeces}
              placeholder="Una cosa pequeña también cuenta..."
            />

            <CampoNoche
              titulo="🌱 ¿Qué quieres dejar para mañana?"
              valor={manana}
              setValor={setManana}
              placeholder="Una intención suave para despertar mejor..."
            />

            <button
              onClick={guardarNoche}
              disabled={guardando}
              className="mt-8 w-full rounded-full bg-[#d8bd83] px-8 py-4 font-medium text-[#111827] shadow-lg transition hover:scale-[1.02] hover:bg-[#e8d3a8] disabled:opacity-60"
            >
              {guardando ? "Guardando..." : "🕯️ Guardar la noche"}
            </button>

            {mensaje && (
              <div className="mt-6 rounded-[26px] border border-[#e8d3a8]/20 bg-[#e8d3a8]/10 px-6 py-5 text-center">
                <p className="font-serif text-2xl text-[#f1ddb4]">
                  {mensaje}
                </p>
              </div>
            )}

            <p className="mt-6 text-center italic text-slate-400">
              Descansa. Lo que queda pendiente puede esperar.
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-[38px] border border-white/10 bg-[#030712]/70 p-8 shadow-2xl backdrop-blur-md">
          <h2 className="font-serif text-3xl">Últimas noches</h2>

          <div className="mt-6 grid gap-5">
            {noches.length === 0 ? (
              <p className="text-slate-400">
                Todavía no hay noches guardadas.
              </p>
            ) : (
              noches.map((noche) => (
                <article
                  key={noche.id}
                  className="rounded-[28px] border border-white/10 bg-black/25 p-6"
                >
                  <p className="mb-5 text-xs uppercase tracking-[0.25em] text-[#e8d3a8]/70">
                    {new Date(noche.created_at).toLocaleDateString("es-ES")}
                  </p>

                  {noche.pesa && (
                    <p className="mb-4 leading-7 text-slate-300">
                      <strong className="block text-white">
                        🌧️ Me pesaba
                      </strong>
                      {noche.pesa}
                    </p>
                  )}

                  {noche.agradeces && (
                    <p className="mb-4 leading-7 text-slate-300">
                      <strong className="block text-white">🤍 Agradecí</strong>
                      {noche.agradeces}
                    </p>
                  )}

                  {noche.manana && (
                    <p className="leading-7 text-slate-300">
                      <strong className="block text-white">
                        🌱 Para mañana
                      </strong>
                      {noche.manana}
                    </p>
                  )}
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function CampoNoche({
  titulo,
  valor,
  setValor,
  placeholder,
}: {
  titulo: string;
  valor: string;
  setValor: (valor: string) => void;
  placeholder: string;
}) {
  return (
    <div className="mb-7">
      <h2 className="mb-3 text-xl">{titulo}</h2>

      <textarea
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        placeholder={placeholder}
        className="h-36 w-full resize-none rounded-[28px] border border-white/10 bg-black/45 p-5 leading-7 text-white outline-none transition placeholder:text-slate-500 focus:border-[#e8d3a8]/50 focus:bg-black/55"
      />
    </div>
  );
}