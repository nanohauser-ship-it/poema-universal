"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  atlasRelationsV4,
} from "@/lib/grafo-literario/atlas-relations-v4";

import {
  atlasAuthorsMaster,
} from "@/lib/grafo-literario/atlas-authors-master";

type FilterMode =
  | "all"
  | "author"
  | "movement"
  | "tradition"
  | "historical_event"
  | "concept";

type GraphNode = {
  key: string;
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
};

const WIDTH = 1400;
const HEIGHT = 820;
const CX = WIDTH / 2;
const CY = HEIGHT / 2;

function nodeKey(
  type: string,
  id: string
) {
  return `${type}:${id}`;
}

function hash(value: string) {
  let h = 0;

  for (
    let i = 0;
    i < value.length;
    i++
  ) {
    h =
      (h * 31 +
        value.charCodeAt(i)) >>>
      0;
  }

  return h;
}

function radiusForType(type: string) {
  switch (type) {
    case "author":
      return 285;

    case "movement":
      return 180;

    case "tradition":
    case "oral_tradition":
    case "religious_tradition":
      return 225;

    case "historical_event":
      return 135;

    case "concept":
      return 95;

    default:
      return 245;
  }
}

function nodeRadius(type: string) {
  switch (type) {
    case "author":
      return 5.6;

    case "movement":
      return 5;

    case "historical_event":
      return 4.7;

    case "concept":
      return 4.4;

    default:
      return 4;
  }
}

function typeLabel(type: string) {
  const labels: Record<string, string> = {
    author: "Autor",
    movement: "Movimiento",
    tradition: "Tradición",
    historical_event: "Historia",
    concept: "Concepto",
    place: "Lugar",
    institution: "Institución",
    community: "Comunidad",
    oral_tradition: "Tradición oral",
    religious_tradition:
      "Tradición religiosa",
  };

  return labels[type] ?? type;
}

