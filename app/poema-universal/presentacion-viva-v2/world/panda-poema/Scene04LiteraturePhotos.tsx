"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { PhotoCard } from "./PhotoCard";
import { PaperObject } from "./PaperObject";

const BASE =
  "/poema-universal/presentacion-viva/assets/story-selected";

export function Scene04LiteraturePhotos() {
  const moth = useRef<Group>(null);
  const pages = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (moth.current) {
      moth.current.position.y =
        2.25 + Math.sin(clock.elapsedTime * 1.2) * 0.18;

      moth.current.rotation.z =
        Math.sin(clock.elapsedTime * 1.7) * 0.14;
    }

    if (pages.current) {
      pages.current.rotation.z =
        Math.sin(clock.elapsedTime * 0.55) * 0.07;

      pages.current.position.y =
        Math.sin(clock.elapsedTime * 0.8) * 0.1;
    }
  });

  return (
    <group>
      <PhotoCard
        src={`${BASE}/04-bg.png`}
        position={[47.2, 2.35, -1.35]}
        rotation={[0, -0.008, 0]}
        width={10.4}
      />

      <PaperObject
        src={`${BASE}/04-books-object.png`}
        position={[42.8, 0.95, 0.4]}
        rotation={[0, 0.04, -0.025]}
        width={2.25}
      />

      <PaperObject
        src={`${BASE}/04-typewriter-object.png`}
        position={[46.5, 0.9, 0.55]}
        rotation={[0, -0.03, 0]}
        width={2.1}
      />

      <PaperObject
        src={`${BASE}/04-notebook-object.png`}
        position={[49.4, 1.0, 0.48]}
        rotation={[0, 0.03, 0.03]}
        width={1.75}
      />

      <group ref={moth} position={[51.5, 2.25, 0.65]}>
        <PaperObject
          src={`${BASE}/04-moth-object.png`}
          position={[0, 0, 0]}
          width={1.1}
        />
      </group>

      <group ref={pages} position={[0, 0, 0]}>
        <PaperObject
          src={`${BASE}/04-pages-object.png`}
          position={[53.0, 2.15, 0.2]}
          rotation={[0, 0.02, 0.04]}
          width={2.6}
        />
      </group>
    </group>
  );
}
