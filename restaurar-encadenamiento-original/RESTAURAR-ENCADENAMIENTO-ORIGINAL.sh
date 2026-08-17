#!/bin/bash

set -euo pipefail

source_dir="$(cd "$(dirname "$0")" && pwd)"
target_dir="${POEMA_UNIVERSAL_DIR:-$HOME/poema-universal}"
timestamp="$(date +%Y%m%d-%H%M%S)"
backup_dir="$target_dir/.backups/encadenamiento-original-$timestamp"

if [ ! -f "$target_dir/package.json" ]; then
  echo "No se encontró Poema Universal en: $target_dir"
  echo "Abre Terminal dentro de la carpeta correcta y vuelve a ejecutar el restaurador."
  exit 1
fi

files=(
  "app/poema-universal/encadenamiento/page.tsx"
  "app/poema-universal/encadenamiento/Encadenamiento.tsx"
  "app/api/poema-universal/encadenamiento/route.ts"
  "supabase/migrations/20260810150000_expand_poema_universal_vertebrae_fragments.sql"
  "public/encadenamiento-original.css"
  "public/encadenamiento-background.png"
  "public/encadenamiento-warehouse.hdr"
)

echo "Restaurando la Habitación del Encadenamiento original…"

for relative_path in "${files[@]}"; do
  source_path="$source_dir/$relative_path"
  target_path="$target_dir/$relative_path"

  if [ ! -f "$source_path" ]; then
    echo "Falta un archivo del restaurador: $relative_path"
    exit 1
  fi

  if [ -f "$target_path" ]; then
    mkdir -p "$backup_dir/$(dirname "$relative_path")"
    cp -p "$target_path" "$backup_dir/$relative_path"
  fi

  mkdir -p "$(dirname "$target_path")"
  cp -p "$source_path" "$target_path"
done

echo ""
echo "✅ Habitación del Encadenamiento original restaurada."
echo "✅ Sala circular, doce vértebras 3D, espiral dorada y libro móvil recuperados."
echo "✅ El resto de Poema Universal no se ha modificado."
echo "✅ Copia de seguridad: $backup_dir"
echo ""
echo "Abre o recarga:"
echo "http://localhost:3000/poema-universal/encadenamiento"
echo ""
echo "Después aplica en Supabase esta migración breve:"
echo "$target_dir/supabase/migrations/20260810150000_expand_poema_universal_vertebrae_fragments.sql"
