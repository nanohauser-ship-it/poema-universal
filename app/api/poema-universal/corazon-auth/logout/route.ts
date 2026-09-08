import {
  NextResponse,
} from "next/server";

import {
  CORAZON_COOKIE,
} from "../../../../lib/corazonVivoAuth";

export async function POST() {
  const response =
    NextResponse.json({
      ok: true,
    });

  response.cookies.set(
    CORAZON_COOKIE,
    "",
    {
      httpOnly: true,
      sameSite: "strict",

      secure:
        process.env.NODE_ENV ===
        "production",

      expires:
        new Date(0),

      path: "/",
    },
  );

  return response;
}
