#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
PLUGIN_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
REPO_ROOT=$(CDPATH= cd -- "$PLUGIN_ROOT/../.." && pwd)
SKILL_LIST="$SCRIPT_DIR/skill-list.txt"
DEST_DIR=${1:?destination directory is required}

resolve_ref() {
  if git -C "$REPO_ROOT" rev-parse --verify agent-skills >/dev/null 2>&1; then
    printf '%s\n' "agent-skills"
    return
  fi

  if git -C "$REPO_ROOT" rev-parse --verify refs/remotes/origin/agent-skills >/dev/null 2>&1; then
    printf '%s\n' "origin/agent-skills"
    return
  fi

  echo "Could not resolve branch ref 'agent-skills'. Fetch that branch first." >&2
  exit 1
}

REF=$(resolve_ref)

rm -rf "$DEST_DIR"
mkdir -p "$DEST_DIR"

set --
while IFS= read -r skill_name; do
  if [ -n "$skill_name" ]; then
    set -- "$@" "$skill_name"
  fi
done < "$SKILL_LIST"

git -C "$REPO_ROOT" archive "$REF" "$@" | tar -x -C "$DEST_DIR"
