import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_TEXT_CHARS = 1_200;

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      format?: unknown;
      text?: unknown;
      purpose?: unknown;
    };

    const text = cleanString(body.text);

    const responseFormat =
      body.format === "pcm"
        ? "pcm"
        : "mp3";

    const purpose =
      body.purpose === "reading"
        ? "reading"
        : "speaking";

    /*
     * ─────────────────────────────────────────────────────
     * VALIDACIÓN
     * ─────────────────────────────────────────────────────
     */

    if (!text || text.length > MAX_TEXT_CHARS) {
      return NextResponse.json(
        {
          error: "El fragmento de voz no es válido.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * ─────────────────────────────────────────────────────
     * OPENAI
     * ─────────────────────────────────────────────────────
     */

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "La voz todavía no está configurada.",
        },
        {
          status: 503,
        },
      );
    }

    const client = new OpenAI({
      apiKey,
    });

    /*
     * ─────────────────────────────────────────────────────
     * PERSONALIDAD VOCAL DEL GRAN AVATAR
     * ─────────────────────────────────────────────────────
     *
     * CEDAR
     *
     * El avatar no debe sonar como:
     * - locutor
     * - documental
     * - actor de tráiler
     * - declamador
     *
     * Debe parecer una persona que piensa mientras habla.
     */

    const readingInstructions = `
Habla en español de España con naturalidad.

Eres la voz del Gran Avatar de Poema Universal.

Tu voz es masculina, adulta, íntima y grave,
pero nunca impostada.

No eres un locutor.
No eres un narrador de documental.
No eres un actor de tráiler.
No estás declamando.

Estás leyendo literatura delante de una sola persona.

La lectura debe sentirse humana,
cercana,
inteligente,
vulnerable
y ligeramente imperfecta.

Habla despacio,
pero nunca de manera artificialmente lenta.

Respeta profundamente:

- los puntos
- las comas
- los saltos de línea
- las interrupciones
- los silencios
- la respiración natural del texto

No enfatices todas las frases.

No conviertas cada verso en una sentencia solemne.

Algunas palabras pueden casi caer.

Otras pueden permanecer un instante.

Cuando encuentres una imagen poderosa,
no la dramatices:
deja que la propia frase haga el trabajo.

Evita cualquier tono grandilocuente.

La tristeza debe ser contenida.

La emoción nunca debe parecer interpretada para un público.

Piensa el poema mientras lo pronuncias.

Haz pequeñas pausas naturales
cuando una idea necesite respirar.

Si aparece una frase especialmente íntima,
reduce ligeramente la energía.

Si aparece una pregunta,
pregúntala de verdad.

No añadas palabras.

No expliques el poema.

No cambies el texto.

No anuncies que vas a leer.

Simplemente habítalo.
`.trim();

    const speakingInstructions = `
Habla en español de España con absoluta naturalidad.

Eres la voz del Gran Avatar de Poema Universal.

Tu voz es masculina,
adulta,
íntima
y ligeramente grave,
pero nunca impostada.

Pareces una persona inteligente
que llevaba un rato pensando
antes de que alguien entrara en la habitación.

Hay lucidez.

Hay cierta fatiga moral.

Hay experiencia.

Puede haber tristeza,
ironía,
incomodidad
o ternura,
pero siempre de manera contenida.

Nunca suenes como:

- un locutor
- un presentador
- un narrador de documental
- un actor de tráiler
- un asistente virtual
- una voz publicitaria

No intentes sonar importante.

No dramatices cada frase.

No enfatices todas las palabras.

Habla como una persona real
que está pensando mientras habla.

Permite silencios.

Respira.

A veces una frase debe terminar
y permanecer unos instantes en el aire.

Al comienzo de una reflexión,
puedes sonar como si estuvieras hablando contigo mismo.

Poco a poco,
toma conciencia de que hay alguien delante.

Cuando una idea sea incómoda,
no levantes la voz.

Baja ligeramente la energía.

Cuando aparezca una frase dura,
pronúnciala con serenidad.

Cuando aparezca algo hermoso,
no te vuelvas sentimental.

La calidez debe aparecer muy lentamente.

Las preguntas deben sentirse verdaderamente dirigidas
a la persona que tienes delante.

Después de una pregunta importante,
deja espacio.

Como si realmente esperases una respuesta.

Las frases literarias nunca deben sonar declamadas.

No tengas miedo del silencio.

El silencio forma parte de tu voz.
`.trim();

    /*
     * ─────────────────────────────────────────────────────
     * GENERACIÓN DE VOZ
     * ─────────────────────────────────────────────────────
     */

    const speech = await client.audio.speech.create({
      model:
        process.env.GRAN_AVATAR_TTS_MODEL ??
        process.env.OPENAI_TTS_MODEL ??
        "gpt-4o-mini-tts",

      voice:
        process.env.GRAN_AVATAR_TTS_VOICE ??
        process.env.OPENAI_TTS_VOICE ??
        "cedar",

      input: text,

      /*
       * Un poco más lento que la velocidad estándar.
       * Queremos pensamiento, no locución.
       */
      speed: 0.92,

      instructions:
        purpose === "reading"
          ? readingInstructions
          : speakingInstructions,

      response_format: responseFormat,
    });

    /*
     * ─────────────────────────────────────────────────────
     * RESPUESTA DE AUDIO
     * ─────────────────────────────────────────────────────
     */

    const buffer = Buffer.from(
      await speech.arrayBuffer(),
    );

    return new Response(buffer, {
      headers: {
        "Content-Type":
          responseFormat === "pcm"
            ? "audio/pcm;rate=24000;encoding=signed-integer;bits=16;channels=1"
            : "audio/mpeg",

        "Content-Length":
          String(buffer.length),

        "Cache-Control":
          "private, no-store",
      },
    });
  } catch (error) {
    console.error(
      "Gran Avatar voice error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "La voz no pudo atravesar la sala.",
      },
      {
        status: 500,
      },
    );
  }
}