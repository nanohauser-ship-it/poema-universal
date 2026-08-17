import type { AtlasMasterRelation } from "./relation-ontology";

export const atlasRelationsV4004B: AtlasMasterRelation[] = [
  {
    "id": "v4-004-176-symbolism-rimbaud",
    "source": {
      "type": "movement",
      "id": "simbolismo",
      "label": "Simbolismo"
    },
    "target": {
      "type": "author",
      "id": "rimbaud",
      "label": "Arthur Rimbaud"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "symbolist-poetics",
      "modern-poetry",
      "visionary-language"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Rimbaud ocupa una posición fundacional en la constelación histórica del simbolismo francés."
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-004-177-alexandria-cavafis",
    "source": {
      "type": "place",
      "id": "alexandria",
      "label": "Alejandría"
    },
    "target": {
      "type": "author",
      "id": "cavafis",
      "label": "Constantino Cavafis"
    },
    "relationType": "shared_historical_space",
    "mechanisms": [
      "urban-memory",
      "hellenistic-history",
      "cosmopolitanism"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "Alejandría constituye el espacio biográfico, histórico e imaginario central de la obra de Cavafis."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-178-generation98-unamuno",
    "source": {
      "type": "movement",
      "id": "generation-98",
      "label": "Generación del 98"
    },
    "target": {
      "type": "author",
      "id": "unamuno",
      "label": "Miguel de Unamuno"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "spanish-crisis",
      "identity",
      "philosophical-literature"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Unamuno es una de las figuras centrales asociadas a la Generación del 98."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-179-modernismo-ruben-dario",
    "source": {
      "type": "movement",
      "id": "modernismo-hispanoamericano",
      "label": "Modernismo hispanoamericano"
    },
    "target": {
      "type": "author",
      "id": "ruben-dario",
      "label": "Rubén Darío"
    },
    "relationType": "movement_foundation",
    "mechanisms": [
      "metrical-renewal",
      "cosmopolitanism",
      "poetic-language"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Rubén Darío constituye la figura central en la consolidación y expansión del Modernismo hispanoamericano."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-180-ruskin-proust",
    "source": {
      "type": "author",
      "id": "john-ruskin",
      "label": "John Ruskin"
    },
    "target": {
      "type": "author",
      "id": "proust",
      "label": "Marcel Proust"
    },
    "relationType": "translation_mediated_reception",
    "mechanisms": [
      "translation",
      "aesthetics",
      "art-criticism"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "Proust estudió intensamente a Ruskin y tradujo al francés varias de sus obras."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-181-symbolism-eguren",
    "source": {
      "type": "movement",
      "id": "simbolismo",
      "label": "Simbolismo"
    },
    "target": {
      "type": "author",
      "id": "eguren",
      "label": "José María Eguren"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "symbolist-poetry",
      "imagery",
      "musicality"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Eguren constituye una de las expresiones más importantes del simbolismo poético peruano."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-182-verlaine-antonio-machado",
    "source": {
      "type": "author",
      "id": "verlaine",
      "label": "Paul Verlaine"
    },
    "target": {
      "type": "author",
      "id": "antonio-machado",
      "label": "Antonio Machado"
    },
    "relationType": "formative_reading",
    "mechanisms": [
      "symbolism",
      "modern-french-poetry",
      "early-formation"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "El descubrimiento de Verlaine durante las estancias parisinas de Machado fue importante en su formación poética."
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-004-183-tolstoy-rilke",
    "source": {
      "type": "author",
      "id": "tolstoy",
      "label": "Lev Tolstói"
    },
    "target": {
      "type": "author",
      "id": "rilke",
      "label": "Rainer Maria Rilke"
    },
    "relationType": "formative_reading",
    "mechanisms": [
      "russian-spirituality",
      "personal-encounter",
      "russian-journeys"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "Rilke viajó a Rusia, leyó intensamente su literatura y conoció personalmente a Tolstói."
      }
    ],
    "confidence": "high"
  },
  {
    "id": "v4-004-184-goethe-thomas-mann",
    "source": {
      "type": "author",
      "id": "goethe",
      "label": "Johann Wolfgang von Goethe"
    },
    "target": {
      "type": "author",
      "id": "thomas-mann",
      "label": "Thomas Mann"
    },
    "relationType": "literary_influence",
    "mechanisms": [
      "german-canon",
      "bildungsroman",
      "cultural-model"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Goethe constituye uno de los grandes precedentes literarios y culturales de Thomas Mann."
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-004-185-walser-kafka",
    "source": {
      "type": "author",
      "id": "walser",
      "label": "Robert Walser"
    },
    "target": {
      "type": "author",
      "id": "kafka",
      "label": "Franz Kafka"
    },
    "relationType": "formative_reading",
    "mechanisms": [
      "short-prose",
      "modernist-prose",
      "literary-admiration"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "Kafka conoció y admiró la obra de Robert Walser, cuya prosa forma parte de su horizonte de lectura."
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-004-186-buddhism-han-yong-un",
    "source": {
      "type": "religious_tradition",
      "id": "buddhism",
      "label": "Budismo"
    },
    "target": {
      "type": "author",
      "id": "han-yong-un",
      "label": "Han Yong-un"
    },
    "relationType": "textual_tradition",
    "mechanisms": [
      "zen-buddhism",
      "spiritual-poetry",
      "religious-thought"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "Han Yong-un fue monje budista y su pensamiento religioso atraviesa profundamente su producción literaria."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-187-cubism-apollinaire",
    "source": {
      "type": "movement",
      "id": "cubism",
      "label": "Cubismo"
    },
    "target": {
      "type": "author",
      "id": "apollinaire",
      "label": "Guillaume Apollinaire"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "visual-arts-network",
      "avant-garde",
      "calligram"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Apollinaire estuvo estrechamente ligado a los artistas cubistas y fue uno de sus principales mediadores críticos."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-188-hindi-urdu-realism-premchand",
    "source": {
      "type": "tradition",
      "id": "hindi-urdu-realism",
      "label": "Realismo hindi-urdu"
    },
    "target": {
      "type": "author",
      "id": "premchand",
      "label": "Premchand"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "social-realism",
      "village-life",
      "colonial-india"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Premchand es una figura fundacional del realismo social moderno en hindi y urdu."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-189-nietzsche-musil",
    "source": {
      "type": "author",
      "id": "friedrich-nietzsche",
      "label": "Friedrich Nietzsche"
    },
    "target": {
      "type": "author",
      "id": "musil",
      "label": "Robert Musil"
    },
    "relationType": "formative_reading",
    "mechanisms": [
      "modernity",
      "psychology",
      "philosophical-fiction"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Nietzsche pertenece al horizonte filosófico decisivo de la formación intelectual de Musil."
      }
    ],
    "confidence": "high"
  },
  {
    "id": "v4-004-190-ruben-dario-juan-ramon",
    "source": {
      "type": "author",
      "id": "ruben-dario",
      "label": "Rubén Darío"
    },
    "target": {
      "type": "author",
      "id": "juan-ramon-jimenez",
      "label": "Juan Ramón Jiménez"
    },
    "relationType": "literary_influence",
    "mechanisms": [
      "modernismo",
      "metrical-renewal",
      "lyric-modernity"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "Juan Ramón Jiménez recibió tempranamente la influencia del Modernismo y mantuvo relación directa con Rubén Darío."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-191-gogol-lu-xun",
    "source": {
      "type": "author",
      "id": "gogol",
      "label": "Nikolái Gógol"
    },
    "target": {
      "type": "author",
      "id": "lu-xun",
      "label": "Lu Xun"
    },
    "relationType": "literary_influence",
    "mechanisms": [
      "diary-of-a-madman",
      "satire",
      "modern-short-fiction"
    ],
    "evidence": [
      {
        "basis": "work_level_intertext",
        "note": "El relato Diario de un loco de Lu Xun dialoga explícitamente con el precedente homónimo de Gógol."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-192-modernism-woolf",
    "source": {
      "type": "movement",
      "id": "modernism",
      "label": "Modernismo internacional"
    },
    "target": {
      "type": "author",
      "id": "woolf",
      "label": "Virginia Woolf"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "stream-of-consciousness",
      "bloomsbury",
      "formal-experiment"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Virginia Woolf es una figura central del modernismo literario anglófono."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-193-imagism-pound",
    "source": {
      "type": "movement",
      "id": "imagism",
      "label": "Imagismo"
    },
    "target": {
      "type": "author",
      "id": "ezra-pound",
      "label": "Ezra Pound"
    },
    "relationType": "movement_foundation",
    "mechanisms": [
      "image",
      "economy",
      "free-verse"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Ezra Pound desempeñó un papel central en la formulación y difusión temprana del Imagismo."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-194-modernism-broch",
    "source": {
      "type": "movement",
      "id": "modernism",
      "label": "Modernismo internacional"
    },
    "target": {
      "type": "author",
      "id": "broch",
      "label": "Hermann Broch"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "modernist-novel",
      "polyphony",
      "crisis-of-values"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Broch pertenece al núcleo de la novela modernista centroeuropea."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-195-modernism-marianne-moore",
    "source": {
      "type": "movement",
      "id": "modernism",
      "label": "Modernismo internacional"
    },
    "target": {
      "type": "author",
      "id": "marianne-moore",
      "label": "Marianne Moore"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "precision",
      "syllabic-verse",
      "american-modernism"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Marianne Moore es una de las figuras mayores del modernismo poético estadounidense."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-196-french-modernism-saint-john-perse",
    "source": {
      "type": "movement",
      "id": "french-modernism",
      "label": "Modernidad poética francesa"
    },
    "target": {
      "type": "author",
      "id": "saint-john-perse",
      "label": "Saint-John Perse"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "long-poem",
      "modern-lyric",
      "exile"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Saint-John Perse ocupa una posición central en la poesía francesa moderna del siglo XX."
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-004-197-ibsen-oneill",
    "source": {
      "type": "author",
      "id": "ibsen",
      "label": "Henrik Ibsen"
    },
    "target": {
      "type": "author",
      "id": "eugene-oneill",
      "label": "Eugene O'Neill"
    },
    "relationType": "literary_influence",
    "mechanisms": [
      "modern-drama",
      "realism",
      "family-conflict"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Ibsen constituye uno de los grandes precedentes europeos de la dramaturgia moderna desarrollada por O'Neill."
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-004-198-portuguese-modernism-pessoa",
    "source": {
      "type": "movement",
      "id": "portuguese-modernism",
      "label": "Modernismo portugués"
    },
    "target": {
      "type": "author",
      "id": "pessoa",
      "label": "Fernando Pessoa"
    },
    "relationType": "movement_foundation",
    "mechanisms": [
      "heteronyms",
      "orpheu",
      "avant-garde"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Pessoa es una figura fundamental en la formación del modernismo portugués."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-199-acmeism-akhmatova",
    "source": {
      "type": "movement",
      "id": "acmeism",
      "label": "Acmeísmo"
    },
    "target": {
      "type": "author",
      "id": "akhmatova",
      "label": "Anna Ajmátova"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "clarity",
      "concreteness",
      "russian-modernism"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Ajmátova fue una de las figuras centrales del movimiento acmeísta ruso."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-200-postmodernismo-mistral",
    "source": {
      "type": "movement",
      "id": "postmodernismo-hispanoamericano",
      "label": "Postmodernismo hispanoamericano"
    },
    "target": {
      "type": "author",
      "id": "mistral",
      "label": "Gabriela Mistral"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "postmodernismo",
      "lyric-intimacy",
      "american-poetry"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Gabriela Mistral suele situarse dentro de la fase postmodernista posterior al gran Modernismo hispanoamericano."
      }
    ],
    "confidence": "very_high"
  }
];
