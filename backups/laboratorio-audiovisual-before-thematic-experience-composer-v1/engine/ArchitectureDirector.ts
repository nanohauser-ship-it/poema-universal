import { ArchitectureManager } from "./ArchitectureManager";
import { CameraDirector } from "./CameraDirector";
import { validateArchitectureBlueprint } from "./ArchitectureValidator";
import {
  createExperienceInstanceId,
  createScenographySeed,
  DEFAULT_OUTPUT_PROFILES,
  generateLocalBlueprint,
} from "../scenography/seededGenerator";
import type {
  ArchitectureBlueprint,
  ArchitectureDirectorState,
  CameraAnchorBlueprint,
  OutputProfileId,
  ScenographyBrief,
  ScenographyGenerationSource,
} from "../scenography/schema";
import type { SceneMode } from "../types/audiovisual";

type ArchitectureResponse = {
  blueprint?: unknown;
  source?: unknown;
};

type ArchitectureStateListener = (state: ArchitectureDirectorState) => void;

const MEDIA_SLOTS = [
  { id: "WALL_PRIMARY", kind: "VIDEO", required: true },
  { id: "WALL_LEFT", kind: "VIDEO", required: false },
  { id: "WALL_RIGHT", kind: "VIDEO", required: false },
  { id: "FLOOR_PRIMARY", kind: "VIDEO", required: false },
  { id: "CEILING_PRIMARY", kind: "VIDEO", required: false },
  { id: "SPATIAL_TEXT", kind: "TEXT", required: false },
] as const;

export class ArchitectureDirector {
  private readonly listeners = new Set<ArchitectureStateListener>();
  private readonly blueprintsByInstance = new Map<string, ArchitectureBlueprint>();
  private readonly blueprintsBySeed = new Map<string, ArchitectureBlueprint>();
  private brief: ScenographyBrief | null = null;
  private activeMode: SceneMode = "gallery";
  private requestVersion = 0;
  private disposed = false;
  private state: ArchitectureDirectorState = {
    status: "idle",
    source: null,
    experienceId: null,
    instanceId: null,
    seed: null,
    archetype: null,
  };

  constructor(
    private readonly manager: ArchitectureManager,
    private readonly camera: CameraDirector
  ) {}

  loadExperience(experienceId: string): Promise<ArchitectureBlueprint | null> {
    if (this.brief?.experienceId === experienceId) {
      return Promise.resolve(this.manager.getBlueprint());
    }

    return this.createNewTake(experienceId);
  }

  createNewTake(
    experienceId = this.brief?.experienceId ?? "sala-madre"
  ): Promise<ArchitectureBlueprint | null> {
    const brief = this.createBrief(
      experienceId,
      createExperienceInstanceId(),
      createScenographySeed(),
      "LIVE"
    );
    return this.generateTake(brief, true);
  }

  reuseTake(seed: string): Promise<ArchitectureBlueprint | null> {
    const cached = this.blueprintsBySeed.get(seed);

    if (cached) {
      this.brief = this.createBrief(
        this.brief?.experienceId ?? "sala-madre",
        createExperienceInstanceId(),
        seed,
        "CURATED"
      );
      this.applyBlueprint(cached, "local");
      return Promise.resolve(cached);
    }

    const brief = this.createBrief(
      this.brief?.experienceId ?? "sala-madre",
      createExperienceInstanceId(),
      seed,
      "CURATED"
    );
    return this.generateTake(brief, false);
  }

  regenerateArchitecture(): Promise<ArchitectureBlueprint | null> {
    return this.createNewTake();
  }

  setMode(mode: SceneMode): void {
    this.activeMode = mode;
    this.manager.setVisible(mode === "immersive");

    if (mode === "immersive") {
      this.setCameraAnchor("MASTER", "16:9");
    }
  }

  setCameraAnchor(
    id: CameraAnchorBlueprint["id"],
    outputProfile: OutputProfileId = "16:9"
  ): boolean {
    const blueprint = this.manager.getBlueprint();
    const anchor = blueprint?.cameraAnchors.find((item) => item.id === id);

    if (!anchor) {
      return false;
    }

    const override = anchor.outputOverrides?.[outputProfile];
    this.camera.setCamera({
      preset: "IMMERSIVE",
      position: override?.position ?? anchor.position,
      lookAt: override?.lookAt ?? anchor.lookAt,
      fov: override?.fov ?? anchor.fov,
      response: anchor.response,
    });
    return true;
  }

