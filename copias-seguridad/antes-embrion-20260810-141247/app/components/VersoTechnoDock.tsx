"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./VersoTechnoDock.module.css";

export default function VersoTechnoDock() {
  const pathname = usePathname();
  const dentroDeLaHerramienta =
    pathname?.startsWith("/laboratorio/verso-tecno");

  return (
    <aside className={styles.dock} aria-label="Acceso a Verso Techno">
      <Link
        href={
          dentroDeLaHerramienta
            ? "/poema-universal"
            : "/laboratorio/verso-tecno"
        }
      >
        <span className={styles.signal} aria-hidden="true" />

        <span className={styles.code}>
          {dentroDeLaHerramienta ? "REGRESO" : "LAB 01"}
        </span>

        <strong>
          {dentroDeLaHerramienta
            ? "← Poema Universal"
            : "Verso → Techno"}
        </strong>
      </Link>
    </aside>
  );
}
