import OpenAI from "openai";
import { NextResponse } from "next/server";

import { BESTIARY_SYSTEM_PROMPT } from "@/lib/bestiario-poetico/prompt";
import { creatureRevealSchema } from "@/lib/bestiario-poetico/schema";
import type { RevealRequest } from "@/lib/bestiario-poetico/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_POEM_CHARS = 18_000;

function textOrEmpty(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<RevealRequest>;
    const poem = textOrEmpty(body.poem);
    const title = textOrEmpty(body.title);
    const authorContext = textOrEmpty(body.authorContext);

    if (poem.length < 20) {
      return NextResponse.json(
        { error: "El poema es demasiado breve para revelar una criatura." },
        { status: 400 }
      );
    }

    if (poem.length > MAX_POEM_CHARS) {
      return NextResponse.json(
        { error: `El poema supera el máximo de ${MAX_POEM_CHARS.toLocaleString("es-ES")} caracteres.` },
        { status: 400 }
      );
    }

    const model = process.env.OPENAI_MODEL;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || !model) {
      return NextResponse.json(
        { error: "Faltan OPENAI_API_KEY u OPENAI_MODEL en el servidor." },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey });
    const userInput = [
      title ? `TÍTULO: ${title}` : "TÍTULO: no indicado",
      authorContext ? `CONTEXTO OPCIONAL: ${authorContext}` : "CONTEXTO OPCIONAL: ninguno",
      "POEMA:",
      poem
    ].join("\n\n");

    const response = await client.responses.create({
      model,
      store: false,
      instructions: BESTIARY_SYSTEM_PROMPT,
      input: userInput,
      text: {
        format: {
          type: "json_schema",
          name: "creature_reveal",
          strict: true,
          schema: creatureRevealSchema
        }
      }
    });

    if (!response.output_text) {
      return NextResponse.json(
        { error: "La revelación llegó vacía. Inténtalo de nuevo." },
        { status: 502 }
      );
    }

    const reveal = JSON.parse(response.output_text);
    return NextResponse.json({ reveal });
  } catch (error) {
    console.error("Bestiario Poético error:", error);
    return NextResponse.json(
      { error: "No fue posible completar la revelación." },
      { status: 500 }
    );
  }
}
