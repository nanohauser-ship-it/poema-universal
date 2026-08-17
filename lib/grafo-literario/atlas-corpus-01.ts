/**
 * ATLAS UNIVERSAL DE LAS INFLUENCIAS
 * Corpus documental 01
 *
 * Principio:
 * - No confundir influencia con semejanza.
 * - Toda arista indica su naturaleza.
 * - Toda influencia histórica debe poder rastrearse a una fuente.
 */

export type AtlasRelationType =
  | "influencia"
  | "intertextualidad"
  | "modelo"
  | "tradicion"
  | "recepcion"
  | "apropiacion"
  | "reescritura"
  | "dialogo"
  | "resonancia";

export type AtlasEvidence =
  | "documentada"
  | "critica"
  | "probable"
  | "resonancia";

export interface AtlasAuthor {
  id: string;
  name: string;
  birth?: number;
  death?: number;
  territory: string;
  language?: string;
  period?: string;
  movements?: string[];
  themes?: string[];
}

export interface AtlasInfluence {
  id: string;

  from: string;
  to: string;

  relation: AtlasRelationType;
  evidence: AtlasEvidence;

  title: string;
  description: string;

  sourceWork?: string;
  targetWork?: string;

  transmitted?: string[];

  sourceLabel: string;
}

/* =========================================================
   AUTORES · CORPUS 01
   ========================================================= */

export const atlasAuthors01: AtlasAuthor[] = [
  {
    id: "horacio",
    name: "Horacio",
    birth: -65,
    death: -8,
    territory: "Roma",
    language: "latín",
    period: "Antigüedad clásica",
    movements: ["Poesía latina"],
    themes: ["carpe diem", "beatus ille", "oda", "medida"]
  },

  {
    id: "ovidio",
    name: "Ovidio",
    birth: -43,
    death: 17,
    territory: "Roma",
    language: "latín",
    period: "Antigüedad clásica",
    movements: ["Poesía latina"],
    themes: ["mitología", "amor", "transformación"]
  },

  {
    id: "virgilio",
    name: "Virgilio",
    birth: -70,
    death: -19,
    territory: "Roma",
    language: "latín",
    period: "Antigüedad clásica",
    movements: ["Poesía latina"],
    themes: ["épica", "viaje", "fundación", "destino"]
  },

  {
    id: "petrarca",
    name: "Francesco Petrarca",
    birth: 1304,
    death: 1374,
    territory: "Italia",
    language: "italiano",
    period: "Trecento",
    movements: ["Humanismo", "Petrarquismo"],
    themes: ["amor", "amada idealizada", "soneto", "memoria"]
  },

  {
    id: "lorenzo-medici",
    name: "Lorenzo de Médici",
    birth: 1449,
    death: 1492,
    territory: "Florencia",
    language: "italiano",
    period: "Renacimiento",
    movements: ["Humanismo"],
    themes: ["juventud", "vitalismo", "amor"]
  },

  {
    id: "pietro-bembo",
    name: "Pietro Bembo",
    birth: 1470,
    death: 1547,
    territory: "Italia",
    language: "italiano",
    period: "Renacimiento",
    movements: ["Petrarquismo", "Humanismo"],
    themes: ["amor", "lengua", "soneto"]
  },

  {
    id: "ariosto",
    name: "Ludovico Ariosto",
    birth: 1474,
    death: 1533,
    territory: "Italia",
    language: "italiano",
    period: "Renacimiento",
    movements: ["Renacimiento"],
    themes: ["épica", "caballería", "aventura", "locura"]
  },

  {
    id: "fray-luis",
    name: "Fray Luis de León",
    birth: 1527,
    death: 1591,
    territory: "España",
    language: "español",
    period: "Siglo de Oro",
    movements: ["Renacimiento español"],
    themes: ["beatus ille", "retiro", "naturaleza", "armonía"]
  },

  {
    id: "ronsard",
    name: "Pierre de Ronsard",
    birth: 1524,
    death: 1585,
    territory: "Francia",
    language: "francés",
    period: "Renacimiento",
    movements: ["La Pléiade"],
    themes: ["amor", "carpe diem", "soneto", "tiempo"]
  },

  {
    id: "camoes",
    name: "Luís de Camões",
    birth: 1524,
    death: 1580,
    territory: "Portugal",
    language: "portugués",
    period: "Renacimiento",
    movements: ["Renacimiento portugués"],
    themes: ["épica", "viaje", "mar", "imperio", "amor"]
  },

  {
    id: "shakespeare",
    name: "William Shakespeare",
    birth: 1564,
    death: 1616,
    territory: "Inglaterra",
    language: "inglés",
    period: "Renacimiento inglés",
    movements: ["Teatro isabelino"],
    themes: ["amor", "tiempo", "identidad", "poder", "muerte"]
  },

  {
    id: "gongora",
    name: "Luis de Góngora",
    birth: 1561,
    death: 1627,
    territory: "España",
    language: "español",
    period: "Siglo de Oro",
    movements: ["Barroco", "Culteranismo"],
    themes: ["metáfora", "oscuridad", "mitología", "forma"]
  },

  {
    id: "whitman",
    name: "Walt Whitman",
    birth: 1819,
    death: 1892,
    territory: "Estados Unidos",
    language: "inglés",
    period: "Siglo XIX",
    movements: ["Poesía estadounidense"],
    themes: ["yo", "universo", "cuerpo", "democracia", "naturaleza"]
  },

  {
    id: "borges",
    name: "Jorge Luis Borges",
    birth: 1899,
    death: 1986,
    territory: "Argentina",
    language: "español",
    period: "Siglo XX",
    movements: ["Literatura argentina"],
    themes: ["infinito", "laberinto", "biblioteca", "doble", "memoria"]
  },

  {
    id: "sologuren",
    name: "Javier Sologuren",
    birth: 1921,
    death: 2004,
    territory: "Perú",
    language: "español",
    period: "Siglo XX",
    movements: ["Poesía peruana", "Generación del 50"],
    themes: ["lenguaje", "memoria", "tradición", "silencio", "haiku"]
  }
];

