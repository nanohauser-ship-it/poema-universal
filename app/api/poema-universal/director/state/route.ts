import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@supabase/supabase-js";

function getAdminClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
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
    received === expected,
  );
}

export async function POST(
  request: NextRequest,
) {
  if (!authorized(request)) {
    return NextResponse.json(
      {
        ok: false,
        error: "No autorizado.",
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
      );

    const patch: {
      blackout?: boolean;
      scene?: string;
      updated_at: string;
    } = {
      updated_at:
        new Date().toISOString(),
    };

    if (
      typeof body.blackout ===
      "boolean"
    ) {
      patch.blackout =
        body.blackout;
    }

    if (
      typeof body.scene ===
      "string"
    ) {
      patch.scene =
        body.scene;
    }

    const supabase =
      getAdminClient();

    const {
      data,
      error,
    } =
      await supabase
        .from(
          "director_sessions",
        )
        .update(patch)
        .eq(
          "room_id",
          roomId,
        )
        .select()
        .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      ok: true,
      state: data,
    });
  } catch (error) {
    console.error(
      "Director state error:",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "No se pudo actualizar el estado del Director.",
      },
      {
        status: 500,
      },
    );
  }
}
