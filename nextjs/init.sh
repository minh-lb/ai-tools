#!/usr/bin/env bash
# init.sh — Link .agents/skills into .claude and .codex

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_SRC="$SCRIPT_DIR/.agents/skills"

link_skills() {
  local target_dir="$1"
  local link="$target_dir/skills"

  mkdir -p "$target_dir"

  if [ -L "$link" ]; then
    echo "  already linked: $link"
  elif [ -e "$link" ]; then
    echo "  skipped (exists, not a symlink): $link"
  else
    ln -s "$SKILLS_SRC" "$link"
    echo "  created: $link -> $SKILLS_SRC"
  fi
}

if [ ! -d "$SKILLS_SRC" ]; then
  echo "ERROR: Skills source not found at $SKILLS_SRC"
  exit 1
fi

echo "Linking skills..."
link_skills "$SCRIPT_DIR/.claude"
link_skills "$SCRIPT_DIR/.codex"
echo "Done."
