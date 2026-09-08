"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useLiveSession,
} from "./LiveSessionProvider";

import {
  DIRECTOR_CHANNEL,
  type DirectorCommand,
} from "../director/director-channel";

import styles from "./EphemeralMessageStage.module.css";

type MessageKind =
  | "word"
  | "reflection"
  | "audience"
  | "question"
  | "humanity"
  | "quote"
  | "silence";

type Message = {
  id: string;
  kind: MessageKind;
  text: string;
  author?: string;
};

const universalWords = [
  "MADRE",
  "CASA",
  "AGUA",
  "TERNURA",
  "MEMORIA",
  "DIGNIDAD",
  "TIEMPO",
  "ESCUCHA",
  "OTRO",
  "INFANCIA",
  "TIERRA",
  "PERDÓN",
  "AUSENCIA",
  "ESPERANZA",
  "TODAVÍA",
  "NOSOTROS",
  "FRONTERA",
  "HAMBRE",
  "CUIDADO",
  "REGRESO",
];

const reflections = [
  "La memoria también es una forma de presencia.",
  "La ternura también es una forma de inteligencia.",
  "Escuchar es permitir que otra existencia modifique la nuestra.",
  "Hay palabras a las que seguimos regresando.",
  "Una civilización también puede medirse por aquello que decide no destruir.",
  "Hay silencios que contienen más mundo que una respuesta.",
  "No todo lo que puede hacerse merece ser hecho.",
  "Toda esperanza necesita un lenguaje para poder existir.",
  "La dignidad comienza cuando dejamos de mirar al otro como una cosa.",
  "Hay cosas que solo existen mientras alguien las recuerda.",
  "Ningún algoritmo podrá devolverte una tarde que no viviste.",
  "No necesitas dejar una huella en el mundo. También puedes dejar el mundo un poco menos herido.",
];

const questions = [
  "¿A quién estás dejando desaparecer?",
  "¿Qué parte de tu vida estás aplazando?",
  "¿Sabes escuchar sin preparar una respuesta?",
  "¿Qué estás haciendo con el poco tiempo que tienes?",
  "¿Qué has normalizado que nunca debería haber sido normal?",
  "¿Qué le debes a quienes todavía no han nacido?",
  "¿Cuánta belleza has dejado de mirar por tener prisa?",
  "¿Qué defenderías aunque nadie pudiera verlo?",
  "¿En qué momento dejamos de reconocernos unos a otros?",
  "¿Qué palabra conservarías si solo pudieras salvar una?",
  "¿Qué necesita hoy el mundo para no endurecerse?",
  "¿Cuándo empieza realmente un regreso?",
];

const humanityMessages = [
  "No sois propietarios del futuro. Sois sus antepasados.",
  "Nadie debería acostumbrarse al sufrimiento de otro.",
  "Nunca había sido tan fácil estar conectados y no conocer a nadie.",
  "La tecnología amplifica nuestras capacidades. No garantiza nuestra sabiduría.",
  "Quizá el progreso consista en abandonar a menos gente por el camino.",
  "Dentro de cien años casi ninguno de nosotros estará aquí. Nuestras decisiones sí.",
  "No conviertas a nadie en una abstracción.",
  "El conocimiento humano crece. La pregunta es qué vamos a hacer con él.",
  "Una frontera existe en los mapas. El hambre existe en el cuerpo.",
  "Todavía estamos aquí.",
];

const publicDomainQuotes = [
  {
    text: "I contain multitudes.",
    author: "Walt Whitman",
  },
  {
    text: "Hope is the thing with feathers.",
    author: "Emily Dickinson",
  },
];

function randomItem<T>(
  items: T[],
): T {
  return items[
    Math.floor(
      Math.random() * items.length,
    )
  ];
}

function randomBetween(
  min: number,
  max: number,
) {
  return (
    Math.floor(
      Math.random() *
        (max - min + 1),
    ) + min
  );
}

