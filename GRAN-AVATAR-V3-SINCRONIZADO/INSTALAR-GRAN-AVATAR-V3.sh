#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TARGET="${1:-$HOME/poema-universal}"
node "$SCRIPT_DIR/install.mjs" "$TARGET"
