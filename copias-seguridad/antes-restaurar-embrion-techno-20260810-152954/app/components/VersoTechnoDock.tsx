"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./VersoTechnoDock.module.css";

export default function VersoTechnoDock() {
  const pathname = usePathname();
  const dentroDeEmbrion = pathname?.startsWith("/embrion");

  return (
    <aside className={styles.dock} aria-label="Acceso a Embrión">
      <Link
        href={
          dentroDeEmbrion
            ? "/poema-universal"
            : "/embrion"
        }
      >
        <span className={styles.signal} aria-hidden="true" />

        <span className={styles.code}>
          {dentroDeEmbrion ? "REGRESO" : "ATLAS 01"}
        </span>

        <strong>
          {dentroDeEmbrion
            ? "← Poema Universal"
            : "Entrar en Embrión →"}
        </strong>
      </Link>
    </aside>
  );
}
