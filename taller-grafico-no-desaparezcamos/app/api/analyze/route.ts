import { NextResponse } from "next/server";
import { canonPrompt } from "@/lib/canon";
import type { Direction, GraphicMode } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    fragmento?: string;
    mode?: GraphicMode;
    contextoAnterior?: string;
    contextoPosterior?: string;
  };

  const fragmento = body.fragmento?.trim();
  const mode = body.mode ?? "poetico";
  if (!fragmento) {
    return NextResponse.json({ error: "Selecciona un fragmento de la novela." }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ direction: fallbackDirection(fragmento, mode), source: "local" });
  }

  const schema = `Devuelve SOLO JSON válido con estas claves exactas: accion, lugar, momento, personajes (array), emocion, elementoDominante, simbolo, noRevelar, plano, camara, composicion, luz, textura, color, textoVisible, silencio (0-100), promptImagen.`;
  const input = `Eres director literario, director de fotografía y editor de novela gráfica.\n\n${canonPrompt()}\n\nModo gráfico: ${mode}.\n\nContexto anterior: ${body.contextoAnterior || "no disponible"}\n\nFRAGMENTO ACTIVO:\n${fragmento}\n\nContexto posterior: ${body.contextoPosterior || "no disponible"}\n\nReglas: no inventes hechos; distingue lo que debe verse de lo que debe quedar fuera de campo; el texto visible debe ser vacío si la imagen funciona mejor sin palabras; el prompt de imagen debe ser preciso y conservar continuidad. ${schema}`;

  try {
    const apiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_TEXT_MODEL || "gpt-5.6",
        reasoning: { effort: "medium" },
        input
      })
    });

    if (!apiResponse.ok) {
      const detail = await apiResponse.text();
      throw new Error(`OpenAI ${apiResponse.status}: ${detail.slice(0, 500)}`);
    }

    const data = await apiResponse.json();
    const text = extractOutputText(data);
    const direction = parseDirection(text, fragmento, mode);
    return NextResponse.json({ direction, source: "openai" });
  } catch (error) {
    return NextResponse.json({
      direction: fallbackDirection(fragmento, mode),
      source: "local-fallback",
      warning: error instanceof Error ? error.message : "Falló el análisis remoto."
    });
  }
}

function extractOutputText(data: any): string {
  if (typeof data?.output_text === "string") return data.output_text;
  const chunks: string[] = [];
  for (const item of data?.output ?? []) {
    for (const content of item?.content ?? []) {
      if (typeof content?.text === "string") chunks.push(content.text);
    }
  }
  return chunks.join("\n");
}

function parseDirection(text: string, fragmento: string, mode: GraphicMode): Direction {
  const cleaned = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  try {
    return { ...fallbackDirection(fragmento, mode), ...JSON.parse(cleaned) };
  } catch {
    return fallbackDirection(fragmento, mode);
  }
}

function fallbackDirection(fragmento: string, mode: GraphicMode): Direction {
  const firstSentence = fragmento.split(/(?<=[.!?])\s+/)[0]?.slice(0, 150) || fragmento.slice(0, 150);
  const modeNotes = {
    literal: "Representar el acontecimiento principal sin añadir acciones.",
    poetico: "Traducir el estado emocional mediante espacio, luz y materia; evitar ilustrar cada sustantivo.",
    eliptico: "Mantener el acontecimiento decisivo fuera de campo y mostrar su huella o consecuencia inmediata."
  };

  return {
    accion: firstSentence,
    lugar: "Determinar únicamente a partir del fragmento y su contexto.",
    momento: "No fijar una hora si la novela no la establece.",
    personajes: [],
    emocion: "Tensión contenida; ajustar después de la lectura completa del pasaje.",
    elementoDominante: "El espacio y la presencia narrativa principal.",
    simbolo: "Ninguno añadido; usar solo símbolos ya presentes en la obra.",
    noRevelar: "No anticipar información posterior.",
    plano: mode === "eliptico" ? "plano detalle o plano vacío" : "plano general contenido",
    camara: "altura humana, observación no enfática",
    composicion: modeNotes[mode],
    luz: "natural, fría y narrativa; sin dramatización artificial",
    textura: "papel, grano fotográfico fino y materia impresa",
    color: "gris niebla, tierras apagadas, negro tinta y blanco hueso",
    textoVisible: "",
    silencio: mode === "eliptico" ? 85 : mode === "poetico" ? 72 : 55,
    promptImagen: `${modeNotes[mode]} Novela gráfica literaria, realismo de memoria, composición editorial, luz natural fría, textura analógica fina, sin fantasía decorativa. Escena basada exclusivamente en: ${fragmento.slice(0, 900)}`
  };
}
