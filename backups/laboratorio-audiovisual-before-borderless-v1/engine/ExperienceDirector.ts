import { CameraDirector } from "./CameraDirector";
import { SurfaceManager } from "./SurfaceManager";
import type {
  ArchitectureConfiguration,
  DepthLayerId,
  EnvironmentConfiguration,
  ExperienceDefinition,
  HumanPresencePreset,
  MasterFrame,
  MediaContent,
  SurfaceConfiguration,
} from "../types/audiovisual";

const HUMAN_DUPLICATE_IDS = [
  "HUMAN_DUPLICATE_LEFT",
  "HUMAN_DUPLICATE_RIGHT",
] as const;

export interface ExperienceRuntime {
  applyEnvironment(configuration: EnvironmentConfiguration): void;
  applyArchitecture(configuration: ArchitectureConfiguration): void;
  setLayerVisibility(layer: DepthLayerId, visible: boolean): void;
  updateArchitecture(frame: MasterFrame): void;
}

export class ExperienceDirector {
  private activeExperience: ExperienceDefinition | null = null;
  private humanMediaOverride: MediaContent | null = null;
  private humanPreset: HumanPresencePreset = "PRESENCE";
  private readonly masterFrame: MasterFrame = {
    elapsedTime: 0,
    deltaTime: 0,
  };

  constructor(
    private readonly experiences: Readonly<Record<string, ExperienceDefinition>>,
    private readonly surfaces: SurfaceManager,
    private readonly camera: CameraDirector,
    private readonly runtime: ExperienceRuntime
  ) {}

  setExperience(id: string): void {
    const experience = this.experiences[id];

    if (!experience) {
      return;
    }

    this.activeExperience = experience;
    this.runtime.applyEnvironment(experience.environment);
    this.runtime.applyArchitecture(experience.architectureState);
    this.camera.setCamera(experience.camera);
    this.surfaces.configureMany(experience.surfaces);

    this.applyHumanConfiguration();

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

  update(elapsedTime: number, deltaTime: number): void {
    this.masterFrame.elapsedTime = elapsedTime;
    this.masterFrame.deltaTime = deltaTime;
    this.surfaces.update(deltaTime);
    this.camera.update(deltaTime);
    this.runtime.updateArchitecture(this.masterFrame);
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

    const humanConfiguration: SurfaceConfiguration = {
      id: "HUMAN_LAYER",
      content: this.humanMediaOverride ?? experience.human.content,
      position: presentation?.position ?? experience.human.position,
      rotation: presentation?.rotation ?? experience.human.rotation,
      scale: presentation?.scale ?? experience.human.scale,
      visible: experience.human.visible,
      opacity: presentation?.opacity ?? experience.human.opacity,
    };

    this.surfaces.configure(humanConfiguration);

    for (const duplicateId of HUMAN_DUPLICATE_IDS) {
      const duplicate = presentation?.duplicates?.find(
        (configuration) => configuration.id === duplicateId
      );

      this.surfaces.configure({
        id: duplicateId,
        content: this.humanMediaOverride ?? experience.human.content,
        position: duplicate?.position ?? experience.human.position,
        rotation: duplicate?.rotation ?? experience.human.rotation,
        scale: duplicate?.scale ?? experience.human.scale,
        visible: experience.human.visible && Boolean(duplicate?.visible),
        opacity: duplicate?.opacity ?? 0,
      });
    }
  }
}
