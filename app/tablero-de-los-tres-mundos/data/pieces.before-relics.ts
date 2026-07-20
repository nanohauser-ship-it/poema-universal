import type { WorldId } from "./worlds";

export type PieceKind =
  | "professor"
  | "student"
  | "friend"
  | "university"
  | "hunger"
  | "child"
  | "watcher"
  | "crowd"
  | "awakening"
  | "cart"
  | "heart"
  | "void";

export type PieceId =
  | "desaparezcamos-profesor"
  | "desaparezcamos-estudiante"
  | "desaparezcamos-amigo"
  | "desaparezcamos-universidad"
  | "jerarquia-hambre"
  | "jerarquia-nino"
  | "jerarquia-vigilante"
  | "jerarquia-multitud"
  | "bielka-nina"
  | "bielka-carro"
  | "bielka-corazon"
  | "bielka-ausencia";

export type WorldPiece = {
  id: PieceId;
  world: WorldId;
  number: string;
  name: string;
  archetype: string;
  phrase: string;
  kind: PieceKind;
  position: [number, number];
  rotation?: number;
  scale?: number;
};

export const pieces: WorldPiece[] = [
  {
    id: "desaparezcamos-profesor",
    world: "desaparezcamos",
    number: "I · 01",
    name: "El Profesor",
    archetype: "Memoria · enseñanza · pérdida",
    phrase:
      "Enseñar también es aprender a perder aquello que uno ama.",
    kind: "professor",
    position: [-2.35, -2.25],
    rotation: 0.2,
  },
  {
    id: "desaparezcamos-estudiante",
    world: "desaparezcamos",
    number: "I · 02",
    name: "La Estudiante",
    archetype: "Encuentro · deseo · transformación",
    phrase:
      "Hay encuentros que cambian para siempre la forma de recordar.",
    kind: "student",
    position: [2.2, -2.15],
    rotation: -0.25,
  },
  {
    id: "desaparezcamos-amigo",
    world: "desaparezcamos",
    number: "I · 03",
    name: "El Amigo",
    archetype: "Lealtad · infancia · exilio",
    phrase:
      "La amistad es una casa que el exilio no consigue cerrar.",
    kind: "friend",
    position: [-2.25, 2.15],
    rotation: -0.15,
  },
  {
    id: "desaparezcamos-universidad",
    world: "desaparezcamos",
    number: "I · 04",
    name: "La Universidad",
    archetype: "Refugio · institución · poder",
    phrase:
      "Toda institución puede convertirse en refugio o en jaula.",
    kind: "university",
    position: [2.25, 2.2],
    rotation: 0.16,
  },

  {
    id: "jerarquia-hambre",
    world: "jerarquia",
    number: "II · 01",
    name: "El Hambre",
    archetype: "Necesidad · vacío · dominio",
    phrase:
      "El hambre no pide permiso: reorganiza el mundo alrededor de su ausencia.",
    kind: "hunger",
    position: [-2.25, -2.15],
    rotation: 0.15,
  },
  {
    id: "jerarquia-nino",
    world: "jerarquia",
    number: "II · 02",
    name: "El Niño",
    archetype: "Fragilidad · verdad · supervivencia",
    phrase:
      "El más pequeño conserva aquello que los adultos aprendieron a negar.",
    kind: "child",
    position: [2.25, -2.1],
    rotation: -0.18,
  },
  {
    id: "jerarquia-vigilante",
    world: "jerarquia",
    number: "II · 03",
    name: "El Vigilante",
    archetype: "Orden · obediencia · amenaza",
    phrase:
      "Quien vigila demasiado tiempo termina perteneciendo a la puerta.",
    kind: "watcher",
    position: [-2.25, 2.2],
    rotation: -0.1,
  },
  {
    id: "jerarquia-multitud",
    world: "jerarquia",
    number: "II · 04",
    name: "La Multitud",
    archetype: "Anonimato · cuerpo · resistencia",
    phrase:
      "Ningún sistema consigue borrar por completo el rumor de los cuerpos.",
    kind: "crowd",
    position: [2.15, 2.2],
    rotation: 0.18,
  },

  {
    id: "bielka-nina",
    world: "bielka",
    number: "III · 01",
    name: "La Niña que Despierta",
    archetype: "Regreso · respiración · memoria",
    phrase:
      "Abre los ojos como quien regresa de un mar sin orillas.",
    kind: "awakening",
    position: [-2.3, -2.15],
    rotation: 0.2,
  },
  {
    id: "bielka-carro",
    world: "bielka",
    number: "III · 02",
    name: "El Carro de Paja",
    archetype: "Llegada · tránsito · salvación",
    phrase:
      "Toda llegada verdadera parece primero una forma de rescate.",
    kind: "cart",
    position: [2.2, -2.05],
    rotation: -0.2,
  },
  {
    id: "bielka-corazon",
    world: "bielka",
    number: "III · 03",
    name: "El Corazón de Dos Mitades",
    archetype: "Vínculo · separación · reconocimiento",
    phrase:
      "Lo perdido todavía puede reconocer la forma de su otra mitad.",
    kind: "heart",
    position: [-2.25, 2.15],
    rotation: -0.12,
  },
  {
    id: "bielka-ausencia",
    world: "bielka",
    number: "III · 04",
    name: "La Casilla Blanca",
    archetype: "Laberinto · ausencia · espera",
    phrase:
      "Algo respira donde todavía no debe aparecer.",
    kind: "void",
    position: [2.25, 2.15],
    rotation: 0.12,
  },
];

export const pieceById = Object.fromEntries(
  pieces.map((piece) => [piece.id, piece])
) as Record<PieceId, WorldPiece>;
