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
  fail("El instalador está incompleto: no se encontró la carpeta payload.");
}

const packagePath = path.join(targetDirectory, "package.json");
const avatarRoute = path.join(
  targetDirectory,
  "app/poema-universal/gran-avatar",
);

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
const requiredDependencies = [
  "@react-three/drei",
  "@react-three/fiber",
  "three",
];
const missingDependencies = requiredDependencies.filter(
  (dependency) => !dependencies[dependency],
);

if (missingDependencies.length > 0) {
  fail(
    "Faltan dependencias que este proyecto ya debería contener: " +
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
  `gran-avatar-organismo-${timestamp}`,
);
const files = listFiles(payloadDirectory);
const manifest = {
  version: "1.0.0",
  createdAt: new Date().toISOString(),
  targetDirectory,
  files: [],
};

fs.mkdirSync(backupDirectory, { recursive: true });

// Primera pasada: todas las copias de seguridad quedan terminadas antes de
// escribir un solo archivo de la nueva versión.
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

// Segunda pasada: integración no destructiva del organismo.
for (const relativePath of files) {
  const sourcePath = path.join(payloadDirectory, relativePath);
  const destinationPath = path.join(targetDirectory, relativePath);
  fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
  fs.copyFileSync(sourcePath, destinationPath);
}

console.log("\n===== EL GRAN AVATAR · ORGANISMO PROPIO =====");
console.log(`Proyecto: ${targetDirectory}`);
console.log(`Archivos integrados: ${files.length}`);
console.log(`Copia de seguridad: ${backupDirectory}`);
console.log("No se modificó .env.local, Supabase ni package.json.");
console.log("LiveAvatar permanece disponible como respaldo, pero ya no es el cuerpo predeterminado.");
console.log("\nReinicia con: npm run dev -- --webpack -p 3000");
console.log("Ruta: http://localhost:3000/poema-universal/gran-avatar\n");
