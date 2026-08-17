#!/usr/bin/env bash
set -euo pipefail

cd "$HOME/poema-universal"

HERE="$(cd "$(dirname "$0")" && pwd)"
PAYLOAD="$HERE/payload"

if [[ -d app/laboratorio/verso-tecno ]]; then
  TARGET="app/laboratorio/verso-tecno"
elif [[ -d src/app/laboratorio/verso-tecno ]]; then
  TARGET="src/app/laboratorio/verso-tecno"
else
  echo "❌ No encuentro la ruta laboratorio/verso-tecno"
  exit 1
fi

for file in \
  "$PAYLOAD/OrganismoV47.tsx" \
  "$PAYLOAD/organismo-v47.module.css" \
  "$PAYLOAD/page.tsx" \
  "$PAYLOAD/organismo/OrganismoEmbryoScene.tsx"; do
  [[ -f "$file" ]] || { echo "❌ Falta $file"; exit 1; }
done

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="backups/organismo-v47-$STAMP"
mkdir -p "$BACKUP/organismo"

for file in OrganismoV47.tsx organismo-v47.module.css page.tsx; do
  [[ -f "$TARGET/$file" ]] && cp "$TARGET/$file" "$BACKUP/$file"
done
cp "$TARGET/organismo/OrganismoEmbryoScene.tsx" "$BACKUP/organismo/OrganismoEmbryoScene.tsx"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " ORGANISMO V4.7 · ALIMENTACIÓN VERBAL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Copia de seguridad: $BACKUP"

cp "$PAYLOAD/OrganismoV47.tsx" "$TARGET/OrganismoV47.tsx"
cp "$PAYLOAD/organismo-v47.module.css" "$TARGET/organismo-v47.module.css"
cp "$PAYLOAD/page.tsx" "$TARGET/page.tsx"
cp "$PAYLOAD/organismo/OrganismoEmbryoScene.tsx" "$TARGET/organismo/OrganismoEmbryoScene.tsx"

rm -rf .next

echo "===== VALIDANDO TYPESCRIPT ====="
if npx tsc --noEmit --pretty false; then
  echo "✅ TypeScript correcto."
else
  echo "❌ TypeScript detectó un error. Restaurando la escena y la página anteriores."
  cp "$BACKUP/organismo/OrganismoEmbryoScene.tsx" "$TARGET/organismo/OrganismoEmbryoScene.tsx"
  if [[ -f "$BACKUP/page.tsx" ]]; then cp "$BACKUP/page.tsx" "$TARGET/page.tsx"; fi
  rm -f "$TARGET/OrganismoV47.tsx" "$TARGET/organismo-v47.module.css"
  exit 1
fi

echo ""
echo "✅ ORGANISMO V4.7 INSTALADO DE VERDAD"
echo "✅ Debe aparecer: ALIMENTACIÓN VERBAL · EN DIRECTO"
echo "✅ Cada tecla genera un pulso 3D"
echo "✅ Cada palabra viaja hacia el embrión"
echo "✅ ENTREGAR MATERIA consolida el crecimiento"
echo ""
echo "Arranca con:"
echo "  npm run dev -- --webpack -p 3000"
