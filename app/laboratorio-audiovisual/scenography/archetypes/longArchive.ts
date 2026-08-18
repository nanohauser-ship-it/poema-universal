import { createBaseBlueprint, moduleBlueprint, type ArchetypeBuilder } from "./shared";

export const buildLongArchive: ArchetypeBuilder = (context) => {
  const { random } = context;
  const width = random.range(13.5, 17);
  const depth = random.range(27, 38);
  const height = random.range(6.5, 8.4);
  const columns = random.integer(3, 5);
  const modules = [
    moduleBlueprint("ARCHIVE_CORRIDOR", "LONG_CORRIDOR", "DARK_CONCRETE", [0, height * 0.5, -depth * 0.2], [width * 0.82, height * 0.9, depth * 0.62]),
    moduleBlueprint("ARCHIVE_END", "DEEP_PROJECTION_NICHE", "BLACKENED_STEEL", [0, height * 0.5, -depth * 0.48], [width * 0.48, height * 0.72, 1.4]),
    moduleBlueprint("ARCHIVE_FLOOR", "FLOOR_PROJECTION_ZONE", "PROJECTION_BLACK", [0, 0.055, -depth * 0.23], [width * 0.52, 0.04, depth * 0.56], [0, 0, 0], { opacity: 0.66 }),
  ];

  for (let index = 0; index < columns; index += 1) {
    const z = -4.2 - index * random.range(3.1, 4.1);
    modules.push(
      moduleBlueprint(`ARCHIVE_COLUMN_L_${index}`, "COLUMN", "BLACKENED_STEEL", [-width * 0.41, height * 0.45, z], [0.5, height * 0.9, 0.5], [0, 0, 0], { radius: 0.25 }),
      moduleBlueprint(`ARCHIVE_COLUMN_R_${index}`, "COLUMN", "BLACKENED_STEEL", [width * 0.41, height * 0.45, z], [0.5, height * 0.9, 0.5], [0, 0, 0], { radius: 0.25 })
    );
  }

  return createBaseBlueprint(context, {
    archetype: "LONG_ARCHIVE",
    room: { width, depth, height, material: "DARK_CONCRETE" },
    modules,
    stageZ: 1.1,
    transitionOffset: [0, 0, -3.2],
  });
};
