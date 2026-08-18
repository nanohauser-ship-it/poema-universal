import type {
  ArchitectureArchetype,
  ArchitectureBlueprint,
  ArchitectureModuleBlueprint,
  ArchitecturalMaterialId,
  CameraAnchorBlueprint,
  LightBlueprint,
  ProjectionSurfaceBlueprint,
  ScenographyBrief,
} from "../schema";

export interface ArchetypeRandom {
  next: () => number;
  range: (minimum: number, maximum: number) => number;
  integer: (minimum: number, maximum: number) => number;
  pick: <T>(values: readonly T[]) => T;
}

export interface ArchetypeContext {
  brief: ScenographyBrief;
  random: ArchetypeRandom;
}

export type ArchetypeBuilder = (
  context: ArchetypeContext
) => ArchitectureBlueprint;

export interface BaseBlueprintOptions {
  archetype: ArchitectureArchetype;
  room: {
    width: number;
    depth: number;
    height: number;
    material: ArchitecturalMaterialId;
  };
  modules: ArchitectureModuleBlueprint[];
  surfaces?: ProjectionSurfaceBlueprint[];
  lights?: LightBlueprint[];
  stageZ?: number;
  transitionOffset?: readonly [number, number, number];
}

export function moduleBlueprint(
  id: string,
  type: ArchitectureModuleBlueprint["type"],
  material: ArchitecturalMaterialId,
  position: readonly [number, number, number],
  dimensions: readonly [number, number, number],
  rotation: readonly [number, number, number] = [0, 0, 0],
  extras: Partial<
    Pick<
      ArchitectureModuleBlueprint,
      "radius" | "arc" | "thickness" | "opacity"
    >
  > = {}
): ArchitectureModuleBlueprint {
  return {
    id,
    type,
    material,
    position,
    rotation,
    dimensions,
    ...extras,
  };
}

export function standardSurfaces(
  roomWidth: number,
  roomDepth: number,
  roomHeight: number,
  slotIds: readonly string[]
): ProjectionSurfaceBlueprint[] {
  if (slotIds.length === 0) {
    return [];
  }

  const backSlot = slotIds[0];
  const leftSlot = slotIds[1] ?? backSlot;
  const rightSlot = slotIds[2] ?? backSlot;

  return [
    {
      id: "SURFACE_BACK",
      slotId: backSlot,
      position: [0, roomHeight * 0.52, -roomDepth * 0.48],
      rotation: [0, 0, 0],
      size: [roomWidth * 0.5, roomHeight * 0.62],
      opacity: 0.96,
    },
    {
      id: "SURFACE_LEFT",
      slotId: leftSlot,
      position: [-roomWidth * 0.46, roomHeight * 0.51, -roomDepth * 0.16],
      rotation: [0, Math.PI / 2, 0],
      size: [roomDepth * 0.54, roomHeight * 0.58],
      opacity: 0.82,
    },
    {
      id: "SURFACE_RIGHT",
      slotId: rightSlot,
      position: [roomWidth * 0.46, roomHeight * 0.51, -roomDepth * 0.16],
      rotation: [0, -Math.PI / 2, 0],
      size: [roomDepth * 0.54, roomHeight * 0.58],
      opacity: 0.82,
    },
  ];
}

function createCameraAnchors(
  roomWidth: number,
  roomDepth: number,
  roomHeight: number,
  stageZ: number
): CameraAnchorBlueprint[] {
  const eye = Math.min(3, roomHeight * 0.34);
  const lookAt: readonly [number, number, number] = [0, 2.05, stageZ];
  const distance = Math.min(14.5, roomDepth * 0.47);

  return [
    {
      id: "MASTER",
      position: [0, eye, distance],
      lookAt,
      fov: 48,
      response: 2.4,
      outputOverrides: {
        "9:16": { position: [0, eye + 0.3, distance - 1.7], fov: 43 },
        "4:5": { position: [0, eye + 0.15, distance - 0.9], fov: 45 },
        "1:1": { position: [0, eye + 0.1, distance - 0.6], fov: 46 },
        ULTRAWIDE: { position: [0, eye, distance + 1.4], fov: 53 },
      },
    },
    {
      id: "FRONT",
      position: [0, 2.35, Math.max(5.8, distance * 0.7)],
      lookAt,
      fov: 39,
      response: 2.8,
      outputOverrides: {},
    },
    {
      id: "THREE_QUARTER_LEFT",
      position: [-roomWidth * 0.3, 2.65, distance * 0.63],
      lookAt,
      fov: 43,
      response: 2.5,
      outputOverrides: {},
    },
    {
      id: "THREE_QUARTER_RIGHT",
      position: [roomWidth * 0.3, 2.65, distance * 0.63],
      lookAt,
      fov: 43,
      response: 2.5,
      outputOverrides: {},
    },
    {
      id: "PROFILE",
      position: [roomWidth * 0.42, 2.3, stageZ + 0.2],
      lookAt,
      fov: 46,
      response: 2.2,
      outputOverrides: {},
    },
    {
      id: "LOW_ANGLE",
      position: [-roomWidth * 0.13, 0.72, distance * 0.48],
      lookAt: [0, 2.7, stageZ],
      fov: 47,
      response: 2.1,
      outputOverrides: {},
    },
    {
      id: "HIGH_ANGLE",
      position: [roomWidth * 0.14, Math.min(roomHeight - 0.7, 6.2), distance * 0.45],
      lookAt: [0, 1.35, stageZ],
      fov: 50,
      response: 2,
      outputOverrides: {},
    },
    {
      id: "DETAIL",
      position: [1.7, 2.18, stageZ + 4.1],
      lookAt: [0, 2.08, stageZ],
      fov: 32,
      response: 3.1,
      outputOverrides: {},
    },
    {
      id: "PORTAL",
      position: [0, 2.42, Math.min(distance * 0.52, 6.8)],
      lookAt: [0, 2.4, -roomDepth * 0.46],
      fov: 52,
      response: 2.15,
      outputOverrides: {},
    },
    {
      id: "ORBIT",
      position: [-roomWidth * 0.34, 3.1, stageZ + roomDepth * 0.28],
      lookAt,
      fov: 49,
      response: 1.8,
      outputOverrides: {},
    },
  ];
}

