import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_CHARS = 600;

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { phrase?: string; tone?: string; creatureName?: string };
    const phrase = clean(body.phrase);
    const tone = clean(body.tone);
    const creatureName = clean(body.creatureName);

    if (!phrase || phrase.length > MAX_CHARS) {
      return NextResponse.json({ error: "La voz no contiene una frase válida." }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Falta OPENAI_API_KEY en el servidor." }, { status: 500 });
    }

    const client = new OpenAI({ apiKey });
    const speech = await client.audio.speech.create({
      model: process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts",
      voice: process.env.OPENAI_TTS_VOICE || "marin",
      input: phrase,
      instructions: [
        "Habla en español con una voz íntima, sobria y ceremonial.",
        "Ritmo lento pero natural; volumen contenido; sin teatralidad excesiva.",
        "Debe sentirse como una presencia simbólica que habla una sola vez.",
        tone ? `Tono simbólico: ${tone}.` : "",
        creatureName ? `La criatura se llama ${creatureName}.` : ""
      ].filter(Boolean).join(" "),
      response_format: "mp3"
    });

    const buffer = Buffer.from(await speech.arrayBuffer());
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(buffer.length),
        "Cache-Control": "private, no-store"
      }
    });
  } catch (error) {
    console.error("Bestiario Poético voz error:", error);
    return NextResponse.json({ error: "No fue posible dar voz a la criatura." }, { status: 500 });
  }
}
