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
    const purpose = body.purpose === "reading" ? "reading" : "speaking";

    if (!text || text.length > MAX_TEXT_CHARS) {
      return NextResponse.json(
        { error: "El fragmento de voz no es válido." },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "La voz todavía no está configurada. Falta OPENAI_API_KEY." },
        { status: 503 },
      );
    }

    const client = new OpenAI({ apiKey });

    const readingInstructions = `
Habla en español de España con naturalidad.
Voz masculina adulta, íntima, grave pero nunca impostada.
Lee literatura delante de una sola persona.
Ritmo lento pero humano. Respeta profundamente puntos, comas, saltos y silencios.
No declames. No hagas voz de actor, locutor, documental ni tráiler.
No enfatices todas las frases. Algunas palabras deben casi caer.
Piensa el poema mientras lo pronuncias.
No añadas ni cambies palabras.
`.trim();

    const speakingInstructions = `
Habla en español de España con absoluta naturalidad.
Voz masculina adulta, íntima y ligeramente grave, nunca impostada.
Pareces una persona inteligente que llevaba un rato pensando antes de que alguien entrara.
Hay lucidez, fatiga moral y una tristeza muy contenida.
No suenes como locutor, presentador, narrador, actor de tráiler, asistente virtual ni publicidad.
Habla despacio y permite silencios reales.
No enfatices todas las frases. Cuando una idea sea incómoda, baja la energía en lugar de levantar la voz.
Al principio de una reflexión parece que hablas contigo mismo; poco a poco tomas conciencia de la persona que tienes delante.
Las preguntas finales deben sentirse verdaderamente dirigidas al usuario.
`.trim();

    const speech = await client.audio.speech.create({
      model:
        process.env.GRAN_AVATAR_TTS_MODEL ??
        process.env.OPENAI_TTS_MODEL ??
        "gpt-4o-mini-tts",
      voice:
        process.env.GRAN_AVATAR_TTS_VOICE ??
        process.env.OPENAI_TTS_VOICE ??
        "cedar",
      input: text,
      instructions:
        purpose === "reading"
          ? readingInstructions
          : speakingInstructions,
      speed: 0.92,
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
