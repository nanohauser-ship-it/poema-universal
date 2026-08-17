import { NextResponse } from "next/server";

const ACE_STEP_URL = (process.env.ACE_STEP_URL || "http://127.0.0.1:8001").replace(/\/$/, "");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = String(body?.prompt || "").trim();
    const title = String(body?.title || "Organismo").trim();
    const duration = Math.max(20, Math.min(180, Number(body?.duration || 90)));

    if (!prompt) {
      return NextResponse.json({ ok: false, error: "Falta el prompt musical." }, { status: 400 });
    }

    const health = await fetch(`${ACE_STEP_URL}/health`, { cache: "no-store" }).catch(() => null);
    if (!health?.ok) {
      return NextResponse.json(
        {
          ok: false,
          code: "ACE_STEP_OFFLINE",
          error: "ACE-Step no está disponible en el puerto 8001.",
        },
        { status: 503 },
      );
    }

    const response = await fetch(`${ACE_STEP_URL}/release_task`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `${prompt} Instrumental only. No lyrics, no spoken voice.`,
        lyrics: "",
        thinking: true,
        audio_duration: duration,
        audio_format: "mp3",
        inference_steps: 8,
        batch_size: 1,
        model: "acestep-v15-turbo",
        use_random_seed: true,
        task_type: "text2music",
        title,
      }),
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);
    const taskId = data?.data?.task_id;

    if (!response.ok || !taskId) {
      return NextResponse.json(
        {
          ok: false,
          error: data?.error || `ACE-Step rechazó la generación (${response.status}).`,
          raw: data,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, taskId, status: "queued" });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Error iniciando ACE-Step." },
      { status: 500 },
    );
  }
}
