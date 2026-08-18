import * as THREE from "three";

import { BorderlessDirector } from "./BorderlessDirector";
import { CameraDirector } from "./CameraDirector";
import {
  ExperienceDirector,
  type ExperienceRuntime,
} from "./ExperienceDirector";
import { HumanCompositor } from "./HumanCompositor";
import { MediaManager } from "./MediaManager";
import { SurfaceManager } from "./SurfaceManager";
import { WebcamManager } from "./WebcamManager";
import { experienceRegistry } from "../experiences";
import type {
  ArchitectureConfiguration,
  BorderlessStageId,
  DepthLayerId,
  EnvironmentConfiguration,
  HumanCutoutStatus,
  HumanLookConfiguration,
  HumanPresencePreset,
  MasterFrame,
  SceneMode,
  SurfaceDefinition,
  WebcamStatus,
} from "../types/audiovisual";

const INITIAL_ARCHITECTURE: ArchitectureConfiguration = {
  platformVisible: true,
  platformOpacity: 1,
  ringVisible: false,
  ringOpacity: 0,
  edgeLightOpacity: 0.22,
  structuralDetailOpacity: 0.42,
  technicalCeilingOpacity: 0.82,
  projectionGlowIntensity: 0.18,
  hemisphereIntensity: 0.28,
  centralSpotIntensity: 3.1,
  warmFillIntensity: 0.7,
};

export class SceneEngine implements ExperienceRuntime {
  readonly scene: THREE.Scene;
  readonly renderer: THREE.WebGLRenderer;
  readonly camera: THREE.PerspectiveCamera;
  readonly clock: THREE.Clock;

  private readonly mediaManager: MediaManager;
  private readonly surfaceManager: SurfaceManager;
  private readonly cameraDirector: CameraDirector;
  private readonly borderlessDirector: BorderlessDirector;
  private readonly webcamManager: WebcamManager;
  private readonly humanCompositor: HumanCompositor;
  private readonly experienceDirector: ExperienceDirector;
  private readonly architectureRoot = new THREE.Group();
  private readonly technicalCeilingRoot = new THREE.Group();
  private readonly structuralDetailRoot = new THREE.Group();
  private readonly architectureGeometries = new Set<THREE.BufferGeometry>();
  private readonly architectureMaterials = new Set<THREE.Material>();
  private readonly layers: Record<DepthLayerId, THREE.Group>;

  private readonly sceneBackground = new THREE.Color(0x020304);
  private readonly targetBackground = new THREE.Color(0x020304);
  private readonly targetFogColor = new THREE.Color(0x020304);

  private readonly platform: THREE.Mesh<
    THREE.CylinderGeometry,
    THREE.MeshPhysicalMaterial
  >;
  private readonly lightRing: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>;
  private readonly edgeLightMaterial: THREE.MeshBasicMaterial;
  private readonly technicalCeilingMaterial: THREE.MeshStandardMaterial;
  private readonly technicalLensMaterial: THREE.MeshBasicMaterial;
  private readonly structuralDetailMaterial: THREE.MeshBasicMaterial;
  private readonly projectionGlowLights: readonly {
    light: THREE.PointLight;
    factor: number;
  }[];
  private readonly hemisphere: THREE.HemisphereLight;
  private readonly centralSpot: THREE.SpotLight;
  private readonly warmFill: THREE.PointLight;

  private resizeObserver: ResizeObserver | null = null;
  private animationFrame: number | null = null;
  private activeMode: SceneMode | null = null;
  private running = false;
  private disposed = false;
  private targetFogDensity = 0.022;
  private targetExposure = 1.02;
  private targetArchitecture: ArchitectureConfiguration = {
    ...INITIAL_ARCHITECTURE,
  };

