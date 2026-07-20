import OpenAI from "openai";
import {
  NextResponse,
} from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function noStoreHeaders() {
  return {
    "Cache-Control":
      "no-store, no-cache, must-revalidate",
    "Pragma": "no-cache",
  };
}

function errorMessage(
  error: unknown
) {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return (
    "No fue posible materializar el sello."
  );
}

export async function POST(
  request: Request
) {
  try {
    if (
      !process.env.OPENAI_API_KEY
    ) {
      return NextResponse.json(
        {
          error:
            "OPENAI_API_KEY no está configurada.",
        },
        {
          status: 500,
          headers: noStoreHeaders(),
        }
      );
    }

    const body =
      await request.json() as {
        symbolPrompt?: unknown;
      };

    if (
      typeof body.symbolPrompt !==
        "string" ||
      body.symbolPrompt.trim().length <
        20 ||
      body.symbolPrompt.length > 5000
    ) {
      return NextResponse.json(
        {
          error:
            "La partitura visual no es válida.",
        },
        {
          status: 400,
          headers: noStoreHeaders(),
        }
      );
    }

    const openai = new OpenAI({
      apiKey:
        process.env.OPENAI_API_KEY,
    });

    const fixedDirection = `
Create one square poetic sigil.

This is not a narrative illustration and not concept art.
It is a small primordial literary emblem distilled from one poem.

Visual principles:
- one dominant central symbol
- restrained and symmetrical composition
- black, charcoal, warm ivory, faint sepia and antique muted gold
- aged engraving, dry ink, worn paper, stone or oxidized metal
- metaphysical and labyrinthine literary atmosphere
- austere, sacred, archetypal and timeless
- readable at thumbnail size
- generous negative space
- no glossy CGI
- no futuristic interface
- no decorative fantasy excess
- no human portrait
- no readable text
- no letters
- no numbers
- no signature
- no logo
- no watermark

Specific symbolic direction derived from the poem:
${body.symbolPrompt.trim()}
`.trim();

    const result =
      await openai.images.generate({
        model:
          process.env
            .MATRIX_IMAGE_MODEL ??
          "gpt-image-2",

        prompt: fixedDirection,
        size: "1024x1024",
        quality: "low",
      });

    const imageBase64 =
      result.data?.[0]?.b64_json;

    if (!imageBase64) {
      throw new Error(
        "El modelo no devolvió una imagen."
      );
    }

    return NextResponse.json(
      {
        imageDataUrl:
          `data:image/png;base64,${imageBase64}`,
      },
      {
        headers: noStoreHeaders(),
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          `El sello no pudo materializarse: ${errorMessage(error)}`,
      },
      {
        status: 502,
        headers: noStoreHeaders(),
      }
    );
  }
}
