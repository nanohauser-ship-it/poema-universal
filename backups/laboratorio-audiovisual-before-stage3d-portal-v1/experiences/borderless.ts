import type {
  BorderlessConfiguration,
  CameraConfiguration,
} from "../types/audiovisual";

const videoSource = "/flores.mp4";

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
          kind: "VIDEO",
          src: videoSource,
          texture: { repeat: [0.24, 1], offset: [0, 0] },
        },
        visible: true,
        opacity: 0.88,
      },
      {
        id: "FREE_SCREEN_PASSAGE_BACK",
        content: {
          kind: "VIDEO",
          src: videoSource,
          texture: { repeat: [0.52, 1], offset: [0.24, 0] },
        },
        visible: true,
        opacity: 0.96,
      },
      {
        id: "FREE_SCREEN_PASSAGE_RIGHT",
        content: {
          kind: "VIDEO",
          src: videoSource,
          texture: { repeat: [0.24, 1], offset: [0.76, 0] },
        },
        visible: true,
        opacity: 0.88,
      },
      {
        id: "FREE_SCREEN_PASSAGE_FLOOR",
        content: {
          kind: "VIDEO",
          src: videoSource,
          texture: {
            repeat: [1, 0.52],
            offset: [0, 0.02],
            center: [0.5, 0.5],
          },
        },
        visible: true,
        opacity: 0.62,
      },
    ],
    stages: {
      ROOM: {
        camera: roomCamera,
        architectureOpacity: 0,
        mediaOpacity: 0,
      },
      THRESHOLD: {
        camera: {
          preset: roomCamera.preset,
          position: [0, 2.48, 1.55],
          lookAt: [0, 2.45, -8.8],
          fov: 52,
        },
        architectureOpacity: 0.82,
        mediaOpacity: 0.68,
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
          position: [0, 2.38, -10.7],
          lookAt: [0, 2.48, -18.1],
          fov: 58,
        },
        architectureOpacity: 1,
        mediaOpacity: 1,
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
