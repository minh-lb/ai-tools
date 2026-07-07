#!/bin/sh
set -eu

codex plugin remove lumin@lumin-local
codex plugin marketplace remove lumin-local

echo "Uninstalled Lumin for Codex"
echo "  marketplace removed: lumin-local"
echo "  plugin removed:      lumin@lumin-local"
