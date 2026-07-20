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
    firstAvatar: 1,
  },
  {
    source: path.join(
      root,
      "public/poema-universal/source/avatars-sheet.png"
    ),
    firstAvatar: 31,
  },
];

const output = path.join(
  root,
  "public/avatars"
);

const columns = 5;
const rows = 6;

async function createAvatar({
  source,
  avatarId,
  left,
  top,
  width,
  height,
}) {
  const number = String(avatarId).padStart(
    2,
    "0"
  );

  await sharp(source)
    .extract({
      left,
      top,
      width,
      height,
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
    .toFile(
      path.join(
        output,
        `avatar-${number}.webp`
      )
    );

  console.log(`Avatar ${number} creado`);
}

async function processSheet({
  source,
  firstAvatar,
}) {
  await fs.access(source);

  const metadata =
    await sharp(source).metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error(
      `No pude leer las dimensiones de ${source}`
    );
  }

  const imageWidth = metadata.width;
  const imageHeight = metadata.height;

  console.log("");
  console.log(`Procesando: ${source}`);
  console.log(
    `Dimensiones: ${imageWidth} × ${imageHeight}`
  );

  /*
    Las láminas contienen 30 avatares:
    5 columnas × 6 filas.

    El contenido ocupa prácticamente
    toda la imagen. Dejamos fuera:
    - el marco exterior;
    - la numeración inferior;
    - la pequeña franja descriptiva.
  */

  const gridLeft = Math.round(
    imageWidth * 0.018
  );

  const gridRight = Math.round(
    imageWidth * 0.982
  );

  const gridTop = Math.round(
    imageHeight * 0.018
  );

  const gridBottom = Math.round(
    imageHeight * 0.982
  );

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
      const localPosition =
        row * columns + column;

      const avatarId =
        firstAvatar + localPosition;

      /*
        Recorte interior:
        - 4 % a izquierda y derecha;
        - 3 % arriba;
        - 17 % abajo para eliminar
          número y franja de catálogo.
      */

      const left = Math.round(
        gridLeft +
          column * cellWidth +
          cellWidth * 0.04
      );

      const top = Math.round(
        gridTop +
          row * cellHeight +
          cellHeight * 0.03
      );

      const cropWidth = Math.round(
        cellWidth * 0.92
      );

      const cropHeight = Math.round(
        cellHeight * 0.8
      );

      await createAvatar({
        source,
        avatarId,
        left,
        top,
        width: Math.min(
          cropWidth,
          imageWidth - left
        ),
        height: Math.min(
          cropHeight,
          imageHeight - top
        ),
      });
    }
  }
}

async function main() {
  await fs.mkdir(output, {
    recursive: true,
  });

  const existing =
    await fs.readdir(output);

  await Promise.all(
    existing
      .filter(
        (name) =>
          /^avatar-\d{2}\.webp$/.test(name)
      )
      .map((name) =>
        fs.unlink(path.join(output, name))
      )
  );

  for (const sheet of sheets) {
    await processSheet(sheet);
  }

  console.log("");
  console.log(
    "Proceso terminado: 60 avatares completos."
  );
}

main().catch((error) => {
  console.error("");
  console.error(error.message);
  process.exit(1);
});
