import {
  NextResponse,
} from "next/server";

import {
  CORAZON_COOKIE,
  createCorazonSession,
  verifyCorazonPassword,
} from "../../../../lib/corazonVivoAuth";

export const runtime =
  "nodejs";

export async function POST(
  request: Request,
) {
  let body:
    | {
        password?: string;
      }
    | undefined;

  try {
    body =
      await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
      },
      {
        status: 400,
      },
    );
  }

  const password =
    body?.password ?? "";

  if (
    !verifyCorazonPassword(
      password,
    )
  ) {
    /*
     * No explicamos si falla
     * usuario, contraseña
     * o configuración.
     */
    return NextResponse.json(
      {
        ok: false,
        message:
          "Acceso no autorizado.",
      },
      {
        status: 401,
      },
    );
  }

  const response =
    NextResponse.json({
      ok: true,
    });

  response.cookies.set(
    CORAZON_COOKIE,
    createCorazonSession(),
    {
      httpOnly: true,
      sameSite: "strict",

      secure:
        process.env.NODE_ENV ===
        "production",

      /*
       * La autorización dura
       * 12 horas.
       */
      maxAge:
        60 * 60 * 12,

      path: "/",
    },
  );

  return response;
}
