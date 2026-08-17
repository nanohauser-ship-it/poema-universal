import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("cartas")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) throw error;

    return NextResponse.json({ cartas: data });
  } catch (error) {
    console.error("Error obteniendo cartas:", error);

    return NextResponse.json(
      { error: "Error obteniendo cartas" },
      { status: 500 }
    );
  }
}