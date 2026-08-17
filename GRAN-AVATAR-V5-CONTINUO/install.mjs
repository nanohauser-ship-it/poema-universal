import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const payloadDirectory = path.join(scriptDirectory, "payload");
const targetDirectory = path.resolve(
  process.argv[2] ?? path.join(os.homedir(), "poema-universal"),
);

function fail(message) {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
}

function listFiles(directory, prefix = "") {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const relativePath = path.join(prefix, entry.name);
      const absolutePath = path.join(directory, entry.name);
      return entry.isDirectory()
        ? listFiles(absolutePath, relativePath)
        : [relativePath];
    })
    .sort();
}

if (!fs.existsSync(payloadDirectory)) {
  fail("El instalador está incompleto: no se encontró payload.");
}

const packagePath = path.join(targetDirectory, "package.json");
const avatarRoute = path.join(targetDirectory, "app/poema-universal/gran-avatar");

if (!fs.existsSync(packagePath) || !fs.existsSync(avatarRoute)) {
  fail(
    `La carpeta no parece ser Poema Universal: ${targetDirectory}\n` +
      "Indica la ruta correcta como primer argumento.",
  );
}

const timestamp = new Date()
  .toISOString()
  .replace(/[-:]/g, "")
  .replace(/\.\d{3}Z$/, "Z");
const backupDirectory = path.join(
  targetDirectory,
  "backups",
  `gran-avatar-v5-continuo-${timestamp}`,
);
const files = listFiles(payloadDirectory);
const manifest = {
  version: "5.0.0-continuous-body-zero-cuts",
  createdAt: new Date().toISOString(),
  targetDirectory,
  files: [],
};

fs.mkdirSync(backupDirectory, { recursive: true });

for (const relativePath of files) {
  const destinationPath = path.join(targetDirectory, relativePath);
  const existed = fs.existsSync(destinationPath);
  manifest.files.push({ path: relativePath, existed });

  if (!existed) continue;
  if (!fs.statSync(destinationPath).isFile()) {
    fail(`El destino no es un archivo: ${destinationPath}`);
  }

  const backupPath = path.join(backupDirectory, relativePath);
  fs.mkdirSync(path.dirname(backupPath), { recursive: true });
  fs.copyFileSync(destinationPath, backupPath);
}

fs.writeFileSync(
  path.join(backupDirectory, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
);

for (const relativePath of files) {
  const sourcePath = path.join(payloadDirectory, relativePath);
  const destinationPath = path.join(targetDirectory, relativePath);
  fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
  fs.copyFileSync(sourcePath, destinationPath);
}

const envPath = path.join(targetDirectory, ".env.local");
let envMode = null;
if (fs.existsSync(envPath)) {
  const envText = fs.readFileSync(envPath, "utf8");
  const match = envText.match(/^NEXT_PUBLIC_GRAN_AVATAR_BODY_MODE\s*=\s*(.+)$/m);
  envMode = match?.[1]?.trim().replace(/^[\'"]|[\'"]$/g, "") ?? null;
}

console.log("\n===== EL GRAN AVATAR · V5 CUERPO CONTINUO =====");
console.log(`Proyecto: ${targetDirectory}`);
console.log(`Archivos integrados: ${files.length}`);
console.log(`Copia de seguridad: ${backupDirectory}`);
console.log("Cuerpo predeterminado: synchronized / V5");
console.log("Motor visual: UN solo vídeo maestro continuo para todos los estados");
console.log("Cambios de estado: sin seek, sin congelar, sin sustituir clips");
console.log("Voz: modifica muy suavemente la velocidad; nunca corta el cuerpo");
console.log("Cámara: busto, retrato, íntimo y laterales mediante movimientos lentos");
console.log("Visemas: permanecen disponibles para fases futuras, pero V5 no deforma la cara");
console.log("No se modificó .env.local, Supabase ni package.json.");
console.log("V4.1/V4/V3/V2, Organism V1 y LiveAvatar quedan disponibles como respaldo.");
if (envMode) {
  console.log(`\n⚠ .env.local fuerza NEXT_PUBLIC_GRAN_AVATAR_BODY_MODE=${envMode}`);
  if (envMode !== "synchronized") {
    console.log("  Para ver la V5, comenta o elimina únicamente esa variable.");
  }
}
console.log("\nReinicia con: npm run dev -- --webpack -p 3000");
console.log("Ruta: http://localhost:3000/poema-universal/gran-avatar");
console.log("Prueba primero la presencia sin hablar y luego una frase corta.\n");
