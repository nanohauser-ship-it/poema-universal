import type { AtlasMasterRelation } from "./relation-ontology";

export const atlasRelationsV4003B: AtlasMasterRelation[] = [
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
