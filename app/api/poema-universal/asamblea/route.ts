import OpenAI from "openai";

import {
  NextResponse,
} from "next/server";

type DomainReading = {
  title: string;
  reading: string;
  verses: string[];
  discovery: string;
};

type AssemblyAnalysis = {
  secretName: string;
  nucleus: string;
  livingContradiction: string;
  centralSymbol: string;
  relic: string;
  scenography: string;
  finalGesture: string;
  verdict: string;
  dominantDomain:
    | "memory"
    | "desire"
    | "wound"
    | "matter";
  creatures: {
    memory: DomainReading;
    desire: DomainReading;
    wound: DomainReading;
    matter: DomainReading;
  };
};

const ASSEMBLY_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    secretName: {
      type: "string",
    },
    nucleus: {
      type: "string",
    },
    livingContradiction: {
      type: "string",
    },
    centralSymbol: {
      type: "string",
    },
    relic: {
      type: "string",
    },
    scenography: {
      type: "string",
    },
    finalGesture: {
      type: "string",
    },
    verdict: {
      type: "string",
    },
    dominantDomain: {
      type: "string",
      enum: [
        "memory",
        "desire",
        "wound",
        "matter",
      ],
    },
    creatures: {
      type: "object",
      additionalProperties: false,
      properties: {
        memory: {
          $ref: "#/$defs/domainReading",
        },
        desire: {
          $ref: "#/$defs/domainReading",
        },
        wound: {
          $ref: "#/$defs/domainReading",
        },
        matter: {
          $ref: "#/$defs/domainReading",
        },
      },
      required: [
        "memory",
        "desire",
        "wound",
        "matter",
      ],
    },
  },
  required: [
    "secretName",
    "nucleus",
    "livingContradiction",
    "centralSymbol",
    "relic",
    "scenography",
    "finalGesture",
    "verdict",
    "dominantDomain",
    "creatures",
  ],
  $defs: {
    domainReading: {
      type: "object",
      additionalProperties: false,
      properties: {
        title: {
          type: "string",
        },
        reading: {
          type: "string",
        },
        verses: {
          type: "array",
          items: {
            type: "string",
          },
          minItems: 1,
          maxItems: 4,
        },
        discovery: {
          type: "string",
        },
      },
      required: [
        "title",
        "reading",
        "verses",
        "discovery",
      ],
    },
  },
} as const;

const SYSTEM_PROMPT = `
Eres la Asamblea del Poema de Poema Universal.

Cuatro criaturas leen un escrito desde territorios distintos:

MEMORIA:
ausencia, regreso, tiempo, pérdida, permanencia, nombres,
lugares y aquello que continúa actuando después de desaparecer.

DESEO:
movimiento, búsqueda, destinatario, hambre, amor, huida,
transformación y aquello hacia lo que el escrito intenta avanzar.

HERIDA:
silencios, negaciones, contradicciones, fracturas, cambios de tono,
zonas vulnerables y aquello que el lenguaje apenas puede sostener.

MATERIA:
cuerpo, animales, plantas, minerales, objetos, luz, temperatura,
texturas, paisaje y elementos físicos con los que el escrito piensa.

Tu misión no es corregir, evaluar ni reescribir el texto.
Tampoco debes diagnosticar psicológicamente a la persona autora.

Debes revelar la arquitectura simbólica que ya existe en el escrito.

Reglas:
- Responde siempre en español.
- Cita únicamente versos o fragmentos presentes literalmente en el escrito.
- No inventes versos.
- Cada criatura debe aportar una lectura distinta.
- Evita frases genéricas que servirían para cualquier poema.
- El nombre secreto no sustituye el título: nombra la estructura interior.
- La reliquia debe ser un objeto concreto, pequeño y visualizable.
- La escenografía debe ser una escena breve, precisa y sensorial.
- El gesto final debe ser simbólico, sencillo y realizable.
- El dictamen debe reunir las cuatro lecturas en una sola revelación.
- Usa una prosa literaria clara, precisa y contenida.
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

  return "La Asamblea no pudo completar la deliberación.";
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

    const poem =
      normalizePoem(rawBody);

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

        max_output_tokens: 4200,

        input: [
          {
            role: "system",
            content:
              SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: `
La Asamblea recibe el siguiente escrito:

--- INICIO DEL ESCRITO ---
${poem}
--- FIN DEL ESCRITO ---

Realiza una lectura profunda, específica y fiel al texto.
Cada criatura debe seleccionar entre uno y cuatro fragmentos literales.
Después formula el consenso de la Asamblea.
`,
          },
        ],

        text: {
          format: {
            type: "json_schema",
            name:
              "assembly_poetic_analysis",
            strict: true,
            schema:
              ASSEMBLY_SCHEMA,
          },
        },
      });

    if (!response.output_text) {
      throw new Error(
        "La respuesta llegó vacía."
      );
    }

    const analysis =
      JSON.parse(
        response.output_text
      ) as AssemblyAnalysis;

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
          `La Asamblea no pudo escuchar el escrito: ${errorMessage(error)}`,
      },
      {
        status: 502,
        headers: noStoreHeaders(),
      }
    );
  }
}
