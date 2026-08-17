#!/usr/bin/env bash
set -eu

PROJECT="$HOME/poema-universal"
TARGET="$PROJECT/app/page.tsx"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SOURCE="$SCRIPT_DIR/page.template.txt"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$PROJECT/backups/home-orden-final-$STAMP"

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

echo "✅ Archivo app/page.tsx sustituido."
echo "✅ Umbral colocado dentro de Tres puertas."
echo "✅ Salas abiertas separadas de Mi Habitación."
echo "✅ Participación, tienda y Obra Común llevadas al cierre."

echo ""
echo "===== COMPROBACIÓN DEL ORDEN ====="
grep -nE 'Tres puertas|Salas abiertas|La casa también guarda|IV · Participar|V · Materia|VI · Consecuencia' "$TARGET"

cd "$PROJECT"

echo ""
echo "===== VALIDACIÓN TYPESCRIPT ====="

if npx tsc --noEmit --pretty false; then
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "✅ HOME REORDENADA DEFINITIVAMENTE"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Copia de seguridad:"
  echo "$BACKUP"
  echo ""
  echo "Ahora reinicia Next.js:"
  echo "cd ~/poema-universal"
  echo "PID=\$(lsof -tiTCP:3000 -sTCP:LISTEN 2>/dev/null || true)"
  echo '[ -n "$PID" ] && kill "$PID"'
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
