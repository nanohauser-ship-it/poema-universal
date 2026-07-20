import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const openaiKey = process.env.OPENAI_API_KEY!;

type ModoPoema = "ia" | "natural";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const nuevaFrase = String(body.frase || "");
    const nombre = String(body.nombre || "").trim();
    const lugar = String(body.lugar || "").trim();
    const modo: ModoPoema = body.modo === "natural" ? "natural" : "ia";

    if (!nuevaFrase.trim()) {
      return NextResponse.json(
        { error: "Falta la nueva frase" },
        { status: 400 },
      );
    }

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Faltan variables de entorno de Supabase" },
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    if (modo === "natural") {
      const poemaNatural = nuevaFrase.trim();

      const { error: insertError } = await supabase.from("poemas").insert({
        contenido: poemaNatural,
        frases: [
          {
            contenido: poemaNatural,
            modo: "natural",
            origen: "humano",
            nombre: nombre || null,
            lugar: lugar || null,
          },
        ],
        fecha: new Date().toISOString().split("T")[0],
      });

      if (insertError) {
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 },
        );
      }

      return NextResponse.json({
        poema: poemaNatural,
        modo: "natural",
        nombre,
        lugar,
      });
    }

    if (!openaiKey) {
      return NextResponse.json(
        { error: "Falta OPENAI_API_KEY" },
        { status: 500 },
      );
    }

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
        { status: 500 },
      );
    }

    const memoriaAnterior =
      ultimoPoema?.contenido ||
      "Todavía no existe una memoria anterior. Esta es la primera voz del Poema Universal.";

    const datosHumanos = `
Nombre o firma opcional:
${nombre || "No indicado"}

Lugar opcional:
${lugar || "No indicado"}
`;

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

Datos humanos opcionales:
${datosHumanos}

Reglas:
- No expliques nada.
- No pongas título.
- No menciones que eres una IA.
- Conserva una parte del espíritu de la memoria anterior.
- Integra la nueva frase de forma natural.
- Debe sentirse como continuidad, no como un poema completamente nuevo.
- Si hay nombre o lugar, no los fuerces dentro del poema salvo que encajen de forma muy sutil.
- El poema debe seguir sintiéndose universal, no una ficha de datos.
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
        { status: 500 },
      );
    }

    const { error: insertError } = await supabase.from("poemas").insert({
      contenido: poemaGenerado,
      frases: [
        {
          contenido: nuevaFrase.trim(),
          modo: "ia",
          origen: "humano",
          nombre: nombre || null,
          lugar: lugar || null,
          resultado: poemaGenerado,
        },
      ],
      fecha: new Date().toISOString().split("T")[0],
    });

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      poema: poemaGenerado,
      modo: "ia",
      nombre,
      lugar,
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
      { status: 500 },
    );
  }
}