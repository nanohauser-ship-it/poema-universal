import { NextResponse } from "next/server";
import { canonPrompt } from "@/lib/canon";
import { openaiStructured } from "@/lib/openai";
import type { Direction, GraphicMode } from "@/lib/types";

export const runtime = "nodejs";

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accion: { type: "string" },
    lugar: { type: "string" },
    momento: { type: "string" },
    personajes: { type: "array", items: { type: "string" } },
    emocion: { type: "string" },
    elementoDominante: { type: "string" },
    simbolo: { type: "string" },
    noRevelar: { type: "string" },
    plano: { type: "string" },
    camara: { type: "string" },
    composicion: { type: "string" },
    luz: { type: "string" },
    textura: { type: "string" },
    color: { type: "string" },
    textoVisible: { type: "string" },
    silencio: { type: "integer" },
    promptImagen: { type: "string" }
  },
  required: ["accion", "lugar", "momento", "personajes", "emocion", "elementoDominante", "simbolo", "noRevelar", "plano", "camara", "composicion", "luz", "textura", "color", "textoVisible", "silencio", "promptImagen"]
};

export async function POST(request: Request) {
  const body = (await request.json()) as {
    fragmento?: string;
    mode?: GraphicMode;
    summary?: string;
    visualObjective?: string;
    notes?: string;
    contextoAnterior?: string;
    contextoPosterior?: string;
    continuity?: string;
  };

  const fragmento = body.fragmento?.trim();
  const mode = body.mode || "poetico";
  if (!fragmento) return NextResponse.json({ error: "Selecciona una unidad narrativa." }, { status: 400 });

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ direction: fallbackDirection(fragmento, mode, body), source: "local" });
  }

  const input = `Actúa simultáneamente como editor literario, director de arte y director de fotografía. Diseña UNA lámina de una novela gráfica literaria. La novela es la autoridad: no inventes acciones, personajes, vestuario, objetos ni lugares. La imagen debe pertenecer a una secuencia, no funcionar como póster aislado. Evita ilustrar cada sustantivo. Decide qué NO mostrar. Mantén la misma gramática visual del proyecto.\n\n${canonPrompt()}\n\nMODO: ${mode}\nRESUMEN DE UNIDAD: ${body.summary || ""}\nOBJETIVO VISUAL: ${body.visualObjective || ""}\nNOTAS: ${body.notes || ""}\nCONTINUIDAD VISUAL YA FIJADA: ${body.continuity || "No hay láminas previas aprobadas."}\n\nCONTEXTO ANTERIOR:\n${body.contextoAnterior || ""}\n\nFRAGMENTO EXACTO:\n${fragmento}\n\nCONTEXTO POSTERIOR:\n${body.contextoPosterior || ""}\n\nEl promptImagen debe ser autosuficiente para GPT Image, describir solo información apoyada por el texto y contener instrucciones explícitas de continuidad editorial: realismo de memoria, composición literaria, grano fino, paleta contenida y ausencia de estética genérica de concept art. textoVisible debe quedar vacío si las palabras sobran. silencio es 0-100.`;

  try {
    const direction = await openaiStructured<Direction>({ input, schemaName: "graphic_direction", schema, maxOutputTokens: 3200 });
    direction.silencio = Math.max(0, Math.min(100, Math.round(direction.silencio)));
    return NextResponse.json({ direction, source: "openai" });
  } catch (error) {
    return NextResponse.json({ direction: fallbackDirection(fragmento, mode, body), source: "local-fallback", warning: error instanceof Error ? error.message : "Falló la dirección IA." });
  }
}

function fallbackDirection(fragmento: string, mode: GraphicMode, body: any): Direction {
  const first = fragmento.replace(/\s+/g, " ").split(/(?<=[.!?])\s+/)[0]?.slice(0, 180) || fragmento.slice(0, 180);
  const modeNotes = {
    literal: "Representar con claridad el acontecimiento principal sin añadir acciones.",
    poetico: "Traducir estado y memoria mediante espacio, luz y materia; evitar ilustración literal exhaustiva.",
    eliptico: "Dejar fuera de campo el hecho decisivo y mostrar presencia, huella o consecuencia."
  };
  return {
    accion: body.summary || first,
    lugar: "Solo el lugar establecido por el fragmento; no inventar arquitectura adicional.",
    momento: "No precisar hora o estación si el texto no la fija.",
    personajes: [],
    emocion: "Tensión contenida.",
    elementoDominante: body.visualObjective || "La presencia narrativa principal.",
    simbolo: "Usar únicamente símbolos ya presentes en la novela.",
    noRevelar: "No anticipar información posterior.",
    plano: mode === "eliptico" ? "plano vacío o detalle significativo" : "plano general contenido",
    camara: "altura humana, observación sobria",
    composicion: modeNotes[mode],
    luz: "luz natural narrativa, sin teatralización gratuita",
    textura: "materia impresa, grano fotográfico fino, papel",
    color: "gris niebla, tierras apagadas, negro tinta, blanco hueso",
    textoVisible: "",
    silencio: mode === "eliptico" ? 85 : mode === "poetico" ? 72 : 55,
    promptImagen: `${modeNotes[mode]} ${body.visualObjective || ""} Novela gráfica literaria, realismo de memoria, continuidad estricta, composición editorial sobria, textura analógica fina, paleta apagada. Basarse exclusivamente en este fragmento: ${fragmento.slice(0, 1800)}`.trim()
  };
}
