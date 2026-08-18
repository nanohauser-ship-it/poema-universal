import { createBaseBlueprint, moduleBlueprint, type ArchetypeBuilder } from "./shared";

export const buildMediaLabyrinth: ArchetypeBuilder = (context) => {
  const { random } = context;
  const width = random.range(18, 23);
  const depth = random.range(20, 29);
  const height = random.range(7, 9.8);
  const angle = random.range(0.18, 0.34);

  return createBaseBlueprint(context, {
    archetype: "MEDIA_LABYRINTH",
    room: { width, depth, height, material: "BLACKENED_STEEL" },
    modules: [
      moduleBlueprint("LAB_WALL_L1", "PANORAMIC_WALL", "DARK_CONCRETE", [-width * 0.35, height * 0.42, -depth * 0.24], [6.4, height * 0.72, 0.38], [0, angle, 0]),
      moduleBlueprint("LAB_WALL_R1", "PANORAMIC_WALL", "DARK_CONCRETE", [width * 0.35, height * 0.42, -depth * 0.28], [6.4, height * 0.72, 0.38], [0, -angle, 0]),
      moduleBlueprint("LAB_WALL_L2", "MONUMENTAL_WALL", "BLACKENED_STEEL", [-width * 0.38, height * 0.46, -depth * 0.46], [5.2, height * 0.78, 0.46], [0, -angle * 0.7, 0]),
      moduleBlueprint("LAB_WALL_R2", "MONUMENTAL_WALL", "BLACKENED_STEEL", [width * 0.38, height * 0.46, -depth * 0.43], [5.2, height * 0.78, 0.46], [0, angle * 0.7, 0]),
      moduleBlueprint("LAB_PORTAL", "ARCHITECTURAL_PORTAL", "PALE_STONE", [0, height * 0.42, -depth * 0.48], [4.4, height * 0.72, 0.9]),
      moduleBlueprint("LAB_SCRIM", "SUSPENDED_SCRIM", "TRANSLUCENT_TEXTILE", [0, height * 0.52, -depth * 0.34], [width * 0.38, height * 0.66, 0.04], [0, 0, 0], { opacity: 0.18 }),
      moduleBlueprint("LAB_FLOOR", "FLOOR_PROJECTION_ZONE", "PROJECTION_BLACK", [0, 0.055, -depth * 0.22], [width * 0.58, 0.04, depth * 0.46], [0, 0, 0], { opacity: 0.58 }),
    ],
    transitionOffset: [0, -0.4, -2.6],
  });
};
