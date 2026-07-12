"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { GlobeMethods } from "react-globe.gl";

const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[520px] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border border-white/15 border-t-[#d5b46b]" />

        <p className="text-[10px] uppercase tracking-[0.42em] text-white/45">
          Construyendo el mundo
        </p>
      </div>
    </div>
  ),
});

const COUNTRY_DATA_URL =
  "https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson";

export type GlobePoet = {
  id: string;
  name: string;
  city?: string;
  profileUrl?: string;
};

export type GlobeCountry = {
  code: string;
  name: string;
  poetCount: number | null;
  members: GlobePoet[];
  lat: number;
  lng: number;
};

type WorldGlobeProps = {
  participatingCountries?: GlobeCountry[];
  occupiedTotal?: number;
  reservedTotal?: number;
  totalSlots?: number;
};

type CountryProperties = {
  ADMIN?: string;
  ISO_A2?: string;
  ISO_A3?: string;
};

type CountryFeature = {
  type: "Feature";
  properties: CountryProperties;
  geometry: {
    type: string;
    coordinates: unknown;
  };
};

type CountriesGeoJson = {
  type: "FeatureCollection";
  features: CountryFeature[];
};

type GlobeSize = {
  width: number;
  height: number;
};

type OrbitControlsLike = {
  autoRotate: boolean;
  autoRotateSpeed: number;
  enableDamping: boolean;
  dampingFactor: number;
  minDistance: number;
  maxDistance: number;
};

