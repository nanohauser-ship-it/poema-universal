export const MASTER_DURATION = 105;

export const masterTimeline = {
  playing: true,
  progress: 0,
  elapsed: 0,
  speed: 1,
  seekRequested: null as number | null,
  restartRequested: false,
};

export function masterPlay() {
  if (masterTimeline.progress >= 0.999999) {
    masterTimeline.progress = 0;
    masterTimeline.elapsed = 0;
    masterTimeline.seekRequested = 0;
  }

  masterTimeline.playing = true;
}

export function masterPause() {
  masterTimeline.playing = false;
}

export function masterToggle() {
  if (masterTimeline.playing) {
    masterPause();
  } else {
    masterPlay();
  }
}

export function masterRestart() {
  masterTimeline.restartRequested = true;
  masterTimeline.playing = true;
}

export function masterSeek(progress: number) {
  const value = Math.max(
    0,
    Math.min(1, progress),
  );

  masterTimeline.progress = value;
  masterTimeline.elapsed =
    value * MASTER_DURATION;

  masterTimeline.seekRequested = value;
}
