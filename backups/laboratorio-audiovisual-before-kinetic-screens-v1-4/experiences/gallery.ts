import type { ExperienceDefinition } from "../types/audiovisual";

const darkWall = { kind: "COLOR", color: 0x090b0d } as const;

export const galleryExperience: ExperienceDefinition = {
  id: "gallery",
  label: "Galería",
  architecture: "gallery",
  environment: {
    background: 0x020304,
    fogColor: 0x020304,
    fogDensity: 0.022,
    exposure: 1.02,
  },
  architectureState: {
    platformVisible: true,
    platformOpacity: 1,
    ringVisible: false,
    ringOpacity: 0,
    edgeLightOpacity: 0.22,
    hemisphereIntensity: 0.28,
    centralSpotIntensity: 3.1,
    warmFillIntensity: 0.7,
  },
  camera: { preset: "GENERAL" },
  surfaces: [
    { id: "LEFT", content: darkWall, visible: true, opacity: 1 },
    { id: "BACK", content: darkWall, visible: true, opacity: 1 },
    { id: "RIGHT", content: darkWall, visible: true, opacity: 1 },
    {
      id: "FLOOR",
      content: { kind: "COLOR", color: 0x050607 },
      visible: true,
      opacity: 1,
    },
    {
      id: "CEILING",
      content: { kind: "COLOR", color: 0x030405 },
      visible: true,
      opacity: 1,
    },
    {
      id: "FREE_SCREEN_LEFT",
      content: {
        kind: "CANVAS",
        canvas: {
          title: "Materia viva",
          subtitle: "Superficie audiovisual · 01",
          accent: "#c7a56a",
        },
      },
      visible: true,
      opacity: 0.9,
      position: [-5.75, 3.28, -0.35],
      motion: { angularVelocity: [0, 0.13, 0] },
    },
    {
      id: "FREE_SCREEN_BACK_A",
      content: {
        kind: "VIDEO",
        src: "/flores.mp4",
        texture: { repeat: [0.52, 1], offset: [0, 0] },
      },
      visible: true,
      opacity: 0.94,
      position: [-2.55, 3.36, -3.35],
      motion: { angularVelocity: [0, -0.105, 0] },
    },
    {
      id: "FREE_SCREEN_BACK_B",
      content: {
        kind: "VIDEO",
        src: "/flores.mp4",
        texture: { repeat: [0.52, 1], offset: [0.48, 0] },
      },
      visible: true,
      opacity: 0.94,
      position: [2.55, 3.36, -3.35],
      motion: { angularVelocity: [0, 0.115, 0] },
    },
    {
      id: "FREE_SCREEN_RIGHT",
      content: {
        kind: "CANVAS",
        canvas: {
          title: "Archivo de luz",
          subtitle: "Superficie audiovisual · 04",
          accent: "#d8d8d4",
        },
      },
      visible: true,
      opacity: 0.9,
      position: [5.75, 3.28, -0.35],
      motion: { angularVelocity: [0, -0.13, 0] },
    },
  ],
  human: {
    content: { kind: "NONE" },
    position: [0, 1.86, 0.55],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    visible: false,
    opacity: 0,
  },
  layers: {
    BACKGROUND_FX: { visible: true },
    HUMAN_LAYER: { visible: false },
    FOREGROUND_FX: { visible: true },
  },
};
