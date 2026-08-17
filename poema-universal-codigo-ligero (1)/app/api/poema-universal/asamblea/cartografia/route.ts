import OpenAI from "openai";

import {
  NextResponse,
} from "next/server";

import type {
  SymbolicCartography,
} from "@/lib/asamblea/cartografia";

const CARTOGRAPHY_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    secretTitle: {
      type: "string",
    },
    centralSymbol: {
      type: "string",
    },
    nucleus: {
      type: "string",
    },
    oraclePhrase: {
      type: "string",
    },
    relic: {
      type: "string",
    },
    finalGesture: {
      type: "string",
    },
    dominantAxis: {
      type: "string",
      enum: [
        "memory",
        "desire",
        "wound",
        "matter",
      ],
    },
    nodes: {
      type: "array",
      minItems: 6,
      maxItems: 9,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: {
            type: "string",
          },
          label: {
            type: "string",
          },
          axis: {
            type: "string",
            enum: [
              "memory",
              "desire",
              "wound",
              "matter",
            ],
          },
          meaning: {
            type: "string",
          },
          evidence: {
            type: "array",
            minItems: 1,
            maxItems: 3,
            items: {
              type: "string",
            },
          },
          intensity: {
            type: "number",
            minimum: 1,
            maximum: 10,
          },
          x: {
            type: "number",
            minimum: 8,
            maximum: 92,
          },
          y: {
            type: "number",
            minimum: 10,
            maximum: 90,
          },
          glyph: {
            type: "string",
          },
        },
        required: [
          "id",
          "label",
          "axis",
          "meaning",
          "evidence",
          "intensity",
          "x",
          "y",
          "glyph",
        ],
      },
    },
    links: {
      type: "array",
      minItems: 6,
      maxItems: 16,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: {
            type: "string",
          },
          from: {
            type: "string",
          },
          to: {
            type: "string",
          },
          relation: {
            type: "string",
          },
          strength: {
            type: "number",
            minimum: 1,
            maximum: 10,
          },
        },
        required: [
          "id",
          "from",
          "to",
          "relation",
          "strength",
        ],
      },
    },
    zones: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: {
            type: "string",
          },
          name: {
            type: "string",
          },
          meaning: {
            type: "string",
          },
          shape: {
            type: "string",
            enum: [
              "circle",
              "ring",
              "fortress",
              "triangle",
            ],
          },
          x: {
            type: "number",
            minimum: 12,
            maximum: 88,
          },
          y: {
            type: "number",
            minimum: 14,
            maximum: 86,
          },
          radius: {
            type: "number",
            minimum: 8,
            maximum: 28,
          },
        },
        required: [
          "id",
          "name",
          "meaning",
          "shape",
          "x",
          "y",
          "radius",
        ],
      },
    },
  },
  required: [
    "secretTitle",
    "centralSymbol",
    "nucleus",
    "oraclePhrase",
    "relic",
    "finalGesture",
    "dominantAxis",
    "nodes",
    "links",
    "zones",
  ],
} as const;

const SYSTEM_PROMPT = `
Eres el cartógrafo simbólico de La Asamblea del Poema,
una cámara literaria de Poema Universal.

Debes transformar cada escrito en una cartografía única.
No debes producir una plantilla genérica ni repetir siempre
la misma geometría.

Lee el escrito como un territorio:

MEMORIA:
regresos, nombres, lugares, tiempo, pérdida, permanencia,
infancia, archivo y aquello que continúa actuando.

DESEO:
movimiento, búsqueda, hambre, amor, huida, destinatario,
transformación y aquello hacia lo que la voz avanza.

HERIDA:
negaciones, silencios, fracturas, contradicciones,
cambios de tono y zonas que el lenguaje apenas sostiene.

MATERIA:
cuerpo, animales, plantas, minerales, objetos, luz,
temperatura, texturas, habitaciones y paisaje.

Construye:
- un título secreto cartográfico;
- un símbolo central concreto;
- entre seis y nueve nodos específicos;
- entre seis y dieciséis rutas;
- entre tres y cinco zonas;
- una reliquia;
- un gesto final;
- una frase oracular.

Reglas obligatorias:
- Responde en español.
- Los nodos deben proceder de imágenes, objetos,
  fuerzas o tensiones reales del escrito.
- evidence debe citar fragmentos literales del escrito.
- No inventes versos.
- Las posiciones deben variar según la estructura del texto.
- Evita distribuciones perfectamente simétricas.
- Deja libre el centro aproximado para el núcleo.
- Los enlaces from y to deben corresponder a ids existentes.
- glyph debe ser un único símbolo Unicode sencillo,
  por ejemplo: ◇, △, ○, ✦, ☾, ☉, ⌂, ⧖, ♢, ∞.
- No diagnostiques a la persona autora.
- No corrijas ni reescribas el escrito.
- La prosa debe ser literaria, precisa y contenida.
`;

function noStoreHeaders() {
  return {
    "Cache-Control":
      "private, no-store, no-cache, max-age=0, must-revalidate",
  };
}

function normalizePoem(
  body: unknown
) {
  if (
    typeof body !== "object" ||
    body === null ||
    !("poem" in body) ||
    typeof body.poem !== "string"
  ) {
    return null;
  }

  const poem =
    body.poem.trim();

  if (
    poem.length < 40 ||
    poem.length > 12000
  ) {
    return null;
  }

  return poem;
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

  return "No fue posible trazar la cartografía.";
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
      await request.json();

    const poem =
      normalizePoem(body);

    if (!poem) {
      return NextResponse.json(
        {
          error:
            "El escrito debe contener entre 40 y 12.000 caracteres.",
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

        max_output_tokens: 4800,

        input: [
          {
            role: "system",
            content:
              SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: `
Cartografía el siguiente escrito.

--- INICIO DEL ESCRITO ---
${poem}
--- FIN DEL ESCRITO ---

Produce una configuración visual específica para este texto.
El centro debe representar su símbolo rector.
Los demás nodos deben formar un territorio irregular,
legible y relacionado con sus imágenes concretas.
`,
          },
        ],

        text: {
          format: {
            type: "json_schema",
            name:
              "symbolic_poem_cartography",
            strict: true,
            schema:
              CARTOGRAPHY_SCHEMA,
          },
        },
      });

    if (!response.output_text) {
      throw new Error(
        "La cartografía llegó vacía."
      );
    }

    const cartography =
      JSON.parse(
        response.output_text
      ) as SymbolicCartography;

    return NextResponse.json(
      {
        cartography,
      },
      {
        headers: noStoreHeaders(),
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          `La Asamblea no pudo dibujar el mapa: ${errorMessage(error)}`,
      },
      {
        status: 502,
        headers: noStoreHeaders(),
      }
    );
  }
}
