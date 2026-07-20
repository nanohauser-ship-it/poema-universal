export type WorldId =
  | "bielka"
  | "desaparezcamos"
  | "jerarquia";

export type WorldConfig = {
  id: WorldId;
  number: string;
  title: string;
  subtitle: string;
  material: string;
  height: number;
  lightSquare: string;
  darkSquare: string;
  frame: string;
  accent: string;
};

export const worlds: WorldConfig[] = [
  {
    id: "bielka",
    number: "III",
    title: "Memorias de Bielka",
    subtitle: "Cristal · agua · niebla · laberinto",
    material: "El mundo superior",
    height: 3.35,
    lightSquare: "#dce9eb",
    darkSquare: "#69818b",
    frame: "#a8c0c7",
    accent: "#d6ecef",
  },
  {
    id: "desaparezcamos",
    number: "I",
    title: "No dejes que desaparezcamos",
    subtitle: "Piedra · madera · ceniza · memoria",
    material: "El mundo humano",
    height: 0,
    lightSquare: "#d8c8b2",
    darkSquare: "#725847",
    frame: "#9d795d",
    accent: "#d7b477",
  },
  {
    id: "jerarquia",
    number: "II",
    title: "La Jerarquía del Hambre",
    subtitle: "Hierro · barro · hueso · necesidad",
    material: "El mundo inferior",
    height: -3.35,
    lightSquare: "#584a43",
    darkSquare: "#171719",
    frame: "#3a302c",
    accent: "#9b5543",
  },
];

export const worldById = Object.fromEntries(
  worlds.map((world) => [world.id, world])
) as Record<WorldId, WorldConfig>;
