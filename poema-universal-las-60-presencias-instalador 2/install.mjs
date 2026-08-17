import { constants as fsConstants } from "node:fs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const installerRoot = path.dirname(fileURLToPath(import.meta.url));
const payloadRoot = path.join(installerRoot, "payload");
const requestedTarget =
  process.argv[2] ||
  process.env.POEMA_UNIVERSAL_DIR ||
  path.join(os.homedir(), "poema-universal");
const targetRoot = path.resolve(requestedTarget);

const pageRelativePath = "app/poema-universal/page.tsx";
const pagePath = path.join(targetRoot, pageRelativePath);
const timestamp = new Date()
  .toISOString()
  .replace(/[-:]/g, "")
  .replace(/\.\d{3}Z$/, "Z");
const backupRoot = path.join(
  targetRoot,
  "backups",
  `las-60-presencias-${timestamp}`,
);

const summary = {
  applicationFilesAdded: 0,
  applicationFilesUpdated: 0,
  applicationFilesUnchanged: 0,
  mediaFilesAdded: 0,
  mediaFilesPreserved: 0,
  backups: 0,
  pageIntegrated: false,
  navigationIntegrated: false,
  warnings: [],
};

function fail(message) {
  throw new Error(message);
}

async function exists(filePath) {
  try {
    await fs.access(filePath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function isInside(parent, child) {
  const relative = path.relative(parent, child);
  return (
    relative !== "" &&
    !relative.startsWith("..") &&
    !path.isAbsolute(relative)
  );
}

async function walkFiles(directory) {
  const entries = await fs.readdir(directory, {
    withFileTypes: true,
  });
  const files = [];

  for (const entry of entries.sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walkFiles(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    } else {
      fail(`El instalador contiene una entrada no admitida: ${fullPath}`);
    }
  }

  return files;
}

async function filesAreEqual(first, second) {
  const [firstStat, secondStat] = await Promise.all([
    fs.stat(first),
    fs.stat(second),
  ]);

  if (firstStat.size !== secondStat.size) {
    return false;
  }

  const [firstBytes, secondBytes] = await Promise.all([
    fs.readFile(first),
    fs.readFile(second),
  ]);

  return firstBytes.equals(secondBytes);
}

async function backupFile(relativePath) {
  const source = path.join(targetRoot, relativePath);
  const destination = path.join(backupRoot, relativePath);

  await fs.mkdir(path.dirname(destination), {
    recursive: true,
  });
  await fs.copyFile(source, destination);
  summary.backups += 1;
}

async function copyAtomically(source, destination) {
  const sourceStat = await fs.stat(source);
  const temporary = `${destination}.presencias-${process.pid}.tmp`;

  await fs.mkdir(path.dirname(destination), {
    recursive: true,
  });
  await fs.copyFile(source, temporary);
  await fs.chmod(temporary, sourceStat.mode);
  await fs.rename(temporary, destination);
}

async function writeAtomically(destination, contents, mode) {
  const temporary = `${destination}.presencias-${process.pid}.tmp`;

  await fs.writeFile(temporary, contents, { mode });
  await fs.rename(temporary, destination);
}

function prepareMainPage(source) {
  let next = source;
  const newline = source.includes("\r\n") ? "\r\n" : "\n";
  const importLine =
    'import PresenceThreshold from "./presencias/components/PresenceThreshold";';

  if (!next.includes(importLine)) {
    if (next.includes("<PresenceThreshold")) {
      fail(
        "La página principal contiene una integración parcial de PresenceThreshold. No se ha modificado nada.",
      );
    }

    const importMarker =
      'import AvatarRelicStudio from "./components/AvatarRelicStudio";';

    if (!next.includes(importMarker)) {
      fail(
        "No se encontró el punto de importación esperado en app/poema-universal/page.tsx. No se ha modificado nada.",
      );
    }

    next = next.replace(
      importMarker,
      `${importMarker}${newline}${importLine}`,
    );
  }

  if (!next.includes("<PresenceThreshold />")) {
    const thresholdPoint =
      /(<AvatarRelicStudio\s*\/>\s*<\/div>\s*<\/section>)(\s*)(<div\s+aria-hidden="true"\s+className=\{styles\.nightThread\})/;

    if (!thresholdPoint.test(next)) {
      fail(
        "No se encontró el umbral seguro entre Las voces y El mundo. No se ha modificado nada.",
      );
    }

    next = next.replace(
      thresholdPoint,
      `$1${newline}${newline}        <PresenceThreshold />$2$3`,
    );
    summary.pageIntegrated = true;
  } else {
    summary.pageIntegrated = true;
  }

  const hasNavigationLink =
    /label:\s*["']Las presencias["']/.test(next);

  if (!hasNavigationLink) {
    const voicesNavigation =
      /(\{\s*label:\s*"Las voces",\s*href:\s*"#voces",\s*\},)/;

    if (voicesNavigation.test(next)) {
      next = next.replace(
        voicesNavigation,
        `$1${newline}  {${newline}    label: "Las presencias",${newline}    href: "/poema-universal/presencias",${newline}  },`,
      );
      summary.navigationIntegrated = true;
    } else {
      summary.warnings.push(
        "La sala queda enlazada desde el umbral editorial, pero la navegación no tenía el bloque esperado «Las voces» y se ha conservado intacta.",
      );
    }
  } else {
    summary.navigationIntegrated = true;
  }

  return next;
}

async function validateTarget() {
  const required = [
    "package.json",
    pageRelativePath,
    "app/poema-universal/data/curatedVoices.ts",
  ];

  for (const relativePath of required) {
    if (!(await exists(path.join(targetRoot, relativePath)))) {
      fail(
        `No parece ser el proyecto Poema Universal: falta ${relativePath} en ${targetRoot}`,
      );
    }
  }

  if (!(await exists(payloadRoot))) {
    fail("Falta la carpeta payload del instalador.");
  }
}

async function install() {
  await validateTarget();

  const originalPage = await fs.readFile(pagePath, "utf8");
  const preparedPage = prepareMainPage(originalPage);
  const payloadFiles = await walkFiles(payloadRoot);

  for (const source of payloadFiles) {
    const relativePath = path.relative(payloadRoot, source);
    const destination = path.join(targetRoot, relativePath);

    if (!isInside(targetRoot, destination)) {
      fail(`Ruta de destino no segura: ${relativePath}`);
    }

    const isPublicMedia = relativePath.startsWith(`public${path.sep}`);
    const destinationExists = await exists(destination);

    if (isPublicMedia && destinationExists) {
      summary.mediaFilesPreserved += 1;
      continue;
    }

    if (destinationExists) {
      const destinationStat = await fs.stat(destination);

      if (!destinationStat.isFile()) {
        fail(`El destino existe y no es un archivo: ${destination}`);
      }

      if (await filesAreEqual(source, destination)) {
        summary.applicationFilesUnchanged += 1;
        continue;
      }

      await backupFile(relativePath);
      await copyAtomically(source, destination);
      summary.applicationFilesUpdated += 1;
    } else {
      await copyAtomically(source, destination);

      if (isPublicMedia) {
        summary.mediaFilesAdded += 1;
      } else {
        summary.applicationFilesAdded += 1;
      }
    }
  }

  if (preparedPage !== originalPage) {
    const pageStat = await fs.stat(pagePath);
    await backupFile(pageRelativePath);
    await writeAtomically(pagePath, preparedPage, pageStat.mode);
  }

  console.log("");
  console.log("LAS 60 PRESENCIAS — INSTALACIÓN TERMINADA");
  console.log(`Proyecto: ${targetRoot}`);
  console.log(
    `Aplicación: ${summary.applicationFilesAdded} archivos añadidos, ${summary.applicationFilesUpdated} actualizados, ${summary.applicationFilesUnchanged} sin cambios.`,
  );
  console.log(
    `Medios: ${summary.mediaFilesAdded} añadidos, ${summary.mediaFilesPreserved} existentes preservados.`,
  );
  console.log(
    `Integración editorial: ${summary.pageIntegrated ? "sí" : "no"}. Navegación: ${summary.navigationIntegrated ? "sí" : "conservada sin cambios"}.`,
  );

  if (summary.backups > 0) {
    console.log(
      `Backups: ${summary.backups} archivos guardados en ${backupRoot}`,
    );
  } else {
    console.log("Backups: no fueron necesarios; no se sobrescribió nada.");
  }

  for (const warning of summary.warnings) {
    console.log(`Aviso: ${warning}`);
  }

  console.log("");
  console.log(
    "Ruta: http://localhost:3000/poema-universal/presencias",
  );
  console.log("");
}

install().catch((error) => {
  console.error("");
  console.error("INSTALACIÓN DETENIDA");
  console.error(
    error instanceof Error ? error.message : String(error),
  );
  console.error("");
  process.exitCode = 1;
});
