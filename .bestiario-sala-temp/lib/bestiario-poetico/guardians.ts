export type Guardian = {
  slug: string;
  name: string;
  modelUrl: string;
  family: string;
  protects: string;
  relic: string;
  voice: string;
  keywords: string[];
  scale: number;
  position: [number, number, number];
  rotation: [number, number, number];
};

export const guardians: Guardian[] = [
  {
    slug: "elegiamon",
    name: "Elegiamon",
    modelUrl: "/models/bestiario/elegiamon.glb",
    family: "Guardianes de la memoria",
    protects: "El duelo que todavía necesita elevarse sin abandonar aquello que ama.",
    relic: "Una lágrima de cristal que conserva una última luz.",
    voice: "No vengo a borrar tu pérdida. Vengo a enseñarle a levantar las alas.",
    keywords: ["duelo","muerte","ausencia","recuerdo","memoria","llorar","pérdida","adiós","despedida","nombre"],
    scale: 1.2,
    position: [0, -1.55, 0],
    rotation: [0, 0, 0]
  },
  {
    slug: "cordero-llama-fria",
    name: "El Cordero de la Llama Fría",
    modelUrl: "/models/bestiario/cordero-llama-fria.glb",
    family: "Guardianes de la herida",
    protects: "La ternura que sobrevivió al dolor sin convertirse en dureza.",
    relic: "Una brasa blanca que ilumina sin quemar.",
    voice: "Permanezco donde el dolor aprende a no destruir la ternura.",
    keywords: ["dolor","herida","ternura","inocencia","sacrificio","frío","invierno","culpa","perdón","miedo","piel"],
    scale: 1.35,
    position: [0, -1.65, 0],
    rotation: [0, 0, 0]
  },
  {
    slug: "guardiana-alas-cuerda",
    name: "La Guardiana de las Alas de Cuerda",
    modelUrl: "/models/bestiario/guardiana-alas-cuerda.glb",
    family: "Guardianes de la voz",
    protects: "Las palabras que todavía no encontraron una forma segura de ser dichas.",
    relic: "Un nudo de hilo oscuro que nunca termina de cerrarse.",
    voice: "No he venido a salvarte. He venido a guardar lo que todavía no puedes soltar.",
    keywords: ["voz","palabra","silencio","decir","escribir","carta","secreto","hilo","nudo","callar","poema","lengua"],
    scale: 1.15,
    position: [0, -1.55, 0],
    rotation: [0, 0, 0]
  },
  {
    slug: "esfinge-del-umbral",
    name: "La Esfinge del Umbral",
    modelUrl: "/models/bestiario/esfinge-del-umbral.glb",
    family: "Guardianes de la revelación",
    protects: "La pregunta que aún no debe ser respondida, pero tampoco olvidada.",
    relic: "Una puerta diminuta abierta en el centro del pecho.",
    voice: "No he venido a darte una respuesta. He venido a proteger la pregunta correcta.",
    keywords: ["pregunta","puerta","umbral","camino","cambio","duda","verdad","destino","entrar","salir","elección","sueño"],
    scale: 1.2,
    position: [0, -1.55, 0],
    rotation: [0, 0, 0]
  }
];

export function invokeGuardian(poem: string): Guardian {
  const normalized = poem.toLocaleLowerCase("es-ES").normalize("NFD").replace(/\p{Diacritic}/gu, "");
  const scores = guardians.map((guardian) => ({
    guardian,
    score: guardian.keywords.reduce((total, keyword) => {
      const k = keyword.toLocaleLowerCase("es-ES").normalize("NFD").replace(/\p{Diacritic}/gu, "");
      return total + (normalized.includes(k) ? 1 : 0);
    }, 0)
  }));
  const bestScore = Math.max(...scores.map((item) => item.score));
  if (bestScore === 0) {
    const sum = [...normalized].reduce((total, char) => total + char.charCodeAt(0), 0);
    return guardians[sum % guardians.length];
  }
  return scores.find((item) => item.score === bestScore)!.guardian;
}
