import { NextResponse } from "next/server";
import mammoth from "mammoth";
import type { Chapter, ChapterKind, StructuredDocument } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Falta el archivo." }, { status: 400 });
    }

    const name = file.name.toLowerCase();
    let paragraphs: string[] = [];
    let styledBlocks: { text: string; heading: boolean }[] = [];

    if (name.endsWith(".txt")) {
      const text = await file.text();
      paragraphs = splitParagraphs(text);
      styledBlocks = paragraphs.map((text) => ({ text, heading: looksLikeHeading(text) }));
    } else if (name.endsWith(".docx")) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const [raw, html] = await Promise.all([
        mammoth.extractRawText({ buffer }),
        mammoth.convertToHtml(
          { buffer },
          {
            styleMap: [
              "p[style-name='Title'] => h1:fresh",
              "p[style-name='Heading 1'] => h1:fresh",
              "p[style-name='Heading 2'] => h2:fresh",
              "p[style-name='Título 1'] => h1:fresh",
              "p[style-name='Título 2'] => h2:fresh"
            ]
          }
        )
      ]);
      paragraphs = splitParagraphs(raw.value);
      styledBlocks = htmlToBlocks(html.value);
      if (styledBlocks.length < Math.max(3, paragraphs.length / 10)) {
        styledBlocks = paragraphs.map((text) => ({ text, heading: looksLikeHeading(text) }));
      }
    } else {
      return NextResponse.json({ error: "Usa un archivo .docx o .txt." }, { status: 400 });
    }

    const document = buildDocument(file.name, styledBlocks, paragraphs);
    return NextResponse.json({ document });
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
    .map(cleanText)
    .filter((p) => p.length >= 1);
}

function cleanText(text: string) {
  return decodeEntities(text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function htmlToBlocks(html: string) {
  const blocks: { text: string; heading: boolean }[] = [];
  const regex = /<(h1|h2|h3|p)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html))) {
    const text = cleanText(match[2]);
    if (!text) continue;
    const tag = match[1].toLowerCase();
    blocks.push({ text, heading: tag.startsWith("h") || looksLikeHeading(text) });
  }
  return blocks;
}

function decodeEntities(text: string) {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function looksLikeHeading(text: string) {
  const t = text.trim();
  if (/^(pr[oó]logo|ep[ií]logo|cap[ií]tulo|parte|libro|interludio)\b/i.test(t)) return true;
  if (/^(cap[ií]tulo\s+)?[IVXLCDM]{1,8}[.:-]?$/i.test(t)) return true;
  if (/^[IVXLCDM]{1,8}[.:-]\s+.{1,80}$/i.test(t)) return true;
  if (t.length <= 55 && /^[A-ZÁÉÍÓÚÜÑ0-9][A-ZÁÉÍÓÚÜÑ0-9\s.,:;!?¿¡'"()—-]+$/.test(t) && /[A-ZÁÉÍÓÚÜÑ]/.test(t)) return true;
  return false;
}

function classifyHeading(title: string): ChapterKind {
  if (/^pr[oó]logo\b/i.test(title)) return "prologue";
  if (/^ep[ií]logo\b/i.test(title)) return "epilogue";
  if (/^(cap[ií]tulo\b|[IVXLCDM]{1,8}(?:[.:-]|\s|$))/i.test(title)) return "chapter";
  return "section";
}

function buildDocument(filename: string, blocks: { text: string; heading: boolean }[], fallbackParagraphs: string[]): StructuredDocument {
  const chapters: Chapter[] = [];
  let currentTitle = "Preliminares";
  let currentKind: ChapterKind = "frontmatter";
  let current: string[] = [];
  let startedNarrative = false;

  const flush = () => {
    if (!current.length && chapters.length) return;
    const index = chapters.length;
    chapters.push({
      id: `ch-${String(index + 1).padStart(3, "0")}`,
      index,
      title: currentTitle,
      kind: currentKind,
      paragraphs: current.slice(),
      wordCount: current.join(" ").split(/\s+/).filter(Boolean).length
    });
    current = [];
  };

  for (const block of blocks) {
    const structural = block.heading && looksLikeHeading(block.text);
    if (structural) {
      const kind = classifyHeading(block.text);
      if (kind !== "section" || startedNarrative || /^pr[oó]logo/i.test(block.text)) {
        if (current.length || chapters.length === 0) flush();
        currentTitle = block.text;
        currentKind = kind;
        if (kind !== "section") startedNarrative = true;
        continue;
      }
    }
    current.push(block.text);
  }
  if (current.length) flush();

  const useful = chapters.filter((c) => c.paragraphs.length || c.kind !== "frontmatter");
  if (useful.length <= 1 && fallbackParagraphs.length > 20) {
    return fallbackDocument(filename, fallbackParagraphs);
  }

  return {
    title: filename.replace(/\.[^.]+$/, "").trim(),
    filename,
    paragraphCount: useful.reduce((n, c) => n + c.paragraphs.length, 0),
    chapters: useful.map((c, index) => ({ ...c, index, id: `ch-${String(index + 1).padStart(3, "0")}` }))
  };
}

function fallbackDocument(filename: string, paragraphs: string[]): StructuredDocument {
  const chapters: Chapter[] = [];
  let title = "Preliminares";
  let kind: ChapterKind = "frontmatter";
  let current: string[] = [];
  const flush = () => {
    if (!current.length && chapters.length) return;
    const index = chapters.length;
    chapters.push({ id: `ch-${String(index + 1).padStart(3, "0")}`, index, title, kind, paragraphs: current.slice(), wordCount: current.join(" ").split(/\s+/).filter(Boolean).length });
    current = [];
  };
  for (const p of paragraphs) {
    if (looksLikeHeading(p)) {
      flush();
      title = p;
      kind = classifyHeading(p);
    } else current.push(p);
  }
  flush();
  return { title: filename.replace(/\.[^.]+$/, ""), filename, paragraphCount: paragraphs.length, chapters };
}
