import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("antologia")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { titulo, poema, autor } = body;

    if (!poema || !poema.trim()) {
      return NextResponse.json({ error: "Poema vacío" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("antologia")
      .insert({
        titulo: titulo || "Poema seleccionado",
        poema,
        autor: autor || null,
      })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error publicando en Antología" },
      { status: 500 }
    );
  }
}