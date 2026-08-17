type WebkitWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

type VoiceSignal = {
  active: boolean;
  level: number;
};

export const avatarVoiceSignal: VoiceSignal = {
  active: false,
  level: 0,
};

let audioContext: AudioContext | null = null;
let activeCleanup: (() => void) | null = null;

export function silenceAvatarVoice() {
  activeCleanup?.();
  activeCleanup = null;
  avatarVoiceSignal.active = false;
  avatarVoiceSignal.level = 0;
}

export async function attachAvatarVoice(audio: HTMLAudioElement) {
  silenceAvatarVoice();

  const AudioContextConstructor =
    window.AudioContext ??
    (window as WebkitWindow).webkitAudioContext;

  if (!AudioContextConstructor) return () => undefined;

  try {
    audioContext ??= new AudioContextConstructor();

    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    if (audioContext.state !== "running") {
      return () => undefined;
    }

    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audio);
    let animationFrame = 0;
    let closed = false;

    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.72;
    const samples = new Uint8Array(analyser.fftSize);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    avatarVoiceSignal.active = true;

    const measure = () => {
      if (closed) return;

      analyser.getByteTimeDomainData(samples);
      let energy = 0;

      for (const sample of samples) {
        const normalized = (sample - 128) / 128;
        energy += normalized * normalized;
      }

      const rms = Math.sqrt(energy / samples.length);
      avatarVoiceSignal.level = Math.min(1, rms * 4.2);
      animationFrame = window.requestAnimationFrame(measure);
    };

    measure();

    const cleanup = () => {
      if (closed) return;
      closed = true;
      window.cancelAnimationFrame(animationFrame);
      source.disconnect();
      analyser.disconnect();
      avatarVoiceSignal.active = false;
      avatarVoiceSignal.level = 0;
      if (activeCleanup === cleanup) activeCleanup = null;
    };

    activeCleanup = cleanup;
    return cleanup;
  } catch (error) {
    console.warn("La voz continúa sin análisis gestual.", error);
    avatarVoiceSignal.active = false;
    avatarVoiceSignal.level = 0;
    return () => undefined;
  }
}
