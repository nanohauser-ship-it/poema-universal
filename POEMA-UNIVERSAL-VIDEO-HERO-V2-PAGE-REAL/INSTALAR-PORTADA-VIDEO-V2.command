#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-$PWD}"
PAGE="$ROOT/app/poema-universal/page.tsx"
CSS="$ROOT/app/poema-universal/PoemaUniversalPage.module.css"
MEDIA_DIR="$ROOT/public/poema-universal/media"
HERE="$(cd "$(dirname "$0")" && pwd)"
STAMP="$(date +%Y%m%d-%H%M%S)"

if [[ ! -f "$PAGE" ]]; then
  echo "❌ No existe: $PAGE"
  exit 1
fi

if [[ ! -f "$CSS" ]]; then
  echo "❌ No existe: $CSS"
  exit 1
fi

if ! grep -q 'id="entrada"' "$PAGE" || ! grep -q 'className={styles.hero}' "$PAGE"; then
  echo "❌ No encuentro el hero real de Poema Universal en page.tsx. No modifico nada."
  exit 1
fi

if ! grep -q 'className={styles.heroTitle}' "$PAGE" || ! grep -q 'className={styles.countdown}' "$PAGE"; then
  echo "❌ La estructura actual del hero no coincide con la versión esperada. No modifico nada."
  exit 1
fi

mkdir -p "$ROOT/.backups-poema-universal"
cp "$PAGE" "$ROOT/.backups-poema-universal/page.tsx.before-video-v2-$STAMP"
cp "$CSS" "$ROOT/.backups-poema-universal/PoemaUniversalPage.module.css.before-video-v2-$STAMP"

mkdir -p "$MEDIA_DIR"
cp "$HERE/payload/media/poema-universal-opening.mp4" "$MEDIA_DIR/poema-universal-opening.mp4"
cp "$HERE/payload/media/poema-universal-opening-poster.jpg" "$MEDIA_DIR/poema-universal-opening-poster.jpg"

python3 - "$PAGE" <<'PY'
from pathlib import Path
import re, sys

page = Path(sys.argv[1])
text = page.read_text()

if "heroVideoLayer" not in text:
    pattern = re.compile(
        r'(\s*<section\s*\n\s*id="entrada"\s*\n\s*className=\{styles\.hero\}\s*\n\s*aria-labelledby="poema-universal-title"\s*\n\s*>\s*\n)',
        re.M,
    )
    block = '''\n    <div aria-hidden="true" className={styles.heroVideoLayer}>\n      <div className={styles.heroVideoAmbient} />\n      <video\n        className={styles.heroVideoMain}\n        autoPlay\n        muted\n        loop\n        playsInline\n        preload="auto"\n        poster="/poema-universal/media/poema-universal-opening-poster.jpg"\n      >\n        <source\n          src="/poema-universal/media/poema-universal-opening.mp4"\n          type="video/mp4"\n        />\n      </video>\n    </div>\n\n    <div aria-hidden="true" className={styles.heroVideoVeil} />\n'''
    text, n = pattern.subn(lambda m: m.group(1) + block, text, count=1)
    if n != 1:
        raise SystemExit("No pude insertar el vídeo dentro del hero real.")

page.write_text(text)
PY

if ! grep -q 'POEMA UNIVERSAL · HERO VIDEO V2 · PAGE REAL' "$CSS"; then
cat >> "$CSS" <<'CSS'

/* ================================================================
   POEMA UNIVERSAL · HERO VIDEO V2 · PAGE REAL
   Vídeo integrado en app/poema-universal/page.tsx
   ================================================================ */

.hero {
  position: relative !important;
  isolation: isolate;
  overflow: hidden !important;
  min-height: min(900px, calc(100vh - 68px));
  background: #0a0908 !important;
  color: #f4ede4 !important;
}

.heroVideoLayer {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background: #080706;
  pointer-events: none;
}

.heroVideoAmbient {
  position: absolute;
  inset: -9%;
  background-image: url('/poema-universal/media/poema-universal-opening-poster.jpg');
  background-position: center;
  background-size: cover;
  filter: blur(42px) brightness(0.42) saturate(0.72);
  transform: scale(1.13);
  opacity: 0.88;
}

