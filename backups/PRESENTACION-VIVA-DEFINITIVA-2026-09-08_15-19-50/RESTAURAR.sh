#!/bin/bash
set -e

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$HOME/poema-universal"

APP="$ROOT/app/poema-universal/presentacion-viva-v2"
ASSETS="$ROOT/public/poema-universal/presentacion-viva/assets"

echo "Restaurando PRESENTACIÓN VIVA..."

rm -rf "$APP"
cp -R "$HERE/app/presentacion-viva-v2" "$APP"

if [ -d "$HERE/public/story-master" ]; then
  rm -rf "$ASSETS/story-master"
  cp -R "$HERE/public/story-master" "$ASSETS/story-master"
fi

if [ -d "$HERE/public/story-cutouts" ]; then
  rm -rf "$ASSETS/story-cutouts"
  cp -R "$HERE/public/story-cutouts" "$ASSETS/story-cutouts"
fi

echo
echo "✓ PRESENTACIÓN VIVA restaurada"
echo "✓ código restaurado"
echo "✓ assets restaurados"
echo
echo "Ruta:"
echo "http://localhost:3000/poema-universal/presentacion-viva-v2"
