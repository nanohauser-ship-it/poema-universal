#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
bash "$SCRIPT_DIR/INSTALAR-GRAN-AVATAR-VIVO.sh" "$HOME/poema-universal"

echo ""
read -r -p "Pulsa Intro para cerrar…" _
