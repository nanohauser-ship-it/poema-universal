import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_POEM_CHARS = 5_000;
const MAX_MESSAGE_CHARS = 1_200;
const MAX_MESSAGES = 12;

const SYSTEM_PROMPT = `Eres El Gran Avatar de Poema Universal: una presencia humana, sobria y atenta que lee poemas y conversa sobre literatura.

Cuando recibes un poema, no lo calificas, corriges ni conviertes en contenido. Primero escuchas su respiración, sus imágenes, sus silencios y sus tensiones. Puedes señalar una relación concreta entre dos elementos del texto, proponer una lectura posible o formular una única pregunta fértil.

Cuando no hay un poema presente, puedes explicar literatura, formas poéticas, recursos, movimientos, obras y autores con claridad y rigor. Distingue hechos de interpretaciones. No inventes citas, títulos, fechas ni atribuciones; si no estás seguro, dilo. Evita la clase escolar y encuentra siempre una imagen, una relación o una pregunta que vuelva vivo el tema.

Límites innegociables:
- No inventes biografía, intención autoral, territorio ni contexto.
- No diagnostiques psicológicamente a la persona.
- No elogies de forma automática ni uses lenguaje promocional.
- No reescribas el poema salvo que te lo pidan explícitamente.
- No presentes una interpretación como verdad definitiva.
- Si citas el poema, usa como máximo doce palabras seguidas.
- Responde en la lengua predominante de la conversación.
- Escribe entre 45 y 130 palabras, salvo que el usuario pida otra extensión.
- Mantén una voz cálida, precisa, contenida y sin teatralidad mística.

La tecnología debe desaparecer. Hablas como alguien que ha permanecido delante del poema el tiempo suficiente.`;

type RawMessage = {
  role?: unknown;
  content?: unknown;
};

function cleanString(value: unknown, maximum: number) {
  return typeof value === "string"
    ? value.trim().slice(0, maximum)
    : "";
}

function noStoreHeaders() {
  return {
    "Cache-Control": "private, no-store, max-age=0",
  };
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "La voz interior todavía no está configurada." },
        { status: 503, headers: noStoreHeaders() },
      );
    }

    const body = (await request.json()) as {
      poem?: {
        title?: unknown;
        text?: unknown;
        language?: unknown;
      };
      messages?: unknown;
    };

    const poemText = cleanString(
      body.poem?.text,
      MAX_POEM_CHARS,
    );
    const poemTitle =
      cleanString(body.poem?.title, 120) || "Poema sin título";
    const poemLanguage =
      cleanString(body.poem?.language, 24) || "no indicada";

    const rawMessages = Array.isArray(body.messages)
      ? (body.messages as RawMessage[]).slice(-MAX_MESSAGES)
      : [];

    const messages = rawMessages.flatMap((message) => {
      const role =
        message.role === "assistant" ? "assistant" : "user";
      const content = cleanString(
        message.content,
        MAX_MESSAGE_CHARS,
      );

      return content ? [{ role, content } as const] : [];
    });

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "La conversación todavía no ha comenzado." },
        { status: 400, headers: noStoreHeaders() },
      );
    }

    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model:
        process.env.GRAN_AVATAR_MODEL ??
        process.env.OPENAI_MODEL ??
        "gpt-5.6-terra",
      store: false,
      max_output_tokens: 700,
      input: [
        { role: "system", content: SYSTEM_PROMPT },
        ...(poemText.length >= 3
          ? [
              {
                role: "user" as const,
                content: [
                  `POEMA PRESENTE: «${poemTitle}»`,
                  `LENGUA DECLARADA: ${poemLanguage}`,
                  "TEXTO ÍNTEGRO:",
                  poemText,
                  "FIN DEL POEMA.",
                ].join("\n\n"),
              },
            ]
          : [
              {
                role: "user" as const,
                content:
                  "NO HAY POEMA PRESENTE. La conversación puede tratar de literatura general.",
              },
            ]),
        ...messages,
      ],
    });

    const reply = response.output_text.trim();
    if (!reply) {
      throw new Error("La respuesta llegó vacía.");
    }

    return NextResponse.json(
      { reply },
      { headers: noStoreHeaders() },
    );
  } catch (error) {
    console.error("Gran Avatar conversation error:", error);
    return NextResponse.json(
      {
        error:
          "La presencia no pudo responder ahora. El poema permanece intacto.",
      },
      { status: 500, headers: noStoreHeaders() },
    );
  }
}
