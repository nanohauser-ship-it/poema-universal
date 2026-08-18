import type { ExperienceDefinition } from "../types/audiovisual";
import forestValleyPanorama from "../assets/forest-valley-panorama-v1.png";
import riverFloor from "../assets/river-floor-v1.png";
import { immersiveBorderlessExperience } from "./borderless";

const wallSource = forestValleyPanorama.src;
const floorSource = riverFloor.src;

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
        kind: "IMAGE",
        src: wallSource,
        texture: { repeat: [0.302, 0.544], offset: [0, 0.228] },
      },
      visible: true,
      opacity: 0.98,
      mediaColor: 0xffffff,
    },
    {
      id: "BACK",
      content: {
        kind: "IMAGE",
        src: wallSource,
        texture: { repeat: [0.397, 0.544], offset: [0.302, 0.228] },
      },
      visible: true,
      opacity: 1,
      mediaColor: 0xffffff,
    },
    {
      id: "RIGHT",
      content: {
        kind: "IMAGE",
        src: wallSource,
        texture: { repeat: [0.301, 0.544], offset: [0.699, 0.228] },
      },
      visible: true,
      opacity: 0.98,
      mediaColor: 0xffffff,
    },
    {
      id: "FLOOR",
      content: {
        kind: "IMAGE",
        src: floorSource,
        texture: {
          repeat: [0.889, 1],
          offset: [0.0555, 0],
          center: [0.5, 0.5],
        },
      },
      visible: true,
      opacity: 0.78,
      mediaColor: 0xe2e2df,
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
