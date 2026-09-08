"use client";

import * as THREE from "three";
import { useTexture } from "@react-three/drei";

type Props = {
  src: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
};

export function PhotoCard({
  src,
  position,
  rotation = [0, 0, 0],
  width = 3.2,
}: Props) {
  const texture = useTexture(src);

  texture.colorSpace = THREE.SRGBColorSpace;

  const image = texture.image as HTMLImageElement | undefined;

  const aspect =
    image?.width && image?.height
      ? image.width / image.height
      : 1.4;

  const height = width / aspect;

  return (
    <group
      position={position}
      rotation={rotation}
    >
      <mesh
        position={[0.08, -0.08, -0.08]}
      >
        <planeGeometry
          args={[width + 0.24, height + 0.24]}
        />

        <meshBasicMaterial
          color="#665645"
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </mesh>

      <mesh
        position={[0, 0, -0.035]}
        castShadow
      >
        <planeGeometry
          args={[width + 0.22, height + 0.22]}
        />

        <meshStandardMaterial
          color="#e3d5bb"
          roughness={1}
        />
      </mesh>

      <mesh>
        <planeGeometry
          args={[width, height]}
        />

        <meshBasicMaterial
          map={texture}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
