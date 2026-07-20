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

    const artista_id = String(body.artista_id || "").trim();
    const autor = String(body.autor || "").trim();
    const mensaje = String(body.mensaje || "").trim();

    if (!artista_id || !mensaje) {
      return NextResponse.json(
        { error: "La dedicatoria no puede estar vacía." },
        { status: 400 }
      );
    }

    if (mensaje.length > 500) {
      return NextResponse.json(
        { error: "La dedicatoria no puede superar los 500 caracteres." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("artistas_mensajes")
      .insert({
        artista_id,
        autor: autor || "Anónimo",
        mensaje,
        aprobado: false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      mensaje: "Dedicatoria enviada. Quedará pendiente de aprobación.",
      data,
    });
  } catch {
    return NextResponse.json(
      { error: "No se pudo guardar la dedicatoria." },
      { status: 500 }
    );
  }
}