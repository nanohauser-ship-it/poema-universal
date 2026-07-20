import type {
  BorgesInput,
  SymbolicReading,
  SymbolicResponse,
} from "./symbolic-contract";

async function readError(
  response: Response
) {
  try {
    const data =
      await response.json() as {
        error?: string;
      };

    return (
      data.error ??
      `Error ${response.status}`
    );
  } catch {
    return `Error ${response.status}`;
  }
}

export async function analyzeSoul(
  input: BorgesInput,
  signal?: AbortSignal
): Promise<SymbolicReading> {
  const response = await fetch(
    "/api/poema-universal/ojos-de-borges",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
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
      SymbolicResponse;

  return data.reading;
}
