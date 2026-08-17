import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const payloadDirectory = path.join(scriptDirectory, "payload");
const targetDirectory = path.resolve(process.argv[2] ?? path.join(os.homedir(), "poema-universal"));

function fail(message) { console.error(`\n✗ ${message}\n`); process.exit(1); }
function listFiles(directory, prefix = "") {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const rel = path.join(prefix, entry.name);
    const abs = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(abs, rel) : [rel];
  }).sort();
}

if (!fs.existsSync(path.join(targetDirectory, "package.json")) || !fs.existsSync(path.join(targetDirectory, "app/poema-universal/gran-avatar"))) {
  fail(`La carpeta no parece ser Poema Universal: ${targetDirectory}`);
}

const timestamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
const backupDirectory = path.join(targetDirectory, "backups", `gran-avatar-v5-3-pensamiento-${timestamp}`);
const files = listFiles(payloadDirectory);
fs.mkdirSync(backupDirectory, { recursive: true });

for (const rel of files) {
  const dst = path.join(targetDirectory, rel);
  if (fs.existsSync(dst) && fs.statSync(dst).isFile()) {
    const backup = path.join(backupDirectory, rel);
    fs.mkdirSync(path.dirname(backup), { recursive: true });
    fs.copyFileSync(dst, backup);
  }
}

for (const rel of files) {
  const src = path.join(payloadDirectory, rel);
  const dst = path.join(targetDirectory, rel);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
}

console.log("\n===== EL GRAN AVATAR · V5.3 PENSAMIENTO INICIAL =====");
console.log(`Proyecto: ${targetDirectory}`);
console.log(`Archivos integrados: ${files.length}`);
console.log(`Copia de seguridad: ${backupDirectory}`);
console.log("✓ Añadido botón Pensamiento inicial");
console.log("✓ Reflexión inicial conectada a la voz del avatar");
console.log("✓ Voz Cedar · gpt-4o-mini-tts · 0.92×");
console.log("✓ No se toca Supabase, .env.local ni package.json");
console.log("\nReinicia con: npm run dev -- --webpack -p 3000\n");
