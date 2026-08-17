#!/bin/bash

set -euo pipefail

source_dir="$(cd "$(dirname "$0")" && pwd)"
target_dir="${1:-$HOME/poema-universal}"
payload_dir="$source_dir/PAYLOAD"
timestamp="$(date +%Y%m%d-%H%M%S)"
backup_dir="$target_dir/backups/embrion-v6-1-membrana-palabras-$timestamp"

files=(
  "app/laboratorio/verso-tecno/page.tsx"
  "app/laboratorio/verso-tecno/OrganismoV47.tsx"
  "app/laboratorio/verso-tecno/organismo-v47.module.css"
  "app/laboratorio/verso-tecno/organismo/SymbolicImpulseConsole.tsx"
  "app/laboratorio/verso-tecno/organismo/WordArchive.tsx"
)

echo ""
echo "EMBRIÓN V6.1 · MEMBRANA DE LAS PALABRAS"
echo "========================================="
echo ""

if [[ ! -f "$target_dir/package.json" ]]; then
  echo "❌ No encuentro Poema Universal en:"
  echo "   $target_dir"
  exit 1
fi

if [[ ! -f "$target_dir/lib/embrion/corpus-symbolic-index.ts" ]] || \
   ! grep -q '"sourceCount": 10' "$target_dir/lib/embrion/corpus-symbolic-index.ts"; then
  echo "❌ Esta actualización necesita Embrión V6 instalado."
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

organism_file="$target_dir/app/laboratorio/verso-tecno/OrganismoV47.tsx"
archive_file="$target_dir/app/laboratorio/verso-tecno/organismo/WordArchive.tsx"
css_file="$target_dir/app/laboratorio/verso-tecno/organismo-v47.module.css"

if ! grep -q 'SYMBOLIC_ARCHIVE_STORAGE' "$organism_file" || \
   ! grep -q '<WordArchive' "$organism_file" || \
   ! grep -q 'MEMBRANA DE LAS PALABRAS' "$archive_file"; then
  echo "❌ La membrana de palabras no pudo verificarse."
  echo "   Copia de seguridad: $backup_dir"
  exit 1
fi

if grep -q 'POEMA / PARTITURA VIVA' "$organism_file" || \
   grep -q 'className={styles.notationField}' "$organism_file"; then
  echo "❌ El poema o las barras sonoras siguen en la vista activa."
  echo "   Copia de seguridad: $backup_dir"
  exit 1
fi

if ! grep -q 'EMBRIÓN V6.1 · UNIVERSO TOTAL' "$css_file" || \
   ! grep -q 'min-height: clamp(720px, 74vh, 940px)' "$css_file" || \
   ! grep -q 'inset: 0 !important' "$css_file"; then
  echo "❌ La expansión de la cámara no pudo verificarse."
  echo "   Copia de seguridad: $backup_dir"
  exit 1
fi

echo "✓ Universo verde expandido hasta el marco completo"
echo "✓ Embrión 3D centrado en la cámara"
echo "✓ Poema anterior retirado de la interfaz"
echo "✓ Barras sonoras inferiores retiradas"
echo "✓ Membrana inferior creada"
echo "✓ Cada aparición se archiva automáticamente"
echo "✓ Seis estratos simbólicos navegables"
echo "✓ Las palabras archivadas pueden volver a ejercer gravedad"
echo "✓ Archivo persistente en el navegador"
echo ""
echo "✅ EMBRIÓN V6.1 ESTÁ INSTALADO"
echo ""
echo "Copia de seguridad:"
echo "$backup_dir"
echo ""
echo "Reinicia Next.js y abre:"
echo "http://localhost:3000/embrion"
echo ""
