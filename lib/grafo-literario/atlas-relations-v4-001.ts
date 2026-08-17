import type {
  AtlasMasterRelation,
} from "./relation-ontology";

/**
 * ATLAS UNIVERSAL DE LAS INFLUENCIAS
 * CORPUS RELACIONAL V4
 *
 * PAQUETE 001
 * 50 relaciones de alta / máxima confianza.
 */

export const atlasRelationsV4001: AtlasMasterRelation[] = [

  // 001 · Poe → Baudelaire
  {
    id: "v4-001-001-poe-baudelaire",
    source: {
      type: "author",
      id: "poe",
      label: "Edgar Allan Poe",
    },
    target: {
      type: "author",
      id: "baudelaire",
      label: "Charles Baudelaire",
    },
    relationType: "literary_influence",
    mechanisms: [
      "translation",
      "critical-reception",
      "aesthetic-transmission",
    ],
    evidence: [
      {
        basis: "documented_translation",
        note:
          "Baudelaire tradujo y difundió extensamente la obra de Poe en francés.",
      },
    ],
    confidence: "maximum",
    scholarlyConsensus: "yes",
  },

  // 002 · Baudelaire → Mallarmé
  {
    id: "v4-001-002-baudelaire-mallarme",
    source: {
      type: "author",
      id: "baudelaire",
      label: "Charles Baudelaire",
    },
    target: {
      type: "author",
      id: "mallarme",
      label: "Stéphane Mallarmé",
    },
    relationType: "literary_influence",
    mechanisms: [
      "symbolism",
      "modern-poetic-language",
    ],
    evidence: [
      {
        basis: "scholarly_consensus",
        note:
          "Relación consolidada dentro de la genealogía de la poesía simbolista francesa.",
      },
    ],
    confidence: "very_high",
    scholarlyConsensus: "yes",
  },

  // 003 · Mallarmé → Valéry
  {
    id: "v4-001-003-mallarme-valery",
    source: {
      type: "author",
      id: "mallarme",
      label: "Stéphane Mallarmé",
    },
    target: {
      type: "author",
      id: "valery",
      label: "Paul Valéry",
    },
    relationType: "literary_influence",
    mechanisms: [
      "symbolism",
      "poetic-intellectual-model",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "Valéry mantuvo una relación intelectual profunda con la obra y figura de Mallarmé.",
      },
    ],
    confidence: "maximum",
    scholarlyConsensus: "yes",
  },

  // 004 · Homero → Virgilio
  {
    id: "v4-001-004-homer-virgilio",
    source: {
      type: "author",
      id: "homer",
      label: "Homero",
    },
    target: {
      type: "author",
      id: "virgilio",
      label: "Virgilio",
    },
    relationType: "literary_influence",
    mechanisms: [
      "epic-model",
      "canonical-rewriting",
    ],
    evidence: [
      {
        basis: "work_level_intertext",
        note:
          "La Eneida reelabora de forma estructural los modelos épicos homéricos.",
      },
    ],
    confidence: "maximum",
    scholarlyConsensus: "yes",
  },

  // 005 · Virgilio → Dante
  {
    id: "v4-001-005-virgilio-dante",
    source: {
      type: "author",
      id: "virgilio",
      label: "Virgilio",
    },
    target: {
      type: "author",
      id: "dante",
      label: "Dante Alighieri",
    },
    relationType: "literary_influence",
    mechanisms: [
      "classical-model",
      "explicit-literary-guide",
    ],
    evidence: [
      {
        basis: "work_level_intertext",
        note:
          "Virgilio aparece además convertido explícitamente en guía de Dante en la Comedia.",
      },
    ],
    confidence: "maximum",
    authorDeclared: "yes",
    scholarlyConsensus: "yes",
  },

  // 006 · Whitman → Ginsberg
  {
    id: "v4-001-006-whitman-ginsberg",
    source: {
      type: "author",
      id: "whitman",
      label: "Walt Whitman",
    },
    target: {
      type: "author",
      id: "allen-ginsberg",
      label: "Allen Ginsberg",
    },
    relationType: "author_declared_influence",
    mechanisms: [
      "expansive-voice",
      "american-poetic-lineage",
      "body-and-self",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "Whitman figura entre las influencias formativas explícitamente reconocidas en Ginsberg.",
      },
    ],
    confidence: "maximum",
    authorDeclared: "yes",
  },

  // 007 · William Carlos Williams → Ginsberg
  {
    id: "v4-001-007-williams-ginsberg",
    source: {
      type: "author",
      id: "william-carlos-williams",
      label: "William Carlos Williams",
    },
    target: {
      type: "author",
      id: "allen-ginsberg",
      label: "Allen Ginsberg",
    },
    relationType: "mentorship",
    mechanisms: [
      "personal-contact",
      "american-vernacular",
      "poetic-encouragement",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "Williams conoció y apoyó al joven Ginsberg y fue una presencia poética formativa.",
      },
    ],
    confidence: "maximum",
  },

  // 008 · Kerouac ⇄ Ginsberg
  {
    id: "v4-001-008-kerouac-ginsberg",
    source: {
      type: "author",
      id: "jack-kerouac",
      label: "Jack Kerouac",
    },
    target: {
      type: "author",
      id: "allen-ginsberg",
      label: "Allen Ginsberg",
    },
    relationType: "friendship",
    mechanisms: [
      "mutual-reading",
      "beat-generation",
      "literary-exchange",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "Amistad y diálogo literario centrales en la formación de la Beat Generation.",
      },
    ],
    confidence: "maximum",
    phase: "continuous",
  },

  // 009 · Richard Wright → Baldwin
  {
    id: "v4-001-009-wright-baldwin",
    source: {
      type: "author",
      id: "richard-wright",
      label: "Richard Wright",
    },
    target: {
      type: "author",
      id: "james-baldwin",
      label: "James Baldwin",
    },
    relationType: "mentorship",
    mechanisms: [
      "professional-support",
      "early-literary-model",
      "later-critical-distance",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "Wright apoyó tempranamente a Baldwin; la relación evolucionó después hacia un distanciamiento crítico.",
      },
    ],
    confidence: "maximum",
    phase: "transformation",
  },

  // 010 · Lowell → Plath
  {
    id: "v4-001-010-lowell-plath",
    source: {
      type: "author",
      id: "robert-lowell",
      label: "Robert Lowell",
    },
    target: {
      type: "author",
      id: "sylvia-plath",
      label: "Sylvia Plath",
    },
    relationType: "mentorship",
    mechanisms: [
      "seminar",
      "confessional-poetry-context",
    ],
    evidence: [
      {
        basis: "historical_record",
        note:
          "Plath asistió al seminario de Robert Lowell en Boston University.",
      },
    ],
    confidence: "maximum",
  },

  // 011 · Lowell → Sexton
  {
    id: "v4-001-011-lowell-sexton",
    source: {
      type: "author",
      id: "robert-lowell",
      label: "Robert Lowell",
    },
    target: {
      type: "author",
      id: "anne-sexton",
      label: "Anne Sexton",
    },
    relationType: "mentorship",
    mechanisms: [
      "seminar",
      "confessional-poetry-context",
    ],
    evidence: [
      {
        basis: "historical_record",
        note:
          "Sexton asistió junto a Sylvia Plath al seminario de Robert Lowell.",
      },
    ],
    confidence: "maximum",
  },

  // 012 · Nelly Sachs ⇄ Celan
  {
    id: "v4-001-012-sachs-celan",
    source: {
      type: "author",
      id: "nelly-sachs",
      label: "Nelly Sachs",
    },
    target: {
      type: "author",
      id: "celan",
      label: "Paul Celan",
    },
    relationType: "correspondence",
    mechanisms: [
      "friendship",
      "poetic-dialogue",
      "holocaust-memory",
    ],
    evidence: [
      {
        basis: "correspondence",
        note:
          "Se conserva una correspondencia significativa entre Sachs y Celan.",
      },
    ],
    confidence: "maximum",
  },

  // 013 · Celan ⇄ Bachmann
  {
    id: "v4-001-013-celan-bachmann",
    source: {
      type: "author",
      id: "celan",
      label: "Paul Celan",
    },
    target: {
      type: "author",
      id: "bachmann",
      label: "Ingeborg Bachmann",
    },
    relationType: "correspondence",
    mechanisms: [
      "personal-relation",
      "poetic-dialogue",
      "postwar-memory",
    ],
    evidence: [
      {
        basis: "correspondence",
        note:
          "La correspondencia Celan-Bachmann documenta una relación personal e intelectual compleja.",
      },
    ],
    confidence: "maximum",
  },

  // 014 · Achebe → Adichie
  {
    id: "v4-001-014-achebe-adichie",
    source: {
      type: "author",
      id: "chinua-achebe",
      label: "Chinua Achebe",
    },
    target: {
      type: "author",
      id: "chimamanda-adichie",
      label: "Chimamanda Ngozi Adichie",
    },
    relationType: "formative_reading",
    mechanisms: [
      "representation",
      "african-literary-model",
      "cultural-legitimation",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Adichie ha explicado repetidamente la importancia formativa de Achebe.",
      },
    ],
    confidence: "maximum",
    authorDeclared: "yes",
  },

  // 015 · Faulkner → Fuentes
  {
    id: "v4-001-015-faulkner-fuentes",
    source: {
      type: "author",
      id: "faulkner",
      label: "William Faulkner",
    },
    target: {
      type: "author",
      id: "carlos-fuentes",
      label: "Carlos Fuentes",
    },
    relationType: "literary_influence",
    mechanisms: [
      "narrative-structure",
      "regional-history",
      "modern-novel",
    ],
    evidence: [
      {
        basis: "scholarly_consensus",
        note:
          "Faulkner ocupa un lugar importante en la recepción literaria de Fuentes y de la novela latinoamericana del siglo XX.",
      },
    ],
    confidence: "very_high",
    scholarlyConsensus: "yes",
  },

  // 016 · Faulkner → García Márquez
  {
    id: "v4-001-016-faulkner-garcia-marquez",
    source: {
      type: "author",
      id: "faulkner",
      label: "William Faulkner",
    },
    target: {
      type: "author",
      id: "garcia-marquez",
      label: "Gabriel García Márquez",
    },
    relationType: "literary_influence",
    mechanisms: [
      "imagined-territory",
      "narrative-architecture",
      "regional-memory",
    ],
    evidence: [
      {
        basis: "scholarly_consensus",
        note:
          "La relación Faulkner-García Márquez está ampliamente documentada, aunque García Márquez matizó la idea de influencia directa.",
      },
    ],
    confidence: "very_high",
    scholarlyConsensus: "yes",
    authorDeclared: "qualified",
  },

  // 017 · Faulkner → Mo Yan
  {
    id: "v4-001-017-faulkner-mo-yan",
    source: {
      type: "author",
      id: "faulkner",
      label: "William Faulkner",
    },
    target: {
      type: "author",
      id: "mo-yan",
      label: "Mo Yan",
    },
    relationType: "author_declared_influence",
    mechanisms: [
      "regional-fiction",
      "narrative-freedom",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Mo Yan reconoció explícitamente a Faulkner entre sus grandes inspiraciones.",
      },
    ],
    confidence: "maximum",
    authorDeclared: "yes",
  },

  // 018 · García Márquez → Mo Yan
  {
    id: "v4-001-018-garcia-marquez-mo-yan",
    source: {
      type: "author",
      id: "garcia-marquez",
      label: "Gabriel García Márquez",
    },
    target: {
      type: "author",
      id: "mo-yan",
      label: "Mo Yan",
    },
    relationType: "author_declared_influence",
    mechanisms: [
      "narrative-imagination",
      "history-and-fantastic",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Mo Yan reconoció explícitamente la influencia de García Márquez.",
      },
    ],
    confidence: "maximum",
    authorDeclared: "yes",
  },

  // 019 · García Márquez → Isabel Allende
  {
    id: "v4-001-019-garcia-marquez-allende",
    source: {
      type: "author",
      id: "garcia-marquez",
      label: "Gabriel García Márquez",
    },
    target: {
      type: "author",
      id: "isabel-allende",
      label: "Isabel Allende",
    },
    relationType: "author_declared_influence",
    mechanisms: [
      "boom-latinoamericano",
      "narrative-model",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Allende ha reconocido a García Márquez como una de sus grandes influencias literarias.",
      },
    ],
    confidence: "maximum",
    authorDeclared: "yes",
  },

  // 020 · Borges → Calvino
  {
    id: "v4-001-020-borges-calvino",
    source: {
      type: "author",
      id: "borges",
      label: "Jorge Luis Borges",
    },
    target: {
      type: "author",
      id: "calvino",
      label: "Italo Calvino",
    },
    relationType: "literary_influence",
    mechanisms: [
      "metafiction",
      "combinatorics",
      "library",
      "infinity",
    ],
    evidence: [
      {
        basis: "scholarly_consensus",
        note:
          "La recepción de Borges por Calvino está ampliamente documentada.",
      },
    ],
    confidence: "maximum",
    scholarlyConsensus: "yes",
  },

  // 021 · Borges → Can Xue
  {
    id: "v4-001-021-borges-can-xue",
    source: {
      type: "author",
      id: "borges",
      label: "Jorge Luis Borges",
    },
    target: {
      type: "author",
      id: "can-xue",
      label: "Can Xue",
    },
    relationType: "author_declared_influence",
    mechanisms: [
      "experimental-fiction",
      "metaphysical-imagination",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Can Xue ha mencionado a Borges entre sus escritores fundamentales.",
      },
    ],
    confidence: "maximum",
    authorDeclared: "yes",
  },

  // 022 · Calvino → Can Xue
  {
    id: "v4-001-022-calvino-can-xue",
    source: {
      type: "author",
      id: "calvino",
      label: "Italo Calvino",
    },
    target: {
      type: "author",
      id: "can-xue",
      label: "Can Xue",
    },
    relationType: "author_declared_influence",
    mechanisms: [
      "experimental-fiction",
      "formal-imagination",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Can Xue ha señalado a Calvino entre sus autores fundamentales.",
      },
    ],
    confidence: "maximum",
    authorDeclared: "yes",
  },

  // 023 · Kafka → Can Xue
  {
    id: "v4-001-023-kafka-can-xue",
    source: {
      type: "author",
      id: "kafka",
      label: "Franz Kafka",
    },
    target: {
      type: "author",
      id: "can-xue",
      label: "Can Xue",
    },
    relationType: "author_declared_influence",
    mechanisms: [
      "experimental-fiction",
      "metaphysical-alienation",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Kafka figura entre los autores que Can Xue identifica como fundamentales.",
      },
    ],
    confidence: "maximum",
    authorDeclared: "yes",
  },

  // 024 · Kafka → Etgar Keret
  {
    id: "v4-001-024-kafka-keret",
    source: {
      type: "author",
      id: "kafka",
      label: "Franz Kafka",
    },
    target: {
      type: "author",
      id: "etgar-keret",
      label: "Etgar Keret",
    },
    relationType: "author_declared_influence",
    mechanisms: [
      "absurd",
      "moral-fiction",
      "short-form",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Keret ha explicado explícitamente la importancia formativa de Kafka.",
      },
    ],
    confidence: "maximum",
    authorDeclared: "yes",
  },

  // 025 · Kafka → Murakami
  {
    id: "v4-001-025-kafka-murakami",
    source: {
      type: "author",
      id: "kafka",
      label: "Franz Kafka",
    },
    target: {
      type: "author",
      id: "haruki-murakami",
      label: "Haruki Murakami",
    },
    relationType: "author_declared_influence",
    mechanisms: [
      "estrangement",
      "surreal-everyday",
      "modern-fiction",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Murakami ha reconocido reiteradamente la importancia de Kafka.",
      },
    ],
    confidence: "maximum",
    authorDeclared: "yes",
  },

  // 026 · Dostoievski → Murakami
  {
    id: "v4-001-026-dostoevsky-murakami",
    source: {
      type: "author",
      id: "dostoevsky",
      label: "Fiódor Dostoievski",
    },
    target: {
      type: "author",
      id: "haruki-murakami",
      label: "Haruki Murakami",
    },
    relationType: "author_declared_influence",
    mechanisms: [
      "long-form-fiction",
      "psychological-depth",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Dostoievski forma parte de las lecturas formativas reconocidas por Murakami.",
      },
    ],
    confidence: "very_high",
    authorDeclared: "yes",
  },

  // 027 · Fitzgerald → Murakami
  {
    id: "v4-001-027-fitzgerald-murakami",
    source: {
      type: "author",
      id: "fitzgerald",
      label: "F. Scott Fitzgerald",
    },
    target: {
      type: "author",
      id: "haruki-murakami",
      label: "Haruki Murakami",
    },
    relationType: "author_declared_influence",
    mechanisms: [
      "american-fiction",
      "style",
      "translation",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Murakami ha reconocido a Fitzgerald como lectura fundamental y además lo ha traducido al japonés.",
      },
    ],
    confidence: "maximum",
    authorDeclared: "yes",
  },

  // 028 · Kawabata → Yu Hua
  {
    id: "v4-001-028-kawabata-yu-hua",
    source: {
      type: "author",
      id: "kawabata",
      label: "Yasunari Kawabata",
    },
    target: {
      type: "author",
      id: "yu-hua",
      label: "Yu Hua",
    },
    relationType: "author_declared_influence",
    mechanisms: [
      "modern-asian-fiction",
      "aesthetic-model",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Yu Hua ha señalado a Kawabata entre sus influencias literarias.",
      },
    ],
    confidence: "maximum",
    authorDeclared: "yes",
  },

  // 029 · Kafka → Yu Hua
  {
    id: "v4-001-029-kafka-yu-hua",
    source: {
      type: "author",
      id: "kafka",
      label: "Franz Kafka",
    },
    target: {
      type: "author",
      id: "yu-hua",
      label: "Yu Hua",
    },
    relationType: "author_declared_influence",
    mechanisms: [
      "modern-fiction",
      "absurdity",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Yu Hua ha citado a Kafka entre sus influencias.",
      },
    ],
    confidence: "maximum",
    authorDeclared: "yes",
  },

  // 030 · Faulkner → Yu Hua
  {
    id: "v4-001-030-faulkner-yu-hua",
    source: {
      type: "author",
      id: "faulkner",
      label: "William Faulkner",
    },
    target: {
      type: "author",
      id: "yu-hua",
      label: "Yu Hua",
    },
    relationType: "author_declared_influence",
    mechanisms: [
      "modern-fiction",
      "narrative-model",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Yu Hua ha citado a Faulkner entre sus influencias.",
      },
    ],
    confidence: "maximum",
    authorDeclared: "yes",
  },

  // 031 · Ōe → Yoko Ogawa
  {
    id: "v4-001-031-oe-ogawa",
    source: {
      type: "author",
      id: "oe",
      label: "Kenzaburō Ōe",
    },
    target: {
      type: "author",
      id: "yoko-ogawa",
      label: "Yoko Ogawa",
    },
    relationType: "literary_influence",
    mechanisms: [
      "modern-japanese-fiction",
      "formative-reading",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "Ōe figura entre los autores identificados como influyentes en la formación de Ogawa.",
      },
    ],
    confidence: "very_high",
  },

  // 032 · Murakami → Yoko Ogawa
  {
    id: "v4-001-032-murakami-ogawa",
    source: {
      type: "author",
      id: "haruki-murakami",
      label: "Haruki Murakami",
    },
    target: {
      type: "author",
      id: "yoko-ogawa",
      label: "Yoko Ogawa",
    },
    relationType: "literary_influence",
    mechanisms: [
      "contemporary-japanese-fiction",
      "formative-reading",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "Murakami aparece entre las influencias señaladas en la formación literaria de Ogawa.",
      },
    ],
    confidence: "very_high",
  },

  // 033 · Gorki → Bábel
  {
    id: "v4-001-033-gorky-babel",
    source: {
      type: "author",
      id: "gorky",
      label: "Máximo Gorki",
    },
    target: {
      type: "author",
      id: "isaac-babel",
      label: "Isaak Bábel",
    },
    relationType: "mentorship",
    mechanisms: [
      "editorial-support",
      "early-publication",
      "literary-encouragement",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "Gorki publicó tempranamente a Bábel y actuó como mentor y mediador.",
      },
    ],
    confidence: "maximum",
  },

  // 034 · Pushkin → Gógol
  {
    id: "v4-001-034-pushkin-gogol",
    source: {
      type: "author",
      id: "pushkin",
      label: "Aleksandr Pushkin",
    },
    target: {
      type: "author",
      id: "gogol",
      label: "Nikolái Gógol",
    },
    relationType: "mentorship",
    mechanisms: [
      "friendship",
      "literary-encouragement",
      "story-material",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "Pushkin animó a Gógol y estuvo relacionado con materiales que este transformó literariamente.",
      },
    ],
    confidence: "very_high",
  },

  // 035 · Tolstói → Bunin
  {
    id: "v4-001-035-tolstoy-bunin",
    source: {
      type: "author",
      id: "tolstoy",
      label: "Lev Tolstói",
    },
    target: {
      type: "author",
      id: "bunin",
      label: "Iván Bunin",
    },
    relationType: "formative_reading",
    mechanisms: [
      "realist-prose-tradition",
      "admiration",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "Bunin expresó una profunda admiración por Tolstói y se situó dentro de esa tradición narrativa.",
      },
    ],
    confidence: "very_high",
  },

  // 036 · Tolstói → Vasili Grossman
  {
    id: "v4-001-036-tolstoy-vasily-grossman",
    source: {
      type: "author",
      id: "tolstoy",
      label: "Lev Tolstói",
    },
    target: {
      type: "author",
      id: "vasily-grossman",
      label: "Vasili Grossman",
    },
    relationType: "literary_influence",
    mechanisms: [
      "war-and-peace-model",
      "humanist-realism",
      "large-scale-narrative",
    ],
    evidence: [
      {
        basis: "scholarly_consensus",
        note:
          "La relación entre Guerra y paz y Vida y destino es central en la recepción crítica de Grossman.",
      },
    ],
    confidence: "maximum",
    scholarlyConsensus: "yes",
  },

  // 037 · Chéjov → Vasili Grossman
  {
    id: "v4-001-037-chekhov-vasily-grossman",
    source: {
      type: "author",
      id: "chekhov",
      label: "Antón Chéjov",
    },
    target: {
      type: "author",
      id: "vasily-grossman",
      label: "Vasili Grossman",
    },
    relationType: "literary_influence",
    mechanisms: [
      "humanism",
      "moral-observation",
      "russian-prose-tradition",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "Chéjov figura entre los modelos decisivos dentro del humanismo literario de Grossman.",
      },
    ],
    confidence: "very_high",
  },

  // 038 · Joyce ⇄ Svevo
  {
    id: "v4-001-038-joyce-svevo",
    source: {
      type: "author",
      id: "joyce",
      label: "James Joyce",
    },
    target: {
      type: "author",
      id: "svevo",
      label: "Italo Svevo",
    },
    relationType: "friendship",
    mechanisms: [
      "mutual-reading",
      "literary-encouragement",
      "critical-mediation",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "Joyce y Svevo mantuvieron una amistad literaria; Joyce ayudó además a la recepción internacional de Svevo.",
      },
    ],
    confidence: "maximum",
    phase: "continuous",
  },

  // 039 · Henry James ⇄ Edith Wharton
  {
    id: "v4-001-039-james-wharton",
    source: {
      type: "author",
      id: "henry-james",
      label: "Henry James",
    },
    target: {
      type: "author",
      id: "edith-wharton",
      label: "Edith Wharton",
    },
    relationType: "correspondence",
    mechanisms: [
      "friendship",
      "mutual-reading",
      "literary-dialogue",
    ],
    evidence: [
      {
        basis: "correspondence",
        note:
          "La extensa correspondencia documenta su amistad e intercambio literario.",
      },
    ],
    confidence: "maximum",
  },

  // 040 · Henry James → Cynthia Ozick
  {
    id: "v4-001-040-james-ozick",
    source: {
      type: "author",
      id: "henry-james",
      label: "Henry James",
    },
    target: {
      type: "author",
      id: "cynthia-ozick",
      label: "Cynthia Ozick",
    },
    relationType: "canonical_rewriting",
    mechanisms: [
      "long-term-literary-engagement",
      "rewriting",
    ],
    evidence: [
      {
        basis: "work_level_intertext",
        note:
          "Ozick mantuvo un diálogo prolongado con James; Foreign Bodies reescribe The Ambassadors.",
      },
    ],
    confidence: "very_high",
  },

  // 041 · Elsa Morante → David Grossman
  {
    id: "v4-001-041-morante-david-grossman",
    source: {
      type: "author",
      id: "elsa-morante",
      label: "Elsa Morante",
    },
    target: {
      type: "author",
      id: "david-grossman",
      label: "David Grossman",
    },
    relationType: "formative_reading",
    mechanisms: [
      "historical-fiction",
      "private-life-and-history",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Grossman ha incluido la obra de Morante entre los libros que moldearon su escritura.",
      },
    ],
    confidence: "maximum",
    authorDeclared: "yes",
  },

  // 042 · Sholem Aleichem → David Grossman
  {
    id: "v4-001-042-sholem-aleichem-david-grossman",
    source: {
      type: "author",
      id: "sholem-aleichem",
      label: "Sholem Aleichem",
    },
    target: {
      type: "author",
      id: "david-grossman",
      label: "David Grossman",
    },
    relationType: "formative_reading",
    mechanisms: [
      "family-mediated-reading",
      "yiddish-memory",
      "hebrew-translation",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Grossman ha explicado la importancia de Sholem Aleichem en sus lecturas formativas.",
      },
      {
        basis: "family_testimony",
        note:
          "La transmisión estuvo vinculada también a las lecturas recibidas de su padre.",
      },
    ],
    confidence: "maximum",
    authorDeclared: "yes",
  },

  // 043 · Toni Morrison → Warsan Shire
  {
    id: "v4-001-043-morrison-shire",
    source: {
      type: "author",
      id: "toni-morrison",
      label: "Toni Morrison",
    },
    target: {
      type: "author",
      id: "warsan-shire",
      label: "Warsan Shire",
    },
    relationType: "formative_reading",
    mechanisms: [
      "gendered-self-understanding",
      "literary-model",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Shire ha explicado el impacto profundo de Sula en su formación personal y literaria.",
      },
    ],
    confidence: "maximum",
    authorDeclared: "yes",
  },

  // 044 · Mahfouz → Aboulela
  {
    id: "v4-001-044-mahfouz-aboulela",
    source: {
      type: "author",
      id: "mahfouz",
      label: "Naguib Mahfouz",
    },
    target: {
      type: "author",
      id: "leila-aboulela",
      label: "Leila Aboulela",
    },
    relationType: "author_declared_influence",
    mechanisms: [
      "arabic-literary-tradition",
      "modern-fiction",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Aboulela ha identificado a Mahfouz entre sus influencias formativas.",
      },
    ],
    confidence: "very_high",
    authorDeclared: "yes",
  },

  // 045 · Tayeb Salih → Aboulela
  {
    id: "v4-001-045-tayeb-salih-aboulela",
    source: {
      type: "author",
      id: "tayeb-salih",
      label: "Tayeb Salih",
    },
    target: {
      type: "author",
      id: "leila-aboulela",
      label: "Leila Aboulela",
    },
    relationType: "author_declared_influence",
    mechanisms: [
      "sudanese-literary-lineage",
      "migration",
      "cross-cultural-fiction",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Aboulela ha identificado a Tayeb Salih entre sus influencias.",
      },
    ],
    confidence: "maximum",
    authorDeclared: "yes",
  },

  // 046 · Guimarães Rosa → Mia Couto
  {
    id: "v4-001-046-guimaraes-rosa-mia-couto",
    source: {
      type: "author",
      id: "guimaraes-rosa",
      label: "João Guimarães Rosa",
    },
    target: {
      type: "author",
      id: "mia-couto",
      label: "Mia Couto",
    },
    relationType: "author_declared_influence",
    mechanisms: [
      "language-transformation",
      "oral-language",
      "lexical-invention",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Mia Couto ha reconocido explícitamente a Guimarães Rosa como una de sus grandes inspiraciones.",
      },
    ],
    confidence: "maximum",
    authorDeclared: "yes",
  },

  // 047 · Abai → Mukhtar Auezov
  {
    id: "v4-001-047-abai-auezov",
    source: {
      type: "author",
      id: "abai-qunanbaiuly",
      label: "Abai Qunanbaiuly",
    },
    target: {
      type: "author",
      id: "mukhtar-auezov",
      label: "Mukhtar Auezov",
    },
    relationType: "literary_influence",
    mechanisms: [
      "family-mediated-transmission",
      "national-literary-memory",
      "biographical-canonization",
    ],
    evidence: [
      {
        basis: "family_testimony",
        note:
          "Auezov creció en un entorno familiar profundamente ligado a la memoria y obra de Abai.",
      },
      {
        basis: "biographical",
        note:
          "Auezov convirtió posteriormente la vida de Abai en materia narrativa monumental.",
      },
    ],
    confidence: "maximum",
  },

  // 048 · Langston Hughes → Maya Angelou
  {
    id: "v4-001-048-hughes-angelou",
    source: {
      type: "author",
      id: "langston-hughes",
      label: "Langston Hughes",
    },
    target: {
      type: "author",
      id: "maya-angelou",
      label: "Maya Angelou",
    },
    relationType: "formative_reading",
    mechanisms: [
      "african-american-literary-tradition",
      "early-reading",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "Angelou leyó intensamente a Hughes durante su formación literaria temprana.",
      },
    ],
    confidence: "maximum",
  },

  // 049 · Baldwin ⇄ Maya Angelou
  {
    id: "v4-001-049-baldwin-angelou",
    source: {
      type: "author",
      id: "james-baldwin",
      label: "James Baldwin",
    },
    target: {
      type: "author",
      id: "maya-angelou",
      label: "Maya Angelou",
    },
    relationType: "friendship",
    mechanisms: [
      "literary-encouragement",
      "intellectual-network",
      "personal-support",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "Baldwin y Angelou mantuvieron una amistad profunda y una relación de apoyo literario.",
      },
    ],
    confidence: "very_high",
    phase: "continuous",
  },

  // 050 · Richard Wright → Ralph Ellison
  {
    id: "v4-001-050-wright-ellison",
    source: {
      type: "author",
      id: "richard-wright",
      label: "Richard Wright",
    },
    target: {
      type: "author",
      id: "ralph-ellison",
      label: "Ralph Ellison",
    },
    relationType: "mentorship",
    mechanisms: [
      "literary-network",
      "early-support",
      "african-american-literary-field",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "Wright fue una figura de apoyo y referencia temprana para Ellison.",
      },
    ],
    confidence: "very_high",
  },

];
