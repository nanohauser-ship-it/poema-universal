#!/usr/bin/env bash
set -euo pipefail

PROJECT="$HOME/poema-universal"
PACKAGE_DIR="$(cd "$(dirname "$0")" && pwd)"
DEST="$PROJECT/public/artistas/portadas"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$PROJECT/public/artistas/portadas-backup-lorca-moby-$STAMP"

if [ ! -d "$PROJECT" ]; then
  echo "❌ No existe el proyecto: $PROJECT"
  exit 1
fi

mkdir -p "$DEST"
mkdir -p "$BACKUP"

for FILE in \
  "AU-062-federico-garcia-lorca.webp" \
  "AU-065-moby.webp"
do
  if [ -f "$DEST/$FILE" ]; then
    cp "$DEST/$FILE" "$BACKUP/"
  fi
done

cp -f "$PACKAGE_DIR/AU-062-federico-garcia-lorca.webp" "$DEST/"
cp -f "$PACKAGE_DIR/AU-065-moby.webp" "$DEST/"

if [ -d "$DEST/visuales" ]; then
  cp -f "$PACKAGE_DIR/AU-062-federico-garcia-lorca.webp" "$DEST/visuales/"
  cp -f "$PACKAGE_DIR/AU-065-moby.webp" "$DEST/visuales/"
fi

rm -rf "$PROJECT/.next"

echo ""
echo "===== INSTALACIÓN COMPLETADA ====="
ls -lh \
  "$DEST/AU-062-federico-garcia-lorca.webp" \
  "$DEST/AU-065-moby.webp"

echo ""
echo "✅ Lorca y Moby instalados."
echo "Ahora ejecuta:"
echo "cd ~/poema-universal && npx next dev --webpack"
