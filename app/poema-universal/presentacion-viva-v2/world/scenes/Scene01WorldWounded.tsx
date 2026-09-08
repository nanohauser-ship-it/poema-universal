"use client";

import * as THREE from "three";
import { Float, useTexture } from "@react-three/drei";

const BASE =
  "/poema-universal/presentacion-viva/assets/scene-01-world-wounded/selected";

function MainWorld() {
  const texture = useTexture(`${BASE}/storm-cutout.png`);

  texture.colorSpace = THREE.SRGBColorSpace;

  const image = texture.image as HTMLImageElement | undefined;

  const aspect =
    image?.width && image?.height
      ? image.width / image.height
      : 16 / 9;

  const width = 7.7;
  const height = width / aspect;

  return (
    <group>
      <mesh position={[0.12, -0.12, -0.08]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          color="#332820"
          transparent
          opacity={0.22}
          depthWrite={false}
        />
      </mesh>

      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          map={texture}
          transparent
          alphaTest={0.02}
          depthWrite={true}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function FloatingPaper({
  position,
  scale,
  rotation,
}: {
  position: [number, number, number];
  scale: number;
  rotation: number;
}) {
  return (
    <Float
      speed={0.45}
      rotationIntensity={0.18}
      floatIntensity={0.12}
    >
      <mesh
        position={position}
        rotation={[0.08, 0.04, rotation]}
      >
        <planeGeometry args={[0.5 * scale, 0.34 * scale]} />
        <meshStandardMaterial
          color="#e8ddc8"
          roughness={0.95}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Float>
  );
}

export function Scene01WorldWounded() {
  return (
    <group position={[0, 0.25, 8]}>
      <mesh position={[0, 0, -0.22]}>
        <planeGeometry args={[11.8, 7.4]} />
        <meshStandardMaterial
          color="#cdbb9f"
          roughness={1}
          metalness={0}
        />
      </mesh>

      <MainWorld />
    </group>
  );
}
