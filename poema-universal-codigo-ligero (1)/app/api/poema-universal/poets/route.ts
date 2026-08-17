import {
  NextRequest,
  NextResponse,
} from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const EDITION_YEAR = 2026;
const TOTAL_PRESENCES = 60;

type PoetRow = {
  id: string;
  full_name: string;
  country_id: string | null;
  city: string | null;
  profile_slug: string | null;
  display_order: number;
  short_bio: string | null;
  portrait_url: string | null;
  status: "confirmed" | "published";
  avatar_variant: number | null;
  relic_variant: number | null;
};

type CountryRow = {
  id: string;
  name: string;
  iso2: string;
};

type AssignmentBody = {
  position?: unknown;
  avatarVariant?: unknown;
  relicVariant?: unknown;
};

function createServerSupabaseClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "Falta NEXT_PUBLIC_SUPABASE_URL."
    );
  }

  if (!serviceRoleKey) {
    throw new Error(
      "Falta SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );
}

function normalizeVariant(
  value: unknown
): number | null {
  if (value === null) {
    return null;
  }

  const parsed = Number(value);

  if (
    !Number.isInteger(parsed) ||
    parsed < 1 ||
    parsed > TOTAL_PRESENCES
  ) {
    throw new Error(
      "El avatar y la reliquia deben estar entre 1 y 60."
    );
  }

  return parsed;
}

function assertAdministrator(
  request: NextRequest
) {
  const expectedSecret =
    process.env.ADMIN_SECRET;

  const receivedSecret =
    request.headers.get("x-admin-secret");

  if (
    !expectedSecret ||
    receivedSecret !== expectedSecret
  ) {
    throw new Error("UNAUTHORIZED");
  }
}

export async function GET() {
  try {
    const supabase =
      createServerSupabaseClient();

    const [poetsResult, countriesResult] =
      await Promise.all([
        supabase
          .from("poema_universal_poets")
          .select(
            `
              id,
              full_name,
              country_id,
              city,
              profile_slug,
              display_order,
              short_bio,
              portrait_url,
              status,
              avatar_variant,
              relic_variant
            `
          )
          .eq("edition_year", EDITION_YEAR)
          .eq("is_public", true)
          .in("status", [
            "confirmed",
            "published",
          ])
          .order("display_order", {
            ascending: true,
          }),

        supabase
          .from("poema_universal_countries")
          .select("id, name, iso2"),
      ]);

    if (poetsResult.error) {
      throw new Error(
        poetsResult.error.message
      );
    }

    if (countriesResult.error) {
      throw new Error(
        countriesResult.error.message
      );
    }

    const poets =
      (poetsResult.data ?? []) as PoetRow[];

    const countries =
      (countriesResult.data ?? []) as CountryRow[];

    const countryById = new Map(
      countries.map((country) => [
        country.id,
        country,
      ])
    );

    const publicProfiles = poets.map(
      (poet) => {
        const country = poet.country_id
          ? countryById.get(poet.country_id)
          : undefined;

        return {
          id: poet.id,
          position: poet.display_order,
          name: poet.full_name,
          country:
            country?.name ??
            "Territorio por confirmar",
          countryCode:
            country?.iso2 ?? null,
          city: poet.city,
          shortBio: poet.short_bio,
          portraitUrl: poet.portrait_url,
          status: poet.status,
          profileSlug: poet.profile_slug,
          avatarVariant:
            poet.avatar_variant,
          relicVariant:
            poet.relic_variant,
        };
      }
    );

    return NextResponse.json(
      {
        editionYear: EDITION_YEAR,
        poets: publicProfiles,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error(
      "Error en la API de perfiles:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Error desconocido.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest
) {
  try {
    assertAdministrator(request);

    const body =
      (await request.json()) as AssignmentBody;

    const position = Number(body.position);

    if (
      !Number.isInteger(position) ||
      position < 1 ||
      position > TOTAL_PRESENCES
    ) {
      return NextResponse.json(
        {
          error:
            "La posición debe estar entre 1 y 60.",
        },
        { status: 400 }
      );
    }

    const avatarVariant =
      normalizeVariant(body.avatarVariant);

    const relicVariant =
      normalizeVariant(body.relicVariant);

    const supabase =
      createServerSupabaseClient();

    const { data, error } = await supabase
      .from("poema_universal_poets")
      .update({
        avatar_variant: avatarVariant,
        relic_variant: relicVariant,
      })
      .eq("edition_year", EDITION_YEAR)
      .eq("display_order", position)
      .select(
        `
          id,
          display_order,
          avatar_variant,
          relic_variant
        `
      )
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return NextResponse.json(
        {
          error:
            "No existe un poeta asignado a esa posición.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      assignment: {
        position: data.display_order,
        avatarVariant:
          data.avatar_variant,
        relicVariant:
          data.relic_variant,
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        {
          error:
            "Autorización administrativa incorrecta.",
        },
        { status: 401 }
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : "Error desconocido.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
