import { GRAN_AVATAR_DIRECTION } from "../avatarConfig";
import type { AvatarEmotion, AvatarTimelineEvent, AvatarVoicePurpose } from "../types";
import { AvatarTimeline, splitVoiceText } from "./avatarTimeline";
import { attachAvatarVoice, silenceAvatarVoice } from "./avatarVoiceSignal";
import { avatarPerformanceSignal } from "./avatarPerformanceSignal";

const cache = new Map<string, Blob>();
let cacheBytes = 0;
function remember(key: string, blob: Blob) {
  if (blob.size > GRAN_AVATAR_DIRECTION.maxAudioCacheBytes) return;
  const previous = cache.get(key);
  if (previous) cacheBytes -= previous.size;
  cache.delete(key);
  cache.set(key, blob);
  cacheBytes += blob.size;
  while (cacheBytes > GRAN_AVATAR_DIRECTION.maxAudioCacheBytes || cache.size > 8) {
    const oldest = cache.keys().next().value as string;
    cacheBytes -= cache.get(oldest)!.size;
    cache.delete(oldest);
  }
}

export type AvatarPlayback = {
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setRate: (rate: number) => void;
  run: () => Promise<void>;
};

type PlaybackOptions = {
  text: string;
  purpose: AvatarVoicePurpose;
  rate: number;
  score?: AvatarTimelineEvent[];
  onProgress: (progress: number) => void;
  onReady: () => void;
  onEvent: (event: AvatarTimelineEvent) => void;
};

