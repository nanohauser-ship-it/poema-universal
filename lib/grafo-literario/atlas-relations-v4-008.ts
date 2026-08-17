import type { AtlasMasterRelation } from "./relation-ontology";

/**
 * ATLAS UNIVERSAL DE LAS INFLUENCIAS
 * V4 · PAQUETE 008 · relaciones 351–400
 */

export const atlasRelationsV4008: AtlasMasterRelation[] = [
  {
    "id": "v4-008-351-philippine-english-yuson",
    "source": {
      "type": "tradition",
      "id": "philippine-english-literature",
      "label": "Literatura filipina en inglés"
    },
    "target": {
      "type": "author",
      "id": "alfred-yuson",
      "label": "Alfred A. Yuson"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "philippines",
      "english-language",
      "modern-poetry",
      "fiction"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Alfred A. Yuson pertenece a la tradición moderna de escritura filipina en lengua inglesa."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-352-yankunytjatjara-eckermann",
    "source": {
      "type": "community",
      "id": "yankunytjatjara-people",
      "label": "Pueblo Yankunytjatjara"
    },
    "target": {
      "type": "author",
      "id": "ali-cobby-eckermann",
      "label": "Ali Cobby Eckermann"
    },
    "relationType": "cultural_reconnection",
    "mechanisms": [
      "indigenous-identity",
      "country",
      "stolen-generations",
      "ancestral-memory"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La reconexión de Ali Cobby Eckermann con su identidad Yankunytjatjara es central en su trayectoria y escritura."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-353-mediterranean-maalouf",
    "source": {
      "type": "tradition",
      "id": "mediterranean-francophone-literature",
      "label": "Literatura mediterránea francófona"
    },
    "target": {
      "type": "author",
      "id": "amin-maalouf",
      "label": "Amin Maalouf"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "mediterranean",
      "migration",
      "identity",
      "historical-fiction"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "La obra de Maalouf articula de forma recurrente historia mediterránea, migraciones e identidades múltiples."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-354-hebrew-modern-amos-oz",
    "source": {
      "type": "tradition",
      "id": "hebrew-modern-literature",
      "label": "Literatura hebrea moderna"
    },
    "target": {
      "type": "author",
      "id": "amos-oz",
      "label": "Amos Oz"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "hebrew-fiction",
      "israel",
      "family",
      "political-memory"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Amos Oz es una de las figuras centrales de la narrativa hebrea moderna israelí."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-355-soviet-collectivization-platonov",
    "source": {
      "type": "historical_event",
      "id": "soviet-collectivization",
      "label": "Colectivización soviética"
    },
    "target": {
      "type": "author",
      "id": "andrei-platonov",
      "label": "Andréi Platónov"
    },
    "relationType": "historical_context",
    "mechanisms": [
      "collectivization",
      "soviet-utopia",
      "famine",
      "bureaucracy"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "La colectivización soviética y sus contradicciones históricas constituyen un contexto decisivo de la narrativa de Platónov."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-356-indian-english-anita-desai",
    "source": {
      "type": "tradition",
      "id": "indian-english-fiction",
      "label": "Narrativa india en inglés"
    },
    "target": {
      "type": "author",
      "id": "anita-desai",
      "label": "Anita Desai"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "indian-english",
      "interiority",
      "family",
      "postcolonial-modernity"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Anita Desai es una figura central de la narrativa india moderna en inglés."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-357-bhopal-arundhati-roy",
    "source": {
      "type": "historical_event",
      "id": "bhopal-disaster",
      "label": "Desastre de Bhopal"
    },
    "target": {
      "type": "author",
      "id": "arundhati-roy",
      "label": "Arundhati Roy"
    },
    "relationType": "political_action",
    "mechanisms": [
      "corporate-power",
      "environment",
      "activism",
      "india"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "La escritura ensayística y activista de Arundhati Roy se inscribe en debates sobre poder corporativo, medio ambiente y violencia estructural en India."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-358-black-feminism-lorde",
    "source": {
      "type": "movement",
      "id": "black-feminist-literature",
      "label": "Literatura feminista negra"
    },
    "target": {
      "type": "author",
      "id": "audre-lorde",
      "label": "Audre Lorde"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "race",
      "gender",
      "sexuality",
      "poetry",
      "activism"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Audre Lorde es una figura fundamental del pensamiento y la literatura feminista negra."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-359-holocaust-sutzkever",
    "source": {
      "type": "historical_event",
      "id": "holocaust",
      "label": "Holocausto"
    },
    "target": {
      "type": "author",
      "id": "avrom-sutzkever",
      "label": "Avrom Sutzkever"
    },
    "relationType": "lived_historical_experience",
    "mechanisms": [
      "vilna-ghetto",
      "yiddish",
      "survival",
      "memory"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La experiencia de Sutzkever en el gueto de Vilna y su supervivencia durante el Holocausto son centrales en su obra."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-360-iranian-revolution-nafisi",
    "source": {
      "type": "historical_event",
      "id": "iranian-revolution-1979",
      "label": "Revolución iraní de 1979"
    },
    "target": {
      "type": "author",
      "id": "azar-nafisi",
      "label": "Azar Nafisi"
    },
    "relationType": "historical_context",
    "mechanisms": [
      "iran",
      "revolution",
      "censorship",
      "exile",
      "reading"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La Revolución iraní, la censura y el posterior exilio constituyen el contexto central de la obra ensayística de Azar Nafisi."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-361-japanese-contemporary-yoshimoto",
    "source": {
      "type": "tradition",
      "id": "japanese-contemporary-fiction",
      "label": "Narrativa japonesa contemporánea"
    },
    "target": {
      "type": "author",
      "id": "banana-yoshimoto",
      "label": "Banana Yoshimoto"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "contemporary-japan",
      "grief",
      "youth",
      "popular-literature"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Banana Yoshimoto es una figura destacada de la narrativa japonesa contemporánea."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-362-filipino-diaspora-santos",
    "source": {
      "type": "tradition",
      "id": "filipino-diaspora-literature",
      "label": "Literatura de la diáspora filipina"
    },
    "target": {
      "type": "author",
      "id": "bienvenido-santos",
      "label": "Bienvenido N. Santos"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "migration",
      "philippines",
      "united-states",
      "diaspora"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La experiencia migratoria entre Filipinas y Estados Unidos es uno de los ejes principales de la obra de Bienvenido Santos."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-363-kwani-wainaina",
    "source": {
      "type": "institution",
      "id": "kwani-trust",
      "label": "Kwani Trust"
    },
    "target": {
      "type": "author",
      "id": "binyavanga-wainaina",
      "label": "Binyavanga Wainaina"
    },
    "relationType": "institutional_mentorship",
    "mechanisms": [
      "kenyan-literature",
      "publishing",
      "new-african-writing",
      "literary-network"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Binyavanga Wainaina fue una figura clave en la fundación y desarrollo de Kwani?, plataforma decisiva para nuevas voces de África oriental."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-364-vietnam-war-bao-ninh",
    "source": {
      "type": "historical_event",
      "id": "vietnam-war",
      "label": "Guerra de Vietnam"
    },
    "target": {
      "type": "author",
      "id": "bao-ninh",
      "label": "Bảo Ninh"
    },
    "relationType": "lived_historical_experience",
    "mechanisms": [
      "war",
      "combat",
      "trauma",
      "memory"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "Bảo Ninh combatió durante la guerra y transformó esa experiencia en materia fundamental de su narrativa."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-365-modern-hebrew-bialik",
    "source": {
      "type": "movement",
      "id": "modern-hebrew-poetry",
      "label": "Poesía hebrea moderna"
    },
    "target": {
      "type": "author",
      "id": "bialik",
      "label": "Chaim Nachman Bialik"
    },
    "relationType": "movement_foundation",
    "mechanisms": [
      "hebrew-revival",
      "national-poetry",
      "modern-hebrew"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Bialik es una figura fundacional del renacimiento de la poesía hebrea moderna."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-366-generation45-chairil-anwar",
    "source": {
      "type": "movement",
      "id": "indonesian-generation-45",
      "label": "Generación del 45 indonesia"
    },
    "target": {
      "type": "author",
      "id": "chairil-anwar",
      "label": "Chairil Anwar"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "indonesian-modernism",
      "independence",
      "free-verse",
      "poetic-renewal"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Chairil Anwar es la figura emblemática de la Generación del 45 y de la renovación de la poesía indonesia moderna."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-367-victorian-novel-dickens",
    "source": {
      "type": "tradition",
      "id": "victorian-novel",
      "label": "Novela victoriana"
    },
    "target": {
      "type": "author",
      "id": "charles-dickens",
      "label": "Charles Dickens"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "victorian-england",
      "social-novel",
      "serialization",
      "urban-life"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Dickens es una de las figuras canónicas de la novela victoriana."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-368-victorian-women-charlotte-bronte",
    "source": {
      "type": "tradition",
      "id": "victorian-women-novel",
      "label": "Novela victoriana escrita por mujeres"
    },
    "target": {
      "type": "author",
      "id": "charlotte-bronte",
      "label": "Charlotte Brontë"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "victorian-fiction",
      "women-authorship",
      "gothic",
      "interiority"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Charlotte Brontë ocupa una posición fundamental en la novela victoriana escrita por mujeres."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-369-soviet-central-asia-aitmatov",
    "source": {
      "type": "historical_event",
      "id": "soviet-central-asia",
      "label": "Asia Central soviética"
    },
    "target": {
      "type": "author",
      "id": "chingiz-aitmatov",
      "label": "Chingiz Aitmatov"
    },
    "relationType": "historical_context",
    "mechanisms": [
      "kyrgyzstan",
      "soviet-modernity",
      "oral-tradition",
      "collective-memory"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "La tensión entre cultura kirguisa, tradición oral y modernidad soviética atraviesa la obra de Aitmatov."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-370-uruguayan-poetry-circe-maia",
    "source": {
      "type": "tradition",
      "id": "uruguayan-modern-poetry",
      "label": "Poesía uruguaya moderna"
    },
    "target": {
      "type": "author",
      "id": "circe-maia",
      "label": "Circe Maia"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "uruguay",
      "everyday-life",
      "clarity",
      "modern-lyric"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Circe Maia es una figura importante de la poesía uruguaya moderna."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-371-philippine-modern-bautista",
    "source": {
      "type": "tradition",
      "id": "philippine-modern-poetry",
      "label": "Poesía filipina moderna"
    },
    "target": {
      "type": "author",
      "id": "cirilo-bautista",
      "label": "Cirilo F. Bautista"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "philippines",
      "english-language",
      "formal-poetry",
      "modernism"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Cirilo F. Bautista es una figura central de la poesía filipina moderna en inglés."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-372-central-american-wars-alegria",
    "source": {
      "type": "historical_event",
      "id": "central-american-civil-wars",
      "label": "Guerras civiles centroamericanas"
    },
    "target": {
      "type": "author",
      "id": "claribel-alegria",
      "label": "Claribel Alegría"
    },
    "relationType": "historical_context",
    "mechanisms": [
      "nicaragua",
      "el-salvador",
      "war",
      "exile",
      "memory"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "Las guerras, dictaduras y desplazamientos de Centroamérica atraviesan profundamente la obra de Claribel Alegría."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-373-uruguayan-exile-peri-rossi",
    "source": {
      "type": "tradition",
      "id": "uruguayan-exile-literature",
      "label": "Literatura uruguaya del exilio"
    },
    "target": {
      "type": "author",
      "id": "cristina-peri-rossi",
      "label": "Cristina Peri Rossi"
    },
    "relationType": "lived_historical_experience",
    "mechanisms": [
      "dictatorship",
      "exile",
      "spain",
      "identity"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "El exilio provocado por la dictadura uruguaya constituye una experiencia central en la trayectoria de Cristina Peri Rossi."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-374-modern-hebrew-ravikovitch",
    "source": {
      "type": "tradition",
      "id": "modern-hebrew-poetry-tradition",
      "label": "Poesía hebrea moderna"
    },
    "target": {
      "type": "author",
      "id": "dahlia-ravikovitch",
      "label": "Dahlia Ravikovitch"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "hebrew-poetry",
      "israel",
      "politics",
      "intimate-lyric"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Dahlia Ravikovitch es una figura central de la poesía hebrea israelí moderna."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-375-african-diaspora-mengestu",
    "source": {
      "type": "tradition",
      "id": "african-diaspora-literature",
      "label": "Literatura africana de la diáspora"
    },
    "target": {
      "type": "author",
      "id": "dinaw-mengestu",
      "label": "Dinaw Mengestu"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "ethiopia",
      "migration",
      "united-states",
      "diaspora",
      "memory"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La experiencia etíope y migratoria constituye una dimensión fundamental de la narrativa de Dinaw Mengestu."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-376-italian-fantastic-buzzati",
    "source": {
      "type": "tradition",
      "id": "italian-fantastic-literature",
      "label": "Literatura fantástica italiana"
    },
    "target": {
      "type": "author",
      "id": "dino-buzzati",
      "label": "Dino Buzzati"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "fantastic-fiction",
      "allegory",
      "bureaucracy",
      "modern-italian-prose"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Buzzati ocupa una posición fundamental en la tradición fantástica y alegórica italiana del siglo XX."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-377-vietnam-war-duong-thu-huong",
    "source": {
      "type": "historical_event",
      "id": "vietnam-war",
      "label": "Guerra de Vietnam"
    },
    "target": {
      "type": "author",
      "id": "duong-thu-huong",
      "label": "Dương Thu Hương"
    },
    "relationType": "lived_historical_experience",
    "mechanisms": [
      "war",
      "communism",
      "disillusionment",
      "vietnam"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La experiencia de guerra y la posterior desilusión política son centrales en la vida y obra de Dương Thu Hương."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-378-haisla-eden-robinson",
    "source": {
      "type": "community",
      "id": "haisla-heiltsuk",
      "label": "Pueblos Haisla-Heiltsuk"
    },
    "target": {
      "type": "author",
      "id": "eden-robinson",
      "label": "Eden Robinson"
    },
    "relationType": "cultural_reconnection",
    "mechanisms": [
      "haisla",
      "heiltsuk",
      "family",
      "land",
      "indigenous-memory"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La herencia Haisla-Heiltsuk y las comunidades de la costa del Pacífico canadiense son fundamentales en la obra de Eden Robinson."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-379-philippine-english-edith-tiempo",
    "source": {
      "type": "tradition",
      "id": "philippine-english-literature",
      "label": "Literatura filipina en inglés"
    },
    "target": {
      "type": "author",
      "id": "edith-tiempo",
      "label": "Edith Tiempo"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "philippines",
      "english-language",
      "poetry",
      "fiction"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Edith Tiempo es una figura fundamental de la literatura filipina moderna en inglés."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-380-shanghai-modernism-eileen-chang",
    "source": {
      "type": "tradition",
      "id": "shanghai-modernism",
      "label": "Modernidad literaria de Shanghái"
    },
    "target": {
      "type": "author",
      "id": "eileen-chang",
      "label": "Eileen Chang"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "shanghai",
      "urban-modernity",
      "gender",
      "war"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Eileen Chang es una figura central de la modernidad literaria de Shanghái y de la narrativa china urbana del siglo XX."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-381-mexican-postrevolution-garro",
    "source": {
      "type": "movement",
      "id": "mexican-postrevolutionary-literature",
      "label": "Literatura mexicana posrevolucionaria"
    },
    "target": {
      "type": "author",
      "id": "elena-garro",
      "label": "Elena Garro"
    },
    "relationType": "formal_reinvention",
    "mechanisms": [
      "mexican-history",
      "memory",
      "fantastic-fiction",
      "political-violence"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Garro reelabora historia, memoria y violencia política mexicanas mediante procedimientos narrativos radicalmente innovadores."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-382-mexican-testimonial-poniatowska",
    "source": {
      "type": "tradition",
      "id": "mexican-testimonial-literature",
      "label": "Literatura testimonial mexicana"
    },
    "target": {
      "type": "author",
      "id": "elena-poniatowska",
      "label": "Elena Poniatowska"
    },
    "relationType": "document_to_fiction",
    "mechanisms": [
      "testimony",
      "oral-history",
      "mexico",
      "political-memory"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Poniatowska ha construido una parte esencial de su obra a partir del testimonio, la entrevista y la memoria colectiva mexicana."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-383-mununjali-van-neerven",
    "source": {
      "type": "community",
      "id": "mununjali-yugambeh",
      "label": "Pueblos Mununjali-Yugambeh"
    },
    "target": {
      "type": "author",
      "id": "ellen-van-neerven",
      "label": "Ellen van Neerven"
    },
    "relationType": "cultural_reconnection",
    "mechanisms": [
      "indigenous-identity",
      "country",
      "queer-writing",
      "aboriginal-literature"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La identidad Mununjali-Yugambeh forma parte esencial del trabajo literario de Ellen van Neerven."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-384-victorian-women-emily-bronte",
    "source": {
      "type": "tradition",
      "id": "victorian-women-novel",
      "label": "Novela victoriana escrita por mujeres"
    },
    "target": {
      "type": "author",
      "id": "emily-bronte",
      "label": "Emily Brontë"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "victorian-fiction",
      "gothic",
      "landscape",
      "women-authorship"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Emily Brontë ocupa una posición fundamental en la tradición de la novela victoriana escrita por mujeres."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-385-pacific-postcolonial-hauofa",
    "source": {
      "type": "tradition",
      "id": "pacific-postcolonial-literature",
      "label": "Literatura poscolonial del Pacífico"
    },
    "target": {
      "type": "author",
      "id": "epeli-hauofa",
      "label": "Epeli Hau'ofa"
    },
    "relationType": "canon_revision",
    "mechanisms": [
      "pacific",
      "ocean",
      "decolonization",
      "regional-identity"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Hau'ofa reformuló radicalmente la imaginación del Pacífico, rechazando su representación como conjunto de pequeñas islas aisladas."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-386-philippine-postcolonial-sionil-jose",
    "source": {
      "type": "tradition",
      "id": "philippine-postcolonial-literature",
      "label": "Literatura filipina poscolonial"
    },
    "target": {
      "type": "author",
      "id": "f-sionil-jose",
      "label": "F. Sionil José"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "philippines",
      "colonial-history",
      "class",
      "national-identity"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "F. Sionil José es una figura central de la narrativa filipina sobre colonialismo, desigualdad e identidad nacional."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-387-arab-women-diaspora-faqir",
    "source": {
      "type": "tradition",
      "id": "arab-women-diaspora-literature",
      "label": "Literatura árabe de mujeres en la diáspora"
    },
    "target": {
      "type": "author",
      "id": "fadia-faqir",
      "label": "Fadia Faqir"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "jordan",
      "migration",
      "gender",
      "diaspora"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "La obra de Fadia Faqir explora género, migración y experiencia árabe diaspórica."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-388-uruguayan-fantastic-felisberto",
    "source": {
      "type": "tradition",
      "id": "uruguayan-fantastic-literature",
      "label": "Literatura fantástica uruguaya"
    },
    "target": {
      "type": "author",
      "id": "felisberto-hernandez",
      "label": "Felisberto Hernández"
    },
    "relationType": "formal_reinvention",
    "mechanisms": [
      "fantastic-fiction",
      "objects",
      "memory",
      "uncanny"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Felisberto Hernández es una figura decisiva en la renovación de lo fantástico rioplatense."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-389-new-york-school-ohara",
    "source": {
      "type": "movement",
      "id": "new-york-school",
      "label": "New York School"
    },
    "target": {
      "type": "author",
      "id": "frank-ohara",
      "label": "Frank O'Hara"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "new-york",
      "poetry",
      "visual-arts",
      "urban-life"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Frank O'Hara es una de las figuras centrales de la New York School de poesía."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-390-victorian-novel-george-eliot",
    "source": {
      "type": "tradition",
      "id": "victorian-novel",
      "label": "Novela victoriana"
    },
    "target": {
      "type": "author",
      "id": "george-eliot",
      "label": "George Eliot"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "victorian-fiction",
      "realism",
      "psychology",
      "society"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "George Eliot es una de las figuras mayores de la novela realista victoriana."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-391-anishinaabe-vizenor",
    "source": {
      "type": "community",
      "id": "anishinaabe",
      "label": "Anishinaabe"
    },
    "target": {
      "type": "author",
      "id": "gerald-vizenor",
      "label": "Gerald Vizenor"
    },
    "relationType": "cultural_reconnection",
    "mechanisms": [
      "anishinaabe",
      "survivance",
      "indigenous-theory",
      "storytelling"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La tradición Anishinaabe y el concepto de survivance son fundamentales en la obra literaria y teórica de Gerald Vizenor."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-392-nakba-kanafani",
    "source": {
      "type": "historical_event",
      "id": "nakba-1948",
      "label": "Nakba de 1948"
    },
    "target": {
      "type": "author",
      "id": "ghassan-kanafani",
      "label": "Ghassan Kanafani"
    },
    "relationType": "lived_historical_experience",
    "mechanisms": [
      "palestine",
      "displacement",
      "refugee-experience",
      "resistance"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La Nakba, el desplazamiento palestino y la experiencia del refugio constituyen el núcleo histórico de la obra de Kanafani."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-393-nicaraguan-revolution-belli",
    "source": {
      "type": "historical_event",
      "id": "nicaraguan-revolution",
      "label": "Revolución nicaragüense"
    },
    "target": {
      "type": "author",
      "id": "gioconda-belli",
      "label": "Gioconda Belli"
    },
    "relationType": "political_action",
    "mechanisms": [
      "nicaragua",
      "revolution",
      "feminism",
      "political-poetry"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La participación de Gioconda Belli en el proceso revolucionario nicaragüense forma parte central de su trayectoria literaria."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-394-holocaust-bassani",
    "source": {
      "type": "historical_event",
      "id": "holocaust",
      "label": "Holocausto"
    },
    "target": {
      "type": "author",
      "id": "giorgio-bassani",
      "label": "Giorgio Bassani"
    },
    "relationType": "historical_context",
    "mechanisms": [
      "italian-jews",
      "fascism",
      "memory",
      "ferrara"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La persecución fascista de los judíos italianos y la memoria de Ferrara constituyen ejes fundamentales de la obra de Bassani."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-395-indonesian-essay-mohamad",
    "source": {
      "type": "tradition",
      "id": "indonesian-modern-essay",
      "label": "Ensayo indonesio moderno"
    },
    "target": {
      "type": "author",
      "id": "goenawan-mohamad",
      "label": "Goenawan Mohamad"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "indonesia",
      "essay",
      "journalism",
      "political-culture"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Goenawan Mohamad es una figura fundamental del ensayo, periodismo y debate intelectual indonesio contemporáneo."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-396-luo-oral-grace-ogot",
    "source": {
      "type": "tradition",
      "id": "luo-oral-tradition",
      "label": "Tradición oral luo"
    },
    "target": {
      "type": "author",
      "id": "grace-ogot",
      "label": "Grace Ogot"
    },
    "relationType": "oral_tradition",
    "mechanisms": [
      "luo",
      "oral-storytelling",
      "kenya",
      "folklore"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Grace Ogot incorporó de forma significativa relatos, estructuras y materiales de la tradición oral luo."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-397-iraqi-exile-blasim",
    "source": {
      "type": "tradition",
      "id": "iraqi-exile-literature",
      "label": "Literatura iraquí del exilio"
    },
    "target": {
      "type": "author",
      "id": "hassan-blasim",
      "label": "Hassan Blasim"
    },
    "relationType": "lived_historical_experience",
    "mechanisms": [
      "iraq",
      "war",
      "migration",
      "finland",
      "violence"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La guerra, el desplazamiento y el exilio entre Irak y Finlandia constituyen elementos fundamentales de la narrativa de Hassan Blasim."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-398-archaic-greek-hesiod",
    "source": {
      "type": "tradition",
      "id": "archaic-greek-poetry",
      "label": "Poesía griega arcaica"
    },
    "target": {
      "type": "author",
      "id": "hesiod",
      "label": "Hesíodo"
    },
    "relationType": "textual_tradition",
    "mechanisms": [
      "cosmogony",
      "didactic-poetry",
      "myth",
      "archaic-greece"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Hesíodo es una de las figuras fundamentales de la poesía griega arcaica y de la tradición cosmogónica occidental."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-399-lebanese-postwar-barakat",
    "source": {
      "type": "tradition",
      "id": "lebanese-postwar-literature",
      "label": "Literatura libanesa de posguerra"
    },
    "target": {
      "type": "author",
      "id": "hoda-barakat",
      "label": "Hoda Barakat"
    },
    "relationType": "historical_context",
    "mechanisms": [
      "lebanon",
      "civil-war",
      "exile",
      "memory"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "La guerra civil libanesa, sus secuelas y el exilio atraviesan profundamente la obra de Hoda Barakat."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-008-400-maori-renaissance-tuwhare",
    "source": {
      "type": "movement",
      "id": "maori-literary-renaissance",
      "label": "Renacimiento literario māorí"
    },
    "target": {
      "type": "author",
      "id": "hone-tuwhare",
      "label": "Hone Tuwhare"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "maori",
      "poetry",
      "language",
      "indigenous-modernity"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Hone Tuwhare es una figura fundamental de la literatura māorí moderna en Nueva Zelanda."
      }
    ],
    "confidence": "maximum"
  }
];
