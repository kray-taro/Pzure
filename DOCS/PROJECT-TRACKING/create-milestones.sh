#!/usr/bin/env bash
# Creates Pzure sprint milestones and PRINTS real API errors (the previous
# setup script swallowed them, which is why milestones were missing).
#
# Creates: Sprint 0, Sprint 0A, Sprint 0B, Sprint 0C, Sprint 1 .. Sprint 37.
#
# Prereq: glab auth login (gitlab.com) + jq. Safe to re-run (skips existing).
# Usage: bash create-milestones.sh
set -euo pipefail

PROJECT="cricketaustin-group/Pzure"
ENC_PROJECT=$(printf '%s' "$PROJECT" | sed 's#/#%2F#')

command -v glab >/dev/null || { echo "glab not found"; exit 1; }
command -v jq   >/dev/null || { echo "jq not found";   exit 1; }

# Existing milestone titles (so we can skip them).
mapfile -t EXISTING < <(glab api --paginate "projects/$ENC_PROJECT/milestones?per_page=100" \
                        | jq -r '.[].title')

exists() { local t="$1"; for e in "${EXISTING[@]:-}"; do [ "$e" = "$t" ] && return 0; done; return 1; }

create_milestone() { # $1=title
  local title="$1"
  if exists "$title"; then echo "  skip (exists): $title"; return; fi
  # No 2>/dev/null here: we WANT to see the error if it fails.
  if out=$(glab api --method POST "projects/$ENC_PROJECT/milestones" \
             -f "title=$title" \
             -f "description=Pzure sprint milestone (see DOCS/PROJECT-TRACKING/ROADMAP.md)" 2>&1); then
    echo "  created: $title"
  else
    echo "  FAILED:  $title"
    echo "    -> $out"
  fi
}

echo "Creating milestones on $PROJECT ..."

# Phase 0 + architecture gate milestones
for t in "Sprint 0" "Sprint 0A" "Sprint 0B" "Sprint 0C"; do
  create_milestone "$t"
done

# Sprint 1 .. 37
for i in $(seq 1 37); do
  create_milestone "Sprint $i"
done

echo
echo "Verifying..."
glab api --paginate "projects/$ENC_PROJECT/milestones?per_page=100" \
  | jq -r '.[] | "  \(.id)\t\(.title)"' | sort -k2

echo
echo "If any FAILED above, the most common causes are:"
echo "  - glab not authenticated to gitlab.com (run: glab auth status)"
echo "  - insufficient role on the project (need Reporter+ to manage milestones)"
echo "  - wrong project path in PROJECT variable"
echo "Once all milestones exist, run: bash apply-board-structure.sh"
