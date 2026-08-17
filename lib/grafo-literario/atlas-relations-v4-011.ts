import type { AtlasMasterRelation } from "./relation-ontology";

/**
 * ATLAS UNIVERSAL DE LAS INFLUENCIAS
 * V4 · PAQUETE 011 · migración del pilot histórico
 */

export const atlasRelationsV4011: AtlasMasterRelation[] = [
  {
    "id": "v4-011-494-dante-borges",
    "source": {
      "type": "author",
      "id": "dante",
      "label": "Dante Alighieri"
    },
    "target": {
      "type": "author",
      "id": "borges",
      "label": "Jorge Luis Borges"
    },
    "relationType": "formative_reading",
    "mechanisms": [
      "Divina Comedia",
      "lectura reiterada",
      "ensayo",
      "memoria",
      "infinito"
    ],
    "evidence": [
      {
        "basis": "author_declared",
        "note": "Borges leyó y releyó durante décadas la Divina Comedia y dedicó a Dante los Nueve ensayos dantescos."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-011-495-kafka-camus",
    "source": {
      "type": "author",
      "id": "kafka",
      "label": "Franz Kafka"
    },
    "target": {
      "type": "author",
      "id": "camus",
      "label": "Albert Camus"
    },
    "relationType": "formative_reading",
    "mechanisms": [
      "lectura",
      "ensayo",
      "absurdo",
      "extrañamiento"
    ],
    "evidence": [
      {
        "basis": "work_level_intertext",
        "note": "Camus estudió directamente a Kafka y le dedicó el ensayo Hope and the Absurd in the Work of Franz Kafka."
      }
    ],
    "confidence": "maximum"
  },
  {
    "id": "v4-011-496-borges-eco",
    "source": {
      "type": "author",
      "id": "borges",
      "label": "Jorge Luis Borges"
    },
    "target": {
      "type": "author",
      "id": "eco",
      "label": "Umberto Eco"
    },
    "relationType": "critical_affinity",
    "mechanisms": [
      "biblioteca",
      "laberinto",
      "interpretación",
      "erudición",
      "conocimiento"
    ],
    "evidence": [
      {
        "basis": "scholarly_comparison",
        "note": "La crítica ha estudiado ampliamente el diálogo entre Borges y Eco alrededor de bibliotecas, laberintos, signos e interpretación."
      }
    ],
    "confidence": "high"
  },
  {
    "id": "v4-011-497-argentine-postwar-pizarnik",
    "source": {
      "type": "tradition",
      "id": "argentine-postwar-poetry",
      "label": "Poesía argentina de posguerra"
    },
    "target": {
      "type": "author",
      "id": "pizarnik",
      "label": "Alejandra Pizarnik"
    },
    "relationType": "genre_tradition",
    "mechanisms": [
      "poesía argentina",
      "posguerra",
      "concentración verbal",
      "silencio",
      "ausencia"
    ],
    "evidence": [
      {
        "basis": "historical_record",
        "note": "Pizarnik ocupa una posición fundamental en la poesía argentina de la segunda mitad del siglo XX."
      }
    ],
    "confidence": "high"
  }
];
