import * as THREE from "three";

import {
  createMaterialLibrary,
  type ArchitecturalMaterial,
} from "../scenography/materialLibrary";
import {
  createArchitectureModule,
  SafeGeometryLibrary,
} from "../scenography/moduleLibrary";
import type { ArchitectureBlueprint } from "../scenography/schema";

export interface CompiledArchitecture {
  blueprint: ArchitectureBlueprint;
  group: THREE.Group;
  materials: ReadonlySet<THREE.Material>;
  lights: readonly THREE.Light[];
  dispose: () => void;
}

export class ArchitectureCompiler {
  private readonly geometries = new SafeGeometryLibrary();
  private disposed = false;

  compile(blueprint: ArchitectureBlueprint): CompiledArchitecture {
    if (this.disposed) {
      throw new Error("ArchitectureCompiler ya está cerrado");
    }

    const materialLibrary = createMaterialLibrary();
    const sharedMaterials = new Set<THREE.Material>(
      materialLibrary.materials.values()
    );
    const materials = new Set<THREE.Material>(materialLibrary.materials.values());
    const group = new THREE.Group();
    const lights: THREE.Light[] = [];

    group.name = `GENERATED_${blueprint.archetype}`;
    group.userData.blueprintId = blueprint.id;
    group.userData.seed = blueprint.seed;
    group.visible = false;

    for (const moduleBlueprint of blueprint.modules) {
      const shared = materialLibrary.materials.get(moduleBlueprint.material);

      if (!shared) {
        continue;
      }

      let material: ArchitecturalMaterial = shared;

      if (
        moduleBlueprint.opacity !== undefined &&
        moduleBlueprint.opacity < 0.999
      ) {
        material = shared.clone();
        material.userData.baseOpacity =
          (Number(shared.userData.baseOpacity) || 1) * moduleBlueprint.opacity;
        material.opacity = 0;
        materials.add(material);
      }

      group.add(
        createArchitectureModule(moduleBlueprint, material, this.geometries)
      );
    }

    const projectionMaterial = materialLibrary.materials.get("PROJECTION_BLACK");

    if (projectionMaterial) {
      for (const surface of blueprint.surfaces) {
        const material = projectionMaterial.clone();
        material.userData.baseOpacity =
          (Number(projectionMaterial.userData.baseOpacity) || 1) *
          surface.opacity;
        material.opacity = 0;
        materials.add(material);

        const surfaceGroup = new THREE.Group();
        const plane = new THREE.Mesh(
          this.geometries.plane(surface.size[0], surface.size[1]),
          material
        );
        surfaceGroup.name = surface.id;
        surfaceGroup.position.set(...surface.position);
        surfaceGroup.rotation.set(...surface.rotation);
        surfaceGroup.userData.slotId = surface.slotId;
        surfaceGroup.add(plane);
        group.add(surfaceGroup);
      }
    }

    for (const blueprintLight of blueprint.lights) {
      let light: THREE.Light;

      if (blueprintLight.type === "SPOT") {
        const spot = new THREE.SpotLight(
          blueprintLight.color,
          0,
          blueprintLight.distance,
          blueprintLight.angle ?? Math.PI / 5,
          0.56,
          1.7
        );
        spot.position.set(...blueprintLight.position);
        spot.target.position.set(...(blueprintLight.target ?? [0, 1.8, 0]));
        group.add(spot.target);
        light = spot;
      } else {
        const point = new THREE.PointLight(
          blueprintLight.color,
          0,
          blueprintLight.distance,
          blueprintLight.type === "AREA_GLOW" ? 1.4 : 2
        );
        point.position.set(...blueprintLight.position);
        light = point;
      }

      light.name = blueprintLight.id;
      light.userData.baseIntensity = blueprintLight.intensity;
      lights.push(light);
      group.add(light);
    }

    let released = false;

    return {
      blueprint,
      group,
      materials,
      lights,
      dispose: () => {
        if (released) {
          return;
        }

        released = true;
        group.removeFromParent();
        group.clear();

        for (const material of materials) {
          if (!sharedMaterials.has(material)) {
            material.dispose();
          }
        }

        materialLibrary.dispose();
        materials.clear();
      },
    };
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }

    this.disposed = true;
    this.geometries.dispose();
  }
}
