import { NextResponse } from "next/server";
import { getBootstrap } from "@/lib/embrion/repository";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getBootstrap(), {
    headers: { "Cache-Control": "no-store" },
  });
}
