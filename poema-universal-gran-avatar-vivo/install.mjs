#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
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
  `gran-avatar-vivo-${stamp}`,
);

const sdkPackage = "@heygen/liveavatar-web-sdk";
const sdkVersion = "0.0.18";

const payloadFiles = [
  "app/poema-universal/gran-avatar/GranAvatarExperience.tsx",
  "app/poema-universal/gran-avatar/gran-avatar.module.css",
  "app/poema-universal/gran-avatar/types.ts",
  "app/poema-universal/gran-avatar/components/AvatarBody.tsx",
  "app/api/poema-universal/gran-avatar/converse/route.ts",
  "app/api/poema-universal/gran-avatar/voice/route.ts",
  "app/api/poema-universal/gran-avatar/live/session/route.ts",
];

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function ensureParent(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function hashFile(filePath) {
  return crypto
    .createHash("sha256")
    .update(fs.readFileSync(filePath))
    .digest("hex");
}

const backedUp = new Set();
function backupFile(relativePath) {
  if (backedUp.has(relativePath)) return false;
  const sourcePath = path.join(targetDirectory, relativePath);
  if (!fs.existsSync(sourcePath)) return false;

  const backupPath = path.join(backupDirectory, relativePath);
  ensureParent(backupPath);
  fs.copyFileSync(sourcePath, backupPath);
  backedUp.add(relativePath);
  return true;
}

function installFile(sourcePath, relativeTarget) {
  const destinationPath = path.join(targetDirectory, relativeTarget);
  ensureParent(destinationPath);

  if (!fs.existsSync(destinationPath)) {
    fs.copyFileSync(sourcePath, destinationPath);
    console.log(`＋ ${relativeTarget}`);
    return "added";
  }

  if (hashFile(sourcePath) === hashFile(destinationPath)) {
    console.log(`＝ ${relativeTarget}`);
    return "unchanged";
  }

  backupFile(relativeTarget);
  fs.copyFileSync(sourcePath, destinationPath);
  console.log(`✓ ${relativeTarget}`);
  return "updated";
}

if (!fs.existsSync(path.join(targetDirectory, "package.json"))) {
  fail(`No se encontró Poema Universal en ${targetDirectory}`);
}

if (
  !fs.existsSync(
    path.join(
      targetDirectory,
      "app/poema-universal/gran-avatar/GranAvatarExperience.tsx",
    ),
  )
) {
  fail(
    "Primero debe estar instalada la sala El Gran Avatar de Poema Universal.",
  );
}

for (const relativePath of payloadFiles) {
  if (!fs.existsSync(path.join(payloadDirectory, relativePath))) {
    fail(`El instalador está incompleto: falta ${relativePath}`);
  }
}

console.log("");
console.log("===== EL GRAN AVATAR · ORGANISMO VIVO =====");
console.log(`Proyecto: ${targetDirectory}`);
console.log("");

const packageJsonPath = path.join(targetDirectory, "package.json");
const packageLockPath = path.join(targetDirectory, "package-lock.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const installedSdk = packageJson.dependencies?.[sdkPackage];

if (installedSdk !== sdkVersion) {
  backupFile("package.json");
  if (fs.existsSync(packageLockPath)) backupFile("package-lock.json");

  console.log(`Instalando ${sdkPackage}@${sdkVersion}…`);
  try {
    execFileSync(
      "npm",
      [
        "install",
        "--save-exact",
        "--cache",
        path.join(os.tmpdir(), "gran-avatar-vivo-npm-cache"),
        `${sdkPackage}@${sdkVersion}`,
      ],
      { cwd: targetDirectory, stdio: "inherit" },
    );
  } catch {
    fail(
      `No se pudo instalar el puente audiovisual. Los originales están en ${backupDirectory}`,
    );
  }
} else {
  console.log(`＝ ${sdkPackage}@${sdkVersion}`);
}

const counts = { added: 0, unchanged: 0, updated: 0 };
for (const relativePath of payloadFiles) {
  const result = installFile(
    path.join(payloadDirectory, relativePath),
    relativePath,
  );
  counts[result] += 1;
}

const privateMaterial = [
  {
    source: path.join(
      installerDirectory,
      "material-de-entrenamiento/retrato-fuente-liveavatar-1920x1080.png",
    ),
    target:
      "material-avatar/gran-avatar/retrato-fuente-liveavatar-1920x1080.png",
  },
  {
    source: path.join(installerDirectory, "CONFIGURAR-VIDA.txt"),
    target: "material-avatar/gran-avatar/CONFIGURAR-VIDA.txt",
  },
  {
    source: path.join(installerDirectory, "MOVIMIENTO-SILENCIOSO.txt"),
    target: "material-avatar/gran-avatar/MOVIMIENTO-SILENCIOSO.txt",
  },
];

for (const file of privateMaterial) {
  if (!fs.existsSync(file.source)) {
    fail(`Falta material privado: ${path.basename(file.source)}`);
  }
  const result = installFile(file.source, file.target);
  counts[result] += 1;
}

const installedBody = fs.readFileSync(
  path.join(
    targetDirectory,
    "app/poema-universal/gran-avatar/components/AvatarBody.tsx",
  ),
  "utf8",
);
if (
  !installedBody.includes("LiveAvatarSession") ||
  !fs.existsSync(
    path.join(
      targetDirectory,
      "app/api/poema-universal/gran-avatar/live/session/route.ts",
    ),
  )
) {
  fail("La verificación final no encontró el organismo vivo.");
}

const nextCache = path.join(targetDirectory, ".next");
if (fs.existsSync(nextCache)) {
  try {
    fs.rmSync(nextCache, { recursive: true, force: true });
    console.log("✓ Caché de Next.js retirada");
  } catch {
    console.log(
      "⚠ No se pudo retirar .next; detén el servidor antes de reiniciar.",
    );
  }
}

console.log("");
console.log("✅ EL GRAN AVATAR ESTÁ PREPARADO PARA VIVIR");
console.log(`Archivos añadidos: ${counts.added}`);
console.log(`Archivos actualizados: ${counts.updated}`);
console.log(`Archivos sin cambios: ${counts.unchanged}`);
console.log(`Backups: ${backedUp.size}`);
if (backedUp.size > 0) console.log(`Carpeta: ${backupDirectory}`);
console.log("");
console.log(
  "Lee: material-avatar/gran-avatar/CONFIGURAR-VIDA.txt",
);
console.log(
  "Retrato: material-avatar/gran-avatar/retrato-fuente-liveavatar-1920x1080.png",
);
console.log("");
console.log("No se modificó .env.local ni se creó ninguna tabla.");
console.log("Reinicia con: npm run dev");
console.log(
  "Ruta: http://localhost:3000/poema-universal/gran-avatar",
);
console.log("");
