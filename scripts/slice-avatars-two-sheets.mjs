import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();

const sheets = [
  {
    source: path.join(
      root,
      "public/poema-universal/source/1avatars-sheet.png"
    ),
    startIndex: 1,
  },
  {
    source: path.join(
      root,
      "public/poema-universal/source/avatarss.png"
    ),
    startIndex: 31,
  },
];

const outputDir = path.join(root, "public/avatars");

const columns = 5;
const rows = 6;

function pad(value) {
  return String(value).padStart(2, "0");
}

async function ensureExists(filePath) {
  try {
    await fs.access(filePath);
  } catch {
    throw new Error(`No existe: ${filePath}`);
  }
}

async function sliceSheet(source, startIndex) {
  await ensureExists(source);

  const metadata = await sharp(source).metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error(
      `No pude leer dimensiones de ${source}`
    );
  }

  const width = metadata.width;
  const height = metadata.height;

  console.log("");
  console.log(`Usando lámina: ${source}`);
  console.log(`Dimensiones: ${width} × ${height}`);

  const gridLeft = Math.round(width * 0.018);
  const gridRight = Math.round(width * 0.982);
  const gridTop = Math.round(height * 0.018);
  const gridBottom = Math.round(height * 0.985);

  const cellWidth = (gridRight - gridLeft) / columns;
  const cellHeight = (gridBottom - gridTop) / rows;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      const localIndex = row * columns + col;
      const avatarIndex = startIndex + localIndex;

      // Recorte más generoso:
      // menos agresivo arriba y abajo
      const left = Math.round(
        gridLeft + col * cellWidth + cellWidth * 0.03
      );

      const top = Math.round(
        gridTop + row * cellHeight + cellHeight * 0.015
      );

      const extractWidth = Math.round(
        cellWidth * 0.94
      );

      const extractHeight = Math.round(
        cellHeight * 0.90
      );

      const destination = path.join(
        outputDir,
        `avatar-${pad(avatarIndex)}.webp`
      );

      await sharp(source)
        .extract({
          left,
          top,
          width: extractWidth,
          height: extractHeight,
        })
        .resize({
          width: 512,
          height: 640,
          fit: "contain",
          position: "center",
          background: {
            r: 5,
            g: 7,
            b: 8,
            alpha: 1,
          },
        })
        .webp({
          quality: 94,
          effort: 5,
        })
        .toFile(destination);

      console.log(`Avatar ${pad(avatarIndex)} creado`);
    }
  }
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });

  const files = await fs.readdir(outputDir);

  for (const file of files) {
    if (/^avatar-\d{2}\.webp$/.test(file)) {
      await fs.unlink(path.join(outputDir, file));
    }
  }

  for (const sheet of sheets) {
    await sliceSheet(
      sheet.source,
      sheet.startIndex
    );
  }

  console.log("");
  console.log("60 avatares regenerados correctamente.");
}

main().catch((error) => {
  console.error("");
  console.error(error.message);
  process.exit(1);
});
