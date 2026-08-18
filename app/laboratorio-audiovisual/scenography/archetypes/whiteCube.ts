import { createBaseBlueprint, moduleBlueprint, type ArchetypeBuilder } from "./shared";

export const buildWhiteCube: ArchetypeBuilder = (context) => {
  const { random } = context;
  const width = random.range(15, 20);
  const depth = random.range(16, 23);
  const height = random.range(6.4, 8.6);

  return createBaseBlueprint(context, {
    archetype: "WHITE_CUBE",
    room: { width, depth, height, material: "WHITE_PLASTER" },
    modules: [
      moduleBlueprint("PALE_MONOLITH", "MONUMENTAL_WALL", "WHITE_PLASTER", [0, height * 0.48, -depth * 0.42], [width * 0.58, height * 0.72, 0.42]),
      moduleBlueprint("PORTAL_LEFT", "ARCHITECTURAL_PORTAL", "PALE_STONE", [-width * 0.32, height * 0.43, -depth * 0.2], [3.3, height * 0.68, 0.72], [0, 0.12, 0]),
      moduleBlueprint("PORTAL_RIGHT", "ARCHITECTURAL_PORTAL", "PALE_STONE", [width * 0.32, height * 0.43, -depth * 0.2], [3.3, height * 0.68, 0.72], [0, -0.12, 0]),
      moduleBlueprint("SCRIM", "SUSPENDED_SCRIM", "TRANSLUCENT_TEXTILE", [0, height * 0.53, -depth * 0.31], [width * 0.42, height * 0.62, 0.04], [0, 0, 0], { opacity: 0.24 }),
      moduleBlueprint("CEILING_ZONE", "CEILING_PROJECTION_ZONE", "WHITE_PLASTER", [0, height - 0.12, -depth * 0.12], [width * 0.55, 0.08, depth * 0.48], [0, 0, 0], { opacity: 0.68 }),
      moduleBlueprint("PLINTH_LEFT", "CENTRAL_STAGE", "PALE_STONE", [-width * 0.35, 0.12, -depth * 0.36], [2.3, 0.24, 2.3], [0, 0, 0], { radius: 1.12 }),
      moduleBlueprint("PLINTH_RIGHT", "CENTRAL_STAGE", "PALE_STONE", [width * 0.35, 0.12, -depth * 0.36], [2.3, 0.24, 2.3], [0, 0, 0], { radius: 1.12 }),
    ],
    transitionOffset: [0, 0.6, -1.4],
  });
};
