export type Guardian = {
  slug: string;
  name: string;
  shortName: string;
  modelUrl: string;
  family: string;
  recognized: string;
  protects: string;
  gesture: string;
  voice: string;
  relic: string;
  keywords: string[];
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
};

export const guardians: Guardian[] = [
  {
    slug: "guardiana-alas-cuerda",
    name: "La Guardiana de las Alas de Cuerda",
    shortName: "La Guardiana",
    modelUrl: "/models/bestiario/guardiana-alas-cuerda.glb",
    family: "Guardianes de la voz",
    recognized:
      "Palabras que desean salir, pero todavía buscan una forma que no traicione aquello que contienen.",
    protects:
      "Lo que aún no puedes decir sin sentir que algo esencial podría romperse.",
    gesture:
      "Desata una cuerda de sus alas y la extiende con cuidado sobre el poema.",
    voice:
      "No he venido a salvarte. He venido a guardar lo que todavía no puedes soltar.",
    relic:
      "Un nudo incompleto de hilo oscuro.",
    keywords: [
      "voz", "palabra", "silencio", "decir", "escribir", "carta",
      "secreto", "hilo", "nudo", "callar", "poema", "lengua"
    ],
    position: [-4.5, -2.05, -0.2],
    rotation: [0, 0.28, 0],
    scale: 1
  },
  {
    slug: "cordero-llama-fria",
    name: "El Cordero de la Llama Fría",
    shortName: "El Cordero",
    modelUrl: "/models/bestiario/cordero-llama-fria.glb",
    family: "Guardianes de la herida",
    recognized:
      "Una forma de ternura que atravesó el daño sin convertirse por completo en dureza.",
    protects:
      "La parte de ti que todavía desea cuidar incluso después de haber sido herida.",
    gesture:
      "Enciende una llama blanca alrededor de su cuerpo y la deposita sobre el libro.",
    voice:
      "Permanezco donde el dolor aprende a no destruir la ternura.",
    relic:
      "Una brasa blanca que ilumina sin quemar.",
    keywords: [
      "dolor", "herida", "ternura", "inocencia", "sacrificio",
      "frío", "invierno", "culpa", "perdón", "miedo", "piel"
    ],
    position: [-1.5, -2.05, -0.75],
    rotation: [0, 0.1, 0],
    scale: 1
  },
  {
    slug: "elegiamon",
    name: "Elegiamon",
    shortName: "Elegiamon",
    modelUrl: "/models/bestiario/elegiamon.glb",
    family: "Guardianes de la memoria",
    recognized:
      "Una memoria que no desea desaparecer, pero tampoco quiere convertirse en prisión.",
    protects:
      "El duelo que todavía necesita elevarse sin abandonar aquello que ama.",
    gesture:
      "Eleva lentamente las alas y deja caer una gota de luz sobre el escrito.",
    voice:
      "No vengo a borrar tu pérdida. Vengo a enseñarle a levantar las alas.",
    relic:
      "Una lágrima de cristal que conserva una última luz.",
    keywords: [
      "duelo", "muerte", "ausencia", "recuerdo", "memoria",
      "llorar", "pérdida", "adiós", "despedida", "nombre"
    ],
    position: [1.55, -2.05, -0.75],
    rotation: [0, -0.1, 0],
    scale: 1
  },
  {
    slug: "concordia-serpentina",
    name: "La Concordia Serpentina",
    shortName: "La Concordia",
    modelUrl: "/models/bestiario/presencia-elefantina-amarilla.glb",
    family: "Guardianes de la transformación",
    recognized:
      "Una tensión interior entre fuerzas opuestas que todavía buscan convivir sin destruirse.",
    protects:
      "La parte de ti que necesita integrar sus contradicciones sin amputar ninguna.",
    gesture:
      "Abre sus cuatro brazos, desenrolla las serpientes y extiende las alas sobre la mesa.",
    voice:
      "No he venido a elegir una mitad de ti. He venido a enseñarles a tus fuerzas a permanecer juntas.",
    relic:
      "Un anillo de oro pálido rodeado por dos serpientes dormidas.",
    keywords: [
      "contradicción", "dualidad", "conflicto", "reconciliación",
      "unión", "integración", "mitad", "fuerza", "equilibrio",
      "serpiente", "cambio", "transformación", "alma"
    ],
    position: [4.55, -2.05, -0.2],
    rotation: [0, -0.28, 0],
    scale: 1
  }
];

export function chooseGuardian(text: string): Guardian {
  const normalized = text
    .toLocaleLowerCase("es-ES")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

  const ranked = guardians.map((guardian) => {
    const score = guardian.keywords.reduce((total, keyword) => {
      const cleanKeyword = keyword
        .toLocaleLowerCase("es-ES")
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
      return total + (normalized.includes(cleanKeyword) ? 1 : 0);
    }, 0);

    return { guardian, score };
  });

  const best = Math.max(...ranked.map((item) => item.score));

  if (best === 0) {
    const checksum = [...normalized].reduce(
      (sum, character) => sum + character.charCodeAt(0),
      0
    );
    return guardians[checksum % guardians.length];
  }

  return ranked.find((item) => item.score === best)!.guardian;
}
