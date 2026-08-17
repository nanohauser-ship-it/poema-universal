import { NextResponse } from "next/server";
import { canonPrompt } from "@/lib/canon";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { prompt?: string; quality?: "low" | "medium" | "high" };
  const prompt = body.prompt?.trim();
  if (!prompt) return NextResponse.json({ error: "Falta la dirección visual de la lámina." }, { status: 400 });
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "El Taller no encuentra OPENAI_API_KEY en .env.local." }, { status: 503 });

  const finalPrompt = `${canonPrompt()}\n\nDIRECCIÓN DE ESTA LÁMINA:\n${prompt}\n\nLa imagen debe sentirse como una página de la misma obra, no como una ilustración independiente. No añadas texto dentro de la imagen salvo que la dirección lo exija de forma explícita.`;

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
        quality: body.quality || "medium",
        n: 1
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      return NextResponse.json({ error: `Generación de imagen ${response.status}: ${detail.slice(0, 1000)}` }, { status: response.status });
    }

    const data = await response.json();
    const image = data?.data?.[0]?.b64_json;
    if (!image) return NextResponse.json({ error: "La API respondió sin imagen utilizable." }, { status: 502 });
    return NextResponse.json({ imageDataUrl: `data:image/png;base64,${image}` });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo generar la lámina." }, { status: 500 });
  }
}
