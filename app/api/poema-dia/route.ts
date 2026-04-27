import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const hoy = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("poemas")
    .select("*")
    .eq("fecha", hoy)
    .single();

  if (error) {
    return NextResponse.json({ poema: null });
  }

  return NextResponse.json({ poema: data });
}