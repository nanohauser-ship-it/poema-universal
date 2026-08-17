import type { AtlasMasterRelation } from "./relation-ontology";

export const atlasRelationsV4005A: AtlasMasterRelation[] = [
  {
    "id": "v4-005-201-mayakovsky-pasternak",
    "source": {
      "type": "author",
      "id": "mayakovsky",
      "label": "Vladímir Mayakovski"
    },
    "target": {
      "type": "author",
      "id": "pasternak",
      "label": "Borís Pasternak"
    },
    "relationType": "literary_influence",
    "mechanisms": [
      "russian-futurism",
      "poetic-formation",
      "contemporary-model"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "Pasternak entró en contacto con el entorno futurista de Centrifuge y recibió una influencia importante de Mayakovski.",
        "sourceUrl": "https://www.ebsco.com/research-starters/history/boris-pasternak"
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-005-202-gogol-bulgakov",
    "source": {
      "type": "author",
      "id": "gogol",
      "label": "Nikolái Gógol"
    },
    "target": {
      "type": "author",
      "id": "bulgakov",
      "label": "Mijaíl Bulgákov"
    },
    "relationType": "literary_influence",
    "mechanisms": [
      "satire",
      "grotesque",
      "demonic-imagination",
      "russian-prose"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Gógol fue una referencia sostenida para Bulgákov, quien además adaptó y trabajó directamente con su obra.",
        "sourceUrl": "https://www.cambridge.org/core/books/bulgakovs-last-decade/pushkin-and-gogol-bulgakovs-russian-masters/054CC2867A6CBBAA618C16A1456E956C"
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-005-203-argentine-avant-garde-girondo",
    "source": {
      "type": "movement",
      "id": "argentine-avant-garde",
      "label": "Vanguardia argentina"
    },
    "target": {
      "type": "author",
      "id": "girondo",
      "label": "Oliverio Girondo"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "avant-garde",
      "martin-fierro",
      "urban-poetics",
      "formal-experiment"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Girondo fue una figura importante de la vanguardia argentina y del entorno de Martín Fierro.",
        "sourceUrl": "https://www.ebsco.com/research-starters/history/oliverio-girondo"
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-005-204-acmeism-mandelstam",
    "source": {
      "type": "movement",
      "id": "acmeism",
      "label": "Acmeísmo"
    },
    "target": {
      "type": "author",
      "id": "mandelstam",
      "label": "Ósip Mandelstam"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "clarity",
      "materiality-of-language",
      "anti-symbolism"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Mandelstam abandonó el simbolismo y se integró en el movimiento acmeísta.",
        "sourceUrl": "https://www.poetryfoundation.org/articles/156185/yesterday-never-existed"
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-005-205-postmodernismo-storni",
    "source": {
      "type": "movement",
      "id": "postmodernismo-hispanoamericano",
      "label": "Postmodernismo hispanoamericano"
    },
    "target": {
      "type": "author",
      "id": "alfonsina-storni",
      "label": "Alfonsina Storni"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "lyric-modernity",
      "gender",
      "post-modernismo"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "La obra de Storni suele situarse en la transformación posterior al gran Modernismo hispanoamericano."
      }
    ],
    "confidence": "high"
  },
  {
    "id": "v4-005-206-polish-modernism-schulz",
    "source": {
      "type": "movement",
      "id": "polish-modernism",
      "label": "Modernismo polaco"
    },
    "target": {
      "type": "author",
      "id": "bruno-schulz",
      "label": "Bruno Schulz"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "mythic-prose",
      "jewish-modernity",
      "fantastic-transformation"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Schulz constituye una figura singular y fundamental de la modernidad literaria polaca y judía.",
        "sourceUrl": "https://www.ebsco.com/research-starters/history/bruno-schulz"
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-005-207-latin-american-avant-garde-vallejo",
    "source": {
      "type": "movement",
      "id": "latin-american-avant-garde",
      "label": "Vanguardia latinoamericana"
    },
    "target": {
      "type": "author",
      "id": "vallejo",
      "label": "César Vallejo"
    },
    "relationType": "formal_reinvention",
    "mechanisms": [
      "trilce",
      "syntax",
      "lexical-experiment",
      "avant-garde"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Vallejo constituye una de las figuras fundamentales de la vanguardia poética latinoamericana.",
        "sourceUrl": "https://www.poetryfoundation.org/articles/1659492/born-on-a-day-when-god-was-ill"
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-005-208-bosnia-andric",
    "source": {
      "type": "place",
      "id": "bosnia",
      "label": "Bosnia"
    },
    "target": {
      "type": "author",
      "id": "ivo-andric",
      "label": "Ivo Andrić"
    },
    "relationType": "shared_historical_space",
    "mechanisms": [
      "ottoman-bosnia",
      "historical-memory",
      "multiethnic-society"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La historia y la vida de Bosnia proporcionan una parte central de la materia narrativa de Andrić.",
        "sourceUrl": "https://www.nobelprize.org/prizes/literature/1961/andric/biographical/"
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-005-209-russian-revolution-tsvetaeva",
    "source": {
      "type": "historical_event",
      "id": "russian-revolution-1917",
      "label": "Revolución rusa de 1917"
    },
    "target": {
      "type": "author",
      "id": "tsvetaeva",
      "label": "Marina Tsvetáieva"
    },
    "relationType": "historical_context",
    "mechanisms": [
      "revolution",
      "civil-war",
      "famine",
      "exile"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La Revolución rusa, la guerra civil y sus consecuencias atravesaron directamente la vida y la escritura de Tsvetáieva."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-005-210-soseki-akutagawa",
    "source": {
      "type": "author",
      "id": "soseki",
      "label": "Natsume Sōseki"
    },
    "target": {
      "type": "author",
      "id": "akutagawa",
      "label": "Ryūnosuke Akutagawa"
    },
    "relationType": "mentorship",
    "mechanisms": [
      "literary-recognition",
      "personal-contact",
      "modern-japanese-literature"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "Sōseki reconoció tempranamente el talento de Akutagawa, quien lo consideraba una figura de mentor.",
        "sourceUrl": "https://www.ishibashi-bunka.jp/kcam/exhibition_en/20231028-2/"
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-005-211-generation27-guillen",
    "source": {
      "type": "movement",
      "id": "generation-27",
      "label": "Generación del 27"
    },
    "target": {
      "type": "author",
      "id": "guillen",
      "label": "Jorge Guillén"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "spanish-modern-poetry",
      "generation-27",
      "pure-poetry"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Jorge Guillén pertenece al núcleo histórico de la Generación del 27."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-005-212-creacionismo-huidobro",
    "source": {
      "type": "movement",
      "id": "creacionismo",
      "label": "Creacionismo"
    },
    "target": {
      "type": "author",
      "id": "huidobro",
      "label": "Vicente Huidobro"
    },
    "relationType": "movement_foundation",
    "mechanisms": [
      "poetic-creation",
      "avant-garde",
      "autonomous-poem"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Huidobro formuló y desarrolló el Creacionismo como programa poético de vanguardia.",
        "sourceUrl": "https://www.ebsco.com/research-starters/history/vicente-huidobro"
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-005-213-modernism-cummings",
    "source": {
      "type": "movement",
      "id": "modernism",
      "label": "Modernismo internacional"
    },
    "target": {
      "type": "author",
      "id": "ee-cummings",
      "label": "E. E. Cummings"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "typography",
      "syntax",
      "visual-form",
      "american-modernism"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "E. E. Cummings ocupa una posición característica en la experimentación poética modernista estadounidense."
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-005-214-surrealism-eluard",
    "source": {
      "type": "movement",
      "id": "surrealism",
      "label": "Surrealismo"
    },
    "target": {
      "type": "author",
      "id": "eluard",
      "label": "Paul Éluard"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "surrealist-poetry",
      "automatic-association",
      "avant-garde-network"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Paul Éluard fue una de las figuras centrales del movimiento surrealista francés."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-005-215-surrealism-breton",
    "source": {
      "type": "movement",
      "id": "surrealism",
      "label": "Surrealismo"
    },
    "target": {
      "type": "author",
      "id": "breton",
      "label": "André Breton"
    },
    "relationType": "movement_foundation",
    "mechanisms": [
      "manifesto",
      "automatic-writing",
      "avant-garde",
      "movement-theory"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "André Breton desempeñó un papel central en la formulación programática y organización del Surrealismo."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-005-216-hermeticism-montale",
    "source": {
      "type": "movement",
      "id": "italian-hermeticism",
      "label": "Hermetismo italiano"
    },
    "target": {
      "type": "author",
      "id": "montale",
      "label": "Eugenio Montale"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "hermetic-poetry",
      "symbolist-inheritance",
      "modern-italian-poetry"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Montale suele ser situado entre las figuras fundacionales o centrales de la poesía hermética italiana.",
        "sourceUrl": "https://www.poetryfoundation.org/poets/eugenio-montale"
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-005-217-surrealism-aragon",
    "source": {
      "type": "movement",
      "id": "surrealism",
      "label": "Surrealismo"
    },
    "target": {
      "type": "author",
      "id": "aragon",
      "label": "Louis Aragon"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "surrealist-prose",
      "poetry",
      "avant-garde-network"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Louis Aragon participó en el núcleo inicial del movimiento surrealista."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-005-218-generation27-aleixandre",
    "source": {
      "type": "movement",
      "id": "generation-27",
      "label": "Generación del 27"
    },
    "target": {
      "type": "author",
      "id": "aleixandre",
      "label": "Vicente Aleixandre"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "generation-27",
      "surrealist-phase",
      "spanish-modern-poetry"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Vicente Aleixandre es una de las figuras canónicas de la Generación del 27."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-005-219-lost-generation-hemingway",
    "source": {
      "type": "movement",
      "id": "lost-generation",
      "label": "Generación Perdida"
    },
    "target": {
      "type": "author",
      "id": "hemingway",
      "label": "Ernest Hemingway"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "expatriate-writing",
      "postwar-generation",
      "modern-prose"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Hemingway forma parte del núcleo de escritores habitualmente asociado a la Generación Perdida."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-005-220-surrealism-desnos",
    "source": {
      "type": "movement",
      "id": "surrealism",
      "label": "Surrealismo"
    },
    "target": {
      "type": "author",
      "id": "desnos",
      "label": "Robert Desnos"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "automatic-writing",
      "dream",
      "surrealist-poetry"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Robert Desnos participó activamente en el movimiento surrealista, especialmente en sus primeras etapas."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-005-221-hermeticism-quasimodo",
    "source": {
      "type": "movement",
      "id": "italian-hermeticism",
      "label": "Hermetismo italiano"
    },
    "target": {
      "type": "author",
      "id": "quasimodo",
      "label": "Salvatore Quasimodo"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "hermetic-poetry",
      "compressed-lyric",
      "modern-italian-poetry"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Quasimodo es una de las figuras asociadas de manera más directa al Hermetismo italiano."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-005-222-brazilian-modernism-drummond",
    "source": {
      "type": "movement",
      "id": "brazilian-modernism",
      "label": "Modernismo brasileño"
    },
    "target": {
      "type": "author",
      "id": "drummond",
      "label": "Carlos Drummond de Andrade"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "modernismo-brasileiro",
      "colloquial-language",
      "urban-modernity"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Drummond pertenece a la gran renovación de la poesía brasileña vinculada al Modernismo."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-005-223-great-depression-steinbeck",
    "source": {
      "type": "historical_event",
      "id": "great-depression",
      "label": "Gran Depresión"
    },
    "target": {
      "type": "author",
      "id": "steinbeck",
      "label": "John Steinbeck"
    },
    "relationType": "historical_context",
    "mechanisms": [
      "economic-crisis",
      "migration",
      "labor",
      "social-fiction"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "La Gran Depresión y sus desplazamientos sociales constituyen el contexto histórico central de varias de las principales obras de Steinbeck."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-005-224-korean-folk-song-kim-sowol",
    "source": {
      "type": "tradition",
      "id": "korean-folk-song",
      "label": "Tradición de canción popular coreana"
    },
    "target": {
      "type": "author",
      "id": "kim-sowol",
      "label": "Kim Sowol"
    },
    "relationType": "formal_inheritance",
    "mechanisms": [
      "folk-song",
      "rhythm",
      "oral-musicality",
      "korean-lyric"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La poesía de Kim Sowol adopta deliberadamente cadencias y formas vinculadas a la canción popular coreana."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-005-225-generation27-cernuda",
    "source": {
      "type": "movement",
      "id": "generation-27",
      "label": "Generación del 27"
    },
    "target": {
      "type": "author",
      "id": "cernuda",
      "label": "Luis Cernuda"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "generation-27",
      "desire",
      "exile",
      "modern-spanish-poetry"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Luis Cernuda pertenece al núcleo histórico y literario de la Generación del 27."
      }
    ],
    "confidence": "maximum"
  }
];
