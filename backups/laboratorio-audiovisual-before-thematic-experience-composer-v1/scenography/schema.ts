export const ARCHITECTURE_ARCHETYPES = [
  "DARK_GALLERY",
  "WHITE_CUBE",
  "LONG_ARCHIVE",
  "MEDIA_LABYRINTH",
  "PANORAMIC_HALL",
  "CIRCULAR_OCULUS",
] as const;

export type ArchitectureArchetype = (typeof ARCHITECTURE_ARCHETYPES)[number];

export const ARCHITECTURE_MODULE_TYPES = [
  "ROOM_SHELL",
  "MONUMENTAL_WALL",
  "DEEP_PROJECTION_NICHE",
  "CURVED_VIDEO_WALL",
  "PANORAMIC_WALL",
  "SUSPENDED_SCRIM",
  "CENTRAL_STAGE",
  "COLUMN",
  "ARCHITECTURAL_PORTAL",
  "CEILING_OCULUS",
  "REFLECTIVE_POOL",
  "LONG_CORRIDOR",
  "FLOOR_PROJECTION_ZONE",
  "CEILING_PROJECTION_ZONE",
] as const;

export type ArchitectureModuleType =
  (typeof ARCHITECTURE_MODULE_TYPES)[number];

export const ARCHITECTURAL_MATERIALS = [
  "DARK_CONCRETE",
  "PALE_STONE",
  "BLACKENED_STEEL",
  "WHITE_PLASTER",
  "SMOKED_GLASS",
  "TRANSLUCENT_TEXTILE",
  "REFLECTIVE_BLACK",
  "PROJECTION_BLACK",
] as const;

export type ArchitecturalMaterialId =
  (typeof ARCHITECTURAL_MATERIALS)[number];

export const OUTPUT_PROFILE_IDS = [
  "16:9",
  "9:16",
  "4:5",
  "1:1",
  "ULTRAWIDE",
] as const;

export type OutputProfileId = (typeof OUTPUT_PROFILE_IDS)[number];

export type ScenographyTakeMode = "LIVE" | "CURATED";
export type ScenographyGenerationSource = "ai" | "fallback" | "local";
export type ScenographyStatus = "idle" | "generating" | "ready" | "fallback" | "error";
export type Vector3Data = readonly [number, number, number];
export type Size2Data = readonly [number, number];

export interface MediaSlotDescriptor {
  id: string;
  kind: "VIDEO" | "IMAGE" | "TEXT" | "LIVE_CAMERA";
  required: boolean;
}

export interface OutputProfile {
  id: OutputProfileId;
  width: number;
  height: number;
  safeMargin: number;
}

export interface ScenographyBrief {
  experienceId: string;
  instanceId: string;
  seed: string;
  takeMode: ScenographyTakeMode;
  emotion?: string;
  rhythm?: string;
  spatialIntent?: string;
  performerRequired: boolean;
  mediaSlots: MediaSlotDescriptor[];
  outputProfiles: OutputProfile[];
}

export interface RoomBlueprint {
  width: number;
  depth: number;
  height: number;
  wallThickness: number;
  material: ArchitecturalMaterialId;
  openFront: boolean;
}

export interface ArchitectureModuleBlueprint {
  id: string;
  type: ArchitectureModuleType;
  material: ArchitecturalMaterialId;
  position: Vector3Data;
  rotation: Vector3Data;
  dimensions: Vector3Data;
  radius?: number;
  arc?: number;
  thickness?: number;
  opacity?: number;
}

export interface ProjectionSurfaceBlueprint {
  id: string;
  slotId: string;
  position: Vector3Data;
  rotation: Vector3Data;
  size: Size2Data;
  opacity: number;
}

export interface LightBlueprint {
  id: string;
  type: "POINT" | "SPOT" | "AREA_GLOW";
  color: number;
  intensity: number;
  distance: number;
  position: Vector3Data;
  target?: Vector3Data;
  angle?: number;
}

export interface PerformerStageBlueprint {
  position: Vector3Data;
  size: Vector3Data;
  safeRadius: number;
  backgroundSeparation: number;
  keyLightId: string;
}

export interface CameraAnchorOverride {
  position?: Vector3Data;
  lookAt?: Vector3Data;
  fov?: number;
}

export interface CameraAnchorBlueprint {
  id:
    | "MASTER"
    | "FRONT"
    | "THREE_QUARTER_LEFT"
    | "THREE_QUARTER_RIGHT"
    | "PROFILE"
    | "LOW_ANGLE"
    | "HIGH_ANGLE"
    | "DETAIL"
    | "PORTAL"
    | "ORBIT";
  position: Vector3Data;
  lookAt: Vector3Data;
  fov: number;
  response: number;
  outputOverrides?: Partial<Record<OutputProfileId, CameraAnchorOverride>>;
}

