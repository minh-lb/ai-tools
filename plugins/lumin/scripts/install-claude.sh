#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)

TARGET_ROOT=$(pwd)
if [ "${1:-}" = "--global" ]; then
  TARGET_ROOT=$HOME
elif [ "${1:-}" != "" ]; then
  TARGET_ROOT=$1
fi

SKILL_DEST="$TARGET_ROOT/.lumin/skills"
COMMAND_DEST="$TARGET_ROOT/.claude/commands"
TMP_ROOT=$(mktemp -d "${TMPDIR:-/tmp}/lumin-claude.XXXXXX")
TMP_SKILLS="$TMP_ROOT/skills"
TMP_COMMANDS="$TMP_ROOT/commands"

cleanup() {
  rm -rf "$TMP_ROOT"
}

trap cleanup EXIT INT HUP TERM

mkdir -p "$SKILL_DEST" "$COMMAND_DEST"

"$SCRIPT_DIR/hydrate-agent-skills.sh" "$TMP_SKILLS"
"$SCRIPT_DIR/generate-claude-commands.sh" "$TMP_SKILLS" "$TMP_COMMANDS"

rm -rf "$SKILL_DEST"
mkdir -p "$SKILL_DEST"
cp -R "$TMP_SKILLS/." "$SKILL_DEST/"
cp -R "$TMP_COMMANDS/." "$COMMAND_DEST/"

echo "Installed Lumin for Claude Code"
echo "  skills:   $SKILL_DEST"
echo "  commands: $COMMAND_DEST"
echo
echo "Example:"
echo "  /lumin:bugfix investigate checkout regression"