const INITIAL_PARTICIPATING_COUNTRIES: GlobeCountry[] = [
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

function getCountryCode(country: CountryFeature): string {
  return country.properties.ISO_A2?.toUpperCase() ?? "";
}

function getCountryName(country: CountryFeature): string {
  return country.properties.ADMIN ?? "País";
}

function getPoetCountText(country: GlobeCountry): string {
  if (country.poetCount === null) {
    return "Participación en incorporación";
  }

  return `${country.poetCount} ${
    country.poetCount === 1 ? "poeta" : "poetas"
  }`;
}

export default function WorldGlobe({
  participatingCountries = INITIAL_PARTICIPATING_COUNTRIES,
  occupiedTotal = 4,
  reservedTotal = 56,
  totalSlots = 60,
}: WorldGlobeProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [countries, setCountries] = useState<CountryFeature[]>([]);
  const [selectedCountry, setSelectedCountry] =
    useState<GlobeCountry | null>(null);

  const [hoveredCountryCode, setHoveredCountryCode] =
    useState<string | null>(null);

  const [isLoadingCountries, setIsLoadingCountries] =
    useState(true);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  const [globeSize, setGlobeSize] = useState<GlobeSize>({
    width: 900,
    height: 680,
  });

  const participantByCode = useMemo(() => {
    return new Map(
      participatingCountries.map((country) => [
        country.code.toUpperCase(),
        country,
      ])
    );
  }, [participatingCountries]);

  const visibleCountries = useMemo(() => {
    return countries.filter(
      (country) => getCountryCode(country) !== "AQ"
    );
  }, [countries]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCountries() {
      try {
        setIsLoadingCountries(true);
        setLoadError(null);

        const response = await fetch(COUNTRY_DATA_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `No se pudo cargar el mapa mundial: ${response.status}`
          );
        }

        const data =
          (await response.json()) as CountriesGeoJson;

        if (!Array.isArray(data.features)) {
          throw new Error(
            "El archivo geográfico no contiene países."
          );
        }

        setCountries(data.features);
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Error cargando la geometría mundial:",
          error
        );

        setLoadError(
          "No ha sido posible cargar la geometría de los países."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingCountries(false);
        }
      }
    }

    loadCountries();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    function updateSize(width: number) {
      const height =
        width < 640
          ? 520
          : Math.min(
              760,
              Math.max(620, width * 0.64)
            );

      setGlobeSize({
        width: Math.max(width, 280),
        height,
      });
    }

    updateSize(
      container.getBoundingClientRect().width
    );

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (!entry) {
        return;
      }

      updateSize(entry.contentRect.width);
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  const configureGlobe = useCallback(() => {
    const globe = globeRef.current;

    if (!globe) {
      return;
    }

    const controls =
      globe.controls() as OrbitControlsLike;

    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.32;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 125;
    controls.maxDistance = 500;

    globe.pointOfView(
      {
        lat: 12,
        lng: -45,
        altitude: 2.15,
      },
      1800
    );
  }, []);

  const focusCountry = useCallback(
    (country: GlobeCountry) => {
      setSelectedCountry(country);

      const globe = globeRef.current;

      if (!globe) {
        return;
      }

      const controls =
        globe.controls() as OrbitControlsLike;

      controls.autoRotate = false;

      globe.pointOfView(
        {
          lat: country.lat,
          lng: country.lng,
          altitude: 1.55,
        },
        1200
      );
    },
    []
  );

  const resumeWorldView = useCallback(() => {
    setSelectedCountry(null);

    const globe = globeRef.current;

    if (!globe) {
      return;
    }

    const controls =
      globe.controls() as OrbitControlsLike;

    controls.autoRotate = true;

    globe.pointOfView(
      {
        lat: 12,
        lng: -45,
        altitude: 2.15,
      },
      1200
    );
  }, []);

  const handlePolygonClick = useCallback(
    (polygon: object) => {
      const country = polygon as CountryFeature;
      const countryCode = getCountryCode(country);
      const participant =
        participantByCode.get(countryCode);

      if (!participant) {
        return;
      }

      focusCountry(participant);
    },
    [focusCountry, participantByCode]
  );

  const handlePolygonHover = useCallback(
    (polygon: object | null) => {
      if (!polygon) {
        setHoveredCountryCode(null);
        return;
      }

      const country = polygon as CountryFeature;

      setHoveredCountryCode(
        getCountryCode(country)
      );
    },
    []
  );

  const getPolygonCapColor = useCallback(
    (polygon: object) => {
      const country = polygon as CountryFeature;
      const countryCode = getCountryCode(country);

      const isParticipant =
        participantByCode.has(countryCode);

      const isSelected =
        selectedCountry?.code.toUpperCase() ===
        countryCode;

      const isHovered =
        hoveredCountryCode === countryCode;

      if (isSelected) {
        return "rgba(239, 205, 125, 0.98)";
      }

      if (isParticipant && isHovered) {
        return "rgba(220, 181, 95, 0.95)";
      }

      if (isParticipant) {
        return "rgba(175, 137, 69, 0.82)";
      }

      if (isHovered) {
        return "rgba(255, 255, 255, 0.12)";
      }

      return "rgba(255, 255, 255, 0.035)";
    },
    [
      hoveredCountryCode,
      participantByCode,
      selectedCountry,
    ]
  );

  const getPolygonSideColor = useCallback(
    (polygon: object) => {
      const country = polygon as CountryFeature;

      const isParticipant =
        participantByCode.has(
          getCountryCode(country)
        );

      return isParticipant
        ? "rgba(125, 91, 39, 0.48)"
        : "rgba(0, 0, 0, 0.1)";
    },
    [participantByCode]
  );

  const getPolygonStrokeColor = useCallback(
    (polygon: object) => {
      const country = polygon as CountryFeature;

      const isParticipant =
        participantByCode.has(
          getCountryCode(country)
        );

      return isParticipant
        ? "rgba(255, 231, 173, 0.7)"
        : "rgba(255, 255, 255, 0.09)";
    },
    [participantByCode]
  );

  const getPolygonAltitude = useCallback(
    (polygon: object) => {
      const country = polygon as CountryFeature;
      const countryCode = getCountryCode(country);

      const isParticipant =
        participantByCode.has(countryCode);

      const isSelected =
        selectedCountry?.code.toUpperCase() ===
        countryCode;

      if (isSelected) {
        return 0.065;
      }

      if (isParticipant) {
        return 0.035;
      }

      return 0.006;
    },
    [participantByCode, selectedCountry]
  );

  const getPolygonLabel = useCallback(
    (polygon: object) => {
      const country = polygon as CountryFeature;

      const countryCode =
        getCountryCode(country);

      const countryName =
        getCountryName(country);

      const participant =
        participantByCode.get(countryCode);

      if (!participant) {
        return `
          <div style="
            padding: 10px 12px;
            border: 1px solid rgba(255,255,255,0.12);
            background: rgba(4,8,11,0.94);
            color: rgba(255,255,255,0.62);
            font-family: Georgia, serif;
            letter-spacing: 0.04em;
          ">
            ${countryName}
          </div>
        `;
      }

      return `
        <div style="
          min-width: 190px;
          padding: 14px 16px;
          border: 1px solid rgba(225,190,112,0.45);
          background: rgba(4,8,11,0.96);
          box-shadow: 0 18px 55px rgba(0,0,0,0.45);
          color: white;
          font-family: Georgia, serif;
        ">
          <div style="
            margin-bottom: 7px;
            color: rgba(225,190,112,0.92);
            font-size: 10px;
            letter-spacing: 0.24em;
            text-transform: uppercase;
          ">
            País participante
          </div>

          <div style="
            margin-bottom: 5px;
            font-size: 20px;
          ">
            ${participant.name}
          </div>

          <div style="
            color: rgba(255,255,255,0.58);
            font-size: 12px;
          ">
            ${getPoetCountText(participant)}
          </div>
        </div>
      `;
    },
    [participantByCode]
  );

  return (
    <section
      id="mundo"
      className="relative isolate overflow-hidden border-y border-white/10 bg-[#03070a] py-24 text-white sm:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#b58b45]/[0.07] blur-[150px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.035),transparent_58%)]"
      />

      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <header className="mx-auto mb-16 max-w-4xl text-center">
          <p className="mb-7 text-[10px] font-medium uppercase tracking-[0.45em] text-[#d7b66f] sm:text-xs">
            Cartografía de una voz común
          </p>

          <h2 className="font-serif text-4xl font-normal tracking-[-0.035em] text-white sm:text-6xl lg:text-7xl">
            El mundo comienza
            <span className="block italic text-white/62">
              a escribir junto
            </span>
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-sm leading-7 text-white/48 sm:text-base sm:leading-8">
            Cada territorio iluminado representa una
            presencia que ya ha comenzado a formar parte
            de la edición fundacional de Poema Universal.
          </p>
        </header>

        <div className="mb-8 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-3">
          <div className="bg-[#050a0e] px-6 py-6 text-center">
            <span className="block font-serif text-3xl text-white">
              {occupiedTotal}
            </span>

            <span className="mt-2 block text-[9px] uppercase tracking-[0.32em] text-white/38">
              Voces en incorporación
            </span>
          </div>

          <div className="bg-[#050a0e] px-6 py-6 text-center">
            <span className="block font-serif text-3xl text-white">
              {participatingCountries.length}
            </span>

            <span className="mt-2 block text-[9px] uppercase tracking-[0.32em] text-white/38">
              Países participantes
            </span>
          </div>

          <div className="bg-[#050a0e] px-6 py-6 text-center">
            <span className="block font-serif text-3xl text-[#d7b66f]">
              {reservedTotal}
            </span>

            <span className="mt-2 block text-[9px] uppercase tracking-[0.32em] text-white/38">
              Plazas disponibles
            </span>
          </div>
        </div>

        <div className="mb-8 flex flex-col items-center justify-between gap-3 border-x border-white/10 px-5 py-4 text-center sm:flex-row sm:text-left">
          <p className="text-[9px] uppercase tracking-[0.32em] text-white/30">
            Edición fundacional 2026
          </p>

          <p className="font-serif text-sm italic text-white/48">
            Un libro universal de {totalSlots} voces
          </p>
        </div>

        <div className="relative overflow-hidden border border-white/10 bg-[#020609]/80 shadow-[0_50px_140px_rgba(0,0,0,0.55)]">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_330px]">
            <div
              ref={containerRef}
              className="relative min-h-[520px] overflow-hidden"
            >
              {isLoadingCountries && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#020609]/70 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-9 w-9 animate-spin rounded-full border border-white/15 border-t-[#d7b66f]" />

                    <span className="text-[9px] uppercase tracking-[0.38em] text-white/40">
                      Trazando continentes
                    </span>
                  </div>
                </div>
              )}

              {loadError && (
                <div className="absolute inset-0 z-30 flex items-center justify-center p-8 text-center">
                  <div className="max-w-md border border-red-300/20 bg-red-950/10 px-6 py-5">
                    <p className="text-sm leading-7 text-red-100/70">
                      {loadError}
                    </p>
                  </div>
                </div>
              )}

              {!loadError && (
                <Globe
                  ref={globeRef}
                  width={globeSize.width}
                  height={globeSize.height}
                  backgroundColor="rgba(0,0,0,0)"
                  globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-dark.jpg"
                  bumpImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png"
                  showAtmosphere
                  atmosphereColor="#c9a45e"
                  atmosphereAltitude={0.16}
                  showGraticules={false}
                  polygonsData={visibleCountries}
                  polygonCapColor={getPolygonCapColor}
                  polygonSideColor={getPolygonSideColor}
                  polygonStrokeColor={
                    getPolygonStrokeColor
                  }
                  polygonAltitude={
                    getPolygonAltitude
                  }
                  polygonLabel={getPolygonLabel}
                  polygonsTransitionDuration={420}
                  onPolygonClick={
                    handlePolygonClick
                  }
                  onPolygonHover={
                    handlePolygonHover
                  }
                  pointsData={
                    participatingCountries
                  }
                  pointLat="lat"
                  pointLng="lng"
                  pointAltitude={0.045}
                  pointRadius={0.42}
                  pointResolution={24}
                  pointColor={() => "#f0ce7d"}
                  pointLabel={(point: object) => {
                    const country =
                      point as GlobeCountry;

                    return `${country.name} · ${getPoetCountText(
                      country
                    )}`;
                  }}
                  onPointClick={(point: object) => {
                    focusCountry(
                      point as GlobeCountry
                    );
                  }}
                  ringsData={
                    participatingCountries
                  }
                  ringLat="lat"
                  ringLng="lng"
                  ringColor={() => [
                    "rgba(239,205,125,0.78)",
                    "rgba(239,205,125,0)",
                  ]}
                  ringMaxRadius={3.5}
                  ringPropagationSpeed={0.75}
                  ringRepeatPeriod={1800}
                  labelsData={
                    participatingCountries
                  }
                  labelLat="lat"
                  labelLng="lng"
                  labelAltitude={0.07}
                  labelText={(label: object) => {
                    const country =
                      label as GlobeCountry;

                    if (
                      country.poetCount === null
                    ) {
                      return country.name;
                    }

                    return `${country.name} · ${country.poetCount}`;
                  }}
                  labelColor={() =>
                    "rgba(255,240,204,0.94)"
                  }
                  labelSize={1.05}
                  labelDotRadius={0.22}
                  labelResolution={3}
                  onLabelClick={(label: object) => {
                    focusCountry(
                      label as GlobeCountry
                    );
                  }}
                  onGlobeReady={configureGlobe}
                />
              )}

              <div className="pointer-events-none absolute bottom-5 left-5 z-10 border border-white/10 bg-black/35 px-4 py-3 backdrop-blur-md">
                <p className="text-[8px] uppercase tracking-[0.3em] text-white/42">
                  Arrastra para girar
                </p>

                <p className="mt-1 text-[8px] uppercase tracking-[0.3em] text-white/42">
                  Usa la rueda para acercarte
                </p>
              </div>
            </div>

            <aside className="relative flex min-h-[360px] flex-col border-t border-white/10 bg-[#050a0e]/95 p-7 lg:border-l lg:border-t-0 lg:p-9">
              <div className="mb-10 flex items-start justify-between gap-5">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.36em] text-[#d7b66f]">
                    Atlas de participantes
                  </p>

                  <p className="mt-3 text-xs leading-6 text-white/35">
                    Selecciona un territorio
                    iluminado.
                  </p>
                </div>

                {selectedCountry && (
                  <button
                    type="button"
                    onClick={resumeWorldView}
                    className="border border-white/10 px-3 py-2 text-[8px] uppercase tracking-[0.25em] text-white/45 transition hover:border-[#d7b66f]/40 hover:text-[#d7b66f]"
                    aria-label="Cerrar país seleccionado"
                  >
                    Cerrar
                  </button>
                )}
              </div>

              {selectedCountry ? (
                <div className="flex flex-1 flex-col">
                  <p className="font-serif text-4xl tracking-[-0.03em] text-white">
                    {selectedCountry.name}
                  </p>

                  <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-[#d7b66f]">
                    {getPoetCountText(
                      selectedCountry
                    )}
                  </p>

                  <div className="my-8 h-px bg-white/10" />

                  <p className="mb-5 text-[9px] uppercase tracking-[0.3em] text-white/34">
                    Integrantes
                  </p>

                  {selectedCountry.members.length >
                  0 ? (
                    <ul className="space-y-3">
                      {selectedCountry.members.map(
                        (member) => (
                          <li
                            key={member.id}
                            className="border-b border-white/[0.08] pb-3"
                          >
                            <p className="font-serif text-lg text-white/82">
                              {member.name}
                            </p>

                            {member.city && (
                              <p className="mt-1 text-[9px] uppercase tracking-[0.25em] text-white/30">
                                {member.city}
                              </p>
                            )}
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <div className="border border-white/10 bg-white/[0.025] px-5 py-5">
                      <p className="text-xs leading-6 text-white/38">
                        Los nombres aparecerán
                        aquí cuando los perfiles
                        hayan sido completados y
                        autorizados para su
                        publicación.
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={resumeWorldView}
                    className="mt-auto pt-10 text-left text-[9px] uppercase tracking-[0.3em] text-white/38 transition hover:text-[#d7b66f]"
                  >
                    Volver a la visión mundial →
                  </button>
                </div>
              ) : (
                <div className="flex flex-1 flex-col">
                  <div className="space-y-3">
                    {participatingCountries.map(
                      (country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() =>
                            focusCountry(country)
                          }
                          className="group flex w-full items-center justify-between border-b border-white/[0.08] py-4 text-left"
                        >
                          <span className="font-serif text-xl text-white/72 transition group-hover:text-white">
                            {country.name}
                          </span>

                          <span className="h-2 w-2 rounded-full bg-[#d7b66f] shadow-[0_0_18px_rgba(215,182,111,0.8)]" />
                        </button>
                      )
                    )}
                  </div>

                  <div className="mt-auto border-t border-white/10 pt-7">
                    <p className="text-xs leading-6 text-white/32">
                      El mapa crecerá con cada
                      nueva incorporación hasta
                      reunir las sesenta voces de
                      la edición fundacional.
                    </p>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-[9px] uppercase leading-6 tracking-[0.3em] text-white/25">
          Cada luz señala una presencia. Cada
          presencia modifica el poema.
        </p>
      </div>
    </section>
  );
}