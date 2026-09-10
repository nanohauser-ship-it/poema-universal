"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  MASTER_DURATION,
  masterTimeline,
} from "./world/panda-poema/MasterTimeline";

type WordStyle =
  | "normal"
  | "emphasis"
  | "italic"
  | "smallcaps"
  | "giant"
  | "soft";

type Segment = {
  text: string;
  style?: WordStyle;
};

type StoryLine = {
  segments: Segment[];
  size?:
    | "small"
    | "medium"
    | "large";
};

type StoryBeat = {
  start: number;
  end: number;

  position:
    | "lower"
    | "center";

  eyebrow?: string;

  lines: StoryLine[];

  final?: boolean;
};

const STORY_BEATS: StoryBeat[] = [
  {
    start: 2,
    end: 9,
    position: "lower",

    lines: [
      {
        size: "medium",
        segments: [
          {
            text: "Durante años, ",
            style: "soft",
          },
          {
            text: "su mundo",
            style: "italic",
          },
          {
            text: " fue una ",
          },
          {
            text: "cocina.",
            style: "emphasis",
          },
        ],
      },
    ],
  },

  {
    start: 12,
    end: 21,
    position: "lower",

    lines: [
      {
        size: "small",
        segments: [
          {
            text: "FUEGO",
            style: "smallcaps",
          },
          {
            text: "  ·  ",
            style: "soft",
          },
          {
            text: "DISCIPLINA",
            style: "smallcaps",
          },
          {
            text: "  ·  ",
            style: "soft",
          },
          {
            text: "SERVICIO",
            style: "smallcaps",
          },
        ],
      },

      {
        size: "large",
        segments: [
          {
            text: "Aprendió primero ",
            style: "soft",
          },
          {
            text: "a construir",
            style: "italic",
          },
        ],
      },

      {
        size: "large",
        segments: [
          {
            text: "con las ",
          },
          {
            text: "manos.",
            style: "emphasis",
          },
        ],
      },
    ],
  },

  {
    start: 25,
    end: 35,
    position: "center",

    lines: [
      {
        size: "medium",
        segments: [
          {
            text: "Pero llegó un momento",
            style: "soft",
          },
        ],
      },

      {
        size: "large",
        segments: [
          {
            text: "en que cocinar ",
          },
          {
            text: "ya no bastaba.",
            style: "emphasis",
          },
        ],
      },

      {
        size: "medium",
        segments: [
          {
            text: "Había preguntas ",
            style: "italic",
          },
          {
            text: "que no cabían en un plato.",
          },
        ],
      },
    ],
  },

  {
    start: 40,
    end: 50,
    position: "lower",

    lines: [
      {
        size: "large",
        segments: [
          {
            text: "Comenzó ",
            style: "soft",
          },
          {
            text: "a escribir.",
            style: "emphasis",
          },
        ],
      },

      {
        size: "small",
        segments: [
          {
            text: "No para convertirse en escritor,",
            style: "soft",
          },
        ],
      },

      {
        size: "medium",
        segments: [
          {
            text: "sino para ",
            style: "italic",
          },
          {
            text: "comprender.",
            style: "emphasis",
          },
        ],
      },
    ],
  },

  {
    start: 55,
    end: 65,
    position: "lower",

    lines: [
      {
        size: "large",
        segments: [
          {
            text: "Una historia",
            style: "italic",
          },
          {
            text: " llevó a otra.",
          },
        ],
      },

      {
        size: "medium",
        segments: [
          {
            text: "Aparecieron ",
            style: "soft",
          },
          {
            text: "libros",
            style: "emphasis",
          },
          {
            text: ", personajes, ",
          },
          {
            text: "mundos.",
            style: "emphasis",
          },
        ],
      },
    ],
  },

  {
    start: 69,
    end: 78,
    position: "center",

    eyebrow:
      "ENTONCES APARECIÓ UNA PREGUNTA",

    lines: [
      {
        size: "large",
        segments: [
          {
            text: "¿Y si una obra",
            style: "italic",
          },
        ],
      },

      {
        size: "large",
        segments: [
          {
            text: "no perteneciera",
            style: "emphasis",
          },
        ],
      },

      {
        size: "medium",
        segments: [
          {
            text: "a una sola ",
          },
          {
            text: "voz?",
            style: "giant",
          },
        ],
      },
    ],
  },

  {
    start: 80,
    end: 90,
    position: "lower",

    lines: [
      {
        size: "medium",
        segments: [
          {
            text: "Empezó a buscar personas",
            style: "soft",
          },
        ],
      },

      {
        size: "medium",
        segments: [
          {
            text: "que nunca había conocido.",
            style: "italic",
          },
        ],
      },

      {
        size: "large",
        segments: [
          {
            text: "Otras lenguas.",
            style: "emphasis",
          },
          {
            text: "  Otras vidas.  ",
          },
          {
            text: "Otras voces.",
            style: "emphasis",
          },
        ],
      },
    ],
  },

  {
    start: 91,
    end: 98,
    position: "center",

    lines: [
      {
        size: "small",
        segments: [
          {
            text: "ASÍ NACIÓ",
            style: "smallcaps",
          },
        ],
      },

      {
        size: "large",
        segments: [
          {
            text: "Poema",
            style: "italic",
          },
          {
            text: " Universal.",
            style: "giant",
          },
        ],
      },
    ],
  },

  {
    start: 98,
    end: 105,
    position: "center",
    final: true,

    eyebrow:
      "SESENTA VOCES · UNA OBRA COMÚN",

    lines: [
      {
        size: "large",
        segments: [
          {
            text: "POEMA",
            style: "soft",
          },
        ],
      },

      {
        size: "large",
        segments: [
          {
            text: "UNIVERSAL",
            style: "giant",
          },
        ],
      },

      {
        size: "small",
        segments: [
          {
            text: "Un cocinero entró en esta historia.",
            style: "soft",
          },
        ],
      },

      {
        size: "medium",
        segments: [
          {
            text: "Al otro lado apareció ",
            style: "italic",
          },
          {
            text: "un mundo.",
            style: "emphasis",
          },
        ],
      },
    ],
  },
];

