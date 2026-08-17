
import AtlasConstellationV4 from "./components/AtlasConstellationV4";
import { atlasRelationsV4 } from "@/lib/grafo-literario/atlas-relations-v4";
import { atlasAuthorsMaster } from "@/lib/grafo-literario/atlas-authors-master";
import { atlasExternalNodesMaster } from "@/lib/grafo-literario/atlas-external-nodes-master";

export default function AtlasInfluenciasV4Page() {
  const internalAuthors = new Set(
    atlasAuthorsMaster.map((author) => author.id)
  );

  const touchedAuthors = new Set<string>();

  for (const relation of atlasRelationsV4) {
    if (
      relation.source.type === "author" &&
      internalAuthors.has(relation.source.id)
    ) {
      touchedAuthors.add(relation.source.id);
    }

    if (
      relation.target.type === "author" &&
      internalAuthors.has(relation.target.id)
    ) {
      touchedAuthors.add(relation.target.id);
    }
  }

  const nodeTypes = new Set<string>();
  const relationTypes = new Set<string>();

  for (const relation of atlasRelationsV4) {
    nodeTypes.add(relation.source.type);
    nodeTypes.add(relation.target.type);
    relationTypes.add(relation.relationType);
  }

  const coverage =
    (touchedAuthors.size / atlasAuthorsMaster.length) * 100;

  const recentRelations = atlasRelationsV4.slice(-24);

  return (
    <>
      <a
        href="/poema-universal"
        style={{
          position: "fixed",
          top: 22,
          right: 24,
          zIndex: 10000,
          padding: "10px 16px",
          border: "1px solid rgba(215,181,105,.30)",
          borderRadius: 999,
          background: "rgba(4,5,5,.72)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          color: "#d6b86f",
          fontFamily: "Georgia, serif",
          fontSize: 11,
          letterSpacing: ".07em",
          textDecoration: "none",
          boxShadow: "0 8px 30px rgba(0,0,0,.30)",
        }}
      >
        ← Poema Universal
      </a>

    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #171710 0%, #080807 48%, #020202 100%)",
        color: "#eee9dc",
        padding: "48px",
        fontFamily: "Georgia, serif",
      }}
    >
      <header
        style={{
          maxWidth: 1400,
          margin: "0 auto 50px",
        }}
      >
        <div
          style={{
            fontSize: 12,
            letterSpacing: "0.28em",
            opacity: 0.5,
            marginBottom: 18,
          }}
        >
          POEMA UNIVERSAL · CARTOGRAFÍA V4
        </div>

        <h1
          style={{
            fontSize: "clamp(42px, 6vw, 92px)",
            fontWeight: 400,
            margin: 0,
            lineHeight: 0.95,
          }}
        >
          Atlas Universal
          <br />
          de las Influencias
        </h1>

        <p
          style={{
            maxWidth: 720,
            marginTop: 28,
            fontSize: 18,
            lineHeight: 1.7,
            opacity: 0.7,
          }}
        >
          La literatura no como una colección de nombres,
          sino como una red de lecturas, guerras, traducciones,
          movimientos, amistades, exilios, tradiciones y
          transformaciones.
        </p>
      </header>

      <section
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
        }}
      >
        {[
          ["RELACIONES", atlasRelationsV4.length],
          ["AUTORES DEL CORPUS", atlasAuthorsMaster.length],
          ["AUTORES CONECTADOS", touchedAuthors.size],
          ["COBERTURA", `${coverage.toFixed(2)}%`],
          ["NODOS EXTERNOS", atlasExternalNodesMaster.length],
          ["TIPOS DE NODO", nodeTypes.size],
          ["TIPOS DE RELACIÓN", relationTypes.size],
        ].map(([label, value]) => (
          <div
            key={label}
            style={{
              border: "1px solid rgba(220,200,145,.18)",
              background: "rgba(255,255,255,.025)",
              padding: "22px 20px",
              minHeight: 100,
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: ".16em",
                opacity: 0.45,
              }}
            >
              {label}
            </div>

            <div
              style={{
                marginTop: 12,
                fontSize: 30,
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </section>

      <AtlasConstellationV4 />


      <section
        style={{
          maxWidth: 1400,
          margin: "70px auto 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 20,
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontSize: 28,
              fontWeight: 400,
              margin: 0,
            }}
          >
            Fragmentos de la red
          </h2>

          <span
            style={{
              fontSize: 12,
              opacity: 0.45,
            }}
          >
            últimas 24 relaciones del corpus
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gap: 8,
          }}
        >
          {recentRelations.map((relation) => (
            <article
              key={relation.id}
              style={{
                display: "grid",
                gridTemplateColumns:
                  "minmax(140px,1fr) 180px minmax(140px,1fr)",
                alignItems: "center",
                gap: 18,
                borderTop:
                  "1px solid rgba(220,200,145,.12)",
                padding: "18px 0",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    opacity: 0.4,
                    marginBottom: 5,
                  }}
                >
                  {relation.source.type}
                </div>

                <strong
                  style={{
                    fontWeight: 400,
                    fontSize: 17,
                  }}
                >
                  {relation.source.label ??
                    relation.source.id}
                </strong>
              </div>

              <div
                style={{
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    color: "#c7ad68",
                    fontSize: 12,
                    letterSpacing: ".07em",
                  }}
                >
                  {relation.relationType}
                </div>

                <div
                  style={{
                    margin: "6px 0",
                    opacity: 0.25,
                  }}
                >
                  ─────────→
                </div>

                <div
                  style={{
                    fontSize: 10,
                    opacity: 0.4,
                  }}
                >
                  {relation.confidence}
                </div>
              </div>

              <div
                style={{
                  textAlign: "right",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    opacity: 0.4,
                    marginBottom: 5,
                  }}
                >
                  {relation.target.type}
                </div>

                <strong
                  style={{
                    fontWeight: 400,
                    fontSize: 17,
                  }}
                >
                  {relation.target.label ??
                    relation.target.id}
                </strong>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
    </>
  );
}
