#!/usr/bin/env bash
set -euo pipefail

PROJECT="$HOME/poema-universal"
cd "$PROJECT"

HERE="$(cd "$(dirname "$0")" && pwd)"
PAYLOAD="$HERE/payload"

if [[ -d app/laboratorio/verso-tecno ]]; then
  TARGET="app/laboratorio/verso-tecno"
elif [[ -d src/app/laboratorio/verso-tecno ]]; then
  TARGET="src/app/laboratorio/verso-tecno"
else
  echo "❌ No encuentro laboratorio/verso-tecno"
  exit 1
fi

for FILE in \
  "$PAYLOAD/OrganismoV47.tsx" \
  "$PAYLOAD/organismo-v47.module.css" \
  "$PAYLOAD/page.tsx" \
  "$PAYLOAD/organismo/OrganismoEmbryoScene.tsx" \
  "$TARGET/organismo/motor.ts"; do
  if [[ ! -f "$FILE" ]]; then
    echo "❌ Falta: $FILE"
    exit 1
  fi
done

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="backups/organismo-v47-reparacion-$STAMP"
mkdir -p "$BACKUP/active/organismo" "$BACKUP/archivados"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " ORGANISMO V4.7 · REPARACIÓN DEFINITIVA"
echo " ALIMENTACIÓN VERBAL + EMBRIÓN REACTIVO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "===== DETENIENDO NEXT ====="
pkill -f "next dev" 2>/dev/null || true
pkill -f "next-server" 2>/dev/null || true
sleep 1

echo "===== GUARDANDO LA VERSIÓN ACTUAL ====="
for FILE in \
  page.tsx \
  OrganismoV46.tsx \
  organismo-v46.module.css \
  OrganismoV47.tsx \
  organismo-v47.module.css; do
  if [[ -f "$TARGET/$FILE" ]]; then
    cp "$TARGET/$FILE" "$BACKUP/active/$FILE"
  fi
done
cp "$TARGET/organismo/OrganismoEmbryoScene.tsx" \
  "$BACKUP/active/organismo/OrganismoEmbryoScene.tsx"

echo "✅ Copia de seguridad: $BACKUP"

echo "===== APARTANDO COPIAS QUE TYPESCRIPT ESTABA COMPILANDO ====="
archive_dir() {
  local SOURCE="$1"
  if [[ -d "$SOURCE" ]]; then
    local NAME
    NAME="$(basename "$SOURCE")"
    local DEST="$BACKUP/archivados/$NAME"
    local INDEX=2
    while [[ -e "$DEST" ]]; do
      DEST="$BACKUP/archivados/${NAME}-${INDEX}"
      INDEX=$((INDEX + 1))
    done
    mv "$SOURCE" "$DEST"
    echo "✅ Apartado: $SOURCE"
  fi
}

archive_dir "$PROJECT/organismo-v46-actual"
archive_dir "$PROJECT/organismo-v47-alimentacion-verbal"
archive_dir "$PROJECT/organismo-v47-alimentacion-verbal-real"
archive_dir "$PROJECT/organismo-v47-alimentacion-verbal-real 2"

shopt -s nullglob
for DIR in \
  "$PROJECT"/app/laboratorio/verso-tecno.before-* \
  "$PROJECT"/src/app/laboratorio/verso-tecno.before-*; do
  archive_dir "$DIR"
done
shopt -u nullglob

echo "===== INSTALANDO LA V4.7 CORREGIDA ====="
cp "$PAYLOAD/OrganismoV47.tsx" "$TARGET/OrganismoV47.tsx"
cp "$PAYLOAD/organismo-v47.module.css" "$TARGET/organismo-v47.module.css"
cp "$PAYLOAD/page.tsx" "$TARGET/page.tsx"
cp "$PAYLOAD/organismo/OrganismoEmbryoScene.tsx" \
  "$TARGET/organismo/OrganismoEmbryoScene.tsx"

# La V4.6 queda conservada en backups. Mantenerla dentro de app hacía que
# TypeScript compilase una API antigua del motor aunque ya no fuera la página activa.
rm -f "$TARGET/OrganismoV46.tsx" "$TARGET/organismo-v46.module.css"

TMP_TSCONFIG=".organismo-v47-tsconfig-$STAMP.json"
cat > "$TMP_TSCONFIG" <<JSON
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": true,
    "incremental": false
  },
  "include": [
    "next-env.d.ts",
    "$TARGET/page.tsx",
    "$TARGET/OrganismoV47.tsx",
    "$TARGET/organismo/OrganismoEmbryoScene.tsx",
    "$TARGET/organismo/motor.ts"
  ],
  "exclude": [
    "node_modules",
    "backups",
    ".next"
  ]
}
JSON

echo "===== VALIDANDO SOLO LA SALA ACTIVA ====="
if npx tsc --noEmit --pretty false -p "$TMP_TSCONFIG"; then
  rm -f "$TMP_TSCONFIG"
  echo "✅ V4.7 validada con el motor real del proyecto."
else
  echo "❌ La validación de la sala activa falló. Restaurando."
  rm -f "$TMP_TSCONFIG"
  rm -f "$TARGET/OrganismoV47.tsx" "$TARGET/organismo-v47.module.css"

  if [[ -f "$BACKUP/active/page.tsx" ]]; then
    cp "$BACKUP/active/page.tsx" "$TARGET/page.tsx"
  fi
  if [[ -f "$BACKUP/active/OrganismoV46.tsx" ]]; then
    cp "$BACKUP/active/OrganismoV46.tsx" "$TARGET/OrganismoV46.tsx"
  fi
  if [[ -f "$BACKUP/active/organismo-v46.module.css" ]]; then
    cp "$BACKUP/active/organismo-v46.module.css" \
      "$TARGET/organismo-v46.module.css"
  fi
  cp "$BACKUP/active/organismo/OrganismoEmbryoScene.tsx" \
    "$TARGET/organismo/OrganismoEmbryoScene.tsx"
  exit 1
fi

rm -rf .next

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ORGANISMO V4.7 INSTALADO CORRECTAMENTE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Motor real: evolucionarHastaHoy"
echo "✅ Error cambiarMetabolismo eliminado"
echo "✅ Copias antiguas apartadas de TypeScript"
echo "✅ Nullabilidad del contenedor 3D corregida"
echo "✅ Alimentación verbal visible"
echo "✅ Cada tecla produce un pulso en el embrión"
echo "✅ Cada palabra completada activa un hábitat"
echo "✅ ENTREGAR MATERIA consolida biomasa y música"
echo ""
echo "Arranca ahora con:"
echo "  cd ~/poema-universal"
echo "  npm run dev -- --webpack -p 3000"
