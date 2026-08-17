export type CanonicalCreature = {
  number: number;
  slug: string;
  name: string;
  family: string;
  lineage: string;
  element: string;
  symbolicCore: string;
  wound: string;
  desire: string;
  contradiction: string;
  function: string;
  habitat: string;
  gesture: string;
  relic: string;
  oracle: string;
  voice: { phrase: string; tone: string };
  materials: string[];
  symbols: string[];
  image: string;
};

export const canonicalCreatures: CanonicalCreature[] = [
  {
    number: 5,
    slug: "el-perro-de-sal-que-guarda-la-ausencia",
    name: "El Perro de Sal que Guarda la Ausencia",
    family: "Criaturas de la memoria",
    lineage: "Canino funerario",
    element: "Sal, hueso y viento",
    symbolicCore:
      "Custodia aquello que se ha perdido, pero cuya huella todavía sigue llamando desde algún lugar.",
    wound: "La imposibilidad de aceptar del todo una desaparición amada.",
    desire: "Que lo perdido no sea borrado por el tiempo.",
    contradiction:
      "Protege la ausencia para que no desaparezca, pero así prolonga también el dolor de quien la recuerda.",
    function:
      "Vigilar la frontera entre la memoria viva y el olvido definitivo.",
    habitat:
      "Costas blancas, descampados cubiertos de sal, estaciones abandonadas y caminos donde alguien dejó de regresar.",
    gesture:
      "Baja la cabeza, olfatea una huella invisible y permanece inmóvil, como si oyera pasos que ya no pertenecen al mundo.",
    relic: "Un hueso de sal envuelto en una venda antigua.",
    oracle: "Lo que se fue todavía deja una forma en la tierra.",
    voice: {
      phrase:
        "No he venido a devolverte lo perdido. He venido a impedir que su huella desaparezca.",
      tone: "Grave, fiel, sereno y protector."
    },
    materials: ["sal cristalizada", "hueso pálido", "polvo blanco", "tela envejecida"],
    symbols: ["hueso", "huella", "viento", "costra de sal", "horizonte"],
    image: "/images/bestiario/el-perro-de-sal-que-guarda-la-ausencia.png"
  },
  {
    number: 6,
    slug: "la-arana-de-las-cartas-no-enviadas",
    name: "La Araña de las Cartas No Enviadas",
    family: "Criaturas de la memoria",
    lineage: "Arácnido epistolar",
    element: "Papel, tinta y silencio",
    symbolicCore:
      "Custodia las palabras que fueron escritas para alguien, pero nunca llegaron a abandonar la mano de quien las escribió.",
    wound: "La imposibilidad de decir a tiempo lo verdaderamente importante.",
    desire: "Que lo callado alcance alguna forma de existencia.",
    contradiction:
      "Conserva las cartas para impedir que desaparezcan, pero al guardarlas prolonga también su ausencia.",
    function:
      "Tejer un refugio para aquello que no pudo ser enviado sin hablar en nombre de su autor.",
    habitat:
      "Vive en habitaciones cerradas, buzones abandonados y escritorios donde la tinta se secó antes de encontrar destinatario.",
    gesture:
      "Recoge una carta caída, la envuelve con un único hilo y la guarda en la cavidad transparente de su abdomen.",
    relic: "Una carta sin destinatario, sellada con una gota de tinta.",
    oracle: "Cada palabra no enviada sigue viva en mis hilos.",
    voice: {
      phrase:
        "Dame lo que no pudiste enviar. No lo entregaré por ti; impediré que desaparezca sin haber sido escuchado.",
      tone: "Íntima, grave, contenida y protectora."
    },
    materials: ["papel envejecido", "tinta seca", "hilo de seda", "cera postal"],
    symbols: ["carta", "hilo", "tinta", "buzón", "luna"],
    image: "/images/bestiario/la-arana-de-las-cartas-no-enviadas.png"
  }
];

export function getCanonicalCreature(slug: string) {
  return canonicalCreatures.find((creature) => creature.slug === slug);
}