export function createBaseBlueprint(
  context: ArchetypeContext,
  options: BaseBlueprintOptions
): ArchitectureBlueprint {
  const { brief, random } = context;
  const { room } = options;
  const stageZ = options.stageZ ?? 0.6;
  const stagePosition: readonly [number, number, number] = [0, 0.16, stageZ];
  const slotIds = brief.mediaSlots.map((slot) => slot.id);
  const keyLightId = "LIGHT_PERFORMER_KEY";
  const blueprintId = `ARCH_${brief.seed}`
    .replace(/[^A-Za-z0-9_-]/g, "_")
    .slice(0, 64);
  const lights: LightBlueprint[] = options.lights ?? [
    {
      id: keyLightId,
      type: "SPOT",
      color: 0xf0dfc1,
      intensity: random.range(3.6, 5.6),
      distance: 18,
      position: [-2.2, Math.min(room.height - 0.5, 7.4), 4.8],
      target: [0, 1.65, stageZ],
      angle: 0.48,
    },
    {
      id: "LIGHT_RIM",
      type: "POINT",
      color: 0xd4ad6d,
      intensity: random.range(0.7, 1.25),
      distance: 12,
      position: [2.7, 3.4, stageZ - 3.8],
    },
    {
      id: "LIGHT_ARCHITECTURE",
      type: "AREA_GLOW",
      color: 0x748184,
      intensity: random.range(0.32, 0.7),
      distance: 20,
      position: [0, room.height * 0.74, -room.depth * 0.34],
    },
  ];

  if (!lights.some((light) => light.id === keyLightId)) {
    lights.unshift({
      id: keyLightId,
      type: "SPOT",
      color: 0xf0dfc1,
      intensity: 4.4,
      distance: 18,
      position: [-2.2, Math.min(room.height - 0.5, 7.4), 4.8],
      target: [0, 1.65, stageZ],
      angle: 0.48,
    });
  }

  const shell = moduleBlueprint(
    "ROOM_SHELL",
    "ROOM_SHELL",
    room.material,
    [0, room.height / 2, -room.depth * 0.12],
    [room.width, room.height, room.depth],
    [0, 0, 0],
    { thickness: random.range(0.18, 0.42) }
  );
  const stage = moduleBlueprint(
    "PERFORMER_STAGE",
    "CENTRAL_STAGE",
    options.archetype === "WHITE_CUBE" ? "PALE_STONE" : "REFLECTIVE_BLACK",
    stagePosition,
    [random.range(3.1, 4.2), 0.22, random.range(2.7, 3.7)],
    [0, 0, 0],
    { radius: random.range(1.55, 2.05) }
  );

  return {
    id: blueprintId,
    seed: brief.seed,
    archetype: options.archetype,
    room: {
      width: room.width,
      depth: room.depth,
      height: room.height,
      wallThickness: random.range(0.18, 0.42),
      material: room.material,
      openFront: true,
    },
    modules: [shell, stage, ...options.modules],
    surfaces:
      options.surfaces ??
      standardSurfaces(room.width, room.depth, room.height, slotIds),
    lights,
    performerStage: {
      position: stagePosition,
      size: [3.4, 0.24, 3.1],
      safeRadius: 2.35,
      backgroundSeparation: Math.max(3.2, room.depth * 0.28),
      keyLightId,
    },
    cameraAnchors: createCameraAnchors(
      room.width,
      room.depth,
      room.height,
      stageZ
    ),
    transition: {
      duration: random.range(2.2, 3.8),
      stagger: random.range(0.06, 0.18),
      entryOffset: options.transitionOffset ?? [0, -0.7, -1.4],
      easing: "CINEMATIC",
      performerOpacity: brief.performerRequired ? 1 : 0,
    },
  };
}
