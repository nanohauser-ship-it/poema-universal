"use client";

import { useEffect, useRef, useState } from "react";

import { SceneEngine } from "../engine/SceneEngine";
import type { ArchitectureDirectorState } from "../scenography/schema";
import {
  createThematicJourney,
  type ThematicJourneyPlan,
  type ThematicZoneId,
} from "../scenography/thematicJourney";
import {
  deleteImmersivePreset,
  listImmersivePresets,
  loadImmersivePreset,
  saveImmersivePreset,
  type ImmersivePreset,
  type ImmersivePresetSummary,
  type ImmersiveTextureSettings,
} from "../persistence/ImmersivePresetStore";
import type {
  BorderlessStageId,
  HumanCutoutStatus,
  HumanPresencePreset,
  MediaContent,
  SceneMode,
  SurfaceId,
  SurfaceKey,
  TextureTransformConfiguration,
  WebcamStatus,
} from "../types/audiovisual";
import { BorderlessControls } from "./BorderlessControls";
import { ImmersiveMediaControls } from "./ImmersiveMediaControls";
import { LabControls } from "./LabControls";
import { PerformanceControls } from "./PerformanceControls";
import { ScenographyStatus } from "./ScenographyStatus";

const SURFACE_IDS: readonly SurfaceId[] = [
  "LEFT",
  "BACK",
  "RIGHT",
  "FLOOR",
  "CEILING",
];

const PASSAGE_SURFACES: Readonly<Record<SurfaceId, SurfaceKey>> = {
  LEFT: "FREE_SCREEN_PASSAGE_LEFT",
  BACK: "FREE_SCREEN_PASSAGE_BACK",
  RIGHT: "FREE_SCREEN_PASSAGE_RIGHT",
  FLOOR: "FREE_SCREEN_PASSAGE_FLOOR",
  CEILING: "FREE_SCREEN_PASSAGE_CEILING",
};

const ARCHITECTURE_MEDIA_SLOTS: Readonly<Record<SurfaceId, string>> = {
  LEFT: "WALL_LEFT",
  BACK: "WALL_PRIMARY",
  RIGHT: "WALL_RIGHT",
  FLOOR: "FLOOR_PRIMARY",
  CEILING: "CEILING_PRIMARY",
};

const EMPTY_VIDEO_NAMES: Record<SurfaceId, string | null> = {
  LEFT: null,
  BACK: null,
  RIGHT: null,
  FLOOR: null,
  CEILING: null,
};

const DEFAULT_TEXTURE: ImmersiveTextureSettings = {
  offsetX: 0,
  offsetY: 0,
  repeatX: 1,
  repeatY: 1,
  rotation: 0,
  mirrorX: false,
  mirrorY: false,
};

const PANORAMA_TEXTURES: Readonly<
  Pick<Record<SurfaceId, ImmersiveTextureSettings>, "LEFT" | "BACK" | "RIGHT">
> = {
  LEFT: {
    ...DEFAULT_TEXTURE,
    offsetX: 0,
    offsetY: 0.228,
    repeatX: 0.302,
    repeatY: 0.544,
  },
  BACK: {
    ...DEFAULT_TEXTURE,
    offsetX: 0.302,
    offsetY: 0.228,
    repeatX: 0.397,
    repeatY: 0.544,
  },
  RIGHT: {
    ...DEFAULT_TEXTURE,
    offsetX: 0.699,
    offsetY: 0.228,
    repeatX: 0.301,
    repeatY: 0.544,
  },
};

const INITIAL_ARCHITECTURE_STATE: ArchitectureDirectorState = {
  status: "idle",
  source: null,
  experienceId: null,
  instanceId: null,
  seed: null,
  archetype: null,
};

function createDefaultTextureSettings(): Record<
  SurfaceId,
  ImmersiveTextureSettings
> {
  return {
    LEFT: { ...DEFAULT_TEXTURE },
    BACK: { ...DEFAULT_TEXTURE },
    RIGHT: { ...DEFAULT_TEXTURE },
    FLOOR: { ...DEFAULT_TEXTURE },
    CEILING: { ...DEFAULT_TEXTURE },
  };
}

