#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
PLUGIN_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
REPO_ROOT=$(CDPATH= cd -- "$PLUGIN_ROOT/../.." && pwd)
MARKETPLACE_ROOT="$REPO_ROOT"

"$SCRIPT_DIR/hydrate-agent-skills.sh" "$PLUGIN_ROOT/skills"

cleanup() {
  rm -rf "$PLUGIN_ROOT/skills" "$PLUGIN_ROOT/commands"
}

trap cleanup EXIT INT HUP TERM

codex plugin marketplace add "$MARKETPLACE_ROOT"
codex plugin add lumin@lumin-local

echo "Installed Lumin for Codex"
echo "  marketplace: $MARKETPLACE_ROOT"
echo "  plugin:      lumin@lumin-local"
echo
echo "Open a new thread, then try:"
echo "  Use \$lumin:bugfix to investigate this defect."
