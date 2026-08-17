import type { AtlasMasterRelation } from "./relation-ontology";

/**
 * ATLAS UNIVERSAL DE LAS INFLUENCIAS
 * V4 · PAQUETE 006 · relaciones 251–300
 */

export const atlasRelationsV4006: AtlasMasterRelation[] = [
  {
    "id": "v4-006-251-cuban-lyric-loynaz",
    "source": {
      "type": "tradition",
      "id": "cuban-lyric-20c",
      "label": "Lírica cubana del siglo XX"
    },
    "target": {
      "type": "author",
      "id": "dulce-maria-loynaz",
      "label": "Dulce María Loynaz"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "cuban-poetry",
      "intimate-lyric",
      "twentieth-century"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Dulce María Loynaz ocupa una posición canónica en la lírica cubana del siglo XX."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-252-partition-manto",
    "source": {
      "type": "historical_event",
      "id": "partition-india-1947",
      "label": "Partición de India de 1947"
    },
    "target": {
      "type": "author",
      "id": "saadat-hasan-manto",
      "label": "Saadat Hasan Manto"
    },
    "relationType": "lived_historical_experience",
    "mechanisms": [
      "partition",
      "displacement",
      "communal-violence",
      "short-fiction"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La Partición de 1947 y su violencia se convirtieron en materia central de numerosos relatos de Manto.",
        "sourceUrl": "https://www.newyorker.com/magazine/2023/01/02/seventy-five-years-after-indian-partition-who-owns-the-narrative-saadat-hasan-manto-geetanjali-shree-tomb-of-sand"
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-253-negritude-cesaire",
    "source": {
      "type": "movement",
      "id": "negritude",
      "label": "Négritude"
    },
    "target": {
      "type": "author",
      "id": "cesaire",
      "label": "Aimé Césaire"
    },
    "relationType": "movement_foundation",
    "mechanisms": [
      "black-consciousness",
      "anti-colonialism",
      "francophone-poetry"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Césaire fue una de las figuras fundadoras y teóricas fundamentales de la Négritude.",
        "sourceUrl": "https://poets.org/poet/aime-cesaire"
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-254-czech-postwar-hrabal",
    "source": {
      "type": "movement",
      "id": "czech-postwar-literature",
      "label": "Literatura checa de posguerra"
    },
    "target": {
      "type": "author",
      "id": "bohumil-hrabal",
      "label": "Bohumil Hrabal"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "postwar-prose",
      "oral-voice",
      "czech-literature"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Hrabal constituye una de las figuras centrales de la prosa checa de posguerra."
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-006-255-boom-cortazar",
    "source": {
      "type": "movement",
      "id": "latin-american-boom",
      "label": "Boom latinoamericano"
    },
    "target": {
      "type": "author",
      "id": "cortazar",
      "label": "Julio Cortázar"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "formal-experiment",
      "fantastic-fiction",
      "transnational-circulation"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Cortázar pertenece al núcleo canónico del Boom latinoamericano."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-256-parra-antipoetry",
    "source": {
      "type": "author",
      "id": "parra",
      "label": "Nicanor Parra"
    },
    "target": {
      "type": "concept",
      "id": "antipoetry",
      "label": "Antipoesía"
    },
    "relationType": "conceptual_creation",
    "mechanisms": [
      "colloquial-language",
      "anti-lyric",
      "irony",
      "everyday-speech"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Parra convirtió la antipoesía en un programa poético reconocible y radicalmente crítico de la lírica tradicional.",
        "sourceUrl": "https://www.ebsco.com/research-starters/biography/nicanor-parra"
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-257-surrealism-paz",
    "source": {
      "type": "movement",
      "id": "surrealism",
      "label": "Surrealismo"
    },
    "target": {
      "type": "author",
      "id": "paz",
      "label": "Octavio Paz"
    },
    "relationType": "critical_affinity",
    "mechanisms": [
      "surrealist-network",
      "poetic-freedom",
      "modernity"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "Paz mantuvo un diálogo intenso con el surrealismo y con sus círculos intelectuales franceses."
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-006-258-korean-war-hwang-sun-won",
    "source": {
      "type": "historical_event",
      "id": "korean-war",
      "label": "Guerra de Corea"
    },
    "target": {
      "type": "author",
      "id": "hwang-sun-won",
      "label": "Hwang Sun-won"
    },
    "relationType": "historical_context",
    "mechanisms": [
      "war",
      "division",
      "displacement",
      "korean-fiction"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "La guerra y la división de Corea constituyen un contexto histórico fundamental de la ficción de Hwang Sun-won."
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-006-259-progressive-writers-chughtai",
    "source": {
      "type": "movement",
      "id": "progressive-writers-association",
      "label": "Progressive Writers' Association"
    },
    "target": {
      "type": "author",
      "id": "ismat-chughtai",
      "label": "Ismat Chughtai"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "progressive-writing",
      "gender",
      "urdu-fiction",
      "social-realism"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Ismat Chughtai estuvo vinculada al movimiento de escritores progresistas en lengua urdu."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-260-australian-modern-poetry-wright",
    "source": {
      "type": "tradition",
      "id": "australian-modern-poetry",
      "label": "Poesía australiana moderna"
    },
    "target": {
      "type": "author",
      "id": "judith-wright",
      "label": "Judith Wright"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "landscape",
      "ecology",
      "australian-history"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Judith Wright es una figura central de la poesía australiana moderna."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-261-paraguayan-dictatorship-roa-bastos",
    "source": {
      "type": "historical_event",
      "id": "paraguayan-dictatorship",
      "label": "Dictadura paraguaya del siglo XX"
    },
    "target": {
      "type": "author",
      "id": "roa-bastos",
      "label": "Augusto Roa Bastos"
    },
    "relationType": "historical_context",
    "mechanisms": [
      "authoritarianism",
      "exile",
      "memory",
      "power"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "Dictadura, exilio y memoria política paraguaya constituyen ejes fundamentales en la trayectoria de Roa Bastos."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-262-partition-amrita-pritam",
    "source": {
      "type": "historical_event",
      "id": "partition-india-1947",
      "label": "Partición de India de 1947"
    },
    "target": {
      "type": "author",
      "id": "amrita-pritam",
      "label": "Amrita Pritam"
    },
    "relationType": "lived_historical_experience",
    "mechanisms": [
      "partition",
      "punjab",
      "migration",
      "trauma"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La Partición transformó directamente la vida de Amrita Pritam y se convirtió en materia central de su escritura."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-263-yoruba-oral-tutuola",
    "source": {
      "type": "oral_tradition",
      "id": "yoruba-oral-tradition",
      "label": "Tradición oral yoruba"
    },
    "target": {
      "type": "author",
      "id": "amos-tutuola",
      "label": "Amos Tutuola"
    },
    "relationType": "oral_tradition",
    "mechanisms": [
      "folktale",
      "oral-storytelling",
      "myth",
      "vernacular-transformation"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Tutuola transforma materiales y procedimientos procedentes de tradiciones narrativas orales yoruba."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-264-brazilian-modern-prose-lispector",
    "source": {
      "type": "tradition",
      "id": "brazilian-modern-prose",
      "label": "Prosa brasileña moderna"
    },
    "target": {
      "type": "author",
      "id": "lispector",
      "label": "Clarice Lispector"
    },
    "relationType": "formal_reinvention",
    "mechanisms": [
      "interiority",
      "language",
      "modern-prose",
      "subjectivity"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Lispector constituye una de las grandes transformadoras de la prosa brasileña moderna."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-265-generation45-vilarino",
    "source": {
      "type": "movement",
      "id": "generation-45-uruguay",
      "label": "Generación del 45 uruguaya"
    },
    "target": {
      "type": "author",
      "id": "idea-vilarino",
      "label": "Idea Vilariño"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "uruguayan-literature",
      "criticism",
      "lyric-poetry"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Idea Vilariño pertenece al núcleo histórico de la Generación del 45 uruguaya."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-266-generation45-joao-cabral",
    "source": {
      "type": "movement",
      "id": "generation-45-brazil",
      "label": "Generación del 45 brasileña"
    },
    "target": {
      "type": "author",
      "id": "joao-cabral",
      "label": "João Cabral de Melo Neto"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "formal-rigor",
      "anti-rhetoric",
      "brazilian-poetry"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "João Cabral suele situarse dentro de la denominada Generación brasileña de 1945."
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-006-267-nigerian-urban-ekwensi",
    "source": {
      "type": "tradition",
      "id": "nigerian-urban-literature",
      "label": "Literatura urbana nigeriana"
    },
    "target": {
      "type": "author",
      "id": "cyprian-ekwensi",
      "label": "Cyprian Ekwensi"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "city",
      "popular-fiction",
      "modern-nigeria"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Ekwensi fue una figura pionera en la representación literaria de la vida urbana nigeriana."
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-006-268-generation50-sologuren",
    "source": {
      "type": "movement",
      "id": "generation-50-peru",
      "label": "Generación del 50 peruana"
    },
    "target": {
      "type": "author",
      "id": "sologuren",
      "label": "Javier Sologuren"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "peruvian-poetry",
      "translation",
      "formal-refinement"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Sologuren forma parte de la generación poética peruana de mediados del siglo XX."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-269-world-war-two-rozewicz",
    "source": {
      "type": "historical_event",
      "id": "world-war-two",
      "label": "Segunda Guerra Mundial"
    },
    "target": {
      "type": "author",
      "id": "tadeusz-rozewicz",
      "label": "Tadeusz Różewicz"
    },
    "relationType": "lived_historical_experience",
    "mechanisms": [
      "war",
      "holocaust-aftermath",
      "anti-poetry",
      "ethical-crisis"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La experiencia de la Segunda Guerra Mundial transformó radicalmente la poética de Różewicz."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-270-apartheid-gordimer",
    "source": {
      "type": "historical_event",
      "id": "apartheid",
      "label": "Apartheid"
    },
    "target": {
      "type": "author",
      "id": "nadine-gordimer",
      "label": "Nadine Gordimer"
    },
    "relationType": "lived_historical_experience",
    "mechanisms": [
      "racial-segregation",
      "politics",
      "censorship",
      "resistance"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "El apartheid fue un contexto central de la vida pública y de la obra narrativa de Gordimer.",
        "sourceUrl": "https://www.nobelprize.org/prizes/literature/1991/gordimer/facts/"
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-271-caribbean-migration-selvon",
    "source": {
      "type": "historical_event",
      "id": "caribbean-migration-britain",
      "label": "Migración caribeña a Gran Bretaña"
    },
    "target": {
      "type": "author",
      "id": "samuel-selvon",
      "label": "Samuel Selvon"
    },
    "relationType": "lived_historical_experience",
    "mechanisms": [
      "migration",
      "london",
      "caribbean-diaspora",
      "creole-voice"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La migración caribeña hacia Gran Bretaña constituye el contexto humano y lingüístico fundamental de buena parte de la obra de Selvon."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-272-polish-postwar-szymborska",
    "source": {
      "type": "tradition",
      "id": "polish-postwar-poetry",
      "label": "Poesía polaca de posguerra"
    },
    "target": {
      "type": "author",
      "id": "szymborska",
      "label": "Wisława Szymborska"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "postwar-poetry",
      "irony",
      "history",
      "philosophical-lyric"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Szymborska constituye una figura central de la poesía polaca de posguerra."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-273-apartheid-dennis-brutus",
    "source": {
      "type": "historical_event",
      "id": "apartheid",
      "label": "Apartheid"
    },
    "target": {
      "type": "author",
      "id": "dennis-brutus",
      "label": "Dennis Brutus"
    },
    "relationType": "political_dissidence",
    "mechanisms": [
      "anti-apartheid",
      "prison",
      "exile",
      "political-poetry"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La oposición al apartheid determinó la militancia, encarcelamiento, exilio y poesía de Dennis Brutus."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-274-new-zealand-frame",
    "source": {
      "type": "tradition",
      "id": "new-zealand-modern-literature",
      "label": "Literatura moderna de Nueva Zelanda"
    },
    "target": {
      "type": "author",
      "id": "janet-frame",
      "label": "Janet Frame"
    },
    "relationType": "formal_reinvention",
    "mechanisms": [
      "modern-fiction",
      "subjectivity",
      "language",
      "new-zealand"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Janet Frame es una de las figuras fundamentales de la literatura moderna de Nueva Zelanda."
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-006-275-japanese-postwar-abe",
    "source": {
      "type": "movement",
      "id": "japanese-postwar-avant-garde",
      "label": "Vanguardia japonesa de posguerra"
    },
    "target": {
      "type": "author",
      "id": "abe-kobo",
      "label": "Kōbō Abe"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "avant-garde",
      "alienation",
      "experimental-fiction",
      "theatre"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Kōbō Abe ocupa una posición central en la literatura experimental y vanguardista japonesa de posguerra."
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-006-276-indian-english-poetry-ezekiel",
    "source": {
      "type": "tradition",
      "id": "indian-english-poetry",
      "label": "Poesía india en inglés"
    },
    "target": {
      "type": "author",
      "id": "nissim-ezekiel",
      "label": "Nissim Ezekiel"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "indian-english",
      "urban-modernity",
      "modern-poetry"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Nissim Ezekiel es una figura fundamental en la consolidación de la poesía india moderna en lengua inglesa."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-277-polish-postwar-herbert",
    "source": {
      "type": "tradition",
      "id": "polish-postwar-poetry",
      "label": "Poesía polaca de posguerra"
    },
    "target": {
      "type": "author",
      "id": "zbigniew-herbert",
      "label": "Zbigniew Herbert"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "postwar-poetry",
      "ethical-witness",
      "classical-reference"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Herbert constituye una figura central de la poesía polaca de posguerra y su obra fue marcada por las experiencias de los totalitarismos nazi y soviético."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-278-nima-yushij-shamlu",
    "source": {
      "type": "author",
      "id": "nima-yushij",
      "label": "Nima Yushij"
    },
    "target": {
      "type": "author",
      "id": "ahmad-shamlu",
      "label": "Ahmad Shamlou"
    },
    "relationType": "formal_inheritance",
    "mechanisms": [
      "modern-persian-poetry",
      "free-verse",
      "metrical-renewal"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Shamlou desarrolló su renovación poética sobre el terreno abierto previamente por Nima Yushij."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-279-japanese-postwar-mishima",
    "source": {
      "type": "tradition",
      "id": "japanese-postwar-literature",
      "label": "Literatura japonesa de posguerra"
    },
    "target": {
      "type": "author",
      "id": "mishima",
      "label": "Yukio Mishima"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "postwar-japan",
      "identity",
      "body",
      "tradition-modernity"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Mishima pertenece a la generación literaria japonesa cuya obra se desarrolla en el contexto cultural y político de la posguerra."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-280-paz-varela",
    "source": {
      "type": "author",
      "id": "paz",
      "label": "Octavio Paz"
    },
    "target": {
      "type": "author",
      "id": "blanca-varela",
      "label": "Blanca Varela"
    },
    "relationType": "mentorship",
    "mechanisms": [
      "literary-network",
      "editorial-support",
      "surrealist-circles",
      "paris"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "Octavio Paz introdujo a Blanca Varela en importantes círculos intelectuales parisinos e impulsó la publicación de su primer libro."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-281-adivasi-mahasweta",
    "source": {
      "type": "community",
      "id": "adivasi-communities",
      "label": "Comunidades adivasi"
    },
    "target": {
      "type": "author",
      "id": "mahasweta-devi",
      "label": "Mahasweta Devi"
    },
    "relationType": "field_experience",
    "mechanisms": [
      "activism",
      "indigenous-rights",
      "fieldwork",
      "social-fiction"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "El trabajo directo de Mahasweta Devi con comunidades adivasi transformó profundamente tanto su activismo como su literatura."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-282-korean-postwar-park-kyung-ni",
    "source": {
      "type": "tradition",
      "id": "korean-postwar-novel",
      "label": "Novela coreana de posguerra"
    },
    "target": {
      "type": "author",
      "id": "park-kyung-ni",
      "label": "Park Kyung-ni"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "korean-history",
      "family-saga",
      "colonialism",
      "modernization"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Park Kyung-ni es una de las grandes figuras de la novela coreana de posguerra y de la narración histórica moderna."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-283-francophone-africa-kourouma",
    "source": {
      "type": "tradition",
      "id": "francophone-african-postcolonial-literature",
      "label": "Literatura africana francófona poscolonial"
    },
    "target": {
      "type": "author",
      "id": "ahmadou-kourouma",
      "label": "Ahmadou Kourouma"
    },
    "relationType": "language_transformation",
    "mechanisms": [
      "malinke",
      "french",
      "postcolonial-language",
      "oral-structure"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Kourouma transformó el francés literario mediante estructuras lingüísticas y culturales vinculadas al malinké."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-284-negritude-david-diop",
    "source": {
      "type": "movement",
      "id": "negritude",
      "label": "Négritude"
    },
    "target": {
      "type": "author",
      "id": "david-diop",
      "label": "David Diop"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "anti-colonialism",
      "black-consciousness",
      "francophone-poetry"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "David Diop pertenece a la constelación poética y política de la Négritude y de la poesía anticolonial francófona."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-285-caribbean-decolonization-lamming",
    "source": {
      "type": "movement",
      "id": "caribbean-decolonization",
      "label": "Descolonización literaria del Caribe"
    },
    "target": {
      "type": "author",
      "id": "george-lamming",
      "label": "George Lamming"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "colonialism",
      "caribbean-identity",
      "migration",
      "decolonization"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "La obra de George Lamming constituye una intervención central en la literatura caribeña de descolonización."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-286-partition-qurratulain-hyder",
    "source": {
      "type": "historical_event",
      "id": "partition-india-1947",
      "label": "Partición de India de 1947"
    },
    "target": {
      "type": "author",
      "id": "qurratulain-hyder",
      "label": "Qurratulain Hyder"
    },
    "relationType": "historical_context",
    "mechanisms": [
      "partition",
      "migration",
      "historical-memory",
      "urdu-fiction"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La Partición y sus desplazamientos históricos constituyen un contexto decisivo de la vida y la narrativa de Qurratulain Hyder."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-287-multilingual-ramanujan",
    "source": {
      "type": "tradition",
      "id": "south-asian-multilingual-literature",
      "label": "Literatura multilingüe del sur de Asia"
    },
    "target": {
      "type": "author",
      "id": "ak-ramanujan",
      "label": "A. K. Ramanujan"
    },
    "relationType": "multilingual_formation",
    "mechanisms": [
      "kannada",
      "tamil",
      "english",
      "translation",
      "folklore"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La escritura y el trabajo intelectual de Ramanujan se construyen sobre una formación multilingüe y una intensa práctica de traducción entre tradiciones del sur de Asia e inglés."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-288-holocaust-kertesz",
    "source": {
      "type": "historical_event",
      "id": "holocaust",
      "label": "Holocausto"
    },
    "target": {
      "type": "author",
      "id": "imre-kertesz",
      "label": "Imre Kertész"
    },
    "relationType": "lived_historical_experience",
    "mechanisms": [
      "auschwitz",
      "buchenwald",
      "memory",
      "totalitarianism"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La deportación de Kertész a Auschwitz y Buchenwald constituye la experiencia histórica fundamental de gran parte de su obra."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-289-generation50-valente",
    "source": {
      "type": "movement",
      "id": "generation-50-spain",
      "label": "Generación del 50 española"
    },
    "target": {
      "type": "author",
      "id": "valente",
      "label": "José Ángel Valente"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "postwar-spain",
      "poetic-language",
      "later-mysticism"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "José Ángel Valente suele situarse dentro de la denominada Generación española del 50."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-290-algerian-war-kateb-yacine",
    "source": {
      "type": "historical_event",
      "id": "algerian-war-independence",
      "label": "Guerra de Independencia de Argelia"
    },
    "target": {
      "type": "author",
      "id": "kateb-yacine",
      "label": "Kateb Yacine"
    },
    "relationType": "historical_context",
    "mechanisms": [
      "colonialism",
      "algerian-nationalism",
      "language",
      "decolonization"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "Colonialismo, nacionalismo argelino y lucha por la independencia atraviesan la trayectoria vital y literaria de Kateb Yacine."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-291-african-feminism-mariama-ba",
    "source": {
      "type": "tradition",
      "id": "african-feminist-literature",
      "label": "Literatura feminista africana"
    },
    "target": {
      "type": "author",
      "id": "mariama-ba",
      "label": "Mariama Bâ"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "women",
      "marriage",
      "education",
      "postcolonial-society"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Mariama Bâ es una figura fundamental de la literatura africana moderna centrada en la experiencia y emancipación de las mujeres."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-292-prague-spring-kundera",
    "source": {
      "type": "historical_event",
      "id": "prague-spring-1968",
      "label": "Primavera de Praga de 1968"
    },
    "target": {
      "type": "author",
      "id": "milan-kundera",
      "label": "Milan Kundera"
    },
    "relationType": "lived_historical_experience",
    "mechanisms": [
      "communism",
      "prague-spring",
      "censorship",
      "exile"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La Primavera de Praga, su represión y el posterior exilio constituyen elementos decisivos de la trayectoria de Kundera."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-293-modern-arabic-poetry-adonis",
    "source": {
      "type": "movement",
      "id": "modern-arabic-poetry",
      "label": "Poesía árabe moderna"
    },
    "target": {
      "type": "author",
      "id": "adonis",
      "label": "Adonis"
    },
    "relationType": "formal_reinvention",
    "mechanisms": [
      "free-verse",
      "arabic-modernism",
      "myth",
      "classical-revision"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Adonis es una de las figuras decisivas de la transformación modernista de la poesía árabe contemporánea."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-294-argentine-dictatorship-gelman",
    "source": {
      "type": "historical_event",
      "id": "argentine-dictatorship-1976",
      "label": "Dictadura argentina de 1976–1983"
    },
    "target": {
      "type": "author",
      "id": "gelman",
      "label": "Juan Gelman"
    },
    "relationType": "lived_historical_experience",
    "mechanisms": [
      "dictatorship",
      "disappearance",
      "exile",
      "memory"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La dictadura argentina, el asesinato y desaparición de familiares y el exilio atravesaron directamente la vida y la obra de Juan Gelman."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-295-nation-language-brathwaite",
    "source": {
      "type": "tradition",
      "id": "caribbean-nation-language",
      "label": "Nation Language caribeño"
    },
    "target": {
      "type": "author",
      "id": "kamau-brathwaite",
      "label": "Kamau Brathwaite"
    },
    "relationType": "conceptual_creation",
    "mechanisms": [
      "nation-language",
      "oral-rhythm",
      "caribbean-history",
      "creole"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Brathwaite desarrolló la noción de Nation Language para describir y reivindicar formas lingüísticas y rítmicas caribeñas."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-296-canadian-short-story-munro",
    "source": {
      "type": "tradition",
      "id": "canadian-short-story",
      "label": "Cuento canadiense moderno"
    },
    "target": {
      "type": "author",
      "id": "alice-munro",
      "label": "Alice Munro"
    },
    "relationType": "formal_reinvention",
    "mechanisms": [
      "short-story",
      "time",
      "memory",
      "ordinary-life"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Alice Munro transformó profundamente las posibilidades formales del cuento moderno canadiense e internacional."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-297-spanish-postwar-gamoneda",
    "source": {
      "type": "tradition",
      "id": "spanish-postwar-poetry",
      "label": "Poesía española de posguerra"
    },
    "target": {
      "type": "author",
      "id": "gamoneda",
      "label": "Antonio Gamoneda"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "postwar-memory",
      "poverty",
      "language",
      "memory"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "La obra de Gamoneda se desarrolla desde la experiencia histórica y social de la España de posguerra."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-298-swedish-postwar-transtromer",
    "source": {
      "type": "tradition",
      "id": "swedish-postwar-poetry",
      "label": "Poesía sueca de posguerra"
    },
    "target": {
      "type": "author",
      "id": "transtromer",
      "label": "Tomas Tranströmer"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "image",
      "psychology",
      "landscape",
      "modern-lyric"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Tranströmer constituye una de las figuras centrales de la poesía sueca de la segunda mitad del siglo XX."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-299-apartheid-fugard",
    "source": {
      "type": "historical_event",
      "id": "apartheid",
      "label": "Apartheid"
    },
    "target": {
      "type": "author",
      "id": "athol-fugard",
      "label": "Athol Fugard"
    },
    "relationType": "historical_context",
    "mechanisms": [
      "racial-segregation",
      "theatre",
      "censorship",
      "resistance"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "El apartheid constituye el contexto político y moral central de buena parte del teatro de Athol Fugard."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-006-300-african-modernism-okigbo",
    "source": {
      "type": "movement",
      "id": "african-modernist-poetry",
      "label": "Poesía modernista africana"
    },
    "target": {
      "type": "author",
      "id": "christopher-okigbo",
      "label": "Christopher Okigbo"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "modernism",
      "igbo-cosmology",
      "classical-reference",
      "postcolonial-poetry"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Christopher Okigbo es una figura fundamental del modernismo poético africano de mediados del siglo XX."
      }
    ],
    "confidence": "maximum"
  }
];
