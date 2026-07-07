#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
PLUGIN_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
REPO_ROOT=$(CDPATH= cd -- "$PLUGIN_ROOT/../.." && pwd)
SKILL_LIST="$SCRIPT_DIR/skill-list.txt"
DEST_DIR=${1:?destination directory is required}
REMOTE_REPO_OWNER=minhluudev
REMOTE_REPO_NAME=ai-tools
REMOTE_BRANCH=agent-skills

resolve_ref() {
  if ! command -v git >/dev/null 2>&1; then
    return 1
  fi

  if [ ! -d "$REPO_ROOT/.git" ]; then
    return 1
  fi

  if git -C "$REPO_ROOT" rev-parse --verify agent-skills >/dev/null 2>&1; then
    printf '%s\n' "agent-skills"
    return
  fi

  if git -C "$REPO_ROOT" rev-parse --verify refs/remotes/origin/agent-skills >/dev/null 2>&1; then
    printf '%s\n' "origin/agent-skills"
    return
  fi

  return 1
}

rm -rf "$DEST_DIR"
mkdir -p "$DEST_DIR"

set --
while IFS= read -r skill_name || [ -n "$skill_name" ]; do
  if [ -n "$skill_name" ]; then
    set -- "$@" "$skill_name"
  fi
done < "$SKILL_LIST"

extract_from_git_ref() {
  ref=$1
  shift
  git -C "$REPO_ROOT" archive "$ref" "$@" | tar -x -C "$DEST_DIR"
  found=$(find "$DEST_DIR" -mindepth 1 -maxdepth 1 | wc -l | tr -d ' ')
  if [ "$found" -eq 0 ]; then
    echo "ERROR: git archive produced no files for ref=$ref paths=$*" >&2
    exit 1
  fi
}

extract_from_remote_tarball() {
  tmp_root=$(mktemp -d "${TMPDIR:-/tmp}/lumin-agent-skills.XXXXXX")
  tarball="$tmp_root/agent-skills.tar.gz"
  unpack_dir="$tmp_root/unpacked"
  trap 'rm -rf "$tmp_root"' EXIT INT HUP TERM

  curl -fsSL --max-time 60 \
    "https://codeload.github.com/$REMOTE_REPO_OWNER/$REMOTE_REPO_NAME/tar.gz/refs/heads/$REMOTE_BRANCH" \
    -o "$tarball"

  mkdir -p "$unpack_dir"
  tar -xzf "$tarball" -C "$unpack_dir"

  extracted_root="$unpack_dir/$REMOTE_REPO_NAME-$REMOTE_BRANCH"
  for skill_name in "$@"; do
    cp -R "$extracted_root/$skill_name" "$DEST_DIR/"
  done

  rm -rf "$tmp_root"
  trap - EXIT INT HUP TERM
}

if REF=$(resolve_ref); then
  extract_from_git_ref "$REF" "$@"
else
  extract_from_remote_tarball "$@"
fi
