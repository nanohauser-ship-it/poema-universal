#!/usr/bin/env bash
set -euo pipefail

cd "${HOME}/poema-universal" || exit 1

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " ORGANISMO V4.7.1 · REACCIÓN VERBAL EVIDENTE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [[ -d app/laboratorio/verso-tecno ]]; then
  TARGET="app/laboratorio/verso-tecno"
elif [[ -d src/app/laboratorio/verso-tecno ]]; then
  TARGET="src/app/laboratorio/verso-tecno"
else
  echo "❌ No encuentro la sala /laboratorio/verso-tecno"
  exit 1
fi

if [[ ! -f "${TARGET}/OrganismoV47.tsx" ]]; then
  echo "❌ No encuentro OrganismoV47.tsx"
  echo "   La V4.7 debe estar instalada antes de aplicar esta corrección."
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PAYLOAD="${SCRIPT_DIR}/payload"

for REQUIRED in \
  "${PAYLOAD}/OrganismoV47.tsx" \
  "${PAYLOAD}/organismo-v47.module.css" \
  "${PAYLOAD}/organismo/OrganismoEmbryoScene.tsx" \
  "${PAYLOAD}/page.tsx"; do
  if [[ ! -f "${REQUIRED}" ]]; then
    echo "❌ Falta un archivo del paquete: ${REQUIRED}"
    exit 1
  fi
done

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="${HOME}/.poema-universal-backups/organismo-v471-${STAMP}"
mkdir -p "${BACKUP}/organismo"

cp "${TARGET}/OrganismoV47.tsx" "${BACKUP}/"
cp "${TARGET}/organismo-v47.module.css" "${BACKUP}/"
cp "${TARGET}/organismo/OrganismoEmbryoScene.tsx" "${BACKUP}/organismo/"
cp "${TARGET}/page.tsx" "${BACKUP}/"

echo "✅ Copia de seguridad fuera del proyecto:"
echo "   ${BACKUP}"

cp "${PAYLOAD}/OrganismoV47.tsx" "${TARGET}/OrganismoV47.tsx"
cp "${PAYLOAD}/organismo-v47.module.css" "${TARGET}/organismo-v47.module.css"
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
      console.error(
        ts.flattenDiagnosticMessageText(error.messageText, "\n"),
      );
    }
    process.exit(1);
  }

  console.log(`✅ Sintaxis correcta: ${file}`);
}
NODE

rm -rf .next

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ORGANISMO V4.7.1 INSTALADO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Impacto luminoso con cada tecla"
echo "✅ Letras viajando desde el teclado al embrión"
echo "✅ Crecimiento corporal hasta un 48 %"
echo "✅ Absorción fuerte al completar palabras"
echo "✅ Contracción visible al borrar"
echo "✅ Cámara acercándose según aumenta la biomasa"
echo ""
echo "Arranca ahora:"
echo "  cd ~/poema-universal"
echo "  npm run dev -- --webpack -p 3000"
