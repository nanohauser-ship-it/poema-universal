#!/usr/bin/env bash
set -euo pipefail

cd "${HOME}/poema-universal" || exit 1

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " ORGANISMO V4.7.2 · REPARACIÓN THREE.JS / NaN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [[ -d app/laboratorio/verso-tecno ]]; then
  TARGET="app/laboratorio/verso-tecno"
elif [[ -d src/app/laboratorio/verso-tecno ]]; then
  TARGET="src/app/laboratorio/verso-tecno"
else
  echo "❌ No encuentro /laboratorio/verso-tecno"
  exit 1
fi

CURRENT="${TARGET}/organismo/OrganismoEmbryoScene.tsx"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FIXED="${SCRIPT_DIR}/payload/organismo/OrganismoEmbryoScene.tsx"

if [[ ! -f "${CURRENT}" ]]; then
  echo "❌ No encuentro ${CURRENT}"
  exit 1
fi

if [[ ! -f "${FIXED}" ]]; then
  echo "❌ El paquete está incompleto"
  exit 1
fi

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="${HOME}/.poema-universal-backups/organismo-v472-${STAMP}"
mkdir -p "${BACKUP}/organismo"
cp "${CURRENT}" "${BACKUP}/organismo/OrganismoEmbryoScene.tsx"

echo "✅ Copia de seguridad:"
echo "   ${BACKUP}"

cp "${FIXED}" "${CURRENT}"

echo "===== VALIDANDO SINTAXIS ====="
node - "${CURRENT}" <<'NODE'
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
    console.error(ts.flattenDiagnosticMessageText(error.messageText, "\n"));
  }
  process.exit(1);
}
console.log(`✅ Sintaxis correcta: ${file}`);
NODE

rm -rf .next

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ORGANISMO V4.7.2 REPARADO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Eliminado el cálculo NaN del bucle 3D"
echo "✅ Escala del embrión estabilizada"
echo "✅ Biomasa y pulsos limitados a valores seguros"
echo "✅ Geometrías verificadas al cargar el GLB"
echo "✅ Reacción verbal conservada"
echo ""
echo "Arranca:"
echo "  cd ~/poema-universal"
echo "  npm run dev -- --webpack -p 3000"
