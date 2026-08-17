import type { Metadata } from "next";
import Link from "next/link";

import styles from "./encadenamiento.module.css";

const ROOM_URL =
  "https://poema-universal-encadenamiento.pale-dell-6762.chatgpt.site";

export const metadata: Metadata = {
  title: "Encadenamiento · Poema Universal",
  description: "Sala Encadenamiento de Poema Universal.",
};

export default function EncadenamientoPage() {
  return (
    <main className={styles.room}>
      <header className={styles.header}>
        <Link href="/poema-universal" className={styles.brand}>
          Poema Universal
        </Link>

        <div className={styles.roomIdentity}>
          <span className={styles.eyebrow}>Sala independiente</span>
          <h1>Encadenamiento</h1>
        </div>

        <a
          href={ROOM_URL}
          target="_blank"
          rel="noreferrer"
          className={styles.externalLink}
        >
          Abrir aparte
        </a>
      </header>

      <section className={styles.frameShell} aria-label="Sala Encadenamiento">
        <iframe
          src={ROOM_URL}
          title="Encadenamiento · Poema Universal"
          className={styles.frame}
          allow="clipboard-read; clipboard-write; fullscreen"
          referrerPolicy="no-referrer"
        />
      </section>
    </main>
  );
}
