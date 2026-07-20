import OpenAI from "openai";
import {
  NextResponse,
} from "next/server";

import type {
  MatrixAnalysis,
  MatrixInput,
} from "../../../../poema-universal/matriz-poetica/matrix-contract";

import {
  buildMatrixUserPrompt,
  MATRIX_SYSTEM_PROMPT,
} from "../../../../poema-universal/matriz-poetica/matrix-prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MATRIX_ANALYSIS_SCHEMA = {
  type: "object",
  additionalProperties: false,

  properties: {
    threshold: {
      type: "string",
    },

    movement: {
      type: "string",
    },

    pulse: {
      type: "string",
    },

    invisibleCore: {
      type: "string",
    },

    hiddenZone: {
      type: "string",
    },

    gravityLine: {
      type: "string",
    },

    imageForce: {
      type: "string",
    },

    resonance: {
      type: "string",
    },

    centralSymbol: {
      type: "object",
      additionalProperties: false,

      properties: {
        name: {
          type: "string",
        },

        description: {
          type: "string",
        },
      },

      required: [
        "name",
        "description",
      ],
    },

    relic: {
      type: "object",
      additionalProperties: false,

      properties: {
        name: {
          type: "string",
        },

        material: {
          type: "string",
        },

        description: {
          type: "string",
        },
      },

      required: [
        "name",
        "material",
        "description",
      ],
    },

    scenography: {
      type: "object",
      additionalProperties: false,

      properties: {
        title: {
          type: "string",
        },

        atmosphere: {
          type: "string",
        },

        description: {
          type: "string",
        },
      },

      required: [
        "title",
        "atmosphere",
        "description",
      ],
    },

    finalGesture: {
      type: "string",
    },

    symbolicAltar: {
      type: "string",
    },

    revisionPaths: {
      type: "array",
      minItems: 3,
      maxItems: 3,

      items: {
        type: "string",
      },
    },

    axes: {
      type: "array",
      minItems: 5,
      maxItems: 5,

      items: {
        type: "object",
        additionalProperties: false,

        properties: {
          label: {
            type: "string",
          },

          value: {
            type: "number",
            minimum: 0,
            maximum: 100,
          },
        },

        required: [
          "label",
          "value",
        ],
      },
    },

    symbolPrompt: {
      type: "string",
    },
  },

  required: [
    "threshold",
    "movement",
    "pulse",
    "invisibleCore",
    "hiddenZone",
    "gravityLine",
    "imageForce",
    "resonance",
    "centralSymbol",
    "relic",
    "scenography",
    "finalGesture",
    "symbolicAltar",
    "revisionPaths",
    "axes",
    "symbolPrompt",
  ],
} as const;

function noStoreHeaders() {
  return {
    "Cache-Control":
      "no-store, no-cache, must-revalidate",
    "Pragma": "no-cache",
  };
}

function normalizeInput(
  value: unknown
): MatrixInput | null {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return null;
  }

  const body = value as
    Record<string, unknown>;

  const input: MatrixInput = {
    title:
      typeof body.title === "string"
        ? body.title.slice(0, 180)
        : "",

    author:
      typeof body.author === "string"
        ? body.author.slice(0, 180)
        : "",

    language:
      typeof body.language === "string"
        ? body.language.slice(0, 80)
        : "No indicada",

    poem:
      typeof body.poem === "string"
        ? body.poem.slice(0, 6000)
        : "",

    translation:
      typeof body.translation === "string"
        ? body.translation.slice(0, 6000)
        : "",

    notes:
      typeof body.notes === "string"
        ? body.notes.slice(0, 1200)
        : "",
  };

  if (
    input.poem.trim().length < 40
  ) {
    return null;
  }

  return input;
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
    "La Matriz no pudo completar la lectura."
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

    const rawBody =
      await request.json();

    const input =
      normalizeInput(rawBody);

    if (!input) {
      return NextResponse.json(
        {
          error:
            "El poema debe contener al menos 40 caracteres.",
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

    const response =
      await openai.responses.create({
        model:
          process.env
            .MATRIX_TEXT_MODEL ??
          "gpt-5.6-terra",

        store: false,

        max_output_tokens: 5000,

        input: [
          {
            role: "system",
            content:
              MATRIX_SYSTEM_PROMPT,
          },

          {
            role: "user",
            content:
              buildMatrixUserPrompt(
                input
              ),
          },
        ],

        text: {
          format: {
            type: "json_schema",
            name:
              "matrix_poetic_analysis",
            strict: true,
            schema:
              MATRIX_ANALYSIS_SCHEMA,
          },
        },
      });

    if (!response.output_text) {
      throw new Error(
        "La respuesta de la Matriz llegó vacía."
      );
    }

    const analysis =
      JSON.parse(
        response.output_text
      ) as MatrixAnalysis;

    return NextResponse.json(
      {
        analysis,
      },
      {
        headers: noStoreHeaders(),
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          `La Matriz no pudo escuchar el poema: ${errorMessage(error)}`,
      },
      {
        status: 502,
        headers: noStoreHeaders(),
      }
    );
  }
}