  update(deltaTime: number): void {
    this.manager.update(deltaTime);
  }

  subscribe(listener: ArchitectureStateListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  getState(): ArchitectureDirectorState {
    return this.state;
  }

  getBlueprint(): ArchitectureBlueprint | null {
    return this.manager.getBlueprint();
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }

    this.disposed = true;
    this.requestVersion += 1;
    this.listeners.clear();
    this.blueprintsByInstance.clear();
    this.blueprintsBySeed.clear();
  }

  private createBrief(
    experienceId: string,
    instanceId: string,
    seed: string,
    takeMode: ScenographyBrief["takeMode"]
  ): ScenographyBrief {
    return {
      experienceId,
      instanceId,
      seed,
      takeMode,
      emotion: "presencia, profundidad y espera",
      rhythm: "cinematográfico, lento y respirado",
      spatialIntent: "arquitectura museística filmable alrededor del performer",
      performerRequired: true,
      mediaSlots: MEDIA_SLOTS.map((slot) => ({ ...slot })),
      outputProfiles: DEFAULT_OUTPUT_PROFILES.map((profile) => ({ ...profile })),
    };
  }

  private async generateTake(
    brief: ScenographyBrief,
    allowRemotePlanning: boolean
  ): Promise<ArchitectureBlueprint | null> {
    if (this.disposed) {
      return null;
    }

    this.brief = brief;
    const requestVersion = ++this.requestVersion;
    this.setState({
      status: "generating",
      source: null,
      experienceId: brief.experienceId,
      instanceId: brief.instanceId,
      seed: brief.seed,
      archetype: null,
    });

    try {
      const planned = allowRemotePlanning
        ? await this.requestBlueprint(brief)
        : { blueprint: generateLocalBlueprint(brief), source: "local" as const };

      if (this.disposed || requestVersion !== this.requestVersion) {
        return null;
      }

      this.applyBlueprint(planned.blueprint, planned.source);
      return planned.blueprint;
    } catch {
      if (this.disposed || requestVersion !== this.requestVersion) {
        return null;
      }

      try {
        const fallback = generateLocalBlueprint(brief);
        this.applyBlueprint(fallback, "fallback");
        return fallback;
      } catch {
        this.setState({ ...this.state, status: "error", source: null });
        return null;
      }
    }
  }

  private async requestBlueprint(
    brief: ScenographyBrief
  ): Promise<{
    blueprint: ArchitectureBlueprint;
    source: ScenographyGenerationSource;
  }> {
    const response = await fetch(
      "/laboratorio-audiovisual/api/architecture",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Architecture planner no disponible");
    }

    const payload = (await response.json()) as ArchitectureResponse;
    const validation = validateArchitectureBlueprint(
      payload.blueprint,
      brief.mediaSlots.map((slot) => slot.id)
    );

    if (!validation.ok) {
      throw new Error("Blueprint remoto rechazado");
    }

    const source: ScenographyGenerationSource =
      payload.source === "ai" ? "ai" : "fallback";
    return { blueprint: validation.blueprint, source };
  }

  private applyBlueprint(
    blueprint: ArchitectureBlueprint,
    source: ScenographyGenerationSource
  ): void {
    this.manager.applyBlueprint(blueprint);
    this.manager.setVisible(this.activeMode === "immersive");
    this.blueprintsByInstance.set(
      this.brief?.instanceId ?? blueprint.id,
      blueprint
    );
    this.blueprintsBySeed.set(blueprint.seed, blueprint);

    if (this.activeMode === "immersive") {
      this.setCameraAnchor("MASTER", "16:9");
    }

    this.setState({
      status: source === "ai" ? "ready" : "fallback",
      source,
      experienceId: this.brief?.experienceId ?? null,
      instanceId: this.brief?.instanceId ?? null,
      seed: blueprint.seed,
      archetype: blueprint.archetype,
    });
  }

  private setState(state: ArchitectureDirectorState): void {
    this.state = state;

    for (const listener of this.listeners) {
      listener(state);
    }
  }
}
