#!/bin/zsh

set -e

cd ~/poema-universal

STAMP=$(date +%Y%m%d-%H%M%S)

DIR="app/poema-universal/ojos-de-borges"
API_DIR="app/api/poema-universal/ojos-de-borges"

mkdir -p "$DIR"
mkdir -p "$API_DIR"

for FILE in \
  "$DIR/page.tsx" \
  "$DIR/OjosDeBorges.module.css" \
  "$DIR/borges-contract.ts" \
  "$DIR/borges-client.ts" \
  "$DIR/borges-prompt.ts" \
  "$API_DIR/route.ts"
do
  if [ -f "$FILE" ]; then
    cp "$FILE" "$FILE.before-soul-engine-$STAMP"
    echo "✅ Copia creada: $FILE.before-soul-engine-$STAMP"
  fi
done

echo ""
echo "✅ Estructura preparada."
echo "✅ Copias de seguridad creadas."
echo "✅ Directorio de API preparado."
