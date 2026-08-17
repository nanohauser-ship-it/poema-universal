import {
  humanGestures,
  humanityMessages,
  publicDomainQuotes,
  questions,
  reflections,
  universalWords,
} from "../ephemeral-corpus";

import {
  silenceExpression,
} from "./library";

import type {
  MindState,
  SoulExpression,
} from "./types";

function pick<T>(
  items: T[],
): T {
  return items[
    Math.floor(
      Math.random() *
        items.length,
    )
  ];
}

function wordExpression(
  text: string,
): SoulExpression {
  return {
    type: "word",
    text: text.toUpperCase(),
  };
}

function reflectionExpression(
  text: string,
): SoulExpression {
  return {
    type: "reflection",
    text,
  };
}

function questionExpression(
  text: string,
): SoulExpression {
  return {
    type: "question",
    text,
  };
}

export function expressSoul(
  mind: MindState,
): SoulExpression {
  /*
   * El silencio sigue siendo
   * una respuesta legítima.
   */
  if (
    mind.silenceRecommended &&
    Math.random() < 0.6
  ) {
    return silenceExpression;
  }

  /*
   * Palabras detectadas en la sala
   * tienen prioridad ocasional.
   */
  if (
    mind.dominantWords.length > 0 &&
    Math.random() < 0.32
  ) {
    return wordExpression(
      pick(
        mind.dominantWords,
      ),
    );
  }

  /*
   * MEMORIA
   */
  if (
    mind.themes.includes("memoria")
  ) {
    const memoryTexts =
      reflections.filter(
        (text) => {
          const value =
            text.toLowerCase();

          return (
            value.includes("memoria") ||
            value.includes("recuerdo") ||
            value.includes("regreso") ||
            value.includes("ausencia") ||
            value.includes("casa")
          );
        },
      );

    if (
      memoryTexts.length &&
      Math.random() < 0.7
    ) {
      return reflectionExpression(
        pick(memoryTexts),
      );
    }
  }

  /*
   * VÍNCULO
   */
  if (
    mind.themes.includes("vinculo")
  ) {
    const bondTexts =
      reflections.filter(
        (text) => {
          const value =
            text.toLowerCase();

          return (
            value.includes("ternura") ||
            value.includes("cuidado") ||
            value.includes("madre") ||
            value.includes("persona") ||
            value.includes("escuchar")
          );
        },
      );

    if (bondTexts.length) {
      return reflectionExpression(
        pick(bondTexts),
      );
    }
  }

  /*
   * HUMANIDAD
   */
  if (
    mind.themes.includes(
      "humanidad",
    ) &&
    Math.random() < 0.75
  ) {
    return reflectionExpression(
      pick(humanityMessages),
    );
  }

  /*
   * ESPERANZA
   */
  if (
    mind.themes.includes(
      "esperanza",
    )
  ) {
    if (
      Math.random() < 0.18 &&
      publicDomainQuotes.length
    ) {
      const quote =
        pick(
          publicDomainQuotes,
        );

      return {
        type: "quote",
        text: quote.text,
        author: quote.author,
        source: "Public domain",
      };
    }

    const hopeful =
      reflections.filter(
        (text) => {
          const value =
            text.toLowerCase();

          return (
            value.includes("esperanza") ||
            value.includes("luz") ||
            value.includes("futuro")
          );
        },
      );

    if (hopeful.length) {
      return reflectionExpression(
        pick(hopeful),
      );
    }
  }

  /*
   * Intensidad alta:
   * preguntas.
   */
  if (
    mind.intensity > 0.62 &&
    Math.random() < 0.55
  ) {
    return questionExpression(
      pick(questions),
    );
  }

  /*
   * Distribución general.
   */
  const roll =
    Math.random();

  if (roll < 0.18) {
    return wordExpression(
      pick(universalWords),
    );
  }

  if (roll < 0.45) {
    return reflectionExpression(
      pick(reflections),
    );
  }

  if (roll < 0.65) {
    return questionExpression(
      pick(questions),
    );
  }

  if (roll < 0.82) {
    return reflectionExpression(
      pick(humanityMessages),
    );
  }

  if (roll < 0.94) {
    return reflectionExpression(
      pick(humanGestures),
    );
  }

  if (
    publicDomainQuotes.length
  ) {
    const quote =
      pick(
        publicDomainQuotes,
      );

    return {
      type: "quote",
      text: quote.text,
      author: quote.author,
      source: "Public domain",
    };
  }

  return reflectionExpression(
    pick(reflections),
  );
}
