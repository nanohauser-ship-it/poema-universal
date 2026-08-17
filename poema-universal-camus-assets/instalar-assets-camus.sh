#!/bin/bash
set -e

DEST="$HOME/poema-universal/public/artistas/camus"
mkdir -p "$DEST"
cp -R "$(cd "$(dirname "$0")" && pwd)/public/artistas/camus/." "$DEST/"

echo "✅ Imágenes instaladas en:"
echo "$DEST"
ls -lh "$DEST"
