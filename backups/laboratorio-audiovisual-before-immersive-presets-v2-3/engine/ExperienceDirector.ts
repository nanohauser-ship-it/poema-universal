import { CameraDirector } from "./CameraDirector";
import { BorderlessDirector } from "./BorderlessDirector";
import { SurfaceManager } from "./SurfaceManager";
import type {
  ArchitectureConfiguration,
  BorderlessStageId,
  DepthLayerId,
  EnvironmentConfiguration,
  ExperienceDefinition,
  HumanLookConfiguration,
  HumanPresencePreset,
  MasterFrame,
  MediaContent,
  SurfaceConfiguration,
  SurfaceKey,
  Vector3Tuple,
} from "../types/audiovisual";

const HUMAN_DUPLICATE_IDS = [
  "HUMAN_DUPLICATE_LEFT",
  "HUMAN_DUPLICATE_RIGHT",
] as const;

function addVector(
  base: Vector3Tuple | undefined,
  offset: Vector3Tuple | undefined
): Vector3Tuple | undefined {
  if (!offset) {
    return base;
  }

  if (!base) {
    return offset;
  }

  return [
    base[0] + offset[0],
    base[1] + offset[1],
    base[2] + offset[2],
  ];
}

function multiplyVector(
  base: Vector3Tuple | undefined,
  multiplier: number | undefined
): Vector3Tuple | undefined {
  if (multiplier === undefined) {
    return base;
  }

  const source = base ?? [1, 1, 1];
  return [
    source[0] * multiplier,
    source[1] * multiplier,
    source[2] * multiplier,
  ];
}

export interface ExperienceRuntime {
  applyEnvironment(configuration: EnvironmentConfiguration): void;
  applyArchitecture(configuration: ArchitectureConfiguration): void;
  applyHumanLook(configuration: Partial<HumanLookConfiguration>): void;
  setLayerVisibility(layer: DepthLayerId, visible: boolean): void;
  updateArchitecture(frame: MasterFrame): void;
}

export class ExperienceDirector {
  private activeExperience: ExperienceDefinition | null = null;
  private humanMediaOverride: MediaContent | null = null;
  private humanPreset: HumanPresencePreset = "PRESENCE";
  private borderlessStage: BorderlessStageId = "ROOM";
  private readonly surfaceMediaOverrides = new Map<
    string,
    Map<SurfaceKey, MediaContent>
  >();
  private readonly masterFrame: MasterFrame = {
    elapsedTime: 0,
    deltaTime: 0,
  };

  constructor(
    private readonly experiences: Readonly<Record<string, ExperienceDefinition>>,
    private readonly surfaces: SurfaceManager,
    private readonly camera: CameraDirector,
    private readonly borderless: BorderlessDirector,
    private readonly runtime: ExperienceRuntime
  ) {}

  setExperience(id: string): void {
    const experience = this.experiences[id];

    if (!experience) {
      return;
    }

    this.activeExperience = experience;
    this.borderlessStage = "ROOM";
    this.runtime.applyEnvironment(experience.environment);
    this.runtime.applyArchitecture(experience.architectureState);
    this.camera.setCamera(experience.camera);
    const surfaceOverrides = this.surfaceMediaOverrides.get(id);
    this.surfaces.configureMany(
      experience.surfaces.map((surface) => {
        const content = surfaceOverrides?.get(surface.id);
        return content ? { ...surface, content } : surface;
      })
    );
    this.borderless.setExperience(experience);
    this.borderless.setSurfaceMediaOverrides(surfaceOverrides);

    this.applyHumanConfiguration();
    this.applyHumanLook();

    const layers: readonly DepthLayerId[] = [
      "BACKGROUND_FX",
      "HUMAN_LAYER",
      "FOREGROUND_FX",
    ];

    for (const layer of layers) {
      const state = experience.layers[layer];

      if (state) {
        this.runtime.setLayerVisibility(layer, state.visible);
      }
    }
  }

  setHumanMedia(content: MediaContent | null): void {
    this.humanMediaOverride = content;
    this.applyHumanConfiguration();
  }

