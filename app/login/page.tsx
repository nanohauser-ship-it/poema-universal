"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabaseBrowser } from "../../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [modo, setModo] = useState<"login" | "registro">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  async function entrar() {
    const emailLimpio = email.trim();

    if (!emailLimpio || !password) {
      setMensaje("Escribe tu email y tu contraseña.");
      return;
    }

    if (password.length < 6) {
      setMensaje("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);
    setMensaje("");

    try {
      if (modo === "registro") {
        const { error } = await supabaseBrowser.auth.signUp({
          email: emailLimpio,
          password,
        });

        if (error) {
          setMensaje(error.message);
          return;
        }

        setMensaje(
          "Cuenta creada. Si Supabase pide confirmación, revisa tu email antes de entrar."
        );
        return;
      }

      const { error } = await supabaseBrowser.auth.signInWithPassword({
        email: emailLimpio,
        password,
      });

      if (error) {
        setMensaje(error.message);
        return;
      }

      router.push("/mi-habitacion");
      router.refresh();
    } catch {
      setMensaje("No se pudo conectar con Supabase.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6efe7] px-5 py-8 text-stone-950">
      <style>
        {`
          @keyframes authBreath {
            0% { transform: translate3d(0, 0, 0) scale(1); opacity: .26; }
            50% { transform: translate3d(12px, -14px, 0) scale(1.03); opacity: .44; }
            100% { transform: translate3d(0, 0, 0) scale(1); opacity: .26; }
          }

          @keyframes smallPulse {
            0% { opacity: .12; }
            50% { opacity: .24; }
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
          style={{ animation: "authBreath 20s ease-in-out infinite" }}
        />

        <div
          className="absolute right-[-260px] bottom-[2%] h-[740px] w-[740px] rounded-full bg-white/48 blur-3xl"
          style={{ animation: "authBreath 24s ease-in-out infinite reverse" }}
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

      <div className="relative z-10 mx-auto max-w-5xl">
        <nav className="mb-24 flex flex-wrap items-center justify-between gap-4 rounded-full border border-stone-200/80 bg-white/60 px-5 py-3 shadow-sm backdrop-blur-xl">
          <Link href="/" className="text-sm font-semibold tracking-wide">
            Poema Universal
          </Link>

          <div className="flex flex-wrap items-center gap-5 text-sm text-stone-600">
            <Link href="/" className="transition hover:text-black">
              Inicio
            </Link>

            <Link href="/mi-habitacion" className="transition hover:text-black">
              Mi Habitación
            </Link>
          </div>
        </nav>

        <section className="mx-auto max-w-xl rounded-[44px] border border-stone-200/80 bg-white/60 p-7 shadow-[0_30px_90px_rgba(70,48,29,0.10)] backdrop-blur-xl sm:p-10">
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.48em] text-stone-400">
              Cerradura
            </p>

            <h1 className="mt-7 font-serif text-5xl font-semibold leading-tight text-stone-950">
              Entrar en Mi Habitación
            </h1>

            <p className="mx-auto mt-7 max-w-md text-sm leading-8 text-stone-600">
              Tu habitación será privada. Entra con tu cuenta para guardar tus
              poemas, cartas, velas y recuerdos.
            </p>
          </div>

          <div className="mx-auto mt-10 flex max-w-md rounded-full border border-stone-200 bg-[#f7efe4] p-1">
            <button
              type="button"
              onClick={() => {
                setModo("login");
                setMensaje("");
              }}
              className={`flex-1 rounded-full px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] transition ${
                modo === "login"
                  ? "bg-stone-950 text-white"
                  : "text-stone-500 hover:text-black"
              }`}
            >
              Entrar
            </button>

            <button
              type="button"
              onClick={() => {
                setModo("registro");
                setMensaje("");
              }}
              className={`flex-1 rounded-full px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] transition ${
                modo === "registro"
                  ? "bg-stone-950 text-white"
                  : "text-stone-500 hover:text-black"
              }`}
            >
              Crear cuenta
            </button>
          </div>

          <div className="mt-10 space-y-4">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              autoComplete="email"
              className="w-full rounded-full border border-stone-200 bg-[#fbf6ee] px-6 py-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
            />

            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={mostrarPassword ? "text" : "password"}
                placeholder="Contraseña"
                autoComplete={
                  modo === "login" ? "current-password" : "new-password"
                }
                className="w-full rounded-full border border-stone-200 bg-[#fbf6ee] px-6 py-4 pr-28 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white"
              />

              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500 transition hover:text-black"
              >
                {mostrarPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>

            <button
              type="button"
              onClick={entrar}
              disabled={cargando}
              className="w-full rounded-full bg-stone-950 px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cargando
                ? "Abriendo..."
                : modo === "login"
                  ? "Entrar"
                  : "Crear cuenta"}
            </button>

            {mensaje && (
              <p className="text-center text-sm leading-7 text-stone-600">
                {mensaje}
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}