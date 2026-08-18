export type SceneMode = "gallery" | "immersive" | "performance";

export type ArchitectureMode = SceneMode;

export type SurfaceId = "LEFT" | "BACK" | "RIGHT" | "FLOOR" | "CEILING";

export type SurfaceKey =
  | SurfaceId
  | `FREE_SCREEN_${string}`
  | HumanLayerSurfaceId;

export type HumanLayerSurfaceId =
  | "HUMAN_LAYER"
  | "HUMAN_DUPLICATE_LEFT"
  | "HUMAN_DUPLICATE_RIGHT";

export type DepthLayerId = "BACKGROUND_FX" | "HUMAN_LAYER" | "FOREGROUND_FX";

export type CameraPresetId = "GENERAL" | "IMMERSIVE" | "PERFORMANCE";

export type BorderlessStageId = "ROOM" | "THRESHOLD" | "PASSAGE";

export type HumanPresencePreset =
  | "PRESENCE"
  | "GIANT"
  | "GHOST"
  | "ECHOES";

export type WebcamStatus =
  | "idle"
  | "requesting"
  | "active"
  | "denied"
  | "unsupported"
  | "error";

export type HumanCutoutStatus = "idle" | "loading" | "active" | "error";

export type Vector2Tuple = readonly [number, number];
export type Vector3Tuple = readonly [number, number, number];

export interface TransformConfiguration {
  position?: Vector3Tuple;
  rotation?: Vector3Tuple;
  scale?: Vector3Tuple;
}

export interface TextureTransformConfiguration {
  offset?: Vector2Tuple;
  repeat?: Vector2Tuple;
  center?: Vector2Tuple;
  rotation?: number;
  flipY?: boolean;
}

export interface CanvasMediaDescriptor {
  title: string;
  subtitle?: string;
  accent?: string;
  background?: string;
  transparent?: boolean;
  width?: number;
  height?: number;
  variant?: "label" | "human-placeholder";
}

export type MediaContent =
  | { kind: "NONE" }
  | { kind: "COLOR"; color: number | string }
  | {
      kind: "IMAGE";
      src: string;
      texture?: TextureTransformConfiguration;
    }
  | {
      kind: "VIDEO";
      src: string;
      texture?: TextureTransformConfiguration;
    }
  | {
      kind: "CANVAS";
      canvas: HTMLCanvasElement | CanvasMediaDescriptor;
      texture?: TextureTransformConfiguration;
    }
  | {
      kind: "WEBCAM";
      element?: HTMLVideoElement;
      texture?: TextureTransformConfiguration;
    };

export interface SurfaceConfiguration extends TransformConfiguration {
  id: SurfaceKey;
  content: MediaContent;
  visible?: boolean;
  opacity?: number;
  depthWrite?: boolean;
  emissive?: number | string;
  intensity?: number;
}

export interface SurfaceMaterialProfile {
  color: number;
  roughness: number;
  metalness: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
}

export interface SurfaceDefinition extends TransformConfiguration {
  id: SurfaceKey;
  width: number;
  height: number;
  baseVisible?: boolean;
  renderOrder?: number;
  frame?: {
    enabled: boolean;
    color?: number;
    border?: number;
    depth?: number;
  };
  material?: Partial<SurfaceMaterialProfile>;
}

export interface CameraConfiguration {
  preset: CameraPresetId;
  position?: Vector3Tuple;
  lookAt?: Vector3Tuple;
  fov?: number;
}

export interface BorderlessStageConfiguration {
  camera: CameraConfiguration;
  architectureOpacity: number;
  mediaOpacity: number;
}

export interface BorderlessConfiguration {
  enabled: boolean;
  accent?: number;
  surfaces: readonly SurfaceConfiguration[];
  stages: Readonly<Record<BorderlessStageId, BorderlessStageConfiguration>>;
}

export interface EnvironmentConfiguration {
  background: number;
  fogColor: number;
  fogDensity: number;
  exposure: number;
}

export interface ArchitectureConfiguration {
  platformVisible: boolean;
  platformOpacity: number;
  ringVisible: boolean;
  ringOpacity: number;
  ringPulse?: number;
  edgeLightOpacity: number;
  hemisphereIntensity: number;
  centralSpotIntensity: number;
  warmFillIntensity: number;
}

export interface HumanLayerConfiguration extends TransformConfiguration {
  content: MediaContent;
  visible: boolean;
  opacity: number;
}

export interface HumanPresentationConfiguration extends TransformConfiguration {
  opacity: number;
  duplicates?: readonly HumanDuplicateConfiguration[];
}

export interface HumanDuplicateConfiguration extends TransformConfiguration {
  id: Exclude<HumanLayerSurfaceId, "HUMAN_LAYER">;
  visible: boolean;
  opacity: number;
}

export interface ExperienceDefinition {
  id: string;
  label: string;
  architecture: ArchitectureMode;
  environment: EnvironmentConfiguration;
  architectureState: ArchitectureConfiguration;
  camera: CameraConfiguration;
  surfaces: readonly SurfaceConfiguration[];
  human: HumanLayerConfiguration;
  humanPresets?: Partial<
    Record<HumanPresencePreset, HumanPresentationConfiguration>
  >;
  borderless?: BorderlessConfiguration;
  layers: Partial<Record<DepthLayerId, { visible: boolean }>>;
}

export interface MasterFrame {
  elapsedTime: number;
  deltaTime: number;
}
