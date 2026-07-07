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

rm -rf "$SKILL_ROOT"
rm -f "$COMMAND_ROOT"/lumin:*.md

echo "Uninstalled Lumin for Claude Code"
echo "  skills removed:   $SKILL_ROOT"
echo "  commands removed: $COMMAND_ROOT/lumin:*.md"
