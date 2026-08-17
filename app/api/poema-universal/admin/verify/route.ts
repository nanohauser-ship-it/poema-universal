import {
  NextRequest,
  NextResponse,
} from "next/server";

export async function POST(
  request: NextRequest,
) {
  const expected =
    process.env.ADMIN_SECRET;

  const received =
    request.headers.get(
      "x-admin-secret",
    );

  if (
    !expected ||
    !received ||
    received !== expected
  ) {
    return NextResponse.json(
      { ok: false },
      { status: 401 },
    );
  }

  return NextResponse.json({
    ok: true,
  });
}
