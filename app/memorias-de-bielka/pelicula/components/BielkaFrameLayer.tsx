"use client";

import { useEffect, useState } from "react";
import type { BielkaFrame } from "../data/bielkaStoryboard";

type Props = {
  frame: BielkaFrame;
  opacity: number;
  depth: number;
  priority?: boolean;
};

export function BielkaFrameLayer({ frame, opacity, depth, priority }: Props) {
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    setMissing(false);
  }, [frame.image]);

  return (
    <div
      className={[
        "bfLayer",
        frame.certainty === "ambiguo" ? "isAmbiguous" : "",
      ].join(" ")}
      style={{
        opacity,
        transform: `translate3d(0, ${depth * -0.8}vh, 0) scale(${1.025 + depth * 0.018})`,
      }}
      aria-hidden={opacity < 0.05}
    >
      {!missing ? (
        <img
          src={frame.image}
          alt={frame.alt}
          fetchPriority={priority ? "high" : "auto"}
          onError={() => setMissing(true)}
          draggable={false}
        />
      ) : (
        <div className="bfMissing">
          <span className="bfMissingCode">{frame.code}</span>
          <p>{frame.chapter}</p>
          <h2>{frame.title}</h2>
          <small>
            Imagen pendiente · coloca {frame.code}.webp en
            <br />
            public/memorias-de-bielka/frames/
          </small>
        </div>
      )}
    </div>
  );
}
