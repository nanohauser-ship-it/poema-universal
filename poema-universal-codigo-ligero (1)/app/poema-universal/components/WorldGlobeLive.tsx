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

const TOTAL_VOICES = 60;
const INTEGRATED_VOICES = 58;

/**
 * Cartografía de la edición:
 * 8 presencias reales + 50 identidades literarias.
 *
 * Los países repetidos comparten una misma luz y aumentan
 * su intensidad mediante poetCount.
 */
const POEM_COUNTRIES: GlobeCountry[] = [
  {
    code: "JP",
    name: "Japón",
    poetCount: 2,
    members: [],
    lat: 35.0116,
    lng: 135.7681,
  },
  {
    code: "SN",
    name: "Senegal",
    poetCount: 2,
    members: [],
    lat: 16.0326,
    lng: -16.4818,
  },
  {
    code: "ES",
    name: "España",
    poetCount: 3,
    members: [],
    lat: 42.8782,
    lng: -8.5448,
  },
  {
    code: "MX",
    name: "México",
    poetCount: 2,
    members: [],
    lat: 19.0414,
    lng: -98.2063,
  },
  {
    code: "NO",
    name: "Noruega",
    poetCount: 1,
    members: [],
    lat: 69.6492,
    lng: 18.9553,
  },
  {
    code: "IN",
    name: "India",
    poetCount: 1,
    members: [],
    lat: 22.3072,
    lng: 73.1812,
  },
  {
    code: "CO",
    name: "Colombia",
    poetCount: 2,
    members: [],
    lat: 3.4516,
    lng: -76.532,
  },
  {
    code: "AR",
    name: "Argentina",
    poetCount: 1,
    members: [],
    lat: -31.4201,
    lng: -64.1888,
  },
  {
    code: "KR",
    name: "Corea del Sur",
    poetCount: 1,
    members: [],
    lat: 37.5665,
    lng: 126.978,
  },
  {
    code: "MA",
    name: "Marruecos",
    poetCount: 1,
    members: [],
    lat: 34.0181,
    lng: -5.0078,
  },
  {
    code: "FR",
    name: "Francia",
    poetCount: 1,
    members: [],
    lat: 45.764,
    lng: 4.8357,
  },
  {
    code: "BR",
    name: "Brasil",
    poetCount: 1,
    members: [],
    lat: -8.0476,
    lng: -34.877,
  },
  {
    code: "LB",
    name: "Líbano",
    poetCount: 1,
    members: [],
    lat: 33.8938,
    lng: 35.5018,
  },
  {
    code: "ZA",
    name: "Sudáfrica",
    poetCount: 1,
    members: [],
    lat: -26.2041,
    lng: 28.0473,
  },
  {
    code: "PL",
    name: "Polonia",
    poetCount: 1,
    members: [],
    lat: 51.7592,
    lng: 19.456,
  },
  {
    code: "PE",
    name: "Perú",
    poetCount: 1,
    members: [],
    lat: -13.5319,
    lng: -71.9675,
  },
  {
    code: "IT",
    name: "Italia",
    poetCount: 2,
    members: [],
    lat: 44.4949,
    lng: 11.3426,
  },
  {
    code: "TR",
    name: "Turquía",
    poetCount: 1,
    members: [],
    lat: 38.4237,
    lng: 27.1428,
  },
  {
    code: "ET",
    name: "Etiopía",
    poetCount: 1,
    members: [],
    lat: 8.9806,
    lng: 38.7578,
  },
  {
    code: "PT",
    name: "Portugal",
    poetCount: 1,
    members: [],
    lat: 41.1579,
    lng: -8.6291,
  },
  {
    code: "TH",
    name: "Tailandia",
    poetCount: 1,
    members: [],
    lat: 18.7883,
    lng: 98.9853,
  },
  {
    code: "CA",
    name: "Canadá",
    poetCount: 1,
    members: [],
    lat: 46.8139,
    lng: -71.208,
  },
  {
    code: "DE",
    name: "Alemania",
    poetCount: 1,
    members: [],
    lat: 51.3397,
    lng: 12.3731,
  },
  {
    code: "GH",
    name: "Ghana",
    poetCount: 1,
    members: [],
    lat: 6.6885,
    lng: -1.6244,
  },
  {
    code: "IE",
    name: "Irlanda",
    poetCount: 1,
    members: [],
    lat: 53.2707,
    lng: -9.0568,
  },
  {
    code: "NP",
    name: "Nepal",
    poetCount: 1,
    members: [],
    lat: 28.2096,
    lng: 83.9856,
  },
  {
    code: "CL",
    name: "Chile",
    poetCount: 1,
    members: [],
    lat: -33.0472,
    lng: -71.6127,
  },
  {
    code: "NZ",
    name: "Nueva Zelanda",
    poetCount: 1,
    members: [],
    lat: -45.8788,
    lng: 170.5028,
  },
  {
    code: "PH",
    name: "Filipinas",
    poetCount: 1,
    members: [],
    lat: 10.3157,
    lng: 123.8854,
  },
  {
    code: "GR",
    name: "Grecia",
    poetCount: 1,
    members: [],
    lat: 40.6401,
    lng: 22.9444,
  },
  {
    code: "CU",
    name: "Cuba",
    poetCount: 1,
    members: [],
    lat: 23.1136,
    lng: -82.3666,
  },
  {
    code: "IR",
    name: "Irán",
    poetCount: 1,
    members: [],
    lat: 29.5918,
    lng: 52.5837,
  },
  {
    code: "NL",
    name: "Países Bajos",
    poetCount: 1,
    members: [],
    lat: 51.9244,
    lng: 4.4777,
  },
  {
    code: "DO",
    name: "República Dominicana",
    poetCount: 1,
    members: [],
    lat: 18.4861,
    lng: -69.9312,
  },
  {
    code: "DZ",
    name: "Argelia",
    poetCount: 1,
    members: [],
    lat: 35.6971,
    lng: -0.6308,
  },
  {
    code: "FI",
    name: "Finlandia",
    poetCount: 1,
    members: [],
    lat: 61.4978,
    lng: 23.761,
  },
  {
    code: "UY",
    name: "Uruguay",
    poetCount: 1,
    members: [],
    lat: -34.9011,
    lng: -56.1645,
  },
  {
    code: "US",
    name: "Estados Unidos",
    poetCount: 1,
    members: [],
    lat: 41.8781,
    lng: -87.6298,
  },
  {
    code: "CN",
    name: "China",
    poetCount: 1,
    members: [],
    lat: 22.5431,
    lng: 114.0579,
  },
  {
    code: "KE",
    name: "Kenia",
    poetCount: 1,
    members: [],
    lat: -1.2921,
    lng: 36.8219,
  },
  {
    code: "RU",
    name: "Rusia",
    poetCount: 1,
    members: [],
    lat: 59.9311,
    lng: 30.3609,
  },
  {
    code: "AU",
    name: "Australia",
    poetCount: 1,
    members: [],
    lat: -37.8136,
    lng: 144.9631,
  },
  {
    code: "EG",
    name: "Egipto",
    poetCount: 1,
    members: [],
    lat: 31.2001,
    lng: 29.9187,
  },
  {
    code: "IS",
    name: "Islandia",
    poetCount: 1,
    members: [],
    lat: 64.1466,
    lng: -21.9426,
  },
  {
    code: "CR",
    name: "Costa Rica",
    poetCount: 1,
    members: [],
    lat: 9.8644,
    lng: -83.9194,
  },
  {
    code: "RO",
    name: "Rumanía",
    poetCount: 1,
    members: [],
    lat: 45.7983,
    lng: 24.1256,
  },
  {
    code: "ID",
    name: "Indonesia",
    poetCount: 1,
    members: [],
    lat: -7.7956,
    lng: 110.3695,
  },
  {
    code: "PS",
    name: "Palestina",
    poetCount: 1,
    members: [],
    lat: 31.7054,
    lng: 35.2024,
  },
  {
    code: "VE",
    name: "Venezuela",
    poetCount: 2,
    members: [],
    lat: 10.0678,
    lng: -69.3474,
  },
  {
    code: "MG",
    name: "Madagascar",
    poetCount: 1,
    members: [],
    lat: -18.8792,
    lng: 47.5079,
  },
];