function makeId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export default function EphemeralMessageStage() {
  const {
    state,
  } = useLiveSession();

  const [message, setMessage] =
    useState<Message | null>(null);

  const [visible, setVisible] =
    useState(false);

  const timeoutRef =
    useRef<number | null>(null);

  const hideRef =
    useRef<number | null>(null);

  const revealRef =
    useRef<number | null>(null);

  const clearMessageRef =
    useRef<number | null>(null);

  const mountedRef =
    useRef(true);

  const lastTextsRef =
    useRef<string[]>([]);

  const lastSoulIdRef =
    useRef("");

  function remember(text: string) {
    lastTextsRef.current = [
      text,
      ...lastTextsRef.current.filter(
        (item) => item !== text,
      ),
    ].slice(0, 8);
  }

  function notRecentlyUsed(
    text: string,
  ) {
    return !lastTextsRef.current.includes(
      text,
    );
  }

  function chooseUnique(
    items: string[],
  ) {
    const available =
      items.filter(
        notRecentlyUsed,
      );

    return randomItem(
      available.length
        ? available
        : items,
    );
  }

  function durationFor(
    next: Message,
  ) {
    const base =
      next.kind === "word"
        ? 3200
        : next.kind === "question"
          ? 7200
          : next.kind === "humanity"
            ? 8000
            : next.kind === "quote"
              ? 7000
              : 6200;

    return (
      base +
      Math.min(
        1800,
        next.text.length * 18,
      )
    );
  }

  function show(
    next: Message,
  ) {
    if (hideRef.current) {
      window.clearTimeout(
        hideRef.current,
      );
    }

    if (revealRef.current) {
      window.clearTimeout(
        revealRef.current,
      );
    }

    if (clearMessageRef.current) {
      window.clearTimeout(
        clearMessageRef.current,
      );
    }

    setVisible(false);

    revealRef.current =
      window.setTimeout(() => {
        if (!mountedRef.current) {
          return;
        }

        setMessage(next);
        remember(next.text);
        setVisible(true);

        hideRef.current =
          window.setTimeout(() => {
            if (!mountedRef.current) {
              return;
            }

            setVisible(false);

            clearMessageRef.current =
              window.setTimeout(() => {
                if (!mountedRef.current) {
                  return;
                }

                setMessage(null);
              }, 1000);
          }, durationFor(next));
      }, 500);
  }

  function chooseMessage():
    Message | null {
    const roll =
      Math.random();

    const mindWords =
      state.dominantWords.filter(
        Boolean,
      );

    if (
      mindWords.length > 0 &&
      Math.random() < 0.34
    ) {
      return {
        id: makeId(),
        kind: "word",
        text:
          randomItem(
            mindWords,
          ).toUpperCase(),
      };
    }

    if (roll < 0.26) {
      return {
        id: makeId(),
        kind: "word",
        text:
          chooseUnique(
            universalWords,
          ),
      };
    }

    if (roll < 0.52) {
      return {
        id: makeId(),
        kind: "reflection",
        text:
          chooseUnique(
            reflections,
          ),
      };
    }

    if (roll < 0.71) {
      return {
        id: makeId(),
        kind: "question",
        text:
          chooseUnique(
            questions,
          ),
      };
    }

    if (roll < 0.84) {
      return {
        id: makeId(),
        kind: "humanity",
        text:
          chooseUnique(
            humanityMessages,
          ),
      };
    }

    if (roll < 0.91) {
      const quote =
        randomItem(
          publicDomainQuotes,
        );

      return {
        id: makeId(),
        kind: "quote",
        text: quote.text,
        author: quote.author,
      };
    }

    return null;
  }

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("BroadcastChannel" in window)
    ) {
      return;
    }

    const channel =
      new BroadcastChannel(
        DIRECTOR_CHANNEL,
      );

    channel.onmessage = (
      event:
        MessageEvent<DirectorCommand>,
    ) => {
      const command =
        event.data;

      if (
        command.type !==
        "PROJECT_MESSAGE"
      ) {
        return;
      }

      show({
        id:
          command.messageId,
        kind:
          "audience",
        text:
          command.text,
        author:
          command.place
            ? `${command.author} · ${command.place}`
            : command.author,
      });
    };

    return () => {
      channel.close();
    };
  }, []);

  useEffect(() => {
    const expression =
      state.currentExpression;

    if (!expression) {
      return;
    }

    const signature = [
      expression.type,
      expression.text,
      expression.author ?? "",
    ].join("|");

    if (
      signature ===
      lastSoulIdRef.current
    ) {
      return;
    }

    lastSoulIdRef.current =
      signature;

    if (
      expression.type ===
      "silence"
    ) {
      setVisible(false);
      return;
    }

    show({
      id: makeId(),
      kind:
        expression.type,
      text:
        expression.text,
      author:
        expression.author,
    });
  }, [
    state.currentExpression,
  ]);

  useEffect(() => {
    mountedRef.current = true;

    function scheduleNext() {
      const pulse =
        Math.max(
          50,
          Math.min(
            110,
            state.artisticPulse || 68,
          ),
        );

      const beatMs =
        60000 / pulse;

      const beats =
        randomBetween(5, 14);

      timeoutRef.current =
        window.setTimeout(() => {
          const next =
            chooseMessage();

          if (next) {
            show(next);
          } else {
            setVisible(false);
          }

          scheduleNext();
        }, beatMs * beats);
    }

    scheduleNext();

    return () => {
      mountedRef.current = false;

      if (timeoutRef.current) {
        window.clearTimeout(
          timeoutRef.current,
        );
      }

      if (hideRef.current) {
        window.clearTimeout(
          hideRef.current,
        );
      }

      if (revealRef.current) {
        window.clearTimeout(
          revealRef.current,
        );
      }

      if (clearMessageRef.current) {
        window.clearTimeout(
          clearMessageRef.current,
        );
      }

      timeoutRef.current = null;
      hideRef.current = null;
      revealRef.current = null;
      clearMessageRef.current = null;
    };
  }, [
    state.artisticPulse,
    state.dominantWords,
  ]);

  return (
    <div
      className={styles.stage}
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className={`${styles.message} ${
          visible
            ? styles.visible
            : styles.hidden
        }`}
        data-kind={
          message?.kind ??
          "silence"
        }
      >
        {message && (
          <>
            <span
              className={
                styles.text
              }
            >
              {message.text}
            </span>

            {message.author && (
              <span
                className={
                  styles.author
                }
              >
                {message.author}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
