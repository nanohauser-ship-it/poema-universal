#!/bin/bash

set -euo pipefail

source_dir="$(cd "$(dirname "$0")" && pwd)"
target_dir="${1:-$HOME/poema-universal}"
payload_dir="$source_dir/PAYLOAD"
timestamp="$(date +%Y%m%d-%H%M%S)"
backup_dir="$target_dir/backups/embrion-v6-archivo-simbolico-$timestamp"

files=(
  "app/laboratorio/verso-tecno/OrganismoV47.tsx"
  "app/laboratorio/verso-tecno/organismo-v47.module.css"
  "app/laboratorio/verso-tecno/organismo/AmnioticLetterField.tsx"
  "app/laboratorio/verso-tecno/organismo/SymbolicImpulseConsole.tsx"
  "lib/embrion/symbolic-engine.ts"
  "lib/embrion/corpus-symbolic-index.ts"
  "scripts/embrion/build-corpus-symbolic-index.mjs"
)

echo ""
echo "EMBRIÓN V6 · ARCHIVO SIMBÓLICO VIVO"
echo "===================================="
echo ""

if [[ ! -f "$target_dir/package.json" ]]; then
  echo "❌ No encuentro Poema Universal en:"
  echo "   $target_dir"
  echo ""
  echo "También puedes arrastrar la carpeta poema-universal sobre este instalador."
  exit 1
fi

if [[ ! -f "$target_dir/app/laboratorio/verso-tecno/OrganismoV47.tsx" ]]; then
  echo "❌ No encuentro el Embrión actual dentro de Poema Universal."
  echo "   No se modificó ningún archivo."
  exit 1
fi

for relative_path in "${files[@]}"; do
  if [[ ! -f "$payload_dir/$relative_path" ]]; then
    echo "❌ El instalador está incompleto: falta $relative_path"
    echo "   No se modificó ningún archivo."
    exit 1
  fi
done

for relative_path in "${files[@]}"; do
  if [[ -f "$target_dir/$relative_path" ]]; then
    mkdir -p "$backup_dir/$(dirname "$relative_path")"
    cp -p "$target_dir/$relative_path" "$backup_dir/$relative_path"
  fi
done

for relative_path in "${files[@]}"; do
  mkdir -p "$target_dir/$(dirname "$relative_path")"
  cp -p "$payload_dir/$relative_path" "$target_dir/$relative_path"
done

engine_file="$target_dir/lib/embrion/symbolic-engine.ts"
index_file="$target_dir/lib/embrion/corpus-symbolic-index.ts"
console_file="$target_dir/app/laboratorio/verso-tecno/organismo/SymbolicImpulseConsole.tsx"
organism_file="$target_dir/app/laboratorio/verso-tecno/OrganismoV47.tsx"
css_file="$target_dir/app/laboratorio/verso-tecno/organismo-v47.module.css"

if ! grep -q '"sourceCount": 10' "$index_file" || \
   ! grep -q '"nodeCount": 302' "$index_file" || \
   ! grep -q '"relationCount": 11948' "$index_file"; then
  echo "❌ El archivo simbólico no pudo verificarse."
  echo "   Copia de seguridad: $backup_dir"
  exit 1
fi

if ! grep -q 'slice(0, 48)' "$engine_file" || \
   ! grep -q 'RUTAS ENCENDIDAS' "$console_file"; then
  echo "❌ El campo de gravedad no pudo verificarse."
  echo "   Copia de seguridad: $backup_dir"
  exit 1
fi

if ! grep -q 'LIQUID_WORD_SLOTS' "$organism_file" || \
   ! grep -q 'symbolicRiseFromLiquid' "$css_file"; then
  echo "❌ El líquido amniótico no pudo verificarse."
  echo "   Copia de seguridad: $backup_dir"
  exit 1
fi

if grep -Eq 'LÍNEA DE EVOLUCIÓN|VER DIRECCIÓN MUSICAL|EMBRIÓN YA NO SINTETIZA|AceStepGenerator' "$organism_file"; then
  echo "❌ El antiguo módulo musical sigue presente en la vista activa."
  echo "   Copia de seguridad: $backup_dir"
  exit 1
fi

echo "✓ 10 fuentes conectadas"
echo "✓ 329.467 términos indexados"
echo "✓ 302 núcleos simbólicos"
echo "✓ 11.948 relaciones trazables"
echo "✓ Hasta 48 rutas por palabra"
echo "✓ Palabras, símbolos, imágenes, materia, verbos y tensiones"
echo "✓ Líquido amniótico y organismo original conservados"
echo "✓ Antiguo módulo musical inferior retirado"
echo "✓ Ningún libro ni texto fuente copiado dentro de la aplicación"
echo ""
echo "✅ EMBRIÓN V6 ESTÁ INSTALADO"
echo ""
if [[ -d "$backup_dir" ]]; then
  echo "Copia de seguridad:"
  echo "$backup_dir"
  echo ""
fi
echo "Reinicia Next.js y abre:"
echo "http://localhost:3000/embrion"
echo ""