  constructor(private readonly mount: HTMLDivElement) {
    this.scene = new THREE.Scene();
    this.scene.background = this.sceneBackground;
    this.scene.fog = new THREE.FogExp2(0x020304, 0.022);

    this.camera = new THREE.PerspectiveCamera(44, 1, 0.1, 120);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    this.clock = new THREE.Clock(false);

    this.configureRenderer();
    this.mount.appendChild(this.renderer.domElement);

    this.mediaManager = new MediaManager();
    this.surfaceManager = new SurfaceManager(this.mediaManager, this.camera);
    this.cameraDirector = new CameraDirector(this.camera, this.renderer.domElement);
    this.webcamManager = new WebcamManager();
    this.humanCompositor = new HumanCompositor();

    this.layers = {
      BACKGROUND_FX: new THREE.Group(),
      HUMAN_LAYER: new THREE.Group(),
      FOREGROUND_FX: new THREE.Group(),
    };
    this.layers.BACKGROUND_FX.name = "BACKGROUND_FX";
    this.layers.HUMAN_LAYER.name = "HUMAN_LAYER";
    this.layers.FOREGROUND_FX.name = "FOREGROUND_FX";

    this.architectureRoot.name = "ARCHITECTURE";
    this.technicalCeilingRoot.name = "TECHNICAL_CEILING";
    this.structuralDetailRoot.name = "STRUCTURAL_DETAILS";
    this.scene.add(
      this.architectureRoot,
      this.surfaceManager.root,
      this.layers.BACKGROUND_FX,
      this.layers.HUMAN_LAYER,
      this.layers.FOREGROUND_FX
    );

    const architecture = this.createArchitecture();
    this.platform = architecture.platform;
    this.lightRing = architecture.lightRing;
    this.edgeLightMaterial = architecture.edgeLightMaterial;
    this.technicalCeilingMaterial = architecture.technicalCeilingMaterial;
    this.technicalLensMaterial = architecture.technicalLensMaterial;
    this.structuralDetailMaterial = architecture.structuralDetailMaterial;
    this.projectionGlowLights = architecture.projectionGlowLights;
    this.hemisphere = architecture.hemisphere;
    this.centralSpot = architecture.centralSpot;
    this.warmFill = architecture.warmFill;

    this.registerSurfaces();

    this.borderlessDirector = new BorderlessDirector(
      this.cameraDirector,
      this.surfaceManager
    );
    this.scene.add(this.borderlessDirector.root);

    this.experienceDirector = new ExperienceDirector(
      experienceRegistry,
      this.surfaceManager,
      this.cameraDirector,
      this.borderlessDirector,
      this
    );

    this.resizeObserver = new ResizeObserver(this.handleResize);
    this.resizeObserver.observe(this.mount);
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  }

  start(initialMode: SceneMode = "gallery"): void {
    if (this.running || this.disposed) {
      return;
    }

    this.activeMode = initialMode;
    this.experienceDirector.setExperience(initialMode);
    this.running = true;
    this.clock.start();
    this.scheduleNextFrame();
  }

  setExperience(mode: SceneMode): void {
    if (this.disposed) {
      return;
    }

    if (this.activeMode === "performance" && mode !== "performance") {
      this.disableWebcam();
    }

    this.activeMode = mode;
    this.experienceDirector.setExperience(mode);
  }

  async enableWebcam(): Promise<WebcamStatus> {
    if (this.disposed) {
      return "error";
    }

    const result = await this.webcamManager.start();

    if (result.status === "active" && result.video) {
      const humanCanvas = this.humanCompositor.connect(result.video);
      this.experienceDirector.setHumanMedia({
        kind: "CANVAS",
        canvas: humanCanvas,
      });
    }

    return result.status;
  }

  disableWebcam(): void {
    if (this.disposed) {
      return;
    }

    this.experienceDirector.setHumanMedia(null);
    this.humanCompositor.disconnect();
    this.webcamManager.stop();
  }

  async enableHumanSegmentation(): Promise<HumanCutoutStatus> {
    if (this.disposed) {
      return "error";
    }

    const enabled = await this.humanCompositor.enableSemanticCutout();
    return enabled ? "active" : "error";
  }

  disableHumanCutout(): void {
    if (this.disposed) {
      return;
    }

    this.humanCompositor.disableCutout();
  }

