import { NextResponse } from "next/server";
import { comparePeriods } from "@/lib/embrion/analysis";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { leftId?: unknown; rightId?: unknown } | null;
  const leftId = typeof body?.leftId === "string" ? body.leftId : "";
  const rightId = typeof body?.rightId === "string" ? body.rightId : "";
  const result = comparePeriods(leftId, rightId);
  if (!result) {
    return NextResponse.json({ error: "Selecciona dos periodos distintos y válidos." }, { status: 400 });
  }
  return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
}
