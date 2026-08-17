import { NextResponse } from "next/server";
import { openaiStructured } from "@/lib/openai";
import type { Chapter, ChapterPlan, ManuscriptArchitecture, StructuredDocument } from "@/lib/types";

export const runtime = "nodejs";

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    globalSummary: { type: "string" },
    visualLogic: { type: "string" },
    estimatedPlates: { type: "integer" },
    chapterPlans: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          chapterId: { type: "string" },
          role: { type: "string" },
          tension: { type: "string" },
          motifs: { type: "array", items: { type: "string" } },
          visualDensity: { type: "string", enum: ["baja", "media", "alta"] },
          estimatedUnits: { type: "integer" }
        },
        required: ["chapterId", "role", "tension", "motifs", "visualDensity", "estimatedUnits"]
      }
    }
  },
  required: ["globalSummary", "visualLogic", "estimatedPlates", "chapterPlans"]
};

export async function POST(request: Request) {
  const body = (await request.json()) as { document?: StructuredDocument };
  const document = body.document;
  if (!document?.chapters?.length) return NextResponse.json({ error: "Primero carga la novela." }, { status: 400 });

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ architecture: fallbackArchitecture(document), source: "local" });
  }

  const compact = document.chapters.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    kind: chapter.kind,
    wordCount: chapter.wordCount,
    sample: sampleChapter(chapter)
  }));

  const input = `Actúa como arquitecto narrativo y director de una adaptación gráfica literaria. Analiza la estructura global de la novela antes de diseñar imágenes. No inventes escenas ni hechos. Los preliminares, dedicatorias e índices no deben forzarse a convertirse en láminas. Para cada capítulo explica su función, tensión, motivos ya presentes en el texto y densidad visual. Estima unidades gráficas, no párrafos. La lógica debe favorecer continuidad, elipsis, ritmo y repetición consciente de símbolos.\n\nOBRA: ${document.title}\n\nCAPÍTULOS Y MUESTRAS:\n${JSON.stringify(compact)}`;

  try {
    const result = await openaiStructured<Omit<ManuscriptArchitecture, "title">>({ input, schemaName: "novel_architecture", schema, maxOutputTokens: 6500 });
    const byId = new Map(result.chapterPlans.map((p) => [p.chapterId, p]));
    const chapterPlans = document.chapters.map((chapter) => byId.get(chapter.id) || fallbackPlan(chapter));
    return NextResponse.json({ architecture: { title: document.title, ...result, chapterPlans }, source: "openai" });
  } catch (error) {
    return NextResponse.json({ architecture: fallbackArchitecture(document), source: "local-fallback", warning: error instanceof Error ? error.message : "Falló el análisis global." });
  }
}

function sampleChapter(chapter: Chapter) {
  const ps = chapter.paragraphs;
  if (!ps.length) return "";
  const first = ps.slice(0, 4).join(" ");
  const mid = ps.slice(Math.max(0, Math.floor(ps.length / 2) - 1), Math.floor(ps.length / 2) + 2).join(" ");
  const last = ps.slice(-4).join(" ");
  return `${first}\n…\n${mid}\n…\n${last}`.slice(0, 3600);
}

function fallbackPlan(chapter: Chapter): ChapterPlan {
  const front = chapter.kind === "frontmatter";
  return {
    chapterId: chapter.id,
    role: front ? "Material preliminar; no convertir automáticamente en imagen." : "Bloque narrativo a analizar por escenas.",
    tension: front ? "No narrativa." : "Pendiente de análisis profundo del capítulo.",
    motifs: [],
    visualDensity: front ? "baja" : chapter.wordCount > 3500 ? "alta" : chapter.wordCount > 1600 ? "media" : "baja",
    estimatedUnits: front ? 0 : Math.max(1, Math.min(18, Math.round(chapter.wordCount / 450)))
  };
}

function fallbackArchitecture(document: StructuredDocument): ManuscriptArchitecture {
  const chapterPlans = document.chapters.map(fallbackPlan);
  const estimatedPlates = chapterPlans.reduce((n, p) => n + p.estimatedUnits, 0);
  return {
    title: document.title,
    globalSummary: `Estructura detectada: ${document.chapters.length} bloques principales y ${document.paragraphCount} párrafos.`,
    visualLogic: "Trabajar capítulo por capítulo, convertir escenas en unidades gráficas y no párrafos en imágenes.",
    estimatedPlates,
    chapterPlans
  };
}
