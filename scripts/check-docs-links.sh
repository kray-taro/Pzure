#!/usr/bin/env bash
# DOCS internal link-check (#56).
#
# Verifies that relative markdown links inside DOCS/ point at a file that
# actually exists in the repo. External (http/https), anchor-only (#...) and
# mailto links are out of scope here. DDIA maintainability: broken internal
# references are caught at merge time, not by readers.
set -euo pipefail

fail=0

# Find markdown links of the form [text](target) inside DOCS/.
while IFS= read -r hit; do
  file="${hit%%:*}"
  target="${hit#*:}"

  # Strip any anchor fragment.
  path="${target%%#*}"

  # Skip empty (pure anchor), external, and mailto links.
  case "$path" in
    ''|http://*|https://*|mailto:*) continue ;;
  esac

  # Resolve relative to the linking file's directory.
  dir="$(dirname "$file")"
  resolved="$dir/$path"

  if [ -e "$resolved" ] || [ -e "$path" ]; then
    :
  else
    echo "ERROR: broken internal link in $file -> $target" >&2
    fail=1
  fi
done < <(grep -rhoE '\]\([^)]+\)' DOCS --include='*.md' \
           | sed -E 's/^\]\(([^)]+)\)$/\1/' \
           | grep -nE '.*' \
           | while IFS= read -r l; do echo "$l"; done; true)

# The above pipeline loses the filename; do a more precise pass instead.
fail=0
while IFS= read -r f; do
  while IFS= read -r target; do
    path="${target%%#*}"
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
