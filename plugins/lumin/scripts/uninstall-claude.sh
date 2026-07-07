#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)

TARGET_ROOT=$(pwd)
if [ "${1:-}" = "--global" ]; then
  TARGET_ROOT=$HOME
elif [ "${1:-}" != "" ]; then
  TARGET_ROOT=$1
fi

SKILL_ROOT="$TARGET_ROOT/.lumin"
COMMAND_ROOT="$TARGET_ROOT/.claude/commands"
AUTO_SKILL_ROOT="$TARGET_ROOT/.agents/skills"

if [ -x "$SCRIPT_DIR/remove-instruction-layer.sh" ]; then
  "$SCRIPT_DIR/remove-instruction-layer.sh" "$TARGET_ROOT"
fi

rm -rf "$SKILL_ROOT"
rm -f "$COMMAND_ROOT"/lumin:*.md
rm -rf "$AUTO_SKILL_ROOT"/lumin-*

echo "Uninstalled Lumin for Claude Code"
echo "  skills removed:   $SKILL_ROOT"
echo "  auto removed:     $AUTO_SKILL_ROOT/lumin-*"
echo "  commands removed: $COMMAND_ROOT/lumin:*.md"
