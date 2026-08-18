import type { ExperienceDefinition } from "../types/audiovisual";

const darkWall = {
  kind: "COLOR",
  color: 0x07090a,
} as const;

export const galleryExperience: ExperienceDefinition = {
  id: "gallery",
  label: "Galería",
  architecture: "gallery",

  environment: {
    background: 0x20252a,
    fogColor: 0x20252a,
    fogDensity: 0.004,
    exposure: 1.65,
  },

  architectureState: {
    platformVisible: true,
    platformOpacity: 0.72,

    ringVisible: false,
    ringOpacity: 0,

    edgeLightOpacity: 0.16,
    structuralDetailOpacity: 0.26,
    technicalCeilingOpacity: 0.42,

    projectionGlowIntensity: 0.22,

    hemisphereIntensity: 0.2,
    centralSpotIntensity: 3.8,
    warmFillIntensity: 0.82,
  },

  camera: {
    preset: "GENERAL",
  },

  surfaces: [
    // =====================================================
    // ARQUITECTURA BASE
    // =====================================================

    {
      id: "LEFT",
      content: darkWall,
      visible: true,
      opacity: 1,
    },

    {
      id: "BACK",
      content: {
        kind: "COLOR",
        color: 0x040506,
      },
      visible: true,
      opacity: 1,
    },

    {
      id: "RIGHT",
      content: darkWall,
      visible: true,
      opacity: 1,
    },

    {
      id: "FLOOR",
      content: {
        kind: "COLOR",
        color: 0x020304,
      },
      visible: true,
      opacity: 1,
    },

    {
      id: "CEILING",
      content: {
        kind: "COLOR",
        color: 0x010203,
      },
      visible: true,
      opacity: 1,
    },

    // =====================================================
    // ALA IZQUIERDA
    // PANEL VERTICAL / CARTELA
    // =====================================================

    {
      id: "FREE_SCREEN_LEFT",

      content: {
        kind: "CANVAS",
        canvas: {
          title: "Materia viva",
          subtitle: "Archivo · instalación audiovisual",
          accent: "#c7a56a",
        },
      },

      visible: true,
      opacity: 0.82,

      position: [-6.15, 3.15, -0.65],

      motion: {
        angularVelocity: [0, 0.018, 0],

        float: {
          amplitude: 0.025,
          frequency: 0.32,
          phase: 0,
        },

        viewerResponse: {
          influence: 0.3,
          minimumSpeed: 0.08,
          attraction: 0.12,
          attentionFrequency: 0.22,
          phase: 0.4,
        },
      },
    },

    // =====================================================
    // GRAN OBRA IZQUIERDA
    // =====================================================

    {
      id: "FREE_SCREEN_BACK_A",

      content: {
        kind: "VIDEO",
        src: "/flores.mp4",

        texture: {
          repeat: [0.52, 1],
          offset: [0, 0],
        },
      },

      visible: true,
      opacity: 0.96,

      position: [-3.15, 3.42, -3.95],

      motion: {
        angularVelocity: [0, -0.012, 0],

        float: {
          amplitude: 0.035,
          frequency: 0.28,
          phase: 1.35,
        },

        viewerResponse: {
          influence: 0.34,
          minimumSpeed: 0.08,
          attraction: 0.14,
          attentionFrequency: 0.2,
          phase: 1.8,
        },
      },
    },

    // =====================================================
    // GRAN OBRA DERECHA
    // =====================================================

    {
      id: "FREE_SCREEN_BACK_B",

      content: {
        kind: "VIDEO",
        src: "/flores.mp4",

        texture: {
          repeat: [0.52, 1],
          offset: [0.48, 0],
        },
      },

      visible: true,
      opacity: 0.96,

      position: [3.15, 3.42, -4.25],

      motion: {
        angularVelocity: [0, 0.012, 0],

        float: {
          amplitude: 0.032,
          frequency: 0.3,
          phase: 3.2,
        },

        viewerResponse: {
          influence: 0.34,
          minimumSpeed: 0.08,
          attraction: 0.14,
          attentionFrequency: 0.21,
          phase: 3.6,
        },
      },
    },

    // =====================================================
    // ALA DERECHA
    // =====================================================

    {
      id: "FREE_SCREEN_RIGHT",

      content: {
        kind: "CANVAS",

        canvas: {
          title: "Archivo de luz",
          subtitle: "Presencia · imagen · memoria",
          accent: "#d7d4ca",
        },
      },

      visible: true,
      opacity: 0.82,

      position: [6.15, 3.15, -1.05],

      motion: {
        angularVelocity: [0, -0.018, 0],

        float: {
          amplitude: 0.025,
          frequency: 0.34,
          phase: 4.6,
        },

        viewerResponse: {
          influence: 0.3,
          minimumSpeed: 0.08,
          attraction: 0.12,
          attentionFrequency: 0.22,
          phase: 5.1,
        },
      },
    },
  ],

  // =======================================================
  // PRESENCIA
  // Reservamos el centro para el futuro performer.
  // =======================================================

  human: {
    content: {
      kind: "NONE",
    },

    position: [0, 1.86, -0.15],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],

    visible: false,
    opacity: 0,
  },

  layers: {
    BACKGROUND_FX: {
      visible: true,
    },

    HUMAN_LAYER: {
      visible: false,
    },

    FOREGROUND_FX: {
      visible: true,
    },
  },
};
