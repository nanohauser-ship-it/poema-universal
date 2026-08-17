import { desc, eq } from "drizzle-orm";
import { ensureVoiceStorage, getDb, getRuntimeBindings } from "../../../db";
import { voices } from "../../../db/schema";

export const dynamic = "force-dynamic";

const MAX_SIZE = 40 * 1024 * 1024;
const ALLOWED_EXTENSIONS = /\.(mp3|wav|m4a|aac|ogg|webm)$/i;

function safeFileName(value: string) {
  const normalized = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return normalized.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").slice(0, 120) || "voice-audio";
}

function errorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "Error inesperado";
  if (message.includes("no such table")) return "El archivo de voces todavía se está preparando. Vuelve a intentarlo en un momento.";
  return message;
}

export async function GET() {
  try {
    await ensureVoiceStorage();
    const db = getDb();
    const rows = await db
      .select({
        id: voices.id,
        name: voices.name,
        place: voices.place,
        language: voices.language,
        excerpt: voices.excerpt,
        fileName: voices.fileName,
        mimeType: voices.mimeType,
        size: voices.size,
        createdAt: voices.createdAt,
      })
      .from(voices)
      .orderBy(desc(voices.createdAt));
    return Response.json({ voices: rows }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return Response.json({ error: errorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const audio = form.get("audio");
    if (!(audio instanceof File)) return Response.json({ error: "Falta el archivo de audio" }, { status: 400 });
    if (audio.size <= 0 || audio.size > MAX_SIZE) return Response.json({ error: "El audio debe ocupar menos de 40 MB" }, { status: 400 });
    if (!audio.type.startsWith("audio/") && !ALLOWED_EXTENSIONS.test(audio.name)) {
      return Response.json({ error: "El formato de audio no es compatible" }, { status: 415 });
    }

    const id = crypto.randomUUID();
    const key = `voices/${id}/${safeFileName(audio.name)}`;
    const name = String(form.get("name") || "Voz sin nombre").trim().slice(0, 120) || "Voz sin nombre";
    const place = String(form.get("place") || "").trim().slice(0, 160);
    const language = String(form.get("language") || "").trim().slice(0, 80);
    const excerpt = String(form.get("excerpt") || "").trim().slice(0, 800);

    await ensureVoiceStorage();
    const bucket = getRuntimeBindings().BUCKET;
    await bucket.put(key, audio.stream(), {
      httpMetadata: { contentType: audio.type || "application/octet-stream" },
      customMetadata: { originalName: audio.name },
    });

    try {
      const db = getDb();
      const [voice] = await db.insert(voices).values({
        id,
        name,
        place,
        language,
        excerpt,
        fileName: audio.name,
        storageKey: key,
        mimeType: audio.type || "application/octet-stream",
        size: audio.size,
      }).returning();
      return Response.json({ voice }, { status: 201 });
    } catch (databaseError) {
      await bucket.delete(key);
      throw databaseError;
    }
  } catch (error) {
    return Response.json({ error: errorMessage(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return Response.json({ error: "Falta la voz que deseas retirar" }, { status: 400 });
    await ensureVoiceStorage();
    const db = getDb();
    const [voice] = await db.select({ storageKey: voices.storageKey }).from(voices).where(eq(voices.id, id)).limit(1);
    if (!voice) return Response.json({ error: "La voz no existe" }, { status: 404 });
    await getRuntimeBindings().BUCKET.delete(voice.storageKey);
    await db.delete(voices).where(eq(voices.id, id));
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: errorMessage(error) }, { status: 500 });
  }
}
