import { createBaseBlueprint, moduleBlueprint, type ArchetypeBuilder } from "./shared";

export const buildPanoramicHall: ArchetypeBuilder = (context) => {
  const { random } = context;
  const width = random.range(20, 27);
  const depth = random.range(17, 24);
  const height = random.range(7.4, 10.2);

  return createBaseBlueprint(context, {
    archetype: "PANORAMIC_HALL",
    room: { width, depth, height, material: "DARK_CONCRETE" },
    modules: [
      moduleBlueprint("PANORAMA_CURVE", "CURVED_VIDEO_WALL", "PROJECTION_BLACK", [0, height * 0.5, -depth * 0.36], [width * 0.72, height * 0.72, 1], [0, 0, 0], { radius: width * 0.36, arc: random.range(2.1, 2.75), thickness: 0.18 }),
      moduleBlueprint("PANORAMA_LEFT", "PANORAMIC_WALL", "DARK_CONCRETE", [-width * 0.4, height * 0.48, -depth * 0.18], [depth * 0.46, height * 0.82, 0.34], [0, Math.PI / 2, 0]),
      moduleBlueprint("PANORAMA_RIGHT", "PANORAMIC_WALL", "DARK_CONCRETE", [width * 0.4, height * 0.48, -depth * 0.18], [depth * 0.46, height * 0.82, 0.34], [0, Math.PI / 2, 0]),
      moduleBlueprint("PANORAMA_POOL", "REFLECTIVE_POOL", "REFLECTIVE_BLACK", [0, 0.04, -depth * 0.25], [width * 0.64, 0.05, depth * 0.42], [0, 0, 0], { opacity: 0.72 }),
      moduleBlueprint("PANORAMA_CEILING", "CEILING_PROJECTION_ZONE", "PROJECTION_BLACK", [0, height - 0.11, -depth * 0.2], [width * 0.62, 0.05, depth * 0.44], [0, 0, 0], { opacity: 0.28 }),
    ],
    transitionOffset: [0, 0.4, -1.9],
  });
};