function toTextureTransform(
  settings: ImmersiveTextureSettings
): TextureTransformConfiguration {
  return {
    offset: [settings.offsetX, settings.offsetY],
    repeat: [settings.repeatX, settings.repeatY],
    center: [0.5, 0.5],
    rotation: (settings.rotation * Math.PI) / 180,
    mirrorX: settings.mirrorX,
    mirrorY: settings.mirrorY,
  };
}

function projectableKind(file: Pick<File, "type">): "IMAGE" | "VIDEO" {
  return file.type.startsWith("image/") ? "IMAGE" : "VIDEO";
}

export default function AudiovisualLab3D() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<SceneEngine | null>(null);
  const webcamRequestRef = useRef(0);
  const cutoutRequestRef = useRef(0);
  const journeyRequestRef = useRef(0);
  const surfaceVideoUrlsRef = useRef(new Map<SurfaceId, string>());
  const surfaceFilesRef = useRef(new Map<SurfaceId, File>());
  const presetRequestRef = useRef(0);
  const [mode, setMode] = useState<SceneMode>("gallery");
  const [webcamStatus, setWebcamStatus] = useState<WebcamStatus>("idle");
  const [cutoutStatus, setCutoutStatus] =
    useState<HumanCutoutStatus>("idle");
  const [humanPreset, setHumanPreset] =
    useState<HumanPresencePreset>("PRESENCE");
  const [borderlessStage, setBorderlessStage] =
    useState<BorderlessStageId>("ROOM");
  const [surfaceVideoNames, setSurfaceVideoNames] = useState<
    Record<SurfaceId, string | null>
  >({ ...EMPTY_VIDEO_NAMES });
  const [surfaceTextureSettings, setSurfaceTextureSettings] = useState<
    Record<SurfaceId, ImmersiveTextureSettings>
  >(createDefaultTextureSettings);
  const [immersivePresets, setImmersivePresets] = useState<
    ImmersivePresetSummary[]
  >([]);
  const [selectedPresetId, setSelectedPresetId] = useState("");
  const [storageMessage, setStorageMessage] = useState("");
  const [architectureState, setArchitectureState] =
    useState<ArchitectureDirectorState>(INITIAL_ARCHITECTURE_STATE);
  const [theme, setTheme] = useState("");
  const [intention, setIntention] = useState("");
  const [journey, setJourney] = useState<ThematicJourneyPlan | null>(null);
  const [activeZoneId, setActiveZoneId] =
    useState<ThematicZoneId | null>(null);
  const [journeyMessage, setJourneyMessage] = useState("");

  useEffect(() => {
    const mount = containerRef.current;

    if (!mount) {
      return;
    }

    const engine = new SceneEngine(mount);
    const surfaceVideoUrls = surfaceVideoUrlsRef.current;
    const surfaceFiles = surfaceFilesRef.current;
    engineRef.current = engine;
    const unsubscribeArchitecture = engine.subscribeArchitectureState(
      setArchitectureState
    );
    engine.start("gallery");

    return () => {
      webcamRequestRef.current += 1;
      cutoutRequestRef.current += 1;
      journeyRequestRef.current += 1;
      unsubscribeArchitecture();
      engine.dispose();

      for (const url of new Set(surfaceVideoUrls.values())) {
        URL.revokeObjectURL(url);
      }

      surfaceVideoUrls.clear();
      surfaceFiles.clear();

      if (engineRef.current === engine) {
        engineRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let active = true;

    void listImmersivePresets()
      .then((presets) => {
        if (active) {
          setImmersivePresets(presets);
        }
      })
      .catch(() => {
        if (active) {
          setStorageMessage("El archivo local no está disponible");
        }
      });

    return () => {
      active = false;
      presetRequestRef.current += 1;
    };
  }, []);

  const changeMode = (nextMode: SceneMode): void => {
    if (nextMode !== "performance") {
      webcamRequestRef.current += 1;
      cutoutRequestRef.current += 1;
      setWebcamStatus("idle");
      setCutoutStatus("idle");
      setHumanPreset("PRESENCE");
    }

    setBorderlessStage("ROOM");
    setMode(nextMode);
    engineRef.current?.setExperience(nextMode);
  };

  const enableWebcam = async (): Promise<void> => {
    const engine = engineRef.current;

    if (!engine) {
      setWebcamStatus("error");
      return;
    }

    const requestId = ++webcamRequestRef.current;
    cutoutRequestRef.current += 1;
    setCutoutStatus("idle");
    setWebcamStatus("requesting");
    const status = await engine.enableWebcam();

    if (webcamRequestRef.current === requestId) {
      setWebcamStatus(status);
    }
  };

  const disableWebcam = (): void => {
    webcamRequestRef.current += 1;
    cutoutRequestRef.current += 1;
    engineRef.current?.disableWebcam();
    setWebcamStatus("idle");
    setCutoutStatus("idle");
  };

  const enableSemanticCutout = async (): Promise<void> => {
    const engine = engineRef.current;

    if (!engine) {
      setCutoutStatus("error");
      return;
    }

    const requestId = ++cutoutRequestRef.current;
    setCutoutStatus("loading");
    const status = await engine.enableHumanSegmentation();

    if (cutoutRequestRef.current === requestId) {
      setCutoutStatus(status);
    }
  };

  const disableCutout = (): void => {
    cutoutRequestRef.current += 1;
    engineRef.current?.disableHumanCutout();
    setCutoutStatus("idle");
  };

  const changeHumanPreset = (preset: HumanPresencePreset): void => {
    setHumanPreset(preset);
    engineRef.current?.setHumanPreset(preset);
  };

  const changeBorderlessStage = (stage: BorderlessStageId): void => {
    if (engineRef.current?.setBorderlessStage(stage)) {
      setBorderlessStage(stage);
    }
  };

  const activateJourneyZone = async (
    plan: ThematicJourneyPlan,
    zoneId: ThematicZoneId
  ): Promise<void> => {
    const engine = engineRef.current;
    const zone = plan.zones.find((candidate) => candidate.id === zoneId);

    if (!engine || !zone) {
      return;
    }

    const requestId = ++journeyRequestRef.current;
    setActiveZoneId(zone.id);
    setJourneyMessage(`Diseñando ${zone.label.toLowerCase()}…`);
    const blueprint = await engine.createThematicTake(
      plan.id,
      plan.theme,
      plan.intention,
      plan.performerRequired,
      zone
    );

    if (requestId === journeyRequestRef.current) {
      setJourneyMessage(
        blueprint
          ? `${zone.label} listo · ${zone.narrativeRole}`
          : "No se pudo construir esta zona"
      );
    }
  };

  const generateThematicJourney = (): void => {
    const plan = createThematicJourney({
      theme,
      intention,
      performerRequired: true,
    });
    const firstZone = plan.zones[0];

    setJourney(plan);

    if (firstZone) {
      void activateJourneyZone(plan, firstZone.id);
    }
  };

  const changeJourneyZone = (zoneId: ThematicZoneId): void => {
    if (journey) {
      void activateJourneyZone(journey, zoneId);
    }
  };

  const setSurfaceMediaOnEngine = (
    engine: SceneEngine,
    surface: SurfaceId,
    source: string,
    settings: ImmersiveTextureSettings,
    kind: "IMAGE" | "VIDEO"
  ): void => {
    const content: MediaContent = {
      kind,
      src: source,
      texture: toTextureTransform(settings),
    };

    engine.setExperienceSurfaceMedia("immersive", surface, content);
    engine.setExperienceSurfaceMedia(
      "immersive",
      PASSAGE_SURFACES[surface],
      content
    );
    engine.setArchitectureMediaSlot(
      ARCHITECTURE_MEDIA_SLOTS[surface],
      content
    );
  };

  const applySurfaceMediaWithSettings = (
    surface: SurfaceId,
    file: File,
    settings: ImmersiveTextureSettings,
    sharedUrl?: string
  ): void => {
    const engine = engineRef.current;

    if (!engine) {
      return;
    }

    const nextUrl = sharedUrl ?? URL.createObjectURL(file);
    const previousUrl = surfaceVideoUrlsRef.current.get(surface);

    surfaceVideoUrlsRef.current.set(surface, nextUrl);
    surfaceFilesRef.current.set(surface, file);
    setSurfaceMediaOnEngine(
      engine,
      surface,
      nextUrl,
      settings,
      projectableKind(file)
    );
    setSurfaceVideoNames((current) => ({
      ...current,
      [surface]: file.name,
    }));

    if (
      previousUrl &&
      ![...surfaceVideoUrlsRef.current.values()].includes(previousUrl)
    ) {
      URL.revokeObjectURL(previousUrl);
    }
  };

  const applySurfaceMedia = (surface: SurfaceId, file: File): void => {
    applySurfaceMediaWithSettings(
      surface,
      file,
      surfaceTextureSettings[surface]
    );
  };

  const applyPanoramicMedia = (file: File): void => {
    if (!engineRef.current) {
      return;
    }

    const sharedUrl = URL.createObjectURL(file);

    for (const surface of ["LEFT", "BACK", "RIGHT"] as const) {
      applySurfaceMediaWithSettings(
        surface,
        file,
        PANORAMA_TEXTURES[surface],
        sharedUrl
      );
    }

    setSurfaceTextureSettings((current) => ({
      ...current,
      LEFT: { ...PANORAMA_TEXTURES.LEFT },
      BACK: { ...PANORAMA_TEXTURES.BACK },
      RIGHT: { ...PANORAMA_TEXTURES.RIGHT },
    }));
  };

  const resetSurfaceVideo = (surface: SurfaceId): void => {
    const previousUrl = surfaceVideoUrlsRef.current.get(surface);

    engineRef.current?.setExperienceSurfaceMedia("immersive", surface, null);
    engineRef.current?.setExperienceSurfaceMedia(
      "immersive",
      PASSAGE_SURFACES[surface],
      null
    );
    engineRef.current?.setArchitectureMediaSlot(
      ARCHITECTURE_MEDIA_SLOTS[surface],
      null
    );
    surfaceVideoUrlsRef.current.delete(surface);
    surfaceFilesRef.current.delete(surface);
    setSurfaceVideoNames((current) => ({
      ...current,
      [surface]: null,
    }));
    setSurfaceTextureSettings((current) => ({
      ...current,
      [surface]: { ...DEFAULT_TEXTURE },
    }));

    if (
      previousUrl &&
      ![...surfaceVideoUrlsRef.current.values()].includes(previousUrl)
    ) {
      URL.revokeObjectURL(previousUrl);
    }
  };

  const resetAllSurfaceVideos = (): void => {
    for (const surface of SURFACE_IDS) {
      engineRef.current?.setExperienceSurfaceMedia("immersive", surface, null);
      engineRef.current?.setExperienceSurfaceMedia(
        "immersive",
        PASSAGE_SURFACES[surface],
        null
      );
      engineRef.current?.setArchitectureMediaSlot(
        ARCHITECTURE_MEDIA_SLOTS[surface],
        null
      );
    }

    for (const url of new Set(surfaceVideoUrlsRef.current.values())) {
      URL.revokeObjectURL(url);
    }

    surfaceVideoUrlsRef.current.clear();
    surfaceFilesRef.current.clear();
    setSurfaceVideoNames({ ...EMPTY_VIDEO_NAMES });
    setSurfaceTextureSettings(createDefaultTextureSettings());
  };

  const changeSurfaceTexture = (
    surface: SurfaceId,
    settings: ImmersiveTextureSettings
  ): void => {
    const source = surfaceVideoUrlsRef.current.get(surface);
    const file = surfaceFilesRef.current.get(surface);
    const engine = engineRef.current;

    setSurfaceTextureSettings((current) => ({
      ...current,
      [surface]: { ...settings },
    }));

    if (source && file && engine) {
      setSurfaceMediaOnEngine(
        engine,
        surface,
        source,
        settings,
        projectableKind(file)
      );
    }
  };

  const saveCurrentImmersivePreset = async (name: string): Promise<void> => {
    const id = crypto.randomUUID();
    const createSurface = (surface: SurfaceId) => {
      const file = surfaceFilesRef.current.get(surface);

      return {
        fileName: file?.name ?? null,
        mimeType: file?.type ?? null,
        texture: { ...surfaceTextureSettings[surface] },
        media: file,
      };
    };
    const preset: ImmersivePreset = {
      id,
      name,
      createdAt: Date.now(),
      theme: theme.trim() || undefined,
      intention: intention.trim() || undefined,
      journey: journey ?? undefined,
      activeZoneId: activeZoneId ?? undefined,
      surfaces: {
        LEFT: createSurface("LEFT"),
        BACK: createSurface("BACK"),
        RIGHT: createSurface("RIGHT"),
        FLOOR: createSurface("FLOOR"),
        CEILING: createSurface("CEILING"),
      },
    };

    setStorageMessage("Guardando experiencia…");

    try {
      await saveImmersivePreset(preset);
      const presets = await listImmersivePresets();
      setImmersivePresets(presets);
      setSelectedPresetId(id);
      setStorageMessage("Experiencia guardada en este dispositivo");
    } catch {
      setStorageMessage("No hay espacio suficiente para guardar los vídeos");
    }
  };

  const loadSelectedImmersivePreset = async (): Promise<void> => {
    const engine = engineRef.current;

    if (!selectedPresetId || !engine) {
      return;
    }

    const requestId = ++presetRequestRef.current;
    const createdUrls = new Map<SurfaceId, string>();
    const loadedFiles = new Map<SurfaceId, File>();
    const nextNames: Record<SurfaceId, string | null> = {
      ...EMPTY_VIDEO_NAMES,
    };
    const nextSettings = createDefaultTextureSettings();

    setStorageMessage("Cargando experiencia…");

    try {
      const preset = await loadImmersivePreset(selectedPresetId);

      if (!preset || requestId !== presetRequestRef.current) {
        setStorageMessage(preset ? "" : "La experiencia ya no existe");
        return;
      }

      if (preset.journey) {
        const zone =
          preset.journey.zones.find(
            (candidate) => candidate.id === preset.activeZoneId
          ) ?? preset.journey.zones[0];

        setTheme(preset.theme ?? preset.journey.theme);
        setIntention(preset.intention ?? preset.journey.intention);
        setJourney(preset.journey);
        setActiveZoneId(zone?.id ?? null);

        if (zone) {
          await engine.createThematicTake(
            preset.journey.id,
            preset.journey.theme,
            preset.journey.intention,
            preset.journey.performerRequired,
            zone
          );

          if (requestId !== presetRequestRef.current) {
            return;
          }
        }
      }

      for (const surface of SURFACE_IDS) {
        const stored = preset.surfaces[surface];
        const storedMedia = stored.media ?? stored.video;
        nextSettings[surface] = { ...stored.texture };

        if (storedMedia && stored.fileName) {
          const file = new File([storedMedia], stored.fileName, {
            type: stored.mimeType ?? storedMedia.type,
          });
          const url = URL.createObjectURL(file);
          createdUrls.set(surface, url);
          loadedFiles.set(surface, file);
          nextNames[surface] = stored.fileName;
          setSurfaceMediaOnEngine(
            engine,
            surface,
            url,
            stored.texture,
            projectableKind(file)
          );
        } else {
          engine.setExperienceSurfaceMedia("immersive", surface, null);
          engine.setExperienceSurfaceMedia(
            "immersive",
            PASSAGE_SURFACES[surface],
            null
          );
          engine.setArchitectureMediaSlot(
            ARCHITECTURE_MEDIA_SLOTS[surface],
            null
          );
        }
      }

      for (const url of new Set(surfaceVideoUrlsRef.current.values())) {
        URL.revokeObjectURL(url);
      }

      surfaceVideoUrlsRef.current.clear();
      surfaceFilesRef.current.clear();

      for (const [surface, url] of createdUrls) {
        surfaceVideoUrlsRef.current.set(surface, url);
      }

      for (const [surface, file] of loadedFiles) {
        surfaceFilesRef.current.set(surface, file);
      }

      setSurfaceVideoNames(nextNames);
      setSurfaceTextureSettings(nextSettings);
      setStorageMessage(`Experiencia cargada · ${preset.name}`);
    } catch {
      for (const url of createdUrls.values()) {
        URL.revokeObjectURL(url);
      }

      setStorageMessage("No se pudo cargar la experiencia");
    }
  };

  const deleteSelectedImmersivePreset = async (): Promise<void> => {
    if (!selectedPresetId) {
      return;
    }

    try {
      await deleteImmersivePreset(selectedPresetId);
      setImmersivePresets(await listImmersivePresets());
      setSelectedPresetId("");
      setStorageMessage("Experiencia eliminada del dispositivo");
    } catch {
      setStorageMessage("No se pudo eliminar la experiencia");
    }
  };

  return (
    <section className="relative h-screen min-h-[720px] overflow-hidden bg-black text-white">
      <div ref={containerRef} className="absolute inset-0" />

      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-6 sm:p-8">
        <div>
          <p className="text-[8px] uppercase tracking-[0.46em] text-[#d4ad6d]">
            Poema Universal
          </p>
          <h1 className="mt-3 font-serif text-3xl tracking-[-0.04em] sm:text-5xl">
            Sala Madre
          </h1>
          <p className="mt-3 text-[8px] uppercase tracking-[0.26em] text-white/30">
            Arquitectura audiovisual
          </p>
        </div>

        <p className="text-[7px] uppercase tracking-[0.24em] text-white/30">
          Arrastra para mirar
        </p>
      </header>

      <PerformanceControls
        mode={mode}
        webcamStatus={webcamStatus}
        cutoutStatus={cutoutStatus}
        humanPreset={humanPreset}
        onEnableWebcam={() => void enableWebcam()}
        onDisableWebcam={disableWebcam}
        onEnableSemanticCutout={() => void enableSemanticCutout()}
        onDisableCutout={disableCutout}
        onHumanPresetChange={changeHumanPreset}
      />

      <ScenographyStatus
        state={architectureState}
        visible={mode === "immersive"}
        onRegenerate={() => void engineRef.current?.regenerateArchitecture()}
      />

      <BorderlessControls
        mode={mode}
        stage={borderlessStage}
        onStageChange={changeBorderlessStage}
      />

      <ImmersiveMediaControls
        mode={mode}
        fileNames={surfaceVideoNames}
        textureSettings={surfaceTextureSettings}
        presets={immersivePresets}
        selectedPresetId={selectedPresetId}
        storageMessage={storageMessage}
        theme={theme}
        intention={intention}
        journey={journey}
        activeZoneId={activeZoneId}
        journeyMessage={journeyMessage}
        onSelect={applySurfaceMedia}
        onSelectPanorama={applyPanoramicMedia}
        onReset={resetSurfaceVideo}
        onResetAll={resetAllSurfaceVideos}
        onTextureChange={changeSurfaceTexture}
        onPresetSelectionChange={setSelectedPresetId}
        onSavePreset={(name) => void saveCurrentImmersivePreset(name)}
        onLoadPreset={() => void loadSelectedImmersivePreset()}
        onDeletePreset={() => void deleteSelectedImmersivePreset()}
        onThemeChange={setTheme}
        onIntentionChange={setIntention}
        onGenerateJourney={generateThematicJourney}
        onZoneChange={changeJourneyZone}
      />

      <LabControls mode={mode} onModeChange={changeMode} />
    </section>
  );
}
