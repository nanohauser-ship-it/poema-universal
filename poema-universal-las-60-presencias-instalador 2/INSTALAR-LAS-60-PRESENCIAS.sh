#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="${1:-${POEMA_UNIVERSAL_DIR:-$HOME/poema-universal}}"

if ! command -v node >/dev/null 2>&1; then
  echo "No se encontró Node.js. Instálalo o abre una terminal donde el comando node esté disponible."
  exit 1
fi

node "$SCRIPT_DIR/install.mjs" "$TARGET_DIR"
