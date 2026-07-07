#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
PLUGIN_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)

"$SCRIPT_DIR/hydrate-agent-skills.sh" "$PLUGIN_ROOT/skills"
"$SCRIPT_DIR/generate-claude-commands.sh" "$PLUGIN_ROOT/skills" "$PLUGIN_ROOT/commands"

echo "Synced Lumin skills from branch agent-skills"
