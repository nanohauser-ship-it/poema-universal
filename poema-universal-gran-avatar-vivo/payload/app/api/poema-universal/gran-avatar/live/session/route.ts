import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LIVEAVATAR_API_URL =
  "https://api.liveavatar.com/v1/sessions/token";
const SANDBOX_AVATAR_ID =
  "dd73ea75-1218-4ef3-92ce-606d5f7fbc0a";

function isEnabled(value: string | undefined, fallback: boolean) {
  if (!value) return fallback;
  return ["1", "true", "yes", "si", "sí"].includes(
    value.trim().toLowerCase(),
  );
}

export async function POST() {
  const apiKey = process.env.LIVEAVATAR_API_KEY?.trim();
  const sandbox = isEnabled(
    process.env.GRAN_AVATAR_LIVE_SANDBOX,
    true,
  );
  const avatarId = sandbox
    ? SANDBOX_AVATAR_ID
    : process.env.GRAN_AVATAR_LIVE_AVATAR_ID?.trim();

  if (!apiKey) {
    return NextResponse.json(
      {
        configured: false,
        error:
          "La vida en tiempo real todavía no está configurada.",
      },
      { status: 503 },
    );
  }

  if (!avatarId) {
    return NextResponse.json(
      {
        configured: false,
        error:
          "Falta el identificador privado de la presencia entrenada.",
      },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(LIVEAVATAR_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify({
        avatar_id: avatarId,
        is_sandbox: sandbox,
        max_session_duration: sandbox ? 55 : 300,
        mode: "LITE",
        video_settings: {
          encoding: "H264",
          quality: "high",
        },
      }),
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => null)) as
      | {
          data?: {
            session_id?: string;
            session_token?: string;
          };
          detail?: unknown;
          message?: string;
        }
      | null;

    if (!response.ok || !payload?.data?.session_token) {
      console.error("LiveAvatar token error:", {
        detail: payload?.detail,
        message: payload?.message,
        status: response.status,
      });
      return NextResponse.json(
        {
          configured: true,
          error:
            "La presencia viva no pudo abrir su sesión.",
        },
        { status: response.status >= 400 ? response.status : 502 },
      );
    }

    return NextResponse.json(
      {
        configured: true,
        sandbox,
        sessionId: payload.data.session_id,
        sessionToken: payload.data.session_token,
      },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      },
    );
  } catch (error) {
    console.error("LiveAvatar session error:", error);
    return NextResponse.json(
      {
        configured: true,
        error:
          "La presencia viva no pudo atravesar la red.",
      },
      { status: 502 },
    );
  }
}
