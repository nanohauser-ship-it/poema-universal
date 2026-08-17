"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./PoemSoundtrack.module.css";

const AUDIO_SRC = "/audio/poema-universal/the-light-stays-on.mp3";
const AUDIO_EVENT = "poema-universal:bso-level";

type AudioGraph = {
  context: AudioContext;
  analyser: AnalyserNode;
  source: MediaElementAudioSourceNode;
  data: Uint8Array;
};

type BsoLevelDetail = {
  playing: boolean;
  ended: boolean;
  bass: number;
  mid: number;
  air: number;
  overall: number;
  progress: number;
  currentTime: number;
  duration: number;
};

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${rest}`;
}

function dispatchLevel(detail: BsoLevelDetail) {
  window.dispatchEvent(
    new CustomEvent<BsoLevelDetail>(AUDIO_EVENT, { detail })
  );
}

export default function PoemSoundtrack() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const graphRef = useRef<AudioGraph | null>(null);
  const frameRef = useRef<number | null>(null);
  const smoothRef = useRef({ bass: 0, mid: 0, air: 0, overall: 0 });

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const ensureGraph = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return null;
    if (graphRef.current) return graphRef.current;

    const AudioContextClass =
      window.AudioContext ??
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextClass) return null;

    const context = new AudioContextClass();
    const analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.78;

    const source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);

    const graph: AudioGraph = {
      context,
      analyser,
      source,
      data: new Uint8Array(analyser.frequencyBinCount),
    };

    graphRef.current = graph;
    return graph;
  }, []);

  const emitSilence = useCallback((ended = false) => {
    const audio = audioRef.current;
    const safeDuration = Number.isFinite(audio?.duration)
      ? audio?.duration ?? duration
      : duration;
    const safeTime = Number.isFinite(audio?.currentTime)
      ? audio?.currentTime ?? currentTime
      : currentTime;

    dispatchLevel({
      playing: false,
      ended,
      bass: 0,
      mid: 0,
      air: 0,
      overall: 0,
      progress: safeDuration > 0 ? clamp01(safeTime / safeDuration) : 0,
      currentTime: safeTime,
      duration: safeDuration || 0,
    });
  }, [currentTime, duration]);

  const stopAnalysis = useCallback((ended = false) => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    smoothRef.current = { bass: 0, mid: 0, air: 0, overall: 0 };
    emitSilence(ended);
  }, [emitSilence]);

  const startAnalysis = useCallback(() => {
    const audio = audioRef.current;
    const graph = ensureGraph();
    if (!audio || !graph) return;

    const { analyser, data, context } = graph;
    const nyquist = context.sampleRate / 2;

    const band = (fromHz: number, toHz: number) => {
      const from = Math.max(0, Math.floor((fromHz / nyquist) * data.length));
      const to = Math.min(
        data.length - 1,
        Math.ceil((toHz / nyquist) * data.length)
      );

      let sum = 0;
      let count = 0;
      for (let index = from; index <= to; index += 1) {
        sum += data[index] ?? 0;
        count += 1;
      }
      return count > 0 ? sum / count / 255 : 0;
    };

    const tick = () => {
      if (audio.paused || audio.ended) {
        stopAnalysis(audio.ended);
        return;
      }

      analyser.getByteFrequencyData(data);

      const rawBass = clamp01(band(32, 175) * 1.2);
      const rawMid = clamp01(band(175, 1900) * 1.07);
      const rawAir = clamp01(band(1900, 9200) * 1.18);
      const rawOverall = clamp01(
        rawBass * 0.48 + rawMid * 0.34 + rawAir * 0.18
      );

      const smooth = smoothRef.current;
      smooth.bass += (rawBass - smooth.bass) * 0.13;
      smooth.mid += (rawMid - smooth.mid) * 0.105;
      smooth.air += (rawAir - smooth.air) * 0.085;
      smooth.overall += (rawOverall - smooth.overall) * 0.09;

      const safeDuration = Number.isFinite(audio.duration) ? audio.duration : 0;
      dispatchLevel({
        playing: true,
        ended: false,
        bass: smooth.bass,
        mid: smooth.mid,
        air: smooth.air,
        overall: smooth.overall,
        progress: safeDuration > 0 ? clamp01(audio.currentTime / safeDuration) : 0,
        currentTime: audio.currentTime,
        duration: safeDuration,
      });

      frameRef.current = requestAnimationFrame(tick);
    };

    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(tick);
  }, [ensureGraph, stopAnalysis]);

  const togglePlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      return;
    }

    if (audio.ended || (audio.duration && audio.currentTime >= audio.duration - 0.05)) {
      audio.currentTime = 0;
      setCurrentTime(0);
    }

    const graph = ensureGraph();
    if (graph?.context.state === "suspended") {
      await graph.context.resume();
    }

    try {
      await audio.play();
    } catch {
      setPlaying(false);
    }
  }, [ensureGraph]);

  const seek = useCallback((value: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    audio.currentTime = value * audio.duration;
    setCurrentTime(audio.currentTime);
  }, []);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      const graph = graphRef.current;
      if (graph && graph.context.state !== "closed") {
        void graph.context.close();
      }
    };
  }, []);

  const progress = duration > 0 ? clamp01(currentTime / duration) : 0;

  return (
    <section className={styles.player} aria-label="Banda sonora del poema colectivo">
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        preload="metadata"
        onLoadedMetadata={(event) => {
          setDuration(event.currentTarget.duration || 0);
        }}
        onTimeUpdate={(event) => {
          setCurrentTime(event.currentTarget.currentTime || 0);
          if (Number.isFinite(event.currentTarget.duration)) {
            setDuration(event.currentTarget.duration || 0);
          }
        }}
        onPlay={() => {
          setPlaying(true);
          startAnalysis();
        }}
        onPause={() => {
          setPlaying(false);
          stopAnalysis(false);
        }}
        onEnded={() => {
          setPlaying(false);
          const audio = audioRef.current;
          if (audio && Number.isFinite(audio.duration)) {
            setCurrentTime(audio.duration);
          }
          stopAnalysis(true);
        }}
      />

      <button
        type="button"
        className={`${styles.playButton} ${playing ? styles.playing : ""}`}
        onClick={togglePlayback}
        aria-label={playing ? "Pausar The Light Stays On" : "Reproducir The Light Stays On"}
      >
        <span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span>
      </button>

      <div className={styles.meta}>
        <div className={styles.titleRow}>
          <strong>The Light Stays On</strong>
          <span className={styles.liveMark} aria-hidden="true" />
        </div>
        <span>BSO · Libro de las Sesenta Voces</span>
      </div>

      <label className={styles.timeline} aria-label="Posición de la canción">
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={progress}
          onChange={(event) => seek(Number(event.target.value))}
          style={{ "--progress": `${progress * 100}%` } as React.CSSProperties}
        />
        <span className={styles.time}>{formatTime(currentTime)}</span>
      </label>
    </section>
  );
}
