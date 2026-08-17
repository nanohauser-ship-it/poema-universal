#!/bin/bash
set -euo pipefail
DIR="${HOME}/taller-grafico-no-desaparezcamos"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "===== TALLER GRÁFICO ====="
if [ -e "$DIR" ]; then
  BACKUP="${DIR}.backup-$(date +%Y%m%d-%H%M%S)"
  echo "Ya existe $DIR; creando copia en $BACKUP"
  mv "$DIR" "$BACKUP"
fi

cp -R "$SCRIPT_DIR" "$DIR"
cd "$DIR"
rm -f instalar-en-mac.sh

echo "Instalando dependencias…"
npm install

if [ ! -f .env.local ]; then
  cp .env.example .env.local
fi

echo ""
echo "✅ Instalado en: $DIR"
echo "Para abrirlo:"
echo "  cd \"$DIR\""
echo "  npm run dev"
echo ""
echo "Después abre http://localhost:3000"
