import { GRAN_AVATAR_DIRECTION } from "../avatarConfig";

type WebkitWindow = Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext };
export const avatarVoiceSignal = {
  active: false,
  playing: false,
  audible: false,
  analysed: false,
  level: 0,
};
let audioContext: AudioContext | null = null;
let activeCleanup: (() => void) | null = null;
let generation = 0;

export function silenceAvatarVoice() {
  generation += 1;
  activeCleanup?.();
  activeCleanup = null;
  Object.assign(avatarVoiceSignal, { active: false, playing: false, audible: false, analysed: false, level: 0 });
}

/** Call from the user gesture, before awaiting TTS, to unlock Web Audio. */
export function primeAvatarVoice() {
  const Constructor = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
  if (!Constructor) return;
  try {
    audioContext ??= new Constructor();
    if (audioContext.state === "suspended") void audioContext.resume().catch(() => undefined);
  } catch { /* Native audio playback remains available without analysis. */ }
}

export async function attachAvatarVoice(audio: HTMLAudioElement) {
  silenceAvatarVoice();
  const owner = generation;
  let source: MediaElementAudioSourceNode | null = null;
  let analyser: AnalyserNode | null = null;
  const Constructor = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
  try {
    if (Constructor) {
      audioContext ??= new Constructor();
      if (audioContext.state === "suspended") {
        // Do not let a browser autoplay restriction stall the recitation.
        void audioContext.resume().catch(() => undefined);
      }
      if (audioContext.state === "running") {
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.72;
        source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
      }
    }
  } catch {
    // Restore audible output if attaching the optional analyser failed mid-way.
    if (source && audioContext) { source.disconnect(); source.connect(audioContext.destination); }
    analyser = null;
  }
  let frame = 0;
  let closed = false;
  let lastAudible = -Infinity;
  const samples = new Uint8Array(256);
  const cleanup = () => {
    if (closed) return;
    closed = true;
    window.cancelAnimationFrame(frame);
    source?.disconnect();
    analyser?.disconnect();
    if (owner === generation) {
      Object.assign(avatarVoiceSignal, { active: false, playing: false, audible: false, analysed: false, level: 0 });
    }
    if (activeCleanup === cleanup) activeCleanup = null;
  };
  const measure = () => {
    if (closed || owner !== generation) return;
    const playing = !audio.paused && !audio.ended;
    let rms = 0;
    if (analyser && playing) {
      analyser.getByteTimeDomainData(samples);
      rms = Math.sqrt(samples.reduce((sum, value) => sum + ((value - 128) / 128) ** 2, 0) / samples.length);
    }
    const now = performance.now();
    if (playing && rms > GRAN_AVATAR_DIRECTION.voiceThreshold) lastAudible = now;
    avatarVoiceSignal.playing = playing;
    avatarVoiceSignal.active = playing;
    avatarVoiceSignal.analysed = analyser !== null;
    avatarVoiceSignal.level = playing ? Math.min(1, rms * 4.2) : 0;
    avatarVoiceSignal.audible = playing && (analyser === null || now - lastAudible < GRAN_AVATAR_DIRECTION.quietHoldMs);
    frame = window.requestAnimationFrame(measure);
  };
  activeCleanup = cleanup;
  measure();
  return cleanup;
}
