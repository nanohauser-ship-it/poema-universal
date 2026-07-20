import type { WorldId } from "./worlds";

export type PieceKind =
  | "exile"
  | "promise"
  | "wounded-university"
  | "empty-chair"
  | "hunger"
  | "child"
  | "watcher"
  | "crowd"
  | "awakening"
  | "cart"
  | "heart"
  | "void";

export type PieceId =
  | "desaparezcamos-exiliado"
  | "desaparezcamos-promesa"
  | "desaparezcamos-universidad-herida"
  | "desaparezcamos-silla-vacia"
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
    id: "desaparezcamos-exiliado",
    world: "desaparezcamos",
    number: "I · 01",
    name: "El Exiliado",
    archetype: "Partida · memoria · hogar",
    phrase:
      "Hay seres que abandonan una casa y pasan el resto de su vida llevándola dentro.",
    kind: "exile",
    position: [-2.35, -2.25],
    rotation: 0.2,
    scale: 0.88,
  },
  {
    id: "desaparezcamos-promesa",
    world: "desaparezcamos",
    number: "I · 02",
    name: "La Promesa",
    archetype: "Vínculo · deseo · interrupción",
    phrase:
      "Dos manos pueden pasar toda una vida intentando terminar el mismo gesto.",
    kind: "promise",
    position: [2.2, -2.15],
    rotation: -0.18,
    scale: 0.9,
  },
  {
    id: "desaparezcamos-universidad-herida",
    world: "desaparezcamos",
    number: "I · 03",
    name: "La Universidad Herida",
    archetype: "Conocimiento · poder · ruina",
    phrase:
      "Incluso dentro de una institución quebrada puede comenzar a crecer una rama.",
    kind: "wounded-university",
    position: [-2.25, 2.15],
    rotation: -0.12,
    scale: 0.86,
  },
  {
    id: "desaparezcamos-silla-vacia",
    world: "desaparezcamos",
    number: "I · 04",
    name: "La Silla Vacía",
    archetype: "Ausencia · espera · recuerdo",
    phrase:
      "Algunas ausencias continúan sentándose entre nosotros.",
    kind: "empty-chair",
    position: [2.25, 2.2],
    rotation: 0.16,
    scale: 0.9,
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
