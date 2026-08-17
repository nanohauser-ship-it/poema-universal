#!/bin/bash
set -euo pipefail

source_dir="$(cd "$(dirname "$0")" && pwd)"
target_dir="${1:-$HOME/poema-universal}"
payload="$source_dir/PAYLOAD"
ts="$(date +%Y%m%d-%H%M%S)"
backup="$target_dir/backups/embrion-v6-3-1-margenes-vivos-$ts"

files=(
  "app/laboratorio/verso-tecno/organismo-v47.module.css"
  "app/laboratorio/verso-tecno/organismo/LiteraryNotebook.tsx"
)

echo ""
echo "EMBRIÓN V6.3.1 · MÁRGENES VIVOS"
echo "=================================="

if [[ ! -f "$target_dir/package.json" ]]; then
  echo "❌ No encuentro Poema Universal en $target_dir"
  exit 1
fi

notebook="$target_dir/app/laboratorio/verso-tecno/organismo/LiteraryNotebook.tsx"
if [[ ! -f "$notebook" ]] || ! grep -q 'LIBRETA DE ESCRITURA' "$notebook"; then
  echo "❌ No encuentro Embrión V6.3 · Libreta Literaria."
  echo "   Instala primero la V6.3."
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

if ! grep -q 'V6.3.1 · MÁRGENES VIVOS' "$notebook"; then
  echo "❌ No se pudo verificar LiteraryNotebook.tsx"
  exit 1
fi

if ! grep -q 'notebookSediments' "$target_dir/app/laboratorio/verso-tecno/organismo-v47.module.css"; then
  echo "❌ No se pudo verificar el margen de sedimentos."
  exit 1
fi

echo "✓ Espejo de la Membrana compactado"
echo "✓ Microviaje de cada forma hasta el cursor"
echo "✓ Destello de depósito al seleccionar una forma"
echo "✓ Margen de 7 sedimentos recientes sobre el papel"
echo "✓ Sedimentos reutilizables con un clic"
echo "✓ Sedimentos y páginas conservados en el mismo autoguardado local"
echo "✓ No modifica corpus, motor simbólico, Membrana ni estado del organismo"
echo ""
echo "✅ EMBRIÓN V6.3.1 INSTALADO"
echo "Backup: $backup"
echo ""
echo "Reinicia Next.js y abre:"
echo "http://localhost:3000/laboratorio/verso-tecno"
