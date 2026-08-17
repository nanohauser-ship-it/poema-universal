import type {
  AtlasMasterRelation,
} from "./relation-ontology";

/**
 * ATLAS UNIVERSAL DE LAS INFLUENCIAS
 * CORPUS RELACIONAL V4
 *
 * PAQUETE 002
 * 50 relaciones adicionales de alta / máxima confianza.
 */

export const atlasRelationsV4002: AtlasMasterRelation[] = [

  // 051 · Merton → Cardenal
  {
    id: "v4-002-051-merton-cardenal",
    source: {
      type: "author",
      id: "thomas-merton",
      label: "Thomas Merton",
    },
    target: {
      type: "author",
      id: "ernesto-cardenal",
      label: "Ernesto Cardenal",
    },
    relationType: "mentorship",
    mechanisms: [
      "spiritual-formation",
      "literary-formation",
      "correspondence",
    ],
    evidence: [
      {
        basis: "correspondence",
        note:
          "Cardenal fue novicio bajo Merton y mantuvo después correspondencia con él.",
      },
    ],
    confidence: "maximum",
  },

  // 052 · Holan → Clara Janés
  {
    id: "v4-002-052-holan-clara-janes",
    source: {
      type: "author",
      id: "vladimir-holan",
      label: "Vladimír Holan",
    },
    target: {
      type: "author",
      id: "clara-janes",
      label: "Clara Janés",
    },
    relationType: "formative_reading",
    mechanisms: [
      "transformative-reading",
      "personal-meeting",
      "translation",
      "language-learning",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "La lectura de Holan llevó a Janés a viajar a Praga, conocerlo y profundizar en la lengua y poesía checas.",
      },
    ],
    confidence: "maximum",
  },

  // 053 · San Juan de la Cruz → Clara Janés
  {
    id: "v4-002-053-san-juan-clara-janes",
    source: {
      type: "author",
      id: "san-juan-cruz",
      label: "San Juan de la Cruz",
    },
    target: {
      type: "author",
      id: "clara-janes",
      label: "Clara Janés",
    },
    relationType: "literary_influence",
    mechanisms: [
      "mystical-tradition",
      "poetic-genealogy",
    ],
    evidence: [
      {
        basis: "scholarly_consensus",
        note:
          "La crítica sitúa a Janés dentro de una genealogía mística ibérica donde San Juan de la Cruz es central.",
      },
    ],
    confidence: "high",
  },

  // 054 · Sartre → Ōe
  {
    id: "v4-002-054-sartre-oe",
    source: {
      type: "author",
      id: "sartre",
      label: "Jean-Paul Sartre",
    },
    target: {
      type: "author",
      id: "oe",
      label: "Kenzaburō Ōe",
    },
    relationType: "formative_reading",
    mechanisms: [
      "university-study",
      "existentialism",
      "french-literature",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "Ōe estudió literatura francesa y dedicó su tesis universitaria a Sartre.",
      },
    ],
    confidence: "maximum",
  },

  // 055 · Beckett → Coetzee
  {
    id: "v4-002-055-beckett-coetzee",
    source: {
      type: "author",
      id: "beckett",
      label: "Samuel Beckett",
    },
    target: {
      type: "author",
      id: "coetzee",
      label: "J. M. Coetzee",
    },
    relationType: "literary_influence",
    mechanisms: [
      "academic-study",
      "aesthetic-reception",
      "minimalism",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "Coetzee dedicó su tesis doctoral a la ficción temprana de Beckett.",
      },
    ],
    confidence: "maximum",
  },

  // 056 · Defoe → Coetzee
  {
    id: "v4-002-056-defoe-coetzee",
    source: {
      type: "author",
      id: "daniel-defoe",
      label: "Daniel Defoe",
    },
    target: {
      type: "author",
      id: "coetzee",
      label: "J. M. Coetzee",
    },
    relationType: "canonical_rewriting",
    mechanisms: [
      "robinson-crusoe-rewriting",
      "postcolonial-revision",
    ],
    evidence: [
      {
        basis: "work_level_intertext",
        note:
          "Foe reescribe críticamente Robinson Crusoe.",
      },
    ],
    confidence: "maximum",
  },

  // 057 · Rumi → Elif Shafak
  {
    id: "v4-002-057-rumi-shafak",
    source: {
      type: "author",
      id: "rumi",
      label: "Rumi",
    },
    target: {
      type: "author",
      id: "elif-shafak",
      label: "Elif Shafak",
    },
    relationType: "canonical_rewriting",
    mechanisms: [
      "sufi-reception",
      "narrative-reinterpretation",
    ],
    evidence: [
      {
        basis: "work_level_intertext",
        note:
          "The Forty Rules of Love reelabora narrativamente la figura y tradición de Rumi.",
      },
    ],
    confidence: "maximum",
  },

  // 058 · Abai → Auezov
  {
    id: "v4-002-058-abai-auezov-canonization",
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
    relationType: "biographical_canonization",
    mechanisms: [
      "national-memory",
      "biographical-fiction",
      "canon-building",
    ],
    evidence: [
      {
        basis: "work_level_intertext",
        note:
          "Auezov convirtió la vida y obra de Abai en materia narrativa central de The Path of Abai.",
      },
    ],
    confidence: "maximum",
  },

  // 059 · Dante → Primo Levi
  {
    id: "v4-002-059-dante-primo-levi",
    source: {
      type: "author",
      id: "dante",
      label: "Dante Alighieri",
    },
    target: {
      type: "author",
      id: "primo-levi",
      label: "Primo Levi",
    },
    relationType: "text_as_survival_resource",
    mechanisms: [
      "memory",
      "intertextual-reactivation",
      "cultural-survival",
    ],
    evidence: [
      {
        basis: "work_level_intertext",
        note:
          "El canto de Ulises reaparece en la experiencia de Auschwitz narrada por Levi.",
      },
    ],
    confidence: "maximum",
  },

  // 060 · Anne Frank → Yoko Ogawa
  {
    id: "v4-002-060-anne-frank-ogawa",
    source: {
      type: "author",
      id: "anne-frank",
      label: "Anne Frank",
    },
    target: {
      type: "author",
      id: "yoko-ogawa",
      label: "Yoko Ogawa",
    },
    relationType: "text_to_vocation",
    mechanisms: [
      "early-reading",
      "memory",
      "writerly-vocation",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Ogawa ha explicado que la lectura del diario de Anne Frank fue decisiva para querer ser escritora.",
      },
    ],
    confidence: "maximum",
    authorDeclared: "yes",
  },

  // 061 · Lowry? no; Holan duplicate avoided

  // 061 · Rukeyser → Adrienne Rich
  {
    id: "v4-002-061-rukeyser-rich",
    source: {
      type: "author",
      id: "muriel-rukeyser",
      label: "Muriel Rukeyser",
    },
    target: {
      type: "author",
      id: "adrienne-rich",
      label: "Adrienne Rich",
    },
    relationType: "mentorship",
    mechanisms: [
      "feminist-poetry",
      "documentary-poetry",
      "political-writing",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "Rukeyser fue una mentora importante para Rich.",
      },
    ],
    confidence: "maximum",
  },

  // 062 · Auden → Ashbery
  {
    id: "v4-002-062-auden-ashbery",
    source: {
      type: "author",
      id: "auden",
      label: "W. H. Auden",
    },
    target: {
      type: "author",
      id: "john-ashbery",
      label: "John Ashbery",
    },
    relationType: "author_declared_influence",
    mechanisms: [
      "poetic-model",
      "modern-poetry",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Ashbery identificó a Auden como una de sus influencias básicas más importantes.",
      },
    ],
    confidence: "maximum",
    authorDeclared: "yes",
  },

  // 063 · Whitman → Ashbery
  {
    id: "v4-002-063-whitman-ashbery",
    source: {
      type: "author",
      id: "whitman",
      label: "Walt Whitman",
    },
    target: {
      type: "author",
      id: "john-ashbery",
      label: "John Ashbery",
    },
    relationType: "author_declared_influence",
    mechanisms: [
      "american-poetic-lineage",
      "expansive-voice",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Ashbery declaró haber aprendido mucho de Whitman.",
      },
    ],
    confidence: "very_high",
    authorDeclared: "yes",
  },

  // 064 · Wallace Stevens → Ashbery
  {
    id: "v4-002-064-stevens-ashbery",
    source: {
      type: "author",
      id: "wallace-stevens",
      label: "Wallace Stevens",
    },
    target: {
      type: "author",
      id: "john-ashbery",
      label: "John Ashbery",
    },
    relationType: "author_declared_influence",
    mechanisms: [
      "poetic-thought",
      "modern-poetry",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Ashbery declaró haber aprendido mucho de Wallace Stevens.",
      },
    ],
    confidence: "very_high",
    authorDeclared: "yes",
  },

  // 065 · Auden → Amichai
  {
    id: "v4-002-065-auden-amichai",
    source: {
      type: "author",
      id: "auden",
      label: "W. H. Auden",
    },
    target: {
      type: "author",
      id: "yehuda-amichai",
      label: "Yehuda Amichai",
    },
    relationType: "formative_reading",
    mechanisms: [
      "modern-poetry",
      "colloquial-language",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "Auden fue una lectura formativa importante para Amichai.",
      },
    ],
    confidence: "maximum",
  },

  // 066 · Dylan Thomas → Amichai
  {
    id: "v4-002-066-dylan-thomas-amichai",
    source: {
      type: "author",
      id: "dylan-thomas",
      label: "Dylan Thomas",
    },
    target: {
      type: "author",
      id: "yehuda-amichai",
      label: "Yehuda Amichai",
    },
    relationType: "formative_reading",
    mechanisms: [
      "modern-poetry",
      "voice",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "Dylan Thomas figura entre las lecturas tempranas decisivas de Amichai.",
      },
    ],
    confidence: "very_high",
  },

  // 067 · Eliot → Amichai
  {
    id: "v4-002-067-eliot-amichai",
    source: {
      type: "author",
      id: "eliot",
      label: "T. S. Eliot",
    },
    target: {
      type: "author",
      id: "yehuda-amichai",
      label: "Yehuda Amichai",
    },
    relationType: "formative_reading",
    mechanisms: [
      "modern-poetry",
      "international-poetic-reception",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "Eliot formó parte de la lectura moderna angloamericana de Amichai.",
      },
    ],
    confidence: "very_high",
  },

  // 068 · Eliot → Glück
  {
    id: "v4-002-068-eliot-gluck",
    source: {
      type: "author",
      id: "eliot",
      label: "T. S. Eliot",
    },
    target: {
      type: "author",
      id: "louise-gluck",
      label: "Louise Glück",
    },
    relationType: "literary_influence",
    mechanisms: [
      "tonal-urgency",
      "poetic-model",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Glück ha reconocido el valor de Eliot como modelo tonal y crítico.",
      },
    ],
    confidence: "very_high",
    authorDeclared: "yes",
  },

  // 069 · Keats → Glück
  {
    id: "v4-002-069-keats-gluck",
    source: {
      type: "author",
      id: "keats",
      label: "John Keats",
    },
    target: {
      type: "author",
      id: "louise-gluck",
      label: "Louise Glück",
    },
    relationType: "literary_influence",
    mechanisms: [
      "inward-listening",
      "poetic-model",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Glück ha identificado en Keats un modelo de escucha interior.",
      },
    ],
    confidence: "very_high",
    authorDeclared: "yes",
  },

  // 070 · Tao Te Ching → Le Guin
  {
    id: "v4-002-070-tao-le-guin",
    source: {
      type: "tradition",
      id: "tao-te-ching",
      label: "Tao Te Ching / Taoísmo",
    },
    target: {
      type: "author",
      id: "ursula-le-guin",
      label: "Ursula K. Le Guin",
    },
    relationType: "disciplinary_influence",
    mechanisms: [
      "taoism",
      "philosophical-formation",
      "ethical-cosmology",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Le Guin declaró que el Tao Te Ching influyó profundamente en toda su escritura.",
      },
    ],
    confidence: "maximum",
    authorDeclared: "yes",
  },

  // 071 · Boas → Hurston
  {
    id: "v4-002-071-boas-hurston",
    source: {
      type: "author",
      id: "franz-boas",
      label: "Franz Boas",
    },
    target: {
      type: "author",
      id: "zora-neale-hurston",
      label: "Zora Neale Hurston",
    },
    relationType: "mentorship",
    mechanisms: [
      "anthropology",
      "fieldwork",
      "folklore-study",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "Hurston estudió antropología con Franz Boas.",
      },
    ],
    confidence: "maximum",
  },

  // 072 · Shakespeare → Melville
  {
    id: "v4-002-072-shakespeare-melville",
    source: {
      type: "author",
      id: "shakespeare",
      label: "William Shakespeare",
    },
    target: {
      type: "author",
      id: "herman-melville",
      label: "Herman Melville",
    },
    relationType: "literary_influence",
    mechanisms: [
      "dramatic-language",
      "monologue",
      "tragic-structure",
    ],
    evidence: [
      {
        basis: "annotated_book",
        note:
          "Los ejemplares anotados por Melville y la estructura de Moby-Dick documentan una recepción intensa de Shakespeare.",
      },
    ],
    confidence: "maximum",
  },

  // 073 · Burney → Austen
  {
    id: "v4-002-073-burney-austen",
    source: {
      type: "author",
      id: "frances-burney",
      label: "Frances Burney",
    },
    target: {
      type: "author",
      id: "jane-austen",
      label: "Jane Austen",
    },
    relationType: "formative_reading",
    mechanisms: [
      "novel-tradition",
      "female-authorship",
      "social-comedy",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "Burney estuvo entre las novelistas favoritas y formativas de Austen.",
      },
    ],
    confidence: "maximum",
  },

  // 074 · Radcliffe → Austen
  {
    id: "v4-002-074-radcliffe-austen",
    source: {
      type: "author",
      id: "ann-radcliffe",
      label: "Ann Radcliffe",
    },
    target: {
      type: "author",
      id: "jane-austen",
      label: "Jane Austen",
    },
    relationType: "parodic_reception",
    mechanisms: [
      "gothic-novel",
      "critical-distance",
      "northanger-abbey",
    ],
    evidence: [
      {
        basis: "work_level_intertext",
        note:
          "Northanger Abbey dialoga y parodia explícitamente la tradición gótica asociada a Radcliffe.",
      },
    ],
    confidence: "maximum",
  },

  // 075 · Lorca → Cohen
  {
    id: "v4-002-075-lorca-cohen",
    source: {
      type: "author",
      id: "lorca",
      label: "Federico García Lorca",
    },
    target: {
      type: "author",
      id: "leonard-cohen",
      label: "Leonard Cohen",
    },
    relationType: "author_declared_influence",
    mechanisms: [
      "poetic-admiration",
      "song-and-poetry",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Cohen expresó reiteradamente su profunda admiración por Lorca.",
      },
    ],
    confidence: "maximum",
    authorDeclared: "yes",
  },

  // 076 · Han Ha-un → Ko Un
  {
    id: "v4-002-076-han-ha-un-ko-un",
    source: {
      type: "author",
      id: "han-ha-un",
      label: "Han Ha-un",
    },
    target: {
      type: "author",
      id: "ko-un",
      label: "Ko Un",
    },
    relationType: "formative_reading",
    mechanisms: [
      "poetic-discovery",
      "early-reading",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "El descubrimiento de la obra de Han Ha-un fue importante en la entrada de Ko Un en la poesía.",
      },
    ],
    confidence: "maximum",
  },

  // 077 · Frye → Atwood
  {
    id: "v4-002-077-frye-atwood",
    source: {
      type: "author",
      id: "northrop-frye",
      label: "Northrop Frye",
    },
    target: {
      type: "author",
      id: "margaret-atwood",
      label: "Margaret Atwood",
    },
    relationType: "mentorship",
    mechanisms: [
      "university-teaching",
      "myth-criticism",
      "canadian-literature",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "Frye fue profesor de Atwood en Victoria College.",
      },
    ],
    confidence: "maximum",
  },

  // 078 · Hopkins → Heaney
  {
    id: "v4-002-078-hopkins-heaney",
    source: {
      type: "author",
      id: "gerard-manley-hopkins",
      label: "Gerard Manley Hopkins",
    },
    target: {
      type: "author",
      id: "seamus-heaney",
      label: "Seamus Heaney",
    },
    relationType: "formative_reading",
    mechanisms: [
      "early-imitation",
      "sound",
      "rhythm",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "Heaney reconoció imitaciones tempranas de Hopkins durante su formación.",
      },
    ],
    confidence: "very_high",
  },

  // 079 · Frost → Heaney
  {
    id: "v4-002-079-frost-heaney",
    source: {
      type: "author",
      id: "robert-frost",
      label: "Robert Frost",
    },
    target: {
      type: "author",
      id: "seamus-heaney",
      label: "Seamus Heaney",
    },
    relationType: "formative_reading",
    mechanisms: [
      "early-imitation",
      "rural-poetics",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "Frost fue una de las influencias imitadas por Heaney en su formación temprana.",
      },
    ],
    confidence: "very_high",
  },

  // 080 · Miłosz → Heaney
  {
    id: "v4-002-080-milosz-heaney",
    source: {
      type: "author",
      id: "milosz",
      label: "Czesław Miłosz",
    },
    target: {
      type: "author",
      id: "seamus-heaney",
      label: "Seamus Heaney",
    },
    relationType: "literary_influence",
    mechanisms: [
      "later-model",
      "friendship",
      "historical-poetics",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "Miłosz fue una figura importante en la etapa madura de Heaney.",
      },
    ],
    confidence: "very_high",
  },

  // 081 · Walcott → Heaney
  {
    id: "v4-002-081-walcott-heaney",
    source: {
      type: "author",
      id: "derek-walcott",
      label: "Derek Walcott",
    },
    target: {
      type: "author",
      id: "seamus-heaney",
      label: "Seamus Heaney",
    },
    relationType: "friendship",
    mechanisms: [
      "poetic-dialogue",
      "later-model",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "Walcott y Heaney mantuvieron amistad e intercambio poético.",
      },
    ],
    confidence: "very_high",
  },

  // 082 · Qabbani → Darwish
  {
    id: "v4-002-082-qabbani-darwish",
    source: {
      type: "author",
      id: "nizar-qabbani",
      label: "Nizar Qabbani",
    },
    target: {
      type: "author",
      id: "darwish",
      label: "Mahmoud Darwish",
    },
    relationType: "author_declared_influence",
    mechanisms: [
      "arabic-modern-poetry",
      "lyric-model",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Darwish incluyó a Qabbani entre sus influencias importantes.",
      },
    ],
    confidence: "maximum",
    authorDeclared: "yes",
  },

  // 083 · Neruda → Darwish
  {
    id: "v4-002-083-neruda-darwish",
    source: {
      type: "author",
      id: "neruda",
      label: "Pablo Neruda",
    },
    target: {
      type: "author",
      id: "darwish",
      label: "Mahmoud Darwish",
    },
    relationType: "author_declared_influence",
    mechanisms: [
      "world-poetry",
      "political-lyric",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Darwish reconoció a Neruda entre sus influencias occidentales.",
      },
    ],
    confidence: "maximum",
    authorDeclared: "yes",
  },

  // 084 · Lorca → Darwish
  {
    id: "v4-002-084-lorca-darwish",
    source: {
      type: "author",
      id: "lorca",
      label: "Federico García Lorca",
    },
    target: {
      type: "author",
      id: "darwish",
      label: "Mahmoud Darwish",
    },
    relationType: "author_declared_influence",
    mechanisms: [
      "lyric-imagination",
      "world-poetry",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Darwish mencionó a Lorca entre sus influencias.",
      },
    ],
    confidence: "maximum",
    authorDeclared: "yes",
  },

  // 085 · Yeats → Darwish
  {
    id: "v4-002-085-yeats-darwish",
    source: {
      type: "author",
      id: "yeats",
      label: "W. B. Yeats",
    },
    target: {
      type: "author",
      id: "darwish",
      label: "Mahmoud Darwish",
    },
    relationType: "author_declared_influence",
    mechanisms: [
      "national-poetics",
      "lyric-model",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Darwish mencionó a Yeats entre sus influencias.",
      },
    ],
    confidence: "maximum",
    authorDeclared: "yes",
  },

  // 086 · Haroldo de Campos / Noigandres
  {
    id: "v4-002-086-augusto-haroldo",
    source: {
      type: "author",
      id: "augusto-de-campos",
      label: "Augusto de Campos",
    },
    target: {
      type: "author",
      id: "haroldo-de-campos",
      label: "Haroldo de Campos",
    },
    relationType: "co_creation",
    mechanisms: [
      "noigandres",
      "concrete-poetry",
      "movement-foundation",
    ],
    evidence: [
      {
        basis: "historical_record",
        note:
          "Augusto y Haroldo de Campos participaron conjuntamente en la fundación y desarrollo de Noigandres y la poesía concreta brasileña.",
      },
    ],
    confidence: "maximum",
  },

  // 087 · Concrete poetry → Gullar
  {
    id: "v4-002-087-concrete-gullar",
    source: {
      type: "movement",
      id: "poesia-concreta-brasilena",
      label: "Poesía concreta brasileña",
    },
    target: {
      type: "author",
      id: "ferreira-gullar",
      label: "Ferreira Gullar",
    },
    relationType: "movement_membership",
    mechanisms: [
      "formal-experimentation",
      "later-break",
    ],
    evidence: [
      {
        basis: "historical_record",
        note:
          "Gullar participó en la poesía concreta antes de reformular su posición hacia el neoconcretismo.",
      },
    ],
    confidence: "maximum",
  },

  // 088 · Gullar → Neoconcretism
  {
    id: "v4-002-088-gullar-neoconcretism",
    source: {
      type: "author",
      id: "ferreira-gullar",
      label: "Ferreira Gullar",
    },
    target: {
      type: "movement",
      id: "neoconcretismo",
      label: "Neoconcretismo",
    },
    relationType: "movement_foundation",
    mechanisms: [
      "manifesto",
      "formal-reinvention",
    ],
    evidence: [
      {
        basis: "historical_record",
        note:
          "Gullar fue una figura central y teórica del Neoconcretismo.",
      },
    ],
    confidence: "maximum",
  },

  // 089 · Simbolismo → Galaktion
  {
    id: "v4-002-089-symbolism-tabidze",
    source: {
      type: "movement",
      id: "simbolismo",
      label: "Simbolismo",
    },
    target: {
      type: "author",
      id: "galaktion-tabidze",
      label: "Galaktion Tabidze",
    },
    relationType: "movement_membership",
    mechanisms: [
      "aesthetic-formation",
      "modern-georgian-poetry",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "La obra temprana de Tabidze estuvo profundamente marcada por el simbolismo.",
      },
    ],
    confidence: "very_high",
  },

  // 090 · Mayakovsky → Hikmet
  {
    id: "v4-002-090-mayakovsky-hikmet",
    source: {
      type: "author",
      id: "mayakovsky",
      label: "Vladímir Mayakovski",
    },
    target: {
      type: "author",
      id: "nazim-hikmet",
      label: "Nâzım Hikmet",
    },
    relationType: "literary_influence",
    mechanisms: [
      "russian-futurism",
      "free-verse",
      "metrical-transformation",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "Hikmet quedó profundamente impresionado por Mayakovski y el futurismo ruso durante su etapa en Moscú.",
      },
    ],
    confidence: "very_high",
  },

  // 091 · Graham Greene → Endo
  {
    id: "v4-002-091-greene-endo",
    source: {
      type: "author",
      id: "graham-greene",
      label: "Graham Greene",
    },
    target: {
      type: "author",
      id: "endo-shusaku",
      label: "Shūsaku Endō",
    },
    relationType: "author_declared_influence",
    mechanisms: [
      "catholic-fiction",
      "ethical-conflict",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Endō reconoció a Greene como una influencia significativa.",
      },
    ],
    confidence: "maximum",
    authorDeclared: "yes",
  },

  // 092 · Sholem Aleichem → modern Yiddish canon
  {
    id: "v4-002-092-sholem-yiddish-canon",
    source: {
      type: "author",
      id: "sholem-aleichem",
      label: "Sholem Aleichem",
    },
    target: {
      type: "institution",
      id: "modern-yiddish-canon",
      label: "Canon yidis moderno",
    },
    relationType: "canon_reformation",
    mechanisms: [
      "publishing",
      "canon-building",
      "circulation",
    ],
    evidence: [
      {
        basis: "historical_record",
        note:
          "Sholem Aleichem participó activamente en la consolidación del canon yidis moderno.",
      },
    ],
    confidence: "very_high",
  },

  // 093 · Ocampo + Borges/Bioy
  {
    id: "v4-002-093-ocampo-bioy",
    source: {
      type: "author",
      id: "silvina-ocampo",
      label: "Silvina Ocampo",
    },
    target: {
      type: "author",
      id: "adolfo-bioy-casares",
      label: "Adolfo Bioy Casares",
    },
    relationType: "collaboration",
    mechanisms: [
      "co-curatorship",
      "fantastic-literature",
      "shared-projects",
    ],
    evidence: [
      {
        basis: "historical_record",
        note:
          "Ocampo y Bioy colaboraron en proyectos literarios y antologías.",
      },
    ],
    confidence: "maximum",
  },

  // 094 · Borges + Bioy
  {
    id: "v4-002-094-bioy-borges",
    source: {
      type: "author",
      id: "adolfo-bioy-casares",
      label: "Adolfo Bioy Casares",
    },
    target: {
      type: "author",
      id: "borges",
      label: "Jorge Luis Borges",
    },
    relationType: "co_creation",
    mechanisms: [
      "friendship",
      "coauthorship",
      "heteronym",
      "mutual-reading",
    ],
    evidence: [
      {
        basis: "historical_record",
        note:
          "Borges y Bioy mantuvieron una colaboración creativa y editorial de décadas.",
      },
    ],
    confidence: "maximum",
  },

  // 095 · Richard Wright → Gwendolyn Brooks
  {
    id: "v4-002-095-wright-brooks",
    source: {
      type: "author",
      id: "richard-wright",
      label: "Richard Wright",
    },
    target: {
      type: "author",
      id: "gwendolyn-brooks",
      label: "Gwendolyn Brooks",
    },
    relationType: "mentorship",
    mechanisms: [
      "literary-support",
      "african-american-literary-network",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "Wright fue una figura de apoyo dentro de la red literaria temprana de Brooks.",
      },
    ],
    confidence: "high",
  },

  // 096 · Langston Hughes → Brooks
  {
    id: "v4-002-096-hughes-brooks",
    source: {
      type: "author",
      id: "langston-hughes",
      label: "Langston Hughes",
    },
    target: {
      type: "author",
      id: "gwendolyn-brooks",
      label: "Gwendolyn Brooks",
    },
    relationType: "mentorship",
    mechanisms: [
      "early-recognition",
      "encouragement",
    ],
    evidence: [
      {
        basis: "biographical",
        note:
          "Hughes leyó y animó la obra temprana de Brooks.",
      },
    ],
    confidence: "very_high",
  },

  // 097 · Rukeyser rich already, no duplicate

  // 097 · Franz Kafka → Hedayat (qualified)
  {
    id: "v4-002-097-kafka-hedayat",
    source: {
      type: "author",
      id: "kafka",
      label: "Franz Kafka",
    },
    target: {
      type: "author",
      id: "sadegh-hedayat",
      label: "Sadegh Hedayat",
    },
    relationType: "critical_affinity",
    mechanisms: [
      "later-reception",
      "modernist-comparison",
    ],
    evidence: [
      {
        basis: "scholarly_comparison",
        note:
          "La crítica ha relacionado a Kafka y Hedayat, pero Kafka no puede considerarse fuente directa de The Blind Owl.",
      },
    ],
    confidence: "high",
    scholarlyConsensus: "qualified",
    authorDeclared: "qualified",
  },

  // 098 · Gógol → Singer
  {
    id: "v4-002-098-gogol-singer",
    source: {
      type: "author",
      id: "gogol",
      label: "Nikolái Gógol",
    },
    target: {
      type: "author",
      id: "isaac-bashevis-singer",
      label: "Isaac Bashevis Singer",
    },
    relationType: "author_declared_influence",
    mechanisms: [
      "grotesque",
      "narrative-imagination",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Singer incluyó a Gógol entre sus influencias importantes.",
      },
    ],
    confidence: "maximum",
    authorDeclared: "yes",
  },

  // 099 · Dostoevsky → Singer
  {
    id: "v4-002-099-dostoevsky-singer",
    source: {
      type: "author",
      id: "dostoevsky",
      label: "Fiódor Dostoievski",
    },
    target: {
      type: "author",
      id: "isaac-bashevis-singer",
      label: "Isaac Bashevis Singer",
    },
    relationType: "author_declared_influence",
    mechanisms: [
      "moral-conflict",
      "psychological-depth",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Singer citó a Dostoievski entre sus influencias de toda la vida.",
      },
    ],
    confidence: "maximum",
    authorDeclared: "yes",
  },

  // 100 · Pushkin → Nabokov
  {
    id: "v4-002-100-pushkin-nabokov",
    source: {
      type: "author",
      id: "pushkin",
      label: "Aleksandr Pushkin",
    },
    target: {
      type: "author",
      id: "nabokov",
      label: "Vladimir Nabokov",
    },
    relationType: "authorial_qualification",
    mechanisms: [
      "russian-literary-tradition",
      "translation",
      "critical-engagement",
    ],
    evidence: [
      {
        basis: "author_declared",
        note:
          "Nabokov reconoció a Pushkin como parte de su tradición, aunque matizó la noción de influencia.",
      },
    ],
    confidence: "very_high",
    authorDeclared: "qualified",
  },

];
