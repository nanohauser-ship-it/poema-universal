import type { WorldId } from "./worlds";

export type PieceKind =
  | "exile"
  | "promise"
  | "wounded-university"
  | "empty-chair"
  | "atlas"
  | "hierarchy-table"
  | "empty-plate"
  | "broken-chain"
  | "awakening"
  | "cart"
  | "heart"
  | "void";

export type PieceId =
  | "desaparezcamos-exiliado"
  | "desaparezcamos-promesa"
  | "desaparezcamos-universidad-herida"
  | "desaparezcamos-silla-vacia"
  | "jerarquia-atlas"
  | "jerarquia-mesa"
  | "jerarquia-plato-vacio"
  | "jerarquia-cadena-rota"
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
    id: "jerarquia-atlas",
    world: "jerarquia",
    number: "II · 01",
    name: "Atlas",
    archetype: "Lealtad · resistencia · memoria",
    phrase:
      "Incluso dentro del hambre, alguien conserva una cosa pequeña por la que volver.",
    kind: "atlas",
    position: [-2.25, -2.15],
    rotation: 0.18,
    scale: 0.88,
  },
  {
    id: "jerarquia-mesa",
    world: "jerarquia",
    number: "II · 02",
    name: "La Mesa de la Jerarquía",
    archetype: "Distribución · privilegio · obediencia",
    phrase:
      "La altura de una mesa decide a veces quién puede alcanzar el alimento.",
    kind: "hierarchy-table",
    position: [2.25, -2.1],
    rotation: -0.16,
    scale: 0.84,
  },
  {
    id: "jerarquia-plato-vacio",
    world: "jerarquia",
    number: "II · 03",
    name: "El Plato Vacío",
    archetype: "Ausencia · necesidad · respiración",
    phrase:
      "El vacío también aprende a respirar.",
    kind: "empty-plate",
    position: [-2.25, 2.2],
    rotation: -0.12,
    scale: 0.9,
  },
  {
    id: "jerarquia-cadena-rota",
    world: "jerarquia",
    number: "II · 04",
    name: "La Cadena Rota",
    archetype: "Liberación · miedo · aprendizaje",
    phrase:
      "Romper un eslabón no basta cuando el cuerpo todavía recuerda la obediencia.",
    kind: "broken-chain",
    position: [2.15, 2.2],
    rotation: 0.16,
    scale: 0.88,
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
