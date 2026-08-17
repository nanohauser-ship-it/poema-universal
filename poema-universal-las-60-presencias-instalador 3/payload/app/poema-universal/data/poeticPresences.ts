import {
  CURATED_VOICES,
  type CuratedVoice,
} from "./curatedVoices";
import { FOUNDATIONAL_BOOK_POEMS_BY_POET } from "./foundationalPoems";

export const FOUNDATIONAL_EDITION_YEAR = 2026;
export const TOTAL_PRESENCES = 60;

export type PresenceProductionStatus =
  | "portrait"
  | "voice"
  | "production"
  | "completed";

export type PresenceParticipationStatus =
  | "confirmed"
  | "pending";

export type LocalizedPoemText = {
  languageCode: string;
  label: string;
  kind: "original" | "translation";
  text: string;
};

export type PresenceCaption = {
  src: string;
  languageCode: string;
  label: string;
  default?: boolean;
};

export type PresenceCredits = {
  voice?: string;
  translation?: string;
  film?: string;
};

export type PoeticPresence = {
  id: number;
  slug: string;
  participantStatus: PresenceParticipationStatus;
  name: string | null;
  country: string | null;
  territory: string | null;
  territoryNative?: string;
  language: {
    code: string;
    label: string;
  } | null;
  poem: {
    title: string;
    texts: LocalizedPoemText[];
  } | null;
  media: {
    portraitUrl: string | null;
    previewVideoUrl?: string;
    filmUrl?: string;
    verticalFilmUrl?: string;
    audioUrl?: string;
    duration?: number;
    captions?: PresenceCaption[];
  };
  productionStatus: PresenceProductionStatus | null;
  year: number;
  credits?: PresenceCredits;
};

type ConfirmedVoice = CuratedVoice & {
  kind: "real";
};

type ConfirmedPresenceMetadata = {
  country: string;
  slug: string;
  portraitUrl: string;
  languageCode: string;
  languageLabel: string;
  territoryNative?: string;
};

const CONFIRMED_METADATA_BY_POSITION: Readonly<
  Record<number, ConfirmedPresenceMetadata>
> = {
  1: {
    country: "España",
    slug: "jose-naveiro",
    portraitUrl: "/avatars/avatar-01.webp",
    languageCode: "es",
    languageLabel: "Español",
  },
  2: {
    country: "Japón",
    slug: "asataka",
    portraitUrl: "/avatars/avatar-02.webp",
    languageCode: "ja",
    languageLabel: "日本語",
    territoryNative: "日本",
  },
  3: {
    country: "México",
    slug: "azucena",
    portraitUrl: "/avatars/avatar-03.webp",
    languageCode: "es",
    languageLabel: "Español",
  },
  4: {
    country: "Venezuela",
    slug: "johan-rodriguez-martinez",
    portraitUrl: "/avatars/avatar-04.webp",
    languageCode: "es",
    languageLabel: "Español",
  },
  5: {
    country: "Colombia",
    slug: "andres-giraldo-florez",
    portraitUrl: "/avatars/avatar-05.webp",
    languageCode: "es",
    languageLabel: "Español",
  },
  6: {
    country: "Italia",
    slug: "marco-indrio",
    portraitUrl: "/avatars/avatar-06.webp",
    languageCode: "it",
    languageLabel: "Italiano",
  },
  7: {
    country: "Senegal",
    slug: "cheik-ndiaye",
    portraitUrl: "/avatars/avatar-07.webp",
    languageCode: "fr",
    languageLabel: "Français",
  },
  8: {
    country: "España",
    slug: "jacobo-blanco-pineiro",
    portraitUrl: "/avatars/avatar-08.webp",
    languageCode: "und",
    languageLabel: "Lengua pendiente",
  },
};

function buildPoem(
  voice: ConfirmedVoice,
  metadata: ConfirmedPresenceMetadata,
): PoeticPresence["poem"] {
  const source = FOUNDATIONAL_BOOK_POEMS_BY_POET.get(
    voice.name,
  );

  if (!source) {
    return null;
  }

  const texts: LocalizedPoemText[] = [
    {
      languageCode: metadata.languageCode,
      label: source.originalLabel,
      kind: "original",
      text: source.poem,
    },
  ];

  if (source.translation) {
    texts.push({
      languageCode: "es",
      label:
        source.translationLabel ??
        "Traducción · Español",
      kind: "translation",
      text: source.translation,
    });
  }

  return {
    title: source.title,
    texts,
  };
}

function createConfirmedPresence(
  voice: ConfirmedVoice,
  metadata: ConfirmedPresenceMetadata,
): PoeticPresence {
  return {
    id: voice.position,
    slug: metadata.slug,
    participantStatus: "confirmed",
    name: voice.name,
    country: metadata.country,
    territory: voice.territory,
    ...(metadata.territoryNative
      ? { territoryNative: metadata.territoryNative }
      : {}),
    language: {
      code: metadata.languageCode,
      label: metadata.languageLabel,
    },
    poem: buildPoem(voice, metadata),
    media: {
      portraitUrl: metadata.portraitUrl,
    },
    productionStatus: "portrait",
    year: FOUNDATIONAL_EDITION_YEAR,
  };
}

function createPendingPresence(
  position: number,
): PoeticPresence {
  return {
    id: position,
    slug: `presencia-${String(position).padStart(2, "0")}`,
    participantStatus: "pending",
    name: null,
    country: null,
    territory: null,
    language: null,
    poem: null,
    media: {
      portraitUrl: null,
    },
    productionStatus: null,
    year: FOUNDATIONAL_EDITION_YEAR,
  };
}

const CONFIRMED_BY_POSITION = new Map(
  CURATED_VOICES.flatMap((voice) => {
    const metadata =
      CONFIRMED_METADATA_BY_POSITION[voice.position];

    if (voice.kind !== "real" || !metadata) {
      return [];
    }

    return [
      [
        voice.position,
        createConfirmedPresence(
          voice as ConfirmedVoice,
          metadata,
        ),
      ] as const,
    ];
  }),
);

export const POETIC_PRESENCES: PoeticPresence[] =
  Array.from(
    { length: TOTAL_PRESENCES },
    (_, index) => {
      const position = index + 1;

      return (
        CONFIRMED_BY_POSITION.get(position) ??
        createPendingPresence(position)
      );
    },
  );

export const CONFIRMED_POETIC_PRESENCES =
  POETIC_PRESENCES.filter(
    (
      presence,
    ): presence is PoeticPresence & {
      participantStatus: "confirmed";
      name: string;
      country: string;
      territory: string;
    } => presence.participantStatus === "confirmed",
  );

export const POETIC_PRESENCES_BY_SLUG = new Map(
  POETIC_PRESENCES.map((presence) => [
    presence.slug,
    presence,
  ]),
);

export const POETIC_PRESENCES_BY_POSITION = new Map(
  POETIC_PRESENCES.map((presence) => [
    presence.id,
    presence,
  ]),
);

export function getPoeticPresenceBySlug(
  slug: string,
) {
  return POETIC_PRESENCES_BY_SLUG.get(slug) ?? null;
}

export function getConfirmedPresenceHref(
  position: number,
) {
  const presence =
    POETIC_PRESENCES_BY_POSITION.get(position);

  return presence?.participantStatus === "confirmed"
    ? `/poema-universal/presencias/${presence.slug}`
    : null;
}
