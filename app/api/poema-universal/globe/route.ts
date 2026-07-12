import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const EDITION_YEAR = 2026;

type CountryRow = {
  id: string;
  iso2: string;
  name: string;
  latitude: number;
  longitude: number;
};

type PoetRow = {
  id: string;
  full_name: string;
  country_id: string;
  city: string | null;
  profile_slug: string | null;
  display_order: number;
};

type SlotRow = {
  status:
    | "reserved"
    | "committed"
    | "confirmed"
    | "published"
    | "withdrawn";
};

type GlobeMember = {
  id: string;
  name: string;
  city?: string;
  profileUrl?: string;
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

  /*
   * La service role se utiliza únicamente dentro del servidor.
   * Nunca debe enviarse al navegador.
   *
   * Es necesaria para consultar poema_universal_slots,
   * porque esa tabla es un registro interno protegido por RLS.
   */
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

    const [
      countriesResult,
      poetsResult,
      slotsResult,
    ] = await Promise.all([
      supabase
        .from("poema_universal_countries")
        .select(
          `
            id,
            iso2,
            name,
            latitude,
            longitude
          `
        )
        .eq("is_active", true)
        .order("name", {
          ascending: true,
        }),

      supabase
        .from("poema_universal_poets")
        .select(
          `
            id,
            full_name,
            country_id,
            city,
            profile_slug,
            display_order
          `
        )
        .eq("edition_year", EDITION_YEAR)
        .eq("status", "confirmed")
        .eq("is_public", true)
        .order("display_order", {
          ascending: true,
        })
        .order("full_name", {
          ascending: true,
        }),

      supabase
        .from("poema_universal_slots")
        .select("status")
        .eq("edition_year", EDITION_YEAR),
    ]);

    if (countriesResult.error) {
      throw new Error(
        `Error al consultar los países: ${countriesResult.error.message}`
      );
    }

    if (poetsResult.error) {
      throw new Error(
        `Error al consultar los poetas: ${poetsResult.error.message}`
      );
    }

    if (slotsResult.error) {
      throw new Error(
        `Error al consultar las plazas: ${slotsResult.error.message}`
      );
    }

    const countries =
      (countriesResult.data ?? []) as CountryRow[];

    const poets =
      (poetsResult.data ?? []) as PoetRow[];

    const slots =
      (slotsResult.data ?? []) as SlotRow[];

    const committedTotal = slots.filter(
      (slot) => slot.status === "committed"
    ).length;

    const confirmedTotal = slots.filter(
      (slot) => slot.status === "confirmed"
    ).length;

    const publishedTotal = slots.filter(
      (slot) => slot.status === "published"
    ).length;

    const reservedTotal = slots.filter(
      (slot) => slot.status === "reserved"
    ).length;

    const withdrawnTotal = slots.filter(
      (slot) => slot.status === "withdrawn"
    ).length;

    const occupiedTotal =
      committedTotal +
      confirmedTotal +
      publishedTotal;

    const totalSlots = slots.length;

    const membersByCountry = new Map<
      string,
      GlobeMember[]
    >();

    for (const poet of poets) {
      const currentMembers =
        membersByCountry.get(poet.country_id) ?? [];

      currentMembers.push({
        id: poet.id,
        name: poet.full_name,

        ...(poet.city
          ? {
              city: poet.city,
            }
          : {}),

        ...(poet.profile_slug
          ? {
              profileUrl: `/poema-universal/poetas/${poet.profile_slug}`,
            }
          : {}),
      });

      membersByCountry.set(
        poet.country_id,
        currentMembers
      );
    }

    const globeCountries = countries.map(
      (country) => {
        const members =
          membersByCountry.get(country.id) ?? [];

        return {
          code: country.iso2.toUpperCase(),
          name: country.name,

          /*
           * Mientras los nombres no estén publicados,
           * el globo muestra "Participación confirmada"
           * en lugar de inventar una cantidad por país.
           */
          poetCount:
            members.length > 0
              ? members.length
              : null,

          members,
          lat: country.latitude,
          lng: country.longitude,
        };
      }
    );

    return NextResponse.json(
      {
        editionYear: EDITION_YEAR,

        totalSlots,
        occupiedTotal,
        committedTotal,
        confirmedTotal,
        publishedTotal,
        reservedTotal,
        withdrawnTotal,

        countries: globeCountries,
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
      "Error en la API del globo de Poema Universal:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Se produjo un error desconocido.";

    return NextResponse.json(
      {
        error:
          "No ha sido posible cargar los participantes de Poema Universal.",

        details:
          process.env.NODE_ENV === "development"
            ? message
            : undefined,
      },
      {
        status: 500,
      }
    );
  }
}