/* =========================================================
   INFLUENCIAS · CORPUS 01
   ========================================================= */

export const atlasInfluences01: AtlasInfluence[] = [

  {
    id: "petrarca-lorenzo-medici",
    from: "petrarca",
    to: "lorenzo-medici",
    relation: "modelo",
    evidence: "documentada",

    title: "El lenguaje amoroso petrarquista",
    description:
      "La vertiente culta de la poesía de Lorenzo de Médici imita el lenguaje amoroso de Petrarca.",

    transmitted: [
      "lenguaje amoroso",
      "petrarquismo",
      "lírica culta"
    ],

    sourceLabel:
      "Humanismo y desengaño: Renacimiento y clasicismo"
  },

  {
    id: "petrarca-bembo",
    from: "petrarca",
    to: "pietro-bembo",
    relation: "modelo",
    evidence: "documentada",

    title: "Petrarca como modelo de las Rimas",
    description:
      "Las Rimas de Pietro Bembo se presentan como una colección inspirada en el Cancionero de Petrarca.",

    sourceWork: "Canzoniere",
    targetWork: "Rimas",

    transmitted: [
      "soneto",
      "lenguaje amoroso",
      "petrarquismo"
    ],

    sourceLabel:
      "Humanismo y desengaño: Renacimiento y clasicismo"
  },

  {
    id: "horacio-ronsard",
    from: "horacio",
    to: "ronsard",
    relation: "influencia",
    evidence: "documentada",

    title: "El espíritu de Horacio en La Pléiade",
    description:
      "Ronsard tomó a Horacio y a otros autores clásicos como modelos para sus Odas y Elegías.",

    transmitted: [
      "oda",
      "tópicos clásicos",
      "carpe diem",
      "clasicismo"
    ],

    sourceLabel:
      "Humanismo y desengaño: Renacimiento y clasicismo"
  },

  {
    id: "horacio-fray-luis",
    from: "horacio",
    to: "fray-luis",
    relation: "influencia",
    evidence: "documentada",

    title: "Beatus ille",
    description:
      "La tradición del Beatus ille horaciano funciona como modelo para la Oda a la vida retirada de Fray Luis de León.",

    sourceWork: "Épodo II",
    targetWork: "Oda a la vida retirada",

    transmitted: [
      "beatus ille",
      "retiro",
      "vida sencilla",
      "naturaleza"
    ],

    sourceLabel:
      "Antología de la poesía española"
  },

  {
    id: "virgilio-camoes",
    from: "virgilio",
    to: "camoes",
    relation: "modelo",
    evidence: "documentada",

    title: "La épica antigua transformada",
    description:
      "Os Lusíadas adopta la tradición de la epopeya antigua y el documento señala expresamente la inspiración de Camões en la Eneida.",

    sourceWork: "Eneida",
    targetWork: "Os Lusíadas",

    transmitted: [
      "estructura épica",
      "viaje",
      "heroísmo",
      "fundación histórica"
    ],

    sourceLabel:
      "Humanismo y desengaño: Renacimiento y clasicismo"
  },

  {
    id: "ariosto-camoes",
    from: "ariosto",
    to: "camoes",
    relation: "modelo",
    evidence: "documentada",

    title: "De Orlando furioso a Os Lusíadas",
    description:
      "El Orlando furioso aparece señalado como uno de los modelos próximos empleados por Camões.",

    sourceWork: "Orlando furioso",
    targetWork: "Os Lusíadas",

    transmitted: [
      "épica renacentista",
      "aventura",
      "estructura narrativa"
    ],

    sourceLabel:
      "Humanismo y desengaño: Renacimiento y clasicismo"
  },

  {
    id: "ovidio-shakespeare",
    from: "ovidio",
    to: "shakespeare",
    relation: "influencia",
    evidence: "documentada",

    title: "La materia clásica",
    description:
      "La obra poética de Shakespeare presenta una influencia clásica explícitamente vinculada con Ovidio.",

    transmitted: [
      "mitología clásica",
      "transformación",
      "imaginario latino"
    ],

    sourceLabel:
      "Obres de la literatura universal"
  },

  {
    id: "petrarca-shakespeare",
    from: "petrarca",
    to: "shakespeare",
    relation: "influencia",
    evidence: "documentada",

    title: "El modelo petrarquista del soneto",
    description:
      "La tradición contemporánea de los sonetos de Petrarca aparece señalada como influencia de la poesía de Shakespeare.",

    sourceWork: "Canzoniere",
    targetWork: "Sonnets",

    transmitted: [
      "soneto",
      "amor",
      "tradición petrarquista"
    ],

    sourceLabel:
      "Obres de la literatura universal"
  },

  {
    id: "whitman-borges",
    from: "whitman",
    to: "borges",
    relation: "intertextualidad",
    evidence: "documentada",

    title: "El astrónomo y las estrellas",
    description:
      "Borges reutiliza mediante paráfrasis la situación poética de When I Heard the Learned Astronomer para reflexionar sobre la experiencia estética.",

    sourceWork: "When I Heard the Learned Astronomer",

    transmitted: [
      "experiencia frente a teoría",
      "contemplación",
      "estrellas",
      "conocimiento"
    ],

    sourceLabel:
      "El proyecto lírico permanente: la comunicación en la poesía"
  },

  {
    id: "siglo-oro-sologuren",
    from: "gongora",
    to: "sologuren",
    relation: "recepcion",
    evidence: "critica",

    title: "Relectura de Góngora",
    description:
      "La poética de Sologuren se construye mediante actualización crítica de la tradición del Siglo de Oro; la tesis estudia específicamente su neogongorismo.",

    transmitted: [
      "densidad metafórica",
      "oscuridad",
      "tradición aurisecular",
      "renovación"
    ],

    sourceLabel:
      "Una poética continua. Fundamentos y evolución de la lírica de Javier Sologuren"
  }

];

/* =========================================================
   ÍNDICES
   ========================================================= */

export const atlasAuthorMap01 = Object.fromEntries(
  atlasAuthors01.map((author) => [author.id, author])
);

export function influencesReceived01(authorId: string) {
  return atlasInfluences01.filter(
    (edge) => edge.to === authorId
  );
}

export function influencesExerted01(authorId: string) {
  return atlasInfluences01.filter(
    (edge) => edge.from === authorId
  );
}

export function relationsForAuthor01(authorId: string) {
  return atlasInfluences01.filter(
    (edge) =>
      edge.from === authorId ||
      edge.to === authorId
  );
}

