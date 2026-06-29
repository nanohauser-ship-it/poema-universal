import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const openaiKey = process.env.OPENAI_API_KEY!;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const nuevaFrase = body.frase || "";

    if (!nuevaFrase.trim()) {
      return NextResponse.json(
        { error: "Falta la nueva frase" },
        { status: 400 }
      );
    }

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Faltan variables de entorno de Supabase" },
        { status: 500 }
      );
    }

    if (!openaiKey) {
      return NextResponse.json(
        { error: "Falta OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const openai = new OpenAI({ apiKey: openaiKey });

    const { data: ultimoPoema, error: poemaError } = await supabase
      .from("poemas")
      .select("contenido")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (poemaError && poemaError.code !== "PGRST116") {
      return NextResponse.json(
        { error: poemaError.message },
        { status: 500 }
      );
    }

    const memoriaAnterior =
      ultimoPoema?.contenido ||
      "Todavía no existe una memoria anterior. Esta es la primera voz del Poema Universal.";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Eres el hilo invisible del Poema Universal. No escribes desde cero: conectas una memoria humana anterior con una nueva frase. Tu trabajo es preservar la continuidad, no lucirte.",
        },
        {
          role: "user",
          content: `
Continúa esta memoria humana.

Memoria anterior:
${memoriaAnterior}

Nueva frase humana:
${nuevaFrase}

Reglas:
- No expliques nada.
- No pongas título.
- No menciones que eres una IA.
- Conserva una parte del espíritu de la memoria anterior.
- Integra la nueva frase de forma natural.
- Debe sentirse como continuidad, no como un poema completamente nuevo.
          `,
        },
      ],
      temperature: 0.8,
    });

    const poemaGenerado =
      completion.choices[0]?.message?.content?.trim() || "";

    if (!poemaGenerado) {
      return NextResponse.json(
        { error: "OpenAI no devolvió contenido" },
        { status: 500 }
      );
    }

const { error: insertError } = await supabase
  .from("poemas")
  .insert({
    contenido: poemaGenerado,
    frases: [
      {
        contenido: poemaGenerado,
      },
    ],
    fecha: new Date().toISOString().split("T")[0],
  });

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      poema: poemaGenerado,
    });
  } catch (error) {
    console.error("ERROR GENERAR POEMA:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido al generar poema",
      },
      { status: 500 }
    );
  }
}