function clamp01(
  value: number,
) {
  return Math.min(
    1,
    Math.max(
      0,
      value,
    ),
  );
}

function beatOpacity(
  seconds: number,
  beat: StoryBeat,
) {
  const fadeIn = 0.9;
  const fadeOut = 0.9;

  if (
    seconds < beat.start ||
    seconds > beat.end
  ) {
    return 0;
  }

  const entering =
    clamp01(
      (seconds - beat.start) /
        fadeIn,
    );

  const leaving =
    clamp01(
      (beat.end - seconds) /
        fadeOut,
    );

  return Math.min(
    entering,
    leaving,
  );
}

export function StoryTextOverlay() {
  const [seconds, setSeconds] =
    useState(0);

  useEffect(() => {
    let frame = 0;
    let previous = -1;

    const update = () => {
      const next =
        masterTimeline.progress *
        MASTER_DURATION;

      if (
        Math.abs(
          next - previous,
        ) > 0.025
      ) {
        previous = next;
        setSeconds(next);
      }

      frame =
        window.requestAnimationFrame(
          update,
        );
    };

    frame =
      window.requestAnimationFrame(
        update,
      );

    return () => {
      window.cancelAnimationFrame(
        frame,
      );
    };
  }, []);

  const beat =
    STORY_BEATS.find(
      (candidate) =>
        seconds >= candidate.start &&
        seconds <= candidate.end,
    );

  if (!beat) {
    return null;
  }

  const opacity =
    beatOpacity(
      seconds,
      beat,
    );

  return (
    <>
      <section
        className={[
          "puStory",
          beat.position === "center"
            ? "puStoryCenter"
            : "puStoryLower",
          beat.final
            ? "puStoryFinal"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          opacity,
        }}
      >
        {beat.eyebrow && (
          <div className="puStoryEyebrow">
            {beat.eyebrow}
          </div>
        )}

        <div className="puStoryComposition">
          {beat.lines.map(
            (
              line,
              lineIndex,
            ) => (
              <div
                key={lineIndex}
                className={[
                  "puStoryLine",
                  `puStoryLine--${
                    line.size ??
                    "medium"
                  }`,
                ].join(" ")}
              >
                {line.segments.map(
                  (
                    segment,
                    segmentIndex,
                  ) => (
                    <span
                      key={
                        segmentIndex
                      }
                      className={[
                        "puStoryWord",
                        `puStoryWord--${
                          segment.style ??
                          "normal"
                        }`,
                      ].join(" ")}
                    >
                      {
                        segment.text
                      }
                    </span>
                  ),
                )}
              </div>
            ),
          )}
        </div>
      </section>

      <style jsx>{`
        .puStory {
          position: fixed;
          z-index: 2147482500;

          left: 50%;

          width:
            min(
              980px,
              calc(
                100vw -
                90px
              )
            );

          transform:
            translateX(-50%);

          pointer-events: none;
          user-select: none;

          text-align: center;

          padding:
            16px 28px 18px;

          border-radius:
            18px;

          background:
            linear-gradient(
              90deg,
              rgba(24, 17, 9, 0.06) 0%,
              rgba(24, 17, 9, 0.34) 22%,
              rgba(24, 17, 9, 0.38) 50%,
              rgba(24, 17, 9, 0.34) 78%,
              rgba(24, 17, 9, 0.06) 100%
            );

          backdrop-filter:
            blur(4px);

          -webkit-backdrop-filter:
            blur(4px);

          color:
            rgba(
              249,
              242,
              226,
              0.98
            );

          transition:
            opacity 90ms linear;

          text-shadow:
            0 2px 4px
              rgba(
                0,
                0,
                0,
                0.90
              ),
            0 6px 18px
              rgba(
                0,
                0,
                0,
                0.48
              );

          -webkit-text-stroke:
            0.18px
            rgba(
              38,
              25,
              10,
              0.62
            );
        }

        .puStoryLower {
          bottom: 19%;
        }

        .puStoryCenter {
          top: 50%;

          transform:
            translate(
              -50%,
              -50%
            );
        }

        .puStoryComposition {
          display: flex;
          flex-direction: column;

          align-items: center;

          gap: 4px;
        }

        .puStoryLine {
          width: 100%;

          line-height: 1.05;
        }

        .puStoryLine--small {
          font-size:
            clamp(
              12px,
              1.15vw,
              17px
            );

          line-height: 1.45;
        }

        .puStoryLine--medium {
          font-size:
            clamp(
              21px,
              2.2vw,
              33px
            );

          line-height: 1.28;
        }

        .puStoryLine--large {
          font-size:
            clamp(
              30px,
              3.5vw,
              54px
            );

          line-height: 1.08;
        }

        .puStoryWord {
          font-family:
            "Times New Roman",
            Times,
            serif;

          font-weight: 400;
        }

        .puStoryWord--normal {
          letter-spacing:
            0.005em;
        }

        .puStoryWord--soft {
          font-family:
            "Times New Roman",
            Times,
            serif;

          font-weight: 400;

          opacity: 0.92;
        }

        .puStoryWord--italic {
          font-family:
            "Times New Roman",
            Times,
            serif;

          font-style: italic;

          font-weight: 400;

          letter-spacing:
            -0.015em;
        }

        .puStoryWord--emphasis {
          display: inline-block;

          margin:
            0 0.04em;

          font-family:
            "Times New Roman",
            Times,
            serif;

          font-size: 1.32em;

          font-style: italic;

          font-weight: 500;

          letter-spacing:
            -0.035em;

          color:
            rgba(
              244,
              191,
              74,
              1
            );

          text-shadow:
            0 2px 4px
              rgba(0, 0, 0, 0.92),
            0 5px 14px
              rgba(0, 0, 0, 0.42);

          transform:
            translateY(
              0.02em
            );
        }

        .puStoryWord--giant {
          display: inline-block;

          font-family:
            "Times New Roman",
            Times,
            serif;

          font-size: 1.62em;

          font-weight: 500;

          letter-spacing:
            -0.045em;

          line-height: 0.8;

          color:
            rgba(
              255,
              207,
              91,
              1
            );

          text-shadow:
            0 2px 5px
              rgba(0, 0, 0, 0.94),
            0 7px 18px
              rgba(0, 0, 0, 0.42);
        }

        .puStoryWord--smallcaps {
          font-family:
            "Avenir Next",
            Avenir,
            "Helvetica Neue",
            Helvetica,
            Arial,
            sans-serif;

          font-size: 0.72em;

          font-weight: 600;

          letter-spacing:
            0.32em;

          text-transform:
            uppercase;

          color:
            rgba(
              218,
              174,
              78,
              0.98
            );
        }

        .puStoryEyebrow {
          margin-bottom: 17px;

          font-family:
            "Avenir Next",
            Avenir,
            "Helvetica Neue",
            Helvetica,
            Arial,
            sans-serif;

          font-size:
            clamp(
              8px,
              0.75vw,
              11px
            );

          font-weight: 600;

          letter-spacing:
            0.38em;

          text-transform:
            uppercase;

          color:
            rgba(
              239,
              207,
              139,
              0.96
            );
        }

        .puStoryFinal
          .puStoryLine:nth-child(1) {
          margin-bottom: -6px;

          font-size:
            clamp(
              24px,
              2.8vw,
              42px
            );

          letter-spacing:
            0.15em;
        }

        .puStoryFinal
          .puStoryLine:nth-child(2) {
          margin-bottom: 24px;

          font-size:
            clamp(
              47px,
              7vw,
              102px
            );

          line-height: 0.86;
        }

        .puStoryFinal
          .puStoryLine:nth-child(3) {
          margin-top: 8px;
        }

        @media (
          max-width: 700px
        ) {
          .puStory {
            width:
              calc(
                100vw -
                38px
              );
          }

          .puStoryLower {
            bottom: 14%;
          }

          .puStoryWord--giant {
            font-size: 1.3em;
          }

          .puStoryWord--emphasis {
            font-size: 1.14em;
          }
        }
      `}</style>
    </>
  );
}