.heroVideoMain {
  position: absolute;
  top: 0;
  left: 50%;
  width: min(48vw, 520px);
  min-width: 340px;
  height: 100%;
  transform: translateX(-50%);
  object-fit: cover;
  object-position: center center;
  opacity: 0.98;
  filter: saturate(0.92) contrast(1.02) brightness(0.9);
  box-shadow:
    -90px 0 140px rgba(8, 7, 6, 0.72),
     90px 0 140px rgba(8, 7, 6, 0.72);
}

.heroVideoVeil {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(7, 6, 5, 0.42) 0%, rgba(7, 6, 5, 0.08) 34%, rgba(7, 6, 5, 0.18) 64%, rgba(7, 6, 5, 0.68) 100%),
    radial-gradient(circle at 50% 42%, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.34) 78%);
}

.heroPaper {
  opacity: 0 !important;
  pointer-events: none;
}

.heroAxis {
  z-index: 2 !important;
  opacity: 0.18 !important;
}

.heroFrame {
  position: relative !important;
  z-index: 3 !important;
}

.heroMeta,
.heroStage,
.countdownHead,
.countdown,
.heroFooter {
  position: relative;
  z-index: 3;
}

.heroMeta,
.heroMeta a,
.heroMeta span,
.eyebrow,
.heroMantra,
.heroLink,
.countdownHead,
.countdownLabel,
.heroFooter {
  color: rgba(247, 240, 231, 0.72) !important;
}

.heroTitle,
.heroTitle span,
.heroTitle em,
.heroLead,
.heroLead span,
.countdownValue {
  color: #f7f0e7 !important;
  text-shadow: 0 2px 28px rgba(0, 0, 0, 0.44);
}

.heroTitle em {
  color: rgba(247, 240, 231, 0.84) !important;
}

.heroLink {
  border-color: rgba(247, 240, 231, 0.26) !important;
}

.countdown {
  border-color: rgba(247, 240, 231, 0.22) !important;
  background: rgba(7, 6, 5, 0.18) !important;
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
}

.countdownItem {
  border-color: rgba(247, 240, 231, 0.18) !important;
}

@media (max-width: 760px) {
  .hero {
    min-height: 820px;
  }

  .heroVideoMain {
    width: 100%;
    min-width: 0;
    object-fit: cover;
  }

  .heroVideoAmbient {
    opacity: 0.38;
  }

  .heroVideoVeil {
    background:
      linear-gradient(180deg, rgba(7, 6, 5, 0.40) 0%, rgba(7, 6, 5, 0.10) 36%, rgba(7, 6, 5, 0.34) 66%, rgba(7, 6, 5, 0.76) 100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .heroVideoMain {
    display: none;
  }

  .heroVideoAmbient {
    filter: blur(22px) brightness(0.48) saturate(0.7);
  }
}
CSS
fi

if ! grep -q 'heroVideoLayer' "$PAGE"; then
  echo "❌ Falló la inserción del vídeo en page.tsx"
  exit 1
fi

if [[ ! -s "$MEDIA_DIR/poema-universal-opening.mp4" ]]; then
  echo "❌ El MP4 no se copió correctamente."
  exit 1
fi

if [[ ! -s "$MEDIA_DIR/poema-universal-opening-poster.jpg" ]]; then
  echo "❌ El póster no se copió correctamente."
  exit 1
fi

echo ""
echo "✅ POEMA UNIVERSAL · VIDEO HERO V2 INSTALADO"
echo ""
echo "Modificado:"
echo "  - app/poema-universal/page.tsx"
echo "  - app/poema-universal/PoemaUniversalPage.module.css"
echo ""
echo "Vídeo:"
echo "  - public/poema-universal/media/poema-universal-opening.mp4"
echo ""
echo "Backups:"
echo "  - $ROOT/.backups-poema-universal/"
echo ""
echo "La portada conserva título, lema, cuenta atrás, manifiesto y navegación."
