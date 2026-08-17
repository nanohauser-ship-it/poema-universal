#!/bin/bash
set -euo pipefail

PROJECT="$HOME/poema-universal"
COMPONENT="$PROJECT/app/poema-universal/sala-de-las-tres-presencias/components/SalaTresPresencias.tsx"
CSS="$PROJECT/app/poema-universal/sala-de-las-tres-presencias/components/SalaTresPresencias.module.css"
PUBLIC_DIR="$PROJECT/public/poema-universal/presencias/caratulas"
KIT_DIR="$(cd "$(dirname "$0")" && pwd)"
STAMP="$(date +%Y%m%d-%H%M%S)"

if [ ! -d "$PROJECT" ]; then
  echo "✗ No existe el proyecto: $PROJECT"
  exit 1
fi

if [ ! -f "$COMPONENT" ]; then
  echo "✗ No existe: $COMPONENT"
  exit 1
fi

if [ ! -f "$CSS" ]; then
  echo "✗ No existe: $CSS"
  exit 1
fi

mkdir -p "$PUBLIC_DIR"

cp "$KIT_DIR/camus.png" "$PUBLIC_DIR/camus.png"
cp "$KIT_DIR/borges.png" "$PUBLIC_DIR/borges.png"
cp "$KIT_DIR/pizarnik.png" "$PUBLIC_DIR/pizarnik.png"

cp "$COMPONENT" "$COMPONENT.$STAMP.bak"
cp "$CSS" "$CSS.$STAMP.bak"

python3 <<'PY'
from pathlib import Path
import re

project = Path.home() / "poema-universal"
component = project / "app/poema-universal/sala-de-las-tres-presencias/components/SalaTresPresencias.tsx"
css_file = project / "app/poema-universal/sala-de-las-tres-presencias/components/SalaTresPresencias.module.css"

source = component.read_text(encoding="utf-8")
css = css_file.read_text(encoding="utf-8")

if "const COVER_PATHS" not in source:
    marker = '''const PRESENCE_IDS:
  readonly PresenceId[] = [
    "camus",
    "borges",
    "pizarnik",
  ];
'''
    addition = marker + '''
const COVER_PATHS:
  Record<PresenceId, string> = {
  camus:
    "/poema-universal/presencias/caratulas/camus.png",
  borges:
    "/poema-universal/presencias/caratulas/borges.png",
  pizarnik:
    "/poema-universal/presencias/caratulas/pizarnik.png",
};
'''
    if marker not in source:
        raise SystemExit(
            "✗ No se encontró PRESENCE_IDS en SalaTresPresencias.tsx"
        )
    source = source.replace(marker, addition, 1)

pattern = re.compile(
    r'''<PresenceArtwork\s*
\s*presenceId=\{\s*
presenceId\s*
\}\s*
/>''',
    re.MULTILINE,
)

replacement = '''<div className={styles.coverArtwork}>
                  <img
                    src={COVER_PATHS[presenceId]}
                    alt={`Carátula de ${presence.authorName}`}
                  />
                </div>'''

if pattern.search(source):
    source = pattern.sub(replacement, source, count=1)
elif "className={styles.coverArtwork}" not in source:
    raise SystemExit(
        "✗ No se encontró la carátula simbólica que debía sustituirse."
    )

component.write_text(source, encoding="utf-8")

marker = "CARATULAS REALES DE LAS TRES PRESENCIAS"

if marker not in css:
    css += r'''

/* CARATULAS REALES DE LAS TRES PRESENCIAS */
.coverArtwork {
  position: relative;
  min-height: 15rem;
  overflow: hidden;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.22);
  box-shadow:
    inset 0 0 0 1px
    rgba(255, 255, 255, 0.08);
}

.coverArtwork::after {
  position: absolute;
  inset: 0;
  content: "";
  pointer-events: none;
  background:
    linear-gradient(
      115deg,
      transparent 25%,
      rgba(255, 255, 255, 0.11) 43%,
      transparent 60%
    );
  transform: translateX(-135%);
  transition: transform 700ms ease;
}

.presenceCard:hover .coverArtwork::after {
  transform: translateX(135%);
}

.coverArtwork img {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 15rem;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  object-position: center;
  transition:
    transform 420ms cubic-bezier(0.16, 1, 0.3, 1),
    filter 420ms ease;
}

.presenceCard:hover .coverArtwork img {
  transform: scale(1.025);
  filter: contrast(1.02) saturate(1.03);
}

.card_camus .coverArtwork {
  box-shadow:
    0 1rem 2.8rem
    rgba(125, 104, 69, 0.13);
}

.card_borges .coverArtwork {
  box-shadow:
    0 1rem 2.8rem
    rgba(31, 42, 55, 0.14);
}

.card_pizarnik .coverArtwork {
  box-shadow:
    0 1rem 2.8rem
    rgba(10, 5, 9, 0.42);
}

@media (max-width: 980px) {
  .coverArtwork img {
    max-height: 42rem;
  }
}
'''
    css_file.write_text(css, encoding="utf-8")

print("✓ Carátulas insertadas en las tarjetas")
print("✓ Camus, Borges y Pizarnik usan imágenes reales")
PY

cd "$PROJECT"

echo ""
echo "=== COMPROBANDO TYPESCRIPT ==="

if npx tsc --noEmit; then
  echo ""
  echo "✓ TypeScript correcto"
  echo "✓ Carátulas instaladas"
  echo ""
  echo "ABRIR:"
  echo "http://localhost:3000/poema-universal/sala-de-las-tres-presencias"
else
  echo ""
  echo "✗ TypeScript encontró un problema"
  echo "Restaurando los archivos anteriores..."

  cp "$COMPONENT.$STAMP.bak" "$COMPONENT"
  cp "$CSS.$STAMP.bak" "$CSS"

  echo "✓ Archivos restaurados"
  exit 1
fi
