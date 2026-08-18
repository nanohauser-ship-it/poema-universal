import {
  ARCHITECTURAL_MATERIALS,
  ARCHITECTURE_ARCHETYPES,
  ARCHITECTURE_MODULE_TYPES,
  OUTPUT_PROFILE_IDS,
  type ArchitectureBlueprint,
  type ArchitectureModuleBlueprint,
  type CameraAnchorBlueprint,
  type LightBlueprint,
  type MediaSlotDescriptor,
  type OutputProfile,
  type ProjectionSurfaceBlueprint,
  type ScenographyBrief,
  type Vector3Data,
} from "../scenography/schema";

const MAX_MODULES = 30;
const MAX_LIGHTS = 8;
const MAX_SURFACES = 6;
const ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;

export type ArchitectureValidationResult =
  | { ok: true; blueprint: ArchitectureBlueprint }
  | { ok: false; errors: string[] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(
  value: Record<string, unknown>,
  allowed: readonly string[]
): boolean {
  const keys = new Set(allowed);
  return Object.keys(value).every((key) => keys.has(key));
}

function finiteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function safeString(value: unknown, maximumLength = 64): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const text = value.trim();
  return text.length > 0 && text.length <= maximumLength ? text : null;
}

function safeId(value: unknown): string | null {
  const id = safeString(value);
  return id && ID_PATTERN.test(id) ? id : null;
}

function vector3(
  value: unknown,
  minimum: number,
  maximum: number
): Vector3Data | null {
  if (!Array.isArray(value) || value.length !== 3) {
    return null;
  }

  const x = finiteNumber(value[0]);
  const y = finiteNumber(value[1]);
  const z = finiteNumber(value[2]);

  if (x === null || y === null || z === null) {
    return null;
  }

  return [
    clamp(x, minimum, maximum),
    clamp(y, minimum, maximum),
    clamp(z, minimum, maximum),
  ];
}

function parseModule(
  value: unknown,
  errors: string[]
): ArchitectureModuleBlueprint | null {
  if (
    !isRecord(value) ||
    !hasOnlyKeys(value, [
      "id",
      "type",
      "material",
      "position",
      "rotation",
      "dimensions",
      "radius",
      "arc",
      "thickness",
      "opacity",
    ])
  ) {
    errors.push("Módulo desconocido o con campos no permitidos");
    return null;
  }

  const id = safeId(value.id);
  const type = ARCHITECTURE_MODULE_TYPES.find((item) => item === value.type);
  const material = ARCHITECTURAL_MATERIALS.find(
    (item) => item === value.material
  );
  const position = vector3(value.position, -32, 32);
  const rotation = vector3(value.rotation, -Math.PI * 2, Math.PI * 2);
  const dimensions = vector3(value.dimensions, 0.04, 40);

  if (!id || !type || !material || !position || !rotation || !dimensions) {
    errors.push("Módulo inválido");
    return null;
  }

  const radius = finiteNumber(value.radius);
  const arc = finiteNumber(value.arc);
  const thickness = finiteNumber(value.thickness);
  const opacity = finiteNumber(value.opacity);

  return {
    id,
    type,
    material,
    position,
    rotation,
    dimensions,
    ...(radius === null ? {} : { radius: clamp(radius, 0.2, 18) }),
    ...(arc === null ? {} : { arc: clamp(arc, 0.2, Math.PI * 2) }),
    ...(thickness === null
      ? {}
      : { thickness: clamp(thickness, 0.02, 2) }),
    ...(opacity === null ? {} : { opacity: clamp(opacity, 0, 1) }),
  };
}

function parseSurface(
  value: unknown,
  allowedSlots: ReadonlySet<string> | undefined,
  errors: string[]
): ProjectionSurfaceBlueprint | null {
  if (
    !isRecord(value) ||
    !hasOnlyKeys(value, [
      "id",
      "slotId",
      "position",
      "rotation",
      "size",
      "opacity",
    ]) ||
    !Array.isArray(value.size) ||
    value.size.length !== 2
  ) {
    errors.push("Superficie audiovisual inválida");
    return null;
  }

  const id = safeId(value.id);
  const slotId = safeId(value.slotId);
  const position = vector3(value.position, -32, 32);
  const rotation = vector3(value.rotation, -Math.PI * 2, Math.PI * 2);
  const width = finiteNumber(value.size[0]);
  const height = finiteNumber(value.size[1]);
  const opacity = finiteNumber(value.opacity);

  if (
    !id ||
    !slotId ||
    !position ||
    !rotation ||
    width === null ||
    height === null ||
    opacity === null ||
    (allowedSlots && !allowedSlots.has(slotId))
  ) {
    errors.push("Superficie o slot audiovisual no autorizado");
    return null;
  }

  return {
    id,
    slotId,
    position,
    rotation,
    size: [clamp(width, 0.4, 24), clamp(height, 0.4, 14)],
    opacity: clamp(opacity, 0, 1),
  };
}

