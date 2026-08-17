import Link from "next/link";

import {
  POETIC_PRESENCES,
  type PoeticPresence,
  type PresenceProductionStatus,
} from "../../data/poeticPresences";
import styles from "../archive.module.css";
import PresencePortrait from "./PresencePortrait";

const STATUS_SYMBOLS: Record<
  PresenceProductionStatus,
  { symbol: string; label: string }
> = {
  portrait: {
    symbol: "○",
    label: "Retrato incorporado",
  },
  voice: {
    symbol: "◐",
    label: "Voz recibida",
  },
  production: {
    symbol: "◑",
    label: "Película en producción",
  },
  completed: {
    symbol: "●",
    label: "Presencia completa",
  },
};

function PresenceCopy({
  presence,
}: {
  presence: PoeticPresence;
}) {
  const status = presence.productionStatus
    ? STATUS_SYMBOLS[presence.productionStatus]
    : null;

  return (
    <div className={styles.presenceCopy}>
      <div className={styles.presenceIdentity}>
        <span className={styles.presenceNumber}>
          {String(presence.id).padStart(2, "0")}
        </span>

        <div>
          <h2>
            {presence.name ?? "Presencia por llegar"}
          </h2>
          <p>
            {presence.territory ??
              "Territorio por documentar"}
          </p>
        </div>
      </div>

      <span
        className={styles.productionMark}
        aria-label={status?.label ?? "Lugar en espera"}
        title={status?.label ?? "Lugar en espera"}
      >
        {status?.symbol ?? "·"}
      </span>
    </div>
  );
}

export default function PresenceArchive() {
  return (
    <ol
      className={styles.wall}
      aria-label="Archivo de las sesenta presencias"
    >
      {POETIC_PRESENCES.map((presence, index) => {
        const cadence = index % 5;
        const isConfirmed =
          presence.participantStatus === "confirmed";
        const content = (
          <>
            <PresencePortrait
              name={presence.name}
              number={presence.id}
              portraitUrl={presence.media.portraitUrl}
              previewVideoUrl={
                presence.media.previewVideoUrl
              }
              priority={index < 4}
            />
            <PresenceCopy presence={presence} />
          </>
        );

        return (
          <li
            key={presence.id}
            className={`${styles.presence} ${
              isConfirmed
                ? styles.presenceConfirmed
                : styles.presencePending
            }`}
            data-cadence={cadence}
          >
            {isConfirmed ? (
              <Link
                href={`/poema-universal/presencias/${presence.slug}`}
                className={styles.presenceLink}
                aria-label={`Entrar en la presencia ${String(
                  presence.id,
                ).padStart(2, "0")}: ${presence.name}`}
              >
                {content}
              </Link>
            ) : (
              <article aria-label={`Presencia ${String(
                presence.id,
              ).padStart(2, "0")}, en espera`}>
                {content}
              </article>
            )}
          </li>
        );
      })}
    </ol>
  );
}
