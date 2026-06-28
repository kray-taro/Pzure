#!/usr/bin/env bash
# Enforce branch-naming convention for anything targeting `develop`.
#
# Why this exists: an earlier hand-off said "branch from DOCS (docs)", an agent
# created `docs/...` branches, and those collided with the existing `docs`
# branch (a Git ref directory/file collision) - breaking `git pull` and forcing
# MRs to be recreated. Conventions that are only documented drift. This makes
# the convention a machine-checked gate (DDIA: reliability via automation).
#
# Rule: source branches merging into `develop` MUST be `feat/<name>`,
# `fix/<name>` or `phase-<n>/<name>`. These prefixes never equal an existing
# branch, so they are collision-safe.
set -euo pipefail

branch="${1:-}"

if [ -z "$branch" ]; then
  echo "ERROR: no source branch name provided." >&2
  exit 1
fi

if printf '%s' "$branch" | grep -Eq '^(feat|fix|phase-[0-9]+)/[a-z0-9._-]+$'; then
  echo "OK: branch '$branch' matches feat/*, fix/* or phase-<n>/* (target: develop)."
  exit 0
fi

cat >&2 <<EOF
ERROR: branch '$branch' targets 'develop' but does not match the required
       convention.

  Required: feat/<name>, fix/<name> or phase-<n>/<name>   (lowercase, [a-z0-9._-])
  Examples: feat/ui-component-library, fix/token-drift, phase-1/scaffold

  Do NOT prefix with an existing branch name (e.g. 'docs/...'), which causes a
  Git ref directory/file collision.
EOF
exit 1
