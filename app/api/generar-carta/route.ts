import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const motoresEmocionales: Record<string, string> = {
  decir: `
Modo emocional: DECIR LO QUE NO PUDE DECIR.
La carta debe liberar una verdad contenida.
Debe sonar honesta, contenida, directa y vulnerable.
No debe ser teatral.
Debe ayudar a decir lo que quedó atrapado.
`,

  cerrar: `
Modo emocional: CERRAR UNA HERIDA.
La carta debe buscar cierre, dignidad y límite.
Debe reconocer el daño sin recrearse en él.
Debe sonar firme, serena y adulta.
No debe pedir permiso para sanar.
`,

  gracias: `
Modo emocional: DAR LAS GRACIAS.
La carta debe expresar gratitud sin cursilería.
Debe reconocer lo recibido.
Debe tener calidez, memoria y delicadeza.
No debe sonar como felicitación genérica.
`,

  despedida: `
Modo emocional: DESPEDIRME SIN ENVIAR.
La carta debe permitir soltar.
Debe sonar íntima, sobria y final.
No debe dramatizar.
Debe dejar una sensación de despedida limpia.
`,
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const texto = body.texto || "";
    const tono = body.tono || "íntimo";
    const destinatario = body.destinatario || "alguien";
    const modo = body.modo || "decir";

    if (!texto.trim()) {
      return NextResponse.json(
        { error: "Falta texto para generar la carta." },
        { status: 400 }
      );
    }

    const motorEmocional =
      motoresEmocionales[modo] || motoresEmocionales.decir;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
Eres una voz de escritura íntima.
Transformas el texto del usuario en una carta humana, clara y emocionalmente precisa.

Reglas absolutas:
- No digas que eres una IA.
- No expliques nada.
- No des consejos.
- No diagnostiques.
- No uses frases grandilocuentes.
- No uses lenguaje de autoayuda.
- No exageres el dolor.
- No inventes hechos concretos que el usuario no haya dicho.
- Escribe en primera persona.
- La carta debe sentirse escrita por la persona usuaria.
- Estilo: íntimo, sobrio, bello, claro, emocionalmente verdadero.
`,
        },
        {
          role: "user",
          content: `
${motorEmocional}

Destinatario: ${destinatario}
Tono solicitado: ${tono}

Texto original del usuario:
"${texto}"

Escribe una carta breve o media, con buena respiración, en párrafos cortos.
Debe tener forma de carta, pero sin encabezados artificiales si no hacen falta.
Termina con una frase de cierre limpia y humana.
`,
        },
      ],
    });

    const carta = completion.choices[0]?.message?.content || "";

    const { error: insertError } = await supabase.from("cartas").insert({
      contenido: carta,
      texto_original: texto,
      tono,
      destinatario,
    });

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ carta });
  } catch (error) {
    console.error("ERROR GENERANDO CARTA:", error);

    return NextResponse.json(
      { error: "Error generando carta." },
      { status: 500 }
    );
  }
}