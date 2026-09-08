"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  useEffect,
  useState,
} from "react";

import {
  playerStore,
  PLAYER_DURATION,
} from "./world/panda-poema/playerStore";

function Player() {
  const [playing, setPlaying] =
    useState(true);

  const [progress, setProgress] =
    useState(0);

  useEffect(() => {
    playerStore.progress = 0;
    playerStore.seekTo = 0;
    playerStore.playing = true;

    const sync = () => {
      setPlaying(
        playerStore.playing,
      );

      setProgress(
        playerStore.progress,
      );
    };

    sync();

    const timer =
      window.setInterval(
        sync,
        100,
      );

    return () => {
      window.clearInterval(
        timer,
      );
    };
  }, []);

  const elapsed =
    progress *
    PLAYER_DURATION;

  const minutes =
    Math.floor(
      elapsed / 60,
    );

  const seconds =
    Math.floor(
      elapsed % 60,
    )
      .toString()
      .padStart(2, "0");

  const toggle = () => {
    if (
      !playerStore.playing &&
      playerStore.progress >=
        0.999
    ) {
      playerStore.seekTo = 0;
    }

    playerStore.playing =
      !playerStore.playing;

    setPlaying(
      playerStore.playing,
    );
  };

  const restart = () => {
    playerStore.restart = true;

    setProgress(0);
    setPlaying(true);
  };

  const seek = (
    value: number,
  ) => {
    const next =
      Math.max(
        0,
        Math.min(1, value),
      );

    playerStore.seekTo = next;
    playerStore.progress = next;

    setProgress(next);
  };

  return (
    <div
      className="puPlayer"
      aria-label="Reproductor"
    >
      <button
        type="button"
        className="puPlay"
        onClick={toggle}
        aria-label={
          playing
            ? "Pausar"
            : "Reproducir"
        }
      >
        {playing ? "Ⅱ" : "▶"}
      </button>

      <button
        type="button"
        className="puRestart"
        onClick={restart}
        aria-label="Reiniciar"
      >
        ↺
      </button>

      <div className="puTrack">
        <input
          type="range"
          min="0"
          max="1000"
          value={Math.round(
            progress * 1000,
          )}
          onChange={(event) =>
            seek(
              Number(
                event.target.value,
              ) / 1000,
            )
          }
          aria-label="Progreso"
        />

        <div className="puTime">
          <span>
            {minutes}:{seconds}
          </span>

          <span>
            {Math.round(
              progress * 100,
            )}%
          </span>
        </div>
      </div>

      <style jsx>{`
        .puPlayer {
          position: fixed;
          left: 50%;
          bottom: 24px;
          z-index: 2147483000;

          transform:
            translateX(-50%);

          display: flex;
          align-items: center;
          gap: 10px;

          width: min(
            530px,
            calc(100vw - 40px)
          );

          box-sizing:
            border-box;

          padding: 10px 14px;

          border:
            1px solid
            rgba(
              226,
              190,
              117,
              .42
            );

          border-radius:
            999px;

          background:
            rgba(
              14,
              12,
              9,
              .88
            );

          box-shadow:
            0 14px 45px
            rgba(0,0,0,.34);

          backdrop-filter:
            blur(18px);

          color: #f2e4ca;
        }

        button {
          border: 0;
          color: #edddb9;
          cursor: pointer;
        }

        .puPlay {
          display: grid;
          place-items: center;

          width: 40px;
          height: 40px;

          flex: 0 0 auto;

          border-radius: 50%;

          background:
            rgba(
              208,
              164,
              88,
              .22
            );

          font-size: 15px;
        }

        .puRestart {
          width: 30px;
          height: 30px;

          flex: 0 0 auto;

          background:
            transparent;

          font-size: 18px;
        }

        .puTrack {
          flex: 1;
          min-width: 0;
        }

        input {
          display: block;
          width: 100%;
          margin: 0;

          cursor: pointer;

          accent-color:
            #d5a458;
        }

        .puTime {
          display: flex;
          justify-content:
            space-between;

          margin-top: 2px;

          font-family:
            Arial,
            sans-serif;

          font-size: 8px;
          letter-spacing:
            .12em;

          color:
            rgba(
              238,
              224,
              196,
              .5
            );
        }
      `}</style>
    </div>
  );
}

export default function PresentationVivaLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}

      <Link
        href="/poema-universal"
        className="puBackHome"
      >
        ← POEMA UNIVERSAL
      </Link>

      <Player />

      <style jsx global>{`
        .puBackHome {
          position: fixed;
          top: 20px;
          right: 22px;
          z-index: 2147483000;

          padding: 11px 16px;

          border:
            1px solid
            rgba(
              223,
              190,
              125,
              .34
            );

          border-radius:
            999px;

          background:
            rgba(
              15,
              13,
              10,
              .82
            );

          color: #ead8b6;
          text-decoration: none;

          font-family:
            Arial,
            sans-serif;

          font-size: 9px;
          letter-spacing:
            .16em;

          backdrop-filter:
            blur(14px);
        }
      `}</style>
    </>
  );
}
