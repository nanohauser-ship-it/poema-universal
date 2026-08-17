"use client";

import { useEffect, useRef } from "react";

type Props = {
  nucleus?: string;
  impulse?: string;
  pulse?: number;
  active?: boolean;
};

type Particle = {
  x: number;
  y: number;
  glyph: string;
  size: number;
  alpha: number;
  phase: number;
  drift: number;
  lit: boolean;
};

const GLYPHS =
  "abcdefghijklmnñopqrstuvwxyzáéíóúüABCDEFGHIJKLMNÑOPQRSTUVWXYZ·:;—()[]{}0123456789";

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function pseudo(seed: number): number {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function letters(value: string): string[] {
  return (
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .match(/[A-Za-zÑñ]/g) ?? []
  );
}

export default function AmnioticLetterField({
  nucleus = "",
  impulse = "",
  pulse = 0,
  active = false,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 1;
    let height = 1;
    let frame = 0;
    let animation = 0;
    let previousTime = 0;
    let particles: Particle[] = [];
    const signal = letters(`${nucleus}${impulse}`);
    const signalSeed = hash(`${nucleus}:${impulse}:${pulse}`);

    const rebuild = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = Math.min(1600, Math.max(620, Math.round((width * height) / 340)));
      particles = Array.from({ length: density }, (_, index) => {
        const lit = signal.length > 0 && (index + signalSeed) % 53 < Math.min(9, signal.length + 2);
        const randomGlyph = GLYPHS[Math.floor(pseudo(index * 7 + signalSeed) * GLYPHS.length)];
        return {
          x: pseudo(index * 5 + 1) * width,
          y: pseudo(index * 11 + 9) * height,
          glyph: lit ? signal[index % signal.length] : randomGlyph,
          size: 5 + pseudo(index * 17 + 4) * 8,
          alpha: 0.035 + pseudo(index * 23 + 8) * 0.13,
          phase: pseudo(index * 29 + 2) * Math.PI * 2,
          drift: 0.7 + pseudo(index * 31 + 6) * 2.2,
          lit,
        };
      });
    };

    const observer = new ResizeObserver(rebuild);
    observer.observe(canvas);
    rebuild();

    const draw = (time: number) => {
      animation = window.requestAnimationFrame(draw);
      if (time - previousTime < 34) return;
      previousTime = time;
      frame += 1;

      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "source-over";
      const seconds = time / 1000;
      const centerX = width * 0.5;
      const centerY = height * 0.48;
      const pulseAge = Math.min(1, Math.max(0, (frame % 110) / 110));

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        const y = (particle.y + seconds * particle.drift + Math.sin(seconds * 0.24 + particle.phase) * 2.4) % height;
        const x = particle.x + Math.cos(seconds * 0.18 + particle.phase) * 2.1;
        const distance = Math.hypot(x - centerX, y - centerY);
        const gravity = Math.max(0, 1 - distance / Math.max(width, height) * 1.85);
        const flicker = 0.72 + Math.sin(seconds * 0.9 + particle.phase) * 0.28;

        context.font = `${particle.size}px Georgia, serif`;
        context.textAlign = "center";
        context.textBaseline = "middle";

        if (particle.lit && active) {
          const litAlpha = 0.24 + gravity * 0.62 + Math.max(0, Math.sin(seconds * 1.7 + particle.phase)) * 0.2;
          context.shadowBlur = 7 + gravity * 15;
          context.shadowColor = index % 3 === 0 ? "#e2a44f" : "#d8f65b";
          context.fillStyle = index % 3 === 0
            ? `rgba(238, 177, 91, ${Math.min(0.95, litAlpha)})`
            : `rgba(216, 246, 91, ${Math.min(0.95, litAlpha)})`;
        } else {
          context.shadowBlur = 0;
          context.fillStyle = `rgba(218, 221, 190, ${particle.alpha * flicker})`;
        }

        context.fillText(particle.glyph, x, y);
      }

      if (active && signal.length > 0) {
        context.globalCompositeOperation = "lighter";
        const radius = 34 + pulseAge * Math.min(width, height) * 0.44;
        const gradient = context.createRadialGradient(
          centerX,
          centerY,
          Math.max(0, radius - 4),
          centerX,
          centerY,
          radius + 8,
        );
        gradient.addColorStop(0, "rgba(216,246,91,0)");
        gradient.addColorStop(0.52, `rgba(216,246,91,${0.08 * (1 - pulseAge)})`);
        gradient.addColorStop(1, "rgba(226,164,79,0)");
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(centerX, centerY, radius + 8, 0, Math.PI * 2);
        context.fill();
      }
    };

    animation = window.requestAnimationFrame(draw);
    return () => {
      window.cancelAnimationFrame(animation);
      observer.disconnect();
    };
  }, [nucleus, impulse, pulse, active]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}

