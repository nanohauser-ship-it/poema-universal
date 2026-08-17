#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-$PWD}"
CSS="$ROOT/app/poema-universal/PoemaUniversalPage.module.css"
PAGE="$ROOT/app/poema-universal/page.tsx"
VIDEO="$ROOT/public/poema-universal/media/poema-universal-opening.mp4"
STAMP="$(date +%Y%m%d-%H%M%S)"

for f in "$CSS" "$PAGE" "$VIDEO"; do
  if [[ ! -f "$f" ]]; then
    echo "❌ Falta: $f"
    echo "No modifico nada."
    exit 1
  fi
done

if ! grep -q 'heroVideoMain' "$PAGE" \
  || ! grep -q 'HERO VIDEO V2.1 · ATMOSFERA' "$CSS" \
  || ! grep -q 'HERO VIDEO V2.2 · BAJADA SUTIL' "$CSS"; then
  echo "❌ Este pulido necesita la V2.2 activa. No modifico nada."
  exit 1
fi

mkdir -p "$ROOT/.backups-poema-universal"
cp "$CSS" "$ROOT/.backups-poema-universal/PoemaUniversalPage.module.css.before-video-v2-3-$STAMP"

if ! grep -q 'POEMA UNIVERSAL · HERO VIDEO V2.3 · PULIDO FINAL' "$CSS"; then
cat >> "$CSS" <<'CSS'

/* ================================================================
   POEMA UNIVERSAL · HERO VIDEO V2.3 · PULIDO FINAL
   Color + fusión lateral + profundidad tipográfica.
   No altera geometría, cuenta atrás ni navegación.
   ================================================================ */

/* Recuperamos detalle en la película sin convertirla en una pantalla brillante. */
.heroVideoMain {
  opacity: 1 !important;
  filter:
    saturate(0.96)
    contrast(1.045)
    brightness(0.99) !important;

  -webkit-mask-image: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0,0,0,.22) 3%,
    rgba(0,0,0,.62) 8%,
    #000 15%,
    #000 85%,
    rgba(0,0,0,.62) 92%,
    rgba(0,0,0,.22) 97%,
    transparent 100%
  ) !important;
  mask-image: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0,0,0,.22) 3%,
    rgba(0,0,0,.62) 8%,
    #000 15%,
    #000 85%,
    rgba(0,0,0,.62) 92%,
    rgba(0,0,0,.22) 97%,
    transparent 100%
  ) !important;
}

/* El movimiento lateral se acerca al centro, pero permanece como atmósfera. */
.heroVideoAmbientMotion {
  opacity: 0.79 !important;
  filter:
    blur(52px)
    brightness(0.31)
    saturate(0.62)
    contrast(1.04) !important;
}

.heroVideoAmbient {
  opacity: 0.24 !important;
  filter:
    blur(50px)
    brightness(0.29)
    saturate(0.58) !important;
}

/* La frase cede una fracción de luz para crear un segundo plano. */
.heroLead,
.heroLead span {
  color: rgba(247, 240, 231, 0.87) !important;
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.38) !important;
}

@media (max-width: 760px) {
  .heroVideoMain {
    filter:
      saturate(0.96)
      contrast(1.035)
      brightness(0.97) !important;
    -webkit-mask-image: none !important;
    mask-image: none !important;
  }

  .heroVideoAmbientMotion {
    opacity: 0.40 !important;
    filter:
      blur(34px)
      brightness(0.32)
      saturate(0.62) !important;
  }

  .heroLead,
  .heroLead span {
    color: rgba(247, 240, 231, 0.90) !important;
  }
}
CSS
fi

if ! grep -q 'HERO VIDEO V2.3 · PULIDO FINAL' "$CSS"; then
  echo "❌ No se aplicó el pulido final."
  exit 1
fi

echo ""
echo "✅ POEMA UNIVERSAL · HERO VIDEO V2.3 · PULIDO FINAL INSTALADO"
echo ""
echo "Pulido:"
echo "  - película central: más detalle y luz, sin perder el negro"
echo "  - bordes: fusión horizontal más larga y orgánica"
echo "  - atmósfera lateral: movimiento más presente cerca del centro"
echo "  - frase fundacional: un segundo plano ligeramente más suave"
echo ""
echo "Intacto: título, posición, cuenta atrás, navegación y manifiesto."
echo "Backup: $ROOT/.backups-poema-universal/"
