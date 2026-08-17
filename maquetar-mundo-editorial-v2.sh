set -eu

PROJECT="$HOME/poema-universal"
TARGET="$PROJECT/app/poema-universal/components/WorldGlobe.tsx"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$PROJECT/backups/mundo-editorial-v2-$STAMP"

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

if "ATLAS VIVO · EDICIÓN FUNDACIONAL" in text:
    print("ℹ️ La composición editorial ya está instalada.")
    raise SystemExit(0)

grid_pattern = re.compile(
    r'<div className="grid([^"]*?)lg:grid-cols-\[minmax\(0,1fr\)_\d+px\]([^"]*?)">'
)

def replace_grid(match):
    classes = f"grid{match.group(1)}lg:grid-cols-[minmax(0,1fr)_360px]{match.group(2)}"
    if "lg:h-[720px]" not in classes:
        classes += " lg:h-[720px]"
    return f'<div className="{classes}">'

text, grid_count = grid_pattern.subn(replace_grid, text, count=1)

canvas_pattern = re.compile(
    r'(ref=\{containerRef\}\s+className=")([^"]*)(")'
)

def replace_canvas(match):
    classes = match.group(2)
    classes = re.sub(r'\bmin-h-\[\d+px\]\b', '', classes)
    classes = " ".join(classes.split())
    for value in ["h-[560px]", "lg:h-[720px]"]:
        if value not in classes:
            classes += f" {value}"
    return match.group(1) + classes + match.group(3)

text, canvas_count = canvas_pattern.subn(replace_canvas, text, count=1)

aside_pattern = re.compile(
    r'(<aside className=")([^"]*border-t[^"]*bg-\[#050a0e\][^"]*)(")'
)

def replace_aside(match):
    classes = match.group(2)
    for value in ["max-h-[720px]", "overflow-hidden"]:
        if value not in classes:
            classes += f" {value}"
    return match.group(1) + classes + match.group(3)

text, aside_count = aside_pattern.subn(replace_aside, text, count=1)

list_pattern = re.compile(
    r'<div className="space-y-3">\s*(\{participatingCountries\.map\()'
)
list_replacement = (
    '<div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-2 '
    '[scrollbar-color:rgba(215,182,111,0.35)_transparent] '
    '[scrollbar-width:thin]">\n                    \\1'
)
text, list_count = list_pattern.subn(list_replacement, text, count=1)

anchor_pattern = re.compile(
    r'(\s*)\{isLoadingCountries && \('
)

editorial = r'''
              {/* ATLAS VIVO · EDICIÓN FUNDACIONAL */}
              <div className="pointer-events-none absolute left-7 top-7 z-10 hidden max-w-[520px] lg:block">
                <div className="border-l border-[#d7b66f]/45 bg-gradient-to-r from-[#020609]/95 via-[#020609]/82 to-transparent px-8 py-7 backdrop-blur-[2px]">
                  <p className="text-[9px] uppercase tracking-[0.42em] text-[#d7b66f]">
                    Atlas vivo · edición fundacional
                  </p>

                  <h3 className="mt-7 max-w-lg font-serif text-[40px] leading-[1.02] tracking-[-0.04em] text-white">
                    Aquí el mundo no se mide
                    <span className="block italic text-white/60">
                      por fronteras.
                    </span>
                  </h3>

                  <p className="mt-5 max-w-md font-serif text-xl italic leading-8 text-white/65">
                    Se mide por las voces que todavía arden.
                  </p>

                  <p className="mt-5 max-w-md text-xs leading-6 text-white/40">
                    Cada luz señala un lugar de aparición.
                    Ocho presencias reales y cincuenta
                    identidades literarias forman una misma
                    constelación.
                  </p>

                  <div className="mt-7 grid grid-cols-4 gap-px border-y border-white/10 bg-white/10">
                    <div className="bg-[#03070a]/95 px-3 py-4">
                      <span className="block font-serif text-2xl text-white">
                        {occupiedTotal}
                      </span>
                      <span className="mt-1 block text-[7px] uppercase leading-4 tracking-[0.22em] text-white/30">
                        Presencias
                      </span>
                    </div>

                    <div className="bg-[#03070a]/95 px-3 py-4">
                      <span className="block font-serif text-2xl text-white">
                        {participatingCountries.length}
                      </span>
                      <span className="mt-1 block text-[7px] uppercase leading-4 tracking-[0.22em] text-white/30">
                        Territorios
                      </span>
                    </div>

                    <div className="bg-[#03070a]/95 px-3 py-4">
                      <span className="block font-serif text-2xl text-white">
                        38
                      </span>
                      <span className="mt-1 block text-[7px] uppercase leading-4 tracking-[0.22em] text-white/30">
                        Lenguas
                      </span>
                    </div>

                    <div className="bg-[#03070a]/95 px-3 py-4">
                      <span className="block font-serif text-2xl text-[#d7b66f]">
                        {reservedTotal}
                      </span>
                      <span className="mt-1 block text-[7px] uppercase leading-4 tracking-[0.22em] text-white/30">
                        Plazas
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-5">
                    {selectedCountry ? (
                      <>
                        <p className="text-[8px] uppercase tracking-[0.32em] text-white/28">
                          Territorio convocado
                        </p>

                        <p className="mt-3 font-serif text-2xl text-white/88">
                          {selectedCountry.name}
                        </p>

                        <p className="mt-2 text-[9px] uppercase tracking-[0.28em] text-[#d7b66f]">
                          {getPoetCountText(selectedCountry)}
                        </p>
                      </>
                    ) : (
                      <p className="max-w-md font-serif text-base italic leading-7 text-white/48">
                        Gira el mundo o elige un territorio
                        del atlas. La cartografía responderá
                        a cada presencia.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {isLoadingCountries && ('''

text, overlay_count = anchor_pattern.subn(editorial, text, count=1)

counts = {
    "estructura principal": grid_count,
    "lienzo": canvas_count,
    "panel lateral": aside_count,
    "lista desplazable": list_count,
    "composición editorial": overlay_count,
}

missing = [name for name, count in counts.items() if count != 1]
if missing:
    raise SystemExit(
        "❌ No se localizaron de forma segura: "
        + ", ".join(missing)
        + ". El archivo no se ha modificado."
    )

if text == original:
    raise SystemExit("❌ No se produjeron cambios.")

target.write_text(text, encoding="utf-8")
print("✅ Estructura principal adaptada.")
print("✅ Mundo limitado a 720 px.")
print("✅ Atlas lateral con desplazamiento interno.")
print("✅ Composición editorial insertada.")
PY

cd "$PROJECT"

echo ""
echo "===== VALIDACIÓN TYPESCRIPT ====="

if npx tsc --noEmit --pretty false; then
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "✅ MUNDO EDITORIAL COMPLETADO"
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
