#!/usr/bin/env bash
# Ban raw hex colour literals everywhere EXCEPT the single allowed primitive
# palette source. This enforces ADR-026 ("semantic tokens only, no raw hex in
# components") as a hard gate instead of an asserted MR checkbox.
#
# DRY: hex lives in exactly one place. SOLID (Dependency Inversion): consumers
# depend on the semantic token abstraction, not on concrete colour values.
set -euo pipefail

# The only files permitted to contain raw hex (the primitive palette + its
# JSON mirror, which uses {ref} aliases but may carry hex in shadows).
ALLOW_REGEX='^(packages/design-tokens/src/colors\.ts|packages/design-tokens/src/tokens\.json|packages/design-tokens/src/shadows\.ts)$'

# Hex colour pattern: #rgb, #rrggbb, #rrggbbaa.
HEX_REGEX='#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?([0-9a-fA-F]{2})?\b'

fail=0

# Scan tracked source files only.
while IFS= read -r f; do
  case "$f" in
    *.ts|*.tsx|*.css|*.scss|*.js|*.jsx|*.vue) ;;
    *) continue ;;
  esac
  if printf '%s' "$f" | grep -Eq "$ALLOW_REGEX"; then
    continue
  fi
  if grep -EnH "$HEX_REGEX" "$f" >/dev/null 2>&1; then
    echo "RAW HEX FOUND in $f:" >&2
    grep -EnH "$HEX_REGEX" "$f" >&2 || true
    fail=1
  fi
done < <(git ls-files)

if [ "$fail" -ne 0 ]; then
  cat >&2 <<EOF

ERROR: raw hex colour literal(s) found outside the allowed palette source.
       Use semantic tokens from @pzure/design-tokens instead
       (e.g. status.danger, finance.unpaid). ADR-026.
EOF
  exit 1
fi

echo "OK: no raw hex outside the primitive palette."
