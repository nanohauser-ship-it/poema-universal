"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import OriginalTopBar from "../OriginalTopBar";
import styles from "./HomeNuevaConBarraOriginal.module.css";

type Props = {
  hero: ReactNode;
  tool: ReactNode;
};

export default function HomeNuevaConBarraOriginal({ hero, tool }: Props) {
  return (
    <main id="inicio" className={styles.root}>
      <OriginalTopBar />

      <div className={styles.sideLeft} aria-hidden="true">
        <video autoPlay muted loop playsInline preload="metadata">
          <source
            src="/poema-universal/media/laterals/poema-left.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      <div className={styles.sideRight} aria-hidden="true">
        <video autoPlay muted loop playsInline preload="metadata">
          <source
            src="/poema-universal/media/laterals/poema-right.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      <section className={styles.hero}>{hero}</section>

      <section id="herramienta" className={styles.tool}>
        {tool}
      </section>

      <section className={`${styles.paper} ${styles.manifesto}`}>
        <div className={styles.kicker}>MANIFIESTO</div>

        <div className={styles.manifestoGrid}>
          <h2>
            No todo lo que se pierde desaparece.
            <em>A veces solo necesita una casa.</em>
          </h2>

          <div className={styles.sideCopy}>
            <p>
              Poema Universal nace como una casa para voces, obras y recuerdos
              que merecen permanecer.
            </p>
            <Link href="/fundacion">LEER EL MANIFIESTO →</Link>
          </div>
        </div>
      </section>

      <section className={`${styles.wide} ${styles.territories}`}>
        <div className={styles.territoryImage} aria-hidden="true">
          <img
            src="/poema-universal/home-definitiva/ruinas_celestiales_entre_nubes_y_sabios.png"
            alt=""
          />
        </div>

        <header className={styles.territoryHeader}>
          <div className={styles.kicker}>TRES TERRITORIOS</div>
          <p>Un mismo universo. Tres escalas de una obra.</p>
        </header>

        <div className={styles.doors}>
          <Link href="/obra" className={styles.door}>
            <span>01</span>
            <h3>La Obra Personal</h3>
            <p>Novelas, poesía y libros del autor fundacional.</p>
            <b>DESCUBRIR LA OBRA →</b>
          </Link>

          <Link href="/poema-universal" className={styles.door}>
            <span>02</span>
            <h3>Poema Universal</h3>
            <p>Sesenta voces reunidas en una obra colectiva.</p>
            <b>ENTRAR EN LA EDICIÓN 2026 →</b>
          </Link>

          <a href="#obra-comun" className={styles.door}>
            <span>03</span>
            <h3>La Obra Común</h3>
            <p>Cultura, cuidado y creación construida con otras personas.</p>
            <b>CONOCER LA OBRA COMÚN ↓</b>
          </a>
        </div>
      </section>

      <section className={`${styles.paper} ${styles.poets}`}>
        <div className={styles.poetsCopy}>
          <div className={styles.kicker}>EDICIÓN FUNDACIONAL · 2026</div>
          <h2>
            Sesenta poetas.
            <em>Una misma página.</em>
          </h2>
          <p>
            Sesenta procedencias. Sesenta maneras de mirar. Ninguna voz
            sustituye a otra.
          </p>
          <Link href="/poema-universal">
            ENTRAR EN LA EDICIÓN 2026 →
          </Link>
        </div>

        <figure>
          <img
            src="/poema-universal/home-definitiva/asamblea_de_poetas_entre_las_nubes.png"
            alt="Asamblea de poetas en el universo visual de Poema Universal"
            loading="lazy"
          />
        </figure>
      </section>

      <section className={`${styles.paper} ${styles.rooms}`}>
        <header>
          <div className={styles.kicker}>OTRAS ESTANCIAS</div>
          <h2>Algunas historias necesitan una habitación propia.</h2>
          <p>
            La navegación principal conserva las grandes habitaciones de la
            casa. Aquí quedan solo los espacios laterales.
          </p>
        </header>

        <div className={styles.roomIndex}>
          <Link href="/cartas">
            <span>01</span><strong>Cartas</strong><b>↗</b>
          </Link>
          <Link href="/duelo">
            <span>02</span><strong>Duelo</strong><b>↗</b>
          </Link>
          <Link href="/poema-universal/coro-de-la-tierra">
            <span>03</span><strong>Coro de la Tierra</strong><b>↗</b>
          </Link>
        </div>
      </section>

      <section className={`${styles.paper} ${styles.participate}`}>
        <div>
          <div className={styles.kicker}>PARTICIPA</div>
          <h2>No todas las manos escribirán un verso.</h2>
          <p>Pero todas pueden ayudar a que exista.</p>
        </div>

        <div className={styles.participateGrid}>
          <article>
            <span>01</span>
            <h3>Colaborar</h3>
            <p>
              Edición, traducción, investigación, diseño, sonido o mediación.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Sostener</h3>
            <p>Ayudar a que la edición y el archivo puedan permanecer.</p>
          </article>
        </div>
      </section>

      <section className={`${styles.paper} ${styles.matter}`}>
        <div>
          <div className={styles.kicker}>LA OBRA ADQUIERE CUERPO</div>
          <h2>Libros, objetos, huellas.</h2>
          <p>
            La poesía también deja rastro. La materia conserva lo que la
            pantalla no puede guardar por sí sola.
          </p>
          <Link href="/tienda">EXPLORAR LA TIENDA →</Link>
        </div>

        <figure>
          <img
            src="/poema-universal/home-definitiva/altar_de_poeta_entre_ruinas_celestiales.png"
            alt="Libros y objetos del archivo de Poema Universal"
            loading="lazy"
          />
        </figure>
      </section>

      <section id="obra-comun" className={`${styles.dark} ${styles.common}`}>
        <img
          src="/poema-universal/home-definitiva/ciudad_celestial_bajo_la_luna.png"
          alt=""
          aria-hidden="true"
          loading="lazy"
        />
        <div className={styles.darkVeil} />
        <div className={styles.darkCopy}>
          <div className={styles.darkKicker}>LA OBRA COMÚN</div>
          <h2>La Obra Común.</h2>
          <p>
            La belleza de lo colectivo no se construye con ruido, sino con
            propósito, cuidado y permanencia.
          </p>
        </div>
      </section>

      <section className={`${styles.dark} ${styles.private}`}>
        <img
          src="/poema-universal/home-definitiva/estudio_nocturno_ante_la_ciudad_celeste.png"
          alt=""
          aria-hidden="true"
          loading="lazy"
        />
        <div className={styles.darkVeil} />
        <div className={styles.darkCopy}>
          <div className={styles.darkKicker}>MI HABITACIÓN</div>
          <h2>Mi Habitación.</h2>
          <p>La casa también guarda aquello que no debe exponerse.</p>
        </div>
      </section>

      <footer className={styles.footer}>
        <strong>Poema Universal</strong>
        <span>UNA OBRA COLECTIVA MUNDIAL</span>
        <em>El mundo todavía está escribiendo.</em>
      </footer>
    </main>
  );
}
