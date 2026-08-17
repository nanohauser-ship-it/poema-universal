import type { AtlasMasterRelation } from "./relation-ontology";

export const atlasRelationsV4004A: AtlasMasterRelation[] = [
  {
    "id": "v4-004-151-archaic-lyric-pindar",
    "source": {
      "type": "tradition",
      "id": "archaic-greek-lyric",
      "label": "Lírica griega arcaica"
    },
    "target": {
      "type": "author",
      "id": "pindar",
      "label": "Píndaro"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "epinician-ode",
      "choral-lyric"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Píndaro constituye una de las grandes figuras conservadas de la lírica coral griega arcaica."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-152-pindar-horace",
    "source": {
      "type": "author",
      "id": "pindar",
      "label": "Píndaro"
    },
    "target": {
      "type": "author",
      "id": "horacio",
      "label": "Horacio"
    },
    "relationType": "literary_influence",
    "mechanisms": [
      "ode",
      "greek-lyric-reception",
      "formal-model"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Horacio conoció, admiró y reelaboró modelos asociados a la lírica de Píndaro.",
        "sourceUrl": "https://www.ebsco.com/research-starters/history/greek-lyric-poet-pindar-dies"
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-004-153-stoicism-seneca",
    "source": {
      "type": "tradition",
      "id": "stoicism",
      "label": "Estoicismo"
    },
    "target": {
      "type": "author",
      "id": "seneca",
      "label": "Séneca"
    },
    "relationType": "disciplinary_influence",
    "mechanisms": [
      "ethics",
      "philosophy",
      "moral-prose"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Los escritos filosóficos de Séneca constituyen una de las formulaciones romanas fundamentales del estoicismo."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-154-abbasid-poetry-abu-nuwas",
    "source": {
      "type": "tradition",
      "id": "abbasid-poetry",
      "label": "Poesía abasí"
    },
    "target": {
      "type": "author",
      "id": "abu-nuwas",
      "label": "Abu Nuwas"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "court-poetry",
      "wine-poetry",
      "urban-poetics"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Abu Nuwas es una figura canónica de la poesía del periodo abasí."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-155-arabic-qasida-mutanabbi",
    "source": {
      "type": "tradition",
      "id": "arabic-qasida",
      "label": "Tradición árabe de la qaṣīda"
    },
    "target": {
      "type": "author",
      "id": "al-mutanabbi",
      "label": "Al-Mutanabbi"
    },
    "relationType": "formal_inheritance",
    "mechanisms": [
      "qasida",
      "panegyric",
      "classical-arabic-poetry"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Al-Mutanabbi desarrolla su poesía dentro de la gran tradición clásica de la qaṣīda árabe."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-156-medieval-france-christine",
    "source": {
      "type": "tradition",
      "id": "medieval-french-literature",
      "label": "Literatura francesa medieval"
    },
    "target": {
      "type": "author",
      "id": "christine-de-pizan",
      "label": "Christine de Pizan"
    },
    "relationType": "textual_tradition",
    "mechanisms": [
      "court-literature",
      "political-writing",
      "women-and-authorship"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Christine de Pizan escribe dentro del mundo cortesano y textual de la Francia bajomedieval."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-157-medieval-poetry-villon",
    "source": {
      "type": "tradition",
      "id": "medieval-french-poetry",
      "label": "Poesía francesa bajomedieval"
    },
    "target": {
      "type": "author",
      "id": "villon",
      "label": "François Villon"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "ballade",
      "personal-voice",
      "late-medieval-poetry"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Villon constituye una de las figuras mayores de la poesía francesa del final de la Edad Media."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-158-castilian-elegy-manrique",
    "source": {
      "type": "tradition",
      "id": "medieval-castilian-elegy",
      "label": "Elegía castellana medieval"
    },
    "target": {
      "type": "author",
      "id": "jorge-manrique",
      "label": "Jorge Manrique"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "elegy",
      "memento-mori",
      "coplas"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Las Coplas por la muerte de su padre constituyen un hito de la tradición elegíaca castellana."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-159-chivalric-epic-tasso",
    "source": {
      "type": "tradition",
      "id": "italian-chivalric-epic",
      "label": "Épica caballeresca italiana"
    },
    "target": {
      "type": "author",
      "id": "tasso",
      "label": "Torquato Tasso"
    },
    "relationType": "formal_inheritance",
    "mechanisms": [
      "epic",
      "chivalric-narrative",
      "renaissance-poetics"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Tasso recibe y transforma la tradición épico-caballeresca italiana del Renacimiento."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-160-golden-age-lope",
    "source": {
      "type": "movement",
      "id": "spanish-golden-age-theatre",
      "label": "Teatro del Siglo de Oro"
    },
    "target": {
      "type": "author",
      "id": "lope-vega",
      "label": "Lope de Vega"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "comedia-nueva",
      "dramatic-system",
      "popular-theatre"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Lope de Vega es una figura estructural en la formación de la comedia nueva del Siglo de Oro."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-161-conceptismo-quevedo",
    "source": {
      "type": "movement",
      "id": "conceptismo",
      "label": "Conceptismo"
    },
    "target": {
      "type": "author",
      "id": "quevedo",
      "label": "Francisco de Quevedo"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "wit",
      "semantic-density",
      "baroque-poetry"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Quevedo es una figura canónica de la tradición conceptista del Barroco español."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-162-french-classicism-la-fontaine",
    "source": {
      "type": "movement",
      "id": "french-classicism",
      "label": "Clasicismo francés"
    },
    "target": {
      "type": "author",
      "id": "la-fontaine",
      "label": "Jean de La Fontaine"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "fable",
      "seventeenth-century-france",
      "classical-models"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "La Fontaine forma parte del gran sistema literario del clasicismo francés del siglo XVII."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-163-french-classicism-moliere",
    "source": {
      "type": "movement",
      "id": "french-classicism",
      "label": "Clasicismo francés"
    },
    "target": {
      "type": "author",
      "id": "moliere",
      "label": "Molière"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "comedy",
      "satire",
      "seventeenth-century-france"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Molière es una figura central del teatro clásico francés."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-164-french-classicism-racine",
    "source": {
      "type": "movement",
      "id": "french-classicism",
      "label": "Clasicismo francés"
    },
    "target": {
      "type": "author",
      "id": "racine",
      "label": "Jean Racine"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "tragedy",
      "classical-unities",
      "seventeenth-century-france"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Racine constituye una de las expresiones mayores de la tragedia clásica francesa."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-165-haikai-basho",
    "source": {
      "type": "tradition",
      "id": "haikai-tradition",
      "label": "Tradición del haikai"
    },
    "target": {
      "type": "author",
      "id": "basho",
      "label": "Matsuo Bashō"
    },
    "relationType": "formal_reinvention",
    "mechanisms": [
      "hokku",
      "haikai",
      "travel-poetry"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Bashō elevó el haikai y el hokku a una posición central dentro de la tradición poética japonesa."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-166-basho-buson",
    "source": {
      "type": "author",
      "id": "basho",
      "label": "Matsuo Bashō"
    },
    "target": {
      "type": "author",
      "id": "buson",
      "label": "Yosa Buson"
    },
    "relationType": "literary_influence",
    "mechanisms": [
      "haikai",
      "literary-hero",
      "travel-model"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "Buson consideró a Bashō un gran referente literario y siguió deliberadamente su precedente.",
        "sourceUrl": "https://www.poetryfoundation.org/poets/yosa-buson"
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-167-haikai-issa",
    "source": {
      "type": "tradition",
      "id": "haikai-tradition",
      "label": "Tradición del haikai"
    },
    "target": {
      "type": "author",
      "id": "issa",
      "label": "Kobayashi Issa"
    },
    "relationType": "formal_inheritance",
    "mechanisms": [
      "hokku",
      "everyday-life",
      "classical-haikai"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Issa pertenece a la gran línea histórica del haikai japonés junto a Bashō y Buson."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-168-romanticism-victor-hugo",
    "source": {
      "type": "movement",
      "id": "romanticism",
      "label": "Romanticismo"
    },
    "target": {
      "type": "author",
      "id": "victor-hugo",
      "label": "Victor Hugo"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "french-romanticism",
      "drama",
      "poetry"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Victor Hugo es una de las figuras centrales del Romanticismo francés."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-169-romanticism-lermontov",
    "source": {
      "type": "movement",
      "id": "romanticism",
      "label": "Romanticismo"
    },
    "target": {
      "type": "author",
      "id": "lermontov",
      "label": "Mijaíl Lérmontov"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "russian-romanticism",
      "lyric",
      "byronic-hero"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Lérmontov ocupa una posición fundamental en el Romanticismo ruso."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-170-modern-drama-ibsen",
    "source": {
      "type": "movement",
      "id": "modern-drama",
      "label": "Drama moderno europeo"
    },
    "target": {
      "type": "author",
      "id": "ibsen",
      "label": "Henrik Ibsen"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "realist-drama",
      "social-conflict",
      "modern-stage"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Ibsen es una figura fundacional de la transformación moderna del drama europeo."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-171-modern-drama-strindberg",
    "source": {
      "type": "movement",
      "id": "modern-drama",
      "label": "Drama moderno europeo"
    },
    "target": {
      "type": "author",
      "id": "strindberg",
      "label": "August Strindberg"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "naturalism",
      "psychological-drama",
      "modern-stage"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Strindberg ocupa una posición decisiva en el desarrollo del drama moderno europeo."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-172-emerson-dickinson",
    "source": {
      "type": "author",
      "id": "emerson",
      "label": "Ralph Waldo Emerson"
    },
    "target": {
      "type": "author",
      "id": "dickinson",
      "label": "Emily Dickinson"
    },
    "relationType": "formative_reading",
    "mechanisms": [
      "american-thought",
      "poetic-independence",
      "nineteenth-century-reading"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "Los libros de Emerson formaban parte de la biblioteca y del horizonte intelectual de Dickinson.",
        "sourceUrl": "https://www.poetryfoundation.org/articles/70260/emily-dickinson-101"
      }
    ],
    "confidence": "high"
  },
  {
    "id": "v4-004-173-sterne-machado-assis",
    "source": {
      "type": "author",
      "id": "laurence-sterne",
      "label": "Laurence Sterne"
    },
    "target": {
      "type": "author",
      "id": "machado-assis",
      "label": "Machado de Assis"
    },
    "relationType": "literary_influence",
    "mechanisms": [
      "self-reflexive-fiction",
      "unreliable-narration",
      "narrative-digression"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "La influencia de Laurence Sterne sobre la narrativa madura de Machado de Assis está ampliamente reconocida.",
        "sourceUrl": "https://www.ebsco.com/research-starters/history/joaquim-maria-machado-de-assis"
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-174-baudelaire-verlaine",
    "source": {
      "type": "author",
      "id": "baudelaire",
      "label": "Charles Baudelaire"
    },
    "target": {
      "type": "author",
      "id": "verlaine",
      "label": "Paul Verlaine"
    },
    "relationType": "formative_reading",
    "mechanisms": [
      "modern-poetry",
      "symbolist-transition",
      "poetic-model"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "Verlaine admiró públicamente a Baudelaire y su primera colección evidencia esa recepción.",
        "sourceUrl": "https://www.poetryfoundation.org/poets/paul-verlaine"
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-175-modernismo-jose-marti",
    "source": {
      "type": "movement",
      "id": "modernismo-hispanoamericano",
      "label": "Modernismo hispanoamericano"
    },
    "target": {
      "type": "author",
      "id": "jose-marti",
      "label": "José Martí"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "latin-american-modernity",
      "poetry",
      "prose"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "José Martí es una figura fundacional del Modernismo hispanoamericano.",
        "sourceUrl": "https://www.loa.org/news-and-views/poet-and-revolutionary-jose-marti-on-walt-whitman-the-united-states-and-the-universal-i/"
      }
    ],
    "confidence": "maximum"
  }
];
