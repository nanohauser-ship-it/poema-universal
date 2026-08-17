#!/bin/bash
set -euo pipefail

PROJECT="${1:-$HOME/poema-universal}"
HERE="$(cd "$(dirname "$0")" && pwd)"
PAYLOAD="$HERE/payload"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$PROJECT/.backups/poema-universal-hero-video-v1-1-$STAMP"

HERO="$PROJECT/app/poema-universal/components/EditorialHero.tsx"
CSS="$PROJECT/app/poema-universal/components/EditorialHero.module.css"
MEDIA_DIR="$PROJECT/public/poema-universal/media"
VIDEO="$MEDIA_DIR/poema-universal-opening.mp4"
POSTER="$MEDIA_DIR/poema-universal-opening-poster.jpg"

if [ ! -f "$PROJECT/app/poema-universal/page.tsx" ]; then
  echo "❌ No encuentro la portada real: $PROJECT/app/poema-universal/page.tsx"
  exit 1
fi

if ! grep -q 'EditorialHero' "$PROJECT/app/poema-universal/page.tsx"; then
  echo "❌ La portada actual no está llamando a EditorialHero. No voy a parchear a ciegas."
  echo "   Envíame la salida de: grep -n \"EditorialHero\" app/poema-universal/page.tsx"
  exit 2
fi

mkdir -p "$BACKUP/app/poema-universal/components" "$MEDIA_DIR"
[ -f "$HERO" ] && cp "$HERO" "$BACKUP/app/poema-universal/components/EditorialHero.tsx"
[ -f "$CSS" ] && cp "$CSS" "$BACKUP/app/poema-universal/components/EditorialHero.module.css"

cp "$PAYLOAD/app/poema-universal/components/EditorialHero.tsx" "$HERO"
cp "$PAYLOAD/app/poema-universal/components/EditorialHero.module.css" "$CSS"
cp "$PAYLOAD/public/poema-universal/media/poema-universal-opening.mp4" "$VIDEO"
cp "$PAYLOAD/public/poema-universal/media/poema-universal-opening-poster.jpg" "$POSTER"

# Verificación dura
if ! grep -q 'POEMA HERO VIDEO V1.1' "$HERO"; then
  echo "❌ El componente no quedó reemplazado."
  exit 3
fi
if ! grep -q 'poema-universal-opening.mp4' "$HERO"; then
  echo "❌ El componente no referencia el vídeo."
  exit 4
fi
if [ ! -s "$VIDEO" ]; then
  echo "❌ El MP4 no quedó copiado en public."
  exit 5
fi

printf '\n✅ PORTADA DE VÍDEO V1.1 INSTALADA Y VERIFICADA\n'
printf '   Hero: %s\n' "$HERO"
printf '   Vídeo: %s\n' "$VIDEO"
printf '   Tamaño vídeo: '
ls -lh "$VIDEO" | awk '{print $5}'
printf '   Backup: %s\n\n' "$BACKUP"
echo "Capas corregidas: vídeo 0 · velos 1/2 · título y cuenta atrás 3."
