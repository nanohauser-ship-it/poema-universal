import type {
  AtlasDocumentedRelation,
} from "./relations-types";

/**
 * ATLAS UNIVERSAL DE LAS INFLUENCIAS
 * CORPUS DE RELACIONES 002
 *
 * Segundo corredor documental.
 *
 * Principio:
 * la intensidad visual de una relación
 * nunca sustituye a su nivel de evidencia.
 */

export const atlasRelations002:
  AtlasDocumentedRelation[] = [

  /* =========================================================
     HOMERO → VIRGILIO
     ========================================================= */

  {
    id: "homer-virgilio",

    source: "homer",
    target: "virgilio",

    type: "influenced",
    evidence: "critical",

    summary:
      "La Eneida dialoga estructuralmente con la Ilíada y la Odisea. La tradición crítica considera a Homero el gran antecedente épico de Virgilio, que reelabora materiales, situaciones y procedimientos homéricos dentro del proyecto romano de la Eneida.",

    concepts: [
      "épica",
      "viaje",
      "guerra",
      "heroísmo",
      "fundación",
      "destino"
    ],

    sources: [
      {
        label: "Literature, the Humanities, & Humanity",
        work: "Homer, The Odyssey and Virgil, The Aeneid",
        note:
          "Estudio comparativo sobre la utilización virgiliana de la Ilíada y la Odisea."
      }
    ],

    verified: true
  },

  /* =========================================================
     VIRGILIO → DANTE
     ========================================================= */

  {
    id: "virgilio-dante",

    source: "virgilio",
    target: "dante",

    type: "influenced",
    evidence: "documented",

    summary:
      "Virgilio ocupa una posición estructural y simbólica fundamental en la Comedia de Dante: aparece como guía del poeta y funciona como autoridad poética, intelectual y clásica dentro del viaje por el más allá.",

    concepts: [
      "viaje",
      "más allá",
      "poesía",
      "razón",
      "imperio",
      "guía"
    ],

    sources: [
      {
        label: "Dante's Library · Duke University",
        work: "Dante's Guide: Virgil, Aeneid",
        note:
          "Recurso académico dedicado al uso de Virgilio y de la Eneida dentro de la Comedia."
      },
      {
        label: "University of Leeds · Discover Dante",
        work: "Major Themes: Virgil",
        note:
          "Analiza a Virgilio como figura vinculada a razón, Imperio y poesía en la Comedia."
      }
    ],

    verified: true
  },

  /* =========================================================
     WHITMAN → NERUDA
     ========================================================= */

  {
    id: "whitman-neruda",

    source: "whitman",
    target: "neruda",

    type: "influenced",
    evidence: "declared",

    summary:
      "Pablo Neruda reconoció explícitamente la importancia de Walt Whitman en su formación poética y tradujo varios de sus poemas. La recepción de Whitman constituye una de las genealogías importantes de la poesía americana de Neruda.",

    concepts: [
      "américa",
      "cuerpo",
      "naturaleza",
      "yo",
      "colectividad",
      "poesía"
    ],

    sources: [
      {
        label: "The Walt Whitman Archive",
        work: "Neruda, Pablo (1904–1973)",
        note:
          "El archivo documenta las traducciones de Whitman realizadas por Neruda y las declaraciones del poeta chileno sobre su deuda con Whitman."
      }
    ],

    verified: true
  },

  /* =========================================================
     WHITMAN → LORCA
     ========================================================= */

  {
    id: "whitman-lorca",

    source: "whitman",
    target: "lorca",

    type: "read",
    evidence: "documented",

    summary:
      "Federico García Lorca entabla un diálogo explícito con Walt Whitman en Poeta en Nueva York mediante su Oda a Walt Whitman. La relación está documentada directamente por la existencia y contenido del poema.",

    concepts: [
      "ciudad",
      "cuerpo",
      "deseo",
      "américa",
      "modernidad",
      "poesía"
    ],

    sources: [
      {
        label: "Poetry Foundation",
        work: "Ode to Walt Whitman",
        note:
          "Publicación y archivo del poema de Federico García Lorca dedicado explícitamente a Whitman."
      }
    ],

    verified: true
  },

  /* =========================================================
     JOYCE → BECKETT
     ========================================================= */

  {
    id: "joyce-beckett",

    source: "joyce",
    target: "beckett",

    type: "influenced",
    evidence: "documented",

    summary:
      "James Joyce fue una influencia seminal en el joven Samuel Beckett. Ambos mantuvieron una relación personal e intelectual estrecha en París, y Beckett colaboró en trabajos asociados al proceso que culminaría en Finnegans Wake.",

    concepts: [
      "lenguaje",
      "modernismo",
      "forma",
      "experimentación",
      "conciencia"
    ],

    sources: [
      {
        label: "The Samuel Beckett Society",
        work: "Biography",
        note:
          "La biografía de la sociedad describe a Joyce como influencia seminal y amigo cercano de Beckett."
      }
    ],

    verified: true
  },

  /* =========================================================
     BAUDELAIRE → T. S. ELIOT
     ========================================================= */

  {
    id: "baudelaire-eliot",

    source: "baudelaire",
    target: "eliot",

    type: "influenced",
    evidence: "critical",

    summary:
      "La herencia de Baudelaire se prolonga en la poesía moderna anglófona y la crítica identifica a T. S. Eliot entre los escritores sobre los que esa influencia resulta significativa.",

    concepts: [
      "ciudad",
      "modernidad",
      "decadencia",
      "fragmentación",
      "poesía"
    ],

    sources: [
      {
        label: "Poetry Foundation",
        work: "Charles Baudelaire",
        note:
          "La biografía crítica incluye expresamente a T. S. Eliot entre los escritores alcanzados por la influencia de Baudelaire."
      }
    ],

    verified: true
  },

  /* =========================================================
     POE → VALÉRY
     ========================================================= */

  {
    id: "poe-valery",

    source: "poe",
    target: "valery",

    type: "admired",
    evidence: "documented",

    summary:
      "Paul Valéry admiró especialmente la dimensión racional y analítica de Edgar Allan Poe, particularmente Eureka y las ficciones protagonizadas por Auguste Dupin.",

    concepts: [
      "razón",
      "conocimiento",
      "forma",
      "análisis",
      "poesía"
    ],

    sources: [
      {
        label: "Poetry Foundation",
        work: "Paul Valéry",
        note:
          "La biografía crítica documenta la admiración de Valéry por las capacidades racionales y analíticas de Poe."
      }
    ],

    verified: true
  }

];
