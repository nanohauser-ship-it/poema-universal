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
