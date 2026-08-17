#!/bin/bash
set -euo pipefail
source_dir="$(cd "$(dirname "$0")" && pwd)"
target_dir="${1:-$HOME/poema-universal}"
payload="$source_dir/PAYLOAD"
ts="$(date +%Y%m%d-%H%M%S)"
backup="$target_dir/backups/embrion-v6-2-1-desbloqueo-$ts"
files=(
  "app/laboratorio/verso-tecno/OrganismoV47.tsx"
  "lib/embrion/symbolic-engine.ts"
)

echo ""
echo "EMBRIÓN V6.2.1 · DESBLOQUEO FUNCIONAL"
echo "======================================="

if [[ ! -f "$target_dir/package.json" ]]; then
  echo "❌ No encuentro Poema Universal en $target_dir"
  exit 1
fi
if [[ ! -f "$target_dir/app/laboratorio/verso-tecno/OrganismoV47.tsx" ]]; then
  echo "❌ No encuentro OrganismoV47.tsx"
  exit 1
fi
if ! grep -q 'buildControlledSymbolicImpulses' "$target_dir/app/laboratorio/verso-tecno/OrganismoV47.tsx"; then
  echo "❌ Este parche necesita Embrión V6.2 instalado."
  exit 1
fi

for f in "${files[@]}"; do
  mkdir -p "$backup/$(dirname "$f")"
  cp -p "$target_dir/$f" "$backup/$f"
  cp -p "$payload/$f" "$target_dir/$f"
done

if ! grep -q 'DESBLOQUEO DE GRAVEDAD' "$target_dir/app/laboratorio/verso-tecno/OrganismoV47.tsx"; then
  echo "❌ No se pudo verificar el desbloqueo de la membrana."
  exit 1
fi
if ! grep -q 'RELACIONAL es el campo abierto' "$target_dir/lib/embrion/symbolic-engine.ts"; then
  echo "❌ No se pudo verificar el desbloqueo de distancia."
  exit 1
fi

echo "✓ La Membrana puede activar directamente el núcleo"
echo "✓ El núcleo ya no se borra al estar vacío el campo de escritura"
echo "✓ RELACIONAL acepta palabras sin nodo documental directo"
echo "✓ Las rutas remotas siguen marcadas como EXPERIMENTALES"
echo "✓ EMITIR y ACELERAR se habilitan cuando existen rutas"
echo "✓ Membrana y vivero permanecen intactos"
echo ""
echo "✅ EMBRIÓN V6.2.1 DESBLOQUEADO"
echo "Backup: $backup"
echo ""
echo "Reinicia Next.js y abre:"
echo "http://localhost:3000/laboratorio/verso-tecno"
