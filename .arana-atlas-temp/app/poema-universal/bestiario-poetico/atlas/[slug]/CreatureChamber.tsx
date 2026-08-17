"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CanonicalCreature } from "@/lib/bestiario-poetico/canonicalCreatures";
import styles from "./creature.module.css";

const SpiderPresence = dynamic(
  () => import("./SpiderPresence").then((module) => module.SpiderPresence),
  { ssr: false, loading: () => <div className={styles.loading}>La presencia está descendiendo…</div> }
);

export function CreatureChamber({ creature }: { creature: CanonicalCreature }) {
  const [mode, setMode] = useState<"presence" | "image">("presence");
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.pause();
      if (audio.src.startsWith("blob:")) URL.revokeObjectURL(audio.src);
      audioRef.current = null;
    };
  }, []);

  async function toggleVoice() {
    setVoiceError("");
    const current = audioRef.current;

    if (current) {
      if (!current.paused) {
        current.pause();
        setVoicePlaying(false);
        return;
      }
      current.currentTime = 0;
      await current.play();
      setVoicePlaying(true);
      return;
    }

    setVoiceLoading(true);
    try {
      const response = await fetch("/api/bestiario-poetico/voz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phrase: creature.voice.phrase,
          tone: creature.voice.tone,
          creatureName: creature.name
        })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || "No se pudo despertar la voz.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      audio.addEventListener("ended", () => setVoicePlaying(false));
      audio.addEventListener("pause", () => setVoicePlaying(false));

      audioRef.current = audio;
      await audio.play();
      setVoicePlaying(true);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setVoiceError(error instanceof Error ? error.message : "La criatura no ha podido hablar.");
    } finally {
      setVoiceLoading(false);
    }
  }

  return (
    <section className={styles.chamber}>
      <div className={styles.topbar}>
        <p>Bestiario Poético · Cámara VI</p>
        <div>
          <button data-active={mode === "presence"} onClick={() => setMode("presence")} type="button">
            Presencia 3D
          </button>
          <button data-active={mode === "image"} onClick={() => setMode("image")} type="button">
            Lámina
          </button>
        </div>
      </div>

      <div className={styles.viewport}>
        {mode === "presence" ? (
          <SpiderPresence />
        ) : (
          <Image src={creature.image} alt={creature.name} fill priority sizes="100vw" className={styles.plateImage} />
        )}

        <div className={styles.title}>
          <span>VI</span>
          <h2>{creature.name}</h2>
        </div>
      </div>

      <div className={styles.voice}>
        <div>
          <p>Lo que la criatura te diría</p>
          <blockquote>“{creature.voice.phrase}”</blockquote>
          <span>{creature.voice.tone}</span>
        </div>
        <button type="button" onClick={toggleVoice} disabled={voiceLoading}>
          {voiceLoading ? "La voz está despertando…" : voicePlaying ? "Pausar su voz" : "Escuchar su voz"}
        </button>
      </div>

      {voiceError && <p className={styles.voiceError}>{voiceError}</p>}
    </section>
  );
}
