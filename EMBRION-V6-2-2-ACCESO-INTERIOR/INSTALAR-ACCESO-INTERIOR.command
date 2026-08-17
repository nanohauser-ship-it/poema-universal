#!/bin/bash
set -euo pipefail
source_dir="$(cd "$(dirname "$0")" && pwd)"
target_dir="${1:-$HOME/poema-universal}"
payload="$source_dir/PAYLOAD"
ts="$(date +%Y%m%d-%H%M%S)"
backup="$target_dir/backups/embrion-v6-2-2-acceso-interior-$ts"
file="app/laboratorio/verso-tecno/OrganismoV47.tsx"

echo ""
echo "EMBRIÓN V6.2.2 · ACCESO AL INTERIOR"
echo "====================================="

if [[ ! -f "$target_dir/package.json" ]]; then
  echo "❌ No encuentro Poema Universal en $target_dir"
  exit 1
fi
if [[ ! -f "$target_dir/$file" ]]; then
  echo "❌ No encuentro OrganismoV47.tsx"
  exit 1
fi
if ! grep -q 'buildControlledSymbolicImpulses' "$target_dir/$file"; then
  echo "❌ Este parche necesita Embrión V6.2/V6.2.1 instalado."
  exit 1
fi

mkdir -p "$backup/$(dirname "$file")"
cp -p "$target_dir/$file" "$backup/$file"
cp -p "$payload/$file" "$target_dir/$file"

if ! grep -q 'V6.2.2 · ACCESO INTERIOR' "$target_dir/$file"; then
  echo "❌ No se pudo verificar el acceso al interior."
  exit 1
fi
if grep -q 'poem.trim().length < 12' "$target_dir/$file"; then
  echo "❌ Sigue presente el bloqueo de 12 caracteres."
  exit 1
fi

echo "✓ Eliminado el mínimo artificial de 12 caracteres"
echo "✓ Una sola palabra puede incubar un organismo"
echo "✓ ALMA puede engendrar presencia"
echo "✓ Los mensajes de validación ya se ven en la incubadora"
echo "✓ El estado creado entra directamente al interior"
echo "✓ Membrana, vivero, corpus y V6.2.1 permanecen intactos"
echo ""
echo "✅ EMBRIÓN V6.2.2 INSTALADO"
echo "Backup: $backup"
echo ""
echo "Reinicia Next.js y abre:"
echo "http://localhost:3000/laboratorio/verso-tecno"
