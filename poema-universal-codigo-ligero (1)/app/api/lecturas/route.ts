import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  const { data, error } = await supabase
    .from("lecturas")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const titulo = String(formData.get("titulo") || "");
    const descripcion = String(formData.get("descripcion") || "");
    const archivo = formData.get("video") as File | null;

    if (!archivo) {
      return NextResponse.json(
        { error: "Falta el vídeo." },
        { status: 400 },
      );
    }

    const bytes = await archivo.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extension = archivo.name.split(".").pop() || "mp4";

    const nombreArchivo = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("lecturas")
      .upload(nombreArchivo, buffer, {
        contentType: archivo.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 },
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("lecturas").getPublicUrl(nombreArchivo);

    const { error: insertError } = await supabase.from("lecturas").insert({
      titulo,
      descripcion,
      video_url: publicUrl,
    });

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Ha ocurrido un error subiendo el vídeo." },
      { status: 500 },
    );
  }
}