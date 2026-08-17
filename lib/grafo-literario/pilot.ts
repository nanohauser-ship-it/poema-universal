import type { LiteraryGraph } from "./types";

export const literaryPilot: LiteraryGraph = {
  authors: [
    {
      id: "homer",
      name: "Homero",
      country: "Grecia",
      language: ["griego antiguo"],
      description:
        "Figura fundacional de la tradición épica occidental.",
      concepts: ["viaje", "guerra", "regreso", "memoria", "heroísmo"],
    },
    {
      id: "dante",
      name: "Dante Alighieri",
      birth: 1265,
      death: 1321,
      country: "Italia",
      language: ["italiano"],
      movement: ["Edad Media"],
      description:
        "Poeta cuya obra articula viaje, visión, moral, política y arquitectura del más allá.",
      concepts: ["viaje", "infierno", "memoria", "amor", "trascendencia"],
    },
    {
      id: "shakespeare",
      name: "William Shakespeare",
      birth: 1564,
      death: 1616,
      country: "Inglaterra",
      language: ["inglés"],
      movement: ["Renacimiento"],
      description:
        "Dramaturgo y poeta central en la configuración moderna del personaje, el conflicto y la conciencia.",
      concepts: ["poder", "deseo", "identidad", "muerte", "traición"],
    },
    {
      id: "poe",
      name: "Edgar Allan Poe",
      birth: 1809,
      death: 1849,
      country: "Estados Unidos",
      language: ["inglés"],
      movement: ["Romanticismo", "Gótico"],
      description:
        "Poeta y narrador decisivo para la literatura fantástica, detectivesca y de lo siniestro.",
      concepts: ["doble", "muerte", "obsesión", "sueño", "terror"],
    },
    {
      id: "baudelaire",
      name: "Charles Baudelaire",
      birth: 1821,
      death: 1867,
      country: "Francia",
      language: ["francés"],
      movement: ["Modernidad poética", "Simbolismo"],
      description:
        "Figura central de la modernidad poética europea.",
      concepts: ["ciudad", "belleza", "decadencia", "deseo", "muerte"],
    },
    {
      id: "kafka",
      name: "Franz Kafka",
      birth: 1883,
      death: 1924,
      country: "Praga",
      language: ["alemán"],
      movement: ["Modernismo"],
      description:
        "Narrador fundamental de la alienación, la culpa, la burocracia y el extrañamiento moderno.",
      concepts: ["laberinto", "culpa", "poder", "transformación", "absurdo"],
    },
    {
      id: "woolf",
      name: "Virginia Woolf",
      birth: 1882,
      death: 1941,
      country: "Reino Unido",
      language: ["inglés"],
      movement: ["Modernismo"],
      description:
        "Figura central de la renovación narrativa y de la exploración de la conciencia.",
      concepts: ["tiempo", "memoria", "conciencia", "identidad", "cotidiano"],
    },
    {
      id: "borges",
      name: "Jorge Luis Borges",
      birth: 1899,
      death: 1986,
      country: "Argentina",
      language: ["español"],
      movement: ["Vanguardia", "Literatura fantástica"],
      description:
        "Escritor decisivo en la literatura del siglo XX, especialmente en torno al infinito, la memoria y las ficciones intelectuales.",
      concepts: ["laberinto", "infinito", "doble", "memoria", "biblioteca"],
    },
    {
      id: "camus",
      name: "Albert Camus",
      birth: 1913,
      death: 1960,
      country: "Argelia / Francia",
      language: ["francés"],
      movement: ["Literatura del absurdo"],
      description:
        "Escritor y ensayista centrado en el absurdo, la rebelión, la responsabilidad y la condición humana.",
      concepts: ["absurdo", "rebelión", "muerte", "responsabilidad", "exilio"],
      nobelYear: 1957,
    },
    {
      id: "pizarnik",
      name: "Alejandra Pizarnik",
      birth: 1936,
      death: 1972,
      country: "Argentina",
      language: ["español"],
      description:
        "Poeta de extrema concentración verbal alrededor del silencio, el cuerpo, la infancia y la ausencia.",
      concepts: ["silencio", "cuerpo", "infancia", "muerte", "ausencia"],
    },
    {
      id: "garcia-marquez",
      name: "Gabriel García Márquez",
      birth: 1927,
      death: 2014,
      country: "Colombia",
      language: ["español"],
      movement: ["Boom latinoamericano"],
      description:
        "Narrador central de la literatura latinoamericana contemporánea.",
      concepts: ["memoria", "soledad", "familia", "violencia", "mito"],
      nobelYear: 1982,
    },
    {
      id: "eco",
      name: "Umberto Eco",
      birth: 1932,
      death: 2016,
      country: "Italia",
      language: ["italiano"],
      description:
        "Novelista, semiólogo y ensayista interesado en interpretación, signos, bibliotecas y conocimiento.",
      concepts: ["biblioteca", "laberinto", "signo", "interpretación", "memoria"],
    },
  ],

  relations: [
    {
      id: "poe-baudelaire",
      source: "poe",
      target: "baudelaire",
      type: "influenced",
      evidence: "documented",
      summary:
        "Baudelaire tradujo y difundió ampliamente la obra de Poe en Francia.",
      concepts: ["muerte", "belleza", "siniestro"],
    },
    {
      id: "dante-borges",
      source: "dante",
      target: "borges",
      type: "influenced",
      evidence: "declared",
      summary:
        "Borges escribió extensamente sobre Dante y regresó repetidamente a la Divina Comedia.",
      concepts: ["viaje", "visión", "memoria"],
    },
    {
      id: "kafka-borges",
      source: "kafka",
      target: "borges",
      type: "influenced",
      evidence: "declared",
      summary:
        "Borges leyó, tradujo, comentó y contribuyó decisivamente a la recepción hispánica de Kafka.",
      concepts: ["laberinto", "extrañamiento", "infinito"],
    },
    {
      id: "borges-eco",
      source: "borges",
      target: "eco",
      type: "conceptual_affinity",
      evidence: "critical",
      summary:
        "Biblioteca, laberinto, erudición e interpretación forman una zona central de diálogo entre ambos universos.",
      concepts: ["biblioteca", "laberinto", "interpretación"],
    },
    {
      id: "kafka-camus",
      source: "kafka",
      target: "camus",
      type: "conceptual_affinity",
      evidence: "critical",
      summary:
        "La obra kafkiana ocupa un lugar importante en las reflexiones de Camus sobre el absurdo.",
      concepts: ["absurdo", "culpa", "condición humana"],
    },
  ],
};
