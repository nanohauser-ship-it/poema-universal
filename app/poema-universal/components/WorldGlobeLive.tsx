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
