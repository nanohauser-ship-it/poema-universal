import Image from "next/image";
import Link from "next/link";

import styles from "./archivo-apariciones-portal.module.css";

const worlds = [
  {
    number: "I",
    title: "No dejes que desaparezcamos",
    symbol: "El Árbol Blanco",
    image:
      "/images/museo/tres-mundos/prototipo/ndd-01.webp",
  },
  {
    number: "II",
    title: "La Jerarquía del Hambre",
    symbol: "Atlas",
    image:
      "/images/museo/tres-mundos/prototipo/jdh-01.webp",
  },
  {
    number: "III",
    title: "Memorias de Bielka",
    symbol: "Mara",
    image:
      "/images/museo/tres-mundos/prototipo/mdb-01.webp",
  },
];

export default function ArchivoAparicionesPortal() {
  return (
    <section
      className={styles.portal}
      aria-labelledby="archivo-apariciones-heading"
    >
      <div
        className={styles.backgroundNumber}
        aria-hidden="true"
      >
        24
      </div>

      <div className={styles.copy}>
        <p className={styles.room}>
          Sala I · Archivo fotográfico
        </p>

        <h2 id="archivo-apariciones-heading">
          Archivo de
          <br />
          apariciones
        </h2>

        <p className={styles.introduction}>
          Veinticuatro fotografías conservan la memoria
          material del tríptico: cuerpos, paisajes,
          habitaciones, umbrales, objetos y reliquias.
        </p>

        <div className={styles.statistics}>
          <span>
            <strong>24</strong>
            fotografías
          </span>

          <span>
            <strong>3</strong>
            mundos
          </span>

          <span>
            <strong>8</strong>
            apariciones por obra
          </span>
        </div>

        <Link
          className={styles.enter}
          href="/poema-universal/museo-de-los-tres-mundos/archivo-de-apariciones"
        >
          <span>Entrar en la sala</span>
          <b aria-hidden="true">↗</b>
        </Link>
      </div>

      <div
        className={styles.visual}
        aria-label="Las tres obras del archivo"
      >
        <div className={styles.orbit} aria-hidden="true" />

        {worlds.map((world, index) => (
          <figure
            className={`${styles.plate} ${
              styles[`plate${index + 1}`]
            }`}
            key={world.number}
          >
            <Image
              src={world.image}
              alt={`${world.title}: ${world.symbol}`}
              fill
              sizes="(max-width: 900px) 82vw, 650px"
            />

            <span className={styles.imageShade} />

            <figcaption>
              <small>{world.number}</small>
              <strong>{world.symbol}</strong>
              <em>{world.title}</em>
            </figcaption>
          </figure>
        ))}

        <div className={styles.axis} aria-hidden="true">
          <span>I</span>
          <i />
          <span>II</span>
          <i />
          <span>III</span>
        </div>
      </div>
    </section>
  );
}
