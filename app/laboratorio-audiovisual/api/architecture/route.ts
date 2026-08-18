import OpenAI from "openai";
import { NextResponse } from "next/server";

import {
  validateArchitectureBlueprint,
  validateScenographyBrief,
} from "../../engine/ArchitectureValidator";
import {
  architectureBlueprintJsonSchema,
  type ScenographyBrief,
} from "../../scenography/schema";
import { generateLocalBlueprint } from "../../scenography/seededGenerator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type ArchitectureRequest = {
  brief?: unknown;
};

function fallbackResponse(brief: ScenographyBrief) {
  return NextResponse.json(
    {
      blueprint: generateLocalBlueprint(brief, brief.preferredArchetype),
      source: "fallback",
    },
    {
      headers: {
        "Cache-Control": "no-store",
        "X-Sala-Madre-Planner": "local-fallback",
      },
    }
  );
}

export async function POST(request: Request) {
  let payload: ArchitectureRequest;

  try {
    payload = (await request.json()) as ArchitectureRequest;
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const brief = validateScenographyBrief(payload.brief);

  if (!brief) {
    return NextResponse.json(
      { error: "Brief escenográfico rechazado" },
      { status: 400 }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const model =
    process.env.SALA_MADRE_ARCHITECTURE_MODEL ?? process.env.OPENAI_MODEL;

  if (!apiKey || !model) {
    return fallbackResponse(brief);
  }

  try {
    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model,
      store: false,
      max_output_tokens: 8000,
      instructions:
        "Eres un director de escenografía audiovisual. Interpreta el tema, la intención narrativa y la zona del recorrido incluidos en el brief. Si preferredArchetype está presente, úsalo. Devuelve únicamente un ArchitectureBlueprint seguro y filmable, usando solo los tipos, materiales, slots y límites del JSON Schema. No incluyas URLs, código, shaders, geometría arbitraria ni texto explicativo. Respeta especialmente la zona segura del performer y la cámara MASTER.",
      input: JSON.stringify(brief),
      text: {
        format: {
          type: "json_schema",
          name: "sala_madre_architecture_blueprint",
          strict: false,
          schema: architectureBlueprintJsonSchema,
        },
      },
    });
    const parsed = JSON.parse(response.output_text) as unknown;
    const validation = validateArchitectureBlueprint(
      parsed,
      brief.mediaSlots.map((slot) => slot.id)
    );

    if (
      !validation.ok ||
      (brief.preferredArchetype &&
        validation.blueprint.archetype !== brief.preferredArchetype)
    ) {
      return fallbackResponse(brief);
    }

    return NextResponse.json(
      { blueprint: validation.blueprint, source: "ai" },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return fallbackResponse(brief);
  }
}
