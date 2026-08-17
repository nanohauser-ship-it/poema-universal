import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

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

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  throw new Error("Faltan las credenciales de Supabase.");
}

const supabase = createClient(url, serviceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const manifestPath = path.resolve(
  process.cwd(),
  "public/artistas/portadas/manifest-001-050.json"
);

if (!fs.existsSync(manifestPath)) {
  throw new Error(`No existe ${manifestPath}`);
}

const manifest = JSON.parse(
  fs.readFileSync(manifestPath, "utf8")
);

if (!Array.isArray(manifest) || manifest.length !== 50) {
  throw new Error(
    `El manifiesto debería tener 50 entradas y tiene ${
      Array.isArray(manifest) ? manifest.length : "formato inválido"
    }.`
  );
}

let actualizados = 0;
const noEncontrados = [];

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
    noEncontrados.push(`${item.code} · ${item.name}`);
    continue;
  }

  actualizados += data.length;

  console.log(
    `✓ ${item.code} · ${item.name} → ${item.publicPath}`
  );
}

console.log("");
console.log("══════════════════════════════════════════════");
console.log(`✅ Fichas actualizadas: ${actualizados}`);
console.log(`⚠️ No encontradas: ${noEncontrados.length}`);
console.log("══════════════════════════════════════════════");

if (noEncontrados.length > 0) {
  console.log("");

  for (const nombre of noEncontrados) {
    console.log(`- ${nombre}`);
  }

  process.exitCode = 2;
}
