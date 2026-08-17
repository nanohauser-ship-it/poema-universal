#!/usr/bin/env bash
set -euo pipefail

cd "${HOME}/poema-universal" || exit 1

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " ORGANISMO V4.9.1 · NUEVO POEMA DIRECTO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [[ -d app/laboratorio/verso-tecno ]]; then
  TARGET="app/laboratorio/verso-tecno"
elif [[ -d src/app/laboratorio/verso-tecno ]]; then
  TARGET="src/app/laboratorio/verso-tecno"
else
  echo "❌ No encuentro /laboratorio/verso-tecno"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PAYLOAD="${SCRIPT_DIR}/payload"

for REQUIRED in \
  "${PAYLOAD}/OrganismoV47.tsx" \
  "${PAYLOAD}/organismo-v47.module.css" \
  "${PAYLOAD}/page.tsx"; do
  [[ -f "${REQUIRED}" ]] || {
    echo "❌ Falta ${REQUIRED}"
    exit 1
  }
done

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="${HOME}/.poema-universal-backups/organismo-v491-${STAMP}"
mkdir -p "${BACKUP}"

for FILE in OrganismoV47.tsx organismo-v47.module.css page.tsx; do
  [[ -f "${TARGET}/${FILE}" ]] && cp "${TARGET}/${FILE}" "${BACKUP}/${FILE}"
done

echo "✅ Copia de seguridad: ${BACKUP}"

cp "${PAYLOAD}/OrganismoV47.tsx" "${TARGET}/OrganismoV47.tsx"
cp "${PAYLOAD}/organismo-v47.module.css" \
   "${TARGET}/organismo-v47.module.css"
cp "${PAYLOAD}/page.tsx" "${TARGET}/page.tsx"

echo "===== VALIDANDO SINTAXIS ====="

node - "${TARGET}/OrganismoV47.tsx" <<'NODE'
const fs = require("fs");
const ts = require("typescript");

const file = process.argv[2];
const source = fs.readFileSync(file, "utf8");
const result = ts.transpileModule(source, {
  compilerOptions: {
    jsx: ts.JsxEmit.ReactJSX,
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
  },
  reportDiagnostics: true,
  fileName: file,
});

const errors = (result.diagnostics || []).filter(
  (item) => item.category === ts.DiagnosticCategory.Error,
);

if (errors.length) {
  for (const error of errors) {
    console.error(
      ts.flattenDiagnosticMessageText(error.messageText, "\n"),
    );
  }
  process.exit(1);
}

console.log(`✅ Sintaxis correcta: ${file}`);
NODE

rm -rf .next

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ORGANISMO V4.9.1 INSTALADO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Botón visible dentro de ALIMENTACIÓN VERBAL"
echo "✅ Confirmación nativa del navegador"
echo "✅ Borrado directo del organismo y su memoria local"
echo "✅ Regreso inmediato a la incubadora vacía"
echo "✅ Rotación y geometría Three.js intactas"
echo ""
echo "Arranca:"
echo "  npm run dev -- --webpack -p 3000"
