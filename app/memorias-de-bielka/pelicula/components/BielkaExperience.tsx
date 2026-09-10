"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BIELKA_FRAMES } from "../data/bielkaStoryboard";
import { BielkaHistoryLine } from "./BielkaHistoryLine";
import { BielkaFrameLayer } from "./BielkaFrameLayer";
import { BielkaAtmosphere } from "./BielkaAtmosphere";

const PIXELS_PER_FRAME = 190;
const AUTO_PIXELS_PER_SECOND = 74;

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function BielkaExperience() {
  const frames = BIELKA_FRAMES;
  const spacerHeight = useMemo(
    () => Math.max(2200, (frames.length - 1) * PIXELS_PER_FRAME + windowSafeHeight()),
    [frames.length]
  );

  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const measure = useCallback(() => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    setProgress(clamp01(window.scrollY / max));
  }, []);

  useEffect(() => {
    measure();
    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        measure();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [measure]);

  const frameFloat = progress * (frames.length - 1);
  const activeIndex = Math.min(frames.length - 1, Math.floor(frameFloat + 0.00001));
  const nextIndex = Math.min(frames.length - 1, activeIndex + 1);
  const mix = frameFloat - activeIndex;

  const current = frames[activeIndex];
  const next = frames[nextIndex];

  const movementSpan = frames.filter((f) => f.movement === current.movement);
  const movementFirst = movementSpan[0]?.id ?? current.id;
  const movementLast = movementSpan.at(-1)?.id ?? current.id;
  const localProgress =
    movementLast === movementFirst
      ? 0
      : (current.id - movementFirst + mix) / (movementLast - movementFirst);

  const jumpTo = useCallback(
    (index: number) => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = index / (frames.length - 1);
      window.scrollTo({ top: p * max, behavior: "smooth" });
    },
    [frames.length]
  );

  const jumpBy = useCallback(
    (delta: number) => {
      setPlaying(false);
      jumpTo(Math.max(0, Math.min(frames.length - 1, activeIndex + delta)));
    },
    [activeIndex, frames.length, jumpTo]
  );

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        jumpBy(1);
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        jumpBy(-1);
      } else if (event.code === "Space") {
        const target = event.target as HTMLElement | null;
        if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;
        event.preventDefault();
        setPlaying((v) => !v);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [jumpBy]);

  useEffect(() => {
    if (!playing) {
      lastTimeRef.current = null;
      return;
    }

    let frame = 0;
    const tick = (now: number) => {
      const previous = lastTimeRef.current ?? now;
      const dt = Math.min(50, now - previous);
      lastTimeRef.current = now;

      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const nextScroll = Math.min(max, window.scrollY + (AUTO_PIXELS_PER_SECOND * dt) / 1000);
      window.scrollTo({ top: nextScroll, behavior: "auto" });

      if (nextScroll >= max - 1) {
        setPlaying(false);
        lastTimeRef.current = null;
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  return (
    <main className={`bielkaFilm movement-${current.movementKey}`}>
      <div className="bielkaStage" role="region" aria-label="Memorias de Bielka · película visual">
        <BielkaAtmosphere
          movementKey={current.movementKey}
          localProgress={localProgress}
          certainty={current.certainty}
        />

        <div className="bfStack">
          <BielkaFrameLayer
            frame={current}
            opacity={1 - smoothMix(mix)}
            depth={mix}
            priority
          />
          {nextIndex !== activeIndex && (
            <BielkaFrameLayer
              frame={next}
              opacity={smoothMix(mix)}
              depth={mix - 1}
            />
          )}
        </div>

        <header className="bfHudTop">
          <div>
            <p className="bfEyebrow">MEMORIAS DE BIELKA · HISTORIETA CINEMATOGRÁFICA</p>
            <h1>{current.movementTitle}</h1>
          </div>
          <div className="bfCounter">
            <span>{current.code}</span>
            <small>/ 173</small>
          </div>
        </header>

        <section className="bfCaption" aria-live="polite">
          <p>{current.chapter}</p>
          <h2>{current.title}</h2>
          <div className="bfMeta">
            <span>{current.certainty === "ambiguo" ? "imagen no certificada" : "presente verificable"}</span>
            {current.iconic && <span>plano maestro</span>}
          </div>
        </section>

        <button
          className="bfPlay"
          type="button"
          aria-pressed={playing}
          onClick={() => setPlaying((v) => !v)}
        >
          {playing ? "Pausa" : "Reproducir"}
        </button>

        <BielkaHistoryLine
          frames={frames}
          activeIndex={activeIndex}
          progress={progress}
          onJump={jumpTo}
        />

        <div className="bfScrollHint" aria-hidden="true">
          <span />
          <em>desplaza para recordar</em>
        </div>
      </div>

      <div className="bielkaScrollSpace" style={{ height: spacerHeight }} aria-hidden="true" />
    </main>
  );
}

function smoothMix(t: number) {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

function windowSafeHeight() {
  if (typeof window === "undefined") return 900;
  return window.innerHeight;
}