function parseLight(value: unknown, errors: string[]): LightBlueprint | null {
  if (
    !isRecord(value) ||
    !hasOnlyKeys(value, [
      "id",
      "type",
      "color",
      "intensity",
      "distance",
      "position",
      "target",
      "angle",
    ])
  ) {
    errors.push("Luz inválida o con campos desconocidos");
    return null;
  }

  const id = safeId(value.id);
  const type = ["POINT", "SPOT", "AREA_GLOW"].find(
    (item) => item === value.type
  ) as LightBlueprint["type"] | undefined;
  const color = finiteNumber(value.color);
  const intensity = finiteNumber(value.intensity);
  const distance = finiteNumber(value.distance);
  const position = vector3(value.position, -32, 32);
  const target = value.target === undefined ? undefined : vector3(value.target, -32, 32);
  const angle = finiteNumber(value.angle);

  if (!id || !type || color === null || intensity === null || distance === null || !position) {
    errors.push("Parámetros de luz inválidos");
    return null;
  }

  return {
    id,
    type,
    color: Math.round(clamp(color, 0, 0xffffff)),
    intensity: clamp(intensity, 0, 12),
    distance: clamp(distance, 1, 50),
    position,
    ...(target ? { target } : {}),
    ...(angle === null ? {} : { angle: clamp(angle, 0.08, Math.PI / 2) }),
  };
}

function parseCameraAnchor(
  value: unknown,
  errors: string[]
): CameraAnchorBlueprint | null {
  if (
    !isRecord(value) ||
    !hasOnlyKeys(value, [
      "id",
      "position",
      "lookAt",
      "fov",
      "response",
      "outputOverrides",
    ])
  ) {
    errors.push("Anchor de cámara inválido");
    return null;
  }

  const anchorIds: CameraAnchorBlueprint["id"][] = [
    "MASTER",
    "FRONT",
    "THREE_QUARTER_LEFT",
    "THREE_QUARTER_RIGHT",
    "PROFILE",
    "LOW_ANGLE",
    "HIGH_ANGLE",
    "DETAIL",
    "PORTAL",
    "ORBIT",
  ];
  const id = anchorIds.find((item) => item === value.id);
  const position = vector3(value.position, -36, 36);
  const lookAt = vector3(value.lookAt, -32, 32);
  const fov = finiteNumber(value.fov);
  const response = finiteNumber(value.response);
  const outputOverrides: CameraAnchorBlueprint["outputOverrides"] = {};

  if (!id || !position || !lookAt || fov === null || response === null) {
    errors.push("Posición de cámara no segura");
    return null;
  }

  if (isRecord(value.outputOverrides)) {
    if (!hasOnlyKeys(value.outputOverrides, OUTPUT_PROFILE_IDS)) {
      errors.push("Formato de salida no permitido");
      return null;
    }

    for (const profile of OUTPUT_PROFILE_IDS) {
      const override = value.outputOverrides[profile];

      if (override === undefined) {
        continue;
      }

      if (
        !isRecord(override) ||
        !hasOnlyKeys(override, ["position", "lookAt", "fov"])
      ) {
        errors.push("Override de cámara inválido");
        return null;
      }

      const overridePosition = override.position
        ? vector3(override.position, -36, 36)
        : undefined;
      const overrideLookAt = override.lookAt
        ? vector3(override.lookAt, -32, 32)
        : undefined;
      const overrideFov = finiteNumber(override.fov);
      outputOverrides[profile] = {
        ...(overridePosition ? { position: overridePosition } : {}),
        ...(overrideLookAt ? { lookAt: overrideLookAt } : {}),
        ...(overrideFov === null ? {} : { fov: clamp(overrideFov, 24, 82) }),
      };
    }
  }

  return {
    id,
    position: [position[0], clamp(position[1], 0.35, 16), position[2]],
    lookAt,
    fov: clamp(fov, 24, 82),
    response: clamp(response, 0.35, 10),
    outputOverrides,
  };
}

