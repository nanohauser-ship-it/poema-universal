import type { MuseumRoomId } from "./rooms";

export type MuseumArtwork = {
  id: string;
  room: MuseumRoomId;
  number: string;
  title: string;
  subtitle: string;
  curatorialText: string;
  chapter?: string;
  imageUrl?: string;
  aspect: "portrait" | "landscape" | "square";
  accent: string;
  background: string;
  symbol: string;
};

export const museumArtworks: MuseumArtwork[] = [
  {
    id: "el-vuelo-de-icaro",
    room: "desaparezcamos",
    number: "I · 01",
    title: "El vuelo de Ícaro",
    subtitle: "El cuerpo que quiso escapar del laberinto",
    curatorialText:
      "Voló no para alcanzar el cielo, sino para huir de una ciudad que había aprendido a cerrar todas sus salidas.",
    chapter: "La tentativa de fuga",
    aspect: "landscape",
    accent: "#d7b477",
    background:
      "radial-gradient(circle at 66% 25%, rgba(226,205,168,0.36), transparent 28%), linear-gradient(145deg, #30251f, #090a0c 72%)",
    symbol: "M",
  },
  {
    id: "la-silla-que-espera",
    room: "desaparezcamos",
    number: "I · 02",
    title: "La silla que espera",
    subtitle: "Ausencia doméstica",
    curatorialText:
      "Algunas ausencias continúan ocupando el lugar exacto donde fueron amadas.",
    chapter: "La casa",
    aspect: "landscape",
    accent: "#b79162",
    background:
      "radial-gradient(circle at 32% 55%, rgba(165,123,78,0.3), transparent 26%), linear-gradient(120deg, #1f1916, #07080a)",
    symbol: "□",
  },
  {
    id: "universidad-herida",
    room: "desaparezcamos",
    number: "I · 03",
    title: "La universidad herida",
    subtitle: "Conocimiento y poder",
    curatorialText:
      "El edificio seguía en pie, aunque dentro de sus muros ya había comenzado la ruina.",
    chapter: "La universidad",
    aspect: "square",
    accent: "#c29c6b",
    background:
      "linear-gradient(90deg, transparent 48%, rgba(215,180,119,0.3) 49%, rgba(215,180,119,0.3) 51%, transparent 52%), linear-gradient(145deg, #29201b, #090a0b)",
    symbol: "Ⅰ",
  },

  {
    id: "la-mesa",
    room: "jerarquia",
    number: "II · 01",
    title: "La mesa",
    subtitle: "Geometría de la desigualdad",
    curatorialText:
      "La distancia entre un plato lleno y uno vacío puede sostener un mundo entero.",
    chapter: "Jerarquía",
    aspect: "landscape",
    accent: "#a65c48",
    background:
      "radial-gradient(ellipse at 50% 78%, rgba(142,63,50,0.38), transparent 38%), linear-gradient(180deg, #1d1717, #050607)",
    symbol: "—",
  },
  {
    id: "atlas-y-la-pelota",
    room: "jerarquia",
    number: "II · 02",
    title: "Atlas y la pelota amarilla",
    subtitle: "Lealtad bajo el hambre",
    curatorialText:
      "En medio del sistema, una criatura conserva todavía una razón pequeña para regresar.",
    chapter: "Atlas",
    aspect: "portrait",
    accent: "#d7b51f",
    background:
      "radial-gradient(circle at 48% 72%, rgba(215,181,31,0.44), transparent 12%), linear-gradient(145deg, #25211e, #070708)",
    symbol: "●",
  },
  {
    id: "el-plato-vacio",
    room: "jerarquia",
    number: "II · 03",
    title: "El plato vacío",
    subtitle: "La ausencia que respira",
    curatorialText:
      "Cuando no queda alimento, el vacío comienza a alimentarse de quienes esperan.",
    chapter: "Necesidad",
    aspect: "square",
    accent: "#8f4436",
    background:
      "radial-gradient(circle at 50% 50%, #060607 0 18%, rgba(143,68,54,0.4) 19%, transparent 34%), linear-gradient(145deg, #20191a, #060607)",
    symbol: "○",
  },

  {
    id: "la-nina-que-despierta",
    room: "bielka",
    number: "III · 01",
    title: "La niña que despierta",
    subtitle: "Regreso desde el agua",
    curatorialText:
      "Abrió los ojos como quien vuelve de un mar que nadie más puede recordar.",
    chapter: "El carro",
    aspect: "portrait",
    accent: "#b9dce2",
    background:
      "radial-gradient(circle at 52% 32%, rgba(217,242,244,0.4), transparent 24%), linear-gradient(165deg, #26383d, #080a0c)",
    symbol: "◌",
  },
  {
    id: "el-carro-de-paja",
    room: "bielka",
    number: "III · 02",
    title: "El carro de paja",
    subtitle: "El primer umbral",
    curatorialText:
      "Toda llegada verdadera conserva algo del lugar del que fue salvada.",
    chapter: "Tránsito",
    aspect: "landscape",
    accent: "#c6a96e",
    background:
      "radial-gradient(ellipse at 45% 68%, rgba(198,169,110,0.42), transparent 34%), linear-gradient(145deg, #243237, #080a0b)",
    symbol: "◇",
  },
  {
    id: "la-ausencia-blanca",
    room: "bielka",
    number: "III · 03",
    title: "La ausencia blanca",
    subtitle: "Aquello que todavía no debe verse",
    curatorialText:
      "Algo respiraba detrás del blanco. El laberinto conocía su forma, pero guardaba silencio.",
    chapter: "El laberinto",
    imageUrl: "/museo/bielka/icaro.JPG",
    aspect: "landscape",
    accent: "#d9f2f4",
    background:
      "radial-gradient(circle at 50% 50%, rgba(239,250,250,0.72), transparent 18%), linear-gradient(135deg, #34474c, #080a0c)",
    symbol: " ",
  },

  {
    id: "el-exiliado",
    room: "desaparezcamos",
    number: "I · 04",
    title: "El exiliado",
    subtitle: "La distancia convertida en patria",
    curatorialText:
      "Partir no fue abandonar un lugar, sino aprender que algunos lugares continúan caminando dentro de nosotros.",
    chapter: "El exilio",
    aspect: "portrait",
    accent: "#b88c61",
    background:
      "radial-gradient(circle at 62% 30%, rgba(184,140,97,0.36), transparent 25%), linear-gradient(150deg, #2a211c, #08090b)",
    symbol: "↗",
  },
  {
    id: "la-promesa",
    room: "desaparezcamos",
    number: "I · 05",
    title: "La promesa",
    subtitle: "Dos vidas ante el tiempo",
    curatorialText:
      "Prometieron regresar antes de comprender que el regreso también puede desaparecer.",
    chapter: "María y Alejandro",
    aspect: "landscape",
    accent: "#d1ae78",
    background:
      "radial-gradient(ellipse at 48% 58%, rgba(209,174,120,0.32), transparent 32%), linear-gradient(140deg, #30251f, #08090a)",
    symbol: "∞",
  },
  {
    id: "el-arbol-blanco",
    room: "desaparezcamos",
    number: "I · 06",
    title: "El Árbol Blanco",
    subtitle: "Memoria, promesa y destrucción",
    curatorialText:
      "El árbol no pertenecía a los vivos ni a los muertos. Permanecía entre ambos, sosteniendo aquello que no debía desaparecer.",
    chapter: "El centro simbólico",
    aspect: "square",
    accent: "#e4ddd0",
    background:
      "radial-gradient(circle at 50% 42%, rgba(238,231,218,0.58), transparent 23%), linear-gradient(155deg, #2b2824, #08090a)",
    symbol: "Y",
  },

  {
    id: "la-cadena-rota",
    room: "jerarquia",
    number: "II · 04",
    title: "La cadena rota",
    subtitle: "El instante de la desobediencia",
    curatorialText:
      "La cadena continuaba en el suelo, pero por primera vez ya no decidía el movimiento de ningún cuerpo.",
    chapter: "Ruptura",
    aspect: "landscape",
    accent: "#9f5546",
    background:
      "linear-gradient(135deg, transparent 44%, rgba(159,85,70,0.52) 45%, rgba(159,85,70,0.52) 49%, transparent 50%), linear-gradient(145deg, #251a1b, #060708)",
    symbol: "⌁",
  },
  {
    id: "la-cocina-sin-fuego",
    room: "jerarquia",
    number: "II · 05",
    title: "La cocina sin fuego",
    subtitle: "El hambre organizada",
    curatorialText:
      "Las ollas permanecían preparadas. Lo único que faltaba era aquello para lo que habían sido creadas.",
    chapter: "La cocina",
    aspect: "portrait",
    accent: "#8b4137",
    background:
      "radial-gradient(circle at 50% 72%, rgba(139,65,55,0.38), transparent 21%), linear-gradient(155deg, #211719, #050607)",
    symbol: "△",
  },
  {
    id: "los-perros-encadenados",
    room: "jerarquia",
    number: "II · 06",
    title: "Los perros encadenados",
    subtitle: "La inocencia bajo dominio",
    curatorialText:
      "No comprendían la jerarquía. Solo conocían la longitud exacta que les permitía la cadena.",
    chapter: "Los animales",
    aspect: "square",
    accent: "#a75948",
    background:
      "radial-gradient(circle at 35% 58%, rgba(167,89,72,0.3), transparent 20%), radial-gradient(circle at 67% 58%, rgba(167,89,72,0.26), transparent 20%), linear-gradient(145deg, #201617, #050607)",
    symbol: "••",
  },

  {
    id: "el-corazon-de-dos-mitades",
    room: "bielka",
    number: "III · 04",
    title: "El corazón de dos mitades",
    subtitle: "Un vínculo separado",
    curatorialText:
      "Cada mitad conservaba la forma de la otra, incluso cuando ninguna sabía dónde había sido llevada.",
    chapter: "El collar",
    aspect: "portrait",
    accent: "#d5e8e9",
    background:
      "radial-gradient(circle at 44% 48%, rgba(213,232,233,0.42), transparent 18%), radial-gradient(circle at 57% 48%, rgba(213,232,233,0.36), transparent 18%), linear-gradient(145deg, #26383d, #07090b)",
    symbol: "♡",
  },
  {
    id: "la-entrada-al-laberinto",
    room: "bielka",
    number: "III · 05",
    title: "La entrada al laberinto",
    subtitle: "Toda salida exige primero entrar",
    curatorialText:
      "El camino no prometía conducirla a ninguna parte. Solo le pedía que aceptara cruzarlo.",
    chapter: "El laberinto",
    aspect: "landscape",
    accent: "#abcfd5",
    background:
      "linear-gradient(90deg, rgba(171,207,213,0.15), transparent 18%, transparent 82%, rgba(171,207,213,0.15)), linear-gradient(155deg, #213238, #07090b)",
    symbol: "⌑",
  },
  {
    id: "la-memoria-bajo-el-agua",
    room: "bielka",
    number: "III · 06",
    title: "La memoria bajo el agua",
    subtitle: "Lo que recuerda sin respirar",
    curatorialText:
      "Bajo la superficie permanecía una vida entera, esperando que alguien aprendiera a mirar sin abrir los ojos.",
    chapter: "La profundidad",
    aspect: "square",
    accent: "#92c4cc",
    background:
      "radial-gradient(circle at 50% 62%, rgba(146,196,204,0.42), transparent 30%), linear-gradient(180deg, #263d44, #071014)",
    symbol: "≈",
  },
];

export function getArtworksByRoom(
  room: MuseumRoomId
) {
  return museumArtworks.filter(
    (artwork) => artwork.room === room
  );
}
