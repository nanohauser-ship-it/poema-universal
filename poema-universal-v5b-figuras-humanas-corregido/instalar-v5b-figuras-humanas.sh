#!/bin/bash
set -euo pipefail

PROJECT="$HOME/poema-universal"
WORLD="$PROJECT/app/poema-universal/components/world/MundoPoema.tsx"
HERE="$(cd "$(dirname "$0")" && pwd)"
PATCH="$HERE/patch-v5.py"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="$HOME/.poema-universal-backups/figuras-humanas-v5b-$STAMP"

printf "\n===============================================\n"
printf " POEMA UNIVERSAL · V5B · FIGURAS HUMANAS\n"
printf "===============================================\n\n"

if [ ! -f "$WORLD" ]; then
  echo "❌ No encuentro $WORLD"
  exit 1
fi

mkdir -p "$BACKUP_DIR"
cp "$WORLD" "$BACKUP_DIR/MundoPoema.tsx"
echo "✅ Copia: $BACKUP_DIR/MundoPoema.tsx"

python3 "$PATCH" "$WORLD"

cd "$PROJECT"

echo ""
echo "===== VERIFICANDO INSTALACIÓN ====="
grep -q "V5_FIGURAS_ESCULTORICAS_HUMANAS" "$WORLD"
echo "✅ Marca V5 encontrada."

node <<'NODE'
const fs = require('fs');
const ts = require('typescript');
const file = 'app/poema-universal/components/world/MundoPoema.tsx';
const source = fs.readFileSync(file, 'utf8');
const out = ts.transpileModule(source, {
  compilerOptions: {
    jsx: ts.JsxEmit.Preserve,
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
  },
  reportDiagnostics: true,
});
const errors = (out.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error);
if (errors.length) {
  for (const e of errors) console.error(ts.flattenDiagnosticMessageText(e.messageText, '\n'));
  process.exit(1);
}
console.log('✅ Sintaxis TSX correcta.');
NODE

echo ""
echo "✅ V5B instalada correctamente."
echo "   Ahora reinicia Next y recarga /poema-universal/mundo"
echo ""
