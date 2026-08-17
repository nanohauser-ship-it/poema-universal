#!/bin/bash

set -euo pipefail

source_dir="$(cd "$(dirname "$0")" && pwd)"
target_dir="${1:-$HOME/poema-universal}"
payload_dir="$source_dir/PAYLOAD"
timestamp="$(date +%Y%m%d-%H%M%S)"
backup_dir="$target_dir/backups/embrion-v6-2-consola-operadores-$timestamp"

files=(
  "app/laboratorio/verso-tecno/OrganismoV47.tsx"
  "app/laboratorio/verso-tecno/organismo-v47.module.css"
  "app/laboratorio/verso-tecno/organismo/SymbolicImpulseConsole.tsx"
  "app/laboratorio/verso-tecno/organismo/WordArchive.tsx"
  "lib/embrion/symbolic-engine.ts"
)

echo ""
echo "EMBRIÓN V6.2 · CONSOLA DE OPERADORES"
echo "======================================"
echo ""

if [[ ! -f "$target_dir/package.json" ]]; then
  echo "❌ No encuentro Poema Universal en:"
  echo "   $target_dir"
  exit 1
fi

if [[ ! -f "$target_dir/lib/embrion/corpus-symbolic-index.ts" ]] || \
   ! grep -q '"sourceCount": 10' "$target_dir/lib/embrion/corpus-symbolic-index.ts"; then
  echo "❌ Falta el índice simbólico de Embrión V6."
  echo "   No se modificó ningún archivo."
  exit 1
fi

if [[ ! -f "$target_dir/app/laboratorio/verso-tecno/organismo/WordArchive.tsx" ]] || \
   ! grep -q 'MEMBRANA DE LAS PALABRAS' "$target_dir/app/laboratorio/verso-tecno/organismo/WordArchive.tsx"; then
  echo "❌ Esta actualización necesita Embrión V6.1 instalado."
  echo "   No se modificó ningún archivo."
  exit 1
fi

for relative_path in "${files[@]}"; do
  if [[ ! -f "$payload_dir/$relative_path" ]]; then
    echo "❌ El paquete está incompleto: falta $relative_path"
    exit 1
  fi
done

for relative_path in "${files[@]}"; do
  if [[ -f "$target_dir/$relative_path" ]]; then
    mkdir -p "$backup_dir/$(dirname "$relative_path")"
    cp -p "$target_dir/$relative_path" "$backup_dir/$relative_path"
  fi
done

for relative_path in "${files[@]}"; do
  mkdir -p "$target_dir/$(dirname "$relative_path")"
  cp -p "$payload_dir/$relative_path" "$target_dir/$relative_path"
done

organism_file="$target_dir/app/laboratorio/verso-tecno/OrganismoV47.tsx"
console_file="$target_dir/app/laboratorio/verso-tecno/organismo/SymbolicImpulseConsole.tsx"
archive_file="$target_dir/app/laboratorio/verso-tecno/organismo/WordArchive.tsx"
engine_file="$target_dir/lib/embrion/symbolic-engine.ts"
css_file="$target_dir/app/laboratorio/verso-tecno/organismo-v47.module.css"

checks=(
  "$organism_file|buildControlledSymbolicImpulses"
  "$organism_file|SYMBOLIC_CONTROLS_STORAGE"
  "$console_file|CONSOLA DE OPERADORES"
  "$console_file|DOBLE NÚCLEO"
  "$archive_file|MESA DE MONTAJE"
  "$archive_file|EXPORTAR CSV"
  "$engine_file|buildDualNucleusBridge"
  "$engine_file|buildControlledSymbolicImpulses"
  "$css_file|EMBRIÓN V6.2 · CONSOLA DE OPERADORES"
)

for item in "${checks[@]}"; do
  file="${item%%|*}"
  marker="${item#*|}"
  if ! grep -q "$marker" "$file"; then
    echo "❌ Falló la verificación: $marker"
    echo "   Copia de seguridad: $backup_dir"
    exit 1
  fi
done

if grep -q 'HÁBITATS / 6 CANALES' "$organism_file" || \
   grep -q 'CAPAS ACTIVAS ·' "$organism_file" || \
   grep -q 'MUTACIÓN Y VIGILIA' "$organism_file"; then
  echo "❌ Los paneles heredados siguen en la vista activa."
  echo "   Copia de seguridad: $backup_dir"
  exit 1
fi

echo "✓ Siete módulos de control simbólico activos"
echo "✓ Familia de impulso conectada al motor"
echo "✓ Distancia simbólica conectada al motor"
echo "✓ Ocho operadores poéticos funcionales"
echo "✓ Doble núcleo con puentes y colisiones diferenciadas"
echo "✓ Filtros por fuentes y grado de evidencia"
echo "✓ Controles persistentes en localStorage"
echo "✓ Búsqueda real dentro de la membrana"
echo "✓ Exportación CSV con procedencia y evidencia"
echo "✓ Mesa de montaje conectada al campo de escritura"
echo "✓ Paneles musicales heredados retirados de la columna"
echo ""
echo "✅ EMBRIÓN V6.2 ESTÁ INSTALADO"
echo ""
echo "Copia de seguridad:"
echo "$backup_dir"
echo ""
echo "Reinicia Next.js y abre:"
echo "http://localhost:3000/embrion"
echo ""
