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

const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const dependencies = {
  ...(packageJson.dependencies ?? {}),
  ...(packageJson.devDependencies ?? {}),
};
const requiredDependencies = ["next", "react", "openai", "@react-three/fiber", "three"];
const missingDependencies = requiredDependencies.filter((name) => !dependencies[name]);
if (missingDependencies.length > 0) {
  fail(
    "Faltan dependencias esperadas en Poema Universal: " +
      missingDependencies.join(", ") +
      ". No se modificó ningún archivo.",
  );
}

const timestamp = new Date()
  .toISOString()
  .replace(/[-:]/g, "")
  .replace(/\.\d{3}Z$/, "Z");
const backupDirectory = path.join(
  targetDirectory,
  "backups",
  `gran-avatar-v4-1-interpretacion-${timestamp}`,
);
const files = listFiles(payloadDirectory);
const manifest = {
  version: "4.1.0-video-interpretation-soft-sync",
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

console.log("\n===== EL GRAN AVATAR · V4.1 INTERPRETACIÓN =====");
console.log(`Proyecto: ${targetDirectory}`);
console.log(`Archivos integrados: ${files.length}`);
console.log(`Copia de seguridad: ${backupDirectory}`);
console.log("Cuerpo predeterminado: synchronized / V4.1");
console.log("Reposo / escucha / pensamiento / silencio: microvídeos orgánicos del vídeo maestro");
console.log("Lectura / respuesta: interpretación humana del nuevo clip Pippit");
console.log("Sincronización suave: la energía de la voz gobierna play/pausa y velocidad");
console.log("Visemas: ya no sustituyen la cara; solo modulan ligeramente el ritmo del vídeo");
console.log("Pausas: fundido a pose de boca cerrada para evitar congelaciones abiertas");
console.log("Cámara: busto, retrato, íntimo y laterales con transiciones lentas");
console.log("No se modificó .env.local, Supabase ni package.json.");
console.log("V4/V3/V2, Organism V1 y LiveAvatar siguen disponibles como respaldo.");
if (envMode) {
  console.log(`\n⚠ .env.local fuerza NEXT_PUBLIC_GRAN_AVATAR_BODY_MODE=${envMode}`);
  if (envMode !== "synchronized") {
    console.log("  Para ver la V4.1, comenta o elimina únicamente esa variable.");
  }
}
console.log("\nReinicia con: npm run dev -- --webpack -p 3000");
console.log("Ruta: http://localhost:3000/poema-universal/gran-avatar");
console.log("Prueba primero una frase de 6–12 segundos; después una recitación más larga.\n");
