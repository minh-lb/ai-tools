#!/bin/sh
set -eu

TARGET_ROOT=$(pwd)
if [ "${1:-}" = "--global" ]; then
  TARGET_ROOT=$HOME
elif [ "${1:-}" != "" ]; then
  TARGET_ROOT=$1
fi

SKILL_ROOT="$TARGET_ROOT/.lumin"
COMMAND_ROOT="$TARGET_ROOT/.claude/commands"
AUTO_SKILL_ROOT="$TARGET_ROOT/.agents/skills"

rm -rf "$SKILL_ROOT"
rm -f "$COMMAND_ROOT"/lumin:*.md
rm -rf "$AUTO_SKILL_ROOT"/lumin-*

if [ -x "$(dirname "$0")/remove-instruction-layer.sh" ]; then
  "$(dirname "$0")/remove-instruction-layer.sh" "$TARGET_ROOT"
fi

echo "Uninstalled Lumin for Claude Code"
echo "  skills removed:   $SKILL_ROOT"
echo "  auto removed:     $AUTO_SKILL_ROOT/lumin-*"
echo "  commands removed: $COMMAND_ROOT/lumin:*.md"
