#!/usr/bin/env bash
set -eu

PROJECT="$HOME/poema-universal"
PAGE="$PROJECT/app/poema-universal/page.tsx"
COMPONENTS="$PROJECT/app/poema-universal/components"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$PROJECT/backups/portada-ceremonial-$STAMP"

if [ ! -f "$PAGE" ]; then
  echo "❌ No encuentro:"
  echo "$PAGE"
  exit 1
fi

mkdir -p "$BACKUP/app/poema-universal/components" "$COMPONENTS"
cp "$PAGE" "$BACKUP/app/poema-universal/page.tsx"

for FILE in EditorialHero.tsx EditorialHero.module.css; do
  if [ -f "$COMPONENTS/$FILE" ]; then
    cp "$COMPONENTS/$FILE" "$BACKUP/app/poema-universal/components/$FILE"
  fi
done

cp "$SCRIPT_DIR/EditorialHero.tsx" "$COMPONENTS/EditorialHero.tsx"
cp "$SCRIPT_DIR/EditorialHero.module.css" "$COMPONENTS/EditorialHero.module.css"

python3 - "$PAGE" <<'PY'
from pathlib import Path
import re
import sys

page = Path(sys.argv[1])
text = page.read_text(encoding="utf-8")
original = text

import_line = 'import EditorialHero from "./components/EditorialHero";'
anchor = 'import AvatarRelicStudio from "./components/AvatarRelicStudio";'

if import_line not in text:
    if anchor not in text:
        raise SystemExit(
            "❌ No encuentro el import de AvatarRelicStudio."
        )
    text = text.replace(anchor, anchor + "\n" + import_line, 1)

phrase_pattern = re.compile(
    r'Una única obra escrita durante un año\s+'
    r'por\s+sesenta voces del mundo\.',
    re.S,
)

match = phrase_pattern.search(text)
if not match:
    raise SystemExit(
        "❌ No encuentro el texto central de la portada actual. "
        "No se ha modificado."
    )

section_start = text.rfind("<section", 0, match.start())
section_end = text.find("</section>", match.end())

if section_start == -1 or section_end == -1:
    raise SystemExit(
        "❌ No encuentro los límites de la portada."
    )

section_end += len("</section>")

replacement = (
    '<EditorialHero\n'
    '        time={time}\n'
    '        legacyItems={countdownItems}\n'
    '      />'
)

text = text[:section_start] + replacement + text[section_end:]

if text.count("<EditorialHero") != 1:
    raise SystemExit(
        "❌ La portada no quedó insertada de forma única."
    )

if text == original:
    raise SystemExit("❌ No se produjeron cambios.")

page.write_text(text, encoding="utf-8")
print("✅ Portada anterior sustituida.")
print("✅ Cuenta atrás conservada.")
print("✅ Nueva portada ceremonial conectada.")
PY

cd "$PROJECT"

echo ""
echo "===== VALIDACIÓN TYPESCRIPT ====="

if npx tsc --noEmit --pretty false; then
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "✅ PORTADA CEREMONIAL INSTALADA"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Copia de seguridad:"
  echo "$BACKUP"
else
  echo ""
  echo "❌ TypeScript encontró un error."
  echo "Restaurando la portada anterior..."

  cp "$BACKUP/app/poema-universal/page.tsx" "$PAGE"

  for FILE in EditorialHero.tsx EditorialHero.module.css; do
    if [ -f "$BACKUP/app/poema-universal/components/$FILE" ]; then
      cp "$BACKUP/app/poema-universal/components/$FILE" "$COMPONENTS/$FILE"
    else
      rm -f "$COMPONENTS/$FILE"
    fi
  done

  echo "✅ Estado anterior restaurado."
  exit 1
fi
