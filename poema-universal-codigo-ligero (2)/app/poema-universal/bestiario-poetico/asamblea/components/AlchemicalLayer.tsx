"use client";

import {
  useMemo,
} from "react";

import type {
  SymbolicAxis,
  SymbolicCartography,
} from "@/lib/asamblea/cartografia";

import styles from "./alchemical-layer.module.css";

type Props = {
  map: SymbolicCartography;
};

type AlchemicalPhase =
  | "nigredo"
  | "albedo"
  | "citrinitas"
  | "rubedo";

type SymbolicGeometry =
  | "mandala"
  | "fortress"
  | "spiral"
  | "fracture"
  | "dual-core"
  | "constellation";

type AlchemicalOperation =
  | "dissolution"
  | "separation"
  | "conjunction"
  | "fermentation"
  | "distillation"
  | "coagulation";

type ElementName =
  | "water"
  | "fire"
  | "air"
  | "earth";

type ElementBalance =
  Record<ElementName, number>;

const PHASE_LABELS:
  Record<AlchemicalPhase, string> = {
  nigredo: "Nigredo",
  albedo: "Albedo",
  citrinitas: "Citrinitas",
  rubedo: "Rubedo",
};

const PHASE_MEANINGS:
  Record<AlchemicalPhase, string> = {
  nigredo:
    "La materia entra en sombra para revelar aquello que todavía no puede nombrarse.",
  albedo:
    "El escrito lava sus imágenes y deja visible una claridad aún vulnerable.",
  citrinitas:
    "La conciencia comienza a iluminar la arquitectura secreta del texto.",
  rubedo:
    "Las fuerzas dispersas buscan reunirse y adquirir una forma encarnada.",
};

const GEOMETRY_LABELS:
  Record<SymbolicGeometry, string> = {
  mandala: "Mandala",
  fortress: "Fortaleza",
  spiral: "Espiral",
  fracture: "Fractura",
  "dual-core": "Doble núcleo",
  constellation: "Constelación",
};

const OPERATION_LABELS:
  Record<AlchemicalOperation, string> = {
  dissolution: "Disolución",
  separation: "Separación",
  conjunction: "Conjunción",
  fermentation: "Fermentación",
  distillation: "Destilación",
  coagulation: "Coagulación",
};

const AXIS_ELEMENT:
  Record<SymbolicAxis, ElementName> = {
  memory: "water",
  desire: "fire",
  wound: "air",
  matter: "earth",
};

const ELEMENT_LABEL:
  Record<ElementName, string> = {
  water: "Agua",
  fire: "Fuego",
  air: "Aire",
  earth: "Tierra",
};

const ELEMENT_GLYPH:
  Record<ElementName, string> = {
  water: "▽",
  fire: "△",
  air: "△̶",
  earth: "▽̶",
};

const PLANETARY_GLYPHS = [
  "☉",
  "☽",
  "☿",
  "♀",
  "♂",
  "♃",
  "♄",
];

function hashString(
  value: string
) {
  let hash = 2166136261;

  for (
    let index = 0;
    index < value.length;
    index += 1
  ) {
    hash ^= value.charCodeAt(
      index
    );

    hash = Math.imul(
      hash,
      16777619
    );
  }

  return hash >>> 0;
}

function seededNumber(
  seed: number,
  salt: number
) {
  const value =
    Math.sin(
      seed * 0.00001 +
        salt * 12.9898
    ) * 43758.5453;

  return value -
    Math.floor(value);
}

function normalizeBalance(
  balance: ElementBalance
) {
  const total =
    balance.water +
    balance.fire +
    balance.air +
    balance.earth;

  if (total <= 0) {
    return {
      water: 25,
      fire: 25,
      air: 25,
      earth: 25,
    };
  }

  const normalized = {
    water:
      Math.round(
        (balance.water /
          total) *
          100
      ),
    fire:
      Math.round(
        (balance.fire /
          total) *
          100
      ),
    air:
      Math.round(
        (balance.air /
          total) *
          100
      ),
    earth:
      Math.round(
        (balance.earth /
          total) *
          100
      ),
  };

  const difference =
    100 -
    normalized.water -
    normalized.fire -
    normalized.air -
    normalized.earth;

  normalized.earth +=
    difference;

  return normalized;
}

