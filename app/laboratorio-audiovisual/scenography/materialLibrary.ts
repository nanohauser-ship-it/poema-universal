import * as THREE from "three";

import {
  ARCHITECTURAL_MATERIALS,
  type ArchitecturalMaterialId,
} from "./schema";

export type ArchitecturalMaterial =
  | THREE.MeshStandardMaterial
  | THREE.MeshPhysicalMaterial
  | THREE.MeshBasicMaterial;

export interface MaterialLibraryInstance {
  materials: ReadonlyMap<ArchitecturalMaterialId, ArchitecturalMaterial>;
  dispose: () => void;
}

function prepare<T extends ArchitecturalMaterial>(
  material: T,
  baseOpacity = 1
): T {
  material.transparent = true;
  material.opacity = 0;
  material.userData.baseOpacity = baseOpacity;
  return material;
}

export function createMaterialLibrary(): MaterialLibraryInstance {
  const materials = new Map<ArchitecturalMaterialId, ArchitecturalMaterial>([
    [
      "DARK_CONCRETE",
      prepare(
        new THREE.MeshStandardMaterial({
          color: 0x171a1c,
          roughness: 0.86,
          metalness: 0.04,
          side: THREE.DoubleSide,
        })
      ),
    ],
    [
      "PALE_STONE",
      prepare(
        new THREE.MeshStandardMaterial({
          color: 0xb8b2a6,
          roughness: 0.86,
          metalness: 0.01,
          side: THREE.DoubleSide,
        })
      ),
    ],
    [
      "BLACKENED_STEEL",
      prepare(
        new THREE.MeshStandardMaterial({
          color: 0x0b0d0f,
          roughness: 0.38,
          metalness: 0.76,
          side: THREE.DoubleSide,
        })
      ),
    ],
    [
      "WHITE_PLASTER",
      prepare(
        new THREE.MeshStandardMaterial({
          color: 0xd8d5cd,
          roughness: 0.96,
          metalness: 0,
          side: THREE.DoubleSide,
        })
      ),
    ],
    [
      "SMOKED_GLASS",
      prepare(
        new THREE.MeshPhysicalMaterial({
          color: 0x263136,
          roughness: 0.12,
          metalness: 0.08,
          transmission: 0.28,
          thickness: 0.18,
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
        }),
        0.42
      ),
    ],
    [
      "TRANSLUCENT_TEXTILE",
      prepare(
        new THREE.MeshStandardMaterial({
          color: 0xb8b1a3,
          roughness: 0.92,
          metalness: 0,
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
        }),
        0.28
      ),
    ],
    [
      "REFLECTIVE_BLACK",
      prepare(
        new THREE.MeshPhysicalMaterial({
          color: 0x030405,
          roughness: 0.1,
          metalness: 0.52,
          clearcoat: 1,
          clearcoatRoughness: 0.06,
          side: THREE.DoubleSide,
        }),
        0.9
      ),
    ],
    [
      "PROJECTION_BLACK",
      prepare(
        new THREE.MeshBasicMaterial({
          color: 0x050607,
          toneMapped: false,
          depthWrite: false,
          side: THREE.DoubleSide,
        }),
        0.86
      ),
    ],
  ]);

  for (const id of ARCHITECTURAL_MATERIALS) {
    if (!materials.has(id)) {
      throw new Error(`Material arquitectónico no registrado: ${id}`);
    }
  }

  return {
    materials,
    dispose: () => {
      for (const material of materials.values()) {
        material.dispose();
      }
      materials.clear();
    },
  };
}
