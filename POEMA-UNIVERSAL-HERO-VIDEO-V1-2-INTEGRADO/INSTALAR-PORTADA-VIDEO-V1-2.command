#!/bin/bash
set -euo pipefail

PROJECT="${1:-$HOME/poema-universal}"
HERE="$(cd "$(dirname "$0")" && pwd)"
PAYLOAD="$HERE/payload"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$PROJECT/.backups/poema-universal-hero-video-v1-2-$STAMP"
HERO="$PROJECT/app/poema-universal/components/EditorialHero.tsx"
VIDEO="$PROJECT/public/poema-universal/media/poema-universal-opening.mp4"
POSTER="$PROJECT/public/poema-universal/media/poema-universal-opening-poster.jpg"

if [ ! -f "$PROJECT/app/poema-universal/page.tsx" ]; then
  echo "❌ No encuentro $PROJECT/app/poema-universal/page.tsx"
  exit 1
fi

if ! grep -q 'EditorialHero' "$PROJECT/app/poema-universal/page.tsx"; then
  echo "❌ La portada activa no llama a EditorialHero. No modifico nada."
  exit 2
fi

if [ ! -s "$VIDEO" ]; then
  echo "❌ El vídeo no existe en: $VIDEO"
  echo "   No lo vuelvo a copiar porque ya comprobamos que el navegador lo sirve."
  exit 3
fi

if [ ! -s "$POSTER" ]; then
  echo "❌ Falta el poster: $POSTER"
  exit 4
fi

mkdir -p "$BACKUP/app/poema-universal/components"
cp "$HERO" "$BACKUP/app/poema-universal/components/EditorialHero.tsx"
cp "$PAYLOAD/app/poema-universal/components/EditorialHero.tsx" "$HERO"

if ! grep -q 'POEMA HERO VIDEO V1.2' "$HERO"; then
  echo "❌ No se instaló el Hero V1.2."
  exit 5
fi

if ! grep -q 'data-poema-video-hero="v1.2"' "$HERO"; then
  echo "❌ Falta la marca de render V1.2."
  exit 6
fi

printf '\n✅ POEMA UNIVERSAL · HERO VIDEO V1.2 INSTALADO\n'
printf '   Hero: %s\n' "$HERO"
printf '   Vídeo conservado: %s\n' "$VIDEO"
printf '   Backup: %s\n\n' "$BACKUP"
echo "Esta versión no depende del CSS Module para hacer visible el vídeo."
