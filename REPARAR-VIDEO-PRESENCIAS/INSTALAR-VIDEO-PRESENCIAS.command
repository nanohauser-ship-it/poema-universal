#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="${1:-$HOME/poema-universal}"
SOURCE_DIR="$SCRIPT_DIR/payload/app/poema-universal/presencias"
DEST_DIR="$TARGET_DIR/app/poema-universal/presencias"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="$TARGET_DIR/backups/presencias-video-$STAMP"

FILES=(
  "[slug]/page.tsx"
  "components/PresenceArchive.tsx"
  "components/PresenceFilm.tsx"
  "components/PresencePortrait.tsx"
  "lib/presenceVideoStore.ts"
  "presence.module.css"
)

echo ""
echo "===== LAS 60 PRESENCIAS · REPARACIÓN DE VÍDEO ====="
echo "Proyecto: $TARGET_DIR"
echo ""

if [ ! -f "$TARGET_DIR/package.json" ]; then
  echo "❌ No se encontró Poema Universal en:"
  echo "   $TARGET_DIR"
  echo ""
  echo "Ejecuta así:"
  echo "bash \"$0\" \"$HOME/poema-universal\""
  exit 1
fi

if [ ! -d "$DEST_DIR" ]; then
  echo "❌ No existe la sala Las 60 Presencias en:"
  echo "   $DEST_DIR"
  exit 1
fi

for RELATIVE_PATH in "${FILES[@]}"; do
  if [ ! -f "$SOURCE_DIR/$RELATIVE_PATH" ]; then
    echo "❌ El instalador está incompleto: falta $RELATIVE_PATH"
    exit 1
  fi
done

mkdir -p "$BACKUP_DIR"

for RELATIVE_PATH in "${FILES[@]}"; do
  SOURCE_FILE="$SOURCE_DIR/$RELATIVE_PATH"
  DEST_FILE="$DEST_DIR/$RELATIVE_PATH"
  BACKUP_FILE="$BACKUP_DIR/app/poema-universal/presencias/$RELATIVE_PATH"

  if [ -f "$DEST_FILE" ]; then
    mkdir -p "$(dirname -- "$BACKUP_FILE")"
    cp -p "$DEST_FILE" "$BACKUP_FILE"
  fi

  mkdir -p "$(dirname -- "$DEST_FILE")"
  cp -p "$SOURCE_FILE" "$DEST_FILE"
  echo "✓ $RELATIVE_PATH"
done

if [ ! -f "$DEST_DIR/lib/presenceVideoStore.ts" ]; then
  echo "❌ No se pudo instalar el almacén local de vídeo."
  exit 1
fi

if ! grep -q "Anexar película" "$DEST_DIR/components/PresenceFilm.tsx"; then
  echo "❌ No se pudo instalar el botón de película."
  exit 1
fi

if [ -d "$TARGET_DIR/.next" ]; then
  rm -rf "$TARGET_DIR/.next"
fi

echo ""
echo "✅ REPARACIÓN COMPLETADA"
echo "✅ Botón «Anexar película» instalado"
echo "✅ Vídeo situado junto al poema"
echo "✅ Persistencia individual preparada para las 60 presencias"
echo ""
echo "Backup: $BACKUP_DIR"
echo ""
echo "Ahora ejecuta:"
echo "cd \"$TARGET_DIR\""
echo "npm run dev"
echo ""
