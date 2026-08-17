#!/bin/bash

set -euo pipefail

source_dir="$(cd "$(dirname "$0")" && pwd)"
target_dir="${POEMA_UNIVERSAL_DIR:-$HOME/poema-universal}"
timestamp="$(date +%Y%m%d-%H%M%S)"
backup_dir="$target_dir/.backups/columna-voces-$timestamp"

if [ ! -f "$target_dir/package.json" ]; then
  echo "No se encontró el proyecto en: $target_dir"
  echo "Si está en otra carpeta, ejecuta:"
  echo "POEMA_UNIVERSAL_DIR=/ruta/al/proyecto bash $0"
  exit 1
fi

files=(
  "app/page.tsx"
  "app/poema-universal/page.tsx"
  "app/poema-universal/PoemaUniversalPage.module.css"
  "app/poema-universal/encadenamiento/page.tsx"
  "app/poema-universal/encadenamiento/Encadenamiento.tsx"
  "app/poema-universal/encadenamiento/encadenamiento.module.css"
  "app/api/poema-universal/encadenamiento/route.ts"
  "supabase/migrations/20260810140000_create_poema_universal_vertebrae.sql"
)

echo "Integrando la Columna de las Voces…"

for relative_path in "${files[@]}"; do
  source_path="$source_dir/$relative_path"
  target_path="$target_dir/$relative_path"

  if [ ! -f "$source_path" ]; then
    echo "Falta un archivo del instalador: $relative_path"
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
echo "✅ Sala integrada en la web."
echo "✅ Acceso añadido a la portada y a Poema Universal 2026."
echo "✅ API permanente y migración de Supabase incorporadas."
echo "✅ Copia de seguridad: $backup_dir"
echo ""
echo "Ruta de la sala:"
echo "http://localhost:3000/poema-universal/encadenamiento"
echo ""
echo "Para activar el archivo compartido de voces, aplica esta migración:"
echo "$target_dir/supabase/migrations/20260810140000_create_poema_universal_vertebrae.sql"
echo ""

cd "$target_dir"

if npx tsc --noEmit --pretty false; then
  echo "✅ TypeScript verificado."
else
  echo "⚠️ La instalación terminó, pero el proyecto ya contiene avisos de TypeScript que conviene revisar."
fi
