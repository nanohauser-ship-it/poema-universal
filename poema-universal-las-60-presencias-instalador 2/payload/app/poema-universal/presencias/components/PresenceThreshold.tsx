import Link from "next/link";

import styles from "./PresenceThreshold.module.css";

export default function PresenceThreshold() {
  return (
    <section
      className={styles.threshold}
      aria-labelledby="presences-threshold-title"
    >
      <Link href="/poema-universal/presencias">
        <div>
          <p className={styles.index}>
            Archivo audiovisual
          </p>
          <h2 id="presences-threshold-title">
            Las 60 Presencias
          </h2>
        </div>

        <p className={styles.statement}>
          El rostro, la voz, el territorio,
          <em> el poema y el silencio.</em>
        </p>

        <span className={styles.action}>
          Entrar en el archivo →
        </span>
      </Link>
    </section>
  );
}
