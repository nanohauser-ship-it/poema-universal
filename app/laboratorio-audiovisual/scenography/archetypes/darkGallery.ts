import {
  createBaseBlueprint,
  moduleBlueprint,
  type ArchetypeBuilder,
} from "./shared";

export const buildDarkGallery: ArchetypeBuilder = (context) => {
  const { random } = context;

  // =========================================================
  // SALA MADRE · GALERÍA V2.6
  // MUSEO NEGRO
  //
  // Más horizontal, más cinematográfico y con arquitectura
  // desplazada hacia los bordes para liberar el centro.
  // =========================================================

  const width = random.range(18.6, 20.4);
  const depth = random.range(20.5, 23.5);
  const height = random.range(7.8, 8.8);

  return createBaseBlueprint(context, {
    archetype: "DARK_GALLERY",

    room: {
      width,
      depth,
      height,
      material: "DARK_CONCRETE",
    },

    modules: [
      // =====================================================
      // MURO MONUMENTAL
      // Ahora funciona como fondo arquitectónico real.
      // =====================================================

      moduleBlueprint(
        "MONUMENT_BACK",
        "MONUMENTAL_WALL",
        "BLACKENED_STEEL",
        [0, height * 0.47, -depth * 0.435],
        [width * 0.74, height * 0.72, 0.42]
      ),

      // =====================================================
      // NICHOS AUDIOVISUALES
      // Más bajos, más anchos y más integrados.
      // =====================================================

      moduleBlueprint(
        "NICHE_LEFT",
        "DEEP_PROJECTION_NICHE",
        "BLACKENED_STEEL",
        [-width * 0.345, height * 0.49, -depth * 0.31],
        [4.7, 4.25, 1.35]
      ),

      moduleBlueprint(
        "NICHE_RIGHT",
        "DEEP_PROJECTION_NICHE",
        "BLACKENED_STEEL",
        [width * 0.345, height * 0.49, -depth * 0.31],
        [4.7, 4.25, 1.35]
      ),

      // =====================================================
      // COLUMNAS
      // Las desplazamos claramente hacia los extremos.
      // Ya no parten la composición por la mitad.
      // =====================================================

      moduleBlueprint(
        "COLUMN_LEFT",
        "COLUMN",
        "PALE_STONE",
        [-width * 0.455, height * 0.405, -3.8],
        [0.52, height * 0.81, 0.52],
        [0, 0, 0],
        {
          radius: 0.26,
          opacity: 0.76,
        }
      ),

      moduleBlueprint(
        "COLUMN_RIGHT",
        "COLUMN",
        "PALE_STONE",
        [width * 0.455, height * 0.405, -3.8],
        [0.52, height * 0.81, 0.52],
        [0, 0, 0],
        {
          radius: 0.26,
          opacity: 0.76,
        }
      ),

      // =====================================================
      // ESPEJO / LÁMINA NEGRA
      //
      // Antes parecía un agujero circular.
      // Ahora será una lámina longitudinal más arquitectónica.
      // =====================================================

      moduleBlueprint(
        "POOL",
        "REFLECTIVE_POOL",
        "REFLECTIVE_BLACK",
        [0, 0.035, -depth * 0.245],
        [width * 0.34, 0.035, 5.4],
        [0, 0, 0],
        {
          opacity: 0.58,
        }
      ),

      // =====================================================
      // SUELO DE PROYECCIÓN
      // Crea profundidad desde cámara hacia el fondo.
      // =====================================================

      moduleBlueprint(
        "FLOOR_ZONE",
        "FLOOR_PROJECTION_ZONE",
        "PROJECTION_BLACK",
        [0, 0.052, -depth * 0.12],
        [width * 0.62, 0.025, depth * 0.52],
        [0, 0, 0],
        {
          opacity: 0.34,
        }
      ),

      // =====================================================
      // DOS PLANOS ARQUITECTÓNICOS INTERMEDIOS
      // Ayudan a crear profundidad y parallax.
      // =====================================================

      moduleBlueprint(
        "INNER_WALL_LEFT",
        "MONUMENTAL_WALL",
        "DARK_CONCRETE",
        [-width * 0.405, height * 0.38, -depth * 0.08],
        [0.34, height * 0.56, depth * 0.24],
        [0, 0, 0],
        {
          opacity: 0.74,
        }
      ),

      moduleBlueprint(
        "INNER_WALL_RIGHT",
        "MONUMENTAL_WALL",
        "DARK_CONCRETE",
        [width * 0.405, height * 0.38, -depth * 0.08],
        [0.34, height * 0.56, depth * 0.24],
        [0, 0, 0],
        {
          opacity: 0.74,
        }
      ),
    ],

    transitionOffset: [0, -0.45, -1.4],
  });
};
