export type MuseumWorkId =
  | "no-desaparezcamos"
  | "jerarquia-hambre"
  | "memorias-bielka";

export type MuseumPhoto = {
  id: string;
  work: MuseumWorkId;
  workTitle: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  number: string;
  accent: string;
};

export const museumPhotos: MuseumPhoto[] = [
  {
    id: "ndd-01",
    work: "no-desaparezcamos",
    workTitle: "No dejes que desaparezcamos",
    title: "El Árbol Blanco",
    subtitle: "El testigo anterior a la herida",
    description:
      "Un árbol claro y casi óseo permanece aislado en un territorio reconocible. Su presencia no anuncia lo ocurrido: lo conservará.",
    imageUrl:
      "/images/museo/tres-mundos/prototipo/ndd-01.webp",
    number: "I · 01",
    accent: "#bba77c",
  },
  {
    id: "ndd-02",
    work: "no-desaparezcamos",
    workTitle: "No dejes que desaparezcamos",
    title: "Los cuadernos de la herida",
    subtitle: "El archivo íntimo",
    description:
      "Cuadernos usados, páginas corregidas, manchas y escrituras desiguales convierten la experiencia vivida en un resto transmisible.",
    imageUrl:
      "/images/museo/tres-mundos/prototipo/ndd-02.webp",
    number: "I · 02",
    accent: "#a68a64",
  },
  {
    id: "ndd-03",
    work: "no-desaparezcamos",
    workTitle: "No dejes que desaparezcamos",
    title: "La carretera del quiebre",
    subtitle: "El umbral de la tragedia",
    description:
      "Una carretera secundaria atraviesa un paisaje cotidiano. Nada extraordinario se ve todavía, pero el mundo está a punto de dividirse.",
    imageUrl:
      "/images/museo/tres-mundos/prototipo/ndd-03.webp",
    number: "I · 03",
    accent: "#c1ad87",
  },
  {
    id: "ndd-04",
    work: "no-desaparezcamos",
    workTitle: "No dejes que desaparezcamos",
    title: "La habitación de María",
    subtitle: "Presencia por ausencia",
    description:
      "La cama, la ropa, los libros y la luz de la ventana conservan la forma doméstica de alguien que ya no puede regresar.",
    imageUrl:
      "/images/museo/tres-mundos/prototipo/ndd-04.webp",
    number: "I · 04",
    accent: "#9b7e63",
  },
  {
    id: "ndd-05",
    work: "no-desaparezcamos",
    workTitle: "No dejes que desaparezcamos",
    title: "El árbol después del fuego",
    subtitle: "La herida material del mito",
    description:
      "La corteza abierta, la ceniza y el suelo quemado revelan que el testigo también fue herido, aunque no consiguió desaparecer.",
    imageUrl:
      "/images/museo/tres-mundos/prototipo/ndd-05.webp",
    number: "I · 05",
    accent: "#baa16d",
  },
  {
    id: "ndd-06",
    work: "no-desaparezcamos",
    workTitle: "No dejes que desaparezcamos",
    title: "La hoja salvada",
    subtitle: "Supervivencia mínima",
    description:
      "Una única hoja, doblada y dañada por el fuego, conserva una escritura que sobrevivió cuando casi todo lo demás se perdió.",
    imageUrl:
      "/images/museo/tres-mundos/prototipo/ndd-06.webp",
    number: "I · 06",
    accent: "#c3a671",
  },
  {
    id: "ndd-07",
    work: "no-desaparezcamos",
    workTitle: "No dejes que desaparezcamos",
    title: "La casa y el linaje roto",
    subtitle: "La vida continúa de manera imperfecta",
    description:
      "Una cocina familiar, fotografías antiguas y una silla vacía hacen visible la continuidad fracturada de quienes permanecieron.",
    imageUrl:
      "/images/museo/tres-mundos/prototipo/ndd-07.webp",
    number: "I · 07",
    accent: "#aa9068",
  },
  {
    id: "ndd-08",
    work: "no-desaparezcamos",
    workTitle: "No dejes que desaparezcamos",
    title: "El paquete que vuelve",
    subtitle: "Argelia devuelve el pasado",
    description:
      "Un paquete gastado, una carta y unas manos envejecidas convierten la distancia en legado y la espera en verdad tardía.",
    imageUrl:
      "/images/museo/tres-mundos/prototipo/ndd-08.webp",
    number: "I · 08",
    accent: "#8f765f",
  },

  {
    id: "jdh-01",
    work: "jerarquia-hambre",
    workTitle: "La Jerarquía del Hambre",
    title: "Atlas",
    subtitle: "El dóberman albino",
    description:
      "El cuerpo real y fatigado de Atlas permanece junto al umbral. Su blancura no lo vuelve fantástico: lo hace imposible de olvidar.",
    imageUrl:
      "/images/museo/tres-mundos/prototipo/jdh-01.webp",
    number: "II · 01",
    accent: "#7c988c",
  },
  {
    id: "jdh-02",
    work: "jerarquia-hambre",
    workTitle: "La Jerarquía del Hambre",
    title: "La frutería de Barcelona",
    subtitle: "La superficie del mundo",
    description:
      "Cajas, fruta, plástico, humedad y trabajo cotidiano contienen la última realidad reconocible antes de comenzar el descenso.",
    imageUrl:
      "/images/museo/tres-mundos/prototipo/jdh-02.webp",
    number: "II · 02",
    accent: "#839a99",
  },
  {
    id: "jdh-03",
    work: "jerarquia-hambre",
    workTitle: "La Jerarquía del Hambre",
    title: "La vieja estación",
    subtitle: "La boca del metro",
    description:
      "Azulejos envejecidos, fluorescentes y escaleras gastadas convierten una entrada urbana ordinaria en el portal hacia las Hambres.",
    imageUrl:
      "/images/museo/tres-mundos/prototipo/jdh-03.webp",
    number: "II · 03",
    accent: "#967b6a",
  },
  {
    id: "jdh-04",
    work: "jerarquia-hambre",
    workTitle: "La Jerarquía del Hambre",
    title: "La Cocina sin Fuego",
    subtitle: "Aquí el hambre se organiza",
    description:
      "Una comunidad subterránea prepara y distribuye alimento sin llama. La carencia ha construido sus propias reglas, turnos y rituales.",
    imageUrl:
      "/images/museo/tres-mundos/prototipo/jdh-04.webp",
    number: "II · 04",
    accent: "#788991",
  },
  {
    id: "jdh-05",
    work: "jerarquia-hambre",
    workTitle: "La Jerarquía del Hambre",
    title: "La Farmacia de la Morfina",
    subtitle: "El dolor descansa un rato",
    description:
      "Frascos, dosis y mostradores deteriorados administran un alivio que no salva: únicamente presta olvido y aplaza el sufrimiento.",
    imageUrl:
      "/images/museo/tres-mundos/prototipo/jdh-05.webp",
    number: "II · 05",
    accent: "#9b836d",
  },
  {
    id: "jdh-06",
    work: "jerarquia-hambre",
    workTitle: "La Jerarquía del Hambre",
    title: "El Mercado de las Voces",
    subtitle: "Lo dicho adquiere valor",
    description:
      "En el corazón coral del subsuelo, las historias, los murmullos y las voces separadas de sus cuerpos circulan como mercancía.",
    imageUrl:
      "/images/museo/tres-mundos/prototipo/jdh-06.webp",
    number: "II · 06",
    accent: "#827d88",
  },
  {
    id: "jdh-07",
    work: "jerarquia-hambre",
    workTitle: "La Jerarquía del Hambre",
    title: "La Asamblea de los No Amados",
    subtitle: "Reconocerse sin ser elegidos",
    description:
      "Personas de edades, procedencias y biografías distintas se reúnen sin heroísmo. El círculo no elimina el desamparo, pero lo reconoce.",
    imageUrl:
      "/images/museo/tres-mundos/prototipo/jdh-07.webp",
    number: "II · 07",
    accent: "#90745e",
  },
  {
    id: "jdh-08",
    work: "jerarquia-hambre",
    workTitle: "La Jerarquía del Hambre",
    title: "Las tres puertas",
    subtitle: "Elección, destino y umbral",
    description:
      "Tres accesos de metal, madera y piedra condensan tres destinos posibles. Cada materia promete una salida distinta.",
    imageUrl:
      "/images/museo/tres-mundos/prototipo/jdh-08.webp",
    number: "II · 08",
    accent: "#77929c",
  },

  {
    id: "mdb-01",
    work: "memorias-bielka",
    workTitle: "Memorias de Bielka",
    title: "Mara",
    subtitle: "Identidad en formación",
    description:
      "Mara escucha antes de decidir quién será. Su presencia sobria contiene el tránsito entre una identidad heredada y una identidad elegida.",
    imageUrl:
      "/images/museo/tres-mundos/prototipo/mdb-01.webp",
    number: "III · 01",
    accent: "#b9bec5",
  },
  {
    id: "mdb-02",
    work: "memorias-bielka",
    workTitle: "Memorias de Bielka",
    title: "El collar",
    subtitle: "María, Sayonara y la primera decisión",
    description:
      "Dos mitades gastadas permanecen unidas sobre la piel. El objeto no determina quién es Mara: conserva aquello desde lo que decide nombrarse.",
    imageUrl:
      "/images/museo/tres-mundos/prototipo/mdb-02.webp",
    number: "III · 02",
    accent: "#9fb3bd",
  },
  {
    id: "mdb-03",
    work: "memorias-bielka",
    workTitle: "Memorias de Bielka",
    title: "Nadir bajo el arco",
    subtitle: "El perro que no volverá a entrar",
    description:
      "Nadir envejece junto al acceso que conoce. Su cansancio conserva la memoria de Sahra y de un regreso que nunca pudo completarse.",
    imageUrl:
      "/images/museo/tres-mundos/prototipo/mdb-03.webp",
    number: "III · 03",
    accent: "#a8a9a1",
  },
  {
    id: "mdb-04",
    work: "memorias-bielka",
    workTitle: "Memorias de Bielka",
    title: "El arco de Bielka",
    subtitle: "Frontera y espera",
    description:
      "La piedra húmeda y erosionada registra años de tránsito. El arco no explica qué separa: únicamente permanece abierto ante quienes llegan.",
    imageUrl:
      "/images/museo/tres-mundos/prototipo/mdb-04.webp",
    number: "III · 04",
    accent: "#a9a2a2",
  },
  {
    id: "mdb-05",
    work: "memorias-bielka",
    workTitle: "Memorias de Bielka",
    title: "Los que emergen del mar",
    subtitle: "La llegada silenciosa",
    description:
      "Hombres, mujeres y familias alcanzan la orilla empapados por la travesía. Bielka los recibe sin convertir su sufrimiento en espectáculo.",
    imageUrl:
      "/images/museo/tres-mundos/prototipo/mdb-05.webp",
    number: "III · 05",
    accent: "#c1b8b3",
  },
  {
    id: "mdb-06",
    work: "memorias-bielka",
    workTitle: "Memorias de Bielka",
    title: "Los perros que llevan bebés",
    subtitle: "Procesión de custodia",
    description:
      "Un fresco antiguo conserva la imagen de perros que transportan cunas textiles y pequeños núcleos de luz hacia el interior de Bielka.",
    imageUrl:
      "/images/museo/tres-mundos/prototipo/mdb-06.webp",
    number: "III · 06",
    accent: "#b4aea1",
  },
  {
    id: "mdb-07",
    work: "memorias-bielka",
    workTitle: "Memorias de Bielka",
    title: "El juguete roto",
    subtitle: "La infancia abandonada",
    description:
      "Un juguete desgastado permanece junto a un muro. Sus roturas y su suciedad hacen visible el afecto perdido que todavía espera ser recogido.",
    imageUrl:
      "/images/museo/tres-mundos/prototipo/mdb-07.webp",
    number: "III · 07",
    accent: "#d1cdc0",
  },
  {
    id: "mdb-08",
    work: "memorias-bielka",
    workTitle: "Memorias de Bielka",
    title: "La puerta de piedra",
    subtitle: "El centro del laberinto",
    description:
      "Una puerta pétrea, austera y casi ciega ocupa el espacio central. Su peso material contiene la posibilidad de un final verdadero.",
    imageUrl:
      "/images/museo/tres-mundos/prototipo/mdb-08.webp",
    number: "III · 08",
    accent: "#bbb5aa",
  },
];
