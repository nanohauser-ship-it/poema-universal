#!/bin/bash
set -euo pipefail

PROJECT="$HOME/poema-universal"
WORLD="$PROJECT/app/poema-universal/components/world/MundoPoema.tsx"
HERE="$(cd "$(dirname "$0")" && pwd)"
PATCH="$HERE/patch-v52.py"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="$HOME/.poema-universal-backups/anatomia-poetica-v52-$STAMP"

printf "\n=======================================================\n"
printf " POEMA UNIVERSAL · V5.2 · ANATOMÍA POÉTICA REFINADA\n"
printf "=======================================================\n\n"

if [ ! -f "$WORLD" ]; then
  echo "❌ No encuentro $WORLD"
  exit 1
fi

mkdir -p "$BACKUP_DIR"
cp "$WORLD" "$BACKUP_DIR/MundoPoema.tsx"

echo "✅ Copia de seguridad:"
echo "   $BACKUP_DIR/MundoPoema.tsx"

python3 "$PATCH" "$WORLD"

cd "$PROJECT"

echo ""
echo "===== VERIFICANDO INSTALACIÓN ====="

grep -q "V52_ANATOMIA_POETICA_REFINADA" "$WORLD"

echo "✅ Marca V5.2 encontrada."

if node <<'NODE'
const fs = require("fs");
const ts = require("typescript");

const file =
  "app/poema-universal/components/world/MundoPoema.tsx";

const source =
  fs.readFileSync(
    file,
    "utf8"
  );

const out =
  ts.transpileModule(
    source,
    {
      compilerOptions: {
        jsx:
          ts.JsxEmit.Preserve,
        target:
          ts.ScriptTarget.ES2022,
        module:
          ts.ModuleKind.ESNext,
      },
      reportDiagnostics: true,
    }
  );

const errors =
  (out.diagnostics || [])
    .filter(
      d =>
        d.category ===
        ts.DiagnosticCategory.Error
    );

if (errors.length) {
  for (const e of errors) {
    console.error(
      ts.flattenDiagnosticMessageText(
        e.messageText,
        "\n"
      )
    );
  }

  process.exit(1);
}

console.log(
  "✅ Sintaxis TSX correcta."
);
NODE
then
  echo ""
  echo "✅ V5.2 instalada correctamente."
else
  echo ""
  echo "❌ Falló la comprobación."
  echo "   Restaurando MundoPoema.tsx..."

  cp \
    "$BACKUP_DIR/MundoPoema.tsx" \
    "$WORLD"

  echo "✅ Archivo restaurado."
  exit 1
fi

echo ""
echo "Reinicia Next y abre:"
echo "http://localhost:3000/poema-universal/mundo"
echo ""
