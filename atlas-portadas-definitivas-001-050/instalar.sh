#!/usr/bin/env bash
set -euo pipefail

PROJECT="$HOME/poema-universal"
PACKAGE_DIR="$(cd "$(dirname "$0")" && pwd)"
DEST="$PROJECT/public/artistas/portadas"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$PROJECT/public/artistas/portadas-backup-001-050-$STAMP"

if [ ! -d "$PROJECT" ]; then
  echo "❌ No existe el proyecto: $PROJECT"
  exit 1
fi

mkdir -p "$DEST"
mkdir -p "$BACKUP"

echo "===== COPIA DE SEGURIDAD ====="
find "$DEST" -maxdepth 1 -type f \
  \( -name 'AU-0[0-4][0-9]-*.webp' -o -name 'AU-050-*.webp' \) \
  -exec cp {} "$BACKUP"/ \;

echo "Guardada en: $BACKUP"

echo ""
echo "===== INSTALANDO AU-001 A AU-050 ====="
cp -f "$PACKAGE_DIR"/AU-*.webp "$DEST"/

# Si el componente antiguo todavía usa /visuales/, sincronizamos allí también.
if [ -d "$DEST/visuales" ]; then
  cp -f "$PACKAGE_DIR"/AU-*.webp "$DEST/visuales"/
  echo "También sincronizadas en: $DEST/visuales"
fi

rm -rf "$PROJECT/.next"

echo ""
echo "===== COMPROBACIÓN ====="
COUNT=$(find "$DEST" -maxdepth 1 -type f \
  \( -name 'AU-0[0-4][0-9]-*.webp' -o -name 'AU-050-*.webp' \) | wc -l | tr -d ' ')
echo "Portadas AU-001 a AU-050 encontradas: $COUNT"

if [ "$COUNT" -lt 50 ]; then
  echo "❌ Faltan portadas. No se ha completado correctamente."
  exit 2
fi

echo ""
echo "✅ Las 50 portadas nuevas quedaron implantadas."
echo "Ahora ejecuta:"
echo "cd ~/poema-universal && npm run dev"
echo ""
echo "Después abre:"
echo "http://localhost:3000/artistas"
echo "http://localhost:3000/artistas/portadas"