function choosePhase(
  map: SymbolicCartography,
  seed: number
): AlchemicalPhase {
  const text = [
    map.secretTitle,
    map.centralSymbol,
    map.nucleus,
    map.oraclePhrase,
    map.relic,
    map.finalGesture,
    ...map.nodes.map(
      (node) =>
        `${node.label} ${node.meaning}`
    ),
  ]
    .join(" ")
    .toLowerCase();

  const shadowWords = [
    "muerte",
    "ausencia",
    "sombra",
    "pérdida",
    "vacío",
    "herida",
    "desaparecer",
    "noche",
    "fractura",
  ];

  const clarityWords = [
    "agua",
    "limpieza",
    "recuerdo",
    "blanco",
    "claridad",
    "luna",
    "lavar",
    "silencio",
  ];

  const revelationWords = [
    "luz",
    "amanecer",
    "revelación",
    "conciencia",
    "visión",
    "dorado",
    "sol",
    "despertar",
  ];

  const unionWords = [
    "cuerpo",
    "unión",
    "regreso",
    "amor",
    "sangre",
    "fuego",
    "integración",
    "encarnar",
  ];

  const score = {
    nigredo:
      shadowWords.filter(
        (word) =>
          text.includes(word)
      ).length,
    albedo:
      clarityWords.filter(
        (word) =>
          text.includes(word)
      ).length,
    citrinitas:
      revelationWords.filter(
        (word) =>
          text.includes(word)
      ).length,
    rubedo:
      unionWords.filter(
        (word) =>
          text.includes(word)
      ).length,
  };

  if (
    map.dominantAxis ===
    "wound"
  ) {
    score.nigredo += 2;
  }

  if (
    map.dominantAxis ===
    "memory"
  ) {
    score.albedo += 2;
  }

  if (
    map.dominantAxis ===
    "desire"
  ) {
    score.citrinitas += 2;
  }

  if (
    map.dominantAxis ===
    "matter"
  ) {
    score.rubedo += 2;
  }

  const entries =
    Object.entries(score) as [
      AlchemicalPhase,
      number,
    ][];

  entries.sort(
    (first, second) =>
      second[1] - first[1]
  );

  if (
    entries[0][1] ===
    entries[1][1]
  ) {
    const phases:
      AlchemicalPhase[] = [
      "nigredo",
      "albedo",
      "citrinitas",
      "rubedo",
    ];

    return phases[
      seed % phases.length
    ];
  }

  return entries[0][0];
}

function chooseGeometry(
  map: SymbolicCartography,
  seed: number
): SymbolicGeometry {
  const nodeSpread =
    map.nodes.reduce(
      (total, node) =>
        total +
        Math.abs(node.x - 50) +
        Math.abs(node.y - 50),
      0
    ) /
    Math.max(
      map.nodes.length,
      1
    );

  const woundNodes =
    map.nodes.filter(
      (node) =>
        node.axis === "wound"
    ).length;

  const matterNodes =
    map.nodes.filter(
      (node) =>
        node.axis === "matter"
    ).length;

  const desireNodes =
    map.nodes.filter(
      (node) =>
        node.axis === "desire"
    ).length;

  if (
    woundNodes >= 3
  ) {
    return "fracture";
  }

  if (
    matterNodes >= 3
  ) {
    return "fortress";
  }

  if (
    desireNodes >= 3
  ) {
    return "spiral";
  }

  if (
    nodeSpread > 52
  ) {
    return "constellation";
  }

  if (
    map.nodes.length % 2 ===
    0 &&
    seed % 5 === 0
  ) {
    return "dual-core";
  }

  return "mandala";
}

function calculateElements(
  map: SymbolicCartography
) {
  const raw:
    ElementBalance = {
    water: 4,
    fire: 4,
    air: 4,
    earth: 4,
  };

  map.nodes.forEach(
    (node) => {
      const element =
        AXIS_ELEMENT[
          node.axis
        ];

      raw[element] +=
        node.intensity;
    }
  );

  return normalizeBalance(raw);
}

