"use client";

import {
  useEffect,
} from "react";

import {
  MASTER_DURATION,
  masterSeek,
  masterToggle,
  masterTimeline,
} from "./world/panda-poema/MasterTimeline";

function isEditableTarget(
  target: EventTarget | null,
) {
  if (
    !(target instanceof HTMLElement)
  ) {
    return false;
  }

  return (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT" ||
    target.isContentEditable
  );
}

export function KeyboardFilmControls() {
  useEffect(() => {
    function seekSeconds(
      seconds: number,
    ) {
      const currentSeconds =
        masterTimeline.progress *
        MASTER_DURATION;

      const nextSeconds =
        Math.min(
          MASTER_DURATION,
          Math.max(
            0,
            currentSeconds +
              seconds,
          ),
        );

      const nextProgress =
        nextSeconds /
        MASTER_DURATION;

      masterSeek(
        nextProgress,
      );

      console.info(
        "[PELÍCULA · SEEK]",
        `${Math.round(
          nextSeconds,
        )}s`,
      );
    }

    function onKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.repeat ||
        isEditableTarget(
          event.target,
        )
      ) {
        return;
      }

      /*
       * ESPACIO
       * pausa / continuar
       */
      if (
        event.code === "Space"
      ) {
        event.preventDefault();
        event.stopPropagation();

        masterToggle();

        console.info(
          "[PELÍCULA]",
          masterTimeline.playing
            ? "PLAY"
            : "PAUSA",
        );

        return;
      }

      /*
       * FLECHA IZQUIERDA
       */
      if (
        event.key ===
        "ArrowLeft"
      ) {
        event.preventDefault();
        event.stopPropagation();

        seekSeconds(
          event.shiftKey
            ? -15
            : -5,
        );

        return;
      }

      /*
       * FLECHA DERECHA
       */
      if (
        event.key ===
        "ArrowRight"
      ) {
        event.preventDefault();
        event.stopPropagation();

        seekSeconds(
          event.shiftKey
            ? 15
            : 5,
        );
      }
    }

    window.addEventListener(
      "keydown",
      onKeyDown,
      true,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        onKeyDown,
        true,
      );
    };
  }, []);

  return null;
}
