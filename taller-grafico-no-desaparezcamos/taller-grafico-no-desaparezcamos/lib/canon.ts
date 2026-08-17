export const VISUAL_CANON = {
  obra: "No dejes que desaparezcamos",
  principio: "La novela manda. La imagen interpreta sin añadir una segunda historia.",
  lenguaje: [
    "realismo de memoria",
    "poesía gráfica contenida",
    "elipsis antes que explicación",
    "silencio visual",
    "composición editorial",
    "continuidad estricta de personajes, objetos y lugares"
  ],
  materia: [
    "papel envejecido muy claro",
    "gris niebla",
    "negro tinta",
    "tierras apagadas",
    "blanco hueso",
    "grano fotográfico fino"
  ],
  evitar: [
    "fantasía decorativa",
    "rostros idealizados",
    "color saturado sin motivo narrativo",
    "efectos de videojuego",
    "texto redundante",
    "cambiar rasgos o vestuario sin causa narrativa"
  ]
};

export function canonPrompt() {
  return [
    `Obra: ${VISUAL_CANON.obra}.`,
    VISUAL_CANON.principio,
    `Lenguaje: ${VISUAL_CANON.lenguaje.join(", ")}.`,
    `Materia: ${VISUAL_CANON.materia.join(", ")}.`,
    `Evitar: ${VISUAL_CANON.evitar.join(", ")}.`
  ].join(" ");
}