function operationFromRoute(
  relation: string,
  index: number,
  seed: number
): AlchemicalOperation {
  const lower =
    relation.toLowerCase();

  if (
    lower.includes("romp") ||
    lower.includes("separa") ||
    lower.includes("distancia")
  ) {
    return "separation";
  }

  if (
    lower.includes("une") ||
    lower.includes("vínculo") ||
    lower.includes("encuentro")
  ) {
    return "conjunction";
  }

  if (
    lower.includes("agua") ||
    lower.includes("disuelve") ||
    lower.includes("desaparece")
  ) {
    return "dissolution";
  }

  if (
    lower.includes("cuerpo") ||
    lower.includes("objeto") ||
    lower.includes("forma")
  ) {
    return "coagulation";
  }

  if (
    lower.includes("luz") ||
    lower.includes("eleva") ||
    lower.includes("claridad")
  ) {
    return "distillation";
  }

  const operations:
    AlchemicalOperation[] = [
    "dissolution",
    "separation",
    "conjunction",
    "fermentation",
    "distillation",
    "coagulation",
  ];

  return operations[
    (seed + index) %
      operations.length
  ];
}

function createSigilPoints(
  map: SymbolicCartography,
  seed: number
) {
  const count =
    Math.min(
      10,
      Math.max(
        6,
        map.nodes.length + 1
      )
    );

  return Array.from(
    { length: count },
    (_, index) => {
      const angle =
        (Math.PI * 2 * index) /
          count -
        Math.PI / 2;

      const radius =
        31 +
        seededNumber(
          seed,
          index + 1
        ) *
          26;

      return {
        x:
          500 +
          Math.cos(angle) *
            radius,
        y:
          350 +
          Math.sin(angle) *
            radius,
      };
    }
  );
}

function pointsToPath(
  points: {
    x: number;
    y: number;
  }[]
) {
  if (
    points.length === 0
  ) {
    return "";
  }

  return [
    `M ${points[0].x} ${points[0].y}`,
    ...points
      .slice(1)
      .map(
        (point) =>
          `L ${point.x} ${point.y}`
      ),
    "Z",
  ].join(" ");
}

function truncate(
  text: string,
  limit: number
) {
  if (
    text.length <= limit
  ) {
    return text;
  }

  return `${text.slice(
    0,
    limit - 1
  )}…`;
}

