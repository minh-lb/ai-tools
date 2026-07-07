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
AUTO_SKILL_DEST="$TARGET_ROOT/.agents/skills"
TMP_ROOT=$(mktemp -d "${TMPDIR:-/tmp}/lumin-claude.XXXXXX")
TMP_SKILLS="$TMP_ROOT/skills"
TMP_COMMANDS="$TMP_ROOT/commands"
TMP_AUTO_SKILLS="$TMP_ROOT/auto-skills"

cleanup() {
  rm -rf "$TMP_ROOT"
}

trap cleanup EXIT INT HUP TERM

mkdir -p "$SKILL_DEST" "$COMMAND_DEST"
mkdir -p "$AUTO_SKILL_DEST"

"$SCRIPT_DIR/hydrate-agent-skills.sh" "$TMP_SKILLS"
"$SCRIPT_DIR/materialize-host-skills.sh" "$TMP_SKILLS" "$TMP_AUTO_SKILLS" "lumin-"
"$SCRIPT_DIR/generate-claude-commands.sh" "$TMP_SKILLS" "$TMP_COMMANDS" "../../.agents/skills/lumin-"
"$SCRIPT_DIR/install-instruction-layer.sh" "$TARGET_ROOT"

rm -rf "$SKILL_DEST"
mkdir -p "$SKILL_DEST"
cp -R "$TMP_SKILLS/." "$SKILL_DEST/"
cp -R "$TMP_COMMANDS/." "$COMMAND_DEST/"
rm -rf "$AUTO_SKILL_DEST"/lumin-*
cp -R "$TMP_AUTO_SKILLS/." "$AUTO_SKILL_DEST/"

echo "Installed Lumin for Claude Code"
echo "  skills:   $SKILL_DEST"
echo "  auto:     $AUTO_SKILL_DEST/lumin-*"
echo "  commands: $COMMAND_DEST"
echo
echo "Example:"
echo "  /lumin:bugfix investigate checkout regression"
