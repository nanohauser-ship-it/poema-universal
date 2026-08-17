set -eu

PROJECT="$HOME/poema-universal"
TARGET="$PROJECT/app/poema-universal/components/WorldGlobe.tsx"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$PROJECT/backups/mundo-editorial-$STAMP"

if [ ! -f "$TARGET" ]; then
  echo "❌ No encuentro:"
  echo "$TARGET"
  exit 1
fi

mkdir -p "$BACKUP/app/poema-universal/components"
cp "$TARGET" "$BACKUP/app/poema-universal/components/WorldGlobe.tsx"

python3 - "$TARGET" <<'PY'
from pathlib import Path
import sys

target = Path(sys.argv[1])
text = target.read_text(encoding="utf-8")
original = text

if "ATLAS VIVO · EDICIÓN FUNDACIONAL" in text:
    print("ℹ️ La composición editorial ya estaba instalada.")
    raise SystemExit(0)

replacements = [
    (
        '<div className="grid lg:grid-cols-[minmax(0,1fr)_330px]">',
        '<div className="grid lg:h-[720px] lg:grid-cols-[minmax(0,1fr)_360px]">',
        "estructura principal del globo",
    ),
    (
        'className="relative min-h-[520px] overflow-hidden"',
        'className="relative h-[560px] overflow-hidden lg:h-[720px]"',
        "altura del lienzo",
    ),
    (
        'className="relative flex min-h-[360px] flex-col border-t border-white/10 bg-[#050a0e]/95 p-7 lg:border-l lg:border-t-0 lg:p-9"',
        'className="relative flex min-h-[360px] max-h-[720px] flex-col overflow-hidden border-t border-white/10 bg-[#050a0e]/95 p-7 lg:border-l lg:border-t-0 lg:p-9"',
        "altura del atlas lateral",
    ),
    (
        '<div className="space-y-3">\n                    {participatingCountries.map(',
        '<div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-2 [scrollbar-color:rgba(215,182,111,0.35)_transparent] [scrollbar-width:thin]">\n                    {participatingCountries.map(',
        "lista desplazable de países",
    ),
]

for old, new, label in replacements:
    if old not in text:
        raise SystemExit(
            f"❌ No se encontró {label}. "
            "El archivo no se ha modificado."
        )
    text = text.replace(old, new, 1)

anchor = """            >
              {isLoadingCountries && ("""

editorial = """            >
              {/* ATLAS VIVO · EDICIÓN FUNDACIONAL */}
              <div className="pointer-events-none absolute left-8 top-8 z-10 hidden max-w-[570px] lg:block">
                <div className="border-l border-[#d7b66f]/45 bg-gradient-to-r from-[#020609]/95 via-[#020609]/78 to-transparent px-8 py-7 backdrop-blur-[2px]">
                  <p className="text-[9px] uppercase tracking-[0.42em] text-[#d7b66f]">
                    Atlas vivo · edición fundacional
                  </p>

                  <h3 className="mt-7 max-w-xl font-serif text-[42px] leading-[1.02] tracking-[-0.042em] text-white">
                    Aquí el mundo no se mide
                    <span className="block italic text-white/58">
                      por fronteras.
                    </span>
                  </h3>

                  <p className="mt-6 max-w-lg font-serif text-xl italic leading-8 text-white/66">
                    Se mide por las voces que todavía
                    arden.
                  </p>

                  <p className="mt-6 max-w-md text-xs leading-6 text-white/40">
                    Cada luz señala un lugar de aparición.
                    Ocho presencias reales y cincuenta
                    identidades literarias forman una misma
                    constelación.
                  </p>

                  <div className="mt-8 grid grid-cols-4 gap-px border-y border-white/10 bg-white/10">
                    <div className="bg-[#03070a]/95 px-3 py-4">
                      <span className="block font-serif text-2xl text-white">
                        {occupiedTotal}
                      </span>
                      <span className="mt-1 block text-[7px] uppercase leading-4 tracking-[0.24em] text-white/30">
                        Presencias
                      </span>
                    </div>

                    <div className="bg-[#03070a]/95 px-3 py-4">
                      <span className="block font-serif text-2xl text-white">
                        {participatingCountries.length}
                      </span>
                      <span className="mt-1 block text-[7px] uppercase leading-4 tracking-[0.24em] text-white/30">
                        Territorios
                      </span>
                    </div>

                    <div className="bg-[#03070a]/95 px-3 py-4">
                      <span className="block font-serif text-2xl text-white">
                        38
                      </span>
                      <span className="mt-1 block text-[7px] uppercase leading-4 tracking-[0.24em] text-white/30">
                        Lenguas
                      </span>
                    </div>

                    <div className="bg-[#03070a]/95 px-3 py-4">
                      <span className="block font-serif text-2xl text-[#d7b66f]">
                        {reservedTotal}
                      </span>
                      <span className="mt-1 block text-[7px] uppercase leading-4 tracking-[0.24em] text-white/30">
                        Plazas
                      </span>
                    </div>
                  </div>

                  <div className="mt-7 border-t border-white/10 pt-5">
                    {selectedCountry ? (
                      <>
                        <p className="text-[8px] uppercase tracking-[0.34em] text-white/28">
                          Territorio convocado
                        </p>

                        <p className="mt-3 font-serif text-2xl text-white/88">
                          {selectedCountry.name}
                        </p>

                        <p className="mt-2 text-[9px] uppercase tracking-[0.28em] text-[#d7b66f]">
                          {getPoetCountText(
                            selectedCountry
                          )}
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

              {isLoadingCountries && ("""

if anchor not in text:
    raise SystemExit(
        "❌ No se encontró el punto de inserción editorial. "
        "El archivo no se ha modificado."
    )

text = text.replace(anchor, editorial, 1)

if text == original:
    raise SystemExit("❌ No se produjeron cambios.")

target.write_text(text, encoding="utf-8")
print("✅ Composición editorial insertada.")
print("✅ Lista de países convertida en panel desplazable.")
print("✅ Altura del mundo limitada a 720 px en escritorio.")
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
  echo ""
  echo "Ahora ejecuta:"
  echo "cd ~/poema-universal"
  echo "npx next dev --webpack"
else
  echo ""
  echo "❌ La validación encontró un error."
  echo "Restaurando WorldGlobe.tsx..."
  cp "$BACKUP/app/poema-universal/components/WorldGlobe.tsx" "$TARGET"
  echo "✅ Archivo anterior restaurado."
  exit 1
fi
