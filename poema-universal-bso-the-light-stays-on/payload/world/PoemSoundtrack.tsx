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
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.72;

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

  const stopAnalysis = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    smoothRef.current = { bass: 0, mid: 0, air: 0, overall: 0 };

    const audio = audioRef.current;
    const safeDuration = audio?.duration || duration || 0;
    const safeTime = audio?.currentTime || currentTime || 0;

    dispatchLevel({
      playing: false,
      bass: 0,
      mid: 0,
      air: 0,
      overall: 0,
      progress: safeDuration > 0 ? safeTime / safeDuration : 0,
      currentTime: safeTime,
      duration: safeDuration,
    });
  }, [currentTime, duration]);

  const startAnalysis = useCallback(() => {
    const audio = audioRef.current;
    const graph = ensureGraph();
    if (!audio || !graph) return;

    const { analyser, data, context } = graph;
    const nyquist = context.sampleRate / 2;

    const band = (fromHz: number, toHz: number) => {
      const from = Math.max(
        0,
        Math.floor((fromHz / nyquist) * data.length)
      );
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
        stopAnalysis();
        return;
      }

      analyser.getByteFrequencyData(data);

      const rawBass = clamp01(band(34, 180) * 1.18);
      const rawMid = clamp01(band(180, 1800) * 1.08);
      const rawAir = clamp01(band(1800, 9000) * 1.2);
      const rawOverall = clamp01(rawBass * 0.48 + rawMid * 0.34 + rawAir * 0.18);

      const smooth = smoothRef.current;
      smooth.bass += (rawBass - smooth.bass) * 0.15;
      smooth.mid += (rawMid - smooth.mid) * 0.12;
      smooth.air += (rawAir - smooth.air) * 0.1;
      smooth.overall += (rawOverall - smooth.overall) * 0.1;

      const safeDuration = Number.isFinite(audio.duration) ? audio.duration : 0;
      dispatchLevel({
        playing: true,
        bass: smooth.bass,
        mid: smooth.mid,
        air: smooth.air,
        overall: smooth.overall,
        progress: safeDuration > 0 ? audio.currentTime / safeDuration : 0,
        currentTime: audio.currentTime,
        duration: safeDuration,
      });

      frameRef.current = requestAnimationFrame(tick);
    };

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }
    frameRef.current = requestAnimationFrame(tick);
  }, [ensureGraph, stopAnalysis]);

  const togglePlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      return;
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
          stopAnalysis();
        }}
        onEnded={() => {
          setPlaying(false);
          setCurrentTime(0);
          stopAnalysis();
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
        <span>BSO · Poema Universal</span>
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