export default function
AlchemicalLayer({
  map,
}: Props) {
  const alchemy =
    useMemo(() => {
      const source = [
        map.secretTitle,
        map.centralSymbol,
        map.nucleus,
        map.oraclePhrase,
        map.relic,
        ...map.nodes.map(
          (node) =>
            `${node.id}:${node.label}:${node.intensity}:${node.x}:${node.y}`
        ),
      ].join("|");

      const seed =
        hashString(source);

      const phase =
        choosePhase(
          map,
          seed
        );

      const geometry =
        chooseGeometry(
          map,
          seed
        );

      const elements =
        calculateElements(map);

      const planetaryGlyph =
        PLANETARY_GLYPHS[
          seed %
            PLANETARY_GLYPHS.length
        ];

      const sigilPoints =
        createSigilPoints(
          map,
          seed
        );

      const operations =
        map.links
          .slice(0, 6)
          .map(
            (
              route,
              index
            ) => ({
              id: route.id,
              label:
                OPERATION_LABELS[
                  operationFromRoute(
                    route.relation,
                    index,
                    seed
                  )
                ],
              relation:
                route.relation,
            })
          );

      const inscriptions = [
        truncate(
          map.nucleus,
          54
        ),
        truncate(
          map.relic,
          46
        ),
        truncate(
          map.oraclePhrase,
          58
        ),
      ];

      return {
        seed,
        phase,
        geometry,
        elements,
        planetaryGlyph,
        sigilPoints,
        sigilPath:
          pointsToPath(
            sigilPoints
          ),
        operations,
        inscriptions,
      };
    }, [map]);

  const dominantElement =
    (
      Object.entries(
        alchemy.elements
      ) as [
        ElementName,
        number,
      ][]
    ).sort(
      (first, second) =>
        second[1] - first[1]
    )[0][0];

  const spiralPath =
    useMemo(() => {
      const points = [];

      for (
        let index = 0;
        index < 92;
        index += 1
      ) {
        const angle =
          index * 0.31;

        const radius =
          8 + index * 2.7;

        points.push({
          x:
            500 +
            Math.cos(angle) *
              radius,
          y:
            350 +
            Math.sin(angle) *
              radius *
              0.68,
        });
      }

      return points
        .map(
          (point, index) =>
            `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
        )
        .join(" ");
    }, []);

  return (
    <>
      <div
        className={[
          styles.atmosphere,
          styles[
            alchemy.phase
          ],
        ].join(" ")}
        aria-hidden="true"
      />

      <svg
        viewBox="0 0 1000 700"
        className={[
          styles.layer,
          styles[
            `geometry_${alchemy.geometry.replace(
              "-",
              "_"
            )}`
          ],
        ].join(" ")}
        aria-hidden="true"
      >
        <defs>
          <filter
            id="alchemicalSoftGlow"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feGaussianBlur
              stdDeviation="4"
              result="blur"
            />

            <feMerge>
              <feMergeNode
                in="blur"
              />

              <feMergeNode
                in="SourceGraphic"
              />
            </feMerge>
          </filter>

          <radialGradient
            id="alchemicalDust"
          >
            <stop
              offset="0%"
              stopColor="#e5bd72"
              stopOpacity="0.15"
            />

            <stop
              offset="100%"
              stopColor="#e5bd72"
              stopOpacity="0"
            />
          </radialGradient>
        </defs>

        <circle
          cx="500"
          cy="350"
          r="331"
          className={
            styles.manuscriptOrbit
          }
        />

        <circle
          cx="500"
          cy="350"
          r="282"
          className={
            styles.manuscriptOrbitFine
          }
        />

        <circle
          cx="500"
          cy="350"
          r="210"
          className={
            styles.manuscriptOrbit
          }
        />

        <circle
          cx="500"
          cy="350"
          r="132"
          className={
            styles.manuscriptOrbitFine
          }
        />

        <g
          className={
            styles.geometry
          }
        >
          {alchemy.geometry ===
            "fortress" && (
            <>
              <rect
                x="255"
                y="105"
                width="490"
                height="490"
                className={
                  styles.geometryShape
                }
                transform="rotate(45 500 350)"
              />

              <rect
                x="320"
                y="170"
                width="360"
                height="360"
                className={
                  styles.geometryShapeFine
                }
                transform="rotate(45 500 350)"
              />
            </>
          )}

          {alchemy.geometry ===
            "spiral" && (
            <path
              d={spiralPath}
              className={
                styles.spiral
              }
            />
          )}

          {alchemy.geometry ===
            "fracture" && (
            <>
              <path
                d="M 145 128 L 284 224 L 220 304 L 420 349 L 354 448 L 492 574"
                className={
                  styles.fracture
                }
              />

              <path
                d="M 855 104 L 724 220 L 782 310 L 581 352 L 649 453 L 520 604"
                className={
                  styles.fracture
                }
              />
            </>
          )}

          {alchemy.geometry ===
            "dual-core" && (
            <>
              <circle
                cx="432"
                cy="350"
                r="91"
                className={
                  styles.geometryShape
                }
              />

              <circle
                cx="568"
                cy="350"
                r="91"
                className={
                  styles.geometryShape
                }
              />
            </>
          )}

          {alchemy.geometry ===
            "mandala" && (
            <>
              <polygon
                points="500,112 706,469 294,469"
                className={
                  styles.geometryShape
                }
              />

              <polygon
                points="500,588 294,231 706,231"
                className={
                  styles.geometryShapeFine
                }
              />
            </>
          )}

          {alchemy.geometry ===
            "constellation" && (
            <>
              {map.nodes.map(
                (
                  node,
                  index
                ) => {
                  const next =
                    map.nodes[
                      (index + 2) %
                        map.nodes
                          .length
                    ];

                  return (
                    <line
                      key={
                        node.id
                      }
                      x1={
                        node.x *
                        10
                      }
                      y1={
                        node.y *
                        7
                      }
                      x2={
                        next.x *
                        10
                      }
                      y2={
                        next.y *
                        7
                      }
                      className={
                        styles.constellationLine
                      }
                    />
                  );
                }
              )}
            </>
          )}
        </g>

        <g
          className={
            styles.elementRing
          }
        >
          <text
            x="500"
            y="78"
            textAnchor="middle"
            className={
              styles.elementGlyph
            }
          >
            {
              ELEMENT_GLYPH.air
            }
          </text>

          <text
            x="500"
            y="98"
            textAnchor="middle"
            className={
              styles.elementCaption
            }
          >
            AIRE ·{" "}
            {
              alchemy.elements
                .air
            }
            %
          </text>

          <text
            x="900"
            y="350"
            textAnchor="middle"
            className={
              styles.elementGlyph
            }
          >
            {
              ELEMENT_GLYPH.fire
            }
          </text>

          <text
            x="900"
            y="374"
            textAnchor="middle"
            className={
              styles.elementCaption
            }
          >
            FUEGO ·{" "}
            {
              alchemy.elements
                .fire
            }
            %
          </text>

          <text
            x="500"
            y="626"
            textAnchor="middle"
            className={
              styles.elementGlyph
            }
          >
            {
              ELEMENT_GLYPH.earth
            }
          </text>

          <text
            x="500"
            y="648"
            textAnchor="middle"
            className={
              styles.elementCaption
            }
          >
            TIERRA ·{" "}
            {
              alchemy.elements
                .earth
            }
            %
          </text>

          <text
            x="100"
            y="350"
            textAnchor="middle"
            className={
              styles.elementGlyph
            }
          >
            {
              ELEMENT_GLYPH.water
            }
          </text>

          <text
            x="100"
            y="374"
            textAnchor="middle"
            className={
              styles.elementCaption
            }
          >
            AGUA ·{" "}
            {
              alchemy.elements
                .water
            }
            %
          </text>
        </g>

        <g
          className={
            styles.planetarySeal
          }
          filter="url(#alchemicalSoftGlow)"
        >
          <circle
            cx="500"
            cy="350"
            r="82"
            className={
              styles.sigilOrbit
            }
          />

          <path
            d={
              alchemy.sigilPath
            }
            className={
              styles.sigil
            }
          />

          {alchemy.sigilPoints.map(
            (
              point,
              index
            ) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r={
                  index % 2 ===
                  0
                    ? 3
                    : 2
                }
                className={
                  styles.sigilNode
                }
              />
            )
          )}

          <text
            x="500"
            y="360"
            textAnchor="middle"
            className={
              styles.planetGlyph
            }
          >
            {
              alchemy.planetaryGlyph
            }
          </text>
        </g>

        <g
          className={
            styles.inscriptions
          }
        >
          <text
            x="500"
            y="43"
            textAnchor="middle"
          >
            {
              alchemy.inscriptions[0]
            }
          </text>

          <text
            x="500"
            y="683"
            textAnchor="middle"
          >
            {
              alchemy.inscriptions[1]
            }
          </text>

          <text
            x="40"
            y="350"
            textAnchor="middle"
            transform="rotate(-90 40 350)"
          >
            {
              alchemy.inscriptions[2]
            }
          </text>
        </g>

        {Array.from(
          { length: 34 },
          (_, index) => {
            const angle =
              seededNumber(
                alchemy.seed,
                index + 31
              ) *
              Math.PI *
              2;

            const radius =
              110 +
              seededNumber(
                alchemy.seed,
                index + 87
              ) *
                260;

            const x =
              500 +
              Math.cos(angle) *
                radius;

            const y =
              350 +
              Math.sin(angle) *
                radius *
                0.72;

            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r={
                  index % 5 ===
                  0
                    ? 2
                    : 1
                }
                className={
                  styles.alchemicalDust
                }
              />
            );
          }
        )}
      </svg>

      <div
        className={
          styles.phasePanel
        }
      >
        <span>
          Fase de la obra
        </span>

        <strong>
          {
            PHASE_LABELS[
              alchemy.phase
            ]
          }
        </strong>

        <p>
          {
            PHASE_MEANINGS[
              alchemy.phase
            ]
          }
        </p>
      </div>

      <div
        className={
          styles.geometryPanel
        }
      >
        <span>
          Arquitectura
        </span>

        <strong>
          {
            GEOMETRY_LABELS[
              alchemy.geometry
            ]
          }
        </strong>

        <small>
          Elemento rector ·{" "}
          {
            ELEMENT_LABEL[
              dominantElement
            ]
          }
        </small>
      </div>

      <div
        className={
          styles.operationsPanel
        }
      >
        <span>
          Operaciones
        </span>

        <div>
          {alchemy.operations.map(
            (operation) => (
              <abbr
                key={
                  operation.id
                }
                title={
                  operation.relation
                }
              >
                {
                  operation.label
                }
              </abbr>
            )
          )}
        </div>
      </div>
    </>
  );
}
