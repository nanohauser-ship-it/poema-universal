import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  CONFIRMED_POETIC_PRESENCES,
  FOUNDATIONAL_EDITION_YEAR,
  getPoeticPresenceBySlug,
  type PresenceProductionStatus,
} from "../../data/poeticPresences";
import PresenceAudio from "../components/PresenceAudio";
import PresenceFilm from "../components/PresenceFilm";
import PresenceNavigation from "../components/PresenceNavigation";
import PresencePoem from "../components/PresencePoem";
import styles from "../presence.module.css";

type PresencePageProps = {
  params: Promise<{ slug: string }>;
};

const STATUS: Record<
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

export function generateStaticParams() {
  return CONFIRMED_POETIC_PRESENCES.map(
    (presence) => ({ slug: presence.slug }),
  );
}

export async function generateMetadata({
  params,
}: PresencePageProps): Promise<Metadata> {
  const { slug } = await params;
  const presence = getPoeticPresenceBySlug(slug);

  if (
    !presence ||
    presence.participantStatus !== "confirmed" ||
    !presence.name
  ) {
    return {
      title: "Presencia no encontrada · Poema Universal",
    };
  }

  return {
    title: `${presence.name} · Las 60 Presencias`,
    description: `${presence.name}, ${presence.territory}. Archivo audiovisual de Poema Universal 2026.`,
  };
}

export default async function PresencePage({
  params,
}: PresencePageProps) {
  const { slug } = await params;
  const presence = getPoeticPresenceBySlug(slug);

  if (
    !presence ||
    presence.participantStatus !== "confirmed" ||
    !presence.name ||
    !presence.country ||
    !presence.territory
  ) {
    notFound();
  }

  const production = presence.productionStatus
    ? STATUS[presence.productionStatus]
    : null;

  return (
    <main className={styles.presencePage}>
      <header className={styles.topbar}>
        <Link href="/poema-universal/presencias">
          Las 60 Presencias
        </Link>
        <span>
          Archivo audiovisual · Poema Universal
        </span>
      </header>

      <section
        className={styles.presenceHero}
        aria-labelledby="presence-name"
      >
        <div className={styles.identity}>
          <p className={styles.position}>
            {String(presence.id).padStart(2, "0")} / 60
          </p>
          <h1 id="presence-name">{presence.name}</h1>
          <p className={styles.territory}>
            {presence.territory}
            {presence.territoryNative ? (
              <span lang={presence.language?.code}>
                {presence.territoryNative}
              </span>
            ) : null}
          </p>

          <p className={styles.heroPoemTitle}>
            <span>Título del poema</span>
            <strong>
              {presence.poem?.title ?? "Poema pendiente"}
            </strong>
          </p>

          {production ? (
            <p
              className={styles.statusLine}
              aria-label={production.label}
              title={production.label}
            >
              <span aria-hidden="true">
                {production.symbol}
              </span>
              {production.label}
            </p>
          ) : null}
        </div>

        <div className={styles.filmColumn}>
          <PresenceFilm
            name={presence.name}
            portraitUrl={presence.media.portraitUrl}
            filmUrl={presence.media.filmUrl}
            captions={presence.media.captions}
          />
          <p className={styles.filmCaption}>
            <span>Retrato / película</span>
            <span>Formato maestro · 16:9</span>
          </p>
        </div>
      </section>

      <PresencePoem poem={presence.poem} />

      {presence.media.audioUrl &&
      !presence.media.filmUrl ? (
        <PresenceAudio
          name={presence.name}
          audioUrl={presence.media.audioUrl}
        />
      ) : null}

      <section
        className={styles.archiveSection}
        aria-labelledby="archive-title"
      >
        <div>
          <p className={styles.sectionIndex}>
            Territorio / archivo
          </p>
          <h2 id="archive-title">
            Edición Fundacional
          </h2>
        </div>

        <dl className={styles.archiveData}>
          <div>
            <dt>Territorio</dt>
            <dd>{presence.territory}</dd>
          </div>
          <div>
            <dt>Lengua original</dt>
            <dd>
              {presence.language?.label ?? "Pendiente"}
            </dd>
          </div>
          <div>
            <dt>Archivo</dt>
            <dd>Poema Universal</dd>
          </div>
          <div>
            <dt>Edición</dt>
            <dd>{FOUNDATIONAL_EDITION_YEAR}</dd>
          </div>
        </dl>
      </section>

      <PresenceNavigation presence={presence} />
    </main>
  );
}
