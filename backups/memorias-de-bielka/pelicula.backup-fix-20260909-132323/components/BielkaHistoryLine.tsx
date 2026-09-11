\
"use client";

import type { BielkaFrame } from "../data/bielkaStoryboard";

type Props = {
  frames: BielkaFrame[];
  activeIndex: number;
  progress: number;
  onJump: (index: number) => void;
};

export function BielkaHistoryLine({
  frames,
  activeIndex,
  progress,
  onJump,
}: Props) {
  return (
    <nav className="bhLine" aria-label="Línea de memoria de Memorias de Bielka">
      <div className="bhLineTrack" aria-hidden="true">
        <div
          className="bhLineFill"
          style={{ transform: `scaleX(${Math.max(0, Math.min(1, progress))})` }}
        />
      </div>

      <div className="bhNodes">
        {frames.map((frame, index) => {
          const active = index === activeIndex;
          return (
            <button
              key={frame.id}
              type="button"
              className={[
                "bhNode",
                active ? "isActive" : "",
                frame.chapterStart ? "isChapter" : "",
                frame.movementStart ? "isMovement" : "",
                frame.iconic ? "isIconic" : "",
              ].join(" ")}
              aria-label={`${frame.code} · ${frame.chapter} · ${frame.chapterTitle}`}
              aria-current={active ? "step" : undefined}
              onClick={() => onJump(index)}
              title={`${frame.code} · ${frame.chapterTitle}`}
            >
              <span />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
