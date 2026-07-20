#!/bin/zsh
set -e

PROJECT="$HOME/poema-universal"
SOURCE="$(cd "$(dirname "$0")" && pwd)"
STAMP=$(date +%Y%m%d-%H%M%S)

cd "$PROJECT"

FILES=(
  "app/poema-universal/components/BorgesEntrance.tsx"
  "app/poema-universal/components/BorgesEntrance.module.css"
)

for FILE in "${FILES[@]}"
do
  if [ -f "$FILE" ]; then
    cp "$FILE" "$FILE.before-final-$STAMP"
    echo "✅ Copia: $FILE.before-final-$STAMP"
  fi
done

mkdir -p app/poema-universal/components

cp "$SOURCE/app/poema-universal/components/BorgesEntrance.tsx" \
  app/poema-universal/components/BorgesEntrance.tsx

cp "$SOURCE/app/poema-universal/components/BorgesEntrance.module.css" \
  app/poema-universal/components/BorgesEntrance.module.css

echo ""
echo "=== ANEXO ==="

if grep -q 'BorgesEntrance' app/poema-universal/page.tsx
then
  echo "✅ BorgesEntrance sigue anexado"
else
  echo "❌ BorgesEntrance no está importado en page.tsx"
  exit 1
fi

echo ""
echo "=== TYPESCRIPT ==="

if npx tsc --noEmit
then
  echo ""
  echo "✅ ENTRADA DEFINITIVA INSTALADA."
  echo "✅ Emblema laberinto-espejo."
  echo "✅ Lectura simbólica viva."
  echo "✅ Transición ceremonial."
  echo "✅ Movimiento accesible."
else
  echo ""
  echo "❌ Error de TypeScript. Restaurando."

  for FILE in "${FILES[@]}"
  do
    BACKUP="$FILE.before-final-$STAMP"
    if [ -f "$BACKUP" ]; then
      cp "$BACKUP" "$FILE"
    else
      rm -f "$FILE"
    fi
  done

  npx tsc --noEmit
  exit 1
fi
