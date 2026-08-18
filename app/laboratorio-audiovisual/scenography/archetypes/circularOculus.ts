import { createBaseBlueprint, moduleBlueprint, type ArchetypeBuilder } from "./shared";

export const buildCircularOculus: ArchetypeBuilder = (context) => {
  const { random } = context;
  const width = random.range(18, 23);
  const depth = random.range(18, 24);
  const height = random.range(8.2, 11.5);
  const columnRadius = Math.min(width, depth) * 0.34;
  const columns = random.integer(6, 9);
  const modules = [
    moduleBlueprint("OCULUS", "CEILING_OCULUS", "BLACKENED_STEEL", [0, height - 0.45, -depth * 0.12], [5.8, 0.34, 5.8], [Math.PI / 2, 0, 0], { radius: random.range(2.4, 3.2), thickness: 0.22 }),
    moduleBlueprint("OCULUS_POOL", "REFLECTIVE_POOL", "REFLECTIVE_BLACK", [0, 0.04, -depth * 0.18], [6.4, 0.06, 6.4], [0, 0, 0], { opacity: 0.82 }),
    moduleBlueprint("OCULUS_SCRIM", "CURVED_VIDEO_WALL", "TRANSLUCENT_TEXTILE", [0, height * 0.5, -depth * 0.34], [width * 0.62, height * 0.7, 1], [0, 0, 0], { radius: width * 0.31, arc: Math.PI * 1.35, thickness: 0.08, opacity: 0.32 }),
  ];

  for (let index = 0; index < columns; index += 1) {
    const angle = (index / columns) * Math.PI * 2;
    modules.push(
      moduleBlueprint(`OCULUS_COLUMN_${index}`, "COLUMN", "PALE_STONE", [Math.cos(angle) * columnRadius, height * 0.4, -depth * 0.12 + Math.sin(angle) * columnRadius], [0.58, height * 0.8, 0.58], [0, 0, 0], { radius: 0.29 })
    );
  }

  return createBaseBlueprint(context, {
    archetype: "CIRCULAR_OCULUS",
    room: { width, depth, height, material: "DARK_CONCRETE" },
    modules,
    stageZ: 0.8,
    transitionOffset: [0, -1.2, 0],
  });
};
