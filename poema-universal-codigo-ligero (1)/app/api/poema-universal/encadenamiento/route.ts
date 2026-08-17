import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const EDITION_YEAR = 2026;
const MAX_VOICE_LENGTH = 120;
const MAX_TERRITORY_LENGTH = 120;
const MAX_FRAGMENT_LENGTH = 900;

type VertebraRow = {
  id: string;
  voice: string;
  territory: string;
  fragment: string;
  created_label: string;
  created_at: string;
};

type SubmissionBody = {
  id?: unknown;
  voice?: unknown;
  territory?: unknown;
  fragment?: unknown;
  website?: unknown;
};

function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("SUPABASE_NOT_CONFIGURED");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

function readText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function serializeVertebra(row: VertebraRow) {
  return {
    id: row.id,
    voice: row.voice,
    territory: row.territory,
    fragment: row.fragment,
    createdAt: row.created_label,
    synced: true,
  };
}

function errorResponse(error: unknown) {
  const message =
    error instanceof Error ? error.message : "Error desconocido.";

  if (message === "SUPABASE_NOT_CONFIGURED") {
    return NextResponse.json(
      {
        error:
          "El archivo permanente todavía no está configurado en el servidor.",
      },
      { status: 503 }
    );
  }

  console.error("Error en la Columna de las Voces:", error);

  return NextResponse.json(
    { error: "No se pudo acceder al archivo permanente." },
    { status: 500 }
  );
}

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("poema_universal_vertebrae")
      .select(
        "id, voice, territory, fragment, created_label, created_at"
      )
      .eq("edition_year", EDITION_YEAR)
      .eq("is_public", true)
      .order("display_order", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(
      {
        editionYear: EDITION_YEAR,
        vertebrae: ((data ?? []) as VertebraRow[]).map(serializeVertebra),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SubmissionBody;
    const id = readText(body.id);
    const voice = readText(body.voice);
    const territory = readText(body.territory);
    const fragment = readText(body.fragment);
    const website = readText(body.website);

    if (website) {
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    if (!/^voz-[0-9a-f-]{36}$/i.test(id)) {
      return NextResponse.json(
        { error: "El identificador de la voz no es válido." },
        { status: 400 }
      );
    }

    if (!voice || !territory || !fragment) {
      return NextResponse.json(
        { error: "Completa el nombre, el territorio y el fragmento." },
        { status: 400 }
      );
    }

    if (
      voice.length > MAX_VOICE_LENGTH ||
      territory.length > MAX_TERRITORY_LENGTH ||
      fragment.length > MAX_FRAGMENT_LENGTH
    ) {
      return NextResponse.json(
        { error: "Uno de los campos supera la extensión permitida." },
        { status: 400 }
      );
    }

    const createdLabel = new Intl.DateTimeFormat("es-ES", {
      dateStyle: "long",
      timeZone: "Europe/Madrid",
    }).format(new Date());

    const supabase = createServerSupabaseClient();
    const insertion = await supabase
      .from("poema_universal_vertebrae")
      .insert({
        id,
        edition_year: EDITION_YEAR,
        voice,
        territory,
        fragment,
        created_label: createdLabel,
        is_public: true,
      })
      .select(
        "id, voice, territory, fragment, created_label, created_at"
      )
      .single();

    if (insertion.error?.code === "23505") {
      const existing = await supabase
        .from("poema_universal_vertebrae")
        .select(
          "id, voice, territory, fragment, created_label, created_at"
        )
        .eq("id", id)
        .maybeSingle();

      if (existing.error) {
        throw new Error(existing.error.message);
      }

      const row = existing.data as VertebraRow | null;
      const isSameVoice =
        row?.voice === voice &&
        row.territory === territory &&
        row.fragment === fragment;

      if (!row || !isSameVoice) {
        return NextResponse.json(
          { error: "Esa incorporación ya existe en el archivo." },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          ok: true,
          vertebra: serializeVertebra(row),
        },
        { status: 200 }
      );
    }

    if (insertion.error) {
      throw new Error(insertion.error.message);
    }

    return NextResponse.json(
      {
        ok: true,
        vertebra: serializeVertebra(insertion.data as VertebraRow),
      },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(error);
  }
}
