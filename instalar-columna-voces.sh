#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"

if [ ! -f "package.json" ] || [ ! -f "app/poema-universal/page.tsx" ]; then
  echo "❌ Coloca este instalador y la carpeta columna-de-las-voces-files dentro de ~/poema-universal."
  exit 1
fi

STAMP="$(date +%Y%m%d-%H%M%S)"
TARGET="app/poema-universal/encadenamiento"
HOME_PAGE="app/poema-universal/page.tsx"
SOURCE="columna-de-las-voces-files/app/poema-universal/encadenamiento"

echo "===== INSTALANDO COLUMNA DE LAS VOCES ====="

if [ -d "$TARGET" ]; then
  cp -R "$TARGET" "${TARGET}.before-columna-${STAMP}"
  echo "✅ Copia de seguridad de la sala existente creada."
fi

mkdir -p "$TARGET"
cp -f "$SOURCE/page.tsx" "$TARGET/page.tsx"
cp -f "$SOURCE/Encadenamiento.tsx" "$TARGET/Encadenamiento.tsx"
cp -f "$SOURCE/encadenamiento.module.css" "$TARGET/encadenamiento.module.css"

cp "$HOME_PAGE" "${HOME_PAGE}.before-columna-voces-${STAMP}"

python3 <<'PY'
from pathlib import Path
import sys

path = Path("app/poema-universal/page.tsx")
text = path.read_text(encoding="utf-8")
href = "/poema-universal/encadenamiento"

if href in text:
    print("✅ El enlace ya estaba presente en la navegación.")
    sys.exit(0)

needle = "const navigationLinks = ["
start = text.find(needle)

if start == -1:
    print("⚠️ Sala instalada, pero no se encontró navigationLinks.")
    print("Añade manualmente un enlace a /poema-universal/encadenamiento")
    sys.exit(0)

end = text.find("];", start)

if end == -1:
    print("⚠️ Sala instalada, pero no se encontró el cierre de navigationLinks.")
    sys.exit(0)

entry = (
    '  {\\n'
    '    label: "Columna de las voces",\\n'
    '    href: "/poema-universal/encadenamiento",\\n'
    '  },\\n'
)

text = text[:end] + entry + text[end:]
path.write_text(text, encoding="utf-8")
print("✅ Acceso añadido a la navegación principal.")
PY

echo ""
echo "===== COMPROBACIÓN TYPESCRIPT ====="
npx tsc --noEmit

echo ""
echo "✅ Columna de las Voces instalada."
echo "✅ Ruta: http://localhost:3000/poema-universal/encadenamiento"
echo "✅ Copia de seguridad: ${HOME_PAGE}.before-columna-voces-${STAMP}"

open "http://localhost:3000/poema-universal/encadenamiento" 2>/dev/null || true
