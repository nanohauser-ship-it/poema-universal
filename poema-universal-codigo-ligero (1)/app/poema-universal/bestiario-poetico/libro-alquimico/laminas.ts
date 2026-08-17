import type {
  StoredAlchemicalPlate,
} from "@/lib/bestiario-poetico/libro-alquimico-store";

export type AlchemicalPlate = {
  id: string;
  slug: string;
  title: string;
  family: string;
  matter: readonly string[];
  operation: string;
  symbols: readonly string[];
  origin: string;
  relation: string;
  date: string;
  sigil: string;
  image: string;
};

function plateTypeLabel(
  plate:
    StoredAlchemicalPlate
): string {
  switch (plate.type) {
    case "prima-materia":
      return "Prima materia";

    case "operation":
      return "Operación alquímica";

    case "emblem":
      return "Emblema";

    case "relic":
      return "Reliquia";

    default:
      return "Lámina alquímica";
  }
}

export function
storedPlateToBookPlate(
  stored:
    StoredAlchemicalPlate
): AlchemicalPlate {
  const catalogueId =
    `LA-${String(
      stored.catalogueNumber
    ).padStart(3, "0")}`;

  const creationDate =
    new Date(
      stored.createdAt
    );

  const year =
    Number.isNaN(
      creationDate.getTime()
    )
      ? "2026"
      : String(
          creationDate
            .getFullYear()
        );

  return {
    id: catalogueId,

    slug:
      stored.sourceKey
        .replace(
          /[^a-z0-9-]+/gi,
          "-"
        )
        .toLowerCase(),

    title:
      stored.generatedTitle
      || stored.plateTitle,

    family:
      stored.secretTitle,

    matter: [
      plateTypeLabel(stored),
      stored.plateTitle,
    ],

    operation:
      stored.caption,

    symbols: [
      stored.symbol,
      plateTypeLabel(stored),
    ],

    origin:
      stored.sourcePoem,

    relation:
      `Atlas alquímico · `
      + stored.plateTitle,

    date: year,

    sigil:
      stored.symbol || "◇",

    image:
      stored.image,
  };
}

/*
 * El libro comienza vacío.
 * Sus láminas nacen exclusivamente
 * en el Atlas Alquímico.
 */
export const ALQUIMIC_PLATES:
  readonly AlchemicalPlate[] = [];
