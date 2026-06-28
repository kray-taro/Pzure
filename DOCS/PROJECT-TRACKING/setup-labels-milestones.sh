#!/usr/bin/env bash
# Creates Pzure per-module labels and Sprint 0-37 milestones via the GitLab CLI (glab).
# Prereq: `glab auth login` and run from anywhere; PROJECT is the full path.
# Usage: bash setup-labels-milestones.sh
set -euo pipefail

PROJECT="cricketaustin-group/Pzure"

# --- Per-module scoped labels ---------------------------------------------
declare -A MODULE_LABELS=(
  ["module::foundation"]="#6699cc"
  ["module::organisation"]="#5843AD"
  ["module::pos"]="#1F75CB"
  ["module::pharmacy"]="#108548"
  ["module::inventory"]="#C17D10"
  ["module::emr"]="#AE1800"
  ["module::lab"]="#D1208B"
  ["module::claims"]="#9400D3"
  ["module::reporting"]="#666666"
  ["module::communication"]="#00B140"
  ["module::frontend"]="#FC9403"
)

# --- Workflow / type labels -----------------------------------------------
declare -A OTHER_LABELS=(
  ["type::blocker"]="#DD2B0E"
  ["type::epic-umbrella"]="#6699cc"
  ["workflow::todo"]="#ED9121"
  ["workflow::in-progress"]="#1F75CB"
  ["workflow::blocked"]="#DD2B0E"
  ["workflow::done"]="#108548"
)

echo "Creating labels..."
for name in "${!MODULE_LABELS[@]}"; do
  glab label create --repo "$PROJECT" --name "$name" --color "${MODULE_LABELS[$name]}" --description "Pzure module" || echo "  (exists?) $name"
done
for name in "${!OTHER_LABELS[@]}"; do
  glab label create --repo "$PROJECT" --name "$name" --color "${OTHER_LABELS[$name]}" --description "Pzure workflow/type" || echo "  (exists?) $name"
done

# --- Milestones -----------------------------------------------------------
# NOTE: milestone creation now lives in create-milestones.sh, which surfaces
# real API errors and also creates the Sprint 0A/0B/0C architecture-gate
# milestones. The inline loop below was swallowing errors (2>&1 ... ||),
# which is why milestones appeared missing. Prefer the dedicated script:
#
#   bash create-milestones.sh
#
echo "Skipping inline milestone creation. Run: bash create-milestones.sh"

echo "Done. Next:"
echo "  1) bash create-milestones.sh      # creates Sprint 0,0A,0B,0C,1..37"
echo "  2) bash apply-board-structure.sh  # applies labels+milestones+parents to issues"
