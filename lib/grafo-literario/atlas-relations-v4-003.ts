import type { AtlasMasterRelation } from "./relation-ontology";

/**
 * ATLAS UNIVERSAL DE LAS INFLUENCIAS
 * V4 · PAQUETE 003 · relaciones 101–150
 */

export const atlasRelationsV4003: AtlasMasterRelation[] = [
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
  },
  {
    "id": "v4-003-126-petrarchism-garcilaso",
    "source": {
      "type": "movement",
      "id": "petrarchism",
      "label": "Petrarquismo"
    },
    "target": {
      "type": "author",
      "id": "garcilaso",
      "label": "Garcilaso de la Vega"
    },
    "relationType": "formal_inheritance",
    "mechanisms": [
      "sonnet",
      "italian-metre",
      "renaissance-lyric"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Garcilaso es una figura decisiva de la recepción petrarquista en castellano."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-127-petrarchism-ronsard",
    "source": {
      "type": "movement",
      "id": "petrarchism",
      "label": "Petrarquismo"
    },
    "target": {
      "type": "author",
      "id": "ronsard",
      "label": "Pierre de Ronsard"
    },
    "relationType": "formal_inheritance",
    "mechanisms": [
      "sonnet",
      "love-lyric"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Ronsard participa directamente de la recepción renacentista de Petrarca."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-128-petrarchism-du-bellay",
    "source": {
      "type": "movement",
      "id": "petrarchism",
      "label": "Petrarquismo"
    },
    "target": {
      "type": "author",
      "id": "du-bellay",
      "label": "Joachim du Bellay"
    },
    "relationType": "formal_inheritance",
    "mechanisms": [
      "sonnet",
      "renaissance-lyric"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Du Bellay forma parte de la expansión francesa del modelo petrarquista."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-129-petrarchism-camoes",
    "source": {
      "type": "movement",
      "id": "petrarchism",
      "label": "Petrarquismo"
    },
    "target": {
      "type": "author",
      "id": "camoes",
      "label": "Luís de Camões"
    },
    "relationType": "formal_inheritance",
    "mechanisms": [
      "sonnet",
      "portuguese-petrarchism"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "La lírica de Camões participa de la tradición petrarquista europea."
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-003-130-pleiade-ronsard",
    "source": {
      "type": "movement",
      "id": "la-pleiade",
      "label": "La Pléiade"
    },
    "target": {
      "type": "author",
      "id": "ronsard",
      "label": "Pierre de Ronsard"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "renaissance-humanism",
      "french-language-renewal"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Ronsard fue una figura central de La Pléiade."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-131-pleiade-du-bellay",
    "source": {
      "type": "movement",
      "id": "la-pleiade",
      "label": "La Pléiade"
    },
    "target": {
      "type": "author",
      "id": "du-bellay",
      "label": "Joachim du Bellay"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "renaissance-humanism",
      "french-language-renewal"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Du Bellay fue una figura central de La Pléiade."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-132-teresa-san-juan",
    "source": {
      "type": "author",
      "id": "teresa-avila",
      "label": "Teresa de Ávila"
    },
    "target": {
      "type": "author",
      "id": "san-juan-cruz",
      "label": "San Juan de la Cruz"
    },
    "relationType": "friendship",
    "mechanisms": [
      "carmelite-reform",
      "spiritual-dialogue"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Teresa y San Juan colaboraron estrechamente en la reforma carmelitana."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-133-spanish-mysticism-fray-luis",
    "source": {
      "type": "tradition",
      "id": "spanish-mysticism",
      "label": "Mística española"
    },
    "target": {
      "type": "author",
      "id": "fray-luis",
      "label": "Fray Luis de León"
    },
    "relationType": "textual_tradition",
    "mechanisms": [
      "biblical-poetry",
      "contemplation"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Fray Luis se integra en el gran campo espiritual y contemplativo del siglo XVI español."
      }
    ],
    "confidence": "high"
  },
  {
    "id": "v4-003-134-ariosto-cervantes",
    "source": {
      "type": "author",
      "id": "ariosto",
      "label": "Ludovico Ariosto"
    },
    "target": {
      "type": "author",
      "id": "cervantes",
      "label": "Miguel de Cervantes"
    },
    "relationType": "literary_influence",
    "mechanisms": [
      "chivalric-romance",
      "irony"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Ariosto forma parte del horizonte caballeresco italiano recibido y transformado por Cervantes."
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-003-135-cervantes-flaubert",
    "source": {
      "type": "author",
      "id": "cervantes",
      "label": "Miguel de Cervantes"
    },
    "target": {
      "type": "author",
      "id": "flaubert",
      "label": "Gustave Flaubert"
    },
    "relationType": "formative_reading",
    "mechanisms": [
      "don-quixote",
      "novelistic-model",
      "irony"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La admiración de Flaubert por Don Quijote está ampliamente documentada."
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-003-136-gongora-lorca",
    "source": {
      "type": "author",
      "id": "gongora",
      "label": "Luis de Góngora"
    },
    "target": {
      "type": "author",
      "id": "lorca",
      "label": "Federico García Lorca"
    },
    "relationType": "critical_response",
    "mechanisms": [
      "generation-of-27",
      "baroque-recovery"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Lorca participó activamente en la recuperación moderna de Góngora."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-137-metaphysical-donne",
    "source": {
      "type": "movement",
      "id": "metaphysical-poetry",
      "label": "Poesía metafísica inglesa"
    },
    "target": {
      "type": "author",
      "id": "john-donne",
      "label": "John Donne"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "metaphysical-conceit",
      "argumentative-lyric"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Donne es la figura central de la tradición posteriormente denominada poesía metafísica."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-138-donne-eliot",
    "source": {
      "type": "author",
      "id": "john-donne",
      "label": "John Donne"
    },
    "target": {
      "type": "author",
      "id": "eliot",
      "label": "T. S. Eliot"
    },
    "relationType": "critical_response",
    "mechanisms": [
      "modernist-revaluation",
      "canon-reformation"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Los ensayos de Eliot fueron decisivos en la rehabilitación moderna de Donne y los metafísicos."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-139-milton-blake",
    "source": {
      "type": "author",
      "id": "milton",
      "label": "John Milton"
    },
    "target": {
      "type": "author",
      "id": "william-blake",
      "label": "William Blake"
    },
    "relationType": "literary_influence",
    "mechanisms": [
      "epic-imagination",
      "biblical-poetics"
    ],
    "evidence": [
      {
        "basis": "work_level_intertext",
        "note": "Blake mantiene un diálogo explícito y sostenido con Milton."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-140-milton-wordsworth",
    "source": {
      "type": "author",
      "id": "milton",
      "label": "John Milton"
    },
    "target": {
      "type": "author",
      "id": "wordsworth",
      "label": "William Wordsworth"
    },
    "relationType": "literary_influence",
    "mechanisms": [
      "english-poetic-tradition",
      "blank-verse"
    ],
    "evidence": [
      {
        "basis": "work_level_intertext",
        "note": "Wordsworth invoca explícitamente a Milton y dialoga con su legado."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-141-goethe-schiller",
    "source": {
      "type": "author",
      "id": "goethe",
      "label": "Johann Wolfgang von Goethe"
    },
    "target": {
      "type": "author",
      "id": "schiller",
      "label": "Friedrich Schiller"
    },
    "relationType": "friendship",
    "mechanisms": [
      "correspondence",
      "weimar-classicism",
      "mutual-reading"
    ],
    "evidence": [
      {
        "basis": "correspondence",
        "note": "Goethe y Schiller mantuvieron una intensa amistad y correspondencia intelectual."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-142-romanticism-blake",
    "source": {
      "type": "movement",
      "id": "romanticism",
      "label": "Romanticismo"
    },
    "target": {
      "type": "author",
      "id": "william-blake",
      "label": "William Blake"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "visionary-poetry",
      "imagination"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Blake ocupa una posición central, aunque singular, en el Romanticismo británico."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-143-romanticism-wordsworth",
    "source": {
      "type": "movement",
      "id": "romanticism",
      "label": "Romanticismo"
    },
    "target": {
      "type": "author",
      "id": "wordsworth",
      "label": "William Wordsworth"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "nature",
      "ordinary-language"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Wordsworth es una figura fundacional del Romanticismo inglés."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-144-romanticism-coleridge",
    "source": {
      "type": "movement",
      "id": "romanticism",
      "label": "Romanticismo"
    },
    "target": {
      "type": "author",
      "id": "coleridge",
      "label": "Samuel Taylor Coleridge"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "imagination",
      "supernatural"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Coleridge es una figura central de la primera generación romántica inglesa."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-145-romanticism-byron",
    "source": {
      "type": "movement",
      "id": "romanticism",
      "label": "Romanticismo"
    },
    "target": {
      "type": "author",
      "id": "byron",
      "label": "Lord Byron"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "byronic-hero",
      "romantic-individualism"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Byron es uno de los poetas emblemáticos del Romanticismo europeo."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-146-romanticism-shelley",
    "source": {
      "type": "movement",
      "id": "romanticism",
      "label": "Romanticismo"
    },
    "target": {
      "type": "author",
      "id": "shelley",
      "label": "Percy Bysshe Shelley"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "radicalism",
      "imagination"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Shelley es una figura central del Romanticismo inglés."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-147-romanticism-novalis",
    "source": {
      "type": "movement",
      "id": "romanticism",
      "label": "Romanticismo"
    },
    "target": {
      "type": "author",
      "id": "novalis",
      "label": "Novalis"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "german-romanticism",
      "fragment",
      "mysticism"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Novalis pertenece al núcleo del primer Romanticismo alemán."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-148-romanticism-holderlin",
    "source": {
      "type": "movement",
      "id": "romanticism",
      "label": "Romanticismo"
    },
    "target": {
      "type": "author",
      "id": "holderlin",
      "label": "Friedrich Hölderlin"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "german-romanticism",
      "classical-reception"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Hölderlin ocupa un lugar fundamental en el horizonte del Romanticismo alemán."
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-003-149-emerson-whitman",
    "source": {
      "type": "author",
      "id": "emerson",
      "label": "Ralph Waldo Emerson"
    },
    "target": {
      "type": "author",
      "id": "whitman",
      "label": "Walt Whitman"
    },
    "relationType": "literary_influence",
    "mechanisms": [
      "transcendentalism",
      "american-poetic-vocation"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "La admiración de Whitman hacia Emerson fue decisiva en el contexto de Leaves of Grass."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-003-150-yeats-tagore",
    "source": {
      "type": "author",
      "id": "yeats",
      "label": "W. B. Yeats"
    },
    "target": {
      "type": "author",
      "id": "tagore",
      "label": "Rabindranath Tagore"
    },
    "relationType": "editorial_mediation",
    "mechanisms": [
      "gitanjali",
      "introduction",
      "international-circulation"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Yeats escribió la introducción a la edición inglesa de Gitanjali y contribuyó a su recepción internacional."
      }
    ],
    "confidence": "maximum"
  }
];
