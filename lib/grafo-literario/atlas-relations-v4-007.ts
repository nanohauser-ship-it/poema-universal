import type { AtlasMasterRelation } from "./relation-ontology";

/**
 * ATLAS UNIVERSAL DE LAS INFLUENCIAS
 * V4 · PAQUETE 007 · relaciones 301–350
 */

export const atlasRelationsV4007: AtlasMasterRelation[] = [
  {
    "id": "v4-007-301-caribbean-postcolonial-naipaul",
    "source": {
      "type": "tradition",
      "id": "caribbean-postcolonial-literature",
      "label": "Literatura caribeña poscolonial"
    },
    "target": {
      "type": "author",
      "id": "vs-naipaul",
      "label": "V. S. Naipaul"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "colonialism",
      "migration",
      "caribbean-history",
      "postcolonial-fiction"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Naipaul ocupa una posición central en la narrativa caribeña y poscolonial de lengua inglesa."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-302-modern-persian-forugh",
    "source": {
      "type": "movement",
      "id": "modern-persian-poetry",
      "label": "Poesía persa moderna"
    },
    "target": {
      "type": "author",
      "id": "forugh-farrokhzad",
      "label": "Forugh Farrokhzad"
    },
    "relationType": "formal_reinvention",
    "mechanisms": [
      "modern-persian-poetry",
      "female-voice",
      "free-verse",
      "modernity"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Forugh Farrokhzad es una de las figuras decisivas de la renovación de la poesía persa del siglo XX."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-303-indian-english-kamala-das",
    "source": {
      "type": "tradition",
      "id": "indian-english-poetry",
      "label": "Poesía india en inglés"
    },
    "target": {
      "type": "author",
      "id": "kamala-das",
      "label": "Kamala Das"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "indian-english",
      "confessional-poetry",
      "female-subjectivity"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Kamala Das es una figura fundamental de la poesía india moderna en lengua inglesa."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-304-yoruba-soyinka",
    "source": {
      "type": "oral_tradition",
      "id": "yoruba-oral-tradition",
      "label": "Tradición oral yoruba"
    },
    "target": {
      "type": "author",
      "id": "wole-soyinka",
      "label": "Wole Soyinka"
    },
    "relationType": "oral_tradition",
    "mechanisms": [
      "yoruba-myth",
      "ritual",
      "theatre",
      "oral-memory"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "La dramaturgia y la escritura de Soyinka incorporan profundamente mitología, ritual y tradiciones yoruba."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-305-yugoslav-postwar-kis",
    "source": {
      "type": "tradition",
      "id": "yugoslav-postwar-literature",
      "label": "Literatura yugoslava de posguerra"
    },
    "target": {
      "type": "author",
      "id": "danilo-kis",
      "label": "Danilo Kiš"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "memory",
      "totalitarianism",
      "central-europe",
      "postwar-prose"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Danilo Kiš constituye una figura central de la literatura yugoslava y centroeuropea de posguerra."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-306-nigerian-modernism-jp-clark",
    "source": {
      "type": "movement",
      "id": "nigerian-modernist-poetry",
      "label": "Poesía modernista nigeriana"
    },
    "target": {
      "type": "author",
      "id": "jp-clark",
      "label": "J. P. Clark"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "modernism",
      "nigerian-poetry",
      "oral-rhythm",
      "postcolonial-literature"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "J. P. Clark pertenece a la generación fundamental de la poesía nigeriana moderna."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-307-ewe-oral-awoonor",
    "source": {
      "type": "oral_tradition",
      "id": "ewe-oral-tradition",
      "label": "Tradición oral ewe"
    },
    "target": {
      "type": "author",
      "id": "kofi-awoonor",
      "label": "Kofi Awoonor"
    },
    "relationType": "oral_tradition",
    "mechanisms": [
      "ewe-dirge",
      "oral-poetry",
      "ancestral-memory",
      "ghana"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Kofi Awoonor incorporó a su poesía estructuras y ritmos vinculados a la tradición oral ewe."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-308-algerian-war-djebar",
    "source": {
      "type": "historical_event",
      "id": "algerian-war-independence",
      "label": "Guerra de Independencia de Argelia"
    },
    "target": {
      "type": "author",
      "id": "assia-djebar",
      "label": "Assia Djebar"
    },
    "relationType": "lived_historical_experience",
    "mechanisms": [
      "colonialism",
      "independence",
      "women",
      "memory",
      "language"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La guerra de independencia argelina y sus consecuencias atraviesan profundamente la obra de Assia Djebar."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-309-communist-albania-kadare",
    "source": {
      "type": "historical_event",
      "id": "communist-albania",
      "label": "Albania comunista"
    },
    "target": {
      "type": "author",
      "id": "ismail-kadare",
      "label": "Ismail Kadare"
    },
    "relationType": "historical_context",
    "mechanisms": [
      "totalitarianism",
      "censorship",
      "albanian-history",
      "political-allegory"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "La experiencia del régimen comunista albanés constituye un contexto central de la narrativa de Kadare."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-310-prague-spring-havel",
    "source": {
      "type": "historical_event",
      "id": "prague-spring-1968",
      "label": "Primavera de Praga de 1968"
    },
    "target": {
      "type": "author",
      "id": "vaclav-havel",
      "label": "Václav Havel"
    },
    "relationType": "political_dissidence",
    "mechanisms": [
      "dissent",
      "censorship",
      "theatre",
      "civil-resistance"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La represión posterior a la Primavera de Praga fue decisiva en la evolución de Havel como dramaturgo y disidente."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-311-apartheid-bessie-head",
    "source": {
      "type": "historical_event",
      "id": "apartheid",
      "label": "Apartheid"
    },
    "target": {
      "type": "author",
      "id": "bessie-head",
      "label": "Bessie Head"
    },
    "relationType": "lived_historical_experience",
    "mechanisms": [
      "racial-classification",
      "exile",
      "botswana",
      "identity"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La experiencia racial sudafricana y el posterior exilio en Botsuana marcaron profundamente la obra de Bessie Head."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-312-australian-modern-poetry-les-murray",
    "source": {
      "type": "tradition",
      "id": "australian-modern-poetry",
      "label": "Poesía australiana moderna"
    },
    "target": {
      "type": "author",
      "id": "les-murray",
      "label": "Les Murray"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "rural-australia",
      "landscape",
      "vernacular",
      "modern-poetry"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Les Murray es una de las figuras centrales de la poesía australiana contemporánea."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-313-african-decolonization-ngugi",
    "source": {
      "type": "movement",
      "id": "african-decolonization",
      "label": "Descolonización africana"
    },
    "target": {
      "type": "author",
      "id": "ngugi",
      "label": "Ngũgĩ wa Thiong'o"
    },
    "relationType": "language_reclamation",
    "mechanisms": [
      "gikuyu",
      "decolonization",
      "language-politics",
      "anti-colonialism"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Ngũgĩ convirtió la descolonización cultural y lingüística en uno de los ejes centrales de su obra y pensamiento."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-314-african-postcolonial-armah",
    "source": {
      "type": "tradition",
      "id": "african-postcolonial-novel",
      "label": "Novela africana poscolonial"
    },
    "target": {
      "type": "author",
      "id": "ayi-kwei-armah",
      "label": "Ayi Kwei Armah"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "postcolonial-state",
      "disillusionment",
      "ghana",
      "modern-african-fiction"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Ayi Kwei Armah es una figura importante de la novela africana poscolonial."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-315-african-feminism-aidoo",
    "source": {
      "type": "tradition",
      "id": "african-feminist-literature",
      "label": "Literatura feminista africana"
    },
    "target": {
      "type": "author",
      "id": "ama-ata-aidoo",
      "label": "Ama Ata Aidoo"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "women",
      "ghana",
      "postcolonialism",
      "gender"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Ama Ata Aidoo es una de las figuras fundamentales de la literatura africana moderna centrada en género y experiencia femenina."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-316-division-korea-hwang-sok-yong",
    "source": {
      "type": "historical_event",
      "id": "division-of-korea",
      "label": "División de Corea"
    },
    "target": {
      "type": "author",
      "id": "hwang-sok-yong",
      "label": "Hwang Sok-yong"
    },
    "relationType": "historical_context",
    "mechanisms": [
      "division",
      "war",
      "industrialization",
      "political-history"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "La división de Corea y sus consecuencias históricas constituyen un eje recurrente de la obra de Hwang Sok-yong."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-317-diaspora-ondaatje",
    "source": {
      "type": "tradition",
      "id": "diasporic-literature",
      "label": "Literatura de la diáspora"
    },
    "target": {
      "type": "author",
      "id": "michael-ondaatje",
      "label": "Michael Ondaatje"
    },
    "relationType": "multilingual_formation",
    "mechanisms": [
      "sri-lanka",
      "migration",
      "canada",
      "memory",
      "hybrid-identity"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La trayectoria entre Sri Lanka, Inglaterra y Canadá forma parte esencial del horizonte cultural de Ondaatje."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-318-australian-postcolonial-carey",
    "source": {
      "type": "tradition",
      "id": "australian-postcolonial-fiction",
      "label": "Narrativa australiana poscolonial"
    },
    "target": {
      "type": "author",
      "id": "peter-carey",
      "label": "Peter Carey"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "australian-history",
      "colonial-memory",
      "national-myth",
      "fiction"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Peter Carey ha reelaborado de forma recurrente mitos e historias de la identidad australiana."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-319-african-feminism-emecheta",
    "source": {
      "type": "tradition",
      "id": "african-feminist-literature",
      "label": "Literatura feminista africana"
    },
    "target": {
      "type": "author",
      "id": "buchi-emecheta",
      "label": "Buchi Emecheta"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "women",
      "migration",
      "nigeria",
      "gender",
      "motherhood"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Buchi Emecheta es una figura central de la literatura africana y diaspórica sobre la experiencia de las mujeres."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-320-brazilian-concrete-leminski",
    "source": {
      "type": "movement",
      "id": "brazilian-concrete-poetry",
      "label": "Poesía concreta brasileña"
    },
    "target": {
      "type": "author",
      "id": "leminski",
      "label": "Paulo Leminski"
    },
    "relationType": "formal_inheritance",
    "mechanisms": [
      "concrete-poetry",
      "visual-language",
      "brevity",
      "experimental-poetry"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "La escritura de Leminski dialoga profundamente con la tradición concreta y experimental brasileña."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-321-maghrebi-ben-jelloun",
    "source": {
      "type": "tradition",
      "id": "francophone-maghrebi-literature",
      "label": "Literatura magrebí francófona"
    },
    "target": {
      "type": "author",
      "id": "tahar-ben-jelloun",
      "label": "Tahar Ben Jelloun"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "morocco",
      "francophone-writing",
      "migration",
      "identity"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Tahar Ben Jelloun es una de las figuras internacionales más destacadas de la literatura magrebí francófona."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-322-maori-renaissance-ihimaera",
    "source": {
      "type": "movement",
      "id": "maori-literary-renaissance",
      "label": "Renacimiento literario māorí"
    },
    "target": {
      "type": "author",
      "id": "witi-ihimaera",
      "label": "Witi Ihimaera"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "maori-identity",
      "indigenous-writing",
      "cultural-reclamation",
      "new-zealand"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Witi Ihimaera es una figura fundamental en la emergencia moderna de la literatura māorí publicada."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-323-polish-postwar-zagajewski",
    "source": {
      "type": "tradition",
      "id": "polish-postwar-poetry",
      "label": "Poesía polaca de posguerra"
    },
    "target": {
      "type": "author",
      "id": "adam-zagajewski",
      "label": "Adam Zagajewski"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "history",
      "exile",
      "memory",
      "polish-poetry"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Zagajewski pertenece a la gran tradición polaca de poesía de posguerra y disidencia intelectual."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-324-somali-postcolonial-farah",
    "source": {
      "type": "tradition",
      "id": "somali-postcolonial-literature",
      "label": "Literatura somalí poscolonial"
    },
    "target": {
      "type": "author",
      "id": "nuruddin-farah",
      "label": "Nuruddin Farah"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "somalia",
      "dictatorship",
      "gender",
      "exile",
      "postcolonial-fiction"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Nuruddin Farah es una figura central de la literatura somalí moderna y poscolonial."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-325-francophone-africa-labou-tansi",
    "source": {
      "type": "tradition",
      "id": "francophone-african-postcolonial-literature",
      "label": "Literatura africana francófona poscolonial"
    },
    "target": {
      "type": "author",
      "id": "sony-labou-tansi",
      "label": "Sony Labou Tansi"
    },
    "relationType": "language_transformation",
    "mechanisms": [
      "francophone-africa",
      "dictatorship",
      "grotesque",
      "political-fiction"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Sony Labou Tansi transformó radicalmente la prosa francófona africana mediante una escritura política, grotesca y experimental."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-326-apartheid-zakes-mda",
    "source": {
      "type": "historical_event",
      "id": "apartheid",
      "label": "Apartheid"
    },
    "target": {
      "type": "author",
      "id": "zakes-mda",
      "label": "Zakes Mda"
    },
    "relationType": "historical_context",
    "mechanisms": [
      "apartheid",
      "theatre",
      "post-apartheid",
      "south-africa"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "La experiencia del apartheid y de la transición sudafricana constituye un contexto fundamental de la obra de Zakes Mda."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-327-misty-poets-bei-dao",
    "source": {
      "type": "movement",
      "id": "misty-poets",
      "label": "Poetas Brumosos"
    },
    "target": {
      "type": "author",
      "id": "bei-dao",
      "label": "Bei Dao"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "misty-poetry",
      "china",
      "dissidence",
      "modern-poetry"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Bei Dao es una de las figuras centrales del movimiento conocido como los Poetas Brumosos."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-328-yugoslav-wars-ugresic",
    "source": {
      "type": "historical_event",
      "id": "yugoslav-wars",
      "label": "Guerras yugoslavas"
    },
    "target": {
      "type": "author",
      "id": "dubravka-ugresic",
      "label": "Dubravka Ugrešić"
    },
    "relationType": "lived_historical_experience",
    "mechanisms": [
      "war",
      "nationalism",
      "exile",
      "memory"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "Las guerras yugoslavas y el nacionalismo de los años noventa marcaron directamente la vida, el exilio y la escritura de Ugrešić."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-329-caribbean-women-kincaid",
    "source": {
      "type": "tradition",
      "id": "caribbean-women-writing",
      "label": "Escritura caribeña de mujeres"
    },
    "target": {
      "type": "author",
      "id": "jamaica-kincaid",
      "label": "Jamaica Kincaid"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "colonialism",
      "mother-daughter",
      "caribbean",
      "migration"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Kincaid es una figura central de la escritura caribeña contemporánea sobre colonialismo, género y migración."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-330-pinochet-zurita",
    "source": {
      "type": "historical_event",
      "id": "pinochet-dictatorship",
      "label": "Dictadura de Pinochet"
    },
    "target": {
      "type": "author",
      "id": "zurita",
      "label": "Raúl Zurita"
    },
    "relationType": "lived_historical_experience",
    "mechanisms": [
      "dictatorship",
      "torture",
      "memory",
      "chilean-poetry"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La dictadura chilena y la represión sufrida por Zurita atraviesan profundamente su obra poética."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-331-romanian-communism-herta-muller",
    "source": {
      "type": "historical_event",
      "id": "romanian-communism",
      "label": "Comunismo rumano"
    },
    "target": {
      "type": "author",
      "id": "herta-muller",
      "label": "Herta Müller"
    },
    "relationType": "lived_historical_experience",
    "mechanisms": [
      "dictatorship",
      "surveillance",
      "minority-language",
      "exile"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La dictadura rumana, la vigilancia política y la pertenencia a la minoría alemana son centrales en la obra de Herta Müller."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-332-hungarian-postwar-krasznahorkai",
    "source": {
      "type": "tradition",
      "id": "hungarian-postwar-literature",
      "label": "Literatura húngara de posguerra"
    },
    "target": {
      "type": "author",
      "id": "laszlo-krasznahorkai",
      "label": "László Krasznahorkai"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "hungarian-prose",
      "late-socialism",
      "apocalypse",
      "long-sentence"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Krasznahorkai es una figura central de la prosa húngara tardía y postsocialista."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-333-korean-feminist-kim-hyesoon",
    "source": {
      "type": "movement",
      "id": "korean-feminist-poetry",
      "label": "Poesía feminista coreana"
    },
    "target": {
      "type": "author",
      "id": "kim-hyesoon",
      "label": "Kim Hyesoon"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "body",
      "gender",
      "violence",
      "experimental-poetry"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Kim Hyesoon es una de las voces fundamentales de la poesía feminista y experimental contemporánea de Corea."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-334-indian-ocean-ghosh",
    "source": {
      "type": "tradition",
      "id": "indian-ocean-literature",
      "label": "Literatura del océano Índico"
    },
    "target": {
      "type": "author",
      "id": "amitav-ghosh",
      "label": "Amitav Ghosh"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "migration",
      "empire",
      "oceanic-history",
      "climate"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "La historia del océano Índico, las migraciones y las redes imperiales son ejes centrales de la obra de Amitav Ghosh."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-335-misty-poets-gu-cheng",
    "source": {
      "type": "movement",
      "id": "misty-poets",
      "label": "Poetas Brumosos"
    },
    "target": {
      "type": "author",
      "id": "gu-cheng",
      "label": "Gu Cheng"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "misty-poetry",
      "china",
      "lyric-experiment",
      "post-mao"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Gu Cheng fue una de las figuras principales de los Poetas Brumosos chinos."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-336-nigerian-magical-realism-okri",
    "source": {
      "type": "tradition",
      "id": "nigerian-magical-realism",
      "label": "Realismo mágico nigeriano"
    },
    "target": {
      "type": "author",
      "id": "ben-okri",
      "label": "Ben Okri"
    },
    "relationType": "formal_reinvention",
    "mechanisms": [
      "spirit-world",
      "postcolonialism",
      "myth",
      "nigerian-fiction"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Ben Okri combina tradición oral, mundo espiritual y narrativa poscolonial en una forma singular de realismo fantástico nigeriano."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-337-korean-contemporary-shin-kyung-sook",
    "source": {
      "type": "tradition",
      "id": "korean-contemporary-fiction",
      "label": "Narrativa coreana contemporánea"
    },
    "target": {
      "type": "author",
      "id": "shin-kyung-sook",
      "label": "Shin Kyung-sook"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "family",
      "memory",
      "urbanization",
      "korean-society"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Shin Kyung-sook es una figura destacada de la narrativa coreana contemporánea sobre memoria, familia y transformación social."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-338-gwangju-han-kang",
    "source": {
      "type": "historical_event",
      "id": "gwangju-uprising",
      "label": "Levantamiento de Gwangju"
    },
    "target": {
      "type": "author",
      "id": "han-kang",
      "label": "Han Kang"
    },
    "relationType": "historical_trauma_transformation",
    "mechanisms": [
      "gwangju",
      "state-violence",
      "memory",
      "body"
    ],
    "evidence": [
      {
        "basis": "work_level_intertext",
        "note": "El levantamiento de Gwangju y su represión constituyen el núcleo histórico de Human Acts y una referencia esencial en la obra de Han Kang."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-339-hebrew-modern-yehoshua",
    "source": {
      "type": "tradition",
      "id": "hebrew-modern-literature",
      "label": "Literatura hebrea moderna"
    },
    "target": {
      "type": "author",
      "id": "ab-yehoshua",
      "label": "A. B. Yehoshua"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "hebrew-fiction",
      "israel",
      "identity",
      "family"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "A. B. Yehoshua es una de las figuras centrales de la narrativa hebrea moderna israelí."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-340-soviet-central-asia-qodiriy",
    "source": {
      "type": "historical_event",
      "id": "soviet-central-asia",
      "label": "Asia Central soviética"
    },
    "target": {
      "type": "author",
      "id": "abdulla-qodiriy",
      "label": "Abdulla Qodiriy"
    },
    "relationType": "historical_context",
    "mechanisms": [
      "uzbek-modernity",
      "soviet-rule",
      "national-literature",
      "repression"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Qodiriy fue una figura fundacional de la narrativa uzbeka moderna y su trayectoria quedó marcada por la represión soviética."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-341-colonial-zanzibar-gurnah",
    "source": {
      "type": "historical_event",
      "id": "colonial-zanzibar",
      "label": "Zanzíbar colonial"
    },
    "target": {
      "type": "author",
      "id": "abdulrazak-gurnah",
      "label": "Abdulrazak Gurnah"
    },
    "relationType": "historical_context",
    "mechanisms": [
      "colonialism",
      "refugee-experience",
      "migration",
      "east-africa"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La historia colonial de Zanzíbar, el desplazamiento y la migración son ejes fundamentales de la obra de Gurnah."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-342-apartheid-dangor",
    "source": {
      "type": "historical_event",
      "id": "apartheid",
      "label": "Apartheid"
    },
    "target": {
      "type": "author",
      "id": "achmat-dangor",
      "label": "Achmat Dangor"
    },
    "relationType": "historical_context",
    "mechanisms": [
      "apartheid",
      "race",
      "memory",
      "south-africa"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "El apartheid y sus consecuencias sociales constituyen un contexto central de la obra de Achmat Dangor."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-343-angolan-independence-neto",
    "source": {
      "type": "movement",
      "id": "angolan-independence",
      "label": "Independencia de Angola"
    },
    "target": {
      "type": "author",
      "id": "agostinho-neto",
      "label": "Agostinho Neto"
    },
    "relationType": "political_action",
    "mechanisms": [
      "anti-colonialism",
      "angola",
      "nationalism",
      "poetry"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Agostinho Neto vinculó directamente poesía, militancia anticolonial e independencia angoleña."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-344-holocaust-appelfeld",
    "source": {
      "type": "historical_event",
      "id": "holocaust",
      "label": "Holocausto"
    },
    "target": {
      "type": "author",
      "id": "aaharon-appelfeld",
      "label": "Aharon Appelfeld"
    },
    "relationType": "lived_historical_experience",
    "mechanisms": [
      "holocaust",
      "survival",
      "memory",
      "displacement"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La experiencia infantil del Holocausto, la huida y el desplazamiento constituyen el núcleo vital de la obra de Appelfeld."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-345-turkish-modernism-tanpinar",
    "source": {
      "type": "tradition",
      "id": "turkish-modernism",
      "label": "Modernismo turco"
    },
    "target": {
      "type": "author",
      "id": "ahmet-hamdi-tanpinar",
      "label": "Ahmet Hamdi Tanpınar"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "ottoman-modernity",
      "time",
      "identity",
      "turkish-prose"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Tanpınar es una figura fundamental de la modernidad literaria turca y del conflicto entre herencia otomana y modernización."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-346-francophone-congo-mabanckou",
    "source": {
      "type": "tradition",
      "id": "francophone-congolese-literature",
      "label": "Literatura congoleña francófona"
    },
    "target": {
      "type": "author",
      "id": "alain-mabanckou",
      "label": "Alain Mabanckou"
    },
    "relationType": "language_transformation",
    "mechanisms": [
      "francophone-africa",
      "congo",
      "diaspora",
      "oral-language"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Mabanckou es una figura destacada de la literatura congoleña francófona y de la diáspora africana."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-347-pacific-postcolonial-wendt",
    "source": {
      "type": "tradition",
      "id": "pacific-postcolonial-literature",
      "label": "Literatura poscolonial del Pacífico"
    },
    "target": {
      "type": "author",
      "id": "albert-wendt",
      "label": "Albert Wendt"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "samoa",
      "pacific",
      "decolonization",
      "indigenous-modernity"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Albert Wendt es una figura fundamental de la literatura poscolonial y moderna del Pacífico."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-348-italian-postwar-moravia",
    "source": {
      "type": "tradition",
      "id": "italian-postwar-fiction",
      "label": "Narrativa italiana de posguerra"
    },
    "target": {
      "type": "author",
      "id": "alberto-moravia",
      "label": "Alberto Moravia"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "bourgeoisie",
      "fascism",
      "alienation",
      "italian-fiction"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Moravia ocupa una posición central en la narrativa italiana del siglo XX y de la posguerra."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-349-soviet-repression-solzhenitsyn",
    "source": {
      "type": "historical_event",
      "id": "soviet-repression",
      "label": "Represión soviética"
    },
    "target": {
      "type": "author",
      "id": "solzhenitsyn",
      "label": "Aleksandr Solzhenitsyn"
    },
    "relationType": "lived_historical_experience",
    "mechanisms": [
      "gulag",
      "repression",
      "dissidence",
      "testimony"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "El encarcelamiento, el Gulag y la represión soviética constituyen la experiencia central de la obra de Solzhenitsyn."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-007-350-waanyi-alexis-wright",
    "source": {
      "type": "community",
      "id": "waanyi-people",
      "label": "Pueblo Waanyi"
    },
    "target": {
      "type": "author",
      "id": "alexis-wright",
      "label": "Alexis Wright"
    },
    "relationType": "land_based_knowledge",
    "mechanisms": [
      "waanyi",
      "country",
      "indigenous-sovereignty",
      "oral-memory"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La identidad Waanyi, el territorio y el conocimiento indígena de Country son fundamentales en la escritura de Alexis Wright."
      }
    ],
    "confidence": "maximum"
  }
];
