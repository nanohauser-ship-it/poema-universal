"use client";

import {
  useLayoutEffect,
  useState,
} from "react";

import {
  masterPause,
  masterPlay,
  masterSeek,
  masterTimeline,
} from "./world/panda-poema/MasterTimeline";

/*
 * POEMA UNIVERSAL 2026 · PRESENTA
 *
 * Prólogo independiente.
 * Duración total: 3 segundos.
 *
 * Imagen quieta.
 * Texto debajo de la imagen.
 * El timeline principal permanece
 * congelado hasta terminar.
 */

const INTRO_DURATION = 3;
const FADE_IN = 0.2;
const FADE_OUT = 0.5;

export function IcarusPaperScene() {
  const [introSeconds, setIntroSeconds] =
    useState(0);

  const [finished, setFinished] =
    useState(false);

  useLayoutEffect(() => {
    masterPause();
    masterSeek(0);

    masterTimeline.progress = 0;
    masterTimeline.worldProgress = 0;
    masterTimeline.elapsed = 0;
    masterTimeline.playing = false;

    let frame = 0;

    const startedAt =
      performance.now();

    const update = (
      now: number,
    ) => {
      const elapsed =
        (now - startedAt) /
        1000;

      /*
       * El mundo permanece
       * completamente congelado.
       */
      masterTimeline.progress = 0;
      masterTimeline.worldProgress = 0;
      masterTimeline.elapsed = 0;
      masterTimeline.playing = false;

      setIntroSeconds(elapsed);

      if (
        elapsed >=
        INTRO_DURATION
      ) {
        masterSeek(0);

        masterTimeline.progress = 0;
        masterTimeline.worldProgress = 0;
        masterTimeline.elapsed = 0;

        masterPlay();

        setFinished(true);

        return;
      }

      frame =
        requestAnimationFrame(
          update,
        );
    };

    frame =
      requestAnimationFrame(
        update,
      );

    return () => {
      cancelAnimationFrame(
        frame,
      );
    };
  }, []);

  if (finished) {
    return null;
  }

  const fadeIn =
    Math.min(
      1,
      introSeconds /
        FADE_IN,
    );

  const fadeOutStart =
    INTRO_DURATION -
    FADE_OUT;

  const fadeOut =
    introSeconds <
    fadeOutStart
      ? 1
      : Math.max(
          0,
          1 -
            (
              introSeconds -
              fadeOutStart
            ) /
              FADE_OUT,
        );

  const opacity =
    Math.min(
      fadeIn,
      fadeOut,
    );

  return (
    <>
      <section
        className="puIcarusPrologue"
        style={{
          opacity,
        }}
        aria-hidden="true"
      >
        <div className="puIcarusComposition">
          <img
            src="/poema-universal/presentacion-viva-v2/icaro/icaro-papel.png"
            alt=""
            className="puIcarusImage"
          />

          <div className="puIcarusTitle">
            <div className="puIcarusBrand">
              POEMA UNIVERSAL
              <span>2026</span>
            </div>

            <div className="puIcarusPresents">
              presenta
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .puIcarusPrologue {
          position: fixed;
          inset: 0;

          z-index: 2147482600;

          display: flex;
          align-items: center;
          justify-content: center;

          overflow: hidden;

          pointer-events: none;
          user-select: none;

          background:
            rgb(
              211,
              192,
              156
            );
        }

        .puIcarusComposition {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          width:
            min(
              980px,
              68vw
            );

          transform: none;
        }

        .puIcarusImage {
          display: block;

          width: 100%;
          height: auto;

          max-height: 67vh;

          object-fit: contain;

          transform: none;

          filter:
            saturate(0.94)
            contrast(1.02)
            brightness(1.01);
        }

        /*
         * TEXTO DEBAJO
         * Ya no pisa la imagen.
         */
        .puIcarusTitle {
          margin-top: 18px;

          width: 100%;

          text-align: center;

          color:
            rgb(
              126,
              81,
              20
            );

          text-shadow:
            0 1px 0
              rgba(
                255,
                239,
                199,
                0.34
              );
        }

        .puIcarusBrand {
          font-family:
            Didot,
            "Bodoni 72",
            Baskerville,
            Georgia,
            serif;

          font-size:
            clamp(
              24px,
              2.7vw,
              43px
            );

          font-weight: 500;

          line-height: 1;

          letter-spacing:
            0.105em;

          text-transform:
            uppercase;
        }

        .puIcarusBrand span {
          display: inline-block;

          margin-left: 0.32em;

          font-size: 0.5em;

          vertical-align: top;

          letter-spacing:
            0.14em;

          color:
            rgb(
              165,
              112,
              30
            );
        }

        .puIcarusPresents {
          margin-top: 7px;

          font-family:
            Baskerville,
            "Iowan Old Style",
            Georgia,
            serif;

          font-size:
            clamp(
              16px,
              1.35vw,
              22px
            );

          font-style: italic;

          letter-spacing:
            0.07em;

          color:
            rgb(
              151,
              98,
              24
            );
        }

        @media (
          max-width: 800px
        ) {
          .puIcarusComposition {
            width: 86vw;
          }

          .puIcarusImage {
            max-height: 61vh;
          }

          .puIcarusTitle {
            margin-top: 14px;
          }
        }
      `}</style>
    </>
  );
}
