#!/usr/bin/env bash
# DOCS hygiene guard - keeps the documentation source of truth DRY and clean.
#
# Why: the ADRs folder once carried two files per number (ADR-018, ADR-026),
# and binary/extensionless files drifted from the rendered docs. These are the
# same drift failures we are eliminating elsewhere. This script makes the
# invariants machine-checked (DDIA: reliability via automation, maintainability
# via one obvious failure cause) instead of relying on review discipline.
#
# Runtime deps (kept in sync with .gitlab-ci.yml): bash, git, grep, sed, coreutils.
set -euo pipefail

fail=0

# 1) Exactly one file per ADR number. Extract the ADR id from each filename and
#    assert uniqueness. The id is `ADR-<digits>` or `ADR-COMMS-<digits>`; the
#    capture is anchored to the numeric token so different titles for the same
#    number collapse to one id (this is the duplicate we must catch).
echo '== ADR uniqueness =='
ids=$(git ls-files -- 'DOCS/ADRs/ADR-*.md' \
  | sed -E 's#.*/(ADR-(COMMS-)?[0-9]+).*#\1#' \
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

# 2) No binary archives committed under DOCS. `git ls-files -- DOCS` lists every
#    tracked path under DOCS recursively (git pathspec, not shell glob).
echo '== no archives in DOCS =='
if git ls-files -- DOCS | grep -Ei '\.(zip|tar|tar\.gz|tgz|rar|7z)$'; then
  echo 'ERROR: archive file committed under DOCS. Remove it.' >&2
  fail=1
else
  echo 'OK: no archives under DOCS.'
fi

# 3) Every Module_/ADR doc must carry a .md extension so it renders and is
#    link-checkable. Assert the positive: anything under DOCS/Modules or
#    DOCS/ADRs that is not *.md fails (PROJECT-TRACKING scripts live elsewhere
#    and are not covered here).
echo '== markdown extensions =='
fail3=0
while IFS= read -r f; do
  case "$f" in
    *.md) ;;            # OK: renders as markdown
    *)
      echo "ERROR: $f is missing a .md extension." >&2
      fail3=1
      fail=1
      ;;
  esac
done < <(git ls-files -- 'DOCS/Modules' 'DOCS/ADRs')
[ "$fail3" -eq 0 ] && echo 'OK: docs extensions clean.'

exit "$fail"