  setHumanPreset(preset: HumanPresencePreset): void {
    if (this.disposed) {
      return;
    }

    this.experienceDirector.setHumanPreset(preset);
  }

  setBorderlessStage(stage: BorderlessStageId): boolean {
    if (this.disposed) {
      return false;
    }

    return this.experienceDirector.setBorderlessStage(stage);
  }

  getLayer(layer: DepthLayerId): THREE.Group {
    return this.layers[layer];
  }

  applyEnvironment(configuration: EnvironmentConfiguration): void {
    this.targetBackground.set(configuration.background);
    this.targetFogColor.set(configuration.fogColor);
    this.targetFogDensity = configuration.fogDensity;
    this.targetExposure = configuration.exposure;
  }

  applyHumanLook(configuration: Partial<HumanLookConfiguration>): void {
    this.humanCompositor.setLook(configuration);
  }

  applyArchitecture(configuration: ArchitectureConfiguration): void {
    this.targetArchitecture = { ...configuration };

    if (configuration.platformVisible) {
      this.platform.visible = true;
    }

    if (configuration.ringVisible) {
      this.lightRing.visible = true;
    }

    if (configuration.technicalCeilingOpacity > 0) {
      this.technicalCeilingRoot.visible = true;
    }

    if (configuration.structuralDetailOpacity > 0) {
      this.structuralDetailRoot.visible = true;
    }
  }

  setLayerVisibility(layer: DepthLayerId, visible: boolean): void {
    const group = this.layers[layer];
    group.userData.enabled = visible;

    if (layer === "HUMAN_LAYER") {
      group.visible = true;
      return;
    }

    group.visible = visible;
  }

  updateArchitecture(frame: MasterFrame): void {
    const alpha = 1 - Math.exp(-4.8 * frame.deltaTime);
    const lightAlpha = 1 - Math.exp(-5.6 * frame.deltaTime);

    this.sceneBackground.lerp(this.targetBackground, alpha);

    if (this.scene.fog instanceof THREE.FogExp2) {
      this.scene.fog.color.lerp(this.targetFogColor, alpha);
      this.scene.fog.density = THREE.MathUtils.lerp(
        this.scene.fog.density,
        this.targetFogDensity,
        alpha
      );
    }

    this.renderer.toneMappingExposure = THREE.MathUtils.lerp(
      this.renderer.toneMappingExposure,
      this.targetExposure,
      alpha
    );

    this.platform.material.opacity = THREE.MathUtils.lerp(
      this.platform.material.opacity,
      this.targetArchitecture.platformVisible
        ? this.targetArchitecture.platformOpacity
        : 0,
      alpha
    );

    const ringPulse = this.targetArchitecture.ringPulse ?? 0;
    const pulsedRingOpacity = this.targetArchitecture.ringVisible
      ? this.targetArchitecture.ringOpacity +
        Math.sin(frame.elapsedTime * ringPulse) * (ringPulse > 0 ? 0.055 : 0)
      : 0;

    this.lightRing.material.opacity = THREE.MathUtils.lerp(
      this.lightRing.material.opacity,
      THREE.MathUtils.clamp(pulsedRingOpacity, 0, 1),
      alpha
    );
    this.edgeLightMaterial.opacity = THREE.MathUtils.lerp(
      this.edgeLightMaterial.opacity,
      this.targetArchitecture.edgeLightOpacity,
      alpha
    );
    this.technicalCeilingMaterial.opacity = THREE.MathUtils.lerp(
      this.technicalCeilingMaterial.opacity,
      this.targetArchitecture.technicalCeilingOpacity,
      alpha
    );
    this.technicalLensMaterial.opacity = THREE.MathUtils.lerp(
      this.technicalLensMaterial.opacity,
      this.targetArchitecture.technicalCeilingOpacity * 0.78,
      lightAlpha
    );
    this.structuralDetailMaterial.opacity = THREE.MathUtils.lerp(
      this.structuralDetailMaterial.opacity,
      this.targetArchitecture.structuralDetailOpacity,
      alpha
    );

    for (const glow of this.projectionGlowLights) {
      glow.light.intensity = THREE.MathUtils.lerp(
        glow.light.intensity,
        this.targetArchitecture.projectionGlowIntensity * glow.factor,
        lightAlpha
      );
    }
    this.hemisphere.intensity = THREE.MathUtils.lerp(
      this.hemisphere.intensity,
      this.targetArchitecture.hemisphereIntensity,
      lightAlpha
    );
    this.centralSpot.intensity = THREE.MathUtils.lerp(
      this.centralSpot.intensity,
      this.targetArchitecture.centralSpotIntensity,
      lightAlpha
    );
    this.warmFill.intensity = THREE.MathUtils.lerp(
      this.warmFill.intensity,
      this.targetArchitecture.warmFillIntensity,
      lightAlpha
    );

    if (
      !this.targetArchitecture.platformVisible &&
      this.platform.material.opacity < 0.005
    ) {
      this.platform.visible = false;
    }

    if (!this.targetArchitecture.ringVisible && this.lightRing.material.opacity < 0.005) {
      this.lightRing.visible = false;
    }

    if (
      this.targetArchitecture.technicalCeilingOpacity === 0 &&
      this.technicalCeilingMaterial.opacity < 0.005
    ) {
      this.technicalCeilingRoot.visible = false;
    }

    if (
      this.targetArchitecture.structuralDetailOpacity === 0 &&
      this.structuralDetailMaterial.opacity < 0.005
    ) {
      this.structuralDetailRoot.visible = false;
    }
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }

