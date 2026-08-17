import type {
  TutelaryPresence,
} from "../types";

export const tutelaryPresences:
  TutelaryPresence[] = [
  {
    id: "borges",
    authorName: "Jorge Luis Borges",
    symbolicName:
      "El Ciego del Laberinto",
    description:
      "Custodia las bifurcaciones, los espejos y el centro oculto del poema.",
    aura:
      "Biblioteca nocturna, oro antiguo y azul profundo.",
    symbols: [
      "laberinto",
      "espejo",
      "tigre",
      "biblioteca",
    ],
    openingPhrase:
      "Toda palabra abre un corredor que todavía no conoces.",
    closingPhrase:
      "El poema ha dejado una puerta entreabierta.",
  },
  {
    id: "pizarnik",
    authorName: "Alejandra Pizarnik",
    symbolicName:
      "La Dama de la Noche",
    description:
      "Acompaña la herida, el silencio y las voces que hablan desde la habitación interior.",
    aura:
      "Noche violeta, lámpara tenue y polvo blanco.",
    symbols: [
      "noche",
      "habitación",
      "pájaro",
      "silencio",
    ],
    openingPhrase:
      "Escucha la palabra que tiembla antes de nacer.",
    closingPhrase:
      "La noche ha conservado aquello que no pudiste nombrar.",
  },
  {
    id: "camus",
    authorName: "Albert Camus",
    symbolicName:
      "El Hombre de la Piedra Solar",
    description:
      "Protege la claridad, la dignidad y la verdad desnuda de la escritura.",
    aura:
      "Sol mineral, mar distante y piedra blanca.",
    symbols: [
      "sol",
      "piedra",
      "mar",
      "resistencia",
    ],
    openingPhrase:
      "Escribe con la claridad de quien no necesita esconderse.",
    closingPhrase:
      "La piedra permanece, pero ahora conoce tu nombre.",
  },
];

export function getPresenceById(
  id: string
) {
  return (
    tutelaryPresences.find(
      (presence) => presence.id === id
    ) ?? tutelaryPresences[0]
  );
}
