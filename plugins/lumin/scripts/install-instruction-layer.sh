#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
PLUGIN_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
TARGET_ROOT=${1:?target root is required}
LUMIN_DIR="$TARGET_ROOT/.lumin"
AGENTS_TARGET="$LUMIN_DIR/AGENTS.lumin.md"
ROOT_AGENTS="$TARGET_ROOT/AGENTS.md"
INCLUDE_LINE="@./.lumin/AGENTS.lumin.md"

mkdir -p "$LUMIN_DIR"
cp "$PLUGIN_ROOT/templates/AGENTS.lumin.md" "$AGENTS_TARGET"

if [ -f "$ROOT_AGENTS" ]; then
  if ! grep -Fqx "$INCLUDE_LINE" "$ROOT_AGENTS"; then
    printf '\n%s\n' "$INCLUDE_LINE" >> "$ROOT_AGENTS"
  fi
else
  printf '%s\n' "$INCLUDE_LINE" > "$ROOT_AGENTS"
fi
