#!/usr/bin/env bash
set -eu

PROJECT="$HOME/poema-universal"
TARGET_PAGE="$PROJECT/app/poema-universal/page.tsx"
TARGET_CSS="$PROJECT/app/poema-universal/PoemaUniversalPage.module.css"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SOURCE_PAGE="$SCRIPT_DIR/page.template.txt"
SOURCE_CSS="$SCRIPT_DIR/PoemaUniversalPage.module.css.txt"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$PROJECT/backups/poema-universal-organico-$STAMP"

if [ ! -f "$TARGET_PAGE" ]; then
  echo "❌ No encuentro la página principal de Poema Universal:"
  echo "$TARGET_PAGE"
  exit 1
fi

REQUIRED=(
  "$PROJECT/app/poema-universal/components/AvatarRelicStudio.tsx"
  "$PROJECT/app/poema-universal/components/PoetPresence.tsx"
  "$PROJECT/app/poema-universal/components/PoetProfilePanel.tsx"
  "$PROJECT/app/poema-universal/components/WorldGlobeLive.tsx"
  "$PROJECT/app/poema-universal/data/curatedVoices.ts"
)

for FILE in "${REQUIRED[@]}"; do
  if [ ! -f "$FILE" ]; then
    echo "❌ Falta el archivo:"
    echo "$FILE"
    exit 1
  fi
done

if [ ! -f "$SOURCE_PAGE" ] || [ ! -f "$SOURCE_CSS" ]; then
  echo "❌ El paquete está incompleto."
  exit 1
fi

mkdir -p "$BACKUP/app/poema-universal"
cp "$TARGET_PAGE" "$BACKUP/app/poema-universal/page.tsx"

if [ -f "$TARGET_CSS" ]; then
  cp "$TARGET_CSS" \
    "$BACKUP/app/poema-universal/PoemaUniversalPage.module.css"
fi

cp "$SOURCE_PAGE" "$TARGET_PAGE"
cp "$SOURCE_CSS" "$TARGET_CSS"

cd "$PROJECT"

echo "===== VALIDACIÓN TYPESCRIPT ====="

if npx tsc --noEmit --pretty false; then
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "✅ POEMA UNIVERSAL RECONSTRUIDO COMO UNA SOLA OBRA"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Página:"
  echo "http://localhost:3000/poema-universal"
  echo ""
  echo "Copia de seguridad:"
  echo "$BACKUP"
else
  echo ""
  echo "❌ TypeScript encontró un error."
  echo "Restaurando el estado anterior..."

  cp "$BACKUP/app/poema-universal/page.tsx" "$TARGET_PAGE"

  if [ -f "$BACKUP/app/poema-universal/PoemaUniversalPage.module.css" ]; then
    cp "$BACKUP/app/poema-universal/PoemaUniversalPage.module.css" \
      "$TARGET_CSS"
  else
    rm -f "$TARGET_CSS"
  fi

  echo "✅ Estado anterior restaurado."
  exit 1
fi
