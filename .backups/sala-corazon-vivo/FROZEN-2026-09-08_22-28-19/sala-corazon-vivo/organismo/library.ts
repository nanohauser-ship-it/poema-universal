import type { SoulExpression } from "./types";

export const essentialWords = [
  "casa",
  "madre",
  "memoria",
  "regreso",
  "ternura",
  "dignidad",
  "luz",
  "silencio",
  "agua",
  "fraternidad",
  "ausencia",
  "esperanza",
  "miedo",
  "tiempo",
  "otro",
];

export const reflections: SoulExpression[] = [
  {
    type: "reflection",
    text: "La memoria también es una forma de presencia.",
  },
  {
    type: "reflection",
    text: "Hay palabras a las que seguimos regresando.",
  },
  {
    type: "reflection",
    text: "Escuchar también es una forma de cuidado.",
  },
  {
    type: "reflection",
    text: "Toda pérdida modifica el lugar al que llamábamos casa.",
  },
  {
    type: "reflection",
    text: "La ternura también puede ser una forma de resistencia.",
  },
  {
    type: "reflection",
    text: "Hay silencios que contienen más mundo que una respuesta.",
  },
  {
    type: "reflection",
    text: "La dignidad comienza cuando dejamos de mirar al otro como una cosa.",
  },
  {
    type: "reflection",
    text: "Toda esperanza necesita un lenguaje para poder existir.",
  },
];

export const questions: SoulExpression[] = [
  {
    type: "question",
    text: "¿Qué queda de nosotros en quienes nos recuerdan?",
  },
  {
    type: "question",
    text: "¿Cuándo empieza realmente un regreso?",
  },
  {
    type: "question",
    text: "¿Qué necesita hoy el mundo para no endurecerse?",
  },
  {
    type: "question",
    text: "¿Qué palabra conservarías si solo pudieras salvar una?",
  },
  {
    type: "question",
    text: "¿Puede una casa seguir existiendo después de perder a quien la habitaba?",
  },
];

export const quotes: SoulExpression[] = [
  {
    type: "quote",
    text: "Hope is the thing with feathers.",
    author: "Emily Dickinson",
    work: "Poem 254",
    source: "Public domain",
  },
  {
    type: "quote",
    text: "I contain multitudes.",
    author: "Walt Whitman",
    work: "Song of Myself",
    source: "Public domain",
  },
];

export const silenceExpression: SoulExpression = {
  type: "silence",
  text: "",
};
