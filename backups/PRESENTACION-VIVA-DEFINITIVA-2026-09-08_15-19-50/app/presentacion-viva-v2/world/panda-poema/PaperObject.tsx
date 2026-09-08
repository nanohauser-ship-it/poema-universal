"use client";

import * as THREE from "three";
import { useTexture } from "@react-three/drei";

type Props = {
  src: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  opacity?: number;
};

export function PaperObject({
  src,
  position,
  rotation = [0, 0, 0],
  width = 2,
  opacity = 1,
}: Props) {
  const texture = useTexture(src);

  texture.colorSpace = THREE.SRGBColorSpace;

  const image = texture.image as HTMLImageElement | undefined;

  const aspect =
    image?.width && image?.height
      ? image.width / image.height
      : 1;

  const height = width / aspect;

  return (
    <mesh
      position={position}
      rotation={rotation}
      castShadow
    >
      <planeGeometry args={[width, height]} />

      <meshBasicMaterial
        map={texture}
        transparent
        alphaTest={0.02}
        opacity={opacity}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
