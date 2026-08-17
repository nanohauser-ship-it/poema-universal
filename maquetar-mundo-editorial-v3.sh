set -eu

PROJECT="$HOME/poema-universal"
TARGET="$PROJECT/app/poema-universal/components/WorldGlobe.tsx"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$PROJECT/backups/mundo-editorial-v3-$STAMP"

if [ ! -f "$TARGET" ]; then
  echo "❌ No encuentro:"
  echo "$TARGET"
  exit 1
fi

mkdir -p "$BACKUP/app/poema-universal/components"
cp "$TARGET" "$BACKUP/app/poema-universal/components/WorldGlobe.tsx"

python3 - "$TARGET" <<'PY'
from pathlib import Path
import re
import sys

target = Path(sys.argv[1])
text = target.read_text(encoding="utf-8")
original = text

marker = "ATLAS VIVO · EDICIÓN FUNDACIONAL"
if marker not in text:
    raise SystemExit(
        "❌ No encuentro la composición editorial anterior. "
        "El archivo no se ha modificado."
    )

text, grid_count = re.subn(
    r'lg:grid-cols-\[minmax\(0,1fr\)_\d+px\]',
    'lg:grid-cols-1',
    text,
    count=1,
)

text = text.replace(
    'lg:h-[720px]',
    'lg:h-auto',
    1,
)

canvas_pattern = re.compile(
    r'(ref=\{containerRef\}\s+className=")([^"]*)(")'
)

def update_canvas(match):
    classes = match.group(2)
    classes = classes.replace(
        "lg:h-[720px]",
        "lg:h-[650px]"
    )

    additions = [
        "[&_canvas]:origin-center",
        "[&_canvas]:transition-transform",
        "[&_canvas]:duration-700",
        "lg:[&_canvas]:translate-x-[180px]",
        "lg:[&_canvas]:scale-[0.82]",
    ]

    for item in additions:
        if item not in classes:
            classes += f" {item}"

    return match.group(1) + classes + match.group(3)

text, canvas_count = canvas_pattern.subn(
    update_canvas,
    text,
    count=1,
)

aside_pattern = re.compile(
    r'(<aside className=")([^"]*)(")'
)

def update_aside(match):
    classes = match.group(2)
    classes = classes.replace(
        "max-h-[720px]",
        "max-h-[280px]"
    )

    additions = [
        "lg:min-h-0",
        "lg:max-h-[280px]",
    ]

    for item in additions:
        if item not in classes:
            classes += f" {item}"

    return match.group(1) + classes + match.group(3)

text, aside_count = aside_pattern.subn(
    update_aside,
    text,
    count=1,
)

old_list_pattern = re.compile(
    r'<div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-2 '
    r'\[scrollbar-color:rgba\(215,182,111,0\.35\)_transparent\] '
    r'\[scrollbar-width:thin\]">'
)

new_list = (
    '<div className="grid min-h-0 flex-1 grid-cols-2 '
    'gap-x-8 gap-y-0 overflow-y-auto pr-2 '
    'sm:grid-cols-3 lg:grid-cols-5 '
    '[scrollbar-color:rgba(215,182,111,0.35)_transparent] '
    '[scrollbar-width:thin]">'
)

text, list_count = old_list_pattern.subn(
    new_list,
    text,
    count=1,
)

overlay_pattern = re.compile(
    r'\s*\{/\* ATLAS VIVO · EDICIÓN FUNDACIONAL \*/\}.*?'
    r'\{isLoadingCountries && \(',
    re.S,
)

