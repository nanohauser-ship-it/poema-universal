#!/bin/bash
set -euo pipefail

PROJECT="$HOME/poema-universal"
WORLD="$PROJECT/app/poema-universal/components/world"
MUNDO="$WORLD/MundoPoema.tsx"
PUBLIC_AUDIO="$PROJECT/public/audio/poema-universal"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PAYLOAD="$SCRIPT_DIR/payload"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_ROOT="$HOME/.poema-universal-backups/bso-the-light-stays-on-$STAMP"

if [ ! -d "$PROJECT" ]; then
  echo "❌ No encuentro $PROJECT"
  exit 1
fi

if [ ! -f "$MUNDO" ]; then
  echo "❌ No encuentro $MUNDO"
  exit 1
fi

mkdir -p "$BACKUP_ROOT/world" "$BACKUP_ROOT/public-audio"
cp "$MUNDO" "$BACKUP_ROOT/world/MundoPoema.tsx"

for file in PoemSoundtrack.tsx PoemSoundtrack.module.css PoemSoundLightRig.tsx; do
  if [ -f "$WORLD/$file" ]; then
    cp "$WORLD/$file" "$BACKUP_ROOT/world/$file"
  fi
done

if [ -f "$PUBLIC_AUDIO/the-light-stays-on.mp3" ]; then
  cp "$PUBLIC_AUDIO/the-light-stays-on.mp3" "$BACKUP_ROOT/public-audio/the-light-stays-on.mp3"
fi

mkdir -p "$WORLD" "$PUBLIC_AUDIO"
cp "$PAYLOAD/world/PoemSoundtrack.tsx" "$WORLD/PoemSoundtrack.tsx"
cp "$PAYLOAD/world/PoemSoundtrack.module.css" "$WORLD/PoemSoundtrack.module.css"
cp "$PAYLOAD/world/PoemSoundLightRig.tsx" "$WORLD/PoemSoundLightRig.tsx"
cp "$PAYLOAD/audio/the-light-stays-on.mp3" "$PUBLIC_AUDIO/the-light-stays-on.mp3"

python3 - "$MUNDO" <<'PY'
from pathlib import Path
import sys

path = Path(sys.argv[1])
text = path.read_text(encoding="utf-8")
original = text

# 1. Imports. We anchor on PoemBook because it is present in the current canonical page.
anchor = 'import PoemBook, { type PoemEntry } from "./PoemBook";'
imports = (
    'import PoemSoundLightRig from "./PoemSoundLightRig";\n'
    'import PoemSoundtrack from "./PoemSoundtrack";'
)

if 'from "./PoemSoundtrack"' not in text:
    if anchor not in text:
        raise SystemExit("❌ No pude localizar el import de PoemBook. No se toca el archivo.")
    text = text.replace(anchor, anchor + "\n" + imports, 1)

# 2. Light rig inside Scene. We insert just before AutonomousCamera so the original scene is untouched.
if '<PoemSoundLightRig />' not in text:
    anchor = '      <AutonomousCamera />'
    if anchor not in text:
        raise SystemExit("❌ No pude localizar AutonomousCamera. No se toca el archivo.")
    text = text.replace(anchor, '      <PoemSoundLightRig />\n\n' + anchor, 1)

# 3. Minimal soundtrack UI in the DOM layer, between NarrativeOverlay and PoemBook.
if '<PoemSoundtrack />' not in text:
    anchor = '      <NarrativeOverlay />'
    if anchor not in text:
        raise SystemExit("❌ No pude localizar NarrativeOverlay. No se toca el archivo.")
    text = text.replace(anchor, anchor + '\n\n      <PoemSoundtrack />', 1)

if text == original:
    print("ℹ️ MundoPoema.tsx ya estaba preparado; no fue necesario parchearlo.")
else:
    path.write_text(text, encoding="utf-8")
    print("✅ MundoPoema.tsx conectado sin reemplazar su estructura.")
PY

cd "$PROJECT"

# Verificación de sintaxis solamente. Evita que copias históricas del proyecto hagan fallar un tsc global.
node <<'NODE'
const fs = require('fs');
const ts = require('typescript');
const files = [
  'app/poema-universal/components/world/MundoPoema.tsx',
  'app/poema-universal/components/world/PoemSoundtrack.tsx',
  'app/poema-universal/components/world/PoemSoundLightRig.tsx',
];
let failed = false;
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  const out = ts.transpileModule(source, {
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ESNext,
    },
    reportDiagnostics: true,
    fileName: file,
  });
  const diagnostics = out.diagnostics || [];
  if (diagnostics.length) {
    failed = true;
    console.error(`\n❌ ${file}`);
    for (const d of diagnostics) {
      console.error(ts.flattenDiagnosticMessageText(d.messageText, '\n'));
    }
  } else {
    console.log(`✅ Sintaxis: ${file}`);
  }
}
if (failed) process.exit(1);
NODE

echo ""
echo "════════════════════════════════════════════════════"
echo "✅ BSO INSTALADA: THE LIGHT STAYS ON"
echo "✅ Audio: public/audio/poema-universal/the-light-stays-on.mp3"
echo "✅ Reproductor editorial discreto añadido"
echo "✅ Luces 3D reactivas añadidas sin alterar la escena original"
echo "✅ Backup: $BACKUP_ROOT"
echo "════════════════════════════════════════════════════"
echo ""
echo "Ahora reinicia Next:"
echo "  cd \"$PROJECT\""
echo "  pkill -f \"next dev\" 2>/dev/null || true"
echo "  pkill -f \"next-server\" 2>/dev/null || true"
echo "  rm -rf .next"
echo "  npm run dev -- --webpack -p 3000"
echo ""
echo "Después abre: http://localhost:3000/poema-universal/mundo"
echo "y pulsa ▶ en The Light Stays On para activar música + luz."
