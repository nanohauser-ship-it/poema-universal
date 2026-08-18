import type {
  BorderlessConfiguration,
  CameraConfiguration,
} from "../types/audiovisual";
import forestValleyPanorama from "../assets/forest-valley-panorama-v1.png";
import riverFloor from "../assets/river-floor-v1.png";

const wallSource = forestValleyPanorama.src;
const floorSource = riverFloor.src;

function createBorderlessConfiguration(
  roomCamera: CameraConfiguration
): BorderlessConfiguration {
  return {
    enabled: true,
    accent: 0xd4ad6d,
    surfaces: [
      {
        id: "FREE_SCREEN_PASSAGE_LEFT",
        content: {
          kind: "IMAGE",
          src: wallSource,
          texture: { repeat: [0.387, 0.5], offset: [0, 0.25] },
        },
        visible: true,
        opacity: 0.96,
        mediaColor: 0xffffff,
      },
      {
        id: "FREE_SCREEN_PASSAGE_BACK",
        content: {
          kind: "IMAGE",
          src: wallSource,
          texture: { repeat: [0.224, 0.5], offset: [0.387, 0.25] },
        },
        visible: true,
        opacity: 1,
        mediaColor: 0xffffff,
      },
      {
        id: "FREE_SCREEN_PASSAGE_RIGHT",
        content: {
          kind: "IMAGE",
          src: wallSource,
          texture: {
            repeat: [0.389, 0.5],
            offset: [0.611, 0.25],
            mirrorX: true,
          },
        },
        visible: true,
        opacity: 0.96,
        mediaColor: 0xffffff,
      },
      {
        id: "FREE_SCREEN_PASSAGE_FLOOR",
        content: {
          kind: "IMAGE",
          src: floorSource,
          texture: {
            repeat: [0.386, 1],
            offset: [0.307, 0],
            center: [0.5, 0.5],
          },
        },
        visible: true,
        opacity: 0.72,
        mediaColor: 0xd4d4d0,
      },
      {
        id: "FREE_SCREEN_PASSAGE_CEILING",
        content: {
          kind: "IMAGE",
          src: wallSource,
          texture: {
            repeat: [0.224, 0.5],
            offset: [0.387, 0.25],
            center: [0.5, 0.5],
            mirrorY: true,
          },
        },
        visible: true,
        opacity: 0.14,
        mediaColor: 0x777873,
      },
    ],
    stages: {
      ROOM: {
        camera: { ...roomCamera, response: 3.6 },
        architecture: { opacity: 0, opening: 0 },
        surfaces: { opacity: 0 },
        lighting: { portalIntensity: 0 },
        motion: {
          architectureResponse: 4.6,
          openingResponse: 3.2,
        },
      },
      THRESHOLD: {
        camera: {
          preset: roomCamera.preset,
          position: [0, 2.48, 1.55],
          lookAt: [0, 2.45, -8.8],
          fov: 52,
          response: 2.35,
        },
        architecture: { opacity: 0.88, opening: 1 },
        surfaces: { opacity: 0.72 },
        lighting: { portalIntensity: 1.35 },
        motion: {
          architectureResponse: 3.8,
          openingResponse: 1.85,
        },
        human: {
          offset: [0, 0, -3.4],
          scaleMultiplier: 0.98,
          opacityMultiplier: 0.96,
        },
        humanLook: {
          brightness: 0.76,
          contrast: 1.13,
          saturation: 0.86,
          warmth: 0.16,
          vignette: 0.3,
          rimIntensity: 0.34,
          rimBlur: 10,
        },
      },
      PASSAGE: {
        camera: {
          preset: roomCamera.preset,
          position: [0, 2.42, -8.85],
          lookAt: [0, 2.46, -17.8],
          fov: 61,
          response: 2.15,
        },
        architecture: { opacity: 1, opening: 1 },
        surfaces: { opacity: 1 },
        lighting: { portalIntensity: 1.8 },
        motion: {
          architectureResponse: 3.25,
          openingResponse: 2.6,
        },
        human: {
          offset: [0, 0, -14.7],
          scaleMultiplier: 0.94,
          opacityMultiplier: 0.9,
        },
        humanLook: {
          brightness: 0.7,
          contrast: 1.16,
          saturation: 0.8,
          warmth: 0.2,
          vignette: 0.38,
          rimIntensity: 0.48,
          rimBlur: 14,
        },
      },
    },
  };
}

export const immersiveBorderlessExperience = createBorderlessConfiguration({
  preset: "IMMERSIVE",
});

export const performanceBorderlessExperience = createBorderlessConfiguration({
  preset: "PERFORMANCE",
});
