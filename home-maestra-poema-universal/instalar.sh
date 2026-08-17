#!/usr/bin/env bash
set -eu

PROJECT="$HOME/poema-universal"
TARGET="$PROJECT/app/page.tsx"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SOURCE="$SCRIPT_DIR/page.tsx"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$PROJECT/backups/home-maestra-$STAMP"

if [ ! -f "$TARGET" ]; then
  echo "❌ No encuentro la home principal:"
  echo "$TARGET"
  exit 1
fi

if [ ! -f "$SOURCE" ]; then
  echo "❌ Falta page.tsx junto al instalador."
  exit 1
fi

REQUIRED=(
  "$PROJECT/app/components/HomeSupportGateway.tsx"
  "$PROJECT/app/components/HomeStoreGateway.tsx"
  "$PROJECT/app/components/HomeObraComunGateway.tsx"
)

for FILE in "${REQUIRED[@]}"; do
  if [ ! -f "$FILE" ]; then
    echo "❌ Falta el componente:"
    echo "$FILE"
    exit 1
  fi
done

mkdir -p "$BACKUP/app"
cp "$TARGET" "$BACKUP/app/page.tsx"
cp "$SOURCE" "$TARGET"

echo "✅ Nueva arquitectura de la home instalada."
echo "✅ Tres puertas principales creadas."
echo "✅ Salas públicas separadas."
echo "✅ Mi Habitación y Estado de la casa reunidos."
echo "✅ Colaboración, tienda y Obra Común ordenadas."

cd "$PROJECT"

echo ""
echo "===== VALIDACIÓN TYPESCRIPT ====="

if npx tsc --noEmit --pretty false; then
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "✅ HOME MAESTRA COMPLETADA"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Copia de seguridad:"
  echo "$BACKUP"
  echo ""
  echo "Actualiza:"
  echo "http://localhost:3000"
else
  echo ""
  echo "❌ TypeScript encontró un error."
  echo "Restaurando la home anterior..."
  cp "$BACKUP/app/page.tsx" "$TARGET"
  echo "✅ Estado anterior restaurado."
  exit 1
fi
