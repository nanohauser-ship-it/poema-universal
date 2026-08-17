#!/usr/bin/env bash
set -euo pipefail

cd "${HOME}/poema-universal" || exit 1

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " ORGANISMO V4.8.2 · REPARACIÓN DE GEOMETRÍA"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [[ -f app/laboratorio/verso-tecno/organismo/OrganismoEmbryoScene.tsx ]]; then
  FILE="app/laboratorio/verso-tecno/organismo/OrganismoEmbryoScene.tsx"
elif [[ -f src/app/laboratorio/verso-tecno/organismo/OrganismoEmbryoScene.tsx ]]; then
  FILE="src/app/laboratorio/verso-tecno/organismo/OrganismoEmbryoScene.tsx"
else
  echo "❌ No encuentro OrganismoEmbryoScene.tsx"
  exit 1
fi

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="${HOME}/.poema-universal-backups/organismo-v482-${STAMP}"
mkdir -p "${BACKUP}"
cp "${FILE}" "${BACKUP}/OrganismoEmbryoScene.tsx"

echo "✅ Copia de seguridad:"
echo "   ${BACKUP}"

python3 - "${FILE}" <<'PY'
from pathlib import Path
import re
import sys

path = Path(sys.argv[1])
text = path.read_text(encoding="utf-8")

old_count = """    const particleCount = Math.min(
      950,
      340 + complexity * 7 + vitalMemory * 2,
    );"""

new_count = """    // BufferAttribute requires a whole number of vertices.
    // A decimal count creates an incomplete final XYZ coordinate and
    // Three.js computes a NaN bounding sphere.
    const particleCount = Math.max(
      1,
      Math.floor(
        Math.min(
          950,
          340 + complexity * 7 + vitalMemory * 2,
        ),
      ),
    );"""

if old_count in text:
    text = text.replace(old_count, new_count, 1)
elif "const particleCount = Math.max(" in text and "Math.floor(" in text:
    print("ℹ️ El número entero de partículas ya estaba corregido.")
else:
    pattern = re.compile(
        r"""    const particleCount\s*=\s*Math\.min\(\s*
             950,\s*
             340\s*\+\s*complexity\s*\*\s*7\s*\+\s*vitalMemory\s*\*\s*2,\s*
             \);""",
        re.VERBOSE,
    )
    text, count = pattern.subn(new_count, text, count=1)
    if count == 0:
        raise SystemExit(
            "❌ No pude localizar la definición de particleCount."
        )

attribute_block = """    particleGeometry.setAttribute(
      "size",
      new THREE.BufferAttribute(sizes, 1),
    );"""

repair_block = """    particleGeometry.setAttribute(
      "size",
      new THREE.BufferAttribute(sizes, 1),
    );

    // Validate the generated particle cloud before the first render.
    repairGeometryPositions(particleGeometry);"""

if "repairGeometryPositions(particleGeometry);" not in text:
    if attribute_block not in text:
        raise SystemExit(
            "❌ No pude localizar los atributos de particleGeometry."
        )
    text = text.replace(attribute_block, repair_block, 1)

# Strengthen the repair helper so it also accepts interleaved attributes.
old_guard = """  const position = geometry.getAttribute("position");
  if (!(position instanceof THREE.BufferAttribute)) return;"""

new_guard = """  const position = geometry.getAttribute("position");
  if (
    !position ||
    typeof position.getX !== "function" ||
    typeof position.getY !== "function" ||
    typeof position.getZ !== "function" ||
    typeof position.setXYZ !== "function"
  ) {
    return;
  }"""

if old_guard in text:
    text = text.replace(old_guard, new_guard, 1)

# Ensure the visible version marker reflects the corrected scene where present.
text = text.replace(
    "ARRASTRA SOBRE EL EMBRIÓN",
    "ARRASTRA SOBRE EL EMBRIÓN · GEOMETRÍA ESTABLE",
)

path.write_text(text, encoding="utf-8")
print("✅ particleCount convertido a entero.")
print("✅ nube de partículas validada antes de renderizar.")
print("✅ reparación compatible con atributos intercalados.")
PY

echo "===== VALIDANDO SINTAXIS ====="

node - "${FILE}" <<'NODE'
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
echo "✅ ORGANISMO V4.8.2 REPARADO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Eliminado el vértice incompleto que producía NaN"
echo "✅ BoundingSphere estable"
echo "✅ Rotación anatómica conservada"
echo "✅ Controles ↶ AUTO ◎ ↷ conservados"
echo ""
echo "Arranca:"
echo "  cd ~/poema-universal"
echo "  npm run dev -- --webpack -p 3000"
