"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { PhotoCard } from "./PhotoCard";
import { PaperObject } from "./PaperObject";

const BASE =
  "/poema-universal/presentacion-viva/assets/story-selected";

export function Scene02KitchenPhotos() {
  const steam = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!steam.current) return;

    steam.current.position.y =
      1.95 + Math.sin(clock.elapsedTime * 1.4) * 0.08;

    steam.current.rotation.z =
      Math.sin(clock.elapsedTime * 0.8) * 0.08;
  });

  return (
    <group>
      <PhotoCard
        src={`${BASE}/02-bg.png`}
        position={[18.3, 2.35, -1.35]}
        rotation={[0, 0.01, 0]}
        width={10.2}
      />

      <PaperObject
        src={`${BASE}/02-pot.png`}
        position={[14.6, 0.9, 0.25]}
        rotation={[0, 0.04, -0.03]}
        width={2.3}
      />

      <PaperObject
        src={`${BASE}/02-cup.png`}
        position={[17.4, 1.05, 0.45]}
        rotation={[0, -0.03, 0.02]}
        width={1.65}
      />

      <group ref={steam} position={[17.4, 1.95, 0.3]}>
        <mesh>
          <planeGeometry args={[0.12, 0.85]} />
          <meshBasicMaterial
            color="#f3eadb"
            transparent
            opacity={0.24}
            depthWrite={false}
          />
        </mesh>

        <mesh position={[0.18, 0.15, 0]}>
          <planeGeometry args={[0.08, 0.65]} />
          <meshBasicMaterial
            color="#f3eadb"
            transparent
            opacity={0.16}
            depthWrite={false}
          />
        </mesh>
      </group>

      <PaperObject
        src={`${BASE}/02-board.png`}
        position={[20.2, 0.82, 0.35]}
        rotation={[0, 0.04, -0.02]}
        width={2.6}
      />

      <PaperObject
        src={`${BASE}/02-rack.png`}
        position={[23.0, 1.55, 0.15]}
        rotation={[0, -0.03, 0]}
        width={2.5}
      />

      <PaperObject
        src={`${BASE}/02-jacket-object.png`}
        position={[24.5, 1.7, 0.45]}
        rotation={[0, 0.02, 0.04]}
        width={1.8}
      />
    </group>
  );
}
