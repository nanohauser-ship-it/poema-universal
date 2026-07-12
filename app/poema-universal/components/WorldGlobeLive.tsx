"use client";

import { useEffect, useState } from "react";

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

const FALLBACK_COUNTRIES: GlobeCountry[] = [
  {
    code: "CL",
    name: "Chile",
    poetCount: null,
    members: [],
    lat: -33.4489,
    lng: -70.6693,
  },
  {
    code: "MX",
    name: "México",
    poetCount: null,
    members: [],
    lat: 19.4326,
    lng: -99.1332,
  },
];

export default function WorldGlobeLive() {
  const [globeData, setGlobeData] =
    useState<GlobeApiResponse | null>(null);

  useEffect(() => {
    const controller = new AbortController();

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

        if (!Array.isArray(result.countries)) {
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

  return (
    <WorldGlobe
      participatingCountries={
        globeData?.countries ??
        FALLBACK_COUNTRIES
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