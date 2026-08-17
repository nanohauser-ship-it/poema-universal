import type { CreatureReveal } from "./types";

export type DemoCreature = Pick<
  CreatureReveal,
  "slug" | "name" | "lineage" | "relic" | "oracle"
> & { image: string };

export const demoCreatures: DemoCreature[] = [
  {
    slug: "leon-vidrieras-rotas",
    name: "El León de las Vidrieras Rotas",
    lineage: "Felino-vidriario",
    relic: "Un colmillo de vidrio azul",
    oracle: "Incluso lo quebrado puede seguir lanzando luz.",
    image: "/bestiario/demo/leon-vidrieras.png"
  },
  {
    slug: "medusa-jardin-electrico",
    name: "La Medusa del Jardín Eléctrico",
    lineage: "Ofídico-botánico",
    relic: "Una hoja de cobre vivo",
    oracle: "Hay jardines que florecen con aquello que hiere.",
    image: "/bestiario/demo/medusa-electrica.png"
  },
  {
    slug: "dragon-llaves-dormidas",
    name: "El Dragón de las Llaves Dormidas",
    lineage: "Dracónido-custodial",
    relic: "Una llave ennegrecida",
    oracle: "No toda puerta desea la misma hora.",
    image: "/bestiario/demo/dragon-llaves.png"
  },
  {
    slug: "tortuga-archivo-estelar",
    name: "La Tortuga del Archivo Estelar",
    lineage: "Quelonio-astral",
    relic: "Una placa de latón estelar",
    oracle: "Lo eterno también avanza despacio.",
    image: "/bestiario/demo/tortuga-estelar.png"
  }
];
