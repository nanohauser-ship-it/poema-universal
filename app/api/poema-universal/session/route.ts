import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@supabase/supabase-js";

export const runtime = "nodejs";

type JsonObject =
  Record<string, unknown>;

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

function cleanRoomId(
  value: unknown,
) {
  const roomId =
    String(
      value ||
      "sala-corazon-vivo",
    ).trim();

  if (
    !roomId ||
    roomId.length > 100
  ) {
    throw new Error(
      "roomId no válido.",
    );
  }

  return roomId;
}

function cleanSessionId(
  value: unknown,
) {
  const sessionId =
    String(
      value || "",
    ).trim();

  const uuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (
    !uuid.test(sessionId)
  ) {
    throw new Error(
      "sessionId no válido.",
    );
  }

  return sessionId;
}

function cleanEventType(
  value: unknown,
) {
  const eventType =
    String(
      value || "",
    )
      .trim()
      .toUpperCase();

  if (
    !eventType ||
    eventType.length > 80
  ) {
    throw new Error(
      "eventType no válido.",
    );
  }

  return eventType;
}

function cleanWords(
  value: unknown,
) {
  if (
    !Array.isArray(value)
  ) {
    return [];
  }

  return value
    .map(
      (item) =>
        String(item)
          .trim()
          .slice(0, 80),
    )
    .filter(Boolean)
    .slice(0, 40);
}

function cleanMetadata(
  value: unknown,
): JsonObject {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return {};
  }

  return value as JsonObject;
}

