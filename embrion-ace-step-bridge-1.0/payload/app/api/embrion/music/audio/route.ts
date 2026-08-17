const ACE_STEP_URL = (process.env.ACE_STEP_URL || "http://127.0.0.1:8001").replace(/\/$/, "");

export async function GET(request: Request) {
  const url = new URL(request.url);
  const remotePath = String(url.searchParams.get("path") || "");

  if (!remotePath.startsWith("/v1/audio")) {
    return new Response("Ruta de audio no válida.", { status: 400 });
  }

  const upstream = await fetch(`${ACE_STEP_URL}${remotePath}`, { cache: "no-store" });
  if (!upstream.ok || !upstream.body) {
    return new Response("No pude recuperar el audio de ACE-Step.", { status: 502 });
  }

  const headers = new Headers();
  headers.set("Content-Type", upstream.headers.get("content-type") || "audio/mpeg");
  headers.set("Cache-Control", "no-store");
  headers.set("Content-Disposition", "inline");

  return new Response(upstream.body, { status: 200, headers });
}
