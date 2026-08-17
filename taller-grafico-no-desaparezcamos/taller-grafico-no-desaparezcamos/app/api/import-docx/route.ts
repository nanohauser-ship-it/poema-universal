import { NextResponse } from "next/server";
import mammoth from "mammoth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Falta el archivo." }, { status: 400 });
    }

    const name = file.name.toLowerCase();
    if (name.endsWith(".txt")) {
      const text = await file.text();
      return NextResponse.json({ text, paragraphs: splitParagraphs(text) });
    }

    if (!name.endsWith(".docx")) {
      return NextResponse.json({ error: "Usa un archivo .docx o .txt." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ buffer: Buffer.from(arrayBuffer) });
    const text = result.value;
    return NextResponse.json({ text, paragraphs: splitParagraphs(text) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo leer el archivo." },
      { status: 500 }
    );
  }
}

function splitParagraphs(text: string) {
  return text
    .split(/\n\s*\n|\r?\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 20);
}
