#!/usr/bin/env bash
set -euo pipefail

PROJECT="${HOME}/poema-universal"
SCRIPT_DIR="$(cd -- "$(dirname -- "$0")" && pwd)"
PAYLOAD="${SCRIPT_DIR}/payload"

cd "$PROJECT"

printf '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
printf ' ORGANISMO V4.7 · ALIMENTACIÓN VERBAL\n'
printf ' TECLADO + EMBRIÓN 3D + BIOMASA VIVA\n'
printf '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n'

if [[ ! -f package.json ]]; then
  echo "❌ No encuentro package.json en ${PROJECT}"
  exit 1
fi

if [[ -d app/laboratorio/verso-tecno ]]; then
  TARGET="app/laboratorio/verso-tecno"
elif [[ -d src/app/laboratorio/verso-tecno ]]; then
  TARGET="src/app/laboratorio/verso-tecno"
else
  echo "❌ No encuentro la ruta /laboratorio/verso-tecno"
  exit 1
fi

REQUIRED=(
  "${PAYLOAD}/OrganismoV47.tsx"
  "${PAYLOAD}/organismo-v47.module.css"
  "${PAYLOAD}/page.tsx"
  "${PAYLOAD}/organismo/OrganismoEmbryoScene.tsx"
  "${PAYLOAD}/organismo/motor.ts"
)

for FILE in "${REQUIRED[@]}"; do
  if [[ ! -f "$FILE" ]]; then
    echo "❌ El instalador está incompleto: falta ${FILE}"
    exit 1
  fi
done

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="backups/organismo-v47-${STAMP}"
mkdir -p "$BACKUP"
cp -R "$TARGET" "$BACKUP/verso-tecno"

MODEL_WAS_MISSING=0
if [[ ! -f public/models/organismo/embrion-organismo.glb ]]; then
  MODEL_WAS_MISSING=1
fi

restore_previous_version() {
  echo ""
  echo "↩️ Restaurando automáticamente la versión anterior…"
  rm -rf "$TARGET"
  cp -R "$BACKUP/verso-tecno" "$TARGET"

  if [[ "$MODEL_WAS_MISSING" -eq 1 ]]; then
    rm -f public/models/organismo/embrion-organismo.glb
  fi

  rm -rf .next
  echo "✅ Restauración terminada."
}

trap 'echo "❌ La instalación se interrumpió."; restore_previous_version' ERR

echo "✅ Copia de seguridad: ${BACKUP}"
echo "✅ Ruta detectada: ${TARGET}"

mkdir -p "$TARGET/organismo"
cp "$PAYLOAD/OrganismoV47.tsx" "$TARGET/OrganismoV47.tsx"
cp "$PAYLOAD/organismo-v47.module.css" "$TARGET/organismo-v47.module.css"
cp "$PAYLOAD/page.tsx" "$TARGET/page.tsx"
cp "$PAYLOAD/organismo/OrganismoEmbryoScene.tsx" \
  "$TARGET/organismo/OrganismoEmbryoScene.tsx"
cp "$PAYLOAD/organismo/motor.ts" "$TARGET/organismo/motor.ts"

mkdir -p public/models/organismo
if [[ ! -f public/models/organismo/embrion-organismo.glb ]]; then
  cp "$PAYLOAD/public/models/organismo/embrion-organismo.glb" \
    public/models/organismo/embrion-organismo.glb
  echo "✅ Modelo 3D restaurado en public/models/organismo."
else
  echo "✅ Modelo 3D existente conservado."
fi

echo ""
echo "===== VALIDANDO SOLO ORGANISMO V4.7 ====="

CHECK_CONFIG=".organismo-v47-tsconfig-${STAMP}.json"
cat > "$CHECK_CONFIG" <<EOF_CHECK
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": true,
    "incremental": false
  },
  "include": [
    "next-env.d.ts",
    "${TARGET}/page.tsx",
    "${TARGET}/OrganismoV47.tsx",
    "${TARGET}/organismo/OrganismoEmbryoScene.tsx",
    "${TARGET}/organismo/motor.ts"
  ]
}
EOF_CHECK

TYPE_LOG="/tmp/organismo-v47-types-${STAMP}.log"
if ! npx tsc -p "$CHECK_CONFIG" --pretty false > "$TYPE_LOG" 2>&1; then
  echo "❌ TypeScript encontró un error en V4.7:"
  tail -n 100 "$TYPE_LOG"
  rm -f "$CHECK_CONFIG"
  false
fi

rm -f "$CHECK_CONFIG"
rm -rf .next
trap - ERR

echo "✅ TypeScript correcto."
echo "✅ Compilación anterior eliminada."
echo ""
printf '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
printf ' ✅ ORGANISMO V4.7 INSTALADO\n'
printf '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
echo ""
echo "Ahora el embrión:"
echo "  · pulsa con cada tecla"
echo "  · absorbe cada palabra al cerrar con espacio o puntuación"
echo "  · crece con la biomasa provisional"
echo "  · se repliega al borrar"
echo "  · respira con Enter"
echo "  · cambia de órgano según el significado"
echo "  · conserva el crecimiento al entregar la materia"
echo ""
echo "Arranca la web:"
echo "  npm run dev -- --webpack"
echo ""
echo "Abre:"
echo "  http://localhost:3000/laboratorio/verso-tecno"
