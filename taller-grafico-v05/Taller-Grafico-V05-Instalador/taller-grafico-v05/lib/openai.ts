export async function openaiStructured<T>(args: {
  input: string;
  schemaName: string;
  schema: Record<string, unknown>;
  maxOutputTokens?: number;
}): Promise<T> {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY no está configurada.");
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_TEXT_MODEL || "gpt-5.6",
      reasoning: { effort: "medium" },
      max_output_tokens: args.maxOutputTokens || 4000,
      input: args.input,
      text: {
        format: {
          type: "json_schema",
          name: args.schemaName,
          strict: true,
          schema: args.schema
        }
      }
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI ${response.status}: ${detail.slice(0, 900)}`);
  }
  const data = await response.json();
  const text = extractOutputText(data);
  if (!text) throw new Error("OpenAI respondió sin texto estructurado.");
  return JSON.parse(text) as T;
}

function extractOutputText(data: any): string {
  if (typeof data?.output_text === "string") return data.output_text;
  const chunks: string[] = [];
  for (const item of data?.output ?? []) {
    for (const content of item?.content ?? []) {
      if (typeof content?.text === "string") chunks.push(content.text);
    }
  }
  return chunks.join("\n").trim();
}
