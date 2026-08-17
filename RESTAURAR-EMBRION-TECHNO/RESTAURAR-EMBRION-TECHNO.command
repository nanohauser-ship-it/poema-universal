#!/bin/bash

set -euo pipefail

INSTALLER_DIR="$(cd "$(dirname "$0")" && pwd)"
PAYLOAD_DIR="$INSTALLER_DIR/PAYLOAD"
TARGET_DIR="${EMBRION_TARGET:-$HOME/poema-universal}"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="$TARGET_DIR/copias-seguridad/antes-restaurar-embrion-techno-$STAMP"
LOG_FILE="/tmp/poema-universal-embrion-techno.log"

echo ""
echo "=============================================="
echo " EMBRIÓN · RESTAURACIÓN TECHNO"
echo " VERSO → ORGANISMO → MÚSICA"
echo "=============================================="
echo ""

if [ ! -f "$TARGET_DIR/package.json" ] || [ ! -d "$TARGET_DIR/app" ]; then
  echo "❌ No encuentro Poema Universal en:"
  echo "   $TARGET_DIR"
  echo "No se ha modificado ningún archivo."
  read -r -p "Pulsa Intro para cerrar..."
  exit 1
fi

if [ ! -f "$TARGET_DIR/app/laboratorio/verso-tecno/page.tsx" ] || [ ! -f "$TARGET_DIR/app/laboratorio/verso-tecno/OrganismoV47.tsx" ]; then
  echo "❌ No encuentro la versión original de Embrión techno."
  echo "No se ha modificado ningún archivo."
  read -r -p "Pulsa Intro para cerrar..."
  exit 1
fi

if [ ! -f "$PAYLOAD_DIR/app/components/VersoTechnoDock.tsx" ] || [ ! -f "$PAYLOAD_DIR/app/embrion/page.tsx" ]; then
  echo "❌ El restaurador está incompleto."
  read -r -p "Pulsa Intro para cerrar..."
  exit 1
fi

mkdir -p "$BACKUP_DIR/app/components" "$BACKUP_DIR/app/embrion"
cp "$TARGET_DIR/app/components/VersoTechnoDock.tsx" "$BACKUP_DIR/app/components/" 2>/dev/null || true
cp "$TARGET_DIR/app/components/VersoTechnoDock.module.css" "$BACKUP_DIR/app/components/" 2>/dev/null || true
cp "$TARGET_DIR/app/embrion/page.tsx" "$BACKUP_DIR/app/embrion/" 2>/dev/null || true

echo "✓ Copia de seguridad creada"
echo "  $BACKUP_DIR"

mkdir -p "$TARGET_DIR/app/components" "$TARGET_DIR/app/embrion"
cp "$PAYLOAD_DIR/app/components/VersoTechnoDock.tsx" "$TARGET_DIR/app/components/"
cp "$PAYLOAD_DIR/app/components/VersoTechnoDock.module.css" "$TARGET_DIR/app/components/"
cp "$PAYLOAD_DIR/app/embrion/page.tsx" "$TARGET_DIR/app/embrion/"

if ! grep -q 'laboratorio/verso-tecno' "$TARGET_DIR/app/components/VersoTechnoDock.tsx"; then
  echo "❌ No se pudo restaurar el acceso a Verso → Techno."
  read -r -p "Pulsa Intro para cerrar..."
  exit 1
fi

if ! grep -q 'redirect("/laboratorio/verso-tecno")' "$TARGET_DIR/app/embrion/page.tsx"; then
  echo "❌ No se pudo restaurar la ruta principal de Embrión."
  read -r -p "Pulsa Intro para cerrar..."
  exit 1
fi

echo "✓ Acceso original Verso → Techno restaurado"
echo "✓ /embrion vuelve a abrir el organismo musical"
echo "✓ El atlas queda desactivado sin borrar sus archivos"

if [ "${EMBRION_SKIP_START:-0}" = "1" ]; then
  echo "✅ Verificación de restauración completada"
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
echo "$SERVER_PID" > /tmp/poema-universal-embrion-techno.pid

READY=0
for _attempt in $(seq 1 50); do
  if curl -fsS "http://localhost:3000/laboratorio/verso-tecno" >/dev/null 2>&1; then
    READY=1
    break
  fi
  sleep 0.5
done

echo ""
if [ "$READY" -eq 1 ]; then
  echo "✅ EMBRIÓN TECHNO RESTAURADO Y FUNCIONANDO"
  echo ""
  echo "   http://localhost:3000/laboratorio/verso-tecno"
  echo ""
  open "http://localhost:3000/laboratorio/verso-tecno"
else
  echo "⚠️ La restauración terminó, pero el servidor no llegó a responder."
  echo "Últimas líneas del registro:"
  echo ""
  tail -n 35 "$LOG_FILE" 2>/dev/null || true
fi

echo ""
read -r -p "Pulsa Intro para cerrar esta ventana..."
