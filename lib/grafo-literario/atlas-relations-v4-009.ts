import type { AtlasMasterRelation } from "./relation-ontology";

/**
 * ATLAS UNIVERSAL DE LAS INFLUENCIAS
 * V4 · PAQUETE 009 · relaciones 401–450
 */

export const atlasRelationsV4009: AtlasMasterRelation[] = [
  {
    "id": "v4-009-401-iranian-modern-fiction-golshiri",
    "source": {
      "type": "tradition",
      "id": "iranian-modern-fiction",
      "label": "Narrativa iraní moderna"
    },
    "target": {
      "type": "author",
      "id": "houshang-golshiri",
      "label": "Houshang Golshiri"
    },
    "relationType": "formal_reinvention",
    "mechanisms": [
      "iran",
      "modern-fiction",
      "narrative-experiment",
      "political-pressure"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Golshiri es una figura central de la renovación de la narrativa iraní moderna."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-402-armenian-literature-tumanyan",
    "source": {
      "type": "tradition",
      "id": "armenian-national-literature",
      "label": "Literatura nacional armenia"
    },
    "target": {
      "type": "author",
      "id": "hovhannes-tumanyan",
      "label": "Hovhannes Tumanyan"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "armenian-language",
      "folklore",
      "national-literature",
      "poetry"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Tumanyan ocupa una posición canónica en la formación de la literatura armenia moderna."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-403-russian-realism-goncharov",
    "source": {
      "type": "tradition",
      "id": "russian-realism",
      "label": "Realismo ruso"
    },
    "target": {
      "type": "author",
      "id": "goncharov",
      "label": "Iván Goncharov"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "realism",
      "social-type",
      "nineteenth-century-russia",
      "novel"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Goncharov pertenece al núcleo de la novela realista rusa del siglo XIX."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-404-russian-realism-turgenev",
    "source": {
      "type": "tradition",
      "id": "russian-realism",
      "label": "Realismo ruso"
    },
    "target": {
      "type": "author",
      "id": "turgenev",
      "label": "Iván Turguénev"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "realism",
      "russian-novel",
      "social-change",
      "nineteenth-century"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Turguénev es una de las figuras fundamentales del realismo ruso del siglo XIX."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-405-blackfeet-welch",
    "source": {
      "type": "community",
      "id": "blackfeet-gros-ventre",
      "label": "Pueblos Blackfeet-Gros Ventre"
    },
    "target": {
      "type": "author",
      "id": "james-welch",
      "label": "James Welch"
    },
    "relationType": "cultural_reconnection",
    "mechanisms": [
      "indigenous-memory",
      "blackfeet",
      "gros-ventre",
      "land",
      "identity"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La herencia Blackfeet y Gros Ventre constituye una dimensión fundamental de la obra de James Welch."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-406-maritime-conrad",
    "source": {
      "type": "tradition",
      "id": "transnational-maritime-literature",
      "label": "Literatura marítima transnacional"
    },
    "target": {
      "type": "author",
      "id": "joseph-conrad",
      "label": "Joseph Conrad"
    },
    "relationType": "professional_experience",
    "mechanisms": [
      "sea",
      "empire",
      "migration",
      "maritime-life",
      "colonialism"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La experiencia profesional de Conrad como marino alimentó de forma directa una parte esencial de su narrativa."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-407-boom-donoso",
    "source": {
      "type": "movement",
      "id": "latin-american-boom",
      "label": "Boom latinoamericano"
    },
    "target": {
      "type": "author",
      "id": "jose-donoso",
      "label": "José Donoso"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "boom",
      "latin-american-novel",
      "formal-experiment",
      "modernity"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "José Donoso forma parte del núcleo histórico y editorial del Boom latinoamericano."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-408-philippine-modern-villa",
    "source": {
      "type": "tradition",
      "id": "philippine-modern-poetry",
      "label": "Poesía filipina moderna"
    },
    "target": {
      "type": "author",
      "id": "jose-garcia-villa",
      "label": "José García Villa"
    },
    "relationType": "formal_reinvention",
    "mechanisms": [
      "english-language",
      "experimental-poetry",
      "philippines",
      "diaspora"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "José García Villa es una figura fundamental de la poesía filipina moderna en lengua inglesa."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-409-quechua-arguedas",
    "source": {
      "type": "oral_tradition",
      "id": "quechua-oral-tradition",
      "label": "Tradición oral quechua"
    },
    "target": {
      "type": "author",
      "id": "jose-maria-arguedas",
      "label": "José María Arguedas"
    },
    "relationType": "multilingual_formation",
    "mechanisms": [
      "quechua",
      "spanish",
      "oral-tradition",
      "andes",
      "translation"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La formación bilingüe quechua-español y la cultura oral andina son estructurales en la obra de Arguedas."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-410-philippine-independence-rizal",
    "source": {
      "type": "historical_event",
      "id": "philippine-independence-movement",
      "label": "Movimiento independentista filipino"
    },
    "target": {
      "type": "author",
      "id": "jose-rizal",
      "label": "José Rizal"
    },
    "relationType": "political_action",
    "mechanisms": [
      "colonialism",
      "philippines",
      "reform",
      "national-consciousness"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "La obra y actividad pública de Rizal tuvieron una importancia decisiva en la formación de la conciencia anticolonial filipina."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-411-muscogee-harjo",
    "source": {
      "type": "community",
      "id": "muscogee-people",
      "label": "Pueblo Muscogee"
    },
    "target": {
      "type": "author",
      "id": "joy-harjo",
      "label": "Joy Harjo"
    },
    "relationType": "cultural_reconnection",
    "mechanisms": [
      "muscogee",
      "oral-memory",
      "music",
      "indigenous-poetry",
      "land"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La identidad Muscogee, la memoria oral y la relación con el territorio son fundamentales en la poesía de Joy Harjo."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-412-mexican-short-fiction-arreola",
    "source": {
      "type": "tradition",
      "id": "mexican-short-fiction",
      "label": "Cuento mexicano moderno"
    },
    "target": {
      "type": "author",
      "id": "juan-jose-arreola",
      "label": "Juan José Arreola"
    },
    "relationType": "formal_reinvention",
    "mechanisms": [
      "short-fiction",
      "fable",
      "fantastic",
      "irony",
      "mexico"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Arreola transformó decisivamente el cuento mexicano mediante formas breves, fantásticas y alegóricas."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-413-medieval-castilian-juan-ruiz",
    "source": {
      "type": "tradition",
      "id": "medieval-castilian-literature",
      "label": "Literatura castellana medieval"
    },
    "target": {
      "type": "author",
      "id": "juan-ruiz",
      "label": "Juan Ruiz, Arcipreste de Hita"
    },
    "relationType": "textual_tradition",
    "mechanisms": [
      "medieval-castile",
      "didacticism",
      "satire",
      "poetic-narrative"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Juan Ruiz ocupa una posición fundamental en la tradición literaria castellana medieval."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-414-mexican-revolution-rulfo",
    "source": {
      "type": "historical_event",
      "id": "mexican-revolution",
      "label": "Revolución mexicana"
    },
    "target": {
      "type": "author",
      "id": "juan-rulfo",
      "label": "Juan Rulfo"
    },
    "relationType": "historical_context",
    "mechanisms": [
      "revolution",
      "cristero-war",
      "rural-mexico",
      "memory",
      "violence"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "La violencia rural y las consecuencias históricas de la Revolución mexicana forman parte central del mundo narrativo de Rulfo."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-415-japanese-modernism-tanizaki",
    "source": {
      "type": "tradition",
      "id": "japanese-modernism",
      "label": "Modernismo japonés"
    },
    "target": {
      "type": "author",
      "id": "tanizaki",
      "label": "Jun'ichirō Tanizaki"
    },
    "relationType": "formal_reinvention",
    "mechanisms": [
      "modernity",
      "tradition",
      "aesthetics",
      "desire",
      "japanese-fiction"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Tanizaki es una de las figuras fundamentales de la modernidad literaria japonesa."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-416-nuclear-testing-jetnil-kijiner",
    "source": {
      "type": "historical_event",
      "id": "marshall-islands-nuclear-testing",
      "label": "Pruebas nucleares en las Islas Marshall"
    },
    "target": {
      "type": "author",
      "id": "kathy-jetnil-kijiner",
      "label": "Kathy Jetñil-Kijiner"
    },
    "relationType": "historical_trauma_transformation",
    "mechanisms": [
      "nuclear-testing",
      "climate",
      "marshall-islands",
      "memory",
      "displacement"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "La memoria de las pruebas nucleares y la vulnerabilidad climática de las Islas Marshall atraviesan la obra de Jetñil-Kijiner."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-417-apartheid-kgositsile",
    "source": {
      "type": "historical_event",
      "id": "apartheid",
      "label": "Apartheid"
    },
    "target": {
      "type": "author",
      "id": "keorapetse-kgositsile",
      "label": "Keorapetse Kgositsile"
    },
    "relationType": "political_dissidence",
    "mechanisms": [
      "anti-apartheid",
      "exile",
      "black-consciousness",
      "poetry"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La lucha contra el apartheid y el exilio fueron determinantes en la trayectoria de Kgositsile."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-418-noongar-kim-scott",
    "source": {
      "type": "community",
      "id": "noongar-people",
      "label": "Pueblo Noongar"
    },
    "target": {
      "type": "author",
      "id": "kim-scott",
      "label": "Kim Scott"
    },
    "relationType": "language_reclamation",
    "mechanisms": [
      "noongar",
      "language",
      "country",
      "indigenous-memory",
      "reclamation"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La recuperación de lengua, territorio e historia Noongar es central en la obra de Kim Scott."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-419-sanskrit-kalidasa",
    "source": {
      "type": "tradition",
      "id": "classical-sanskrit-literature",
      "label": "Literatura sánscrita clásica"
    },
    "target": {
      "type": "author",
      "id": "kalidasa",
      "label": "Kālidāsa"
    },
    "relationType": "textual_tradition",
    "mechanisms": [
      "sanskrit",
      "drama",
      "lyric",
      "classical-india"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Kālidāsa es una de las figuras canónicas de la literatura clásica en sánscrito."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-420-modern-hebrew-goldberg",
    "source": {
      "type": "movement",
      "id": "modern-hebrew-poetry",
      "label": "Poesía hebrea moderna"
    },
    "target": {
      "type": "author",
      "id": "leah-goldberg",
      "label": "Leah Goldberg"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "hebrew",
      "translation",
      "modern-poetry",
      "europe-israel"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Leah Goldberg ocupa una posición fundamental en la consolidación de la poesía hebrea moderna."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-421-michi-saagiig-simpson",
    "source": {
      "type": "community",
      "id": "michi-saagiig-nishnaabeg",
      "label": "Michi Saagiig Nishnaabeg"
    },
    "target": {
      "type": "author",
      "id": "leanne-betasamosake-simpson",
      "label": "Leanne Betasamosake Simpson"
    },
    "relationType": "land_based_knowledge",
    "mechanisms": [
      "land",
      "language",
      "indigenous-knowledge",
      "decolonization",
      "nishnaabeg"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "El conocimiento Michi Saagiig Nishnaabeg basado en tierra, lengua y comunidad estructura la obra de Simpson."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-422-laguna-silko",
    "source": {
      "type": "community",
      "id": "laguna-pueblo",
      "label": "Laguna Pueblo"
    },
    "target": {
      "type": "author",
      "id": "leslie-marmon-silko",
      "label": "Leslie Marmon Silko"
    },
    "relationType": "oral_tradition",
    "mechanisms": [
      "laguna-pueblo",
      "storytelling",
      "ceremony",
      "land",
      "memory"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "Las historias, prácticas orales y memoria del pueblo Laguna son fundamentales en la obra de Silko."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-423-chickasaw-hogan",
    "source": {
      "type": "community",
      "id": "chickasaw-people",
      "label": "Pueblo Chickasaw"
    },
    "target": {
      "type": "author",
      "id": "linda-hogan",
      "label": "Linda Hogan"
    },
    "relationType": "land_based_knowledge",
    "mechanisms": [
      "chickasaw",
      "ecology",
      "land",
      "animals",
      "indigenous-memory"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La herencia Chickasaw y una relación ecológica y espiritual con el territorio atraviesan la obra de Linda Hogan."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-424-ojibwe-erdrich",
    "source": {
      "type": "community",
      "id": "ojibwe-people",
      "label": "Pueblo Ojibwe"
    },
    "target": {
      "type": "author",
      "id": "louise-erdrich",
      "label": "Louise Erdrich"
    },
    "relationType": "cultural_reconnection",
    "mechanisms": [
      "ojibwe",
      "family",
      "reservation",
      "oral-memory",
      "community"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La cultura Ojibwe y las redes familiares y comunitarias indígenas constituyen un eje fundamental de la narrativa de Erdrich."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-425-modern-drama-pirandello",
    "source": {
      "type": "movement",
      "id": "modern-drama",
      "label": "Drama moderno europeo"
    },
    "target": {
      "type": "author",
      "id": "pirandello",
      "label": "Luigi Pirandello"
    },
    "relationType": "formal_reinvention",
    "mechanisms": [
      "metatheatre",
      "identity",
      "illusion",
      "modern-drama"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Pirandello transformó radicalmente el drama moderno mediante procedimientos metateatrales y reflexiones sobre identidad y representación."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-426-vietnam-war-le-minh-khue",
    "source": {
      "type": "historical_event",
      "id": "vietnam-war",
      "label": "Guerra de Vietnam"
    },
    "target": {
      "type": "author",
      "id": "le-minh-khue",
      "label": "Lê Minh Khuê"
    },
    "relationType": "lived_historical_experience",
    "mechanisms": [
      "war",
      "youth-brigades",
      "memory",
      "vietnam"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "Lê Minh Khuê participó en unidades juveniles durante la guerra de Vietnam, experiencia decisiva para su narrativa."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-427-italian-invasion-mengiste",
    "source": {
      "type": "historical_event",
      "id": "italian-invasion-ethiopia",
      "label": "Invasión italiana de Etiopía"
    },
    "target": {
      "type": "author",
      "id": "maaza-mengiste",
      "label": "Maaza Mengiste"
    },
    "relationType": "historical_context",
    "mechanisms": [
      "ethiopia",
      "fascism",
      "war",
      "memory",
      "women"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "La invasión italiana de Etiopía y la resistencia antifascista constituyen un núcleo histórico fundamental de la obra de Maaza Mengiste."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-428-turkmen-classical-magtymguly",
    "source": {
      "type": "tradition",
      "id": "turkmen-classical-poetry",
      "label": "Poesía clásica turcomana"
    },
    "target": {
      "type": "author",
      "id": "magtymguly-pyragy",
      "label": "Magtymguly Pyragy"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "turkmen-language",
      "classical-poetry",
      "national-literature",
      "sufi-inheritance"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Magtymguly Pyragy ocupa una posición fundacional en la tradición poética y lingüística turcomana."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-429-iranian-rural-dowlatabadi",
    "source": {
      "type": "tradition",
      "id": "iranian-rural-fiction",
      "label": "Narrativa rural iraní"
    },
    "target": {
      "type": "author",
      "id": "mahmoud-dowlatabadi",
      "label": "Mahmoud Dowlatabadi"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "iran",
      "rural-life",
      "peasantry",
      "social-change"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Dowlatabadi es una de las grandes figuras de la narrativa iraní centrada en la vida rural y las transformaciones sociales."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-430-argentine-modern-puig",
    "source": {
      "type": "tradition",
      "id": "argentine-modern-fiction",
      "label": "Narrativa argentina moderna"
    },
    "target": {
      "type": "author",
      "id": "manuel-puig",
      "label": "Manuel Puig"
    },
    "relationType": "formal_reinvention",
    "mechanisms": [
      "popular-culture",
      "cinema",
      "dialogue",
      "modern-fiction"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Puig transformó la narrativa argentina incorporando lenguaje cinematográfico, cultura popular y estructuras experimentales."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-431-peruvian-land-conflicts-scorza",
    "source": {
      "type": "historical_event",
      "id": "peruvian-land-conflicts",
      "label": "Conflictos agrarios peruanos"
    },
    "target": {
      "type": "author",
      "id": "manuel-scorza",
      "label": "Manuel Scorza"
    },
    "relationType": "historical_context",
    "mechanisms": [
      "andes",
      "land-conflict",
      "indigenous-communities",
      "political-fiction"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Los conflictos por la tierra y la resistencia campesina andina constituyen el núcleo histórico del ciclo narrativo de Scorza."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-432-uruguayan-modern-benedetti",
    "source": {
      "type": "tradition",
      "id": "uruguayan-modern-literature",
      "label": "Literatura uruguaya moderna"
    },
    "target": {
      "type": "author",
      "id": "mario-benedetti",
      "label": "Mario Benedetti"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "uruguay",
      "urban-life",
      "exile",
      "politics",
      "poetry"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Mario Benedetti es una figura central de la literatura uruguaya moderna en poesía, narrativa y ensayo."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-433-american-vernacular-twain",
    "source": {
      "type": "tradition",
      "id": "american-vernacular-literature",
      "label": "Literatura vernácula estadounidense"
    },
    "target": {
      "type": "author",
      "id": "mark-twain",
      "label": "Mark Twain"
    },
    "relationType": "language_transformation",
    "mechanisms": [
      "vernacular",
      "dialect",
      "satire",
      "american-fiction"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Twain transformó la prosa estadounidense mediante el uso literario de registros vernáculos, dialectales y humorísticos."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-434-uruguayan-fantastic-marosa",
    "source": {
      "type": "tradition",
      "id": "uruguayan-fantastic-poetry",
      "label": "Poesía fantástica uruguaya"
    },
    "target": {
      "type": "author",
      "id": "marosa-di-giorgio",
      "label": "Marosa di Giorgio"
    },
    "relationType": "formal_reinvention",
    "mechanisms": [
      "fantastic",
      "eroticism",
      "nature",
      "dream",
      "poetry"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Marosa di Giorgio desarrolló una de las poéticas fantásticas y visionarias más singulares de la literatura uruguaya."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-435-chilean-modernist-bombal",
    "source": {
      "type": "tradition",
      "id": "chilean-modernist-fiction",
      "label": "Narrativa chilena moderna"
    },
    "target": {
      "type": "author",
      "id": "maria-luisa-bombal",
      "label": "María Luisa Bombal"
    },
    "relationType": "formal_reinvention",
    "mechanisms": [
      "interiority",
      "dream",
      "gender",
      "lyrical-prose"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Bombal fue una figura decisiva en la renovación de la narrativa chilena mediante interioridad, lirismo y elementos oníricos."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-436-philippine-australian-bobis",
    "source": {
      "type": "tradition",
      "id": "philippine-australian-diaspora-literature",
      "label": "Literatura filipino-australiana de la diáspora"
    },
    "target": {
      "type": "author",
      "id": "merlinda-bobis",
      "label": "Merlinda Bobis"
    },
    "relationType": "multilingual_formation",
    "mechanisms": [
      "philippines",
      "australia",
      "migration",
      "oral-memory",
      "multilingualism"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La experiencia entre Filipinas y Australia, junto con la tradición oral y el multilingüismo, estructura buena parte de la obra de Merlinda Bobis."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-437-magical-realism-asturias",
    "source": {
      "type": "movement",
      "id": "latin-american-magical-realism",
      "label": "Realismo mágico latinoamericano"
    },
    "target": {
      "type": "author",
      "id": "miguel-angel-asturias",
      "label": "Miguel Ángel Asturias"
    },
    "relationType": "formal_reinvention",
    "mechanisms": [
      "indigenous-myth",
      "surrealism",
      "guatemala",
      "dictatorship"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Asturias es una figura precursora fundamental de la integración entre mito indígena, experimentación moderna y realismo mágico latinoamericano."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-438-apartheid-serote",
    "source": {
      "type": "historical_event",
      "id": "apartheid",
      "label": "Apartheid"
    },
    "target": {
      "type": "author",
      "id": "mongane-wally-serote",
      "label": "Mongane Wally Serote"
    },
    "relationType": "political_dissidence",
    "mechanisms": [
      "apartheid",
      "black-consciousness",
      "poetry",
      "resistance"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La lucha contra el apartheid y el movimiento de Conciencia Negra fueron determinantes en la poesía y trayectoria de Serote."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-439-heian-murasaki",
    "source": {
      "type": "tradition",
      "id": "heian-court-literature",
      "label": "Literatura cortesana Heian"
    },
    "target": {
      "type": "author",
      "id": "murasaki-shikibu",
      "label": "Murasaki Shikibu"
    },
    "relationType": "textual_tradition",
    "mechanisms": [
      "heian",
      "court",
      "women-writing",
      "classical-japanese-literature"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Murasaki Shikibu constituye una figura fundamental de la cultura literaria cortesana del periodo Heian."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-440-kiowa-momaday",
    "source": {
      "type": "community",
      "id": "kiowa-people",
      "label": "Pueblo Kiowa"
    },
    "target": {
      "type": "author",
      "id": "n-scott-momaday",
      "label": "N. Scott Momaday"
    },
    "relationType": "cultural_reconnection",
    "mechanisms": [
      "kiowa",
      "oral-history",
      "land",
      "ancestral-memory"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La tradición Kiowa, la memoria oral y el territorio ancestral son fundamentales en la obra de N. Scott Momaday."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-441-somali-diaspora-nadifa",
    "source": {
      "type": "tradition",
      "id": "somali-diaspora-literature",
      "label": "Literatura somalí de la diáspora"
    },
    "target": {
      "type": "author",
      "id": "nadifa-mohamed",
      "label": "Nadifa Mohamed"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "somalia",
      "migration",
      "britain",
      "diaspora",
      "memory"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La historia somalí y la experiencia migratoria hacia Gran Bretaña son ejes centrales de la narrativa de Nadifa Mohamed."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-442-dark-romanticism-hawthorne",
    "source": {
      "type": "tradition",
      "id": "american-dark-romanticism",
      "label": "Romanticismo oscuro estadounidense"
    },
    "target": {
      "type": "author",
      "id": "nathaniel-hawthorne",
      "label": "Nathaniel Hawthorne"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "puritanism",
      "guilt",
      "sin",
      "american-romanticism"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Hawthorne es una figura canónica del Romanticismo oscuro estadounidense."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-443-vietnamese-classical-nguyen-du",
    "source": {
      "type": "tradition",
      "id": "vietnamese-classical-literature",
      "label": "Literatura clásica vietnamita"
    },
    "target": {
      "type": "author",
      "id": "nguyen-du",
      "label": "Nguyễn Du"
    },
    "relationType": "textual_tradition",
    "mechanisms": [
      "vietnamese-poetry",
      "classical-literature",
      "nom-script",
      "epic-poem"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Nguyễn Du ocupa una posición canónica en la literatura clásica vietnamita."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-444-philippine-hispanic-joaquin",
    "source": {
      "type": "tradition",
      "id": "philippine-hispanic-literature",
      "label": "Literatura filipina de herencia hispánica"
    },
    "target": {
      "type": "author",
      "id": "nick-joaquin",
      "label": "Nick Joaquín"
    },
    "relationType": "cultural_preservation",
    "mechanisms": [
      "philippines",
      "spanish-colonial-memory",
      "catholicism",
      "history"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Nick Joaquín exploró de manera central la herencia cultural hispánica y católica en la identidad filipina."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-445-persian-romance-nizami",
    "source": {
      "type": "tradition",
      "id": "persian-romance-tradition",
      "label": "Tradición persa del romance"
    },
    "target": {
      "type": "author",
      "id": "nizami-ganjavi",
      "label": "Nizami Ganjavi"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "persian-poetry",
      "romance",
      "epic",
      "narrative-poetry"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Nizami Ganjavi es una de las figuras fundamentales de la tradición narrativa y amorosa de la poesía persa."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-446-apartheid-ndebele",
    "source": {
      "type": "historical_event",
      "id": "apartheid",
      "label": "Apartheid"
    },
    "target": {
      "type": "author",
      "id": "njabulo-ndebele",
      "label": "Njabulo Ndebele"
    },
    "relationType": "historical_context",
    "mechanisms": [
      "apartheid",
      "ordinary-life",
      "south-africa",
      "post-apartheid"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "La experiencia del apartheid y la reflexión sobre la representación de la vida cotidiana sudafricana son centrales en la obra de Ndebele."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-447-acholi-okot",
    "source": {
      "type": "oral_tradition",
      "id": "acholi-oral-tradition",
      "label": "Tradición oral acholi"
    },
    "target": {
      "type": "author",
      "id": "okotp-bitek",
      "label": "Okot p'Bitek"
    },
    "relationType": "oral_tradition",
    "mechanisms": [
      "acholi",
      "song",
      "oral-poetry",
      "east-africa"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Okot p'Bitek transformó formas y ritmos de la tradición oral acholi en poesía escrita moderna."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-448-soviet-central-asia-suleimenov",
    "source": {
      "type": "historical_event",
      "id": "soviet-central-asia",
      "label": "Asia Central soviética"
    },
    "target": {
      "type": "author",
      "id": "olzhas-suleimenov",
      "label": "Olzhas Suleimenov"
    },
    "relationType": "historical_context",
    "mechanisms": [
      "kazakhstan",
      "soviet-modernity",
      "language",
      "national-memory"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "La experiencia soviética de Kazajistán y la recuperación de memoria lingüística y cultural atraviesan la obra de Suleimenov."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-449-noonuccal-oodgeroo",
    "source": {
      "type": "community",
      "id": "noonuccal-people",
      "label": "Pueblo Noonuccal"
    },
    "target": {
      "type": "author",
      "id": "ouodgeroo-noonuccal",
      "label": "Oodgeroo Noonuccal"
    },
    "relationType": "cultural_reconnection",
    "mechanisms": [
      "noonuccal",
      "aboriginal-rights",
      "land",
      "poetry",
      "activism"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La identidad Noonuccal, los derechos indígenas y la relación con Country son fundamentales en la poesía y activismo de Oodgeroo."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-009-450-turkish-postmodern-pamuk",
    "source": {
      "type": "tradition",
      "id": "turkish-postmodern-fiction",
      "label": "Narrativa posmoderna turca"
    },
    "target": {
      "type": "author",
      "id": "orhan-pamuk",
      "label": "Orhan Pamuk"
    },
    "relationType": "formal_reinvention",
    "mechanisms": [
      "istanbul",
      "east-west",
      "metafiction",
      "memory",
      "identity"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Pamuk es una figura central de la narrativa turca contemporánea y de su experimentación posmoderna con memoria, identidad y relaciones entre Oriente y Occidente."
      }
    ],
    "confidence": "maximum"
  }
];
