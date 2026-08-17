import type {
  AtlasDocumentedRelation,
} from "./relations-types";

/**
 * ATLAS UNIVERSAL DE LAS INFLUENCIAS
 * CORPUS DE RELACIONES 001
 *
 * BLOQUE FUNDACIONAL
 *
 * Criterio:
 * - no confundir semejanza con influencia;
 * - distinguir lectura, recepción e influencia;
 * - registrar el nivel de evidencia;
 * - conservar una referencia documental legible.
 */

export const atlasRelations001:
  AtlasDocumentedRelation[] = [

  /* =========================================================
     POE → BAUDELAIRE
     ========================================================= */

  {
    id: "poe-baudelaire",

    source: "poe",
    target: "baudelaire",

    type: "influenced",
    evidence: "documented",

    summary:
      "Baudelaire tradujo, estudió y difundió extensamente la obra de Edgar Allan Poe en Francia. La recepción baudeleriana de Poe fue decisiva para la fortuna europea del escritor estadounidense.",

    concepts: [
      "muerte",
      "belleza",
      "siniestro",
      "imaginación",
      "modernidad"
    ],

    sources: [
      {
        label: "Poetry Foundation",
        work: "Charles Baudelaire",
        note:
          "Biografía crítica sobre Baudelaire, su trabajo como traductor y la recepción de Poe."
      },
      {
        label: "Estudios comparatistas",
        work: "Poe, Baudelaire and Mallarmé",
        note:
          "Tradición crítica sobre la transmisión de Poe hacia el simbolismo francés."
      }
    ],

    verified: true
  },

  /* =========================================================
     BAUDELAIRE → MALLARMÉ
     ========================================================= */

  {
    id: "baudelaire-mallarme",

    source: "baudelaire",
    target: "mallarme",

    type: "influenced",
    evidence: "critical",

    summary:
      "Mallarmé celebró a Baudelaire en sus escritos y prolongó varios de sus territorios poéticos, entre ellos la herencia de Poe, la aspiración a escapar del mundo material y la búsqueda de lo infinito.",

    concepts: [
      "simbolismo",
      "infinito",
      "lenguaje",
      "poesía",
      "trascendencia"
    ],

    sources: [
      {
        label: "Poetry Foundation",
        work: "Charles Baudelaire",
        note:
          "La fuente señala que Mallarmé celebró a Baudelaire y retomó varios de sus temas."
      }
    ],

    verified: true
  },

  /* =========================================================
     MALLARMÉ → VALÉRY
     ========================================================= */

  {
    id: "mallarme-valery",

    source: "mallarme",
    target: "valery",

    type: "influenced",
    evidence: "critical",

    summary:
      "La poética de Mallarmé constituye una referencia central para Paul Valéry, especialmente en la formalización extrema del poema, la musicalidad verbal y la reflexión sobre el lenguaje poético.",

    concepts: [
      "forma",
      "lenguaje",
      "musicalidad",
      "simbolismo",
      "poesía"
    ],

    sources: [
      {
        label: "Poetry Foundation",
        work: "Paul Valéry",
        note:
          "La biografía crítica considera inequívoca la influencia de Mallarmé en la poesía de Valéry."
      }
    ],

    verified: true
  },

  /* =========================================================
     DANTE → BORGES
     ========================================================= */

  {
    id: "dante-borges",

    source: "dante",
    target: "borges",

    type: "influenced",
    evidence: "declared",

    summary:
      "Borges leyó y releyó durante décadas la Divina Comedia, dedicó ensayos y conferencias a Dante y reconoció explícitamente la importancia extraordinaria de esa lectura en su universo literario.",

    concepts: [
      "viaje",
      "visión",
      "memoria",
      "infinito",
      "más allá"
    ],

    sources: [
      {
        label: "Borges Studies",
        work: "Estudios sobre Borges y Dante",
        note:
          "Investigaciones dedicadas a la presencia de la Divina Comedia en la obra y el pensamiento de Borges."
      },
      {
        label: "Jorge Luis Borges",
        work: "Nueve ensayos dantescos",
        note:
          "Conjunto de ensayos de Borges sobre episodios, personajes y procedimientos de Dante."
      }
    ],

    verified: true
  },

  /* =========================================================
     KAFKA → BORGES
     ========================================================= */

  {
    id: "kafka-borges",

    source: "kafka",
    target: "borges",

    type: "influenced",
    evidence: "critical",

    summary:
      "Borges fue lector, comentarista y traductor temprano de Kafka. La crítica especializada ha estudiado la influencia de procedimientos kafkianos en varias ficciones borgesianas.",

    concepts: [
      "laberinto",
      "paradoja",
      "extrañamiento",
      "autoridad",
      "infinito"
    ],

    sources: [
      {
        label: "Cambridge University Press",
        work: "Borges and Kafka",
        note:
          "Estudio sobre las traducciones tempranas de Kafka realizadas por Borges y su influencia en el desarrollo de la escritura borgiana."
      },
      {
        label: "Jorge Luis Borges",
        work: "Kafka y sus precursores",
        note:
          "Ensayo fundamental de Borges sobre Kafka y la relación entre una obra y la tradición que reorganiza retrospectivamente."
      }
    ],

    verified: true
  },

  /* =========================================================
     KAFKA → CAMUS
     ========================================================= */

  {
    id: "kafka-camus",

    source: "kafka",
    target: "camus",

    type: "read",
    evidence: "documented",

    summary:
      "Camus estudió directamente la obra de Kafka y le dedicó un ensayo específico dentro del horizonte intelectual de su reflexión sobre el absurdo.",

    concepts: [
      "absurdo",
      "esperanza",
      "condición humana",
      "extrañamiento",
      "sentido"
    ],

    sources: [
      {
        label: "Albert Camus",
        work:
          "Hope and the Absurd in the Work of Franz Kafka",
        note:
          "Ensayo de Camus dedicado explícitamente a la obra de Kafka."
      }
    ],

    verified: true
  },

  /* =========================================================
     BORGES → ECO
     ========================================================= */

  {
    id: "borges-eco",

    source: "borges",
    target: "eco",

    type: "conceptual_affinity",
    evidence: "critical",

    summary:
      "La crítica ha estudiado ampliamente el diálogo entre Borges y Umberto Eco, especialmente alrededor de la biblioteca, el laberinto, la interpretación, la erudición y las estructuras de conocimiento.",

    concepts: [
      "biblioteca",
      "laberinto",
      "interpretación",
      "signo",
      "conocimiento"
    ],

    sources: [
      {
        label: "Estudios borgianos y semióticos",
        work: "Borges y Umberto Eco",
        note:
          "Bibliografía crítica sobre la presencia de motivos y estrategias borgianas en la narrativa y el pensamiento de Eco."
      }
    ],

    verified: true
  }
];
