"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  CartographyLink,
  CartographyNode,
  SymbolicAxis,
  SymbolicCartography,
} from "@/lib/asamblea/cartografia";

import styles from "./cartografia-simbolica.module.css";

import AlchemicalLayer from "./AlchemicalLayer";

type Props = {
  map: SymbolicCartography;
  activeAxis?: SymbolicAxis | null;
  onAxisChange?: (
    axis: SymbolicAxis
  ) => void;
};

const AXIS_LABELS:
  Record<SymbolicAxis, string> = {
  memory: "Memoria",
  desire: "Deseo",
  wound: "Herida",
  matter: "Materia",
};

const AXIS_CLASS:
  Record<SymbolicAxis, string> = {
  memory: "axisMemory",
  desire: "axisDesire",
  wound: "axisWound",
  matter: "axisMatter",
};

function nodePoint(
  node: CartographyNode
) {
  return {
    x: node.x * 10,
    y: node.y * 7,
  };
}

function buildRoutePath(
  from: CartographyNode,
  to: CartographyNode
) {
  const start = nodePoint(from);
  const end = nodePoint(to);

  const controlX =
    (start.x + end.x) / 2 +
    (350 -
      (start.y + end.y) / 2) *
      0.12;

  const controlY =
    (start.y + end.y) / 2 -
    (500 -
      (start.x + end.x) / 2) *
      0.08;

  return {
    start,
    end,
    controlX,
    controlY,
    path:
      `M ${start.x} ${start.y} ` +
      `Q ${controlX} ${controlY} ` +
      `${end.x} ${end.y}`,
  };
}

