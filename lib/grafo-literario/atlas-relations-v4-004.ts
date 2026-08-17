import type { AtlasMasterRelation } from "./relation-ontology";

/**
 * ATLAS UNIVERSAL DE LAS INFLUENCIAS
 * V4 · PAQUETE 004 · relaciones 151–200
 */

export const atlasRelationsV4004: AtlasMasterRelation[] = [
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
  },
  {
    "id": "v4-004-176-symbolism-rimbaud",
    "source": {
      "type": "movement",
      "id": "simbolismo",
      "label": "Simbolismo"
    },
    "target": {
      "type": "author",
      "id": "rimbaud",
      "label": "Arthur Rimbaud"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "symbolist-poetics",
      "modern-poetry",
      "visionary-language"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Rimbaud ocupa una posición fundacional en la constelación histórica del simbolismo francés."
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-004-177-alexandria-cavafis",
    "source": {
      "type": "place",
      "id": "alexandria",
      "label": "Alejandría"
    },
    "target": {
      "type": "author",
      "id": "cavafis",
      "label": "Constantino Cavafis"
    },
    "relationType": "shared_historical_space",
    "mechanisms": [
      "urban-memory",
      "hellenistic-history",
      "cosmopolitanism"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "Alejandría constituye el espacio biográfico, histórico e imaginario central de la obra de Cavafis."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-178-generation98-unamuno",
    "source": {
      "type": "movement",
      "id": "generation-98",
      "label": "Generación del 98"
    },
    "target": {
      "type": "author",
      "id": "unamuno",
      "label": "Miguel de Unamuno"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "spanish-crisis",
      "identity",
      "philosophical-literature"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Unamuno es una de las figuras centrales asociadas a la Generación del 98."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-179-modernismo-ruben-dario",
    "source": {
      "type": "movement",
      "id": "modernismo-hispanoamericano",
      "label": "Modernismo hispanoamericano"
    },
    "target": {
      "type": "author",
      "id": "ruben-dario",
      "label": "Rubén Darío"
    },
    "relationType": "movement_foundation",
    "mechanisms": [
      "metrical-renewal",
      "cosmopolitanism",
      "poetic-language"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Rubén Darío constituye la figura central en la consolidación y expansión del Modernismo hispanoamericano."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-180-ruskin-proust",
    "source": {
      "type": "author",
      "id": "john-ruskin",
      "label": "John Ruskin"
    },
    "target": {
      "type": "author",
      "id": "proust",
      "label": "Marcel Proust"
    },
    "relationType": "translation_mediated_reception",
    "mechanisms": [
      "translation",
      "aesthetics",
      "art-criticism"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "Proust estudió intensamente a Ruskin y tradujo al francés varias de sus obras."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-181-symbolism-eguren",
    "source": {
      "type": "movement",
      "id": "simbolismo",
      "label": "Simbolismo"
    },
    "target": {
      "type": "author",
      "id": "eguren",
      "label": "José María Eguren"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "symbolist-poetry",
      "imagery",
      "musicality"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Eguren constituye una de las expresiones más importantes del simbolismo poético peruano."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-182-verlaine-antonio-machado",
    "source": {
      "type": "author",
      "id": "verlaine",
      "label": "Paul Verlaine"
    },
    "target": {
      "type": "author",
      "id": "antonio-machado",
      "label": "Antonio Machado"
    },
    "relationType": "formative_reading",
    "mechanisms": [
      "symbolism",
      "modern-french-poetry",
      "early-formation"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "El descubrimiento de Verlaine durante las estancias parisinas de Machado fue importante en su formación poética."
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-004-183-tolstoy-rilke",
    "source": {
      "type": "author",
      "id": "tolstoy",
      "label": "Lev Tolstói"
    },
    "target": {
      "type": "author",
      "id": "rilke",
      "label": "Rainer Maria Rilke"
    },
    "relationType": "formative_reading",
    "mechanisms": [
      "russian-spirituality",
      "personal-encounter",
      "russian-journeys"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "Rilke viajó a Rusia, leyó intensamente su literatura y conoció personalmente a Tolstói."
      }
    ],
    "confidence": "high"
  },
  {
    "id": "v4-004-184-goethe-thomas-mann",
    "source": {
      "type": "author",
      "id": "goethe",
      "label": "Johann Wolfgang von Goethe"
    },
    "target": {
      "type": "author",
      "id": "thomas-mann",
      "label": "Thomas Mann"
    },
    "relationType": "literary_influence",
    "mechanisms": [
      "german-canon",
      "bildungsroman",
      "cultural-model"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Goethe constituye uno de los grandes precedentes literarios y culturales de Thomas Mann."
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-004-185-walser-kafka",
    "source": {
      "type": "author",
      "id": "walser",
      "label": "Robert Walser"
    },
    "target": {
      "type": "author",
      "id": "kafka",
      "label": "Franz Kafka"
    },
    "relationType": "formative_reading",
    "mechanisms": [
      "short-prose",
      "modernist-prose",
      "literary-admiration"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "Kafka conoció y admiró la obra de Robert Walser, cuya prosa forma parte de su horizonte de lectura."
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-004-186-buddhism-han-yong-un",
    "source": {
      "type": "religious_tradition",
      "id": "buddhism",
      "label": "Budismo"
    },
    "target": {
      "type": "author",
      "id": "han-yong-un",
      "label": "Han Yong-un"
    },
    "relationType": "textual_tradition",
    "mechanisms": [
      "zen-buddhism",
      "spiritual-poetry",
      "religious-thought"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "Han Yong-un fue monje budista y su pensamiento religioso atraviesa profundamente su producción literaria."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-187-cubism-apollinaire",
    "source": {
      "type": "movement",
      "id": "cubism",
      "label": "Cubismo"
    },
    "target": {
      "type": "author",
      "id": "apollinaire",
      "label": "Guillaume Apollinaire"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "visual-arts-network",
      "avant-garde",
      "calligram"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Apollinaire estuvo estrechamente ligado a los artistas cubistas y fue uno de sus principales mediadores críticos."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-188-hindi-urdu-realism-premchand",
    "source": {
      "type": "tradition",
      "id": "hindi-urdu-realism",
      "label": "Realismo hindi-urdu"
    },
    "target": {
      "type": "author",
      "id": "premchand",
      "label": "Premchand"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "social-realism",
      "village-life",
      "colonial-india"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Premchand es una figura fundacional del realismo social moderno en hindi y urdu."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-189-nietzsche-musil",
    "source": {
      "type": "author",
      "id": "friedrich-nietzsche",
      "label": "Friedrich Nietzsche"
    },
    "target": {
      "type": "author",
      "id": "musil",
      "label": "Robert Musil"
    },
    "relationType": "formative_reading",
    "mechanisms": [
      "modernity",
      "psychology",
      "philosophical-fiction"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Nietzsche pertenece al horizonte filosófico decisivo de la formación intelectual de Musil."
      }
    ],
    "confidence": "high"
  },
  {
    "id": "v4-004-190-ruben-dario-juan-ramon",
    "source": {
      "type": "author",
      "id": "ruben-dario",
      "label": "Rubén Darío"
    },
    "target": {
      "type": "author",
      "id": "juan-ramon-jimenez",
      "label": "Juan Ramón Jiménez"
    },
    "relationType": "literary_influence",
    "mechanisms": [
      "modernismo",
      "metrical-renewal",
      "lyric-modernity"
    ],
    "evidence": [
      {
        "basis": "biographical",
        "note": "Juan Ramón Jiménez recibió tempranamente la influencia del Modernismo y mantuvo relación directa con Rubén Darío."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-191-gogol-lu-xun",
    "source": {
      "type": "author",
      "id": "gogol",
      "label": "Nikolái Gógol"
    },
    "target": {
      "type": "author",
      "id": "lu-xun",
      "label": "Lu Xun"
    },
    "relationType": "literary_influence",
    "mechanisms": [
      "diary-of-a-madman",
      "satire",
      "modern-short-fiction"
    ],
    "evidence": [
      {
        "basis": "work_level_intertext",
        "note": "El relato Diario de un loco de Lu Xun dialoga explícitamente con el precedente homónimo de Gógol."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-192-modernism-woolf",
    "source": {
      "type": "movement",
      "id": "modernism",
      "label": "Modernismo internacional"
    },
    "target": {
      "type": "author",
      "id": "woolf",
      "label": "Virginia Woolf"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "stream-of-consciousness",
      "bloomsbury",
      "formal-experiment"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Virginia Woolf es una figura central del modernismo literario anglófono."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-193-imagism-pound",
    "source": {
      "type": "movement",
      "id": "imagism",
      "label": "Imagismo"
    },
    "target": {
      "type": "author",
      "id": "ezra-pound",
      "label": "Ezra Pound"
    },
    "relationType": "movement_foundation",
    "mechanisms": [
      "image",
      "economy",
      "free-verse"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Ezra Pound desempeñó un papel central en la formulación y difusión temprana del Imagismo."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-194-modernism-broch",
    "source": {
      "type": "movement",
      "id": "modernism",
      "label": "Modernismo internacional"
    },
    "target": {
      "type": "author",
      "id": "broch",
      "label": "Hermann Broch"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "modernist-novel",
      "polyphony",
      "crisis-of-values"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Broch pertenece al núcleo de la novela modernista centroeuropea."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-195-modernism-marianne-moore",
    "source": {
      "type": "movement",
      "id": "modernism",
      "label": "Modernismo internacional"
    },
    "target": {
      "type": "author",
      "id": "marianne-moore",
      "label": "Marianne Moore"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "precision",
      "syllabic-verse",
      "american-modernism"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Marianne Moore es una de las figuras mayores del modernismo poético estadounidense."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-196-french-modernism-saint-john-perse",
    "source": {
      "type": "movement",
      "id": "french-modernism",
      "label": "Modernidad poética francesa"
    },
    "target": {
      "type": "author",
      "id": "saint-john-perse",
      "label": "Saint-John Perse"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "long-poem",
      "modern-lyric",
      "exile"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Saint-John Perse ocupa una posición central en la poesía francesa moderna del siglo XX."
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-004-197-ibsen-oneill",
    "source": {
      "type": "author",
      "id": "ibsen",
      "label": "Henrik Ibsen"
    },
    "target": {
      "type": "author",
      "id": "eugene-oneill",
      "label": "Eugene O'Neill"
    },
    "relationType": "literary_influence",
    "mechanisms": [
      "modern-drama",
      "realism",
      "family-conflict"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Ibsen constituye uno de los grandes precedentes europeos de la dramaturgia moderna desarrollada por O'Neill."
      }
    ],
    "confidence": "very_high"
  },
  {
    "id": "v4-004-198-portuguese-modernism-pessoa",
    "source": {
      "type": "movement",
      "id": "portuguese-modernism",
      "label": "Modernismo portugués"
    },
    "target": {
      "type": "author",
      "id": "pessoa",
      "label": "Fernando Pessoa"
    },
    "relationType": "movement_foundation",
    "mechanisms": [
      "heteronyms",
      "orpheu",
      "avant-garde"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Pessoa es una figura fundamental en la formación del modernismo portugués."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-199-acmeism-akhmatova",
    "source": {
      "type": "movement",
      "id": "acmeism",
      "label": "Acmeísmo"
    },
    "target": {
      "type": "author",
      "id": "akhmatova",
      "label": "Anna Ajmátova"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "clarity",
      "concreteness",
      "russian-modernism"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Ajmátova fue una de las figuras centrales del movimiento acmeísta ruso."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-004-200-postmodernismo-mistral",
    "source": {
      "type": "movement",
      "id": "postmodernismo-hispanoamericano",
      "label": "Postmodernismo hispanoamericano"
    },
    "target": {
      "type": "author",
      "id": "mistral",
      "label": "Gabriela Mistral"
    },
    "relationType": "movement_membership",
    "mechanisms": [
      "postmodernismo",
      "lyric-intimacy",
      "american-poetry"
    ],
    "evidence": [
      {
        "basis": "scholarly_consensus",
        "note": "Gabriela Mistral suele situarse dentro de la fase postmodernista posterior al gran Modernismo hispanoamericano."
      }
    ],
    "confidence": "very_high"
  }
];
