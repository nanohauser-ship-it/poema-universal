#!/usr/bin/env bash
set -euo pipefail

cd "$HOME/poema-universal"

COMP="app/laboratorio/verso-tecno/OrganismoV47.tsx"
BASE="$(cd "$(dirname "$0")" && pwd)"
PAYLOAD="$BASE/payload"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="${COMP%.tsx}.before-ace-step-${STAMP}.tsx"

if [ ! -f "$COMP" ]; then
  echo "❌ No encuentro $COMP"
  exit 1
fi

if ! grep -q "crearDireccionMusical" "$COMP"; then
  echo "❌ No detecto EMBRIÓN DIRECTOR 1.0. No voy a parchear una versión distinta."
  exit 1
fi

cp "$COMP" "$BACKUP"
echo "✅ Copia de seguridad: $BACKUP"

mkdir -p app/api/embrion/music/status app/api/embrion/music/audio app/laboratorio/verso-tecno/organismo
cp "$PAYLOAD/app/api/embrion/music/route.ts" app/api/embrion/music/route.ts
cp "$PAYLOAD/app/api/embrion/music/status/route.ts" app/api/embrion/music/status/route.ts
cp "$PAYLOAD/app/api/embrion/music/audio/route.ts" app/api/embrion/music/audio/route.ts
cp "$PAYLOAD/app/laboratorio/verso-tecno/organismo/AceStepGenerator.tsx" app/laboratorio/verso-tecno/organismo/AceStepGenerator.tsx

python3 - <<'PY'
from pathlib import Path
import sys

p = Path("app/laboratorio/verso-tecno/OrganismoV47.tsx")
text = p.read_text(encoding="utf-8")

if "AceStepGenerator" in text:
    print("ℹ️ El puente ACE-Step ya estaba conectado.")
    sys.exit(0)

anchor = 'import OrganismoEmbryoScene from "./organismo/OrganismoEmbryoScene";'
if anchor not in text:
    raise SystemExit("❌ No encuentro el import de la escena 3D.")

text = text.replace(
    anchor,
    anchor + '\nimport AceStepGenerator from "./organismo/AceStepGenerator";',
    1,
)

marker = "        <pre>{code}</pre>"
if marker not in text:
    raise SystemExit("❌ No encuentro la Partitura Genética de Director 1.0.")

block = '''        <AceStepGenerator
          prompt={promptMusical}
          title={organism.nombre}
        />

'''
text = text.replace(marker, block + marker, 1)
p.write_text(text, encoding="utf-8")
print("✅ Intérprete ACE-Step insertado en Embrión Director.")
PY

echo "===== VALIDANDO ARCHIVOS NUEVOS ====="
npx tsc \
  app/laboratorio/verso-tecno/organismo/AceStepGenerator.tsx \
  app/api/embrion/music/route.ts \
  app/api/embrion/music/status/route.ts \
  app/api/embrion/music/audio/route.ts \
  --noEmit --pretty false \
  --target ES2020 --module ESNext --jsx react-jsx \
  --moduleResolution Bundler --allowSyntheticDefaultImports --esModuleInterop \
  --skipLibCheck --lib ES2020,DOM || {
    echo "❌ La validación del puente falló. Restaurando interfaz."
    cp "$BACKUP" "$COMP"
    exit 1
  }

if ! grep -q "AceStepGenerator" "$COMP"; then
  echo "❌ El componente no quedó conectado. Restaurando."
  cp "$BACKUP" "$COMP"
  exit 1
fi

echo ""
echo "✅ PUENTE ACE-STEP 1.0 INSTALADO"
echo "✅ Embrión Director conserva su prompt literario"
echo "✅ Botón GENERAR MÚSICA conectado a /api/embrion/music"
echo "✅ ACE-Step esperado en http://127.0.0.1:8001"
echo "✅ Audio vuelve a Embrión mediante proxy local"
echo "✅ Strudel no participa"
echo ""
echo "Arquitectura de este Mac: $(uname -m)"
echo "macOS: $(sw_vers -productVersion 2>/dev/null || echo desconocido)"
