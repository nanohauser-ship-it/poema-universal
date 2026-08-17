import OpenAI from "openai";
import { NextResponse } from "next/server";
import { answerFromCorpus } from "@/lib/embrion/analysis";
import { getEvidenceBundle } from "@/lib/embrion/evidence";
import type { QuestionAnswer } from "@/lib/embrion/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const synthesisSchema = {
  type: "object",
  additionalProperties: false,
  required: ["answer", "claimIds", "limitations"],
  properties: {
    answer: { type: "string" },
    claimIds: { type: "array", items: { type: "string" } },
    limitations: { type: "array", items: { type: "string" } },
  },
} as const;

async function synthesizeWithModel(base: QuestionAnswer): Promise<QuestionAnswer> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return base;

  const bundles = base.claimIds.map(getEvidenceBundle).filter((bundle): bundle is NonNullable<typeof bundle> => Boolean(bundle));
  const evidencePacket = bundles.map((bundle) => ({
    claimId: bundle.claim.id,
    periodId: bundle.claim.periodId,
    claim: bundle.claim.statement,
    grade: bundle.claim.evidenceGrade,
    limitations: bundle.claim.limitations,
    passages: bundle.evidence.map((item) => ({
      author: item.author.name,
      work: item.work.title,
      date: item.work.dateLabel,
      excerpt: item.passage.legalDisplay === "metadata_only" ? undefined : item.passage.excerpt,
      source: item.source.institution,
    })),
  }));

  const client = new OpenAI({ apiKey });
  const response = await client.responses.create({
    model: process.env.EMBRION_TEXT_MODEL ?? "gpt-5.6-terra",
    store: false,
    max_output_tokens: 1200,
    input: [
      {
        role: "system",
        content: "Eres la capa de síntesis de Embrión. Responde solo con el paquete de evidencia dado. Distingue hechos documentales de interpretación. No añadas autores, fechas, obras ni tesis externas. Usa lenguaje condicional y formula las ausencias como «no detectado en el corpus disponible». Conserva los claimIds exactos que sustentan la respuesta.",
      },
      {
        role: "user",
        content: JSON.stringify({ question: base.question, evidencePacket }),
      },
    ],
    text: { format: { type: "json_schema", name: "embrion_corpus_answer", strict: true, schema: synthesisSchema } },
  });
  if (!response.output_text) return base;

  const parsed = JSON.parse(response.output_text) as { answer: string; claimIds: string[]; limitations: string[] };
  const allowed = new Set(base.claimIds);
  const claimIds = parsed.claimIds.filter((id) => allowed.has(id));
  if (!parsed.answer.trim() || claimIds.length === 0) return base;
  return { ...base, answer: parsed.answer, claimIds, mode: "corpus_plus_model", limitations: [...new Set([...base.limitations, ...parsed.limitations])] };
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { question?: unknown } | null;
  const question = typeof body?.question === "string" ? body.question.trim() : "";
  if (question.length < 8 || question.length > 600) {
    return NextResponse.json({ error: "La pregunta debe tener entre 8 y 600 caracteres." }, { status: 400 });
  }

  const base = answerFromCorpus(question);
  try {
    const answer = await synthesizeWithModel(base);
    return NextResponse.json(answer, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Embrión corpus synthesis error:", error);
    return NextResponse.json(base, { headers: { "Cache-Control": "no-store", "X-Embrion-Fallback": "corpus-template" } });
  }
}
