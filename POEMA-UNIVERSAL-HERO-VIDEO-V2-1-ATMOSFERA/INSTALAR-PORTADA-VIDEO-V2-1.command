#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-$PWD}"
PAGE="$ROOT/app/poema-universal/page.tsx"
CSS="$ROOT/app/poema-universal/PoemaUniversalPage.module.css"
VIDEO="$ROOT/public/poema-universal/media/poema-universal-opening.mp4"
STAMP="$(date +%Y%m%d-%H%M%S)"

for f in "$PAGE" "$CSS" "$VIDEO"; do
  if [[ ! -f "$f" ]]; then
    echo "❌ Falta: $f"
    echo "Este refinamiento necesita la V2 ya instalada. No modifico nada."
    exit 1
  fi
done

if ! grep -q 'heroVideoLayer' "$PAGE" || ! grep -q 'heroVideoMain' "$PAGE"; then
  echo "❌ No encuentro la integración V2 activa en page.tsx. No modifico nada."
  exit 1
fi

mkdir -p "$ROOT/.backups-poema-universal"
cp "$PAGE" "$ROOT/.backups-poema-universal/page.tsx.before-video-v2-1-$STAMP"
cp "$CSS" "$ROOT/.backups-poema-universal/PoemaUniversalPage.module.css.before-video-v2-1-$STAMP"

python3 - "$PAGE" <<'PY'
from pathlib import Path
import sys

page = Path(sys.argv[1])
text = page.read_text()

if "heroVideoAmbientMotion" not in text:
    needle = '      <div className={styles.heroVideoAmbient} />\n'
    if needle not in text:
        raise SystemExit("❌ No encuentro heroVideoAmbient dentro del hero V2.")
    moving = '''      <div className={styles.heroVideoAmbient} />\n      <video\n        aria-hidden="true"\n        className={styles.heroVideoAmbientMotion}\n        autoPlay\n        muted\n        loop\n        playsInline\n        preload="metadata"\n        tabIndex={-1}\n      >\n        <source\n          src="/poema-universal/media/poema-universal-opening.mp4"\n          type="video/mp4"\n        />\n      </video>\n'''
    text = text.replace(needle, moving, 1)

page.write_text(text)
PY

if ! grep -q 'POEMA UNIVERSAL · HERO VIDEO V2.1 · ATMOSFERA' "$CSS"; then
cat >> "$CSS" <<'CSS'

/* ================================================================
   POEMA UNIVERSAL · HERO VIDEO V2.1 · ATMOSFERA
   Movimiento expandido + bordes fundidos + Universal más contenido
   ================================================================ */

.heroVideoAmbient {
  opacity: 0.34 !important;
  filter: blur(54px) brightness(0.30) saturate(0.58) !important;
  transform: scale(1.18) !important;
}

.heroVideoAmbientMotion {
  position: absolute;
  inset: -9%;
  z-index: 1;
  width: 118%;
  height: 118%;
  object-fit: cover;
  object-position: 50% 48%;
  pointer-events: none;
  opacity: 0.72;
  filter: blur(58px) brightness(0.27) saturate(0.58) contrast(1.06);
  transform: scale(1.10);
}

.heroVideoMain {
  z-index: 2;
  -webkit-mask-image: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0,0,0,.55) 4%,
    #000 10%,
    #000 90%,
    rgba(0,0,0,.55) 96%,
    transparent 100%
  );
  mask-image: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0,0,0,.55) 4%,
    #000 10%,
    #000 90%,
    rgba(0,0,0,.55) 96%,
    transparent 100%
  );
  box-shadow: none !important;
}

.heroVideoVeil {
  z-index: 3 !important;
  background:
    linear-gradient(180deg, rgba(7,6,5,.38) 0%, rgba(7,6,5,.06) 34%, rgba(7,6,5,.14) 64%, rgba(7,6,5,.62) 100%),
    radial-gradient(ellipse at 50% 43%, rgba(0,0,0,0) 22%, rgba(0,0,0,.18) 62%, rgba(0,0,0,.48) 100%) !important;
}

.heroFrame {
  z-index: 4 !important;
}

.heroTitle em {
  font-size: 0.92em !important;
  line-height: 0.92 !important;
}

@media (max-width: 760px) {
  .heroVideoAmbientMotion {
    inset: -5%;
    width: 110%;
    height: 110%;
    opacity: 0.34;
    filter: blur(34px) brightness(0.32) saturate(0.62);
  }

  .heroVideoMain {
    -webkit-mask-image: none;
    mask-image: none;
  }

  .heroTitle em {
    font-size: 0.94em !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .heroVideoAmbientMotion {
    display: none;
  }
}
CSS
fi

if ! grep -q 'heroVideoAmbientMotion' "$PAGE"; then
  echo "❌ No se insertó la extensión audiovisual."
  exit 1
fi

if ! grep -q 'HERO VIDEO V2.1 · ATMOSFERA' "$CSS"; then
  echo "❌ No se instalaron los estilos V2.1."
  exit 1
fi

echo ""
echo "✅ POEMA UNIVERSAL · HERO VIDEO V2.1 INSTALADO"
echo ""
echo "Cambios:"
echo "  - movimiento del propio vídeo extendido a los laterales"
echo "  - bordes del vídeo central fundidos, sin corte vertical duro"
echo "  - Universal reducido un 8 %"
echo ""
echo "No se ha modificado la cuenta atrás, navegación, manifiesto ni resto de la página."
echo "Backups: $ROOT/.backups-poema-universal/"
