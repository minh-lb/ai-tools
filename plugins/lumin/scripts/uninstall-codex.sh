#!/bin/sh
set -eu

TARGET_ROOT=$(pwd)
AUTO_SKILL_ROOT="$TARGET_ROOT/.codex/skills"

codex plugin remove lumin@lumin-local
codex plugin marketplace remove lumin-local
rm -rf "$AUTO_SKILL_ROOT"/lumin-*

if [ -x "$(dirname "$0")/remove-instruction-layer.sh" ]; then
  "$(dirname "$0")/remove-instruction-layer.sh" "$TARGET_ROOT"
fi

echo "Uninstalled Lumin for Codex"
echo "  marketplace removed: lumin-local"
echo "  plugin removed:      lumin@lumin-local"
echo "  auto removed:        $AUTO_SKILL_ROOT/lumin-*"
