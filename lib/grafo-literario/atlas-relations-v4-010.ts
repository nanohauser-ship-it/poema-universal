import type { AtlasMasterRelation } from "./relation-ontology";

/**
 * ATLAS UNIVERSAL DE LAS INFLUENCIAS
 * V4 · PAQUETE 010 FINAL · relaciones 451–493
 */

export const atlasRelationsV4010: AtlasMasterRelation[] = [
  {
    "id": "v4-010-451-guatemalan-war-castillo",
    "source": {
      "type": "historical_event",
      "id": "guatemalan-civil-war",
      "label": "Guerra civil de Guatemala"
    },
    "target": {
      "type": "author",
      "id": "otto-rene-castillo",
      "label": "Otto René Castillo"
    },
    "relationType": "political_action",
    "mechanisms": [
      "guatemala",
      "revolution",
      "political-poetry",
      "armed-conflict"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La militancia revolucionaria y la violencia política guatemalteca determinaron directamente la vida y la poesía de Otto René Castillo."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-452-maori-renaissance-patricia-grace",
    "source": {
      "type": "movement",
      "id": "maori-literary-renaissance",
      "label": "Renacimiento literario māorí"
    },
    "target": {
      "type": "author",
      "id": "patricia-grace",
      "label": "Patricia Grace"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "maori",
      "indigenous-writing",
      "language",
      "community"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Patricia Grace es una de las figuras fundamentales del renacimiento de la literatura māorí contemporánea."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-453-mozambican-postcolonial-chiziane",
    "source": {
      "type": "tradition",
      "id": "mozambican-postcolonial-literature",
      "label": "Literatura mozambiqueña poscolonial"
    },
    "target": {
      "type": "author",
      "id": "paulina-chiziane",
      "label": "Paulina Chiziane"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "mozambique",
      "women",
      "postcolonialism",
      "oral-memory"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Paulina Chiziane ocupa una posición fundamental en la narrativa mozambiqueña poscolonial."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-454-angolan-independence-pepetela",
    "source": {
      "type": "movement",
      "id": "angolan-independence",
      "label": "Independencia de Angola"
    },
    "target": {
      "type": "author",
      "id": "pepetela",
      "label": "Pepetela"
    },
    "relationType": "lived_historical_experience",
    "mechanisms": [
      "angola",
      "anti-colonialism",
      "independence",
      "war"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La lucha por la independencia de Angola y la construcción posterior del país constituyen contextos centrales de la obra de Pepetela."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-455-indonesian-independence-pramoedya",
    "source": {
      "type": "historical_event",
      "id": "indonesian-colonialism-and-independence",
      "label": "Colonialismo e independencia de Indonesia"
    },
    "target": {
      "type": "author",
      "id": "pramoedya",
      "label": "Pramoedya Ananta Toer"
    },
    "relationType": "historical_context",
    "mechanisms": [
      "colonialism",
      "independence",
      "national-memory",
      "political-repression"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Colonialismo, independencia y represión política son ejes estructurales de la narrativa de Pramoedya Ananta Toer."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-456-ojibwe-wagamese",
    "source": {
      "type": "community",
      "id": "ojibwe-people",
      "label": "Pueblo Ojibwe"
    },
    "target": {
      "type": "author",
      "id": "richard-wagamese",
      "label": "Richard Wagamese"
    },
    "relationType": "cultural_reconnection",
    "mechanisms": [
      "ojibwe",
      "family",
      "residential-schools",
      "healing",
      "identity"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La reconexión con la identidad Ojibwe, la memoria familiar y las consecuencias del sistema de escuelas residenciales atraviesan la obra de Wagamese."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-457-honduran-social-poetry-sosa",
    "source": {
      "type": "tradition",
      "id": "honduran-social-poetry",
      "label": "Poesía social hondureña"
    },
    "target": {
      "type": "author",
      "id": "roberto-sosa",
      "label": "Roberto Sosa"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "honduras",
      "poverty",
      "inequality",
      "social-poetry"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Roberto Sosa es una figura central de la poesía social hondureña del siglo XX."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-458-salvadoran-violence-dalton",
    "source": {
      "type": "historical_event",
      "id": "salvadoran-political-violence",
      "label": "Violencia política salvadoreña"
    },
    "target": {
      "type": "author",
      "id": "roque-dalton",
      "label": "Roque Dalton"
    },
    "relationType": "political_action",
    "mechanisms": [
      "el-salvador",
      "revolution",
      "exile",
      "political-poetry"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La militancia revolucionaria, el exilio y la violencia política salvadoreña determinaron profundamente la obra de Roque Dalton."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-459-mexican-indigenismo-castellanos",
    "source": {
      "type": "tradition",
      "id": "mexican-indigenista-literature",
      "label": "Literatura indigenista mexicana"
    },
    "target": {
      "type": "author",
      "id": "rosario-castellanos",
      "label": "Rosario Castellanos"
    },
    "relationType": "critical_response",
    "mechanisms": [
      "chiapas",
      "indigenous-communities",
      "gender",
      "mexico"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "La obra de Rosario Castellanos mantiene un diálogo crítico central con el indigenismo mexicano, especialmente a partir de Chiapas."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-460-modern-hebrew-agnon",
    "source": {
      "type": "tradition",
      "id": "hebrew-modern-literature",
      "label": "Literatura hebrea moderna"
    },
    "target": {
      "type": "author",
      "id": "sy-agnon",
      "label": "S. Y. Agnon"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "hebrew",
      "jewish-memory",
      "galicia",
      "palestine"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Agnon ocupa una posición fundamental en la formación de la narrativa hebrea moderna."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-461-archaic-lyric-sappho",
    "source": {
      "type": "tradition",
      "id": "archaic-greek-lyric",
      "label": "Lírica griega arcaica"
    },
    "target": {
      "type": "author",
      "id": "sappho",
      "label": "Safo"
    },
    "relationType": "textual_tradition",
    "mechanisms": [
      "lyric",
      "lesbos",
      "song",
      "archaic-greece"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Safo es una de las figuras canónicas y fundacionales de la lírica griega arcaica."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-462-turkish-short-story-sait-faik",
    "source": {
      "type": "tradition",
      "id": "turkish-modern-short-story",
      "label": "Cuento turco moderno"
    },
    "target": {
      "type": "author",
      "id": "sait-faik",
      "label": "Sait Faik Abasıyanık"
    },
    "relationType": "formal_reinvention",
    "mechanisms": [
      "short-story",
      "istanbul",
      "ordinary-life",
      "modern-turkish-prose"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Sait Faik es una figura decisiva en la renovación del cuento turco moderno."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-463-palyku-sally-morgan",
    "source": {
      "type": "community",
      "id": "palyku-people",
      "label": "Pueblo Palyku"
    },
    "target": {
      "type": "author",
      "id": "sally-morgan",
      "label": "Sally Morgan"
    },
    "relationType": "cultural_reconnection",
    "mechanisms": [
      "aboriginal-identity",
      "family-memory",
      "stolen-generations",
      "australia"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La recuperación de la historia familiar y la identidad aborigen constituye el núcleo de la obra autobiográfica de Sally Morgan."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-464-postcolonial-diaspora-rushdie",
    "source": {
      "type": "tradition",
      "id": "postcolonial-diasporic-fiction",
      "label": "Narrativa poscolonial de la diáspora"
    },
    "target": {
      "type": "author",
      "id": "salman-rushdie",
      "label": "Salman Rushdie"
    },
    "relationType": "formal_reinvention",
    "mechanisms": [
      "migration",
      "india",
      "britain",
      "hybridity",
      "postcolonialism"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Rushdie es una de las figuras centrales de la narrativa poscolonial y diaspórica contemporánea."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-465-indonesian-poetry-sapardi",
    "source": {
      "type": "tradition",
      "id": "indonesian-modern-poetry",
      "label": "Poesía indonesia moderna"
    },
    "target": {
      "type": "author",
      "id": "sapardi-djoko-damono",
      "label": "Sapardi Djoko Damono"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "indonesia",
      "lyric",
      "modern-poetry",
      "everyday-language"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Sapardi Djoko Damono ocupa una posición central en la poesía indonesia moderna."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-466-rwandan-genocide-mukasonga",
    "source": {
      "type": "historical_event",
      "id": "rwandan-genocide-1994",
      "label": "Genocidio de Ruanda de 1994"
    },
    "target": {
      "type": "author",
      "id": "scholastique-mukasonga",
      "label": "Scholastique Mukasonga"
    },
    "relationType": "historical_trauma_transformation",
    "mechanisms": [
      "rwanda",
      "genocide",
      "memory",
      "family",
      "exile"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "El genocidio contra los tutsis, la pérdida familiar y el exilio constituyen el núcleo memorial de la obra de Mukasonga."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-467-heian-sei-shonagon",
    "source": {
      "type": "tradition",
      "id": "heian-court-literature",
      "label": "Literatura cortesana Heian"
    },
    "target": {
      "type": "author",
      "id": "sei-shonagon",
      "label": "Sei Shōnagon"
    },
    "relationType": "textual_tradition",
    "mechanisms": [
      "heian",
      "court",
      "zuihitsu",
      "women-writing"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Sei Shōnagon es una de las grandes figuras de la literatura cortesana japonesa del periodo Heian."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-468-iranian-modern-mandanipour",
    "source": {
      "type": "tradition",
      "id": "iranian-modern-fiction",
      "label": "Narrativa iraní moderna"
    },
    "target": {
      "type": "author",
      "id": "shahriar-mandanipour",
      "label": "Shahriar Mandanipour"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "iran",
      "censorship",
      "metafiction",
      "diaspora"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Mandanipour pertenece a la narrativa iraní moderna y ha trabajado de forma recurrente sobre censura, lenguaje y desplazamiento."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-469-iranian-women-parsipur",
    "source": {
      "type": "tradition",
      "id": "iranian-womens-literature",
      "label": "Literatura iraní escrita por mujeres"
    },
    "target": {
      "type": "author",
      "id": "shahrnush-parsipur",
      "label": "Shahrnush Parsipur"
    },
    "relationType": "formal_reinvention",
    "mechanisms": [
      "iran",
      "women",
      "censorship",
      "fantastic-fiction"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Parsipur es una figura fundamental de la narrativa iraní contemporánea escrita por mujeres."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-470-spokane-alexie",
    "source": {
      "type": "community",
      "id": "spokane-coeur-dalene",
      "label": "Pueblos Spokane-Coeur d'Alene"
    },
    "target": {
      "type": "author",
      "id": "sherman-alexie",
      "label": "Sherman Alexie"
    },
    "relationType": "cultural_reconnection",
    "mechanisms": [
      "spokane",
      "coeur-dalene",
      "reservation",
      "indigenous-identity"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La experiencia Spokane-Coeur d'Alene y la vida en comunidades indígenas del noroeste estadounidense son centrales en la obra de Alexie."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-471-i-novel-shiga",
    "source": {
      "type": "tradition",
      "id": "i-novel",
      "label": "Tradición japonesa de la I-novel"
    },
    "target": {
      "type": "author",
      "id": "shiga-naoya",
      "label": "Shiga Naoya"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "shi-shosetsu",
      "autobiographical-fiction",
      "modern-japanese-prose"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Shiga Naoya es una de las figuras canónicas asociadas a la tradición japonesa de la I-novel."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-472-georgian-medieval-rustaveli",
    "source": {
      "type": "tradition",
      "id": "medieval-georgian-literature",
      "label": "Literatura georgiana medieval"
    },
    "target": {
      "type": "author",
      "id": "shota-rustaveli",
      "label": "Shota Rustaveli"
    },
    "relationType": "textual_tradition",
    "mechanisms": [
      "georgia",
      "medieval-poetry",
      "epic",
      "courtly-literature"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Rustaveli ocupa una posición canónica en la literatura medieval georgiana."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-473-samoan-pacific-figiel",
    "source": {
      "type": "tradition",
      "id": "samoan-pacific-literature",
      "label": "Literatura samoana y del Pacífico"
    },
    "target": {
      "type": "author",
      "id": "sia-figiel",
      "label": "Sia Figiel"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "samoa",
      "women",
      "oral-culture",
      "postcolonialism"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Sia Figiel es una voz fundamental de la literatura samoana contemporánea y del Pacífico."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-474-thai-modern-siburapha",
    "source": {
      "type": "tradition",
      "id": "thai-modern-literature",
      "label": "Literatura tailandesa moderna"
    },
    "target": {
      "type": "author",
      "id": "siburapha",
      "label": "Siburapha"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "thailand",
      "modern-fiction",
      "social-criticism",
      "politics"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Siburapha ocupa una posición fundamental en la formación de la literatura tailandesa moderna."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-475-modern-persian-behbahani",
    "source": {
      "type": "movement",
      "id": "modern-persian-poetry",
      "label": "Poesía persa moderna"
    },
    "target": {
      "type": "author",
      "id": "simin-behbahani",
      "label": "Simin Behbahani"
    },
    "relationType": "formal_reinvention",
    "mechanisms": [
      "ghazal",
      "persian-poetry",
      "women",
      "politics",
      "modernity"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Behbahani transformó el ghazal persa y constituye una figura central de la poesía iraní moderna."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-476-acoma-ortiz",
    "source": {
      "type": "community",
      "id": "acoma-pueblo",
      "label": "Acoma Pueblo"
    },
    "target": {
      "type": "author",
      "id": "simon-ortiz",
      "label": "Simon J. Ortiz"
    },
    "relationType": "land_based_knowledge",
    "mechanisms": [
      "acoma",
      "land",
      "oral-memory",
      "indigenous-poetry"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La relación con Acoma Pueblo, su territorio y su memoria oral es fundamental en la obra de Simon J. Ortiz."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-477-iraqi-exile-antoon",
    "source": {
      "type": "tradition",
      "id": "iraqi-exile-literature",
      "label": "Literatura iraquí del exilio"
    },
    "target": {
      "type": "author",
      "id": "sinan-antoon",
      "label": "Sinan Antoon"
    },
    "relationType": "lived_historical_experience",
    "mechanisms": [
      "iraq",
      "war",
      "migration",
      "diaspora",
      "memory"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La guerra, la emigración y la memoria iraquí constituyen ejes centrales de la obra de Sinan Antoon."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-478-apartheid-magona",
    "source": {
      "type": "historical_event",
      "id": "apartheid",
      "label": "Apartheid"
    },
    "target": {
      "type": "author",
      "id": "sindiwe-magona",
      "label": "Sindiwe Magona"
    },
    "relationType": "lived_historical_experience",
    "mechanisms": [
      "apartheid",
      "township",
      "women",
      "south-africa"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La experiencia del apartheid y de la vida en los townships sudafricanos atraviesa profundamente la escritura de Sindiwe Magona."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-479-thai-classical-sunthorn-phu",
    "source": {
      "type": "tradition",
      "id": "thai-classical-poetry",
      "label": "Poesía clásica tailandesa"
    },
    "target": {
      "type": "author",
      "id": "sunthorn-phu",
      "label": "Sunthorn Phu"
    },
    "relationType": "textual_tradition",
    "mechanisms": [
      "thai-poetry",
      "court",
      "narrative-verse",
      "classical-literature"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Sunthorn Phu ocupa una posición canónica en la tradición poética clásica tailandesa."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-480-east-african-experimental-lo-liyong",
    "source": {
      "type": "tradition",
      "id": "east-african-experimental-literature",
      "label": "Literatura experimental de África oriental"
    },
    "target": {
      "type": "author",
      "id": "taban-lo-liyong",
      "label": "Taban Lo Liyong"
    },
    "relationType": "formal_reinvention",
    "mechanisms": [
      "east-africa",
      "experimental-writing",
      "essay",
      "poetry"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Taban Lo Liyong es una figura singular y experimental de la literatura moderna de África oriental."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-481-victorian-hardy",
    "source": {
      "type": "tradition",
      "id": "victorian-novel",
      "label": "Novela victoriana"
    },
    "target": {
      "type": "author",
      "id": "thomas-hardy",
      "label": "Thomas Hardy"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "victorian-fiction",
      "rural-england",
      "social-change",
      "tragic-novel"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Thomas Hardy ocupa una posición fundamental en la novela inglesa del final de la época victoriana."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-482-indigenous-literature-thomas-king",
    "source": {
      "type": "tradition",
      "id": "indigenous-north-american-literature",
      "label": "Literatura indígena norteamericana"
    },
    "target": {
      "type": "author",
      "id": "thomas-king",
      "label": "Thomas King"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "indigenous-storytelling",
      "colonialism",
      "humor",
      "north-america"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Thomas King es una figura central de la literatura indígena contemporánea de Norteamérica."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-483-zimbabwean-postcolonial-dangarembga",
    "source": {
      "type": "tradition",
      "id": "zimbabwean-postcolonial-literature",
      "label": "Literatura zimbabuense poscolonial"
    },
    "target": {
      "type": "author",
      "id": "tsitsi-dangarembga",
      "label": "Tsitsi Dangarembga"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "zimbabwe",
      "gender",
      "colonialism",
      "education"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Tsitsi Dangarembga ocupa una posición fundamental en la narrativa zimbabuense poscolonial."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-484-modern-hebrew-greenberg",
    "source": {
      "type": "movement",
      "id": "modern-hebrew-poetry",
      "label": "Poesía hebrea moderna"
    },
    "target": {
      "type": "author",
      "id": "uri-zvi-greenberg",
      "label": "Uri Zvi Greenberg"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "hebrew",
      "yiddish",
      "modernism",
      "political-poetry"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Uri Zvi Greenberg es una figura central y radical de la poesía hebrea moderna."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-485-mahabharata-vyasa",
    "source": {
      "type": "tradition",
      "id": "mahabharata-tradition",
      "label": "Tradición del Mahābhārata"
    },
    "target": {
      "type": "author",
      "id": "vyasa",
      "label": "Vyāsa"
    },
    "relationType": "traditional_authorship_attribution",
    "mechanisms": [
      "mahabharata",
      "sanskrit",
      "epic",
      "composite-tradition"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "La tradición india atribuye a Vyāsa la autoría o compilación del Mahābhārata."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-486-ramayana-valmiki",
    "source": {
      "type": "tradition",
      "id": "ramayana-tradition",
      "label": "Tradición del Rāmāyaṇa"
    },
    "target": {
      "type": "author",
      "id": "valmiki",
      "label": "Vālmīki"
    },
    "relationType": "traditional_authorship_attribution",
    "mechanisms": [
      "ramayana",
      "sanskrit",
      "epic",
      "classical-india"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "La tradición india atribuye a Vālmīki la composición del Rāmāyaṇa."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-487-chinese-contemporary-wang-anyi",
    "source": {
      "type": "tradition",
      "id": "chinese-contemporary-fiction",
      "label": "Narrativa china contemporánea"
    },
    "target": {
      "type": "author",
      "id": "wang-anyi",
      "label": "Wang Anyi"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "china",
      "shanghai",
      "urban-memory",
      "women"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Wang Anyi es una figura central de la narrativa china contemporánea y de la representación literaria de Shanghái."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-488-american-regionalism-cather",
    "source": {
      "type": "tradition",
      "id": "american-regionalist-fiction",
      "label": "Narrativa regionalista estadounidense"
    },
    "target": {
      "type": "author",
      "id": "willa-cather",
      "label": "Willa Cather"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "great-plains",
      "migration",
      "landscape",
      "american-fiction"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Willa Cather ocupa una posición fundamental en la narrativa estadounidense sobre territorio, migración y las Grandes Llanuras."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-489-vietnamese-new-poetry-xuan-dieu",
    "source": {
      "type": "movement",
      "id": "vietnamese-new-poetry",
      "label": "Nueva Poesía vietnamita"
    },
    "target": {
      "type": "author",
      "id": "xuan-dieu",
      "label": "Xuân Diệu"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "tho-moi",
      "modernity",
      "love-poetry",
      "vietnam"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Xuân Diệu es una de las figuras fundamentales del movimiento vietnamita Thơ Mới o Nueva Poesía."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-490-anatolian-oral-yasar-kemal",
    "source": {
      "type": "tradition",
      "id": "anatolian-oral-narrative",
      "label": "Narrativa oral de Anatolia"
    },
    "target": {
      "type": "author",
      "id": "yasar-kemal",
      "label": "Yaşar Kemal"
    },
    "relationType": "oral_tradition",
    "mechanisms": [
      "anatolia",
      "oral-storytelling",
      "epic",
      "rural-life"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "La narrativa de Yaşar Kemal transforma profundamente tradiciones orales y épicas de Anatolia."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-491-armenian-modern-charents",
    "source": {
      "type": "tradition",
      "id": "armenian-modern-poetry",
      "label": "Poesía armenia moderna"
    },
    "target": {
      "type": "author",
      "id": "yeghishe-charents",
      "label": "Yeghishe Charents"
    },
    "relationType": "formal_reinvention",
    "mechanisms": [
      "armenia",
      "modernism",
      "revolution",
      "national-poetry"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Yeghishe Charents es una figura fundamental de la poesía armenia moderna."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-492-kenyan-postcolonial-owuor",
    "source": {
      "type": "tradition",
      "id": "kenyan-postcolonial-literature",
      "label": "Literatura keniana poscolonial"
    },
    "target": {
      "type": "author",
      "id": "yvon-adhiambo-owuor",
      "label": "Yvonne Adhiambo Owuor"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "kenya",
      "history",
      "violence",
      "memory",
      "nation"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Yvonne Adhiambo Owuor ocupa una posición destacada en la narrativa keniana contemporánea sobre memoria histórica y nación."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-010-493-south-african-postapartheid-wicomb",
    "source": {
      "type": "tradition",
      "id": "south-african-postapartheid-literature",
      "label": "Literatura sudafricana posapartheid"
    },
    "target": {
      "type": "author",
      "id": "zoe-wicomb",
      "label": "Zoë Wicomb"
    },
    "relationType": "critical_response",
    "mechanisms": [
      "south-africa",
      "race",
      "gender",
      "diaspora",
      "apartheid-memory"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Zoë Wicomb es una figura central de la literatura sudafricana contemporánea sobre raza, género, diáspora y memoria del apartheid."
      }
    ],
    "confidence": "maximum"
  }
];
