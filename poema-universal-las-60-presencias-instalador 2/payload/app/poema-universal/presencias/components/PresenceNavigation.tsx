import Link from "next/link";

import {
  CONFIRMED_POETIC_PRESENCES,
  type PoeticPresence,
} from "../../data/poeticPresences";
import styles from "../presence.module.css";

export default function PresenceNavigation({
  presence,
}: {
  presence: PoeticPresence;
}) {
  const currentIndex =
    CONFIRMED_POETIC_PRESENCES.findIndex(
      (item) => item.slug === presence.slug,
    );

  const previous =
    currentIndex > 0
      ? CONFIRMED_POETIC_PRESENCES[currentIndex - 1]
      : null;
  const next =
    currentIndex >= 0 &&
    currentIndex < CONFIRMED_POETIC_PRESENCES.length - 1
      ? CONFIRMED_POETIC_PRESENCES[currentIndex + 1]
      : null;

  return (
    <nav
      className={styles.presenceNavigation}
      aria-label="Navegación entre presencias documentadas"
    >
      <div>
        {previous ? (
          <Link
            href={`/poema-universal/presencias/${previous.slug}`}
            rel="prev"
          >
            <span>← Presencia anterior</span>
            <strong>{previous.name}</strong>
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}
      </div>

      <Link
        href="/poema-universal/presencias"
        className={styles.archiveReturn}
      >
        Volver a las 60 presencias
      </Link>

      <div>
        {next ? (
          <Link
            href={`/poema-universal/presencias/${next.slug}`}
            rel="next"
          >
            <span>Siguiente presencia →</span>
            <strong>{next.name}</strong>
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}
      </div>
    </nav>
  );
}