export default function AtlasConstellationV4() {
  const [mounted, setMounted] =
    useState(false);

  const [filter, setFilter] =
    useState<FilterMode>("all");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [searchOpen, setSearchOpen] =
    useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [selectedKey, setSelectedKey] =
    useState<string | null>(null);

  const graph = useMemo(() => {
    const rawNodes = new Map<
      string,
      {
        id: string;
        type: string;
        label: string;
      }
    >();

    for (const relation of atlasRelationsV4) {
      const sourceKey = nodeKey(
        relation.source.type,
        relation.source.id
      );

      const targetKey = nodeKey(
        relation.target.type,
        relation.target.id
      );

      rawNodes.set(sourceKey, {
        id: relation.source.id,
        type: relation.source.type,
        label:
          relation.source.label ??
          relation.source.id,
      });

      rawNodes.set(targetKey, {
        id: relation.target.id,
        type: relation.target.type,
        label:
          relation.target.label ??
          relation.target.id,
      });
    }

    const typeBuckets =
      new Map<string, string[]>();

    for (const [
      key,
      node,
    ] of rawNodes) {
      const bucket =
        typeBuckets.get(node.type) ?? [];

      bucket.push(key);

      typeBuckets.set(
        node.type,
        bucket
      );
    }

    const nodes: GraphNode[] = [];

    for (const [
      type,
      keys,
    ] of typeBuckets) {
      const radius =
        radiusForType(type);

      const sorted = [...keys].sort();

      sorted.forEach(
        (key, index) => {
          const raw =
            rawNodes.get(key)!;

          const baseAngle =
            (index /
              Math.max(
                1,
                sorted.length
              )) *
            Math.PI *
            2;

          const jitter =
            ((hash(key) % 1000) /
              1000 -
              0.5) *
            0.22;

          const radialJitter =
            ((hash(`${key}:r`) %
              1000) /
              1000 -
              0.5) *
            85;

          const r =
            radius +
            radialJitter;

          const angle =
            baseAngle +
            jitter;

          nodes.push({
            key,
            ...raw,
            x:
              CX +
              Math.cos(angle) *
                r,
            y:
              CY +
              Math.sin(angle) *
                r,
          });
        }
      );
    }

    const byKey = new Map(
      nodes.map((node) => [
        node.key,
        node,
      ])
    );

    const edges =
      atlasRelationsV4
        .map((relation) => ({
          relation,
          source: byKey.get(
            nodeKey(
              relation.source.type,
              relation.source.id
            )
          ),
          target: byKey.get(
            nodeKey(
              relation.target.type,
              relation.target.id
            )
          ),
        }))
        .filter(
          (
            edge
          ): edge is typeof edge & {
            source: GraphNode;
            target: GraphNode;
          } =>
            Boolean(edge.source) &&
            Boolean(edge.target)
        );

    return {
      nodes,
      edges,
    };
  }, []);

  const authorMetadata =
    useMemo(() => {
      return new Map(
        atlasAuthorsMaster.map(
          (author) => [
            author.id,
            author,
          ]
        )
      );
    }, []);

  const searchResults =
    useMemo(() => {
      const q =
        searchQuery
          .trim()
          .toLowerCase();

      if (!q) {
        return [];
      }

      const results: Array<{
        node: (typeof graph.nodes)[number];
        author:
          | (typeof atlasAuthorsMaster)[number]
          | undefined;
        score: number;
        matches: boolean;
      }> = [];

      /*
       * AUTORES
       * Buscamos SIEMPRE sobre los 501 autores master.
       * Después localizamos su nodo correspondiente en el grafo.
       */
      for (const author of atlasAuthorsMaster) {
        const node = graph.nodes.find(
          (candidate) =>
            candidate.type === "author" &&
            candidate.id === author.id
        );

        if (!node) {
          continue;
        }

        const languages =
          author.language
            ? [author.language]
            : [];

        const movements =
          author.movements ?? [];

        const themes =
          author.themes ?? [];

        const haystack = [
          author.name,
          author.id,
          author.territory ?? "",
          ...languages,
          ...movements,
          ...themes,
        ]
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(q)) {
          continue;
        }

        const name =
          author.name.toLowerCase();

        let score = 20;

        if (name === q) {
          score += 300;
        } else if (name.startsWith(q)) {
          score += 200;
        } else if (name.includes(q)) {
          score += 120;
        }

        if (
          author.id
            .toLowerCase()
            .includes(q)
        ) {
          score += 80;
        }

        results.push({
          node,
          author,
          score,
          matches: true,
        });
      }

      /*
       * NODOS NO-AUTOR:
       * movimientos, tradiciones, historia,
       * conceptos, lugares, instituciones...
       */
      for (const node of graph.nodes) {
        if (node.type === "author") {
          continue;
        }

        const haystack = [
          node.label,
          node.id,
          node.type,
        ]
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(q)) {
          continue;
        }

        let score = 10;

        const label =
          node.label.toLowerCase();

        if (label === q) {
          score += 250;
        } else if (label.startsWith(q)) {
          score += 150;
        } else if (label.includes(q)) {
          score += 80;
        }

        results.push({
          node,
          author: undefined,
          score,
          matches: true,
        });
      }

      return results
        .sort(
          (a, b) =>
            b.score - a.score ||
            a.node.label.localeCompare(
              b.node.label
            )
        )
        .slice(0, 16);
    }, [
      searchQuery,
      graph.nodes,
    ]);

  const selected =
    graph.nodes.find(
      (node) =>
        node.key === selectedKey
    ) ?? null;

  const selectedAuthor =
    selected?.type === "author"
      ? authorMetadata.get(
          selected.id
        )
      : undefined;

  const connectedKeys =
    useMemo(() => {
      if (!selectedKey) {
        return new Set<string>();
      }

      const set = new Set<string>();

      set.add(selectedKey);

      for (const edge of graph.edges) {
        if (
          edge.source.key ===
          selectedKey
        ) {
          set.add(edge.target.key);
        }

        if (
          edge.target.key ===
          selectedKey
        ) {
          set.add(edge.source.key);
        }
      }

      return set;
    }, [
      selectedKey,
      graph.edges,
    ]);

  const selectedRelations =
    useMemo(() => {
      if (!selectedKey) {
        return [];
      }

      return graph.edges.filter(
        (edge) =>
          edge.source.key ===
            selectedKey ||
          edge.target.key ===
            selectedKey
      );
    }, [
      selectedKey,
      graph.edges,
    ]);

  function visibleByFilter(
    node: GraphNode
  ) {
    if (filter === "all") {
      return true;
    }

    return node.type === filter;
  }

  const filters: {
    id: FilterMode;
    label: string;
  }[] = [
    {
      id: "all",
      label: "Todo",
    },
    {
      id: "author",
      label: "Autores",
    },
    {
      id: "movement",
      label: "Movimientos",
    },
    {
      id: "tradition",
      label: "Tradiciones",
    },
    {
      id: "historical_event",
      label: "Historia",
    },
    {
      id: "concept",
      label: "Conceptos",
    },
  ];

  if (!mounted) {
    return (
      <section
        style={{
          maxWidth: 1400,
          margin: "110px auto 0",
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: ".22em",
            opacity: 0.4,
            marginBottom: 10,
          }}
        >
          GRAFO VIVO · V4
        </div>

        <h2
          style={{
            margin: 0,
            fontSize: "clamp(32px,4vw,58px)",
            fontWeight: 400,
          }}
        >
          Constelación viva
        </h2>

        <div
          style={{
            height: 700,
            marginTop: 25,
            border:
              "1px solid rgba(213,182,104,.12)",
            background:
              "radial-gradient(circle at center, rgba(213,182,104,.035), rgba(0,0,0,.2) 70%)",
          }}
        />
      </section>
    );
  }

  return (
    <section
      style={{
        maxWidth: 1400,
        margin: "110px auto 0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "flex-end",
          gap: 30,
          marginBottom: 25,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: ".22em",
              opacity: 0.4,
              marginBottom: 10,
            }}
          >
            GRAFO VIVO · V4
          </div>

          <h2
            style={{
              margin: 0,
              fontSize:
                "clamp(32px,4vw,58px)",
              fontWeight: 400,
            }}
          >
            Constelación viva
          </h2>
        </div>

        <div
          style={{
            fontSize: 12,
            opacity: 0.45,
            maxWidth: 380,
            textAlign: "right",
            lineHeight: 1.6,
          }}
        >
          Pulsa cualquier nodo para
          aislar su entorno inmediato.
          Pulsa de nuevo para regresar
          a la red.
        </div>
      </div>

      <div
        style={{
          position: "relative",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(0, 1fr) auto",
            gap: 10,
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "relative",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 18,
                top: "50%",
                transform:
                  "translateY(-50%)",
                color:
                  "rgba(213,182,104,.65)",
                fontSize: 15,
                pointerEvents: "none",
              }}
            >
              ⌕
            </span>

            <input
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(
                  event.target.value
                );
                setSearchOpen(true);
              }}
              onFocus={() =>
                setSearchOpen(true)
              }
              onKeyDown={(event) => {
                if (
                  event.key ===
                    "Enter" &&
                  searchResults[0]
                ) {
                  const result =
                    searchResults[0];

                  setSelectedKey(
                    result.node.key
                  );
                  setFilter("all");
                  setSearchQuery(
                    result.node.label
                  );
                  setSearchOpen(false);
                }

                if (
                  event.key ===
                  "Escape"
                ) {
                  setSearchOpen(false);
                }
              }}
              placeholder="Buscar autor, país, movimiento, tradición, concepto..."
              style={{
                boxSizing:
                  "border-box",
                width: "100%",
                height: 52,
                padding:
                  "0 20px 0 48px",
                border:
                  "1px solid rgba(213,182,104,.22)",
                outline: "none",
                background:
                  "rgba(3,4,4,.54)",
                backdropFilter:
                  "blur(16px)",
                color: "#e8dfc8",
                fontFamily:
                  "Georgia, serif",
                fontSize: 14,
                letterSpacing:
                  ".025em",
              }}
            />

            {searchOpen &&
              searchQuery.trim() && (
                <div
                  style={{
                    position:
                      "absolute",
                    top: 58,
                    left: 0,
                    right: 0,
                    zIndex: 40,
                    maxHeight: 390,
                    overflowY:
                      "auto",
                    border:
                      "1px solid rgba(213,182,104,.2)",
                    background:
                      "rgba(4,5,5,.96)",
                    backdropFilter:
                      "blur(22px)",
                    boxShadow:
                      "0 25px 80px rgba(0,0,0,.55)",
                  }}
                >
                  {searchResults.length ? (
                    searchResults.map(
                      ({
                        node,
                        author,
                      }) => (
                        <button
                          key={
                            node.key
                          }
                          onClick={() => {
                            setSelectedKey(
                              node.key
                            );
                            setFilter(
                              "all"
                            );
                            setSearchQuery(
                              node.label
                            );
                            setSearchOpen(
                              false
                            );
                          }}
                          style={{
                            width:
                              "100%",
                            display:
                              "grid",
                            gridTemplateColumns:
                              "1fr auto",
                            alignItems:
                              "center",
                            gap: 20,
                            padding:
                              "14px 17px",
                            border: 0,
                            borderBottom:
                              "1px solid rgba(255,255,255,.055)",
                            background:
                              "transparent",
                            color:
                              "#d7cfbb",
                            textAlign:
                              "left",
                            cursor:
                              "pointer",
                            fontFamily:
                              "inherit",
                          }}
                        >
                          <span>
                            <strong
                              style={{
                                display:
                                  "block",
                                fontSize:
                                  14,
                                fontWeight:
                                  400,
                              }}
                            >
                              {
                                node.label
                              }
                            </strong>

                            <small
                              style={{
                                display:
                                  "block",
                                marginTop:
                                  4,
                                color:
                                  "rgba(220,210,190,.42)",
                                fontSize:
                                  10,
                              }}
                            >
                              {author
                                ? `${
                                    author.territory
                                  } · ${
                                    author.language || "Autor"
                                  }`
                                : typeLabel(
                                    node.type
                                  )}
                            </small>
                          </span>

                          <span
                            style={{
                              color:
                                "#aa925b",
                              fontSize:
                                9,
                              letterSpacing:
                                ".12em",
                              textTransform:
                                "uppercase",
                            }}
                          >
                            {typeLabel(
                              node.type
                            )}
                          </span>
                        </button>
                      )
                    )
                  ) : (
                    <div
                      style={{
                        padding: 18,
                        color:
                          "rgba(220,210,190,.38)",
                        fontSize: 12,
                      }}
                    >
                      Ningún nodo coincide
                      con esta búsqueda.
                    </div>
                  )}
                </div>
              )}
          </div>

          {selectedKey && (
            <button
              onClick={() => {
                setSelectedKey(null);
                setSearchQuery("");
                setSearchOpen(false);
                setFilter("all");
              }}
              style={{
                height: 52,
                padding: "0 18px",
                border:
                  "1px solid rgba(213,182,104,.26)",
                background:
                  "rgba(213,182,104,.055)",
                color: "#c9ad68",
                fontFamily:
                  "inherit",
                fontSize: 11,
                letterSpacing:
                  ".08em",
                cursor: "pointer",
                whiteSpace:
                  "nowrap",
              }}
            >
              ← Volver al universo
            </button>
          )}
        </div>

        {selected && (
          <div
            style={{
              marginTop: 8,
              color:
                "rgba(220,210,190,.34)",
              fontSize: 10,
              letterSpacing:
                ".07em",
            }}
          >
            CONSTELACIÓN INDIVIDUAL ·{" "}
            {selected.label} ·{" "}
            {
              selectedRelations.length
            }{" "}
            conexiones directas
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        {filters.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setFilter(item.id);
              setSelectedKey(null);
            }}
            style={{
              cursor: "pointer",
              border:
                filter === item.id
                  ? "1px solid rgba(213,182,104,.65)"
                  : "1px solid rgba(255,255,255,.12)",
              color:
                filter === item.id
                  ? "#d5b668"
                  : "#c8c3b6",
              background:
                filter === item.id
                  ? "rgba(213,182,104,.06)"
                  : "transparent",
              padding:
                "9px 13px",
              fontFamily: "inherit",
              fontSize: 11,
              letterSpacing: ".08em",
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div
        style={{
          position: "relative",
          border:
            "1px solid rgba(213,182,104,.12)",
          background:
            "radial-gradient(circle at center, rgba(213,182,104,.055), rgba(255,255,255,.008) 43%, rgba(0,0,0,.2) 75%)",
          overflow: "hidden",
          minHeight: 700,
        }}
      >
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          style={{
            display: "block",
            width: "100%",
            height: "auto",
          }}
        >
          <defs>
            <filter
              id="atlasGlow"
              x="-120%"
              y="-120%"
              width="340%"
              height="340%"
            >
              <feGaussianBlur
                stdDeviation="4"
                result="blur"
              />

              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter
              id="atlasSoftGlow"
              x="-100%"
              y="-100%"
              width="300%"
              height="300%"
            >
              <feGaussianBlur
                stdDeviation="2"
                result="blur"
              />

              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <radialGradient id="atlasLivingCore">
              <stop
                offset="0%"
                stopColor="#f8edc7"
                stopOpacity="0.28"
              />

              <stop
                offset="38%"
                stopColor="#d5b668"
                stopOpacity="0.08"
              />

              <stop
                offset="100%"
                stopColor="#d5b668"
                stopOpacity="0"
              />
            </radialGradient>
          </defs>

          <circle
            cx={CX}
            cy={CY}
            r="115"
            fill="url(#atlasLivingCore)"
            className="atlasLivingHeart"
            pointerEvents="none"
          />
          <g className="atlasBreathing">
            <g className="atlasRotating">

          <circle
            cx={CX}
            cy={CY}
            r="330"
            fill="none"
            stroke="rgba(213,182,104,.05)"
          />

          <circle
            cx={CX}
            cy={CY}
            r="225"
            fill="none"
            stroke="rgba(213,182,104,.035)"
          />

          <circle
            cx={CX}
            cy={CY}
            r="120"
            fill="none"
            stroke="rgba(213,182,104,.025)"
          />

          {graph.edges.map(
            (
              {
                relation,
                source,
                target,
              },
              index
            ) => {
              const active =
                !selectedKey ||
                source.key ===
                  selectedKey ||
                target.key ===
                  selectedKey;

              const filterVisible =
                filter === "all" ||
                source.type ===
                  filter ||
                target.type ===
                  filter;

              return (
                <line
                  key={`${relation.id}-${index}`}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={
                    active &&
                    filterVisible
                      ? "rgba(206,181,117,.20)"
                      : "rgba(255,255,255,.012)"
                  }
                  strokeWidth={
                    active &&
                    selectedKey
                      ? 1.25
                      : 0.55
                  }
                />
              );
            }
          )}

          {graph.edges
            .filter(
              (_, index) =>
                index % 7 === 0
            )
            .map(
              ({
                relation,
                source,
                target,
              }) => (
                <circle
                  key={`living-pulse-${relation.id}`}
                  r={
                    1.3 +
                    (hash(relation.id) % 10) / 10
                  }
                  fill="#f4dfa5"
                  opacity="0.72"
                  filter="url(#atlasGlow)"
                  pointerEvents="none"
                >
                  <animateMotion
                    dur={`${
                      6 +
                      (hash(relation.id) % 9)
                    }s`}
                    begin={`-${
                      hash(`${relation.id}:begin`) %
                      10
                    }s`}
                    repeatCount="indefinite"
                    path={`M ${source.x} ${source.y} L ${target.x} ${target.y}`}
                  />
                </circle>
              )
            )}

          {graph.nodes.map(
            (node) => {
              const selectedNode =
                node.key ===
                selectedKey;

              const connected =
                selectedKey
                  ? connectedKeys.has(
                      node.key
                    )
                  : true;

              const filterVisible =
                visibleByFilter(node);

              const dimmed =
                !connected ||
                !filterVisible;

              return (
                <g
                  key={node.key}
                  onClick={() =>
                    setSelectedKey(
                      selectedNode
                        ? null
                        : node.key
                    )
                  }
                  style={{
                    cursor: "pointer",
                  }}
                >
                  {selectedNode && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="18"
                      fill="none"
                      stroke="rgba(213,182,104,.55)"
                      strokeWidth="1"
                    />
                  )}

                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={nodeRadius(
                      node.type
                    )}
                    className="atlasLivingNode"
                    style={{
                      filter:
                        selectedNode
                          ? "url(#atlasGlow)"
                          : node.type === "author"
                            ? "url(#atlasSoftGlow)"
                            : undefined,

                      animationDuration:
                        `${
                          4 +
                          (hash(node.key) % 7)
                        }s`,

                      animationDelay:
                        `-${
                          hash(`${node.key}:delay`) %
                          8
                        }s`,
                    }}
                    fill={
                      selectedNode
                        ? "#ead9a8"
                        : node.type ===
                            "author"
                          ? "#c8bd9a"
                          : node.type ===
                              "historical_event"
                            ? "#ac8f61"
                            : node.type ===
                                "movement"
                              ? "#d5b668"
                              : "#91866d"
                    }
                    opacity={
                      dimmed
                        ? 0.07
                        : selectedNode
                          ? 1
                          : 0.68
                    }
                  />

                  {(selectedNode ||
                    (selectedKey &&
                      connected &&
                      node.key !==
                        selectedKey)) && (
                    <text
                      x={node.x + 10}
                      y={node.y - 8}
                      fill="rgba(240,235,220,.9)"
                      fontSize="10"
                    >
                      {node.label}
                    </text>
                  )}
                </g>
              );
            }
          )}
            </g>
          </g>

        </svg>

        <div
          style={{
            position: "absolute",
            left: 18,
            bottom: 16,
            fontSize: 10,
            opacity: 0.35,
            letterSpacing: ".08em",
          }}
        >
          {graph.nodes.length} nodos ·{" "}
          {graph.edges.length} relaciones
        </div>
      </div>

      {selected && (
        <div
          style={{
            marginTop: 20,
            display: "grid",
            gridTemplateColumns:
              "minmax(220px,.7fr) minmax(0,2fr)",
            gap: 30,
            borderTop:
              "1px solid rgba(213,182,104,.18)",
            paddingTop: 28,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                opacity: 0.4,
                letterSpacing:
                  ".16em",
              }}
            >
              {typeLabel(
                selected.type
              ).toUpperCase()}
            </div>

            <h3
              style={{
                fontSize: 30,
                fontWeight: 400,
                margin:
                  "8px 0 10px",
              }}
            >
              {selected.label}
            </h3>

            {selectedAuthor && (
              <div
                style={{
                  marginBottom: 12,
                  color:
                    "rgba(220,210,190,.48)",
                  fontSize: 11,
                  lineHeight: 1.6,
                }}
              >
                <div>
                  {selectedAuthor.territory}
                </div>

                {selectedAuthor.birth && (
                  <div>
                    {selectedAuthor.birth}
                    {" — "}
                    {selectedAuthor.death ??
                      "presente"}
                  </div>
                )}

                {selectedAuthor.movements
                  ?.length ? (
                  <div
                    style={{
                      marginTop: 5,
                      color:
                        "#9f8a58",
                    }}
                  >
                    {selectedAuthor.movements?.join(
                      " · "
                    )}
                  </div>
                ) : null}
              </div>
            )}

            <div
              style={{
                fontSize: 12,
                opacity: 0.45,
              }}
            >
              {
                selectedRelations.length
              }{" "}
              conexiones visibles
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: 8,
            }}
          >
            {selectedRelations
              .slice(0, 12)
              .map(
                ({
                  relation,
                  source,
                  target,
                }) => {
                  const other =
                    source.key ===
                    selected.key
                      ? target
                      : source;

                  return (
                    <div
                      key={
                        relation.id
                      }
                      style={{
                        display:
                          "grid",
                        gridTemplateColumns:
                          "1fr 180px",
                        gap: 20,
                        borderBottom:
                          "1px solid rgba(255,255,255,.06)",
                        padding:
                          "10px 0",
                      }}
                    >
                      <span>
                        {other.label}
                      </span>

                      <span
                        style={{
                          color:
                            "#b9a46d",
                          fontSize:
                            11,
                          textAlign:
                            "right",
                        }}
                      >
                        {
                          relation.relationType
                        }
                      </span>
                    </div>
                  );
                }
              )}
          </div>
        </div>
      )}
      <style jsx>{`
        .atlasBreathing {
          transform-origin: ${CX}px ${CY}px;
          animation:
            atlasBreath 10s
            ease-in-out infinite;
        }

        .atlasRotating {
          transform-origin: ${CX}px ${CY}px;
          animation:
            atlasRotation 240s
            linear infinite;
        }

        .atlasLivingHeart {
          transform-origin: ${CX}px ${CY}px;
          animation:
            atlasHeart 8s
            ease-in-out infinite;
        }

        .atlasLivingNode {
          transform-box: fill-box;
          transform-origin: center;
          animation-name:
            atlasNodePulse;
          animation-timing-function:
            ease-in-out;
          animation-iteration-count:
            infinite;
        }

        @keyframes atlasBreath {
          0% {
            transform: scale(0.994);
            opacity: 0.9;
          }

          42% {
            transform: scale(1.008);
            opacity: 1;
          }

          55% {
            transform: scale(1.01);
            opacity: 1;
          }

          100% {
            transform: scale(0.994);
            opacity: 0.9;
          }
        }

        @keyframes atlasRotation {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes atlasHeart {
          0%,
          100% {
            transform: scale(0.88);
            opacity: 0.32;
          }

          48% {
            transform: scale(1.12);
            opacity: 0.82;
          }

          55% {
            transform: scale(1.06);
            opacity: 0.64;
          }
        }

        @keyframes atlasNodePulse {
          0%,
          100% {
            transform: scale(0.82);
          }

          45% {
            transform: scale(1.1);
          }

          54% {
            transform: scale(1.22);
          }

          62% {
            transform: scale(1.04);
          }
        }

        @media (
          prefers-reduced-motion:
          reduce
        ) {
          .atlasBreathing,
          .atlasRotating,
          .atlasLivingHeart,
          .atlasLivingNode {
            animation: none !important;
          }
        }
      `}</style>

    </section>
  );
}
