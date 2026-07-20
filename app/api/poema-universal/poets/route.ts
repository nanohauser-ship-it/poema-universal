import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const EDITION_YEAR = 2026;

type PoetRow = {
  id: string;
  full_name: string;
  country_id: string | null;
  city: string | null;
  profile_slug: string | null;
  display_order: number;
  short_bio: string;
  portrait_url: string | null;
  status: "confirmed" | "published";
};

type CountryRow = {
  id: string;
  name: string;
  iso2: string;
};

function createServerSupabaseClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "Falta NEXT_PUBLIC_SUPABASE_URL en .env.local."
    );
  }

  if (!serviceRoleKey) {
    throw new Error(
      "Falta SUPABASE_SERVICE_ROLE_KEY en .env.local."
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

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

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
              status
            `
          )
          .eq("edition_year", EDITION_YEAR)
          .eq("is_public", true)
          .in("status", [
            "confirmed",
            "published",
          ])
          .not("short_bio", "is", null)
          .order("display_order", {
            ascending: true,
          }),

        supabase
          .from("poema_universal_countries")
          .select("id, name, iso2"),
      ]);

    if (poetsResult.error) {
      throw new Error(
        `Error al consultar los perfiles: ${poetsResult.error.message}`
      );
    }

    if (countriesResult.error) {
      throw new Error(
        `Error al consultar los países: ${countriesResult.error.message}`
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

    const publicProfiles = poets.map((poet) => {
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
        countryCode: country?.iso2 ?? null,
        city: poet.city,
        shortBio: poet.short_bio,
        portraitUrl: poet.portrait_url,
        status: poet.status,
        profileSlug: poet.profile_slug,
      };
    });

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
      "Error en la API de perfiles de Poema Universal:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Se produjo un error desconocido.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
