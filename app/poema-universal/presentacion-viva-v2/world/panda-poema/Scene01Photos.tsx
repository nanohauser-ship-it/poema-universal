"use client";

import { PhotoCard } from "./PhotoCard";

const BASE =
  "/poema-universal/presentacion-viva/assets/scene-01-world-wounded/selected";

export function Scene01Photos() {
  return (
    <group>

      <PhotoCard
        src={`${BASE}/city.png`}
        position={[0.7, 2.0, -2.4]}
        rotation={[0, 0.05, -0.035]}
        width={3.25}
      />

      <PhotoCard
        src={`${BASE}/shelter.png`}
        position={[4.4, 2.25, -2.6]}
        rotation={[0, -0.04, 0.04]}
        width={3.15}
      />

      <PhotoCard
        src={`${BASE}/hope.png`}
        position={[8.0, 2.05, -2.35]}
        rotation={[0, 0.035, -0.025]}
        width={3.2}
      />

    </group>
  );
}
