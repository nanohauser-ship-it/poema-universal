import Link from "next/link";

import styles from "./MatrizEntrance.module.css";

const REVELATIONS = [
  {
    number: "01",
    title: "Núcleo invisible",
    description:
      "Una lectura posible de aquello que sostiene el poema sin presentarse como significado definitivo.",
  },
  {
    number: "02",
    title: "Símbolo central",
    description:
      "La imagen capaz de condensar las fuerzas, materias y tensiones internas de la obra.",
  },
  {
    number: "03",
    title: "Reliquia",
    description:
      "Un objeto simbólico nacido del poema: materia, memoria y forma reunidas en una pieza.",
  },
  {
    number: "04",
    title: "Escenografía",
    description:
      "El espacio, la atmósfera y la arquitectura donde el poema podría convertirse en presencia.",
  },
  {
    number: "05",
    title: "Gesto final",
    description:
      "La última acción de su ceremonia: aquello que sucede cuando la lectura llega a su límite.",
  },
  {
    number: "06",
    title: "Taller de elevación",
    description:
      "Caminos delicados para revisar ritmo, respiración, imágenes y silencios sin sustituir la voz.",
  },
];

export default function MatrizEntrance() {
  return (
    <section
      id="matriz-poetica"
      className={styles.section}
      aria-labelledby="matriz-entrance-title"
    >
      <div className={styles.frame}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>
              Herramienta pública · Independiente
            </p>

            <h2 id="matriz-entrance-title">
              Matriz Poética
            </h2>
          </div>

          <p className={styles.index}>
            PU · M01
          </p>
        </header>

        <div className={styles.hero}>
          <div className={styles.statement}>
            <p className={styles.introduction}>
              Entrega un poema. Contempla la arquitectura
              invisible que estaba viviendo dentro de él.
            </p>

            <blockquote>
              No escribimos el poema por ti.
              <br />
              Construimos un altar para que puedas verlo.
            </blockquote>

            <p className={styles.description}>
              La Matriz escucha el texto y lo devuelve como
              lectura, símbolo, reliquia, escenografía y gesto
              final. No dicta un significado ni reescribe la
              voz: ofrece una forma nueva de contemplarla.
            </p>

            <Link
              href="/poema-universal/matriz-poetica"
              className={styles.primaryLink}
            >
              <span>Entrar en la Matriz</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div
            className={styles.sigilChamber}
            aria-hidden="true"
          >
            <div className={styles.outerOrbit}>
              <span className={styles.northStar}>✦</span>

              <div className={styles.innerOrbit}>
                <div className={styles.threshold}>
                  <div className={styles.keyhole}>
                    <span />
                  </div>

                  <div className={styles.labyrinth}>
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
              </div>

              <span className={styles.southPoint} />
            </div>

            <p>
              El poema no es ilustrado.
              <br />
              Es condensado en un signo.
            </p>
          </div>
        </div>

        <div className={styles.divider}>
          <span />
          <p>Lo que la Matriz revela</p>
          <span />
        </div>

        <div className={styles.revelations}>
          {REVELATIONS.map((revelation) => (
            <article
              key={revelation.number}
              className={styles.revelation}
            >
              <span>{revelation.number}</span>

              <h3>{revelation.title}</h3>

              <p>{revelation.description}</p>
            </article>
          ))}
        </div>

        <footer className={styles.footer}>
          <div className={styles.privacy}>
            <span className={styles.privacyMark}>
              ◇
            </span>

            <div>
              <strong>
                La palabra continúa perteneciendo al poeta
              </strong>

              <p>
                Poema Universal no incorpora el poema, su
                análisis ni su sello al canon o a sus sistemas
                internos. No se guarda en Poema Universal por
                defecto.
              </p>
            </div>
          </div>

          <Link
            href="/poema-universal/matriz-poetica"
            className={styles.secondaryLink}
          >
            Abrir herramienta
            <span aria-hidden="true">→</span>
          </Link>
        </footer>
      </div>
    </section>
  );
}
