"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import styles from
  "./presentacion-viva.module.css";

import {
  PoemaUniversalFilm,
} from "./film/PoemaUniversalFilm";

export function PresentacionViva() {
  const mountRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const [
    recordMode,
    setRecordMode,
  ] = useState(false);

  useEffect(() => {
    if (!mountRef.current) {
      return;
    }

    const params =
      new URLSearchParams(
        window.location.search
      );

    const record =
      params.get("record") === "1";

    const autoplay =
      record ||
      params.get("autoplay") ===
        "1";

    const durationValue =
      Number(
        params.get("duration") ??
          92
      );

    const duration =
      Number.isFinite(
        durationValue
      )
        ? Math.max(
            20,
            durationValue
          )
        : 92;

    setRecordMode(
      record
    );

    const film =
      new PoemaUniversalFilm(
        mountRef.current,
        {
          autoplay,
          recordMode:
            record,
          duration,
        }
      );

    return () => {
      film.dispose();
    };
  }, []);

  return (
    <main
      className={[
        styles.page,
        recordMode
          ? styles.record
          : "",
      ].join(" ")}
    >
      <div
        ref={mountRef}
        className={
          styles.canvasMount
        }
      />

      <div
        data-film-hud
        className={
          styles.hud
        }
      >
        <div
          className={
            styles.brand
          }
        >
          POEMA UNIVERSAL
        </div>

        <div
          className={
            styles.subtitle
          }
        >
          PRESENTACIÓN VIVA
        </div>

        <div
          className={
            styles.instructions
          }
        >
          DESPLÁZATE ·
          ESPACIO REPRODUCE ·
          R REINICIA
        </div>
      </div>

      <div
        className={
          styles.chapter
        }
      >
        UNA OBRA COMÚN
      </div>

      <div
        className={
          styles.scrollSpace
        }
      />
    </main>
  );
}
