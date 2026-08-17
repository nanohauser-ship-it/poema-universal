#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const installerDirectory = path.dirname(fileURLToPath(import.meta.url));
const targetDirectory = path.resolve(
  process.argv[2] ?? path.join(os.homedir(), "poema-universal"),
);
const payloadDirectory = path.join(installerDirectory, "payload");
const stamp = new Date()
  .toISOString()
  .replace(/[-:]/g, "")
  .replace(/\..+$/, "Z");
const backupDirectory = path.join(
  targetDirectory,
  "backups",
  `gran-avatar-${stamp}`,
);

const payloadFiles = [
  "app/poema-universal/gran-avatar/page.tsx",
  "app/poema-universal/gran-avatar/GranAvatarExperience.tsx",
  "app/poema-universal/gran-avatar/gran-avatar.module.css",
  "app/poema-universal/gran-avatar/avatarConfig.ts",
  "app/poema-universal/gran-avatar/types.ts",
  "app/poema-universal/gran-avatar/components/AvatarBody.tsx",
  "app/poema-universal/gran-avatar/lib/avatarArchiveStore.ts",
  "app/api/poema-universal/gran-avatar/converse/route.ts",
  "app/api/poema-universal/gran-avatar/voice/route.ts",
  "app/api/poema-universal/gran-avatar/transcribe/route.ts",
  "app/poema-universal/components/GrandAvatarThreshold.tsx",
  "app/poema-universal/components/GrandAvatarThreshold.module.css",
  "public/poema-universal/gran-avatar/avatar-poster.webp",
];

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function hashFile(filePath) {
  return crypto
    .createHash("sha256")
    .update(fs.readFileSync(filePath))
    .digest("hex");
}

