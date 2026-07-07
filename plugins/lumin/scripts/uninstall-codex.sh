#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)

TARGET_ROOT=$(pwd)
AUTO_SKILL_ROOT="$TARGET_ROOT/.codex/skills"

if [ -x "$SCRIPT_DIR/remove-instruction-layer.sh" ]; then
  "$SCRIPT_DIR/remove-instruction-layer.sh" "$TARGET_ROOT"
fi

codex plugin remove lumin@lumin-local || true
codex plugin marketplace remove lumin-local || true
rm -rf "$AUTO_SKILL_ROOT"/lumin-*

echo "Uninstalled Lumin for Codex"
echo "  plugin removed:      lumin@lumin-local"
echo "  marketplace removed: lumin-local"
echo "  auto removed:        $AUTO_SKILL_ROOT/lumin-*"
