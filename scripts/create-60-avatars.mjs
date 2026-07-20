import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();

const possibleSources = [
  path.join(
    root,
    "public/poema-universal/source/avatars-sheet.png"
  ),
  path.join(
    root,
    "public/poema-universal/source/1avatars-sheet.png"
  ),
];

const source = possibleSources.find((file) =>
  fs.existsSync(file)
);

if (!source) {
  console.error("ERROR: no encuentro ninguna lámina.");
  console.error("He buscado:");
  possibleSources.forEach((file) =>
    console.error(`- ${file}`)
  );
  process.exit(1);
}

const output = path.join(
  root,
  "public/avatars"
);

fs.mkdirSync(output, {
  recursive: true,
});

console.log(`Lámina utilizada: ${source}`);

const metadata = await sharp(source).metadata();

if (!metadata.width || !metadata.height) {
  throw new Error(
    "No se pudieron leer las dimensiones de la lámina."
  );
}

const width = metadata.width;
const height = metadata.height;

console.log(`Dimensiones: ${width} × ${height}`);

/*
  Área aproximada de la retícula:
  10 columnas × 6 filas.
*/
const gridLeft = Math.round(width * 0.02);
const gridRight = Math.round(width * 0.98);
const gridTop = Math.round(height * 0.135);
const gridBottom = Math.round(height * 0.985);

const columns = 10;
const rows = 6;

const cellWidth =
  (gridRight - gridLeft) / columns;

const cellHeight =
  (gridBottom - gridTop) / rows;

for (let row = 0; row < rows; row += 1) {
  for (
    let column = 0;
    column < columns;
    column += 1
  ) {
    const id =
      row * columns + column + 1;

    const rawLeft =
      gridLeft + column * cellWidth;

    const rawTop =
      gridTop + row * cellHeight;

    /*
      Margen interior para quitar números,
      líneas y bordes de cada casilla.
    */
    const left = Math.max(
      0,
      Math.round(rawLeft + cellWidth * 0.05)
    );

    const top = Math.max(
      0,
      Math.round(rawTop + cellHeight * 0.08)
    );

    const cropWidth = Math.min(
      width - left,
      Math.max(
        1,
        Math.round(cellWidth * 0.9)
      )
    );

    const cropHeight = Math.min(
      height - top,
      Math.max(
        1,
        Math.round(cellHeight * 0.87)
      )
    );

    const number = String(id).padStart(
      2,
      "0"
    );

    const destination = path.join(
      output,
      `avatar-${number}.webp`
    );

    await sharp(source)
      .extract({
        left,
        top,
        width: cropWidth,
        height: cropHeight,
      })
      .resize({
        width: 512,
        height: 640,
        fit: "contain",
        background: {
          r: 5,
          g: 7,
          b: 8,
          alpha: 1,
        },
      })
      .webp({
        quality: 92,
        effort: 4,
      })
      .toFile(destination);

    console.log(`Avatar ${number} creado`);
  }
}

console.log("");
console.log("Proceso terminado: 60 avatares.");