/** Owns all requests, object URLs and media for exactly one recitation. */
export function createAvatarPlayback(options: PlaybackOptions): AvatarPlayback {
  const controller = new AbortController();
  const { signal } = controller;
  let paused = false;
  let rate = options.rate;
  let current: HTMLAudioElement | null = null;
  let holding = false;
  let holdRemaining = 0;
  let stopped = false;
  let temporaryEmotion: { until: number; previous: AvatarEmotion } | null = null;
  let playbackError: unknown;
  const urls = new Set<string>();
  const media: HTMLAudioElement[] = [];
  const timeline = new AvatarTimeline(options.score);
  const abortError = () => new DOMException("Lectura cancelada", "AbortError");
  const check = () => { if (signal.aborted) throw abortError(); };
  const tryPlay = () => {
    if (current && !paused && !holding && !signal.aborted && !current.ended) {
      void current.play().catch((error: unknown) => { playbackError = error; });
    }
  };

  async function prepare(text: string) {
    check();
    const key = `${options.purpose}:${text}`;
    let blob = cache.get(key);
    if (!blob) {
      const requestController = new AbortController();
      const cancel = () => requestController.abort();
      signal.addEventListener("abort", cancel, { once: true });
      const timeout = window.setTimeout(cancel, 45_000);
      try {
        const response = await fetch("/api/poema-universal/gran-avatar/voice", {
          method: "POST", signal: requestController.signal,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, purpose: options.purpose }),
        });
        check();
        if (!response.ok) {
          const payload = await response.json().catch(() => null) as { error?: string } | null;
          throw new Error(payload?.error ?? "No se pudo preparar la voz. Inténtalo de nuevo.");
        }
        blob = await response.blob();
        check();
        if (!blob.size) throw new Error("La voz llegó vacía.");
        remember(key, blob);
      } catch (error) {
        if (requestController.signal.aborted && !signal.aborted) {
          throw new Error("La preparación de la voz tardó demasiado. Inténtalo de nuevo.");
        }
        throw error;
      } finally {
        window.clearTimeout(timeout);
        signal.removeEventListener("abort", cancel);
      }
    }
    check();
    const url = URL.createObjectURL(blob);
    urls.add(url);
    const audio = new Audio();
    media.push(audio);
    audio.preload = "auto";
    audio.src = url;
    await new Promise<void>((resolve, reject) => {
      const finish = (error?: Error) => {
        window.clearTimeout(timeout);
        audio.removeEventListener("loadedmetadata", ready);
        audio.removeEventListener("error", failed);
        signal.removeEventListener("abort", aborted);
        if (error) reject(error); else resolve();
      };
      const ready = () => Number.isFinite(audio.duration) && audio.duration > 0
        ? finish() : finish(new Error("No se pudo medir la duración de la voz."));
      const failed = () => finish(new Error("El navegador no pudo abrir el audio."));
      const aborted = () => finish(abortError());
      const timeout = window.setTimeout(failed, 12_000);
      audio.addEventListener("loadedmetadata", ready, { once: true });
      audio.addEventListener("error", failed, { once: true });
      signal.addEventListener("abort", aborted, { once: true });
      audio.load();
    });
    check();
    return audio;
  }

  function processEvents(time: number) {
    if (temporaryEmotion && time >= temporaryEmotion.until) {
      avatarPerformanceSignal.emotion = temporaryEmotion.previous;
      temporaryEmotion = null;
    }
    for (const event of timeline.advance(time + 0.0001)) {
      if (event.action === "silence") {
        holdRemaining += event.duration;
        holding = holdRemaining > 0;
        if (holding) {
          current?.pause();
          avatarPerformanceSignal.silent = true;
        }
      }
      if (event.action === "emotion") {
        temporaryEmotion = event.duration && event.duration > 0
          ? { until: event.time + event.duration, previous: temporaryEmotion?.previous ?? avatarPerformanceSignal.emotion }
          : null;
        avatarPerformanceSignal.emotion = event.emotion;
      }
      options.onEvent(event);
    }
  }

  async function perform(audio: HTMLAudioElement, offset: number, total: number) {
    check();
    current = audio;
    audio.playbackRate = rate;
    const detach = await attachAvatarVoice(audio);
    try {
      check();
      await new Promise<void>((resolve, reject) => {
        let frame = 0;
        let previous = performance.now();
        let settled = false;
        const finish = (error?: unknown) => {
          if (settled) return;
          settled = true;
          window.cancelAnimationFrame(frame);
          signal.removeEventListener("abort", aborted);
          audio.removeEventListener("error", failed);
          if (error) reject(error); else resolve();
        };
        const aborted = () => finish(abortError());
        const failed = () => finish(new Error("La voz no pudo reproducirse."));
        signal.addEventListener("abort", aborted, { once: true });
        audio.addEventListener("error", failed, { once: true });
        const tick = () => {
          if (signal.aborted) { aborted(); return; }
          if (playbackError) { finish(playbackError); return; }
          const now = performance.now();
          // A background tab must not consume the entire intentional hold at once.
          const delta = Math.min((now - previous) / 1000, 0.1);
          previous = now;
          if (!paused) {
            processEvents(offset + audio.currentTime);
            if (holding) {
              holdRemaining = Math.max(0, holdRemaining - delta);
              if (holdRemaining === 0) {
                holding = false;
                avatarPerformanceSignal.silent = false;
                tryPlay();
              }
            }
          }
          options.onProgress(Math.min(1, (offset + audio.currentTime) / total));
          if (audio.ended && !holding && !paused) { finish(); return; }
          frame = window.requestAnimationFrame(tick);
        };
        processEvents(offset);
        tryPlay();
        frame = window.requestAnimationFrame(tick);
      });
    } finally {
      audio.pause();
      detach();
    }
  }

  const stop = () => {
    stopped = true;
    controller.abort();
    for (const audio of media) audio.pause();
    silenceAvatarVoice();
  };

  return {
    stop,
    pause: () => { paused = true; current?.pause(); avatarPerformanceSignal.paused = true; },
    resume: () => { paused = false; avatarPerformanceSignal.paused = false; tryPlay(); },
    setRate: (nextRate) => {
      rate = Math.min(1.2, Math.max(0.8, nextRate));
      if (current) current.playbackRate = rate;
    },
    run: async () => {
      const chunks = splitVoiceText(options.text);
      const prepared: HTMLAudioElement[] = new Array(chunks.length);
      let nextIndex = 0;
      try {
        const workers = Array.from({ length: Math.min(2, chunks.length) }, async () => {
          while (nextIndex < chunks.length) {
            const index = nextIndex++;
            prepared[index] = await prepare(chunks[index]);
          }
        });
        // Wait for aborted sibling preparation before releasing its URLs.
        try { await Promise.all(workers); }
        catch (error) { controller.abort(); await Promise.allSettled(workers); throw error; }
        check();
        const total = prepared.reduce((sum, audio) => sum + audio.duration, 0);
        if (timeline.events.some((event) => event.time > total)) {
          throw new Error("La partitura contiene eventos posteriores al final de esta voz.");
        }
        if (options.purpose === "reading" && !timeline.events.some((event) => event.action === "silence" && event.time === total)) {
          timeline.events.push({ id: "__closing-hold", time: total, action: "silence", duration: GRAN_AVATAR_DIRECTION.closingSilence });
        }
        options.onReady();
        let offset = 0;
        for (const audio of prepared) {
          await perform(audio, offset, total);
          offset += audio.duration;
        }
      } finally {
        controller.abort();
        for (const audio of media) {
          audio.pause();
          audio.removeAttribute("src");
          audio.load();
        }
        for (const url of urls) URL.revokeObjectURL(url);
        // An old cancelled session must not reset its replacement's signals.
        if (!stopped) {
          silenceAvatarVoice();
          avatarPerformanceSignal.silent = false;
          avatarPerformanceSignal.paused = false;
          if (temporaryEmotion) avatarPerformanceSignal.emotion = temporaryEmotion.previous;
        }
      }
    },
  };
}
