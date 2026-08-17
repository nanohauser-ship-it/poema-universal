#!/usr/bin/env bash
set -eu

PROJECT="$HOME/poema-universal"
TARGET="$PROJECT/app/page.tsx"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SOURCE="$SCRIPT_DIR/page.template.txt"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$PROJECT/backups/home-ordenada-exacta-$STAMP"

if [ ! -f "$TARGET" ]; then
  echo "❌ No encuentro la home principal:"
  echo "$TARGET"
  exit 1
fi

if [ ! -f "$SOURCE" ]; then
  echo "❌ Falta page.template.txt junto al instalador."
  exit 1
fi

REQUIRED=(
  "$PROJECT/app/components/PoemaUniversalThreshold.tsx"
  "$PROJECT/app/components/HomeObraComunGateway.tsx"
  "$PROJECT/app/components/HomeSupportGateway.tsx"
  "$PROJECT/app/components/HomeStoreGateway.tsx"
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

echo "✅ Home principal reordenada."
echo "✅ Umbral colocado tras la portada."
echo "✅ Fundación, Obra y Voces reunidas como tres puertas."
echo "✅ Salas públicas separadas de Mi Habitación."
echo "✅ Participación, tienda y Obra Común llevadas al cierre."

cd "$PROJECT"

echo ""
echo "===== VALIDACIÓN TYPESCRIPT ====="

if npx tsc --noEmit --pretty false; then
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "✅ HOME ORDENADA CORRECTAMENTE"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Copia de seguridad:"
  echo "$BACKUP"
  echo ""
  echo "Reinicia Next.js para verla:"
  echo "cd ~/poema-universal"
  echo "rm -rf .next"
  echo "npx next dev --webpack -p 3000"
else
  echo ""
  echo "❌ TypeScript encontró un error."
  echo "Restaurando la home anterior..."
  cp "$BACKUP/app/page.tsx" "$TARGET"
  echo "✅ Estado anterior restaurado."
  exit 1
fi
