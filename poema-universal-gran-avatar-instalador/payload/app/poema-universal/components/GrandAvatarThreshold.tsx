import Image from "next/image";
import Link from "next/link";

import styles from "./GrandAvatarThreshold.module.css";

export default function GrandAvatarThreshold() {
  return (
    <section
      className={styles.threshold}
      aria-labelledby="grand-avatar-threshold-title"
    >
      <Link href="/poema-universal/gran-avatar">
        <Image
          className={styles.image}
          src="/poema-universal/gran-avatar/avatar-poster.webp"
          alt="El Gran Avatar ante un cuaderno abierto"
          fill
          sizes="(max-width: 760px) 100vw, 1380px"
        />
        <div className={styles.veil} aria-hidden="true" />

        <div className={styles.heading}>
          <p>Presencia central · Archivo vivo</p>
          <h2 id="grand-avatar-threshold-title">
            El Gran
            <em>Avatar</em>
          </h2>
        </div>

        <div className={styles.statement}>
          <p>
            Entrega un poema.
            <span>La presencia escucha antes de hablar.</span>
          </p>
          <strong>Entrar en conversación →</strong>
        </div>
      </Link>
    </section>
  );
}
