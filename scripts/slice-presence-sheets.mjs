import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();

const configurations = [
  {
    name: "avatars",
    source: path.join(
      ROOT,
      "public/poema-universal/source/avatars-sheet.png"
    ),
    output: path.join(
      ROOT,
      "public/poema-universal/avatars"
    ),
    prefix: "avatar",
    columns: 10,
    rows: 6,

    // Área útil de la lámina.
    leftRatio: 0.018,
    rightRatio: 0.982,
    topRatio: 0.14,
    bottomRatio: 0.985,

    // Elimina número, bordes y separación.
    insetLeft: 0.055,
    insetRight: 0.055,
    insetTop: 0.085,
    insetBottom: 0.045,

    width: 420,
    height: 540,
  },
  {
    name: "relics",
    source: path.join(
      ROOT,
      "public/poema-universal/source/treasures-sheet.png"
    ),
    output: path.join(
      ROOT,
      "public/poema-universal/relics"
    ),
    prefix: "relic",
    columns: 10,
    rows: 6,

    leftRatio: 0.018,
    rightRatio: 0.982,
    topRatio: 0.13,
    bottomRatio: 0.985,

    insetLeft: 0.045,
    insetRight: 0.045,
    insetTop: 0.11,
    insetBottom: 0.035,

    width: 360,
    height: 440,
  },
];

async function ensureFile(filePath) {
  try {
    await fs.access(filePath);
  } catch {
    throw new Error(
      `No existe el archivo:\n${filePath}`
    );
  }
}

async function sliceSheet(configuration) {
  await ensureFile(configuration.source);
  await fs.mkdir(configuration.output, {
    recursive: true,
  });

  const image = sharp(configuration.source);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error(
      `No pude leer las dimensiones de ${configuration.source}`
    );
  }

  const sheetWidth = metadata.width;
  const sheetHeight = metadata.height;

  const gridLeft = Math.round(
    sheetWidth * configuration.leftRatio
  );

  const gridTop = Math.round(
    sheetHeight * configuration.topRatio
  );

  const gridRight = Math.round(
    sheetWidth * configuration.rightRatio
  );

  const gridBottom = Math.round(
    sheetHeight * configuration.bottomRatio
  );

  const gridWidth = gridRight - gridLeft;
  const gridHeight = gridBottom - gridTop;

  const cellWidth =
    gridWidth / configuration.columns;

  const cellHeight =
    gridHeight / configuration.rows;

  for (
    let row = 0;
    row < configuration.rows;
    row += 1
  ) {
    for (
      let column = 0;
      column < configuration.columns;
      column += 1
    ) {
      const position =
        row * configuration.columns +
        column +
        1;

      const left = Math.round(
        gridLeft +
          column * cellWidth +
          cellWidth *
            configuration.insetLeft
      );

      const top = Math.round(
        gridTop +
          row * cellHeight +
          cellHeight *
            configuration.insetTop
      );

      const width = Math.max(
        1,
        Math.round(
          cellWidth *
            (1 -
              configuration.insetLeft -
              configuration.insetRight)
        )
      );

      const height = Math.max(
        1,
        Math.round(
          cellHeight *
            (1 -
              configuration.insetTop -
              configuration.insetBottom)
        )
      );

      const number = String(position).padStart(
        2,
        "0"
      );

      const destination = path.join(
        configuration.output,
        `${configuration.prefix}-${number}.webp`
      );

      await sharp(configuration.source)
        .extract({
          left,
          top,
          width,
          height,
        })
        .resize({
          width: configuration.width,
          height: configuration.height,
          fit: "contain",
          background: {
            r: 4,
            g: 6,
            b: 7,
            alpha: 1,
          },
        })
        .webp({
          quality: 90,
          effort: 5,
        })
        .toFile(destination);

      console.log(
        `${configuration.name} ${number} creado`
      );
    }
  }
}

async function main() {
  for (const configuration of configurations) {
    await sliceSheet(configuration);
  }

  console.log("");
  console.log("120 piezas creadas correctamente.");
}

main().catch((error) => {
  console.error("");
  console.error(error.message);
  process.exit(1);
});
