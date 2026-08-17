#!/bin/bash

set -euo pipefail

INSTALLER_DIR="$(cd "$(dirname "$0")" && pwd)"
PAYLOAD_DIR="$INSTALLER_DIR/PAYLOAD"
TARGET_DIR="${EMBRION_TARGET:-$HOME/poema-universal}"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="$TARGET_DIR/copias-seguridad/antes-embrion-atlas-$STAMP"
LOG_FILE="/tmp/poema-universal-embrion.log"

echo ""
echo "=============================================="
echo " EMBRIÓN · ATLAS HISTÓRICO"
echo " INSTALACIÓN SEGURA EN POEMA UNIVERSAL"
echo "=============================================="
echo ""

if [ ! -f "$TARGET_DIR/package.json" ] || [ ! -d "$TARGET_DIR/app" ]; then
  echo "❌ No encuentro Poema Universal en:"
  echo "   $TARGET_DIR"
  echo ""
  echo "No se ha modificado ningún archivo."
  read -r -p "Pulsa Intro para cerrar..."
  exit 1
fi

if [ ! -f "$PAYLOAD_DIR/app/embrion/page.tsx" ] || [ ! -f "$PAYLOAD_DIR/lib/embrion/pilot-corpus.ts" ]; then
  echo "❌ El instalador está incompleto: falta el contenido PAYLOAD."
  echo "No se ha modificado Poema Universal."
  read -r -p "Pulsa Intro para cerrar..."
  exit 1
fi

echo "→ Proyecto: $TARGET_DIR"
echo "→ Copia de seguridad: $BACKUP_DIR"
echo ""

mkdir -p "$BACKUP_DIR/app/components"

if [ -f "$TARGET_DIR/app/components/VersoTechnoDock.tsx" ]; then
  cp "$TARGET_DIR/app/components/VersoTechnoDock.tsx" "$BACKUP_DIR/app/components/"
fi

if [ -f "$TARGET_DIR/app/components/VersoTechnoDock.module.css" ]; then
  cp "$TARGET_DIR/app/components/VersoTechnoDock.module.css" "$BACKUP_DIR/app/components/"
fi

for relative_path in app/embrion lib/embrion app/api/embrion/v1; do
  if [ -e "$TARGET_DIR/$relative_path" ]; then
    mkdir -p "$BACKUP_DIR/$(dirname "$relative_path")"
    cp -R "$TARGET_DIR/$relative_path" "$BACKUP_DIR/$relative_path"
  fi
done

echo "✓ Copia de seguridad creada"

mkdir -p \
  "$TARGET_DIR/app/embrion" \
  "$TARGET_DIR/lib/embrion" \
  "$TARGET_DIR/app/api/embrion/v1" \
  "$TARGET_DIR/app/components" \
  "$TARGET_DIR/supabase/migrations"

rsync -a "$PAYLOAD_DIR/app/embrion/" "$TARGET_DIR/app/embrion/"
rsync -a "$PAYLOAD_DIR/lib/embrion/" "$TARGET_DIR/lib/embrion/"
rsync -a "$PAYLOAD_DIR/app/api/embrion/v1/" "$TARGET_DIR/app/api/embrion/v1/"

cp "$PAYLOAD_DIR/app/components/VersoTechnoDock.tsx" "$TARGET_DIR/app/components/"
cp "$PAYLOAD_DIR/app/components/VersoTechnoDock.module.css" "$TARGET_DIR/app/components/"
cp "$PAYLOAD_DIR/supabase/migrations/20260810120000_embrion_historical_atlas.sql" "$TARGET_DIR/supabase/migrations/"

if [ ! -f "$TARGET_DIR/app/embrion/page.tsx" ] \
  || [ ! -f "$TARGET_DIR/app/embrion/EmbrionExperience.tsx" ] \
  || [ ! -f "$TARGET_DIR/lib/embrion/pilot-corpus.ts" ] \
  || [ ! -f "$TARGET_DIR/app/api/embrion/v1/bootstrap/route.ts" ]; then
  echo "❌ La verificación posterior a la copia ha fallado."
  echo "La copia de seguridad permanece en: $BACKUP_DIR"
  read -r -p "Pulsa Intro para cerrar..."
  exit 1
fi

echo "✓ Archivos de Embrión instalados"

if [ "${EMBRION_SKIP_START:-0}" = "1" ]; then
  echo "✅ Verificación de instalación completada"
  exit 0
fi

PORT_PIDS="$(lsof -ti tcp:3000 2>/dev/null || true)"
if [ -n "$PORT_PIDS" ]; then
  kill $PORT_PIDS 2>/dev/null || true
  sleep 1
fi

find "$TARGET_DIR/.next" -mindepth 1 -delete 2>/dev/null || true
rmdir "$TARGET_DIR/.next" 2>/dev/null || true

cd "$TARGET_DIR"
nohup npm run dev -- --webpack -p 3000 >"$LOG_FILE" 2>&1 &
SERVER_PID=$!
echo "$SERVER_PID" > /tmp/poema-universal-embrion.pid

READY=0
for _attempt in $(seq 1 40); do
  if curl -fsS "http://localhost:3000/embrion" >/dev/null 2>&1; then
    READY=1
    break
  fi
  sleep 0.5
done

echo ""
if [ "$READY" -eq 1 ]; then
  echo "✅ EMBRIÓN INSTALADA Y FUNCIONANDO"
  echo ""
  echo "   http://localhost:3000/embrion"
  echo ""
  open "http://localhost:3000/embrion"
else
  echo "⚠️ Embrión se instaló, pero el servidor no llegó a responder."
  echo "Últimas líneas del registro:"
  echo ""
  tail -n 35 "$LOG_FILE" 2>/dev/null || true
  echo ""
  echo "La copia de seguridad está en: $BACKUP_DIR"
fi

echo ""
read -r -p "Pulsa Intro para cerrar esta ventana..."
