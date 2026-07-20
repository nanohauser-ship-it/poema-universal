import type {
  MatrixAnalysis,
  MatrixAnalyzeResponse,
  MatrixInput,
  MatrixSymbolResponse,
} from "./matrix-contract";

async function readError(
  response: Response
) {
  try {
    const data = await response.json() as {
      error?: string;
    };

    return (
      data.error ??
      `La petición falló con estado ${response.status}.`
    );
  } catch {
    return (
      `La petición falló con estado ${response.status}.`
    );
  }
}

export async function analyzeWithMatrix(
  input: MatrixInput,
  signal?: AbortSignal
): Promise<MatrixAnalysis> {
  const response = await fetch(
    "/api/poema-universal/matriz/analyze",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
      cache: "no-store",
      signal,
    }
  );

  if (!response.ok) {
    throw new Error(
      await readError(response)
    );
  }

  const data =
    await response.json() as
      MatrixAnalyzeResponse;

  return data.analysis;
}

export async function generateMatrixSymbol(
  symbolPrompt: string,
  signal?: AbortSignal
): Promise<string> {
  const response = await fetch(
    "/api/poema-universal/matriz/symbol",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symbolPrompt,
      }),
      cache: "no-store",
      signal,
    }
  );

  if (!response.ok) {
    throw new Error(
      await readError(response)
    );
  }

  const data =
    await response.json() as
      MatrixSymbolResponse;

  return data.imageDataUrl;
}
