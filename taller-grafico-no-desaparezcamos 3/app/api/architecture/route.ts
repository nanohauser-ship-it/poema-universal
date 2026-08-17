import { NextResponse } from "next/server";
import { canonPrompt } from "@/lib/canon";
import type { GraphicMode, ManuscriptArchitecture, NarrativeUnit } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    text?: string;
    paragraphs?: string[];
    title?: string;
  };

  const text = body.text?.trim() || "";
  const paragraphs = Array.isArray(body.paragraphs)
    ? body.paragraphs.map((p) => String(p).trim()).filter(Boolean)
    : [];

  if (!text && paragraphs.length === 0) {
    return NextResponse.json({ error: "Primero carga la novela." }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ architecture: fallbackArchitecture(text, paragraphs, body.title), source: "local" });
  }

  const schema = `Devuelve SOLO JSON válido con esta forma exacta: {"title":"","globalSummary":"","visualLogic":"","totalSuggestedPlates":0,"units":[{"id":"u-001","index":0,"chapter":"","title":"","fragmento":"","summary":"","visualObjective":"","shouldIllustrate":true,"suggestedMode":"poetico","suggestedPlates":1,"notes":""}]}`;

  const input = `Eres arquitecto narrativo y editor de novela gráfica. Debes dividir un manuscrito en unidades de trabajo gráfico coherentes, en el orden exacto de lectura.\n\n${canonPrompt()}\n\nReglas: la novela manda; no inventes hechos; una unidad puede recomendar 0, 1, 2 o 3 láminas; decide si una unidad debe ilustrarse o no; el suggestedMode debe ser literal, poetico o eliptico; notes debe advertir continuidad, fuera de campo o si conviene encadenar varias láminas.\n\nTítulo sugerido: ${body.title || "No dejes que desaparezcamos"}\n\nMANUSCRITO:\n${text.slice(0, 120000)}\n\n${schema}`;

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
    const parsed = parseArchitecture(extractOutputText(data), text, paragraphs, body.title);
    return NextResponse.json({ architecture: parsed, source: "openai" });
  } catch (error) {
    return NextResponse.json({
      architecture: fallbackArchitecture(text, paragraphs, body.title),
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

function parseArchitecture(text: string, sourceText: string, paragraphs: string[], title?: string): ManuscriptArchitecture {
  const cleaned = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  try {
    const parsed = JSON.parse(cleaned) as ManuscriptArchitecture;
    if (!parsed?.units?.length) throw new Error("Sin unidades");
    return {
      title: parsed.title || title || "No dejes que desaparezcamos",
      globalSummary: parsed.globalSummary || "Arquitectura narrativa generada.",
      visualLogic: parsed.visualLogic || "Encadenar las láminas respetando el ritmo de la novela.",
      totalSuggestedPlates: parsed.totalSuggestedPlates || parsed.units.reduce((acc, u) => acc + Math.max(0, Number(u.suggestedPlates) || 0), 0),
      units: parsed.units.map((u, index) => ({
        ...u,
        id: u.id || `u-${String(index + 1).padStart(3, "0")}`,
        index,
        chapter: u.chapter || "Secuencia",
        title: u.title || inferTitle(u.fragmento || paragraphs[index] || "Unidad"),
        fragmento: u.fragmento || paragraphs[index] || "",
        summary: u.summary || inferSummary(u.fragmento || paragraphs[index] || ""),
        visualObjective: u.visualObjective || "Traducir la unidad a una lámina coherente.",
        shouldIllustrate: typeof u.shouldIllustrate === "boolean" ? u.shouldIllustrate : true,
        suggestedMode: normalizeMode(u.suggestedMode),
        suggestedPlates: clampPlates(u.suggestedPlates),
        notes: u.notes || "Mantener continuidad narrativa."
      }))
    };
  } catch {
    return fallbackArchitecture(sourceText, paragraphs, title);
  }
}

function fallbackArchitecture(text: string, paragraphs: string[], title?: string): ManuscriptArchitecture {
  const source = paragraphs.length ? paragraphs : text.split(/\n\s*\n|\r?\n/).map((p) => p.trim()).filter(Boolean);
  let currentChapter = "Secuencia inicial";
  let unitCounter = 0;
  const units: NarrativeUnit[] = [];

  for (const raw of source) {
    if (!raw) continue;
    if (isHeading(raw)) {
      currentChapter = raw.replace(/[:.]+$/, "").trim();
      continue;
    }

    const mode = inferMode(raw);
    const suggestedPlates = inferPlateCount(raw);
    const shouldIllustrate = raw.length > 25;

    units.push({
      id: `u-${String(unitCounter + 1).padStart(3, "0")}`,
      index: unitCounter,
      chapter: currentChapter,
      title: inferTitle(raw),
      fragmento: raw,
      summary: inferSummary(raw),
      visualObjective: mode === "eliptico"
        ? "Mostrar la huella del acontecimiento más que el acontecimiento mismo."
        : mode === "literal"
        ? "Fijar con claridad el núcleo de la acción sin excederse."
        : "Traducir el clima emocional y simbólico de la escena.",
      shouldIllustrate,
      suggestedMode: mode,
      suggestedPlates,
      notes: buildNotes(raw, suggestedPlates, mode)
    });
    unitCounter += 1;
  }

  return {
    title: title || "No dejes que desaparezcamos",
    globalSummary: buildGlobalSummary(units),
    visualLogic: "La obra se divide en unidades encadenadas. Cada una sugiere un modo gráfico y un número de láminas para preservar ritmo, continuidad y elipsis.",
    totalSuggestedPlates: units.reduce((acc, unit) => acc + (unit.shouldIllustrate ? unit.suggestedPlates : 0), 0),
    units
  };
}

function isHeading(text: string) {
  return /^(pr[oó]logo|ep[ií]logo|cap[ií]tulo|parte|escena)\b/i.test(text) || (text.length < 60 && /^[A-ZÁÉÍÓÚÑ0-9\s.-]+$/.test(text));
}

function inferTitle(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.split(/[.?!]/)[0].split(" ").slice(0, 7).join(" ");
}

function inferSummary(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.split(/(?<=[.!?])\s+/)[0]?.slice(0, 180) || clean.slice(0, 180);
}

function inferPlateCount(text: string) {
  const len = text.length;
  if (len > 850) return 3;
  if (len > 420) return 2;
  return 1;
}

function inferMode(text: string): GraphicMode {
  const t = text.toLowerCase();
  if (/(vac[ií]o|silencio|sombra|ausencia|recuerdo|niebla|eco|huella|resto)/.test(t)) return "poetico";
  if (/(disparo|golpe|corri[oó]|abri[oó]|entr[oó]|sal[ií]o|lleg[oó]|muri[oó]|vi[oó])/.test(t)) return "literal";
  if (/(despu[eé]s|ya no|nadie|qued[oó]|restaba|fuera de campo)/.test(t)) return "eliptico";
  return "poetico";
}

function buildNotes(text: string, plates: number, mode: GraphicMode) {
  const pieces = [] as string[];
  if (plates > 1) pieces.push(`Conviene dividir esta unidad en ${plates} láminas para no comprimir su desarrollo.`);
  if (mode === "eliptico") pieces.push("Preservar fuera de campo y consecuencia.");
  if (mode === "poetico") pieces.push("Favorecer clima y ritmo sobre descripción exhaustiva.");
  if (mode === "literal") pieces.push("Asegurar claridad espacial y narrativa.");
  if (/árbol/i.test(text)) pieces.push("Atender continuidad del Árbol Blanco si aparece.");
  return pieces.join(" ") || "Mantener continuidad con la unidad anterior y la siguiente.";
}

function buildGlobalSummary(units: NarrativeUnit[]) {
  if (!units.length) return "Sin unidades detectadas todavía.";
  const first = units[0]?.summary || "";
  const last = units[Math.max(0, units.length - 1)]?.summary || "";
  return `La arquitectura provisional organiza ${units.length} unidades narrativas. Se inicia en “${first.slice(0, 70)}” y avanza hasta “${last.slice(0, 70)}”.`;
}

function normalizeMode(mode: any): GraphicMode {
  return mode === "literal" || mode === "eliptico" || mode === "poetico" ? mode : "poetico";
}

function clampPlates(value: any) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 1;
  return Math.max(0, Math.min(3, Math.round(n)));
}
