#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-$PWD}"
CSS="$ROOT/app/poema-universal/PoemaUniversalPage.module.css"
PAGE="$ROOT/app/poema-universal/page.tsx"
STAMP="$(date +%Y%m%d-%H%M%S)"

if [[ ! -f "$CSS" || ! -f "$PAGE" ]]; then
  echo "❌ No encuentro la portada actual de Poema Universal. No modifico nada."
  exit 1
fi

if ! grep -q 'heroVideoMain' "$PAGE" || ! grep -q 'HERO VIDEO V2.1 · ATMOSFERA' "$CSS"; then
  echo "❌ Este ajuste necesita la V2.1 · Atmósfera activa. No modifico nada."
  exit 1
fi

mkdir -p "$ROOT/.backups-poema-universal"
cp "$CSS" "$ROOT/.backups-poema-universal/PoemaUniversalPage.module.css.before-video-v2-2-$STAMP"

if ! grep -q 'POEMA UNIVERSAL · HERO VIDEO V2.2 · BAJADA SUTIL' "$CSS"; then
cat >> "$CSS" <<'CSS'

/* ================================================================
   POEMA UNIVERSAL · HERO VIDEO V2.2 · BAJADA SUTIL
   La película desciende ligeramente; texto y cuenta atrás no se mueven.
   ================================================================ */

.heroVideoMain {
  top: 30px !important;
  height: calc(100% + 30px) !important;
}

.heroVideoAmbientMotion {
  transform: translateY(18px) scale(1.10) !important;
}

@media (max-width: 760px) {
  .heroVideoMain {
    top: 18px !important;
    height: calc(100% + 18px) !important;
  }

  .heroVideoAmbientMotion {
    transform: translateY(10px) scale(1.06) !important;
  }
}
CSS
fi

if ! grep -q 'HERO VIDEO V2.2 · BAJADA SUTIL' "$CSS"; then
  echo "❌ No se aplicó el ajuste."
  exit 1
fi

echo ""
echo "✅ POEMA UNIVERSAL · HERO VIDEO V2.2 INSTALADO"
echo ""
echo "Ajuste:"
echo "  - vídeo central: +30 px hacia abajo"
echo "  - atmósfera en movimiento: +18 px"
echo "  - texto, título y cuenta atrás: intactos"
echo ""
echo "Backup: $ROOT/.backups-poema-universal/"
