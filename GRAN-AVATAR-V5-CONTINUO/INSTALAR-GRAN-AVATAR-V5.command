#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
bash "$SCRIPT_DIR/INSTALAR-GRAN-AVATAR-V5.sh" "$HOME/poema-universal"
read -n 1 -s -r -p "Pulsa una tecla para cerrar..."