    this.disposed = true;
    this.running = false;

    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    this.clock.stop();
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    window.removeEventListener("resize", this.handleResize);

    this.borderlessDirector.dispose();
    this.cameraDirector.dispose();
    this.surfaceManager.dispose();
    this.humanCompositor.dispose();
    this.webcamManager.dispose();
    this.mediaManager.dispose();

    for (const geometry of this.architectureGeometries) {
      geometry.dispose();
    }

    for (const material of this.architectureMaterials) {
      material.dispose();
    }

    this.architectureGeometries.clear();
    this.architectureMaterials.clear();
    this.scene.clear();
    this.renderer.dispose();
    this.renderer.forceContextLoss();

    if (this.renderer.domElement.parentElement === this.mount) {
      this.renderer.domElement.remove();
    }
  }

  private configureRenderer(): void {
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.02;
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";
    this.renderer.domElement.style.display = "block";
    this.renderer.domElement.dataset.audiovisualEngine = "sala-madre-v1";
  }

  private createArchitecture(): {
    platform: THREE.Mesh<THREE.CylinderGeometry, THREE.MeshPhysicalMaterial>;
    lightRing: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>;
    edgeLightMaterial: THREE.MeshBasicMaterial;
    technicalCeilingMaterial: THREE.MeshStandardMaterial;
    technicalLensMaterial: THREE.MeshBasicMaterial;
    structuralDetailMaterial: THREE.MeshBasicMaterial;
    projectionGlowLights: readonly {
      light: THREE.PointLight;
      factor: number;
    }[];
    hemisphere: THREE.HemisphereLight;
    centralSpot: THREE.SpotLight;
    warmFill: THREE.PointLight;
  } {
    const shellMaterial = this.trackMaterial(
      new THREE.MeshStandardMaterial({
        color: 0x040506,
        roughness: 0.94,
        metalness: 0.01,
      })
    );
    const floorShellMaterial = this.trackMaterial(
      new THREE.MeshStandardMaterial({
        color: 0x020303,
        roughness: 0.9,
      })
    );

    const backSideGeometry = this.trackGeometry(
      new THREE.BoxGeometry(5.32, 7.5, 0.22)
    );
    const backHeaderGeometry = this.trackGeometry(
      new THREE.BoxGeometry(5.36, 2, 0.22)
    );
    const sideGeometry = this.trackGeometry(new THREE.BoxGeometry(0.22, 7.5, 12));
    const ceilingGeometry = this.trackGeometry(new THREE.PlaneGeometry(16, 12));
    const floorGeometry = this.trackGeometry(new THREE.PlaneGeometry(16, 12));

    const backWallLeft = new THREE.Mesh(backSideGeometry, shellMaterial);
    backWallLeft.position.set(-5.34, 3.75, -6);
    const backWallRight = new THREE.Mesh(backSideGeometry, shellMaterial);
    backWallRight.position.set(5.34, 3.75, -6);
    const backWallHeader = new THREE.Mesh(backHeaderGeometry, shellMaterial);
    backWallHeader.position.set(0, 6.5, -6);

    const leftWall = new THREE.Mesh(sideGeometry, shellMaterial);
    leftWall.position.set(-8, 3.75, 0);

    const rightWall = new THREE.Mesh(sideGeometry, shellMaterial);
    rightWall.position.set(8, 3.75, 0);

    const ceiling = new THREE.Mesh(ceilingGeometry, shellMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 7.5;

    const floor = new THREE.Mesh(floorGeometry, floorShellMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    floor.receiveShadow = true;

    this.architectureRoot.add(
      backWallLeft,
      backWallRight,
      backWallHeader,
      leftWall,
      rightWall,
      ceiling,
      floor
    );

    const platformGeometry = this.trackGeometry(
      new THREE.CylinderGeometry(1.45, 1.52, 0.18, 96)
    );
    const platformMaterial = this.trackMaterial(
      new THREE.MeshPhysicalMaterial({
        color: 0x08090a,
        roughness: 0.24,
        metalness: 0.46,
        clearcoat: 0.85,
        clearcoatRoughness: 0.14,
        transparent: true,
        opacity: 1,
      })
    );
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.set(0, 0.1, 0.6);
    platform.receiveShadow = true;
    this.architectureRoot.add(platform);

    const ringGeometry = this.trackGeometry(new THREE.RingGeometry(1.55, 1.59, 128));
    const ringMaterial = this.trackMaterial(
      new THREE.MeshBasicMaterial({
        color: 0xd6ad66,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    const lightRing = new THREE.Mesh(ringGeometry, ringMaterial);
    lightRing.rotation.x = -Math.PI / 2;
    lightRing.position.set(0, 0.205, 0.6);
    lightRing.visible = false;
    this.architectureRoot.add(lightRing);

    const edgeLightMaterial = this.trackMaterial(
      new THREE.MeshBasicMaterial({
        color: 0xc49758,
        transparent: true,
        opacity: 0.22,
        toneMapped: false,
      })
    );
    const sideStripGeometry = this.trackGeometry(new THREE.BoxGeometry(0.035, 0.025, 10.5));
    const backStripGeometry = this.trackGeometry(new THREE.BoxGeometry(15.7, 0.025, 0.035));

    const leftStrip = new THREE.Mesh(sideStripGeometry, edgeLightMaterial);
    leftStrip.position.set(-7.85, 0.05, -0.2);
    const rightStrip = new THREE.Mesh(sideStripGeometry, edgeLightMaterial);
    rightStrip.position.set(7.85, 0.05, -0.2);
    const backStrip = new THREE.Mesh(backStripGeometry, edgeLightMaterial);
    backStrip.position.set(0, 0.05, -5.86);
    this.architectureRoot.add(leftStrip, rightStrip, backStrip);

    const roomDetails = this.createProjectionRoomDetails();

    const hemisphere = new THREE.HemisphereLight(0x76838d, 0x020203, 0.28);
    const centralSpot = new THREE.SpotLight(
      0xe8d4af,
      3.1,
      18,
      Math.PI / 5,
      0.58,
      1.5
    );
    centralSpot.position.set(0, 7, 2.2);
    centralSpot.target.position.set(0, 0.4, 0.5);
    centralSpot.castShadow = true;
    centralSpot.shadow.mapSize.set(1024, 1024);

    const warmFill = new THREE.PointLight(0xc89f67, 0.7, 15, 2);
    warmFill.position.set(0, 4.2, -3.8);

    this.scene.add(hemisphere, centralSpot, centralSpot.target, warmFill);

    return {
      platform,
      lightRing,
      edgeLightMaterial,
      technicalCeilingMaterial: roomDetails.technicalCeilingMaterial,
      technicalLensMaterial: roomDetails.technicalLensMaterial,
      structuralDetailMaterial: roomDetails.structuralDetailMaterial,
      projectionGlowLights: roomDetails.projectionGlowLights,
      hemisphere,
      centralSpot,
      warmFill,
    };
  }

  private createProjectionRoomDetails(): {
    technicalCeilingMaterial: THREE.MeshStandardMaterial;
    technicalLensMaterial: THREE.MeshBasicMaterial;
    structuralDetailMaterial: THREE.MeshBasicMaterial;
    projectionGlowLights: readonly {
      light: THREE.PointLight;
      factor: number;
    }[];
  } {
    const technicalCeilingMaterial = this.trackMaterial(
      new THREE.MeshStandardMaterial({
        color: 0x080a0b,
        roughness: 0.58,
        metalness: 0.56,
        transparent: true,
        opacity: 0,
      })
    );
    const technicalLensMaterial = this.trackMaterial(
      new THREE.MeshBasicMaterial({
        color: 0xf3dfb9,
        transparent: true,
        opacity: 0,
        toneMapped: false,
      })
    );
    const structuralDetailMaterial = this.trackMaterial(
      new THREE.MeshBasicMaterial({
        color: 0x8d826f,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        toneMapped: false,
      })
    );

    const railGeometry = this.trackGeometry(
      new THREE.BoxGeometry(14.4, 0.055, 0.055)
    );
    const projectorGeometry = this.trackGeometry(
      new THREE.BoxGeometry(0.54, 0.25, 0.7)
    );
    const mountGeometry = this.trackGeometry(
      new THREE.CylinderGeometry(0.035, 0.035, 0.28, 12)
    );
    const lensGeometry = this.trackGeometry(
      new THREE.CylinderGeometry(0.105, 0.085, 0.13, 20)
    );
    const fixtureGeometry = this.trackGeometry(
      new THREE.CylinderGeometry(0.13, 0.18, 0.28, 20)
    );

    const railPositions = [-4.45, -1.55, 1.35, 4.25] as const;

    for (const z of railPositions) {
      const rail = new THREE.Mesh(railGeometry, technicalCeilingMaterial);
      rail.position.set(0, 7.23, z);
      this.technicalCeilingRoot.add(rail);
    }

    const projectorPositions = [
      [-4.65, -4.45],
      [0, -4.45],
      [4.65, -4.45],
      [-2.35, -1.55],
      [2.35, -1.55],
      [0, 1.35],
    ] as const;

    for (const [x, z] of projectorPositions) {
      const mount = new THREE.Mesh(mountGeometry, technicalCeilingMaterial);
      mount.position.set(x, 7.05, z);
      const body = new THREE.Mesh(projectorGeometry, technicalCeilingMaterial);
      body.position.set(x, 6.84, z);
      const lens = new THREE.Mesh(lensGeometry, technicalLensMaterial);
      lens.position.set(x, 6.65, z);
      this.technicalCeilingRoot.add(mount, body, lens);
    }

    const fixturePositions = [
      [-6.2, -1.55],
      [-3.1, 1.35],
      [3.1, 1.35],
      [6.2, -1.55],
      [-5.1, 4.25],
      [0, 4.25],
      [5.1, 4.25],
    ] as const;

    for (const [x, z] of fixturePositions) {
      const fixture = new THREE.Mesh(
        fixtureGeometry,
        technicalCeilingMaterial
      );
      fixture.position.set(x, 7.02, z);
      const lens = new THREE.Mesh(lensGeometry, technicalLensMaterial);
      lens.position.set(x, 6.83, z);
      this.technicalCeilingRoot.add(fixture, lens);
    }

    const floorSeamXGeometry = this.trackGeometry(
      new THREE.BoxGeometry(0.012, 0.008, 11.72)
    );
    const floorSeamZGeometry = this.trackGeometry(
      new THREE.BoxGeometry(15.72, 0.008, 0.012)
    );

    for (let index = -3; index <= 3; index += 1) {
      const seam = new THREE.Mesh(
        floorSeamXGeometry,
        structuralDetailMaterial
      );
      seam.position.set(index * 2.25, 0.052, 0);
      this.structuralDetailRoot.add(seam);
    }

    for (let index = -2; index <= 2; index += 1) {
      const seam = new THREE.Mesh(
        floorSeamZGeometry,
        structuralDetailMaterial
      );
      seam.position.set(0, 0.052, index * 2.28);
      this.structuralDetailRoot.add(seam);
    }

    this.architectureRoot.add(
      this.technicalCeilingRoot,
      this.structuralDetailRoot
    );

    const projectionGlowLights = [
      {
        light: new THREE.PointLight(0xf2eadc, 0, 7.5, 2),
        factor: 0.72,
      },
      {
        light: new THREE.PointLight(0xf2eadc, 0, 7.5, 2),
        factor: 0.72,
      },
      {
        light: new THREE.PointLight(0xd9c39d, 0, 8.5, 2),
        factor: 1,
      },
    ] as const;

    projectionGlowLights[0].light.position.set(-6.8, 1.15, -1.8);
    projectionGlowLights[1].light.position.set(6.8, 1.15, -1.8);
    projectionGlowLights[2].light.position.set(0, 1.25, -4.9);

    for (const glow of projectionGlowLights) {
      this.scene.add(glow.light);
    }

    return {
      technicalCeilingMaterial,
      technicalLensMaterial,
      structuralDetailMaterial,
      projectionGlowLights,
    };
  }

  private registerSurfaces(): void {
    const definitions: readonly SurfaceDefinition[] = [
      {
        id: "LEFT",
        width: 12,
        height: 7.36,
        position: [-7.875, 3.75, 0],
        rotation: [0, Math.PI / 2, 0],
        material: { color: 0x090b0d, roughness: 0.86, metalness: 0.01 },
      },
      {
        id: "BACK",
        width: 15.74,
        height: 7.36,
        position: [0, 3.75, -5.875],
        material: { color: 0x090b0d, roughness: 0.86, metalness: 0.01 },
      },
      {
        id: "RIGHT",
        width: 12,
        height: 7.36,
        position: [7.875, 3.75, 0],
        rotation: [0, -Math.PI / 2, 0],
        material: { color: 0x090b0d, roughness: 0.86, metalness: 0.01 },
      },
      {
        id: "FLOOR",
        width: 16,
        height: 12,
        position: [0, 0.018, 0],
        rotation: [-Math.PI / 2, 0, 0],
        material: {
          color: 0x050607,
          roughness: 0.16,
          metalness: 0.34,
          clearcoat: 0.9,
          clearcoatRoughness: 0.14,
        },
      },
      {
        id: "CEILING",
        width: 16,
        height: 12,
        position: [0, 7.48, 0],
        rotation: [Math.PI / 2, 0, 0],
        material: { color: 0x030405, roughness: 0.98, metalness: 0 },
      },
      {
        id: "FREE_SCREEN_LEFT",
        width: 4.05,
        height: 2.28,
        position: [-7.69, 3.28, -0.35],
        rotation: [0, Math.PI / 2, 0],
        frame: { enabled: true, border: 0.13, depth: 0.075, color: 0x0e1012 },
        doubleSided: true,
        kineticLight: {
          color: 0xd4ad6d,
          intensity: 0.16,
          distance: 4.2,
        },
      },
      {
        id: "FREE_SCREEN_BACK_A",
        width: 4.45,
        height: 2.5,
        position: [-2.43, 3.36, -5.7],
        frame: { enabled: true, border: 0.13, depth: 0.075, color: 0x0e1012 },
        doubleSided: true,
        kineticLight: {
          color: 0xd4ad6d,
          intensity: 0.14,
          distance: 4.4,
        },
      },
      {
        id: "FREE_SCREEN_BACK_B",
        width: 4.45,
        height: 2.5,
        position: [2.43, 3.36, -5.7],
        frame: { enabled: true, border: 0.13, depth: 0.075, color: 0x0e1012 },
        doubleSided: true,
        kineticLight: {
          color: 0xd4ad6d,
          intensity: 0.14,
          distance: 4.4,
        },
      },
      {
        id: "FREE_SCREEN_RIGHT",
        width: 4.05,
        height: 2.28,
        position: [7.69, 3.28, -0.35],
        rotation: [0, -Math.PI / 2, 0],
        frame: { enabled: true, border: 0.13, depth: 0.075, color: 0x0e1012 },
        doubleSided: true,
        kineticLight: {
          color: 0xd4ad6d,
          intensity: 0.16,
          distance: 4.2,
        },
      },
      {
        id: "FREE_SCREEN_PASSAGE_LEFT",
        width: 12.4,
        height: 5.45,
        position: [-3.64, 2.75, -12.2],
        rotation: [0, Math.PI / 2, 0],
        baseVisible: false,
        renderOrder: 4,
      },
      {
        id: "FREE_SCREEN_PASSAGE_BACK",
        width: 7.18,
        height: 5.45,
        position: [0, 2.75, -18.48],
        baseVisible: false,
        renderOrder: 4,
      },
      {
        id: "FREE_SCREEN_PASSAGE_RIGHT",
        width: 12.4,
        height: 5.45,
        position: [3.64, 2.75, -12.2],
        rotation: [0, -Math.PI / 2, 0],
        baseVisible: false,
        renderOrder: 4,
      },
      {
        id: "FREE_SCREEN_PASSAGE_FLOOR",
        width: 7.18,
        height: 12.4,
        position: [0, 0.045, -12.2],
        rotation: [-Math.PI / 2, 0, 0],
        baseVisible: false,
        renderOrder: 3,
      },
      {
        id: "FREE_SCREEN_PASSAGE_CEILING",
        width: 7.18,
        height: 12.4,
        position: [0, 5.635, -12.2],
        rotation: [Math.PI / 2, 0, 0],
        baseVisible: false,
        renderOrder: 3,
      },
    ];

    for (const definition of definitions) {
      this.surfaceManager.register(definition);
    }

    const humanSurfaces: readonly SurfaceDefinition[] = [
      {
        id: "HUMAN_LAYER",
        width: 2.35,
        height: 3.55,
        position: [0, 1.92, 0.62],
        baseVisible: false,
        renderOrder: 22,
      },
      {
        id: "HUMAN_DUPLICATE_LEFT",
        width: 2.35,
        height: 3.55,
        position: [-2.15, 1.86, -0.34],
        baseVisible: false,
        renderOrder: 20,
      },
      {
        id: "HUMAN_DUPLICATE_RIGHT",
        width: 2.35,
        height: 3.55,
        position: [2.15, 1.86, -0.34],
        baseVisible: false,
        renderOrder: 21,
      },
    ];

    for (const definition of humanSurfaces) {
      this.surfaceManager.register(definition, this.layers.HUMAN_LAYER);
    }
  }

  private readonly animate = (): void => {
    if (!this.running || this.disposed) {
      return;
    }

    const deltaTime = Math.min(this.clock.getDelta(), 0.1);
    const elapsedTime = this.clock.elapsedTime;

    if (this.humanCompositor.update(deltaTime)) {
      this.mediaManager.update();
    }
    this.experienceDirector.update(elapsedTime, deltaTime);
    this.renderer.render(this.scene, this.camera);
    this.scheduleNextFrame();
  };

  private scheduleNextFrame(): void {
    this.animationFrame = requestAnimationFrame(this.animate);
  }

  private readonly handleResize = (): void => {
    if (this.disposed) {
      return;
    }

    const width = Math.max(this.mount.clientWidth, 1);
    const height = Math.max(this.mount.clientHeight, 1);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  };

  private trackGeometry<T extends THREE.BufferGeometry>(geometry: T): T {
    this.architectureGeometries.add(geometry);
    return geometry;
  }

  private trackMaterial<T extends THREE.Material>(material: T): T {
    this.architectureMaterials.add(material);
    return material;
  }
}