function normalizeCountryCode(code: string) {
  return code.trim().toUpperCase();
}

function mergePoemCountries(
  apiCountries: GlobeCountry[]
): GlobeCountry[] {
  const countriesByCode = new Map<
    string,
    GlobeCountry
  >();

  for (const country of apiCountries) {
    const code = normalizeCountryCode(
      country.code
    );

    countriesByCode.set(code, {
      ...country,
      code,
    });
  }

  for (const poemCountry of POEM_COUNTRIES) {
    const code = normalizeCountryCode(
      poemCountry.code
    );

    const existing =
      countriesByCode.get(code);

    if (!existing) {
      countriesByCode.set(code, {
        ...poemCountry,
        code,
      });

      continue;
    }

    countriesByCode.set(code, {
      ...existing,
      ...poemCountry,
      code,
      name:
        poemCountry.name ||
        existing.name,
      lat:
        poemCountry.lat ??
        existing.lat,
      lng:
        poemCountry.lng ??
        existing.lng,
      poetCount: Math.max(
        poemCountry.poetCount ?? 0,
        existing.poetCount ?? 0
      ),
      members:
        Array.isArray(existing.members) &&
        existing.members.length > 0
          ? existing.members
          : poemCountry.members,
    });
  }

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
      return mergePoemCountries(
        globeData?.countries ?? []
      );
    }, [globeData]);

  const occupiedTotal = Math.max(
    globeData?.occupiedTotal ?? 0,
    INTEGRATED_VOICES
  );

  const reservedTotal = Math.max(
    0,
    TOTAL_VOICES - occupiedTotal
  );

  return (
    <WorldGlobe
      participatingCountries={
        participatingCountries
      }
      occupiedTotal={occupiedTotal}
      reservedTotal={reservedTotal}
      totalSlots={TOTAL_VOICES}
    />
  );
}

