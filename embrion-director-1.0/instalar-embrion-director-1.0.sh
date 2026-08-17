#!/usr/bin/env bash
set -euo pipefail

cd "$HOME/poema-universal"

COMP="app/laboratorio/verso-tecno/OrganismoV47.tsx"
DIRECTOR="app/laboratorio/verso-tecno/organismo/director.ts"
PAYLOAD_DIR="$(cd "$(dirname "$0")" && pwd)/payload"

if [ ! -f "$COMP" ]; then
  echo "❌ No encuentro $COMP"
  exit 1
fi

if [ ! -f "$PAYLOAD_DIR/director.ts" ]; then
  echo "❌ No encuentro payload/director.ts"
  exit 1
fi

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_COMP="${COMP%.tsx}.before-director-${STAMP}.tsx"
cp "$COMP" "$BACKUP_COMP"

echo "✅ Copia de seguridad: $BACKUP_COMP"

if [ -f "$DIRECTOR" ]; then
  cp "$DIRECTOR" "${DIRECTOR%.ts}.before-director-${STAMP}.ts"
fi

cp "$PAYLOAD_DIR/director.ts" "$DIRECTOR"

python3 - <<'PY'
from pathlib import Path
import re
import sys

p = Path("app/laboratorio/verso-tecno/OrganismoV47.tsx")
text = p.read_text(encoding="utf-8")

if "EMBRIÓN DIRECTOR 1.0" in text and "crearDireccionMusical" in text:
    print("ℹ️ La interfaz ya está convertida a EMBRIÓN DIRECTOR 1.0.")
    sys.exit(0)

anchor = 'import OrganismoEmbryoScene from "./organismo/OrganismoEmbryoScene";'
if anchor not in text:
    raise SystemExit("❌ No encuentro el import de OrganismoEmbryoScene. No se modifica la interfaz.")

if 'from "./organismo/director"' not in text:
    text = text.replace(
        anchor,
        anchor + '\nimport { crearDireccionMusical } from "./organismo/director";',
        1,
    )

# Strudel deja de ser el núcleo: eliminamos únicamente los imports de generación/URL.
text = re.sub(r'^\s*codigoStrudel,\s*\n', '', text, flags=re.M)
text = re.sub(r'^\s*urlStrudel,\s*\n', '', text, flags=re.M)

start = text.find("  const code = useMemo(")
end = text.find("  const durationMinutes", start)
if start == -1 or end == -1:
    raise SystemExit("❌ No encuentro el bloque code/Strudel esperado. No se modifica la interfaz.")

replacement = '''  const direction = useMemo(() => {
    if (!organism) return null;
    const livingText = [organism.poema, ...organism.injertos]
      .filter(Boolean)
      .join("\\n");

    return crearDireccionMusical({
      codigo: organism.codigo,
      nombre: organism.nombre,
      texto: livingText,
      semilla: organism.semilla,
      energia: organism.energia,
      complejidad: organism.complejidad,
    });
  }, [organism]);
  const code = direction?.documento ?? "";
  const promptMusical = direction?.prompt ?? "";
'''
text = text[:start] + replacement + text[end:]

text = text.replace(
    "VER MOTOR SONORO / CÓDIGO DEL ORGANISMO",
    "VER DIRECCIÓN MUSICAL / PARTITURA GENÉTICA",
)
text = text.replace("COPIAR CÓDIGO", "COPIAR DIRECCIÓN")
text = text.replace("ORGANISMO V4.9.1", "EMBRIÓN DIRECTOR 1.0")
text = text.replace("Código copiado", "Dirección musical copiada")
text = text.replace("código copiado", "dirección musical copiada")

# Eliminar enlace Strudel y su iframe. Conservamos el <pre> como libro de dirección.
text = re.sub(
    r'\s*<a\s+href=\{strudelUrl\}\s+target="_blank"\s+rel="noreferrer">\s*ABRIR EN STRUDEL\s*↗\s*</a>',
    '',
    text,
    flags=re.S,
)
text = re.sub(
    r'\s*<iframe\s+ref=\{iframeRef\}\s+key=\{strudelUrl\}\s+src=\{strudelUrl\}\s+title=\{`Organismo \$\{organism\.nombre\}`\}\s+allow="autoplay; microphone; midi"\s*/>',
    '',
    text,
    flags=re.S,
)

old_button = '''<button type="button" onClick={copyCode}>
            COPIAR DIRECCIÓN
          </button>'''
new_button = '''<button type="button" onClick={copyCode}>
            COPIAR DIRECCIÓN
          </button>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(promptMusical);
                notify("Prompt musical copiado.");
              } catch {
                notify("No se pudo copiar el prompt musical.");
              }
            }}
          >
            COPIAR PROMPT MUSICAL
          </button>'''
if old_button in text:
    text = text.replace(old_button, new_button, 1)
else:
    raise SystemExit("❌ No encuentro el botón de copia esperado. No se modifica la interfaz.")

pre = "        <pre>{code}</pre>"
if pre not in text:
    raise SystemExit("❌ No encuentro el bloque <pre>{code}</pre>. No se modifica la interfaz.")

note = '''        <div
          style={{
            margin: "18px 0 14px",
            padding: "16px 18px",
            border: "1px solid rgba(255,255,255,.10)",
            background: "rgba(255,255,255,.025)",
            fontSize: 11,
            lineHeight: 1.65,
            letterSpacing: ".08em",
            color: "rgba(255,255,255,.72)",
          }}
        >
          <strong style={{ display: "block", marginBottom: 6, color: "rgba(255,255,255,.94)" }}>
            EMBRIÓN YA NO SINTETIZA EL AUDIO
          </strong>
          Lee el poema, construye su partitura genética y escribe una dirección musical lista
          para un motor generativo externo. La música final podrá volver después al organismo.
        </div>

'''
text = text.replace(pre, note + pre, 1)

p.write_text(text, encoding="utf-8")
print("✅ Interfaz convertida a Director 1.0")
PY

# Validación aislada del nuevo núcleo. No validamos todo el repo porque ya existen errores históricos ajenos.
echo "===== VALIDANDO DIRECTOR ====="
if ! npx tsc "$DIRECTOR" \
  --noEmit --pretty false \
  --target ES2020 --module ESNext \
  --moduleResolution Bundler --skipLibCheck --lib ES2020,DOM; then
  echo "❌ Falló la validación de director.ts. Restaurando interfaz."
  cp "$BACKUP_COMP" "$COMP"
  exit 1
fi

# Comprobaciones estructurales sobre la interfaz.
if grep -q "ABRIR EN STRUDEL" "$COMP"; then
  echo "❌ Quedó un enlace Strudel en la interfaz. Restaurando."
  cp "$BACKUP_COMP" "$COMP"
  exit 1
fi

if grep -q 'src={strudelUrl}' "$COMP"; then
  echo "❌ Quedó el iframe Strudel en la interfaz. Restaurando."
  cp "$BACKUP_COMP" "$COMP"
  exit 1
fi

if ! grep -q "crearDireccionMusical" "$COMP"; then
  echo "❌ No quedó conectado el Director. Restaurando."
  cp "$BACKUP_COMP" "$COMP"
  exit 1
fi

echo ""
echo "✅ EMBRIÓN DIRECTOR 1.0 INSTALADO"
echo "✅ Strudel eliminado del núcleo visible"
echo "✅ El poema genera lectura + partitura genética + dirección musical"
echo "✅ Botón COPIAR PROMPT MUSICAL activo"
echo "✅ El embrión 3D y su evolución se conservan"
echo "✅ Motor musical externo preparado como siguiente etapa"
echo "✅ Validación aislada superada"
