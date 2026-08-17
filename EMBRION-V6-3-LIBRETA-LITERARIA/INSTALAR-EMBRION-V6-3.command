#!/bin/bash
set -euo pipefail

source_dir="$(cd "$(dirname "$0")" && pwd)"
target_dir="${1:-$HOME/poema-universal}"
payload="$source_dir/PAYLOAD"
ts="$(date +%Y%m%d-%H%M%S)"
backup="$target_dir/backups/embrion-v6-3-libreta-literaria-$ts"

files=(
  "app/laboratorio/verso-tecno/OrganismoV47.tsx"
  "app/laboratorio/verso-tecno/organismo-v47.module.css"
  "app/laboratorio/verso-tecno/organismo/WordArchive.tsx"
  "app/laboratorio/verso-tecno/organismo/SymbolicImpulseConsole.tsx"
  "app/laboratorio/verso-tecno/organismo/LiteraryNotebook.tsx"
)

echo ""
echo "EMBRIÓN V6.3 · LIBRETA LITERARIA"
echo "=================================="

if [[ ! -f "$target_dir/package.json" ]]; then
  echo "❌ No encuentro Poema Universal en $target_dir"
  exit 1
fi

base="$target_dir/app/laboratorio/verso-tecno/OrganismoV47.tsx"
if [[ ! -f "$base" ]]; then
  echo "❌ No encuentro OrganismoV47.tsx"
  exit 1
fi

if ! grep -q 'V6.2.2 · ACCESO INTERIOR' "$base"; then
  echo "❌ Este instalador necesita Embrión V6.2.2 instalado."
  echo "   Primero instala el parche de acceso al interior."
  exit 1
fi

mkdir -p "$backup"
for file in "${files[@]}"; do
  if [[ -f "$target_dir/$file" ]]; then
    mkdir -p "$backup/$(dirname "$file")"
    cp -p "$target_dir/$file" "$backup/$file"
  fi
  mkdir -p "$target_dir/$(dirname "$file")"
  cp -p "$payload/$file" "$target_dir/$file"
done

if ! grep -q 'V6.3 · LIBRETA LITERARIA' "$target_dir/app/laboratorio/verso-tecno/OrganismoV47.tsx"; then
  echo "❌ No se pudo verificar la integración de la libreta."
  exit 1
fi

if ! grep -q 'LIBRETA DE ESCRITURA' "$target_dir/app/laboratorio/verso-tecno/organismo/LiteraryNotebook.tsx"; then
  echo "❌ No se pudo verificar LiteraryNotebook.tsx"
  exit 1
fi

if ! grep -q 'ENVIAR A LIBRETA' "$target_dir/app/laboratorio/verso-tecno/organismo/SymbolicImpulseConsole.tsx"; then
  echo "❌ La consola no quedó conectada con la libreta."
  exit 1
fi

if ! grep -q 'LLEVAR SECUENCIA A LA LIBRETA' "$target_dir/app/laboratorio/verso-tecno/organismo/WordArchive.tsx"; then
  echo "❌ La mesa de montaje no quedó conectada con la libreta."
  exit 1
fi

echo "✓ Libreta editorial añadida debajo del organismo"
echo "✓ Espejo de Membrana visible mientras escribes"
echo "✓ Palabras, símbolos, imágenes, materias, verbos y tensiones insertables al cursor"
echo "✓ Páginas múltiples + título + contador"
echo "✓ Autoguardado local independiente de la alimentación verbal"
echo "✓ Exportación de cada página como .TXT"
echo "✓ Consola simbólica → Libreta"
echo "✓ Mesa de montaje → Libreta"
echo "✓ Alimentación verbal continúa separada y funcional"
echo "✓ Membrana, vivero, corpus y controles V6.2.2 permanecen intactos"
echo ""
echo "✅ EMBRIÓN V6.3 INSTALADO"
echo "Backup: $backup"
echo ""
echo "Reinicia Next.js y abre:"
echo "http://localhost:3000/laboratorio/verso-tecno"
