#!/bin/bash
set -euo pipefail

PROJECT="$HOME/poema-universal"
WORLD="$PROJECT/app/poema-universal/components/world/MundoPoema.tsx"
HERE="$(cd "$(dirname "$0")" && pwd)"
PATCH="$HERE/patch-v52c.py"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="$HOME/.poema-universal-backups/v52c-cabezas-rendimiento-$STAMP"

echo ""
echo "=========================================================="
echo " POEMA UNIVERSAL · V5.2C · CABEZAS + RENDIMIENTO"
echo "=========================================================="
echo ""

if [ ! -f "$WORLD" ]; then
  echo "❌ No encuentro:"
  echo "   $WORLD"
  exit 1
fi

mkdir -p "$BACKUP_DIR"
cp "$WORLD" "$BACKUP_DIR/MundoPoema.tsx"

echo "✅ Copia de seguridad:"
echo "   $BACKUP_DIR/MundoPoema.tsx"
echo ""

python3 "$PATCH" "$WORLD"

cd "$PROJECT"

echo ""
echo "===== VERIFICANDO ====="

grep -q "V52C_CABEZAS_RENDIMIENTO" "$WORLD"
echo "✅ Marca V5.2C encontrada."

if node <<'NODE'
const fs = require("fs");
const ts = require("typescript");

const file =
  "app/poema-universal/components/world/MundoPoema.tsx";

const source =
  fs.readFileSync(file, "utf8");

const result =
  ts.transpileModule(source, {
    compilerOptions: {
      jsx: ts.JsxEmit.Preserve,
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
    },
    reportDiagnostics: true,
  });

const errors =
  (result.diagnostics || []).filter(
    d => d.category === ts.DiagnosticCategory.Error
  );

if (errors.length) {
  for (const error of errors) {
    console.error(
      ts.flattenDiagnosticMessageText(
        error.messageText,
        "\n"
      )
    );
  }
  process.exit(1);
}

console.log("✅ Sintaxis TSX correcta.");
NODE
then
  echo ""
  echo "✅ V5.2C instalada correctamente."
else
  echo ""
  echo "❌ Hubo un error. Restaurando copia..."
  cp "$BACKUP_DIR/MundoPoema.tsx" "$WORLD"
  echo "✅ MundoPoema.tsx restaurado."
  exit 1
fi

echo ""
echo "Reinicia Next:"
echo "npm run dev -- --webpack -p 3000"
echo ""
