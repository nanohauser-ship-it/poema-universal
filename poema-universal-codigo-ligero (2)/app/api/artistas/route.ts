import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const artista_id = String(body.artista_id || "");
    const tipo = String(body.tipo || "");

    if (!artista_id || !["corazon", "vela"].includes(tipo)) {
      return NextResponse.json(
        { error: "Datos incompletos." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("artistas_tributos").insert({
      artista_id,
      tipo,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: tributos, error: countError } = await supabase
      .from("artistas_tributos")
      .select("tipo")
      .eq("artista_id", artista_id);

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    const corazones = tributos.filter((t) => t.tipo === "corazon").length;
    const velas = tributos.filter((t) => t.tipo === "vela").length;

    return NextResponse.json({
      ok: true,
      corazones,
      velas,
    });
  } catch {
    return NextResponse.json(
      { error: "No se pudo guardar el tributo." },
      { status: 500 }
    );
  }
}