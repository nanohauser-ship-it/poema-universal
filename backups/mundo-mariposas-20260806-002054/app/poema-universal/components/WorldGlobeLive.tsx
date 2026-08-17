"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import WorldGlobe from "./WorldGlobe";
import type { GlobeCountry } from "./WorldGlobe";

type GlobeApiResponse = {
  editionYear: number;
  totalSlots: number;
  occupiedTotal: number;
  committedTotal: number;
  confirmedTotal: number;
  publishedTotal: number;
  reservedTotal: number;
  withdrawnTotal: number;
  countries: GlobeCountry[];
};

const INVITED_COUNTRIES: GlobeCountry[] = [
  {
    code: "FR",
    name: "Francia",
    poetCount: null,
    members: [],
    lat: 46.2276,
    lng: 2.2137,
  },
  {
    code: "JP",
    name: "Japón",
    poetCount: null,
    members: [],
    lat: 36.2048,
    lng: 138.2529,
  },

{
    code: "BR",
    name: "Brasil",
    poetCount: null,
    members: [],
    lat: -14.235,
    lng: -51.9253,
  },
{
    code: "NO",
    name: "Noruega",
    poetCount: null,
    members: [],
    lat: 60.472,
    lng: 8.4689,
  },
{
    code: "CO",
    name: "Colombia",
    poetCount: null,
    members: [],
    lat: 4.5709,
    lng: -74.2973,
  },

  {
    id: "argentina",
    slug: "argentina",

    name: "Argentina",
    label: "Argentina",
    country: "Argentina",

    code: "AR",
    countryCode: "AR",
    iso: "AR",
    iso2: "AR",
    isoA2: "AR",
    iso3: "ARG",

    lat: -38.4161,
    lng: -63.6167,
    lon: -63.6167,
    latitude: -38.4161,
    longitude: -63.6167,

    members: [],
    participants: [],
    poets: [],
    voices: [],

    active: true,
    illuminated: true,
  } as any,
  {
    id: "rusia",
    slug: "rusia",

    name: "Rusia",
    label: "Rusia",
    country: "Rusia",

    code: "RU",
    countryCode: "RU",
    iso: "RU",
    iso2: "RU",
    isoA2: "RU",
    iso3: "RUS",

    lat: 61.524,
    lng: 105.3188,
    lon: 105.3188,
    latitude: 61.524,
    longitude: 105.3188,

    members: [],
    participants: [],
    poets: [],
    voices: [],

    active: true,
    illuminated: true,
  } as any,
  {
    id: "italia",
    slug: "italia",

    name: "Italia",
    label: "Italia",
    country: "Italia",

    code: "IT",
    countryCode: "IT",
    iso: "IT",
    iso2: "IT",
    isoA2: "IT",
    iso3: "ITA",

    lat: 41.8719,
    lng: 12.5674,
    lon: 12.5674,
    latitude: 41.8719,
    longitude: 12.5674,

    members: [],
    participants: [],
    poets: [],
    voices: [],

    active: true,
    illuminated: true,
  } as any,
  {
    id: "venezuela",
    slug: "venezuela",

    name: "Venezuela",
    label: "Venezuela",
    country: "Venezuela",

    code: "VE",
    countryCode: "VE",
    iso: "VE",
    iso2: "VE",
    isoA2: "VE",
    iso3: "VEN",

    lat: 6.4238,
    lng: -66.5897,
    lon: -66.5897,
    latitude: 6.4238,
    longitude: -66.5897,

    members: [],
    participants: [],
    poets: [],
    voices: [],

    active: true,
    illuminated: true,
  } as any,
];

function normalizeCountryCode(code: string) {
  return code.trim().toUpperCase();
}

function mergeInvitedCountries(
  countries: GlobeCountry[]
): GlobeCountry[] {
  const countriesByCode = new Map<
    string,
    GlobeCountry
  >();

  countries.forEach((country) => {
    const normalizedCode =
      normalizeCountryCode(country.code);

    countriesByCode.set(normalizedCode, {
      ...country,
      code: normalizedCode,
    });
  });

  INVITED_COUNTRIES.forEach(
    (invitedCountry) => {
      const normalizedCode =
        normalizeCountryCode(
          invitedCountry.code
        );

      const existingCountry =
        countriesByCode.get(normalizedCode);

      if (!existingCountry) {
        countriesByCode.set(
          normalizedCode,
          {
            ...invitedCountry,
            code: normalizedCode,
          }
        );

        return;
      }

      countriesByCode.set(
        normalizedCode,
        {
          ...invitedCountry,
          ...existingCountry,
          code: normalizedCode,
          name:
            existingCountry.name ||
            invitedCountry.name,
          lat:
            existingCountry.lat ??
            invitedCountry.lat,
          lng:
            existingCountry.lng ??
            invitedCountry.lng,
          poetCount:
            existingCountry.poetCount ??
            invitedCountry.poetCount,
          members: Array.isArray(
            existingCountry.members
          )
            ? existingCountry.members
            : invitedCountry.members,
        }
      );
    }
  );

  return Array.from(
    countriesByCode.values()
  );
}

export default function WorldGlobeLive() {
  const [globeData, setGlobeData] =
    useState<GlobeApiResponse | null>(null);

  useEffect(() => {
    const controller =
      new AbortController();

    async function loadGlobeData() {
      try {
        const response = await fetch(
          "/api/poema-universal/globe",
          {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Error ${response.status} al cargar los datos del globo.`
          );
        }

        const result =
          (await response.json()) as GlobeApiResponse;

        if (
          !Array.isArray(result.countries)
        ) {
          throw new Error(
            "La API no ha devuelto una lista válida de países."
          );
        }

        setGlobeData(result);
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Error cargando los datos del globo:",
          error
        );
      }
    }

    loadGlobeData();

    return () => {
      controller.abort();
    };
  }, []);

  const participatingCountries =
    useMemo(() => {
      return mergeInvitedCountries(
        globeData?.countries ?? []
      );
    }, [globeData]);

  return (
    <WorldGlobe
      participatingCountries={
        participatingCountries
      }
      occupiedTotal={
        globeData?.occupiedTotal ?? 4
      }
      reservedTotal={
        globeData?.reservedTotal ?? 56
      }
      totalSlots={
        globeData?.totalSlots ?? 60
      }
    />
  );
}
