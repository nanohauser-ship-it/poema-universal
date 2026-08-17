import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasKey: Boolean(process.env.OPENAI_API_KEY),
    textModel: process.env.OPENAI_TEXT_MODEL || "gpt-5.6",
    imageModel: process.env.OPENAI_IMAGE_MODEL || "gpt-image-2"
  });
}
