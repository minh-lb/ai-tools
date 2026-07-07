#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
PLUGIN_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
SKILLS_DIR=${1:-"$PLUGIN_ROOT/skills"}
COMMANDS_DIR=${2:-"$PLUGIN_ROOT/commands"}

mkdir -p "$COMMANDS_DIR"

find "$COMMANDS_DIR" -maxdepth 1 -type f -name 'lumin:*.md' -delete

for skill_dir in "$SKILLS_DIR"/*; do
  if [ ! -d "$skill_dir" ]; then
    continue
  fi

  skill_name=$(basename "$skill_dir")
  command_path="$COMMANDS_DIR/lumin:$skill_name.md"
  description=$(awk '
    /^description:/ {
      sub(/^description:[[:space:]]*/, "", $0)
      gsub(/^"/, "", $0)
      gsub(/"$/, "", $0)
      print
      exit
    }
  ' "$skill_dir/SKILL.md")

  cat > "$command_path" <<EOF
# Lumin Command Prompt: /lumin:$skill_name

Use this prompt to run the Lumin \`$skill_name\` workflow.


# /lumin:$skill_name

$description

## Usage

\`\`\`
/lumin:$skill_name \$ARGUMENTS
\`\`\`

## What It Does

1. Read \`../../.lumin/skills/$skill_name/SKILL.md\`.
2. If that skill references sibling files under \`../../.lumin/skills/$skill_name/\`, read them before acting.
3. Execute the skill against \`\$ARGUMENTS\`.
4. Treat this slash command as the Claude Code entrypoint equivalent of the Codex skill \`\$lumin:$skill_name\`.

If \`\$ARGUMENTS\` is empty and the underlying skill needs input, ask the user one targeted question before proceeding.
EOF
done
