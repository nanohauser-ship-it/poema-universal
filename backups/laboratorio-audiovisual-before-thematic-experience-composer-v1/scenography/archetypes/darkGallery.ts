import { createBaseBlueprint, moduleBlueprint, type ArchetypeBuilder } from "./shared";

export const buildDarkGallery: ArchetypeBuilder = (context) => {
  const { random } = context;
  const width = random.range(15.5, 19.5);
  const depth = random.range(18, 25);
  const height = random.range(7.2, 9.2);

  return createBaseBlueprint(context, {
    archetype: "DARK_GALLERY",
    room: { width, depth, height, material: "DARK_CONCRETE" },
    modules: [
      moduleBlueprint("MONUMENT_BACK", "MONUMENTAL_WALL", "DARK_CONCRETE", [0, height * 0.5, -depth * 0.43], [width * 0.64, height * 0.84, 0.58]),
      moduleBlueprint("NICHE_LEFT", "DEEP_PROJECTION_NICHE", "BLACKENED_STEEL", [-width * 0.31, height * 0.52, -depth * 0.34], [4.1, 4.7, 1.1]),
      moduleBlueprint("NICHE_RIGHT", "DEEP_PROJECTION_NICHE", "BLACKENED_STEEL", [width * 0.31, height * 0.52, -depth * 0.34], [4.1, 4.7, 1.1]),
      moduleBlueprint("COLUMN_LEFT", "COLUMN", "PALE_STONE", [-width * 0.38, height * 0.42, -2.8], [0.72, height * 0.84, 0.72], [0, 0, 0], { radius: 0.36 }),
      moduleBlueprint("COLUMN_RIGHT", "COLUMN", "PALE_STONE", [width * 0.38, height * 0.42, -2.8], [0.72, height * 0.84, 0.72], [0, 0, 0], { radius: 0.36 }),
      moduleBlueprint("POOL", "REFLECTIVE_POOL", "REFLECTIVE_BLACK", [0, 0.045, -depth * 0.3], [width * 0.42, 0.06, 3.2], [0, 0, 0], { opacity: 0.78 }),
      moduleBlueprint("FLOOR_ZONE", "FLOOR_PROJECTION_ZONE", "PROJECTION_BLACK", [0, 0.065, -depth * 0.12], [width * 0.54, 0.04, depth * 0.42], [0, 0, 0], { opacity: 0.55 }),
    ],
    transitionOffset: [0, -0.9, -2.2],
  });
};
