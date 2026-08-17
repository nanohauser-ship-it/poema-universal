import Link from "next/link";

import styles from "./return-to-museum.module.css";

export default function ReturnToMuseum() {
  return (
    <aside
      className={styles.returnAccess}
      aria-label="Regresar al recorrido tridimensional"
    >
      <Link
        href="/museo-de-los-tres-mundos/recorrido"
        className={styles.returnLink}
      >
        <span aria-hidden="true">
          ←
        </span>

        <span>
          <small>
            Museo de los Tres Mundos
          </small>

          <strong>
            Volver al recorrido 3D
          </strong>
        </span>
      </Link>
    </aside>
  );
}
