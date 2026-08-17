import type {
  AtlasDocumentedRelation,
} from "./relations-types";

export const atlasRelations004:
  AtlasDocumentedRelation[] = [

  {
    id: "flaubert-proust",
    source: "flaubert",
    target: "proust",
    type: "influenced",
    evidence: "critical",
    summary:
      "Flaubert constituye un antecedente fundamental para la concepción moderna de la novela y para la atención de Proust a la forma, el estilo y la conciencia narrativa.",
    concepts: [
      "novela",
      "estilo",
      "conciencia",
      "modernidad",
      "narrador"
    ],
    verified: true
  },

  {
    id: "flaubert-joyce",
    source: "flaubert",
    target: "joyce",
    type: "influenced",
    evidence: "critical",
    summary:
      "La transformación flaubertiana del estilo narrativo y de la relación entre narrador, lenguaje y realidad constituye un antecedente relevante para la experimentación de Joyce.",
    concepts: [
      "estilo",
      "experimentación",
      "lenguaje",
      "narrativa",
      "modernidad"
    ],
    verified: true
  },

  {
    id: "rimbaud-valery",
    source: "rimbaud",
    target: "valery",
    type: "influenced",
    evidence: "critical",
    summary:
      "La ruptura poética de Rimbaud forma parte del horizonte de la poesía moderna que Valéry desarrolla mediante una reflexión radical sobre lenguaje, conciencia y creación.",
    concepts: [
      "poesía",
      "lenguaje",
      "conciencia",
      "modernidad",
      "creación"
    ],
    verified: true
  },

  {
    id: "valery-eliot",
    source: "valery",
    target: "eliot",
    type: "influenced",
    evidence: "critical",
    summary:
      "Valéry y Eliot participan de una modernidad poética marcada por la reflexión sobre tradición, forma, conciencia y función intelectual de la poesía.",
    concepts: [
      "tradición",
      "forma",
      "modernidad",
      "conciencia",
      "poesía"
    ],
    verified: true
  },

  {
    id: "joyce-woolf",
    source: "joyce",
    target: "woolf",
    type: "influenced",
    evidence: "critical",
    summary:
      "La experimentación narrativa de Joyce fue decisiva para el desarrollo de nuevas formas de representar la conciencia y la experiencia temporal en la novela modernista.",
    concepts: [
      "conciencia",
      "tiempo",
      "interioridad",
      "experimentación",
      "modernismo"
    ],
    verified: true
  },

  {
    id: "joyce-beckett",
    source: "joyce",
    target: "beckett",
    type: "influenced",
    evidence: "documented",
    summary:
      "Beckett trabajó como asistente y colaborador de Joyce y recibió una influencia decisiva de su experimentación lingüística y narrativa.",
    concepts: [
      "lenguaje",
      "experimentación",
      "absurdo",
      "modernismo",
      "narrativa"
    ],
    verified: true
  },

  {
    id: "eliot-beckett",
    source: "eliot",
    target: "beckett",
    type: "influenced",
    evidence: "critical",
    summary:
      "La poesía de Eliot forma parte del contexto intelectual y literario de la modernidad europea que desemboca en algunas de las preocupaciones formales y existenciales de Beckett.",
    concepts: [
      "modernidad",
      "fragmentación",
      "tiempo",
      "memoria",
      "existencia"
    ],
    verified: true
  },

  {
    id: "lorca-neruda",
    source: "lorca",
    target: "neruda",
    type: "influenced",
    evidence: "documented",
    summary:
      "Lorca y Neruda mantuvieron una relación literaria y personal significativa dentro de la poesía hispánica del siglo XX.",
    concepts: [
      "poesía",
      "España",
      "América",
      "surrealismo",
      "amistad"
    ],
    verified: true
  }

];
