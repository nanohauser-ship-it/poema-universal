import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function comprobarClave(clave: string) {
  if (process.env.ADMIN_SECRET && clave !== process.env.ADMIN_SECRET) {
    return false;
  }

  return true;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const clave = String(body.clave || "");
    const accion = String(body.accion || "");
    const id = String(body.id || "");

    if (!comprobarClave(clave)) {
      return NextResponse.json(
        { error: "Clave incorrecta." },
        { status: 401 }
      );
    }

    if (accion === "listar") {
      const { data, error } = await supabase
        .from("artistas_mensajes")
        .select(
          `
          id,
          artista_id,
          autor,
          mensaje,
          aprobado,
          created_at,
          artistas (
            nombre
          )
        `
        )
        .eq("aprobado", false)
        .order("created_at", { ascending: false });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data || []);
    }

    if (accion === "aprobar") {
      if (!id) {
        return NextResponse.json(
          { error: "Falta el id del mensaje." },
          { status: 400 }
        );
      }

      const { error } = await supabase
        .from("artistas_mensajes")
        .update({ aprobado: true })
        .eq("id", id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ ok: true });
    }

    if (accion === "eliminar") {
      if (!id) {
        return NextResponse.json(
          { error: "Falta el id del mensaje." },
          { status: 400 }
        );
      }

      const { error } = await supabase
        .from("artistas_mensajes")
        .delete()
        .eq("id", id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      { error: "Acción no válida." },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { error: "No se pudo gestionar la dedicatoria." },
      { status: 500 }
    );
  }
}