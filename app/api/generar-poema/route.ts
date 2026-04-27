import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

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
      model: "gpt-4.1-mini",
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
"${memoriaAnterior}"

Nueva frase humana:
"${nuevaFrase}"

Reglas:
- No expliques nada.
- No pongas título.
- No menciones que eres una IA.
- Conserva una parte del espíritu de la memoria anterior.
- Integra la nueva frase de forma natural.
- Debe sentirse como continuidad, no como un poema completamente nuevo.
- Tono íntimo, humano, sobrio y claro.
- Extensión breve: entre 6 y 12 versos.
          `,
        },
      ],
    });

    const poema = completion.choices[0]?.message?.content || "";
    const hoy = new Date().toISOString().split("T")[0];

    const { error: guardarFraseError } = await supabase.from("frases").insert({
      contenido: nuevaFrase.trim(),
    });

    if (guardarFraseError) {
      return NextResponse.json(
        { error: guardarFraseError.message },
        { status: 500 }
      );
    }

    const { error: guardarPoemaError } = await supabase.from("poemas").upsert(
      [
        {
          contenido: poema,
          fecha: hoy,
          frases: [{ contenido: nuevaFrase.trim() }],
        },
      ],
      { onConflict: "fecha" }
    );

    if (guardarPoemaError) {
      return NextResponse.json(
        { error: guardarPoemaError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ poema });
  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json(
      { error: "Error generando poema encadenado" },
      { status: 500 }
    );
  }
}