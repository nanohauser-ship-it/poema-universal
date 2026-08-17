import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_TEXT_CHARS = 1_200;

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      format?: unknown;
      text?: unknown;
      purpose?: unknown;
    };
    const text = cleanString(body.text);
    const responseFormat = body.format === "pcm" ? "pcm" : "mp3";
    const purpose =
      body.purpose === "reading" ? "reading" : "speaking";

    if (!text || text.length > MAX_TEXT_CHARS) {
      return NextResponse.json(
        { error: "El fragmento de voz no es válido." },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "La voz todavía no está configurada." },
        { status: 503 },
      );
    }

    const client = new OpenAI({ apiKey });
    const speech = await client.audio.speech.create({
      model:
        process.env.GRAN_AVATAR_TTS_MODEL ??
        process.env.OPENAI_TTS_MODEL ??
        "gpt-4o-mini-tts",
      voice:
        process.env.GRAN_AVATAR_TTS_VOICE ??
        process.env.OPENAI_TTS_VOICE ??
        "marin",
      input: text,
      instructions:
        purpose === "reading"
          ? "Lee el poema con una voz humana, íntima y contenida. Respeta los saltos, las pausas y la puntuación. Ritmo lento pero natural. No declames, no dramatices y no añadas palabras."
          : "Habla con una voz humana, cálida, sobria y cercana. Ritmo natural y reflexivo, sin grandilocuencia ni teatralidad.",
      response_format: responseFormat,
    });

    const buffer = Buffer.from(await speech.arrayBuffer());
    return new Response(buffer, {
      headers: {
        "Content-Type":
          responseFormat === "pcm"
            ? "audio/pcm;rate=24000;encoding=signed-integer;bits=16;channels=1"
            : "audio/mpeg",
        "Content-Length": String(buffer.length),
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Gran Avatar voice error:", error);
    return NextResponse.json(
      { error: "La voz no pudo atravesar la sala." },
      { status: 500 },
    );
  }
}
