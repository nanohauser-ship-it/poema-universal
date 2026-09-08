"use client";

import type { MutableRefObject } from "react";
import { StoryMaster } from "./StoryMaster";

export function StoryWorld({
  progress,
}: {
  progress: MutableRefObject<number>;
}) {
  return (
    <StoryMaster progress={progress} />
  );
}
