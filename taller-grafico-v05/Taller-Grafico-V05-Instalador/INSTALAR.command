#!/bin/bash
set -e

HERE="$(cd "$(dirname "$0")" && pwd)"
SRC="$HERE/taller-grafico-v05"
ROOT="$HOME/poema-universal"
DEST="$ROOT/taller-grafico-v05"
OLD="$ROOT/taller-grafico-v03/taller-grafico-no-desaparezcamos"
LOG="$HOME/Library/Logs/taller-grafico-v05.log"
PIDFILE="$HOME/.taller-grafico-v05.pid"

clear
printf '\n===== TALLER GRÁFICO V0.5 =====\n\n'

if [ ! -f "$SRC/package.json" ]; then
  echo "❌ No encuentro los archivos del proyecto junto al instalador."
  echo "   Descomprime el ZIP completo antes de ejecutar INSTALAR.command."
  read -r -p "Pulsa Enter para cerrar..."
  exit 1
fi

mkdir -p "$ROOT"

# Detener sólo una instancia anterior del Taller, sin tocar Poema Universal.
if [ -f "$PIDFILE" ]; then
  OLDPID="$(cat "$PIDFILE" 2>/dev/null || true)"
  if [ -n "$OLDPID" ] && kill -0 "$OLDPID" 2>/dev/null; then
    kill "$OLDPID" 2>/dev/null || true
    sleep 1
  fi
fi

# Detener servidores que estén ejecutándose desde las carpetas del Taller.
ps ax -o pid=,command= | grep -E 'taller-grafico-v0(3|5)|taller-grafico-no-desaparezcamos' | grep -E 'next dev|next-server' | grep -v grep | awk '{print $1}' | xargs kill 2>/dev/null || true
sleep 1

printf '===== INSTALANDO PROYECTO =====\n'
rm -rf "$DEST"
mkdir -p "$DEST"
rsync -a --exclude node_modules --exclude .next "$SRC/" "$DEST/"

if [ -f "$OLD/.env.local" ]; then
  cp "$OLD/.env.local" "$DEST/.env.local"
  echo "✅ Se ha conservado la configuración .env.local de V0.3"
elif [ ! -f "$DEST/.env.local" ]; then
  cp "$DEST/.env.example" "$DEST/.env.local" 2>/dev/null || true
  echo "⚠️ No encontré una clave API anterior. La aplicación abrirá, pero la IA no generará hasta configurar .env.local."
fi

cd "$DEST"

printf '\n===== INSTALANDO DEPENDENCIAS =====\n'
npm install

printf '\n===== COMPROBANDO TYPESCRIPT =====\n'
npx tsc --noEmit --pretty false

rm -rf .next

# Elegir un puerto libre empezando por 3001 para no pisar Poema Universal en 3000.
PORT=3001
while lsof -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; do
  PORT=$((PORT+1))
done

mkdir -p "$(dirname "$LOG")"
printf '\n===== ARRANCANDO EN http://localhost:%s =====\n' "$PORT"
nohup npm run dev -- -p "$PORT" > "$LOG" 2>&1 &
PID=$!
echo "$PID" > "$PIDFILE"

READY=0
for i in {1..30}; do
  if grep -q 'Ready' "$LOG" 2>/dev/null; then
    READY=1
    break
  fi
  if ! kill -0 "$PID" 2>/dev/null; then
    break
  fi
  sleep 1
done

printf '\n===== ESTADO =====\n'
tail -n 40 "$LOG" 2>/dev/null || true

if [ "$READY" -eq 1 ]; then
  echo ""
  echo "✅ Taller Gráfico activo en http://localhost:$PORT"
  open "http://localhost:$PORT"
else
  echo ""
  echo "❌ El servidor no terminó de arrancar."
  echo "Copia la salida anterior y envíamela para corregirla."
fi

echo ""
read -r -p "Pulsa Enter para cerrar esta ventana..."
