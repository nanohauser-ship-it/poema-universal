#!/bin/bash
set -euo pipefail

PROJECT="${1:-$HOME/poema-universal}"
PAYLOAD="$(cd "$(dirname "$0")" && pwd)/payload"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$PROJECT/.backups/poema-universal-hero-video-$STAMP"

if [ ! -d "$PROJECT/app/poema-universal" ]; then
  echo "❌ No encuentro app/poema-universal en: $PROJECT"
  exit 1
fi

mkdir -p "$BACKUP/app/poema-universal/components"
mkdir -p "$PROJECT/public/poema-universal/media"

for FILE in \
  "app/poema-universal/components/EditorialHero.tsx" \
  "app/poema-universal/components/EditorialHero.module.css"
do
  if [ -f "$PROJECT/$FILE" ]; then
    cp "$PROJECT/$FILE" "$BACKUP/$FILE"
  fi
done

cp "$PAYLOAD/app/poema-universal/components/EditorialHero.tsx" \
  "$PROJECT/app/poema-universal/components/EditorialHero.tsx"
cp "$PAYLOAD/app/poema-universal/components/EditorialHero.module.css" \
  "$PROJECT/app/poema-universal/components/EditorialHero.module.css"
cp "$PAYLOAD/public/poema-universal/media/poema-universal-opening.mp4" \
  "$PROJECT/public/poema-universal/media/poema-universal-opening.mp4"
cp "$PAYLOAD/public/poema-universal/media/poema-universal-opening-poster.jpg" \
  "$PROJECT/public/poema-universal/media/poema-universal-opening-poster.jpg"

echo ""
echo "✅ PORTADA VIDEO INSTALADA"
echo "   Hero: app/poema-universal/components/EditorialHero.tsx"
echo "   Vídeo: public/poema-universal/media/poema-universal-opening.mp4"
echo "   Backup: $BACKUP"
echo ""
echo "La cuenta atrás existente sigue conectada a 01.01.2027."
