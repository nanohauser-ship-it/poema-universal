import type { Metadata } from "next";
import Link from "next/link";

import {
  CONFIRMED_POETIC_PRESENCES,
  FOUNDATIONAL_EDITION_YEAR,
  TOTAL_PRESENCES,
} from "../data/poeticPresences";
import styles from "./archive.module.css";
import PresenceArchive from "./components/PresenceArchive";

export const metadata: Metadata = {
  title: "Las 60 Presencias · Poema Universal",
  description:
    "Archivo audiovisual de la Edición Fundacional 2026 de Poema Universal.",
};

export default function PresenciasPage() {
  const pendingCount =
    TOTAL_PRESENCES -
    CONFIRMED_POETIC_PRESENCES.length;

  return (
    <main className={styles.archivePage}>
      <header className={styles.topbar}>
        <Link href="/poema-universal">
          Poema Universal
        </Link>

        <div className={styles.topbarMeta}>
          <span>Archivo audiovisual</span>
          <span>
            Edición Fundacional · {FOUNDATIONAL_EDITION_YEAR}
          </span>
        </div>
      </header>

      <section
        className={styles.archiveHero}
        aria-labelledby="presencias-title"
      >
        <div>
          <p className={styles.archiveIndex}>
            Archivo humano · Edición fundacional
          </p>
          <h1
            id="presencias-title"
            className={styles.archiveTitle}
          >
            Las 60
            <span>Presencias</span>
          </h1>
          <p className={styles.archiveDescriptor}>
            60 voces · 60 territorios · 60 poemas
          </p>
        </div>

        <div className={styles.archiveStatement}>
          <p>
            Un rostro. Una voz. Un territorio.
            El poema permanece.
          </p>
          <p>
            Ocho retratos están documentados. Los otros
            {` ${pendingCount} `}
            lugares conservan su silencio hasta recibir
            a las personas que los habitarán.
          </p>
        </div>
      </section>

      <section
        className={styles.register}
        aria-labelledby="register-title"
      >
        <header className={styles.registerHead}>
          <h2 id="register-title">
            Registro de la edición
          </h2>
          <span>
            {String(
              CONFIRMED_POETIC_PRESENCES.length,
            ).padStart(2, "0")}
            /{TOTAL_PRESENCES} presencias documentadas
          </span>
        </header>

        <PresenceArchive />
      </section>

      <footer className={styles.archiveFooter}>
        <span>
          Archivo audiovisual · Poema Universal
        </span>
        <span>Edición Fundacional 2026</span>
        <Link href="/poema-universal">
          Volver a Poema Universal ↑
        </Link>
      </footer>
    </main>
  );
}
