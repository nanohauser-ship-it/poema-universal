import Link from "next/link";

import styles from "./archivo-apariciones-door.module.css";

export default function ArchivoAparicionesDoor() {
  return (
    <aside
      className={styles.access}
      aria-label="Acceso al Archivo de apariciones"
    >
      <Link
        href="/poema-universal/museo-de-los-tres-mundos/archivo-de-apariciones"
        className={styles.door}
      >
        <span className={styles.number}>
          I
        </span>

        <span className={styles.copy}>
          <small>
            Sala fotográfica
          </small>

          <strong>
            Archivo de apariciones
          </strong>

          <em>
            24 fotografías · 3 mundos
          </em>
        </span>

        <span
          className={styles.arrow}
          aria-hidden="true"
        >
          ↗
        </span>
      </Link>
    </aside>
  );
}
