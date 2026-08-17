import Link from "next/link";

import styles
  from "./ThreePresencesEntrance.module.css";

const ROOM_ROUTE =
  "/poema-universal/"
  + "sala-de-las-tres-presencias";

const PRESENCES = [
  {
    id: "camus",
    name: "Albert Camus",
    surname: "Camus",
    symbol: "☀",
    sentence:
      "La claridad frente al absurdo.",
    cover:
      "/poema-universal/"
      + "presencias/caratulas/"
      + "camus.png?v=2",
  },
  {
    id: "borges",
    name: "Jorge Luis Borges",
    surname: "Borges",
    symbol: "∞",
    sentence:
      "El infinito como biblioteca.",
    cover:
      "/poema-universal/"
      + "presencias/caratulas/"
      + "borges.png?v=2",
  },
  {
    id: "pizarnik",
    name: "Alejandra Pizarnik",
    surname: "Pizarnik",
    symbol: "☾",
    sentence:
      "La palabra pronunciada en la noche.",
    cover:
      "/poema-universal/"
      + "presencias/caratulas/"
      + "pizarnik.png?v=2",
  },
] as const;

export default function
ThreePresencesEntrance() {
  return (
    <section
      id="sala-de-las-tres-presencias"
      className={styles.section}
      aria-labelledby={
        "three-presences-title"
      }
    >
      <div
        className={styles.backgroundMark}
        aria-hidden="true"
      >
        ✦
      </div>

      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            Habitación de escritura · 01
          </p>

          <h2 id="three-presences-title">
            La Sala de las
            <br />
            <em>Tres Presencias</em>
          </h2>
        </div>

        <div className={styles.introduction}>
          <p>
            Un espacio privado para
            escribir acompañado por
            Camus, Borges o Pizarnik.
          </p>

          <p>
            Ninguna presencia escribe
            por ti. Cada una protege
            una forma distinta de mirar.
          </p>
        </div>
      </header>

      <div className={styles.covers}>
        {PRESENCES.map(
          (presence, index) => (
            <Link
              key={presence.id}
              href={ROOM_ROUTE}
              className={styles.coverLink}
              aria-label={
                `Entrar en la sala `
                + `con ${presence.name}`
              }
            >
              <article
                className={styles.coverCard}
              >
                <div
                  className={
                    styles.coverRegistry
                  }
                >
                  <span>
                    0{index + 1}
                  </span>

                  <span>
                    {presence.symbol}
                  </span>
                </div>

                <div
                  className={
                    styles.coverFrame
                  }
                >
                  <img
                    src={presence.cover}
                    alt={
                      `Carátula de `
                      + presence.name
                    }
                  />

                  <div
                    className={
                      styles.coverLight
                    }
                    aria-hidden="true"
                  />
                </div>

                <footer
                  className={
                    styles.coverFooter
                  }
                >
                  <div>
                    <small>
                      {presence.name}
                    </small>

                    <strong>
                      {presence.surname}
                    </strong>
                  </div>

                  <p>
                    {presence.sentence}
                  </p>
                </footer>
              </article>
            </Link>
          )
        )}
      </div>

      <footer className={styles.footer}>
        <div>
          <span>
            Escritura privada
          </span>

          <span aria-hidden="true">
            ·
          </span>

          <span>
            Tres modos de compañía
          </span>

          <span aria-hidden="true">
            ·
          </span>

          <span>
            Guardado automático
          </span>
        </div>

        <Link
          href={ROOM_ROUTE}
          className={styles.enterLink}
        >
          <span>
            Entrar en la habitación
          </span>

          <b aria-hidden="true">
            →
          </b>
        </Link>
      </footer>
    </section>
  );
}
