#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
PLUGIN_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
REPO_ROOT=$(CDPATH= cd -- "$PLUGIN_ROOT/../.." && pwd)
TARGET_ROOT=$(pwd)
AUTO_SKILL_DEST="$TARGET_ROOT/.codex/skills"
TMP_ROOT=$(mktemp -d "${TMPDIR:-/tmp}/lumin-codex.XXXXXX")
TMP_SKILLS="$TMP_ROOT/skills"
TMP_AUTO_SKILLS="$TMP_ROOT/auto-skills"

cleanup() {
  rm -rf "$TMP_ROOT"
}

trap cleanup EXIT INT HUP TERM

"$SCRIPT_DIR/hydrate-agent-skills.sh" "$TMP_SKILLS"
"$SCRIPT_DIR/materialize-host-skills.sh" "$TMP_SKILLS" "$TMP_AUTO_SKILLS" "lumin-"

mkdir -p "$AUTO_SKILL_DEST"
rm -rf "$AUTO_SKILL_DEST"/lumin-*
cp -R "$TMP_AUTO_SKILLS/." "$AUTO_SKILL_DEST/"

codex plugin marketplace add "$REPO_ROOT"
codex plugin add lumin@lumin-local

"$SCRIPT_DIR/install-instruction-layer.sh" "$TARGET_ROOT"

echo "Installed Lumin for Codex"
echo "  auto skills: $AUTO_SKILL_DEST/lumin-*"
echo "  marketplace: $REPO_ROOT"
echo "  plugin:      lumin@lumin-local"
echo
echo "Open a new thread, then try:"
echo "  Use \$lumin:bugfix to investigate this defect."
