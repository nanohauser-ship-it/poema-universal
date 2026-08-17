import { NextResponse } from "next/server";
import { openaiStructured } from "@/lib/openai";
import type { Chapter, GraphicMode, NarrativeUnit } from "@/lib/types";

export const runtime = "nodejs";

const chunkSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    units: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceStart: { type: "integer" },
          sourceEnd: { type: "integer" },
          title: { type: "string" },
          summary: { type: "string" },
          visualObjective: { type: "string" },
          shouldIllustrate: { type: "boolean" },
          suggestedMode: { type: "string", enum: ["literal", "poetico", "eliptico"] },
          suggestedPlates: { type: "integer" },
          notes: { type: "string" }
        },
        required: ["sourceStart", "sourceEnd", "title", "summary", "visualObjective", "shouldIllustrate", "suggestedMode", "suggestedPlates", "notes"]
      }
    }
  },
  required: ["units"]
};

type RawUnit = {
  sourceStart: number;
  sourceEnd: number;
  title: string;
  summary: string;
  visualObjective: string;
  shouldIllustrate: boolean;
  suggestedMode: GraphicMode;
  suggestedPlates: number;
  notes: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as { chapter?: Chapter; previousTitle?: string; nextTitle?: string };
  const chapter = body.chapter;
  if (!chapter) return NextResponse.json({ error: "Falta el capítulo." }, { status: 400 });

  if (chapter.kind === "frontmatter") {
    return NextResponse.json({ units: fallbackUnits(chapter, false), source: "local" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ units: fallbackUnits(chapter, true), source: "local" });
  }

  const chunks = chunkParagraphs(chapter.paragraphs, 22000);
  const all: NarrativeUnit[] = [];
  let globalIndex = 0;

  try {
    for (const chunk of chunks) {
      const labeled = chunk.paragraphs.map((p, i) => `[P${i}] ${p}`).join("\n\n");
      const input = `Eres editor literario, guionista de novela gráfica y director de arte. Convierte SOLO este tramo del capítulo en unidades gráficas narrativamente necesarias. No hagas una unidad por párrafo. Agrupa párrafos cuando pertenecen al mismo movimiento narrativo. Una unidad es una experiencia visual coherente, no una ilustración literal. Puede haber tramos que no deban ilustrarse. Nunca inventes hechos. sourceStart y sourceEnd son índices P relativos a ESTE tramo, inclusivos. suggestedPlates debe estar entre 0 y 3. Usa literal para acción espacialmente clara, poetico para clima/símbolo/memoria, eliptico cuando convenga mostrar consecuencia, fuera de campo o silencio.\n\nCAPÍTULO: ${chapter.title}\nCAPÍTULO ANTERIOR: ${body.previousTitle || "ninguno"}\nCAPÍTULO SIGUIENTE: ${body.nextTitle || "ninguno"}\nTRAMO ${chunk.number + 1}/${chunks.length}:\n${labeled}`;
      const parsed = await openaiStructured<{ units: RawUnit[] }>({ input, schemaName: "graphic_units", schema: chunkSchema, maxOutputTokens: 4800 });
      const normalized = normalizeRawUnits(parsed.units, chapter, chunk.start, chunk.paragraphs.length, globalIndex);
      all.push(...normalized);
      globalIndex += normalized.length;
    }

    const units = all.length ? all : fallbackUnits(chapter, true);
    return NextResponse.json({ units, source: "openai" });
  } catch (error) {
    return NextResponse.json({ units: fallbackUnits(chapter, true), source: "local-fallback", warning: error instanceof Error ? error.message : "Falló el análisis del capítulo." });
  }
}

function chunkParagraphs(paragraphs: string[], maxChars: number) {
  const chunks: { number: number; start: number; paragraphs: string[] }[] = [];
  let current: string[] = [];
  let currentChars = 0;
  let start = 0;
  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    if (current.length && currentChars + p.length > maxChars) {
      chunks.push({ number: chunks.length, start, paragraphs: current });
      current = [];
      currentChars = 0;
      start = i;
    }
    current.push(p);
    currentChars += p.length + 2;
  }
  if (current.length) chunks.push({ number: chunks.length, start, paragraphs: current });
  return chunks.slice(0, 8);
}

function normalizeRawUnits(raw: RawUnit[], chapter: Chapter, chunkStart: number, chunkLength: number, baseIndex: number): NarrativeUnit[] {
  return (raw || []).slice(0, 16).map((unit, i) => {
    const start = clamp(unit.sourceStart, 0, Math.max(0, chunkLength - 1));
    const end = clamp(unit.sourceEnd, start, Math.max(start, chunkLength - 1));
    const absoluteStart = chunkStart + start;
    const absoluteEnd = chunkStart + end;
    const fragmento = chapter.paragraphs.slice(absoluteStart, absoluteEnd + 1).join("\n\n");
    const index = baseIndex + i;
    return {
      id: `${chapter.id}-u-${String(index + 1).padStart(3, "0")}`,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      index,
      title: unit.title.trim() || `Unidad ${index + 1}`,
      fragmento,
      summary: unit.summary.trim(),
      visualObjective: unit.visualObjective.trim(),
      shouldIllustrate: Boolean(unit.shouldIllustrate),
      suggestedMode: normalizeMode(unit.suggestedMode),
      suggestedPlates: unit.shouldIllustrate ? clamp(unit.suggestedPlates, 1, 3) : 0,
      notes: unit.notes.trim()
    };
  }).filter((u) => u.fragmento.trim().length > 0);
}

function fallbackUnits(chapter: Chapter, illustrate: boolean): NarrativeUnit[] {
  if (!chapter.paragraphs.length) return [];
  const groups: string[][] = [];
  let current: string[] = [];
  let chars = 0;
  for (const p of chapter.paragraphs) {
    if (current.length && chars + p.length > 1800) {
      groups.push(current);
      current = [];
      chars = 0;
    }
    current.push(p);
    chars += p.length + 2;
  }
  if (current.length) groups.push(current);

  return groups.slice(0, 28).map((group, index) => {
    const fragmento = group.join("\n\n");
    const firstSentence = fragmento.replace(/\s+/g, " ").split(/(?<=[.!?])\s+/)[0] || fragmento;
    const mode = inferMode(fragmento);
    return {
      id: `${chapter.id}-u-${String(index + 1).padStart(3, "0")}`,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      index,
      title: firstSentence.split(" ").slice(0, 8).join(" ").slice(0, 90),
      fragmento,
      summary: firstSentence.slice(0, 220),
      visualObjective: illustrate ? "Encontrar una imagen necesaria para este movimiento narrativo sin ilustrar cada frase." : "No forzar material preliminar a convertirse en imagen.",
      shouldIllustrate: illustrate,
      suggestedMode: mode,
      suggestedPlates: illustrate ? 1 : 0,
      notes: illustrate ? "Unidad provisional. Usa análisis IA para una segmentación más fina." : "Material preliminar."
    };
  });
}

function inferMode(text: string): GraphicMode {
  const t = text.toLowerCase();
  if (/(silencio|ausencia|recuerdo|memoria|niebla|huella|vacío|sueño|sombra)/.test(t)) return "poetico";
  if (/(después|ya no|quedó|restaba|nadie|fuera|desapareció)/.test(t)) return "eliptico";
  return "poetico";
}

function normalizeMode(mode: GraphicMode): GraphicMode {
  return mode === "literal" || mode === "eliptico" || mode === "poetico" ? mode : "poetico";
}

function clamp(n: number, min: number, max: number) {
  const value = Number.isFinite(Number(n)) ? Number(n) : min;
  return Math.max(min, Math.min(max, Math.round(value)));
}
