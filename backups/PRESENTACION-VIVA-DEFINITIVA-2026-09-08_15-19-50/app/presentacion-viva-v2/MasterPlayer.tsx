"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  MASTER_DURATION,
  masterPause,
  masterPlay,
  masterRestart,
  masterSeek,
  masterTimeline,
} from "./world/panda-poema/MasterTimeline";

export function MasterPlayer() {
  const [playing, setPlaying] =
    useState(true);

  const [progress, setProgress] =
    useState(0);

  const [hidden, setHidden] =
    useState(false);

  useEffect(() => {
    masterTimeline.progress = 0;
    masterTimeline.elapsed = 0;
    masterTimeline.seekRequested = 0;
    masterTimeline.playing = true;

    const sync = () => {
      setPlaying(
        masterTimeline.playing,
      );

      setProgress(
        masterTimeline.progress,
      );
    };

    sync();

    const timer =
      window.setInterval(
        sync,
        100,
      );

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const toggle = () => {
    if (masterTimeline.playing) {
      masterPause();
    } else {
      masterPlay();
    }

    setPlaying(
      masterTimeline.playing,
    );
  };

  const restart = () => {
    masterRestart();

    setPlaying(true);
    setProgress(0);
  };

  const seek = (
    next: number,
  ) => {
    masterSeek(next);
    setProgress(next);
  };

  const elapsed =
    progress *
    MASTER_DURATION;

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

  if (hidden) {
    return (
      <button
        type="button"
        onClick={() => setHidden(false)}
        aria-label="Mostrar reproductor"
        title="Mostrar reproductor"
        style={{
          position: "fixed",
          left: "50%",
          bottom: "18px",
          zIndex: 2147483000,
          transform: "translateX(-50%)",
          width: "38px",
          height: "24px",
          border:
            "1px solid rgba(226, 190, 117, .30)",
          borderRadius: "999px",
          background:
            "rgba(14, 12, 9, .68)",
          color: "#e6d2aa",
          fontSize: "13px",
          lineHeight: 1,
          cursor: "pointer",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          opacity: .72,
        }}
      >
        ⌃
      </button>
    );
  }

  return (
    <div className="masterPlayer">
      <button
        type="button"
        className="masterPlay"
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
        className="masterRestart"
        onClick={restart}
        aria-label="Reiniciar"
      >
        ↺
      </button>

      <button
        type="button"
        className="masterRestart"
        onClick={() => setHidden(true)}
        aria-label="Ocultar reproductor"
        title="Ocultar reproductor"
      >
        —
      </button>

      <div className="masterTrack">
        <input
          type="range"
          min="0"
          max="1000"
          value={Math.round(
            progress * 1000,
          )}
          onChange={(event) => {
            seek(
              Number(
                event.target.value,
              ) / 1000,
            );
          }}
          aria-label="Progreso"
        />

        <div className="masterTime">
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
        .masterPlayer {
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

          box-sizing: border-box;

          padding: 10px 14px;

          border:
            1px solid
            rgba(
              226,
              190,
              117,
              .38
            );

          border-radius: 999px;

          background:
            rgba(
              14,
              12,
              9,
              .86
            );

          box-shadow:
            0 14px 45px
            rgba(
              0,
              0,
              0,
              .32
            );

          backdrop-filter:
            blur(18px);

          -webkit-backdrop-filter:
            blur(18px);

          color: #f2e4ca;
        }

        button {
          border: 0;
          color: #edddb9;
          cursor: pointer;
        }

        .masterPlay {
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

        .masterRestart {
          width: 30px;
          height: 30px;

          flex: 0 0 auto;

          background: transparent;

          font-size: 18px;
        }

        .masterTrack {
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

        .masterTime {
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
              .50
            );
        }

        @media (
          max-width: 650px
        ) {
          .masterPlayer {
            bottom: 14px;

            width:
              calc(
                100vw - 24px
              );
          }
        }
      `}</style>
    </div>
  );
}