export interface ArchitectureTransitionBlueprint {
  duration: number;
  stagger: number;
  entryOffset: Vector3Data;
  easing: "SMOOTHSTEP" | "CINEMATIC";
  performerOpacity: number;
}

export interface ArchitectureBlueprint {
  id: string;
  seed: string;
  archetype: ArchitectureArchetype;
  room: RoomBlueprint;
  modules: ArchitectureModuleBlueprint[];
  surfaces: ProjectionSurfaceBlueprint[];
  lights: LightBlueprint[];
  performerStage: PerformerStageBlueprint;
  cameraAnchors: CameraAnchorBlueprint[];
  transition: ArchitectureTransitionBlueprint;
}

export interface ArchitectureDirectorState {
  status: ScenographyStatus;
  source: ScenographyGenerationSource | null;
  experienceId: string | null;
  instanceId: string | null;
  seed: string | null;
  archetype: ArchitectureArchetype | null;
}

const vector3Schema = {
  type: "array",
  minItems: 3,
  maxItems: 3,
  items: { type: "number" },
} as const;

export const architectureBlueprintJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "id",
    "seed",
    "archetype",
    "room",
    "modules",
    "surfaces",
    "lights",
    "performerStage",
    "cameraAnchors",
    "transition",
  ],
  properties: {
    id: { type: "string" },
    seed: { type: "string" },
    archetype: { type: "string", enum: ARCHITECTURE_ARCHETYPES },
    room: {
      type: "object",
      additionalProperties: false,
      required: ["width", "depth", "height", "wallThickness", "material", "openFront"],
      properties: {
        width: { type: "number" },
        depth: { type: "number" },
        height: { type: "number" },
        wallThickness: { type: "number" },
        material: { type: "string", enum: ARCHITECTURAL_MATERIALS },
        openFront: { type: "boolean" },
      },
    },
    modules: {
      type: "array",
      maxItems: 30,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "type", "material", "position", "rotation", "dimensions"],
        properties: {
          id: { type: "string" },
          type: { type: "string", enum: ARCHITECTURE_MODULE_TYPES },
          material: { type: "string", enum: ARCHITECTURAL_MATERIALS },
          position: vector3Schema,
          rotation: vector3Schema,
          dimensions: vector3Schema,
          radius: { type: "number" },
          arc: { type: "number" },
          thickness: { type: "number" },
          opacity: { type: "number" },
        },
      },
    },
    surfaces: {
      type: "array",
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "slotId", "position", "rotation", "size", "opacity"],
        properties: {
          id: { type: "string" },
          slotId: { type: "string" },
          position: vector3Schema,
          rotation: vector3Schema,
          size: {
            type: "array",
            minItems: 2,
            maxItems: 2,
            items: { type: "number" },
          },
          opacity: { type: "number" },
        },
      },
    },
    lights: {
      type: "array",
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "type", "color", "intensity", "distance", "position"],
        properties: {
          id: { type: "string" },
          type: { type: "string", enum: ["POINT", "SPOT", "AREA_GLOW"] },
          color: { type: "integer" },
          intensity: { type: "number" },
          distance: { type: "number" },
          position: vector3Schema,
          target: vector3Schema,
          angle: { type: "number" },
        },
      },
    },
    performerStage: {
      type: "object",
      additionalProperties: false,
      required: ["position", "size", "safeRadius", "backgroundSeparation", "keyLightId"],
      properties: {
        position: vector3Schema,
        size: vector3Schema,
        safeRadius: { type: "number" },
        backgroundSeparation: { type: "number" },
        keyLightId: { type: "string" },
      },
    },
    cameraAnchors: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "position", "lookAt", "fov", "response", "outputOverrides"],
        properties: {
          id: {
            type: "string",
            enum: ["MASTER", "FRONT", "THREE_QUARTER_LEFT", "THREE_QUARTER_RIGHT", "PROFILE", "LOW_ANGLE", "HIGH_ANGLE", "DETAIL", "PORTAL", "ORBIT"],
          },
          position: vector3Schema,
          lookAt: vector3Schema,
          fov: { type: "number" },
          response: { type: "number" },
          outputOverrides: {
            type: "object",
            additionalProperties: false,
            properties: Object.fromEntries(
              OUTPUT_PROFILE_IDS.map((id) => [
                id,
                {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    position: vector3Schema,
                    lookAt: vector3Schema,
                    fov: { type: "number" },
                  },
                },
              ])
            ),
          },
        },
      },
    },
    transition: {
      type: "object",
      additionalProperties: false,
      required: ["duration", "stagger", "entryOffset", "easing", "performerOpacity"],
      properties: {
        duration: { type: "number" },
        stagger: { type: "number" },
        entryOffset: vector3Schema,
        easing: { type: "string", enum: ["SMOOTHSTEP", "CINEMATIC"] },
        performerOpacity: { type: "number" },
      },
    },
  },
} as const;
