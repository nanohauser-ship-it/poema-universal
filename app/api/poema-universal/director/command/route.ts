import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@supabase/supabase-js";

export const runtime = "nodejs";

const VALID_COMMANDS =
  new Set([
    "SCENE",
    "BLACKOUT",
    "SILENCE",
    "CAMERA",
    "VIDEO",
    "PROJECT_MESSAGE",
  ]);

function getAdminClient() {
  const url =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  const serviceKey =
    process.env
      .SUPABASE_SERVICE_ROLE_KEY;

  if (
    !url ||
    !serviceKey
  ) {
    throw new Error(
      "Falta configuración Supabase del servidor.",
    );
  }

  return createClient(
    url,
    serviceKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

function authorized(
  request: NextRequest,
) {
  const expected =
    process.env.ADMIN_SECRET;

  const received =
    request.headers.get(
      "x-admin-secret",
    );

  return Boolean(
    expected &&
    received &&
    received === expected
  );
}

function cleanObject(
  value: unknown,
) {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return {};
  }

  return value as
    Record<string, unknown>;
}

export async function POST(
  request: NextRequest,
) {
  if (
    !authorized(request)
  ) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "No autorizado.",
      },
      {
        status: 401,
      },
    );
  }

  try {
    const body =
      await request.json();

    const roomId =
      String(
        body.roomId ||
        "sala-corazon-vivo",
      )
        .trim()
        .slice(0, 100);

    const commandType =
      String(
        body.commandType || "",
      )
        .trim()
        .toUpperCase();

    if (
      !VALID_COMMANDS.has(
        commandType,
      )
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Orden de Director no válida.",
        },
        {
          status: 400,
        },
      );
    }

    const payload =
      cleanObject(
        body.payload,
      );

    const supabase =
      getAdminClient();


    // =============================================
    // SESIÓN ABIERTA, SI EXISTE
    // =============================================

    const {
      data:
        activeSession,
      error:
        sessionError,
    } =
      await supabase
        .from(
          "live_sessions",
        )
        .select("id")
        .eq(
          "room_id",
          roomId,
        )
        .eq(
          "status",
          "live",
        )
        .maybeSingle();

    if (sessionError) {
      throw sessionError;
    }


    // =============================================
    // ESTADO CANÓNICO DEL DIRECTOR
    // =============================================

    if (
      commandType ===
        "BLACKOUT" &&
      typeof payload.active ===
        "boolean"
    ) {
      const {
        error:
          stateError,
      } =
        await supabase
          .from(
            "director_sessions",
          )
          .update({
            blackout:
              payload.active,

            updated_at:
              new Date()
                .toISOString(),
          })
          .eq(
            "room_id",
            roomId,
          );

      if (stateError) {
        throw stateError;
      }
    }

    if (
      commandType ===
        "SCENE" &&
      typeof payload.scene ===
        "string"
    ) {
      const {
        error:
          stateError,
      } =
        await supabase
          .from(
            "director_sessions",
          )
          .update({
            scene:
              payload.scene,

            updated_at:
              new Date()
                .toISOString(),
          })
          .eq(
            "room_id",
            roomId,
          );

      if (stateError) {
        throw stateError;
      }
    }


    // =============================================
    // ORDEN REMOTA
    // =============================================

    const {
      data:
        command,
      error:
        commandError,
    } =
      await supabase
        .from(
          "director_commands",
        )
        .insert({
          room_id:
            roomId,

          session_id:
            activeSession?.id ??
            null,

          command_type:
            commandType,

          payload,
        })
        .select()
        .single();

    if (commandError) {
      throw commandError;
    }


    // =============================================
    // MEMORIA HISTÓRICA
    // =============================================

    if (
      activeSession
    ) {
      const archiveType =
        commandType ===
        "PROJECT_MESSAGE"
          ? "MESSAGE_PROJECTED"

          : commandType ===
            "SCENE"
            ? "SCENE_CHANGED"

            : "DIRECTOR_COMMAND";

      const {
        error:
          archiveError,
      } =
        await supabase
          .from(
            "live_session_events",
          )
          .insert({
            session_id:
              activeSession.id,

            event_type:
              archiveType,

            payload: {
              command:
                commandType,

              ...payload,
            },
          });

      if (archiveError) {
        throw archiveError;
      }
    }


    return NextResponse.json({
      ok: true,

      command,

      archived:
        Boolean(
          activeSession,
        ),

      sessionId:
        activeSession?.id ??
        null,
    });

  } catch (error) {
    console.error(
      "Director command error:",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "No se pudo emitir la orden del Director.",
      },
      {
        status: 500,
      },
    );
  }
}