new_overlay = '''
              {/* ATLAS VIVO · EDICIÓN FUNDACIONAL */}
              <div className="pointer-events-none absolute bottom-6 left-6 top-6 z-10 hidden w-[400px] xl:block">
                <div className="flex h-full flex-col border border-white/10 bg-[#020609]/94 px-8 py-8 shadow-[0_30px_90px_rgba(0,0,0,0.55)] backdrop-blur-md">
                  <p className="text-[8px] uppercase tracking-[0.44em] text-[#d7b66f]">
                    Atlas vivo · edición fundacional
                  </p>

                  <h3 className="mt-8 font-serif text-[38px] leading-[1.04] tracking-[-0.04em] text-white">
                    Aquí el mundo no se mide
                    <span className="block italic text-white/56">
                      por fronteras.
                    </span>
                  </h3>

                  <p className="mt-6 font-serif text-lg italic leading-8 text-white/66">
                    Se mide por las voces que todavía
                    arden.
                  </p>

                  <p className="mt-5 text-[11px] leading-6 text-white/38">
                    Cada luz señala un lugar de aparición.
                    Ocho presencias reales y cincuenta
                    identidades literarias forman una misma
                    constelación.
                  </p>

                  <div className="mt-7 grid grid-cols-2 gap-px border-y border-white/10 bg-white/10">
                    <div className="bg-[#03070a] px-4 py-4">
                      <span className="block font-serif text-2xl text-white">
                        {occupiedTotal}
                      </span>
                      <span className="mt-1 block text-[7px] uppercase tracking-[0.24em] text-white/30">
                        Presencias
                      </span>
                    </div>

                    <div className="bg-[#03070a] px-4 py-4">
                      <span className="block font-serif text-2xl text-white">
                        {participatingCountries.length}
                      </span>
                      <span className="mt-1 block text-[7px] uppercase tracking-[0.24em] text-white/30">
                        Territorios
                      </span>
                    </div>

                    <div className="bg-[#03070a] px-4 py-4">
                      <span className="block font-serif text-2xl text-white">
                        38
                      </span>
                      <span className="mt-1 block text-[7px] uppercase tracking-[0.24em] text-white/30">
                        Lenguas
                      </span>
                    </div>

                    <div className="bg-[#03070a] px-4 py-4">
                      <span className="block font-serif text-2xl text-[#d7b66f]">
                        {reservedTotal}
                      </span>
                      <span className="mt-1 block text-[7px] uppercase tracking-[0.24em] text-white/30">
                        Plazas abiertas
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto border-t border-white/10 pt-6">
                    {selectedCountry ? (
                      <>
                        <p className="text-[8px] uppercase tracking-[0.32em] text-white/28">
                          Territorio convocado
                        </p>

                        <p className="mt-3 font-serif text-3xl text-white/90">
                          {selectedCountry.name}
                        </p>

                        <p className="mt-2 text-[9px] uppercase tracking-[0.28em] text-[#d7b66f]">
                          {getPoetCountText(selectedCountry)}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-serif text-base italic leading-7 text-white/48">
                          Gira el mundo o elige un territorio
                          del atlas.
                        </p>

                        <p className="mt-3 text-[8px] uppercase tracking-[0.3em] text-white/22">
                          La cartografía responderá a cada
                          presencia
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {isLoadingCountries && ('''

text, overlay_count = overlay_pattern.subn(
    new_overlay,
    text,
    count=1,
)

counts = {
    "rejilla principal": grid_count,
    "lienzo del globo": canvas_count,
    "panel del atlas": aside_count,
    "lista de territorios": list_count,
    "placa editorial": overlay_count,
}

missing = [
    name for name, count in counts.items()
    if count != 1
]

if missing:
    raise SystemExit(
        "❌ No se localizaron de forma segura: "
        + ", ".join(missing)
        + ". El archivo no se ha modificado."
    )

if text == original:
    raise SystemExit("❌ No se produjeron cambios.")

target.write_text(text, encoding="utf-8")

print("✅ Texto y planeta separados.")
print("✅ Globo desplazado y reducido.")
print("✅ Atlas convertido en franja compacta.")
print("✅ Países organizados en cinco columnas.")
PY

cd "$PROJECT"

echo ""
echo "===== VALIDACIÓN TYPESCRIPT ====="

if npx tsc --noEmit --pretty false; then
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "✅ MUNDO EDITORIAL V3 COMPLETADO"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Copia de seguridad:"
  echo "$BACKUP"
else
  echo ""
  echo "❌ La validación encontró un error."
  echo "Restaurando WorldGlobe.tsx..."
  cp "$BACKUP/app/poema-universal/components/WorldGlobe.tsx" "$TARGET"
  echo "✅ Archivo anterior restaurado."
  exit 1
fi
