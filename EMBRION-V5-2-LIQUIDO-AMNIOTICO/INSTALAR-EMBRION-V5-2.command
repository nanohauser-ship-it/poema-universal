#!/bin/bash

set -euo pipefail

source_dir="$(cd "$(dirname "$0")" && pwd)"
target_dir="${1:-$HOME/poema-universal}"
payload_dir="$source_dir/PAYLOAD"
timestamp="$(date +%Y%m%d-%H%M%S)"
backup_dir="$target_dir/backups/embrion-v5-2-liquido-$timestamp"

files=(
  "app/laboratorio/verso-tecno/OrganismoV47.tsx"
  "app/laboratorio/verso-tecno/organismo-v47.module.css"
)

echo ""
echo "EMBRIÓN V5.2 · LÍQUIDO AMNIÓTICO VERBAL"
echo "=========================================="
echo ""

if [[ ! -f "$target_dir/package.json" ]]; then
  echo "❌ No encuentro Poema Universal en:"
  echo "   $target_dir"
  exit 1
fi

for relative_path in "${files[@]}"; do
  if [[ ! -f "$target_dir/$relative_path" ]]; then
    echo "❌ Falta el archivo actual: $relative_path"
    echo "   No se modificó ningún archivo."
    exit 1
  fi

  if [[ ! -f "$payload_dir/$relative_path" ]]; then
    echo "❌ El instalador está incompleto: falta $relative_path"
    echo "   No se modificó ningún archivo."
    exit 1
  fi
done

if ! grep -q "SymbolicImpulseConsole" "$target_dir/app/laboratorio/verso-tecno/OrganismoV47.tsx"; then
  echo "❌ Esta corrección necesita que Embrión V5 esté instalado."
  echo "   No se modificó ningún archivo."
  exit 1
fi

for relative_path in "${files[@]}"; do
  mkdir -p "$backup_dir/$(dirname "$relative_path")"
  cp -p "$target_dir/$relative_path" "$backup_dir/$relative_path"
done

for relative_path in "${files[@]}"; do
  cp -p "$payload_dir/$relative_path" "$target_dir/$relative_path"
done

tsx_file="$target_dir/app/laboratorio/verso-tecno/OrganismoV47.tsx"
css_file="$target_dir/app/laboratorio/verso-tecno/organismo-v47.module.css"

if ! grep -q "SEDIMENTO VERBAL" "$tsx_file" || ! grep -q "wordFallsIntoLiquid" "$css_file"; then
  echo "❌ No se pudo verificar el líquido amniótico."
  echo "   Copia de seguridad: $backup_dir"
  exit 1
fi

if grep -Eq "LÍNEA DE EVOLUCIÓN|VER DIRECCIÓN MUSICAL|EMBRIÓN YA NO SINTETIZA|AceStepGenerator" "$tsx_file"; then
  echo "❌ La limpieza del módulo musical no pudo verificarse."
  echo "   Copia de seguridad: $backup_dir"
  exit 1
fi

echo "✓ Embrión y escritura conservados"
echo "✓ Campo de gravedad conservado"
echo "✓ Depósito líquido integrado bajo el Embrión"
echo "✓ Caída física de palabras integrada"
echo "✓ Palabra-núcleo iluminada"
echo "✓ Sedimento verbal persistente tras entregar la materia"
echo "✓ Módulo musical inferior retirado"
echo ""
echo "✅ EMBRIÓN V5.2 ESTÁ INSTALADO"
echo ""
echo "Copia de seguridad:"
echo "$backup_dir"
echo ""
echo "Reinicia Next.js y abre:"
echo "http://localhost:3000/embrion"
echo ""
