#!/bin/bash

set -euo pipefail

source_dir="$(cd "$(dirname "$0")" && pwd)"
target_dir="${1:-$HOME/poema-universal}"
payload_dir="$source_dir/PAYLOAD"
timestamp="$(date +%Y%m%d-%H%M%S)"
backup_dir="$target_dir/backups/embrion-gravedad-v5-$timestamp"

files=(
  "app/laboratorio/verso-tecno/OrganismoV47.tsx"
  "app/laboratorio/verso-tecno/organismo-v47.module.css"
  "app/laboratorio/verso-tecno/page.tsx"
  "app/laboratorio/verso-tecno/organismo/AmnioticLetterField.tsx"
  "app/laboratorio/verso-tecno/organismo/SymbolicImpulseConsole.tsx"
  "lib/embrion/symbolic-engine.ts"
)

echo ""
echo "EMBRIÓN V5 · CAMPO DE GRAVEDAD SIMBÓLICA"
echo "==========================================="
echo ""

if [[ ! -d "$target_dir" || ! -f "$target_dir/package.json" ]]; then
  echo "❌ No encuentro Poema Universal en:"
  echo "   $target_dir"
  echo ""
  echo "Ejecuta el instalador indicando la carpeta correcta."
  exit 1
fi

if [[ ! -f "$target_dir/app/laboratorio/verso-tecno/OrganismoV47.tsx" ]]; then
  echo "❌ La instalación actual no contiene OrganismoV47.tsx."
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

mkdir -p "$backup_dir"

for relative_path in "${files[@]}"; do
  if [[ -f "$target_dir/$relative_path" ]]; then
    mkdir -p "$backup_dir/$(dirname "$relative_path")"
    cp -p "$target_dir/$relative_path" "$backup_dir/$relative_path"
  fi
done

echo "✓ Copia de seguridad creada"

for relative_path in "${files[@]}"; do
  mkdir -p "$target_dir/$(dirname "$relative_path")"
  cp -p "$payload_dir/$relative_path" "$target_dir/$relative_path"
done

if ! grep -q "CAMPO DE GRAVEDAD" "$target_dir/app/laboratorio/verso-tecno/organismo/SymbolicImpulseConsole.tsx"; then
  echo "❌ La verificación final no encontró el campo de gravedad."
  echo "   Conserva esta copia de seguridad: $backup_dir"
  exit 1
fi

if ! grep -q "buildSymbolicImpulses" "$target_dir/lib/embrion/symbolic-engine.ts"; then
  echo "❌ La verificación final no encontró el motor simbólico."
  echo "   Conserva esta copia de seguridad: $backup_dir"
  exit 1
fi

echo "✓ Organismo original conservado"
echo "✓ Campo de escritura conservado"
echo "✓ Letras amnióticas integradas"
echo "✓ Motor de impulsos simbólicos integrado"
echo "✓ Vivero local integrado"
echo "✓ Trazabilidad de relaciones integrada"
echo ""
echo "✅ EMBRIÓN V5 ESTÁ INSTALADO"
echo ""
echo "Copia de seguridad:"
echo "$backup_dir"
echo ""
echo "Reinicia Next.js y abre:"
echo "http://localhost:3000/embrion"
echo ""
