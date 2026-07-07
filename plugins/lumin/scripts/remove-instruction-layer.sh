#!/bin/sh
set -eu

TARGET_ROOT=${1:?target root is required}
ROOT_AGENTS="$TARGET_ROOT/AGENTS.md"
LUMIN_DIR="$TARGET_ROOT/.lumin"
LUMIN_AGENTS="$LUMIN_DIR/AGENTS.lumin.md"
INCLUDE_LINE="@./.lumin/AGENTS.lumin.md"

if [ -f "$ROOT_AGENTS" ]; then
  tmp_file=$(mktemp "${TMPDIR:-/tmp}/lumin-agents.XXXXXX")
  trap 'rm -f "$tmp_file"' EXIT
  grep -Fvx "$INCLUDE_LINE" "$ROOT_AGENTS" > "$tmp_file" || true
  mv "$tmp_file" "$ROOT_AGENTS"
  trap - EXIT
fi

rm -f "$LUMIN_AGENTS"
rmdir "$LUMIN_DIR" 2>/dev/null || true
