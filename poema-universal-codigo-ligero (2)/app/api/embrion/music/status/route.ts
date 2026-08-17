import { NextResponse } from "next/server";

const ACE_STEP_URL = (process.env.ACE_STEP_URL || "http://127.0.0.1:8001").replace(/\/$/, "");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const taskId = String(body?.taskId || "").trim();

    if (!taskId) {
      return NextResponse.json({ ok: false, error: "Falta taskId." }, { status: 400 });
    }

    const response = await fetch(`${ACE_STEP_URL}/query_result`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task_id_list: [taskId] }),
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.data?.length) {
      return NextResponse.json(
        { ok: false, error: data?.error || "No pude consultar ACE-Step." },
        { status: 502 },
      );
    }

    const task = data.data[0];
    const status = Number(task?.status ?? 0);

    if (status === 2) {
      return NextResponse.json({ ok: false, status: "failed", error: "ACE-Step no pudo completar esta interpretación." });
    }

    if (status !== 1) {
      return NextResponse.json({ ok: true, status: "working" });
    }

    let result: any[] = [];
    try {
      result = typeof task.result === "string" ? JSON.parse(task.result) : task.result || [];
    } catch {
      result = [];
    }

    const first = result.find((item) => item?.file) || result[0];
    if (!first?.file) {
      return NextResponse.json({ ok: false, status: "failed", error: "ACE-Step terminó, pero no devolvió un archivo de audio." });
    }

    const audioUrl = `/api/embrion/music/audio?path=${encodeURIComponent(String(first.file))}`;

    return NextResponse.json({
      ok: true,
      status: "ready",
      audioUrl,
      metas: first?.metas || null,
      generationInfo: first?.generation_info || "",
      seed: first?.seed_value || "",
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Error consultando ACE-Step." },
      { status: 500 },
    );
  }
}
