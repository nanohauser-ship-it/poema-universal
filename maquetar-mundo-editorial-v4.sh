set -eu

PROJECT="$HOME/poema-universal"
TARGET="$PROJECT/app/poema-universal/components/WorldGlobe.tsx"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$PROJECT/backups/mundo-editorial-v4-$STAMP"

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

if "MUNDO EDITORIAL V4 · TEXTO FUERA DEL CANVAS" in text:
    print("ℹ️ La versión V4 ya está instalada.")
    raise SystemExit(0)

old_grid = '''          <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] lg:h-[720px]">'''
new_grid = '''          <div className="grid lg:grid-cols-[400px_minmax(0,1fr)]">
            {/* MUNDO EDITORIAL V4 · TEXTO FUERA DEL CANVAS */}
            <section className="hidden min-h-[710px] border-r border-white/10 bg-[#03070a]/96 px-9 py-10 lg:flex lg:flex-col">
              <p className="text-[8px] uppercase tracking-[0.44em] text-[#d7b66f]">
                Atlas vivo · edición fundacional
              </p>

              <h3 className="mt-10 font-serif text-[42px] leading-[1.02] tracking-[-0.045em] text-white">
                Aquí el mundo
                <span className="block">
                  no se mide
                </span>
                <span className="block italic text-white/56">
                  por fronteras.
                </span>
              </h3>

              <p className="mt-7 font-serif text-xl italic leading-8 text-white/64">
                Se mide por las voces que todavía arden.
              </p>

              <p className="mt-6 text-[11px] leading-6 text-white/38">
                Cada luz señala un lugar de aparición.
                Ocho presencias reales y cincuenta
                identidades literarias forman una misma
                constelación.
              </p>

              <div className="mt-9 grid grid-cols-2 gap-px border-y border-white/10 bg-white/10">
                <div className="bg-[#03070a] px-4 py-5">
                  <span className="block font-serif text-3xl text-white">
                    {occupiedTotal}
                  </span>
                  <span className="mt-2 block text-[7px] uppercase tracking-[0.24em] text-white/30">
                    Presencias
                  </span>
                </div>

                <div className="bg-[#03070a] px-4 py-5">
                  <span className="block font-serif text-3xl text-white">
                    {participatingCountries.length}
                  </span>
                  <span className="mt-2 block text-[7px] uppercase tracking-[0.24em] text-white/30">
                    Territorios
                  </span>
                </div>

                <div className="bg-[#03070a] px-4 py-5">
                  <span className="block font-serif text-3xl text-white">
                    38
                  </span>
                  <span className="mt-2 block text-[7px] uppercase tracking-[0.24em] text-white/30">
                    Lenguas
                  </span>
                </div>

                <div className="bg-[#03070a] px-4 py-5">
                  <span className="block font-serif text-3xl text-[#d7b66f]">
                    {reservedTotal}
                  </span>
                  <span className="mt-2 block text-[7px] uppercase tracking-[0.24em] text-white/30">
                    Plazas abiertas
                  </span>
                </div>
              </div>

              <div className="mt-auto border-t border-white/10 pt-7">
                {selectedCountry ? (
                  <>
                    <p className="text-[8px] uppercase tracking-[0.32em] text-white/28">
                      Territorio convocado
                    </p>

                    <p className="mt-4 font-serif text-3xl text-white/90">
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

                    <p className="mt-3 text-[8px] uppercase leading-5 tracking-[0.3em] text-white/22">
                      La cartografía responderá a cada
                      presencia
                    </p>
                  </>
                )}
              </div>
            </section>'''

if old_grid not in text:
    raise SystemExit(
        "❌ No encontré la rejilla exacta del globo restaurado. "
        "El archivo no se ha modificado."
    )

text = text.replace(old_grid, new_grid, 1)

old_container = '''              className="relative min-h-[640px] overflow-hidden lg:min-h-[710px] h-[560px] lg:h-[720px]"'''
new_container = '''              className="relative h-[560px] min-h-[560px] overflow-hidden sm:h-[640px] sm:min-h-[640px] lg:h-[710px] lg:min-h-[710px]"'''

if old_container not in text:
    raise SystemExit(
        "❌ No encontré el contenedor actual del globo. "
        "El archivo no se ha modificado."
    )

text = text.replace(old_container, new_container, 1)

overlay_start = '''              {/* ATLAS VIVO · EDICIÓN FUNDACIONAL */}'''
overlay_end = '''              {isLoadingCountries && ('''

start_index = text.find(overlay_start)
end_index = text.find(overlay_end, start_index)

if start_index == -1 or end_index == -1:
    raise SystemExit(
        "❌ No encontré la superposición editorial anterior. "
        "El archivo no se ha modificado."
    )

text = (
    text[:start_index]
    + overlay_end
    + text[end_index + len(overlay_end):]
)

old_aside = '''            <aside className="relative flex min-h-[360px] flex-col border-t border-white/10 bg-[#050a0e]/95 p-7 lg:border-l lg:border-t-0 lg:p-9 max-h-[720px] overflow-hidden">'''
new_aside = '''            <aside className="relative col-span-full flex min-h-[300px] max-h-[330px] flex-col overflow-hidden border-t border-white/10 bg-[#050a0e]/95 p-7 lg:p-8">'''

if old_aside not in text:
    raise SystemExit(
        "❌ No encontré el atlas lateral actual. "
        "El archivo no se ha modificado."
    )

text = text.replace(old_aside, new_aside, 1)

old_list = '''                  <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-2 [scrollbar-color:rgba(215,182,111,0.35)_transparent] [scrollbar-width:thin]">'''
new_list = '''                  <div className="grid min-h-0 flex-1 grid-cols-2 gap-x-7 overflow-y-auto pr-2 sm:grid-cols-3 lg:grid-cols-5 [scrollbar-color:rgba(215,182,111,0.35)_transparent] [scrollbar-width:thin]">'''

if old_list not in text:
    raise SystemExit(
        "❌ No encontré la lista actual de territorios. "
        "El archivo no se ha modificado."
    )

text = text.replace(old_list, new_list, 1)

old_button = '''                          className="group flex w-full items-center justify-between border-b border-white/[0.08] py-4 text-left"'''
new_button = '''                          className="group flex w-full items-center justify-between border-b border-white/[0.08] py-3 text-left"'''
text = text.replace(old_button, new_button, 1)

old_country_name = '''                          <span className="font-serif text-xl text-white/88 transition group-hover:text-white">'''
new_country_name = '''                          <span className="font-serif text-base text-white/78 transition group-hover:text-white">'''
text = text.replace(old_country_name, new_country_name, 1)

if text == original:
    raise SystemExit("❌ No se produjeron cambios.")

target.write_text(text, encoding="utf-8")

print("✅ Texto editorial movido fuera del canvas.")
print("✅ Globo conservado sin escalas ni traslaciones.")
print("✅ Atlas convertido en franja inferior compacta.")
print("✅ Territorios distribuidos en cinco columnas.")
PY

cd "$PROJECT"

echo ""
echo "===== VALIDACIÓN TYPESCRIPT ====="

if npx tsc --noEmit --pretty false; then
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "✅ MUNDO EDITORIAL V4 COMPLETADO"
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
