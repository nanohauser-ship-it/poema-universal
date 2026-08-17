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
  country: string;
  slug: string;
  portraitUrl: string;
  languageCode: string;
  languageLabel: string;
};

function isConfirmedVoice(
  voice: CuratedVoice,
): voice is ConfirmedVoice {
  return (
    voice.kind === "real" &&
    Boolean(
      voice.country &&
        voice.slug &&
        voice.portraitUrl &&
        voice.languageCode &&
        voice.languageLabel,
    )
  );
}

function buildPoem(
  voice: ConfirmedVoice,
): PoeticPresence["poem"] {
  const source = FOUNDATIONAL_BOOK_POEMS_BY_POET.get(
    voice.name,
  );

  if (!source) {
    return null;
  }

  const texts: LocalizedPoemText[] = [
    {
      languageCode: voice.languageCode,
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
): PoeticPresence {
  return {
    id: voice.position,
    slug: voice.slug,
    participantStatus: "confirmed",
    name: voice.name,
    country: voice.country,
    territory: voice.territory,
    ...(voice.territoryNative
      ? { territoryNative: voice.territoryNative }
      : {}),
    language: {
      code: voice.languageCode,
      label: voice.languageLabel,
    },
    poem: buildPoem(voice),
    media: {
      portraitUrl: voice.portraitUrl,
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
  CURATED_VOICES.filter(isConfirmedVoice).map(
    (voice) => [
      voice.position,
      createConfirmedPresence(voice),
    ],
  ),
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
