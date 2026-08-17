"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  prompt: string;
  title: string;
};

type State = "idle" | "starting" | "working" | "ready" | "error";

export default function AceStepGenerator({ prompt, title }: Props) {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("Motor gratuito local · ACE-Step 1.5");
  const [audioUrl, setAudioUrl] = useState("");
  const [duration, setDuration] = useState(90);
  const stoppedRef = useRef(false);

  useEffect(() => {
    stoppedRef.current = false;
    return () => {
      stoppedRef.current = true;
    };
  }, []);

  async function generate() {
    if (!prompt.trim() || state === "starting" || state === "working") return;

    setAudioUrl("");
    setState("starting");
    setMessage("Enviando la dirección musical de Embrión a ACE-Step…");

    try {
      const start = await fetch("/api/embrion/music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, title, duration }),
      });
      const started = await start.json();

      if (!start.ok || !started?.ok || !started?.taskId) {
        throw new Error(started?.error || "No se pudo iniciar la generación.");
      }

      setState("working");
      setMessage("ACE-Step está interpretando el poema. La primera generación puede tardar bastante mientras carga los modelos.");

      for (let attempt = 0; attempt < 240 && !stoppedRef.current; attempt += 1) {
        await new Promise((resolve) => window.setTimeout(resolve, 2500));

        const check = await fetch("/api/embrion/music/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskId: started.taskId }),
        });
        const result = await check.json();

        if (result?.status === "ready" && result?.audioUrl) {
          setAudioUrl(result.audioUrl);
          setState("ready");
          setMessage("Interpretación terminada · audio nacido de la dirección literaria de Embrión");
          return;
        }

        if (!check.ok || result?.status === "failed" || result?.ok === false) {
          throw new Error(result?.error || "ACE-Step detuvo la generación.");
        }
      }

      throw new Error("La generación está tardando demasiado. Comprueba el motor ACE-Step.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "No pude comunicarme con ACE-Step.");
    }
  }

  const busy = state === "starting" || state === "working";

  return (
    <section
      style={{
        margin: "18px 0",
        padding: "18px",
        border: "1px solid rgba(255,255,255,.12)",
        background: "rgba(255,255,255,.025)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: ".18em", color: "rgba(255,255,255,.48)", marginBottom: 6 }}>
            INTÉRPRETE MUSICAL
          </div>
          <strong style={{ fontSize: 15, fontWeight: 500, letterSpacing: ".06em" }}>ACE-STEP 1.5 · LOCAL</strong>
          <div style={{ marginTop: 7, maxWidth: 650, fontSize: 11, lineHeight: 1.6, color: "rgba(255,255,255,.63)" }}>
            {message}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <select
            value={duration}
            disabled={busy}
            onChange={(event) => setDuration(Number(event.target.value))}
            aria-label="Duración de la interpretación"
            style={{
              border: "1px solid rgba(255,255,255,.14)",
              background: "rgba(0,0,0,.35)",
              color: "rgba(255,255,255,.82)",
              padding: "10px 12px",
              fontSize: 10,
              letterSpacing: ".08em",
            }}
          >
            <option value={45}>45 s</option>
            <option value={60}>60 s</option>
            <option value={90}>90 s</option>
            <option value={120}>120 s</option>
          </select>

          <button type="button" onClick={generate} disabled={busy || !prompt.trim()}>
            {busy ? "GENERANDO…" : audioUrl ? "GENERAR OTRA INTERPRETACIÓN" : "GENERAR MÚSICA"}
          </button>
        </div>
      </div>

      {audioUrl ? (
        <div style={{ marginTop: 18 }}>
          <audio controls preload="metadata" src={audioUrl} style={{ width: "100%" }} />
        </div>
      ) : null}

      {state === "error" ? (
        <div style={{ marginTop: 12, fontSize: 10, lineHeight: 1.6, color: "rgba(255,210,190,.85)" }}>
          Arranca primero ACE-Step API en <code>localhost:8001</code>. Embrión no volverá a Strudel.
        </div>
      ) : null}
    </section>
  );
}
