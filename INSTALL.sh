#!/bin/zsh
set -e

PROJECT="$HOME/poema-universal"
SOURCE="$(cd "$(dirname "$0")" && pwd)"
STAMP=$(date +%Y%m%d-%H%M%S)

cd "$PROJECT"

FILES=(
  "app/poema-universal/ojos-de-borges/page.tsx"
  "app/poema-universal/ojos-de-borges/OjosDeBorges.module.css"
  "app/poema-universal/ojos-de-borges/symbolic-contract.ts"
  "app/poema-universal/ojos-de-borges/symbolic-client.ts"
  "app/poema-universal/ojos-de-borges/symbolic-prompt.ts"
  "app/poema-universal/ojos-de-borges/archetype-atlas.ts"
  "app/poema-universal/ojos-de-borges/symbol-atlas.ts"
  "app/api/poema-universal/ojos-de-borges/route.ts"
)

for FILE in "${FILES[@]}"
do
  if [ -f "$FILE" ]; then
    cp "$FILE" "$FILE.before-jung-v1-$STAMP"
    echo "✅ Copia: $FILE.before-jung-v1-$STAMP"
  fi
done

mkdir -p app/poema-universal/ojos-de-borges
mkdir -p app/api/poema-universal/ojos-de-borges

cp -R "$SOURCE/app/poema-universal/ojos-de-borges/." \
  app/poema-universal/ojos-de-borges/

cp "$SOURCE/app/api/poema-universal/ojos-de-borges/route.ts" \
  app/api/poema-universal/ojos-de-borges/route.ts

echo ""
echo "=== TYPESCRIPT ==="

if npx tsc --noEmit
then
  echo ""
  echo "✅ NÚCLEO SIMBÓLICO-ARQUETÍPICO V1 INSTALADO."
  echo "✅ Atlas simbólico instalado."
  echo "✅ Arquetipos jungianos instalados."
  echo "✅ Símbolo ausente e individuación instalados."
  echo "✅ Ruta: http://localhost:3000/poema-universal/ojos-de-borges"
else
  echo ""
  echo "❌ Error de TypeScript. Restaurando copias."

  for FILE in "${FILES[@]}"
  do
    BACKUP="$FILE.before-jung-v1-$STAMP"

    if [ -f "$BACKUP" ]; then
      cp "$BACKUP" "$FILE"
    else
      rm -f "$FILE"
    fi
  done

  npx tsc --noEmit
  exit 1
fi
