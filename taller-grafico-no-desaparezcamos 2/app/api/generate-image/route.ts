import { NextResponse } from "next/server";
import { canonPrompt } from "@/lib/canon";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { prompt } = (await request.json()) as { prompt?: string };
  if (!prompt?.trim()) {
    return NextResponse.json({ error: "Falta el prompt de imagen." }, { status: 400 });
  }
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Añade OPENAI_API_KEY en .env.local para activar la generación real." },
      { status: 503 }
    );
  }

  const finalPrompt = `${canonPrompt()}\n\nDirección específica de esta lámina:\n${prompt}`;

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-2",
        prompt: finalPrompt,
        size: "1024x1536",
        quality: "high",
        n: 1
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      return NextResponse.json({ error: `OpenAI ${response.status}: ${detail.slice(0, 500)}` }, { status: response.status });
    }

    const data = await response.json();
    const item = data?.data?.[0];
    const imageDataUrl = item?.b64_json
      ? `data:image/png;base64,${item.b64_json}`
      : item?.url || null;

    if (!imageDataUrl) {
      return NextResponse.json({ error: "La API respondió sin una imagen utilizable." }, { status: 502 });
    }

    return NextResponse.json({ imageDataUrl });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo generar la imagen." },
      { status: 500 }
    );
  }
}
