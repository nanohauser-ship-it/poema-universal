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
    id: "antes-de-desaparecer",
    room: "desaparezcamos",
    number: "I · 01",
    title: "Antes de desaparecer",
    subtitle: "María convertida en memoria",
    curatorialText:
      "Ella todavía estaba allí, pero el mundo ya había comenzado a recordarla.",
    chapter: "Sala de la memoria",
    aspect: "portrait",
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
    aspect: "square",
    accent: "#d9f2f4",
    background:
      "radial-gradient(circle at 50% 50%, rgba(239,250,250,0.72), transparent 18%), linear-gradient(135deg, #34474c, #080a0c)",
    symbol: " ",
  },
];

export function getArtworksByRoom(
  room: MuseumRoomId
) {
  return museumArtworks.filter(
    (artwork) => artwork.room === room
  );
}
