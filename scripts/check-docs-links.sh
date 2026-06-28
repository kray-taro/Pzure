#!/usr/bin/env bash
# DOCS internal link-check (#56).
#
# Verifies that relative markdown links inside DOCS/ point at a file that
# actually exists in the repo. External (http/https), anchor-only (#...) and
# mailto links are out of scope here. DDIA maintainability: broken internal
# references are caught at merge time, not by readers.
set -euo pipefail

fail=0

while IFS= read -r f; do
  while IFS= read -r target; do
    # Strip any anchor fragment.
    path="${target%%#*}"
    # Skip empty (pure anchor), external, and mailto links.
    case "$path" in
      ''|http://*|https://*|mailto:*) continue ;;
    esac
    dir="$(dirname "$f")"
    if [ -e "$dir/$path" ] || [ -e "$path" ]; then
      :
    else
      echo "ERROR: broken internal link in $f -> $target" >&2
      fail=1
    fi
  done < <(grep -oE '\]\([^)]+\)' "$f" | sed -E 's/^\]\(([^)]+)\)$/\1/')
done < <(find DOCS -name '*.md')

if [ "$fail" -ne 0 ]; then
  echo "" >&2
  echo "Link-check FAILED: fix the broken internal links above." >&2
  exit 1
fi

echo "Link-check PASSED: all internal DOCS links resolve."
