const SITE_HTML = __SITE_HTML__;
let schemaReady = null;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
}

function safeFileName(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").slice(0, 120) || "voice-audio";
}

async function ensureSchema(env) {
  if (!schemaReady) {
    schemaReady = env.DB.batch([
      env.DB.prepare("CREATE TABLE IF NOT EXISTS voices (id text PRIMARY KEY NOT NULL, name text NOT NULL, place text DEFAULT '' NOT NULL, language text DEFAULT '' NOT NULL, excerpt text DEFAULT '' NOT NULL, file_name text NOT NULL, storage_key text NOT NULL UNIQUE, mime_type text NOT NULL, size integer NOT NULL, created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL)"),
      env.DB.prepare("CREATE INDEX IF NOT EXISTS voices_created_at_idx ON voices (created_at)"),
    ]).catch((error) => { schemaReady = null; throw error; });
  }
  return schemaReady;
}

async function listVoices(env) {
  await ensureSchema(env);
  const result = await env.DB.prepare("SELECT id, name, place, language, excerpt, file_name AS fileName, mime_type AS mimeType, size, created_at AS createdAt FROM voices ORDER BY created_at DESC").all();
  return json({ voices: result.results || [] });
}

async function addVoice(request, env) {
  await ensureSchema(env);
  const form = await request.formData();
  const audio = form.get("audio");
  if (!(audio instanceof File)) return json({ error: "Falta el archivo de audio" }, 400);
  if (audio.size <= 0 || audio.size > 40 * 1024 * 1024) return json({ error: "El audio debe ocupar menos de 40 MB" }, 400);
  if (!audio.type.startsWith("audio/") && !/\.(mp3|wav|m4a|aac|ogg|webm)$/i.test(audio.name)) return json({ error: "El formato de audio no es compatible" }, 415);
  const id = crypto.randomUUID();
  const key = `voices/${id}/${safeFileName(audio.name)}`;
  const name = String(form.get("name") || "Voz sin nombre").trim().slice(0, 120) || "Voz sin nombre";
  const place = String(form.get("place") || "").trim().slice(0, 160);
  const language = String(form.get("language") || "").trim().slice(0, 80);
  const excerpt = String(form.get("excerpt") || "").trim().slice(0, 800);
  await env.BUCKET.put(key, audio.stream(), { httpMetadata: { contentType: audio.type || "application/octet-stream" }, customMetadata: { originalName: audio.name } });
  try {
    await env.DB.prepare("INSERT INTO voices (id,name,place,language,excerpt,file_name,storage_key,mime_type,size) VALUES (?,?,?,?,?,?,?,?,?)").bind(id,name,place,language,excerpt,audio.name,key,audio.type || "application/octet-stream",audio.size).run();
  } catch (error) { await env.BUCKET.delete(key); throw error; }
  return json({ voice: { id, name, place, language, excerpt, fileName: audio.name, mimeType: audio.type, size: audio.size } }, 201);
}

async function deleteVoice(url, env) {
  await ensureSchema(env);
  const id = url.searchParams.get("id");
  if (!id) return json({ error: "Falta la voz que deseas retirar" }, 400);
  const row = await env.DB.prepare("SELECT storage_key AS storageKey FROM voices WHERE id = ? LIMIT 1").bind(id).first();
  if (!row) return json({ error: "La voz no existe" }, 404);
  await env.BUCKET.delete(row.storageKey);
  await env.DB.prepare("DELETE FROM voices WHERE id = ?").bind(id).run();
  return json({ ok: true });
}

async function audioResponse(url, env) {
  await ensureSchema(env);
  const id = url.searchParams.get("id");
  if (!id) return new Response("Falta el identificador de la voz", { status: 400 });
  const voice = await env.DB.prepare("SELECT storage_key AS storageKey, mime_type AS mimeType, file_name AS fileName FROM voices WHERE id = ? LIMIT 1").bind(id).first();
  if (!voice) return new Response("Voz no encontrada", { status: 404 });
  const object = await env.BUCKET.get(voice.storageKey);
  if (!object) return new Response("Audio no encontrado", { status: 404 });
  const headers = new Headers(); object.writeHttpMetadata(headers); headers.set("Content-Type", voice.mimeType); headers.set("Content-Disposition", `inline; filename*=UTF-8''${encodeURIComponent(voice.fileName)}`); headers.set("Cache-Control", "private, max-age=3600");
  return new Response(object.body, { headers });
}

const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      if (url.pathname === "/api/voices" && request.method === "GET") return listVoices(env);
      if (url.pathname === "/api/voices" && request.method === "POST") return addVoice(request, env);
      if (url.pathname === "/api/voices" && request.method === "DELETE") return deleteVoice(url, env);
      if (url.pathname === "/api/audio" && request.method === "GET") return audioResponse(url, env);
      if (url.pathname === "/" && (request.method === "GET" || request.method === "HEAD")) {
        return new Response(request.method === "HEAD" ? null : SITE_HTML, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin" } });
      }
      return new Response("No encontrado", { status: 404 });
    } catch (error) { return json({ error: error instanceof Error ? error.message : "Error inesperado" }, 500); }
  }
};

export default worker;
