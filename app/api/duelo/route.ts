import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  const { data, error } = await supabase
    .from("duelo")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const nombre = String(body.nombre || "");
    const echo_de_menos = String(body.echo_de_menos || "");
    const agradezco = String(body.agradezco || "");
    const necesito_decir = String(body.necesito_decir || "");

    if (
      !nombre.trim() &&
      !echo_de_menos.trim() &&
      !agradezco.trim() &&
      !necesito_decir.trim()
    ) {
      return NextResponse.json(
        { error: "Escribe algo antes de guardar la memoria." },
        { status: 400 },
      );
    }

    const { error } = await supabase.from("duelo").insert({
      nombre,
      echo_de_menos,
      agradezco,
      necesito_decir,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Ha ocurrido un error." },
      { status: 500 },
    );
  }
}