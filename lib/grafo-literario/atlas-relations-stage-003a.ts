import type { AtlasMasterRelation } from "./relation-ontology";

export const atlasRelationsV4003A: AtlasMasterRelation[] = [
  {
    "id": "v4-003-101-greek-tragedy-aeschylus",
    "source": {
      "type": "tradition",
      "id": "greek-tragedy",
      "label": "Tragedia griega"
    },
    "target": {
      "type": "author",
      "id": "aeschylus",
      "label": "Esquilo"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "attic-theatre",
      "dramatic-form"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Esquilo pertenece al núcleo histórico de la tragedia ática."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-102-greek-tragedy-sophocles",
    "source": {
      "type": "tradition",
      "id": "greek-tragedy",
      "label": "Tragedia griega"
    },
    "target": {
      "type": "author",
      "id": "sophocles",
      "label": "Sófocles"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "attic-theatre",
      "dramatic-form"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Sófocles es una figura canónica de la tragedia ática."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-103-greek-tragedy-euripides",
    "source": {
      "type": "tradition",
      "id": "greek-tragedy",
      "label": "Tragedia griega"
    },
    "target": {
      "type": "author",
      "id": "euripides",
      "label": "Eurípides"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "attic-theatre",
      "mythic-reworking"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Eurípides forma parte del núcleo conservado de la tragedia ática."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-104-old-comedy-aristophanes",
    "source": {
      "type": "tradition",
      "id": "old-attic-comedy",
      "label": "Comedia ática antigua"
    },
    "target": {
      "type": "author",
      "id": "aristophanes",
      "label": "Aristófanes"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "satire",
      "political-comedy"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Aristófanes es la principal figura conservada de la Comedia Antigua."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-105-plato-aristotle",
    "source": {
      "type": "author",
      "id": "plato",
      "label": "Platón"
    },
    "target": {
      "type": "author",
      "id": "aristotle",
      "label": "Aristóteles"
    },
    "relationType": "mentorship",
    "mechanisms": [
      "academy",
      "philosophical-education"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Aristóteles estudió durante años en la Academia de Platón."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-106-epicureanism-lucretius",
    "source": {
      "type": "tradition",
      "id": "epicureanism",
      "label": "Epicureísmo"
    },
    "target": {
      "type": "author",
      "id": "lucretius",
      "label": "Lucrecio"
    },
    "relationType": "disciplinary_influence",
    "mechanisms": [
      "atomism",
      "didactic-poetry"
    ],
    "evidence": [
      {
        "basis": "work_level_intertext",
        "note": "De rerum natura transmite poéticamente la filosofía epicúrea."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-107-roman-lyric-catullus",
    "source": {
      "type": "tradition",
      "id": "roman-lyric-tradition",
      "label": "Tradición lírica romana"
    },
    "target": {
      "type": "author",
      "id": "catullus",
      "label": "Catulo"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "latin-lyric",
      "personal-voice"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Catulo ocupa una posición central en la lírica latina tardorrepublicana."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-108-roman-elegy-ovid",
    "source": {
      "type": "tradition",
      "id": "roman-love-elegy",
      "label": "Elegía amorosa romana"
    },
    "target": {
      "type": "author",
      "id": "ovidio",
      "label": "Ovidio"
    },
    "relationType": "formal_inheritance",
    "mechanisms": [
      "love-elegy",
      "formal-reinvention"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Ovidio hereda y transforma la tradición elegíaca amorosa latina."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-109-ovid-chaucer",
    "source": {
      "type": "author",
      "id": "ovidio",
      "label": "Ovidio"
    },
    "target": {
      "type": "author",
      "id": "chaucer",
      "label": "Geoffrey Chaucer"
    },
    "relationType": "literary_influence",
    "mechanisms": [
      "classical-source",
      "mythic-material"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Chaucer utiliza repetidamente materiales y motivos procedentes de Ovidio."
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-003-110-dante-chaucer",
    "source": {
      "type": "author",
      "id": "dante",
      "label": "Dante Alighieri"
    },
    "target": {
      "type": "author",
      "id": "chaucer",
      "label": "Geoffrey Chaucer"
    },
    "relationType": "literary_influence",
    "mechanisms": [
      "italian-literature",
      "intertextual-reception"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Chaucer recibió intensamente la literatura italiana de Dante."
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-003-111-boccaccio-chaucer",
    "source": {
      "type": "author",
      "id": "boccaccio",
      "label": "Giovanni Boccaccio"
    },
    "target": {
      "type": "author",
      "id": "chaucer",
      "label": "Geoffrey Chaucer"
    },
    "relationType": "literary_influence",
    "mechanisms": [
      "italian-narrative",
      "storytelling"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Chaucer mantiene una relación textual extensa con la narrativa de Boccaccio."
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-003-112-petrarch-chaucer",
    "source": {
      "type": "author",
      "id": "petrarca",
      "label": "Francesco Petrarca"
    },
    "target": {
      "type": "author",
      "id": "chaucer",
      "label": "Geoffrey Chaucer"
    },
    "relationType": "literary_influence",
    "mechanisms": [
      "italian-humanism",
      "poetic-reception"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Petrarca forma parte del horizonte italiano documentado de Chaucer."
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-003-113-sufi-tradition-attar",
    "source": {
      "type": "tradition",
      "id": "sufi-tradition",
      "label": "Tradición sufí"
    },
    "target": {
      "type": "author",
      "id": "attar",
      "label": "Farid ud-Din Attar"
    },
    "relationType": "textual_tradition",
    "mechanisms": [
      "mysticism",
      "allegory"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Attar es una de las grandes figuras de la tradición literaria sufí."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-114-attar-rumi",
    "source": {
      "type": "author",
      "id": "attar",
      "label": "Farid ud-Din Attar"
    },
    "target": {
      "type": "author",
      "id": "rumi",
      "label": "Rumi"
    },
    "relationType": "literary_influence",
    "mechanisms": [
      "sufi-poetry",
      "mystical-thought"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Attar constituye un antecedente espiritual y poético fundamental de Rumi."
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-003-115-sufi-tradition-ibn-arabi",
    "source": {
      "type": "tradition",
      "id": "sufi-tradition",
      "label": "Tradición sufí"
    },
    "target": {
      "type": "author",
      "id": "ibn-arabi",
      "label": "Ibn Arabi"
    },
    "relationType": "textual_tradition",
    "mechanisms": [
      "mysticism",
      "metaphysics"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Ibn Arabi es una figura mayor de la tradición intelectual y mística sufí."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-116-chinese-pastoral-tao-yuanming",
    "source": {
      "type": "tradition",
      "id": "chinese-pastoral-poetry",
      "label": "Poesía pastoral china"
    },
    "target": {
      "type": "author",
      "id": "tao-yuanming",
      "label": "Tao Yuanming"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "reclusion",
      "rural-life",
      "nature"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Tao Yuanming es una figura fundacional de la poesía china de retiro y vida rural."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-117-chinese-pastoral-wang-wei",
    "source": {
      "type": "tradition",
      "id": "chinese-pastoral-poetry",
      "label": "Poesía pastoral china"
    },
    "target": {
      "type": "author",
      "id": "wang-wei",
      "label": "Wang Wei"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "nature",
      "landscape-poetry"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Wang Wei ocupa una posición central en la poesía china de paisaje y contemplación."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-118-tang-poetry-li-bai",
    "source": {
      "type": "tradition",
      "id": "tang-poetry",
      "label": "Poesía de la dinastía Tang"
    },
    "target": {
      "type": "author",
      "id": "li-bai",
      "label": "Li Bai"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "tang-lyric",
      "poetic-canon"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Li Bai es una figura canónica de la poesía Tang."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-119-tang-poetry-du-fu",
    "source": {
      "type": "tradition",
      "id": "tang-poetry",
      "label": "Poesía de la dinastía Tang"
    },
    "target": {
      "type": "author",
      "id": "du-fu",
      "label": "Du Fu"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "regulated-verse",
      "historical-consciousness"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Du Fu es una figura fundamental del canon poético Tang."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-120-li-bai-du-fu",
    "source": {
      "type": "author",
      "id": "li-bai",
      "label": "Li Bai"
    },
    "target": {
      "type": "author",
      "id": "du-fu",
      "label": "Du Fu"
    },
    "relationType": "friendship",
    "mechanisms": [
      "personal-meeting",
      "poetic-admiration"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "Li Bai y Du Fu se conocieron personalmente y Du Fu escribió sobre Li Bai."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-121-tang-poetry-bai-juyi",
    "source": {
      "type": "tradition",
      "id": "tang-poetry",
      "label": "Poesía de la dinastía Tang"
    },
    "target": {
      "type": "author",
      "id": "bai-juyi",
      "label": "Bai Juyi"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "tang-poetry",
      "social-poetry"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Bai Juyi pertenece a la gran tradición poética Tang."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-122-persian-epic-ferdowsi",
    "source": {
      "type": "tradition",
      "id": "persian-epic-tradition",
      "label": "Tradición épica persa"
    },
    "target": {
      "type": "author",
      "id": "ferdowsi",
      "label": "Ferdousí"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "epic",
      "cultural-memory"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "El Shahnameh constituye una monumental elaboración de la tradición épica iraní."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-123-persian-ghazal-saadi",
    "source": {
      "type": "tradition",
      "id": "persian-ghazal-tradition",
      "label": "Tradición persa del ghazal"
    },
    "target": {
      "type": "author",
      "id": "saadi",
      "label": "Saadi"
    },
    "relationType": "formal_inheritance",
    "mechanisms": [
      "ghazal",
      "persian-lyric"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Saadi ocupa una posición canónica en el desarrollo de la lírica persa."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-124-persian-ghazal-hafez",
    "source": {
      "type": "tradition",
      "id": "persian-ghazal-tradition",
      "label": "Tradición persa del ghazal"
    },
    "target": {
      "type": "author",
      "id": "hafez",
      "label": "Hafez"
    },
    "relationType": "formal_inheritance",
    "mechanisms": [
      "ghazal",
      "formal-reinvention"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Hafez constituye una de las culminaciones históricas de la tradición persa del ghazal."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-125-persian-rubai-khayyam",
    "source": {
      "type": "tradition",
      "id": "persian-rubai-tradition",
      "label": "Tradición persa del rubāʿī"
    },
    "target": {
      "type": "author",
      "id": "omar-khayyam",
      "label": "Omar Jayyam"
    },
    "relationType": "formal_inheritance",
    "mechanisms": [
      "rubai",
      "quatrain"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "La recepción poética de Omar Jayyam está históricamente asociada al rubāʿī persa."
      }
    ],
    "confidence": "very_high"
  }
];
