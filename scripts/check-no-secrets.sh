#!/usr/bin/env bash
# Minimal secret-detection gate (DDIA reliability + security baseline, gates
# the hardening lane #40). A full SAST/secret-scanning template should replace
# this once the security gate (#55) is ratified; this keeps the invariant
# enforced from day one rather than asserted.
set -euo pipefail

PATTERNS=(
  'AKIA[0-9A-Z]{16}'                       # AWS access key id
  '-----BEGIN ([A-Z]+ )?PRIVATE KEY-----'  # private keys
  'xox[baprs]-[0-9A-Za-z-]{10,}'           # slack tokens
  'glpat-[0-9A-Za-z_-]{20,}'               # gitlab PATs
  'eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}' # JWT-ish
)

fail=0
for pat in "${PATTERNS[@]}"; do
  if git ls-files -z | xargs -0 grep -EnH "$pat" 2>/dev/null; then
    echo "POSSIBLE SECRET matching /$pat/ above." >&2
    fail=1
  fi
done

if [ "$fail" -ne 0 ]; then
  echo "ERROR: possible secret(s) committed. Remove and rotate." >&2
  exit 1
fi

echo "OK: no obvious secrets detected."