export function validateArchitectureBlueprint(
  input: unknown,
  allowedSlotIds?: readonly string[]
): ArchitectureValidationResult {
  const errors: string[] = [];

  if (
    !isRecord(input) ||
    !hasOnlyKeys(input, [
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
    ])
  ) {
    return { ok: false, errors: ["Blueprint raíz inválido"] };
  }

  const id = safeId(input.id);
  const seed = safeString(input.seed, 128);
  const archetype = ARCHITECTURE_ARCHETYPES.find(
    (item) => item === input.archetype
  );

  if (!id || !seed || !archetype) {
    return { ok: false, errors: ["Identidad del blueprint inválida"] };
  }

  if (
    !isRecord(input.room) ||
    !hasOnlyKeys(input.room, [
      "width",
      "depth",
      "height",
      "wallThickness",
      "material",
      "openFront",
    ])
  ) {
    return { ok: false, errors: ["Sala inválida"] };
  }

  const roomInput = input.room;
  const width = finiteNumber(roomInput.width);
  const depth = finiteNumber(roomInput.depth);
  const height = finiteNumber(roomInput.height);
  const wallThickness = finiteNumber(roomInput.wallThickness);
  const openFront = roomInput.openFront;
  const roomMaterial = ARCHITECTURAL_MATERIALS.find(
    (item) => item === roomInput.material
  );

  if (
    width === null ||
    depth === null ||
    height === null ||
    wallThickness === null ||
    !roomMaterial ||
    typeof openFront !== "boolean"
  ) {
    return { ok: false, errors: ["Dimensiones de sala inválidas"] };
  }

  if (!Array.isArray(input.modules) || input.modules.length > MAX_MODULES) {
    return { ok: false, errors: ["Demasiados módulos arquitectónicos"] };
  }

  if (!Array.isArray(input.surfaces) || input.surfaces.length > MAX_SURFACES) {
    return { ok: false, errors: ["Demasiadas superficies audiovisuales"] };
  }

  if (!Array.isArray(input.lights) || input.lights.length > MAX_LIGHTS) {
    return { ok: false, errors: ["Demasiadas luces"] };
  }

  const allowedSlots = allowedSlotIds ? new Set(allowedSlotIds) : undefined;
  const modules = input.modules
    .map((module) => parseModule(module, errors))
    .filter((module): module is ArchitectureModuleBlueprint => Boolean(module));
  const surfaces = input.surfaces
    .map((surface) => parseSurface(surface, allowedSlots, errors))
    .filter((surface): surface is ProjectionSurfaceBlueprint => Boolean(surface));
  const lights = input.lights
    .map((light) => parseLight(light, errors))
    .filter((light): light is LightBlueprint => Boolean(light));

  if (
    !isRecord(input.performerStage) ||
    !hasOnlyKeys(input.performerStage, [
      "position",
      "size",
      "safeRadius",
      "backgroundSeparation",
      "keyLightId",
    ])
  ) {
    return { ok: false, errors: ["Escenario del performer inválido"] };
  }

  const stagePosition = vector3(input.performerStage.position, -20, 20);
  const stageSize = vector3(input.performerStage.size, 0.1, 12);
  const safeRadius = finiteNumber(input.performerStage.safeRadius);
  const separation = finiteNumber(input.performerStage.backgroundSeparation);
  const keyLightId = safeId(input.performerStage.keyLightId);

  if (!stagePosition || !stageSize || safeRadius === null || separation === null || !keyLightId) {
    return { ok: false, errors: ["Zona humana inválida"] };
  }

  const clampedSafeRadius = clamp(safeRadius, 1.1, 4.5);
  const exemptTypes = new Set([
    "ROOM_SHELL",
    "CENTRAL_STAGE",
    "FLOOR_PROJECTION_ZONE",
    "REFLECTIVE_POOL",
    "CEILING_PROJECTION_ZONE",
    "CEILING_OCULUS",
  ]);

  for (const moduleBlueprint of modules) {
    if (exemptTypes.has(moduleBlueprint.type)) {
      continue;
    }

    const deltaX = moduleBlueprint.position[0] - stagePosition[0];
    const deltaZ = moduleBlueprint.position[2] - stagePosition[2];
    const horizontalDistance = Math.hypot(deltaX, deltaZ);
    const footprint = Math.min(
      3,
      Math.max(
        moduleBlueprint.dimensions[0],
        moduleBlueprint.dimensions[2]
      ) * 0.5
    );

    if (horizontalDistance < clampedSafeRadius + footprint) {
      errors.push(
        `El módulo ${moduleBlueprint.id} invade la zona del performer`
      );
    }
  }

  if (!lights.some((light) => light.id === keyLightId)) {
    errors.push("La luz principal del performer no existe");
  }

  if (!modules.some((module) => module.type === "ROOM_SHELL")) {
    errors.push("Falta ROOM_SHELL con suelo y techo construidos");
  }

  if (!Array.isArray(input.cameraAnchors)) {
    errors.push("Anchors de cámara ausentes");
  }

  const cameraAnchors = Array.isArray(input.cameraAnchors)
    ? input.cameraAnchors
        .map((anchor) => parseCameraAnchor(anchor, errors))
        .filter((anchor): anchor is CameraAnchorBlueprint => Boolean(anchor))
    : [];

  if (!cameraAnchors.some((anchor) => anchor.id === "MASTER")) {
    errors.push("Falta el plano maestro");
  }

  for (const anchor of cameraAnchors) {
    if (
      Math.hypot(
        anchor.position[0] - stagePosition[0],
        anchor.position[2] - stagePosition[2]
      ) < 1.5
    ) {
      errors.push(`La cámara ${anchor.id} invade el espacio humano`);
    }

    for (const moduleBlueprint of modules) {
      if (
        moduleBlueprint.type === "ROOM_SHELL" ||
        moduleBlueprint.type === "LONG_CORRIDOR" ||
        moduleBlueprint.type === "DEEP_PROJECTION_NICHE" ||
        moduleBlueprint.type === "ARCHITECTURAL_PORTAL" ||
        moduleBlueprint.type === "CENTRAL_STAGE" ||
        moduleBlueprint.type === "FLOOR_PROJECTION_ZONE" ||
        moduleBlueprint.type === "CEILING_PROJECTION_ZONE" ||
        moduleBlueprint.type === "REFLECTIVE_POOL" ||
        moduleBlueprint.type === "CEILING_OCULUS"
      ) {
        continue;
      }

      const clearance = 0.28;
      const insideModule =
        Math.abs(anchor.position[0] - moduleBlueprint.position[0]) <=
          moduleBlueprint.dimensions[0] * 0.5 + clearance &&
        Math.abs(anchor.position[1] - moduleBlueprint.position[1]) <=
          moduleBlueprint.dimensions[1] * 0.5 + clearance &&
        Math.abs(anchor.position[2] - moduleBlueprint.position[2]) <=
          moduleBlueprint.dimensions[2] * 0.5 + clearance;

      if (insideModule) {
        errors.push(
          `La cámara ${anchor.id} atraviesa el módulo ${moduleBlueprint.id}`
        );
      }
    }
  }

  if (
    !isRecord(input.transition) ||
    !hasOnlyKeys(input.transition, [
      "duration",
      "stagger",
      "entryOffset",
      "easing",
      "performerOpacity",
    ])
  ) {
    errors.push("Transición inválida");
  }

  const transitionInput = isRecord(input.transition)
    ? input.transition
    : null;
  const duration = transitionInput
    ? finiteNumber(transitionInput.duration)
    : null;
  const stagger = transitionInput
    ? finiteNumber(transitionInput.stagger)
    : null;
  const entryOffset = transitionInput
    ? vector3(transitionInput.entryOffset, -12, 12)
    : null;
  const performerOpacity = transitionInput
    ? finiteNumber(transitionInput.performerOpacity)
    : null;
  const easing = transitionInput
    ? (["SMOOTHSTEP", "CINEMATIC"] as const).find(
        (item) => item === transitionInput.easing
      )
    : undefined;

  if (
    duration === null ||
    stagger === null ||
    !entryOffset ||
    performerOpacity === null ||
    !easing
  ) {
    errors.push("Parámetros de transición inválidos");
  }

  const uniqueIds = new Set<string>();

  for (const item of [...modules, ...surfaces, ...lights]) {
    if (uniqueIds.has(item.id)) {
      errors.push(`Identificador duplicado: ${item.id}`);
    }
    uniqueIds.add(item.id);
  }

  if (errors.length > 0 || !duration || stagger === null || !entryOffset || performerOpacity === null || !easing) {
    return { ok: false, errors };
  }

  const blueprint: ArchitectureBlueprint = {
    id,
    seed,
    archetype,
    room: {
      width: clamp(width, 8, 32),
      depth: clamp(depth, 8, 42),
      height: clamp(height, 4.2, 14),
      wallThickness: clamp(wallThickness, 0.08, 1.2),
      material: roomMaterial,
      openFront,
    },
    modules,
    surfaces,
    lights,
    performerStage: {
      position: stagePosition,
      size: stageSize,
      safeRadius: clampedSafeRadius,
      backgroundSeparation: clamp(separation, 1.5, 12),
      keyLightId,
    },
    cameraAnchors,
    transition: {
      duration: clamp(duration, 0.6, 8),
      stagger: clamp(stagger, 0, 0.8),
      entryOffset,
      easing,
      performerOpacity: clamp(performerOpacity, 0, 1),
    },
  };

  try {
    JSON.stringify(blueprint);
  } catch {
    return { ok: false, errors: ["El blueprint no es serializable"] };
  }

  return { ok: true, blueprint };
}

