import { NextResponse } from "next/server";
import { getEvidenceBundle } from "@/lib/embrion/evidence";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ claimId: string }> }) {
  const { claimId } = await context.params;
  const bundle = getEvidenceBundle(claimId);
  if (!bundle) {
    return NextResponse.json({ error: "Afirmación no encontrada." }, { status: 404 });
  }
  return NextResponse.json(bundle, { headers: { "Cache-Control": "no-store" } });
}