function ensureParent(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function backupFile(relativePath) {
  const sourcePath = path.join(targetDirectory, relativePath);
  if (!fs.existsSync(sourcePath)) return false;

  const backupPath = path.join(backupDirectory, relativePath);
  ensureParent(backupPath);
  fs.copyFileSync(sourcePath, backupPath);
  return true;
}

function writeAtomic(filePath, contents) {
  const temporaryPath = `${filePath}.gran-avatar-${process.pid}.tmp`;
  fs.writeFileSync(temporaryPath, contents, "utf8");
  fs.renameSync(temporaryPath, filePath);
}

if (!fs.existsSync(path.join(targetDirectory, "package.json"))) {
  fail(`No se encontró Poema Universal en ${targetDirectory}`);
}

if (!fs.existsSync(path.join(targetDirectory, "app", "poema-universal", "page.tsx"))) {
  fail("No se encontró la página principal de Poema Universal.");
}

for (const relativePath of payloadFiles) {
  if (!fs.existsSync(path.join(payloadDirectory, relativePath))) {
    fail(`El instalador está incompleto: falta ${relativePath}`);
  }
}

console.log("");
console.log("===== EL GRAN AVATAR · POEMA UNIVERSAL =====");
console.log(`Proyecto: ${targetDirectory}`);
console.log("");

let addedFiles = 0;
let updatedFiles = 0;
let unchangedFiles = 0;
let backupCount = 0;

for (const relativePath of payloadFiles) {
  const sourcePath = path.join(payloadDirectory, relativePath);
  const destinationPath = path.join(targetDirectory, relativePath);
  ensureParent(destinationPath);

  if (!fs.existsSync(destinationPath)) {
    fs.copyFileSync(sourcePath, destinationPath);
    addedFiles += 1;
    console.log(`＋ ${relativePath}`);
    continue;
  }

  if (hashFile(sourcePath) === hashFile(destinationPath)) {
    unchangedFiles += 1;
    console.log(`＝ ${relativePath}`);
    continue;
  }

  if (backupFile(relativePath)) backupCount += 1;
  fs.copyFileSync(sourcePath, destinationPath);
  updatedFiles += 1;
  console.log(`✓ ${relativePath}`);
}

const mainPageRelativePath = "app/poema-universal/page.tsx";
const mainPagePath = path.join(targetDirectory, mainPageRelativePath);
const originalMainPage = fs.readFileSync(mainPagePath, "utf8");
let mainPage = originalMainPage;

if (!mainPage.includes('import GrandAvatarThreshold from "./components/GrandAvatarThreshold";')) {
  const importAnchor =
    'import AvatarRelicStudio from "./components/AvatarRelicStudio";';
  if (!mainPage.includes(importAnchor)) {
    fail("No se encontró el punto seguro para integrar el portal del Gran Avatar.");
  }
  mainPage = mainPage.replace(
    importAnchor,
    `${importAnchor}\nimport GrandAvatarThreshold from "./components/GrandAvatarThreshold";`,
  );
}

if (!mainPage.includes('href: "/poema-universal/gran-avatar"')) {
  const navigationAnchor = [
    "  {",
    '    label: "Las voces",',
    '    href: "#voces",',
    "  },",
  ].join("\n");
  if (!mainPage.includes(navigationAnchor)) {
    fail("No se encontró el punto seguro de la navegación de Poema Universal.");
  }
  const avatarNavigation = [
    "  {",
    '    label: "El avatar",',
    '    href: "/poema-universal/gran-avatar",',
    "  },",
  ].join("\n");
  mainPage = mainPage.replace(
    navigationAnchor,
    `${navigationAnchor}\n${avatarNavigation}`,
  );
}

if (!mainPage.includes("<GrandAvatarThreshold />")) {
  const thresholdAnchor = "        <PresenceThreshold />";
  if (!mainPage.includes(thresholdAnchor)) {
    fail("No se encontró el umbral seguro donde anexar El Gran Avatar.");
  }
  mainPage = mainPage.replace(
    thresholdAnchor,
    `${thresholdAnchor}\n\n        <GrandAvatarThreshold />`,
  );
}

if (mainPage !== originalMainPage) {
  if (backupFile(mainPageRelativePath)) backupCount += 1;
  writeAtomic(mainPagePath, mainPage);
  updatedFiles += 1;
  console.log(`✓ ${mainPageRelativePath} · acceso integrado`);
} else {
  unchangedFiles += 1;
  console.log(`＝ ${mainPageRelativePath} · acceso ya integrado`);
}

const installedExperience = path.join(
  targetDirectory,
  "app/poema-universal/gran-avatar/GranAvatarExperience.tsx",
);
const installedMainPage = fs.readFileSync(mainPagePath, "utf8");

if (
  !fs.readFileSync(installedExperience, "utf8").includes("Carga tu poema") ||
  !installedMainPage.includes("<GrandAvatarThreshold />")
) {
  fail("La verificación final no encontró la sala o su acceso.");
}

const nextCache = path.join(targetDirectory, ".next");
if (fs.existsSync(nextCache)) {
  try {
    fs.rmSync(nextCache, { recursive: true, force: true });
    console.log("✓ Caché de Next.js retirada");
  } catch {
    console.log("⚠ No se pudo retirar .next; detén el servidor antes de reiniciar.");
  }
}

console.log("");
console.log("✅ EL GRAN AVATAR HA ENTRADO EN POEMA UNIVERSAL");
console.log(`Archivos añadidos: ${addedFiles}`);
console.log(`Archivos actualizados: ${updatedFiles}`);
console.log(`Archivos sin cambios: ${unchangedFiles}`);
console.log(`Backups realizados: ${backupCount}`);
if (backupCount > 0) console.log(`Backup: ${backupDirectory}`);
console.log("");
console.log("Ruta: http://localhost:3000/poema-universal/gran-avatar");
console.log("Acceso: http://localhost:3000/poema-universal");
console.log("");
console.log("No se modificaron .env.local, Supabase ni las salas existentes.");
console.log("Ahora ejecuta:");
console.log(`cd "${targetDirectory}"`);
console.log("npm run dev");
console.log("");