  setHumanPreset(preset: HumanPresencePreset): void {
    this.humanPreset = preset;
    this.applyHumanConfiguration();
  }

  setSurfaceMediaOverride(
    experienceId: string,
    id: SurfaceKey,
    content: MediaContent | null
  ): void {
    let overrides = this.surfaceMediaOverrides.get(experienceId);

    if (!overrides && content) {
      overrides = new Map<SurfaceKey, MediaContent>();
      this.surfaceMediaOverrides.set(experienceId, overrides);
    }

    if (content) {
      overrides?.set(id, content);
    } else {
      overrides?.delete(id);

      if (overrides?.size === 0) {
        this.surfaceMediaOverrides.delete(experienceId);
      }
    }

    const experience = this.activeExperience;

    if (!experience || experience.id !== experienceId) {
      return;
    }

    const baseSurface = experience.surfaces.find(
      (surface) => surface.id === id
    );

    if (baseSurface) {
      this.surfaces.configure(
        content ? { ...baseSurface, content } : baseSurface
      );
    }

    this.borderless.setSurfaceMediaOverride(id, content);
  }

  setBorderlessStage(stage: BorderlessStageId): boolean {
    const changed = this.borderless.setStage(stage);

    if (changed) {
      this.borderlessStage = stage;
      this.applyHumanConfiguration();
      this.applyHumanLook();
    }

    return changed;
  }

  update(elapsedTime: number, deltaTime: number): void {
    this.masterFrame.elapsedTime = elapsedTime;
    this.masterFrame.deltaTime = deltaTime;
    this.surfaces.update(deltaTime, elapsedTime);
    this.camera.update(deltaTime);
    this.runtime.updateArchitecture(this.masterFrame);
    this.borderless.update(this.masterFrame);
  }

  getActiveExperience(): ExperienceDefinition | null {
    return this.activeExperience;
  }

  private applyHumanConfiguration(): void {
    const experience = this.activeExperience;

    if (!experience) {
      return;
    }

    const presentation = experience.humanPresets?.[this.humanPreset];
    const stageConfiguration =
      experience.borderless?.stages[this.borderlessStage];
    const anchor = stageConfiguration?.human;
    const opacityMultiplier = anchor?.opacityMultiplier ?? 1;
    const basePosition = presentation?.position ?? experience.human.position;
    const baseRotation = presentation?.rotation ?? experience.human.rotation;
    const baseScale = presentation?.scale ?? experience.human.scale;
    const baseOpacity = presentation?.opacity ?? experience.human.opacity;

    const humanConfiguration: SurfaceConfiguration = {
      id: "HUMAN_LAYER",
      content: this.humanMediaOverride ?? experience.human.content,
      position: addVector(basePosition, anchor?.offset),
      rotation: addVector(baseRotation, anchor?.rotationOffset),
      scale: multiplyVector(baseScale, anchor?.scaleMultiplier),
      visible: experience.human.visible,
      opacity: baseOpacity * opacityMultiplier,
    };

    this.surfaces.configure(humanConfiguration);

    for (const duplicateId of HUMAN_DUPLICATE_IDS) {
      const duplicate = presentation?.duplicates?.find(
        (configuration) => configuration.id === duplicateId
      );

      this.surfaces.configure({
        id: duplicateId,
        content: this.humanMediaOverride ?? experience.human.content,
        position: addVector(
          duplicate?.position ?? experience.human.position,
          anchor?.offset
        ),
        rotation: addVector(
          duplicate?.rotation ?? experience.human.rotation,
          anchor?.rotationOffset
        ),
        scale: multiplyVector(
          duplicate?.scale ?? experience.human.scale,
          anchor?.scaleMultiplier
        ),
        visible: experience.human.visible && Boolean(duplicate?.visible),
        opacity: (duplicate?.opacity ?? 0) * opacityMultiplier,
      });
    }
  }

  private applyHumanLook(): void {
    const experience = this.activeExperience;

    if (!experience) {
      return;
    }

    const stageLook =
      experience.borderless?.stages[this.borderlessStage]?.humanLook;
    this.runtime.applyHumanLook({
      ...experience.humanLook,
      ...stageLook,
    });
  }
}
