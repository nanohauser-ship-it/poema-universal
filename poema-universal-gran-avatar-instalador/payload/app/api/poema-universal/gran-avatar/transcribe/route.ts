import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_AUDIO_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "La escucha todavía no está configurada." },
        { status: 503 },
      );
    }

    const formData = await request.formData();
    const audio = formData.get("audio");

    if (!(audio instanceof File) || audio.size === 0) {
      return NextResponse.json(
        { error: "No se recibió ninguna voz." },
        { status: 400 },
      );
    }

    if (audio.size > MAX_AUDIO_BYTES) {
      return NextResponse.json(
        { error: "La grabación es demasiado extensa." },
        { status: 413 },
      );
    }

    const client = new OpenAI({ apiKey });
    const transcription = await client.audio.transcriptions.create({
      file: audio,
      model:
        process.env.GRAN_AVATAR_TRANSCRIPTION_MODEL ??
        "gpt-4o-mini-transcribe",
    });

    const text = transcription.text.trim();
    if (!text) {
      return NextResponse.json(
        { error: "La voz llegó sin palabras reconocibles." },
        { status: 422 },
      );
    }

    return NextResponse.json(
      { text },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      },
    );
  } catch (error) {
    console.error("Gran Avatar transcription error:", error);
    return NextResponse.json(
      { error: "No fue posible reconocer la voz." },
      { status: 500 },
    );
  }
}
