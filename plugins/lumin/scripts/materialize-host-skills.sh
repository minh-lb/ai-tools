#!/bin/sh
set -eu

SOURCE_DIR=${1:?source skills directory is required}
DEST_DIR=${2:?destination skills directory is required}
PREFIX=${3:-lumin-}

rm -rf "$DEST_DIR"
mkdir -p "$DEST_DIR"

for skill_dir in "$SOURCE_DIR"/*; do
  if [ ! -d "$skill_dir" ]; then
    continue
  fi

  skill_name=$(basename "$skill_dir")
  target_dir="$DEST_DIR/$PREFIX$skill_name"
  mkdir -p "$target_dir"
  cp -R "$skill_dir/." "$target_dir/"

  if [ -f "$target_dir/SKILL.md" ]; then
    tmp_file=$(mktemp "${TMPDIR:-/tmp}/lumin-skill.XXXXXX")
    trap 'rm -f "$tmp_file"' EXIT
    awk -v new_name="$PREFIX$skill_name" '
      BEGIN { replaced = 0 }
      /^name:[[:space:]]/ && replaced == 0 {
        print "name: " new_name
        replaced = 1
        next
      }
      { print }
    ' "$target_dir/SKILL.md" > "$tmp_file"
    mv "$tmp_file" "$target_dir/SKILL.md"
    trap - EXIT
  fi
done
