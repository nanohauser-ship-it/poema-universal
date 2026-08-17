#!/usr/bin/env bash
set -eu

PROJECT="$HOME/poema-universal"
HOME_PAGE="$PROJECT/app/poema-universal/page.tsx"
ROOM_DIR="$PROJECT/app/poema-universal/herramientas-literarias"
ROOM_PAGE="$ROOM_DIR/page.tsx"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SOURCE_PAGE="$SCRIPT_DIR/page.template.txt"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$PROJECT/backups/sala-herramientas-literarias-$STAMP"

COMPONENTS=(
  "$PROJECT/app/poema-universal/components/MatrizEntrance.tsx"
  "$PROJECT/app/poema-universal/components/BestiarioEntrance.tsx"
  "$PROJECT/app/poema-universal/components/ThreePresencesEntrance.tsx"
  "$PROJECT/app/poema-universal/components/BorgesEntrance.tsx"
  "$PROJECT/app/poema-universal/components/AtlasInteriorEntrance.tsx"
)

if [ ! -f "$HOME_PAGE" ]; then
  echo "❌ No encuentro la página principal:"
  echo "$HOME_PAGE"
  exit 1
fi

if [ ! -f "$SOURCE_PAGE" ]; then
  echo "❌ Falta page.tsx junto al instalador."
  exit 1
fi

for COMPONENT in "${COMPONENTS[@]}"; do
  if [ ! -f "$COMPONENT" ]; then
    echo "❌ Falta el componente:"
    echo "$COMPONENT"
    exit 1
  fi
done

mkdir -p "$BACKUP/app/poema-universal" "$ROOM_DIR"
cp "$HOME_PAGE" "$BACKUP/app/poema-universal/page.tsx"

if [ -f "$ROOM_PAGE" ]; then
  mkdir -p "$BACKUP/app/poema-universal/herramientas-literarias"
  cp "$ROOM_PAGE" "$BACKUP/app/poema-universal/herramientas-literarias/page.tsx"
fi

cp "$SOURCE_PAGE" "$ROOM_PAGE"

python3 - "$HOME_PAGE" <<'PY'
from pathlib import Path
import re
import sys

page = Path(sys.argv[1])
text = page.read_text(encoding="utf-8")
original = text

imports = {
    "MatrizEntrance": r'import\s+MatrizEntrance\s+from\s+"\.\/components\/MatrizEntrance";\s*',
    "BestiarioEntrance": r'import\s+BestiarioEntrance\s+from\s+"\.\/components\/BestiarioEntrance";\s*',
    "BorgesEntrance": r'import\s+BorgesEntrance\s+from\s+"\.\/components\/BorgesEntrance";\s*',
    "AtlasInteriorEntrance": r'import\s+AtlasInteriorEntrance\s+from\s+"\.\/components\/AtlasInteriorEntrance";\s*',
    "ThreePresencesEntrance": r'import\s+ThreePresencesEntrance\s+from\s+"\.\/components\/ThreePresencesEntrance";\s*',
}

removed_imports = {}
for name, pattern in imports.items():
    text, count = re.subn(pattern, "", text, count=1, flags=re.S)
    removed_imports[name] = count

removed_renders = {}
for name in imports:
    pattern = rf'\s*<{name}\s*/>\s*'
    text, count = re.subn(pattern, "\n", text, count=1)
    removed_renders[name] = count

bestiario_nav = re.compile(
    r'\{\s*label:\s*"Bestiario",\s*'
    r'href:\s*"\/poema-universal\/bestiario-poetico",\s*\},',
    re.S,
)

replacement_nav = (
    '{\n'
    '    label: "Herramientas",\n'
    '    href: "/poema-universal/herramientas-literarias",\n'
    '  },'
)

text, nav_count = bestiario_nav.subn(
    replacement_nav,
    text,
    count=1,
)

missing_imports = [
    name for name, count in removed_imports.items()
    if count != 1
]
missing_renders = [
    name for name, count in removed_renders.items()
    if count != 1
]

if missing_imports or missing_renders or nav_count != 1:
    problems = []
    if missing_imports:
        problems.append(
            "imports: " + ", ".join(missing_imports)
        )
    if missing_renders:
        problems.append(
            "renders: " + ", ".join(missing_renders)
        )
    if nav_count != 1:
        problems.append("enlace Bestiario de navegación")

    raise SystemExit(
        "❌ No se localizaron de forma segura "
        + "; ".join(problems)
        + ". La página principal no se ha modificado."
    )

if text == original:
    raise SystemExit("❌ No se produjeron cambios.")

page.write_text(text, encoding="utf-8")

print("✅ Cinco herramientas retiradas de la página principal.")
print("✅ Navegación actualizada con la nueva sala.")
PY

cd "$PROJECT"

echo ""
echo "===== VALIDACIÓN TYPESCRIPT ====="

if npx tsc --noEmit --pretty false; then
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "✅ SALA DE HERRAMIENTAS CREADA"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Ruta:"
  echo "http://localhost:3000/poema-universal/herramientas-literarias"
  echo ""
  echo "Copia de seguridad:"
  echo "$BACKUP"
else
  echo ""
  echo "❌ TypeScript encontró un error."
  echo "Restaurando el estado anterior..."

  cp "$BACKUP/app/poema-universal/page.tsx" "$HOME_PAGE"

  if [ -f "$BACKUP/app/poema-universal/herramientas-literarias/page.tsx" ]; then
    cp "$BACKUP/app/poema-universal/herramientas-literarias/page.tsx" "$ROOM_PAGE"
  else
    rm -f "$ROOM_PAGE"
    rmdir "$ROOM_DIR" 2>/dev/null || true
  fi

  echo "✅ Estado anterior restaurado."
  exit 1
fi
