import type { AvatarTimelineEvent } from "../types";

/** Times are audio seconds. Intentional holds do not advance this clock. */
export class AvatarTimeline {
  private cursor = 0;
  readonly events: AvatarTimelineEvent[];

  constructor(events: AvatarTimelineEvent[] = []) {
    const ids = new Set<string>();
    for (const event of events) {
      if (!event.id || ids.has(event.id) || !Number.isFinite(event.time) || event.time < 0) {
        throw new Error("La partitura contiene un evento inválido o repetido.");
      }
      if (event.duration !== undefined && (!Number.isFinite(event.duration) || event.duration < 0 || event.duration > 30)) {
        throw new Error("La duración de un gesto debe estar entre 0 y 30 segundos.");
      }
      ids.add(event.id);
    }
    this.events = [...events].sort((a, b) => a.time - b.time);
  }

  advance(time: number) {
    const due: AvatarTimelineEvent[] = [];
    while (this.cursor < this.events.length && this.events[this.cursor].time <= time) {
      due.push(this.events[this.cursor++]);
    }
    return due;
  }
}

/** Preserve whitespace and verse boundaries; split on word boundaries when possible. */
export function splitVoiceText(text: string, maximum = 1100): string[] {
  if (!Number.isInteger(maximum) || maximum < 1) throw new Error("Invalid text limit");
  const chunks: string[] = [];
  let remaining = text.trim();
  while (remaining.length > maximum) {
    const window = remaining.slice(0, maximum + 1);
    let cut = window.lastIndexOf("\n\n");
    if (cut < maximum / 3) cut = window.lastIndexOf("\n");
    if (cut < maximum / 3) cut = window.search(/\s+\S*$/);
    if (cut < 1) cut = maximum; // Only unbroken tokens need a hard boundary.
    chunks.push(remaining.slice(0, cut).trim());
    remaining = remaining.slice(cut).trim();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}
