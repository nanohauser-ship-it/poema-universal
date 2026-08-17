import { eq } from "drizzle-orm";
import { ensureVoiceStorage, getDb, getRuntimeBindings } from "../../../db";
import { voices } from "../../../db/schema";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return new Response("Falta el identificador de la voz", { status: 400 });

  await ensureVoiceStorage();
  const db = getDb();
  const [voice] = await db
    .select({ storageKey: voices.storageKey, mimeType: voices.mimeType, fileName: voices.fileName })
    .from(voices)
    .where(eq(voices.id, id))
    .limit(1);
  if (!voice) return new Response("Voz no encontrada", { status: 404 });

  const object = await getRuntimeBindings().BUCKET.get(voice.storageKey);
  if (!object) return new Response("Audio no encontrado", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Content-Type", voice.mimeType);
  headers.set("Content-Disposition", `inline; filename*=UTF-8''${encodeURIComponent(voice.fileName)}`);
  headers.set("Cache-Control", "private, max-age=3600");
  headers.set("Accept-Ranges", "bytes");
  return new Response(object.body, { headers });
}
