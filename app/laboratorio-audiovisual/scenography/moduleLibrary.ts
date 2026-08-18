import * as THREE from "three";

import type { ArchitectureModuleBlueprint } from "./schema";

function dimensionKey(values: readonly number[]): string {
  return values.map((value) => value.toFixed(3)).join(":");
}

export class SafeGeometryLibrary {
  private readonly geometries = new Map<string, THREE.BufferGeometry>();

  box(width: number, height: number, depth: number): THREE.BoxGeometry {
    const key = `BOX:${dimensionKey([width, height, depth])}`;
    let geometry = this.geometries.get(key) as THREE.BoxGeometry | undefined;

    if (!geometry) {
      geometry = new THREE.BoxGeometry(width, height, depth);
      this.geometries.set(key, geometry);
    }

    return geometry;
  }

  plane(width: number, height: number): THREE.PlaneGeometry {
    const key = `PLANE:${dimensionKey([width, height])}`;
    let geometry = this.geometries.get(key) as THREE.PlaneGeometry | undefined;

    if (!geometry) {
      geometry = new THREE.PlaneGeometry(width, height);
      this.geometries.set(key, geometry);
    }

    return geometry;
  }

  cylinder(radius: number, height: number): THREE.CylinderGeometry {
    const key = `CYLINDER:${dimensionKey([radius, height])}`;
    let geometry = this.geometries.get(key) as
      | THREE.CylinderGeometry
      | undefined;

    if (!geometry) {
      geometry = new THREE.CylinderGeometry(radius, radius, height, 48);
      this.geometries.set(key, geometry);
    }

    return geometry;
  }

  curvedWall(
    radius: number,
    height: number,
    arc: number
  ): THREE.CylinderGeometry {
    const key = `CURVE:${dimensionKey([radius, height, arc])}`;
    let geometry = this.geometries.get(key) as
      | THREE.CylinderGeometry
      | undefined;

    if (!geometry) {
      geometry = new THREE.CylinderGeometry(
        radius,
        radius,
        height,
        64,
        1,
        true,
        Math.PI * 0.5 - arc * 0.5,
        arc
      );
      this.geometries.set(key, geometry);
    }

    return geometry;
  }

  torus(radius: number, thickness: number): THREE.TorusGeometry {
    const key = `TORUS:${dimensionKey([radius, thickness])}`;
    let geometry = this.geometries.get(key) as THREE.TorusGeometry | undefined;

    if (!geometry) {
      geometry = new THREE.TorusGeometry(radius, thickness, 20, 72);
      this.geometries.set(key, geometry);
    }

    return geometry;
  }

  dispose(): void {
    for (const geometry of this.geometries.values()) {
      geometry.dispose();
    }

    this.geometries.clear();
  }
}

function mesh(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  position: readonly [number, number, number] = [0, 0, 0]
): THREE.Mesh {
  const result = new THREE.Mesh(geometry, material);
  result.position.set(position[0], position[1], position[2]);
  return result;
}

function createRoomShell(
  blueprint: ArchitectureModuleBlueprint,
  material: THREE.Material,
  geometries: SafeGeometryLibrary
): THREE.Group {
  const group = new THREE.Group();
  const [width, height, depth] = blueprint.dimensions;
  const thickness = blueprint.thickness ?? 0.24;
  const side = geometries.box(thickness, height, depth);
  const horizontal = geometries.box(width, thickness, depth);
  const back = geometries.box(width, height, thickness);

  group.add(
    mesh(side, material, [-width / 2, 0, 0]),
    mesh(side, material, [width / 2, 0, 0]),
    mesh(horizontal, material, [0, -height / 2, 0]),
    mesh(horizontal, material, [0, height / 2, 0]),
    mesh(back, material, [0, 0, -depth / 2])
  );
  return group;
}

function createFrame(
  blueprint: ArchitectureModuleBlueprint,
  material: THREE.Material,
  geometries: SafeGeometryLibrary,
  depthMultiplier: number
): THREE.Group {
  const group = new THREE.Group();
  const [width, height, depth] = blueprint.dimensions;
  const border = Math.max(0.14, Math.min(width, height) * 0.075);
  const frameDepth = Math.max(0.12, depth * depthMultiplier);
  const vertical = geometries.box(border, height, frameDepth);
  const horizontal = geometries.box(width, border, frameDepth);

  group.add(
    mesh(vertical, material, [-width / 2 + border / 2, 0, 0]),
    mesh(vertical, material, [width / 2 - border / 2, 0, 0]),
    mesh(horizontal, material, [0, height / 2 - border / 2, 0]),
    mesh(horizontal, material, [0, -height / 2 + border / 2, 0])
  );
  return group;
}

function createLongCorridor(
  blueprint: ArchitectureModuleBlueprint,
  material: THREE.Material,
  geometries: SafeGeometryLibrary
): THREE.Group {
  const group = new THREE.Group();
  const [width, height, depth] = blueprint.dimensions;
  const thickness = blueprint.thickness ?? 0.18;
  const side = geometries.box(thickness, height, depth);
  const ceiling = geometries.box(width, thickness, depth);
  group.add(
    mesh(side, material, [-width / 2, 0, 0]),
    mesh(side, material, [width / 2, 0, 0]),
    mesh(ceiling, material, [0, height / 2, 0])
  );
  return group;
}

export function createArchitectureModule(
  blueprint: ArchitectureModuleBlueprint,
  material: THREE.Material,
  geometries: SafeGeometryLibrary
): THREE.Group {
  const group = new THREE.Group();
  const [width, height, depth] = blueprint.dimensions;
  let object: THREE.Object3D;

  switch (blueprint.type) {
    case "ROOM_SHELL":
      object = createRoomShell(blueprint, material, geometries);
      break;
    case "DEEP_PROJECTION_NICHE":
      object = createFrame(blueprint, material, geometries, 1);
      break;
    case "ARCHITECTURAL_PORTAL":
      object = createFrame(blueprint, material, geometries, 0.7);
      break;
    case "CURVED_VIDEO_WALL":
      object = mesh(
        geometries.curvedWall(
          blueprint.radius ?? Math.max(1, width * 0.5),
          height,
          blueprint.arc ?? Math.PI
        ),
        material
      );
      break;
    case "SUSPENDED_SCRIM":
      object = mesh(geometries.plane(width, height), material);
      break;
    case "CENTRAL_STAGE":
      object = mesh(
        geometries.cylinder(blueprint.radius ?? width * 0.5, height),
        material
      );
      break;
    case "COLUMN":
      object = mesh(
        geometries.cylinder(blueprint.radius ?? width * 0.5, height),
        material
      );
      break;
    case "CEILING_OCULUS":
      object = mesh(
        geometries.torus(
          blueprint.radius ?? width * 0.42,
          blueprint.thickness ?? Math.max(0.08, height * 0.3)
        ),
        material
      );
      break;
    case "LONG_CORRIDOR":
      object = createLongCorridor(blueprint, material, geometries);
      break;
    case "MONUMENTAL_WALL":
    case "PANORAMIC_WALL":
    case "REFLECTIVE_POOL":
    case "FLOOR_PROJECTION_ZONE":
    case "CEILING_PROJECTION_ZONE":
      object = mesh(geometries.box(width, height, depth), material);
      break;
  }

  group.name = blueprint.id;
  group.position.set(...blueprint.position);
  group.rotation.set(...blueprint.rotation);
  group.userData.opacityFactor = blueprint.opacity ?? 1;
  group.add(object);
  return group;
}
