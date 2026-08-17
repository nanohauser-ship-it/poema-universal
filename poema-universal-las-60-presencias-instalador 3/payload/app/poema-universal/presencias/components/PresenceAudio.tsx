"use client";

import { useRef, useState } from "react";

import styles from "../presence.module.css";

type PresenceAudioProps = {
  name: string;
  audioUrl: string;
};

function formatTime(value: number) {
  if (!Number.isFinite(value)) {
    return "00:00";
  }

  return `${String(Math.floor(value / 60)).padStart(
    2,
    "0",
  )}:${String(Math.floor(value % 60)).padStart(2, "0")}`;
}

export default function PresenceAudio({
  name,
  audioUrl,
}: PresenceAudioProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  async function togglePlayback() {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setPlaying(false);
      }
    } else {
      audio.pause();
    }
  }

  function seek(value: number) {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.currentTime = value;
    setCurrentTime(value);
  }

  return (
    <section
      className={styles.audioSection}
      aria-labelledby="voice-title"
    >
      <div>
        <p className={styles.sectionIndex}>Voz</p>
        <h2 id="voice-title">Escuchar el poema</h2>
      </div>

      <div className={styles.audioPlayer}>
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(event) =>
            setCurrentTime(event.currentTarget.currentTime)
          }
          onLoadedMetadata={(event) => {
            const nextDuration = event.currentTarget.duration;
            setDuration(
              Number.isFinite(nextDuration)
                ? nextDuration
                : 0,
            );
          }}
        />

        <button
          type="button"
          onClick={() => void togglePlayback()}
          aria-label={`${playing ? "Pausar" : "Reproducir"} la voz de ${name}`}
        >
          <span aria-hidden="true">
            {playing ? "Ⅱ" : "▶"}
          </span>
        </button>

        <label>
          <span className={styles.srOnly}>
            Progreso del audio
          </span>
          <input
            type="range"
            min={0}
            max={Math.max(duration, 0.01)}
            step={0.01}
            value={Math.min(currentTime, duration || 0)}
            onChange={(event) =>
              seek(Number(event.target.value))
            }
          />
        </label>

        <time>
          {formatTime(currentTime)} / {formatTime(duration)}
        </time>
      </div>
    </section>
  );
}
