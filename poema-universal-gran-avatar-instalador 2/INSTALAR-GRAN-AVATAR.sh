#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="${1:-$HOME/poema-universal}"

if ! command -v node >/dev/null 2>&1; then
  echo "❌ No se encontró Node.js."
  exit 1
fi

node "$SCRIPT_DIR/install.mjs" "$TARGET_DIR"
