#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
bash "$SCRIPT_DIR/INSTALAR-GRAN-AVATAR.sh" "$HOME/poema-universal"

echo ""
read -r -p "Pulsa Enter para cerrar esta ventana…" _
