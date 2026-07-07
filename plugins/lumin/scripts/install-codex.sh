#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
PLUGIN_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
REPO_ROOT=$(CDPATH= cd -- "$PLUGIN_ROOT/../.." && pwd)
MARKETPLACE_ROOT="$REPO_ROOT"
TARGET_ROOT=$(pwd)
AUTO_SKILL_DEST="$TARGET_ROOT/.codex/skills"
TMP_AUTO_ROOT=$(mktemp -d "${TMPDIR:-/tmp}/lumin-codex.XXXXXX")
TMP_AUTO_SKILLS="$TMP_AUTO_ROOT/skills"

"$SCRIPT_DIR/hydrate-agent-skills.sh" "$PLUGIN_ROOT/skills"
"$SCRIPT_DIR/materialize-host-skills.sh" "$PLUGIN_ROOT/skills" "$TMP_AUTO_SKILLS" "lumin-"
"$SCRIPT_DIR/install-instruction-layer.sh" "$TARGET_ROOT"

cleanup() {
  rm -rf "$PLUGIN_ROOT/skills" "$PLUGIN_ROOT/commands" "$TMP_AUTO_ROOT"
}

trap cleanup EXIT INT HUP TERM

mkdir -p "$AUTO_SKILL_DEST"
rm -rf "$AUTO_SKILL_DEST"/lumin-*
cp -R "$TMP_AUTO_SKILLS/." "$AUTO_SKILL_DEST/"

codex plugin marketplace add "$MARKETPLACE_ROOT"
codex plugin add lumin@lumin-local

echo "Installed Lumin for Codex"
echo "  auto skills: $AUTO_SKILL_DEST/lumin-*"
echo "  marketplace: $MARKETPLACE_ROOT"
echo "  plugin:      lumin@lumin-local"
echo
echo "Open a new thread, then try:"
echo "  Use \$lumin:bugfix to investigate this defect."
