import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

/* CARGAR .ENV.LOCAL */

const envPath = path.resolve(process.cwd(), ".env.local");

if (!fs.existsSync(envPath)) {
  throw new Error("No existe .env.local");
}

for (const rawLine of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
  const line = rawLine.trim();

  if (!line || line.startsWith("#")) continue;

  const separator = line.indexOf("=");

  if (separator === -1) continue;

  const key = line.slice(0, separator).trim();
  let value = line.slice(separator + 1).trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  if (!process.env[key]) {
    process.env[key] = value;
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY"
  );
}

const supabase = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

const manifestPath = path.resolve(
  process.cwd(),
  "public/artistas/portadas/manifest-051-100.json"
);

const manifest = JSON.parse(
  fs.readFileSync(manifestPath, "utf8")
);

if (!Array.isArray(manifest) || manifest.length !== 50) {
  throw new Error(
    `El manifiesto debería contener 50 entradas. Contiene ${
      Array.isArray(manifest) ? manifest.length : "un formato inválido"
    }.`
  );
}

let updated = 0;
const notFound = [];

for (const item of manifest) {
  const { data, error } = await supabase
    .from("artistas")
    .update({
      imagen_url: item.publicPath,
      foto_url: item.publicPath,
    })
    .eq("nombre", item.name)
    .select("id, nombre");

  if (error) {
    throw new Error(
      `${item.code} · ${item.name}: ${error.message}`
    );
  }

  if (!data || data.length === 0) {
    notFound.push(`${item.code} · ${item.name}`);
    continue;
  }

  updated += data.length;

  console.log(
    `✓ ${item.code} · ${item.name} → ${item.publicPath}`
  );
}

console.log("");
console.log("══════════════════════════════════════════════");
console.log(`✅ Fichas actualizadas: ${updated}`);
console.log(`⚠️ No encontradas: ${notFound.length}`);
console.log("══════════════════════════════════════════════");

if (notFound.length > 0) {
  console.log("");
  console.log("Nombres no encontrados exactamente en Supabase:");

  for (const name of notFound) {
    console.log(`- ${name}`);
  }

  process.exitCode = 2;
}
