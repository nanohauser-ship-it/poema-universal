import ArchivoAparicionesPortal from "./ArchivoAparicionesPortal";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import styles from "./museo-tres-mundos.module.css";

export const metadata: Metadata = {
  title: "Museo de los Tres Mundos | Poema Universal",
  description:
    "Museo visual de No dejes que desaparezcamos, La Jerarquía del Hambre y Memorias de Bielka.",
};

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

export default function MuseoDeLosTresMundosPage() {
  return (
    <main className={styles.museum}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>
          Poema Universal · Archivo narrativo
        </p>

        <h1>
          Museo de los
          <br />
          Tres Mundos
        </h1>

        <p className={styles.introduction}>
          Un archivo material para las imágenes, reliquias,
          personajes y lugares que atraviesan el tríptico.
        </p>
      </header>

      <section
        className={styles.worlds}
        aria-label="Las tres obras"
      >
        {worlds.map((world) => (
          <article className={styles.world} key={world.number}>
            <div className={styles.worldImage}>
              <Image
                src={world.image}
                alt={world.symbol}
                fill
                sizes="(max-width: 800px) 92vw, 32vw"
                priority={world.number === "I"}
              />
            </div>

            <div className={styles.worldInformation}>
              <span>{world.number}</span>

              <div>
                <h2>{world.title}</h2>
                <p>{world.symbol}</p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section
        className={styles.archive}
        aria-labelledby="archivo-apariciones-title"
      >
        <div className={styles.archiveCopy}>
          <p className={styles.eyebrow}>
            Sala fundacional · 24 fotografías
          </p>

          <h2 id="archivo-apariciones-title">
            Archivo de
            <br />
            apariciones
          </h2>

          <p>
            Ocho fotografías por cada obra. Escenas, cuerpos,
            espacios y reliquias reunidos como memoria visual
            del tríptico.
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
            <span>Entrar en el archivo</span>
            <b aria-hidden="true">↗</b>
          </Link>
        </div>

        <div className={styles.stack} aria-hidden="true">
          {worlds.map((world, index) => (
            <figure
              key={world.number}
              className={styles.plate}
              style={{
                transform: `
                  translate3d(
                    ${index * 46}px,
                    ${index * -32}px,
                    ${index * 70}px
                  )
                  rotateZ(${(index - 1) * 2.4}deg)
                `,
                zIndex: index + 1,
              }}
            >
              <Image
                src={world.image}
                alt=""
                fill
                sizes="620px"
              />

              <span>{world.number}</span>
            </figure>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <span>Poema Universal</span>
        <span>Museo de los Tres Mundos</span>
      </footer>
    
      <ArchivoAparicionesPortal />
</main>
  );
}