export async function GET(
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
    const roomId =
      cleanRoomId(
        request
          .nextUrl
          .searchParams
          .get("roomId"),
      );

    const supabase =
      getAdminClient();

    const {
      data,
      error,
    } =
      await supabase
        .from(
          "live_sessions",
        )
        .select("*")
        .eq(
          "room_id",
          roomId,
        )
        .eq(
          "status",
          "live",
        )
        .maybeSingle();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      ok: true,
      session:
        data ?? null,
    });

  } catch (error) {
    console.error(
      "Live session GET:",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "No se pudo consultar la sesión.",
      },
      {
        status: 500,
      },
    );
  }
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

    const action =
      String(
        body.action || "",
      )
        .trim()
        .toLowerCase();

    const supabase =
      getAdminClient();


    // =====================================================
    // START
    // =====================================================

    if (
      action === "start"
    ) {
      const roomId =
        cleanRoomId(
          body.roomId,
        );

      const {
        data:
          existingSession,
        error:
          existingError,
      } =
        await supabase
          .from(
            "live_sessions",
          )
          .select("*")
          .eq(
            "room_id",
            roomId,
          )
          .eq(
            "status",
            "live",
          )
          .maybeSingle();

      if (existingError) {
        throw existingError;
      }

      if (
        existingSession
      ) {
        return NextResponse.json({
          ok: true,
          reused: true,
          session:
            existingSession,
        });
      }

      const {
        data:
          session,
        error:
          insertError,
      } =
        await supabase
          .from(
            "live_sessions",
          )
          .insert({
            room_id:
              roomId,
            status:
              "live",
            metadata:
              cleanMetadata(
                body.metadata,
              ),
          })
          .select()
          .single();

      if (insertError) {
        throw insertError;
      }

      const {
        error:
          eventError,
      } =
        await supabase
          .from(
            "live_session_events",
          )
          .insert({
            session_id:
              session.id,
            event_type:
              "SESSION_STARTED",
            payload: {
              room_id:
                roomId,
            },
          });

      if (eventError) {
        throw eventError;
      }

      return NextResponse.json({
        ok: true,
        reused: false,
        session,
      });
    }


    // =====================================================
    // EVENT
    // =====================================================

    if (
      action === "event"
    ) {
      const sessionId =
        cleanSessionId(
          body.sessionId,
        );

      const eventType =
        cleanEventType(
          body.eventType,
        );

      const {
        data:
          session,
        error:
          sessionError,
      } =
        await supabase
          .from(
            "live_sessions",
          )
          .select(
            "id, status",
          )
          .eq(
            "id",
            sessionId,
          )
          .maybeSingle();

      if (sessionError) {
        throw sessionError;
      }

      if (
        !session
      ) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "La sesión no existe.",
          },
          {
            status: 404,
          },
        );
      }

      if (
        session.status !==
        "live"
      ) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "La sesión está cerrada.",
          },
          {
            status: 409,
          },
        );
      }

      const {
        data:
          event,
        error:
          eventError,
      } =
        await supabase
          .from(
            "live_session_events",
          )
          .insert({
            session_id:
              sessionId,
            event_type:
              eventType,
            payload:
              cleanMetadata(
                body.payload,
              ),
          })
          .select()
          .single();

      if (eventError) {
        throw eventError;
      }

      return NextResponse.json({
        ok: true,
        event,
      });
    }


    // =====================================================
    // FINISH
    // =====================================================

    if (
      action === "finish"
    ) {
      const sessionId =
        cleanSessionId(
          body.sessionId,
        );

      const peakPresence =
        Math.max(
          0,
          Math.round(
            Number(
              body.peakPresence ??
              0,
            ) || 0,
          ),
        );

      const messageCount =
        Math.max(
          0,
          Math.round(
            Number(
              body.messageCount ??
              0,
            ) || 0,
          ),
        );

      const pulseNumber =
        Number(
          body.finalPulse,
        );

      const intensityNumber =
        Number(
          body.finalIntensity,
        );

      const finalPulse =
        Number.isFinite(
          pulseNumber,
        )
          ? Math.round(
              pulseNumber,
            )
          : null;

      const finalIntensity =
        Number.isFinite(
          intensityNumber,
        )
          ? Math.max(
              0,
              Math.min(
                1,
                intensityNumber,
              ),
            )
          : null;

      const finalEmotionalState =
        typeof
          body.finalEmotionalState ===
        "string"
          ? body
              .finalEmotionalState
              .trim()
              .slice(
                0,
                80,
              )
          : null;

      const endedAt =
        new Date()
          .toISOString();

      const patch = {
        status:
          "closed",
        ended_at:
          endedAt,
        updated_at:
          endedAt,

        peak_presence:
          peakPresence,

        message_count:
          messageCount,

        final_pulse:
          finalPulse,

        final_emotional_state:
          finalEmotionalState,

        final_intensity:
          finalIntensity,

        dominant_words:
          cleanWords(
            body.dominantWords,
          ),

        metadata:
          cleanMetadata(
            body.metadata,
          ),
      };

      const {
        data:
          session,
        error:
          updateError,
      } =
        await supabase
          .from(
            "live_sessions",
          )
          .update(patch)
          .eq(
            "id",
            sessionId,
          )
          .eq(
            "status",
            "live",
          )
          .select()
          .maybeSingle();

      if (updateError) {
        throw updateError;
      }

      if (
        !session
      ) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "No existe una sesión abierta con ese id.",
          },
          {
            status: 409,
          },
        );
      }

      const {
        error:
          eventError,
      } =
        await supabase
          .from(
            "live_session_events",
          )
          .insert({
            session_id:
              sessionId,
            event_type:
              "SESSION_ENDED",
            payload: {
              peak_presence:
                peakPresence,

              message_count:
                messageCount,

              final_pulse:
                finalPulse,

              final_emotional_state:
                finalEmotionalState,

              final_intensity:
                finalIntensity,

              dominant_words:
                cleanWords(
                  body.dominantWords,
                ),
            },
          });

      if (eventError) {
        throw eventError;
      }

      return NextResponse.json({
        ok: true,
        session,
      });
    }


    return NextResponse.json(
      {
        ok: false,
        error:
          "Acción no válida.",
      },
      {
        status: 400,
      },
    );

  } catch (error) {
    console.error(
      "Live session archive error:",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "No se pudo modificar el Archivo de Sesiones.",
      },
      {
        status: 500,
      },
    );
  }
}
