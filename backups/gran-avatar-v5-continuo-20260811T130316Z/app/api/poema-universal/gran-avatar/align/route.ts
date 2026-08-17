import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_AUDIO_BYTES = 12 * 1024 * 1024;

function cleanString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "La sincronización de voz todavía no está configurada." },
        { status: 503 },
      );
    }

    const formData = await request.formData();
    const audio = formData.get("audio");
    const sourceText = cleanString(formData.get("text"));

    if (!(audio instanceof File) || audio.size === 0) {
      return NextResponse.json(
        { error: "No se recibió audio para sincronizar." },
        { status: 400 },
      );
    }

    if (audio.size > MAX_AUDIO_BYTES) {
      return NextResponse.json(
        { error: "El fragmento de voz es demasiado extenso para alinearlo." },
        { status: 413 },
      );
    }

    const client = new OpenAI({ apiKey });
    const transcription = await client.audio.transcriptions.create({
      file: audio,
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["word"],
      ...(sourceText
        ? {
            // Whisper usa el prompt como contexto. Lo limitamos porque no es
            // una instrucción general y tiene un máximo de tokens reducido.
            prompt: sourceText.slice(0, 760),
          }
        : {}),
    });

    const words = (transcription.words ?? [])
      .map((item) => ({
        word: String(item.word ?? "").trim(),
        start: Number(item.start),
        end: Number(item.end),
      }))
      .filter(
        (item) =>
          item.word &&
          Number.isFinite(item.start) &&
          Number.isFinite(item.end) &&
          item.end > item.start,
      );

    return NextResponse.json(
      {
        words,
        method: "whisper-1-word-timestamps",
      },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      },
    );
  } catch (error) {
    console.error("Gran Avatar alignment error:", error);
    return NextResponse.json(
      { error: "No fue posible alinear la voz con el rostro." },
      { status: 500 },
    );
  }
}
