import Link from "next/link";

import styles
  from "./libro-alquimico-portal.module.css";

const BOOK_ROUTE =
  "/poema-universal/"
  + "bestiario-poetico/"
  + "libro-alquimico";

const COVER_ROUTE =
  "/poema-universal/"
  + "bestiario/"
  + "libro-alquimico/"
  + "portada-libro-alquimico.png";

export default function
LibroAlquimicoPortal() {
  return (
    <section
      className={styles.portal}
      aria-labelledby={
        "libro-alquimico-portal-title"
      }
    >
      <div
        className={styles.backgroundSeal}
        aria-hidden="true"
      >
        ◇
      </div>

      <div className={styles.heading}>
        <p className={styles.eyebrow}>
          Archivo vivo · Bestiario Poético
        </p>

        <p className={styles.index}>
          Sala permanente · I
        </p>
      </div>

      <div className={styles.layout}>
        <Link
          href={BOOK_ROUTE}
          className={styles.coverLink}
          aria-label={
            "Abrir El Libro Alquímico"
          }
        >
          <figure className={styles.cover}>
            <img
              src={COVER_ROUTE}
              alt={
                "Portada de El Libro "
                + "Alquímico"
              }
            />

            <div
              className={styles.coverReflection}
              aria-hidden="true"
            />

            <figcaption>
              Volumen I · MMXXVI
            </figcaption>
          </figure>
        </Link>

        <div className={styles.content}>
          <p className={styles.kicker}>
            Las formas que permanecen
          </p>

          <h2
            id={
              "libro-alquimico-portal-title"
            }
            className={styles.title}
          >
            El Libro
            <br />
            <em>Alquímico</em>
          </h2>

          <p className={styles.lead}>
            Las imágenes reveladas por
            el Bestiario no desaparecen.
            Aquí permanecen, numeradas,
            custodiadas y convertidas
            en una obra editorial viva.
          </p>

          <blockquote
            className={styles.manifesto}
          >
            Cada lámina es un folio de
            una enciclopedia poética
            interminable.
          </blockquote>

          <dl className={styles.metadata}>
            <div>
              <dt>Naturaleza</dt>
              <dd>Archivo editorial</dd>
            </div>

            <div>
              <dt>Materia</dt>
              <dd>Imagen · símbolo · voz</dd>
            </div>

            <div>
              <dt>Estado</dt>
              <dd>Volumen en crecimiento</dd>
            </div>
          </dl>

          <div className={styles.actions}>
            <Link
              href={BOOK_ROUTE}
              className={styles.primaryLink}
            >
              <span>Abrir el libro</span>
              <b aria-hidden="true">
                →
              </b>
            </Link>

            <Link
              href={`${BOOK_ROUTE}#archivo`}
              className={styles.secondaryLink}
            >
              Consultar el archivo
            </Link>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <span>
          Poema Universal · 2026
        </span>

        <span>
          Archivo de las formas que
          todavía no existen
        </span>

        <span>
          José Naveiro
        </span>
      </footer>
    </section>
  );
}
