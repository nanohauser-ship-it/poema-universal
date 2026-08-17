"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import type {
  CSSProperties,
} from "react";

import {
  storedPlateToBookPlate,
  type AlchemicalPlate,
} from "./laminas";

import {
  ALCHEMICAL_BOOK_UPDATED_EVENT,
  listStoredAlchemicalPlates,
} from "@/lib/bestiario-poetico/libro-alquimico-store";

import styles
  from "./libro-alquimico.module.css";

type ViewMode =
  | "cover"
  | "book"
  | "archive"
  | "table";

type Props = {
  plates: readonly AlchemicalPlate[];
};

function plateVisualStyle(
  plate: AlchemicalPlate
): CSSProperties | undefined {
  if (!plate.image) {
    return undefined;
  }

  return {
    backgroundImage: [
      "linear-gradient(",
      "180deg,",
      "rgba(5, 4, 3, 0.05),",
      "rgba(5, 4, 3, 0.72)",
      "),",
      `url("${plate.image}")`,
    ].join(" "),
  };
}

export default function LibroAlquimicoClient({
  plates: initialPlates,
}: Props) {
  const [
    libraryPlates,
    setLibraryPlates,
  ] = useState<AlchemicalPlate[]>(
    [...initialPlates]
  );

  const [
    loadingLibrary,
    setLoadingLibrary,
  ] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadLibrary() {
      try {
        const stored =
          await
            listStoredAlchemicalPlates();

        if (!cancelled) {
          setLibraryPlates(
            stored.map(
              storedPlateToBookPlate
            )
          );
        }
      } catch (error) {
        console.error(
          "No se pudo abrir "
          + "el Libro Alquímico:",
          error
        );
      } finally {
        if (!cancelled) {
          setLoadingLibrary(false);
        }
      }
    }

    const reloadLibrary = () => {
      void loadLibrary();
    };

    void loadLibrary();

    window.addEventListener(
      ALCHEMICAL_BOOK_UPDATED_EVENT,
      reloadLibrary
    );

    return () => {
      cancelled = true;

      window.removeEventListener(
        ALCHEMICAL_BOOK_UPDATED_EVENT,
        reloadLibrary
      );
    };
  }, []);

  const [view, setView] =
    useState<ViewMode>("cover");

  const [activeIndex, setActiveIndex] =
    useState(0);

  const activePlate =
    libraryPlates[activeIndex];

  const previousPlate = () => {
    setActiveIndex((current) => {
      return (
        current - 1 + libraryPlates.length
      ) % libraryPlates.length;
    });
  };

  const nextPlate = () => {
    setActiveIndex((current) => {
      return (
        current + 1
      ) % libraryPlates.length;
    });
  };

  const openPlate = (
    index: number
  ) => {
    setActiveIndex(index);
    setView("book");
  };

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <Link
          href={
            "/poema-universal/" +
            "bestiario-poetico"
          }
          className={styles.backLink}
        >
          ← Bestiario Poético
        </Link>

        <p className={styles.headerMark}>
          Poema Universal · 2026
        </p>

        <nav
          className={styles.navigation}
          aria-label={
            "Modos del Libro Alquímico"
          }
        >
          <button
            type="button"
            className={
              view === "cover"
                ? styles.activeNav
                : styles.navButton
            }
            onClick={() =>
              setView("cover")
            }
          >
            Portada
          </button>

          <button
            type="button"
            className={
              view === "book"
                ? styles.activeNav
                : styles.navButton
            }
            onClick={() =>
              setView("book")
            }
          >
            Libro
          </button>

          <button
            type="button"
            className={
              view === "archive"
                ? styles.activeNav
                : styles.navButton
            }
            onClick={() =>
              setView("archive")
            }
          >
            Archivo
          </button>

          <button
            type="button"
            className={
              view === "table"
                ? styles.activeNav
                : styles.navButton
            }
            onClick={() =>
              setView("table")
            }
          >
            Mesa
          </button>
        </nav>
      </header>

      {view !== "cover" &&
        !loadingLibrary &&
        libraryPlates.length === 0 && (
          <section
            className={
              styles.emptySection
            }
          >
            <div
              className={
                styles.emptySeal
              }
              aria-hidden="true"
            >
              ◇
            </div>

            <p
              className={
                styles.sectionEyebrow
              }
            >
              Libro todavía no iniciado
            </p>

            <h1
              className={
                styles.emptyTitle
              }
            >
              El volumen espera
              su primera lámina
            </h1>

            <p
              className={
                styles.emptyText
              }
            >
              Ninguna forma ha sido
              confiada todavía a su
              memoria. Revela una
              lámina en el Atlas
              Alquímico y decide
              guardarla aquí.
            </p>

            <Link
              href={
                "/poema-universal/"
                + "bestiario-poetico/"
                + "asamblea"
              }
              className={
                styles.emptyLink
              }
            >
              Ir al Atlas Alquímico
            </Link>
          </section>
        )}

      {view === "cover" && (
        <section
          className={styles.coverSection}
        >
          <div
            className={styles.coverAura}
            aria-hidden="true"
          />

          <article
            className={styles.bookCover}
          >
            <img
              src="/poema-universal/bestiario/libro-alquimico/portada-libro-alquimico.png"
              alt="El Libro Alquímico · Bestiario Poético"
              className={styles.coverImage}
            />

            <div
              className={
                styles.coverInnerBorder
              }
            >
              <p
                className={
                  styles.coverEyebrow
                }
              >
                Bestiario Poético
              </p>

              <div
                className={
                  styles.coverSymbol
                }
                aria-hidden="true"
              >
                ◇
              </div>

              <h1
                className={
                  styles.coverTitle
                }
              >
                El Libro
                <br />
                Alquímico
              </h1>

              <p
                className={
                  styles.coverSubtitle
                }
              >
                Archivo de las formas
                <br />
                que todavía no existen
              </p>

              <div
                className={
                  styles.coverDivider
                }
              />

              <p
                className={
                  styles.coverVolume
                }
              >
                Volumen I · MMXXVI
              </p>
            </div>
          </article>

          <div
            className={
              styles.coverIntroduction
            }
          >
            <p>
              Cada lámina es un folio
              de una enciclopedia poética
              interminable.
            </p>

            <button
              type="button"
              className={
                styles.primaryButton
              }
              onClick={() =>
                setView("book")
              }
            >
              Abrir el volumen
            </button>

            <span
              className={
                styles.plateCounter
              }
            >
              {libraryPlates.length}
              {" "}
              láminas custodiadas
            </span>
          </div>
        </section>
      )}

      {view === "book" && activePlate && (
        <section
          className={styles.readerSection}
        >
          <div
            className={styles.readerHeading}
          >
            <div>
              <p
                className={
                  styles.sectionEyebrow
                }
              >
                Libro abierto
              </p>

              <h1
                className={
                  styles.sectionTitle
                }
              >
                Lámina
                {" "}
                {String(
                  activeIndex + 1
                ).padStart(2, "0")}
              </h1>
            </div>

            <p
              className={
                styles.readerPosition
              }
              aria-live="polite"
            >
              {activeIndex + 1}
              {" / "}
              {libraryPlates.length}
            </p>
          </div>

          <div className={styles.book}>
            <article
              className={styles.leftPage}
            >
              <div
                className={
                  styles.plateArtwork
                }
                style={
                  plateVisualStyle(
                    activePlate
                  )
                }
              >
                <div
                  className={
                    styles.artworkTexture
                  }
                />

                <span
                  className={
                    styles.artworkSigil
                  }
                >
                  {activePlate.sigil}
                </span>

                <div
                  className={
                    styles.artworkCaption
                  }
                >
                  <span>
                    {
                      activePlate.id
                    }
                  </span>

                  <strong>
                    {
                      activePlate.title
                    }
                  </strong>
                </div>
              </div>
            </article>

            <article
              className={styles.rightPage}
            >
              <p
                className={
                  styles.catalogueNumber
                }
              >
                {activePlate.id}
              </p>

              <h2
                className={
                  styles.plateTitle
                }
              >
                {activePlate.title}
              </h2>

              <dl
                className={
                  styles.metadata
                }
              >
                <div
                  className={
                    styles.metadataBlock
                  }
                >
                  <dt>Familia</dt>
                  <dd>
                    {
                      activePlate.family
                    }
                  </dd>
                </div>

                <div
                  className={
                    styles.metadataBlock
                  }
                >
                  <dt>Materia</dt>
                  <dd>
                    {activePlate.matter.join(
                      " · "
                    )}
                  </dd>
                </div>

                <div
                  className={
                    styles.metadataBlock
                  }
                >
                  <dt>
                    Operación alquímica
                  </dt>
                  <dd>
                    {
                      activePlate.operation
                    }
                  </dd>
                </div>

                <div
                  className={
                    styles.metadataBlock
                  }
                >
                  <dt>Símbolos</dt>
                  <dd>
                    {activePlate.symbols.join(
                      " · "
                    )}
                  </dd>
                </div>

                <div
                  className={
                    styles.metadataBlock
                  }
                >
                  <dt>Origen</dt>
                  <dd>
                    {
                      activePlate.origin
                    }
                  </dd>
                </div>

                <div
                  className={
                    styles.metadataBlock
                  }
                >
                  <dt>Relación</dt>
                  <dd>
                    {
                      activePlate.relation
                    }
                  </dd>
                </div>
              </dl>

              <footer
                className={
                  styles.pageFooter
                }
              >
                <span>
                  Poema Universal
                </span>

                <span>
                  {activePlate.date}
                </span>
              </footer>
            </article>
          </div>

          <div
            className={styles.readerControls}
          >
            <button
              type="button"
              onClick={previousPlate}
              className={
                styles.secondaryButton
              }
            >
              ← Lámina anterior
            </button>

            <div
              className={styles.progress}
              aria-hidden="true"
            >
              {libraryPlates.map(
                (plate, index) => (
                  <button
                    type="button"
                    key={plate.id}
                    className={
                      index === activeIndex
                        ? styles.activeDot
                        : styles.dot
                    }
                    onClick={() =>
                      setActiveIndex(index)
                    }
                    tabIndex={-1}
                    aria-label={
                      `Abrir ${plate.title}`
                    }
                  />
                )
              )}
            </div>

            <button
              type="button"
              onClick={nextPlate}
              className={
                styles.secondaryButton
              }
            >
              Lámina siguiente →
            </button>
          </div>
        </section>
      )}

      {view === "archive" &&
        libraryPlates.length > 0 && (
        <section
          className={styles.archiveSection}
        >
          <div
            className={styles.sectionHeading}
          >
            <div>
              <p
                className={
                  styles.sectionEyebrow
                }
              >
                Índice general
              </p>

              <h1
                className={
                  styles.sectionTitle
                }
              >
                Archivo de láminas
              </h1>
            </div>

            <p
              className={
                styles.sectionDescription
              }
            >
              Un catálogo permanente de
              criaturas, materias,
              transformaciones y símbolos.
            </p>
          </div>

          <div
            className={styles.archiveGrid}
          >
            {libraryPlates.map(
              (plate, index) => (
                <button
                  type="button"
                  key={plate.id}
                  className={
                    styles.archiveCard
                  }
                  onClick={() =>
                    openPlate(index)
                  }
                >
                  <div
                    className={
                      styles.archiveArtwork
                    }
                    style={
                      plateVisualStyle(
                        plate
                      )
                    }
                  >
                    <span>
                      {plate.sigil}
                    </span>
                  </div>

                  <div
                    className={
                      styles.archiveInformation
                    }
                  >
                    <p>
                      {plate.id}
                    </p>

                    <h2>
                      {plate.title}
                    </h2>

                    <span>
                      {plate.family}
                    </span>
                  </div>
                </button>
              )
            )}
          </div>
        </section>
      )}

      {view === "table" &&
        libraryPlates.length > 0 && (
        <section
          className={styles.tableSection}
        >
          <div
            className={styles.sectionHeading}
          >
            <div>
              <p
                className={
                  styles.sectionEyebrow
                }
              >
                Disposición ceremonial
              </p>

              <h1
                className={
                  styles.sectionTitle
                }
              >
                Mesa alquímica
              </h1>
            </div>

            <p
              className={
                styles.sectionDescription
              }
            >
              Las láminas se despliegan
              como folios suspendidos de
              una misma obra.
            </p>
          </div>

          <div
            className={styles.tableViewport}
          >
            <div
              className={styles.tableArchive}
            >
              {libraryPlates.map(
                (plate, index) => (
                  <button
                    type="button"
                    key={plate.id}
                    className={
                      styles.floatingPlate
                    }
                    style={{
                      transform:
                        index % 2 === 0
                          ? "rotateY(15deg)"
                          : "rotateY(-15deg)",
                    }}
                    onClick={() =>
                      openPlate(index)
                    }
                  >
                    <div
                      className={
                        styles.floatingArtwork
                      }
                      style={
                        plateVisualStyle(
                          plate
                        )
                      }
                    >
                      <span>
                        {plate.sigil}
                      </span>
                    </div>

                    <footer>
                      <small>
                        {plate.id}
                      </small>

                      <strong>
                        {plate.title}
                      </strong>
                    </footer>
                  </button>
                )
              )}
            </div>
          </div>

          <p className={styles.tableHint}>
            Arrastra horizontalmente para
            recorrer el archivo.
          </p>
        </section>
      )}

      <footer className={styles.siteFooter}>
        <span>
          © 2026 Poema Universal
        </span>

        <span>
          Fundador y poeta · José Naveiro
        </span>

        <span>
          El Libro Alquímico · Volumen I
        </span>
      </footer>
    </main>
  );
}