function parseMediaSlot(value: unknown): MediaSlotDescriptor | null {
  if (
    !isRecord(value) ||
    !hasOnlyKeys(value, ["id", "kind", "required"])
  ) {
    return null;
  }

  const id = safeId(value.id);
  const kind = ["VIDEO", "IMAGE", "TEXT", "LIVE_CAMERA"].find(
    (item) => item === value.kind
  ) as MediaSlotDescriptor["kind"] | undefined;

  return id && kind && typeof value.required === "boolean"
    ? { id, kind, required: value.required }
    : null;
}

function parseOutputProfile(value: unknown): OutputProfile | null {
  if (
    !isRecord(value) ||
    !hasOnlyKeys(value, ["id", "width", "height", "safeMargin"])
  ) {
    return null;
  }

  const id = OUTPUT_PROFILE_IDS.find((item) => item === value.id);
  const width = finiteNumber(value.width);
  const height = finiteNumber(value.height);
  const safeMargin = finiteNumber(value.safeMargin);

  return id && width && height && safeMargin !== null
    ? {
        id,
        width: Math.round(clamp(width, 320, 7680)),
        height: Math.round(clamp(height, 320, 7680)),
        safeMargin: clamp(safeMargin, 0, 0.3),
      }
    : null;
}

export function validateScenographyBrief(input: unknown): ScenographyBrief | null {
  if (
    !isRecord(input) ||
    !hasOnlyKeys(input, [
      "experienceId",
      "instanceId",
      "seed",
      "takeMode",
      "emotion",
      "rhythm",
      "spatialIntent",
      "performerRequired",
      "mediaSlots",
      "outputProfiles",
    ]) ||
    !Array.isArray(input.mediaSlots) ||
    !Array.isArray(input.outputProfiles)
  ) {
    return null;
  }

  const experienceId = safeId(input.experienceId);
  const instanceId = safeId(input.instanceId);
  const seed = safeString(input.seed, 128);
  const takeMode = input.takeMode === "LIVE" || input.takeMode === "CURATED"
    ? input.takeMode
    : null;
  const mediaSlots = input.mediaSlots
    .slice(0, MAX_SURFACES)
    .map(parseMediaSlot)
    .filter((slot): slot is MediaSlotDescriptor => Boolean(slot));
  const outputProfiles = input.outputProfiles
    .slice(0, OUTPUT_PROFILE_IDS.length)
    .map(parseOutputProfile)
    .filter((profile): profile is OutputProfile => Boolean(profile));

  if (
    !experienceId ||
    !instanceId ||
    !seed ||
    !takeMode ||
    typeof input.performerRequired !== "boolean" ||
    mediaSlots.length !== input.mediaSlots.length ||
    outputProfiles.length !== input.outputProfiles.length
  ) {
    return null;
  }

  return {
    experienceId,
    instanceId,
    seed,
    takeMode,
    ...(safeString(input.emotion, 120) ? { emotion: safeString(input.emotion, 120)! } : {}),
    ...(safeString(input.rhythm, 120) ? { rhythm: safeString(input.rhythm, 120)! } : {}),
    ...(safeString(input.spatialIntent, 240)
      ? { spatialIntent: safeString(input.spatialIntent, 240)! }
      : {}),
    performerRequired: input.performerRequired,
    mediaSlots,
    outputProfiles,
  };
}

export const ARCHITECTURE_LIMITS = {
  maximumModules: MAX_MODULES,
  maximumLights: MAX_LIGHTS,
  maximumSurfaces: MAX_SURFACES,
} as const;
