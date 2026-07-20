export type MuseumRoomId =
  | "desaparezcamos"
  | "jerarquia"
  | "bielka";

export type MuseumRoom = {
  id: MuseumRoomId;
  number: string;
  title: string;
  subtitle: string;
  sentence: string;
  accent: string;
  glow: string;
  wall: string;
  href: string;
};

export const museumRooms: MuseumRoom[] = [
  {
    id: "desaparezcamos",
    number: "I",
    title: "No dejes que desaparezcamos",
    subtitle: "Memoria · amor · exilio · ceniza",
    sentence: "El tronco conserva la memoria.",
    accent: "#d7b477",
    glow: "#ead3a8",
    wall: "#2a211d",
    href: "#sala-desaparezcamos",
  },
  {
    id: "jerarquia",
    number: "II",
    title: "La Jerarquía del Hambre",
    subtitle: "Hierro · necesidad · obediencia · resistencia",
    sentence: "Las raíces atraviesan el hambre.",
    accent: "#a65c48",
    glow: "#8e3f32",
    wall: "#191719",
    href: "#sala-jerarquia",
  },
  {
    id: "bielka",
    number: "III",
    title: "Memorias de Bielka",
    subtitle: "Agua · paja · cristal · laberinto",
    sentence: "Las ramas entran en el laberinto.",
    accent: "#b9dce2",
    glow: "#d9f2f4",
    wall: "#182226",
    href: "#sala-bielka",
  },
];

export const museumRoomById = Object.fromEntries(
  museumRooms.map((room) => [room.id, room])
) as Record<MuseumRoomId, MuseumRoom>;
