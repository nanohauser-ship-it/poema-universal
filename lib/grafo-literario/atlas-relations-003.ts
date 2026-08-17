import type {
  AtlasDocumentedRelation,
} from "./relations-types";

export const atlasRelations003:
  AtlasDocumentedRelation[] = [

  {
    id: "dostoevsky-kafka",

    source: "dostoevsky",
    target: "kafka",

    type: "influenced",
    evidence: "critical",

    summary:
      "Kafka leyó a Dostoievski y la crítica ha señalado afinidades estructurales y temáticas entre sus novelas, especialmente alrededor de culpa, juicio, autoridad y conciencia.",

    concepts: [
      "culpa",
      "juicio",
      "autoridad",
      "conciencia",
      "absurdo"
    ],

    sources: [
      {
        label: "Cambridge University Press",
        work: "Kafka's Reading",
        note:
          "Estudia las lecturas de Kafka y su relación con Dostoievski."
      }
    ],

    verified: true
  },

  {
    id: "baudelaire-rimbaud",

    source: "baudelaire",
    target: "rimbaud",

    type: "influenced",
    evidence: "critical",

    summary:
      "Rimbaud recibió de Baudelaire una parte decisiva de la ruptura con la tradición lírica, la exploración de la modernidad y la ampliación de los territorios de la experiencia poética.",

    concepts: [
      "modernidad",
      "ruptura",
      "visión",
      "ciudad",
      "poesía"
    ],

    sources: [
      {
        label: "Poetry Foundation",
        work: "Arthur Rimbaud",
        note:
          "La crítica vinculada a Rimbaud reconoce la influencia de Baudelaire en su formación poética."
      }
    ],

    verified: true
  },

  {
    id: "baudelaire-verlaine",

    source: "baudelaire",
    target: "verlaine",

    type: "influenced",
    evidence: "declared",

    summary:
      "Verlaine admiró explícitamente a Baudelaire y reconoció en su obra una poesía capaz de expresar al hombre moderno.",

    concepts: [
      "modernidad",
      "ciudad",
      "música",
      "melancolía",
      "poesía"
    ],

    sources: [
      {
        label: "Poetry Foundation",
        work: "Paul Verlaine",
        note:
          "La biografía crítica documenta la admiración de Verlaine por Baudelaire."
      }
    ],

    verified: true
  },

  {
    id: "borges-calvino",

    source: "borges",
    target: "calvino",

    type: "influenced",
    evidence: "critical",

    summary:
      "La crítica especializada ha estudiado la absorción de procedimientos borgianos por Italo Calvino, especialmente en metaficción, estructuras combinatorias, bibliotecas, laberintos y reflexión sobre los límites de la ficción.",

    concepts: [
      "laberinto",
      "biblioteca",
      "metaficción",
      "infinito",
      "combinatoria"
    ],

    sources: [
      {
        label: "Cambridge University Press",
        work: "Successors of Borges' Classicism",
        note:
          "Estudia la presencia de Borges en la poética y ficción de Calvino."
      },
      {
        label: "Cambridge University Press",
        work: "Borges and Italy",
        note:
          "Identifica a Calvino entre los escritores italianos que absorbieron elementos borgianos."
      }
    ],

    verified: true
  }

];
