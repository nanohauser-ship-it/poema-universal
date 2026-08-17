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
const requiredDependencies = ["next", "react", "@react-three/fiber", "three"];
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
  `gran-avatar-cinematico-v2-${timestamp}`,
);
const files = listFiles(payloadDirectory);
const manifest = {
  version: "2.0.0-experimental",
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
  envMode = match?.[1]?.trim().replace(/^['"]|['"]$/g, "") ?? null;
}

console.log("\n===== EL GRAN AVATAR · V2 CINEMATOGRÁFICA =====");
console.log(`Proyecto: ${targetDirectory}`);
console.log(`Archivos integrados: ${files.length}`);
console.log(`Copia de seguridad: ${backupDirectory}`);
console.log("Cuerpo predeterminado: cinematic");
console.log("Reposo: retrato maestro limpio");
console.log("Escucha: película experimental");
console.log("Lectura / respuesta: película parlante experimental silenciada");
console.log("La voz real de Poema Universal sigue saliendo por la API de voz.");
console.log("No se modificó .env.local, Supabase, package.json ni las rutas API.");
console.log("Organism V1 y LiveAvatar siguen disponibles como respaldo.");
if (envMode) {
  console.log(`\n⚠ .env.local fuerza NEXT_PUBLIC_GRAN_AVATAR_BODY_MODE=${envMode}`);
  console.log("  Si no ves la V2, comenta o elimina únicamente esa variable.");
}
console.log("\nReinicia con: npm run dev -- --webpack -p 3000");
console.log("Ruta: http://localhost:3000/poema-universal/gran-avatar\n");
