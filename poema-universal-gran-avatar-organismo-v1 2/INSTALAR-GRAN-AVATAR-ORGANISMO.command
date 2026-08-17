#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
bash "$SCRIPT_DIR/INSTALAR-GRAN-AVATAR-ORGANISMO.sh" "$HOME/poema-universal"

echo "Pulsa Intro para cerrar."
read -r
