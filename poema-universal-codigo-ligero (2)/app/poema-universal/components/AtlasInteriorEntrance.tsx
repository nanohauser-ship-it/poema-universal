import Link from "next/link";
import styles from "./AtlasInteriorEntrance.module.css";

export default function AtlasInteriorEntrance() {
  return (
    <section className={styles.section}>
      <div className={styles.sky}>
        <i /><i /><i /><i /><i /><i />
        <span className={styles.root} />
      </div>

      <div className={styles.content}>
        <p>Tercera cámara · Memoria simbólica</p>
        <h2>Atlas Interior</h2>
        <blockquote>
          Conserva la memoria de las formas con las que tu obra intenta conocerse.
        </blockquote>
        <span>
          Reúne tus textos, contempla la biografía de tus símbolos y descubre
          cómo evoluciona tu mitología personal a través del tiempo.
        </span>
        <Link href="/poema-universal/atlas-interior">
          Abrir mi constelación
        </Link>
      </div>

      <div className={styles.legend}>
        <span>Símbolos</span>
        <span>Arquetipos</span>
        <span>Reliquias</span>
        <span>Ausencias</span>
        <span>Movimiento</span>
      </div>
    </section>
  );
}
