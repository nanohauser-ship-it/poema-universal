import type { ExperienceDefinition } from "../types/audiovisual";
import { immersiveBorderlessExperience } from "./borderless";

const videoSource = "/flores.mp4";

export const immersiveExperience: ExperienceDefinition = {
  id: "immersive",
  label: "Inmersión",
  architecture: "immersive",
  environment: {
    background: 0x010202,
    fogColor: 0x06100d,
    fogDensity: 0.013,
    exposure: 0.96,
  },
  architectureState: {
    platformVisible: false,
    platformOpacity: 0,
    ringVisible: false,
    ringOpacity: 0,
    edgeLightOpacity: 0.075,
    structuralDetailOpacity: 0.08,
    technicalCeilingOpacity: 0.52,
    projectionGlowIntensity: 0.42,
    hemisphereIntensity: 0.16,
    centralSpotIntensity: 0.52,
    warmFillIntensity: 0.14,
  },
  camera: { preset: "IMMERSIVE" },
  surfaces: [
    {
      id: "LEFT",
      content: {
        kind: "VIDEO",
        src: videoSource,
        texture: { repeat: [0.24, 1], offset: [0, 0] },
      },
      visible: true,
      opacity: 1,
      mediaColor: 0xd0d0cc,
    },
    {
      id: "BACK",
      content: {
        kind: "VIDEO",
        src: videoSource,
        texture: { repeat: [0.52, 1], offset: [0.24, 0] },
      },
      visible: true,
      opacity: 1,
      mediaColor: 0xd6d6d2,
    },
    {
      id: "RIGHT",
      content: {
        kind: "VIDEO",
        src: videoSource,
        texture: { repeat: [0.24, 1], offset: [0.76, 0] },
      },
      visible: true,
      opacity: 1,
      mediaColor: 0xd0d0cc,
    },
    {
      id: "FLOOR",
      content: {
        kind: "VIDEO",
        src: videoSource,
        texture: {
          repeat: [1, 0.46],
          offset: [0, 0.48],
          center: [0.5, 0.5],
        },
      },
      visible: true,
      opacity: 0.58,
      mediaColor: 0xb4b6b1,
      material: {
        color: 0x030504,
        roughness: 0.08,
        metalness: 0.42,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
      },
    },
    {
      id: "CEILING",
      content: { kind: "COLOR", color: 0x020303 },
      visible: true,
      opacity: 1,
      material: {
        color: 0x020303,
        roughness: 0.96,
        metalness: 0.08,
      },
    },
    { id: "FREE_SCREEN_LEFT", content: { kind: "NONE" }, visible: false, opacity: 0 },
    { id: "FREE_SCREEN_BACK_A", content: { kind: "NONE" }, visible: false, opacity: 0 },
    { id: "FREE_SCREEN_BACK_B", content: { kind: "NONE" }, visible: false, opacity: 0 },
    { id: "FREE_SCREEN_RIGHT", content: { kind: "NONE" }, visible: false, opacity: 0 },
  ],
  human: {
    content: { kind: "NONE" },
    position: [0, 1.86, 0.55],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    visible: false,
    opacity: 0,
  },
  borderless: immersiveBorderlessExperience,
  layers: {
    BACKGROUND_FX: { visible: true },
    HUMAN_LAYER: { visible: false },
    FOREGROUND_FX: { visible: true },
  },
};
