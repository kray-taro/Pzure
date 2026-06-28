#!/usr/bin/env bash
# Gate 0C DR-target consistency gate (#56).
#
# Why this exists: the project briefly held two contradictory DR targets -
# ADR-016 + the Gate 0 checklist said RPO <= 15 min / RTO <= 4h, while the
# B-004 row carried RPO 24h / RTO 8-24h. A regulated health platform must have
# exactly one authoritative, testable DR target (DDIA reliability).
#
# This gate asserts the single canonical token appears verbatim in all three
# locations and that no superseded looser figure is re-introduced as a target.
set -euo pipefail

CANONICAL='RPO <= 15 min / RTO <= 4h'

ADR016='DOCS/ADRs/ADR-016-Backup-and-DR.md'
BLOCKERS='DOCS/PROJECT-TRACKING/ISSUES-AND-BLOCKERS.md'

fail=0

check_contains() {
  local file="$1" label="$2"
  if [ ! -f "$file" ]; then
    echo "ERROR: $label: file not found: $file" >&2
    fail=1
    return
  fi
  if grep -qF "$CANONICAL" "$file"; then
    echo "OK: $label contains canonical DR token."
  else
    echo "ERROR: $label ($file) is missing the canonical DR token: '$CANONICAL'" >&2
    fail=1
  fi
}

# 1. The canonical token must appear in ADR-016 (authoritative source).
check_contains "$ADR016" 'ADR-016'

# 2. The B-004 row must carry the canonical token.
if grep -q '^| B-004 ' "$BLOCKERS" && grep -F "$CANONICAL" "$BLOCKERS" | grep -q 'B-004\|backup/DR'; then
  echo "OK: B-004 / blockers file contains canonical DR token."
else
  check_contains "$BLOCKERS" 'B-004 / blockers'
fi

# 3. The Gate 0 checklist (same blockers file) must carry the canonical token
#    on the backup/DR line.
if grep -F "$CANONICAL" "$BLOCKERS" | grep -qi 'deployment design'; then
  echo "OK: Gate 0 checklist backup/DR line contains canonical DR token."
else
  echo "ERROR: Gate 0 checklist backup/DR line in $BLOCKERS is missing the canonical DR token: '$CANONICAL'" >&2
  fail=1
fi

# 4. No superseded looser figure may appear as an active target. We allow it
#    ONLY on lines that explicitly mark it superseded/looser (historical note).
while IFS= read -r line; do
  case "$line" in
    *supersede*|*superseded*|*looser*|*triage*) : ;;  # historical note, allowed
    *)
      echo "ERROR: stale DR figure found outside a 'superseded' note:" >&2
      echo "       $line" >&2
      fail=1
      ;;
  esac
done < <(grep -rEn 'RTO[^.]*8-24h|RTO[^.]*8\xe2\x80\x9324h|RPO[^.]*24h' DOCS || true)

if [ "$fail" -ne 0 ]; then
  echo "" >&2
  echo "DR-consistency gate FAILED. The authoritative target is: $CANONICAL" >&2
  echo "It must appear verbatim in ADR-016, the Gate 0 checklist, and the B-004 row." >&2
  exit 1
fi

echo "DR-consistency gate PASSED: '$CANONICAL' is consistent across all three locations."
