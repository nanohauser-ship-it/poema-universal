#!/usr/bin/env bash
set -euo pipefail

cd "${HOME}/poema-universal" || exit 1

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " ORGANISMO V4.8.1 · ROTACIÓN ANATÓMICA"
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
  "${PAYLOAD}/verso-tecno.module.css" \
  "${PAYLOAD}/organismo/OrganismoEmbryoScene.tsx" \
  "${PAYLOAD}/page.tsx"; do
  [[ -f "${REQUIRED}" ]] || {
    echo "❌ Falta ${REQUIRED}"
    exit 1
  }
done

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="${HOME}/.poema-universal-backups/organismo-v481-${STAMP}"
mkdir -p "${BACKUP}/organismo"

for FILE in OrganismoV47.tsx organismo-v47.module.css verso-tecno.module.css page.tsx; do
  [[ -f "${TARGET}/${FILE}" ]] && cp "${TARGET}/${FILE}" "${BACKUP}/${FILE}"
done

cp "${TARGET}/organismo/OrganismoEmbryoScene.tsx" \
   "${BACKUP}/organismo/OrganismoEmbryoScene.tsx"

echo "✅ Copia de seguridad: ${BACKUP}"

cp "${PAYLOAD}/OrganismoV47.tsx" "${TARGET}/OrganismoV47.tsx"
cp "${PAYLOAD}/organismo-v47.module.css" "${TARGET}/organismo-v47.module.css"
cp "${PAYLOAD}/verso-tecno.module.css" "${TARGET}/verso-tecno.module.css"
cp "${PAYLOAD}/organismo/OrganismoEmbryoScene.tsx" \
   "${TARGET}/organismo/OrganismoEmbryoScene.tsx"
cp "${PAYLOAD}/page.tsx" "${TARGET}/page.tsx"

echo "===== VALIDANDO SINTAXIS ====="

node - "${TARGET}/OrganismoV47.tsx" \
       "${TARGET}/organismo/OrganismoEmbryoScene.tsx" <<'NODE'
const fs = require("fs");
const ts = require("typescript");

for (const file of process.argv.slice(2)) {
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
}
NODE

rm -rf .next

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ORGANISMO V4.8.1 INSTALADO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Rota el modelo anatómico, no la cápsula"
echo "✅ Giro automático visible"
echo "✅ Arrastre sobre toda la cámara"
echo "✅ Botones ↶ AUTO ◎ ↷"
echo "✅ Protección contra NaN conservada"
echo ""
echo "Arranca:"
echo "  npm run dev -- --webpack -p 3000"
