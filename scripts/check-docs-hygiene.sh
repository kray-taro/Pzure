#!/usr/bin/env bash
# DOCS hygiene guard - keeps the documentation source of truth DRY and clean.
#
# Why: the ADRs folder once carried two files per number (ADR-018, ADR-026),
# and binary/extensionless files drifted from the rendered docs. These are the
# same drift failures we are eliminating elsewhere. This script makes the
# invariants machine-checked (DDIA: reliability via automation, maintainability
# via one obvious failure cause) instead of relying on review discipline.
set -euo pipefail

fail=0

# 1) Exactly one file per ADR number. Extract the ADR id from each filename and
#    assert uniqueness.
echo '== ADR uniqueness =='
ids=$(git ls-files 'DOCS/ADRs/ADR-*.md' \
  | sed -E 's#.*/(ADR-[A-Z0-9-]*[0-9]+).*#\1#' \
  | sort)
dupes=$(printf '%s\n' "$ids" | uniq -d || true)
if [ -n "$dupes" ]; then
  echo "ERROR: duplicate ADR number(s):" >&2
  printf '%s\n' "$dupes" >&2
  echo 'Each ADR number must map to exactly one file.' >&2
  fail=1
else
  echo 'OK: one file per ADR number.'
fi

# 2) No binary archives committed under DOCS.
echo '== no archives in DOCS =='
if git ls-files 'DOCS/**' | grep -Ei '\.(zip|tar|tar\.gz|tgz|rar|7z)$'; then
  echo 'ERROR: archive file committed under DOCS. Remove it.' >&2
  fail=1
else
  echo 'OK: no archives under DOCS.'
fi

# 3) Every Module_/ADR doc carries a .md extension so it renders and is
#    link-checkable. Allow .branch-note.md and shell scripts.
echo '== markdown extensions =='
while IFS= read -r f; do
  case "$f" in
    DOCS/PROJECT-TRACKING/*.sh) continue ;;
    *.md) continue ;;
  esac
  # Anything else living under DOCS/Modules or DOCS/ADRs must be .md
  case "$f" in
    DOCS/Modules/*|DOCS/ADRs/*)
      echo "ERROR: $f is missing a .md extension." >&2
      fail=1
      ;;
  esac
done < <(git ls-files 'DOCS/Modules/*' 'DOCS/ADRs/*')
if [ "$fail" -eq 0 ]; then echo 'OK: docs extensions clean.'; fi

exit "$fail"