export default function
CartografiaSimbolica({
  map,
  activeAxis,
  onAxisChange,
}: Props) {
  const [
    activeNodeId,
    setActiveNodeId,
  ] = useState(
    map.nodes[0]?.id ?? ""
  );

  const [
    activeRouteId,
    setActiveRouteId,
  ] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!activeAxis) {
      return;
    }

    const matchingNode =
      map.nodes.find(
        (node) =>
          node.axis === activeAxis
      );

    if (matchingNode) {
      setActiveNodeId(
        matchingNode.id
      );
    }
  }, [
    activeAxis,
    map.nodes,
  ]);

  const activeNode = useMemo(
    () =>
      map.nodes.find(
        (node) =>
          node.id === activeNodeId
      ) ??
      map.nodes[0] ??
      null,
    [
      map.nodes,
      activeNodeId,
    ]
  );

  const activeRoute = useMemo(
    () =>
      map.links.find(
        (link) =>
          link.id ===
          activeRouteId
      ) ?? null,
    [
      map.links,
      activeRouteId,
    ]
  );

  const connectedRoutes =
    useMemo(
      () => {
        if (!activeNode) {
          return [];
        }

        return map.links.filter(
          (link) =>
            link.from ===
              activeNode.id ||
            link.to ===
              activeNode.id
        );
      },
      [
        map.links,
        activeNode,
      ]
    );

  const connectedNodeIds =
    useMemo(() => {
      if (!activeNode) {
        return new Set<string>();
      }

      const ids =
        new Set<string>([
          activeNode.id,
        ]);

      connectedRoutes.forEach(
        (route) => {
          ids.add(route.from);
          ids.add(route.to);
        }
      );

      return ids;
    }, [
      activeNode,
      connectedRoutes,
    ]);

  function selectNode(
    node: CartographyNode
  ) {
    setActiveNodeId(node.id);
    setActiveRouteId(null);
    onAxisChange?.(node.axis);
  }

  function selectRoute(
    route: CartographyLink
  ) {
    setActiveRouteId(route.id);

    const destination =
      map.nodes.find(
        (node) =>
          node.id === route.to
      );

    const origin =
      map.nodes.find(
        (node) =>
          node.id === route.from
      );

    const target =
      destination ?? origin;

    if (target) {
      setActiveNodeId(target.id);
      onAxisChange?.(
        target.axis
      );
    }
  }

  return (
    <section
      className={
        styles.cartography
      }
    >
      <header
        className={
          styles.cartographyHeader
        }
      >
        <div>
          <p
            className={
              styles.eyebrow
            }
          >
            Cartografía simbólica
            del escrito
          </p>

          <h2>
            {map.secretTitle}
          </h2>
        </div>

        <blockquote>
          “{map.oraclePhrase}”
        </blockquote>
      </header>

      <div
        className={
          styles.cartographyLayout
        }
      >
        <aside
          className={
            styles.leftRail
          }
        >
          <article>
            <small>Núcleo</small>

            <p>
              {map.nucleus}
            </p>
          </article>

          <article>
            <small>
              Eje dominante
            </small>

            <strong>
              {
                AXIS_LABELS[
                  map.dominantAxis
                ]
              }
            </strong>
          </article>

          <article>
            <small>Reliquia</small>

            <p>
              {map.relic}
            </p>
          </article>

          <article
            className={
              styles.routeIndex
            }
          >
            <small>
              Rutas activas
            </small>

            {connectedRoutes.length >
            0 ? (
              <div
                className={
                  styles.routeButtons
                }
              >
                {connectedRoutes.map(
                  (route) => (
                    <button
                      type="button"
                      key={route.id}
                      className={[
                        styles.routeButton,
                        activeRouteId ===
                        route.id
                          ? styles.routeButtonActive
                          : "",
                      ].join(" ")}
                      onClick={() =>
                        selectRoute(
                          route
                        )
                      }
                    >
                      <span>↝</span>

                      {
                        route.relation
                      }
                    </button>
                  )
                )}
              </div>
            ) : (
              <p>
                El nodo no presenta
                todavía una ruta
                abierta.
              </p>
            )}
          </article>
        </aside>

        <div
          className={
            styles.mapFrame
          }
        >
          <div
            className={
              styles.mapOrnament
            }
          />

          <AlchemicalLayer
            map={map}
          />

          <svg
            viewBox="0 0 1000 700"
            className={
              styles.mapSvg
            }
            role="img"
            aria-label={
              `Cartografía: ${map.secretTitle}`
            }
          >
            <defs>
              <radialGradient
                id="cartographyCore"
              >
                <stop
                  offset="0%"
                  stopColor="#fff1c2"
                  stopOpacity="1"
                />

                <stop
                  offset="24%"
                  stopColor="#d49a42"
                  stopOpacity="0.82"
                />

                <stop
                  offset="100%"
                  stopColor="#6e4319"
                  stopOpacity="0"
                />
              </radialGradient>

              <filter
                id="cartographyGlow"
                x="-100%"
                y="-100%"
                width="300%"
                height="300%"
              >
                <feGaussianBlur
                  stdDeviation="7"
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
            </defs>

            <circle
              cx="500"
              cy="350"
              r="312"
              className={
                styles.outerOrbit
              }
            />

            <circle
              cx="500"
              cy="350"
              r="244"
              className={
                styles.middleOrbit
              }
            />

            <circle
              cx="500"
              cy="350"
              r="174"
              className={
                styles.innerOrbit
              }
            />

            <line
              x1="86"
              y1="350"
              x2="914"
              y2="350"
              className={
                styles.axisLine
              }
            />

            <line
              x1="500"
              y1="54"
              x2="500"
              y2="646"
              className={
                styles.axisLine
              }
            />

            {map.zones.map(
              (zone, index) => {
                const x =
                  zone.x * 10;

                const y =
                  zone.y * 7;

                const radius =
                  zone.radius * 3.1;

                const zoneClass = [
                  styles.zone,
                  styles.zoneReveal,
                ].join(" ");

                const style = {
                  animationDelay:
                    `${0.2 + index * 0.12}s`,
                };

                if (
                  zone.shape ===
                  "triangle"
                ) {
                  return (
                    <polygon
                      key={zone.id}
                      points={
                        `${x},${y - radius} ` +
                        `${x - radius},${y + radius * 0.75} ` +
                        `${x + radius},${y + radius * 0.75}`
                      }
                      className={
                        zoneClass
                      }
                      style={style}
                    />
                  );
                }

                if (
                  zone.shape ===
                  "fortress"
                ) {
                  return (
                    <rect
                      key={zone.id}
                      x={
                        x - radius
                      }
                      y={
                        y - radius
                      }
                      width={
                        radius * 2
                      }
                      height={
                        radius * 2
                      }
                      className={
                        zoneClass
                      }
                      style={style}
                      transform={
                        `rotate(45 ${x} ${y})`
                      }
                    />
                  );
                }

                return (
                  <circle
                    key={zone.id}
                    cx={x}
                    cy={y}
                    r={radius}
                    className={[
                      zone.shape ===
                      "ring"
                        ? styles.zoneRing
                        : styles.zone,
                      styles.zoneReveal,
                    ].join(" ")}
                    style={style}
                  />
                );
              }
            )}

            {map.links.map(
              (link, index) => {
                const from =
                  map.nodes.find(
                    (node) =>
                      node.id ===
                      link.from
                  );

                const to =
                  map.nodes.find(
                    (node) =>
                      node.id ===
                      link.to
                  );

                if (!from || !to) {
                  return null;
                }

                const route =
                  buildRoutePath(
                    from,
                    to
                  );

                const touchesNode =
                  activeNode
                    ? link.from ===
                        activeNode.id ||
                      link.to ===
                        activeNode.id
                    : false;

                const selected =
                  activeRouteId ===
                  link.id;

                return (
                  <path
                    key={link.id}
                    d={route.path}
                    className={[
                      styles.route,
                      styles.routeReveal,
                      touchesNode
                        ? styles.routeConnected
                        : styles.routeMuted,
                      selected
                        ? styles.routeSelected
                        : "",
                    ].join(" ")}
                    style={{
                      animationDelay:
                        `${0.8 + index * 0.1}s`,
                      strokeWidth:
                        selected
                          ? 3
                          : 0.7 +
                            link.strength *
                              0.18,
                    }}
                  />
                );
              }
            )}

            <circle
              cx="500"
              cy="350"
              r="102"
              fill="url(#cartographyCore)"
              className={[
                styles.coreHalo,
                styles.coreReveal,
              ].join(" ")}
            />

            <circle
              cx="500"
              cy="350"
              r="64"
              className={[
                styles.coreCircle,
                styles.coreReveal,
              ].join(" ")}
              filter="url(#cartographyGlow)"
            />

            <text
              x="500"
              y="328"
              textAnchor="middle"
              className={
                styles.coreCaption
              }
            >
              NÚCLEO
            </text>

            <text
              x="500"
              y="355"
              textAnchor="middle"
              className={
                styles.coreGlyph
              }
            >
              ✦
            </text>

            <text
              x="500"
              y="383"
              textAnchor="middle"
              className={
                styles.coreLabel
              }
            >
              {map.centralSymbol}
            </text>

            {map.nodes.map(
              (node, index) => {
                const point =
                  nodePoint(node);

                const selected =
                  node.id ===
                  activeNode?.id;

                const connected =
                  connectedNodeIds.has(
                    node.id
                  );

                return (
                  <g
                    key={node.id}
                    className={[
                      styles.nodeGroup,
                      styles.nodeReveal,
                      connected
                        ? styles.nodeConnected
                        : styles.nodeMuted,
                    ].join(" ")}
                    style={{
                      animationDelay:
                        `${1.35 + index * 0.14}s`,
                    }}
                    onClick={() =>
                      selectNode(node)
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(
                      event
                    ) => {
                      if (
                        event.key ===
                          "Enter" ||
                        event.key ===
                          " "
                      ) {
                        selectNode(
                          node
                        );
                      }
                    }}
                  >
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={
                        selected
                          ? 32
                          : 23
                      }
                      className={[
                        styles.nodeHalo,
                        styles[
                          AXIS_CLASS[
                            node.axis
                          ]
                        ],
                        selected
                          ? styles.nodeSelected
                          : "",
                      ].join(" ")}
                    />

                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={
                        selected
                          ? 21
                          : 16
                      }
                      className={
                        styles.nodeCore
                      }
                    />

                    <text
                      x={point.x}
                      y={point.y + 6}
                      textAnchor="middle"
                      className={
                        styles.nodeGlyph
                      }
                    >
                      {node.glyph}
                    </text>

                    <text
                      x={point.x}
                      y={
                        point.y + 45
                      }
                      textAnchor="middle"
                      className={
                        styles.nodeLabel
                      }
                    >
                      {node.label}
                    </text>
                  </g>
                );
              }
            )}
          </svg>

          <div
            className={
              styles.cardinalNorth
            }
          >
            <span>Norte</span>
            Aire · memoria
          </div>

          <div
            className={
              styles.cardinalEast
            }
          >
            <span>Este</span>
            Fuego · deseo
          </div>

          <div
            className={
              styles.cardinalSouth
            }
          >
            <span>Sur</span>
            Tierra · materia
          </div>

          <div
            className={
              styles.cardinalWest
            }
          >
            <span>Oeste</span>
            Agua · herida
          </div>
        </div>

        <aside
          className={
            styles.rightRail
          }
        >
          {activeNode ? (
            <article
              className={
                styles.activeReading
              }
            >
              <small>
                {
                  AXIS_LABELS[
                    activeNode.axis
                  ]
                }
              </small>

              <div
                className={
                  styles.activeGlyph
                }
              >
                {
                  activeNode.glyph
                }
              </div>

              <h3>
                {activeNode.label}
              </h3>

              <p>
                {activeNode.meaning}
              </p>

              <div
                className={
                  styles.evidence
                }
              >
                {activeNode.evidence.map(
                  (fragment) => (
                    <q
                      key={fragment}
                    >
                      {fragment}
                    </q>
                  )
                )}
              </div>

              <span
                className={
                  styles.intensity
                }
              >
                Intensidad simbólica ·{" "}
                {
                  activeNode.intensity
                }
                /10
              </span>
            </article>
          ) : null}

          {activeRoute && (
            <article
              className={
                styles.activeRouteReading
              }
            >
              <small>
                Ruta seleccionada
              </small>

              <div
                className={
                  styles.routeSymbol
                }
              >
                ↝
              </div>

              <p>
                {
                  activeRoute.relation
                }
              </p>

              <span
                className={
                  styles.intensity
                }
              >
                Fuerza del vínculo ·{" "}
                {
                  activeRoute.strength
                }
                /10
              </span>
            </article>
          )}

          <article>
            <small>
              Gesto final
            </small>

            <p>
              {map.finalGesture}
            </p>
          </article>
        </aside>
      </div>

      <footer
        className={
          styles.legend
        }
      >
        {(
          Object.keys(
            AXIS_LABELS
          ) as SymbolicAxis[]
        ).map((axis) => (
          <button
            type="button"
            key={axis}
            className={
              activeAxis === axis
                ? styles.legendAxisActive
                : ""
            }
            onClick={() => {
              const node =
                map.nodes.find(
                  (candidate) =>
                    candidate.axis ===
                    axis
                );

              if (node) {
                selectNode(node);
              }
            }}
          >
            <i
              className={
                styles[
                  AXIS_CLASS[axis]
                ]
              }
            />

            {AXIS_LABELS[axis]}
          </button>
        ))}

        <span>
          <b>◇</b>
          Nodo
        </span>

        <span>
          <b>↝</b>
          Ruta
        </span>

        <span>
          <b>⌂</b>
          Umbral
        </span>

        <span>
          <b>✦</b>
          Núcleo
        </span>
      </footer>
    </section>
  );
}
