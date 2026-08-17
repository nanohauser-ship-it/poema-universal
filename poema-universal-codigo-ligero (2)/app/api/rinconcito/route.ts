import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("rinconcito")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const mensaje = formData.get("mensaje") as string | null;
    const foto = formData.get("foto") as File | null;

    if (!mensaje || !mensaje.trim()) {
      return NextResponse.json({ error: "Mensaje vacío" }, { status: 400 });
    }

    let fotoUrl: string | null = null;

    if (foto) {
      const extension = foto.name.split(".").pop() || "jpg";
      const nombreArchivo = `${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("rinconcito-fotos")
        .upload(nombreArchivo, foto);

      if (uploadError) {
        return NextResponse.json(
          { error: uploadError.message },
          { status: 500 }
        );
      }

      const { data } = supabase.storage
        .from("rinconcito-fotos")
        .getPublicUrl(nombreArchivo);

      fotoUrl = data.publicUrl;
    }

    const { data, error } = await supabase
      .from("rinconcito")
      .insert({
        mensaje,
        foto: fotoUrl,
      })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error guardando El Rinconcito" },
      { status: 500 }
    );
  }
}